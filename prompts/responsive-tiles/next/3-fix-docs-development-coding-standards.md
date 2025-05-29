# Fix docs/development/coding-standards.md

Please completely rewrite the "File Extensions" section in docs/development/coding-standards.md. This is a JavaScript-only project.

Replace the entire section that mentions:
- Use .tsx for React components
- Use .ts for utility functions
- Use .d.ts for type definitions

With:
### File Extensions
- Use .js for ALL JavaScript files including React components
- JSX is embedded directly in .js files (not .jsx files)
- No TypeScript files (.ts/.tsx/.d.ts) are used in this project
- All imports should reference .js files

Also update any other TypeScript references in this file to JavaScript equivalents. 