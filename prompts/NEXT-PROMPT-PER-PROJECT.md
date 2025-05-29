# FI-Toolbox CLI Design Document

## Overview
FI-Toolbox (fitb) is an enterprise-grade CLI tool for managing Banno project registrations with mandatory SCRUM methodology. Each project progresses through lifecycle stages (RND → PRD → SDLC → MAINTENANCE) while maintaining consistent SCRUM practices.

## Core Principle: SCRUM-First Development

**Every project registered with fitb MUST have:**
1. A GitHub Project for SCRUM management
2. Sprint iterations configured
3. Standard SCRUM ceremonies
4. Stage-appropriate customizations

## Architecture Principles

### CLI Design Standards (Enterprise-Grade)
1. **SCRUM by Default**: Every project gets GitHub Project with SCRUM setup
2. **Stage-Aware SCRUM**: Adapt SCRUM practices to lifecycle stage
3. **Interactive Mode**: Guided experiences for complex operations
4. **Non-Interactive Mode**: Full automation support with flags
5. **Progressive Disclosure**: Show only relevant options based on context
6. **Idempotent Operations**: Safe to run multiple times
7. **Clear Feedback**: Spinners, progress bars, and status messages

## Lifecycle Stages Within SCRUM

### Default Stage: RND (Research & Development)
**Why RND as default?** Most projects start with exploration and discovery. Even "maintenance" projects often begin with investigating the issue.

### Stage Progression
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

### SCRUM Adaptations by Stage

#### RND Stage SCRUM
- **Sprint Length**: 1 week (rapid experimentation)
- **Ceremonies**: Daily standups, weekly demos
- **Metrics**: Experiments completed, learnings documented
- **Fields**: Research Question, Hypothesis, Findings
- **Definition of Done**: Findings documented, decision made

#### PRD Stage SCRUM  
- **Sprint Length**: 2 weeks (design iteration)
- **Ceremonies**: Story mapping, design reviews
- **Metrics**: Stories defined, mockups approved
- **Fields**: User Story, Acceptance Criteria, Priority
- **Definition of Done**: Stakeholder approval, specs complete

#### SDLC Stage SCRUM
- **Sprint Length**: 2 weeks (standard development)
- **Ceremonies**: Sprint planning, retrospectives
- **Metrics**: Velocity, burndown, coverage
- **Fields**: Story Points, Component, PR Link
- **Definition of Done**: Code reviewed, tests passing, deployed

#### MAINTENANCE Stage SCRUM
- **Sprint Length**: 1 week (rapid response)
- **Ceremonies**: Incident reviews, priority triage
- **Metrics**: MTTR, SLA compliance, incidents resolved
- **Fields**: Severity, Customer Impact, Root Cause
- **Definition of Done**: Fix deployed, monitoring confirmed

## Registration Flow with Mandatory SCRUM

### Command: `fitb add .`

```bash
$ fitb add .

🔍 Scanning project directory...
✨ New project detected: responsive-tiles

📋 Project Registration & SCRUM Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project Name: responsive-tiles
Location: /Users/LenMiller/code/banno/responsive-tiles
Type: [Auto-detected: JavaScript/React]

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

## Non-Interactive Mode with SCRUM Defaults

```bash
# Create with all defaults (RND stage, 1-week sprints)
$ fitb add . --auto

# Specify stage explicitly
$ fitb add . --stage=SDLC --sprint-length=2w

# Full configuration
$ fitb add . \
  --stage=PRD \
  --sprint-length=2w \
  --github-project-name="Responsive Tiles - Design" \
  --first-sprint-goal="Define tile component specifications"
```

## Integration with orchestr8r-mcp

### Architecture: fitb as SCRUM Orchestrator

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

## SCRUM Configuration by Stage

```typescript
const STAGE_SCRUM_CONFIG = {
  RND: {
    sprintLength: 7,  // days
    defaultFields: [
      { name: 'Research Question', type: 'TEXT' },
      { name: 'Hypothesis', type: 'TEXT' },
      { name: 'Experiment Status', type: 'SINGLE_SELECT', 
        options: ['Planning', 'Running', 'Analyzing', 'Complete'] },
      { name: 'Findings', type: 'TEXT' },
      { name: 'Decision', type: 'SINGLE_SELECT',
        options: ['Continue', 'Pivot', 'Stop', 'Ship'] }
    ],
    ceremonies: ['daily-standup', 'weekly-demo', 'findings-review'],
    metrics: ['experiments-completed', 'decisions-made', 'learnings-documented']
  },
  
  PRD: {
    sprintLength: 14,
    defaultFields: [
      { name: 'Story Type', type: 'SINGLE_SELECT',
        options: ['User Story', 'Technical Story', 'Spike'] },
      { name: 'Acceptance Criteria', type: 'TEXT' },
      { name: 'Design Status', type: 'SINGLE_SELECT',
        options: ['Needs Design', 'In Design', 'Approved', 'Changes Requested'] },
      { name: 'Priority', type: 'SINGLE_SELECT',
        options: ['Must Have', 'Should Have', 'Nice to Have'] }
    ],
    ceremonies: ['sprint-planning', 'backlog-grooming', 'design-review', 'retro'],
    metrics: ['stories-defined', 'designs-approved', 'requirements-stability']
  },
  
  SDLC: {
    sprintLength: 14,
    defaultFields: [
      { name: 'Story Points', type: 'NUMBER' },
      { name: 'Component', type: 'SINGLE_SELECT',
        options: ['Frontend', 'Backend', 'API', 'Database', 'DevOps'] },
      { name: 'PR Link', type: 'TEXT' },
      { name: 'Test Coverage', type: 'NUMBER' }
    ],
    ceremonies: ['sprint-planning', 'daily-standup', 'sprint-review', 'retro'],
    metrics: ['velocity', 'burndown', 'code-coverage', 'cycle-time']
  },
  
  MAINTENANCE: {
    sprintLength: 7,
    defaultFields: [
      { name: 'Issue Type', type: 'SINGLE_SELECT',
        options: ['Bug', 'Performance', 'Security', 'Enhancement'] },
      { name: 'Severity', type: 'SINGLE_SELECT',
        options: ['Critical', 'High', 'Medium', 'Low'] },
      { name: 'Customer Impact', type: 'SINGLE_SELECT',
        options: ['All Users', 'Some Users', 'Few Users', 'Internal'] },
      { name: 'Root Cause', type: 'TEXT' }
    ],
    ceremonies: ['daily-triage', 'weekly-review', 'incident-retro'],
    metrics: ['mttr', 'incidents-resolved', 'sla-compliance', 'customer-satisfaction']
  }
};
```

## Slash Commands for SCRUM

Generated commands adapt to the project's stage:

### RND Stage Commands
```bash
/research "What's the best approach for responsive design?"  # Creates research question
/experiment start "CSS Grid vs Flexbox comparison"          # Start experiment
/findings "CSS Grid provides better responsive control"     # Document findings
/decision pivot "Moving to CSS Grid implementation"         # Record decision
```

### PRD Stage Commands
```bash
/story "As a user, I want responsive tiles"                # Create user story
/criteria "Tiles adapt to screen sizes 320px to 4K"       # Add acceptance criteria  
/design request "Need mockups for tablet view"            # Request design work
/approve design "Tablet mockups v3"                       # Approve designs
```

### SDLC Stage Commands
```bash
/task "Implement responsive grid container"                # Create dev task
/points 5                                                 # Estimate story points
/pr https://github.com/org/repo/pull/123                # Link pull request
/done                                                     # Mark task complete
```

### MAINTENANCE Stage Commands  
```bash
/bug "Tiles overlap on iPhone SE"                        # Report bug
/severity high                                           # Set severity
/investigate                                             # Start investigation
/fix "Applied min-width constraint"                      # Document fix
```

## Success Metrics

- **All Projects**: 100% have GitHub Project with SCRUM setup
- **Stage Progression**: Track projects moving through stages
- **Sprint Health**: Velocity trends, sprint completion rates
- **Ceremony Participation**: Standup attendance, retro actions
- **Time Saved**: 45-60 minutes daily through automation

## Key Differentiators

1. **SCRUM is not optional** - It's the foundation
2. **Stage-aware SCRUM** - Practices adapt to project needs  
3. **IDE Integration** - Seamless development experience
4. **Automation First** - Reduce ceremony overhead
5. **Metrics Driven** - Continuous improvement built-in

