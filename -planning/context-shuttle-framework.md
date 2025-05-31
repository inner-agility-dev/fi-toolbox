# Context Shuttle Framework
## Bridging AI Agents Through GitHub Projects

### The Core Problem
When working across multiple AI systems (Claude Code, ChatGPT, VS Code, Warp), we need a central source of truth that:
1. Maintains context between sessions
2. Links documents to actionable tasks
3. Provides clear navigation paths
4. Enables quick updates that propagate everywhere

### The Solution: GitHub Projects as Context Hub

```
Documents (-analysis/-planning) ←→ GitHub Project Items ←→ AI Agents
         ↑                                    ↓                    ↓
    Deep Context                      Task Tracking          Execution
```

### Linking Strategy

#### In GitHub Project Items:
```markdown
## Context Documents
- Analysis: [POC-1.md](file:///Users/LenMiller/code/banno/fi-toolbox/-analysis/POC-1.md)
- Implementation: [practical_poc_implementation.md](file:///Users/LenMiller/code/banno/fi-toolbox/-analysis/practical_poc_implementation.md)
- Planning: [poc-1-detailed-tasks.md](file:///Users/LenMiller/code/banno/fi-toolbox/-planning/poc-1-detailed-tasks.md)

## Current Focus
Building the fitb CLI skeleton with Commander.js
```

#### In Document Headers:
```markdown
---
github-project: PVT_kwHOAALNNc4A6E34
github-items: 
  - PVTI_lAHOAALNNc4A6E34zga-2M4 # Main POC-1 item
  - PVTI_[new-id] # Specific task items
status: active
---
```

### The Process Flow

1. **R&D Phase** (-analysis folder)
   - Research documents
   - POC specifications
   - Technical investigations

2. **Planning Phase** (-planning folder)
   - Task decomposition
   - Sprint planning
   - Architecture decisions

3. **Execution Phase** (GitHub Projects)
   - Granular tasks
   - Progress tracking
   - Context links back to docs

### Next Steps
1. Decompose existing POC-1 into granular GitHub tasks
2. Add document links to each task
3. Create header metadata in key documents
4. Test the shuttle flow with one complete example