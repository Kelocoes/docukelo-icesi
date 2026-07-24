---
name: docusaurus-quiz
description: Guidelines, formatting rules, and component specifications for embedding interactive multiple-choice quizzes (<Quiz>, <Question>, <Option>) in DocuKelo Docusaurus documentation.
---

# Docusaurus Interactive Quiz Creation Guide

This skill provides complete, self-contained guidelines for generating, structuring, and embedding interactive multiple-choice quizzes in DocuKelo documentation files using custom MDX components (`<Quiz>`, `<Question>`, `<Option>`).

---

## 1. Core Principles & Grounding Rules

1. **Strict Content Grounding (Default Behavior)**:
   Unless explicitly instructed otherwise by the user, **100% of questions and options MUST be derived strictly from the text, code examples, and technical concepts present in the target Markdown/MDX document** where the quiz is placed. Do not introduce outside knowledge or unmentioned topics.

2. **Mandatory Unique Quiz ID**:
   Every `<Quiz>` component **MUST** possess a unique, descriptive, kebab-case `id` attribute (e.g., `id="web-env-intro-ts-quiz"`).
   - **Why?** The React `Quiz` component uses `id` to serialize user answers, current question index, and completion status into `localStorage` under `docukelo-quiz-${id}`. Omitting or duplicating `id` causes state collision or failure to persist progress.

3. **No Imports Required**:
   The quiz components are globally registered in `src/theme/MDXComponents.js`. You can use `<Quiz>`, `<Question>`, and `<Option>` directly inside any `.md` or `.mdx` file without adding `import` statements.

4. **Tone & Visual Guardrails**:
   - Maintain a supportive, pedagogical, and student-centric tone.
   - **No Emojis**: Do not use emojis in headers, question titles, or option text.
   - Distractors (incorrect options) must be realistic and test actual conceptual understanding.

---

## 2. React Component Architecture Reference

The quiz subsystem is powered by custom React components located in `src/components/Quiz/`:

* `src/components/Quiz/Quiz.jsx`: Main parent component managing question navigation state, scoring, and `localStorage` persistence.
* `src/components/Quiz/components/Question.jsx`: Wrapper component for an individual question title and options list.
* `src/components/Quiz/components/Option.jsx`: Interactive button component representing an individual answer choice.
* `src/components/Quiz/components/QuizContext.js`: React Context providing selected option state to child options.
* `src/components/Quiz/components/QuizSummary.jsx`: End-of-quiz score breakdown and retry button.

### Props Specification

| Component | Prop | Type | Description |
| :--- | :--- | :--- | :--- |
| `<Quiz>` | `id` | `string` | **Required.** Unique identifier for `localStorage` state management (`docukelo-quiz-${id}`). |
| `<Question>` | `title` | `string` | **Required.** The question stem / prompt text displayed to the student. |
| `<Option>` | `correct` | `boolean` | Optional flag (`correct` or `correct={true}`). Marks the single correct answer choice. |

---

## 3. Standard Quiz Structure & MDX Syntax

A quiz block should be placed at the end of the documentation file, preceded by a horizontal rule (`---`) and a section header (e.g., `## Cuestionario de Autoevaluación`).

```mdx
---

## Cuestionario de Autoevaluación

<Quiz id="<course-code>-<topic-name>-quiz">
  <Question title="¿Cuál es la función principal de X en el contexto de Y?">
    <Option>Opción incorrecta 1.</Option>
    <Option correct>Opción correcta basada estrictamente en el documento.</Option>
    <Option>Opción incorrecta 2.</Option>
    <Option>Opción incorrecta 3.</Option>
  </Question>
  <Question title="¿Qué sucede cuando se ejecuta Z?">
    <Option correct>Opción correcta.</Option>
    <Option>Opción incorrecta 1.</Option>
    <Option>Opción incorrecta 2.</Option>
    <Option>Opción incorrecta 3.</Option>
  </Question>
</Quiz>
```

---

## 4. Question Generation Workflow

When requested to create or update a quiz for a module:

1. **Read the Target Document**: Inspect the full text of the markdown document to identify key definitions, rules, syntax examples, and comparison tables.
2. **Determine Question Quantity**:
   - Short/Medium modules: **At least 10 questions**.
   - Core/Foundational modules (e.g., Intro to TypeScript): **Around 20 questions**.
3. **Format Options**:
   - Always provide **4 options** per question.
   - Ensure exactly **1 option** has the `correct` prop.
4. **Escape Reserved MDX Characters**:
   - In JSX string attributes (like `title="..."`), escape double quotes as `&quot;` or use single quotes.
   - For angle brackets inside option text (e.g., `<T>`), use XML entities (`&lt;T&gt;`) so MDX does not misinterpret them as unclosed HTML/JSX tags.
   - **Crucial**: Curly braces `{` and `}` inside option text or titles MUST be escaped as XML entities (`&#123;` and `&#125;`). MDX parses raw `{` and `}` as JavaScript expressions using Acorn, which causes compilation errors (e.g., `Could not parse expression with acorn`) if the contents are code snippets containing syntax like `{ ... }` or `{ prop: value }`.

