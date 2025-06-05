# FI-Toolbox Architecture Documentation

This directory contains comprehensive architecture documentation for the fi-toolbox project. The documentation is organized to support both AGENT-1's migration work and ongoing development.

## Documentation Structure

### Core Architecture
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Main architecture document covering system overview, components, and design principles

### Detailed Documentation
- **[sync-repos-migration-guide.md](sync-repos-migration-guide.md)** - Comprehensive guide for migrating sync-repos.js to TypeScript/Oclif (critical for AGENT-1)
- **[orchestr8r-mcp-integration.md](orchestr8r-mcp-integration.md)** - Integration architecture with orchestr8r-mcp MCP server
- **[cli-command-structure.md](cli-command-structure.md)** - Complete CLI command taxonomy and specifications

### Architecture Diagrams
- **[system-architecture.puml](../diagrams/system-architecture.puml)** - High-level system architecture
- **[project-lifecycle.puml](../diagrams/project-lifecycle.puml)** - Project lifecycle state machine
- **[git-sync-workflow.puml](../diagrams/git-sync-workflow.puml)** - Git synchronization sequence diagram
- **[mcp-integration.puml](../diagrams/mcp-integration.puml)** - orchestr8r-mcp integration architecture

## Quick Reference

### System Components
1. **CLI Layer** - Oclif-based command interface
2. **Service Layer** - Business logic and integrations
3. **Data Layer** - PostgreSQL with JSON schemas
4. **Integration Layer** - orchestr8r-mcp and Git operations

### Key Workflows
1. **Repository Sync** - Bidirectional sync between R&D and production
2. **Project Lifecycle** - 7-stage progression with SCRUM enforcement
3. **Task Management** - GitHub Projects integration via MCP
4. **Documentation Snapshots** - Cross-project documentation management

### Integration Points
- **orchestr8r-mcp** - 29 GitHub Projects v2 tools via MCP
- **GitHub API** - GraphQL-first approach
- **Git Operations** - Multi-account, multi-branch workflows
- **AI Models** - Claude and other AI integrations

## For AGENT-1: Migration Priority

The sync-repos.js migration is critical. Key files:
1. [sync-repos-migration-guide.md](sync-repos-migration-guide.md) - Your primary reference
2. Current implementation: `.claude/claude_update/commands/sync-repos.js`
3. Target structure: `src/commands/sync/repos.ts`

### Migration Checklist
- [ ] Implement Oclif command class
- [ ] Create GitService for operations
- [ ] Add TypeScript types
- [ ] Implement error handling
- [ ] Add comprehensive tests
- [ ] Maintain backward compatibility

## For Developers

### Adding New Commands
1. Follow the structure in [cli-command-structure.md](cli-command-structure.md)
2. Implement service layer separation
3. Add to command hierarchy
4. Update documentation

### Extending Architecture
1. Document integration points
2. Add PlantUML diagrams
3. Update this README
4. Follow established patterns

## Architecture Principles

1. **Separation of Concerns** - CLI, Service, Data layers
2. **Type Safety** - TypeScript throughout
3. **Testability** - Dependency injection, mocking
4. **Extensibility** - Plugin architecture ready
5. **Performance** - Caching, connection pooling
6. **Security** - Multi-account auth, audit trails

## Related Documentation

- Project root [CLAUDE.md](../../CLAUDE.md) - AI assistant instructions
- [orchestr8r-mcp README](../../orchestr8r-mcp/README.md) - MCP server documentation
- Parent repository docs - Additional context

## Viewing Diagrams

The PlantUML diagrams can be viewed using:
1. PlantUML VS Code extension
2. Online PlantUML viewer
3. Generate images: `plantuml docs/diagrams/*.puml`

## Questions or Updates?

This documentation supports the parallel agent development session. For coordination:
- Check the sync gist for updates
- Follow the established file boundaries
- Maintain documentation as you code