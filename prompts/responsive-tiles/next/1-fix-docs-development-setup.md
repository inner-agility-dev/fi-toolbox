# Fix docs/development/setup.md

Please update docs/development/setup.md to remove ALL TypeScript references. This is a JavaScript-only project with React JSX embedded in .js files.

Specific changes needed:
1. Replace the "Component Development" section that shows TypeScript interfaces and .tsx examples with JavaScript examples
2. Change all file extensions from .tsx/.ts to .js
3. Remove any mentions of TypeScript compiler or tsconfig.json
4. Update the build process to reference Babel transpilation instead of TypeScript compilation
5. Ensure all code examples show JSX directly in .js files
6. Update import statements to use .js extensions
7. Remove any type annotations from code examples

Example correction:
WRONG: const MyComponent: React.FC<Props> = ({ title }) => 
RIGHT: const MyComponent = ({ title }) => 