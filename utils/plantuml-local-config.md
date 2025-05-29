# PlantUML Extension Configuration Guide

## Current Setup
Your PlantUML is correctly installed and working from the command line:
- PlantUML JAR: `/opt/homebrew/Cellar/plantuml/1.2025.2/libexec/plantuml.jar`
- Java: OpenJDK 23.0.2
- Graphviz: 12.2.1

## VS Code PlantUML Extension Settings

### Option 1: Use PlantUML Web Server (Current - No Java needed in VS Code)
```json
"plantuml.render": "PlantUMLServer",
"plantuml.server": "https://www.plantuml.com/plantuml",
```

### Option 2: Use Local PlantUML (Faster, but requires Java path)
```json
"plantuml.render": "Local",
"plantuml.jar": "/opt/homebrew/Cellar/plantuml/1.2025.2/libexec/plantuml.jar",
"plantuml.java": "/usr/bin/java",
```

## How to Preview PlantUML Diagrams

1. **Open a `.puml` file**
2. **Preview shortcuts:**
   - `Alt+D` (Windows/Linux) or `Option+D` (Mac) - Preview current diagram
   - `Ctrl+Shift+V` (Windows/Linux) or `Cmd+Shift+V` (Mac) - Preview in side panel

## Troubleshooting the Red Dot

If you still see a red dot:

1. **Check PlantUML extension is installed:**
   - Open Extensions (`Cmd+Shift+X`)
   - Search for "PlantUML"
   - Install "PlantUML" by jebbs

2. **Restart VS Code** after changing settings

3. **Check Java path (if using Local render):**
   ```bash
   which java
   # Should output: /usr/bin/java
   ```

4. **Test with a simple diagram:**
   ```plantuml
   @startuml
   Alice -> Bob: Hello
   @enduml
   ```

5. **Check VS Code Output:**
   - Open Output panel (`View > Output`)
   - Select "PlantUML" from dropdown
   - Look for error messages

## Alternative: Use Markdown Preview Enhanced

Since you have Markdown Preview Enhanced configured, you can also:
1. Create a `.md` file
2. Add PlantUML in code blocks:
   ````markdown
   ```plantuml
   @startuml
   Your diagram here
   @enduml
   ```
   ````
3. Use Markdown Preview Enhanced to view 