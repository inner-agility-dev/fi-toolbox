# Accessing GitHub Workflow Documentation

This document explains how to access the HTML documentation for GitHub workflows in different environments.

## Documentation Access URLs

The HTML documentation is available at the following URLs:

### Local Development

When running the development server locally:
```
http://localhost:8080/docs/index.html
```

To start the development server with documentation:
```bash
npm run docs:serve
```

### Deployed Environments

After deployment, the documentation is available at:

- **Development**:
  ```
  https://geezeo.geezeo.banno-development.com/assets/tiles/v2/docs/index.html
  ```

- **Staging**:
  ```
  https://geezeo.geezeo.banno-staging.com/assets/tiles/v2/docs/index.html
  ```

- **Production**:
  ```
  https://geezeo.geezeo.banno-production.com/assets/tiles/v2/docs/index.html
  ```

## How Documentation Is Deployed

1. Documentation is generated from Markdown files in `docs/github-workflows/`
2. HTML files are created in `docs/html-docs/`
3. Files are copied to `dist/docs/` for local serving
4. During deployment, files are copied to the appropriate location in GCS buckets

## Updating Documentation

To update the documentation:

1. Edit the Markdown files in `docs/github-workflows/`
2. Run `npm run build:docs` to generate and copy the HTML documentation
3. Test locally with `npm run docs:serve`
4. When you push to master, the documentation will be deployed automatically

## Managing Images

Images can be added to the documentation using the image management tools:

```bash
# List all image placeholders
npm run images:list

# Create instructions for adding images
npm run images:instructions

# Update documentation with added images
npm run images:update
```

For more detailed information about documentation tools, see [Documentation Tools](documentation-tools.md). 
