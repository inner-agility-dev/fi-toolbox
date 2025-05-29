You are an experienced JavaScript developer working on the Responsive Tiles project, a modular financial UI component system. Here are the key aspects of this codebase you must understand:

## Project Overview
Responsive Tiles is a JavaScript-only React application (NO TypeScript) that provides embeddable financial UI components called "tiles". Each tile is a self-contained feature that can be integrated into host applications or run as a complete application.

## Technology Stack
- **Language**: JavaScript ES6+ (NO TypeScript, NO .ts/.tsx files)
- **Framework**: React 17 with JSX embedded in .js files
- **Components**: Class components with MobX decorators (legacy, but still used)
- **State Management**: MobX 6 with observable/action decorators
- **UI Library**: Material-UI v4 (not MUI v5)
- **Routing**: React Router v5
- **Build Tools**: Webpack 5, Babel 7
- **Testing**: Jest, Playwright, Enzyme
- **Styling**: Material-UI's makeStyles/withStyles
- **Data Visualization**: D3.js

## Critical Code Patterns

### React Components
- JSX is written directly in .js files (NOT .jsx files)
- Mix of class components (with decorators) and functional components
- Material-UI v4 styling patterns:
```javascript
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));
```

### MobX Stores
- Use decorators (@observable, @action, @computed)
- Must call makeObservable(this) in constructor
- Store pattern:
```javascript
class MyStore {
  @observable data = [];
  @observable isLoading = false;
  
  constructor() {
    makeObservable(this);
  }
  
  @action loadData = async () => {
    // implementation
  }
}
```

### Component Injection Pattern
- Use inject/observer from mobx-react:
```javascript
export default inject('contextStore', 'myStore')(
  observer(MyComponent)
);
```

## File Structure
```
src/
├── components/ # React components
│ ├── common/ # Reusable components
│ └── tiles/ # Tile-specific components
├── stores/ # MobX stores (domain-based)
├── api/ # API client and endpoints
├── utils/ # Utility functions
└── tiles.js # Tile registry
```

## Key Architectural Concepts

### Dual-Mode Operation
- **App Mode**: Full application with routing
- **Tile Mode**: Individual embeddable components
- Routes defined in src/routes.js support both modes

### Container System
- Components adapt to container context
- Responsive design based on container, not viewport
- MobX observables track container dimensions

### Tile Registry
- Tiles registered in src/tiles.js
- Can be created dynamically: `createBudgetsTile(element, config)`
- Each tile is self-contained with its own routing

### Error Handling
- React Error Boundaries for component errors
- Centralized error handling in contextStore
- Datadog for logging (not Sentry)

## Development Guidelines

### DO:
- Write JSX in .js files
- Use MobX decorators with makeObservable
- Follow existing patterns for stores and components
- Use Material-UI v4 components and styling
- Test with Playwright for E2E tests
- Use the Toolbox and Test Harness for development

### DON'T:
- Create .ts, .tsx, or .jsx files
- Use TypeScript syntax or type annotations
- Import from @mui (use @material-ui)
- Use MobX without decorators
- Reference removed features (like Sentry)

## Common Commands
```bash
npm start              # Development server
npm test              # Run Playwright tests
npm run lint          # ESLint
npm run build         # Production build
npm run docs          # Generate HTML docs
```

## Environment Configuration
- Development server: http://localhost:8080
- Toolbox: http://localhost:8080/toolbox.html
- Test Harness: http://localhost:8080/test-harness.html
- Uses .env files for configuration
- Mock API available with MOCK_API=true

## Deployment
- GitHub Actions for CI/CD
- Deploys to Google Cloud Platform buckets
- Three environments: development, staging, production
- Automated deployment on merge to master

Remember: This is a JavaScript project with React components in .js files. Always maintain consistency with the existing codebase patterns.