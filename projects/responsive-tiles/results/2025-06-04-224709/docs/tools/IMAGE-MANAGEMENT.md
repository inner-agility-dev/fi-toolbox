# Image Management

This guide explains how to manage images in the Responsive Tiles documentation.

## Overview

The Responsive Tiles project uses a specialized image management system that allows:

1. Writing documentation with image placeholders
2. Tracking required images that need to be created
3. Generating instructions for creating specific images
4. Replacing placeholders with actual images

This approach allows documentation to be written before screenshots or diagrams exist.

## Image Placeholders

Image placeholders use a special syntax:

```markdown
[USE_Image-dashboard] - *Dashboard overview showing all tiles*
```

This creates a placeholder that:
- Has an ID of "dashboard"
- Shows a description "Dashboard overview showing all tiles"
- Will be replaced with the actual image when available

## Image Management Commands

The project includes several commands for managing images:

### Listing Required Images

```bash
npm run images:list
```

This command scans all documentation files and lists all image placeholders, showing:
- Image IDs
- Descriptions
- Source files
- Whether the image exists

### Generating Image Instructions

```bash
npm run images:instructions
```

This generates a detailed list of instructions for creating all required images, including:
- What each image should show
- Where it will be used
- Formatting requirements

### Updating Images in Documentation

```bash
npm run images:update
```

This updates all documentation files with the latest images, replacing placeholders with actual images where available.

### Replacing Images

```bash
npm run docs:images
```

This processes documentation HTML files to include actual images.

## Creating Images

To add a new image:

1. Find the image ID from `npm run images:list`
2. Create the image file (screenshot, diagram, etc.)
3. Save it to `/docs/images/{image-id}.png`
4. Run `npm run docs:images` to update the documentation

## Image Naming Conventions

Images should be named according to their placeholder ID:

- Placeholder: `[USE_Image-dashboard]`
- File name: `dashboard.png`

## Image Directory Structure

Images are stored in the `/docs/images/` directory:

```
docs/
├── images/
│   ├── dashboard.png
│   ├── account-details.png
│   ├── budget-form.png
│   └── ...
```

## Best Practices

### Image Creation

1. **Consistency**: Use the same theme, resolution, and scale for related images
2. **Clarity**: Ensure text in screenshots is readable
3. **Focus**: Highlight the relevant parts of the interface
4. **Size**: Keep images reasonably sized (both dimensions and file size)
5. **Format**: Use PNG for screenshots and interface images

### Image Placeholders

1. **Descriptive IDs**: Use clear, concise IDs
2. **Detailed Descriptions**: Provide enough detail about what the image should show
3. **Context**: Ensure the surrounding text provides context for the image

## Troubleshooting

### Missing Images

If images are not appearing in the documentation:

1. Check if the image file exists in `/docs/images/`
2. Verify the file name exactly matches the image ID
3. Ensure you've run `npm run docs:images` after adding the image
4. Check the generated HTML to see if the image is being referenced correctly

### Format Issues

If image formats are incorrect:

1. Ensure you're using PNG for screenshots
2. Check that the file isn't corrupt
3. Try regenerating the image