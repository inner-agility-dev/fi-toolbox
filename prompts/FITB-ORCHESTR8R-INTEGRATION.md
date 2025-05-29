# FI-Toolbox & Orchestr8r Integration Architecture

## Core Concept: SCRUM-First IDE Integration

fitb acts as the high-level orchestrator that makes SCRUM mandatory and seamless, while orchestr8r-mcp provides the low-level GitHub Project management capabilities.

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              IDE / Developer                     │
│                    ↓                             │
│            fitb CLI (Global)                     │
│         "SCRUM-First Orchestrator"               │
├─────────────────────────────────────────────────┤
│  • Enforces SCRUM for every project             │
│  • Manages lifecycle stages (RND→PRD→SDLC→MAINT)│
│  • Generates stage-specific slash commands       │
│  • Provides IDE-integrated workflows            │
└─────────────────┬───────────────────────────────┘
                  │ Uses
                  ↓
┌─────────────────────────────────────────────────┐
│          orchestr8r-mcp (MCP Server)            │
│      "GitHub Project Management Engine"          │
├─────────────────────────────────────────────────┤
│  • 29 GitHub Project operations                 │
│  • GraphQL API interactions                     │
│  • Sprint automation scripts                    │
│  • Confidence scoring engine                    │
└─────────────────────────────────────────────────┘
```

## Integration Pattern

### 1. fitb as MCP Client

```typescript
// fitb-cli/src/integrations/orchestr8r-client.ts
import { MCPClient } from '@modelcontextprotocol/sdk';

export class Orchestr8rClient {
  private client: MCPClient;
  
  constructor() {
    this.client = new MCPClient({
      name: 'fitb-cli',
      version: '1.0.0'
    });
  }
  
  async connect() {
    await this.client.connect({
      command: 'bun',
      args: ['/Users/LenMiller/code/banno/orchestr8r-mcp/build/index.js'],
      env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN,
        GITHUB_OWNER: process.env.GITHUB_OWNER
      }
    });
  }
  
  // Wrap orchestr8r tools with fitb business logic
  async createScrumProject(projectName: string, stage: Stage) {
    // Create GitHub Project
    const project = await this.client.callTool('create-project', {
      ownerId: await this.getOwnerId(),
      title: `${projectName} - ${stage} (SCRUM)`,
      repositoryId: await this.findRepository(projectName)
    });
    
    // Set up SCRUM fields based on stage
    await this.setupStageFields(project.id, stage);
    
    // Create first sprint
    await this.createSprint(project.id, stage);
    
    return project;
  }
}
```

### 2. Stage-Specific SCRUM Setup

```typescript
// fitb-cli/src/scrum/stage-manager.ts
export class StageManager {
  constructor(private orchestr8r: Orchestr8rClient) {}
  
  async setupRNDScrum(projectId: string) {
    // Research-specific fields
    await this.orchestr8r.callTool('create-project-field', {
      projectId,
      dataType: 'TEXT',
      name: 'Research Question'
    });
    
    await this.orchestr8r.callTool('create-project-field', {
      projectId,
      dataType: 'SINGLE_SELECT',
      name: 'Experiment Status',
      singleSelectOptions: [
        { name: 'Planning', color: 'GRAY', description: 'Designing experiment' },
        { name: 'Running', color: 'BLUE', description: 'Experiment in progress' },
        { name: 'Analyzing', color: 'YELLOW', description: 'Processing results' },
        { name: 'Complete', color: 'GREEN', description: 'Findings documented' }
      ]
    });
    
    // Create RND sprint iteration
    await this.orchestr8r.callTool('create-project-field', {
      projectId,
      dataType: 'ITERATION',
      name: 'Sprint',
      iterationConfiguration: {
        duration: 7, // 1 week for RND
        startDate: new Date().toISOString(),
        iterations: [
          { title: 'RND Sprint 1', duration: 7, startDate: new Date().toISOString() }
        ]
      }
    });
  }
  
  async transitionStage(projectId: string, fromStage: Stage, toStage: Stage) {
    // Archive old stage fields
    const fields = await this.orchestr8r.callTool('get-project-fields', { id: projectId });
    
    // Add new stage fields
    await this.setupStageFields(projectId, toStage);
    
    // Create transition sprint
    await this.orchestr8r.callTool('add-draft-issue', {
      projectId,
      title: `Transition: ${fromStage} → ${toStage}`,
      body: `Project transitioning from ${fromStage} to ${toStage} stage`,
      assigneeIds: []
    });
  }
}
```

### 3. Slash Command Generation

```typescript
// fitb-cli/src/commands/slash-command-generator.ts
export class SlashCommandGenerator {
  generateForStage(stage: Stage, projectId: string): SlashCommand[] {
    const baseCommands = [
      {
        name: 'standup',
        script: `orchestr8r-cli morning-standup --project-id=${projectId}`
      },
      {
        name: 'sprint',
        subcommands: {
          'status': `orchestr8r-cli sprint-status --project-id=${projectId}`,
          'plan': `orchestr8r-cli sprint-planning --project-id=${projectId}`,
          'close': `orchestr8r-cli sprint-close --project-id=${projectId}`
        }
      }
    ];
    
    const stageCommands = {
      RND: [
        {
          name: 'research',
          script: `fitb-cli create-research-question --project-id=${projectId}`
        },
        {
          name: 'experiment',
          script: `fitb-cli manage-experiment --project-id=${projectId}`
        },
        {
          name: 'findings',
          script: `fitb-cli document-findings --project-id=${projectId}`
        }
      ],
      PRD: [
        {
          name: 'story',
          script: `fitb-cli create-user-story --project-id=${projectId}`
        },
        {
          name: 'design',
          script: `fitb-cli manage-design --project-id=${projectId}`
        }
      ],
      SDLC: [
        {
          name: 'task',
          script: `fitb-cli create-dev-task --project-id=${projectId}`
        },
        {
          name: 'pr',
          script: `fitb-cli link-pr --project-id=${projectId}`
        }
      ],
      MAINTENANCE: [
        {
          name: 'bug',
          script: `fitb-cli report-bug --project-id=${projectId}`
        },
        {
          name: 'incident',
          script: `fitb-cli manage-incident --project-id=${projectId}`
        }
      ]
    };
    
    return [...baseCommands, ...stageCommands[stage]];
  }
}
```

### 4. IDE Integration Points

```typescript
// fitb-cli/src/ide/workspace-integration.ts
export class WorkspaceIntegration {
  async registerProject(projectPath: string) {
    const project = await this.detectProject(projectPath);
    
    // 1. Create GitHub Project via orchestr8r
    const githubProject = await this.orchestr8r.createScrumProject(
      project.name,
      Stage.RND // Default to RND
    );
    
    // 2. Generate .fitb directory structure
    await this.createFitbDirectory(projectPath, {
      projectId: githubProject.id,
      stage: Stage.RND
    });
    
    // 3. Generate slash commands
    const commands = this.commandGenerator.generateForStage(Stage.RND, githubProject.id);
    await this.installSlashCommands(projectPath, commands);
    
    // 4. Update shell configuration
    await this.updateShellConfig(projectPath);
    
    // 5. Create first sprint artifacts
    await this.createFirstSprint(githubProject.id);
  }
  
  private async createFitbDirectory(projectPath: string, config: ProjectConfig) {
    const structure = {
      '.fitb/': {
        'config.yaml': this.generateConfig(config),
        'commands/': {
          'scrum/': '# SCRUM commands',
          'stage/': '# Stage-specific commands'
        },
        'templates/': {
          'rnd/': '# RND templates',
          'prd/': '# PRD templates',
          'sdlc/': '# SDLC templates',
          'maintenance/': '# Maintenance templates'
        },
        'hooks/': {
          'pre-sprint/': '# Pre-sprint hooks',
          'post-sprint/': '# Post-sprint hooks'
        }
      }
    };
    
    await this.createStructure(projectPath, structure);
  }
}
```

## Key Integration Features

### 1. Automatic SCRUM Enforcement
```typescript
// Every project registration MUST create GitHub Project
if (!githubProjectId) {
  throw new Error('SCRUM is mandatory - GitHub Project creation failed');
}
```

### 2. Stage Transitions
```typescript
// fitb manages lifecycle transitions
await fitb.transitionStage('responsive-tiles', 'RND', 'PRD');
// This updates GitHub Project fields, creates transition sprint, archives old items
```

### 3. Unified Commands
```bash
# fitb wraps orchestr8r functionality
/standup              # → orchestr8r morning-standup
/sprint status        # → orchestr8r sprint metrics
/research "question"  # → fitb creates issue with RND template → orchestr8r
```

### 4. Context Awareness
```typescript
// fitb knows current directory context
cd /path/to/responsive-tiles
/task "Implement feature"  # fitb knows project ID from .fitb/config.yaml
```

## Migration Path: fitb → orchestr8r

As fitb features mature, they migrate to orchestr8r as plugins:

```typescript
// Future: orchestr8r-mcp/src/plugins/fitb-plugin.ts
export class FitbPlugin implements MCPPlugin {
  name = 'fitb-features';
  
  tools = [
    {
      name: 'setup-scrum-project',
      description: 'Set up SCRUM project with stage configuration',
      schema: SetupScrumProjectSchema,
      handler: async (params) => {
        // Migrated fitb logic
      }
    }
  ];
}
```

## Benefits of This Architecture

1. **Separation of Concerns**
   - fitb: High-level workflow orchestration
   - orchestr8r: Low-level GitHub API operations

2. **SCRUM Enforcement**
   - No project without GitHub Project
   - Stage-appropriate configurations
   - Automated ceremonies

3. **IDE Integration**
   - Slash commands in terminal
   - Project context awareness
   - Seamless workflow

4. **Future Proof**
   - Clean migration path
   - Plugin architecture
   - Composable features

## Example Workflow

```bash
# Developer starts new project
$ cd ~/code/new-project
$ fitb add .

# fitb automatically:
# 1. Detects project type
# 2. Creates GitHub Project via orchestr8r
# 3. Sets up RND SCRUM configuration
# 4. Generates slash commands
# 5. Creates first sprint

# Developer uses integrated commands
$ /research "How to implement feature X?"
$ /experiment start "Approach A vs B"
$ /standup
$ /findings "Approach A is 2x faster"
$ /decision ship "Moving forward with Approach A"

# Transition to next stage
$ fitb stage PRD
# Updates GitHub Project fields, creates PRD sprint
```

This architecture ensures every project has proper SCRUM management while providing a seamless developer experience through IDE integration. 