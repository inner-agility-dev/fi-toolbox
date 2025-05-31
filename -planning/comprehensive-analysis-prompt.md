# Comprehensive FI-Toolbox Analysis Prompt

## Instructions for Complete Project Understanding

When analyzing the FI-Toolbox project, please follow this systematic approach to ensure full comprehension of the project's evolution and current state:

### Phase 1: Complete File Discovery
1. Recursively list ALL files in:
   - `/Users/LenMiller/code/banno/fi-toolbox/-analysis/`
   - `/Users/LenMiller/code/banno/fi-toolbox/-planning/`
   - `/Users/LenMiller/code/banno/fi-toolbox/prompts/`
   - `/Users/LenMiller/code/banno/fi-toolbox/artifacts/`

2. Note the last modified date of each file to establish chronological order

### Phase 2: Chronological Analysis (Oldest to Newest)
Read files in chronological order to understand the project's evolution:

1. **Start with the earliest vision documents** to understand original intent
2. **Progress through refinements** to see how ideas evolved
3. **End with the most recent documents** to understand current state

Key documents to prioritize (but don't limit to these):
- `EARLY-VISION.md` - Original frustrations and goals
- `document_overview.md` - Separation of Feet-On-The-Ground vs Pie-In-The-Sky
- `POC-1.md` - Core specification
- `feet_on_ground_cli_guide_v2.md` - Practical implementation
- `practical_poc_implementation(1).md` - Detailed implementation
- Any newer documents that modify or enhance the vision

### Phase 3: Reverse Chronological Review (Newest to Oldest)
After understanding the evolution, review from newest to oldest to:
1. **Identify what's current vs outdated**
2. **Spot any contradictions or pivots**
3. **Understand which decisions supersede others**

### Phase 4: Synthesis and Reconciliation
After both passes, create a mental model that answers:

1. **What is the CURRENT primary goal?**
   - Is it building the fitb CLI for project lifecycle management?
   - Is it creating a component conversion tool?
   - Is it conducting 360SOT research?

2. **What are the core concepts that remain consistent?**
   - Project registration with `fitb register <project>`
   - Pattern recognition (MIGRATION, TRIAGE, UI-ENHANCEMENT)
   - Parameterized prompts that evolve
   - Mock-first development approach
   - SCRUM automation

3. **What has changed or pivoted?**
   - Has the eyeball icon case study role changed?
   - Has the 360SOT definition evolved?
   - Have the patterns or focus areas shifted?

4. **What is the correct implementation sequence?**
   - Research first, then build?
   - Build mock system, then research integrations?
   - Parallel tracks?

### Phase 5: Create Alignment

Based on your complete analysis:

1. **Identify the authoritative documents** - which ones represent the current truth?
2. **Note any inconsistencies** between documents, GitHub tickets, or planning materials
3. **Propose a clear path forward** that honors the project's evolution while focusing on current goals

### Critical Context to Maintain

Remember throughout your analysis:

- **Feet-On-The-Ground** = Practical, implementable now, solves real problems
- **Pie-In-The-Sky** = Research, future vision, theoretical frameworks
- The eyeball icon is a **test case/validation**, not the product itself
- The goal is a **CLI tool for managing project lifecycles**, not just converting components
- **360SOT** is the comprehensive context that makes everything work

### Output Expected

After completing this analysis, you should be able to:
1. Clearly articulate what fitb CLI is and does
2. Explain the correct POC sequence and goals
3. Create GitHub Project items that align with the documented vision
4. Distinguish between immediate implementation and future research
5. Understand how all the pieces fit together into a cohesive whole

---

## Usage Note

Use this prompt at the start of any session where you need to create roadmaps, project plans, or implementation tasks for FI-Toolbox. It ensures you have the complete context before making decisions that affect the project's direction.