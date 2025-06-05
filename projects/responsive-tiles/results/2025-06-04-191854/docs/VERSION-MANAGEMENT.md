# Version Management Guide

## Current Setup

This project uses a **manual version management** approach after removing the automatic version bumping from GitHub workflows. All version updates are handled through the `prepare-release` script.

## Version Sources

1. **package.json** - The source of truth for the project version
2. **src/version.js** - Generated file that exports the VERSION constant
3. **Documentation** - Version displayed in all generated HTML docs
4. **Git tags** - Version tags (e.g., v2.52.8) for releases

## Release Process

### Step 1: Prepare Release Locally

```bash
# Analyze commits and bump patch version
npm run prepare-release

# OR specify the bump type explicitly
npm run release:patch    # For bug fixes
npm run release:minor    # For new features
npm run release:major    # For breaking changes
```

This script will:
- Determine the new version based on commits (or your specification)
- Update package.json and package-lock.json
- Generate/update src/version.js
- Update version references in all documentation
- Create a git commit and tag

### Step 2: Push Changes

```bash
# Push the commit and tag
git push && git push --tags
```

### Step 3: Deployment

The GitHub workflow will:
1. Verify the git tag matches package.json version
2. Build the project with the current version
3. Deploy to all environments

## Version Display in Documentation

The documentation system automatically displays the current version from package.json:

1. **Sidebar Badge** - Shows on all documentation pages
2. **Semantic Release Page** - Special highlighted version display
3. **Version Placeholder** - Use `2.52.9` in markdown files for automatic replacement

## Troubleshooting

### Version Mismatch Issues

If versions get out of sync:

1. Check current state:
   ```bash
   # Check package.json version
   cat package.json | grep version
   
   # Check git tags
   git tag -l | tail -5
   
   # Check src/version.js
   cat src/version.js
   ```

2. Fix mismatches:
   ```bash
   # If tag is missing for current version
   git tag -a v$(node -p "require('./package.json').version") -m "Version $(node -p "require('./package.json').version")"
   git push --tags
   ```

3. Regenerate documentation:
   ```bash
   npm run build:docs
   ```

### Semantic Release Configuration

The `.releaserc.json` file is still present but not used in the current workflow. If you want to re-enable automatic versioning in the future, you would need to:

1. Add semantic-release back to the GitHub workflow
2. Remove the manual prepare-release process
3. Ensure commits follow conventional commit format

## Best Practices

1. **Always use prepare-release script** - Don't manually edit version numbers
2. **Follow conventional commits** - Even though not automated, it helps with consistency
3. **Tag every release** - The workflow requires matching git tags
4. **Build docs after version bump** - Ensures version is displayed correctly

## Version Verification

The build process includes several version checks:

1. **Git tag check** - Ensures a tag exists for the current version
2. **version.js check** - Verifies the file exists
3. **Documentation verification** - Checks version display in generated HTML

These checks prevent deployment if versions are inconsistent.