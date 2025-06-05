import { Args, Command } from '@oclif/core';
import * as fs from 'fs';
import * as path from 'path';
import { DocManager } from '../../lib/utils/doc/doc-manager';
import { Collection } from '../../lib/utils/doc/types';

export default class Switch extends Command {
  static description = 'Switch between DEV and PROD documentation collections';

  static examples = [
    '<%= config.bin %> <%= command.id %> prod',
    '<%= config.bin %> <%= command.id %> dev',
  ];

  static args = {
    collection: Args.string({
      description: 'Collection to switch to (dev or prod)',
      required: true,
      options: ['dev', 'prod'],
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Switch);
    const targetCollection = args.collection as Collection;
    
    const docManager = new DocManager();
    const currentState = docManager.getCollectionState();
    
    if (currentState.collection === targetCollection) {
      this.log(`Already in ${targetCollection.toUpperCase()} collection`);
      return;
    }

    this.log(`🔄 Switching to ${targetCollection.toUpperCase()} collection...`);

    const paths = docManager.getProjectPaths();
    
    // Verify responsive-tiles directory exists
    if (!fs.existsSync(paths.responsiveTilesRoot)) {
      this.error(`Responsive-tiles directory not found: ${paths.responsiveTilesRoot}`);
    }

    // Get current configuration
    const devConfig = docManager.loadConfiguration('dev');
    const prodConfig = docManager.loadConfiguration('prod');

    if (targetCollection === 'prod') {
      // Switching to PROD - remove non-PROD files
      this.log('📦 Switching to PROD collection (minimal documentation)...');
      
      // Get all current doc files
      const allFiles = docManager.scanDocumentationFiles(paths.responsiveTilesRoot, devConfig);
      
      // Create backup before removing files
      this.log('💾 Creating backup of current files...');
      const backupPath = docManager.createBackup(allFiles);
      this.log(`✅ Backup created at: ${backupPath}`);
      
      // Determine which files to remove (all files not in PROD include_paths)
      const prodPaths = new Set(prodConfig.include_paths);
      let removedCount = 0;
      
      for (const file of allFiles) {
        // Check if this file is in PROD collection
        const shouldKeep = prodConfig.include_paths.some(prodPath => {
          // Handle both file and directory paths
          if (prodPath.endsWith('/')) {
            return file.relative_path.startsWith(prodPath);
          }
          return file.relative_path === prodPath;
        });
        
        if (!shouldKeep && fs.existsSync(file.source_path)) {
          fs.unlinkSync(file.source_path);
          removedCount++;
          this.log(`  🗑️  Removed: ${file.relative_path}`);
        }
      }
      
      this.log(`\n✅ Removed ${removedCount} non-PROD files`);
      this.log(`📦 PROD collection now active with ${allFiles.length - removedCount} files`);
      
      // Save state with backup reference
      docManager.saveCollectionState('prod', backupPath);
      
    } else {
      // Switching to DEV - restore all files
      this.log('📚 Switching to DEV collection (full documentation)...');
      
      const state = docManager.getCollectionState();
      
      if (state.backup_path && fs.existsSync(state.backup_path)) {
        this.log('💾 Restoring files from backup...');
        
        try {
          docManager.restoreFromBackup(state.backup_path);
          
          // Count restored files
          const restoredFiles = docManager.scanDocumentationFiles(paths.responsiveTilesRoot, devConfig);
          
          this.log(`✅ Restored ${restoredFiles.length} files`);
          this.log('📚 DEV collection now active with full documentation');
          
          // Save state
          docManager.saveCollectionState('dev');
          
        } catch (error: any) {
          this.error(`Failed to restore from backup: ${error.message}`);
        }
      } else {
        this.warn('No backup found. DEV collection may be incomplete.');
        this.warn('Consider restoring from Git or a snapshot.');
        
        // Still switch state
        docManager.saveCollectionState('dev');
      }
    }

    // Show summary
    this.log('\n📊 Collection switch complete!');
    this.log(`   Current collection: ${targetCollection.toUpperCase()}`);
    this.log(`   Working directory: ${paths.responsiveTilesRoot}`);
    
    if (targetCollection === 'prod') {
      this.log('\n💡 Next steps:');
      this.log('   1. Review PROD documentation files');
      this.log('   2. Make any necessary edits');
      this.log('   3. Run "fitb doc snapshot" to save PROD state');
      this.log('   4. Run "fitb doc switch dev" to return to full docs');
    }
  }
}