# GitHub Projects Custom Views Guide

## How to Create Custom Views for FI-Toolbox Roadmap

Custom views help you slice and dice your project data to see exactly what you need, when you need it. Here's how to create the most useful views for the FI-Toolbox project.

## Accessing Views

1. Go to your project: https://github.com/users/lennylmiller/projects/11
2. Click on the view tabs at the top (you'll see "Current iteration", "Next iteration", etc.)
3. Click the "+" button to create a new view

## Recommended Views to Create

### 1. **Roadmap Overview** (Table View)
**Purpose**: See all POCs and their timeline

**Setup**:
1. Click "+" to create new view
2. Name it "Roadmap Overview"
3. Choose "Table" layout
4. Configure:
   - **Filter**: `task-type:Epic`
   - **Sort**: By Week Number (ascending)
   - **Fields to show**: Title, Status, Priority, Week Number

**Result**: Clean view of just the 6 POCs in order

---

### 2. **Current Week Sprint** (Board View)
**Purpose**: Focus on what needs to be done this week

**Setup**:
1. Create new view named "Week 1 Sprint"
2. Choose "Board" layout
3. Configure:
   - **Filter**: `week-number:1`
   - **Group by**: Status
   - **Sort within groups**: By Priority
   - **Fields to show**: Title, Task Type, Assignee

**Result**: Kanban board of just Week 1 tasks

---

### 3. **Daily Standup** (Table View)
**Purpose**: Quick view of in-progress and blocked items

**Setup**:
1. Create view named "Daily Standup"
2. Choose "Table" layout
3. Configure:
   - **Filter**: `status:"In progress","Ready" task-type:Task,Subtask`
   - **Sort**: By Status, then Priority
   - **Fields**: Title, Status, Assignee, Week Number, Parent issue

**Result**: Focused view for daily check-ins

---

### 4. **Task Hierarchy** (Table View)
**Purpose**: See the relationship between Epics, Milestones, and Tasks

**Setup**:
1. Create view named "Task Hierarchy"
2. Choose "Table" layout
3. Configure:
   - **Group by**: Task Type
   - **Sort**: By Week Number, then Title
   - **Fields**: Title, Task Type, Week Number, Status

**Result**: Pseudo-hierarchical view grouped by task level

---

### 5. **Documentation Links** (Table View)
**Purpose**: Quick access to all document references

**Setup**:
1. Create view named "Documentation Links"
2. Choose "Table" layout
3. Configure:
   - **Filter**: No filter (show all)
   - **Sort**: By Task Type, then Week Number
   - **Fields**: Title, Task Type, Week Number
   - **Show item details**: Expanded (to see body content with links)

**Result**: Easy navigation to all linked documents

---

### 6. **Progress Tracker** (Board View)
**Purpose**: Visual progress of the entire project

**Setup**:
1. Create view named "Progress Tracker"
2. Choose "Board" layout
3. Configure:
   - **Group by**: Task Type
   - **Then by**: Status
   - **Filter**: None (show all)
   - **Cards**: Compact view

**Result**: Bird's eye view of progress across all levels

---

## View Management Tips

### Switching Between Views
- Use keyboard shortcut `1-9` to quickly switch between views
- Star your most-used views for quick access

### Sharing Views
- Views are shared with all project members
- Use descriptive names so team members understand the purpose

### Dynamic Filters
You can create dynamic filters:
- `assignee:@me` - Shows only your tasks
- `updated:>-7` - Items updated in last 7 days
- `iteration:@current` - Current sprint items

### Saving View Configurations
- Each view remembers its configuration
- Changes are auto-saved
- You can duplicate views to create variations

## Advanced View Features

### 1. **Slice by Date**
For roadmap planning:
- Add Start Date and Due Date fields to POCs
- Create a "Timeline" view sorted by Start Date
- Use the Roadmap layout (if available) for Gantt-style visualization

### 2. **Workload Balancing**
To see team capacity:
- Group by Assignee
- Filter by current iteration
- Add Size or Estimate fields to see workload

### 3. **Dependency Tracking**
To see blocked work:
- Filter by items with "blocked" label
- Show Parent issue field
- Sort by Priority to see critical path

## Quick Filters Syntax

Use these in the filter bar:

```
# Single field
status:Ready

# Multiple values
status:Ready,In-Progress

# Exclude values
-status:Done

# Multiple conditions (AND)
task-type:Task week-number:1

# Text search
is:open password visibility

# Date ranges
updated:2024-01-01..2024-01-31
```

## Keyboard Shortcuts in Views

- `cmd/ctrl + k` - Command palette
- `shift + ?` - Show all shortcuts
- `x` - Select/deselect item
- `e` - Edit item
- `c` - Copy item

## Export Options

From any view:
1. Click "..." menu
2. Select "Export"
3. Choose CSV or JSON
4. Use for reporting or backup

---

Remember: Views are powerful ways to make your project data work for you. Start with these recommended views, then customize based on your workflow!