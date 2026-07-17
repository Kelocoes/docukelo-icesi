# Rules and Guidelines for Documentation Generation (DocuKelo)

This file serves as a memory and development guide for any AI Agent or editor generating new content in this Docusaurus repository.

---

## 1. Course Folder Structure
Documentation is organized by thematic folders corresponding to the courses:
- `docs/computacion-3/semana-X/`: Weekly step-by-step guides on architecture, docker, and backend.
- `docs/disenando-con-algoritmos/semana-X/`: UI/UX design and layout guides with Tailwind CSS.

Each weekly folder must contain a `_category_.json` file with the following basic format:
```json
{
  "label": "Week X: Topic Name",
  "position": X,
  "link": {
    "type": "generated-index",
    "description": "General description of the topics and labs for this week."
  }
}
```

---

## 2. Globally Available MDX Components
It is not necessary to import these components in `.mdx` files as they are mapped in `src/theme/MDXComponents.js`.

### Timeline for Step-by-Step Guides
Ideal for labs and step-by-step guides:
```mdx
<StepByStep>
  <Step number="1" title="First Step">
    Detailed instructions for step 1.
  </Step>
  <Step number="2" title="Second Step">
    Detailed instructions for step 2.
  </Step>
</StepByStep>
```

### Resource Card Grids
Useful for showing shortcuts, syllabus, or web references:
```mdx
<CardGrid cols={2}>
  <Card 
    title="Title" 
    description="Brief description of the resource" 
    link="https://example.com" 
  />
</CardGrid>
```

### Simulated Browser Container (Browser)
To show screenshots or interactive interfaces:
```mdx
<BrowserWindow url="http://localhost:3000">
  <h3>Content inside the simulated window</h3>
</BrowserWindow>
```

Or using the embedded iframe:
```mdx
<IframeWindow url="https://react.dev" />
```

### Native Tabs (Tabs & TabItem)
To show configurations by operating system or language:
```mdx
<Tabs>
  <TabItem value="win" label="Windows" default>
    Commands for Windows.
  </TabItem>
  <TabItem value="mac" label="macOS">
    Commands for macOS.
  </TabItem>
</Tabs>
```

---

## 3. Diagram Style Guide (Mermaid)
Natively configured with support for light and dark themes.
* Use `graph TD` or `graph LR`.
* Use built-in styles to highlight critical states or flows:
  `style NodeID fill:#dbeafe,stroke:#2563eb,stroke-width:2px` (Blue/Info)
  `style NodeID fill:#dcfce7,stroke:#16a34a,stroke-width:2px` (Green/Success)
  `style NodeID fill:#fef3c7,stroke:#d97706,stroke-width:2px` (Yellow/Warning)

---

## 4. Code Block Style and Admonitions
* Always specify the filename in the header with `title="name.ext"`.
* Use line highlighting: `{1, 5-8}`.
* Show line numbers if the file is long with `showLineNumbers`.
* Use admonitions to warn students:
  `:::tip` (Useful tip)
  `:::info` (Relevant information)
  `:::warning` (Warning)
  `:::danger` (Common error alert)

---

## 5. Prohibition of Icons and Emojis in the UI
* **Strict Rule**: Emojis or other graphic special characters are not allowed in the application interface, such as homepage cards, buttons, main headers of guides, or component titles.
* The interface must maintain a clean, professional aesthetic based solely on typography and Infima CSS. However, standard typographic characters like text arrows (`&rarr;` or `→`) can be used when necessary.
