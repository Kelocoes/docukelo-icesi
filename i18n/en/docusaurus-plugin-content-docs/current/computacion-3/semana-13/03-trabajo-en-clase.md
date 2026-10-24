---
sidebar_position: 3
description: "Build the login and register screens, header, and navigation bar of the routines app with Tailwind CSS in this in-class assignment."
---

# In-Class Assignment

Build, **at the visual component level only**, the login and register screens, the header, and the navigation bar of the routines app, using **Tailwind CSS v4** and **daisyUI 5**. There is no backend or real authentication: the forms use local state and visual validation.

<CardGrid cols={2}>
  <Card
    title="Starting point: week-12/next-redux"
    description="Course branch with Next.js 16, Tailwind CSS v4 and daisyUI 5 already configured in app/globals.css. You can also use your own project."
    link="https://github.com/Kelocoes/compunet3-202602/tree/week-12/next-redux"
  />
  <Card
    title="daisyUI components"
    description="Official catalog: navbar, menu, dropdown, card, input, btn."
    link="https://daisyui.com/components/"
  />
</CardGrid>

This is a reference of how it can look, built with the real daisyUI 5 components. Switch between the screens and try the mobile view:

<InteractiveFrame
  src="/interactive/computacion-3/semana-13/mockup-auth/index.html"
  title="Reference mockup: login, register, header and navbar with daisyUI"
  height={620}
/>

---

## What You Must Build

1. **Login (`/login`)**: email, password, a "Sign in" button, and a link to the register screen with `<Link>`. On submit, if the fields are not empty, navigate with `router.replace('/routines')` (review the event-driven navigation document).
2. **Register (`/register`)**: name, email, password, and confirmation. If the passwords do not match, show the error with `input-error` and a message. Include a link back to the login.
3. **Header**: the application name and a user action (avatar or profile button).
4. **Navbar**: links to the application sections, with the active link highlighted using `usePathname()` (a component with `'use client'`). On desktop, a horizontal menu (`menu menu-horizontal`); on mobile, a hamburger button with `dropdown` or `drawer`.

## Rules

- Combine daisyUI classes (`btn`, `input`, `card`, `navbar`, `menu`) with Tailwind utilities (`flex`, `gap-4`, `max-w-md`, `mx-auto`). No custom CSS unless you can justify it.
- *Mobile-first*: it must look good at 360 px and scale up with `md:` and `lg:`.
- Use `<Link>` to connect screens; use `router.replace` only for the redirect after login.

## Delivery and Grading

Upload your project to a **private repository inside the course organization** on GitHub and submit the link on the course platform. The instructor will announce the time limit during the session.

| Criterion | Weight |
|:---|:---:|
| Complete login and register screens, with visual validation | 30% |
| Responsive: collapsible menu on mobile and horizontal on desktop | 25% |
| Correct use of daisyUI and Tailwind | 20% |
| Navigation: `<Link>`, active link with `usePathname`, and `router.replace` after login | 15% |
| Code organization: reusable components and tidy folders | 10% |
