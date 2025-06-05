import { Command, Flags } from '@oclif/core';
import * as fs from 'fs';
import * as path from 'path';
import { DocManager } from '../../lib/utils/doc/doc-manager';
import { Collection, SnapshotMetadata, SnapshotSummary } from '../../lib/utils/doc/types';

export default class List extends Command {
  static description = 'List documentation snapshots';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --collection prod',
    '<%= config.bin %> <%= command.id %> --all',
  ];

  static flags = {
    collection: Flags.string({
      char: 'c',
      description: 'Filter by collection (dev or prod)',
      options: ['dev', 'prod'],
    }),
    all: Flags.boolean({
      char: 'a',
      description: 'Show all snapshots from both collections',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(List);
    
    const docManager = new DocManager();
    const paths = docManager.getProjectPaths();
    const currentState = docManager.getCollectionState();
    
    // Determine which collections to show
    let collections: Collection[] = [];
    if (flags.all) {
      collections = ['dev', 'prod'];
    } else if (flags.collection) {
      collections = [flags.collection as Collection];
    } else {
      // Default to current collection
      collections = [currentState.collection === 'unknown' ? 'dev' : currentState.collection];
    }
    
    this.log('📋 Documentation Snapshots\n');
    
    const allSnapshots: Array<SnapshotSummary & { path: string }> = [];
    
    // Gather snapshots from each collection
    for (const collection of collections) {
      const collectionDir = path.join(paths.resultsDir, collection);
      
      if (!fs.existsSync(collectionDir)) {
        continue;
      }
      
      const items = fs.readdirSync(collectionDir);
      
      for (const item of items) {
        const itemPath = path.join(collectionDir, item);
        const metadataPath = path.join(itemPath, 'snapshot-metadata.json');
        
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata: SnapshotMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            allSnapshots.push({
              snapshot_id: metadata.snapshot_id,
              created_at: metadata.created_at,
              file_count: metadata.file_count,
              size_mb: metadata.total_size_mb,
              collection,
              path: itemPath,
              ...(metadata as any).tag && { tag: (metadata as any).tag }
            });
          } catch (error) {
            this.warn(`⚠️  Error reading snapshot ${item}: ${error}`);
          }
        }
      }
    }
    
    if (allSnapshots.length === 0) {
      this.log('📭 No snapshots found');
      this.log('\n💡 Create a snapshot with: fitb doc snapshot');
      return;
    }
    
    // Sort by date (newest first)
    allSnapshots.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Display snapshots
    if (flags.all || collections.length > 1) {
      // Group by collection
      for (const collection of collections) {
        const collectionSnapshots = allSnapshots.filter(s => s.collection === collection);
        
        if (collectionSnapshots.length > 0) {
          this.log(`\n📦 ${collection.toUpperCase()} Collection (${collectionSnapshots.length} snapshots):`);
          this.displaySnapshotTable(collectionSnapshots);
        }
      }
    } else {
      // Single collection
      this.log(`📦 ${collections[0].toUpperCase()} Collection:`);
      this.displaySnapshotTable(allSnapshots);
    }
    
    // Show total summary
    this.log(`\n📊 Total: ${allSnapshots.length} snapshot${allSnapshots.length !== 1 ? 's' : ''}`);
    
    const totalSize = allSnapshots.reduce((sum, s) => sum + s.size_mb, 0);
    this.log(`💾 Total size: ${Math.round(totalSize * 100) / 100} MB`);
    
    // Show latest snapshot info
    if (allSnapshots.length > 0) {
      const latest = allSnapshots[0];
      this.log(`\n🕒 Latest: ${latest.snapshot_id} (${latest.collection.toUpperCase()})`);
      this.log(`📍 Path: ${latest.path}`);
    }
  }

  private displaySnapshotTable(snapshots: Array<SnapshotSummary & { path: string; tag?: string }>): void {
    // Header
    this.log(`\n${'Snapshot ID'.padEnd(20)} ${'Created'.padEnd(20)} ${'Files'.padEnd(8)} ${'Size (MB)'.padEnd(10)} ${'Tag'}`);
    this.log('-'.repeat(80));
    
    // Rows
    for (const snapshot of snapshots) {
      const created = new Date(snapshot.created_at).toLocaleString().substring(0, 19);
      const tag = snapshot.tag || '';
      
      this.log(
        `${snapshot.snapshot_id.padEnd(20)} ` +
        `${created.padEnd(20)} ` +
        `${snapshot.file_count.toString().padEnd(8)} ` +
        `${snapshot.size_mb.toString().padEnd(10)} ` +
        `${tag}`
      );
    }
  }
}