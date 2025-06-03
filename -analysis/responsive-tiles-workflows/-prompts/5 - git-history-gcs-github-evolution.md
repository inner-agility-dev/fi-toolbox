# Git History Analysis: GitHub Workflows and GCS Integration Evolution

## Step 1: Set Parameters

- `REPOSITORY_PATH`: Path to the repository to analyze (e.g., `prompts/responsive-tiles/responsive-tiles`)
- `WORKFLOW_PATTERN`: File pattern for workflows (default: `.github/workflows/*.yml`)
- `START_DATE`: Optional start date for analysis (format: YYYY-MM-DD)
- `END_DATE`: Optional end date for analysis (format: YYYY-MM-DD)

## Step 2: Initial Discovery

### Find First GCS Integration
Execute git commands to identify when GitHub workflows first started using Google Cloud Storage:

```bash
# Search for first appearance of GCS-related terms
git log --all --reverse -p -S "storage.googleapis.com" -- {{WORKFLOW_PATTERN}}
git log --all --reverse -p -S "google-github-actions" -- {{WORKFLOW_PATTERN}}
git log --all --reverse -p -S "workload-identity" -- {{WORKFLOW_PATTERN}}
git log --all --reverse -p -S "gcloud" -- {{WORKFLOW_PATTERN}}
```

Document:
- **First GCS Integration Date**: [commit date]
- **Initial Commit**: [commit hash]
- **Author**: [who introduced it]
- **Files Affected**: [list of workflow files]

## Step 3: Track Evolution States

### Identify All Significant Changes
For each workflow file that uses GCS, track every commit that modified GCS or GitHub configurations:

```bash
# Get all commits that modified workflows with GCS
git log --all --follow -p -- {{WORKFLOW_PATTERN}} | grep -E "(storage\.googleapis\.com|bucket|gcp|workload-identity)"
```

### Save States to Memory
For each significant change, save to memory with keys:
- `gcs_github_state_v1_[commit_hash]` - First introduction
- `gcs_github_state_v2_[commit_hash]` - Major updates
- `gcs_github_state_v3_[commit_hash]` - Current state

Each state should include:
```json
{
  "commit": "hash",
  "date": "YYYY-MM-DD",
  "author": "name",
  "files_modified": ["list"],
  "configuration": {
    "gcp": { /* full config */ },
    "github": { /* full config */ }
  }
}
```

## Step 4: Configuration Matrix Generation

For each identified state, extract and document:

### GitHub Configuration
- **Workflow Triggers**: push, pull_request, schedule, etc.
- **Job Structure**: names, dependencies, matrix strategies
- **Environment Variables**: secrets, vars, hardcoded values
- **Permissions**: required GitHub permissions
- **Concurrency Settings**: groups, cancel-in-progress

### GCP Configuration
- **Project IDs**: for each environment
- **Bucket Names**: full bucket paths and patterns
- **Service Accounts**: email addresses and roles
- **Workload Identity**: pool, provider, audience
- **Authentication Method**: keys vs workload identity evolution
- **Deployment Paths**: bucket structure and versioning

### Integration Points
- **Build Artifacts**: how they're stored/retrieved
- **Deployment Triggers**: what initiates GCS uploads
- **Version Management**: how versions are handled
- **Environment Promotion**: dev→stage→prod flow

## Step 5: Output Structure

### Evolution Timeline
```markdown
# GitHub Workflows + GCS Integration Evolution

## Timeline Overview
| Date | Commit | Author | Change Type | Key Changes |
|------|--------|--------|-------------|-------------|
| [date] | [hash] | [author] | Initial Integration | First GCS usage |
| [date] | [hash] | [author] | Security Update | Moved to Workload Identity |
| [date] | [hash] | [author] | Architecture Change | [description] |

## Detailed State Analysis

### State v1: Initial Implementation ([commit_hash])
**Date**: [date]
**Configuration Matrix**:

#### GitHub Settings
- Triggers: [list]
- Jobs: [structure]
- Secrets: [list]

#### GCP Settings
- Projects: [mapping]
- Buckets: [list with patterns]
- Auth: [method]

[Continue for each state...]
```

### Visual Evolution
Create Mermaid diagrams showing:
1. Architecture evolution over time
2. Security improvements timeline
3. Configuration complexity growth

### Memory Storage Summary
List all saved memory keys with descriptions:
- `gcs_github_state_v1_[hash]`: Initial GCS integration
- `gcs_github_state_v2_[hash]`: Workload Identity adoption
- [etc...]

## Step 6: Analysis Insights

Provide:
1. **Security Evolution**: How authentication and permissions improved
2. **Architecture Patterns**: Common patterns that emerged
3. **Configuration Drift**: How configs diverged or converged
4. **Best Practices Adoption**: When modern practices were adopted
5. **Breaking Changes**: Major shifts in approach

---

**Keywords:**  
git history, GitHub Actions evolution, GCS integration, configuration matrix, workflow archaeology, state tracking, security evolution

---

**Note:**  
Store intermediate results in memory for cross-reference. Use consistent naming: `gcs_github_state_v[version]_[commit_hash]`