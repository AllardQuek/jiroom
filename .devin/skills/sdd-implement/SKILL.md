---
name: sdd-implement
description: Executes the tasks defined in the specified feature's plan
---

## 1.0 SYSTEM DIRECTIVE
You are an AI agent assistant for the spec-driven development framework. Your current task is to implement a feature. You MUST follow this protocol precisely.

CRITICAL: You must validate the success of every tool call. If any tool call fails, you MUST halt the current operation immediately, announce the failure to the user, and await further instructions.

## 1.1 SETUP CHECK
**PROTOCOL: Verify that the spec-driven development environment is properly set up.**

1.  **Verify Core Context:** Resolve and verify the existence of:
    -   **Product Definition** (e.g. `specs/product-guidelines.md`)
    -   **Tech Stack** (e.g. `specs/tech-stack.md`)
2.  **Check Go Installation:** Verify that Go is installed and available in the PATH.
    -   Run `go version` to check if Go is installed
    -   If Go is not found:
        - **On Windows:** Announce: "Go is not installed. Please download and install Go from https://golang.org/dl/ and follow the Windows installation instructions. After installation, restart your terminal and try again." Then HALT.
        - **On Linux/Ubuntu:** 
            1. Announce: "Go is not installed. Automatically running the environment setup script to install Go and other dependencies..."
            2. Execute: `bash tutorials/01-quick-start/scripts/setup-env.sh`
            3. If the script succeeds, verify Go installation with `go version` and continue
            4. If the script fails, announce the error and HALT.
3.  **Handle Failure:** If ANY of the core context files are missing (or their resolved paths do not exist), Announce: "spec-driven development is not set up. Please run `sdd-setup` agent skill." and HALT.

---

## 2.0 FEATURE SELECTION
**PROTOCOL: Identify and select the feature to be implemented.**

1.  **Check for User Input:** First, check if the user provided a ferature name as context (e.g., `sdd-implement <feature_name>`).

2.  **Locate and Parse Features Registry:**
    -   Resolve the **Features Registry** (e.g. `specs/features/README.md`).
    -   Read and parse this file. You must parse the file by splitting its content by the `---` separator to identify each feature section. For each section, extract the status (`[ ]`, `[~]`, `[x]`), the feature description (from the `##` heading), and the link to the feature folder.
    -   **CRITICAL:** If no feature sections are found after parsing, announce: "The features file is empty or malformed. No features to implement." and halt.

3.  **Continue:** Immediately proceed to the next step to select a feature.

4.  **Select feature:**
    -   **If a Feature name was provided:**
        1.  Perform an exact, case-insensitive match for the provided name against the feature descriptions you parsed.
        2.  If a unique match is found, confirm the selection with the user: "I found feature '<feature_description>'. Is this correct?"
        3.  If no match is found, or if the match is ambiguous, inform the user and ask for clarification. Suggest the next available feature as below.
    -   **If no feature name was provided (or if the previous step failed):**
        1.  **Identify Next feature:** Find the first feature in the parsed features file that is NOT marked as `[x] Completed`.
        2.  **If a next feature is found:**
            -   Announce: "No feature name provided. Automatically selecting the next incomplete feature: '<feature_description>'."
            -   Proceed with this feature.
        3.  **If no incomplete features are found:**
            -   Announce: "No incomplete features found in the features file. All tasks are completed!"
            -   Halt the process and await further user instructions.

5.  **Handle No Selection:** If no feature is selected, inform the user and await further instructions.

---

## 3.0 FEATURE IMPLEMENTATION
**PROTOCOL: Execute the selected feature.**

1.  **Announce Action:** Announce which feature you are beginning to implement.

2.  **Update Status to 'In Progress':**
    -   Before beginning any work, you MUST update the status of the selected feature in the **Features Registry** file.
    -   This requires finding the specific heading for the feature (e.g., `## [ ] feature: <Description>`) and replacing it with the updated status (e.g., `## [~] Feature: <Description>`) in the **Features Registry** file you identified earlier.

3.  **Load Feature Context:**

    - **a. Identify Feature Folder:** From the features file, identify the feature's folder link to get the `<feature_id>`.
    - **b. Read Files:**
        -   **Feature Context:** resolve and read the **Specification** and **Implementation Plan** for the selected feature.
        -   **Workflow:** MUST read `<skill_dir>/sdd-implement/reference/workflow.md` - this contains the detailed procedures you MUST follow.
    - **c. Error Handling:** If you fail to read any of these files, you MUST stop and inform the user of the error.

4.  **Confirm Code Directory:**
    -   First, check whether the user has provided where the feature's code directory is (i.e., where the code should be written).
    -   If this information is missing, you MUST stop and ask the user to provide the target code directory.

5.  **Execute Tasks and Update Feature Plan:**

    - **a. Announce:** State that you will now execute the tasks from the feature's **Implementation Plan**.
    - **b. Iterate Through Tasks:** You MUST now loop through each task in the feature's **Implementation Plan** one by one.
    - **c. For Each Task:** Follow the "Standard Task Workflow" in `workflow.md`. Key steps:

        1. Mark task `[~]` in `plan.md` before starting
        2. Update subtask status (`[ ]` → `[x]`) incrementally as you complete each
        3. Handle emergent tasks: stop, update `plan.md`, announce, then resume
        4. Record spec assumption deviations (report later during phase completion)
        5. Write failing tests first (Red), then implement (Green), then refactor
        6. Verify coverage >80%
        7. Commit code changes
        8. Verify ALL subtasks are `[x]` before marking task complete
        9. Update task status to `[x]` and record commit SHA in `plan.md`
        10. Commit plan update

    - **d. Phase Completion:** When a task concludes a phase, follow the "Phase Completion Verification" in `workflow.md`. Key steps:

        1. Announce phase completion
        2. Run automated tests (max 2 fix attempts if failing)
        3. Report spec assumption deviations and propose `spec.md` updates
        4. **Assess Manual Verification Need:** Evaluate if there are aspects that cannot be fully verified by automated tests (e.g., UI interactions, complex business flows, external integrations)
           - **If fully automated:** Verify all automated tests pass before proceeding. If some tests fail expectedly (e.g., known limitations, environment constraints, pending external dependencies), explain the reasons to the user. Only after confirming all tests either pass or have justified expected failures, announce that automated verifications are complete and skip manual verification.
           - **If manual verification needed:** Propose manual verification plan for only the non-automatable aspects, await user confirmation, then update `Task: User Manual Verification` to `[x]`
        5. Create checkpoint commit
        6. Record checkpoint SHA in `plan.md` phase heading
        7. Announce completion

6.  **Feature Alignment & Review:**

    **Purpose:** After all implementation tasks are complete, conduct a human-AI alignment session to ensure shared understanding of what was built, why decisions were made, and validate the feature meets expectations. This replaces per-phase manual verification with a single comprehensive review.

    - **a. Design Walkthrough:** Present to the user an engaging explanation of:
        - The technical architecture of this feature
        - How the code is structured and how various parts connect
        - Technologies used and why these technical decisions were made
        - Bugs encountered during implementation and how they were fixed
        - Potential pitfalls and how to avoid them in the future
        - Best practices applied and lessons learned

        **Writing Style:** Make this engaging to read, not like boring technical documentation. Use analogies and anecdotes where appropriate to make concepts more understandable and memorable.

    - **b. Interactive Demo:** Provide a walkthrough for the user to verify the feature:
        1. List all functionality implemented in this feature (based on `spec.md` and `plan.md`)
        2. For each functionality, provide:
           - Clear description of what it does
           - Specific commands or steps to test it
           - Expected results
        3. Focus on **mental alignment** - functionality already covered by automated tests does not need to be repeated here unless it helps understanding
        4. The goal is to help the user understand what was built, not comprehensive regression testing

        **Example Format:**
        ```
        ## Feature Demo: <Feature Name>

        ### 1. <Functionality A>
        **What it does:** [Description]
        **To verify:**
        1. Run: `<command>`
        2. Navigate to: `<path or URL>`
        3. You should see: `<expected result>`

        ### 2. <Functionality B>
        ...
        ```

    - **c. Await User Feedback:**
        - Ask: "Does this feature meet your expectations? Please try the demo steps above and confirm, or provide feedback on what needs to be changed."
        - **If user reports issues:** Update `plan.md` with new tasks to address the feedback, then continue executing those tasks before returning to this step.
        - **If user confirms:** Proceed to generate summary.

    - **d. Generate Summary Document:**
        - **CRITICAL: Document what WAS DONE, not what SHOULD BE done.**
          - DO NOT add assumptions, hypothetical scenarios, or speculative content
          - DO NOT suggest improvements or future enhancements
          - DO NOT include generic advice or boilerplate recommendations
          - ONLY describe what was actually implemented, decided, encountered, and verified
          - Include specific file paths and line numbers for reference
          - Every statement must be grounded in actual work performed during this feature

        - Create `<feature_folder>/summary.md` following this instruction:

            > Write a detailed summary.md file that explains this feature in plain language.
            >
            > Explain the technical architecture, the structure of the code and how the various parts are connected, the technologies used, why we made these technical decisions, and lessons learned from it (this should include the bugs we ran into and how we fixed them, potential pitfalls and how to avoid them in the future, new technologies used, how good engineers think and work, best practices, etc).
            >
            > It should be very engaging to read; don't make it sound like boring technical documentation/textbook. Where appropriate, use analogies and anecdotes to make it more understandable and memorable.

    - **e. Commit Summary:**
        - Stage `<feature_folder>/summary.md`
        - Commit with message: `docs(sdd): Add summary for feature '<feature_description>'`

7.  **Finalize Feature:**
    -   After all tasks in the feature's local **Implementation Plan** are completed, you MUST update the feature's status in the **Features Registry**.
    -   This requires finding the specific heading for the feature (e.g., `## [~] Feature: <Description>`) and replacing it with the completed status (e.g., `## [x] Feature: <Description>`).
    -   **Commit Changes:** Stage the **Features Registry** file and commit with the message `chore: Mark feature '<feature_description>' as complete`.
    -   Announce that the feature is fully complete and the features file has been updated.

---

## 5.0 SYNCHRONIZE PROJECT DOCUMENTATION
**PROTOCOL: Update project-level documentation based on the completed feature.**

1.  **Execution Trigger:** This protocol MUST only be executed when a feature has reached a `[x]` status in the features file. DO NOT execute this protocol for any other feature status changes.

2.  **Announce Synchronization:** Announce that you are now synchronizing the project-level documentation with the completed feature's specifications.

3.  **Load Feature Specification:** Read the feature's **Specification**.

4.  **Load Project Documents:**
    -   Resolve and read:
        -   **Product Definition**
        -   **Tech Stack**
        -   **Product Guidelines**
        -   **Architecture Document**

5.  **Analyze and Update:**
    - **a. Analyze Specification:** Carefully analyze the **Specification** to identify any new features, changes in functionality, or updates to the technology stack.
    - **b. Update Product Definition:**

        - i. **Condition for Update:** Based on your analysis, you MUST determine if the completed feature or bug fix significantly impacts the description of the product itself.
        - ii. **Propose and Confirm Changes:** If an update is needed, generate the proposed changes. Then, present them to the user for confirmation:

            > "Based on the completed feature, I propose the following updates to the **Product Definition**:"
            >
            > ```diff
            > [Proposed changes here, ideally in a diff format]
            > ```
            >
            > "Do you approve these changes? (yes/no)"

        - iii. **Action:** Only after receiving explicit user confirmation, perform the file edits to update the **Product Definition** file. Keep a record of whether this file was changed.
    - **c. Update Tech Stack:**

        - i. **Condition for Update:** Similarly, you MUST determine if significant changes in the technology stack are detected as a result of the completed feature.
        - ii. **Propose and Confirm Changes:** If an update is needed, generate the proposed changes. Then, present them to the user for confirmation:

            > "Based on the completed feat, I propose the following updates to the **Tech Stack**:"
            >
            > ```diff
            > [Proposed changes here, ideally in a diff format]
            > ```
            >
            > "Do you approve these changes? (yes/no)"

        - iii. **Action:** Only after receiving explicit user confirmation, perform the file edits to update the **Tech Stack** file. Keep a record of whether this file was changed.
    - **d. Update Product Guidelines (Strictly Controlled):**

        - i. **CRITICAL WARNING:** This file defines the core identity and communication style of the product. It should be modified with extreme caution and ONLY in cases of significant strategic shifts, such as a product rebrand or a fundamental change in user engagement philosophy. Routine feature updates or bug fixes should NOT trigger changes to this file.
        - ii. **Condition for Update:** You may ONLY propose an update to this file if the feature's **Specification** explicitly describes a change that directly impacts branding, voice, tone, or other core product guidelines.
        - iii. **Propose and Confirm Changes:** If the conditions are met, you MUST generate the proposed changes and present them to the user with a clear warning:

            > "WARNING: The completed feature suggests a change to the core **Product Guidelines**. This is an unusual step. Please review carefully:"
            >
            > ```diff
            > [Proposed changes here, ideally in a diff format]
            > ```
            >
            > "Do you approve these critical changes to the **Product Guidelines**? (yes/no)"

        - iv. **Action:** Only after receiving explicit user confirmation, perform the file edits. Keep a record of whether this file was changed.
    - **e. Update Architecture Documents (Strictly Controlled):**

        - i. **CRITICAL WARNING:** Architecture documents under `specs/architecture` define the system's structural design and technical decisions. They should be modified with extreme caution and ONLY when the completed feature introduces significant architectural changes (e.g., new components, modified data flows, updated system boundaries). Routine feature updates or bug fixes should NOT trigger changes to these files.
        - ii. **Identify Relevant Documents:** First, list all files under `specs/architecture` and identify which document(s) may be affected by the completed feature based on your analysis of the **Specification**.
        - iii. **Condition for Update:** You may ONLY propose an update if the feature's **Specification** explicitly describes a change that directly impacts the system architecture (e.g., new services, modified APIs, changed data models, updated component interactions).
        - iv. **Propose and Confirm Changes:** If the conditions are met, you MUST generate the proposed changes for each affected document and present them to the user with a clear warning:

            > "WARNING: The completed feature suggests changes to the **Architecture Document** `<filename>`. Please review carefully:"
            >
            > ```diff
            > [Proposed changes here, ideally in a diff format]
            > ```
            >
            > "Do you approve these changes to the architecture documentation? (yes/no)"

        - v. **Action:** Only after receiving explicit user confirmation, perform the file edits. Keep a record of which architecture files were changed.
        - vi. **User-Specified Updates:** After completing the above steps, ask the user: "Are there any other architecture documents under `specs/architecture` that you believe must be updated for this feature? Please specify the file name(s), or reply 'no' to proceed." If the user specifies additional documents, repeat steps iv and v for each. If the user replies 'no' or indicates none, proceed to the next step.

6.  **Final Report:** Announce the completion of the synchronization process and provide a summary of the actions taken.
    - **Construct the Message:** Based on the records of which files were changed, construct a summary message.
    - **Commit Changes:**
        - If any files were changed (**Product Definition**, **Tech Stack**, **Product Guidelines**, or **Architecture Documents**), you MUST stage them and commit them.
        - **Commit Message:** `docs(sdd): Synchronize docs for feature '<feature_description>'`
    - **Example (if Product Definition was changed, but others were not):**
        > "Documentation synchronization is complete.
        > - **Changes made to Product Definition:** The user-facing description of the product was updated to include the new feature.
        > - **No changes needed for Tech Stack:** The technology stack was not affected.
        > - **No changes needed for Product Guidelines:** Core product guidelines remain unchanged.
        > - **No changes needed for Architecture Documents:** System architecture remains unchanged."
    - **Example (if no files were changed):**
        > "Documentation synchronization is complete. No updates were necessary for project documents based on the completed feature."

## 6.0 FEATURE CLEANUP
**PROTOCOL: Offer to archive or delete the completed feature.**

1.  **Execution Trigger:** This protocol MUST only be executed after the current feature has been successfully implemented and the `SYNCHRONIZE PROJECT DOCUMENTATION` step is complete.

2.  **Ask for User Choice:** You MUST prompt the user with the available options for the completed feature.
    > "Feature '<feature_description>' is now complete. What would you like to do?
    > A.  **Archive:** Move the feature's folder to `specs/features/archive/` and remove it from the features file.
    > B.  **Delete:** Permanently delete the feature's folder and remove it from the features file.
    > C.  **Skip:** Do nothing and leave it in the features file.
    > Please enter the number of your choice (A, B, or C)."

3.  **Handle User Response:**
    *   **If user chooses "A" (Archive):**
        i.   **Create Archive Directory:** Check for the existence of `specs/features/archive/`. If it does not exist, create it.
        ii.  **Archive Feature Folder:** Move the feature's folder from its current location (resolved via the **Features Directory**) to `specs/features/archive/<feature_id>`.
        iii. **Remove from Features File:** Read the content of the **Features Registry** file, remove the entire section for the completed feature (the part that starts with `---` and contains the feature description), and write the modified content back to the file.
        iv.  **Commit Changes:** Stage the **Features Registry** file and `specs/features/archive/`. Commit with the message `chore(sdd): Archive feature '<feature_description>'`.
        v.   **Announce Success:** Announce: "Feature '<feature_description>' has been successfully archived."
    *   **If user chooses "B" (Delete):**
        i. **CRITICAL WARNING:** Before proceeding, you MUST ask for a final confirmation due to the irreversible nature of the action.
            > "WARNING: This will permanently delete the feature folder and all its contents. This action cannot be undone. Are you sure you want to proceed? (yes/no)"
        ii. **Handle Confirmation:**
            - **If 'yes'**:
                a. **Delete Feature Folder:** Resolve the **Features Directory** and permanently delete the feature's folder from `<Features Directory>/<feature_id>`.
                b. **Remove from Feature File:** Read the content of the **Features Registry** file, remove the entire section for the completed feature, and write the modified content back to the file.
                c. **Commit Changes:** Stage the **Features Registry** file and the deletion of the feature directory. Commit with the message `chore(sdd): Delete feature '<feature_description>'`.
                d. **Announce Success:** Announce: "Feature '<feature_description>' has been permanently deleted."
            - **If 'no' (or anything else)**:
                a. **Announce Cancellation:** Announce: "Deletion cancelled. The feature has not been changed."
    *   **If user chooses "C" (Skip) or provides any other input:**
        *   Announce: "Okay, the completed feature will remain in your features file for now."
"""