# Configuration Remediation Action Plan

## Executive Summary
This action plan addresses the 6 breaking changes and 8 modified settings identified in the side-by-side configuration comparison. The plan is structured in three phases: Immediate (24-48 hours), Short-term (1-2 weeks), and Long-term (next major release cycle).

### 📁 **Files Requiring Changes Summary**

**Phase 1 (Critical - 24-48 hours):**
- **`.github/workflows/pr-workflow.yml`** - 5 breaking changes (environment name, content paths, env vars, dynamic versioning, testing)
- **`.github/workflows/main-deployment.yml`** - 3 breaking changes (env vars, dynamic versioning, permissions)

**Phase 2 (High Priority - 1-2 weeks):**
- **`.github/workflows/pr-workflow.yml`** - Upload method standardization, test coverage evaluation
- **`.github/workflows/main-deployment.yml`** - Dynamic versioning restoration
- **`.github/workflows/README.md`** - New documentation file to create

**Phase 3 (Medium Priority - Next release):**
- **All workflow files** - Architecture modernization evaluation
- **Documentation updates** - Project-wide documentation refresh

## Phase 1: Immediate Actions (Critical Priority - 24-48 hours)

### 🚨 **Task 1.1: Fix Development Environment Name Mismatch**
**Priority**: CRITICAL | **Estimated Time**: 30 minutes | **Risk Level**: HIGH

**Issue**: GitHub environment changed from `dev` to `development`

**File to Modify**: `.github/workflows/pr-workflow.yml`

**Before**:
```yaml
deploy-dev:
  needs: [validation, tests, build]
  if: success()
  runs-on: ubuntu-latest
  environment: development  # ❌ INCORRECT
```

**After**:
```yaml
deploy-dev:
  needs: [validation, tests, build]
  if: success()
  runs-on: ubuntu-latest
  environment: dev  # ✅ CORRECT
```

**Testing Procedure**:
1. Create test PR to verify environment protection rules apply
2. Check GitHub UI shows correct environment name in deployment logs
3. Verify environment-specific secrets are accessible

**Success Criteria**: PR deployment uses `dev` environment with proper protection rules

---

### 🚨 **Task 1.2: Standardize Development Content Paths**
**Priority**: CRITICAL | **Estimated Time**: 45 minutes | **Risk Level**: HIGH

**Issue**: Mixed `dist/dev/v2` vs `dist/qa/v2` handling in PR workflow

**File to Modify**: `.github/workflows/pr-workflow.yml`

**Before**:
```yaml
- name: Check artifact structure
  run: |
    # Mixed path handling
    if [ -d "./dist/dev/v2" ]; then
      echo "Found dev/v2 directory (default build output)"
      ls -la ./dist/dev/v2/ | head -10
    fi
    if [ -d "./dist/qa/v2" ]; then
      echo "Found qa/v2 directory"
      ls -la ./dist/qa/v2/ | head -10
    fi

- name: Deploy to development
  run: |
    if [ -d "./dist/dev/v2" ]; then
      echo "Deploying from dist/dev/v2 (default build output)"
      gsutil -m rsync -r -d ./dist/dev/v2/ gs://${{ env.GCP_HOSTING_BUCKET }}/${{ env.DEPLOY_FOLDER }}/v2/
    elif [ -d "./dist/qa/v2" ]; then
      echo "Deploying from dist/qa/v2"
      gsutil -m rsync -r -d ./dist/qa/v2/ gs://${{ env.GCP_HOSTING_BUCKET }}/${{ env.DEPLOY_FOLDER }}/v2/
    fi
```

**After**:
```yaml
- name: Check artifact structure
  run: |
    # Standardized path handling
    if [ -d "./dist/qa/v2" ]; then
      echo "Found qa/v2 directory"
      ls -la ./dist/qa/v2/ | head -10
    else
      echo "ERROR: Expected dist/qa/v2 directory not found"
      ls -la ./dist/
      exit 1
    fi

- name: Deploy to development
  run: |
    echo "Deploying from dist/qa/v2"
    gsutil -m rsync -r -d ./dist/qa/v2/ gs://${{ env.GCP_HOSTING_BUCKET }}/${{ env.DEPLOY_FOLDER }}/v2/
```

**Testing Procedure**:
1. Run build locally to verify `dist/qa/v2` structure
2. Test PR workflow deployment with standardized paths
3. Verify deployed files match expected structure

**Success Criteria**: Consistent `dist/qa/v2` path usage throughout workflow

---

### 🚨 **Task 1.3: Restore Missing Environment Variables**
**Priority**: HIGH | **Estimated Time**: 1 hour | **Risk Level**: MEDIUM

**Issue**: `BUCKET_SUFFIX`, `DEPLOY_BUCKET_SUFFIX`, and `NODE_ENV` no longer defined

**Files to Modify**: 
- `.github/workflows/pr-workflow.yml`
- `.github/workflows/main-deployment.yml`

**Before** (pr-workflow.yml):
```yaml
- name: Set environment variables
  run: |
    echo "DEPLOY_FOLDER=qa" >> $GITHUB_ENV
    echo "ENV=development" >> $GITHUB_ENV
    echo "GCP_PROJECT_ID=dev-digital-banno" >> $GITHUB_ENV
    echo "GCP_HOSTING_BUCKET=dev-digital-gzo-geezeo-tiles-zwwst63n" >> $GITHUB_ENV
```

**After** (pr-workflow.yml):
```yaml
- name: Set environment variables
  run: |
    echo "DEPLOY_FOLDER=qa" >> $GITHUB_ENV
    echo "ENV=development" >> $GITHUB_ENV
    echo "NODE_ENV=production" >> $GITHUB_ENV
    echo "BUCKET_SUFFIX=zwwst63n" >> $GITHUB_ENV
    echo "DEPLOY_BUCKET_SUFFIX=zwwst63n" >> $GITHUB_ENV
    echo "GCP_PROJECT_ID=dev-digital-banno" >> $GITHUB_ENV
    echo "GCP_HOSTING_BUCKET=dev-digital-gzo-geezeo-tiles-zwwst63n" >> $GITHUB_ENV
```

**Similar changes needed for**:
- Staging: `BUCKET_SUFFIX=nyjcof9v`
- Production: `BUCKET_SUFFIX=gvf7byup`

**Testing Procedure**:
1. Verify environment variables are set in workflow logs
2. Check if build scripts access these variables correctly
3. Test deployment with restored variables

**Success Criteria**: All environment variables available during build and deployment

---

### 🚨 **Task 1.4: Verify and Fix Contents Permission**
**Priority**: MEDIUM | **Estimated Time**: 30 minutes | **Risk Level**: LOW

**Issue**: Main deployment workflow contents permission downgraded from `write` to `read`

**File to Modify**: `.github/workflows/main-deployment.yml`

**Investigation Steps**:
1. Review workflow for any git operations (tagging, commits)
2. Check if semantic-release or version bumping requires write access
3. Test current workflow with `read` permission

**If write access needed**:
```yaml
permissions:
  actions: read
  checks: write
  contents: write  # ✅ Restore if needed
  id-token: write
  pull-requests: write
```

**Testing Procedure**:
1. Run main deployment workflow
2. Monitor for permission-related failures
3. Verify all git operations complete successfully

**Success Criteria**: No permission-related failures in deployment workflow

---

### 🚨 **Task 1.5: Create Backup and Rollback Plan**
**Priority**: CRITICAL | **Estimated Time**: 15 minutes | **Risk Level**: HIGH

**Backup Steps**:
1. Create backup branch: `git checkout -b backup/pre-config-fix-$(date +%Y%m%d)`
2. Commit current state: `git add . && git commit -m "Backup before config remediation"`
3. Push backup: `git push origin backup/pre-config-fix-$(date +%Y%m%d)`

**Rollback Procedure**:
```bash
# If issues arise, rollback to backup
git checkout backup/pre-config-fix-YYYYMMDD
git checkout -b hotfix/rollback-config-changes
git push origin hotfix/rollback-config-changes
# Create PR to merge rollback
```

**Success Criteria**: Backup branch created and rollback procedure documented

---

### 🚨 **Task 1.6: Immediate Testing Protocol**
**Priority**: CRITICAL | **Estimated Time**: 2 hours | **Risk Level**: HIGH

**Testing Sequence**:
1. **Unit Test**: Validate YAML syntax with `yamllint`
2. **Integration Test**: Create test PR to verify PR workflow
3. **Deployment Test**: Test development deployment end-to-end
4. **Rollback Test**: Verify rollback procedure works

**Validation Commands**:
```bash
# Validate YAML syntax
yamllint .github/workflows/*.yml

# Test workflow locally (if using act)
act pull_request -W .github/workflows/pr-workflow.yml

# Monitor deployment
# Check GCS bucket for deployed files
gsutil ls gs://dev-digital-gzo-geezeo-tiles-zwwst63n/qa/v2/
```

**Success Criteria**: All tests pass, deployment completes successfully

## Phase 1 Summary
- **Total Estimated Time**: 4.5 hours
- **Critical Path**: Tasks 1.1 → 1.2 → 1.6
- **Dependencies**: Task 1.5 must complete before any changes
- **Rollback Ready**: Backup created before any modifications

## Phase 2: Short-term Actions (High Priority - 1-2 weeks)

### ⚠️ **Task 2.1: Standardize Upload Methods**
**Priority**: HIGH | **Estimated Time**: 3 hours | **Risk Level**: MEDIUM

**Issue**: Mixed use of `upload-cloud-storage` and `gsutil rsync`

**Decision Required**: Choose consistent upload method
- **Option A**: Use `google-github-actions/upload-cloud-storage@v2` (November 2024 standard)
- **Option B**: Use `gsutil rsync` (current PR workflow method)

**Recommended**: Option A for consistency with November 2024 baseline

**Files to Modify**: `.github/workflows/pr-workflow.yml`

**Before**:
```yaml
- name: Deploy to development
  run: |
    gsutil -m rsync -r -d ./dist/qa/v2/ gs://${{ env.GCP_HOSTING_BUCKET }}/${{ env.DEPLOY_FOLDER }}/v2/
```

**After**:
```yaml
- name: Deploy to development
  uses: "google-github-actions/upload-cloud-storage@v2"
  with:
    path: ./dist/qa/v2
    destination: "${{ env.GCP_HOSTING_BUCKET }}/${{ env.DEPLOY_FOLDER }}/v2"
    parent: false
    process_gcloudignore: false
```

**Testing Procedure**:
1. Compare deployment times between methods
2. Verify identical file structure in GCS
3. Test with large file uploads
4. Monitor for any permission differences

**Success Criteria**: Consistent upload method across all workflows

---

### ⚠️ **Task 2.2: Restore Dynamic Versioning**
**Priority**: MEDIUM | **Estimated Time**: 4 hours | **Risk Level**: LOW

**Issue**: Major version extraction removed, hardcoded to `v2`

**Files to Modify**: All workflow files

**Implementation Steps**:

1. **Add version extraction step**:
```yaml
- name: Extract major version
  id: extract_version
  run: |
    MAJOR_VERSION=$(node -p "require('./package.json').version" | cut -d. -f1)
    echo "MAJOR_VERSION=${MAJOR_VERSION}" >> $GITHUB_ENV
    echo "major_version=${MAJOR_VERSION}" >> $GITHUB_OUTPUT
```

2. **Update deployment paths**:
```yaml
# Before
destination: "${{ env.GCP_HOSTING_BUCKET }}/${{ env.DEPLOY_FOLDER }}/v2"

# After
destination: "${{ env.GCP_HOSTING_BUCKET }}/${{ env.DEPLOY_FOLDER }}/v${{ env.MAJOR_VERSION }}"
```

**Testing Procedure**:
1. Test with current v2.x.x versions
2. Simulate v3.0.0 version bump
3. Verify correct path generation
4. Test backward compatibility

**Success Criteria**: Dynamic version paths work for current and future versions

---

### ⚠️ **Task 2.3: Evaluate Test Coverage Restoration**
**Priority**: MEDIUM | **Estimated Time**: 6 hours | **Risk Level**: MEDIUM

**Issue**: Reduced from 12 test jobs (3 browsers × 4 shards) to 2 jobs (2 browsers)

**Analysis Required**:
1. **Performance Impact**: Measure current vs. historical test execution times
2. **Coverage Gap**: Identify WebKit-specific issues missed
3. **Resource Cost**: Calculate CI minutes usage increase

**Decision Matrix**:
| Option | Browsers | Sharding | Jobs | Est. Time | CI Cost |
|--------|----------|----------|------|-----------|---------|
| Current | 2 | None | 2 | ~10 min | Low |
| Partial | 3 | 2-way | 6 | ~15 min | Medium |
| Full | 3 | 4-way | 12 | ~8 min | High |

**Recommended**: Partial restoration (3 browsers, 2-way sharding)

**Implementation** (if approved):
```yaml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    shardIndex: [1, 2]
    shardTotal: [2]
steps:
  - name: Run tests
    run: |
      npx playwright test --project=${{ matrix.browser }} --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```

**Success Criteria**: Improved test coverage without excessive CI cost

---

### ⚠️ **Task 2.4: Documentation Updates**
**Priority**: HIGH | **Estimated Time**: 4 hours | **Risk Level**: LOW

**Deliverables**:

1. **Create `.github/workflows/README.md`**:
   - Document current workflow architecture
   - Explain environment mappings
   - Provide troubleshooting guide

2. **Update main project documentation**:
   - Reflect Node.js v20.18.1 requirement
   - Document new PR workflow process
   - Update deployment procedures

3. **Create migration guide**:
   - Document changes from November 2024
   - Explain rationale for modifications
   - Provide rollback procedures

**Template Structure**:
```markdown
# GitHub Workflows Documentation

## Architecture Overview
- pr-workflow.yml: PR validation and dev deployment
- main-deployment.yml: Production deployments
- merged-workflow.yml: Post-merge triggering

## Environment Mappings
| Environment | GitHub Env | GCP Project | Bucket |
|-------------|------------|-------------|--------|
| Development | dev | dev-digital-banno | dev-digital-gzo-geezeo-tiles-zwwst63n |
| Staging | staging | stage-digital-banno | stage-digital-gzo-geezeo-tiles-nyjcof9v |
| Production | production | prod-digital-banno | prod-digital-gzo-geezeo-tiles-gvf7byup |
```

**Success Criteria**: Complete documentation available for all workflows

## Phase 2 Summary
- **Total Estimated Time**: 17 hours over 1-2 weeks
- **Key Deliverables**: Standardized uploads, documentation, version analysis
- **Optional**: Test coverage restoration (pending cost/benefit analysis)

## Phase 3: Long-term Planning (Medium Priority - Next major release cycle)

### 📋 **Task 3.1: Workflow Architecture Modernization**
**Priority**: MEDIUM | **Estimated Time**: 16 hours | **Risk Level**: LOW

**Objective**: Evaluate and potentially implement recommended 2-workflow architecture

**Current State**: 3 workflows (main-deployment.yml, pr-workflow.yml, merged-workflow.yml)
**Recommended**: 2 workflows (pr-pipeline.yml, progressive-deployment.yml) from experimental branch

**Analysis Required**:
1. **Feature Comparison**: Map current functionality to recommended workflows
2. **Performance Analysis**: Compare execution times and resource usage
3. **Maintenance Overhead**: Evaluate complexity and maintainability
4. **Migration Effort**: Estimate effort to transition

**Decision Criteria**:
- Reduced complexity without feature loss
- Improved maintainability
- Better alignment with modern CI/CD practices
- Stakeholder approval for architectural change

**Success Criteria**: Architecture decision made with implementation plan

---

### 📋 **Task 3.2: Advanced Monitoring and Alerting**
**Priority**: LOW | **Estimated Time**: 8 hours | **Risk Level**: LOW

**Enhancements**:
1. **Deployment Health Checks**: Verify application functionality post-deployment
2. **Performance Monitoring**: Track deployment times and success rates
3. **Slack/Teams Integration**: Enhanced notification system
4. **Dashboard Creation**: Workflow status and metrics visualization

**Implementation Example**:
```yaml
- name: Health Check
  run: |
    # Wait for deployment to be available
    sleep 30
    # Check application health endpoint
    curl -f https://geezeo.geezeo.banno-development.com/qa/v2/health || exit 1

- name: Performance Check
  run: |
    # Basic performance validation
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' https://geezeo.geezeo.banno-development.com/qa/v2/)
    echo "Response time: ${RESPONSE_TIME}s"
    # Alert if response time > 5 seconds
    (( $(echo "$RESPONSE_TIME > 5.0" | bc -l) )) && echo "::warning::Slow response time detected"
```

**Success Criteria**: Enhanced monitoring provides actionable insights

---

### 📋 **Task 3.3: Security and Compliance Review**
**Priority**: HIGH | **Estimated Time**: 12 hours | **Risk Level**: MEDIUM

**Review Areas**:
1. **Permission Audit**: Verify minimal required permissions
2. **Secret Management**: Review secret usage and rotation
3. **Environment Protection**: Validate environment rules and approvals
4. **Compliance**: Ensure workflows meet organizational standards

**Deliverables**:
- Security assessment report
- Permission optimization recommendations
- Compliance checklist
- Secret rotation schedule

**Success Criteria**: Workflows meet security and compliance requirements

## Risk Mitigation Strategy

### 🛡️ **Backup and Recovery**
1. **Pre-Change Backup**: Create backup branch before any modifications
2. **Incremental Changes**: Implement changes in small, testable increments
3. **Rollback Procedures**: Document and test rollback for each change
4. **Monitoring**: Continuous monitoring during and after changes

### 🧪 **Testing Strategy**
1. **Syntax Validation**: YAML linting for all workflow files
2. **Unit Testing**: Individual workflow component testing
3. **Integration Testing**: End-to-end workflow testing
4. **Performance Testing**: Deployment time and resource usage validation
5. **Security Testing**: Permission and access validation

### 📢 **Communication Plan**
1. **Stakeholder Notification**: Inform teams before critical changes
2. **Change Documentation**: Document all modifications and rationale
3. **Training**: Provide training on new workflows if needed
4. **Feedback Collection**: Gather feedback and iterate

## Implementation Timeline

### Week 1: Immediate Actions (Phase 1)
- **Day 1**: Tasks 1.5 (Backup) → 1.1 (Environment fix) → 1.2 (Path fix)
- **Day 2**: Tasks 1.3 (Environment vars) → 1.4 (Permissions) → 1.6 (Testing)

### Weeks 2-3: Short-term Actions (Phase 2)
- **Week 2**: Tasks 2.1 (Upload methods) → 2.4 (Documentation)
- **Week 3**: Tasks 2.2 (Dynamic versioning) → 2.3 (Test coverage analysis)

### Months 2-3: Long-term Planning (Phase 3)
- **Month 2**: Tasks 3.1 (Architecture review) → 3.3 (Security review)
- **Month 3**: Task 3.2 (Advanced monitoring) → Implementation of approved changes

## Success Metrics

### Immediate Success (Phase 1)
- ✅ All breaking changes resolved
- ✅ PR deployments work correctly
- ✅ Environment protection rules apply
- ✅ No deployment failures

### Short-term Success (Phase 2)
- ✅ Consistent upload methods across workflows
- ✅ Complete documentation available
- ✅ Dynamic versioning capability restored
- ✅ Test coverage decision made and implemented

### Long-term Success (Phase 3)
- ✅ Optimized workflow architecture
- ✅ Enhanced monitoring and alerting
- ✅ Security and compliance requirements met
- ✅ Reduced maintenance overhead

## Accountability and Ownership

### Phase 1 (Critical): DevOps/Platform Team Lead
- **Responsibility**: Ensure immediate fixes are implemented correctly
- **Timeline**: 48 hours maximum
- **Escalation**: CTO if issues arise

### Phase 2 (High): Development Team Lead + DevOps
- **Responsibility**: Coordinate implementation of improvements
- **Timeline**: 2 weeks
- **Review**: Weekly progress check-ins

### Phase 3 (Medium): Architecture Review Committee
- **Responsibility**: Strategic decisions on long-term improvements
- **Timeline**: Next major release cycle
- **Review**: Monthly architecture review meetings

## Conclusion

This action plan provides a structured approach to resolving the configuration drift identified in the side-by-side comparison. The phased approach ensures critical issues are addressed immediately while allowing for thoughtful planning of longer-term improvements. Success depends on careful execution of Phase 1 changes and stakeholder buy-in for Phase 2 and 3 enhancements.
