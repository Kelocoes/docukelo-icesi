---
sidebar_position: 5
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Tailwind CSS and daisyUI

In previous lessons, we consolidated the frontend architecture of our workout routine application: we structured the Domain, Infrastructure, and Application layers using Clean Architecture, and connected the Presentation Layer with Redux Toolkit to manage global reactive state. However, a robust architecture also requires a visual design strategy that is scalable, maintainable, and predictable.

In this lesson, we will explore the fundamentals of **Tailwind CSS v4** (the fastest, most modern utility engine for the web) and **daisyUI 5** (the semantic component library that accelerates UI construction). You will learn to master the design scale, build clean and accessible components, and design responsive interfaces following the *mobile-first* philosophy.

---

## 1. Utility-First

The Tailwind CSS paradigm is known as **Utility-First**. Instead of writing custom CSS selectors for each component class (as in traditional BEM) or injecting imperative styles directly into the DOM, Tailwind provides highly specialized atomic classes (for example, `p-4`, `flex`, `bg-blue-600`, `rounded-xl`) that compose the design directly within the JSX markup.

It is common for developers new to Tailwind to ask: *isn't using utility classes the same as going back to inline styles (`style={{ ... }}`)?* The technical answer is an emphatic **no**. Fundamental architectural differences exist between both approaches:

| Feature | Inline Styles (`style={{ ... }}`) | Traditional CSS / BEM (`.css`) | Utility-First (Tailwind CSS v4) |
| :--- | :--- | :--- | :--- |
| **Design Scale** | Arbitrary scattered values (`padding: 15px`, `18px`). Visual inconsistency. | Defined manually using CSS variables (`--spacing-4`). | Standardized numerical scale based on multiples of 4px (`p-1`, `p-2`, `p-4`). |
| **Pseudo-classes** | Impossible to use `:hover`, `:focus`, `:active`, or `:disabled` without JavaScript. | Native support by writing rules for each selector. | Direct declarative prefixes (`hover:bg-blue-700`, `focus:ring-2`, `active:scale-95`). |
| **Responsive Design** | Impossible to use Media Queries in the `style` attribute. | Requires `@media` blocks scattered across multiple files. | Integrated screen modifiers (`sm:`, `md:`, `lg:`, `xl:`) with a mobile-first approach. |
| **Production Bundle Size** | Massive duplication in the HTML DOM for each node. | CSS grows continuously as the project adds new screens. | **Zero-runtime and Automatic Purging**: compiler generates only the classes actually used (~15-20 KB). |
| **Browser Cache** | Each element sends its own bytes; no caching. | Cached as an independent static `.css` file. | Global static CSS file that is highly compressible and cacheable on CDN. |

### Reference Component: Routine Card

To illustrate this approach within our course domain, let's examine how a workout routine card (`RoutineCard`) is composed by combining utility classes for spacing, typography, borders, states, and smooth transitions:

```tsx title="Example: Routine card with Tailwind utilities" showLineNumbers
// Routine card styled entirely with Tailwind CSS v4 utility classes
interface RoutineCardProps {
  id: string;
  title: string;
  category: string;
  exerciseCount: number;
  durationMinutes: number;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}

export function RoutineCard({
  id,
  title,
  category,
  exerciseCount,
  durationMinutes,
  isCompleted,
  onToggle,
}: RoutineCardProps) {
  return (
    <article className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        {/* Header: Category and Duration */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
            {category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {durationMinutes} min
          </span>
        </div>

        {/* Routine Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {exerciseCount} structured exercises
        </p>
      </div>

      {/* Card Footer: Status and Action */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <span
          className={`text-xs font-semibold ${
            isCompleted
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {isCompleted ? 'Completed' : 'Pending'}
        </span>
        <button
          onClick={() => onToggle(id)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg transition-transform cursor-pointer"
        >
          {isCompleted ? 'Reset' : 'Complete'}
        </button>
      </div>
    </article>
  );
}
```

:::tip[Declarative Clarity]
Notice how there was no need to create a `RoutineCard.module.css` file with invented class names (`.card-footer-action-button-active`). The card describes with mathematical precision its geometry, its light and dark mode colors, and its interactive states directly on the JSX element.
:::

---

## 2. Next.js Configuration

The course project (`compunet3-202602`, branch `week-12/next-redux`) uses **Tailwind CSS v4** alongside **Next.js 16 (App Router)**. In previous versions (Tailwind v3), configuration required maintaining a `tailwind.config.js` file with `content` paths so the scanner could detect classes, as well as configuring plugins in JavaScript arrays.

In **Tailwind CSS v4**, the architecture was radically simplified with the **Oxide** engine (rewritten in Rust and Lightning CSS):

1. **CSS-First Configuration**: `tailwind.config.js` no longer exists. Everything is configured directly in the main stylesheet (`app/globals.css`).
2. **Automatic Source Detection**: Tailwind v4 automatically detects all template and component files (`.tsx`, `.jsx`, `.ts`, `.html`) without needing a `content` array specified.
3. **PostCSS Integration**: Connected via the official `@tailwindcss/postcss` package.

Let's look at the actual project configuration on the `week-12/next-redux` branch:

```css title="app/globals.css" showLineNumbers
@import "tailwindcss";
@plugin "daisyui" {
    themes: light --default;
}
```

And its corresponding PostCSS configuration file:

```javascript title="postcss.config.mjs" showLineNumbers
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

:::note[Tailwind v4: Switching to @import "tailwindcss"]
In Tailwind v3, three separate directives were used: `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;`. In Tailwind v4, these directives were replaced by a single standard CSS statement: `@import "tailwindcss";`.
:::

---

## 3. Spacing

Spacing in Tailwind is controlled through margin and padding classes. Tailwind uses a numerical scale where each number represents a multiple of 0.25rem (4px).

### Margin

Margin controls the **outer** space around an element. It can be applied in all directions:

-   `m-{size}`: margin on all sides
-   `mx-{size}`: horizontal margin (left and right)
-   `my-{size}`: vertical margin (top and bottom)
-   `mt-{size}`, `mr-{size}`, `mb-{size}`, `ml-{size}`: specific margin per side

**Example:**

<BrowserWindow minHeight={240}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                margin: "16px",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
            }}
        >
            m-4: margin of 1rem (16px) on all sides
        </div>
        <div
            style={{
                marginLeft: "32px",
                marginRight: "32px",
                marginTop: "8px",
                marginBottom: "8px",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "16px",
            }}
        >
            mx-8 my-2: horizontal margin of 2rem, vertical of 0.5rem
        </div>
        <div
            style={{
                marginTop: "24px",
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
            }}
        >
            mt-6: margin-top of 1.5rem (24px)
        </div>
    </div>
</BrowserWindow>

### Padding

Padding controls the **inner** space of an element (between content and border). It uses the same naming convention as margin:

-   `p-{size}`: padding on all sides
-   `px-{size}`: horizontal padding
-   `py-{size}`: vertical padding
-   `pt-{size}`, `pr-{size}`, `pb-{size}`, `pl-{size}`: specific padding per side

**Example:**

<BrowserWindow minHeight={240}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "#ef4444",
                color: "white",
                marginBottom: "16px",
                padding: "8px",
            }}
        >
            p-2: padding of 0.5rem (8px) on all sides
        </div>
        <div
            style={{
                backgroundColor: "#f59e0b",
                color: "black",
                marginBottom: "16px",
                paddingLeft: "32px",
                paddingRight: "32px",
                paddingTop: "16px",
            }}
        >
            px-8 py-4: horizontal padding of 2rem, vertical of 1rem
        </div>
        <div
            style={{
                paddingTop: "24px",
                paddingBottom: "8px",
                backgroundColor: "#4338ca",
                color: "white",
            }}
        >
            pt-6 pb-2: padding-top of 1.5rem, padding-bottom of 0.5rem
        </div>
    </div>
</BrowserWindow>

## 4. Dimensions

Dimensions in Tailwind allow you to control the width and height of elements. Tailwind provides utility classes for fixed sizes, percentages, and special sizes such as viewport.

### Width

Width controls the **horizontal size** of an element. Tailwind offers several options:

-   `w-{number}`: width on the Tailwind scale (w-4 = 1rem, w-64 = 16rem)
-   `w-{fraction}`: percentage-based width (w-1/2 = 50%, w-1/3 = 33.33%, w-full = 100%)
-   `w-screen`: viewport width (100vw)
-   `w-auto`: automatic width based on content

**Example:**

<BrowserWindow minHeight={300}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                width: "100%",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            w-full: 100% width of the container
        </div>
        <div
            style={{
                width: "50%",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            w-1/2: 50% width of the container
        </div>
        <div
            style={{
                width: "256px",
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            w-64: fixed width of 16rem (256px)
        </div>
        <div
            style={{
                width: "auto",
                backgroundColor: "#f59e0b",
                color: "black",
                padding: "16px",
                display: "inline-block",
            }}
        >
            w-auto: width based on content
        </div>
    </div>
</BrowserWindow>

### Height

Height controls the **vertical size** of an element. Similar to width, it offers multiple options:

-   `h-{number}`: height on the Tailwind scale (h-4 = 1rem, h-64 = 16rem)
-   `h-full`: 100% height of the container
-   `h-screen`: viewport height (100vh)
-   `h-auto`: automatic height based on content

**Example:**

<BrowserWindow minHeight={400}>
    <div
        style={{
            backgroundColor: "#f3f4f6",
            padding: "20px",
            height: "350px",
            display: "flex",
            gap: "12px",
        }}
    >
        <div
            style={{
                height: "100%",
                width: "80px",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
            }}
        >
            h-full: 100% height
        </div>
        <div
            style={{
                height: "128px",
                width: "80px",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "16px",
            }}
        >
            h-32: height of 8rem (128px)
        </div>
        <div
            style={{
                height: "64px",
                width: "80px",
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
            }}
        >
            h-16: height of 4rem (64px)
        </div>
        <div
            style={{
                height: "auto",
                width: "80px",
                backgroundColor: "#f59e0b",
                color: "black",
                padding: "16px",
            }}
        >
            h-auto
        </div>
    </div>
</BrowserWindow>

### Size (Simultaneous Width and Height)

The `size-{size}` class sets the **same value** for both width and height, useful for square elements:

-   `size-16`: width and height of 4rem (64px)
-   `size-32`: width and height of 8rem (128px)

**Example:**

<BrowserWindow minHeight={280}>
    <div
        style={{
            backgroundColor: "#f3f4f6",
            padding: "20px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
        }}
    >
        <div
            style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#3b82f6",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            size-16
        </div>
        <div
            style={{
                width: "96px",
                height: "96px",
                backgroundColor: "#22c55e",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            size-24
        </div>
        <div
            style={{
                width: "128px",
                height: "128px",
                backgroundColor: "#a855f7",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            size-32
        </div>
    </div>
</BrowserWindow>

### Min/Max Width and Height

Tailwind allows setting minimum and maximum limits for dimensions:

-   `min-w-{size}`: minimum width
-   `max-w-{size}`: maximum width (max-w-md = 28rem, max-w-lg = 32rem, max-w-xl = 36rem)
-   `min-h-{size}`: minimum height
-   `max-h-{size}`: maximum height

**Example:**

<BrowserWindow minHeight={300}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                maxWidth: "448px",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            max-w-md: maximum width of 28rem (448px). This text has a width
            limit regardless of the container size.
        </div>
        <div
            style={{
                minHeight: "128px",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            min-h-32: minimum height of 8rem (128px)
        </div>
        <div
            style={{
                maxHeight: "80px",
                overflow: "auto",
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
            }}
        >
            max-h-20: maximum height of 5rem (80px). If the content is too
            long, a scrollbar will appear. This is an example of long text that
            exceeds the set maximum height to demonstrate this
            behavior.
        </div>
    </div>
</BrowserWindow>

## 5. Typography

Typography in Tailwind allows you to control the visual appearance of text through utility classes. You can modify size, weight, alignment, color, and more text properties.

### Font Size

Font size controls how large or small text appears. Tailwind offers a predefined scale:

-   `text-xs`: extra small (0.75rem / 12px)
-   `text-sm`: small (0.875rem / 14px)
-   `text-base`: base (1rem / 16px)
-   `text-lg`: large (1.125rem / 18px)
-   `text-xl`: extra large (1.25rem / 20px)
-   `text-2xl` to `text-9xl`: progressively larger sizes

**Example:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p style={{ fontSize: "12px", marginBottom: "8px" }}>text-xs: Extra small text (12px)</p>
        <p style={{ fontSize: "14px", marginBottom: "8px" }}>text-sm: Small text (14px)</p>
        <p style={{ fontSize: "16px", marginBottom: "8px" }}>text-base: Base text (16px)</p>
        <p style={{ fontSize: "18px", marginBottom: "8px" }}>text-lg: Large text (18px)</p>
        <p style={{ fontSize: "20px", marginBottom: "8px" }}>text-xl: Extra large text (20px)</p>
        <p style={{ fontSize: "24px", marginBottom: "8px" }}>text-2xl: 2XL text (24px)</p>
        <p style={{ fontSize: "30px" }}>text-3xl: 3XL text (30px)</p>
    </div>
</BrowserWindow>

### Font Weight

Font weight controls how thick or thin typography appears:

-   `font-thin`: weight 100
-   `font-light`: weight 300
-   `font-normal`: weight 400
-   `font-medium`: weight 500
-   `font-semibold`: weight 600
-   `font-bold`: weight 700
-   `font-extrabold`: weight 800
-   `font-black`: weight 900

**Example:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p style={{ fontWeight: "100", marginBottom: "8px" }}>font-thin: Very thin text (100)</p>
        <p style={{ fontWeight: "300", marginBottom: "8px" }}>font-light: Light text (300)</p>
        <p style={{ fontWeight: "400", marginBottom: "8px" }}>font-normal: Normal text (400)</p>
        <p style={{ fontWeight: "500", marginBottom: "8px" }}>font-medium: Medium text (500)</p>
        <p style={{ fontWeight: "600", marginBottom: "8px" }}>font-semibold: Semibold text (600)</p>
        <p style={{ fontWeight: "700", marginBottom: "8px" }}>font-bold: Bold text (700)</p>
        <p style={{ fontWeight: "800", marginBottom: "8px" }}>font-extrabold: Extra bold text (800)</p>
        <p style={{ fontWeight: "900" }}>font-black: Black text (900)</p>
    </div>
</BrowserWindow>

### Text Align

Text alignment controls how text is distributed horizontally:

-   `text-left`: left-aligned
-   `text-center`: centered
-   `text-right`: right-aligned
-   `text-justify`: justified

**Example:**

<BrowserWindow minHeight={280}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p
            style={{
                textAlign: "left",
                backgroundColor: "#dbeafe",
                padding: "12px",
                marginBottom: "8px",
            }}
        >text-left: This text is left-aligned</p>
        <p
            style={{
                textAlign: "center",
                backgroundColor: "#dcfce7",
                padding: "12px",
                marginBottom: "8px",
            }}
        >text-center: This text is centered</p>
        <p
            style={{
                textAlign: "right",
                backgroundColor: "#fce7f3",
                padding: "12px",
                marginBottom: "8px",
            }}
        >text-right: This text is right-aligned</p>
        <p
            style={{
                textAlign: "justify",
                backgroundColor: "#fef3c7",
                padding: "12px",
            }}
        >text-justify: This text is justified, meaning it is evenly distributed between the left and right margins.</p>
    </div>
</BrowserWindow>

### Text Color

Tailwind provides an extensive color palette for text:

-   `text-{color}-{shade}`: example `text-blue-500`, `text-red-600`
-   Available colors: gray, red, yellow, green, blue, indigo, purple, pink, etc.
-   Shades: from 50 (lightest) to 950 (darkest)

**Example:**

<BrowserWindow minHeight={300}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ color: "#ef4444", fontSize: "18px", marginBottom: "8px" }}>text-red-500: Red text</p>
        <p style={{ color: "#3b82f6", fontSize: "18px", marginBottom: "8px" }}>text-blue-500: Blue text</p>
        <p style={{ color: "#22c55e", fontSize: "18px", marginBottom: "8px" }}>text-green-500: Green text</p>
        <p style={{ color: "#a855f7", fontSize: "18px", marginBottom: "8px" }}>text-purple-500: Purple text</p>
        <p style={{ color: "#f59e0b", fontSize: "18px", marginBottom: "8px" }}>text-amber-500: Amber text</p>
        <p style={{ color: "#6b7280", fontSize: "18px" }}>text-gray-500: Gray text</p>
    </div>
</BrowserWindow>

### Text Decoration and Transform

Tailwind also offers classes for text decoration and transformation:

-   `underline`: underlined
-   `line-through`: strikethrough
-   `uppercase`: uppercase
-   `lowercase`: lowercase
-   `capitalize`: capitalized first letter

**Example:**

<BrowserWindow minHeight={280}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p
            style={{
                textDecoration: "underline",
                marginBottom: "8px",
                fontSize: "16px",
            }}
        >underline: This text is underlined</p>
        <p
            style={{
                textDecoration: "line-through",
                marginBottom: "8px",
                fontSize: "16px",
            }}
        >line-through: This text is struck through</p>
        <p
            style={{
                textTransform: "uppercase",
                marginBottom: "8px",
                fontSize: "16px",
            }}
        >uppercase: this text is uppercase</p>
        <p
            style={{
                textTransform: "lowercase",
                marginBottom: "8px",
                fontSize: "16px",
            }}
        >lowercase: THIS TEXT IS LOWERCASE</p>
        <p style={{ textTransform: "capitalize", fontSize: "16px" }}>capitalize: each word starts with a capital letter</p>
    </div>
</BrowserWindow>

### Line Height

Line height controls the vertical spacing between lines of text:

-   `leading-none`: no extra spacing
-   `leading-tight`: tight spacing
-   `leading-normal`: normal spacing
-   `leading-relaxed`: relaxed spacing
-   `leading-loose`: loose spacing

**Example:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "16px" }}>
            <p
                style={{
                    lineHeight: "1",
                    backgroundColor: "#dbeafe",
                    padding: "8px",
                }}
            >leading-none: This is a line of text with line height without extra spacing. Notice how the lines are very close together.</p>
        </div>
        <div style={{ marginBottom: "16px" }}>
            <p
                style={{
                    lineHeight: "1.5",
                    backgroundColor: "#dcfce7",
                    padding: "8px",
                }}
            >leading-normal: This is a line of text with normal line height. It is the standard and comfortable spacing for reading.</p>
        </div>
        <div>
            <p
                style={{
                    lineHeight: "2",
                    backgroundColor: "#fef3c7",
                    padding: "8px",
                }}
            >leading-loose: This is a line of text with loose line height. There is plenty of space between lines.</p>
        </div>
    </div>
</BrowserWindow>

## 6. Colors

Colors in Tailwind are fundamental to bringing your designs to life. Tailwind offers an extensive color palette with different shades that you can apply to backgrounds, text, borders, and more.

### Background Color

Background color is applied with the `bg-{color}-{shade}` class:

-   Available colors: slate, gray, red, orange, yellow, green, blue, indigo, purple, pink, etc.
-   Shades: 50 (very light) up to 950 (very dark)
-   Examples: `bg-blue-500`, `bg-red-600`, `bg-green-400`

**Example:**

<BrowserWindow minHeight={400}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "#ef4444",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
            }}
        >
            bg-red-500: Red background
        </div>
        <div
            style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
            }}
        >
            bg-blue-500: Blue background
        </div>
        <div
            style={{
                backgroundColor: "#22c55e",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
            }}
        >
            bg-green-500: Green background
        </div>
        <div
            style={{
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
            }}
        >
            bg-purple-500: Purple background
        </div>
        <div
            style={{
                backgroundColor: "#f59e0b",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
            }}
        >
            bg-amber-500: Amber background
        </div>
        <div
            style={{
                backgroundColor: "#ec4899",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
            }}
        >
            bg-pink-500: Pink background
        </div>
    </div>
</BrowserWindow>

### Color Shades

Each color has different shades ranging from 50 to 950. The higher the number, the darker the color:

**Example:**

<BrowserWindow minHeight={450}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "#eff6ff",
                color: "#1e40af",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-50: Very light blue
        </div>
        <div
            style={{
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-100: Light blue
        </div>
        <div
            style={{
                backgroundColor: "#93c5fd",
                color: "#1e3a8a",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-300: Medium light blue
        </div>
        <div
            style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-500: Base blue
        </div>
        <div
            style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-600: Medium dark blue
        </div>
        <div
            style={{
                backgroundColor: "#1e40af",
                color: "white",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-800: Dark blue
        </div>
        <div
            style={{
                backgroundColor: "#1e3a8a",
                color: "white",
                padding: "12px",
                borderRadius: "4px",
            }}
        >
            bg-blue-900: Very dark blue
        </div>
    </div>
</BrowserWindow>

### Border Color

Borders can also have color using `border-{color}-{shade}`. Remember that you need to define the border width first:

-   `border`: 1px border
-   `border-2`: 2px border
-   `border-4`: 4px border
-   `border-8`: 8px border

**Example:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div
            style={{
                border: "2px solid #ef4444",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            border-2 border-red-500: Red border
        </div>
        <div
            style={{
                border: "4px solid #3b82f6",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            border-4 border-blue-500: 4px blue border
        </div>
        <div
            style={{
                border: "8px solid #22c55e",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            border-8 border-green-500: Thick 8px green border
        </div>
        <div
            style={{
                border: "2px dashed #a855f7",
                padding: "16px",
                borderRadius: "4px",
            }}
        >
            border-2 border-purple-500 border-dashed: Dashed purple border
        </div>
    </div>
</BrowserWindow>

### Opacity

You can control the opacity of background colors, text, and borders using the opacity modifier:

-   `bg-{color}-{shade}/{opacity}`: example `bg-blue-500/50` (50% opacity)
-   Common opacities: 25, 50, 75, 100

**Example:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "rgba(59, 130, 246, 1)",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            bg-blue-500/100: Opacity 100% (fully opaque)
        </div>
        <div
            style={{
                backgroundColor: "rgba(59, 130, 246, 0.75)",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            bg-blue-500/75: Opacity 75%
        </div>
        <div
            style={{
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            bg-blue-500/50: Opacity 50%
        </div>
        <div
            style={{
                backgroundColor: "rgba(59, 130, 246, 0.25)",
                color: "#1e3a8a",
                padding: "16px",
                borderRadius: "4px",
            }}
        >
            bg-blue-500/25: Opacity 25% (very transparent)
        </div>
    </div>
</BrowserWindow>

### Gradients

:::note[Tailwind v4: New bg-linear-* Naming]
In **Tailwind CSS v4**, linear gradient utilities were renamed from `bg-gradient-to-*` to **`bg-linear-to-*`** (`bg-linear-to-r`, `bg-linear-to-b`, `bg-linear-to-br`, etc.) to align with the CSS standard specification (`linear-gradient`). The previous v3 syntax remains common in existing projects, but modern projects like the one in this course use `bg-linear-to-*`.
:::

Tailwind makes it intuitive to create linear gradients by combining direction with color stop points:

-   `bg-linear-to-r`: linear gradient from left to right
-   `bg-linear-to-b`: linear gradient from top to bottom
-   `bg-linear-to-br`: linear gradient toward bottom-right corner
-   `from-{color}`: starting color
-   `to-{color}`: ending color
-   `via-{color}`: intermediate color (optional)

**Example:**

<BrowserWindow minHeight={400}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                color: "white",
                padding: "20px",
                marginBottom: "12px",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            bg-linear-to-r from-blue-500 to-purple-500 (v3: bg-gradient-to-r)
        </div>
        <div
            style={{
                background: "linear-gradient(to bottom, #ef4444, #f59e0b)",
                color: "white",
                padding: "20px",
                marginBottom: "12px",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            bg-linear-to-b from-red-500 to-amber-500 (v3: bg-gradient-to-b)
        </div>
        <div
            style={{
                background:
                    "linear-gradient(to right, #10b981, #3b82f6, #8b5cf6)",
                color: "white",
                padding: "20px",
                marginBottom: "12px",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            bg-linear-to-r from-green-500 via-blue-500 to-purple-500
        </div>
        <div
            style={{
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                color: "white",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            bg-linear-to-br from-pink-500 to-purple-500
        </div>
    </div>
</BrowserWindow>

## 7. Flexbox

Flexbox and Grid are foundational layout systems in CSS that Tailwind makes very easy to use. They allow you to create complex, responsive layouts efficiently. Flexbox is ideal for arranging elements in one direction (horizontal or vertical) and controlling how they are distributed and aligned.

### Flex Direction

Flex direction controls whether elements are aligned horizontally or vertically:

-   `flex-row`: items in a row (horizontal, default)
-   `flex-col`: items in a column (vertical)
-   `flex-row-reverse`: reverse row
-   `flex-col-reverse`: reverse column

**Example:**

<BrowserWindow minHeight={400}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "20px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>flex-row:</p>
            <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    3
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>flex-col:</p>
            <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    3
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

### Justify Content (Horizontal Alignment)

Controls how items are distributed along the main axis:

-   `justify-start`: at start
-   `justify-center`: centered
-   `justify-end`: at end
-   `justify-between`: space between items
-   `justify-around`: space around items

**Example:**

<BrowserWindow minHeight={450}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "16px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>justify-start:</p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "8px",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    A
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    B
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    C
                </div>
            </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>justify-center:</p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    A
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    B
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    C
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>justify-between:</p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    A
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    B
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    C
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

### Align Items (Vertical Alignment)

Controls how items are aligned along the cross axis:

-   `items-start`: at start
-   `items-center`: centered
-   `items-end`: at end
-   `items-stretch`: stretched (default)

**Example:**

<BrowserWindow minHeight={400}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "16px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>items-start:</p>
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    height: "100px",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "4px",
                    gap: "8px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    A
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                        height: "60px",
                    }}
                >
                    B
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    C
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>items-center:</p>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100px",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "4px",
                    gap: "8px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    A
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                        height: "60px",
                    }}
                >
                    B
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    C
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

### Gap (Space Between Items)

Gap creates space between flex items without needing margins:

-   `gap-{size}`: space in all directions
-   `gap-x-{size}`: horizontal space
-   `gap-y-{size}`: vertical space

**Example:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "16px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>gap-2 (8px):</p>
            <div style={{ display: "flex", gap: "8px" }}>
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    3
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>gap-8 (32px):</p>
            <div style={{ display: "flex", gap: "32px" }}>
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    3
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

## 8. Grid

Grid is perfect for creating complex two-dimensional layouts with rows and columns.

### Grid Columns

Defines how many columns your grid will have:

-   `grid-cols-{number}`: number of columns (grid-cols-2, grid-cols-3, grid-cols-4, etc.)
-   `grid-cols-12`: 12-column system (like Bootstrap)

**Example:**

<BrowserWindow minHeight={450}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "20px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>grid-cols-2:</p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    3
                </div>
                <div
                    style={{
                        backgroundColor: "#f59e0b",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    4
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>grid-cols-3:</p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    3
                </div>
                <div
                    style={{
                        backgroundColor: "#f59e0b",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    4
                </div>
                <div
                    style={{
                        backgroundColor: "#ec4899",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    5
                </div>
                <div
                    style={{
                        backgroundColor: "#06b6d4",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    6
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

### Grid Rows

Defines how many rows your grid will have:

-   `grid-rows-{number}`: number of rows (grid-rows-2, grid-rows-3, etc.)

**Example:**

<BrowserWindow minHeight={400}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p style={{ marginBottom: "8px", fontWeight: "600" }}>grid-rows-3:</p>
        <div
            style={{
                display: "grid",
                gridTemplateRows: "repeat(3, 1fr)",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                height: "300px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                1
            </div>
            <div
                style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                2
            </div>
            <div
                style={{
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                3
            </div>
            <div
                style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                4
            </div>
            <div
                style={{
                    backgroundColor: "#ec4899",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                5
            </div>
            <div
                style={{
                    backgroundColor: "#06b6d4",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                6
            </div>
        </div>
    </div>
</BrowserWindow>

### Col Span (Column Expansion)

Allows an element to span across multiple columns:

-   `col-span-{number}`: expands the element across N columns
-   `col-span-full`: occupies all available columns

**Example:**

<BrowserWindow minHeight={400}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p style={{ marginBottom: "8px", fontWeight: "600" }}>grid-cols-3 with col-span:</p>
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
            }}
        >
            <div
                style={{
                    gridColumn: "span 3",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                col-span-3 (spans 3 columns)
            </div>
            <div
                style={{
                    gridColumn: "span 2",
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                col-span-2
            </div>
            <div
                style={{
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                1
            </div>
            <div
                style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                1
            </div>
            <div
                style={{
                    gridColumn: "span 2",
                    backgroundColor: "#ec4899",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                col-span-2
            </div>
        </div>
    </div>
</BrowserWindow>

### Grid Gap

Similar to Flexbox, Grid also uses gap to space elements:

-   `gap-{size}`: space between rows and columns

**Example:**

<BrowserWindow minHeight={400}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "20px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>gap-2 (8px):</p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "8px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    3
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>gap-6 (24px):</p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    3
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

## 9. Positioning

Positioning in Tailwind controls how an element is placed on the page. This is fundamental for creating complex layouts, modals, floating menus, and more.

### Position Types

Tailwind offers different positioning types:

-   `static`: normal position (default)
-   `relative`: position relative to its original position
-   `absolute`: absolute position relative to the positioned parent container
-   `fixed`: fixed position relative to the viewport
-   `sticky`: hybrid between relative and fixed

**Example:**

<BrowserWindow minHeight={450}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "20px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>relative:</p>
            <div
                style={{
                    position: "relative",
                    backgroundColor: "#e5e7eb",
                    padding: "40px",
                    borderRadius: "4px",
                }}
            >
                <div
                    style={{
                        position: "relative",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        width: "fit-content",
                    }}
                >
                    relative top-10 left-10: Shifted 10px from its original
                    position
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>absolute:</p>
            <div
                style={{
                    position: "relative",
                    backgroundColor: "#e5e7eb",
                    padding: "40px",
                    borderRadius: "4px",
                    height: "150px",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    absolute top-10 right-10
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    absolute bottom-10 left-10
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

### Positioning Values

You can control exactly where an element is positioned:

-   `top-{size}`, `right-{size}`, `bottom-{size}`, `left-{size}`
-   `inset-{size}`: applies the same value to all sides
-   Common values: 0, 1, 2, 4, 8, 16, etc. (in multiples of 0.25rem)

**Example:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                position: "relative",
                backgroundColor: "#e5e7eb",
                height: "250px",
                borderRadius: "4px",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                top-0 left-0
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                top-0 right-0
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                Centered
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                bottom-0 left-0
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    backgroundColor: "#ec4899",
                    color: "white",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                bottom-0 right-0
            </div>
        </div>
    </div>
</BrowserWindow>

### Z-Index (Stacking Order)

The z-index controls which elements appear on top of others:

-   `z-0`: index 0
-   `z-10`, `z-20`, `z-30`, `z-40`, `z-50`: predefined indices
-   Higher number = higher in the stack

**Example:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div style={{ position: "relative", height: "200px" }}>
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    zIndex: 10,
                }}
            >
                z-10 (above)
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "60px",
                    left: "60px",
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    zIndex: 20,
                }}
            >
                z-20 (higher)
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "100px",
                    left: "100px",
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    zIndex: 30,
                }}
            >
                z-30 (on top)
            </div>
        </div>
    </div>
</BrowserWindow>

## 10. States and Pseudo-Classes

States and pseudo-classes in Tailwind allow applying styles when the user interacts with elements or when certain conditions are met.

### Hover

The hover state applies styles when the cursor is over an element:

-   Syntax: `hover:{class}`
-   Example: `hover:bg-blue-500`, `hover:text-white`

**Example:**

<BrowserWindow minHeight={300}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ marginBottom: "12px", color: "#6b7280" }}>Hover over the buttons:</p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2563eb")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3b82f6")
                }
            >
                hover:bg-blue-600
            </button>
            <button
                style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >
                hover:scale-110
            </button>
            <button
                style={{
                    backgroundColor: "transparent",
                    color: "#a855f7",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "2px solid #a855f7",
                    cursor: "pointer",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#a855f7";
                    e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#a855f7";
                }}
            >
                hover:bg-purple-500
            </button>
        </div>
    </div>
</BrowserWindow>

### Focus

The focus state applies when an input or interactive element is focused:

-   Syntax: `focus:{class}`
-   Example: `focus:border-blue-500`, `focus:ring-2`

**Example:**

<BrowserWindow minHeight={280}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ marginBottom: "12px", color: "#6b7280" }}>Click on the inputs to see the effect:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
                type="text"
                placeholder="focus:border-blue-500"
                style={{
                    padding: "12px",
                    border: "2px solid #d1d5db",
                    borderRadius: "6px",
                    outline: "none",
                    transition: "all 0.3s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
            />
            <input
                type="text"
                placeholder="focus:ring-2 focus:ring-purple-500"
                style={{
                    padding: "12px",
                    border: "2px solid #d1d5db",
                    borderRadius: "6px",
                    outline: "none",
                    transition: "all 0.3s",
                }}
                onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(168, 85, 247, 0.5)")
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
        </div>
    </div>
</BrowserWindow>

### Active

The active state applies while clicking an element:

-   Syntax: `active:{class}`
-   Example: `active:bg-blue-700`, `active:scale-95`

**Example:**

<BrowserWindow minHeight={250}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ marginBottom: "12px", color: "#6b7280" }}>Click and hold:</p>
        <div style={{ display: "flex", gap: "12px" }}>
            <button
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                }}
                onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor = "#1e40af";
                    e.currentTarget.style.transform = "scale(0.95)";
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.backgroundColor = "#3b82f6";
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >
                active:bg-blue-800 active:scale-95
            </button>
            <button
                style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                }}
                onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "translateY(4px)")
                }
                onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                }
            >
                active:translate-y-1
            </button>
        </div>
    </div>
</BrowserWindow>

### Disabled

The disabled state applies styles to disabled elements:

-   Syntax: `disabled:{class}`
-   Example: `disabled:opacity-50`, `disabled:cursor-not-allowed`

**Example:**

<BrowserWindow minHeight={280}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ marginBottom: "12px", color: "#6b7280" }}>Buttons with disabled state:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Enabled button
            </button>
            <button
                disabled
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    opacity: 0.5,
                    cursor: "not-allowed",
                }}
            >
                disabled:opacity-50 disabled:cursor-not-allowed
            </button>
        </div>
    </div>
</BrowserWindow>

### Group Hover

Group hover applies styles to an element when hovering over its parent container:

-   Syntax: Apply `group` to the parent and `group-hover:{class}` to the child
-   Useful for cards and complex components

**Example:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ marginBottom: "12px", color: "#6b7280" }}>Hover over the cards:</p>
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
            }}
        >
            <div
                className="group"
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                        "0 10px 25px rgba(0,0,0,0.15)";
                    const title = e.currentTarget.querySelector(".title");
                    if (title) title.style.color = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                        "0 1px 3px rgba(0,0,0,0.1)";
                    const title = e.currentTarget.querySelector(".title");
                    if (title) title.style.color = "#111827";
                }}
            >
                <h3
                    className="title"
                    style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: "#111827",
                        transition: "color 0.3s",
                    }}
                >
                    Card 1
                </h3>
                <p style={{ color: "#6b7280" }}>group-hover on the title</p>
            </div>
            <div
                className="group"
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    const title = e.currentTarget.querySelector(".title");
                    if (title) title.style.color = "#22c55e";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    const title = e.currentTarget.querySelector(".title");
                    if (title) title.style.color = "#111827";
                }}
            >
                <h3
                    className="title"
                    style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: "#111827",
                        transition: "color 0.3s",
                    }}
                >
                    Card 2
                </h3>
                <p style={{ color: "#6b7280" }}>group-hover with transform</p>
            </div>
        </div>
    </div>
</BrowserWindow>

## 11. Customization

Tailwind CSS allows customizing values beyond its predefined scale using **arbitrary values**. This gives you the flexibility to use exact values when needed, without leaving Tailwind's utility system.

### Arbitrary Values

Arbitrary values allow specifying custom values for any Tailwind class using square brackets `[]`.

#### 6. Custom Colors, Borders, Opacity, and Gradients

You can use any color in hexadecimal, RGB, HSL format, or even CSS color names:

-   `bg-[#1da1f2]`: custom background color
-   `text-[rgb(255,0,0)]`: text color in RGB
-   `border-[#ff6347]`: custom border color

**Example:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "#1da1f2",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "12px",
            }}
        >
            bg-[#1da1f2]: Custom Twitter blue color
        </div>
        <div
            style={{
                backgroundColor: "#ff6b6b",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "12px",
            }}
        >
            bg-[#ff6b6b]: Custom coral red color
        </div>
        <div
            style={{
                backgroundColor: "white",
                color: "#2d3436",
                padding: "16px",
                borderRadius: "8px",
                border: "3px solid #fdcb6e",
            }}
        >
            border-[#fdcb6e] border-[3px]: Custom yellow border
        </div>
        <p
            style={{
                color: "rgb(255, 107, 107)",
                fontSize: "18px",
                fontWeight: "600",
                marginTop: "12px",
            }}
        >text-[rgb(255,107,107)]: Text in RGB format</p>
    </div>
</BrowserWindow>

#### Custom Sizes

You can specify exact dimensions in px, rem, em, %, vw, vh, etc.:

-   `w-[347px]`: width of 347 pixels
-   `h-[32rem]`: height of 32rem
-   `text-[22px]`: font size of 22px
-   `p-[18px]`: padding of 18px

**Example:**

<BrowserWindow minHeight={400}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                width: "347px",
                height: "100px",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "12px",
            }}
        >
            w-[347px] h-[100px]: Exact width of 347px
        </div>
        <div
            style={{
                width: "75%",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "18px",
                borderRadius: "8px",
                marginBottom: "12px",
            }}
        >
            w-[75%] p-[18px]: 75% width with custom padding
        </div>
        <div
            style={{
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
                fontSize: "22px",
            }}
        >
            text-[22px]: Exact font size of 22 pixels
        </div>
    </div>
</BrowserWindow>

#### 3. Custom Spacing: Margin and Padding

Create exact spacing for margin and padding:

-   `m-[13px]`: 13px margin
-   `p-[2.5rem]`: 2.5rem padding
-   `gap-[25px]`: 25px gap between elements

**Example:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "white",
                padding: "13px",
                borderRadius: "8px",
                marginBottom: "25px",
                border: "2px solid #e5e7eb",
            }}
        >
            <p style={{ color: "#374151", fontWeight: "600" }}>p-[13px] mb-[25px]: Custom 13px padding</p>
        </div>
        <div style={{ display: "flex", gap: "25px" }}>
            <div
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "16px",
                    borderRadius: "8px",
                    flex: "1",
                }}
            >
                gap-[25px]
            </div>
            <div
                style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "16px",
                    borderRadius: "8px",
                    flex: "1",
                }}
            >
                gap-[25px]
            </div>
            <div
                style={{
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "16px",
                    borderRadius: "8px",
                    flex: "1",
                }}
            >
                gap-[25px]
            </div>
        </div>
    </div>
</BrowserWindow>

#### Custom Border Radius

Define exact border radii:

-   `rounded-[12px]`: 12px border radius
-   `rounded-[50%]`: perfect circle

**Example:**

<BrowserWindow minHeight={300}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div
                style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    fontWeight: "600",
                }}
            >
                rounded-[12px]
            </div>
            <div
                style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: "#22c55e",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "25px",
                    fontWeight: "600",
                }}
            >
                rounded-[25px]
            </div>
            <div
                style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: "#a855f7",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    fontWeight: "600",
                }}
            >
                rounded-[50%]
            </div>
        </div>
    </div>
</BrowserWindow>

#### Custom Shadows

:::note[Tailwind v4: Border and Shadow Scale Reorganization]
In Tailwind CSS v4, the shadow and border scales were readjusted for greater consistency:
- The base `shadow` class from v3 is now called `shadow-sm`, while the legacy `shadow-sm` became `shadow-xs`.
- The modern scale includes `shadow-2xs`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, and `shadow-2xl`.
- The same applies to border radii: the legacy `rounded-sm` is now `rounded-xs`, and `rounded` is equivalent to `rounded-sm`.
:::

Create custom shadow effects:

-   `shadow-[0_4px_6px_rgba(0,0,0,0.1)]`: custom shadow

**Example:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div
            style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "16px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
        >
            shadow-[0_4px_6px_rgba(0,0,0,0.1)]: Soft shadow
        </div>
        <div
            style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "16px",
                boxShadow: "0 10px 30px rgba(59,130,246,0.3)",
            }}
        >
            shadow-[0_10px_30px_rgba(59,130,246,0.3)]: Blue shadow
        </div>
        <div
            style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
        >
            shadow-[0_20px_50px_rgba(0,0,0,0.2)]: Pronounced shadow
        </div>
    </div>
</BrowserWindow>

#### Custom Font Weight and Line Height

Specify exact font weights and line heights:

-   `font-[450]`: custom font weight
-   `leading-[1.75]`: specific line height

**Example:**

<BrowserWindow minHeight={300}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p
            style={{
                fontWeight: "350",
                marginBottom: "12px",
                fontSize: "18px",
            }}
        >font-[350]: Font weight 350 (between light and normal)</p>
        <p
            style={{
                fontWeight: "550",
                marginBottom: "12px",
                fontSize: "18px",
            }}
        >font-[550]: Font weight 550 (between medium and semibold)</p>
        <p
            style={{
                fontWeight: "650",
                marginBottom: "16px",
                fontSize: "18px",
            }}
        >font-[650]: Custom font weight 650</p>
        <p style={{ lineHeight: "1.75", fontSize: "16px" }}>leading-[1.75]: This line has a line height of 1.75, which provides comfortable spacing for reading. You can notice how the text breathes better with this custom spacing.</p>
    </div>
</BrowserWindow>

### Custom Grid Template Columns/Rows

Define fully custom grid structures:

-   `grid-cols-[200px_1fr_2fr]`: columns with specific sizes
-   `grid-rows-[100px_auto_100px]`: custom rows

**Example:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p
            style={{
                marginBottom: "12px",
                fontWeight: "600",
                color: "#374151",
            }}
        >grid-cols-[200px_1fr_2fr]:</p>
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr 2fr",
                gap: "12px",
                marginBottom: "20px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                200px
            </div>
            <div
                style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                1fr
            </div>
            <div
                style={{
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                2fr
            </div>
        </div>
        <p
            style={{
                marginBottom: "12px",
                fontWeight: "600",
                color: "#374151",
            }}
        >grid-cols-[100px_auto_100px]:</p>
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "100px auto 100px",
                gap: "12px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                100px
            </div>
            <div
                style={{
                    backgroundColor: "#ec4899",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                auto (expands)
            </div>
            <div
                style={{
                    backgroundColor: "#06b6d4",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                100px
            </div>
        </div>
    </div>
</BrowserWindow>

### Custom Transforms

Apply custom CSS transforms:

-   `rotate-[17deg]`: custom rotation
-   `scale-[1.15]`: specific scale
-   `translate-x-[13px]`: exact translation

**Example:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                display: "flex",
                gap: "24px",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    fontWeight: "600",
                    transform: "rotate(17deg)",
                }}
            >
                rotate-[17deg]
            </div>
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#22c55e",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    fontWeight: "600",
                    transform: "scale(1.25)",
                }}
            >
                scale-[1.25]
            </div>
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#a855f7",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    fontWeight: "600",
                    transform: "translateY(-15px)",
                }}
            >
                -translate-y-[15px]
            </div>
        </div>
    </div>
</BrowserWindow>

### Combining Arbitrary Values

You can combine multiple arbitrary values to create unique designs:

**Example:**

<BrowserWindow minHeight={400}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "#1da1f2",
                color: "white",
                padding: "24px",
                borderRadius: "15px",
                marginBottom: "16px",
                boxShadow: "0 8px 20px rgba(29, 161, 242, 0.3)",
                fontSize: "19px",
                fontWeight: "550",
            }}
        >
            <p style={{ marginBottom: "8px" }}>Custom card with:</p>
            <ul style={{ paddingLeft: "20px", fontSize: "15px" }}>
                <li>bg-[#1da1f2]</li>
                <li>p-[24px]</li>
                <li>rounded-[15px]</li>
                <li>text-[19px]</li>
                <li>font-[550]</li>
                <li>shadow-[0_8px_20px_rgba(29,161,242,0.3)]</li>
            </ul>
        </div>
        <div
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "28px",
                borderRadius: "20px",
                boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
                fontSize: "18px",
                fontWeight: "600",
            }}
        >
            <p>Custom gradient with shadow and rounded corners</p>
            <p style={{ fontSize: "14px", marginTop: "8px", opacity: 0.9 }}>bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]</p>
        </div>
    </div>
</BrowserWindow>

### Arbitrary CSS Properties

Tailwind also allows using fully custom CSS properties with square bracket syntax:

-   `[clip-path:circle(50%)]`: applies any CSS property
-   `[backdrop-filter:blur(10px)]`: background effects

**Example:**

<BrowserWindow minHeight={350}>
    <div
        style={{
            backgroundColor: "#f3f4f6",
            padding: "20px",
            position: "relative",
        }}
    >
        <div
            style={{
                width: "150px",
                height: "150px",
                backgroundColor: "#3b82f6",
                marginBottom: "20px",
                clipPath: "circle(50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
            }}
        >
            clip-path: circle
        </div>
        <div
            style={{
                width: "200px",
                height: "100px",
                backgroundColor: "#22c55e",
                clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
            }}
        >
            clip-path: polygon
        </div>
    </div>
</BrowserWindow>

### Token Configuration with the @theme Directive (Tailwind v4)

:::note[Tailwind v4: Goodbye to tailwind.config.js]
In previous versions of Tailwind (v3), theme customization required a JavaScript `tailwind.config.js` file with a `theme.extend` object. In **Tailwind CSS v4**, configuration is **100% native in CSS** via the `@theme` directive. This eliminates the need for external configuration files, improves build times thanks to the Oxide engine, and automatically exposes tokens as native CSS variables.
:::

You can define brand colors, fonts, and new breakpoints directly in `app/globals.css`:

```css title="app/globals.css" showLineNumbers
@import "tailwindcss";

/* Routine project design token definitions */
@theme {
  /* New accessible semantic colors such as bg-brand-primary, text-brand-primary */
  --color-brand-primary: #2563eb;
  --color-brand-secondary: #0d9488;
  --color-brand-accent: #f59e0b;
  --color-routine-card: #f8fafc;

  /* Custom typography */
  --font-display: "Inter", system-ui, sans-serif;

  /* Custom breakpoint for ultra-wide monitors */
  --breakpoint-3xl: 1920px;
}
```

When declaring `--color-brand-primary`, Tailwind automatically generates the entire corresponding utility family: `bg-brand-primary`, `text-brand-primary`, `border-brand-primary`, `ring-brand-primary`, and opacity variants such as `bg-brand-primary/80`.



---

## 12. Breakpoints and Responsive Design

Responsive design in Tailwind CSS is grounded in the **Mobile-First** philosophy. This means that **any class applied without a breakpoint prefix applies to all devices, starting from the smallest screen (0px and up)**. The prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) represent breakpoints where progressive enhancements are applied through `@media (min-width: ...)` rules.

### System Default Breakpoints

Tailwind CSS v4 includes five standard predefined breakpoints:

| Prefix | Minimum Size (`min-width`) | Typical Device Type | Generated CSS Query |
| :--- | :--- | :--- | :--- |
| *(no prefix)* | `0px` | Mobile phones in portrait mode | General base rule |
| `sm:` | `640px` | Large phones / Tablets in portrait mode | `@media (min-width: 640px)` |
| `md:` | `768px` | Tablets in landscape mode / Compact laptops | `@media (min-width: 768px)` |
| `lg:` | `1024px` | Standard laptops and desktop screens | `@media (min-width: 1024px)` |
| `xl:` | `1280px` | Widescreen desktop monitors | `@media (min-width: 1280px)` |
| `2xl:` | `1536px` | Large-format and high-resolution monitors | `@media (min-width: 1536px)` |

### How Breakpoints Are Applied

Take `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Each class applies **from its width upward**, and when two collide, the one with the larger prefix wins. Above you see where each applies; below, which columns each screen sees:

<ThemedImage
  alt="Mobile-First Breakpoint Cascade in Tailwind CSS"
  sources={{
    light: useBaseUrl('/img/computacion-3/s12-tailwind-mobile-first-light.svg'),
    dark: useBaseUrl('/img/computacion-3/s12-tailwind-mobile-first-dark.svg'),
  }}
/>

#### Technical Breakdown of the Diagram

1. **Mobile Base (`0px+`)**: Establishes the minimum essential structure. For example, a single column (`grid-cols-1`), full width (`w-full`), and compact font sizes (`text-sm`).
2. **Progressive Activation (`min-width`)**: Unlike legacy *desktop-first* approaches that used `max-width` to hide or shrink elements, the *mobile-first* approach adds complexity gradually.
3. **Specific Override**: If you declare `text-sm md:text-base lg:text-lg`, a 390px mobile phone will use `text-sm`; an 800px tablet will apply `text-base`; and a 1440px monitor will apply `text-lg`.

:::important[Common Mistake: Thinking Desktop-First]
A very common mistake when starting with Tailwind is writing `sm:grid-cols-1 md:grid-cols-2`. The `sm:` prefix for a single column is redundant and harmful: on mobile screens below 640px the element would be left with no defined column rule. The correct approach is to write **`grid-cols-1 md:grid-cols-2`**, leaving the base rule unprefixed.
:::

### Implementation Example: Responsive Routine Grid

Let's see how to build a complete gym routine grid that adapts smoothly from a mobile phone to a desktop monitor:

```tsx title="Example: Responsive routine grid" showLineNumbers
// Responsive grid scaling from 1 column (mobile) to 4 columns (large screen)
import { RoutineCard } from './RoutineCard';

interface RoutineItem {
  id: string;
  title: string;
  category: string;
  exerciseCount: number;
  durationMinutes: number;
  isCompleted: boolean;
}

interface RoutineGridProps {
  routines: RoutineItem[];
  onToggleRoutine: (id: string) => void;
}

export function RoutineGrid({ routines, onToggleRoutine }: RoutineGridProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with responsive layout: column on mobile, row on tablet/desktop */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Workout Routines
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage your weekly exercise plan and track your progress
          </p>
        </div>

        {/* Actions: full width on mobile, auto on desktop */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
            New Routine
          </button>
        </div>
      </div>

      {/* Adaptive responsive grid:
          - Mobile (< 768px): 1 column (grid-cols-1)
          - Tablet (≥ 768px): 2 columns (md:grid-cols-2)
          - Laptop (≥ 1024px): 3 columns (lg:grid-cols-3)
          - Widescreen Desktop (≥ 1280px): 4 columns (xl:grid-cols-4)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            id={routine.id}
            title={routine.title}
            category={routine.category}
            exerciseCount={routine.exerciseCount}
            durationMinutes={routine.durationMinutes}
            isCompleted={routine.isCompleted}
            onToggle={onToggleRoutine}
          />
        ))}
      </div>
    </section>
  );
}
```

---

## 13. daisyUI

As an application grows, building every button, form field, modal, and navigation bar by combining dozens of Tailwind utility classes can produce verbose and repetitive JSX code. This is where **daisyUI 5** comes in.

### What Is daisyUI?

**daisyUI** is the most popular component plugin for Tailwind CSS. Unlike React-based component libraries like Material UI, Chakra UI, or Mantine (which impose heavy JavaScript wrappers, proprietary props, and increase client bundle size), daisyUI is **100% pure CSS**.

It provides **semantic class names** (such as `btn`, `card`, `navbar`, `input`, `badge`, `alert`) that encapsulate professional and accessible styles built on CSS variables and Tailwind utilities:

```html
<!-- Instead of writing 12 utilities for an accessible primary button: -->
<button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
  Save
</button>

<!-- With daisyUI, you only write: -->
<button class="btn btn-primary">
  Save
</button>
```

### Architectural Advantages of daisyUI 5

1. **Zero Runtime Overhead**: No additional React components, complex `forwardRef`s, or JavaScript listeners in the bundle. All native interactive behavior (HTML5) is preserved.
2. **Full State Control**: Your components remain native `<button>`, `<input>`, and `<dialog>` elements managed directly by React, Redux, or React Hook Form.
3. **Full Compatibility with Tailwind**: Any daisyUI class can be combined, overridden, or extended with standard Tailwind utilities (`btn btn-primary w-full md:w-auto shadow-lg`).

### Installation and Configuration in Tailwind v4

In the course project (`compunet3-202602`), daisyUI version 5 is installed as a development dependency (`daisyui: "^5.7.47"`) and integrates into Tailwind v4 using the `@plugin` directive in `app/globals.css`:

```css title="app/globals.css" showLineNumbers
@import "tailwindcss";

/* Official daisyUI 5 integration with default theme configuration */
@plugin "daisyui" {
    themes: light --default;
}
```

If you want to enable all built-in daisyUI themes (for example, to allow users to select their favorite theme from a menu), you can declare `themes: all;`:

```css title="Example: Enabling all themes in app/globals.css" showLineNumbers
@import "tailwindcss";

@plugin "daisyui" {
    themes: all;
}
```

### Theme System and the data-theme Attribute

daisyUI includes over 35 built-in design themes (`light`, `dark`, `cupcake`, `cyberpunk`, `synthwave`, `corporate`, `emerald`, `dracula`, among others). Each theme automatically defines a cohesive palette of color variables:

- `bg-base-100`: Background color of the main surface (for example, white in `light`, dark gray in `dark`).
- `bg-base-200`: Secondary background for cards and panels.
- `bg-base-300`: Tertiary background for borders or headers.
- `text-base-content`: Readable text color calibrated to contrast with `base-100`.
- `btn-primary`, `btn-secondary`, `btn-accent`, `btn-neutral`: Chromatic theme variants.

To apply a theme, use the standard HTML `data-theme` attribute on your application's `<html>` tag or on any secondary container:

```html title="Global or section-based theme application" showLineNumbers
<!-- Global theme applied to the entire application in the main layout -->
<html data-theme="dark">
  <body>
    <!-- This section will always use the corporate theme, regardless of the global theme -->
    <div data-theme="corporate" class="p-6 bg-base-100 text-base-content rounded-box">
      <h2 class="text-xl font-bold">Institutional Dashboard</h2>
      <button class="btn btn-primary mt-4">Corporate Action</button>
    </div>
  </body>
</html>
```

### daisyUI 5 Essential Component Catalog

Below, we review the most frequently used semantic component families in management applications such as our routine system:

#### 1. Buttons (`btn`)

The base `btn` class defines structure, padding, rounded borders, and `:hover` and `:active` states. It combines with chromatic variant and size classes:

```tsx title="Examples of buttons with daisyUI 5" showLineNumbers
// Buttons by role and variant
<button className="btn btn-primary">Start Routine</button>
<button className="btn btn-secondary">Edit Exercises</button>
<button className="btn btn-outline btn-accent">History</button>
<button className="btn btn-ghost">Cancel</button>

// Size modifiers: btn-xs, btn-sm, btn-md (default), btn-lg, btn-xl
<button className="btn btn-primary btn-sm">Small Action</button>
```

#### 2. Cards (`card`)

The `card` component organizes hierarchical content through its semantic submodules `card-body`, `card-title`, and `card-actions`:

```tsx title="components/routines/DaisyRoutineCard.tsx" showLineNumbers
// Routine card built with daisyUI 5 semantic classes
export function DaisyRoutineCard() {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-base-content">Upper Body Hypertrophy</h2>
          <span className="badge badge-primary">Strength</span>
        </div>
        <p className="text-sm text-base-content/70 mt-2">
          Focus on bench press, weighted pull-ups, and parallel bar dips.
        </p>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-outline">View Details</button>
          <button className="btn btn-sm btn-primary">Start</button>
        </div>
      </div>
    </div>
  );
}
```

#### 3. Navigation Bar (`navbar`)

The `navbar` component manages the top navigation bar with support for titles, search, and dropdown menus:

```tsx title="components/navigation/RoutineNavbar.tsx" showLineNumbers
// Top bar with title, search input, and user profile
export function RoutineNavbar() {
  return (
    <header className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl font-black text-primary">
          GymTrack Pro
        </a>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search routine..."
          className="input input-sm w-32 sm:w-64"
        />
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
              IC
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-48 p-2 shadow border border-base-200"
          >
            <li><a>My Profile</a></li>
            <li><a>Settings</a></li>
            <li><a className="text-error">Log Out</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
```

#### 4. Input Fields (`input`) and Form Controls

In daisyUI 5, inputs include borders by default (`input-bordered` and `select-bordered` were removed) and forms are grouped with `fieldset`, `fieldset-legend`, and `label` (replacing `form-control` and `label-text` from version 4):

```tsx title="Example: Accessible text input field" showLineNumbers
<fieldset className="fieldset w-full max-w-sm">
  <legend className="fieldset-legend">Routine name</legend>
  <input
    type="text"
    placeholder="e.g., Heavy leg day (squat + deadlift)"
    className="input input-primary w-full"
  />
  <p className="label">Minimum 3 characters</p>
</fieldset>
```

#### 5. Badges (`badge`) and Alerts (`alert`)

```tsx title="Examples of contextual Badges and Alerts" showLineNumbers
// Badges for exercise categorization
<span className="badge badge-info">Intermediate</span>
<span className="badge badge-success">45 Minutes</span>
<span className="badge badge-warning badge-outline">High Intensity</span>

// Informational alert for workout status
<div role="alert" className="alert alert-info shadow-sm mt-4">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>You completed 4 consecutive routines this week! Continue with the rest plan.</span>
</div>
```

### When to Use daisyUI vs. Tailwind Utilities?

The golden rule for a frontend engineering team is **complementarity**:

| UI Requirement | Recommended Tool | Practical Example |
| :--- | :--- | :--- |
| **Reusable standard components** | **daisyUI** | Buttons (`btn`), cards (`card`), alerts (`alert`), modals, navbars (`navbar`), avatars. |
| **Theme-dependent color tokens** | **daisyUI** | `bg-base-100`, `text-base-content`, `btn-primary` (change automatically with `data-theme`). |
| **Structure and spatial layout** | **Tailwind** | `grid`, `flex`, `gap-6`, `col-span-2`, `justify-between`, `items-center`. |
| **Granular sizing and spacing** | **Tailwind** | `p-4`, `m-auto`, `w-full`, `max-w-4xl`, `min-h-screen`. |
| **Responsive adaptability** | **Tailwind** | `sm:flex-row`, `md:grid-cols-3`, `hidden lg:block`. |
| **Use-case specific visual tweaks** | **Tailwind** | `rounded-full`, `opacity-75`, `shadow-xl`, `border-dashed`. |

---

## Self-Assessment Quiz

<Quiz id="compunet3-s12-tailwind-quiz">
  <Question title="What is the primary technical difference between Tailwind CSS utility classes and inline styles (style={{ ... }}) in React?">
    <Option>Inline styles only work in Server Components whereas Tailwind is exclusive to Client Components.</Option>
    <Option correct>Tailwind supports pseudo-classes, responsive media queries, design scales, and build-time purging; inline styles do not support media queries or pseudo-classes and clutter the DOM.</Option>
    <Option>Inline styles generate external CSS files at runtime whereas Tailwind injects styles directly into HTML attributes.</Option>
    <Option>Tailwind does not allow custom hexadecimal colors whereas inline styles do.</Option>
  </Question>
  <Question title="How is Tailwind CSS v4 configured in a modern Next.js project like compunet3-202602?">
    <Option>By creating a tailwind.config.js file with a content array pointing to page routes.</Option>
    <Option>By importing the tailwind.min.css file from a content delivery network (CDN) into layout.tsx.</Option>
    <Option correct>By declaring @import &#34;tailwindcss&#34;; in app/globals.css and connecting @tailwindcss/postcss in postcss.config.mjs, without requiring tailwind.config.js.</Option>
    <Option>By installing a special component called TailwindProvider and wrapping the React tree in the layout.</Option>
  </Question>
  <Question title="What is the new naming convention introduced in Tailwind CSS v4 for defining linear gradients from left to right?">
    <Option>gradient-horizontal from-blue-500 to-purple-500</Option>
    <Option correct>bg-linear-to-r from-blue-500 to-purple-500</Option>
    <Option>background-gradient-right from-blue-500 to-purple-500</Option>
    <Option>linear-gradient-to-r from-blue-500 to-purple-500</Option>
  </Question>
  <Question title="Under Tailwind's mobile-first design philosophy, which screens are affected by a class declared as md:grid-cols-2?">
    <Option>Only screens with an exact width of 768 pixels.</Option>
    <Option>All screens with a width under 768 pixels (mobile screens).</Option>
    <Option correct>All screens with a minimum width of 768 pixels and up (tablets and larger screens).</Option>
    <Option>Screens in portrait orientation regardless of their resolution.</Option>
  </Question>
  <Question title="In Tailwind's numerical spacing and sizing scale (for example, p-4, w-16), how many pixels does each numerical unit represent?">
    <Option>1 unit equals exactly 1 pixel (p-4 equals 4px).</Option>
    <Option correct>1 unit equals 0.25rem (4 pixels in the 16px base configuration), so p-4 equals 16px.</Option>
    <Option>1 unit equals 1 percentage point relative to viewport width.</Option>
    <Option>1 unit equals 8 pixels (p-4 equals 32px).</Option>
  </Question>
  <Question title="How should new design tokens (such as corporate colors or fonts) be declared in Tailwind CSS v4?">
    <Option>In the theme.extend section of the tailwind.config.js file using JavaScript.</Option>
    <Option correct>Directly in the main CSS file using the @theme directive and declaring CSS variables such as --color-brand-primary.</Option>
    <Option>By creating a theme.json file at the root of the Next.js repository.</Option>
    <Option>By directly modifying the source code inside the node_modules/tailwindcss package.</Option>
  </Question>
  <Question title="What is the main advantage of daisyUI compared to traditional component libraries like Material UI or Chakra UI?">
    <Option>daisyUI includes its own global state manager to synchronize data with the server.</Option>
    <Option correct>It is 100% pure CSS based on semantic classes, with no JavaScript component overhead in the client bundle and no proprietary abstractions.</Option>
    <Option>daisyUI does not allow using Tailwind utility classes to avoid design inconsistencies.</Option>
    <Option>It only works in server components (React Server Components).</Option>
  </Question>
  <Question title="What is the best practice when combining daisyUI with Tailwind CSS in a user interface?">
    <Option>Use daisyUI for all tags and prohibit the use of Tailwind utilities in the same component.</Option>
    <Option>Override daisyUI themes by applying inline styles via React's style attribute.</Option>
    <Option correct>Use daisyUI for semantic identity and theme colors (btn, card, bg-base-100) and Tailwind utilities for layout, spacing, and responsiveness (grid, flex, gap-4, md:flex-row).</Option>
    <Option>Replace all daisyUI classes with arbitrary values in square brackets.</Option>
  </Question>
</Quiz>
