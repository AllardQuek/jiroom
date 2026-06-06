---
name: sdd-setup
description: Scaffolds the project and sets up the Spec-driven development environment
---

## 1.0 SYSTEM DIRECTIVE
You are an AI agent. Your primary function is to set up and manage a software project using the Spec-driven development methodology. This document is your operational protocol. Adhere to these instructions precisely and sequentially. Do not make assumptions.

CRITICAL: You must validate the success of every tool call. If any tool call fails, you MUST halt the current operation immediately, announce the failure to the user, and await further instructions.

---
## 1.1 BEGIN `RESUME` CHECK
**PROTOCOL: Before starting the setup, determine the project's state using the state file.**

1.  **Read State File:** Check for the existence of `specs/setup_state.json`.
    - If it does not exist, this is a new project setup. Proceed directly to Step 1.2.
    - If it exists, read its content.

2.  **Resume Based on State:**
    - Let the value of `last_successful_step` in the JSON file be `STEP`.
    - Based on the value of `STEP`, jump to the **next logical section**:

    - If `STEP` is "2.1_product_guide", announce "Resuming setup: The Product Guide (`product.md`) is already complete. Next, we will create the Product Guidelines." and proceed to **Section 2.2**.
    - If `STEP` is "2.2_product_guidelines", announce "Resuming setup: The Product Guide and Product Guidelines are complete. Next, we will define the Technology Stack." and proceed to **Section 2.3**.
    - If `STEP` is "2.3_tech_stack", announce "Resuming setup: The Product Guide, Guidelines, and Tech Stack are defined. Next, we will select Code Styleguides." and proceed to **Section 2.4**.
    - If `STEP` is "2.4_code_styleguides", announce "Resuming setup: All guides and the tech stack are configured. Next, we will set up the specs directory structure." and proceed to **Section 2.5**.
    - If `STEP` is "2.5_specs_structure", announce "Resuming setup: The specs directory structure is configured. Setup is complete." and proceed to **Section 2.6**.
    - If `STEP` is unrecognized, announce an error and halt.

## 1.2 PRE-INITIALIZATION OVERVIEW
1.  **Provide High-Level Overview:**
    -   Present the following overview of the initialization process to the user:
        > "Welcome to Spec-driven development. I will guide you through the following steps to set up your project:
        > 1. **Project Discovery:** Analyze the current directory to determine if this is a new or existing project.
        > 2. **Product Definition:** Collaboratively define the product's vision, design guidelines, and technology stack.
        > 3. **Configuration:** Select appropriate code style guides.
        >
        > Let's get started!"

---

## 2.0 PHASE 1: STREAMLINED PROJECT SETUP
**PROTOCOL: Follow this sequence to perform a guided, interactive setup with the user.**


### 2.0 Project Inception
1.  **Detect Project Maturity:**
    -   **Classify Project:** Determine if the project is "Brownfield" (Existing) or "Greenfield" (New) based on the following indicators:
    -   **Brownfield Indicators:**
        -   Check for existence of version control directories: `.git`, `.svn`, or `.hg`.
        -   If a `.git` directory exists, execute `git status --porcelain`. If the output is not empty, classify as "Brownfield" (dirty repository).
        -   Check for dependency manifests: `package.json`, `pom.xml`, `requirements.txt`, `go.mod`.
        -   Check for source code directories: `src/`, `app/`, `lib/` containing code files.
        -   If ANY of the above conditions are met (version control directory, dirty git repo, dependency manifest, or source code directories), classify as **Brownfield**.
    -   **Greenfield Condition:**
        -   Classify as **Greenfield** ONLY if NONE of the "Brownfield Indicators" are found AND the current directory is empty or contains only generic documentation (e.g., a single `README.md` file) without functional code or dependencies.

2.  **Execute Workflow based on Maturity:**

    - **If Brownfield:**
        - Announce that an existing project has been detected.
        - If the `git status --porcelain` command (executed as part of Brownfield Indicators) indicated uncommitted changes, inform the user: "WARNING: You have uncommitted changes in your Git repository. Please commit or stash your changes before proceeding, as SDD will be making modifications."
        - **Begin Brownfield Project Initialization Protocol:**

            - **1.0 Pre-analysis Confirmation:**

                1. **Request Permission:** Inform the user that a brownfield (existing) project has been detected.
                2. **Ask for Permission:** Request permission for a read-only scan to analyze the project with the following options using the next structure:

                    > A) Yes
                    > B) No
                    >
                    > Please respond with A or B.

                3. **Handle Denial:** If permission is denied, halt the process and await further user instructions.
                4. **Confirmation:** Upon confirmation, proceed to the next step.

            - **2.0 Code Analysis:**

                1. **Announce Action:** Inform the user that you will now perform a code analysis.
                2. **Prioritize README:** Begin by analyzing the `README.md` file, if it exists.
                3. **Comprehensive Scan:** Extend the analysis to other relevant files to understand the project's purpose, technologies, and conventions.

            - **2.1 File Size and Relevance Triage:**

                1. **Respect Ignore Files:** Before scanning any files, you MUST check for the existence of `.gitignore` files. If either or both exist, you MUST use their combined patterns to exclude files and directories from your analysis. 
                2. **Efficiently List Relevant Files:** To list the files for analysis, you MUST use a command that respects the ignore files. For example, you can use `git ls-files --exclude-standard -co | xargs -n 1 dirname | sort -u` which lists all relevant directories (tracked by Git, plus other non-ignored files) without listing every single file. If Git is not used, you must construct a `find` command that reads the ignore files and prunes the corresponding paths.
                3. **Fallback to Manual Ignores:** ONLY if `.gitignore` exist, you should fall back to manually ignoring common directories. Example command: `ls -lR -I 'node_modules' -I '.m2' -I 'build' -I 'dist' -I 'bin' -I 'target' -I '.git' -I '.idea' -I '.vscode'`.
                4. **Prioritize Key Files:** From the filtered list of files, focus your analysis on high-value, low-size files first, such as `package.json`, `pom.xml`, `requirements.txt`, `go.mod`, and other configuration or manifest files.
                5. **Handle Large Files:** For any single file over 1MB in your filtered list, DO NOT read the entire file. Instead, read only the first and last 20 lines (using `head` and `tail`) to infer its purpose.

            - **2.2 Extract and Infer Project Context:**

                1. **Strict File Access:** DO NOT ask for more files. Base your analysis SOLELY on the provided file snippets and directory structure.
                2. **Extract Tech Stack:** Analyze the provided content of manifest files to identify:
                    - Programming Language
                    - Frameworks (frontend and backend)
                    - Database Drivers
                3. **Infer Architecture:** Use the file tree skeleton (top 2 levels) to infer the architecture type (e.g., Monorepo, Microservices, MVC).
                4. **Infer Project Goal:** Summarize the project's goal in one sentence based strictly on the provided `README.md` header or `package.json` description.

        - **Upon completing the brownfield initialization protocol, proceed to the Generate Product Guide section in 2.1.**
    - **If Greenfield:**
        - Announce that a new project will be initialized.
        - Proceed to the next step in this file.

3.  **Initialize Git Repository (for Greenfield):**
    -   If a `.git` directory does not exist, execute `git init` and report to the user that a new Git repository has been initialized.

4.  **Inquire about Project Goal (for Greenfield):**
    -   **Ask the user the following question and wait for their response before proceeding to the next step:** "What do you want to build?"
    -   **CRITICAL: You MUST NOT execute any tool calls until the user has provided a response.**
    -   **Upon receiving the user's response:**
        -   Execute `mkdir -p specs`.
        -   **Initialize State File:** Immediately after creating the `specs` directory, you MUST create `specs/setup_state.json` with the exact content:
            `{"last_successful_step": ""}`
        -   Write the user's response into `specs/product.md` under a header named `# Initial Concept`.

5.  **Continue:** Immediately proceed to the next section.

### 2.1 Generate Product Guide (Interactive)
1.  **Introduce the Section:** Announce that you will now help the user create the `product.md`.
2.  **Ask Questions Sequentially:** Ask one question at a time. Wait for and process the user's response before asking the next question. Continue this interactive process until you have gathered enough information.

    - **CONSTRAINT:** Limit your inquiry to a maximum of 5 questions.
    - **SUGGESTIONS:** For each question, generate 3 high-quality suggested answers based on common patterns or context you already have.
    - **Example Topics:** Target users, goals, features, etc
    - **General Guidelines:**

        - **1. Classify Question Type:** Before formulating any question, you MUST first classify its purpose as either "Additive" or "Exclusive Choice".
            - Use **Additive** for brainstorming and defining scope (e.g., users, goals, features, project guidelines). These questions allow for multiple answers.
            - Use **Exclusive Choice** for foundational, singular commitments (e.g., selecting a primary technology, a specific workflow rule). These questions require a single answer.

        - **2. Formulate the Question:** Based on the classification, you MUST adhere to the following:
            - **If Additive:** Formulate an open-ended question that encourages multiple points. You MUST then present a list of options and add the exact phrase "(Select all that apply)" directly after the question.
            - **If Exclusive Choice:** Formulate a direct question that guides the user to a single, clear decision. You MUST NOT add "(Select all that apply)".

        - **3. Interaction Flow:**
            - **CRITICAL:** You MUST ask questions sequentially (one by one). Do not ask multiple questions in a single turn. Wait for the user's response after each question.
            - The last two options for every multiple-choice question MUST be "Type your own answer", and "Autogenerate and review product.md".
            - Confirm your understanding by summarizing before moving on.

        - **Format:** You MUST present these as a vertical list, with each option on its own line.
        - **Structure:**

            ```
            A) [Option A]
            B) [Option B]
            C) [Option C]
            D) [Type your own answer]
            E) [Autogenerate and review product.md]
            ```
    -   **FOR EXISTING PROJECTS (BROWNFIELD):** Ask project context-aware questions based on the code analysis.
    -   **AUTO-GENERATE LOGIC:** If the user selects option E, immediately stop asking questions for this section. Use your best judgment to infer the remaining details based on previous answers and project context, generate the full `product.md` content, write it to the file, and proceed to the next section.
3.  **Draft the Document:** Once the dialogue is complete (or option E is selected), generate the content for `product.md`. If option E was chosen, use your best judgment to infer the remaining details based on previous answers and project context. You are encouraged to expand on the gathered details to create a comprehensive document.
    -   **CRITICAL:** The source of truth for generation is **only the user's selected answer(s)**. You MUST completely ignore the questions you asked and any of the unselected `A/B/C` options you presented.
        -   **Action:** Take the user's chosen answer and synthesize it into a well-formed section for the document. You are encouraged to expand on the user's choice to create a comprehensive and polished output. DO NOT include the conversational options (A, B, C, D, E) in the final file.
4.  **User Confirmation Loop:** Present the drafted content to the user for review and begin the confirmation loop.
    > "I've drafted the product guide. Please review the following:"
    >
    > ```markdown
    > [Drafted product.md content here]
    > ```
    >
    > "What would you like to do next?
    > A) **Approve:** The document is correct and we can proceed.
    > B) **Suggest Changes:** Tell me what to modify.
    >

    > Please respond with A or B."
    - **Loop:** Based on user response, either apply changes and re-present the document, or break the loop on approval.
5.  **Write File:** Once approved, append the generated content to the existing `specs/product.md` file, preserving the `# Initial Concept` section.
6.  **Commit State:** Upon successful creation of the file, you MUST immediately write to `specs/setup_state.json` with the exact content:
    `{"last_successful_step": "2.1_product_guide"}`
7.  **Continue:** After writing the state file, immediately proceed to the next section.

### 2.2 Generate Product Guidelines (Interactive)
1.  **Introduce the Section:** Announce that you will now help the user create the `product-guidelines.md`.
2.  **Ask Questions Sequentially:** Ask one question at a time. Wait for and process the user's response before asking the next question. Continue this interactive process until you have gathered enough information.

    - **CONSTRAINT:** Limit your inquiry to a maximum of 5 questions.
    - **SUGGESTIONS:** For each question, generate 3 high-quality suggested answers based on common patterns or context you already have. Provide a brief rationale for each and highlight the one you recommend most strongly.
    - **Example Topics:** Prose style, brand messaging, visual identity, etc
    - **General Guidelines:**

        - **1. Classify Question Type:** Before formulating any question, you MUST first classify its purpose as either "Additive" or "Exclusive Choice".
            - Use **Additive** for brainstorming and defining scope (e.g., users, goals, features, project guidelines). These questions allow for multiple answers.
            - Use **Exclusive Choice** for foundational, singular commitments (e.g., selecting a primary technology, a specific workflow rule). These questions require a single answer.

        - **2. Formulate the Question:** Based on the classification, you MUST adhere to the following:
            - **Suggestions:** When presenting options, you should provide a brief rationale for each and highlight the one you recommend most strongly.
            - **If Additive:** Formulate an open-ended question that encourages multiple points. You MUST then present a list of options and add the exact phrase "(Select all that apply)" directly after the question.
            - **If Exclusive Choice:** Formulate a direct question that guides the user to a single, clear decision. You MUST NOT add "(Select all that apply)".

        - **3. Interaction Flow:**
            - **CRITICAL:** You MUST ask questions sequentially (one by one). Do not ask multiple questions in a single turn. Wait for the user's response after each question.
            - The last two options for every multiple-choice question MUST be "Type your own answer" and "Autogenerate and review product-guidelines.md".
            - Confirm your understanding by summarizing before moving on.

        - **Format:** You MUST present these as a vertical list, with each option on its own line.
        - **Structure:**

            ```
            A) [Option A]
            B) [Option B]
            C) [Option C]
            D) [Type your own answer]
            E) [Autogenerate and review product-guidelines.md]
            ```

    - **AUTO-GENERATE LOGIC:** If the user selects option E, immediately stop asking questions for this section and proceed to the next step to draft the document.
3.  **Draft the Document:** Once the dialogue is complete (or option E is selected), generate the content for `product-guidelines.md`. If option E was chosen, use your best judgment to infer the remaining details based on previous answers and project context. You are encouraged to expand on the gathered details to create a comprehensive document.
     **CRITICAL:** The source of truth for generation is **only the user's selected answer(s)**. You MUST completely ignore the questions you asked and any of the unselected `A/B/C` options you presented.
    -   **Action:** Take the user's chosen answer and synthesize it into a well-formed section for the document. You are encouraged to expand on the user's choice to create a comprehensive and polished output. DO NOT include the conversational options (A, B, C, D, E) in the final file.
4.  **User Confirmation Loop:** Present the drafted content to the user for review and begin the confirmation loop.
    > "I've drafted the product guidelines. Please review the following:"
    >
    > ```markdown
    > [Drafted product-guidelines.md content here]
    > ```
    >
    > "What would you like to do next?
    > A) **Approve:** The document is correct and we can proceed.
    > B) **Suggest Changes:** Tell me what to modify.
    >

    > Please respond with A or B."
    - **Loop:** Based on user response, either apply changes and re-present the document, or break the loop on approval.
5.  **Write File:** Once approved, write the generated content to the `specs/product-guidelines.md` file.
6.  **Commit State:** Upon successful creation of the file, you MUST immediately write to `specs/setup_state.json` with the exact content:
    `{"last_successful_step": "2.2_product_guidelines"}`
7.  **Continue:** After writing the state file, immediately proceed to the next section.

### 2.3 Generate Tech Stack (Interactive)
1.  **Introduce the Section:** Announce that you will now help define the technology stacks.
2.  **Ask Questions Sequentially:** Ask one question at a time. Wait for and process the user's response before asking the next question. Continue this interactive process until you have gathered enough information.

    - **CONSTRAINT:** Limit your inquiry to a maximum of 5 questions.
    - **SUGGESTIONS:** For each question, generate 3 high-quality suggested answers based on common patterns or context you already have.
    - **Example Topics:** programming languages, frameworks, databases, etc
    - **General Guidelines:**

        - **1. Classify Question Type:** Before formulating any question, you MUST first classify its purpose as either "Additive" or "Exclusive Choice".
            - Use **Additive** for brainstorming and defining scope (e.g., users, goals, features, project guidelines). These questions allow for multiple answers.
            - Use **Exclusive Choice** for foundational, singular commitments (e.g., selecting a primary technology, a specific workflow rule). These questions require a single answer.

        - **2. Formulate the Question:** Based on the classification, you MUST adhere to the following:
            - **Suggestions:** When presenting options, you should provide a brief rationale for each and highlight the one you recommend most strongly.
            - **If Additive:** Formulate an open-ended question that encourages multiple points. You MUST then present a list of options and add the exact phrase "(Select all that apply)" directly after the question.
            - **If Exclusive Choice:** Formulate a direct question that guides the user to a single, clear decision. You MUST NOT add "(Select all that apply)".

        - **3. Interaction Flow:**
            - **CRITICAL:** You MUST ask questions sequentially (one by one). Do not ask multiple questions in a single turn. Wait for the user's response after each question.
            - The last two options for every multiple-choice question MUST be "Type your own answer" and "Autogenerate and review tech-stack.md".
            - Confirm your understanding by summarizing before moving on.

        - **Format:** You MUST present these as a vertical list, with each option on its own line.
        - **Structure:**

            ```
            A) [Option A]
            B) [Option B]
            C) [Option C]
            D) [Type your own answer]
            E) [Autogenerate and review tech-stack.md]
            ```

    - **FOR EXISTING PROJECTS (BROWNFIELD):**
        - **CRITICAL WARNING:** Your goal is to document the project's *existing* tech stack, not to propose changes.
        - **State the Inferred Stack:** Based on the code analysis, you MUST state the technology stack that you have inferred. Do not present any other options.
        - **Request Confirmation:** After stating the detected stack, you MUST ask the user for a simple confirmation to proceed with options like:

            ```
            A) Yes, this is correct.
            B) No, I need to provide the correct tech stack.
            ```

        - **Handle Disagreement:** If the user disputes the suggestion, acknowledge their input and allow them to provide the correct technology stack manually as a last resort.

    - **AUTO-GENERATE LOGIC:** If the user selects option E, immediately stop asking questions for this section. Use your best judgment to infer the remaining details based on previous answers and project context, generate the full `tech-stack.md` content, write it to the file, and proceed to the next section.
3.  **Draft the Document:** Once the dialogue is complete (or option E is selected), generate the content for `tech-stack.md`. If option E was chosen, use your best judgment to infer the remaining details based on previous answers and project context. You are encouraged to expand on the gathered details to create a comprehensive document.
    -   **CRITICAL:** The source of truth for generation is **only the user's selected answer(s)**. You MUST completely ignore the questions you asked and any of the unselected `A/B/C` options you presented.
    -   **Action:** Take the user's chosen answer and synthesize it into a well-formed section for the document. You are encouraged to expand on the user's choice to create a comprehensive and polished output. DO NOT include the conversational options (A, B, C, D, E) in the final file.
4.  **User Confirmation Loop:** Present the drafted content to the user for review and begin the confirmation loop.
    > "I've drafted the tech stack document. Please review the following:"
    >
    > ```markdown
    > [Drafted tech-stack.md content here]
    > ```
    >
    > "What would you like to do next?
    > A) **Approve:** The document is correct and we can proceed.
    > B) **Suggest Changes:** Tell me what to modify.
    >
    > Please respond with A or B."
    - **Loop:** Based on user response, either apply changes and re-present the document, or break the loop on approval.
6.  **Write File:** Once approved, write the generated content to the `specs/tech-stack.md` file.
7.  **Commit State:** Upon successful creation of the file, you MUST immediately write to `specs/setup_state.json` with the exact content:
    `{"last_successful_step": "2.3_tech_stack"}`
8.  **Continue:** After writing the state file, immediately proceed to the next section.

### 2.4 Select Guides (Interactive)
1.  **Initiate Dialogue:** Announce that the initial scaffolding is complete and you now need the user's input to select the project's guides from the locally available templates.
2.  **Select Code Style Guides:**
    -   List the available style guides by running `ls <skill_dir>/templates/code_styleguides/`.
    -   For new projects (greenfield):
        -   **Recommendation:** Based on the Tech Stack defined in the previous step, recommend the most appropriate style guide(s) and explain why.
        -   Ask the user how they would like to proceed:
            A) Include the recommended style guides.
            B) Edit the selected set.
        -   If the user chooses to edit (Option B):
            -   Present the list of all available guides to the user as a **numbered list**.
            -   Ask the user which guide(s) they would like to copy.
    -   For existing projects (brownfield):
        -   **Announce Selection:** Inform the user: "Based on the inferred tech stack, I will copy the following code style guides: <list of inferred guides>."
        -   **Ask for Customization:** Ask the user: "Would you like to proceed using only the suggested code style guides?"
            - Ask the user for a simple confirmation to proceed with options like:
                    A) Yes, I want to proceed with the suggested code style guides.
                    B) No, I want to add more code style guides.
    -   **Action:** Construct and execute a command to create the directory and copy all selected files. For example: `mkdir -p <working_dir>/specs/code_styleguides && cp templates/code_styleguides/python.md templates/code_styleguides/javascript.md <working_dir>/specs/code_styleguides/`
    -   **Commit State:** Upon successful completion of the copy command, you MUST immediately write to `spec/setup_state.json` with the exact content:
        `{"last_successful_step": "2.4_code_styleguides"}`



### 2.5 Initialize Specs Directory Structure (Interactive)
1.  **Introduce the Section:** Announce that you will now help the user set up the specs directory structure for organizing project documentation.
2.  **Create Specs Subdirectories:**
    -   Execute the following command to create all documentation directories:
        ```bash
        mkdir -p specs/requirements/business \
                 specs/requirements/engineering \
                 specs/non-functional/product \
                 specs/non-functional/engineering \
                 specs/architecture \
                 specs/features \
                 specs/quality/test-plans \
                 specs/environments
        ```
    -   Report to the user that the directories have been created.
3.  **Interactive Template Selection:**
    -   Present the following question to the user:
        > "I've created the specs directory structure. Would you like me to create template files in each directory to help you get started?
        >
        > A) **Yes, create all templates** - Create template files in all directories
        > B) **Select specific categories** - Choose which categories should have templates
        > C) **Skip templates** - I'll create my own documentation later
        >
        > Please respond with A, B, or C."
    -   **If Option A (Create all templates):**
        -   Copy the following template files from `<skill_dir>/templates/specs_templates/` to the corresponding directories:
            -   **Requirements:**
                -   `requirements/business/business-requirement-template.md` → `specs/requirements/business/BR-TEMPLATE.md`
                -   `requirements/engineering/engineering-requirement-template.md` → `specs/requirements/engineering/ER-TEMPLATE.md`
            -   **Non-Functional:**
                -   `non-functional/product/scale-template.md` → `specs/non-functional/product/scale.md`
                -   `non-functional/product/performance-template.md` → `specs/non-functional/product/performance.md`
                -   `non-functional/product/security-template.md` → `specs/non-functional/product/security.md`
                -   `non-functional/engineering/engineering-non-functional-scale-template.md` → `specs/non-functional/engineering/scale.md`
                -   `non-functional/engineering/engineering-non-functional-security-template.md` → `specs/non-functional/engineering/security.md`
            -   **Architecture:**
                -   `architecture/design-hld-template.md` → `specs/architecture/COMPONENT-TEMPLATE/design_hld.md`
            -   **Features:**
                -   `features-spec-template.md` → `specs/features/FEATURE-TEMPLATE/spec.md`
            -   **Quality:**
                -   `quality-test-plan-template.md` → `specs/quality/test-plans/FVT-TEMPLATE.md`
            -   **Environments:**
                -   `environments/dev-env-template.md` → `specs/environments/dev_env.md`
                -   `environments/lab-env-template.md` → `specs/environments/lab_env.md`
        -   Report the created files to the user.
    -   **If Option B (Select specific categories):**
        -   Present a numbered list of available template categories:
            > "Which template categories would you like to create? (Select all that apply, e.g., '1,3,5')
            >
            > 1) **Requirements - Business** - Business requirement (BR) document template
            > 2) **Requirements - Engineering** - Engineering requirement (ER) document template
            > 3) **Non-Functional - Product** - Product non-functional specs (scale, performance, security)
            > 4) **Non-Functional - Engineering** - Engineering non-functional specs
            > 5) **Architecture** - High Level Design (HLD) template
            > 6) **Features** - Feature specification template
            > 7) **Quality** - FVT (Functional Verification Test) plan template
            > 8) **Environments** - Development and Lab environment specs"
        -   Based on user selection, copy only the selected templates.
        -   Report the created files to the user.
    -   **If Option C (Skip templates):**
        -   Acknowledge the user's choice and proceed to the next step.
4.  **Commit State:** Upon successful completion, you MUST immediately write to `specs/setup_state.json` with the exact content:
    `{"last_successful_step": "2.5_specs_structure"}`
5.  **Continue:** After writing the state file, immediately proceed to the next section.

### 2.6 Finalization
1.  **Summarize Actions:** Present a summary of all actions taken during Phase 1, including:
    -   The guide files that were copied.
    -   The workflow file that was copied.
    -   The specs directories and templates that were created (if any).
2.  **Transition to initial plan and feature generation:** Announce that the initial setup is complete.