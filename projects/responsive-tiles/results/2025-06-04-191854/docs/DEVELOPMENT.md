# Development Guide

This document provides detailed guidelines for developers working on the Responsive Tiles project, covering development environment setup, workflow, and best practices.

## Development Environment Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: LTS version (v18.x or newer recommended)
- **npm**: v8.x or newer (comes with Node.js)
- **Git**: For version control
- **Modern web browser**: Chrome or Firefox recommended for development

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Banno/responsive-tiles.git
   cd responsive-tiles
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root with the following variables:
   ```
   NODE_ENV=development
   API_BASE_URL=https://api.example.com
   PUBLIC_PATH=/
   ```

   For local development with mock data, you can use:
   ```
   MOCK_API=true
   ```

### Editor Setup

#### VS Code (Recommended)

We recommend using Visual Studio Code with the following extensions:

- ESLint
- Prettier - Code formatter
- React Developer Tools
- MobX Developer Tools
- Jest
- Material-UI Snippets

Recommended VS Code settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "javascript.preferences.importModuleSpecifier": "relative"
}
```

## npm Scripts

The project includes several npm scripts to aid development:

### Development

```bash
# Start the development server
npm start

# Start the development server with mock data
MOCK_API=true npm start

# Start the toolbox (development tools and examples)
npm run toolbox

# Generate HTML documentation from Markdown files
npm run docs
```

### Development Tools

The project includes specialized development tools to facilitate component development, testing, and configuration:

#### Toolbox

The Toolbox provides a visual configuration environment for tiles and the application:

- **Purpose**: Preview components and layouts, test different configurations
- **Access**: [http://localhost:8080/toolbox.html](http://localhost:8080/toolbox.html)
- **Features**: Configuration editor, mobile/desktop view toggle, app/tile mode switch, JWT authentication support

#### Test Harness

The Test Harness provides a grid-based layout for testing multiple tiles in different container contexts:

- **Purpose**: Test component interaction, responsive design, and container queries
- **Access**: [http://localhost:8080/test-harness.html](http://localhost:8080/test-harness.html)
- **Features**: Layout grid, multiple tile configuration, sidebar configuration panels

For detailed information on using these tools, see the [Developer Tools Guide](./DEVELOPER-TOOLS.md).

### HTML Documentation

The project includes a script to generate a static HTML version of all Markdown documentation:

- **Purpose**: Create a well-styled, navigable HTML site from Markdown documentation
- **Command**: `npm run docs`
- **Output**: Creates HTML files in the `docs/development-html/` directory
- **Features**: Responsive design, syntax highlighting, navigation sidebar, automatic link conversion

This is particularly useful for:
- Sharing documentation with team members who don't have access to the codebase
- Creating an offline documentation reference
- Improving readability with consistent styling

The Markdown files remain the source of truth, with the HTML files being generated from them.

### Testing

```bash
# Run fast tests during development
npm run test:fast

# Run fast tests in watch mode during development
npm run test:fast:watch

# Run full test suite
npm test

# Run end-to-end tests with Playwright
npm run test:playwright

# Run accessibility tests
npm run test:a11y

# Run tests with coverage report
npm run test:coverage
```

### Building

```bash
# Clean the dist directory
npm run clean

# Build for production
npm run build

# Build with specific environment
NODE_ENV=staging npm run build
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Run ESLint with auto-fix
npm run lint:fix
```

### Release

```bash
# Create a new version (updates package.json and creates tag)
npm run release

# Create a new version for main branch
npm run release:main
```

## Environment Configuration

The application supports multiple environment configurations:

### Environment Variables

Key environment variables used in the project:

| Variable | Description | Default Value |
|----------|-------------|--------------|
| `NODE_ENV` | Environment mode (development, production, test) | `development` |
| `API_BASE_URL` | Base URL for API requests | `https://api.dev.example.com` |
| `MOCK_API` | Use mock API data instead of real API | `false` |
| `PUBLIC_PATH` | Public path for assets | `/` |
| `GA_TRACKING_ID` | Google Analytics tracking ID | - |
| `SENTRY_DSN` | Sentry error reporting DSN | - |

### Configuration Files

Environment-specific configurations are managed through:

- `.env` - Local environment variables (git-ignored)
- `.env.development` - Development environment defaults
- `.env.production` - Production environment defaults
- `.env.test` - Test environment defaults

### Feature Flags

The application supports feature flags through the `config` object:

```javascript
// Example feature flag usage
if (config.features.enableNewDashboard) {
  // Use new dashboard
} else {
  // Use old dashboard
}
```

## Code Style & Conventions

### JavaScript/React Conventions

- Use **functional components** with hooks instead of class components when possible
- Use **arrow functions** for event handlers and callbacks
- Use **async/await** for asynchronous operations
- Use **destructuring** for props and state
- Follow **container/presentation component** pattern
- Implement **error boundaries** for error handling

### CSS/Styling Conventions

The project uses Material-UI's styling system:

```javascript
// Recommended styling approach
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    color: theme.palette.text.primary
  },
  header: {
    marginBottom: theme.spacing(2)
  }
}));

function MyComponent() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1 className={classes.header}>Title</h1>
    </div>
  );
}
```

### File Structure Conventions

- One component per file
- File name should match the component name
- Use index.js for main exports
- Group related files in directories

Example component structure:
```
src/components/budgets/
├── BudgetList.js         # Main component
├── BudgetListItem.js     # Sub-component
├── BudgetForm.js         # Form component
├── BudgetDetail.js       # Detail view
└── index.js              # Export all components
```

### Naming Conventions

- **Components**: PascalCase (e.g., `BudgetList.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Constants**: UPPER_CASE (e.g., `DEFAULT_PAGE_SIZE`)
- **Files**: camelCase except for components
- **Directories**: camelCase

## Common Development Tasks

### Creating a New Component

1. Create a new file in the appropriate directory
2. Import required dependencies
3. Define the component function
4. Add PropTypes for documentation and validation
5. Export the component
6. Add unit tests in the corresponding tests directory

Example:
```javascript
// src/components/common/Button.js
import React from 'react';
import PropTypes from 'prop-types';
import MUIButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    // Custom styles
  }
}));

export const Button = ({ children, variant, onClick, ...props }) => {
  const classes = useStyles();
  return (
    <MUIButton 
      className={classes.root} 
      variant={variant} 
      onClick={onClick} 
      {...props}
    >
      {children}
    </MUIButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  onClick: PropTypes.func
};

Button.defaultProps = {
  variant: 'contained'
};

export default Button;
```

### Adding a New Store

1. Create a new directory in `src/stores/`
2. Create an `index.js` file for the main store
3. Define the store class with observables, computed values, and actions
4. Export the store instance

Example:
```javascript
// src/stores/newFeatureStore/index.js
import { makeObservable, observable, computed, action } from 'mobx';
import * as api from '@geezeo/api';

class NewFeatureStore {
  @observable data = [];
  @observable isLoading = false;
  @observable error = null;

  constructor() {
    makeObservable(this);
  }

  @computed get processedData() {
    // Process and return data
    return this.data.map(item => ({
      ...item,
      // Additional processing
    }));
  }

  @action loadData = async () => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await api.getNewFeatureData();
      this.data = response.data;
    } catch (error) {
      this.error = error;
      console.error('Failed to load data:', error);
    } finally {
      this.isLoading = false;
    }
  };
}

const newFeatureStore = new NewFeatureStore();
export default newFeatureStore;
```

### Adding a New API Endpoint

1. Add the API method to the appropriate file in `src/api/`
2. Add any necessary types or interfaces
3. Implement error handling

Example:
```javascript
// src/api/index.js
export const getNewFeatureData = (params) => 
  client.get('/new-feature', { params });

export const createNewFeatureItem = (data) => 
  client.post('/new-feature', data);

export const updateNewFeatureItem = (id, data) => 
  client.put(`/new-feature/${id}`, data);

export const deleteNewFeatureItem = (id) => 
  client.delete(`/new-feature/${id}`);
```

### Adding a New Route

1. Define the route in `src/routes.js`
2. Create the necessary components
3. Update navigation components if needed

Example:
```javascript
// src/routes.js
export const getRoutes = (isApp = true) => {
  const routes = [
    // Existing routes
    {
      path: '/new-feature',
      component: NewFeature,
      exact: true,
      title: 'New Feature'
    },
    // More routes
  ];
  
  return isApp ? routes : filterTileRoutes(routes);
};
```

### Adding a New Tile

1. Create the tile component in `src/components/tiles/`
2. Add the tile to the registry in `src/tiles.js`
3. Add any necessary stores and utilities

Example:
```javascript
// src/tiles.js
import NewFeatureTile from './components/tiles/NewFeature';

// Add to registry
const registry = {
  // Existing tiles
  createNewFeatureTile: (el, config) => {
    return createTile(el, 'new-feature', NewFeatureTile, config);
  }
};
```

## Building and Deployment

### Build Process

The build process uses Webpack to bundle the application:

1. Clean the `dist` directory
2. Compile JavaScript with Babel
3. Process CSS and other assets
4. Optimize and minify for production
5. Generate final bundle in the `dist` directory

### GitHub Actions Workflow

The project uses GitHub Actions for CI/CD. The workflow includes:

1. **Testing**: Runs tests to validate code quality
2. **Version Bumping**: Automatically increments version
3. **Building**: Creates optimized builds for all environments
4. **Deployment**: Deploys to different environments (dev, staging, production)

#### GitHub Variables Setup

Before using the GitHub Actions workflow, you need to set up the required variables:

```bash
# Install GitHub CLI if you haven't already
brew install gh

# Run the setup script (adds to existing configuration)
./setup-github-variables.sh

# Or clean all existing variables and set new ones
./setup-github-variables.sh --clean

# Verify that all required variables are correctly set
./setup-github-variables.sh --verify
```

The script sets up:
- Repository variables (Node version, GCP credentials, etc.)
- Environment-specific variables (bucket names, deployment folders)
- Required secrets (Slack webhook if enabled)
- Environment protection rules

For more details, see [GITHUB-WORKFLOW.md](./GITHUB-WORKFLOW.md).

### Deployment Environments

The application supports multiple deployment environments:

- **Development**: Used during local development and for PR reviews
- **Staging**: Used for testing before production
- **Production**: Live environment for end users (requires approval)

### Manual Deployment Process

For manual deployments without GitHub Actions:

1. Create a production build:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to the appropriate environment.

3. For production releases, create a new version first:
   ```bash
   npm run release
   git push --follow-tags origin main
   ```

### Environment-Specific Builds

To create a build for a specific environment:

```bash
NODE_ENV=staging npm run build
```

## Troubleshooting

### Common Issues

- **Module not found errors**: Check import paths and make sure all dependencies are installed
- **MobX errors**: Make sure to use `makeObservable` and proper decorators
- **React warnings**: Check for missing keys in lists or other React-specific warnings
- **Build errors**: Check webpack configuration and environment variables

### Debugging

For debugging in development:

1. Use browser developer tools
2. Enable React Developer Tools
3. Enable MobX Developer Tools
4. Check console for errors and warnings
5. Use breakpoints for step-through debugging

### Performance Issues

If you encounter performance issues:

1. Use React DevTools Profiler to identify bottlenecks
2. Check for unnecessary re-renders
3. Implement memoization where appropriate
4. Consider code splitting for large components
5. Use performance monitoring tools like Lighthouse

## Resources

- [React 17 Documentation](https://react.dev/versions#react-17)
- [MobX Documentation](https://mobx.js.org/README.html)
- [Material-UI Documentation](https://material-ui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Webpack Documentation](https://webpack.js.org/)

