---
sidebar_position: 2
---

# App Router vs. Pages Router

The routing system is the core of any modern web application. Throughout its development history, Next.js has substantially evolved its approach to mapping files into accessible browser URLs. The architectural transition from the traditional **Pages Router** (introduced in early Next.js versions) to the modern **App Router** (introduced in Next.js 13 and consolidated as the industry default) represents one of the most significant paradigm shifts in the React ecosystem.

In this document, we explore the conceptual and architectural differences between both models, analyze how files are organized on disk, and understand the transition across data fetching patterns.

---

## 1. Historical Evolution of Next.js Routers

For more than six years, Next.js operated under the convention of the `pages/` directory. This model popularized declarative routing in React: creating a file like `pages/about.tsx` was all it took for the framework to automatically generate the `/about` route.

Despite its initial simplicity, as enterprise-scale applications grew, the Pages Router exposed structural limitations:
- **Rigid Coupling Between Files and Public Routes**: Any file placed inside `pages/` (even auxiliary components or utilities) was treated as a public route, forcing developers to isolate UI components into external directories like `src/components/`.
- **Difficulty with Complex Nested Layouts**: Preserving persistent navigation bars, side menus, or scroll state required overloading `pages/_app.tsx` or implementing unintuitive patterns via custom `getLayout` functions.
- **Fragmented Data Fetching**: Retrieving data depended on special page-level functions (`getServerSideProps`, `getStaticProps`), which could not be executed inside individual child components.

To overcome these architectural hurdles and fully adopt the **React Server Components (RSC)** paradigm, the Next.js engineering team developed the **App Router**, hosted inside the `app/` directory.

---

## 2. Structural Comparison: From Files to URLs

The most immediate visible difference between both routers lies in how routes are resolved from the filesystem tree:

<img src="/img/computacion-3/nextjs-app-vs-pages-router.svg" alt="Directory structure comparison between Pages Router and App Router" width="100%" />

### Architectural Breakdown of the Diagram

#### Left Panel: Pages Router (`pages/`)
- **Core Rule**: *Every JavaScript or TypeScript file placed in the directory becomes an accessible public route.*
- `pages/index.tsx` maps to `/`.
- `pages/about.tsx` maps directly to `/about`.
- `pages/blog/index.tsx` serves `/blog`.
- `pages/blog/[slug].tsx` captures dynamic URL parameters (`/blog/:slug`).
- `pages/_app.tsx` wraps the entire application to inject global stylesheets and state providers, but re-evaluates across every page transition.

#### Right Panel: App Router (`app/`)
- **Core Rule**: *Folders define URL route segments, and exclusively the special `page.tsx` file exposes that route to the public.*
- `app/layout.tsx` defines the root shell (`<html>` and `<body>`) shared across all child routes.
- `app/page.tsx` defines the UI for the root route `/`.
- `app/about/page.tsx` defines the `/about` route.
- `app/blog/page.tsx` defines the `/blog` route.
- `app/blog/[slug]/page.tsx` serves dynamic blog segments.
- **Safe Colocation**: Unlike `pages/`, in the App Router you can safely store auxiliary components (`button.tsx`), scoped stylesheets (`styles.module.css`), unit tests (`page.test.tsx`), or helper utilities (`utils.ts`) inside the same `about/` directory without risking accidental exposure as public URL endpoints.

---

## 3. Data Fetching Comparison

Moving to the App Router changed not only file locations, but also fundamentally revamped the mental model for how data travels from servers to components:

<img src="/img/computacion-3/nextjs-data-fetching-evolution.svg" alt="Data Fetching Evolution: Monolithic in Pages Router vs Concurrent in App Router" width="100%" />

### Evolution Analysis

1. **The Monolithic Approach of Pages Router (Left Panel)**:
   - All responsibility for querying databases or external APIs resided strictly inside the top-level `getServerSideProps` function on the page.
   - If a page required user profile data, course listings, and statistical metrics, it had to aggregate all queries into a single blocking promise. If one query stalled for 2 seconds, **the entire page remained frozen**, displaying nothing to the end user.
   - For deeply nested child components (such as `UserCard`) to receive data, parents had to manually forward props through intermediate levels (`MainSection`), an architectural friction known as **Prop Drilling**.
2. **The Colocated and Concurrent Approach of App Router (Right Panel)**:
   - The page (`page.tsx`) no longer acts as a heavy data intermediary, but rather as a **lightweight visual orchestrator**.
   - Each Server Component (`UserHeader`, `CourseGrid`, `StatsWidget`) autonomously executes its own `async/await` fetch logic or database query directly on the server (*colocation*).
   - Powered by **React Suspense and Streaming**, if an analytical widget takes longer to compute, wrapping it in `<Suspense fallback={<Skeleton />}>` allows the rest of the page to stream to the browser immediately, with the heavy widget streaming in progressively without blocking the screen.

---

### Comparative Code: Data Fetching

#### In Pages Router (Classic Approach)

```tsx title="pages/cursos/[slug].tsx" showLineNumbers
import { GetServerSideProps } from 'next';

interface CourseProps {
  course: { id: string; title: string; description: string };
}

// 1. The server function must be exported separately
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  const res = await fetch(`https://api.icesi.edu.co/courses/${slug}`);
  const course = await res.json();

  // 2. Injected into the component via mandatory props
  return { props: { course } };
};

// 3. The React component receives pre-resolved props
export default function CourseDetail({ course }: CourseProps) {
  return (
    <article>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
    </article>
  );
}
```

#### In App Router (Modern RSC Approach)

In the App Router, every component inside `app/` is by default a **Server Component**. It can be declared as an `async` function, allowing direct `await` calls inside its own body:

```tsx title="app/cursos/[slug]/page.tsx" showLineNumbers
interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. The component is an async function running directly on the server
export default async function CourseDetail({ params }: PageProps) {
  // In Next.js 15+, dynamic route parameters are resolved as a Promise
  const { slug } = await params;
  
  // 2. Direct data fetching inside the component body
  const res = await fetch(`https://api.icesi.edu.co/courses/${slug}`);
  const course = await res.json();

  return (
    <article>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
    </article>
  );
}
```

:::info[Mental Simplification]
You no longer need to memorize the nuanced differences between `getServerSideProps`, `getStaticProps`, and `getInitialProps`. In the App Router, you simply use the standard JavaScript `fetch()` API with granular caching configurations (`cache: 'force-cache'`, `cache: 'no-store'`, or `{ next: { revalidate: 60 } }`).
:::

---

## 4. Comprehensive Comparison Matrix

| Feature | Pages Router (`pages/`) | App Router (`app/`) |
| :--- | :--- | :--- |
| **Root Directory** | `pages/` | `app/` (or `src/app/`) |
| **Component Paradigm** | Client Components by default with full hydration. | **React Server Components (RSC)** by default, explicit Client Components. |
| **Route Definition** | File-based (`profile.tsx` &rarr; `/profile`). | Folder-based with `page.tsx` convention (`profile/page.tsx`). |
| **File Colocation** | Difficult (any file in `pages/` generates a public route). | Native (safely store components and utilities inside each folder). |
| **Nested Layouts** | Complex; requires `getLayout` or a monolithic `_app.tsx`. | Native and composable using per-segment `layout.tsx` files. |
| **State Preservation** | Page transitions usually re-mount the entire component tree. | Shared layouts preserve their state intact during navigations. |
| **Error and Loading States** | Manual state hooks (`isLoading`, `error`). | Declarative special files (`loading.tsx` and `error.tsx`). |
| **Metadata Definition (SEO)** | `<Head>` tag imported from `next/head`. | Static `metadata` object or asynchronous `generateMetadata` function. |
| **API Endpoints** | Files in `pages/api/*.ts` with `(req, res)` handlers. | Files named `route.ts` based on Web Fetch API standards (`GET`, `POST`). |

---

## 5. Which Router Should You Choose for New Projects?

The Vercel engineering team and the React core community designate the **App Router** as the recommended choice for all new web development. All recent React innovations—such as Server Components, streaming Suspense, Server Actions, and Turbopack compiler optimizations—are designed and prioritized specifically for the App Router architecture.

The Pages Router continues to be maintained for backward compatibility in legacy codebases, but does not receive new architectural features.

---

## Self-Assessment Quiz

<Quiz id="compu3-s9-02-routers-quiz">
  <Question title="What is the core rule that defines a public route in the App Router?">
    <Option>Any .tsx file located inside the app/ directory automatically generates an accessible URL.</Option>
    <Option correct>Folders define URL path segments, and exclusively the presence of the special page.tsx file exposes the route to the public.</Option>
    <Option>Routes must be declared in a routes.json configuration file at the repository root.</Option>
    <Option>Routes are only registered if the component exports a 'use route' directive.</Option>
  </Question>

  <Question title="What advantage does file colocation provide in the App Router compared to Pages Router?">
    <Option>Reduces RAM consumption on the PostgreSQL database server.</Option>
    <Option correct>Allows storing auxiliary components, styles, and unit tests directly in the segment folder without exposing them as public URLs.</Option>
    <Option>Disables the need to compile TypeScript in local environments.</Option>
    <Option>Enables creating public routes that do not require file names.</Option>
  </Question>

  <Question title="What happens to the components inside layout.tsx in the App Router when navigating between sibling routes that share it?">
    <Option>The layout is unmounted and recreated from scratch, losing its internal state.</Option>
    <Option correct>The layout stays mounted and preserves its state intact, re-rendering only the dynamic child segment (page.tsx).</Option>
    <Option>The browser executes a hard page reload equivalent to pressing F5.</Option>
    <Option>Next.js automatically redirects the user to the error.tsx fallback.</Option>
  </Question>

  <Question title="How is data fetched on the server inside a Server Component in the App Router?">
    <Option>By mandatorily exporting the getServerSideProps function in the same file.</Option>
    <Option correct>By declaring the component as an async function and executing database queries or fetch requests directly within its body.</Option>
    <Option>By injecting a proprietary useServerData() hook available only in Chromium browsers.</Option>
    <Option>By sending a synchronous message through the WebSockets protocol.</Option>
  </Question>

  <Question title="In Next.js 15+, how are dynamic route parameters (e.g., [slug]) accessed inside the App Router?">
    <Option>Through the global process.env.SLUG variable.</Option>
    <Option>By reading context.query.slug synchronously as a static string.</Option>
    <Option correct>Dynamic route parameters are passed via props as a Promise and must be resolved using await params.</Option>
    <Option>Via the @Param() decorator imported from @nestjs/common.</Option>
  </Question>

  <Question title="What was one of the most prominent architectural limitations of pages/_app.tsx in the Pages Router?">
    <Option>It did not support global CSS stylesheets or web fonts.</Option>
    <Option correct>It functioned as a monolithic wrapper that re-evaluated on every route change, complicating independent nested layouts.</Option>
    <Option>It prevented the application from executing on Linux servers.</Option>
    <Option>It permitted a maximum of three child routes across the entire project.</Option>
  </Question>

  <Question title="Which special file replaces traditional pages/api/*.ts endpoints in the App Router?">
    <Option>controller.ts</Option>
    <Option>service.ts</Option>
    <Option correct>route.ts</Option>
    <Option>handler.ts</Option>
  </Question>

  <Question title="What declarative mechanism does the App Router provide to display a loading screen while page data resolves?">
    <Option>Exporting a const fallback = true flag inside page.tsx.</Option>
    <Option correct>Creating a loading.tsx file in the segment folder, which Next.js automatically wraps in a React Suspense boundary.</Option>
    <Option>Installing redux-thunk to intercept pending HTTP states.</Option>
    <Option>Configuring an artificial setTimeout delay on the client.</Option>
  </Question>

  <Question title="How is search engine metadata (SEO) defined on a page in the App Router?">
    <Option>Exclusively by using the &lt;Head&gt; component imported from 'next/head'.</Option>
    <Option correct>By exporting a static 'metadata' object typed as Metadata or an asynchronous 'generateMetadata' function.</Option>
    <Option>By directly editing the index.html file located in the public/ folder.</Option>
    <Option>By injecting meta tags via document.createElement('meta') inside a useEffect hook.</Option>
  </Question>

  <Question title="Can Pages Router and App Router components coexist in the same repository during a gradual migration?">
    <Option>No, Next.js throws a fatal build error if both app/ and pages/ directories exist simultaneously.</Option>
    <Option correct>Yes, Next.js supports incremental coexistence; in case of route conflicts, the App Router takes precedence.</Option>
    <Option>Only if two separate HTTP port listeners are launched locally.</Option>
    <Option>Only if TypeScript is disabled inside next.config.ts.</Option>
  </Question>
</Quiz>
