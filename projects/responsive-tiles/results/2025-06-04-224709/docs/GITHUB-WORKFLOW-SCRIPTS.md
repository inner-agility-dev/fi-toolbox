# GitHub Workflow Scripts Reference

This document catalogs all script and command calls in the GitHub workflows for the responsive-tiles repository. It's designed to help developers understand and test the workflow locally before pushing changes.

## Build and Test Commands

These are the commands that run during the CI/CD workflow that you can execute locally to validate your changes.

### Installation

```bash
# Install dependencies (runs in all workflows)
npm ci
```

### Testing Commands

```bash
# Run linting (verifies code quality)
npm run lint

# Install Playwright browsers (for UI testing)
npx playwright install --with-deps

# Run Playwright tests for different browsers
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Building Commands

```bash
# Build the application (creates dist/ directory)
npm run build
```

### Version Management

```bash
# Bump patch version (e.g., 1.0.0 -> 1.0.1)
npm run release:patch
# OR without the custom script
npm version patch --no-git-tag-version

# Bump minor version (e.g., 1.0.0 -> 1.1.0)
npm run release:minor
# OR without the custom script
npm version minor --no-git-tag-version

# Bump major version (e.g., 1.0.0 -> 2.0.0)
npm run release:major
# OR without the custom script
npm version major --no-git-tag-version
```

## Workflow Execution Sequence

The GitHub workflows execute commands in this sequence:

1. **Test Job**
   - Install dependencies: `npm ci`
   - Install Playwright: `npx playwright install --with-deps`
   - Run linting: `npm run lint`
   - Run Playwright tests
   - Upload test results

2. **Version Bump Job** (only on push to main or manual trigger)
   - Install dependencies: `npm ci`
   - Configure Git
   - Determine version bump type
   - Bump version using appropriate command
   - Extract version for later use

3. **Build and Deploy Job**
   - Install dependencies: `npm ci`
   - Create environment file
   - Build application: `npm run build`
   - Prepare files for deployment
   - Deploy to appropriate environment

## Local Testing Flow

To replicate the full workflow locally, follow this sequence:

```bash
# 1. Install dependencies
npm ci

# 2. Run linting
npm run lint

# 3. Run tests (optional: install Playwright first)
npx playwright install --with-deps
npx playwright test --project=chromium

# 4. Build the application
npm run build

# 5. Inspect the build output
ls -la dist/
```

## Common Errors and Solutions

### Missing version.js File

If you see this error:
```
WARNING in ./src/tiles.js 24:2-25
Module not found: Error: Can't resolve './version.js' in '/Users/LenMiller/code/banno/responsive-tiles/src'
```

Solution: This is expected behavior. The application falls back to using the package.json version when version.js is not found. The warning can be safely ignored for local development.

### API 404 Errors

If you see 404 errors when fetching from the API:
```
GET https://geez3o.geezeo.com/api/v2/users/current 404 (Not Found)
```

Solution: This is normal in local development. The application is trying to connect to the actual API but doesn't have valid credentials. For local testing, the app uses mock data after these initial failed requests.

### Contrast Ratio Warnings

Warnings about WCAG contrast ratios are accessibility concerns but don't affect functionality. They can be addressed separately if needed.
