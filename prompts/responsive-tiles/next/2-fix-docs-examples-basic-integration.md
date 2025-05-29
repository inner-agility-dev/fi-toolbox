# Fix docs/examples/basic-integration.md

Please update docs/examples/basic-integration.md to correct all TypeScript syntax and wrong imports. This is a JavaScript-only project.

Required changes:
1. Fix ALL import statements:
   - Change: import { BudgetsTile } from './components/tiles/BudgetsTile.tsx';
   - To: import BudgetsTile from './components/tiles/BudgetsTile.js';
2. Remove all TypeScript type annotations from the 5 code examples
3. Update React component examples to JavaScript syntax (no interfaces, no React.FC)
4. Ensure all file paths reference .js files, not .tsx or .ts
5. Fix any @mui/material imports to use @material-ui/core instead

Validate that all examples would work in a JavaScript-only environment with Babel. 