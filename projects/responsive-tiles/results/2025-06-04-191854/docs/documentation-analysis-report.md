# Documentation Analysis Report

Generated on 2025-04-20

## Summary

- Missing README.md files: 0
- Documentation-code mismatches: 2
- Unfilled image placeholders: 19
- Documentation pattern inconsistencies: 3
- Ambiguous sources of truth: 3

## Documentation-Code Mismatches

- docs/CODE-DOC-ALIGNMENT.md: Script 'test:medium' referenced in documentation but not found in package.json
- docs/CODE-DOC-ALIGNMENT.md: Script 'test:full' referenced in documentation but not found in package.json

## Unfilled Image Placeholders

- docs/DEVELOPER-TOOLS.md: 4 placeholder(s)
- docs/EMBED-IMAGES.md: 4 placeholder(s)
- docs/GITHUB-WORKFLOW.md: 7 placeholder(s)
- docs/tools/DOCUMENTATION-SYSTEM.md: 2 placeholder(s)
- docs/tools/IMAGE-MANAGEMENT.md: 2 placeholder(s)

## Documentation Pattern Inconsistencies

- docs/guides/README.md: README.md file not converted to index.html in HTML documentation
- docs/tools/README.md: README.md file not converted to index.html in HTML documentation
- docs/workflows/README.md: README.md file not converted to index.html in HTML documentation

## Ambiguous Sources of Truth

- Multiple similarly named documentation files found:
  - docs/API-INTEGRATION.md
  - docs/guides/API-INTEGRATION.md

- Multiple similarly named documentation files found:
  - docs/README.md
  - docs/guides/README.md
  - docs/tools/README.md
  - docs/workflows/README.md

- Multiple Dockerfile variants found without clear primary designation:
  - scripts/gcp-docker/Dockerfile.act-runner
  - scripts/gcp-docker/Dockerfile.gcp

## Recommendations

### Replace Image Placeholders

Run `npm run images:instructions` to generate image creation instructions.
Run `npm run images:update` to update documentation with new images.

### Resolve Documentation-Code Mismatches

Update package.json scripts to match documentation or update documentation to match scripts.

### Fix Documentation Pattern Inconsistencies

- Rename documentation files to follow ALL-CAPS naming convention.
- Run `npm run docs` to regenerate HTML documentation.

### Clarify Sources of Truth

- Consolidate similar documentation files.
- Clearly designate primary Dockerfile and mark alternatives as deprecated.
- Add version or date information to documentation files.

