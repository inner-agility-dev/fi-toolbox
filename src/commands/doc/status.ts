import { Command } from '@oclif/core';
import * as fs from 'fs';
import * as path from 'path';
import { DocManager } from '../../lib/utils/doc/doc-manager';

export default class Status extends Command {
  static description = 'Show current documentation collection status';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ];

  async run(): Promise<void> {
    const docManager = new DocManager();
    const state = docManager.getCollectionState();
    const paths = docManager.getProjectPaths();
    
    this.log('📊 Documentation Collection Status\n');
    
    // Current collection
    const collection = state.collection === 'unknown' ? 'dev' : state.collection;
    this.log(`📚 Active collection: ${collection.toUpperCase()}`);
    
    if (state.switched_at) {
      const switchedDate = new Date(state.switched_at);
      this.log(`🕒 Last switched: ${switchedDate.toLocaleString()}`);
    }
    
    // Working directories
    this.log('\n📁 Working Directories:');
    this.log(`   Fi-toolbox: ${paths.fiToolboxRoot}`);
    this.log(`   Responsive-tiles: ${paths.responsiveTilesRoot}`);
    this.log(`   Snapshots: ${paths.resultsDir}`);
    
    // Check if responsive-tiles exists
    if (!fs.existsSync(paths.responsiveTilesRoot)) {
      this.warn('\n⚠️  Warning: Responsive-tiles directory not found!');
      this.log('   Please ensure the symbolic link exists or run from responsive-tiles directory');
      return;
    }
    
    // Count current documentation files
    const config = docManager.loadConfiguration(collection);
    const currentDocs = docManager.scanDocumentationFiles(paths.responsiveTilesRoot, config);
    
    this.log(`\n📄 Current documentation files: ${currentDocs.length}`);
    
    // Calculate total size
    const totalSizeMb = Math.round(
      currentDocs.reduce((sum, f) => sum + f.size_bytes, 0) / 1024 / 1024 * 100
    ) / 100;
    this.log(`💾 Total size: ${totalSizeMb} MB`);
    
    // Show collection comparison
    const devConfig = docManager.loadConfiguration('dev');
    const prodConfig = docManager.loadConfiguration('prod');
    
    this.log('\n📊 Collection Comparison:');
    this.log(`   DEV:  All files in ${devConfig.include_paths.join(', ')}`);
    this.log(`   PROD: ${prodConfig.include_paths.length} specific paths`);
    
    // Check for backups
    if (fs.existsSync(paths.backupDir)) {
      const backups = fs.readdirSync(paths.backupDir).filter(f => f.startsWith('backup-'));
      if (backups.length > 0) {
        this.log(`\n💾 Backups available: ${backups.length}`);
        if (state.backup_path) {
          this.log(`   Latest: ${path.basename(state.backup_path)}`);
        }
      }
    }
    
    // Count snapshots
    let devSnapshots = 0;
    let prodSnapshots = 0;
    
    const devSnapshotDir = path.join(paths.resultsDir, 'dev');
    const prodSnapshotDir = path.join(paths.resultsDir, 'prod');
    
    if (fs.existsSync(devSnapshotDir)) {
      devSnapshots = fs.readdirSync(devSnapshotDir).filter(f => 
        fs.existsSync(path.join(devSnapshotDir, f, 'snapshot-metadata.json'))
      ).length;
    }
    
    if (fs.existsSync(prodSnapshotDir)) {
      prodSnapshots = fs.readdirSync(prodSnapshotDir).filter(f => 
        fs.existsSync(path.join(prodSnapshotDir, f, 'snapshot-metadata.json'))
      ).length;
    }
    
    this.log('\n📸 Snapshots:');
    this.log(`   DEV snapshots: ${devSnapshots}`);
    this.log(`   PROD snapshots: ${prodSnapshots}`);
    
    // Show available actions based on current state
    this.log('\n💡 Available actions:');
    if (collection !== 'dev') {
      this.log('   fitb doc switch dev     # Switch to full documentation');
    }
    if (collection !== 'prod') {
      this.log('   fitb doc switch prod    # Switch to minimal documentation');
    }
    this.log('   fitb doc snapshot       # Create a snapshot of current docs');
    this.log('   fitb doc list           # List all snapshots');
    
    // Show warnings if needed
    if (collection === 'prod' && !state.backup_path) {
      this.warn('\n⚠️  Warning: No backup found for DEV files');
      this.warn('   Switching back to DEV may result in missing files');
    }
  }
}