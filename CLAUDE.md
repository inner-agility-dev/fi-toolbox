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

# Daily workflow automation
bun run src/scripts/morning-standup.ts
bun run src/scripts/start-my-day.ts
bun run src/scripts/complete-task.ts
```

## High-Level Architecture

### Project Lifecycle Management
The fi-toolbox enforces a structured progression through project stages:
1. **RND (Research)**: Initial exploration and proof-of-concept
2. **PRD (Product Requirements)**: Documented requirements and specifications
3. **SDLC (Development)**: Active development with SCRUM methodology
4. **MAINTENANCE**: Ongoing support and updates

Each stage transition requires specific documentation and GitHub Project creation.

### Key Components

1. **Claude Integration Layer** (`.claude/claude_update/commands/`)
   - Custom slash commands for repository synchronization
   - Handles complex multi-branch Git workflows
   - Syncs between `lenny-miller` and `lennylmiller` repositories

2. **orchestr8r-mcp**
   - MCP server providing 29 GitHub Projects v2 tools
   - GraphQL-first GitHub API integration
   - Automated daily workflow scripts

3. **Git Workflow Management**
   - Bidirectional repository synchronization
   - Configurable merge/rebase strategies
   - Protected branch handling

## Environment Setup

Create `.env` file in orchestr8r-mcp directory:
```
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
```

## Important Notes

- The main working branch is `main-lennylmiller` (not `inner-agility-dev/fi-toolbox`)
- All projects must have an associated GitHub Project using SCRUM methodology
- Symlinked directories (orchestr8r-mcp, responsive-tiles) should be treated as external dependencies
- The sync-repos command manages complex Git workflows between two separate GitHub accounts