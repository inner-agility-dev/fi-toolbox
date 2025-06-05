# GitHub Workflow Mid-Bar Upgrade

This document details the improvements made to the GitHub workflows in the responsive-tiles repository as part of the mid-bar maturity upgrade.

## Overview

The GitHub Actions workflow has been refactored to improve maintainability, reliability, and modularity while maintaining compatibility with existing GCP resources and deployment patterns.

## Key Improvements

### 1. Modular Workflow Structure

The workflow has been split into three separate files:

- **main-deployment.yml**: Main workflow that handles test, version bumping, and orchestration
- **reusable-build.yml**: Reusable workflow for build process and artifact generation
- **pr-validation.yml**: Specialized workflow for PR validation with feedback

This separation improves maintainability and makes it easier to understand and modify specific parts of the workflow.

### 2. Consistent Configuration

- Standardized Node.js version (20.12.1) across all workflow files
- Environment variables for build and deployment clearly defined
- Common parameters extracted to reusable inputs

### 3. Enhanced Verification

- Added explicit verification steps using `gsutil` to confirm deployment success
- File count checks to ensure complete deployments
- Version tracking with version-info.txt files

### 4. Improved Error Handling

- Detailed error messages that pinpoint failure points
- Fail-fast approach for critical errors
- Clear structure to aid in troubleshooting

### 5. GCP Consistency

The refactored workflow uses the same GCP resources as before:

| Environment | Service Account | GCP Bucket |
|-------------|----------------|------------|
| Development | geezeo-tiles@dev-digital-banno.iam.gserviceaccount.com | dev-digital-gzo-geezeo-tiles-zwwst63n |
| Staging | geezeo-tiles@stage-digital-banno.iam.gserviceaccount.com | stage-digital-gzo-geezeo-tiles-nyjcof9v |
| Production | geezeo-tiles@prod-digital-banno.iam.gserviceaccount.com | prod-digital-gzo-geezeo-tiles-gvf7byup |

## Deployment Process

The deployment process follows a progressive promotion model:

1. **PR Creation/Update** → Development deployment
2. **PR Approval** → Staging deployment
3. **PR Merge to Main** → Production deployment (with required approval)

## Verification Checklist

The following aspects of the workflow have been verified:

- ✅ **GitHub Workflow Structure**: Three separate files with clear dependency chain
- ✅ **Environment Configuration**: Dev/Staging/Prod environments with specific variables
- ✅ **GCP Authentication**: Workload Identity Federation with environment-specific service accounts
- ✅ **Versioning Strategy**: Automatic bumping and tracking
- ✅ **Deployment Strategy**: Clear path convention with redirects and version markers
- ✅ **Workflow Security**: Minimal permissions and protected environments
- ✅ **Error Handling**: Detailed verification steps
- ✅ **Testing Strategy**: Playwright tests and linting

## Testing and Validation

The improved workflow can be locally validated using a Docker-based approach:

```bash
# Create a test Docker container
docker run -it --name gcp-workflow-test \
  -v $(pwd):/workspace \
  google/cloud-sdk:latest bash

# Test build and deployment
cd /workspace
npm ci
npm run build
```

## Notes for Future Improvements

For high-bar maturity, consider:

- Implementing blue/green deployments
- Adding canary deployments for gradual rollout
- Automating rollback capability
- Implementing comprehensive observability