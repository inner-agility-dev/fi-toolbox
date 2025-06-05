# Initialization Methods

This document covers the initialization methods of the Responsive Tiles system, detailing how the application bootstraps in different modes.

## MobX Configuration

The first step in the initialization process is configuring MobX for state management:

```javascript
configure({
  enforceActions             : 'never',
  computedRequiresReaction   : false,
  reactionRequiresObservable : false,
  observableRequiresReaction : false
})
```

This configuration sets up MobX with a permissive mode that doesn't enforce strict action usage or reactions.

## Global Object Setup

```javascript
const geezeo = global.geezeo = global.geezeo || {}

geezeo._api = api
geezeo._partnerConfig = {}
geezeo.VERSION    = process.env.VERSION
geezeo.BUILD_USER = process.env.BUILD_USER
geezeo.BUILD_DATE = process.env.BUILD_DATE
geezeo.USER_ID    = -1
geezeo._stores    = stores
geezeo._fetch     = _fetch
```

The global `geezeo` object is created or referenced if it already exists. It serves as the primary API surface for the entire application.

## The `geezeo.init()` Method

The `init()` method is the main entry point for the Responsive Tiles system:

```javascript
geezeo.init = () => {
  // configure analytics
  configureAnalytics({
    trackingId : process.env.GA_TRACKING_ID,
    appName    : 'Responsive Tiles',
    appVersion : process.env.VERSION,
    dimensions : {
      [DIMENSIONS.ENVIRONMENT]: process.env.DEPLOY_FOLDER
    }
  })

  // fix for ios iframe input focus issue
  document.addEventListener('touchend', () => { window.focus() })

  if (window.geezeoConfig) {
    initApp()  // Full application initialization
  } else {
    initTiles() // Embedded tiles initialization
  }
  sendTiming('tiles', 'initialized')
}
```

This method:
1. Configures analytics
2. Sets up an iOS iframe focus fix
3. Detects which initialization mode to use
4. Calls the appropriate initialization function
5. Sends a timing metric for initialization

## Full Application Mode: `initApp()`

```mermaid
flowchart TD
    InitApp[initApp()] --> ParseParams[Parse Query Parameters]
    ParseParams --> SetDefaultValues[Set Default Values]
    SetDefaultValues --> SetAuth[Set Authentication]
    SetAuth --> LoadConfigs[Load Configurations]
    LoadConfigs --> MergeConfigs[Merge Configurations]
    MergeConfigs --> SetInitialRoute[Set Initial Route]
    SetInitialRoute --> RenderApp[Render App Component]
    RenderApp --> TrackLogin[Track Login]
```

The `initApp()` function initializes the application in full mode:

```javascript
const initApp = () => {
  const { geezeoConfig } = global
  const search = global.location.search && global.location.search.substring(1)

  geezeo.onJwtExpired = geezeoConfig.auth?.onJwtExpired

  const params = new URLSearchParams(search)
  
  // Set default values
  geezeoConfig.navigationMode = 'menu'
  geezeoConfig.showAdvancedSearch = true
  
  // Parse query parameters
  if (params.get('nav') === 'false') {
    geezeoConfig.navigationMode = 'hidden'
  }
  if (params.get('modal') === 'true') {
    geezeoConfig.navigationMode = 'modal'
  }
  // ... more parameter parsing ...

  const { contextStore, usersStore } = stores

  // Set authentication
  setAuth(geezeoConfig.auth)

  // Callback function to run after configs are loaded
  const callback = () => {
    // Merge configurations
    // Render app
    // Track login
  }
  
  // Load configurations and user data
  Promise.all([
    getPartnerConfig(),
    usersStore.loadInformationalMessages(),
    usersStore.loadCurrentUser()
  ]).then(callback, callback)
}
```

## Embedded Tiles Mode: `initTiles()`

```mermaid
flowchart TD
    InitTiles[initTiles()] --> SetupEvents[Setup Event Emitter]
    SetupEvents --> SetupReadyQueue[Setup Ready Event Queue]
    SetupReadyQueue --> DefineReadyHandler[Define Ready Handler]
    DefineReadyHandler --> ProcessQueue[Process Queued Events]
    ProcessQueue --> ReplaceReadyFunc[Replace Ready Function]
```

The `initTiles()` function initializes the system for embedded tile usage:

```javascript
const initTiles = () => {
  // add event emitter
  const events = new EventEmitter()
  geezeo.on = events.on
  geezeo.emit = events.emit

  // add ready event listeners array
  geezeo._e = geezeo._e || []
  geezeo.ready = geezeo.ready || function (f) {
    geezeo._e.push(f)
  }

  // ... define readyHandler function ...

  // process ready event listeners
  (geezeo._e || []).forEach(args => {
    if (isFunction(args)) {
      readyHandler(args)
    } else {
      readyHandler.apply(null, args)
    }
  })
  
  // delete event listeners
  delete geezeo._e
  
  // replace ready function with handler
  geezeo.ready = readyHandler
}
```

## The Ready Handler

The ready handler is a key function in embedded tiles mode:

```javascript
const readyHandler = (callbackOrOpts, callback) => {
  let opts
  if (isFunction(callbackOrOpts)) {
    callback = callbackOrOpts
  } else {
    opts = callbackOrOpts
  }
  
  if (opts?.onJwtExpired) {
    geezeo.onJwtExpired = opts.onJwtExpired
  }
  
  const userChanged = hasUserChanged(opts)
  if (userChanged) {
    // Reset stores if user has changed
  }
  
  const renderDelay = userChanged ? (opts?.renderDelay || 100) : 0
  setTimeout(() => {
    if (opts?.auth) {
      setAuth(opts.auth)
    }
    
    // Load configurations
    Promise.all([
      getPartnerConfig(),
      usersStore.loadInformationalMessages()
    ]).then(callback, callback)
  }, renderDelay)
}
```

This handler:
1. Processes different parameter patterns
2. Sets JWT expiration handlers
3. Detects user changes
4. Applies a render delay when users change
5. Sets authentication
6. Loads configurations before calling the callback

## Auto-Initialization

After defining all methods, the system auto-initializes:

```javascript
// Register and initialize now that the methods are defined.
geezeo.tiles.register({
  routeMapping: {
    createAccounts: '/accounts',
    // ... other mappings ...
  },
  getRoutes,
  stores
})

geezeo.init()
```

This final sequence:
1. Registers all available tiles with their routes
2. Calls the `init()` method to start the bootstrap process 
