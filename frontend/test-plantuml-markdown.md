# PlantUML in Markdown Test

This file tests PlantUML diagrams embedded in Markdown.

## Simple Sequence Diagram

```plantuml
@startuml
!theme plain
title Embedded PlantUML Test

actor User
participant "Markdown Preview" as preview
participant "PlantUML Engine" as engine

User -> preview: View markdown file
preview -> engine: Process PlantUML block
engine --> preview: Rendered diagram
preview --> User: Display in preview

note bottom
  If you see this diagram in the
  Markdown preview, everything
  is working correctly!
end note
@enduml
```

## Class Diagram Example

```plantuml
@startuml
!theme plain
skinparam backgroundColor #FEFEFE

class TestClass {
    +String name
    +int value
    --
    +void testMethod()
}

class AnotherClass {
    -boolean flag
    --
    +boolean isReady()
}

TestClass --> AnotherClass : uses

note right of TestClass
  This is a simple test
  to verify PlantUML works
  in Markdown Preview Enhanced
end note
@enduml
```

## Testing Instructions

1. Open this file in VS Code
2. Right-click and select "Markdown Preview Enhanced: Open Preview to the Side"
3. You should see the diagrams rendered above 