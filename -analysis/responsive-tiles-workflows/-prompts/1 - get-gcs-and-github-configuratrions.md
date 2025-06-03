# GitHub Actions and GCS Configuration Analysis

## Step 1: Set Parameters

- `WORKFLOW_ROOT_FOLDER`: The root directory to analyze (e.g., `-analysis/responsive-tiles-workflows/original/`).

## Step 2: Analyze Configurations

Analyze all GitHub Actions workflows and Google Cloud Storage configurations in the specified `WORKFLOW_ROOT_FOLDER`. Extract and document:

- Inventory of workflows and their purposes
- GCP configurations (projects, buckets, service accounts)
- Environment-specific parameters
- Security configurations
- Integration points

## Step 3: Output Structure

Present the analysis in the following structure:
1. **TLDR Section**: Executive summary (3-4 bullet points)
2. **Detailed Documentation**: As described above
3. **Visual Documentation**: Mermaid diagrams for CI/CD, GCP resources, dependencies
4. **Parameterization**: List all configurable inputs and defaults
5. **AI Memory Optimization**: Use clear headers, tags, and cross-references

---

**Keywords:**  
GitHub Actions, GCS, workflow analysis, configuration, CI/CD, security, parameterization

---

**Note:**  
If storing the result, use a memory key such as `gcs_github_config_[folder]`.