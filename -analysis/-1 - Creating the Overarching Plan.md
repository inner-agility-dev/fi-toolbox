

# FI-Toolbox Overarching Project Plan

## Executive Summary
FI-Toolbox is a Documentation-Driven Development (DDD) engine that captures organizational knowledge through "invisible SCRUM" - developers work naturally while the system automatically generates project management artifacts and builds temporal intelligence.

## Core Innovation: 4D Confidence
Every SCRUM board becomes part of the 360-Degree Source of Truth (360SOT), creating a temporal knowledge graph where past projects inform future decisions. This transforms project management from overhead into organizational learning.

## Development Philosophy: 3-Track Approach

### Track 1: Ship Value Every 2 Weeks
Each POC delivers a working feature developers can use immediately.

### Track 2: Build Knowledge Assets  
Each POC's SCRUM board becomes searchable documentation.

### Track 3: Evolve the Platform
Each POC hardens the fitb CLI and integrations.

## 12-Week POC Roadmap

### POC 1: The Eyeball Icon (Weeks 1-2)
**Goal**: Convert one responsive-tiles component to prove the concept
**Command**: `fitb convert-component toolbox/password-input --to=lit`
**Delivers**: Working Lit component, first template, basic GitHub Project creation
**Success Metric**: One developer uses it for real work

### POC 2: The Toolbox Migration (Weeks 3-4)  
**Goal**: Full toolbox.html conversion with pattern recognition
**Command**: `fitb analyze-project responsive-tiles/toolbox`
**Delivers**: Complete toolbox in Lit, CONVERSION-PROJECT pattern, task automation
**Success Metric**: 80% reduction in migration planning time

### POC 3: The Fire Fighter (Weeks 5-6)
**Goal**: Automate issue triage with historical context
**Command**: `fitb triage WEB-4133`
**Delivers**: Automated analysis, smart task generation, historical data use
**Success Metric**: Triage time < 5 minutes

### POC 4: The Time Machine (Weeks 7-8)
**Goal**: Extract patterns from git history
**Command**: `fitb show-patterns "password visibility" --last-90-days`
**Delivers**: Git integration, pattern extraction, temporal search
**Success Metric**: Find relevant past solutions in < 30 seconds

### POC 5: The Knowledge Graph (Weeks 9-10)
**Goal**: Cross-project intelligence and recommendations
**Command**: `fitb suggest-approach "migrate header component"`
**Delivers**: ML-based recommendations, confidence scores, pattern library
**Success Metric**: 90% accuracy on task estimation

### POC 6: The Invisible SCRUM (Weeks 11-12)
**Goal**: Natural language to complete project setup
**Command**: `fitb create-project "Update login page with new brand guidelines"`
**Delivers**: Full automation, all artifacts generated, knowledge capture
**Success Metric**: Project setup in < 2 minutes

## Chaos Avoidance Principles

1. **No Nested Boards**: Each project gets ONE board. Relationships via tags.
2. **Time-Box Ruthlessly**: 2 weeks max per POC, ship or shelve
3. **One Success Metric**: Each POC proves exactly ONE thing
4. **Knowledge First**: Every artifact contributes to 360SOT

## Technical Stack (Decided)
- **CLI Framework**: Node.js with Commander.js
- **Template Engine**: Handlebars
- **Integration**: orchestr8r-mcp for GitHub Projects
- **Knowledge Store**: Start with JSON, evolve to SQLite

## Week 1 Concrete Actions

1. **Monday**: Create Node.js project structure (use missing-parts-prompts.md #1)
2. **Tuesday**: Build mock data for responsive-tiles toolbox
3. **Wednesday**: Implement basic pattern matching for password-input
4. **Thursday**: Create first Handlebars template for Lit conversion
5. **Friday**: Wire up basic GitHub Project creation via orchestr8r-mcp

## Success Criteria for Overall Project

- **Adoption**: 5 developers using fitb daily by Week 12
- **Time Savings**: 50% reduction in project setup time
- **Knowledge Capture**: 100+ patterns in library
- **Accuracy**: 80%+ on automated task generation

## Anti-Patterns to Avoid

- Building the perfect system before shipping anything
- Creating complex hierarchies of SCRUM boards
- Focusing on AI sophistication over developer value
- Ignoring feedback in favor of the grand vision

## The North Star

Every developer interaction with fitb should:
1. Save them time TODAY
2. Capture knowledge for TOMORROW
3. Feel like magic, not process

---

*Remember: We're not building a project management tool. We're building an organizational learning system disguised as a helpful CLI.*
