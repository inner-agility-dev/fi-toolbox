# PlantUML Test Document

This document tests PlantUML rendering in Markdown Preview Enhanced.

## Inline PlantUML Diagram

```plantuml
@startuml
!theme plain
skinparam backgroundColor #FEFEFE

actor User
participant "Markdown Preview" as preview
participant "PlantUML" as plantuml
participant "Renderer" as renderer

User -> preview: Open markdown file
preview -> plantuml: Process PlantUML block
plantuml -> plantuml: Generate diagram
plantuml -> renderer: Return SVG/PNG
renderer -> preview: Embed in preview
preview -> User: Show rendered diagram

note over plantuml
  PlantUML processes the
  diagram definition and
  generates the output
end note

@enduml
```

## Another Example - State Diagram

```plantuml
@startuml
!theme plain

[*] --> Working
Working --> Fixed : Problem solved
Working --> Broken : New issue found
Broken --> Working : Fix applied
Fixed --> [*]

note right of Working
  This shows the setup
  is working correctly!
end note

@enduml
```

## Regular Markdown Content

This is regular markdown content that should render normally alongside the PlantUML diagrams. 