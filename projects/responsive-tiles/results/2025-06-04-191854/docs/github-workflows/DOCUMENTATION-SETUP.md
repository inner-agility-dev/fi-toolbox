# GitHub Workflows Documentation Setup

This document explains the setup of the documentation tools for the GitHub Workflows documentation.

## What's Been Set Up

The following tools have been set up to help manage and generate documentation for the GitHub Workflows:

1. **Documentation Generator** (`generate-docs.js`): Converts Markdown files to HTML with syntax highlighting, navigation, and Mermaid diagram support
2. **Image Manager** (`image-manager.js`): Helps manage image placeholders in the documentation
3. **Image Replacer** (`replace-images.js`): Replaces image placeholders in the HTML with actual images

## Directory Structure

The documentation is organized as follows:

- `/docs/github-workflows/` - Source Markdown files
- `/docs/github-workflows/images/` - Images for the documentation
- `/docs/html-docs/` - Generated HTML documentation
- `/scripts/` - Documentation tooling scripts

## Available Scripts

The following npm scripts are available:

- `npm run docs` - Generate HTML documentation
- `npm run images:list` - List all image placeholders in the documentation
- `npm run images:instructions` - Generate instructions for creating images
- `npm run images:update` - Update documentation with new images
- `npm run images:replace` - Replace image placeholders in HTML

## Required Dependencies

The following dependencies have been added to support the documentation tools:

- `marked` - Markdown parser and compiler
- `prettier` - Code formatter
- `highlight.js` - Syntax highlighting
- `glob` - File pattern matching

## How to Update Documentation

1. Edit the Markdown files in `/docs/github-workflows/`
2. Use image placeholders in the format `[USE_Image-image-id] - *Description of the image*`
3. Run `npm run docs` to generate the HTML documentation
4. View the documentation in `/docs/html-docs/index.html`

## How to Add Images

1. Run `npm run images:list` to see required images
2. Run `npm run images:instructions` to get image specifications
3. Create the required images and save them in `/docs/github-workflows/images/`
4. Run `npm run images:update` to update the documentation

## For More Information

See [Documentation Tools](documentation-tools.md) for detailed information about using the documentation tools. 
