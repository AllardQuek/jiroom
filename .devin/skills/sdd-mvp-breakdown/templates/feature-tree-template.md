# Feature Tree: [Root Feature Name]
# Generated: [YYYY-MM-DD]
# Source: [List of files read]

## Overview
[Brief description of the feature being broken down]

## Feature Tree

[Root Feature Name]
├── [Sub-feature 1: Description] @serial
├── [Sub-feature 2: Description] @serial
├── [Sub-feature 3: Description] @parallel(Sub-feature 4)
└── [Sub-feature 4: Description] @parallel(Sub-feature 3)

## Feature Clarifications

### Sub-feature 1: [Name]
- **Goal:** [What this sub-feature aims to achieve]
- **Scope:** [What is included and what is NOT included]
- **Key Deliverables:** [Expected outputs or artifacts]

### Sub-feature 2: [Name]
- **Goal:** [What this sub-feature aims to achieve]
- **Scope:** [What is included and what is NOT included]
- **Key Deliverables:** [Expected outputs or artifacts]

### Sub-feature 3: [Name]
- **Goal:** [What this sub-feature aims to achieve]
- **Scope:** [What is included and what is NOT included]
- **Key Deliverables:** [Expected outputs or artifacts]

### Sub-feature 4: [Name]
- **Goal:** [What this sub-feature aims to achieve]
- **Scope:** [What is included and what is NOT included]
- **Key Deliverables:** [Expected outputs or artifacts]

## Dependencies
- [Sub-feature A] → [Sub-feature B] (A must complete before B)
- [Sub-feature C] ↔ [Sub-feature D] (can run in parallel)

## Dependency Markers Reference
- @serial         : Must complete before next feature at same level
- @parallel(X)    : Can run simultaneously with feature X
- @depends(X)     : Explicitly depends on feature X completion
- @optional       : Can be skipped if not needed

## Optional Metadata
- [estimate: Xd]     : Estimated time to complete
- [priority: high]   : Priority level (high/medium/low)
- [assignee: @name]  : Assigned team member
- [blocked]          : Currently blocked by external factor

## Notes
- [Any additional context, considerations, or decisions made during breakdown]
- [References to specific architecture or requirement documents]

## Next Steps
1. Use `sdd-new-feature` to create detailed spec for first serial sub-feature
2. Parallel sub-features can be started simultaneously once dependencies are met
3. Update this file as sub-features are completed or scope changes

---

## Hierarchy Constraint
**IMPORTANT:** This feature tree has only ONE level of depth.
- Root Feature → Sub-features (no further nesting)
- If more granularity is needed, use `sdd-new-feature` to break down individual sub-features into tasks.
