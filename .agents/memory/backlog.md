# DocuKelo Platform Backlog

This checklist tracks future features and tools proposed to extend the visual, interactive, and authoring capabilities of the DocuKelo documentation platform.

## Authoring & Creator Tools
- [ ] **1. Interactive Content Scaffolder CLI**: A command-line script (e.g., `npm run scaffold-week`) to automatically generate new week directories, `_category_.json` files, and `.mdx` templates.
- [ ] **2. MDX Syntax Linter Hook**: A Git pre-commit hook that checks modified `.mdx` files for unescaped characters or formatting issues.
- [ ] **3. Translation Automation Utility**: A local utility to translate memory and skill documents under `agents/` to English automatically.
- [ ] **4. Mermaid SVG Pre-compiler**: A build-time tool that renders Mermaid diagrams into static SVGs during compilation for optimized page loads.
- [ ] **5. Asset Dependency Tracker**: A script that scans static assets (`static/img/` and `static/files/`) and flags or cleans up unused files.

## Interactive Learning Components
- [ ] **6. In-page Live Code REPL**: A custom MDX component (`<InteractiveConsole />`) using WebAssembly (like Pyodide or Web-compiled Dart) to run code snippets in-page.
- [ ] **7. Custom Self-Assessment Quizzes**: An MDX `<Quiz>` / `<Question>` component supporting inline assessments with explanations. *(Currently in planning stage)*.
- [ ] **8. E2E Testing System**: An end-to-end testing suite (e.g., Playwright) that crawls all pages and documentation files to ensure no rendering errors, broken layouts, or broken links exist.
- [ ] **9. In-Browser SQLite Playground**: An interactive SQL console (using `sql.js`) for running database queries directly within MDX documents.
- [ ] **10. Interactive Git Simulator**: A visual widget simulating Git operations and rendering dynamic Git Trees in real time.
- [ ] **11. Mock API Explorer**: An embedded wrapper to test API requests against local targets (`http://localhost:8080`) or mock servers.
- [ ] **12. Gamified Progress Tracker**: A LocalStorage-based checklist tracking student progress and showing completion states on category pages.

## Visual Repertoire & Theme Extensions
- [ ] **13. Split-Screen Code Walkthrough**: A side-by-side split layout component displaying instructions on one side and a scroll-linked code snippet on the other.
- [ ] **14. Tech Stack Interactive Map**: An animated nodes diagram representing course architectures (frontend/backend/DB) with clickable configuration details.
- [ ] **15. Custom Icesi-branded Callouts**: Extended Docusaurus admonition styling for tags like `:::design-tip`, `:::grading-rubric`, etc.
- [ ] **16. Theme-aware SVGs / Image Switcher**: A utility component swapping image assets or SVG styling depending on light/dark mode settings.
- [ ] **17. Simulated Terminal Session Player**: An aesthetic terminal shell animator simulating command line executions.

## System Integrations
- [ ] **18. Docusaurus AI Assistant Widget**: An AI assistant widget trained on the docs to help students troubleshoot issues.
- [ ] **19. GitHub Classroom Dashboard**: A dashboard widget displaying assignment deadlines and GitHub submission statuses.
- [ ] **20. LTI Integration for LMS**: Connecting the platform to Moodle/Canvas via LTI protocols to sync student course progression.
