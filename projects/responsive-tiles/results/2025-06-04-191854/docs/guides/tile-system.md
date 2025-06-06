# Tile System Guide

## Overview

The Responsive Tiles framework provides a modular, component-based architecture for building dynamic financial widgets (tiles) that can be arranged and displayed in various layouts. This guide explains the core concepts, implementation patterns, and best practices for working with the tile system.

## Core Concepts

### Tiles

Tiles are self-contained, reusable components that display specific financial information or functionality. Each tile:

- Is implemented as a React component
- Has its own state management via MobX
- Can be rendered independently or as part of a collection
- Supports responsive layouts for different screen sizes
- Follows consistent UI/UX patterns

### Tile Architecture

Each tile follows a standard structure:

```
/components/tiles/[TileName]/
     index.js          # Main entry point and exports
     routes.js         # Route definitions for this tile
     [Component].js    # Individual component files
     ...               # Other related components
```

## Tile Implementation

### Component Structure

Tiles are implemented as React components with the following pattern:

```jsx
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import TileHeader from '../../common/TileHeader';
// Other imports...

const styles = theme => ({
  root: {
    // Base styling
  },
  // Other style definitions
});

@withStyles(styles)
@observer
class MyTile extends Component {
  componentDidMount() {
    // Initialization logic
  }

  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.root}>
        <TileHeader title="My Tile" />
        {/* Tile content */}
      </div>
    );
  }
}

export default MyTile;
```

### Store Integration

Each tile has a corresponding store for state management:

```jsx
// /stores/myTileStore/index.js
import { observable, action, computed } from 'mobx';

class MyTileStore {
  @observable data = [];
  @observable isLoading = false;
  
  @action
  fetchData = async () => {
    this.isLoading = true;
    try {
      // API call logic
    } catch (error) {
      // Error handling
    } finally {
      this.isLoading = false;
    }
  };
  
  @computed
  get processedData() {
    // Data processing logic
    return this.data;
  }
}

export default new MyTileStore();
```

### Routing

Tile routes are defined in a dedicated routes.js file:

```jsx
// /components/tiles/MyTile/routes.js
import MyTile from './index';
import MyTileDetails from './Details';

export default [
  {
    path: '/my-tile',
    component: MyTile
  },
  {
    path: '/my-tile/:id',
    component: MyTileDetails
  }
];
```

These routes are then aggregated in the main routes.js file.

## Common Tile Patterns

### Card Layout

Most tiles use a card-based layout to provide a consistent UI:

```jsx
<Card className={classes.card}>
  <TileHeader title="Tile Title" />
  <CardContent>
    {/* Tile content */}
  </CardContent>
  <CardActions>
    {/* Action buttons */}
  </CardActions>
</Card>
```

### Empty States

Tiles should handle empty states gracefully:

```jsx
render() {
  const { data, isLoading } = this.props.store;
  
  if (isLoading) {
    return <SpinnerPanel />;
  }
  
  if (!data.length) {
    return <EmptyState message="No data available" />;
  }
  
  return (
    // Normal content rendering
  );
}
```

### Responsive Design

Tiles should adapt to different screen sizes:

```jsx
const styles = theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      // Mobile styling
    },
    [theme.breakpoints.up('md')]: {
      // Desktop styling
    }
  }
});
```

## Creating a New Tile

Follow these steps to create a new tile:

1. **Create the directory structure**:
   ```
   /components/tiles/NewTile/
        index.js
        routes.js
        [Other components]
   ```

2. **Implement the store**:
   ```
   /stores/newTileStore/
        index.js
        [Other store files]
   ```

3. **Register the routes** in the main routes.js file

4. **Add API integration** if needed:
   ```
   /api/newTileData.js
   ```

5. **Implement tests** for your tile components

## Best Practices

1. **Keep tiles focused** - Each tile should serve a specific purpose
2. **Maintain consistent styling** - Follow the design system guidelines
3. **Handle loading and error states** - Provide clear feedback to users
4. **Implement proper data fetching** - Use the API layer for data access
5. **Optimize performance** - Minimize re-renders and use memoization where appropriate
6. **Test thoroughly** - Write unit and integration tests for all tile functionality

## Examples

### Account Tile

The Accounts tile demonstrates many of the patterns described in this guide. It provides:

- A card-based layout
- Responsive design for different screen sizes
- Empty state handling
- Integration with the accounts API
- Data visualization with charts
- Drill-down navigation to account details

See `/components/tiles/Accounts` for implementation details.

### Budget Tile

The Budgets tile shows how to implement:

- Data visualization with progress indicators
- Form-based interactions for creating/editing budgets
- Filtering and sorting of budget items
- Integration with tags system
- Transaction display within a budget context

See `/components/tiles/Budgets` for implementation details.

## Related Documentation

- [Component System](../components.html)
- [State Management](./state-management.html)
- [API Integration](./api-integration.html)
- [Container Layout](../container-layout.html)