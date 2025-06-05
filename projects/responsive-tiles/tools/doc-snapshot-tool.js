#!/usr/bin/env node

/**
 * Cross-Project Documentation Snapshot Tool
 * 
 * A Node.js-based tool for creating documentation snapshots from responsive-tiles
 * into the fi-toolbox staging environment with promotion workflow support.
 * 
 * Setup: Create a symbolic link at fi-toolbox/projects/responsive-tiles/project
 * pointing to your responsive-tiles project directory.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

class CrossProjectDocTool {
    constructor(collection = 'dev') {
        // PATH CONFIGURATION - Updated to use the symbolic link
        // Project paths - adjusted for fi-toolbox working directory
        this.fiToolboxRoot = process.cwd();
        this.projectRoot = path.resolve(this.fiToolboxRoot, 'projects/responsive-tiles');
        this.responsiveTilesRoot = path.resolve(this.projectRoot, 'project'); // Use the symbolic link
        this.collection = collection;
        
        // Create collection-specific results directory
        this.resultsDir = path.resolve(this.projectRoot, 'results', collection);
        this.configDir = path.resolve(this.projectRoot, 'config');
        
        // Ensure directories exist
        this.ensureDirectories();
        
        // Load configuration
        this.config = this.loadConfiguration(collection);
        
        console.log('🔧 Cross-Project Documentation Tool Initialized');
        console.log(`📁 fi-toolbox: ${this.fiToolboxRoot}`);
        console.log(`🔗 responsive-tiles (via symlink): ${this.responsiveTilesRoot}`);
        console.log(`📁 results: ${this.resultsDir}`);
    }
    
    ensureDirectories() {
        const dirs = [this.resultsDir, this.configDir];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`📂 Created directory: ${dir}`);
            }
        });
    }
    
    loadConfiguration(collection = 'dev') {
        // Support both dev and prod configurations
        const configFileName = collection === 'prod' 
            ? 'responsive-tiles-config-prod.json'
            : 'responsive-tiles-config.json';
        const configFile = path.join(this.configDir, configFileName);
        
        // Check if prod config exists, otherwise fall back to dev
        if (collection === 'prod' && !fs.existsSync(configFile)) {
            console.log(`⚠️  Production config not found, using development config`);
            return this.loadConfiguration('dev');
        }
        
        const defaultConfig = {
            source_project: 'responsive-tiles',
            target_project: 'fi-toolbox',
            collection: 'dev',
            doc_extensions: ['.md', '.txt', '.rst', '.adoc'],
            exclude_patterns: [
                'node_modules', '.git', '.DS_Store', 'build', 'dist',
                'coverage', 'logs', 'tmp', '.vscode', '.idea'
            ],
            include_paths: ['docs/', 'README.md', 'CHANGELOG.md'],
            exclude_paths: ['docs/build/', 'docs/coverage/'],
            max_file_size_mb: 10
        };
        
        if (!fs.existsSync(configFile)) {
            fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
            console.log(`⚙️  Created default configuration: ${configFile}`);
        }
        
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        console.log(`📚 Using ${config.collection || 'dev'} collection: ${config.collection_description || 'Development documentation set'}`);
        return config;
    }
    
    createSnapshot() {
        console.log('📸 Creating documentation snapshot...');
        
        // Verify source project exists
        if (!fs.existsSync(this.responsiveTilesRoot)) {
            throw new Error(`Source project not found: ${this.responsiveTilesRoot}\nPlease ensure the symbolic link 'project' exists in ${this.projectRoot}`);
        }
        
        // Generate snapshot ID and directory
        const timestamp = new Date().toISOString().replace(/[T:]/g, '-').replace(/\..+/, '').replace(/-/g, (match, offset) => offset === 10 ? '-' : offset > 10 ? '' : '-');
        const snapshotId = timestamp;
        const snapshotDir = path.join(this.resultsDir, snapshotId);
        
        console.log(`📂 Snapshot ID: ${snapshotId}`);
        console.log(`📁 Snapshot directory: ${snapshotDir}`);
        
        // Create snapshot directory
        fs.mkdirSync(snapshotDir, { recursive: true });
        
        // Simple file scanning for MVP
        const docFiles = this.scanDocumentationFiles(this.responsiveTilesRoot);
        console.log(`📄 Found ${docFiles.length} documentation files`);
        
        // Copy files
        let copiedCount = 0;
        for (const fileInfo of docFiles) {
            const targetPath = path.join(snapshotDir, fileInfo.relative_path);
            const targetDir = path.dirname(targetPath);
            
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            
            fs.copyFileSync(fileInfo.source_path, targetPath);
            copiedCount++;
        }
        
        console.log(`📋 Copied ${copiedCount} files`);
        
        // Create simple metadata with collection info
        const metadata = {
            snapshot_id: snapshotId,
            created_at: new Date().toISOString(),
            collection: this.collection,
            collection_description: this.config.collection_description || `${this.collection} collection`,
            file_count: docFiles.length,
            total_size_mb: Math.round(docFiles.reduce((sum, f) => sum + f.size_bytes, 0) / 1024 / 1024 * 100) / 100,
            config_file: this.collection === 'prod' ? 'responsive-tiles-config-prod.json' : 'responsive-tiles-config.json'
        };
        
        fs.writeFileSync(path.join(snapshotDir, 'snapshot-metadata.json'), JSON.stringify(metadata, null, 2));
        
        console.log('✅ Snapshot created successfully!');
        console.log(`📍 Location: ${snapshotDir}`);
        
        return snapshotId;
    }
    
    scanDocumentationFiles(sourceDir) {
        const docFiles = [];
        
        const scanDirectory = (dir, baseDir) => {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativePath = path.relative(baseDir, fullPath);
                const stats = fs.statSync(fullPath);
                
                if (stats.isDirectory()) {
                    if (!this.config.exclude_patterns.some(pattern => item.includes(pattern))) {
                        scanDirectory(fullPath, baseDir);
                    }
                } else if (stats.isFile()) {
                    const ext = path.extname(fullPath).toLowerCase();
                    if (this.config.doc_extensions.includes(ext)) {
                        docFiles.push({
                            source_path: fullPath,
                            relative_path: relativePath,
                            size_bytes: stats.size
                        });
                    }
                }
            }
        };
        
        // Scan include paths
        for (const includePath of this.config.include_paths) {
            const fullIncludePath = path.join(sourceDir, includePath);
            if (fs.existsSync(fullIncludePath)) {
                const stats = fs.statSync(fullIncludePath);
                if (stats.isDirectory()) {
                    scanDirectory(fullIncludePath, sourceDir);
                } else if (stats.isFile()) {
                    const relativePath = path.relative(sourceDir, fullIncludePath);
                    docFiles.push({
                        source_path: fullIncludePath,
                        relative_path: relativePath,
                        size_bytes: stats.size
                    });
                }
            }
        }
        
        return docFiles;
    }
    
    listSnapshots() {
        console.log('📋 Listing documentation snapshots...');
        
        if (!fs.existsSync(this.resultsDir)) {
            console.log('📂 No snapshots directory found');
            return [];
        }
        
        const snapshots = [];
        const items = fs.readdirSync(this.resultsDir);
        
        for (const item of items) {
            const itemPath = path.join(this.resultsDir, item);
            const metadataPath = path.join(itemPath, 'snapshot-metadata.json');
            
            if (fs.existsSync(metadataPath)) {
                try {
                    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                    snapshots.push({
                        snapshot_id: metadata.snapshot_id,
                        created_at: metadata.created_at,
                        file_count: metadata.file_count,
                        size_mb: metadata.total_size_mb
                    });
                } catch (error) {
                    console.warn(`⚠️  Error reading snapshot ${item}: ${error.message}`);
                }
            }
        }
        
        if (snapshots.length === 0) {
            console.log('📭 No snapshots found');
        } else {
            console.log(`\n${'Snapshot ID'.padEnd(20)} ${'Created'.padEnd(20)} ${'Files'.padEnd(6)} ${'Size (MB)'.padEnd(10)}`);
            console.log('-'.repeat(60));
            
            for (const snapshot of snapshots) {
                const created = snapshot.created_at.substring(0, 19).replace('T', ' ');
                console.log(`${snapshot.snapshot_id.padEnd(20)} ${created.padEnd(20)} ${snapshot.file_count.toString().padEnd(6)} ${snapshot.size_mb.toString().padEnd(10)}`);
            }
        }
        
        return snapshots;
    }
    
    // Git-based collection management methods
    getCurrentBranch() {
        try {
            const branch = execSync('git rev-parse --abbrev-ref HEAD', { 
                cwd: this.responsiveTilesRoot,
                encoding: 'utf8' 
            }).trim();
            return branch;
        } catch (error) {
            console.error('❌ Error getting current branch:', error.message);
            return null;
        }
    }
    
    hasUncommittedChanges() {
        try {
            const status = execSync('git status --porcelain', {
                cwd: this.responsiveTilesRoot,
                encoding: 'utf8'
            }).trim();
            return status.length > 0;
        } catch (error) {
            console.error('❌ Error checking git status:', error.message);
            return true; // Assume changes exist for safety
        }
    }
    
    getCollectionState() {
        const stateFile = path.join(this.responsiveTilesRoot, '.collection-state');
        if (fs.existsSync(stateFile)) {
            try {
                const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
                return state;
            } catch (error) {
                return { collection: 'unknown', branch: null };
            }
        }
        
        // Infer from branch name if no state file
        const branch = this.getCurrentBranch();
        if (branch === 'idea/main-documents') {
            return { collection: 'dev', branch };
        } else if (branch === 'idea/main-documents-prod') {
            return { collection: 'prod', branch };
        }
        
        return { collection: 'unknown', branch };
    }
    
    saveCollectionState(collection, branch) {
        const stateFile = path.join(this.responsiveTilesRoot, '.collection-state');
        const state = {
            collection,
            branch,
            switched_at: new Date().toISOString()
        };
        fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
    }
    
    initializeMainDocumentsBranch() {
        console.log('🌿 Initializing idea/main-documents branch...');
        
        const currentBranch = this.getCurrentBranch();
        
        try {
            // Check if branch exists
            try {
                execSync('git rev-parse --verify idea/main-documents', {
                    cwd: this.responsiveTilesRoot,
                    stdio: 'ignore'
                });
                console.log('✅ Branch idea/main-documents already exists');
                return true;
            } catch {
                // Branch doesn't exist, create it
                console.log('📝 Creating new branch idea/main-documents...');
                
                // Create and switch to the new branch
                execSync('git checkout -b idea/main-documents', {
                    cwd: this.responsiveTilesRoot,
                    stdio: 'inherit'
                });
                
                // Add all untracked documentation files
                const docExtensions = this.config.doc_extensions.map(ext => `*${ext}`).join(' ');
                try {
                    execSync(`git add ${this.config.include_paths.join(' ')}`, {
                        cwd: this.responsiveTilesRoot,
                        stdio: 'inherit'
                    });
                    
                    execSync('git commit -m "Initialize main documents branch with all documentation"', {
                        cwd: this.responsiveTilesRoot,
                        stdio: 'inherit'
                    });
                } catch (error) {
                    console.log('ℹ️  No new files to commit');
                }
                
                console.log('✅ Created idea/main-documents branch');
                this.saveCollectionState('dev', 'idea/main-documents');
                return true;
            }
        } catch (error) {
            console.error('❌ Error initializing branch:', error.message);
            // Try to switch back to original branch
            if (currentBranch) {
                try {
                    execSync(`git checkout ${currentBranch}`, {
                        cwd: this.responsiveTilesRoot,
                        stdio: 'ignore'
                    });
                } catch {}
            }
            return false;
        }
    }
    
    switchCollection(targetCollection) {
        console.log(`🔄 Switching to ${targetCollection.toUpperCase()} collection...`);
        
        // Check for uncommitted changes
        if (this.hasUncommittedChanges()) {
            console.error('❌ You have uncommitted changes. Please commit or stash them first.');
            console.log('💡 Run: git status');
            return false;
        }
        
        // Ensure main-documents branch exists
        if (!this.initializeMainDocumentsBranch()) {
            return false;
        }
        
        try {
            if (targetCollection === 'dev') {
                // Switch to full DEV collection
                console.log('📚 Switching to DEV collection (full documentation)...');
                
                execSync('git checkout idea/main-documents', {
                    cwd: this.responsiveTilesRoot,
                    stdio: 'inherit'
                });
                
                this.saveCollectionState('dev', 'idea/main-documents');
                console.log('✅ Switched to DEV collection');
                
            } else if (targetCollection === 'prod') {
                // Switch to PROD collection
                console.log('📦 Switching to PROD collection (minimal documentation)...');
                
                // Check if prod branch exists, create if not
                try {
                    execSync('git rev-parse --verify idea/main-documents-prod', {
                        cwd: this.responsiveTilesRoot,
                        stdio: 'ignore'
                    });
                    // Branch exists, just switch
                    execSync('git checkout idea/main-documents-prod', {
                        cwd: this.responsiveTilesRoot,
                        stdio: 'inherit'
                    });
                } catch {
                    // Create prod branch from main-documents
                    console.log('📝 Creating PROD branch...');
                    execSync('git checkout idea/main-documents', {
                        cwd: this.responsiveTilesRoot,
                        stdio: 'inherit'
                    });
                    execSync('git checkout -b idea/main-documents-prod', {
                        cwd: this.responsiveTilesRoot,
                        stdio: 'inherit'
                    });
                    
                    // Remove non-PROD files
                    console.log('🗑️  Removing non-PROD documentation files...');
                    
                    // Get all markdown files
                    const allDocs = this.scanDocumentationFiles(this.responsiveTilesRoot);
                    const prodConfig = this.loadConfiguration('prod');
                    
                    // Create a Set of PROD files for fast lookup
                    const prodFiles = new Set(prodConfig.include_paths);
                    
                    // Remove files not in PROD
                    let removedCount = 0;
                    for (const doc of allDocs) {
                        if (!prodFiles.has(doc.relative_path)) {
                            const fullPath = path.join(this.responsiveTilesRoot, doc.relative_path);
                            fs.unlinkSync(fullPath);
                            removedCount++;
                        }
                    }
                    
                    console.log(`🗑️  Removed ${removedCount} non-PROD files`);
                    
                    // Commit the changes
                    execSync('git add -A', {
                        cwd: this.responsiveTilesRoot,
                        stdio: 'inherit'
                    });
                    
                    execSync('git commit -m "Create PROD collection with minimal documentation"', {
                        cwd: this.responsiveTilesRoot,
                        stdio: 'inherit'
                    });
                }
                
                this.saveCollectionState('prod', 'idea/main-documents-prod');
                console.log('✅ Switched to PROD collection');
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Error switching collection:', error.message);
            return false;
        }
    }
    
    showStatus() {
        console.log('📊 Documentation Collection Status\n');
        
        const state = this.getCollectionState();
        const branch = this.getCurrentBranch();
        
        console.log(`🌿 Current branch: ${branch}`);
        console.log(`📚 Active collection: ${state.collection.toUpperCase()}`);
        
        if (state.switched_at) {
            const switchedDate = new Date(state.switched_at);
            console.log(`🕒 Last switched: ${switchedDate.toLocaleString()}`);
        }
        
        // Count current documentation files
        const currentDocs = this.scanDocumentationFiles(this.responsiveTilesRoot);
        console.log(`📄 Current documentation files: ${currentDocs.length}`);
        
        // Compare with expected counts
        const devConfig = this.loadConfiguration('dev');
        const prodConfig = this.loadConfiguration('prod');
        
        console.log(`\n📊 Collection Comparison:`);
        console.log(`   DEV collection:  All files in ${devConfig.include_paths.join(', ')}`);
        console.log(`   PROD collection: ${prodConfig.include_paths.length} specific files`);
        
        // Check git status
        if (this.hasUncommittedChanges()) {
            console.log(`\n⚠️  Warning: You have uncommitted changes`);
            console.log(`   Run 'git status' to see details`);
        }
        
        // Show available actions
        console.log(`\n💡 Available actions:`);
        if (state.collection !== 'dev') {
            console.log(`   node doc-snapshot-tool.js switch dev    # Switch to full documentation`);
        }
        if (state.collection !== 'prod') {
            console.log(`   node doc-snapshot-tool.js switch prod   # Switch to minimal documentation`);
        }
        console.log(`   node doc-snapshot-tool.js snapshot      # Create a snapshot of current docs`);
    }
}

// Command-line interface
function main() {
    const command = process.argv[2] || 'help';
    const args = process.argv.slice(3);
    
    // Parse collection argument
    let collection = 'dev';
    const collectionArgIndex = args.findIndex(arg => arg === '--collection' || arg === '-c');
    if (collectionArgIndex !== -1 && args[collectionArgIndex + 1]) {
        collection = args[collectionArgIndex + 1];
        if (!['dev', 'prod'].includes(collection)) {
            console.error(`❌ Invalid collection: ${collection}. Must be 'dev' or 'prod'`);
            process.exit(1);
        }
    }
    
    try {
        // For switch and status commands, we don't need collection parameter
        if (command === 'switch' || command === 'status') {
            const tool = new CrossProjectDocTool('dev');
            
            if (command === 'switch') {
                const targetCollection = args[0];
                if (!targetCollection || !['dev', 'prod'].includes(targetCollection)) {
                    console.error(`❌ Please specify collection: 'dev' or 'prod'`);
                    console.log(`💡 Usage: node doc-snapshot-tool.js switch [dev|prod]`);
                    process.exit(1);
                }
                tool.switchCollection(targetCollection);
            } else if (command === 'status') {
                tool.showStatus();
            }
        } else {
            // Other commands use collection parameter
            const tool = new CrossProjectDocTool(collection);
            
            switch (command) {
                case 'snapshot':
                    const snapshotId = tool.createSnapshot();
                    console.log(`\n🎉 Snapshot created: ${snapshotId}`);
                    console.log(`📚 Collection: ${collection}`);
                    break;
                    
                case 'list':
                    tool.listSnapshots();
                    break;
                    
                case 'help':
                default:
                    console.log(`
Cross-Project Documentation Tool with Collection Management

Usage: node doc-snapshot-tool.js [command] [options]

Commands:
  snapshot    Create a new documentation snapshot
  list        List existing snapshots
  switch      Switch between DEV and PROD collections
  status      Show current collection status
  help        Show this help message

Options:
  --collection, -c    Specify collection type: 'dev' or 'prod' (default: dev)

Examples:
  # Snapshot commands
  node doc-snapshot-tool.js snapshot                    # Create dev snapshot
  node doc-snapshot-tool.js snapshot --collection prod  # Create prod snapshot
  node doc-snapshot-tool.js list --collection dev       # List dev snapshots
  node doc-snapshot-tool.js list --collection prod      # List prod snapshots
  
  # Collection management commands
  node doc-snapshot-tool.js status                      # Show current collection
  node doc-snapshot-tool.js switch dev                  # Switch to DEV collection
  node doc-snapshot-tool.js switch prod                 # Switch to PROD collection

Collections:
  dev   - Full documentation set (all markdown files)
  prod  - Minimal production set (only files used in public docs)

Collection Management:
  The tool manages documentation collections using Git branches:
  - idea/main-documents      = DEV collection (all docs)
  - idea/main-documents-prod = PROD collection (18 essential files)
  
  Switching collections changes the active Git branch and file set.
`);
                    break;
            }
        }
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = CrossProjectDocTool;