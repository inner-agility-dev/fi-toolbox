# PR Versioning and Deployment Workflow

This document explains the automated versioning and deployment workflow implemented for the responsive-tiles project.

## Overview

We've implemented a streamlined single-PR workflow that handles:
1. Automatic version bumping at PR creation time
2. Deployment to development environment after PR tests pass
3. Deployment to staging and production after PR is merged

This approach gives you early feedback in a development environment while maintaining proper version control and a single PR flow.

## Workflow Details

### 1. Local Version Management

This project now uses local version management instead of automated PR version bumping:

- Before creating a PR, run `npm run prepare-release` locally
- This script analyzes your conventional commits and determines the version bump
- It updates `package.json`, `package-lock.json`, and `src/version.js` with the new version
- Create a PR with these version changes included
- The workflow verifies the existence of version files without strict version checking

#### Commit Types and Version Bumps

The following commit types will trigger version bumps:

- **Patch (2.43.54 → 2.43.55)**: `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`
- **Minor (2.43.54 → 2.44.0)**: `feat:`
- **Major (2.43.54 → 3.0.0)**: `feat!:` or any commit with `BREAKING CHANGE:` in the footer

### 2. Validation and Testing

After version bumping:

- Linting and build validation run
- Playwright tests run on multiple browsers
- Test results are posted as comments on the PR

### 3. Development Deployment

If tests pass:

- The application is built with the new version
- The build is deployed to a PR-specific preview environment
- A comment is added to the PR with the preview URL
- Developers can immediately see their changes in a live environment

### 4. Merge and Production Deployment

When the PR is approved and merged:

- The same version that was tested in development is used
- The application is built once (build-once-deploy-many)
- The identical build artifact is deployed to staging (with approval)
- After staging approval, the same artifact is deployed to production
- A GitHub release is created with the version and deployment summary

### 5. PR Preview Cleanup

When a PR is closed (merged or not):

- The PR preview environment is automatically cleaned up

## Developer Workflow

As a developer, your workflow now includes local version management:

1. Create a feature branch from master
2. Make your changes
3. Use conventional commit messages:
   - `feat: add new feature` (triggers minor version bump)
   - `fix: resolve issue` (triggers patch version bump)
   - `docs: update documentation` (triggers patch version bump)
   - `style: format code` (triggers patch version bump)
   - `refactor: improve code structure` (triggers patch version bump)
   - `perf: improve performance` (triggers patch version bump)
   - `test: add tests` (triggers patch version bump)
   - `chore: update dependencies` (triggers patch version bump)
   - `feat!: breaking change` or any commit with `BREAKING CHANGE: major API change` (triggers major version bump)
4. Run `npm run prepare-release` locally to update version files
5. Create a PR to master with the version changes included
6. Wait for tests to run
7. Review the preview deployment
8. Respond to review comments and update as needed
9. Once approved, merge the PR
10. The same version will be deployed to staging/production after approvals

## Benefits

- Developer-controlled local version management
- Clear version history with explicit version commits
- Simplified deployment verification without strict version checking
- Early feedback via development deployments
- Consistent build across all environments
- Clear traceability between code and deployed version
- Protected branches with proper approvals
- Clean preview environments