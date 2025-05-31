# FI-Toolbox CLI Project Handoff

I'm continuing development of the **FI-Toolbox CLI (fitb-cli)** project. Here's the current state and context:

## Project Overview
I'm building a **Documentation-Driven Development (DDD) engine** with **mandatory SCRUM orchestration** for Banno projects. The system uses parameterized prompts to generate complete project documentation and automate SCRUM workflows.

## Key Project Details
- **Project Location**: `/Users/LenMiller/code/banno/fi-toolbox`
- **Target Project**: `responsive-tiles` (Polymer to Lit migration use case)
- **Approach**: Mock-first development validated as optimal strategy
- **Architecture**: CLI tool that generates `.claude/commands` for projects

## Current State Documents
Please read these files to understand the current state:

1. **Core Specification**: `/Users/LenMiller/code/banno/fi-toolbox/POC-1.md` 
   - Complete POC specification with architecture, CLI commands, and implementation roadmap
   - 10-week implementation plan across 5 phases

2. **Integration Architecture**: `/Users/LenMiller/code/banno/fi-toolbox/prompts/FITB-ORCHESTR8R-INTEGRATION.md`
   - How fitb-cli integrates with orchestr8r-mcp for GitHub Projects

3. **Existing Structure**: Review `/Users/LenMiller/code/banno/fi-toolbox/` directory tree
   - Current artifacts structure with project stages (1-PRE_REGISTER through 7-MAINTENANCE)
   - Existing prompts and .claude/commands templates

## Key Validated Decisions
1. **Mock-First Development**: Validated as 40-60% faster than academic approach
2. **Registration Flow**: `fitb register <project>` copies from artifacts to project `.claude/commands`
3. **Development → Production**: Manual promotion of prompts from development to artifacts
4. **Pattern Recognition**: MIGRATION-PATTERN, FIRE-FIGHTER-TRIAGE, UI-COMPONENT-ENHANCEMENT
5. **SCRUM Mandatory**: Every registered project gets GitHub Project with stage-appropriate configuration

## Current Focus: POC Implementation
We're implementing **Phase 1: Core Foundation** (Weeks 1-2):
- [ ] Create basic fitb CLI skeleton
- [ ] Implement project registration with .fitb-registered markers  
- [ ] Build SOTD generation from templates
- [ ] Set up artifact directory structure

## Example Use Case (POC Target)
**Scenario**: Developer gets ticket "Add eyeball icon to password input for visibility toggle"
**Expected Flow**: 
1. `fitb analyze-ticket "eyeball icon password input toggle"`
2. System recognizes UI-COMPONENT-ENHANCEMENT pattern
3. Generates MAINTENANCE-stage documents and SCRUM backlog
4. Creates GitHub Project with 5 tasks ready to execute

## Key Architecture Concepts
- **360-degree Source of Truth (360SOT)**: Complete project documentation set
- **Parameterized Prompts**: Templates with {{PROJECT_NAME}}, {{PROJECT_PATH}}, etc.
- **Stage-Aware SCRUM**: Different configurations for RND/PRD/SDLC/MAINTENANCE
- **File Watcher**: Central command deployment to all registered projects

## Technical Stack Decisions
- **CLI Framework**: TBD (considering Cobra for Go or Commander for Node.js)
- **Template Engine**: Handlebars.js recommended
- **Mock Data**: Realistic project structures for initial development
- **Integration**: orchestr8r-mcp for GitHub Project management

## Immediate Next Steps
1. **Design CLI command structure** following `/Users/LenMiller/code/banno/fi-toolbox/POC-1.md` specifications
2. **Create mock 360SOT data** for responsive-tiles project
3. **Implement basic `fitb register` command** with file copying
4. **Build template parameterization system**

## Questions to Address
- Choice of CLI framework (Go vs Node.js vs Python)?
- Mock data structure for 360SOT?
- Integration approach with existing orchestr8r-mcp?
- Template format for parameterized prompts?

## Context from Previous Work
I've been working on this with Claude and have validated the approach through research. We determined mock-first development is optimal and created comprehensive specifications. Now I need to begin actual implementation starting with Phase 1.

Please help me continue from where we left off, focusing on getting the first working prototype of the fitb CLI tool running with mock data, following the specifications in POC-1.md.
