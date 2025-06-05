# Component System

This document provides detailed documentation about the component system in the Responsive Tiles application, including common components, tile components, component hierarchy, and usage patterns.

## Component Organization

The Responsive Tiles application organizes components into a structured hierarchy based on their purpose and scope:

```
src/components/
├── App.js                    # Main application container
├── RouteChange.js            # Route change tracking
├── Tile.js                   # Base tile container
├── common/                   # Reusable components
│   ├── AccountName/          # Display account names
│   ├── Announcement/         # Display announcements
│   ├── BudgetMeter/          # Budget progress visualization
│   ├── DateRangeControl/     # Date range selection
│   ├── Dialog/               # Modal dialog
│   ├── Donut/                # Donut chart visualization
│   ├── FabButton/            # Floating action button
│   ├── Form/                 # Form components
│   ├── LineChart/            # Line chart visualization
│   ├── MoneyField/           # Currency input field
│   └── ...
└── tiles/                    # Feature-specific tile components
    ├── Accounts/             # Accounts tile
    ├── Budgets/              # Budgets tile
    ├── Cashflow/             # Cash flow tile
    ├── Goals/                # Goals tile
    ├── Help/                 # Help tile
    ├── NetWorth/             # Net worth tile
    ├── Spending/             # Spending analysis tile
    └── ...
```

## Component Types

### Common Components

Common components are reusable UI elements that are not tied to specific business logic. They serve as the building blocks for the application and provide consistent UI patterns.

#### Form Components

| Component | Description | Props |
|-----------|-------------|-------|
| `Form` | Container for form elements | `onSubmit`, `children` |
| `TextField` | Text input field | `label`, `value`, `onChange`, `error`, `helperText` |
| `MoneyField` | Currency input field | `label`, `value`, `onChange`, `currency` |
| `DatePicker` | Date selection field | `label`, `value`, `onChange`, `minDate`, `maxDate` |
| `CheckboxField` | Checkbox input | `label`, `checked`, `onChange` |
| `TagField` | Tag selection field | `label`, `value`, `onChange`, `suggestions` |

#### Visualization Components

| Component | Description | Props |
|-----------|-------------|-------|
| `LineChart` | Line chart visualization | `data`, `width`, `height`, `margin`, `xAxis`, `yAxis` |
| `Donut` | Donut/pie chart | `data`, `width`, `height`, `colors`, `innerRadius`, `outerRadius` |
| `BudgetMeter` | Budget progress meter | `current`, `total`, `color` |
| `BarChart` | Bar chart visualization | `data`, `width`, `height`, `margin`, `xAxis`, `yAxis` |
| `Gauge` | Gauge visualization | `value`, `min`, `max`, `width`, `height` |

#### Layout Components

| Component | Description | Props |
|-----------|-------------|-------|
| `TileHeader` | Header for tiles | `title`, `back`, `onBack`, `actions` |
| `SubHeader` | Secondary header | `title`, `actions` |
| `SpinnerPanel` | Loading indicator | `loading`, `children`, `message` |
| `ErrorScreen` | Error display | `error`, `onRetry` |
| `FullScreenDialog` | Full-screen modal | `open`, `title`, `onClose`, `children` |

#### Example Usage

```jsx
// Example of common components usage
import React from 'react';
import Form from '@geezeo/common/Form';
import TextField from '@geezeo/common/TextField';
import MoneyField from '@geezeo/common/MoneyField';
import DatePicker from '@geezeo/common/DatePicker';
import Button from '@geezeo/common/Button';

function TransactionForm({ onSubmit, initialValues }) {
  const [values, setValues] = React.useState(initialValues);
  
  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
  };
  
  return (
    <Form onSubmit={() => onSubmit(values)}>
      <TextField
        label="Description"
        value={values.description}
        onChange={handleChange('description')}
        required
      />
      <MoneyField
        label="Amount"
        value={values.amount}
        onChange={handleChange('amount')}
        required
      />
      <DatePicker
        label="Date"
        value={values.date}
        onChange={handleChange('date')}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
    </Form>
  );
}
```

### Tile Components

Tile components are feature-specific implementations that provide particular functionality. Each tile is designed to be self-contained and can operate independently within the larger application.

#### Core Tiles

| Tile | Purpose | Key Components |
|------|---------|----------------|
| `Accounts` | Account management | `AccountList`, `AccountDetails`, `AccountForm` |
| `Budgets` | Budget tracking | `BudgetList`, `BudgetDetails`, `BudgetForm` |
| `Cashflow` | Cash flow analysis | `CashflowCalendar`, `CashflowAgenda`, `EventForm` |
| `Goals` | Financial goals | `GoalList`, `GoalDetails`, `GoalForm` |
| `NetWorth` | Net worth tracking | `NetWorthChart`, `AssetList`, `LiabilityList` |
| `Spending` | Spending analysis | `SpendingWheel`, `CategoryBreakdown`, `SpendingAnalyzer` |
| `Transactions` | Transaction search | `TransactionList`, `TransactionForm`, `SearchFilters` |

#### Example Tile Structure

Each tile typically follows a similar structure:

```jsx
// src/components/tiles/Example/index.js
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import TileHeader from '@geezeo/common/TileHeader';
import SpinnerPanel from '@geezeo/common/SpinnerPanel';
import ExampleList from './ExampleList';
import ExampleDetail from './ExampleDetail';
import ExampleForm from './ExampleForm';

const ExampleTile = inject('exampleStore')(observer(({ exampleStore }) => {
  const { path } = useRouteMatch();
  
  React.useEffect(() => {
    exampleStore.loadData();
  }, [exampleStore]);
  
  if (exampleStore.isLoading && !exampleStore.data.length) {
    return <SpinnerPanel loading={true} />;
  }
  
  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <TileHeader title="Example" />
          <ExampleList 
            items={exampleStore.data}
            onItemClick={(id) => history.push(`${path}/detail/${id}`)}
          />
        </Route>
        <Route path={`${path}/detail/:id`}>
          <ExampleDetail />
        </Route>
        <Route path={`${path}/edit/:id`}>
          <ExampleForm />
        </Route>
        <Route path={`${path}/new`}>
          <ExampleForm isNew={true} />
        </Route>
        <Redirect to={path} />
      </Switch>
    </div>
  );
}));

export default ExampleTile;
```

## Material-UI Customization

Responsive Tiles uses Material-UI as its component library and customizes it through themes and styled components.

### Theme Customization

The application uses a customizable theme that can be configured for white-labeling:

```jsx
// Example theme configuration
const theme = createMuiTheme({
  palette: {
    primary: {
      main: config.colors.primary,
      contrastText: config.colors.contrastText
    },
    secondary: {
      main: config.colors.secondary
    },
    error: {
      main: config.colors.error
    },
    background: {
      default: config.colors.background,
      paper: config.colors.paper
    },
    text: {
      primary: config.colors.textPrimary,
      secondary: config.colors.textSecondary
    }
  },
  typography: {
    fontFamily: config.fontFamily,
    h1: { fontSize: '2rem', fontWeight: 500 },
    h2: { fontSize: '1.75rem', fontWeight: 500 },
    h3: { fontSize: '1.5rem', fontWeight: 500 },
    h4: { fontSize: '1.25rem', fontWeight: 500 },
    h5: { fontSize: '1.1rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 }
  },
  shape: {
    borderRadius: 4
  },
  spacing: factor => `${0.5 * factor}rem`
});
```

### Styling Approach

The application uses Material-UI's styling system with the `makeStyles` hook:

```jsx
// Example component with custom styling
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2)
  },
  title: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1)
  },
  content: {
    color: theme.palette.text.primary
  }
}));

const ExampleCard = ({ title, children }) => {
  const classes = useStyles();
  
  return (
    <Paper className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      <div className={classes.content}>
        {children}
      </div>
    </Paper>
  );
};

export default ExampleCard;
```

## Component Hierarchy

The Responsive Tiles application follows a component hierarchy that facilitates both full application and standalone tile modes.

### App Mode Hierarchy

```
App
├── AppBar
├── Navigation
├── Routes
│   ├── Dashboard
│   │   ├── AccountsCard
│   │   ├── BudgetsCard
│   │   ├── CashflowCard
│   │   ├── NetWorthCard
│   │   └── SpendingCard
│   ├── Accounts
│   │   ├── AccountList
│   │   ├── AccountDetails
│   │   └── AccountForm
│   ├── Budgets
│   │   ├── BudgetList
│   │   ├── BudgetDetails
│   │   └── BudgetForm
│   └── ...other routes
└── Notifications
```

### Tile Mode Hierarchy

```
Tile
├── TileHeader
├── Routes
│   ├── MainView
│   ├── DetailView
│   ├── FormView
│   └── ...other routes
└── Notifications (if enabled)
```

## Higher-Order Components

The application uses several higher-order components (HOCs) to add functionality to components:

### `withRoot`

`withRoot` wraps components with the theme provider and other root-level providers:

```jsx
// Example of withRoot HOC
import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'mobx-react';
import theme from './theme';
import stores from './stores';

const withRoot = Component => props => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider {...stores}>
      <Component {...props} />
    </Provider>
  </ThemeProvider>
);

export default withRoot;
```

### `withStyles`

`withStyles` is used to add custom styles to components:

```jsx
// Example of withStyles HOC
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    padding: theme.spacing(2)
  },
  title: {
    color: theme.palette.primary.main
  }
});

const MyComponent = ({ classes, title }) => (
  <div className={classes.root}>
    <h1 className={classes.title}>{title}</h1>
  </div>
);

export default withStyles(styles)(MyComponent);
```

### `inject` and `observer`

These HOCs from MobX connect components to stores and make them reactive:

```jsx
// Example of inject and observer HOCs
import { inject, observer } from 'mobx-react';

const MyComponent = ({ accountsStore, title }) => {
  React.useEffect(() => {
    accountsStore.loadAccounts();
  }, [accountsStore]);
  
  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {accountsStore.accounts.map(account => (
          <li key={account.id}>{account.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default inject('accountsStore')(observer(MyComponent));
```

## Component Patterns

### Container/Presentation Pattern

The application follows the container/presentation pattern, separating components that manage state (containers) from those that render UI (presentation):

```jsx
// Container component
const AccountListContainer = inject('accountsStore')(observer(
  ({ accountsStore }) => {
    React.useEffect(() => {
      accountsStore.loadAccounts();
    }, [accountsStore]);
    
    return (
      <AccountList 
        accounts={accountsStore.accounts}
        isLoading={accountsStore.isLoading}
        onAccountClick={accountsStore.selectAccount}
      />
    );
  }
));

// Presentation component
const AccountList = ({ accounts, isLoading, onAccountClick }) => {
  if (isLoading) {
    return <SpinnerPanel loading={true} />;
  }
  
  return (
    <List>
      {accounts.map(account => (
        <ListItem 
          key={account.id}
          onClick={() => onAccountClick(account.id)}
        >
          <ListItemText 
            primary={account.name}
            secondary={formatMoney(account.balance)}
          />
        </ListItem>
      ))}
    </List>
  );
};
```

### Compound Components

Some complex components use the compound component pattern for flexible composition:

```jsx
// Example of compound components
import React from 'react';

const TabContext = React.createContext();

const Tabs = ({ children, value, onChange }) => {
  return (
    <TabContext.Provider value={{ value, onChange }}>
      <div className="tabs-container">
        {children}
      </div>
    </TabContext.Provider>
  );
};

const TabList = ({ children }) => {
  return (
    <div className="tab-list">
      {children}
    </div>
  );
};

const Tab = ({ value, label }) => {
  const { value: selectedValue, onChange } = React.useContext(TabContext);
  const isSelected = value === selectedValue;
  
  return (
    <button 
      className={`tab ${isSelected ? 'selected' : ''}`}
      onClick={() => onChange(value)}
    >
      {label}
    </button

    </button>
  );
};

const TabPanel = ({ value, children }) => {
  const { value: selectedValue } = React.useContext(TabContext);
  const isSelected = value === selectedValue;
  
  if (!isSelected) {
    return null;
  }
  
  return (
    <div className="tab-panel">
      {children}
    </div>
  );
};

// Usage example
function TabExample() {
  const [tab, setTab] = React.useState('tab1');
  
  return (
    <Tabs value={tab} onChange={setTab}>
      <TabList>
        <Tab value="tab1" label="First Tab" />
        <Tab value="tab2" label="Second Tab" />
        <Tab value="tab3" label="Third Tab" />
      </TabList>
      
      <TabPanel value="tab1">
        <p>Content for first tab</p>
      </TabPanel>
      <TabPanel value="tab2">
        <p>Content for second tab</p>
      </TabPanel>
      <TabPanel value="tab3">
        <p>Content for third tab</p>
      </TabPanel>
    </Tabs>
  );
}
```

### Render Props Pattern

The application uses render props for more flexible component composition:

```jsx
// Example of render props pattern
const DataLoader = ({ dataSource, render }) => {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    setIsLoading(true);
    dataSource()
      .then(result => {
        setData(result);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, [dataSource]);
  
  return render({ data, isLoading, error });
};

// Usage
const MyComponent = () => (
  <DataLoader
    dataSource={() => api.fetchData()}
    render={({ data, isLoading, error }) => {
      if (isLoading) return <SpinnerPanel loading={true} />;
      if (error) return <ErrorScreen error={error} />;
      return <DataDisplay data={data} />;
    }}
  />
);
```

## Best Practices

### Component Guidelines

1. **Keep components focused**: Each component should have a single responsibility
2. **Avoid deep nesting**: Too many levels of nesting make components hard to understand
3. **Extract reusable logic**: Use custom hooks for reusable logic
4. **Use PropTypes**: Document component props with PropTypes
5. **Consistent naming**: Follow consistent naming conventions for files and components
6. **Separate concerns**: Keep presentation separate from business logic
7. **Consistent error handling**: Implement error boundaries and consistent error UIs
8. **Accessibility**: Ensure components are accessible (ARIA attributes, keyboard navigation)

### Component Performance

1. **Memoize components**: Use React.memo for pure functional components
2. **Use useCallback and useMemo**: Memoize functions and values
3. **Virtualize long lists**: Use virtualization for large lists
4. **Lazy loading**: Use React.lazy and Suspense for code splitting
5. **Avoid unnecessary re-renders**: Be mindful of props changes that trigger re-renders

## Extending the Component System

### Adding New Common Components

1. Create a new directory in `src/components/common/`
2. Create the component file(s) with appropriate PropTypes
3. Add unit tests in `tests/unit/components/common/`
4. Export the component in an `index.js` file
5. Update documentation as needed

### Adding New Tile Components

1. Create a new directory in `src/components/tiles/`
2. Create the main tile component and supporting components
3. Set up routing for the tile's internal navigation
4. Connect to the appropriate stores
5. Register the tile in `src/tiles.js`
6. Add unit and integration tests
7. Update documentation as needed

## Component Testing

Components should be thoroughly tested with:

1. **Unit tests**: For individual component behavior
2. **Integration tests**: For component interactions
3. **Accessibility tests**: To ensure components meet accessibility standards
4. **Visual regression tests**: To ensure visual consistency

```jsx
// Example component test
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Test</Button>);
    expect(getByText('Test')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click Me</Button>
    );
    fireEvent.click(getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('applies variant class', () => {
    const { getByText } = render(<Button variant="contained">Test</Button>);
    expect(getByText('Test')).toHaveClass('contained');
  });
});
```

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - For more details on the overall architecture
- [State Management](./STATE-MANAGEMENT.md) - For details on how components interact with state
- [Testing](./TESTING.md) - For more information on testing components
- [Development](./DEVELOPMENT.md) - For development workflow guidelines
