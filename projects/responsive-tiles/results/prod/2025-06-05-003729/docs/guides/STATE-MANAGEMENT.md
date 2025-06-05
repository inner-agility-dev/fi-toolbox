# State Management

This document provides a comprehensive explanation of the state management approach in the Responsive Tiles application, focusing on MobX stores, their structure, patterns, and best practices.

## Overview

Responsive Tiles uses MobX for state management, which provides a reactive, efficient way to handle application state. The application follows a domain-driven store architecture, where stores are organized by feature domains.

## Store Structure

```
src/stores/
├── accountsStore/     # Accounts management
├── adsStore/          # Advertising/marketing
├── alertsStore/       # User alerts
├── budgetsStore/      # Budget tracking
├── carouselStore/     # Dashboard carousel
├── cashedgeStore/     # CashEdge integration
├── cashflowStore/     # Cash flow analysis
├── contextStore/      # Application context
├── financialHealthStore/ # Financial health metrics
├── finicityStore/     # Finicity integration
├── goalsStore/        # Financial goals
├── harvestsStore/     # Account data harvesting
├── netWorthStore/     # Net worth tracking
├── notificationsStore/# User notifications
├── partnersStore/     # Partner configuration
├── spendingStore/     # Spending analytics
├── tagsStore/         # Transaction tagging
├── ticketsStore/      # Support tickets
├── transactionsStore/ # Transaction management
└── usersStore/        # User management
```

Each store directory typically contains:
- `index.js`: Main store implementation
- Feature-specific components that are tightly coupled with the store
- Helper files and utilities

## MobX Configuration

The application configures MobX with the following settings:

```javascript
// MobX configuration
configure({
  enforceActions: 'observed',  // Ensures state changes happen via actions
  computedRequiresReaction: false,
  reactionRequiresObservable: false,
  observableRequiresReaction: false,
  disableErrorBoundaries: false
});
```

## Store Implementation Pattern

### Basic Store Structure

Each store follows a consistent implementation pattern:

```javascript
import { makeObservable, observable, computed, action, runInAction } from 'mobx';
import * as api from '@geezeo/api';

class ExampleStore {
  // Observable state
  @observable data = [];
  @observable isLoading = false;
  @observable error = null;
  @observable selectedId = null;

  constructor() {
    makeObservable(this);
  }

  // Computed values
  @computed get selectedItem() {
    return this.data.find(item => item.id === this.selectedId);
  }

  @computed get processedData() {
    return this.data.map(item => ({
      ...item,
      // Additional processing
    }));
  }

  // Actions
  @action setSelectedId = (id) => {
    this.selectedId = id;
  };

  @action loadData = async () => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await api.getExampleData();
      
      runInAction(() => {
        this.data = response.data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
        this.isLoading = false;
      });
      console.error('Failed to load data:', error);
    }
  };

  @action createItem = async (newItem) => {
    this.isLoading = true;
    
    try {
      const response = await api.createExampleItem(newItem);
      
      runInAction(() => {
        this.data.push(response.data);
        this.isLoading = false;
      });
      
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = error;
        this.isLoading = false;
      });
      throw error;
    }
  };

  @action updateItem = async (id, updates) => {
    this.isLoading = true;
    
    try {
      const response = await api.updateExampleItem(id, updates);
      
      runInAction(() => {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
          this.data[index] = { ...this.data[index], ...response.data };
        }
        this.isLoading = false;
      });
      
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.error = error;
        this.isLoading = false;
      });
      throw error;
    }
  };

  @action deleteItem = async (id) => {
    this.isLoading = true;
    
    try {
      await api.deleteExampleItem(id);
      
      runInAction(() => {
        this.data = this.data.filter(item => item.id !== id);
        if (this.selectedId === id) {
          this.selectedId = null;
        }
        this.isLoading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error;
        this.isLoading = false;
      });
      throw error;
    }
  };

  @action clearError = () => {
    this.error = null;
  };
}

// Create singleton instance
const exampleStore = new ExampleStore();
export default exampleStore;
```

### Store with Nested Observables

For complex state structures, stores may use nested observable objects:

```javascript
class BudgetsStore {
  @observable budgets = [];
  @observable filters = new Filters();  // Nested observable object
  @observable form = new BudgetForm();  // Nested observable object
  @observable pagination = {
    page: 0,
    pageSize: 10,
    totalCount: 0
  };
  
  // ...store implementation
}

// Nested observable class
class Filters {
  @observable searchTerm = '';
  @observable dateRange = null;
  @observable tagIds = [];
  @observable status = 'all';
  
  constructor() {
    makeObservable(this);
  }
  
  @action reset = () => {
    this.searchTerm = '';
    this.dateRange = null;
    this.tagIds = [];
    this.status = 'all';
  };
  
  // ...more actions
}
```

## Store Communication

Stores communicate with each other through several methods:

### Direct References

Stores can import and reference other stores directly:

```javascript
// src/stores/budgetsStore/index.js
import tagsStore from '../tagsStore';
import accountsStore from '../accountsStore';

class BudgetsStore {
  // ...

  @action createBudget = async (budget) => {
    // Use data from other stores
    const availableTags = tagsStore.tags;
    const accounts = accountsStore.accounts;
    
    // Process data and make API call
    // ...
  };
}
```

### Context Store

The `contextStore` is a central store that contains application-wide state:

```javascript
// src/stores/contextStore/index.js
class ContextStore {
  @observable user = null;
  @observable isAuthenticated = false;
  @observable config = {};
  @observable theme = 'light';
  @observable partnerInfo = {};
  @observable currentRoute = '/';
  
  // ...actions
}

const contextStore = new ContextStore();
export default contextStore;
```

### Events

For cross-store communication without direct dependencies, the application uses a custom event system:

```javascript
// src/utils/events.js
import { EventEmitter } from 'events';

const eventBus = new EventEmitter();

export const EVENTS = {
  ACCOUNT_UPDATED: 'ACCOUNT_UPDATED',
  TRANSACTION_CREATED: 'TRANSACTION_CREATED',
  BUDGET_EXCEEDED: 'BUDGET_EXCEEDED',
  // ...other events
};

export default eventBus;
```

```javascript
// Example usage in a store
import eventBus, { EVENTS } from '@geezeo/utils/events';

class TransactionsStore {
  // ...

  @action createTransaction = async (transaction) => {
    // ... create transaction logic

    // Emit event for other stores
    eventBus.emit(EVENTS.TRANSACTION_CREATED, createdTransaction);
  };
}

// Listening in another store
constructor() {
  makeObservable(this);
  eventBus.on(EVENTS.TRANSACTION_CREATED, this.handleNewTransaction);
}

@action handleNewTransaction = (transaction) => {
  // React to new transaction
};
```

## Data Fetching Patterns

### Basic Fetch Pattern

```javascript
@action fetchData = async () => {
  this.isLoading = true;
  this.error = null;
  
  try {
    const response = await api.getData();
    
    runInAction(() => {
      this.data = response.data;
      this.isLoading = false;
    });
  } catch (error) {
    runInAction(() => {
      this.error = error;
      this.isLoading = false;
    });
    console.error('Error fetching data:', error);
  }
};
```

### Polling Pattern

```javascript
startPolling() {
  this.pollInterval = setInterval(() => {
    this.fetchLatestData();
  }, 30000); // Poll every 30 seconds
}

stopPolling() {
  if (this.pollInterval) {
    clearInterval(this.pollInterval);
    this.pollInterval = null;
  }
}

componentDidMount() {
  this.fetchLatestData();
  this.startPolling();
}

componentWillUnmount() {
  this.stopPolling();
}
```

### Caching Pattern

```javascript
@observable _cache = new Map();
@observable _cacheTimestamps = new Map();

isCacheValid(key) {
  const timestamp = this._cacheTimestamps.get(key);
  if (!timestamp) return false;
  
  const now = Date.now();
  const cacheAge = now - timestamp;
  return cacheAge < this.cacheTTL;
}

@action fetchWithCache = async (key, fetchFn) => {
  if (this.isCacheValid(key)) {
    return this._cache.get(key);
  }
  
  this.isLoading = true;
  
  try {
    const data = await fetchFn();
    
    runInAction(() => {
      this._cache.set(key, data);
      this._cacheTimestamps.set(key, Date.now());
      this.isLoading = false;
    });
    
    return data;
  } catch (error) {
    runInAction(() => {
      this.error = error;
      this.isLoading = false;
    });
    throw error;
  }
};

@action invalidateCache = (key) => {
  if (key) {
    this._cache.delete(key);
    this._cacheTimestamps.delete(key);
  } else {
    this._cache.clear();
    this._cacheTimestamps.clear();
  }
};
```

## Common State Patterns

### Pagination

```javascript
@observable pagination = {
  page: 0,
  pageSize: 10,
  totalCount: 0
};

@computed get totalPages() {
  return Math.ceil(this.pagination.totalCount / this.pagination.pageSize);
}

@computed get hasNextPage() {
  return this.pagination.page < this.totalPages - 1;
}

@computed get hasPreviousPage() {
  return this.pagination.page > 0;
}

@action setPage = (page) => {
  this.pagination.page = page;
  this.fetchData();
};

@action setPageSize = (pageSize) => {
  this.pagination.pageSize = pageSize;
  this.pagination.page = 0; // Reset to first page
  this.fetchData();
};

@action fetchData = async () => {
  const { page, pageSize } = this.pagination;
  
  try {
    const response = await api.getData({
      page,
      pageSize
    });
    
    runInAction(() => {
      this.data = response.data;
      this.pagination.totalCount = response.totalCount;
    });
  } catch (error) {
    // Error handling
  }
};
```

### Filtering

```javascript
@observable filters = {
  searchTerm: '',
  dateRange: null,
  status: 'all',
  categories: []
};

@action setFilter = (key, value) => {
  this.filters[key] = value;
};

@action resetFilters = () => {
  this.filters = {
    searchTerm: '',
    dateRange: null,
    status: 'all',
    categories: []
  };
};

@computed get filtersApplied() {
  return this.filters.searchTerm !== '' || 
         this.filters.dateRange !== null ||
         this.filters.status !== 'all' ||
         this.filters.categories.length > 0;
}

@action applyFilters = () => {
  this.pagination.page = 0; // Reset to first page
  this.fetchData();
};

@action fetchData = async () => {
  const { searchTerm, dateRange, status, categories } = this.filters;
  const { page, pageSize } = this.pagination;
  
  try {
    const response = await api.getData({
      page,
      pageSize,
      search: searchTerm,
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      status,
      categories
    });
    
    runInAction(() => {
      this.data = response.data;
      this.pagination.totalCount = response.totalCount;
    });
  } catch (error) {
    // Error handling
  }
};
```

### Form State

```javascript
@observable form = {
  values: {
    name: '',
    amount: 0,
    date: new Date(),
    description: ''
  },
  errors: {},
  touched: {},
  isSubmitting: false
};

@action setFormValue = (field, value) => {
  this.form.values[field] = value;
  this.form.touched[field] = true;
  this.validateField(field);
};

@action validateField = (field) => {
  const value = this.form.values[field];
  let error = null;
  
  switch (field) {
    case 'name':
      if (!value) error = 'Name is required';
      else if (value.length > 100) error = 'Name is too long';
      break;
    case 'amount':
      if (isNaN(value)) error = 'Amount must be a number';
      else if (value <= 0) error = 'Amount must be positive';
      break;
    // ... other validations
  }
  
  this.form.errors[field] = error;
};

@action validateForm = () => {
  const fields = Object.keys(this.form.values);
  fields.forEach(this.validateField);
  
  return !Object.values(this.form.errors).some(error => error !== null);
};

@action resetForm = () => {
  this.form = {
    values: {
      name: '',
      amount: 0,
      date: new Date(),
      description: ''
    },
    errors: {},
    touched: {},
    isSubmitting: false
  };
};

@action submitForm = async () => {
  if (!this.validateForm()) return;
  
  this.form.isSubmitting = true;
  
  try {
    const result = await api.createItem(this.form.values);
    
    runInAction(() => {
      this.form.isSubmitting = false;
      this.resetForm();
      this.data.push(result);
    });
    
    return result;
  } catch (error) {
    runInAction(() => {
      this.form.isSubmitting = false;
      this.form.errors.submit = error.message;
    });
    throw error;
  }
};
```

## Using Stores in Components

### Class Components

```jsx
import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('exampleStore')
@observer
class ExampleComponent extends React.Component {
  componentDidMount() {
    this.props.exampleStore.loadData();
  }
  
  handleCreate = () => {
    const { exampleStore } = this.props;
    exampleStore.createItem({ name: 'New Item' });
  };
  
  render() {
    const { exampleStore } = this.props;
    const { data, isLoading, error } = exampleStore;
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    return (
      <div>
        <h1>Example Items</h1>
        <button onClick={this.handleCreate}>Add Item</button>
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ExampleComponent;
```

### Functional Components

```jsx
import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';

const ExampleComponent = ({ exampleStore }) => {
  useEffect(() => {
    exampleStore.loadData();
  }, [exampleStore]);
  
  const handleCreate = () => {
    exampleStore.createItem({ name: 'New Item' });
  };
  
  const { data, isLoading, error } = exampleStore;
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>Example Items</h1>
      <button onClick={handleCreate}>Add Item</button>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default inject('exampleStore')(observer(ExampleComponent));
```

## Performance Considerations

### Computed Values

Use computed values instead of derived values in render methods:

```javascript
// Good
@computed get filteredData() {
  return this.data.filter(item => item.status === this.activeStatus);
}

// Avoid
render() {
  const filteredData = this.data.filter(item => item.status === this.activeStatus);
  // ...
}
```

### Reaction Optimization

```javascript
// Use a disposer for reactions
componentDidMount() {
  this.disposer = reaction(
    () => this.store.selectedId,
    (selectedId) => {
      if (selectedId) {
        this.store.loadDetails(selectedId);
      }
    }
  );
}

componentWillUnmount() {
  this.disposer();
}
```

### Selective Updates

Use more granular observables to prevent unnecessary re-renders:

```javascript
// Instead of one large observable object
@observable state = {
  data: [],
  selectedId: null,
  isLoading: false,
  error: null,
  filters: { /* ... */ }
};

// Use separate observables
@observable data = [];
@observable selectedId = null;
@observable isLoading = false;
@observable error = null;
@observable filters = { /* ... */ };
```

## Related Documentation

- [Architecture](../ARCHITECTURE.md) - For more details on the overall architecture
- [Components](../COMPONENTS.md) - For details on how components use stores
- [API Integration](./API-INTEGRATION.md) - For information on API integration
- [Performance](../PERFORMANCE.md) - For more performance optimization techniques