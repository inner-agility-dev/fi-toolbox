# Responsive Tiles Architecture Overview

This document provides a high-level overview of the Responsive Tiles application architecture.

## Component Architecture

The Responsive Tiles project is a React-based application that provides modular, embeddable UI components (tiles) for financial data visualization and management.

```mermaid
flowchart TB
    User[User/Browser] --> App[App Component]
    App --> Router[Router]
    
    Router --> Tiles[Tiles]
    Router --> Common[Common Components]
    
    Tiles --> Accounts[Accounts Tile]
    Tiles --> Budget[Budget Tile]
    Tiles --> Cashflow[Cashflow Tile]
    Tiles --> Goals[Goals Tile]
    Tiles --> Spending[Spending Tile]
    Tiles --> Transactions[Transactions Tile]
    Tiles --> NetWorth[Net Worth Tile]
    Tiles --> Dashboard[Dashboard Tile]
    
    Common --> Forms[Form Components]
    Common --> Charts[Chart Components]
    Common --> UI[UI Components]
    
    subgraph API
        APIClient[API Client]
    end
    
    subgraph State
        Stores[MobX Stores]
    end
    
    Tiles --- State
    Tiles --- API
    Common --- State
    Common --- API
```

## State Management

The application uses MobX for state management with a store-based approach where each domain area has its own dedicated store.

```mermaid
flowchart LR
    Components[React Components] -- Observe --> Stores[MobX Stores]
    Components -- Actions --> Stores
    
    Stores -- API Calls --> Backend[Backend Services]
    
    Stores --> AccountsStore[Accounts Store]
    Stores --> TransactionsStore[Transactions Store]
    Stores --> BudgetsStore[Budgets Store]
    Stores --> SpendingStore[Spending Store]
    Stores --> GoalsStore[Goals Store]
    Stores --> ContextStore[Context Store]
    Stores --> UsersStore[Users Store]
```

## Data Flow

The application follows a unidirectional data flow pattern using MobX:

```mermaid
flowchart LR
    User[User] -- Action --> Component[Component]
    Component -- Dispatch --> Store[MobX Store]
    Store -- API Call --> API[API Client]
    API -- Response --> Store
    Store -- Updates --> Component
    Component -- Render --> UI[UI]
```

## Tile System Architecture

Responsive Tiles allows for embedding individual "tiles" into various pages:

```mermaid
flowchart TB
    Container[Host Container] --> TileA[Transaction Tile]
    Container --> TileB[Accounts Tile]
    Container --> TileC[Budget Tile]
    
    TileA --- TileContext[Tile Context]
    TileB --- TileContext
    TileC --- TileContext
    
    TileContext --- StoreA[Isolated Stores]
    
    TileContext -- Events --> EventBus[Event Bus]
    
    subgraph "Embedded Tile Architecture"
        TileA
        TileB
        TileC
        TileContext
        StoreA
        EventBus
    end
```

## Deployment Architecture

The application is deployed through a CI/CD pipeline to different GCP environments:

```mermaid
flowchart LR
    Dev[Developer] -- Commit --> GitHub[GitHub]
    GitHub -- CI/CD Pipeline --> Build[Build Process]
    Build --> Test[Tests]
    Test --> Package[Package]
    
    Package --> DevDeploy[Dev Deployment]
    DevDeploy --> StageDeploy[Stage Deployment]
    StageDeploy --> ProdDeploy[Production Deployment]
    
    DevDeploy --> DevBucket[GCP Dev Bucket]
    StageDeploy --> StageBucket[GCP Stage Bucket]
    ProdDeploy --> ProdBucket[GCP Prod Bucket]
    
    DevBucket -- Serves --> DevUsers[Dev Users]
    StageBucket -- Serves --> StageUsers[Testing Users]
    ProdBucket -- Serves --> ProdUsers[End Users]
```

## Component Structure

The project organizes components into reusable common components and feature-specific tile components:

```mermaid
classDiagram
    class App {
        +render()
    }
    
    class Tile {
        +render()
    }
    
    class CommonComponents {
        +Charts
        +Forms
        +UI
    }
    
    class TileComponents {
        +Accounts
        +Transactions
        +Budgets
        +NetWorth
        +Spending
        +Goals
    }
    
    App --> Tile
    Tile --> CommonComponents
    Tile --> TileComponents
    
    class MobXStores {
        +accountsStore
        +budgetsStore
        +transactionsStore
        +spendingStore
        +goalsStore
        +contextStore
    }
    
    TileComponents --> MobXStores
```

## Technology Stack

The application is built using the following technologies:

- **React**: UI component library
- **MobX**: State management
- **Material UI**: UI framework
- **D3.js**: Data visualization
- **Webpack**: Module bundler
- **Babel**: JavaScript compiler
- **Jest/Cypress**: Testing
- **GitHub Actions**: CI/CD pipeline
- **Google Cloud Platform**: Hosting 
