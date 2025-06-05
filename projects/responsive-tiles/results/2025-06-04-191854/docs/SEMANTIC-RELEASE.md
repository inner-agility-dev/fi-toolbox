# Semantic Release Guide

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate the versioning and release process. This document explains how it works and how to use it effectively.

<div class="current-version-callout">
  Current Version: <span class="version-number">v2.53.1</span>
</div>

## What is Semantic Release?

Semantic Release is a fully automated version management and package publishing tool. It determines the next version number, generates release notes, and publishes packages based on your commit messages.

## How It Works in Our Workflow

1. When code is merged to `master`, the release process is triggered
2. Semantic Release analyzes commit messages since the last release
3. The appropriate version number is determined automatically based on conventional commits
4. The package.json version is updated
5. A changelog entry is generated
6. Changes are committed back to the repository
7. The new version is used for building and deploying to all environments

## Build Process with New Versions

To ensure the new version is correctly used throughout the build and deployment process, our workflow follows these steps:

1. **Release**: The semantic-release process runs first, analyzing commits and determining the new version
2. **Version Update**: The package.json file is updated with the new version number
3. **Git Commit**: Changes are committed back to the repository
4. **Build**: The build process checks out the latest code with the updated version
5. **Artifacts**: Build artifacts are created with the new version number
6. **Deploy**: The same artifacts with the new version are deployed to all environments

This ensures consistency between the repository version and what is deployed to all environments.

## Commit Message Format

For semantic release to work properly, commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

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
| `docs`      | Documentation only changes | No version bump* |
| `style`     | Changes that don't affect code meaning | No version bump* |
| `refactor`  | Code change that neither fixes a bug nor adds a feature | No version bump* |
| `perf`      | Code change that improves performance | Patch version bump (0.0.X) |
| `test`      | Adding missing tests or correcting existing tests | No version bump* |
| `chore`     | Changes to build process or auxiliary tools | No version bump* |

*Unless they include a breaking change footer

### Breaking Changes

To indicate a breaking change, add a footer with `BREAKING CHANGE:` followed by a description:

```
feat(api): change authentication endpoint structure

BREAKING CHANGE: Authentication endpoints now require a different payload structure
```

This will trigger a major version bump (X.0.0).

## Example Commit Messages

```
feat(dashboard): add revenue chart to summary view
```
*Result: Minor version bump (0.X.0)*

```
fix(login): resolve issue with password reset link
```
*Result: Patch version bump (0.0.X)*

```
docs(readme): update installation instructions
```
*Result: No version bump*

```
feat(api): change authentication endpoint structure

BREAKING CHANGE: Authentication endpoints now require a different payload structure
```
*Result: Major version bump (X.0.0)*

## Getting Started with Conventional Commits

### VS Code Extensions

- [Conventional Commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)
- [Conventional Commit](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen)

These extensions provide templates and validation for conventional commits directly in your editor.

## Configuration

Our Semantic Release configuration is in `.releaserc.json` and includes the following plugins:

- `@semantic-release/commit-analyzer`: Analyzes commit messages to determine version bump
- `@semantic-release/release-notes-generator`: Generates release notes
- `@semantic-release/changelog`: Updates CHANGELOG.md
- `@semantic-release/npm`: Updates version in package.json
- `@semantic-release/git`: Commits changes back to repository
- `@semantic-release/github`: Creates GitHub releases

## Questions?

If you have questions about using Semantic Release or structuring your commit messages, please refer to:

- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)