# Documentation Collection Management

## Overview
The doc-snapshot-tool now supports Git-based collection switching between DEV and PROD documentation sets.

## Key Concepts

- **DEV Collection**: Full documentation set (all markdown files)
- **PROD Collection**: Minimal set of 18 essential files for public documentation
- **Git Branches**: Collections are managed via dedicated branches:
  - `idea/main-documents` - DEV collection baseline
  - `idea/main-documents-prod` - PROD collection (subset)

## Commands

### Check Current Status
```bash
node doc-snapshot-tool.js status
```
Shows:
- Current Git branch
- Active collection (DEV/PROD)
- File counts
- Available actions

### Switch to PROD Collection
```bash
node doc-snapshot-tool.js switch prod
```
- Creates `idea/main-documents-prod` branch if needed
- Removes all non-PROD documentation files
- Updates `.collection-state` tracking file

### Switch to DEV Collection
```bash
node doc-snapshot-tool.js switch dev
```
- Switches to `idea/main-documents` branch
- Restores full documentation set
- Updates collection state

## Safety Features

1. **Uncommitted Changes Check**: Prevents switching with uncommitted changes
2. **State Tracking**: `.collection-state` file tracks active collection
3. **Branch Initialization**: Automatically creates branches on first use
4. **Git Integration**: All changes tracked in Git history

## Workflow Example

```bash
# 1. Check current state
node doc-snapshot-tool.js status

# 2. Switch to PROD for release preparation
node doc-snapshot-tool.js switch prod

# 3. Run documentation build/tests
npm run docs
npm run docs:serve

# 4. Switch back to DEV for continued development
node doc-snapshot-tool.js switch dev
```

## PROD Documentation Files (18 total)

The PROD collection includes only these essential files:
- README.md
- docs/ARCHITECTURE.md
- docs/COMPONENTS.md
- docs/DEVELOPMENT.md
- docs/PERFORMANCE.md
- docs/CONFIGURATION.md
- docs/CONTAINER-LAYOUT.md
- docs/DEVELOPER-TOOLS.md
- docs/TROUBLESHOOTING.md
- docs/CONTRIBUTING.md
- docs/GITHUB-WORKFLOW.md
- docs/EMBED-IMAGES.md
- docs/SEMANTIC-RELEASE.md
- docs/guides/API-INTEGRATION.md
- docs/guides/STATE-MANAGEMENT.md
- docs/guides/TESTING.md
- docs/workflows/GCP-DEPLOYMENT.md
- docs/workflows/LOCAL-TESTING.md

## Implementation Notes

- First-time setup creates `idea/main-documents` from current branch
- PROD branch is created by removing non-essential files from DEV
- Collection state persists across terminal sessions
- Compatible with existing snapshot functionality