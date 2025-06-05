# Documentation System

This guide explains the documentation system used in the Responsive Tiles project.

## Overview

The Responsive Tiles documentation system:

1. Uses Markdown files as the source of truth
2. Generates HTML with code highlighting
3. Creates a responsive, navigable documentation site
4. Supports image embedding and management
5. Integrates with the build process

## Documentation Structure

The documentation is organized in a hierarchical structure:

- `/docs/` - Main documentation directory
  - Core documentation files (ARCHITECTURE.md, DEVELOPMENT.md, etc.)
  - `/guides/` - Specialized instruction documents
  - `/workflows/` - Process-specific documentation
  - `/tools/` - Tool-specific documentation

## Documentation Generation

The documentation generation process uses several scripts:

### generate-docs.js

This script generates HTML from Markdown files:

```bash
# Generate HTML documentation
npm run docs
```

Features:
- Converts Markdown to HTML with syntax highlighting
- Creates a navigation structure
- Adds a responsive design with CSS/JS
- Supports diagrams through mermaid.js
- Creates placeholders for missing images

### image-manager.js

This script manages images in documentation:

```bash
# List required images
npm run images:list

# Generate image instructions
npm run images:instructions

# Update documentation with new images
npm run images:update
```

### replace-images.js

This script replaces image placeholders with actual images:

```bash
# Replace image placeholders
npm run docs:images
```

## Image System

The documentation system includes a specialized image management system:

1. Documentation can be written with image placeholders (`[USE_Image-name]`)
2. Images are stored in `/docs/images/`
3. Image placeholders are replaced during documentation generation
4. Missing images are tracked and can be listed

### Image Placeholder Format

```markdown
[USE_Image-dashboard] - *Dashboard overview showing all tiles*
```

### Adding Images

1. Create the image file (screenshot, diagram, etc.)
2. Save it in `/docs/images/`
3. Run `npm run docs:images` to include it in the documentation

## Documentation Integration

The documentation is integrated with the build process:

```javascript
// In package.json
"scripts": {
  "prebuild": "mkdir -p dist/docs && cp -R docs/development-html/* dist/docs/",
  "docs": "node scripts/generate-docs.js",
  "docs:images": "node scripts/replace-images.js"
}
```

This ensures that:
1. Documentation is generated before building
2. Generated documentation is included in the distribution
3. The documentation stays in sync with the code

## Editing Documentation

When editing documentation:

1. Edit the Markdown files directly
2. Follow the established directory structure
3. Use relative links between documents
4. Include image placeholders for visuals
5. Run `npm run docs` to preview changes

## Style Guidelines

Follow these guidelines for documentation:

1. Use ALL-CAPS.md for main documentation files
2. Use kebab-case.md for specialized documents
3. Place related documents in appropriate subdirectories
4. Use README.md as index files in directories
5. Keep documentation focused and aligned with the code

## Best Practices

1. **Code-Driven**: Documentation should reflect the actual code
2. **Focused**: Each document should have a clear purpose
3. **Linked**: Use links to connect related documentation
4. **Concise**: Keep explanations clear and to the point
5. **Visual**: Use diagrams and screenshots where helpful