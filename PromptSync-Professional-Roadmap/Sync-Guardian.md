# PromptSync Sync Guardian 🔄
*Ensuring Chat Artifacts Stay Synchronized with Local Files*

## 🎯 Purpose
This guardian ensures that whenever artifacts are updated in Claude chat, the corresponding files in `/Users/LenMiller/code/banno/fi-toolbox/.claude` are kept in sync.

## 📁 Sync Mappings

### Primary Sync Targets
| Chat Artifact | Local File | Sync Priority |
|--------------|------------|---------------|
| `PromptSync Progress Tracker & Session Strategy` | `.claude/prompts/promptsync-progress.md` | 🔴 Critical |
| `PromptSync Professional Roadmap - Complete Trajectory` | `.claude/prompts/promptsync-roadmap.md` | 🔴 Critical |
| `PromptSync Sync Guardian` (this file) | `.claude/commands/sync-state.md` | 🟡 Important |

### Secondary Sync Targets
- `.claude/commands/ps-load-next.md` - Update when Act loading strategy changes
- `.claude/config.json` - Update when project metadata changes
- `.claude/QUICK-START.md` - Update when onboarding process changes

## 🔄 Sync Protocol

### On Every Artifact CRUD Operation:

#### 1. CREATE Operation
```markdown
When creating a new artifact:
1. Check if it relates to PromptSync
2. Determine appropriate local file location
3. Add to sync mapping table above
4. Create corresponding local file command:
   - Use: `/create-local-file path/to/file.md`
```

#### 2. UPDATE Operation  
```markdown
When updating an artifact:
1. Note the specific changes made
2. Generate update command for local file:
   - Use: `/update-local-file path/to/file.md`
3. Track update in Session Log below
```

#### 3. DELETE Operation
```markdown
When deleting an artifact:
1. Archive content first (never lose data)
2. Mark corresponding local file for review
3. Do NOT auto-delete local files
```

## 📝 Session Sync Log

### Session 3 (January 10, 2025)
- [ ] **UPDATE**: `promptsync-progress.md` 
  - Changed: Session 2 → Session 3
  - Added: Progress visualization (42% complete)
  - Updated: Act counts (20/47 items)
  - Modified: Strategy from "Batch Operations" to "Two-Act Focus"
  - **Action Required**: Run `/update-local-file .claude/prompts/promptsync-progress.md`

## 🚨 Sync Commands

### After Any Artifact Update
```bash
# 1. First, verify what changed
/compare-artifacts

# 2. Update the specific local file
/update-local-file .claude/prompts/promptsync-progress.md

# 3. Verify sync succeeded
/verify-sync promptsync-progress.md
```

### Bulk Sync (End of Session)
```bash
# Sync all PromptSync-related files
/sync-promptsync-artifacts

# Generate sync report
/sync-report
```

## 🔐 Sync Guarantees

### Critical Rules
1. **Never Lose Data**: Always backup before overwrite
2. **Track Every Change**: Log all sync operations
3. **Human Verification**: Require confirmation for destructive ops
4. **Bidirectional Awareness**: Check for local changes before sync

### Sync Verification Checklist
- [ ] Artifact change detected
- [ ] Local file path confirmed
- [ ] Backup created (if updating)
- [ ] Sync command executed
- [ ] Verification completed
- [ ] Session log updated

## 🤖 Automation Opportunities

### Future Enhancement: Auto-Sync Script
```javascript
// .claude/scripts/auto-sync.js
const syncConfig = {
  artifacts: {
    'promptsync-progress-tracker': '.claude/prompts/promptsync-progress.md',
    'promptsync-roadmap': '.claude/prompts/promptsync-roadmap.md'
  },
  
  onUpdate: (artifactId, changes) => {
    const localPath = syncConfig.artifacts[artifactId];
    if (localPath) {
      backupFile(localPath);
      updateFile(localPath, changes);
      logSync(artifactId, localPath, changes);
    }
  }
};
```

## 📊 Sync Status Dashboard

### Current Sync State
| File | Last Synced | Status | Action |
|------|-------------|--------|--------|
| `promptsync-progress.md` | Session 2 | ⚠️ Out of Sync | Needs update from Session 3 |
| `promptsync-roadmap.md` | Session 2 | ✅ In Sync | No changes |
| `ps-load-next.md` | Session 2 | ✅ In Sync | No changes |

## 🔄 Manual Sync Instructions

### To Sync Progress Tracker Right Now:
1. Copy the entire content of the updated Progress Tracker artifact
2. Run: `cd /Users/LenMiller/code/banno/fi-toolbox`
3. Run: `cp .claude/prompts/promptsync-progress.md .claude/prompts/promptsync-progress.backup`
4. Paste the new content into `.claude/prompts/promptsync-progress.md`
5. Verify with: `diff .claude/prompts/promptsync-progress.backup .claude/prompts/promptsync-progress.md`

## 🎯 Next Actions
1. Update local `promptsync-progress.md` with Session 3 changes
2. Consider creating an auto-sync script
3. Set up file watchers for bidirectional sync
4. Create sync verification tests

---

**Remember**: This guardian is your safety net. Check it after every artifact operation to ensure your local files stay current!