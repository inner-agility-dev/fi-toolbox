# GitHub Projects Organization Strategy for FI-Toolbox

## The Challenge
You need to see both high-level POCs and granular daily tasks, with easy navigation between GitHub Projects and your documentation.

## Recommended Approach: Hierarchical Task Organization

### 1. **Use Draft Issues for Organization**

Instead of creating flat lists, create a hierarchy:

```
POC-1: The Eyeball Icon (Parent)
├── Week 1: Foundation Tasks (Milestone)
│   ├── Day 1-2: CLI Setup
│   ├── Day 2: Analyze Command
│   └── Day 3-4: Mock Data
└── Week 2: Implementation (Milestone)
    ├── Day 8-9: Templates
    └── Day 10-11: Generation
```

### 2. **Custom Fields to Add**

Create these fields for better organization:

- **Task Type** (Single Select):
  - Epic (POC level)
  - Milestone (Week level)
  - Task (Day level)
  - Subtask (Hour level)

- **Week Number** (Number): 1-12
- **Day Range** (Text): "Day 1-2", "Day 3-4"
- **Document Links** (Text): Links to planning docs
- **Success Criteria** (Text): Measurable outcome

### 3. **View Configuration**

Create these views in the GitHub UI:

#### **Roadmap View** (Timeline)
- Group by: POC Phase
- Display: Start/Due dates
- Filter: Task Type = Epic

#### **Sprint View** (Board)
- Group by: Status
- Filter: Week Number = [current week]
- Sort by: Priority

#### **Daily Tasks View** (Table)
- Filter: Task Type = Task OR Subtask
- Sort by: Week Number, then Day Range
- Show fields: Title, Status, Document Links

#### **Context Shuttle View** (Table)
- Show all fields including Document Links
- Group by: POC Phase
- Use for AI agent handoffs

### 4. **Linking Strategy**

In GitHub items:
```markdown
## Documents
- Planning: [poc-1-detailed-tasks.md](file:///path/to/file)
- Analysis: [POC-1.md](file:///path/to/file)
- Context: [#123 in -planning folder]

## GitHub Links
- Parent POC: #PVTI_[parent-id]
- Related Tasks: #PVTI_[task-id], #PVTI_[task-id]
```

In Markdown documents:
```yaml
---
github-project: 11
github-items:
  - PVTI_lAHOAALNNc4A6E34zga-2M4 # POC-1
  - PVTI_lAHOAALNNc4A6E34zga-76U # Day 1-2 Setup
---
```

### 5. **Implementation Steps**

1. **Add Custom Fields** (via orchestr8r-mcp)
2. **Update Existing Items** with Task Type field
3. **Create Week Milestones** as draft issues
4. **Link Daily Tasks** to Week Milestones
5. **Add Document Links** to all items
6. **Create Views** manually in GitHub UI

### 6. **Benefits of This Approach**

- **Clear Hierarchy**: See relationships at a glance
- **Flexible Views**: Different perspectives for different needs
- **Context Preservation**: Links maintain continuity across AI sessions
- **Scalable**: Works for 6 POCs or 600 tasks

### 7. **Example Task Structure**

```
Title: "Day 1-2: Initialize Node.js Project"
Task Type: Task
Week Number: 1
Parent: POC-1 Epic
Status: Ready
Document Links: See [detailed steps](file:///path/to/poc-1-detailed-tasks.md#day-1-2)
```

This approach gives you the granularity you need while maintaining the high-level view for roadmap planning.