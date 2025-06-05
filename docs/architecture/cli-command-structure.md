# FI-Toolbox CLI Command Structure

## Overview

The fi-toolbox CLI follows a hierarchical command structure built on the Oclif framework. This document defines the complete command taxonomy, argument patterns, and usage examples for all CLI operations.

## Command Hierarchy

```
fitb
├── sync
│   └── repos         # Repository synchronization
├── gh
│   └── auth         # GitHub authentication management
├── project
│   ├── create       # Create new project
│   ├── list         # List projects
│   ├── status       # Project status
│   ├── stage        # Manage project stages
│   └── archive      # Archive project
├── task
│   ├── create       # Create task
│   ├── list         # List tasks
│   ├── assign       # Assign task
│   ├── move         # Move task status
│   ├── complete     # Complete task
│   └── delete       # Delete task
├── sprint
│   ├── start        # Start new sprint
│   ├── plan         # Sprint planning
│   ├── standup      # Daily standup
│   ├── review       # Sprint review
│   └── close        # Close sprint
├── doc
│   ├── snapshot     # Create documentation snapshot
│   ├── list         # List snapshots
│   └── compare      # Compare snapshots
└── config
    ├── get          # Get configuration
    ├── set          # Set configuration
    └── list         # List all configs
```

## Command Specifications

### 1. Repository Synchronization Commands

#### fitb sync repos

Synchronize repositories between R&D and production environments.

```bash
fitb sync repos [OPTIONS]

Options:
  -d, --direction=<value>    [default: forward] Sync direction (forward|reverse)
  -r, --reverse             Sync from production to R&D
  -m, --merge               Use merge instead of rebase
  -n, --no-push            Skip push after sync
  -l, --no-pull            Skip pull before sync
  -s, --status             Show sync status only
  --dry-run                Preview changes without applying

Examples:
  $ fitb sync repos                    # Forward sync with defaults
  $ fitb sync repos --reverse          # Reverse sync
  $ fitb sync repos --status           # Check sync status
  $ fitb sync repos --merge --no-push  # Local merge only
```

### 2. GitHub Authentication Commands

#### fitb gh auth

Manage GitHub authentication contexts for multi-account workflows.

```bash
fitb gh auth SUBCOMMAND

Subcommands:
  switch    Switch authentication context
  status    Show current authentication
  list      List available contexts
  add       Add new context
  remove    Remove context

Examples:
  $ fitb gh auth switch --context prod   # Switch to production
  $ fitb gh auth switch --context rnd    # Switch to R&D
  $ fitb gh auth status                  # Show current auth
  $ fitb gh auth add --name custom       # Add custom context
```

### 3. Project Management Commands

#### fitb project create

Create a new project with SCRUM configuration.

```bash
fitb project create [OPTIONS]

Options:
  -n, --name=<value>        (required) Project name
  -s, --stage=<value>       [default: RND] Initial stage
  -d, --description=<value> Project description
  -t, --template=<value>    Project template
  --no-github              Skip GitHub project creation

Examples:
  $ fitb project create --name "New Feature" --stage RND
  $ fitb project create -n "API Update" -s PRD -d "REST to GraphQL"
  $ fitb project create --name "Bug Fix" --template hotfix
```

#### fitb project list

List all projects with filtering options.

```bash
fitb project list [OPTIONS]

Options:
  -s, --stage=<value>       Filter by stage
  -a, --active              Show only active projects
  --archived                Show only archived projects
  --format=<value>          Output format (table|json|csv)

Examples:
  $ fitb project list                    # List all projects
  $ fitb project list --stage SDLC       # List SDLC projects
  $ fitb project list --active --format json
```

#### fitb project stage

Manage project stage transitions.

```bash
fitb project stage SUBCOMMAND PROJECT_ID

Subcommands:
  advance    Move to next stage
  set        Set specific stage
  validate   Check stage requirements

Options:
  -f, --force              Force stage change
  --skip-validation        Skip requirement checks

Examples:
  $ fitb project stage advance proj-123
  $ fitb project stage set proj-123 --stage PRD
  $ fitb project stage validate proj-123
```

### 4. Task Management Commands

#### fitb task create

Create a new task in a project.

```bash
fitb task create [OPTIONS]

Options:
  -p, --project=<value>     (required) Project ID
  -t, --title=<value>       (required) Task title
  -d, --description=<value> Task description
  -a, --assignee=<value>    Assign to user
  -l, --labels=<value>      Comma-separated labels
  --ai                      Use AI to enhance task

Examples:
  $ fitb task create -p proj-123 -t "Implement login"
  $ fitb task create --project proj-123 --title "Fix bug" --ai
  $ fitb task create -p proj-123 -t "Update docs" -a @john -l "docs,urgent"
```

#### fitb task move

Move task between status columns.

```bash
fitb task move TASK_ID STATUS

Arguments:
  TASK_ID    Task identifier
  STATUS     Target status (todo|in-progress|review|done)

Options:
  -c, --comment=<value>    Add comment with move

Examples:
  $ fitb task move task-456 in-progress
  $ fitb task move task-456 review --comment "Ready for review"
```

### 5. Sprint Management Commands

#### fitb sprint start

Start a new sprint for a project.

```bash
fitb sprint start PROJECT_ID [OPTIONS]

Options:
  -n, --name=<value>        Sprint name
  -d, --duration=<value>    Sprint duration
  -g, --goal=<value>        Sprint goal
  --start-date=<value>      Custom start date

Examples:
  $ fitb sprint start proj-123 --name "Sprint 15" --duration "2 weeks"
  $ fitb sprint start proj-123 -n "Hotfix Sprint" -d "3 days"
```

#### fitb sprint standup

Run daily standup report.

```bash
fitb sprint standup [PROJECT_ID] [OPTIONS]

Options:
  -t, --team=<value>        Filter by team
  -u, --user=<value>        Filter by user
  --format=<value>          Output format
  --ai-summary              Generate AI summary

Examples:
  $ fitb sprint standup                  # All active sprints
  $ fitb sprint standup proj-123         # Specific project
  $ fitb sprint standup --ai-summary    # With AI insights
```

### 6. Documentation Commands

#### fitb doc snapshot

Create a documentation snapshot.

```bash
fitb doc snapshot [OPTIONS]

Options:
  -p, --project=<value>     Project to snapshot
  -c, --collection=<value>  [default: dev] Collection (dev|prod)
  -t, --tag=<value>         Tag snapshot
  --include=<value>         Include patterns
  --exclude=<value>         Exclude patterns

Examples:
  $ fitb doc snapshot                    # Snapshot current project
  $ fitb doc snapshot --project responsive-tiles --tag "v1.0"
  $ fitb doc snapshot --collection prod --include "*.md"
```

### 7. Configuration Commands

#### fitb config set

Set configuration values.

```bash
fitb config set KEY VALUE [OPTIONS]

Options:
  -g, --global             Set global config
  -p, --project=<value>    Set project config
  --type=<value>           Value type (string|number|boolean|json)

Examples:
  $ fitb config set defaultStage RND
  $ fitb config set github.timeout 30000 --type number
  $ fitb config set sync.strategy merge --project proj-123
```

## Global Options

Available for all commands:

```bash
Global Options:
  --help                   Show help
  --version               Show version
  --config=<value>        Config file location
  --debug                 Enable debug output
  --quiet                 Suppress output
  --no-color             Disable colored output
  --json                  Output as JSON
```

## Command Aliases

Common shortcuts for frequently used commands:

```bash
# Sync aliases
fitb sync  →  fitb sync repos

# Task aliases  
fitb t     →  fitb task
fitb tc    →  fitb task create
fitb tl    →  fitb task list

# Project aliases
fitb p     →  fitb project
fitb pc    →  fitb project create
fitb ps    →  fitb project status

# Sprint aliases
fitb s     →  fitb sprint
fitb ss    →  fitb sprint standup
```

## Interactive Mode

Some commands support interactive mode when required options are omitted:

```bash
$ fitb project create
? Project name: My New Project
? Initial stage: (Use arrow keys)
❯ RND - Research & Development
  PRD - Product Requirements
  SDLC - Development
? Description: A new feature project
```

## Command Plugins

fi-toolbox supports command plugins for extensibility:

```typescript
// Plugin structure
export default class MyCommand extends Command {
  static description = 'Custom command description'
  
  static flags = {
    custom: Flags.string({
      description: 'Custom flag'
    })
  }
  
  async run() {
    // Command implementation
  }
}
```

## Error Handling

All commands follow consistent error handling:

```bash
# Validation errors
Error: Missing required flag --project
Try: fitb task create --help

# Operational errors  
Error: GitHub API rate limit exceeded
Retry in: 45 minutes

# Configuration errors
Error: No authentication context found
Run: fitb gh auth switch --context prod
```

## Environment Variables

Commands respect these environment variables:

```bash
FITB_CONFIG_DIR      # Configuration directory
FITB_CACHE_DIR       # Cache directory
FITB_LOG_LEVEL       # Log level (debug|info|warn|error)
GITHUB_TOKEN         # GitHub authentication
NO_COLOR             # Disable colors
FITB_SKIP_UPDATE     # Skip update checks
```

## Command Completion

Shell completion is available for bash, zsh, and fish:

```bash
# Setup completion
$ fitb completion:generate --shell zsh > ~/.fitb_completion
$ source ~/.fitb_completion

# Usage
$ fitb proj<TAB>
project
$ fitb project cr<TAB>
create
```

## Best Practices

1. **Use long flags in scripts**: `--name` instead of `-n`
2. **Check exit codes**: Non-zero indicates failure
3. **Use --json for automation**: Machine-readable output
4. **Leverage --dry-run**: Preview dangerous operations
5. **Set up aliases**: For frequently used commands

## Future Commands

Planned additions to the CLI:

- `fitb ai assist` - AI-powered command suggestions
- `fitb workflow create` - Custom workflow automation
- `fitb metrics show` - Project metrics and analytics
- `fitb team manage` - Team management operations
- `fitb audit log` - Security audit trail