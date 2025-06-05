# Embedding Images in Documentation

This guide explains how to replace image placeholders in the generated HTML documentation with actual screenshots and diagrams.

## Understanding Image Placeholders

Throughout the documentation, you'll find image placeholders marked with a specific format:

```
[USE_Image-ImageID] - *Description of the image*
```

For example:
```
[USE_Image-ToolboxUI] - *Screenshot of the Toolbox interface showing the JSON editor and preview panel*
```

These placeholders are automatically transformed into visual placeholder elements in the HTML documentation, making them easy to identify.

## Image Requirement List

The following table lists all image placeholders used in the documentation:

| Image ID | Description | Suggested Dimensions | File Type |
|----------|-------------|----------------------|-----------|
| **CICDConcept** | Conceptual diagram showing CI/CD workflow | 800x500 | PNG/SVG |
| **TestResults** | Test output from GitHub Actions | 800x400 | PNG |
| **GitHubEnvironments** | GitHub Environments configuration | 800x500 | PNG |
| **DeploymentStructure** | GCS directory structure | 600x400 | PNG |
| **SlackNotifications** | Slack notification examples | 700x300 | PNG |
| **SetupScriptRunning** | Terminal running GitHub setup script | 800x500 | PNG |
| **VerificationOutput** | Variables verification results | 800x500 | PNG |
| **ToolboxUI** | Toolbox interface with editor and preview | 1200x800 | PNG |
| **TestHarnessUI** | Test Harness with multiple components | 1200x800 | PNG |
| **ToolboxUsage** | Developer using the Toolbox | 1200x800 | PNG |
| **TestHarnessUsage** | Multiple tiles in Test Harness grid | 1200x800 | PNG |

## Adding Images to Documentation

### Option 1: Direct File Replacement

1. **Create Images Directory**:
   ```bash
   mkdir -p docs/development-html/images
   ```

2. **Prepare Images**:
   - Take screenshots or create diagrams for each placeholder
   - Name your files according to the Image ID (e.g., `ToolboxUI.png`)
   - Optimize images for web use (compress PNGs, use SVG for diagrams when possible)

3. **Place Images in Directory**:
   ```bash
   cp path/to/your/images/*.png docs/development-html/images/
   ```

4. **Edit HTML Files**:
   - Open each HTML file in the `docs/development-html` directory
   - Replace placeholder divs with actual image tags:
   ```html
   <!-- Find elements like this: -->
   <div class="image-placeholder" data-id="ToolboxUI">[USE_Image-ToolboxUI] - <em>Screenshot of the Toolbox...</em></div>
   
   <!-- Replace with: -->
   <img src="images/ToolboxUI.png" alt="Screenshot of the Toolbox interface showing the JSON editor and preview panel">
   ```

### Option 2: Automated Replacement

For a more automated approach, you can use a script:

1. **Create a `replace-images.js` Script**:
   Create a file named `replace-images.js` in the `scripts` directory with this content:

```javascript
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Config
const htmlDir = path.resolve(__dirname, '../docs/development-html');
const imageDir = path.resolve(__dirname, '../docs/development-html/images');

// Create images directory if it doesn't exist
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
  console.log(`Created images directory: ${imageDir}`);
}

// Find all HTML files
const htmlFiles = glob.sync('*.html', { cwd: htmlDir });

// Process each HTML file
htmlFiles.forEach(htmlFile => {
  const filePath = path.join(htmlDir, htmlFile);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find image placeholders
  const placeholderRegex = /<div class="image-placeholder" data-id="([^"]+)">\[USE_Image-[^\]]+\] - <em>([^<]+)<\/em><\/div>/g;
  
  // Replace with image tags if the image exists
  content = content.replace(placeholderRegex, (match, id, description) => {
    // Check for various image formats
    const formats = ['png', 'jpg', 'jpeg', 'svg', 'gif'];
    for (const format of formats) {
      const imagePath = path.join(imageDir, `${id}.${format}`);
      if (fs.existsSync(imagePath)) {
        return `<figure>
          <img src="images/${id}.${format}" alt="${description}">
          <figcaption>${description}</figcaption>
        </figure>`;
      }
    }
    // Image doesn't exist yet, keep placeholder
    return match;
  });
  
  // Write updated content back to file
  fs.writeFileSync(filePath, content);
  console.log(`Processed: ${htmlFile}`);
});

console.log('Image replacement complete!');
```

2. **Use the Script**:
   ```bash
   # First add your images to docs/development-html/images/
   # Then run:
   node scripts/replace-images.js
   ```

## Image Guidelines

For consistency, follow these guidelines when creating images:

### Screenshots

- **Resolution**: Use high-DPI/Retina screenshots when possible
- **Size**: Crop to show only relevant information
- **Highlighting**: Use red boxes or arrows to emphasize important areas
- **Windows**: Include window borders for context
- **Dark Mode**: Use light mode for better readability in documentation

### Diagrams

- **Format**: SVG preferred for diagrams (better quality at all sizes)
- **Style**: Use consistent colors and styles across diagrams
- **Text**: Ensure text is readable at the displayed size
- **Simplicity**: Avoid cluttering diagrams with unnecessary details
- **Color Palette**: Use the same color palette as in Mermaid diagrams:
  - Primary elements: #bbdefb (light blue)
  - Secondary elements: #c8e6c9 (light green)
  - Highlights: #ffe0b2 (light orange)
  - Actions/flows: #e1bee7 (light purple)

## Troubleshooting

### Images Not Appearing

1. Verify the image file exists in the `images` directory
2. Check that the filename matches the ID exactly (case-sensitive)
3. Ensure the image format is supported (png, jpg, svg, gif)
4. Check for HTML syntax errors in your replacement

### Images Not Sizing Correctly

- Add appropriate CSS classes for sizing
- Use responsive images with proper width/height attributes
- For large diagrams, consider using a lightbox mechanism

## Maintenance

When updating documentation:

1. Add new image placeholders in Markdown using the standard format
2. Run the docs generator: `npm run docs`
3. Add the corresponding images to the `images` directory
4. Run the image replacement script if using the automated approach