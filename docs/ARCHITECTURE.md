# FI-Toolbox Architecture Documentation

## Overview

The **fi-toolbox** (Financial Institution Toolbox) is a comprehensive project management and orchestration system for Banno projects. It provides a unified CLI interface for managing the complete software development lifecycle, from initial research through production maintenance.

## Core Architecture Principles

1. **Project Lifecycle Management**: Enforces structured progression through well-defined stages
2. **SCRUM Methodology**: Mandatory SCRUM practices with stage-appropriate configurations
3. **Multi-Account Git Workflows**: Seamless synchronization between R&D and production repositories
4. **AI-Powered Orchestration**: Integration with MCP for intelligent project management
5. **Documentation-Driven Development**: Documentation requirements at each stage

## System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         Developer Interface                       │
│                    (IDE / Terminal / Claude Code)                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                          fitb CLI                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Commands   │  │   Claude    │  │   Project Lifecycle     │ │
│  │  sync-repos  │  │ Integration │  │     Management          │ │
│  │   gh-auth    │  │   Layer     │  │  (7 Stage Process)      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
         ┌────────────┼────────────┬─────────────────┐
         │            │            │                 │
┌────────▼────┐ ┌─────▼─────┐ ┌───▼──────┐ ┌───────▼────────┐
│   Local     │ │orchestr8r-│ │Document  │ │   PostgreSQL   │
│    Git      │ │    mcp    │ │Snapshot  │ │   Database     │
│ Management  │ │           │ │  Tool    │ │                │
└─────────────┘ └───────────┘ └──────────┘ └────────────────┘
         │            │                              │
         │            └──────────┬───────────────────┘
         │                       │
┌────────▼───────────────────────▼────────────────────────────────┐
│                         External Systems                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │  GitHub API     │  │  GitHub Projects │  │  AI Models     │  │
│  │ (GraphQL)       │  │    (SCRUM)       │  │   (Claude)     │  │
│  └─────────────────┘  └─────────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Project Lifecycle Architecture

The fi-toolbox enforces a 7-stage project lifecycle:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     PRE_     │────▶│  REGISTERING │────▶│  REGISTERED  │
│   REGISTER   │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                                                   │
                                                   ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     RND      │────▶│     PRD      │────▶│    SDLC      │────▶│ MAINTENANCE  │
│  (3-day)     │     │  (1-week)    │     │  (2-week)    │     │  (Kanban)    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

Each stage has specific:
- **Sprint Configuration**: Duration and ceremony requirements
- **Documentation Requirements**: Mandatory documents at each stage
- **GitHub Project Setup**: Stage-specific project boards
- **Artifact Storage**: Organized in `artifacts/{project}/{stage}/`

### Directory Structure

```
fi-toolbox/
├── .claude/                      # Claude-specific configurations
│   └── claude_update/
│       └── commands/            # Custom Claude commands
│           ├── index.json       # Command registry
│           ├── sync-repos.js    # Git synchronization (being migrated)
│           └── gh-auth.js       # GitHub auth switching
│
├── src/                         # Source code (TypeScript/Oclif)
│   ├── commands/               # CLI commands
│   │   ├── sync/              # Sync-related commands
│   │   ├── project/           # Project management commands
│   │   └── gh/                # GitHub-related commands
│   ├── lib/                   # Shared libraries
│   │   ├── git/              # Git operations
│   │   ├── github/           # GitHub API clients
│   │   └── utils/            # Utility functions
│   └── types/                # TypeScript type definitions
│
├── artifacts/                  # Project lifecycle artifacts
│   └── {project-name}/
│       ├── 1-PRE_REGISTER/
│       ├── 2-REGISTERING/
│       ├── 3-REGISTERED/
│       ├── 4-RND/
│       ├── 5-PRD/
│       ├── 6-SDLC/
│       └── 7-MAINTENANCE/
│
├── projects/                   # Active project workspaces
│   └── {project-name}/
│       ├── tools/            # Project-specific tools
│       ├── config/           # Project configuration
│       └── results/          # Generated artifacts
│
├── prompts/                   # Stage-specific prompts
│   └── projects/
│       └── {project-name}/
│           └── {stage}/
│
├── orchestr8r-mcp/           # Symlinked MCP server
└── docs/                     # Documentation
    ├── ARCHITECTURE.md       # This file
    ├── architecture/         # Detailed architecture docs
    └── diagrams/            # Architecture diagrams
```

## Core Components

### 1. CLI Command System (Oclif-based)

The CLI provides a structured interface for all fi-toolbox operations:

```typescript
// Command structure
fitb <namespace> <command> [options]

// Examples:
fitb sync repos --forward
fitb project create --name "new-project" --stage RND
fitb gh auth switch --context prod
```

### 2. Git Synchronization System

Manages complex multi-repository workflows:

```
┌─────────────────────┐       ┌─────────────────────┐
│  inner-agility-dev  │ ◀────▶│     fi-toolbox      │
│    (lenny-miller)   │ sync  │      (local)        │
│   Branch: main-rnd  │       │                     │
└─────────────────────┘       └─────────────────────┘
                                        │
                                        │ sync
                                        ▼
                              ┌─────────────────────┐
                              │    lennylmiller     │
                              │    (production)     │
                              │  Branch: main-prod  │
                              └─────────────────────┘
```

Key features:
- Bidirectional synchronization
- Protected branch handling
- Configurable merge/rebase strategies
- Multi-account authentication management

### 3. Project Lifecycle Manager

Enforces progression through stages with validation:

```typescript
interface ProjectStage {
  name: string;
  sprintDuration: string;
  ceremonies: string[];
  requiredDocs: string[];
  githubProjectTemplate: string;
}

// Stage transitions require:
// 1. Completion of required documentation
// 2. GitHub Project creation
// 3. Approval workflow
```

### 4. orchestr8r-mcp Integration

Provides AI-powered project orchestration:

```
┌────────────────┐     ┌─────────────────┐     ┌──────────────┐
│   fitb CLI     │────▶│ orchestr8r-mcp  │────▶│ GitHub API   │
│                │     │  (MCP Server)   │     │  (GraphQL)   │
└────────────────┘     └─────────────────┘     └──────────────┘
        │                       │
        │                       ▼
        │              ┌─────────────────┐
        └─────────────▶│   AI Clients    │
                       │ (Claude, etc.)  │
                       └─────────────────┘
```

Features:
- 29 GitHub Projects v2 tools
- Automated workflow scripts
- AI-driven task management
- GraphQL-first API approach

### 5. Documentation Management

Cross-project documentation system:

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────┐
│ Source Project  │────▶│ Snapshot Tool    │────▶│  Versioned    │
│    (docs/)      │     │                  │     │  Snapshots    │
└─────────────────┘     └──────────────────┘     └───────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │ Collection Mgmt  │
                        │  (dev/prod)      │
                        └──────────────────┘
```

## Integration Architecture

### 1. Database Schema

PostgreSQL database with JSON schema-driven operations:

```sql
-- Core tables
projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  current_stage VARCHAR(50),
  github_project_id VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

project_artifacts (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  stage VARCHAR(50),
  artifact_type VARCHAR(100),
  content JSONB,
  created_at TIMESTAMP
)

sync_history (
  id UUID PRIMARY KEY,
  source_repo VARCHAR(255),
  target_repo VARCHAR(255),
  sync_type VARCHAR(50),
  status VARCHAR(50),
  details JSONB,
  created_at TIMESTAMP
)
```

### 2. Authentication Architecture

Multi-account GitHub authentication:

```
┌──────────────────┐
│  fitb gh auth    │
│    switch        │
└────────┬─────────┘
         │
    ┌────▼────┐
    │ Context │
    │ Manager │
    └────┬────┘
         │
   ┌─────┴──────┬──────────────┐
   │            │              │
┌──▼───┐  ┌────▼────┐  ┌──────▼──────┐
│ R&D  │  │  PROD   │  │   Custom    │
│ Auth │  │  Auth   │  │   Configs   │
└──────┘  └─────────┘  └─────────────┘
```

### 3. Command Execution Flow

```
User Input → CLI Parser → Command Handler → Service Layer → External APIs
     │            │              │               │              │
     │            │              │               │              ▼
     │            │              │               │         Response
     │            │              │               ▼              │
     │            │              │          Database            │
     │            │              ▼              │              │
     │            │         Validation          │              │
     │            ▼              │              ▼              │
     │        Arguments          └──────────Results────────────┘
     │            │                             │
     └────────────┴─────────────────────────────┘
```

## Security Architecture

### 1. Authentication & Authorization

- **Multi-factor authentication**: Required for production operations
- **Role-based access control**: Stage-specific permissions
- **Token management**: Secure storage and rotation
- **Audit logging**: All operations tracked

### 2. Git Security

- **Protected branches**: Automated protection rules
- **Signed commits**: GPG signing for production
- **Pre-commit hooks**: Security scanning
- **Secret scanning**: Prevent credential leaks

## Performance Considerations

### 1. Caching Strategy

- **Git object caching**: Reduce network calls
- **API response caching**: 15-minute TTL
- **Documentation snapshots**: Incremental updates
- **Database query optimization**: Indexed lookups

### 2. Concurrency

- **Parallel Git operations**: When safe
- **Async command execution**: Non-blocking CLI
- **Queue-based processing**: For bulk operations
- **Connection pooling**: Database and API clients

## Extensibility

### 1. Plugin Architecture

```typescript
interface FitbPlugin {
  name: string;
  version: string;
  commands: Command[];
  hooks: {
    preCommand?: Hook;
    postCommand?: Hook;
    init?: Hook;
  };
}
```

### 2. Custom Commands

- **Command templates**: Scaffolding for new commands
- **Service injection**: Dependency management
- **Event system**: Command lifecycle hooks
- **Configuration**: Per-command settings

## Future Architecture Plans

### 1. Dynamic File Watcher

Automatic command deployment to registered projects:

```
File Change → Watcher → Validation → Deployment → Notification
     │           │          │            │             │
     └───────────┴──────────┴────────────┴─────────────┘
                        Event Stream
```

### 2. Enhanced Promotion System

One-shot testing and validation for stage transitions:

```
RND → Validation Suite → PRD → Integration Tests → SDLC
           │                          │
           └──────────────────────────┘
                 Promotion Engine
```

### 3. Advanced IDE Integration

- **Workspace awareness**: Project context detection
- **Inline documentation**: Context-sensitive help
- **Command palette**: Quick command access
- **Status indicators**: Real-time project status

## Conclusion

The fi-toolbox architecture provides a robust foundation for managing complex software projects with enforced SCRUM methodology, multi-account Git workflows, and AI-powered orchestration. Its modular design allows for extensibility while maintaining consistency across all Banno projects.