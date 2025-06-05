# Testing Guide

This document provides comprehensive documentation about the testing approach, methodologies, and tools used in the Responsive Tiles application.

## Testing Philosophy

The Responsive Tiles application follows a comprehensive testing strategy that includes:

1. **Unit Testing**: Testing individual functions and components in isolation
2. **Integration Testing**: Testing interactions between components
3. **End-to-End Testing**: Testing complete user flows
4. **Accessibility Testing**: Ensuring the application is accessible to all users
5. **Performance Testing**: Verifying the application meets performance requirements

The testing approach prioritizes:

- **Fast Feedback**: Tests are optimized to run quickly during development
- **Reliability**: Tests are designed to be deterministic and avoid flakiness
- **Coverage**: Critical paths and edge cases are covered
- **Maintainability**: Tests are structured to be easy to understand and maintain

## Test Organization

Tests are organized by type and purpose:

```
tests/
├── a11y/                    # Accessibility tests
├── e2e/                     # End-to-end tests
├── helpers/                 # Test helpers and utilities
├── integration/             # Integration tests
│   ├── components/          # Component integration tests
│   └── d3-mocks/            # D3 mocking utilities
├── mocks/                   # Mock implementations
│   ├── components/          # Mock components
│   ├── d3/                  # D3 library mocks
│   ├── geezeo/              # API mocks
│   ├── hocs/                # HOC mocks
│   ├── router/              # Router mocks
│   └── stores/              # Store mocks
├── performance/             # Performance tests
├── playwright/              # Playwright E2E tests
│   ├── components/          # Component tests
│   ├── fixtures/            # Test fixtures
│   ├── integration/         # Integration tests
│   ├── setup/               # Test setup
│   ├── stores/              # Store tests
│   └── utils/               # Testing utilities
├── setup/                   # Jest setup files
├── unit/                    # Unit tests
│   ├── components/          # Component unit tests
│   ├── dashboard/           # Dashboard-specific tests
│   ├── quality/             # Code quality tests
│   ├── stores/              # Store unit tests
│   └── utils/               # Utility function tests
└── utils/                   # General test utilities
    └── d3-testing/          # D3 testing utilities
```

## Test Configuration

Test configurations are stored in the `scripts/config/` directory:

```
scripts/config/
├── jest.config.js           # Base Jest configuration
├── jest.fast.config.js      # Fast tests configuration
├── jest.medium.config.js    # Medium tests configuration
├── jest.full.config.js      # Full test suite configuration
└── playwright.config.js     # Playwright configuration
```

Each configuration serves a specific purpose:

- **jest.fast.config.js**: Quick feedback during development
- **jest.medium.config.js**: More complete coverage for pre-commit validation
- **jest.full.config.js**: Comprehensive coverage for CI/CD

## Test Execution

Tests can be run using the following npm scripts:

```bash
# Run fast tests during development
npm run test:fast

# Run fast tests in watch mode
npm run test:fast:watch

# Run medium tests
npm run test:medium

# Run full test suite
npm test

# Run specific test file
npm test -- tests/unit/utils/arrays.test.js

# Run tests matching a pattern
npm test -- -t "arrays"

# Run end-to-end tests with Playwright
npm run test:playwright

# Run accessibility tests
npm run test:a11y

# Run tests with coverage report
npm run test:coverage
```

## Unit Testing

Unit tests focus on testing individual functions, components, and classes in isolation.

### Testing Utilities

Unit tests use Jest with the following utilities:

- **@testing-library/react**: For testing React components
- **@testing-library/jest-dom**: For DOM assertions
- **@testing-library/user-event**: For simulating user events

### Component Testing Pattern

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the correct class based on variant', () => {
    const { rerender } = render(<Button variant="contained">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('contained');

    rerender(<Button variant="outlined">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('outlined');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Store Testing Pattern

```javascript
import { when } from 'mobx';
import exampleStore from '../exampleStore';
import * as api from '@geezeo/api';

// Mock API
jest.mock('@geezeo/api');

describe('ExampleStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    exampleStore.data = [];
    exampleStore.isLoading = false;
    exampleStore.error = null;
    exampleStore.selectedId = null;
  });

  it('loads data successfully', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    api.getExampleData.mockResolvedValue({ data: mockData });

    await exampleStore.loadData();

    expect(api.getExampleData).toHaveBeenCalledTimes(1);
    expect(exampleStore.data).toEqual(mockData);
    expect(exampleStore.isLoading).toBe(false);
    expect(exampleStore.error).toBeNull();
  });

  it('handles load error', async () => {
    const errorMessage = 'Failed to load data';
    api.getExampleData.mockRejectedValue(new Error(errorMessage));

    await exampleStore.loadData();

    expect(api.getExampleData).toHaveBeenCalledTimes(1);
    expect(exampleStore.data).toEqual([]);
    expect(exampleStore.isLoading).toBe(false);
    expect(exampleStore.error).toBeInstanceOf(Error);
    expect(exampleStore.error.message).toBe(errorMessage);
  });

  it('creates item successfully', async () => {
    const newItem = { name: 'New Item' };
    const createdItem = { id: 1, name: 'New Item' };
    api.createExampleItem.mockResolvedValue({ data: createdItem });

    await exampleStore.createItem(newItem);

    expect(api.createExampleItem).toHaveBeenCalledWith(newItem);
    expect(exampleStore.data).toContainEqual(createdItem);
  });

  it('computes selectedItem correctly', () => {
    exampleStore.data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];
    exampleStore.selectedId = 2;

    expect(exampleStore.selectedItem).toEqual({ id: 2, name: 'Item 2' });
  });
});
```

### Utility Testing Pattern

```javascript
import { formatDate, addDays, isWeekend } from '../dates';

describe('Date utilities', () => {
  it('formats date correctly', () => {
    const date = new Date(2025, 3, 15); // April 15, 2025
    expect(formatDate(date, 'yyyy-MM-dd')).toBe('2025-04-15');
    expect(formatDate(date, 'MM/dd/yyyy')).toBe('04/15/2025');
    expect(formatDate(date, 'dd MMM yyyy')).toBe('15 Apr 2025');
  });

  it('adds days to date correctly', () => {
    const date = new Date(2025, 3, 15); // April 15, 2025
    const newDate = addDays(date, 5);
    expect(newDate.getDate()).toBe(20);
    expect(newDate.getMonth()).toBe(3); // April
    expect(newDate.getFullYear()).toBe(2025);
  });

  it('correctly identifies weekends', () => {
    const weekday = new Date(2025, 3, 15); // Wednesday, April 15, 2025
    const saturday = new Date(2025, 3, 12); // Saturday, April 12, 2025
    const sunday = new Date(2025, 3, 13); // Sunday, April 13, 2025

    expect(isWeekend(weekday)).toBe(false);
    expect(isWeekend(saturday)).toBe(true);
    expect(isWeekend(sunday)).toBe(true);
  });
});
```

## Integration Testing

Integration tests focus on how components interact with each other and with stores.

### Component Integration Testing

```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'mobx-react';
import TransactionList from '../TransactionList';
import transactionsStore from '@geezeo/stores/transactionsStore';
import tagsStore from '@geezeo/stores/tagsStore';

// Mock stores
jest.mock('@geezeo/stores/transactionsStore');
jest.mock('@geezeo/stores/tagsStore');

describe('TransactionList integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    transactionsStore.transactions = [
      { id: 1, description: 'Grocery', amount: 50, tags: ['food'] },
      { id: 2, description: 'Gas', amount: 30, tags: ['transport'] }
    ];
    transactionsStore.isLoading = false;
    transactionsStore.loadTransactions = jest.fn();
    
    tagsStore.tags = [
      { id: 'food', name: 'Food' },
      { id: 'transport', name: 'Transport' }
    ];
  });

  it('loads and displays transactions', async () => {
    render(
      <Provider transactionsStore={transactionsStore} tagsStore={tagsStore}>
        <TransactionList />
      </Provider>
    );

    expect(transactionsStore.loadTransactions).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Grocery')).toBeInTheDocument();
    expect(screen.getByText('Gas')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    expect(screen.getByText('$30.00')).toBeInTheDocument();
  });

  it('filters transactions when search is applied', async () => {
    transactionsStore.filterTransactions = jest.fn().mockImplementation((term) => {
      transactionsStore.transactions = transactionsStore.transactions.filter(
        t => t.description.toLowerCase().includes(term.toLowerCase())
      );
    });

    render(
      <Provider transactionsStore={transactionsStore} tagsStore={tagsStore}>
        <TransactionList />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search transactions');
    fireEvent.change(searchInput, { target: { value: 'gas' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(transactionsStore.filterTransactions).toHaveBeenCalledWith('gas');
      expect(screen.queryByText('Grocery')).not.toBeInTheDocument();
      expect(screen.getByText('Gas')).toBeInTheDocument();
    });
  });
});
```

### Store Integration Testing

```javascript
import transactionsStore from '@geezeo/stores/transactionsStore';
import tagsStore from '@geezeo/stores/tagsStore';
import * as api from '@geezeo/api';

// Mock API
jest.mock('@geezeo/api');

describe('Transactions and Tags store integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    transactionsStore.transactions = [];
    tagsStore.tags = [];
  });

  it('updates transaction tags in both stores', async () => {
    // Setup initial data
    transactionsStore.transactions = [
      { id: 1, description: 'Grocery', amount: 50, tags: [] }
    ];
    tagsStore.tags = [
      { id: 'food', name: 'Food' },
      { id: 'essentials', name: 'Essentials' }
    ];
    
    // Mock API responses
    api.updateTransaction.mockResolvedValue({
      data: { id: 1, description: 'Grocery', amount: 50, tags: ['food', 'essentials'] }
    });
    
    // Update transaction tags
    await transactionsStore.updateTransactionTags(1, ['food', 'essentials']);
    
    // Verify transaction was updated
    expect(api.updateTransaction).toHaveBeenCalledWith(1, {
      tags: ['food', 'essentials']
    });
    
    // Verify transaction in store was updated
    expect(transactionsStore.transactions[0].tags).toEqual(['food', 'essentials']);
    
    // Verify tag usage counts were updated in tagsStore
    expect(tagsStore.getTagUsageCount('food')).toBe(1);
    expect(tagsStore.getTagUsageCount('essentials')).toBe(1);
  });
});
```

## End-to-End Testing

End-to-end tests verify that the application works correctly from a user's perspective, testing complete user flows and interactions.

### Playwright Tests

The application uses Playwright for end-to-end testing, which allows testing across multiple browsers.

```javascript
// tests/playwright/transactions/search.spec.js
import { test, expect } from '@playwright/test';

test.describe('Transaction Search', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to transactions page
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', 'testuser');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.click('text=Transactions');
  });

  test('should search transactions by description', async ({ page }) => {
    // Enter search term
    await page.fill('[data-testid="search-input"]', 'Grocery');
    await page.click('[data-testid="search-button"]');
    
    // Wait for results to load
    await page.waitForSelector('[data-testid="transactions-list"]');
    
    // Check that results contain only matching transactions
    const transactions = await page.$$('[data-testid="transaction-item"]');
    expect(transactions.length).toBeGreaterThan(0);
    
    for (const transaction of transactions) {
      const description = await transaction.textContent();
      expect(description.toLowerCase()).toContain('grocery');
    }
  });

  test('should filter transactions by date range', async ({ page }) => {
    // Open date filter
    await page.click('[data-testid="date-filter-button"]');
    
    // Select date range
    await page.click('text=Last 7 days');
    
    // Apply filter
    await page.click('[data-testid="apply-filters-button"]');
    
    // Wait for results to load
    await page.waitForSelector('[data-testid="transactions-list"]');
    
    // Verify date filter badge is displayed
    expect(await page.isVisible('text=Last 7 days')).toBeTruthy();
  });

  test('should create a new transaction', async ({ page }) => {
    // Click "Add Transaction" button
    await page.click('[data-testid="add-transaction-button"]');
    
    // Fill in transaction details
    await page.fill('[data-testid="description-input"]', 'New Test Transaction');
    await page.fill('[data-testid="amount-input"]', '42.99');
    await page.fill('[data-testid="date-input"]', '2025-04-15');
    
    // Select account
    await page.click('[data-testid="account-select"]');
    await page.click('text=Checking Account');
    
    // Save transaction
    await page.click('[data-testid="save-transaction-button"]');
    
    // Wait for transaction to be saved and list to update
    await page.waitForSelector('text=Transaction saved');
    
    // Verify new transaction appears in the list
    expect(await page.isVisible('text=New Test Transaction')).toBeTruthy();
    expect(await page.isVisible('text=$42.99')).toBeTruthy();
  });
});
```

### E2E Test Organization

Playwright tests are organized by feature area:

```
tests/playwright/
├── accounts/              # Account management tests
├── budgets/               # Budget management tests
├── dashboard/             # Dashboard tests
├── goals/                 # Financial goals tests
├── login/                 # Authentication tests
├── networth/              # Net worth tests
├── spending/              # Spending analysis tests
└── transactions/          # Transaction management tests
```

## Accessibility Testing

Accessibility tests ensure that the application is usable by people with disabilities and complies with accessibility standards.

### Automated Accessibility Testing

The application uses axe-core and jest-axe for automated accessibility testing:

```javascript
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from '../Button';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <Button onClick={() => {}}>Click Me</Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have appropriate aria attributes when disabled', async () => {
    const { container, getByRole } = render(
      <Button disabled onClick={() => {}}>Disabled Button</Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Playwright Accessibility Testing

Accessibility is also tested in end-to-end tests using Playwright:

```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('dashboard should not have any accessibility violations', async ({ page }) => {
    await page.goto('/dashboard');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works for main menu', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Press Tab to focus on the first menu item
    await page.keyboard.press('Tab');
    
    // Verify focus is on a menu item
    const focusedElement = await page.evaluate(() => {
      return {
        tagName: document.activeElement.tagName,
        text: document.activeElement.textContent,
        role: document.activeElement.getAttribute('role')
      };
    });
    
    expect(focusedElement.role).toBe('menuitem');
    
    // Navigate using keyboard
    await page.keyboard.press('ArrowDown');
    
    // Verify focus moved to next menu item
    const nextFocusedElement = await page.evaluate(() => {
      return {
        tagName: document.activeElement.tagName,
        text: document.activeElement.textContent,
        role: document.activeElement.getAttribute('role')
      };
    });
    
    expect(nextFocusedElement.role).toBe('menuitem');
    expect(nextFocusedElement.text).not.toBe(focusedElement.text);
  });
});
```

## Mocking Strategies

### API Mocking

The application mocks API calls in tests to isolate components and ensure deterministic behavior:

```javascript
import * as api from '@geezeo/api';

// Mock entire API module
jest.mock('@geezeo/api');

beforeEach(() => {
  // Set up mock implementations
  api.getTransactions.mockResolvedValue({
    data: [
      { id: 1, description: 'Grocery', amount: 50 },
      { id: 2, description: 'Gas', amount: 30 }
    ]
  });
  
  api.createTransaction.mockResolvedValue({
    data: { id: 3, description: 'New Transaction', amount: 25 }
  });
  
  api.updateTransaction.mockResolvedValue({
    data: { id: 1, description: 'Updated Grocery', amount: 55 }
  });
  
  api.deleteTransaction.mockResolvedValue({ success: true });
});

afterEach(() => {
  // Clear all mocks between tests
  jest.clearAllMocks();
});
```

### Store Mocking

For testing components that depend on stores:

```javascript
import transactionsStore from '@geezeo/stores/transactionsStore';

// Mock the store
jest.mock('@geezeo/stores/transactionsStore', () => ({
  transactions: [],
  isLoading: false,
  error: null,
  loadTransactions: jest.fn(),
  createTransaction: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn(),
  filterTransactions: jest.fn()
}));

beforeEach(() => {
  // Set up mock data and implementations
  transactionsStore.transactions = [
    { id: 1, description: 'Grocery', amount: 50 },
    { id: 2, description: 'Gas', amount: 30 }
  ];
  
  transactionsStore.loadTransactions.mockImplementation(() => {
    transactionsStore.isLoading = true;
    return Promise.resolve().then(() => {
      transactionsStore.isLoading = false;
    });
  });
  
  transactionsStore.createTransaction.mockImplementation((transaction) => {
    const newTransaction = { id: Date.now(), ...transaction };
    transactionsStore.transactions.push(newTransaction);
    return Promise.resolve(newTransaction);
  });
});
```

### Router Mocking

For testing components that use React Router:

```javascript
import { MemoryRouter, Route } from 'react-router-dom';

// Wrap component in MemoryRouter for testing
const renderWithRouter = (ui, { route = '/', ...renderOptions } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>,
    renderOptions
  );
};

// Mock useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '123' }),
  useHistory: () => ({
    push: jest.fn(),
    goBack: jest.fn()
  })
}));
```

### D3 Mocking

For testing components that use D3.js:

```javascript
// Mock D3 modules to avoid DOM manipulation in tests
jest.mock('d3-selection', () => ({
  select: () => ({
    append: () => ({
      attr: () => ({ attr: () => ({ text: () => ({}) }) }),
      style: () => ({ style: () => ({}) })
    }),
    selectAll: () => ({
      data: () => ({
        enter: () => ({
          append: () => ({
            attr: () => ({ attr: () => ({}) }),
            style: () => ({ style: () => ({}) })
          })
        }),
        exit: () => ({ remove: () => ({}) })
      })
    })
  })
}));

// Alternatively, use the unified D3 testing approach
import { d3TestSuite } from '../../../tests/utils/d3-test-helper';

d3TestSuite('Donut Chart', (d3Utils) => {
  // Use mocked D3 utilities
  const { select, arc, pie } = d3Utils;
  
  test('renders donut chart with correct data', () => {
    // Test implementation
  });
});
```

## Test Data

### Mock Data

The application uses standard mock data for testing:

```javascript
// tests/mocks/data/transactions.js
export const mockTransactions = [
  {
    id: 1,
    description: 'Grocery Shopping',
    amount: 85.75,
    date: '2025-04-01',
    account_id: 101,
    tags: ['food', 'essentials']
  },
  {
    id: 2,
    description: 'Gas Station',
    amount: 45.50,
    date: '2025-04-03',
    account_id: 101,
    tags: ['transport']
  },
  {
    id: 3,
    description: 'Netflix Subscription',
    amount: 15.99,
    date: '2025-04-05',
    account_id: 102,
    tags: ['entertainment']
  }
];

// tests/mocks/data/accounts.js
export const mockAccounts = [
  {
    id: 101,
    name: 'Checking Account',
    type: 'checking',
    balance: 2547.85,
    currency: 'USD'
  },
  {
    id: 102,
    name: 'Credit Card',
    type: 'credit',
    balance: -450.25,
    currency: 'USD'
  }
];
```

### Test Fixtures

```javascript
// tests/fixtures/budgets.js
export const budgetFixtures = {
  emptyBudget: {
    id: 1,
    name: 'Empty Budget',
    amount: 500,
    current: 0,
    tags: ['food'],
    start_date: '2025-04-01',
    end_date: '2025-04-30'
  },
  partialBudget: {
    id: 2,
    name: 'Partial Budget',
    amount: 1000,
    current: 400,
    tags: ['entertainment'],
    start_date: '2025-04-01',
    end_date: '2025-04-30'
  },
  exceededBudget: {
    id: 3,
    name: 'Exceeded Budget',
    amount: 300,
    current: 350,
    tags: ['transport'],
    start_date: '2025-04-01',
    end_date: '2025-04-30'
  }
};
```

## Test Helpers

### Common Test Utilities

```javascript
// tests/utils/testUtils.js
import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'mobx-react';
import { MemoryRouter } from 'react-router-dom';
import theme from '@geezeo/theme';
import stores from '@geezeo/stores';

// Render with all providers
export const renderWithProviders = (ui, options = {}) => {
  const {
    route = '/',
    history = {},
    ...renderOptions
  } = options;

  return render(
    <ThemeProvider theme={theme}>
      <Provider {...stores}>
        <MemoryRouter initialEntries={[route]} {...history}>
          {ui}
        </MemoryRouter>
      </Provider>
    </ThemeProvider>,
    renderOptions
  );
};

// Create mock event
export const createMockEvent = (overrides = {}) => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target: { value: '' },
  ...overrides
});

// Wait for promises to resolve
export const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));
```

### Testing MobX

```javascript
// tests/utils/mobxTestUtils.js
import { configure } from 'mobx';

// Configure MobX for testing
export const configureMobXForTests = () => {
  configure({
    enforceActions: 'never',  // Disable strict mode for testing
    computedRequiresReaction: false,
    reactionRequiresObservable: false,
    observableRequiresReaction: false,
    disableErrorBoundaries: true
  });
};

// Create a simple observable store for testing
export const createTestStore = (initialState = {}) => {
  const store = observable(initialState);
  
  return {
    ...store,
    update: action((key, value) => {
      store[key] = value;
    })
  };
};
```

## Test Coverage

The application aims for high test coverage, especially for critical paths and business logic.

### Coverage Configuration

Coverage configuration is specified in the Jest configuration:

```javascript
// scripts/config/jest.full.config.js
module.exports = {
  // ...other config
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*/*.test.{js,jsx}',
    '!src/**/index.js',
    '!src/polyfills.js'
  ],
  coverageReporters: [
    'text',
    'text-summary',
    'json-summary',
    'lcov',
    'clover',
    'html'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    },
    'src/utils/': {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90
    },
    'src/components/common/': {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85
    }
  }
};
```

### Running Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open coverage report in browser
open coverage/lcov-report/index.html
```

## Best Practices

### Testing Guidelines

1. **Write tests first**: Consider using test-driven development (TDD)
2. **Keep tests simple**: Each test should verify one thing
3. **Use descriptive test names**: Test names should describe the expected behavior
4. **Isolate tests**: Tests should not depend on each other
5. **Mock external dependencies**: Use mocks for APIs, stores, etc.
6. **Test edge cases**: Include tests for error handling and edge cases
7. **Use appropriate assertions**: Choose the right assertion for each test
8. **Avoid test duplication**: Reuse test setup and teardown
9. **Don't test implementation details**: Focus on behavior, not implementation
10. **Keep tests maintainable**: Refactor tests when the codebase changes

### Common Testing Pitfalls

1. **Flaky tests**: Tests that sometimes pass and sometimes fail
2. **Slow tests**: Tests that take too long to run
3. **Overmocking**: Mocking too much can lead to tests that pass but don't catch real issues
4. **Undertesting**: Not testing edge cases or error conditions
5. **Testing implementation details**: Tests that break when implementation changes
6. **Excessive setup**: Complex test setup makes tests hard to understand
7. **Missing cleanup**: Not cleaning up after tests can affect other tests

## Related Documentation

- [Development Guide](../DEVELOPMENT.md) - For development workflow
- [Components](../COMPONENTS.md) - For component documentation
- [State Management](./STATE-MANAGEMENT.md) - For store documentation
- [API Integration](./API-INTEGRATION.md) - For API documentation