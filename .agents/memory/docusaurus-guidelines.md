# DocuKelo Docusaurus Project Guidelines and System Memory

This document serves as the primary system memory and development reference for any AI Agent or content creator contributing to the **DocuKelo** repository. 

---

## 1. Project Overview & Mission

**DocuKelo** is an academic documentation portal built using **Docusaurus** for the engineering and design departments at **Universidad Icesi**. Its goal is to provide students with structured, modern, and interactive learning guides, tutorials, and laboratory instructions.

The portal covers several courses, including:
- **Computación en Internet 2 & 3**: Focuses on backend engineering (Spring Boot, Node.js), frontend (React), containerization (Docker), testing, and software architectures.
- **Diseñando con Algoritmos / Desarrollo de Entornos Digitales Web**: Focuses on UI/UX, responsive layouts, web styling (CSS/Tailwind CSS), and frontend interaction.
- **IAG al Entorno**: Artificial Intelligence and Generative AI fundamentals.
- **Flutter**: Mobile application development.
- **Testing**: Quality assurance and automated testing practices.

---

## 2. Technical Stack & How It Works

DocuKelo is powered by **Docusaurus v3** (React & MDX) and uses a set of global customizations:
- **Automatic Sidebar Generation**: The sidebar is configured dynamically in `sidebars.js` to mirror the physical file structure under the `docs/` directory (`dirName: '.'`). Folder naming and alphabetical/explicit sorting govern order.
- **MDX (Markdown + React)**: Enables embedding interactive React components directly in Markdown files without manual imports (components are globally registered in `src/theme/MDXComponents.js`).
- **Styling**: Leverages Infima CSS (Docusaurus default) alongside custom React components styled for clean, readable layout presentations.

---

## 3. Directory Structure

Understanding the layout of the repository is critical for adding content correctly:

```
docukelo-icesi/
├── .agents/                      # AI Agent Configurations & Custom Skills
│   ├── memory/                   # System memory docs (e.g., this file)
│   └── skills/                   # Specialized agent workflow instructions
├── docs/                         # Documentation root (separated by courses)
│   ├── computacion-2/            # Folder structure per course
│   │   ├── _category_.json       # Category metadata for sidebar
│   │   ├── intro.mdx             # Course landing page
│   │   └── semana-1/             # Sub-modules / weekly folders
│   │       ├── _category_.json   
│   │       └── topic.md          # Individual markdown guides
│   ├── iag-al-entorno/
│   └── ...
├── src/                          # Custom theme and pages
│   ├── components/               # Custom React components (BrowserWindow, PdfViewer, etc.)
│   └── theme/                    # Theme overrides and global MDX setup
├── static/                       # Static assets (images, PDFs, syllabus)
├── docusaurus.config.js          # Main Docusaurus configuration
└── sidebars.js                   # Sidebar structure config
```

---

## 4. Creating Course and Folder Structures

To define a new course, topic, or sub-module, follow these folder-creation rules:

### Step 4.1: Course Root Directory
Create a folder under `docs/` using kebab-case (e.g., `docs/iag-al-entorno`).

### Step 4.2: Course Category Metadata (`_category_.json`)
Every new directory must contain a `_category_.json` file. This tells Docusaurus how to label and index the category in the sidebar.
```json
{
  "label": "IAG al Entorno",
  "position": 7,
  "link": {
    "type": "generated-index",
    "description": "Guides and resources regarding Generative AI and its ecosystem."
  }
}
```
* **label**: The human-readable title shown on the sidebar.
* **position**: Determines the display order relative to sibling folders.
* **link**: Configures a generated index page summary listing all sub-pages.

### Step 4.3: Course Introduction (`intro.mdx` or `intro.md`)
Always create an entry document inside the folder explaining the purpose of the course/module:
* The main heading must be `# Contenido del curso` (or "Contenido del curso").
* The frontmatter must explicitly set `sidebar_position: 1`.

```markdown
---
sidebar_position: 1
---

# Contenido del curso

Welcome text and syllabus description goes here...
```

### Step 4.4: Sub-folders (Weeks/Topics)
Under the course directory, organize content inside sub-folders:
- Use clear names matching the subject classification (e.g., `ia-generativa/` or `semana-1/`).
- Inside each sub-folder, include its own `_category_.json`.
- **Ordering Rule**: The `position` key inside the `_category_.json` of any sub-folder must start at `2` (or above) to ensure that the introductory page (`intro.md` with `sidebar_position: 1`) is displayed first in the navigation.
- Order individual markdown files within sub-folders using their own frontmatter `sidebar_position`.

---

## 5. Globally Available MDX Components

You do not need to import these components inside `.md` or `.mdx` files; they are loaded globally.

### Step-by-Step Timelines (`<StepByStep>`)
For laboratories and guides requiring sequential actions:
```mdx
<StepByStep>
  <Step number="1" title="Initialize the project">
    Run the command to set up the boilerplate.
  </Step>
  <Step number="2" title="Configure variables">
    Edit the configurations inside your `.env` file.
  </Step>
</StepByStep>
```

### Resource Card Grids (`<CardGrid>`)
To present external links, tools, repositories, or resources visually:
```mdx
<CardGrid cols={2}>
  <Card 
    title="Official Docs" 
    description="Docusaurus official guides and API reference." 
    link="https://docusaurus.io" 
  />
</CardGrid>
```

### Simulated Browser Containers (`<BrowserWindow>` and `<IframeWindow>`)
To display UI mockups or showcase how applications run locally:
```mdx
<BrowserWindow url="http://localhost:3000">
  <h3>Interactive UI Preview</h3>
</BrowserWindow>
```
For external live pages:
```mdx
<IframeWindow url="https://react.dev" />
```

### OS/Environment Selection Tabs (`<Tabs>`)
To structure multi-environment commands (e.g., Windows vs. macOS/Linux):
```mdx
<Tabs>
  <TabItem value="win" label="Windows" default>
    `dir`
  </TabItem>
  <TabItem value="unix" label="macOS & Linux">
    `ls -la`
  </TabItem>
</Tabs>
```

---

## 6. Diagram Style Guide (Mermaid)

DocuKelo natively renders Mermaid diagrams. Keep diagram layouts clean and style nodes using specific borders/colors for highlights:
* Use `graph TD` (top-down) or `graph LR` (left-to-right).
* Highlight state flows using CSS styles matching light/dark modes:
  - **Info/Blue**: `style NodeID fill:#dbeafe,stroke:#2563eb,stroke-width:2px`
  - **Success/Green**: `style NodeID fill:#dcfce7,stroke:#16a34a,stroke-width:2px`
  - **Warning/Yellow**: `style NodeID fill:#fef3c7,stroke:#d97706,stroke-width:2px`

---

## 7. Writing Style & UX Guardrails

* **Student-Centric Tone**: Maintain a supportive, pedagogically sound, and empathetic voice. Explain "why" before explaining "how".
* **Professional Spanglish**: Keep common development terminology in English (e.g., *endpoint*, *props*, *deployment*, *payload*) rather than translating them awkwardly into Spanish, but write the narrative in natural Spanish.
* **Prohibition of Icons and Emojis**: Do not use emojis in headers, titles, cards, or buttons to keep the user interface clean, professional, and visually uniform.
* **Code Headers**: Always label code blocks with titles (`title="filename.ext"`) and enable line numbering (`showLineNumbers`) for guides.
* **SVG Storage and Reference**: All SVG schemas must be saved as standalone `.svg` files in the directory `static/img/<course-name>/` (e.g., `static/img/iag-al-entorno/`). They should be called in Markdown files using: `![Alt Text](/img/<course-name>/filename.svg)`. Do not embed raw inline SVG XML markup directly inside Markdown/MDX files.

