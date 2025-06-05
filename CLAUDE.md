# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

The **fi-toolbox** (Financial Institution Toolbox) is a comprehensive project management and orchestration system for Banno projects. It integrates Git workflow management, AI-powered project orchestration via MCP, and enforces SCRUM methodology across all projects.

## Repository Structure

```
fi-toolbox/
├── .claude/claude_update/commands/  # Custom Claude commands
│   ├── index.json                  # Command registry
│   └── sync-repos.js              # Repository synchronization script
├── orchestr8r-mcp/                # MCP server for GitHub Projects (symlink)
├── responsive-tiles/              # Active project (symlink)
├── artifacts/                     # Project lifecycle artifacts
│   └── {project-name}/           # Project-specific directories
│       ├── 1-PRE_REGISTER/       # Pre-registration phase
│       ├── 2-REGISTERING/        # Registration phase
│       ├── 3-REGISTERED/         # Post-registration
│       ├── 4-RND/               # Research & Development
│       ├── 5-PRD/               # Product Requirements
│       └── 6-SDLC/              # Software Development
├── projects/                      # Active project workspaces
│   └── responsive-tiles/
│       ├── tools/               # Project tools
│       │   └── doc-snapshot-tool.js  # Documentation snapshot tool
│       ├── config/              # Project configuration
│       └── results/             # Snapshot results
└── -analysis/                     # Project analysis and documentation
```

## Common Development Commands

### Repository Synchronization
```bash
# Forward sync (lenny-miller → lennylmiller)
/sync-repos

# Reverse sync (lennylmiller → lenny-miller)
/sync-repos -r

# Use merge instead of rebase
/sync-repos --merge

# Check sync status
/sync-repos --status
```

### GitHub Authentication Management
```bash
# Switch to R&D context (lenny-miller account)
/gh-auth rnd

# Switch to Production context (lennylmiller account)
/gh-auth prod

# Check current authentication status
/gh-auth status
```

**Important Notes:**
- R&D repository (`inner-agility-dev`) uses `gh` CLI with `lenny-miller` account
- Production repository (`lennylmiller`) uses SSH authentication with `lennylmiller` account
- Always switch to the correct auth context before GitHub operations

### orchestr8r-mcp Development
```bash
cd orchestr8r-mcp
bun install
bun run build              # Build with GraphQL codegen
bun run dev               # Development mode with inspector
bun test                  # Run tests
bun test --watch         # Watch mode for tests
bun test tests/operations/projects.test.ts  # Run specific test

# Daily workflow automation
bun run src/scripts/morning-standup.ts
bun run src/scripts/start-my-day.ts
bun run src/scripts/complete-task.ts
```

### Documentation Snapshot Tool
```bash
cd projects/responsive-tiles/tools

# Create a documentation snapshot
node doc-snapshot-tool.js snapshot

# List existing snapshots
node doc-snapshot-tool.js list

# Compare snapshots (if implemented)
node doc-snapshot-tool.js compare <snapshot-id-1> <snapshot-id-2>
```

**Setup Note**: Create a symbolic link at `fi-toolbox/projects/responsive-tiles/project` pointing to your responsive-tiles project directory before using the snapshot tool.

## High-Level Architecture

### Project Lifecycle Management
The fi-toolbox enforces a structured progression through project stages:
1. **PRE_REGISTER**: Initial project setup and planning
2. **REGISTERING**: GitHub Project creation and SCRUM setup
3. **REGISTERED**: Active project tracking begins
4. **RND (Research)**: Initial exploration and proof-of-concept (3-day sprints)
5. **PRD (Product Requirements)**: Documented requirements and specifications (1-week sprints)
6. **SDLC (Development)**: Active development with SCRUM methodology (2-week sprints)
7. **MAINTENANCE**: Ongoing support and updates

Each stage transition requires specific documentation and GitHub Project creation with stage-appropriate SCRUM configurations.

### Key Components

1. **Claude Integration Layer** (`.claude/claude_update/commands/`)
   - Custom slash commands for repository synchronization
   - Handles complex multi-branch Git workflows
   - Syncs between `lenny-miller` and `lennylmiller` repositories
   - Authentication context switching for multi-account workflows

2. **orchestr8r-mcp**
   - MCP server providing 29 GitHub Projects v2 tools
   - GraphQL-first GitHub API integration
   - Automated daily workflow scripts
   - TypeScript-based with full type safety

3. **Git Workflow Management**
   - Bidirectional repository synchronization
   - Configurable merge/rebase strategies
   - Protected branch handling
   - Multi-account GitHub management

4. **Documentation Management**
   - Cross-project documentation snapshot tool
   - Stage-specific documentation requirements
   - Source of Truth Documentation (SOTD) pattern
   - Documentation-Driven Development approach

### SCRUM Stage Configurations

- **RND**: 3-day sprints, daily check-ins, no retrospectives
- **PRD**: 1-week sprints, 2x/week stand-ups, weekly retrospectives
- **SDLC**: 2-week sprints, daily stand-ups, sprint retrospectives
- **MAINTENANCE**: As-needed, kanban-style flow

## Environment Setup

Create `.env` file in orchestr8r-mcp directory:
```
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
```

## Important Notes

- The main working branch is `main-rnd` (for R&D) or `main-lennylmiller` (for production)
- All projects must have an associated GitHub Project using SCRUM methodology
- Symlinked directories (orchestr8r-mcp, responsive-tiles) should be treated as external dependencies
- The sync-repos command manages complex Git workflows between two separate GitHub accounts
- Documentation snapshots enable cross-project documentation management and promotion workflows