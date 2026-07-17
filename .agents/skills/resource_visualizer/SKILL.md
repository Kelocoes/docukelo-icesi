---
name: docusaurus-resource-visualizer
description: Guides agents on how to visually illustrate educational links and tools in DocuKelo using simple, clean, standalone SVG schemas (vector diagrams).
---

# Docusaurus Resource Visualizer Skill

This skill provides rules and instructions for making external tools and web resources visually engaging inside Docusaurus using simple, clean, standalone SVG schemas (vector diagrams) rather than heavy raster images or highly technical, cluttered block diagrams.

---

## 1. Visual Integration with Standalone SVGs

When documenting external web resources:

1. **Design as Slide Visuals**: The SVGs should look like clean, simplified slide graphics or conceptual icons rather than overly technical micro-architectural block charts with dense texts. Use rounded shapes, clean colors, and minimal labels.
2. **Standalone Files**: Save all SVG schemas as standalone `.svg` files inside the `static/img/<course-name>/` directory (e.g., `static/img/iag-al-entorno/`).
3. **Markdown Reference**: Reference SVGs in the Markdown/MDX files using HTML `<img>` tags to control their dimensions instead of standard Markdown `![]()` syntax:
   ```html
   <img src="/img/<course-name>/filename.svg" width="25%" />
   ```
4. **No Inline SVGs**: Avoid embedding raw XML `<svg>` elements directly inside the Markdown files. Keep the markdown code clean.

---

## 2. Technical Guidelines for SVGs

### 2.1. Margin and Padding Reduction (viewBox Crop)

To prevent excessive empty space (padding) around the diagrams:

- Set the `viewBox` coordinates closely hugging the outermost elements of the drawing.
- Adjust the `x y width height` parameters inside the `viewBox` tag (e.g. `viewBox="15 10 90 80"`) to crop out any unnecessary blank space.

### 2.2. Recommended SVG Palette and Styling

- **Borders/Lines**: `#94a3b8` (Slate 400) or `#64748b` (Slate 500)
- **Background/Nodes**:
  - Blue (Info/Process): `#eff6ff` (Light) / `#3b82f6` (Dark border)
  - Green (Success/Target): `#f0fdf4` (Light) / `#22c55e` (Dark border)
  - Slate (Input/Neutral): `#f8fafc` (Light) / `#64748b` (Dark border)
- **Text**: Use `fill="#1e293b"` and a clean sans-serif `font-family="system-ui, sans-serif"`.
