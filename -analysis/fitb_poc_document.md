# FI-Toolbox CLI Proof of Concept (POC-1)
## Documentation-Driven Development with Mandatory SCRUM

### **Core Theory**
If you have a complete set of documentation for a given project, as long as it is in sync with source code, you could create projects by using the appropriate documentation as context. When documents reference the code and are kept in sync, a "complete document set" can drive systematic project generation and management.

### **Vision Statement**
The FI-Toolbox CLI (`fitb`) creates a **Documentation-Driven Development (DDD) engine** with **mandatory SCRUM orchestration** that transforms how Banno manages project lifecycles. Every project gets consistent documentation, SCRUM practices, and automated workflows based on mature, parameterized prompts.

---

## **System Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FI-TOOLBOX DEVELOPER WORKFLOW                │
└─────────────────────────────────────────────────────────────────┘

DEVELOPMENT PHASE:
/fi-toolbox/prompts/projects/responsive-tiles/development/
├── new-analysis-command.md           ← Working on new prompt
├── enhanced-migration-pattern.md     ← Improving existing  
└── experimental-triage-flow.md       ← Testing new ideas

TEST & ITERATE:
$ fitb test-prompt development/new-analysis-command.md --project responsive-tiles
$ fitb validate-output --compare-with-existing

MANUAL PROMOTION (when satisfied):
Developer manually copies/moves:
FROM: /fi-toolbox/prompts/projects/responsive-tiles/development/new-analysis-command.md  
TO:   /fi-toolbox/artifacts/responsive-tiles/.claude/commands/analysis.md

┌─────────────────────────────────────────────────────────────────┐
│                       PROJECT REGISTRATION                      │
└─────────────────────────────────────────────────────────────────┘

REGISTRATION DEPLOYMENT:
$ fitb register responsive-tiles

Copies FROM: /fi-toolbox/artifacts/responsive-tiles/.claude/commands/
TO:           /responsive-tiles/.claude/commands/
```

---

## **Core Principles**

### **1. SCRUM-First Development**
**Every project registered with fitb MUST have:**
- A GitHub Project for SCRUM management
- Sprint iterations configured
- Standard SCRUM ceremonies
- Stage-appropriate customizations

### **2. Documentation as Source of Truth (SOTD)**
Complete 360-degree documentation sets that include:
- PRDs (Product Requirements Documents)
- RND (Research & Development) docs
- SDLC (Software Development Lifecycle) plans
- MAINTENANCE procedures
- All supporting artifacts

### **3. Parameterized Prompt Architecture**
Mature, reusable prompts that can be customized for specific scenarios:
- MIGRATION-PATTERN (e.g., Polymer → Lit)
- FIRE-FIGHTER-TRIAGE (Production issues)
- UI-COMPONENT-ENHANCEMENT (Feature additions)
- MAINTENANCE-WORKFLOW (Ongoing support)

---

## **Directory Structure**

```
/fi-toolbox/
├── prompts/projects/{project}/
│   ├── development/                 ← Developer workbench
│   │   ├── new-analysis.md
│   │   ├── enhanced-migration.md
│   │   └── experimental-triage.md
│   └── production/                  ← Manual promotion target
│       ├── analysis.md              ← Tested & verified
│       ├── migration.md
│       └── triage.md
├── artifacts/{project}/
│   ├── 1-PRE_REGISTER/
│   ├── 2-REGISTERING/
│   ├── 3-REGISTERED/
│   ├── 4-RND/
│   ├── 5-PRD/
│   ├── 6-SDLC/
│   ├── 7-MAINTENANCE/
│   └── .claude/commands/            ← Registration source
│       ├── analysis.md              ← Final deployment-ready
│       ├── migration.md
│       ├── triage.md
│       └── sprint.md
└── .claude/commands/                ← Central command templates
    ├── prime.md
    ├── init-parallel.md
    └── exe-parallel.md

/responsive-tiles/                   ← Target project
├── .fitb-registered                 ← Registration marker
└── .claude/commands/                ← Deployed project commands
    ├── analysis.md                  ← Parameterized for this project
    ├── migration.md
    ├── triage.md
    └── sprint.md
```

---

## **Lifecycle Stages & SCRUM Configuration**

### **Stage Progression**
```
RND (Research & Development) - DEFAULT
 ↓ Discovery sprints, experiments, POCs
PRD (Product Requirements Definition)
 ↓ Design sprints, user stories, specifications  
SDLC (Software Development Lifecycle)
 ↓ Development sprints, implementation, testing
MAINTENANCE
   Support sprints, bug fixes, optimizations
```

### **SCRUM Adaptations by Stage**

#### **RND Stage SCRUM**
- **Sprint Length**: 1 week (rapid experimentation)
- **Ceremonies**: Daily standups, weekly demos
- **Metrics**: Experiments completed, learnings documented
- **Fields**: Research Question, Hypothesis, Findings
- **Definition of Done**: Findings documented, decision made

#### **PRD Stage SCRUM**
- **Sprint Length**: 2 weeks (design iteration)
- **Ceremonies**: Story mapping, design reviews
- **Metrics**: Stories defined, mockups approved
- **Fields**: User Story, Acceptance Criteria, Priority
- **Definition of Done**: Stakeholder approval, specs complete

#### **SDLC Stage SCRUM**
- **Sprint Length**: 2 weeks (standard development)
- **Ceremonies**: Sprint planning, retrospectives
- **Metrics**: Velocity, burndown, coverage
- **Fields**: Story Points, Component, PR Link
- **Definition of Done**: Code reviewed, tests passing, deployed

#### **MAINTENANCE Stage SCRUM**
- **Sprint Length**: 1 week (rapid response)
- **Ceremonies**: Incident reviews, priority triage
- **Metrics**: MTTR, SLA compliance, incidents resolved
- **Fields**: Severity, Customer Impact, Root Cause
- **Definition of Done**: Fix deployed, monitoring confirmed

---

## **POC Use Case: Eyeball Icon Password Toggle**

### **Scenario**
Developer receives ticket: *"Add eyeball icon to password input component. When pressed, reveals password and icon changes to crossed-out eyeball."*

### **Expected Workflow**

```bash
# Developer analyzes the ticket
$ fitb analyze-ticket "eyeball icon password input toggle"

🔍 Analyzing ticket scope...
✅ Scope: MAINTENANCE (small feature enhancement)
📋 Suggested SCRUM: 1-week sprint
🎯 Pattern Match: UI-COMPONENT-ENHANCEMENT

📊 Generated Documents from SOTD:
├── 4-RND/component-analysis.md
├── 5-PRD/feature-specification.md  
├── 6-SDLC/implementation-plan.md
└── 7-MAINTENANCE/testing-checklist.md

🚀 GitHub Project Created: "Password Toggle Enhancement"
📋 Sprint Backlog (5 tasks):
  #1 Research: Icon accessibility standards
  #2 Design: Icon states and interactions  
  #3 Implement: Toggle functionality
  #4 Test: Cross-browser compatibility
  #5 Deploy: Feature flag rollout

Ready to start your sprint! 🎯
```

---

## **Development → Production Flow**

### **Phase 1: Development**
FI-Toolbox developer works in the development directory:

```bash
/fi-toolbox/prompts/projects/responsive-tiles/development/
├── password-toggle-analysis.md      ← New prompt being developed
├── accessibility-requirements.md    ← Refinement of existing
└── testing-strategy.md              ← Experimental approach
```

### **Phase 2: Testing & Validation**
```bash
$ fitb test-prompt development/password-toggle-analysis.md --project responsive-tiles
$ fitb validate-output --compare-with-existing
$ fitb review-generated-artifacts --show-diff
```

### **Phase 3: Manual Promotion**
When satisfied with results, developer manually promotes:

```bash
# Manual file operation (or structured promotion command)
cp prompts/projects/responsive-tiles/development/password-toggle-analysis.md \
   artifacts/responsive-tiles/.claude/commands/ui-analysis.md
```

### **Phase 4: Registration Deployment**
```bash
$ fitb register responsive-tiles
# Copies from artifacts to project with parameterization
```

---

## **Project Registration Process**

### **Command: `fitb register responsive-tiles`**

```bash
$ fitb register responsive-tiles

🔍 Scanning project directory...
✨ Project detected: responsive-tiles
📍 Location: /Users/LenMiller/code/banno/responsive-tiles
🔧 Type: [Auto-detected: JavaScript/React]

📋 Project Registration & SCRUM Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏃 Creating GitHub Project for SCRUM management...
✅ GitHub Project created: "responsive-tiles - Development"

📊 Select Development Stage (determines SCRUM configuration):
❯ 1. RND (Research & Development) - DEFAULT
  2. PRD (Product Requirements) - Have clear requirements
  3. SDLC (Software Development) - Ready to build
  4. MAINTENANCE - Existing production system

> 1 [ENTER for default]

✅ Configuring RND-stage SCRUM:
  • Sprint length: 1 week
  • Fields: Research Question, Hypothesis, Findings, Status
  • Labels: experiment, spike, research, learning
  • First sprint: "RND Sprint 1 - Discovery"

🚀 Initialize Project Features
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select features to enable:
[x] Slash commands (/sprint, /standup, /retro)
[x] RND documentation templates
[x] Daily standup automation
[x] Sprint velocity tracking
[ ] CI/CD pipeline (can add later)

Press <space> to toggle, <enter> to confirm

✅ Features initialized!

📝 Creating First SCRUM Artifacts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Would you like to create your first research question? (Y/n): Y

Enter research question: How can we make tiles responsive across all screen sizes?

✅ Created issue #1: "Research: How can we make tiles responsive across all screen sizes?"
✅ Added to Sprint 1 backlog
✅ Set as current sprint goal

🎯 Your SCRUM Board is Ready!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GitHub Project: https://github.com/users/lennylmiller/projects/10
Current Sprint: RND Sprint 1 (ends in 7 days)
Sprint Goal: Research responsive tile implementation

Quick Commands:
- /standup - Run daily standup
- /sprint status - View sprint progress  
- /add research - Add research question
- /findings - Document findings

Ready to start your RND sprint! 🚀
```

### **Generated Project Structure**
```bash
/responsive-tiles/
├── .fitb-registered                 ← Registration marker
│   {
│     "project": "responsive-tiles",
│     "stage": "RND", 
│     "registered_at": "2025-05-29T18:30:00Z",
│     "github_project_id": "PVT_kwHOABCD...",
│     "last_command_sync": "2025-05-29T18:30:00Z"
│   }
└── .claude/commands/                ← Deployed & parameterized commands
    ├── analysis.md                  ← From artifacts, parameterized
    ├── migration.md                 ← Project-specific migration patterns
    ├── triage.md                    ← Fire-fighter workflows
    ├── sprint.md                    ← SCRUM ceremony automation
    └── research.md                  ← RND-specific workflows
```

---

## **Parameterized Prompt Architecture**

### **Template Structure**
```markdown
# {{COMMAND_NAME}} Command Template
Project: {{PROJECT_NAME}}
Path: {{PROJECT_PATH}}
Stage: {{PROJECT_STAGE}}
Framework: {{PROJECT_FRAMEWORK}}

## Context
Analyze the {{PROJECT_NAME}} codebase for {{ANALYSIS_TYPE}}.

Current project details:
- Location: {{PROJECT_PATH}}
- Stage: {{PROJECT_STAGE}}
- Framework: {{PROJECT_FRAMEWORK}}
- SCRUM Sprint: {{CURRENT_SPRINT}}

## Analysis Pattern: {{PATTERN_TYPE}}
{{PATTERN_SPECIFIC_INSTRUCTIONS}}

## Expected Outputs
- {{OUTPUT_TYPE_1}}
- {{OUTPUT_TYPE_2}}
- {{OUTPUT_TYPE_3}}
```

### **Parameterization During Registration**
```javascript
const parameterizeCommand = (template, projectConfig) => {
  return template
    .replace(/{{PROJECT_NAME}}/g, projectConfig.name)
    .replace(/{{PROJECT_PATH}}/g, projectConfig.path)
    .replace(/{{PROJECT_STAGE}}/g, projectConfig.stage)
    .replace(/{{PROJECT_FRAMEWORK}}/g, projectConfig.framework)
    .replace(/{{CURRENT_SPRINT}}/g, projectConfig.currentSprint);
};
```

---

## **Pattern Recognition System**

### **Core Patterns**

#### **1. MIGRATION-PATTERN**
```javascript
const MIGRATION_PATTERN = {
  name: "MIGRATION-PATTERN",
  trigger: ["migrate", "convert", "polymer", "lit", "upgrade"],
  parameters: {
    source_framework: "polymer",
    target_framework: "lit",
    component_count: "auto-detect",
    migration_strategy: "incremental"
  },
  generates: [
    "migration-analysis.md",
    "component-mapping.md", 
    "risk-assessment.md",
    "rollback-plan.md"
  ],
  scrum_config: {
    sprint_length: 14,
    story_points_factor: 2.5,
    definition_of_done: "Component migrated, tests passing, documentation updated"
  }
};
```

#### **2. FIRE-FIGHTER-TRIAGE**
```javascript
const FIRE_FIGHTER_TRIAGE = {
  name: "FIRE-FIGHTER-TRIAGE",
  trigger: ["urgent", "production", "down", "critical", "incident"],
  parameters: {
    severity: "auto-detect",
    impact_scope: "user-facing|internal|partial",
    response_time: "immediate"
  },
  generates: [
    "incident-analysis.md",
    "immediate-response.md",
    "investigation-checklist.md", 
    "communication-plan.md"
  ],
  scrum_config: {
    sprint_length: 3,
    priority: "P0",
    ceremonies: ["daily-triage", "incident-retro"]
  }
};
```

#### **3. UI-COMPONENT-ENHANCEMENT**
```javascript
const UI_COMPONENT_ENHANCEMENT = {
  name: "UI-COMPONENT-ENHANCEMENT",
  trigger: ["icon", "button", "input", "component", "ui", "ux"],
  parameters: {
    component_type: "input|button|icon|form",
    enhancement_type: "accessibility|functionality|styling",
    framework: "react|vue|angular",
    testing_scope: "unit|integration|e2e"
  },
  generates: [
    "component-analysis.md",
    "accessibility-requirements.md",
    "implementation-checklist.md",
    "testing-strategy.md"
  ],
  scrum_config: {
    sprint_length: 7,
    story_points: 3,
    definition_of_done: "Component updated, tests passing, accessibility verified"
  }
};
```

---

## **Integration with orchestr8r-mcp**

### **Architecture: fitb as SCRUM Orchestrator**

```typescript
// fitb leverages orchestr8r-mcp for GitHub Project operations
class ScrumManager {
  constructor(private orchestr8r: Orchestr8rClient) {}
  
  async setupProjectScrum(project: Project, stage: Stage) {
    // Create GitHub Project via orchestr8r
    const githubProject = await this.orchestr8r.createProject({
      title: `${project.name} - ${stage}`,
      readme: this.getStageReadme(stage)
    });
    
    // Configure stage-specific SCRUM fields
    await this.setupStageFields(githubProject.id, stage);
    
    // Create first sprint
    await this.createFirstSprint(githubProject.id, stage);
    
    // Set up automation
    await this.enableScrumAutomation(githubProject.id);
  }
  
  private async setupStageFields(projectId: string, stage: Stage) {
    const stageFields = STAGE_SCRUM_CONFIG[stage].fields;
    
    for (const field of stageFields) {
      await this.orchestr8r.createProjectField({
        projectId,
        name: field.name,
        dataType: field.type,
        options: field.options
      });
    }
  }
}
```

---

## **Slash Commands for SCRUM**

Generated commands adapt to the project's stage:

### **RND Stage Commands**
```bash
/research "What's the best approach for responsive design?"  # Creates research question
/experiment start "CSS Grid vs Flexbox comparison"          # Start experiment
/findings "CSS Grid provides better responsive control"     # Document findings
/decision pivot "Moving to CSS Grid implementation"         # Record decision
```

### **PRD Stage Commands**
```bash
/story "As a user, I want responsive tiles"                # Create user story
/criteria "Tiles adapt to screen sizes 320px to 4K"       # Add acceptance criteria  
/design request "Need mockups for tablet view"            # Request design work
/approve design "Tablet mockups v3"                       # Approve designs
```

### **SDLC Stage Commands**
```bash
/task "Implement responsive grid container"                # Create dev task
/points 5                                                 # Estimate story points
/pr https://github.com/org/repo/pull/123                # Link pull request
/done                                                     # Mark task complete
```

### **MAINTENANCE Stage Commands**
```bash
/bug "Tiles overlap on iPhone SE"                        # Report bug
/severity high                                           # Set severity
/investigate                                             # Start investigation
/fix "Applied min-width constraint"                      # Document fix
```

---

## **CLI Commands Specification**

### **Registration & Management**
```bash
# Project registration
fitb register <project-name> [--stage=RND|PRD|SDLC|MAINTENANCE] [--auto]
fitb unregister <project-name> [--cleanup]
fitb list-registered [--show-sync-status]

# Project analysis
fitb analyze-ticket "<ticket-description>" [--project=<n>]
fitb analyze-pattern "<description>" [--suggest-scrum]
fitb status <project-name> [--verbose]
```

### **Development Workflow**
```bash
# Prompt development
fitb develop --project <n> --stage <stage>
fitb develop list --project <n>
fitb develop status --all

# Testing & validation  
fitb test-prompt <prompt-path> --project <n> [--dry-run]
fitb validate-output --compare-with-existing
fitb review-generated-artifacts --show-diff
```

### **SCRUM Management**
```bash
# SCRUM operations
fitb create-scrum --pattern <pattern-name> [--project=<n>]
fitb sprint status [--project=<n>]
fitb sprint create [--goal="<goal>"] [--duration=<days>]
fitb standup [--project=<n>]
fitb retro [--project=<n>]
```

### **File Watcher & Sync**
```bash
# Watcher management
fitb watch start [--config <config-file>]
fitb watch stop
fitb watch restart  
fitb watch status [--verbose]

# Manual sync
fitb sync-commands [--project=<n>] [--all]
fitb deploy-artifacts --from-development --project <n>
```

---

## **File Watcher Architecture**

### **Central Commands Deployment Engine**
```javascript
class CommandDeploymentEngine {
  async deployToRegisteredProjects(changedFilePath) {
    const projects = await this.getRegisteredProjects();
    const relativePath = path.relative('fi-toolbox/.claude/commands', changedFilePath);
    
    for (const project of projects) {
      await this.deployToProject(project, relativePath, changedFilePath);
    }
  }

  async getRegisteredProjects() {
    // Scan /Users/LenMiller/code/banno/ for projects with .fitb-registered marker
    const bannoDir = '/Users/LenMiller/code/banno';
    const projects = [];
    
    const dirs = await fs.readdir(bannoDir);
    for (const dir of dirs) {
      const projectPath = path.join(bannoDir, dir);
      const markerPath = path.join(projectPath, '.fitb-registered');
      
      if (await fs.pathExists(markerPath)) {
        const config = await fs.readJson(markerPath);
        projects.push({
          name: dir,
          path: projectPath,
          stage: config.currentStage,
          lastSync: config.lastCommandSync
        });
      }
    }
    
    return projects;
  }
}
```

---

## **Success Metrics & KPIs**

### **Adoption Metrics**
- **100% SCRUM Coverage**: All registered projects have GitHub Projects
- **Documentation Completeness**: All projects have stage-appropriate SOTD
- **Command Utilization**: Slash command usage per project/week
- **Pattern Recognition**: Accuracy of automatic pattern matching

### **Efficiency Metrics**
- **Time to Project Setup**: Registration to first sprint start
- **Documentation Generation Speed**: SOTD creation time
- **SCRUM Ceremony Participation**: Standup/retro attendance rates
- **Developer Velocity**: Story points completed per sprint

### **Quality Metrics**
- **Documentation Freshness**: Last updated timestamps
- **Command Accuracy**: Generated vs manual command effectiveness
- **Sprint Health**: Velocity trends, completion rates
- **Pattern Evolution**: Prompt refinement success rate

---

## **POC Implementation Roadmap**

### **Phase 1: Core Foundation (Weeks 1-2)**
- [ ] Create basic fitb CLI skeleton
- [ ] Implement project registration with .fitb-registered markers
- [ ] Build SOTD generation from templates
- [ ] Set up artifact directory structure

### **Phase 2: Pattern Engine (Weeks 3-4)**
- [ ] Implement pattern recognition for common scenarios
- [ ] Create parameterized prompt system
- [ ] Build template → deployment pipeline
- [ ] Test with eyeball icon scenario

### **Phase 3: SCRUM Integration (Weeks 5-6)**
- [ ] Integrate orchestr8r-mcp for GitHub Projects
- [ ] Implement stage-specific SCRUM configurations
- [ ] Create slash command generation system
- [ ] Add sprint automation features

### **Phase 4: File Watcher & Sync (Weeks 7-8)**
- [ ] Build central command deployment engine
- [ ] Implement development → production promotion
- [ ] Add manual promotion workflows
- [ ] Create sync validation system

### **Phase 5: Validation & Refinement (Weeks 9-10)**
- [ ] End-to-end testing with responsive-tiles
- [ ] Developer experience optimization
- [ ] Performance tuning and error handling
- [ ] Documentation and training materials

---

## **Key Differentiators**

1. **SCRUM is Mandatory**: No project without proper SCRUM setup
2. **Documentation-Driven**: SOTD generates everything, not the reverse
3. **Pattern Evolution**: System learns and improves over time
4. **Stage-Aware Automation**: Different stages get different treatment
5. **IDE Integration**: Seamless developer experience with slash commands
6. **Central Management**: One source of truth for all organizational patterns

---

## **Risk Mitigation**

### **Technical Risks**
- **Pattern Recognition Accuracy**: Start with explicit pattern triggers, evolve to NLP
- **Documentation Staleness**: Implement automatic freshness checks and warnings
- **Command Parameterization Errors**: Extensive validation and rollback capabilities

### **Adoption Risks**
- **Developer Resistance**: Start with opt-in projects, show clear value
- **SCRUM Overhead**: Automate ceremonies to reduce manual effort
- **Learning Curve**: Provide guided tutorials and templates

### **Operational Risks**
- **Central Point of Failure**: Distributed backups and recovery procedures
- **Prompt Quality**: Continuous refinement and peer review processes
- **GitHub API Limits**: Rate limiting and queueing strategies

---

## **Conclusion**

This POC establishes FI-Toolbox as a revolutionary approach to project management that enforces consistency while enabling rapid, high-quality development. By making documentation the source of truth and SCRUM mandatory, every Banno project gets enterprise-grade project management with minimal overhead.

The system evolves through use - each project teaches it better patterns, each refinement improves the next deployment. Within months, this becomes the organizational knowledge engine that captures and distributes best practices automatically.

**Next Action**: Begin Phase 1 implementation with the responsive-tiles project as the initial test case.