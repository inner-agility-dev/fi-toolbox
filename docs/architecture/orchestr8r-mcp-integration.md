# orchestr8r-mcp Integration Architecture

## Overview

The orchestr8r-mcp integration is a critical component of fi-toolbox, providing AI-powered GitHub Projects management through the Model Context Protocol (MCP). This document details how fi-toolbox integrates with orchestr8r-mcp for comprehensive project orchestration.

## Integration Architecture

### 1. Physical Integration

orchestr8r-mcp is integrated as a symlinked directory within fi-toolbox:

```
fi-toolbox/
├── orchestr8r-mcp/     # Symlink to ../orchestr8r-mcp
│   ├── src/
│   ├── tests/
│   └── package.json
```

This approach provides:
- Shared codebase without duplication
- Independent versioning and deployment
- Easy development and testing
- Seamless updates across projects

### 2. Communication Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  fi-toolbox │────▶│ MCP Client   │────▶│orchestr8r-mcp│
│     CLI     │     │  Interface   │     │  MCP Server  │
└─────────────┘     └──────────────┘     └──────────────┘
                           │                      │
                           │  MCP Protocol        │
                           │  (JSON-RPC)          │
                           └──────────────────────┘
```

### 3. Integration Points

#### A. Project Lifecycle Management

fi-toolbox uses orchestr8r-mcp for GitHub Project operations during stage transitions:

```typescript
// Creating a project for RND stage
interface ProjectCreation {
  stage: 'RND' | 'PRD' | 'SDLC'
  template: string
  fields: {
    sprint_duration: '3 days' | '1 week' | '2 weeks'
    ceremonies: string[]
    status_columns: string[]
  }
}
```

#### B. Task Management Integration

```typescript
// fi-toolbox command
fitb task create --project-id <id> --title "Task" --stage RND

// Translates to orchestr8r-mcp calls:
1. mcp__orchestr8r-mcp__add-draft-issue
2. mcp__orchestr8r-mcp__update-project-item-field (set stage)
3. mcp__orchestr8r-mcp__update-project-item-field (set sprint)
```

#### C. Sprint Automation

fi-toolbox leverages orchestr8r-mcp's automation scripts:

```typescript
// Morning standup integration
fitb sprint standup
  → orchestr8r-mcp/src/scripts/morning-standup.ts
  → GitHub Projects API
  → Formatted standup report

// Task completion flow
fitb task complete <task-id>
  → orchestr8r-mcp/src/scripts/complete-task.ts
  → Updates GitHub Project item
  → Triggers next task selection
```

## MCP Tool Mapping

### 1. Project Operations

| fi-toolbox Command | orchestr8r-mcp Tool | Purpose |
|-------------------|---------------------|---------|
| `fitb project create` | `create-project` | Create new GitHub Project |
| `fitb project list` | `list-projects` | List all projects |
| `fitb project status` | `get-project` | Get project details |
| `fitb project archive` | `update-project` | Archive/close project |

### 2. Task Operations

| fi-toolbox Command | orchestr8r-mcp Tool | Purpose |
|-------------------|---------------------|---------|
| `fitb task create` | `add-draft-issue` | Create draft task |
| `fitb task assign` | `update-project-item-field` | Assign to developer |
| `fitb task move` | `update-project-item-field` | Change status column |
| `fitb task complete` | `bulk-update-project-item-field` | Mark as done |

### 3. Sprint Operations

| fi-toolbox Command | orchestr8r-mcp Tool | Purpose |
|-------------------|---------------------|---------|
| `fitb sprint start` | `create-project-field` | Create sprint iteration |
| `fitb sprint plan` | `add-item-to-project` | Add tasks to sprint |
| `fitb sprint close` | `update-project-status` | Close sprint |

## Data Flow Architecture

### 1. Command Execution Flow

```
User Input
    │
    ▼
fitb CLI Parser
    │
    ▼
Command Handler
    │
    ├─── Local Operations ────────▶ PostgreSQL
    │                                    │
    └─── GitHub Operations              │
              │                          │
              ▼                          │
         MCP Client ◀────────────────────┘
              │
              ▼
      orchestr8r-mcp Server
              │
              ▼
        GitHub GraphQL API
```

### 2. State Synchronization

fi-toolbox maintains local state synchronized with GitHub:

```typescript
interface SyncStrategy {
  // Local cache for performance
  localCache: {
    projects: Map<string, Project>
    tasks: Map<string, Task>
    ttl: number // Cache TTL in seconds
  }
  
  // Sync triggers
  syncOn: [
    'command_execution',
    'cache_expiry',
    'webhook_event',
    'manual_refresh'
  ]
  
  // Conflict resolution
  conflictResolution: 'github_wins' | 'local_wins' | 'merge'
}
```

## Authentication Integration

### 1. Shared Authentication

fi-toolbox and orchestr8r-mcp share GitHub authentication:

```typescript
// fi-toolbox gh-auth command sets context
fitb gh auth switch --context prod

// orchestr8r-mcp uses the same token
process.env.GITHUB_TOKEN // Set by fi-toolbox
```

### 2. Multi-Account Support

```
┌──────────────┐     ┌──────────────┐
│ R&D Context  │     │ Prod Context │
│ lenny-miller │     │ lennylmiller │
└──────┬───────┘     └──────┬───────┘
       │                     │
       └──────────┬──────────┘
                  ▼
            Auth Manager
                  │
                  ▼
          orchestr8r-mcp
```

## Advanced Integration Features

### 1. Batch Operations

fi-toolbox optimizes GitHub API calls through orchestr8r-mcp:

```typescript
// Single fi-toolbox command
fitb sprint close --project-id <id>

// Triggers batch operations
1. Get all sprint items
2. Bulk update statuses
3. Create retrospective
4. Archive completed items
5. Generate reports
```

### 2. Event-Driven Architecture

```typescript
interface EventFlow {
  source: 'fi-toolbox' | 'orchestr8r-mcp' | 'github_webhook'
  event: {
    type: 'project.created' | 'task.updated' | 'sprint.closed'
    payload: any
  }
  handlers: [
    'update_local_db',
    'notify_team',
    'trigger_automation',
    'update_metrics'
  ]
}
```

### 3. AI-Enhanced Operations

fi-toolbox leverages orchestr8r-mcp's AI capabilities:

```typescript
// Natural language task creation
fitb task create --ai "Create a task for implementing user authentication"
  → AI processes request
  → Generates structured task
  → Creates GitHub issue with proper fields

// Smart task assignment
fitb task assign --smart
  → Analyzes developer workload
  → Considers skills and availability
  → Assigns optimally
```

## Performance Optimizations

### 1. Connection Pooling

```typescript
interface ConnectionPool {
  mcp: {
    maxConnections: 10
    idleTimeout: 60000
    keepAlive: true
  }
  github: {
    concurrent: 5
    rateLimit: 5000 // per hour
    retry: 3
  }
}
```

### 2. Caching Strategy

```typescript
interface CacheLayer {
  levels: [
    'memory',     // In-process cache
    'postgresql', // Database cache
    'mcp_server'  // orchestr8r-mcp cache
  ]
  invalidation: 'ttl' | 'event' | 'manual'
}
```

## Error Handling

### 1. Graceful Degradation

```typescript
try {
  // Try orchestr8r-mcp operation
  await mcpClient.call('create-project', params)
} catch (error) {
  if (error.code === 'MCP_UNAVAILABLE') {
    // Fallback to direct GitHub API
    await githubClient.createProject(params)
  }
  // Log for later sync
  await logPendingOperation(params)
}
```

### 2. Retry Mechanism

```typescript
interface RetryConfig {
  maxAttempts: 3
  backoff: 'exponential'
  initialDelay: 1000
  maxDelay: 30000
  retryableErrors: [
    'NETWORK_ERROR',
    'RATE_LIMIT',
    'TIMEOUT'
  ]
}
```

## Security Considerations

### 1. Token Management

- Tokens never stored in fi-toolbox code
- orchestr8r-mcp handles token refresh
- Scoped permissions per operation

### 2. Audit Trail

```typescript
interface AuditLog {
  operation: string
  user: string
  timestamp: Date
  mcpTool: string
  parameters: any
  result: 'success' | 'failure'
  githubRequestId: string
}
```

## Future Integration Plans

### 1. Bi-directional Sync

- Real-time updates from GitHub to fi-toolbox
- WebSocket integration for live updates
- Conflict-free replicated data types (CRDTs)

### 2. Enhanced AI Features

- Predictive task estimation
- Automated sprint planning
- Intelligent task dependencies

### 3. Plugin Architecture

```typescript
interface FitbMcpPlugin {
  name: string
  mcpTools: string[]
  commands: Command[]
  hooks: {
    beforeMcpCall?: Hook
    afterMcpCall?: Hook
    onError?: ErrorHook
  }
}
```

## Integration Testing

### 1. Test Scenarios

- Project creation through full lifecycle
- Multi-user task management
- Sprint automation workflows
- Error recovery and retries

### 2. Mock MCP Server

```typescript
class MockMcpServer {
  tools = new Map<string, MockTool>()
  
  register(toolName: string, handler: Function) {
    this.tools.set(toolName, { name: toolName, handler })
  }
  
  async call(toolName: string, params: any) {
    const tool = this.tools.get(toolName)
    return tool?.handler(params)
  }
}
```

## Troubleshooting Guide

### Common Integration Issues

1. **MCP Connection Failed**
   - Check orchestr8r-mcp server is running
   - Verify MCP configuration in fi-toolbox
   - Check network connectivity

2. **GitHub API Rate Limits**
   - Monitor rate limit headers
   - Implement request queuing
   - Use webhook updates where possible

3. **State Synchronization Issues**
   - Clear local cache
   - Force refresh from GitHub
   - Check for conflicting operations

## Conclusion

The orchestr8r-mcp integration provides fi-toolbox with powerful GitHub Projects management capabilities while maintaining separation of concerns and modularity. This architecture enables rapid development of project management features while leveraging the full power of AI-driven orchestration.