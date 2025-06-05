# Local Testing Environment

This guide explains how to test the simplified GitHub Actions workflows and version management system locally before pushing changes to GitHub.

## Overview

The Responsive Tiles project uses a streamlined approach to testing:

1. **Local Development** - Standard npm scripts for local development and testing
2. **Version Management** - Local prepare-release script for version bumping
3. **Testing Workflows** - Verifying GitHub Actions workflows locally

## Local Development Setup

### Standard Development Environment

For basic development and testing:

```bash
# Install dependencies
npm ci

# Start development server
npm run start

# Build the application
npm run build

# Run tests
npx playwright test
```

## Local Version Management

The project uses a local version management approach where developers control version bumping:

1. Make code changes and commit using Conventional Commits format
2. Run the prepare-release script to bump version and create tag
3. Push changes and tags to GitHub to trigger deployment workflows

### Using the Prepare-Release Script

The prepare-release script handles all version management tasks:

```bash
# Run the prepare-release script to:
# 1. Analyze commit messages
# 2. Determine appropriate version bump (patch, minor, major)
# 3. Update package.json and package-lock.json
# 4. Create/update src/version.js
# 5. Create a git commit and tag
npm run prepare-release
```

## Testing Version Consistency

To validate version consistency locally (similar to what the GitHub Actions workflow does):

```bash
# Check package.json version
PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo "Package version: $PACKAGE_VERSION"

# Check version.js
if [ -f "src/version.js" ]; then
  VERSION_JS=$(grep -o "'[0-9]\+\.[0-9]\+\.[0-9]\+'" src/version.js | tr -d "'")
  echo "version.js version: $VERSION_JS"
  
  if [ "$VERSION_JS" != "$PACKAGE_VERSION" ]; then
    echo "⚠️ Version mismatch: please run 'npm run prepare-release'"
  else
    echo "✅ Versions are consistent"
  fi
fi
```

## Local Workflow Testing with act

You can test the GitHub Actions workflows locally using [act](https://github.com/nektos/act):

### Installing act

```bash
# macOS
brew install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### Testing Workflows

```bash
# Test PR workflow
act pull_request -j pr-validation

# Test main deployment workflow
act workflow_dispatch -j deploy-staging
```

## Testing Deployment

To test the build process and verify the output that would be deployed:

```bash
# Build the application
npm run build

# Serve the built files locally
npx serve -s dist
```

This allows you to verify the build output locally before deployment.

## Troubleshooting

### Version Mismatch Issues

If you encounter version mismatch errors:

1. Run `npm run prepare-release` to synchronize versions
2. Check that `src/version.js` and `package.json` have matching versions
3. Verify git tags match the current version with `git tag -l`

### Build Issues

If the build process fails:

1. Ensure all dependencies are installed with `npm ci`
2. Clear the dist directory with `rm -rf dist`
3. Check for errors in your application code
4. Try rebuilding with `npm run build`

### Testing Pull Requests

To simulate the PR workflow locally:

1. Create a feature branch with your changes
2. Run `npm run prepare-release` to update versions
3. Build and test the application locally
4. Create a PR only after verifying all steps succeed locally