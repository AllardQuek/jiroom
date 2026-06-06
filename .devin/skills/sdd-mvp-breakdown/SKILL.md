---
name: sdd-mvp-breakdown
description: Interactively breaks down features into a feature tree with serial/parallel dependencies for sdd-new-feature consumption
---

## 1.0 SYSTEM DIRECTIVE
You are an AI agent assistant for the spec-driven development framework. Your current task is to help the user interactively break down a feature or set of features into a feature tree structure. The output will serve as input for the `sdd-new-feature` skill.

CRITICAL: You must validate the success of every tool call. If any tool call fails, you MUST halt the current operation immediately, announce the failure to the user, and await further instructions.

## 1.1 SETUP CHECK
**PROTOCOL: Verify that the Spec-Driven environment is properly set up.**

1.  **Check for Required Directories:** You MUST verify the existence of the following directories:
    -   `specs/architecture`
    -   `specs/requirements/engineering/` (for Engineering Requirements)
    -   `specs/requirements/business/` (for Business Requirements, optional)

2.  **Handle Missing Directories:**
    -   If `specs/architecture` or `specs/requirements/engineering/` are missing, you MUST halt the operation immediately.
    -   Announce: "Spec-Driven environment is not set up. Please run `sdd-setup` agent skill to set up the environment, or create the required directories manually."
    -   Do NOT proceed to Feature Breakdown Initialization.

---

## 2.0 FEATURE BREAKDOWN INITIALIZATION
**PROTOCOL: Follow this sequence precisely.**

### 2.1 Request Context Files

1.  **Ask User for Context Files:** You MUST NOT automatically read all files. Instead, ask the user:
    > "To help you break down features, I need to understand the project context. Please specify which files I should read:
    > 
    > A) Specify architecture document(s) from `specs/architecture/`
    > B) Specify requirements document(s) from `specs/requirements/engineering/` or `specs/requirements/business/`
    > C) Specify both architecture and requirements documents
    > D) List the files yourself
    > 
    > Please respond with A, B, C, or D, followed by the file name(s)."

2.  **Wait for User Input:** Do NOT proceed until the user provides the file names.

3.  **Read Specified Files:** Only read the files that the user explicitly specifies.

4.  **Summarize Context:** After reading the specified files, present a brief summary:
    > "I've read the following documents:
    > - [List of files read]
    > 
    > Key points:
    > - [Brief summary of key information from the documents]
    > 
    > Ready to help you break down features."

### 2.2 Understand Current Progress

**PROTOCOL: This section requires a MINIMUM of 5 rounds and a MAXIMUM of 15 rounds of interaction. If anything is unclear, you MUST stop and ask the user for clarification before proceeding.**

**Round Counter:** Track the number of rounds. Do NOT proceed to Feature Breakdown until at least 5 rounds are completed.

#### Round 1: Project State
1.  **Ask About Current State:** Present options to the user:
    > "What is the current state of your project?
    > 
    > A) Project is brand new, nothing implemented yet
    > B) Basic infrastructure is set up (e.g., project skeleton, dependencies)
    > C) Some core features are already implemented
    > D) Most features are done, adding enhancements
    > E) Describe your own situation
    > 
    > Please respond with A, B, C, D, or E."

2.  **If Unclear:** If the user's response is ambiguous or you don't understand, ask a clarifying question before proceeding.

#### Round 2: Completed Components
1.  **Ask About Completed Work:** Based on the context documents, ask:
    > "What specific components or features have been completed? (Select all that apply)
    > 
    > A) [Inferred component 1 from context]
    > B) [Inferred component 2 from context]
    > C) [Inferred component 3 from context]
    > D) [Inferred component 4 from context]
    > E) Let me describe what's done
    > 
    > Please respond with your selection(s)."

2.  **If User Selects E or Response is Unclear:** Wait for user's description, then summarize and confirm:
    > "Let me confirm I understand correctly: [summary of what you understood]. Is this accurate?
    > 
    > A) Yes, that's correct
    > B) No, let me clarify
    > 
    > Please respond with A or B."

#### Round 3: Next Feature Goal
1.  **Ask About Next Feature:** Ask the user:
    > "What feature do you want to work on next?
    > 
    > A) [Suggested feature 1 based on context]
    > B) [Suggested feature 2 based on context]
    > C) [Suggested feature 3 based on context]
    > D) [Suggested feature 4 based on context]
    > E) Describe your own feature
    > 
    > Please respond with A, B, C, D, or E."

2.  **If User Selects E:** Wait for user's description, then confirm understanding.

#### Rounds 4-5: Required Deep Dive Questions
**PROTOCOL:** These rounds are MANDATORY. You MUST ask at least 2 of the following questions.

1.  **Scope Clarification:**
    > "How large is the scope of this feature?
    > 
    > A) Small - can be done in a day or two
    > B) Medium - about a week of work
    > C) Large - multiple weeks
    > D) Not sure, help me estimate
    > E) Let me describe the scope
    > 
    > Please respond with A, B, C, D, or E."

2.  **Dependencies:**
    > "Does this feature depend on any existing components?
    > 
    > A) Yes, it depends on [inferred component 1]
    > B) Yes, it depends on [inferred component 2]
    > C) No dependencies, it's standalone
    > D) Not sure
    > E) Let me describe the dependencies
    > 
    > Please respond with your selection."

#### Additional Rounds (6-15): Optional Deep Dive Questions
**PROTOCOL:** Continue asking questions until you have a clear understanding. Stop and ask if anything is unclear.

Potential follow-up questions (ask as needed, one at a time):

1.  **Priority:**
    > "What is the priority of this feature?
    > 
    > A) Critical - must be done first
    > B) High - important but not blocking
    > C) Medium - nice to have soon
    > D) Low - can wait
    > E) Let me explain the priority
    > 
    > Please respond with A, B, C, D, or E."

4.  **Technical Constraints:**
    > "Are there any technical constraints or requirements for this feature?
    > 
    > A) Must use specific technology/framework
    > B) Must integrate with existing system
    > C) Has performance requirements
    > D) No special constraints
    > E) Let me describe the constraints
    > 
    > Please respond with your selection."

5.  **Acceptance Criteria:**
    > "What would make this feature 'done'?
    > 
    > A) [Suggested criteria 1 based on context]
    > B) [Suggested criteria 2 based on context]
    > C) [Suggested criteria 3 based on context]
    > D) All of the above
    > E) Let me describe the acceptance criteria
    > 
    > Please respond with your selection."

**CRITICAL:** 
- If at any point you are uncertain about the user's intent, STOP and ask for clarification.
- Do NOT proceed to Section 2.3 until you have completed at least 5 rounds.
- Do NOT exceed 15 rounds. If still unclear after 15 rounds, summarize what you know and proceed with caveats.

#### Final Confirmation
Before proceeding to Feature Breakdown, summarize your understanding:
> "Before we proceed, let me summarize what I understand:
> - **Project State:** [summary]
> - **Completed Work:** [summary]
> - **Next Feature:** [summary]
> - **Additional Context:** [any other relevant info]
> 
> Is this correct?
> 
> A) Yes, let's proceed
> B) No, I need to correct something
> 
> Please respond with A or B."

### 2.3 Interactive Feature Breakdown

1.  **State Your Goal:** Announce:
    > "I'll now help you break down this feature into sub-features. We'll identify:
    > - **Serial features** (must be done in sequence)
    > - **Parallel features** (can be done simultaneously)
    > 
    > Let's start with the breakdown."

2.  **Generate Initial Breakdown:** Based on the user's description and project context:
    -   Propose a feature breakdown with 3-5 sub-features.
    -   **CRITICAL:** Feature hierarchy MUST NOT exceed one level (root feature → sub-features only, no sub-sub-features).
    -   Mark dependencies between sub-features.

3.  **Present Initial Breakdown:** Present the breakdown using the following format:
    > "Here's my proposed feature breakdown:
    > 
    > ```
    > [Root Feature Name]
    > ├── [Sub-feature 1: Name] @serial
    > ├── [Sub-feature 2: Name] @serial
    > ├── [Sub-feature 3: Name] @parallel(Sub-feature 4)
    > └── [Sub-feature 4: Name] @parallel(Sub-feature 3)
    > ```
    > 
    > Does this structure make sense?
    > 
    > A) Approve this breakdown
    > B) Modify the structure
    > C) Add or remove sub-features
    > D) Describe your own changes
    > 
    > Please respond with A, B, C, or D."

4.  **Refinement Loop:** Based on user feedback:
    -   **If A:** Proceed to dependency confirmation.
    -   **If B:** Ask what modifications are needed:
        > "What would you like to modify?
        > 
        > A) Change sub-feature names
        > B) Change serial/parallel relationships
        > C) Reorder sub-features
        > D) Describe your changes
        > 
        > Please respond with A, B, C, or D."
    -   **If C:** Ask which sub-features to add/remove:
        > "Which sub-features would you like to add or remove?
        > 
        > A) Add a new sub-feature (describe it)
        > B) Remove [Sub-feature 1]
        > C) Remove [Sub-feature 2]
        > D) Describe your changes
        > 
        > Please respond with your selection."
    -   **If D:** Accept user's custom input and incorporate.

5.  **Dependency Confirmation:** Present the dependency analysis:
    > "Based on our discussion, here are the feature dependencies:
    > 
    > - [Sub-feature A] must complete before [Sub-feature B]
    > - [Sub-feature C] and [Sub-feature D] can run in parallel
    > 
    > Is this correct?
    > 
    > A) Yes, this is correct
    > B) No, let me adjust
    > 
    > Please respond with A or B."

### 2.4 Generate Feature Tree Output

1.  **Draft Feature Tree:** Generate the final feature tree using the following format:

    ```
    # Feature Tree: [Root Feature Name]
    # Generated: [YYYY-MM-DD]
    # Source: [List of files read]
    
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
    - Sub-feature 1 → Sub-feature 2
    - Sub-feature 3 ↔ Sub-feature 4 (parallel)
    
    ## Notes
    - [Any additional notes or considerations]
    ```

    **Format Rules:**
    -   Use tree characters (`├──`, `└──`) for visual hierarchy.
    -   **CRITICAL:** Only ONE level of sub-features allowed (no nested sub-features).
    -   Use `@serial` to mark features that must be done in sequence.
    -   Use `@parallel(FeatureName)` to mark features that can run in parallel.
    -   Include a **Feature Clarifications** section with Goal, Scope, and Key Deliverables for each sub-feature.
    -   Include a Dependencies section summarizing the feature order.
    -   Include a Notes section for any additional context.

2.  **User Confirmation:** Present the drafted feature tree:
    > "I've drafted the complete feature breakdown. Please review:
    > 
    > ```
    > [Feature tree content]
    > ```
    > 
    > What would you like to do?
    > 
    > A) Approve and save this feature tree
    > B) Modify the structure
    > C) Start over with different features
    > D) Describe your changes
    > 
    > Please respond with A, B, C, or D."

3.  **Revision Loop:** Based on user response:
    -   Apply changes and re-present until approved.

### 2.5 Save Feature Tree

1.  **Generate File Name:** Create a unique file name based on the feature:
    -   Format: `features_[feature-shortname]_[YYYYMMDD].md`
    -   Example: `features_api-middleware_20250115.md`

2.  **Determine Save Location:**
    -   Default location: `specs/features/`
    -   If directory doesn't exist, create it: `mkdir -p specs/features`

3.  **Write File:** Save the feature tree to `specs/features/[filename].md`.

4.  **Announce Completion:**
    > "Feature tree has been saved to `specs/features/[filename].md`.
    > 
    > **Next Steps:**
    > - Use `sdd-new-feature` to create detailed specifications for individual sub-features
    > - Start with the first serial sub-feature or any parallel sub-features that have no dependencies
    > 
    > Would you like to:
    > 
    > A) Start another feature breakdown
    > B) Proceed to `sdd-new-feature` for a specific sub-feature
    > C) End this session
    > 
    > Please respond with A, B, or C."

---

## 3.0 EXAMPLE INTERACTION

**Example: Requesting Context Files**
> AI: "Please specify which files I should read:
> A) Specify architecture document(s)
> B) Specify requirements document(s)
> C) Specify both
> D) List the files yourself"
>
> User: "C) specs/architecture/api-design.md and specs/requirements/engineering/ER-001.md"
>
> AI: "I've read the documents. Key points: [summary]..."

**Example: Feature Breakdown**
> User: "I want to add the API framework with authentication and caching middleware."
>
> AI: "Here's my proposed feature breakdown:
> 
> ```
> API Framework Implementation
> ├── Core API Framework @serial
> ├── Auth Middleware @parallel(Caching Middleware)
> └── Caching Middleware @parallel(Auth Middleware)
> ```
> 
> Note: Auth and Caching can be developed in parallel since they're independent.
> 
> A) Approve this breakdown
> B) Modify the structure
> C) Add or remove sub-features
> D) Describe your own changes"

---

## 4.0 OUTPUT FORMAT REFERENCE

### 4.1 Tree Structure Symbols
- `├──` : Branch with siblings below
- `└──` : Last branch (no siblings below)

### 4.2 Dependency Markers
- `@serial` : Must be completed before the next feature at the same level
- `@parallel(FeatureName)` : Can be executed simultaneously with the specified feature
- `@depends(FeatureName)` : Explicitly depends on another feature's completion
- `@optional` : Feature is optional and can be skipped

### 4.3 Feature Metadata (Optional)
Features can include metadata in brackets:
- `[estimate: 2d]` : Estimated time
- `[priority: high]` : Priority level
- `[assignee: @name]` : Assigned person
- `[blocked]` : Currently blocked

Example:
```
├── Auth Middleware @serial [estimate: 3d] [priority: high]
```

### 4.4 Hierarchy Constraint
**CRITICAL:** The feature tree MUST have only ONE level of depth:
- ✅ Correct: `Root Feature → Sub-feature`
- ❌ Wrong: `Root Feature → Sub-feature → Sub-sub-feature`

If more granularity is needed, use `sdd-new-feature` to break down individual sub-features into tasks.
