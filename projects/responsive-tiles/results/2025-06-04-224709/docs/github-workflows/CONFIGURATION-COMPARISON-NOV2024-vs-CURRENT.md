# Configuration Comparison: November 2024 vs Current State

## Executive Summary

This document compares the GitHub Actions workflow configurations between the November 2024 baseline (commit `c91d1b09`) and the current state (June 2025). The analysis focuses on infrastructure and deployment configuration changes, highlighting evolution from a complex orchestrated architecture to a simplified modern approach.

## Workflow Architecture Comparison

### November 2024 (Baseline)
- **Files:** 3 workflows (deployment.yml, workflow-tiles-ci-test.yml, workflow-tiles-build-deploy.yml)
- **Pattern:** Orchestration model (main workflow calls reusable workflows)
- **Total Lines:** 348 lines across all workflows
- **Documentation:** Comprehensive README.md (50 lines)

### Current State (June 2025)
- **Files:** 3 workflows (main-deployment.yml, pr-workflow.yml, merged-workflow.yml)
- **Pattern:** Independent workflows with cross-workflow triggering
- **Total Lines:** ~600+ lines across all workflows
- **Documentation:** No README.md in workflows directory

## Environment-Specific Configuration Matrix Comparison

| Environment | Setting | November 2024 | Current State | Status |
|-------------|---------|---------------|---------------|---------|
| **Dev** | GitHub Environment | `dev` | `development` | ⚠️ **CHANGED** |
| **Dev** | GCP Project ID | `dev-digital-banno` | `dev-digital-banno` | ✅ **SAME** |
| **Dev** | GCP Hosting Bucket | `dev-digital-gzo-geezeo-tiles-zwwst63n` | `dev-digital-gzo-geezeo-tiles-zwwst63n` | ✅ **SAME** |
| **Dev** | Bucket Suffix | `zwwst63n` | `zwwst63n` | ✅ **SAME** |
| **Dev** | Deploy Folder | `qa` | `qa` | ✅ **SAME** |
| **Dev** | Deploy Path | `qa/v{major}` | `qa/v2` | ⚠️ **CHANGED** |
| **Dev** | Content Path | `dist/qa/v2` | `dist/dev/v2` or `dist/qa/v2` | ⚠️ **INCONSISTENT** |
| **Stage** | GitHub Environment | `staging` | `staging` | ✅ **SAME** |
| **Stage** | GCP Project ID | `stage-digital-banno` | `stage-digital-banno` | ✅ **SAME** |
| **Stage** | GCP Hosting Bucket | `stage-digital-gzo-geezeo-tiles-nyjcof9v` | `stage-digital-gzo-geezeo-tiles-nyjcof9v` | ✅ **SAME** |
| **Stage** | Bucket Suffix | `nyjcof9v` | `nyjcof9v` | ✅ **SAME** |
| **Stage** | Deploy Folder | `staging` | `staging` | ✅ **SAME** |
| **Stage** | Deploy Path | `staging/v{major}` | `staging/v2` | ⚠️ **CHANGED** |
| **Prod** | GitHub Environment | `production` | `production` | ✅ **SAME** |
| **Prod** | GCP Project ID | `prod-digital-banno` | `prod-digital-banno` | ✅ **SAME** |
| **Prod** | GCP Hosting Bucket | `prod-digital-gzo-geezeo-tiles-gvf7byup` | `prod-digital-gzo-geezeo-tiles-gvf7byup` | ✅ **SAME** |
| **Prod** | Bucket Suffix | `gvf7byup` | `gvf7byup` | ✅ **SAME** |
| **Prod** | Deploy Folder | `production` | `production` | ✅ **SAME** |
| **Prod** | Deploy Path | `production/v{major}` | `production/v2` | ⚠️ **CHANGED** |

## GCP Configuration Settings Comparison

| Setting | November 2024 | Current State | Status |
|---------|---------------|---------------|---------|
| **Workload Identity Provider** | `projects/423509969265/locations/global/workloadIdentityPools/gha-cldteam-pool-58a241b9/providers/gha-cldteam-provid-58a241b9` | `projects/423509969265/locations/global/workloadIdentityPools/gha-cldteam-pool-58a241b9/providers/gha-cldteam-provid-58a241b9` | ✅ **SAME** |
| **Service Account Pattern** | `geezeo-tiles@{gcp_project_id}.iam.gserviceaccount.com` | `geezeo-tiles@{gcp_project_id}.iam.gserviceaccount.com` | ✅ **SAME** |
| **Token Format** | `access_token` | `access_token` | ✅ **SAME** |
| **Bucket Project ID** | Same as GCP Project ID | Same as GCP Project ID | ✅ **SAME** |
| **Upload Destination Pattern** | `{bucket}/{deploy_folder}/v{major_version}` | `{bucket}/{deploy_folder}/v2` | ⚠️ **CHANGED** |
| **Process gcloudignore** | `false` | `false` | ✅ **SAME** |
| **Upload Method** | `google-github-actions/upload-cloud-storage@v2` | `google-github-actions/upload-cloud-storage@v2` + `gsutil rsync` | ⚠️ **MIXED** |

## GitHub Workflow Configuration Comparison

| Setting | November 2024 | Current State | Status |
|---------|---------------|---------------|---------|
| **Primary Trigger** | `push: branches: ["master"]` | `push: branches: ["master"]` | ✅ **SAME** |
| **Secondary Trigger** | `workflow_dispatch` | `workflow_dispatch` | ✅ **SAME** |
| **PR Trigger** | Not present | `pull_request: types: [opened, synchronize]` | 🆕 **NEW** |
| **Post-Merge Trigger** | Not present | `pull_request: types: [closed]` | 🆕 **NEW** |
| **Node.js Version** | `14` | `20.18.1` | ✅ **UPGRADED** |
| **Concurrency Group** | `${{ github.repository }}-${{ github.event.push.number \|\| github.ref }}` | `${{ github.repository }}-${{ github.event.push.number \|\| github.ref }}` | ✅ **SAME** |
| **Cancel in Progress** | `true` | `true` | ✅ **SAME** |
| **Workflow Pattern** | Orchestration (main calls reusable) | Independent workflows | ⚠️ **CHANGED** |

## Permissions Matrix Comparison

| Workflow | November 2024 | Current State | Changes |
|----------|---------------|---------------|---------|
| **Main Deployment** | `actions: read, checks: write, contents: write, id-token: write` | `actions: read, checks: write, contents: read, id-token: write, pull-requests: write` | ⚠️ **contents downgraded, pull-requests added** |
| **PR Workflow** | Not present | `contents: read, id-token: write, pull-requests: write, actions: write` | 🆕 **NEW** |
| **Post-Merge** | Not present | `contents: read, id-token: write, actions: write, pull-requests: write` | 🆕 **NEW** |

## Testing Configuration Comparison

| Setting | November 2024 | Current State | Status |
|---------|---------------|---------------|---------|
| **Test Browsers** | `[chromium, firefox, webkit]` | `[chromium, firefox]` | ⚠️ **REDUCED** |
| **Shard Configuration** | `[1, 2, 3, 4]` of `[4]` total | Not used | ❌ **REMOVED** |
| **Total Test Jobs** | 12 (3 browsers × 4 shards) | 2 (2 browsers) | ⚠️ **REDUCED** |
| **Test Runner** | Playwright | Playwright | ✅ **SAME** |
| **CI Environment** | `ubuntu-latest` | `ubuntu-latest` | ✅ **SAME** |
| **Browser Caching** | Not present | `actions/cache@v4` for browsers | 🆕 **NEW** |
| **Test Timeout** | Default | `PLAYWRIGHT_TIMEOUT=120000` | 🆕 **NEW** |

## Artifact & Deployment Patterns Comparison

| Pattern | November 2024 | Current State | Status |
|---------|---------------|---------------|---------|
| **Artifact Name** | `{project_name}-{ENV}-staged-artifacts` | `tiles-pr-{pr_number}-{version}` / `tiles-production-{version}` | ⚠️ **CHANGED** |
| **Version Extraction** | `jq -r '.version' ./package.json` | `node -p "require('./package.json').version"` | ⚠️ **CHANGED** |
| **Major Version** | `cut -d. -f1` | Not used (hardcoded v2) | ❌ **REMOVED** |
| **Upload Path** | `{bucket}/{deploy_folder}/v{major_version}` | `{bucket}/{deploy_folder}/v2` | ⚠️ **SIMPLIFIED** |
| **Retention Days** | Not specified | 30 days (production), 7 days (PR) | 🆕 **NEW** |

## Environment Variables Comparison

| Variable | November 2024 Values | Current State Values | Status |
|----------|---------------------|---------------------|---------|
| **DEPLOY_FOLDER** | Dev: `'qa'`, Stage: `'staging'`, Prod: `'production'` | Dev: `qa`, Stage: `staging`, Prod: `production` | ✅ **SAME** |
| **ENV** | Dev: `'development'`, Stage: `'staging'`, Prod: `'production'` | Dev: `development`, Stage: `staging`, Prod: `production` | ✅ **SAME** |
| **BUCKET_SUFFIX** | Dev: `'zwwst63n'`, Stage: `'nyjcof9v'`, Prod: `'gvf7byup'` | Not used | ❌ **REMOVED** |
| **DEPLOY_BUCKET_SUFFIX** | Dev: `'zwwst63n'`, Stage: `'nyjcof9v'`, Prod: `'gvf7byup'` | Not used | ❌ **REMOVED** |
| **NODE_ENV** | All: `'production'` | Not explicitly set | ❌ **REMOVED** |

## Key Configuration Issues Identified

### 🚨 Critical Issues

1. **Development Environment Name Mismatch**
   - **November 2024:** GitHub environment = `dev`
   - **Current:** GitHub environment = `development`
   - **Impact:** Environment protection rules may not apply correctly

2. **Inconsistent Build Output Paths**
   - **November 2024:** Consistent `dist/{deploy_folder}/v2` pattern
   - **Current:** Mixed `dist/dev/v2` and `dist/qa/v2` handling in PR workflow
   - **Impact:** Deployment logic has fallback handling but creates confusion

3. **Version Path Hardcoding**
   - **November 2024:** Dynamic `v{major_version}` based on package.json
   - **Current:** Hardcoded `v2` paths
   - **Impact:** No automatic version path updates for major version changes

### ⚠️ Configuration Drift

1. **Removed Environment Variables**
   - `BUCKET_SUFFIX` and `DEPLOY_BUCKET_SUFFIX` no longer used
   - `NODE_ENV` not explicitly set in current workflows
   - May affect build behavior if these were used by build scripts

2. **Testing Scope Reduction**
   - Removed WebKit browser testing
   - Eliminated test sharding (12 jobs → 2 jobs)
   - May reduce test coverage and CI performance

3. **Upload Method Changes**
   - November 2024: Consistent `upload-cloud-storage` action
   - Current: Mixed `upload-cloud-storage` and `gsutil rsync`
   - Different methods may have different behavior/performance

### 🆕 New Features Added

1. **PR-Specific Workflows**
   - Dedicated PR validation and development deployment
   - Post-merge triggering mechanism
   - Enhanced PR commenting and status reporting

2. **Modern CI/CD Practices**
   - Browser caching for faster test execution
   - Artifact retention policies
   - Enhanced error handling and verification

3. **Improved Monitoring**
   - Deployment verification steps
   - Comprehensive status reporting
   - Better artifact naming with PR/version context

## Recommendations

### Immediate Actions Required

1. **Fix Environment Name Consistency**
   ```yaml
   # In pr-workflow.yml, change:
   environment: development
   # To:
   environment: dev
   ```

2. **Standardize Build Output Paths**
   - Ensure consistent `dist/{deploy_folder}/v2` pattern across all workflows
   - Remove fallback logic that handles multiple path patterns

3. **Restore Dynamic Version Paths**
   - Implement major version extraction: `cut -d. -f1`
   - Use `v{major_version}` instead of hardcoded `v2`

### Configuration Alignment

1. **Restore Missing Environment Variables**
   ```yaml
   env:
     NODE_ENV: production
     BUCKET_SUFFIX: ${{ env.BUCKET_SUFFIX }}
     DEPLOY_BUCKET_SUFFIX: ${{ env.DEPLOY_BUCKET_SUFFIX }}
   ```

2. **Standardize Upload Methods**
   - Choose either `upload-cloud-storage` or `gsutil rsync` consistently
   - Document rationale for method choice

3. **Consider Test Coverage Restoration**
   - Evaluate if WebKit testing should be restored
   - Consider if test sharding is needed for performance

### Documentation Updates

1. **Restore Workflow Documentation**
   - Create new README.md in `.github/workflows/`
   - Document current architecture and configuration patterns

2. **Update Environment Mapping**
   - Document current environment → GCP resource mappings
   - Clarify any intentional changes from November 2024 baseline

## Conclusion

The current workflow configuration represents a significant modernization from November 2024, with improved Node.js version, enhanced PR workflows, and better CI/CD practices. However, several configuration inconsistencies and drift issues need attention to ensure reliable deployments and maintain consistency with the established infrastructure patterns.

**Priority:** Address the critical environment name mismatch and build path inconsistencies before deploying to production environments.
