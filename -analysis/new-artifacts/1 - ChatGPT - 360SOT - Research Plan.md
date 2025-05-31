\= SPEC-001: Defining the 360-Degree Source of Truth (360SOT)
\:sectnums:
\:toc:

\== Background

In modern software development, especially within highly modular and distributed systems like Banno's `responsive-tiles`, the overhead of managing documentation, technical debt, and evolving project scopes results in frequent bottlenecks. This document defines the research direction for establishing a 360-Degree Source of Truth (360SOT) – a holistic, AI-augmented metadata layer that aids project planning, maintenance, and backlog generation.

\== Requirements

\=== Must Have

* \[M] A formalized definition of 360SOT that encompasses code, documentation, and context.
* \[M] Research report on modern codebase indexing techniques and tools.
* \[M] Survey of prompt-driven document generation best practices.
* \[M] Identify common project types and associate them with document templates.
* \[M] Research strategy for leveraging AI to augment developer tasks (e.g., triage, planning).
* \[M] Strategy to convert 360SOT inputs into R\&D documents and structured SCRUM backlogs.

\=== Should Have

* \[S] Evaluation of specialized indexing techniques for multi-modal inputs (code, Markdown, GraphQL, configs).
* \[S] Comparative analysis of tools like Cody, Sourcegraph, LLM-backed embeddings, etc.
* \[S] Explore structured prompts tied to taxonomy of known project patterns.

\=== Could Have

* \[C] Integration design for storing and retrieving prompts and documents from a CLI-managed local store.
* \[C] Prototyping of mock `fitb-cli` usage flows that simulate prompt evolution.

\=== Won't Have (for now)

* \[W] Full real-time analysis of live projects.
* \[W] Dynamic integrations with IDEs or cloud editors.

\== Method

\=== Phase 1: Define the 360SOT Concept

* Review current development processes (triage, migration, R\&D, firefighting).
* Interview stakeholders (devs, PMs) to map what inputs are most valuable.
* Draft initial taxonomy of inputs:

  * Source code structure
  * Existing documentation (PRDs, RFCs)
  * Architecture diagrams
  * Code owners and historical issue threads
  * Unit and integration test structures

\=== Phase 2: Research Code Indexing and Document Generation Tools

* Evaluate tools like:

  * **Sourcegraph**: advanced code indexing, history traversal
  * **Cody**: AI-assisted dev interface with contextual search
  * **Codeium** / **Cursor IDE**: hybrid suggestion + understanding tools
  * **Embedding-backed search** (e.g., LangChain + FAISS or Weaviate)
* Compare accuracy, integration friction, and query quality.

\=== Phase 3: Prompt Design for 360SOT-Aware Document Generation

* Define structure of parameterized prompts:

  * Inputs: file paths, project type, scope
  * Outputs: PRDs, SDLC plans, Research briefs
* Develop mock prompts/templates for:

  * New product R\&D
  * Maintenance tasks (e.g., Polymer ➜ Lit migration)
  * Firefighting and triage

\=== Phase 4: Convert Docs to Short-Lived SCRUM Projects

* Simulate full lifecycle:

  * `pre-register` ➜ `register` ➜ `R&D` ➜ `PRD` ➜ `Backlog`
* Generate `.cursor/commands` for dev onboarding
* Generate GitHub-style issue drafts with references back to prompts and docs

\=== Phase 5: Strategic Use of Git Logs and Diffs

* Incorporate commit metadata and diffs as part of the 360SOT layer:

  * Parse semantic commit messages to extract feature/migration intent
  * Group diffs by file/module to reveal recurring patterns
  * Track contributor metadata for identifying code ownership
  * Map commits to related PRDs or backlogs for traceability
* CLI Command Example:

  ```
  fitb-cli analyze-commits --project=banno-online \
    --since="3 months ago" \
    --output=360SOT/git-context.json
  ```
* Outputs a searchable and filterable structure:

  * Commits tagged by project type
  * Diff summaries per module
  * Code volatility heatmaps

\== Implementation

1. Create mock 360SOT snapshots per project (YAML + doc + code metadata)
2. Build parameterized prompt library (stored in `fi-toolbox/prompt_templates`)
3. Create `fitb-cli` commands to simulate end-to-end project generation
4. Validate prompt-to-doc output manually for accuracy and relevance
5. Track evolution and reuse of prompts across simulated projects

\== Milestones

* **M1**: Complete 360SOT definition and taxonomy (Week 1)
* **M2**: Research report on indexing and prompt tooling (Week 2)
* **M3**: Initial prompt library and templates complete (Week 3)
* **M4**: Mock end-to-end CLI flow (Week 4)
* **M5**: First test with real or semi-real code base (Week 5+)

\== Gathering Results

* Evaluate clarity and usefulness of generated docs vs. manually authored ones
* Developer feedback on `.cursor/commands` and R\&D kickoff process
* Accuracy of backlog items and how well they guide SCRUM execution
* Rate of prompt reuse and adaptation over time
