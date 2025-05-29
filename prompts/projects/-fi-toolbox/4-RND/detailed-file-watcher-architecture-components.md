# Detailed File Watcher Architecture Components

## 1. Central Commands Deployment Engine

### Command Sync Strategy:
```javascript
class CommandDeploymentEngine {
  async deployToRegisteredProjects(changedFilePath) {
    const projects = await this.getRegisteredProjects();
    const relativePath = path.relative('fi-toolbox/.claude/commands', changedFilePath);
    
    for (const project of projects) {
      await this.deployToProject(project, relativePath, changedFilePath);
    }
  }

  async deployToProject(project, relativePath, sourcePath) {
    const targetPath = path.join(project.path, '.claude/commands', relativePath);
    
    // Create backup if file exists
    if (fs.existsSync(targetPath)) {
      await this.createBackup(targetPath, project.name);
    }
    
    // Copy with metadata preservation
    await fs.copy(sourcePath, targetPath, {
      preserveTimestamps: true,
      overwrite: true
    });
    
    // Log deployment
    this.logDeployment(project.name, relativePath, 'success');
  }

  async getRegisteredProjects() {
    // Scan /Users/LenMiller/code/banno/ for projects with .fitb-registered marker
    const bannoDir = '/Users/LenMiller/code/banno';
    const projects = [];
    
    const dirs = await fs.readdir(bannoDir);
    for (const dir of dirs) {
      const projectPath = path.join(bannoDir, dir);
      const markerPath = path.join(projectPath, '.fitb-registered');
      
      if (await fs.pathExists(markerPath)) {
        const config = await fs.readJson(markerPath);
        projects.push({
          name: dir,
          path: projectPath,
          stage: config.currentStage,
          lastSync: config.lastCommandSync
        });
      }
    }
    
    return projects;
  }
}
```

## 2. Development Prompts Change Handler

### Development Tracking:
```javascript
class DevelopmentTracker {
  async handleDevelopmentChange(filePath) {
    const context = this.parseDevContext(filePath);
    
    // Update development index
    await this.updateDevelopmentIndex(context);
    
    // Generate change notification
    await this.notifyDevelopmentChange(context);
    
    // Optional: Auto-validate prompt syntax
    if (context.fileType === '.md') {
      await this.validatePromptSyntax(filePath);
    }
  }

  parseDevContext(filePath) {
    // Parse: prompts/projects/responsive-tiles/3-REGISTERED/development/new-analysis.md
    const parts = filePath.split(path.sep);
    const projectIndex = parts.indexOf('projects') + 1;
    
    return {
      project: parts[projectIndex],
      stage: parts[projectIndex + 1],
      filename: parts[parts.length - 1],
      fileType: path.extname(parts[parts.length - 1]),
      fullPath: filePath,
      isProduction: !filePath.includes('/development/'),
      lastModified: fs.statSync(filePath).mtime
    };
  }

  async updateDevelopmentIndex(context) {
    const indexPath = `fi-toolbox/artifacts/${context.project}/development-index.json`;
    let index = {};
    
    if (await fs.pathExists(indexPath)) {
      index = await fs.readJson(indexPath);
    }
    
    if (!index[context.stage]) {
      index[context.stage] = {};
    }
    
    index[context.stage][context.filename] = {
      lastModified: context.lastModified,
      status: 'in-development',
      readyForPromotion: false
    };
    
    await fs.writeJson(indexPath, index, { spaces: 2 });
  }
}
```

## 3. Promotion Drop Zone Processor

### Promotion File Handlers:
```javascript
class PromotionProcessor {
  async executePromotion(instruction) {
    switch(instruction.type) {
      case 'prompt':
        return await this.promotePrompt(instruction);
      case 'commands':
        return await this.promoteCommands(instruction);
      case 'artifact':
        return await this.promoteArtifact(instruction);
    }
  }

  async promotePrompt(instruction) {
    const { project, stage, source, target } = instruction;
    
    const sourcePath = `fi-toolbox/prompts/projects/${project}/${stage}/${source}`;
    const targetPath = `fi-toolbox/prompts/projects/${project}/${stage}/${path.basename(source)}`;
    
    // Backup current production version
    if (instruction.backup) {
      await this.createTimestampedBackup(targetPath);
    }
    
    // Copy development to production
    await fs.copy(sourcePath, targetPath);
    
    // Update development index
    await this.markAsPromoted(project, stage, source);
    
    // Generate new artifacts using promoted prompt
    if (instruction.regenerateArtifacts) {
      await this.regenerateStageArtifacts(project, stage);
    }
    
    return {
      success: true,
      promoted: `${source} → production`,
      artifactsRegenerated: instruction.regenerateArtifacts
    };
  }

  async executeOneshot(instruction) {
    const { project, stage, prompt, localCommands } = instruction;
    
    // Create temporary workspace
    const tempWorkspace = `fi-toolbox/temp/oneshot-${Date.now()}`;
    await fs.ensureDir(tempWorkspace);
    
    try {
      let result;
      
      if (localCommands) {
        // Test local command changes
        result = await this.testLocalCommands(project, tempWorkspace);
      } else {
        // Test development prompt
        result = await this.testDevelopmentPrompt(project, stage, prompt, tempWorkspace);
      }
      
      // Generate comparison report
      const comparison = await this.generateComparison(result, project, stage);
      
      return {
        success: true,
        tempPath: tempWorkspace,
        comparison: comparison,
        promptForPromotion: true
      };
      
    } catch (error) {
      // Cleanup on error
      await fs.remove(tempWorkspace);
      throw error;
    }
  }

  async testLocalCommands(project, tempWorkspace) {
    const projectPath = `/Users/LenMiller/code/banno/${project}`;
    const localCommands = `${projectPath}/.claude/commands`;
    const centralCommands = `fi-toolbox/.claude/commands`;
    
    // Generate diff
    const diff = await this.generateCommandsDiff(localCommands, centralCommands);
    
    // Create diff prompt
    const diffPrompt = this.createDiffPrompt(diff);
    
    // Execute with local commands context
    const result = await this.executeWithContext(diffPrompt, localCommands, tempWorkspace);
    
    return {
      type: 'local-commands-test',
      diff: diff,
      result: result,
      localCommandsPath: localCommands
    };
  }
}
```

## 4. Advanced Watcher Configuration

### Dynamic Configuration:
```javascript
// fi-toolbox/watcher-config.json
{
  "watchers": {
    "commands": {
      "enabled": true,
      "debounceMs": 1000,
      "batchDeployment": true,
      "excludePatterns": ["**/*.tmp", "**/.DS_Store"]
    },
    "development": {
      "enabled": true,
      "autoPreview": false,
      "notifyOnChange": true,
      "validateSyntax": true
    },
    "promotion": {
      "enabled": true,
      "requireApproval": false,
      "autoBackup": true,
      "maxConcurrentPromotions": 3
    }
  },
  "projects": {
    "autoDiscovery": true,
    "registrationMarker": ".fitb-registered",
    "excludeProjects": ["node_modules", ".git", "dist"]
  },
  "notifications": {
    "console": true,
    "file": "fi-toolbox/logs/watcher.log",
    "webhook": null
  },
  "backup": {
    "enabled": true,
    "maxBackups": 10,
    "retentionDays": 30,
    "location": "fi-toolbox/backups"
  }
}
```

## 5. CLI Integration Details

### Enhanced CLI Commands:
```bash
# Watcher management
fitb watch start [--config custom-config.json]
fitb watch stop
fitb watch restart  
fitb watch status [--verbose]

# Development workflow
fitb develop --project responsive-tiles --stage 3-REGISTERED
fitb develop list --project responsive-tiles  # show all dev items
fitb develop status --all  # show all projects dev status

# One-shot testing
fitb oneshot --dev-prompt analysis.md --project responsive-tiles --stage 3
fitb oneshot --local-commands --project responsive-tiles --show-diff
fitb oneshot --compare-artifacts --before artifacts/3-REGISTERED --after temp/oneshot-123

# Promotion workflows  
fitb promote create-template > my-promotion.json
fitb promote validate my-promotion.json
fitb promote execute my-promotion.json [--dry-run]
fitb promote history --project responsive-tiles

# Project registration
fitb register --project new-project --initial-stage PRE_REGISTER
fitb unregister --project old-project [--cleanup]
fitb list-registered [--show-sync-status]
```

## 6. Error Handling & Recovery

### Robust Error Management:
```javascript
class WatcherErrorHandler {
  async handleDeploymentError(error, context) {
    // Log error with full context
    await this.logError('deployment', error, context);
    
    // Attempt recovery strategies
    const recovery = await this.attemptRecovery(error, context);
    
    // Notify if recovery fails
    if (!recovery.success) {
      await this.notifyFailure(error, context, recovery);
    }
    
    return recovery;
  }

  async attemptRecovery(error, context) {
    if (error.code === 'ENOENT') {
      // Missing target directory - create it
      await fs.ensureDir(path.dirname(context.targetPath));
      return { success: true, strategy: 'created-missing-directory' };
    }
    
    if (error.code === 'EACCES') {
      // Permission error - attempt chmod
      try {
        await fs.chmod(context.targetPath, 0o644);
        return { success: true, strategy: 'fixed-permissions' };
      } catch (chmodError) {
        return { success: false, strategy: 'permission-fix-failed', error: chmodError };
      }
    }
    
    return { success: false, strategy: 'no-recovery-available' };
  }
}
```

This detailed architecture provides:
- **Robust deployment** with backup/recovery
- **Development tracking** with change indexing  
- **Flexible promotion** system with oneshot testing
- **Comprehensive error handling**
- **Rich CLI interface** for all operations

Which component would you like me to dive deeper into next?