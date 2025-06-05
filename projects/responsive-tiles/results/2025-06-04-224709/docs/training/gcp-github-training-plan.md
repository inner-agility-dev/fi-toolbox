# Comprehensive Training Plan for GCP Commands and GitHub CI/CD Workflow
## Introduction

This training plan is designed to help you master the Google Cloud Platform (GCP) commands and GitHub Actions workflow techniques used in the Responsive Tiles project. The training will be structured in progressive modules, starting with fundamental concepts and building up to the specific implementation details used in your project.

### Project Context
The Responsive Tiles project is a React-based financial UI components library that uses:
- GitHub Actions for CI/CD workflow automation
- Google Cloud Storage (GCS) for hosting deployments in different environments
- Workload Identity Federation for secure authentication to GCP
- Versioning automation to manage deployment versioning

### CI/CD Pipeline Overview
Our CI/CD pipeline implements a modern, secure deployment process with three distinct environments:

1. **Development Environment**: Automatic deployment upon PR creation/update
2. **Staging Environment**: Automatic deployment upon PR approval by a non-PR creator
3. **Production Environment**: Deployment after merge to main branch with manual approval

This progressive deployment model ensures thorough testing and validation before changes reach production. The pipeline leverages GitHub Actions for workflow automation, Workload Identity Federation for secure GCP authentication, and implements versioned deployments to Google Cloud Storage buckets.

## Module 5: CI/CD Pipeline Implementation

### 5.1 Modular Workflow Architecture
**Objective:** Understand the project's modular GitHub Actions workflow design.

**Key concepts:**
1. **Reusable Workflows**: How modular workflows improve maintainability and reduce duplication
2. **Workflow Composition**: How different workflow files interact to form the complete CI/CD pipeline
3. **Event-driven Deployment**: How different GitHub events trigger specific deployment behaviors
4. **Semantic Versioning**: How version numbers are managed through the pipeline

**Workflow Components:**
1. **main-deployment.yml** - Main workflow triggered by GitHub events
   - Handles testing, version bumping, and deployment orchestration
   - Makes decisions based on event context (PR, review, push to main)
   - Manages sequential deployments to multiple environments

2. **reusable-build.yml** - Reusable build workflow
   - Handles the build process in an isolated, reusable workflow
   - Creates versioned artifacts that can be used by deployment jobs
   - Implements caching to improve build performance

3. **pr-validation.yml** - PR validation workflow
   - Provides immediate feedback on pull requests
   - Validates code quality, tests, and build integrity
   - Posts results directly as PR comments

**Workflow Execution Flow:**
```
┌─────────────┐     ┌────────────────┐     ┌───────────────┐     ┌────────────────┐
│  PR Created  │────▶│  PR Validation │────▶│  Run Tests    │────▶│ Build Artifact │
└─────────────┘     └────────────────┘     └───────────────┘     └────────────────┘
                                                                      
┌────────────────┐     ┌──────────────┐     ┌───────────────┐     ┌────────────────┐
│ Push to Main   │────▶│  Run Tests   │────▶│ Build Once    │────▶│ Deploy to Dev  │
└────────────────┘     └──────────────┘     └───────────────┘     └────────────────┘
                                                                        │
                                                                        ▼
                                                              ┌────────────────────┐
                                                              │ Deploy to Staging  │
                                                              └────────────────────┘
                                                                        │
                                                                        ▼
                                           ┌────────────────┐  ┌────────────────────┐
                                           │ Manual Trigger │──│ Deploy to Prod     │
                                           └────────────────┘  └────────────────────┘
```

**Deployment Decision Logic:**
- Pull Request: Deploy to dev environment only
- PR Approved by reviewer: Deploy to dev and staging
- Push to main branch: Deploy to all environments (dev, staging, production)
- Manual workflow dispatch: Deploy to specified environment(s)

**Versioning Strategy:**
- Automatic patch version increments for pushes to main
- Manual control over version type (patch, minor, major) via workflow dispatch
- Semantic versioning principles (MAJOR.MINOR.PATCH)
- Version information embedded in deployment paths and artifacts

### 5.2 Test and Validation Process
**Objective:** Understand the project's test automation framework.

**Commands to practice:**
```bash
# Install dependencies
npm ci

# Run tests
npm test

# Run linting
npm run lint

# Run full CI test suite
npm run test:ci
```
# Commit changes
git commit -m "feat: add new component or improvement"

# Push changes
git push origin feature/my-improvement
```

### 1.2 GitHub Pull Request Workflow
**Objective:** Learn the PR workflow that triggers our CI/CD pipeline.

**Steps:**
1. Create a new branch from the base branch (typically `main` or `develop`)
2. Make changes and commit them
3. Push your changes to GitHub
4. Create a pull request through the GitHub interface
5. Address review comments and update the PR
6. Observe automated CI/CD processes triggered by your PR
7. Merge when approved and all checks pass

## Module 2: GitHub Actions Fundamentals

### 2.1 GitHub Actions Structure
**Objective:** Understand the structure and components of GitHub Actions workflows.

**Key concepts:**
1. Workflow file structure (.github/workflows/webpack-deploy-pipeline.yml)
2. Events that trigger workflows (pull_request, push, pull_request_review)
3. Jobs and steps in workflows
4. Using actions and runners
5. Understanding workflow dependencies and conditions

**Important workflow components:**
```yaml
name: Webpack Deploy Pipeline

on:
  pull_request:
    types: [opened, synchronize, reopened]
  pull_request_review:
    types: [submitted]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

permissions: 
  # Restrict permissions to only what's needed
  actions: read
  checks: write
  contents: write
  id-token: write # Required for GCP Workload Identity Federation
```

### 2.2 GitHub Environments and Secrets
**Objective:** Learn how the project uses GitHub Environments for deployment control.

**Practice topics:**
1. Setting up environment protection rules
2. Managing environment secrets
3. Configuring environment-specific variables
4. Understanding environment deployment approval flows

**Environment configuration in workflows:**
```yaml
environment:
  name: production  # References GitHub environment with protection rules
```

### 2.3 GitHub Actions Best Practices
**Objective:** Understand the best practices implemented in our CI/CD workflow.

**Key practices:**
1. **Concurrency Control**: Preventing parallel workflow runs that could conflict
2. **Least Privilege Principle**: Using minimally-scoped permissions for each job
3. **Artifact Management**: Properly handling build artifacts between jobs
4. **Caching**: Implementing dependency caching to speed up workflows
5. **Environment Protection**: Using environment protection rules for controlled deployments
6. **Conditional Execution**: Running jobs only when needed based on event context
7. **Verification Steps**: Including post-deployment verification to confirm successful deploys

## Module 3: Google Cloud Platform Fundamentals

### 3.1 GCP Account and Project Setup
**Objective:** Understand the GCP project structure and account management.

**Commands to practice:**
```bash
# List authenticated accounts
gcloud auth list

# View active configuration
gcloud config list

# Set active account (if needed)
gcloud config set account lenmiller@jackhenry.com

# Set active project
gcloud config set project prod-digital-banno-ia

# View current project
gcloud config get-value project
```

### 3.2 Google Cloud Storage Basics
**Objective:** Learn how to work with Google Cloud Storage buckets.

**Commands to practice:**
```bash
# List all buckets (if you have permission)
gsutil ls

# List contents of a specific bucket
gsutil ls gs://dev-digital-gzo-geezeo-tiles-zwwst63n/

# Copy files to a bucket
gsutil cp local-file.html gs://dev-digital-gzo-geezeo-tiles-zwwst63n/

# Copy files recursively
gsutil -m cp -r ./dist/qa/* gs://dev-digital-gzo-geezeo-tiles-zwwst63n/qa/

# Set public read permissions (if needed)
gsutil iam ch allUsers:objectViewer gs://dev-digital-gzo-geezeo-tiles-zwwst63n/
```

### 3.3 GCP Storage Deployment Structure
**Objective:** Understand the versioned storage structure used for deployments.

**Key concepts:**
1. **Environment-based Paths**: Separate paths for dev/staging/production
2. **Version-based Folders**: Using major version numbers for versioned deployments (v2/)
3. **Redirect Index Files**: HTML redirects at the root level to point to the latest version
4. **Version Markers**: Files containing build metadata for auditing and tracking

**Deployment structure:**
```
gs://dev-digital-gzo-geezeo-tiles-zwwst63n/
├── qa/
│   ├── index.html  # Redirects to latest version
│   ├── v1/         # Version 1.x deployments
│   └── v2/         # Version 2.x deployments with all assets
│       ├── index.html
│       ├── assets/
│       ├── docs/
│       └── version-info.txt
```
## Module 4: Workload Identity Federation

### 4.1 Understanding Workload Identity Federation
**Objective:** Learn how Workload Identity Federation provides secure authentication to GCP.

**Key concepts:**
1. **Service Account vs. Static Keys**: Why federation is more secure than service account keys
2. **OIDC Tokens**: How GitHub Actions uses OpenID Connect tokens for authentication
3. **Trust Relationships**: How GCP establishes trust with GitHub's identity provider
4. **Short-lived Credentials**: The security benefits of temporary access tokens

**Implementation overview:**
```yaml
- name: Authenticate to Google Cloud
  id: auth
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: ${{ vars.WORKLOAD_IDENTITY_PROVIDER }}
    service_account: "geezeo-tiles@dev-digital-banno.iam.gserviceaccount.com"
    create_credentials_file: true
    export_environment_variables: true
    universe: googleapis.com
    cleanup_credentials: true
    access_token_lifetime: 3600s
    access_token_scopes: https://www.googleapis.com/auth/cloud-platform
```

### 4.2 Setting Up Workload Identity Federation
**Objective:** Understand the steps for configuring WIF between GitHub and GCP.

**Configuration steps:**
1. Create a Workload Identity Pool in GCP
2. Configure the GitHub identity provider
3. Set up IAM policies for the service account
4. Configure repository variables for the provider ID
5. Test the authentication flow

## Module 5: Webpack Build and Deploy Pipeline

### 5.1 Webpack Build Process
**Objective:** Understand the webpack build configuration used in the project.

**Key aspects:**
1. **Entry Points**: How webpack defines entry points for different builds
2. **Output Configuration**: How compiled assets are named and organized
3. **Environmental Variables**: How different build environments are configured
4. **Asset Management**: How static assets are handled in the build
5. **Optimization**: How builds are optimized for different environments

**Sample webpack configuration:**
```javascript
const config = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'eval-source-map' : 'source-map',
  entry: {
    'tiles': path.join(paths.SRC, 'tiles.js'),
    'consumer': path.join(paths.SRC, 'tiles.js')
  },
  output: {
    path: path.join(paths.DIST),
    filename: IS_DEV ? '[name].js' : '[name].[contenthash:8].js',
    publicPath: IS_DEV ? '/' : undefined,
    clean: true
  }
}
```

### 5.2 Versioning Strategy
**Objective:** Understand the automated versioning approach used in the CI/CD pipeline.

**Key concepts:**
1. **Semantic Versioning**: Understanding the MAJOR.MINOR.PATCH format
2. **Automated Patch Increments**: How version numbers are automatically bumped
3. **Version Extraction**: How the major version is extracted for deployment paths
4. **Version Artifacts**: How version information is recorded and tracked

**Implementation in workflow:**
```yaml
- name: Bump version
  id: bump
  run: |
    # Get current version
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    echo "Current version: ${CURRENT_VERSION}"
    
    # Perform the version bump
    NEW_VERSION=$(npm version patch --no-git-tag-version)
    echo "new_version=${NEW_VERSION}" >> $GITHUB_OUTPUT
    echo "Bumped version to: ${NEW_VERSION}"
```

### 5.3 Complete CI/CD Workflow
**Objective:** Understand the end-to-end CI/CD workflow for the project.

**Workflow phases:**
1. **Test Phase**: Running automated tests to validate code quality
2. **Version Bump Phase**: Incrementing version numbers automatically
3. **Build Phase**: Compiling code and preparing deployment artifacts
4. **Deployment Phases**: Deploying to development, staging, and production environments based on workflow triggers
5. **Verification Phase**: Confirming successful deployments

**Workflow architecture diagram:**
```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌─────────────────┐
│  PR Created  │────▶│  Run Tests   │────▶│  Bump Version │────▶│  Build Assets   │
└─────────────┘     └──────────────┘     └───────────────┘     └─────────────────┘
                                                                        │
       ┌──────────────────────────────────────────────────────────────┐ │
       │                                                              ▼ ▼
┌────────────────┐     ┌────────────────┐     ┌────────────────────────────┐
│ PR Approved    │────▶│ Deploy Staging │◀────│      Deploy Dev            │
└────────────────┘     └────────────────┘     └────────────────────────────┘
       │
       │
       ▼
┌────────────────┐     ┌─────────────────┐
│  Merged to     │────▶│ Deploy Production│
│  Main Branch   │     │ (with approval)  │
└────────────────┘     └─────────────────┘
```

## Module 6: Testing and Monitoring

### 6.1 Test Strategy
**Objective:** Understand the testing approach used in the project.

**Key aspects:**
1. **Jest Configuration**: How Jest is configured for unit and integration tests
2. **Playwright Integration**: How browser testing is implemented
3. **CI Testing**: How tests are executed in the CI/CD pipeline
4. **Test Organization**: How tests are structured and organized

**Test command in workflow:**
```yaml
- name: Run tests
  run: npm run test:ci
  env:
    CI: true
```

### 6.2 Deployment Verification
**Objective:** Learn how deployments are verified in the CI/CD workflow.

**Verification steps:**
1. **File Counting**: Checking that files were uploaded successfully
2. **Content Validation**: Validating that key files are present
3. **URL Generation**: Creating human-readable URLs for verification
4. **Error Handling**: How failed deployments are detected and reported

**Verification implementation:**
```yaml
- name: Verify deployment
  run: |
    echo "🔍 Verifying development deployment"
    COUNT=$(gsutil ls -r "gs://dev-digital-gzo-geezeo-tiles-zwwst63n/qa/v${{ needs.version_bump.outputs.major_version }}/**" | wc -l)
    echo "Found $COUNT files in deployment directory"
    
    if [ "$COUNT" -gt 0 ]; then
      echo "✅ Development deployment verified with $COUNT files"
      echo "✅ Version ${{ needs.version_bump.outputs.new_version }} deployed to development"
    else
      echo "❌ Error: No files found in deployment directory"
      exit 1
    fi
```

## Module 7: Troubleshooting and Advanced Topics

### 7.1 Common Issues and Solutions
**Objective:** Learn how to troubleshoot common issues in the CI/CD pipeline.

**Topics covered:**
1. **Authentication Failures**: Debugging Workload Identity Federation issues
2. **Build Failures**: Resolving webpack build errors
3. **Test Failures**: Addressing test failures in the CI environment
4. **Deployment Failures**: Troubleshooting GCS upload issues
5. **Version Conflicts**: Handling version number conflicts

### 7.2 Security Best Practices
**Objective:** Understand the security measures implemented in the pipeline.

**Key practices:**
1. **Workload Identity Federation**: Using federated identity instead of long-lived service account keys
2. **Principle of Least Privilege**: Minimizing permissions for each job
3. **Environment Protection Rules**: Using approval mechanisms for protected environments
4. **Secret Management**: Securely handling sensitive information
5. **Artifact Security**: Ensuring build artifacts are handled securely

### 7.3 Extending the Workflow
**Objective:** Learn how to extend and customize the CI/CD workflow.

**Extension possibilities:**
1. **Adding New Environments**: How to add additional deployment environments
2. **Integrating Additional Tests**: Adding more test types to the pipeline
3. **Adding Notifications**: Implementing Slack or email notifications
4. **Performance Optimization**: Improving workflow execution speed
5. **Advanced Versioning**: Implementing more complex versioning strategies

## Conclusion and Next Steps

This training plan has covered the essential components of working with GCP and GitHub Actions for the Responsive Tiles project. By mastering these modules, you'll be able to effectively maintain, troubleshoot, and extend the CI/CD pipeline.

**Next steps for advanced learning:**
1. Explore GitHub Actions Composite actions for reusable components
2. Learn more about GCP Cloud Build for container-based deployments
3. Investigate GitHub Actions matrix strategies for parallel testing
4. Study advanced webpack optimization techniques
5. Explore containerization for more isolated build environments

**Resources:**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Workload Identity Federation Guide](https://cloud.google.com/iam/docs/workload-identity-federation)
- [Webpack Optimization Documentation](https://webpack.js.org/guides/production/)
