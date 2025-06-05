# Chat Session: Document Collections Strategy & PromptSync Integration
**Date**: 2025-06-05
**Topic**: Implementing Dev/Prod Document Collections for responsive-tiles

## Session Summary
This session focused on creating a document collection strategy for responsive-tiles, distinguishing between DEV-SET (all docs) and PROD-SET (minimal production docs). We implemented collection switching in the doc-snapshot-tool and created Playwright test prompts for documentation validation.

## Key Accomplishments

### 1. Discovered PromptSync Task
- Retrieved task "Test: Doc Snapshot Tool with Symbolic Link" from PromptSync project
- Task was already marked complete with gist: https://gist.github.com/lennylmiller/1fb90f6b5c617f27813007d594b8a565

### 2. Created PromptSync Manifesto
- **Gist**: https://gist.github.com/lennylmiller/e940fbaf2ab8e67695b579e953c7bf2a
- Core concept: "Every line of code is a learning pattern"
- Updated from "99%" to "growing percentage of dev work contributes to PromptSync"
- Mapped entire Banno project ecosystem to PromptSync pattern contributions

### 3. Document Collection Strategy

#### Understanding the Context
- Analyzed `npm run docs` in responsive-tiles which generates public HTML documentation
- Realized PROD-SET should be the minimal markdown files that generate public docs
- DEV-SET contains PROD-SET plus all additional development documentation

#### Implementation
- Created `responsive-tiles-config-prod.json` with 18 essential markdown files
- Updated `doc-snapshot-tool.js` to support `--collection` parameter
- Organized snapshots in separate directories: `results/dev/` and `results/prod/`

#### PROD-SET Files (18 total):
```
README.md
docs/ARCHITECTURE.md
docs/COMPONENTS.md
docs/DEVELOPMENT.md
docs/PERFORMANCE.md
docs/CONFIGURATION.md
docs/CONTAINER-LAYOUT.md
docs/DEVELOPER-TOOLS.md
docs/TROUBLESHOOTING.md
docs/CONTRIBUTING.md
docs/GITHUB-WORKFLOW.md
docs/EMBED-IMAGES.md
docs/SEMANTIC-RELEASE.md
docs/guides/API-INTEGRATION.md
docs/guides/STATE-MANAGEMENT.md
docs/guides/TESTING.md
docs/workflows/GCP-DEPLOYMENT.md
docs/workflows/LOCAL-TESTING.md
```

### 4. Created Playwright Test Prompts
- **Location**: `/Users/LenMiller/code/banno/fi-toolbox/prompts/responsive-tiles/playwright-docs-test-prompt.md`
- Full test suite (~10 minutes) for all 18 pages
- Quick smoke test (~2 minutes) for rapid validation
- Created PromptSync ticket for tracking: PVTI_lAHOAALNNc4A6pIXzgbJ4B8

## Future Vision
- Permanent `idea/main-documents` branch for document management
- Branch-based collection switching in fi-toolbox
- Each collection swap creates a new git branch for context tracking

## Commands Created
```bash
# Create production snapshot (minimal files)
node doc-snapshot-tool.js snapshot --collection prod

# Create development snapshot (all files)
node doc-snapshot-tool.js snapshot --collection dev

# List snapshots
node doc-snapshot-tool.js list --collection prod
```

## Key Insights
1. PROD collection is a quality-filtered subset, not separate documents
2. DEV collection always contains PROD collection (nested sets)
3. Natural promotion path: docs mature from DEV-only → PROD
4. Documentation collections act as working contexts for developers

## Next Steps
- Test Playwright prompts with actual documentation site
- Determine timing for `idea/main-documents` branch creation
- Build branch-switching automation for collection management

---
*This session demonstrates PromptSync in action: a simple doc tool test evolved into comprehensive documentation strategy patterns*