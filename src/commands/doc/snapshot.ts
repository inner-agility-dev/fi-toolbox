import { Command, Flags } from '@oclif/core';
import * as fs from 'fs';
import * as path from 'path';
import { DocManager } from '../../lib/utils/doc/doc-manager';
import { SnapshotMetadata } from '../../lib/utils/doc/types';

export default class Snapshot extends Command {
  static description = 'Create a documentation snapshot';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --tag "v1.0.0 release"',
  ];

  static flags = {
    tag: Flags.string({
      char: 't',
      description: 'Tag or description for this snapshot',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Snapshot);
    
    const docManager = new DocManager();
    const state = docManager.getCollectionState();
    const collection = state.collection === 'unknown' ? 'dev' : state.collection;
    
    this.log(`📸 Creating ${collection.toUpperCase()} documentation snapshot...`);
    
    const paths = docManager.getProjectPaths();
    
    // Verify source directory exists
    if (!fs.existsSync(paths.responsiveTilesRoot)) {
      this.error(`Source project not found: ${paths.responsiveTilesRoot}`);
    }
    
    // Load configuration for current collection
    const config = docManager.loadConfiguration(collection);
    
    // Generate snapshot ID and directory
    const snapshotId = docManager.generateSnapshotId();
    const snapshotDir = path.join(paths.resultsDir, collection, snapshotId);
    
    this.log(`📂 Snapshot ID: ${snapshotId}`);
    
    // Create snapshot directory
    fs.mkdirSync(snapshotDir, { recursive: true });
    
    // Scan documentation files
    const docFiles = docManager.scanDocumentationFiles(paths.responsiveTilesRoot, config);
    this.log(`📄 Found ${docFiles.length} documentation files`);
    
    // Copy files
    let copiedCount = 0;
    for (const fileInfo of docFiles) {
      const targetPath = path.join(snapshotDir, fileInfo.relative_path);
      const targetDir = path.dirname(targetPath);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      if (fs.existsSync(fileInfo.source_path)) {
        fs.copyFileSync(fileInfo.source_path, targetPath);
        copiedCount++;
      }
    }
    
    this.log(`📋 Copied ${copiedCount} files`);
    
    // Calculate total size
    const totalSizeMb = Math.round(
      docFiles.reduce((sum, f) => sum + f.size_bytes, 0) / 1024 / 1024 * 100
    ) / 100;
    
    // Create metadata
    const metadata: SnapshotMetadata = {
      snapshot_id: snapshotId,
      created_at: new Date().toISOString(),
      collection,
      collection_description: config.collection_description || `${collection} collection`,
      file_count: docFiles.length,
      total_size_mb: totalSizeMb,
      config_file: collection === 'prod' ? 'responsive-tiles-config-prod.json' : 'responsive-tiles-config.json',
    };
    
    // Add tag if provided
    if (flags.tag) {
      (metadata as any).tag = flags.tag;
    }
    
    // Write metadata
    fs.writeFileSync(
      path.join(snapshotDir, 'snapshot-metadata.json'), 
      JSON.stringify(metadata, null, 2)
    );
    
    // Create a README for the snapshot
    const readme = `# Documentation Snapshot: ${snapshotId}

## Overview
- **Collection**: ${collection.toUpperCase()}
- **Created**: ${new Date().toLocaleString()}
- **Files**: ${docFiles.length}
- **Total Size**: ${totalSizeMb} MB
${flags.tag ? `- **Tag**: ${flags.tag}\n` : ''}

## Files Included
${docFiles.slice(0, 10).map(f => `- ${f.relative_path}`).join('\n')}
${docFiles.length > 10 ? `\n... and ${docFiles.length - 10} more files` : ''}

## Configuration
This snapshot was created using: \`${metadata.config_file}\`
`;
    
    fs.writeFileSync(path.join(snapshotDir, 'README.md'), readme);
    
    this.log('\n✅ Snapshot created successfully!');
    this.log(`📍 Location: ${snapshotDir}`);
    this.log(`🏷️  Collection: ${collection.toUpperCase()}`);
    if (flags.tag) {
      this.log(`🏷️  Tag: ${flags.tag}`);
    }
    
    // Show next steps
    this.log('\n💡 Next steps:');
    this.log('   - Review snapshot at location above');
    this.log('   - Use "fitb doc list" to see all snapshots');
    this.log('   - Snapshots can be promoted or compared later');
  }
}