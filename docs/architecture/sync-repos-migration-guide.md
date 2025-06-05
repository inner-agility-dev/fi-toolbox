# sync-repos.js Migration Guide

## Overview

This document provides a comprehensive analysis of the current `sync-repos.js` implementation to support AGENT-1's migration to TypeScript/Oclif. The sync-repos command is a critical component of fi-toolbox that manages bidirectional synchronization between two GitHub repositories across different accounts.

## Current Implementation Analysis

### Core Functionality

The `sync-repos.js` script provides bidirectional Git synchronization between:
- **Source (R&D)**: `inner-agility-dev` repository (lenny-miller account)
- **Target (Production)**: `lennylmiller` repository (lennylmiller account)

### Command Structure

```bash
/sync-repos [options]

Options:
  --direction=forward|reverse  # Sync direction (default: forward)
  -r, --reverse               # Sync from lennylmiller to lenny-miller
  -m, --merge                 # Use merge instead of rebase (default: rebase)
  -n, --no-push              # Don't push after sync
  -l, --no-pull              # Don't pull before sync
  -s, --status               # Show sync status only
  -h, --help                 # Show help
```

### Key Features

1. **Bidirectional Synchronization**
   - Forward: `inner-agility-dev` → `lennylmiller`
   - Reverse: `lennylmiller` → `inner-agility-dev`

2. **Merge Strategies**
   - Rebase (default): Maintains linear history
   - Merge: Preserves branch topology

3. **Operation Control**
   - Pull control: Can skip pulling latest changes
   - Push control: Can perform local-only operations

4. **Status Reporting**
   - Branch status visualization
   - Remote configuration display
   - Commit difference calculation

### Implementation Details

#### 1. Argument Parsing (lines 5-21)
```javascript
// Current implementation uses manual parsing
args.forEach(arg => {
  if (arg.startsWith('--')) {
    // Long format: --key=value or --flag
  } else if (arg.startsWith('-')) {
    // Short format: -r, -m, etc.
  }
});
```

**Migration Note**: Oclif provides built-in argument and flag parsing with type safety.

#### 2. Git Command Wrapper (lines 24-32)
```javascript
function git(command) {
  try {
    return execSync(`git ${command}`, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Error running: git ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}
```

**Migration Note**: Should be extracted to a Git service class with proper error handling and logging.

#### 3. Sync Workflow

##### Forward Sync (inner-agility-dev → lennylmiller)
1. Switch to `main-rnd` branch
2. Pull latest from `inner-agility-dev/main`
3. Switch to `main-prod` branch
4. Merge/rebase `main-rnd` into `main-prod`
5. Push to `lennylmiller/main`

##### Reverse Sync (lennylmiller → inner-agility-dev)
1. Switch to `main-prod` branch
2. Pull latest from `lennylmiller/main`
3. Switch to `main-rnd` branch
4. Merge/rebase `main-prod` into `main-rnd`
5. Push to `inner-agility-dev/main`

#### 4. Error Handling

- Basic try-catch with process exit codes
- Attempts to return to original branch on failure
- Simple error messages to console

### Critical Business Logic

1. **Branch Mapping**
   - `main-rnd` ← → `inner-agility-dev/main`
   - `main-prod` ← → `lennylmiller/main`

2. **Remote Configuration**
   - Expects `inner-agility-dev` remote configured
   - Expects `lennylmiller` remote configured

3. **Safety Features**
   - Preserves original branch context
   - Fetches all remotes before status check
   - Non-destructive status operations

## Migration Considerations for TypeScript/Oclif

### 1. Command Class Structure

```typescript
import { Command, Flags } from '@oclif/core'
import { GitService } from '../../services/git'
import { SyncService } from '../../services/sync'

export default class SyncRepos extends Command {
  static description = 'Sync between inner-agility-dev and lennylmiller repositories'
  
  static flags = {
    direction: Flags.string({
      description: 'Sync direction',
      options: ['forward', 'reverse'],
      default: 'forward'
    }),
    reverse: Flags.boolean({
      char: 'r',
      description: 'Sync from lennylmiller to lenny-miller'
    }),
    merge: Flags.boolean({
      char: 'm',
      description: 'Use merge instead of rebase'
    }),
    'no-push': Flags.boolean({
      char: 'n',
      description: "Don't push after sync"
    }),
    'no-pull': Flags.boolean({
      char: 'l',
      description: "Don't pull before sync"
    }),
    status: Flags.boolean({
      char: 's',
      description: 'Show sync status only'
    })
  }
}
```

### 2. Service Layer Architecture

```typescript
// GitService: Low-level Git operations
interface GitService {
  execute(command: string): Promise<string>
  getCurrentBranch(): Promise<string>
  checkout(branch: string): Promise<void>
  pull(remote: string, branch: string): Promise<void>
  push(remote: string, refspec: string): Promise<void>
  merge(branch: string): Promise<void>
  rebase(branch: string): Promise<void>
}

// SyncService: High-level sync operations
interface SyncService {
  syncForward(options: SyncOptions): Promise<void>
  syncReverse(options: SyncOptions): Promise<void>
  getStatus(): Promise<SyncStatus>
}
```

### 3. Configuration Management

```typescript
interface SyncConfig {
  repositories: {
    rnd: {
      remote: string
      branch: string
      localBranch: string
    }
    production: {
      remote: string
      branch: string
      localBranch: string
    }
  }
  defaults: {
    strategy: 'rebase' | 'merge'
    autoPull: boolean
    autoPush: boolean
  }
}
```

### 4. Error Handling Enhancement

```typescript
class SyncError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message)
  }
}

// Specific error types
class GitOperationError extends SyncError {}
class RemoteNotFoundError extends SyncError {}
class BranchNotFoundError extends SyncError {}
class ConflictError extends SyncError {}
```

### 5. Logging and Progress

```typescript
interface SyncProgress {
  onStepStart(step: string): void
  onStepComplete(step: string): void
  onError(error: Error): void
}
```

## Testing Requirements

### Unit Tests
- Git command wrapper functionality
- Argument parsing and validation
- Branch mapping logic
- Error handling scenarios

### Integration Tests
- Full sync workflow (with test repositories)
- Conflict resolution scenarios
- Network failure handling
- Authentication switching

### Edge Cases to Test
1. Conflicts during merge/rebase
2. Missing remotes
3. Uncommitted changes
4. Detached HEAD state
5. Network interruptions
6. Invalid branch names
7. Concurrent sync operations

## Security Considerations

1. **Credential Management**
   - No hardcoded credentials
   - Use system Git credential helpers
   - Support for SSH and HTTPS

2. **Input Validation**
   - Sanitize branch names
   - Validate remote URLs
   - Prevent command injection

3. **Audit Logging**
   - Log all sync operations
   - Track who initiated syncs
   - Record success/failure states

## Performance Optimizations

1. **Parallel Operations**
   - Fetch remotes concurrently
   - Optimize status checks

2. **Caching**
   - Cache remote configurations
   - Store last sync timestamps

3. **Progress Reporting**
   - Show transfer progress
   - Estimate completion time

## Backward Compatibility

The migrated TypeScript version must maintain:
1. Same command-line interface
2. Compatible with existing Git configurations
3. Same default behaviors
4. Preserve all current flags and options

## Migration Checklist for AGENT-1

- [ ] Create Oclif command structure
- [ ] Implement GitService with all Git operations
- [ ] Implement SyncService with business logic
- [ ] Add comprehensive error handling
- [ ] Create unit tests for all components
- [ ] Add integration tests for workflows
- [ ] Implement progress reporting
- [ ] Add configuration management
- [ ] Create migration script for existing users
- [ ] Document breaking changes (if any)
- [ ] Update fi-toolbox documentation

## Coordination with AGENT-2

This migration guide provides the necessary context for AGENT-1 to understand the current implementation. The migrated TypeScript/Oclif version should:

1. Maintain the exact same user interface
2. Improve error handling and reporting
3. Add type safety throughout
4. Enable easier testing and maintenance
5. Prepare for future enhancements (file watcher integration)

The architecture documented here aligns with the overall fi-toolbox architecture, ensuring the sync-repos functionality integrates seamlessly with the broader CLI ecosystem.