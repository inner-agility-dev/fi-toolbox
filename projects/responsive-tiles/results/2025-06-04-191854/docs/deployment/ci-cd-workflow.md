# CI/CD Workflow for Responsive Tiles

This document details the continuous integration and deployment workflow for the Responsive Tiles project.

## Overview

The Responsive Tiles project uses GitHub Actions for automated CI/CD pipeline. The workflow automates testing, building, and deploying the application to different GCP environments (development, staging, production).

```mermaid
graph TD
    Code[Code Changes] --> PR[Pull Request]
    PR --> Review[Code Review]
    Review --> Merge[Merge to Master]
    Merge --> Workflow[GitHub Actions Workflow]
    
    Workflow --> Test[Run Tests]
    Test --> Build[Build Application]
    Build --> DevDeploy[Deploy to Dev]
    DevDeploy --> StageTest[Test in Stage]
    StageTest --> StageDeploy[Deploy to Stage]
    StageDeploy --> ProdTest[Test in Prod]
    ProdTest --> ProdDeploy[Deploy to Production]
```

## Workflow Files

The CI/CD process is defined in several workflow files:

### GitHub Actions Workflows
1. **pr-validation.yml**: Runs tests and validations on PR creation/update
2. **reusable-build.yml**: Reusable workflow for building the application
3. **main-deployment.yml**: Main deployment workflow using Build-Once-Deploy-Many pattern

## Complete CI/CD Pipeline

The following diagram shows the complete pipeline including all steps:

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GitHub
    participant CI as CI/CD Pipeline
    participant DevEnv as Dev Environment
    participant StageEnv as Stage Environment
    participant ProdEnv as Prod Environment
    
    Dev->>GitHub: Push code
    GitHub->>CI: Trigger workflow
    
    Note over CI: test job
    CI->>CI: Run Playwright tests
    CI->>CI: Calculate next version
    
    Note over CI: reusable build job
    CI->>CI: Check build cache
    CI->>CI: Build once (or restore from cache)
    CI->>CI: Create versioned artifact
    
    Note over CI: deploy-dev job
    CI->>CI: Download artifact
    CI->>CI: Validate artifact
    CI->>DevEnv: Deploy to dev bucket
    CI->>CI: Verify deployment
    
    Note over CI: deploy-stage job
    CI->>CI: Download same artifact
    CI->>CI: Validate artifact
    CI->>StageEnv: Deploy to staging bucket
    CI->>CI: Verify deployment
    
    Note over CI: deploy-prod job
    CI->>CI: Download same artifact
    CI->>CI: Validate artifact
    CI->>ProdEnv: Deploy to production bucket
    CI->>CI: Verify deployment
    CI->>CI: Generate deployment report
    
    DevEnv-->>Dev: Available for testing
    StageEnv-->>Dev: Available for testing
    ProdEnv-->>Dev: Available for users
```

## Deployment Environments

The application is deployed to three different GCP environments:

| Environment | GCP Bucket | Purpose |
|-------------|------------|---------|
| Dev | dev-digital-gzo-geezeo-tiles-zwwst63n | Development testing |
| Stage | stage-digital-gzo-geezeo-tiles-nyjcof9v | Pre-production testing |
| Production | prod-digital-gzo-geezeo-tiles-gvf7byup | Live user-facing environment |

## Workflow Steps in Detail

### 1. CI Test Stage

```mermaid
flowchart TD
    Workflow[Workflow Triggered] --> Checkout[Checkout Code]
    Checkout --> SetupNode[Setup Node.js]
    SetupNode --> Install[Install Dependencies]
    Install --> Test[Run Tests]
    Test --> CalculateVersion[Calculate Version]
    CalculateVersion --> OutputVersion[Output Version for Next Stages]
```

The CI test stage:
- Runs automated tests across different browsers
- Calculates the next version number for the application
- Passes version information to subsequent stages

### 2. Build Once Stage

```mermaid
flowchart TD
    Test[Needs Test Job] --> Checkout[Checkout Code]
    Checkout --> SetupNode[Setup Node.js with Caching]
    SetupNode --> Install[Install Dependencies]
    Install --> CacheCheck{Check Build Cache}
    CacheCheck -- Hit --> RestoreCache[Restore from Cache]
    CacheCheck -- Miss --> Build[Build Application]
    RestoreCache & Build --> Verify[Verify Build Integrity]
    Verify --> UploadArtifact[Upload Versioned Artifact]
```

The build stage (using the reusable workflow):
- Checks for cached build artifacts 
- Only builds if cache doesn't exist
- Creates a single versioned artifact
- Uploads the artifact for use by all deployment stages

### 3. Deployment Stages

```mermaid
flowchart TD
    Needs[Needs Build Job] --> Checkout[Checkout Code]
    Checkout --> Download[Download Same Artifact]
    Download --> Validate[Validate Artifact Integrity]
    Validate --> SetEnv[Set Environment Variables]
    SetEnv --> Auth[GCP Authentication]
    Auth --> Deploy[Deploy to Environment's GCP Bucket]
    Deploy --> Verify[Verify Deployment]
```

All deployment stages (dev, stage, prod) follow this same pattern:
- Download the same artifact built in the build stage
- Validate artifact integrity
- Set environment-specific variables
- Deploy to the appropriate environment
- Verify successful deployment

## Manual Deployment

Manual deployment can be performed through GitHub Actions interface:

```mermaid
flowchart LR
    Trigger[Manual Trigger] --> Select[Select Environment]
    Select --> Build[Build for Environment]
    Build --> Deploy[Deploy to Environment]
```

To manually trigger deployment:
1. Go to the GitHub Actions tab
2. Select "Main Deployment" workflow
3. Click "Run workflow"
4. Run the workflow
5. The workflow will deploy to all environments in sequence

## Troubleshooting

If deployment fails, check:

1. GitHub Actions logs for specific errors
2. GCP authentication issues
3. Build errors in the workflow logs
4. Test failures in the CI stage

Common issues include:
- Missing environment variables
- Authentication problems with GCP
- Build failures due to dependencies
- Test failures in CI

## Workflow Optimization

The workflow is optimized for:

1. **Reliability**: Sequential deployment ensures stability
2. **Efficiency**: Reuses built artifacts where possible
3. **Safety**: Test stages prevent broken deployments
4. **Speed**: Parallel test execution reduces CI time 
