# Release Automation Guide

## Quick Start - One Command Release

### Using npm scripts (Recommended)
```bash
# Create patch release with PR
npm run release:patch:pr

# Create minor release with PR
npm run release:minor:pr

# Create major release with PR
npm run release:major:pr
```

### Using Claude Code (AI-Powered)
```bash
# Let Claude analyze commits and create appropriate release with PR
claude -p "Create a release for responsive-tiles based on recent commits. Analyze the changes, determine if it should be patch/minor/major, run prepare-release, and create a PR with a summary of what changed."

# Or be specific about the release type
claude -p "Create a patch release for responsive-tiles to fix the flaky analyzer tests. Include PR description about the Firefox drag-drop fix."
```

## What Happens Automatically

When you run `npm run release:patch:pr`, the script will:

1. ✅ **Validate** - Check for version conflicts
2. 📦 **Bump Version** - Update package.json, src/version.js, and docs
3. 🏷️ **Create Tag** - Git tag with new version
4. 🚀 **Push** - Push commits and tags to origin
5. 🔀 **Create PR** - Open PR with release details
6. 📋 **Add Checklist** - Include review checklist in PR

## Example Workflow

```bash
# 1. Make your changes on a feature branch
git checkout -b fix/some-bug

# 2. Make commits using conventional format
git commit -m "fix: resolve issue with user authentication"

# 3. When ready to release, just run:
npm run release:patch:pr

# Output:
# ✓ Version bumped to 2.52.10
# ✓ Changes and tags pushed
# ✓ Pull request created successfully!
# https://github.com/Banno/responsive-tiles/pull/182
```

## Using Claude Code for Context-Aware Releases

Claude Code can analyze your commits and create more detailed PR descriptions:

### Basic Usage
```bash
claude -p "Create a release and PR for responsive-tiles"
```

### With Context
```bash
claude -p "Create a patch release for responsive-tiles. Main changes: fixed flaky tests, updated docs, improved error handling. Make PR description detailed."
```

### Emergency Hotfix
```bash
claude -p "Create urgent patch release for responsive-tiles to fix production bug #123. PR should be marked as hotfix."
```

## Advanced Automation Ideas

### 1. Release with Specific Description
```bash
claude -p "Create release for responsive-tiles. PR description should mention: 
- Fixed analyzer drag-drop in Firefox
- Updated version management docs  
- Added validation to prepare-release script"
```

### 2. Release with Changelog Generation
```bash
claude -p "Create release for responsive-tiles. Generate a changelog section for the PR based on commits since last release. Group by fix/feat/chore."
```

### 3. Release with Testing Instructions
```bash
claude -p "Create release for responsive-tiles. Include testing instructions in PR for the changes made since last release."
```

## Benefits Over Manual Process

| Manual Process | Automated Process |
|----------------|-------------------|
| Run prepare-release | ✅ Single command |
| Git push | ✅ Automatic |
| Git push --tags | ✅ Automatic |
| Open GitHub | ✅ Automatic |
| Click "New PR" | ✅ Automatic |
| Write PR title | ✅ Generated |
| Write PR description | ✅ AI-generated with context |
| Add reviewers | ✅ Can be automated with gh CLI |

## Troubleshooting

### If PR creation fails
```bash
# Check if you have gh CLI authenticated
gh auth status

# If not, login:
gh auth login
```

### If version conflict occurs
The script will show exactly how to fix it:
```
❌ ERROR: Git tag v2.52.10 already exists!
Options:
1. Delete the tag: git tag -d v2.52.10 && git push origin --delete v2.52.10
```

## Future Enhancements

We could extend this further:
- Auto-assign reviewers based on code owners
- Post release notes to Slack
- Trigger deployment preview
- Update Jira tickets mentioned in commits