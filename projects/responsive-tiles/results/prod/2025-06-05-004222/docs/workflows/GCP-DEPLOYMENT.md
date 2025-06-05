# GCP Deployment

This document details the GitHub Actions workflows for deploying the Responsive Tiles application to Google Cloud Platform (GCP) buckets.

## Overview

Responsive Tiles uses a streamlined "build-once-deploy-many" approach for GCP deployments through three GitHub Actions workflows:

1. `pr-workflow.yml` - Validates PRs and deploys to development environment
2. `main-deployment.yml` - Handles deployments to staging and production environments
3. `merged-workflow.yml` - Triggers the main deployment workflow after PR merge

The deployment process:

1. Verifies version consistency across all files
2. Builds the application
3. Uploads the built files to the appropriate GCP bucket
4. Serves the content through the GCP infrastructure

## GitHub Actions Workflow Structure

### PR Workflow (`pr-workflow.yml`)

This workflow runs when a PR is created or updated. It:

1. Validates version consistency between package.json and version.js
2. Builds the application
3. Deploys to the development environment
4. Provides validation feedback on the PR

### Main Deployment Workflow (`main-deployment.yml`)

This workflow handles deployment to staging and production. It:

1. Verifies git tag matches the package version
2. Builds the application once
3. Deploys sequentially to staging then production
4. Runs after PR merge via the merged-workflow trigger

### Merged Workflow (`merged-workflow.yml`)

This simple workflow runs when a PR is merged to master. It:

1. Triggers the main deployment workflow
2. Ensures deployments happen automatically after PR approval

## Deployment Environments and GCP Buckets

| Environment | GCP Bucket | Path | URL |
|-------------|------------|------|-----|
| Development | dev-digital-gzo-geezeo-tiles-zwwst63n | qa/v2 | https://geezeo.geezeo.banno-development.com/assets/tiles/v2/ |
| Staging | stage-digital-gzo-geezeo-tiles-nyjcof9v | staging/v2 | https://geezeo.geezeo.banno-qa.com/assets/tiles/v2/ |
| Production | prod-digital-gzo-geezeo-tiles-gvf7byup | production/v2 | https://geezeo.geezeo.banno.com/assets/tiles/v2/ |

## Version Management with Local Version Bumping

The deployment workflow is designed to work with the local version management approach, where:

1. Developers control version bumping locally using the `prepare-release.js` script
2. Version consistency is strictly enforced by the workflows
3. Git tags are created automatically to mark releases

### Local Version Management Process

To update versions and deploy:

1. Make changes and commit using [Conventional Commits](https://www.conventionalcommits.org/) format
2. Run the prepare-release script to bump version and create tag:
   ```bash
   npm run prepare-release
   ```
3. Push changes and tags to GitHub:
   ```bash
   git push origin feature/your-branch
   git push --tags
   ```
4. Create a PR to trigger the deployment workflow

## Workflow Implementation Details

### Version Consistency Checks

The PR workflow verifies version consistency by:

```yaml
- name: Verify version consistency
  run: |
    # Check if version.js exists and has the right version
    if [ -f "src/version.js" ]; then
      VERSION_JS=$(grep -o "'[0-9]\+\.[0-9]\+\.[0-9]\+'" src/version.js | tr -d "'")
      if [ "$VERSION_JS" != "${{ steps.get-version.outputs.version }}" ]; then
        echo "⚠️ Version mismatch: package.json (${{ steps.get-version.outputs.version }}) != version.js ($VERSION_JS)"
        echo "Please run 'npm run prepare-release' locally to ensure version consistency"
        exit 1
      fi
    fi
```

### GCP Bucket Deployment

The deployment to GCP buckets uses the google-github-actions:

```yaml
- name: Deploy to development
  uses: "google-github-actions/upload-cloud-storage@v2"
  with:
    path: ./dist
    destination: "${{ env.GCP_HOSTING_BUCKET }}/${{ env.DEPLOY_FOLDER }}/v2"
```

## Troubleshooting Deployment Issues

### Version Mismatch Errors

If the PR workflow fails with a version mismatch error:

1. Run `npm run prepare-release` locally to synchronize versions
2. Commit the changes and push again
3. The workflow will re-run automatically

### Authentication Issues

If the workflow fails with GCP authentication errors:

1. Verify the Workload Identity Federation configuration
2. Check that the service account has appropriate permissions
3. Contact the DevOps team for assistance with GCP authentication

### Deployment Verification

After deployment, verify the application at:

- Development: https://geezeo.geezeo.banno-development.com/assets/tiles/v2/
- Staging: https://geezeo.geezeo.banno-qa.com/assets/tiles/v2/
- Production: https://geezeo.geezeo.banno.com/assets/tiles/v2/

## Security and Best Practices

The deployment system implements several security measures:

1. Workload Identity Federation for secure authentication
2. Separation of environments (dev/staging/prod)
3. Version-based deployments to prevent breaking changes
4. Build-once-deploy-many strategy for consistent deployments
5. Automated workflow triggers to reduce manual errors