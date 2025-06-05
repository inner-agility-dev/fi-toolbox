# Documentation Tools

This repository includes several tools for generating and maintaining GitHub workflow documentation.

## Generating HTML Documentation

Generate HTML documentation from markdown files:

```bash
npm run docs
```

This converts Markdown files in `docs/github-workflows` to HTML in `docs/html-docs`. The generated HTML documentation includes:

- A responsive layout with navigation
- Syntax highlighting for code blocks
- Support for Mermaid diagrams
- A clean, modern design

[USE_Image-html-documentation] - *Example of generated HTML documentation with navigation and syntax highlighting*

## Managing Images

### List Image Placeholders

List all image placeholders in the documentation:

```bash
npm run images:list
```

This helps identify where images need to be added to the documentation.

[USE_Image-image-list-output] - *Example output of the images:list command showing pending images*

### Generate Image Instructions

Generate instructions for creating images:

```bash
npm run images:instructions
```

This creates a file with detailed requirements for each image placeholder.

### Update Images in Documentation

Replace image placeholders with actual images:

```bash
npm run images:update
```

This looks for images in `docs/github-workflows/images` that match placeholder IDs and updates the Markdown files.

## Image Placeholder Format

To add an image placeholder in the markdown documentation, use the following format:

```
[USE_Image-image-id] - *Description of the image*
```

Where:
- `image-id` is a unique identifier for the image
- `Description of the image` explains what the image should contain

## Best Practices

1. Use descriptive image IDs that indicate the content
2. Provide detailed descriptions for image placeholders
3. Keep images in the `docs/github-workflows/images` directory
4. Generate HTML documentation after updating markdown files
5. Use PNG format for screenshots with 800-1200px width

## Example Workflow

1. Create or update markdown documentation
2. Add image placeholders where needed
3. Run `npm run images:list` to see required images
4. Run `npm run images:instructions` to get image specifications
5. Create the required images and save them in the images directory
6. Run `npm run images:update` to update the markdown
7. Run `npm run docs` to generate the HTML documentation
8. Run `npm run images:replace` to enhance the HTML with images
9. View the documentation in `docs/html-docs/index.html` 
