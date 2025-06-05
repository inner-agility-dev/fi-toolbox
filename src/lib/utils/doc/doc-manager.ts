import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Collection, CollectionState, DocConfig, DocFile, SnapshotMetadata } from './types';

export class DocManager {
  private fiToolboxRoot: string;
  private projectRoot: string;
  private responsiveTilesRoot: string;
  private resultsDir: string;
  private configDir: string;
  private backupDir: string;
  private stateFile: string;

  constructor(workingDir?: string) {
    // Support running from either fi-toolbox or responsive-tiles
    const cwd = workingDir || process.cwd();
    
    // Check if we're in responsive-tiles or fi-toolbox
    if (cwd.includes('responsive-tiles') && !cwd.includes('fi-toolbox')) {
      // Running from responsive-tiles directly
      this.responsiveTilesRoot = cwd;
      // Assume fi-toolbox is a sibling directory
      this.fiToolboxRoot = path.resolve(cwd, '..', 'fi-toolbox');
    } else {
      // Running from fi-toolbox
      this.fiToolboxRoot = cwd.includes('fi-toolbox') ? cwd : path.resolve(cwd, 'fi-toolbox');
      this.responsiveTilesRoot = path.resolve(this.fiToolboxRoot, 'projects/responsive-tiles/project');
    }

    this.projectRoot = path.resolve(this.fiToolboxRoot, 'projects/responsive-tiles');
    this.resultsDir = path.resolve(this.projectRoot, 'results');
    this.configDir = path.resolve(this.projectRoot, 'config');
    this.backupDir = path.resolve(this.projectRoot, '.backups');
    this.stateFile = path.resolve(this.projectRoot, '.collection-state.json');

    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    const dirs = [this.resultsDir, this.configDir, this.backupDir];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  getCollectionState(): CollectionState {
    if (fs.existsSync(this.stateFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
      } catch {
        return { collection: 'unknown' };
      }
    }
    
    // Default to dev if no state exists
    return { collection: 'dev' };
  }

  saveCollectionState(collection: Collection, backupPath?: string): void {
    const state: CollectionState = {
      collection,
      switched_at: new Date().toISOString(),
      backup_path: backupPath
    };
    fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
  }

  loadConfiguration(collection: Collection): DocConfig {
    const configFileName = collection === 'prod' 
      ? 'responsive-tiles-config-prod.json'
      : 'responsive-tiles-config.json';
    const configFile = path.join(this.configDir, configFileName);

    const defaultConfig: DocConfig = {
      source_project: 'responsive-tiles',
      target_project: 'fi-toolbox',
      collection,
      doc_extensions: ['.md', '.txt', '.rst', '.adoc'],
      exclude_patterns: [
        'node_modules', '.git', '.DS_Store', 'build', 'dist',
        'coverage', 'logs', 'tmp', '.vscode', '.idea'
      ],
      include_paths: ['docs/', 'README.md', 'CHANGELOG.md'],
      exclude_paths: ['docs/build/', 'docs/coverage/'],
      max_file_size_mb: 10
    };

    // Create default config if it doesn't exist
    if (!fs.existsSync(configFile)) {
      fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
    }

    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    return { ...defaultConfig, ...config };
  }

  scanDocumentationFiles(sourceDir: string, config: DocConfig): DocFile[] {
    const docFiles: DocFile[] = [];

    const scanDirectory = (dir: string, baseDir: string): void => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.relative(baseDir, fullPath);
        
        try {
          const stats = fs.statSync(fullPath);

          if (stats.isDirectory()) {
            if (!config.exclude_patterns.some(pattern => item.includes(pattern))) {
              scanDirectory(fullPath, baseDir);
            }
          } else if (stats.isFile()) {
            const ext = path.extname(fullPath).toLowerCase();
            if (config.doc_extensions.includes(ext)) {
              // Check if it's in exclude paths
              const isExcluded = config.exclude_paths.some(excludePath => 
                relativePath.startsWith(excludePath)
              );
              
              if (!isExcluded) {
                docFiles.push({
                  source_path: fullPath,
                  relative_path: relativePath,
                  size_bytes: stats.size
                });
              }
            }
          }
        } catch (error) {
          // Skip files we can't access
        }
      }
    };

    // Scan include paths
    for (const includePath of config.include_paths) {
      const fullIncludePath = path.join(sourceDir, includePath);
      if (fs.existsSync(fullIncludePath)) {
        const stats = fs.statSync(fullIncludePath);
        if (stats.isDirectory()) {
          scanDirectory(fullIncludePath, sourceDir);
        } else if (stats.isFile()) {
          const ext = path.extname(fullIncludePath).toLowerCase();
          if (config.doc_extensions.includes(ext)) {
            docFiles.push({
              source_path: fullIncludePath,
              relative_path: includePath,
              size_bytes: stats.size
            });
          }
        }
      }
    }

    return docFiles;
  }

  createBackup(files: DocFile[]): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `backup-${timestamp}`);
    
    fs.mkdirSync(backupPath, { recursive: true });
    
    // Copy files to backup
    for (const file of files) {
      const backupFilePath = path.join(backupPath, file.relative_path);
      const backupFileDir = path.dirname(backupFilePath);
      
      if (!fs.existsSync(backupFileDir)) {
        fs.mkdirSync(backupFileDir, { recursive: true });
      }
      
      if (fs.existsSync(file.source_path)) {
        fs.copyFileSync(file.source_path, backupFilePath);
      }
    }
    
    // Save metadata
    const metadata = {
      timestamp,
      file_count: files.length,
      files: files.map(f => f.relative_path)
    };
    
    fs.writeFileSync(
      path.join(backupPath, 'backup-metadata.json'), 
      JSON.stringify(metadata, null, 2)
    );
    
    return backupPath;
  }

  restoreFromBackup(backupPath: string): void {
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup not found: ${backupPath}`);
    }
    
    const metadataPath = path.join(backupPath, 'backup-metadata.json');
    if (!fs.existsSync(metadataPath)) {
      throw new Error('Invalid backup: missing metadata');
    }
    
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    // Restore each file
    for (const relativePath of metadata.files) {
      const backupFilePath = path.join(backupPath, relativePath);
      const targetPath = path.join(this.responsiveTilesRoot, relativePath);
      const targetDir = path.dirname(targetPath);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      if (fs.existsSync(backupFilePath)) {
        fs.copyFileSync(backupFilePath, targetPath);
      }
    }
  }

  generateSnapshotId(): string {
    const now = new Date();
    return now.toISOString()
      .replace(/T/, '-')
      .replace(/:/g, '')
      .replace(/\..+/, '')
      .replace(/-/g, (match, offset) => offset === 10 ? '-' : offset > 10 ? '' : '-');
  }

  getProjectPaths() {
    return {
      fiToolboxRoot: this.fiToolboxRoot,
      responsiveTilesRoot: this.responsiveTilesRoot,
      projectRoot: this.projectRoot,
      resultsDir: this.resultsDir,
      configDir: this.configDir,
      backupDir: this.backupDir
    };
  }
}