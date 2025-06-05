# Hybrid Sync Implementation Plan

## 🎯 Overview
This document outlines the implementation details for the hybrid sync approach using a PERMA-TICKET as a notification beacon.

## 🏗️ Implementation Steps

### Step 1: Create PERMA-TICKET in GitHub Project

```yaml
Title: 🔄 SYNC-BEACON [DO NOT CLOSE]
Labels: [perma-ticket, sync-system]
Status: No Status (Never moves)
Description: |
  This ticket serves as a notification beacon between Claude Desktop and Claude Code.
  
  DO NOT DELETE OR CLOSE THIS TICKET
  
  Last Update: [Will be updated by sync system]
  Direction: [Will be updated by sync system]
  Files Changed: [Will be updated by sync system]
```

### Step 2: Create Enhanced Directory Structure

```bash
cd /Users/LenMiller/code/banno/fi-toolbox

# Create new sync directories
mkdir -p .claude/planning/session-notes
mkdir -p .claude/implementation
mkdir -p .claude/sync

# Move existing files to proper locations
mv .claude/prompts/*.md .claude/planning/
```

### Step 3: Create ps-sync Script

```bash
#!/bin/bash
# .claude/sync/ps-sync.sh

PROJECT_ID="PVT_kwHOAALNNc4A6pIX"
SYNC_TICKET_NUMBER="[TBD after creation]"
CLAUDE_DIR="$(pwd)/.claude"

case "$1" in
  "status")
    echo "🔍 Checking SYNC-BEACON status..."
    gh issue view $SYNC_TICKET_NUMBER \
      --repo lennylmiller/PromptSync-Professional-Roadmap \
      --json body,updatedAt \
      --jq '.body'
    ;;
    
  "pull")
    echo "📥 Pulling updates from Desktop..."
    
    # Read manifest
    MANIFEST=$(gh issue view $SYNC_TICKET_NUMBER \
      --repo lennylmiller/PromptSync-Professional-Roadmap \
      --json body \
      --jq '.body')
    
    # Parse files to sync
    FILES=$(echo "$MANIFEST" | grep "FILES_UPDATED:" -A 10 | grep "  -" | sed 's/  - //')
    
    # Sync each file
    for file in $FILES; do
      echo "  ↓ Syncing $file"
      # Implementation depends on storage mechanism
    done
    
    # Clear beacon
    gh issue edit $SYNC_TICKET_NUMBER \
      --repo lennylmiller/PromptSync-Professional-Roadmap \
      --body "$(cat $CLAUDE_DIR/sync/beacon-template.md)"
    
    echo "✅ Sync complete!"
    ;;
    
  "push")
    echo "📤 Pushing updates to Desktop..."
    # Reverse flow implementation
    ;;
    
  "watch")
    echo "👀 Watching for changes..."
    while true; do
      $0 status | grep -q "Update Available" && $0 pull
      sleep 60
    done
    ;;
    
  *)
    echo "Usage: ps-sync [status|pull|push|watch]"
    exit 1
    ;;
esac
```

### Step 4: Create Beacon Template

```markdown
# .claude/sync/beacon-template.md

---
LAST_UPDATE: None
TIMESTAMP: None
DIRECTION: None
FILES_UPDATED: None
ACTION: Waiting for updates
STATUS: IDLE
---

This ticket serves as a notification beacon between Claude Desktop and Claude Code.
DO NOT DELETE OR CLOSE THIS TICKET.
```

### Step 5: VSCode Integration

```json
// .vscode/settings.json
{
  "terminal.integrated.env.osx": {
    "PROMPTSYNC_AUTO_SYNC": "true"
  },
  "terminal.integrated.profiles.osx": {
    "promptsync-shell": {
      "path": "zsh",
      "args": ["-c", "ps-sync pull; exec zsh"]
    }
  }
}
```

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "PromptSync: Check for Updates",
      "type": "shell",
      "command": "ps-sync status",
      "group": "none",
      "presentation": {
        "reveal": "always",
        "panel": "dedicated"
      }
    },
    {
      "label": "PromptSync: Pull Updates",
      "type": "shell",
      "command": "ps-sync pull",
      "group": "none",
      "runOptions": {
        "runOn": "folderOpen"
      }
    }
  ]
}
```

### Step 6: Claude Desktop Workflow Helper

Create a helper artifact in Claude Desktop sessions:

```markdown
# Quick Sync Commands

## After updating artifacts:
1. Note which files changed
2. Update PERMA-TICKET:

gh issue edit [SYNC_TICKET_NUMBER] \
  --repo lennylmiller/PromptSync-Professional-Roadmap \
  --body "---
LAST_UPDATE: Session 3 - Added Act 2
TIMESTAMP: $(date -u +%Y-%m-%dT%H:%M:%SZ)
DIRECTION: Desktop→Code
FILES_UPDATED:
  - promptsync-progress.md
  - act-2-planning.md
ACTION: Run 'ps-sync pull' in Claude Code
STATUS: UPDATE_AVAILABLE
---"
```

## 🔄 Daily Workflow

### Morning Planning (Claude Desktop)
1. Create/update planning artifacts
2. Save to `.claude/planning/`
3. Update SYNC-BEACON with file list
4. Switch to VSCode

### Implementation (Claude Code)
1. VSCode opens → auto-runs `ps-sync pull`
2. See new planning files in project tree
3. Work with Claude Code referencing plans
4. Implementation files saved to `.claude/implementation/`

### End of Day
1. Run `ps-sync push` if needed
2. Commit all changes to Git
3. SYNC-BEACON returns to IDLE state

## 🎯 Success Criteria

- [ ] No manual copy/paste between environments
- [ ] Planning docs appear automatically in VSCode
- [ ] Clear visual indicator of sync status
- [ ] Full Git history of all changes
- [ ] Works offline (sync when ready)

## 🚀 Future Enhancements

1. **Bidirectional Auto-Sync**
   - File watchers in both directions
   - Conflict resolution UI

2. **Multi-Session Support**
   - Queue multiple updates
   - Session branching

3. **Team Sync**
   - Share planning sessions
   - Collaborative workflows

---

*This implementation provides a practical, low-friction sync mechanism that fits naturally into the planning→implementation workflow.*