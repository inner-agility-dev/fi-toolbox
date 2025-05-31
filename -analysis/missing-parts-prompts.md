# FI-Toolbox Missing Parts Generation Prompts

## Instructions
Copy each prompt below into a new claude.ai chat session to generate the missing components. Each prompt is self-contained and will generate only the specific missing part.

---

## 🔧 Prompt 1: Node.js CLI Project Structure

```
I'm building a CLI tool called "fitb" (FI-Toolbox) for project management with SCRUM integration. I need you to generate ONLY the complete Node.js project structure and initial setup files.

Requirements:
- Use Commander.js for CLI framework
- Include package.json with all dependencies
- Basic project folder structure
- Entry point file (index.js or cli.js)
- Configuration file structure
- README with installation instructions

Please provide ONLY the file structure and contents, no explanations. I'll copy and paste this directly into my project.
```

---

## 📝 Prompt 2: Mock Data Generator Implementation

```
I need a mock data generator for the FI-Toolbox CLI. Generate ONLY the implementation code for creating realistic mock data for project analysis.

The mock data should include:
1. Project profile (name, type, framework, stage, team_size, etc.)
2. Codebase analysis (components, test_coverage, dependencies, complexity_hotspots)
3. Team context (expertise, velocity, active patterns)
4. Project metrics (performance data, technical debt scores)

Provide ONLY the JavaScript/TypeScript code for the mock data generator with example outputs. Format as a module I can import.
```

---

## 🎯 Prompt 3: Pattern Recognition Engine

```
Generate ONLY the code implementation for a pattern recognition engine that analyzes ticket descriptions and matches them to predefined patterns.

Patterns to support:
- UI-COMPONENT-ENHANCEMENT
- MIGRATION-PATTERN
- FIRE-FIGHTER-TRIAGE
- MAINTENANCE-WORKFLOW
- NEW-PRODUCT-RND

The engine should:
1. Extract keywords from ticket description
2. Calculate confidence scores
3. Return the best matching pattern
4. Include the pattern definitions

Provide ONLY the JavaScript/TypeScript code, formatted as a module.
```

---

## 📄 Prompt 4: Claude Command Templates

```
I need the actual .claude/commands/ template files for the FI-Toolbox project. Generate ONLY the template file contents for:

1. analysis.md - Component analysis workflows
2. migration.md - Framework migration guides
3. triage.md - Issue investigation procedures
4. enhancement.md - Feature enhancement patterns
5. sprint.md - SCRUM ceremony automation

Use Handlebars-style placeholders like {{PROJECT_NAME}}, {{COMPONENT_COUNT}}, etc. Provide ONLY the template contents, one after another, with clear file separators.
```

---

## 🔌 Prompt 5: orchestr8r-mcp Integration Guide

```
Generate ONLY the integration code and configuration for connecting fitb CLI to GitHub Projects via orchestr8r-mcp.

Include:
1. Authentication setup code
2. GitHub Project creation function
3. Issue/task creation functions
4. Sprint management functions
5. Configuration file example

Provide ONLY the implementation code and config files, no explanations.
```

---

## 🧪 Prompt 6: Test Suite Implementation

```
Create ONLY the test suite implementation for the fitb CLI tool.

Tests needed for:
1. Pattern recognition accuracy
2. Mock data generation
3. Template parameterization
4. CLI command execution
5. File operations

Use Jest or Mocha. Provide ONLY the test files and any necessary test fixtures.
```

---

## 📦 Prompt 7: Installation & Deployment Script

```
Generate ONLY the installation and deployment scripts for the fitb CLI tool.

Include:
1. install.sh script for Unix/Mac
2. install.ps1 script for Windows
3. NPM publishing configuration
4. GitHub Actions CI/CD workflow
5. Version management setup

Provide ONLY the script contents, ready to save and execute.
```

---

## 🎨 Prompt 8: Mock Data JSON Examples

```
Create ONLY complete JSON example files for the FI-Toolbox mock data system.

Files needed:
1. project-profiles.json - Multiple project examples
2. codebase-analysis.json - Detailed analysis data
3. team-context.json - Team information
4. pattern-definitions.json - All pattern configurations
5. sprint-templates.json - SCRUM configurations by stage

Provide ONLY the JSON content for each file, clearly separated.
```

---

## 💡 Prompt 9: Quick Start Guide

```
Write ONLY a concise quick start guide for the fitb CLI tool that covers:

1. Installation (npm install -g fitb)
2. First project registration
3. Analyzing a ticket
4. Generating documentation
5. Common commands reference

Format as Markdown, max 100 lines. Focus on commands and examples only.
```

---

## 🔧 Prompt 10: Troubleshooting Guide

```
Generate ONLY a troubleshooting guide for common fitb CLI issues:

1. Installation problems
2. Permission errors
3. GitHub authentication issues
4. Template rendering errors
5. Mock data problems

Format as: Problem → Solution → Command example. Keep it concise and actionable.
```

---

## 🔄 Prompt 11: Git Integration for 360SOT

```
Create ONLY the implementation code for a Git analysis module that enhances the 360SOT system by analyzing commit logs and diffs.

The module should:
1. Parse git commit messages (conventional commit format)
2. Extract file ownership from contributor history
3. Identify change patterns and hotspots
4. Calculate change velocity metrics
5. Generate JSON output for 360SOT integration

Include:
- Git log parsing functions
- Diff analysis utilities
- Pattern detection for migrations/bugs/features
- File-to-author mapping
- Change frequency calculations

Provide ONLY the JavaScript/TypeScript code as a module. Output should match this structure:
{
  "file_ownership": {},
  "commit_patterns": {},
  "hotspots": [],
  "migration_waves": []
}
```

---

## Usage Tips:
1. Use each prompt in a fresh chat session for best results
2. If output is truncated, ask "please continue" to get the rest
3. Save each generated component in the appropriate location
4. Test each component individually before integration
5. The prompts are designed to generate copy-paste ready code

## File Placement Guide:
- Project structure → `/fi-toolbox/`
- Mock data → `/fi-toolbox/src/mock/`
- Templates → `/fi-toolbox/templates/.claude/commands/`
- Tests → `/fi-toolbox/tests/`
- Scripts → `/fi-toolbox/scripts/`
- JSON examples → `/fi-toolbox/examples/`
- Git integration → `/fi-toolbox/src/git-analysis/` 