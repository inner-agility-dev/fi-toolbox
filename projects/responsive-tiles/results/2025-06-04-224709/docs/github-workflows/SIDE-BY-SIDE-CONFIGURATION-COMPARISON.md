# Side-by-Side Configuration Comparison: November 2024 vs Current State

## Overview
This document provides a detailed side-by-side comparison of GitHub Actions and GCP configuration settings between the November 2024 baseline (commit `c91d1b09`) and the current state (June 2025). The November 2024 values are sourced from the authoritative TL;DR Configuration Matrix in `docs/github-workflows/NOVEMBER-2024-GITHUB-FOLDER-ANALYSIS.md`.

## TL;DR - Critical Configuration Issues Summary

### 📊 **Change Summary**
- **6 Breaking Changes** requiring immediate action
- **8 Modified Settings** that are compatible but changed
- **7 New Features** added since November 2024
- **15+ Identical Settings** maintained consistency

### 🚨 **Breaking Changes (❌) - IMMEDIATE ACTION REQUIRED**

1. **Development Environment Name Mismatch**
   - **Files**: `.github/workflows/pr-workflow.yml`
   - **Issue**: GitHub environment changed from `dev` to `development`
   - **Priority**: **CRITICAL** - Fix before any PR deployments
   - **Risk**: Environment protection rules won't apply, potential security bypass
   - **Fix**: Change `environment: development` to `environment: dev` in pr-workflow.yml

2. **Inconsistent Development Content Paths**
   - **Files**: `.github/workflows/pr-workflow.yml`
   - **Issue**: Mixed `dist/dev/v2` vs `dist/qa/v2` handling in PR workflow
   - **Priority**: **CRITICAL** - Fix before any deployments
   - **Risk**: Deployment failures, inconsistent artifact handling
   - **Fix**: Standardize to `dist/qa/v2` pattern throughout all workflows

3. **Missing BUCKET_SUFFIX Environment Variables**
   - **Files**: `.github/workflows/pr-workflow.yml`, `.github/workflows/main-deployment.yml`
   - **Issue**: `BUCKET_SUFFIX` and `DEPLOY_BUCKET_SUFFIX` no longer defined
   - **Priority**: **HIGH** - May affect build scripts
   - **Risk**: Build failures if scripts depend on these variables
   - **Fix**: Restore environment variable definitions per environment

4. **Missing NODE_ENV Configuration**
   - **Files**: `.github/workflows/pr-workflow.yml`, `.github/workflows/main-deployment.yml`
   - **Issue**: `NODE_ENV=production` no longer explicitly set
   - **Priority**: **HIGH** - May affect build optimization
   - **Risk**: Suboptimal builds, potential runtime issues
   - **Fix**: Add `NODE_ENV: production` to all deployment environments

5. **Lost Dynamic Versioning**
   - **Files**: `.github/workflows/main-deployment.yml`, `.github/workflows/pr-workflow.yml`
   - **Issue**: Major version extraction removed, hardcoded to `v2`
   - **Priority**: **MEDIUM** - Affects future major version releases
   - **Risk**: Manual intervention required for v3+ releases
   - **Fix**: Restore `cut -d. -f1` logic for dynamic `v{major}` paths

6. **Contents Permission Downgrade**
   - **Files**: `.github/workflows/main-deployment.yml`
   - **Issue**: Main deployment workflow contents permission `write` → `read`
   - **Priority**: **MEDIUM** - Verify if git operations needed
   - **Risk**: Potential failures if workflow needs to write to repository
   - **Fix**: Restore `contents: write` if git operations are required

### ⚠️ **Modified Settings (Compatible but Changed)**

1. **Deploy Path Hardcoding**: `v{major}` → `v2` (affects future versioning)
   - **Files**: `.github/workflows/main-deployment.yml`, `.github/workflows/pr-workflow.yml`

2. **Upload Method Variation**: Mixed `upload-cloud-storage` + `gsutil rsync` (inconsistent)
   - **Files**: `.github/workflows/pr-workflow.yml` (uses gsutil), `.github/workflows/main-deployment.yml` (uses upload-cloud-storage)

3. **Version Extraction Method**: `jq` → `node -p` (functionally equivalent)
   - **Files**: `.github/workflows/main-deployment.yml`, `.github/workflows/pr-workflow.yml`, `.github/workflows/merged-workflow.yml`

4. **Artifact Naming Patterns**: Updated for better PR/version context
   - **Files**: `.github/workflows/pr-workflow.yml` (PR-specific), `.github/workflows/main-deployment.yml` (production-specific)

5. **Test Browser Coverage**: Removed WebKit, kept Chromium + Firefox
   - **Files**: `.github/workflows/pr-workflow.yml`

6. **Test Sharding**: Removed 4-way sharding (12 jobs → 2 jobs)
   - **Files**: `.github/workflows/pr-workflow.yml` (no longer uses sharding matrix)

7. **Workflow Architecture**: Orchestration → Independent workflows
   - **Files**: All workflows (`.github/workflows/main-deployment.yml`, `.github/workflows/pr-workflow.yml`, `.github/workflows/merged-workflow.yml`)

8. **Upload Destination Pattern**: Dynamic versioning → Static `v2`
   - **Files**: `.github/workflows/main-deployment.yml`, `.github/workflows/pr-workflow.yml`

### 🆕 **Positive New Features**
- Enhanced PR workflows with development deployment
- Modern Node.js (v14 → v20.18.1)
- Browser caching and artifact retention policies
- Improved deployment verification and status reporting
- Cross-workflow triggering capabilities
- Enhanced error handling and monitoring
- Better PR commenting and status updates

### ⏰ **Recommended Action Timeline**

**Before Next PR Deployment (Within 24 hours):**
1. Fix development environment name mismatch
2. Standardize content paths

**Before Next Production Deployment (Within 1 week):**
3. Restore missing environment variables
4. Verify and fix permission requirements

**For Next Major Release Planning:**
5. Restore dynamic versioning capability
6. Evaluate test coverage restoration

## Status Legend
- ✅ **IDENTICAL** - Configuration unchanged
- ⚠️ **MODIFIED** - Changed but compatible
- ❌ **BREAKING** - Breaking change or missing configuration
- 🆕 **NEW** - New configuration added since November 2024

## Environment-Specific Configuration Matrix

| Environment | Setting | November 2024 (Baseline) | Current State | Status |
|-------------|---------|---------------------------|---------------|---------|
| **Dev** | GitHub Environment | `dev` | `development` | ❌ **BREAKING** |
| **Dev** | GCP Project ID | `dev-digital-banno` | `dev-digital-banno` | ✅ **IDENTICAL** |
| **Dev** | GCP Hosting Bucket | `dev-digital-gzo-geezeo-tiles-zwwst63n` | `dev-digital-gzo-geezeo-tiles-zwwst63n` | ✅ **IDENTICAL** |
| **Dev** | Bucket Suffix | `zwwst63n` | `zwwst63n` | ✅ **IDENTICAL** |
| **Dev** | Deploy Folder | `qa` | `qa` | ✅ **IDENTICAL** |
| **Dev** | Deploy Path | `qa/v{major}` | `qa/v2` | ⚠️ **MODIFIED** |
| **Dev** | Content Path | `dist/qa/v2` | `dist/dev/v2` or `dist/qa/v2` | ❌ **BREAKING** |
| **Stage** | GitHub Environment | `staging` | `staging` | ✅ **IDENTICAL** |
| **Stage** | GCP Project ID | `stage-digital-banno` | `stage-digital-banno` | ✅ **IDENTICAL** |
| **Stage** | GCP Hosting Bucket | `stage-digital-gzo-geezeo-tiles-nyjcof9v` | `stage-digital-gzo-geezeo-tiles-nyjcof9v` | ✅ **IDENTICAL** |
| **Stage** | Bucket Suffix | `nyjcof9v` | `nyjcof9v` | ✅ **IDENTICAL** |
| **Stage** | Deploy Folder | `staging` | `staging` | ✅ **IDENTICAL** |
| **Stage** | Deploy Path | `staging/v{major}` | `staging/v2` | ⚠️ **MODIFIED** |
| **Stage** | Content Path | `dist/staging/v2` | `dist/staging/v2` | ✅ **IDENTICAL** |
| **Prod** | GitHub Environment | `production` | `production` | ✅ **IDENTICAL** |
| **Prod** | GCP Project ID | `prod-digital-banno` | `prod-digital-banno` | ✅ **IDENTICAL** |
| **Prod** | GCP Hosting Bucket | `prod-digital-gzo-geezeo-tiles-gvf7byup` | `prod-digital-gzo-geezeo-tiles-gvf7byup` | ✅ **IDENTICAL** |
| **Prod** | Bucket Suffix | `gvf7byup` | `gvf7byup` | ✅ **IDENTICAL** |
| **Prod** | Deploy Folder | `production` | `production` | ✅ **IDENTICAL** |
| **Prod** | Deploy Path | `production/v{major}` | `production/v2` | ⚠️ **MODIFIED** |
| **Prod** | Content Path | `dist/production/v2` | `dist/production/v2` | ✅ **IDENTICAL** |

## GCP Configuration Settings

| Setting | November 2024 (Baseline) | Current State | Status |
|---------|---------------------------|---------------|---------|
| **Workload Identity Provider** | `projects/423509969265/locations/global/workloadIdentityPools/gha-cldteam-pool-58a241b9/providers/gha-cldteam-provid-58a241b9` | `projects/423509969265/locations/global/workloadIdentityPools/gha-cldteam-pool-58a241b9/providers/gha-cldteam-provid-58a241b9` | ✅ **IDENTICAL** |
| **Service Account Pattern** | `geezeo-tiles@{gcp_project_id}.iam.gserviceaccount.com` | `geezeo-tiles@{gcp_project_id}.iam.gserviceaccount.com` | ✅ **IDENTICAL** |
| **Token Format** | `access_token` | `access_token` | ✅ **IDENTICAL** |
| **Bucket Project ID** | Same as GCP Project ID | Same as GCP Project ID | ✅ **IDENTICAL** |
| **Upload Destination Pattern** | `{bucket}/{deploy_folder}/v{major_version}` | `{bucket}/{deploy_folder}/v2` | ⚠️ **MODIFIED** |
| **Process gcloudignore** | `false` | `false` | ✅ **IDENTICAL** |
| **Upload Method** | `google-github-actions/upload-cloud-storage@v2` | Mixed: `upload-cloud-storage@v2` + `gsutil rsync` | ⚠️ **MODIFIED** |

## GitHub Workflow Configuration

| Setting | November 2024 (Baseline) | Current State | Status |
|---------|---------------------------|---------------|---------|
| **Primary Trigger** | `push: branches: ["master"]` | `push: branches: ["master"]` | ✅ **IDENTICAL** |
| **Secondary Trigger** | `workflow_dispatch` | `workflow_dispatch` | ✅ **IDENTICAL** |
| **PR Trigger** | Not present | `pull_request: types: [opened, synchronize]` | 🆕 **NEW** |
| **Post-Merge Trigger** | Not present | `pull_request: types: [closed]` | 🆕 **NEW** |
| **Node.js Version** | `14` | `20.18.1` | ✅ **UPGRADED** |
| **Concurrency Group** | `${{ github.repository }}-${{ github.event.push.number \|\| github.ref }}` | `${{ github.repository }}-${{ github.event.push.number \|\| github.ref }}` | ✅ **IDENTICAL** |
| **Cancel in Progress** | `true` | `true` | ✅ **IDENTICAL** |
| **Workflow Pattern** | Orchestration (main calls reusable) | Independent workflows with cross-triggering | ⚠️ **MODIFIED** |

## Permissions Matrix

| Workflow Type | Permission | November 2024 (Baseline) | Current State | Status |
|---------------|------------|---------------------------|---------------|---------|
| **Main Deployment** | actions | `read` | `read` | ✅ **IDENTICAL** |
| **Main Deployment** | checks | `write` | `write` | ✅ **IDENTICAL** |
| **Main Deployment** | contents | `write` | `read` | ❌ **BREAKING** |
| **Main Deployment** | id-token | `write` | `write` | ✅ **IDENTICAL** |
| **Main Deployment** | pull-requests | Not present | `write` | 🆕 **NEW** |
| **PR Workflow** | actions | Not applicable | `write` | 🆕 **NEW** |
| **PR Workflow** | contents | Not applicable | `read` | 🆕 **NEW** |
| **PR Workflow** | id-token | Not applicable | `write` | 🆕 **NEW** |
| **PR Workflow** | pull-requests | Not applicable | `write` | 🆕 **NEW** |
| **Post-Merge** | actions | Not applicable | `write` | 🆕 **NEW** |
| **Post-Merge** | contents | Not applicable | `read` | 🆕 **NEW** |
| **Post-Merge** | id-token | Not applicable | `write` | 🆕 **NEW** |
| **Post-Merge** | pull-requests | Not applicable | `write` | 🆕 **NEW** |

## Testing Configuration

| Setting | November 2024 (Baseline) | Current State | Status |
|---------|---------------------------|---------------|---------|
| **Test Browsers** | `[chromium, firefox, webkit]` | `[chromium, firefox]` | ⚠️ **MODIFIED** |
| **Shard Configuration** | `[1, 2, 3, 4]` of `[4]` total | Not used | ❌ **BREAKING** |
| **Total Test Jobs** | 12 (3 browsers × 4 shards) | 2 (2 browsers) | ❌ **BREAKING** |
| **Test Runner** | Playwright | Playwright | ✅ **IDENTICAL** |
| **CI Environment** | `ubuntu-latest` | `ubuntu-latest` | ✅ **IDENTICAL** |
| **Browser Caching** | Not present | `actions/cache@v4` | 🆕 **NEW** |
| **Test Timeout** | Default | `PLAYWRIGHT_TIMEOUT=120000` | 🆕 **NEW** |

## Artifact & Deployment Patterns

| Pattern | November 2024 (Baseline) | Current State | Status |
|---------|---------------------------|---------------|---------|
| **Artifact Name Template** | `{project_name}-{ENV}-staged-artifacts` | `tiles-pr-{pr_number}-{version}` / `tiles-production-{version}` | ⚠️ **MODIFIED** |
| **Version Extraction** | `jq -r '.version' ./package.json` | `node -p "require('./package.json').version"` | ⚠️ **MODIFIED** |
| **Major Version Extraction** | `cut -d. -f1` | Not used (hardcoded v2) | ❌ **BREAKING** |
| **Upload Path Pattern** | `{bucket}/{deploy_folder}/v{major_version}` | `{bucket}/{deploy_folder}/v2` | ⚠️ **MODIFIED** |
| **Artifact Retention** | Not specified | 30 days (production), 7 days (PR) | 🆕 **NEW** |

## Environment Variables

| Variable | November 2024 (Baseline) | Current State | Status |
|----------|---------------------------|---------------|---------|
| **DEPLOY_FOLDER** | Dev: `'qa'`, Stage: `'staging'`, Prod: `'production'` | Dev: `qa`, Stage: `staging`, Prod: `production` | ✅ **IDENTICAL** |
| **ENV** | Dev: `'development'`, Stage: `'staging'`, Prod: `'production'` | Dev: `development`, Stage: `staging`, Prod: `production` | ✅ **IDENTICAL** |
| **BUCKET_SUFFIX** | Dev: `'zwwst63n'`, Stage: `'nyjcof9v'`, Prod: `'gvf7byup'` | Not used | ❌ **BREAKING** |
| **DEPLOY_BUCKET_SUFFIX** | Dev: `'zwwst63n'`, Stage: `'nyjcof9v'`, Prod: `'gvf7byup'` | Not used | ❌ **BREAKING** |
| **NODE_ENV** | All environments: `'production'` | Not explicitly set | ❌ **BREAKING** |

## Critical Configuration Issues Summary

### ❌ Breaking Changes (Immediate Action Required)

1. **Development Environment Name Mismatch**
   - **Issue**: GitHub environment changed from `dev` to `development`
   - **Impact**: Environment protection rules may not apply correctly
   - **Fix**: Change `environment: development` to `environment: dev` in pr-workflow.yml

2. **Inconsistent Development Content Paths**
   - **Issue**: Mixed handling of `dist/dev/v2` vs `dist/qa/v2` in PR workflow
   - **Impact**: Deployment logic confusion and potential failures
   - **Fix**: Standardize to `dist/qa/v2` pattern as per November 2024 baseline

3. **Missing Environment Variables**
   - **Issue**: `BUCKET_SUFFIX`, `DEPLOY_BUCKET_SUFFIX`, and `NODE_ENV` no longer set
   - **Impact**: May affect build behavior if scripts depend on these variables
   - **Fix**: Restore environment variable definitions

4. **Lost Dynamic Versioning**
   - **Issue**: Major version extraction removed, hardcoded to `v2`
   - **Impact**: No automatic version path updates for major version changes
   - **Fix**: Restore `cut -d. -f1` logic for dynamic version paths

5. **Reduced Test Coverage**
   - **Issue**: WebKit browser testing and test sharding removed
   - **Impact**: Reduced test coverage (12 jobs → 2 jobs)
   - **Fix**: Evaluate if comprehensive testing should be restored

6. **Contents Permission Downgrade**
   - **Issue**: Main deployment workflow contents permission changed from `write` to `read`
   - **Impact**: May prevent git operations if needed
   - **Fix**: Verify if `write` permission is needed for deployment workflow

### ⚠️ Modified but Compatible Changes

1. **Upload Method Variation**: Mixed use of `upload-cloud-storage` and `gsutil rsync`
2. **Version Extraction Method**: Changed from `jq` to `node -p` (functionally equivalent)
3. **Artifact Naming**: Updated patterns for better PR/version context
4. **Deploy Path Hardcoding**: Changed from dynamic `v{major}` to static `v2`

### 🆕 Positive New Features

1. **Enhanced PR Workflows**: Dedicated PR validation and development deployment
2. **Modern CI/CD Practices**: Browser caching, artifact retention policies
3. **Improved Monitoring**: Deployment verification and status reporting
4. **Node.js Modernization**: Upgraded from v14 to v20.18.1

### ✅ Maintained Consistency

- All GCP project IDs and bucket names remain identical
- Core authentication and service account patterns preserved
- Primary workflow triggers and concurrency settings unchanged
- Staging and production environment configurations consistent

## Recommendations

### Immediate Priority (Fix Before Production Deployment)

1. **Align Development Environment Name**
   ```yaml
   # Change in pr-workflow.yml:
   environment: dev  # Not 'development'
   ```

2. **Standardize Content Paths**
   ```yaml
   # Ensure consistent pattern:
   content_paths: dist/qa/v2      # For dev
   content_paths: dist/staging/v2 # For staging
   content_paths: dist/production/v2 # For production
   ```

3. **Restore Missing Environment Variables**
   ```yaml
   env:
     NODE_ENV: production
     BUCKET_SUFFIX: zwwst63n  # Per environment
     DEPLOY_BUCKET_SUFFIX: zwwst63n
   ```

### Medium Priority (Enhance Consistency)

1. **Restore Dynamic Versioning**
2. **Standardize Upload Methods**
3. **Evaluate Test Coverage Restoration**
4. **Review Permission Requirements**

### Documentation Priority

1. **Update Environment Mapping Documentation**
2. **Document Intentional Changes from November 2024**
3. **Create Migration Guide for Configuration Updates**

## Conclusion

The comparison reveals significant modernization improvements alongside critical configuration drift issues. While the current state includes valuable enhancements like modern Node.js, enhanced PR workflows, and better CI/CD practices, several breaking changes need immediate attention to ensure deployment reliability and consistency with the established November 2024 infrastructure baseline.
