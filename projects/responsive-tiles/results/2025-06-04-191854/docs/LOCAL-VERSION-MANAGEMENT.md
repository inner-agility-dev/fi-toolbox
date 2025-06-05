# Local Version Management Guide

<div class="current-version-callout">
  Current Version: <span class="version-number">v2.53.1</span>
</div>

## Overview

This document explains how to use the local version management workflow as the primary approach for version management in Responsive Tiles. This approach gives developers direct control over version management by handling version bumps locally before pushing changes.

## Important: Understanding GCP Deployment

There are two phases of deployment to GCP buckets in this project:

### 1. Development Deployment (After PR Tests Pass)
When you create a PR after running `npm run prepare-release` and all tests pass:
- Your changes are automatically deployed to the main development GCP bucket
- This deployment updates: `gs://dev-digital-gzo-geezeo-tiles-zwwst63n/qa/v2/`
- This allows testing your changes in the actual development environment
- This deployment is accessible via the standard development URLs
- A comment will be added to your PR with deployment details and verification results

### 2. Staging and Production Deployment (After PR Merge)
To deploy to staging and production GCP buckets:
1. After preparing your release locally with `npm run prepare-release`
2. Push your changes and tags with `npm run push-release`
3. **Critical Step**: Create a pull request, get it reviewed and merged to master

When your PR is merged to master:
- It triggers the full deployment workflow in GitHub Actions
- This deploys to the staging and production GCP buckets
- The paths used are:
  - Staging: `gs://stage-digital-gzo-geezeo-tiles-nyjcof9v/staging/v2/`
  - Production: `gs://prod-digital-gzo-geezeo-tiles-gvf7byup/production/v2/`

Without merging to master, your changes will only exist in the development environment, not in staging or production.

## Workflow Diagram

```
┌─────────────────┐                  ┌─────────────────┐                   ┌─────────────────┐
│                 │                  │                 │                   │                 │
│ Local Changes   │                  │ Development     │                   │ Staging & Prod  │
│ & Version Bump  │                  │ Deployment      │                   │ Deployment      │
│                 │                  │                 │                   │                 │
└────────┬────────┘                  └────────┬────────┘                   └────────┬────────┘
         │                                    │                                     │
         ▼                                    ▼                                     ▼
┌─────────────────┐                  ┌─────────────────┐                   ┌─────────────────┐
│                 │                  │                 │    PR Approved    │                 │
│ npm run         │                  │ PR Tests Pass   │    & Merged       │ Auto Deploy to  │
│ prepare-release │                  │                 ├──────────────────►│ Staging & Prod  │
│                 │                  │                 │                   │                 │
└────────┬────────┘                  └────────┬────────┘                   └─────────────────┘
         │                                    │                                   
         ▼                                    ▼                                   
┌─────────────────┐                  ┌─────────────────┐                   
│                 │                  │                 │                   
│ git push &      │                  │ Auto Deploy to  │                   
│ Create PR       ├──────────────────► Development     │                   
│                 │                  │                 │                   
└─────────────────┘                  └─────────────────┘                   
```

This workflow illustrates how changes progress from local development through deployment to all environments.

## Quick Start

For a quick version bump and release preparation:

```bash
# Analyze commits and bump version automatically
npm run prepare-release

# OR specify version bump type manually
npm run release:patch  # For patch version (2.4.5 -> 2.4.6)
npm run release:minor  # For minor version (2.4.5 -> 2.5.0)
npm run release:major  # For major version (2.4.5 -> 3.0.0)

# To build, tag, and push all at once
npm run deploy-prod
```

## How It Works

The local version management workflow consists of three main steps:

1. **Version Bump**: Analyze commit messages or manually specify the version bump type
2. **Build**: Create build artifacts with the updated version
3. **Deploy**: Push changes and deploy to environments

## Step-by-Step Guide

### 1. Prepare Your Changes

Work on your feature or fix branch as usual:

```bash
git checkout -b feature/my-feature
# Make your changes
git add .
git commit -m "feat: add new awesome feature"
```

### 2. Prepare the Release

When you're ready to release, use the prepare-release script:

```bash
npm run prepare-release
```

This script will:
- Analyze your commit messages since the last tag
- Determine the appropriate version bump (patch, minor, or major)
- Update the version in package.json and package-lock.json
- Create or update src/version.js with the new version
- Update documentation references to reflect the new version
- Create a git commit with the changes
- Create a git tag for the new version

### 3. Manually Specify Version Bump Type

If you want to override the automatic version bump determination, you can specify the bump type:

```bash
npm run release:patch  # For bug fixes (2.4.5 -> 2.4.6)
npm run release:minor  # For new features (2.4.5 -> 2.5.0)
npm run release:major  # For breaking changes (2.4.5 -> 3.0.0)
```

### 4. Build and Deploy

After preparing the release, you can build and deploy:

```bash
# Build the project
npm run build

# Push changes and tags
npm run push-release

# OR do everything at once
npm run deploy-prod
```

## PR Workflow Without Automatic Version Bumping

When using the local version management workflow, you should disable the automatic version bumping in the PR workflow. This can be done by using the alternative PR workflow file:

1. Rename the current PR workflow file:
```bash
git mv .github/workflows/pr-workflow.yml .github/workflows/pr-workflow-with-auto-bump.yml
```

2. Rename the no-version-bump workflow file:
```bash
git mv .github/workflows/no-version-bump-pr-workflow.yml .github/workflows/pr-workflow.yml
```

This will use the workflow that respects your local version management and doesn't attempt to automatically bump versions in the PR process.

## Commit Message Format

To help the prepare-release script determine the correct version bump, follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>([optional scope]): <description>

[optional body]

[optional footer(s)]
```

### Commit Types and Version Impact

| Commit Type | Description | Version Impact |
|-------------|-------------|----------------|
| `feat`      | A new feature | Minor version bump (0.X.0) |
| `fix`       | A bug fix | Patch version bump (0.0.X) |
| `docs`      | Documentation only changes | Patch version bump (0.0.X) |
| `style`     | Changes that don't affect code meaning | Patch version bump (0.0.X) |
| `refactor`  | Code change that neither fixes a bug nor adds a feature | Patch version bump (0.0.X) |
| `perf`      | Code change that improves performance | Patch version bump (0.0.X) |
| `test`      | Adding missing tests or correcting existing tests | Patch version bump (0.0.X) |
| `chore`     | Changes to build process or auxiliary tools | Patch version bump (0.0.X) |

### Breaking Changes

To indicate a breaking change, add a footer with `BREAKING CHANGE:` followed by a description, or use `!` after the type:

```
feat!(api): change authentication endpoint structure

BREAKING CHANGE: Authentication endpoints now require a different payload structure
```

This will trigger a major version bump (X.0.0).

## Benefits of Local Version Management

- **More Control**: Developers have direct control over version bumping
- **Predictable Releases**: Version bump happens before the PR, so the version is known at PR creation time
- **Easier Debugging**: Clear separation between version management and the PR workflow
- **Simpler Workflow**: Avoid complex version bumping logic in GitHub Actions
- **Offline Friendly**: Can prepare releases without requiring GitHub integration

## Troubleshooting

### Common Issues and Solutions

#### GCP Buckets Not Updated

If you notice that GCP buckets aren't being updated despite successful workflow runs:

1. **Check deployment status in PR comments**
   - Look for the "Development Deployment Complete!" comment
   - Check verification results for any failures

2. **Verify PR tests passed**
   - Development deployment only happens if tests pass
   - Check GitHub Actions logs for any test failures

3. **Check GCP paths**
   - Development: `gs://dev-digital-gzo-geezeo-tiles-zwwst63n/qa/v2/`
   - Make sure you're looking at the correct path

4. **Authentication issues**
   - If the workflow shows authentication errors, contact the DevOps team
   - Workload Identity Federation might need reconfiguration

#### Version Inconsistencies

If you notice version inconsistencies across files:

1. **Run verification script**
   ```bash
   npm run verify-versions
   ```

2. **Check PR workflow logs**
   - The workflow includes automatic version consistency checks
   - It will attempt to fix inconsistencies during deployment

3. **Manual fix**
   ```bash
   # Update version.js
   echo "export const VERSION = '$(node -p "require('./package.json').version")'" > src/version.js
   
   # Commit and push
   git add src/version.js
   git commit -m "fix: update version.js to match package.json"
   git push
   ```

## Rollback Procedure

If you need to roll back to a previous version:

1. **Identify the version to roll back to**
   ```bash
   git tag -l "v*" --sort=-v:refname | head -5
   ```

2. **Create a rollback branch**
   ```bash
   git checkout -b rollback/to-v<version> v<version>
   ```

3. **Update version.js and documentation**
   ```bash
   npm run prepare-release
   ```

4. **Push and create PR**
   ```bash
   git push -u origin rollback/to-v<version>
   # Create PR via GitHub UI or gh cli
   ```

5. **Emergency rollback for production**
   If you need an immediate rollback in production, contact the DevOps team to revert the GCP bucket to a previous deployment.

## Fallback Plan

If you need to revert to the automated PR-based version bumping:

1. Rename the workflows back:
```bash
git mv .github/workflows/pr-workflow.yml .github/workflows/no-version-bump-pr-workflow.yml
git mv .github/workflows/pr-workflow-with-auto-bump.yml .github/workflows/pr-workflow.yml
```

2. Push the changes:
```bash
git add .github/workflows/
git commit -m "chore: revert to automated PR version bumping"
git push
```