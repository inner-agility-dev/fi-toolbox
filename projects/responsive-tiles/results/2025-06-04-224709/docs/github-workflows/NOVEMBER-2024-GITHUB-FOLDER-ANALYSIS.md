# Complete `.github` Folder Structure Analysis - November 2024

## TL;DR - Configuration Matrix

### Environment-Specific Configuration Matrix

| Environment | GitHub Environment | GCP Project ID | GCP Hosting Bucket | Bucket Suffix | Deploy Folder | Deploy Path | Content Path |
|-------------|-------------------|----------------|-------------------|---------------|---------------|-------------|--------------|
| **Dev** | `dev` | `dev-digital-banno` | `dev-digital-gzo-geezeo-tiles-zwwst63n` | `zwwst63n` | `qa` | `qa/v{major}` | `dist/qa/v2` |
| **Stage** | `staging` | `stage-digital-banno` | `stage-digital-gzo-geezeo-tiles-nyjcof9v` | `nyjcof9v` | `staging` | `staging/v{major}` | `dist/staging/v2` |
| **Prod** | `production` | `prod-digital-banno` | `prod-digital-gzo-geezeo-tiles-gvf7byup` | `gvf7byup` | `production` | `production/v{major}` | `dist/production/v2` |

### GCP Configuration Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Workload Identity Provider** | `projects/423509969265/locations/global/workloadIdentityPools/gha-cldteam-pool-58a241b9/providers/gha-cldteam-provid-58a241b9` | Federated authentication provider |
| **Service Account Pattern** | `geezeo-tiles@{gcp_project_id}.iam.gserviceaccount.com` | Environment-specific service accounts |
| **Token Format** | `access_token` | Authentication token type |
| **Bucket Project ID** | Same as GCP Project ID | Project hosting the storage buckets |
| **Upload Destination Pattern** | `{bucket}/{deploy_folder}/v{major_version}` | Dynamic path construction |
| **Process gcloudignore** | `false` | Disabled for deployment |

### GitHub Workflow Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| **Primary Trigger** | `push: branches: ["master"]` | Automatic deployment trigger |
| **Secondary Trigger** | `workflow_dispatch` | Manual execution |
| **Node.js Version** | `14` | Legacy Node.js version |
| **Concurrency Group** | `${{ github.repository }}-${{ github.event.push.number \|\| github.ref }}` | Prevents overlapping deployments |
| **Cancel in Progress** | `true` | Cancels previous runs |
| **Workflow Pattern** | Orchestration (main calls reusable) | Architecture approach |

### Permissions Matrix

| Workflow | actions | checks | contents | id-token | Description |
|----------|---------|--------|----------|----------|-------------|
| **deployment.yml** | `read` | `write` | `write` | `write` | Main orchestrator permissions |
| **workflow-tiles-ci-test.yml** | `read` | `write` | `write` | `write` | CI testing permissions |
| **workflow-tiles-build-deploy.yml** | `read` | `write` | `write` | `write` | Build/deploy permissions |

### Testing Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| **Test Browsers** | `[chromium, firefox, webkit]` | Multi-browser testing |
| **Shard Configuration** | `[1, 2, 3, 4]` of `[4]` total | 4-way parallel execution |
| **Total Test Jobs** | 12 (3 browsers × 4 shards) | Parallel test matrix |
| **Test Runner** | Playwright | Testing framework |
| **CI Environment** | `ubuntu-latest` | GitHub runner |

### Artifact & Deployment Patterns

| Pattern | Template | Example |
|---------|----------|---------|
| **Artifact Name** | `{project_name}-{ENV}-staged-artifacts` | `tiles-development-staged-artifacts` |
| **Version Extraction** | `jq -r '.version' ./package.json` | Reads from package.json |
| **Major Version** | `cut -d. -f1` | First part of semver |
| **Upload Path** | `{bucket}/{deploy_folder}/v{major_version}` | `bucket/qa/v2` |

### Environment Variables (Per Environment)

| Variable | Dev Value | Stage Value | Prod Value |
|----------|-----------|-------------|------------|
| **DEPLOY_FOLDER** | `'qa'` | `'staging'` | `'production'` |
| **ENV** | `'development'` | `'staging'` | `'production'` |
| **BUCKET_SUFFIX** | `'zwwst63n'` | `'nyjcof9v'` | `'gvf7byup'` |
| **DEPLOY_BUCKET_SUFFIX** | `'zwwst63n'` | `'nyjcof9v'` | `'gvf7byup'` |
| **NODE_ENV** | `'production'` | `'production'` | `'production'` |

## Reference Commit Information
- **Commit Hash:** `c91d1b099ca26c627761887d51bd5d07cf42d914`
- **Date:** November 6, 2024, 9:25:17 AM CST
- **Author:** Jamin Roberts <103969195+jaminbroberts@users.noreply.github.com>
- **Commit Message:** "fix deploy_bucket_suffix"
- **State:** End of November 2024 (last commit affecting `.github` in November 2024)

## Complete Directory Structure

```
.github/
├── -web-4378-branch/           # Experimental directory (empty in Nov 2024)
│   └── .DS_Store              # macOS system file (0 bytes)
├── README.md                  # Documentation (50 lines, 3,001 bytes)
└── workflows/
    ├── deployment.yml         # Main deployment orchestrator (79 lines, 2,872 bytes)
    ├── workflow-tiles-build-deploy.yml  # Build & deploy workflow (197 lines, 6,910 bytes)
    └── workflow-tiles-ci-test.yml       # CI testing workflow (72 lines, 1,758 bytes)
```

## Detailed File Analysis

### 1. `.github/README.md`
- **Size:** 50 lines, 3,001 bytes
- **Purpose:** Comprehensive documentation for the CI/CD system
- **Content Summary:**
  - Explains the overall Tiles deployment architecture using GitHub Actions
  - Documents the workflow orchestration pattern
  - Provides detailed input/output specifications for each workflow
  - Describes the GCS bucket deployment strategy
  - Contains parameter tables for workflow configuration

### 2. `.github/workflows/deployment.yml`
- **Size:** 79 lines, 2,872 bytes  
- **Purpose:** Main orchestration workflow that coordinates the entire CI/CD pipeline
- **Key Features:**
  - **Trigger:** Push to `master` branch and manual workflow dispatch
  - **Concurrency Control:** Prevents overlapping deployments
  - **Sequential Pipeline:** CI Test → Dev Deploy → Stage Deploy → Prod Deploy
  - **Node.js Version:** 14 (legacy version used in Nov 2024)
  - **Environment-Specific Configuration:**
    - **Dev:** `dev-digital-banno` project, `zwwst63n` bucket suffix
    - **Stage:** `stage-digital-banno` project, `nyjcof9v` bucket suffix  
    - **Prod:** `prod-digital-banno` project, `gvf7byup` bucket suffix
  - **Deployment Paths:** Environment-specific paths (`dist/qa/v2`, `dist/staging/v2`, `dist/production/v2`)

### 3. `.github/workflows/workflow-tiles-ci-test.yml`
- **Size:** 72 lines, 1,758 bytes
- **Purpose:** Comprehensive testing workflow using Playwright
- **Key Features:**
  - **Reusable Workflow:** Called by `deployment.yml`
  - **Multi-Browser Testing:** Chromium, Firefox, WebKit
  - **Parallel Execution:** 4-way sharding for performance
  - **Test Matrix:** 12 total jobs (3 browsers × 4 shards)
  - **Version Bumping:** Automated version increment after successful tests
  - **Dependencies:** Full npm install + Playwright with dependencies
  - **CI Environment:** Ubuntu latest with configurable Node.js version

### 4. `.github/workflows/workflow-tiles-build-deploy.yml`
- **Size:** 197 lines, 6,910 bytes
- **Purpose:** Sophisticated build and deployment workflow for GCS
- **Key Features:**
  - **Reusable Workflow:** Called multiple times by `deployment.yml` for different environments
  - **Two-Stage Process:** Build job → Deploy job
  - **Artifact Management:** Upload/download between jobs
  - **GCP Integration:** 
    - Workload Identity Federation authentication
    - Cloud Storage deployment
    - Environment-specific service accounts
  - **Dynamic Configuration:** Environment variables passed as comma-separated strings
  - **Version Management:** Extracts major version from package.json for deployment paths
  - **Slack Integration:** Success/failure notifications (optional)
  - **Build Process:** Clean → Lint → Build → Upload artifacts
  - **Deployment Process:** Download artifacts → Authenticate → Deploy to GCS

### 5. `.github/-web-4378-branch/`
- **Size:** Empty directory (only contained .DS_Store)
- **Purpose:** Experimental/development directory (unused in November 2024)
- **Note:** This directory was likely created for testing new workflow configurations but contained no active workflows at this time

## Architecture Characteristics (November 2024)

### Workflow Pattern:
- **Orchestration Model:** Single main workflow (`deployment.yml`) calling reusable workflows
- **Sequential Deployment:** Dev → Stage → Prod with dependency chains
- **Environment Isolation:** Separate GCP projects and buckets per environment
- **Artifact Reuse:** Build once, deploy to multiple environments

### Technology Stack:
- **Node.js:** Version 14 (legacy)
- **Testing:** Playwright with multi-browser support
- **Cloud Platform:** Google Cloud Platform (GCS)
- **Authentication:** Workload Identity Federation
- **Notifications:** Slack integration
- **Versioning:** Automated via npm release scripts

### Security & Permissions:
- **Minimal Permissions:** `actions: read`, `checks: write`, `contents: write`, `id-token: write`
- **Service Account Pattern:** Environment-specific service accounts
- **Workload Identity:** Secure authentication without stored credentials

## Comparison to Current State

The November 2024 structure represents the **mature, complex workflow architecture** before the major simplification that occurred in April-May 2025. Key differences:

1. **Complexity:** 3 sophisticated workflows vs. current simplified 3-workflow system
2. **Documentation:** Comprehensive README vs. current minimal documentation  
3. **Architecture:** Orchestration pattern vs. current independent workflows
4. **Node.js:** Legacy v14 vs. current v20+
5. **Testing:** Complex sharded Playwright setup vs. current streamlined approach
6. **Deployment:** Multi-environment sequential pipeline vs. current flexible approach

This November 2024 state represents the peak of the repository's workflow complexity before the team decided to simplify and modernize the CI/CD architecture.

## Historical Context

This analysis was generated by examining commit `c91d1b09` which was the final commit affecting the `.github` directory in November 2024. The structure shown here represents the stable, production-ready CI/CD system that was in use during the latter part of 2024, before the major architectural changes implemented in 2025.

The workflows at this time were characterized by:
- High reliability and stability
- Comprehensive testing coverage
- Multi-environment deployment automation
- Detailed documentation and configuration
- Enterprise-grade security practices

This documentation serves as a historical reference for understanding the evolution of the repository's CI/CD architecture and can be valuable for:
- Understanding past architectural decisions
- Comparing current vs. historical approaches
- Potential rollback scenarios
- Learning from previous implementations
