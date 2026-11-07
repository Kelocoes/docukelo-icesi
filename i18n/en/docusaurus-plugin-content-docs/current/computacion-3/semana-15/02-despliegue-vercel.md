---
sidebar_position: 2
description: "Deploy a Next.js application on Vercel: create the project, environment variables, a GitHub Actions workflow that runs the E2E tests before deploying, previews per pull request and production."
---

# Deploying on Vercel with GitHub Actions

So far your application lives on `localhost`. **Deploying** means putting it on a server reachable from the internet, with a public address, in a **production** environment. [Vercel](https://vercel.com) is the platform from the company that maintains Next.js: it understands a Next.js project without configuration, builds it, publishes it and gives it an HTTPS URL.

In this document we do three things: publish the application, configure it with environment variables and **automate the deployment** with GitHub Actions so that the E2E tests from the [previous document](./01-pruebas-e2e-playwright.md) decide whether a change reaches production.

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

---

## 1. CI/CD and the two ways to deploy

Two acronyms you will always see together:

- **CI (continuous integration):** on every change, a clean machine installs the project and runs the tests. It is what we did at the end of the testing document.
- **CD (continuous delivery):** if everything passed, the change is published automatically, without anyone uploading files by hand.

Follow a change from start to finish. Choose the event and turn on «Fallan las pruebas» (the tests fail) to see what gets blocked:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/flujo-cicd-vercel/index.html"
  title="The path of a change from the push to the deployment on Vercel: GitHub Actions runs the E2E tests and only if they pass is it deployed, to a preview URL or to production"
  height={480}
/>

There are two ways to connect GitHub with Vercel:

| | **Git integration** | **GitHub Actions + Vercel CLI** |
| :--- | :--- | :--- |
| **How it is set up** | You import the repository in Vercel and that is it. | You write a workflow (`.github/workflows`) with the Vercel CLI. |
| **Where it is built** | On Vercel's servers. | On the GitHub Actions machine. |
| **Preview per pull request** | Automatic, with a comment on the PR. | You create it in the workflow. |
| **Runs your tests** | **No.** | **Yes**, and you can block the deployment if they fail. |

:::note[Do I need GitHub Actions to deploy?]
No. Vercel documents that, with the Git integration, most teams need no workflow at all: every pull request gets its preview URL, deployments are immutable and going back to a previous version is instantaneous. GitHub Actions is added when you have to **run tests**, security scans, performance budgets or approvals before deploying. Since we want the E2E tests to **decide**, in this course we use both: first the integration to understand the project (section 2) and then the workflow with the CLI (section 4).
:::

---

## 2. Create the project on Vercel

<StepByStep>
  <Step number="1" title="Create the account">
    Go to [vercel.com](https://vercel.com) and sign in with your GitHub account. The free plan (Hobby) is enough for the course.
  </Step>
  <Step number="2" title="Import the repository">
    Create a new project (**Add New > Project**) and choose your application's repository. Vercel will ask for permission to read it.
  </Step>
  <Step number="3" title="Review the configuration">
    Vercel detects that it is Next.js and proposes the install and build commands. If the project is inside a subfolder of the repository, indicate it in **Root Directory**.
  </Step>
  <Step number="4" title="Add the environment variables">
    Before the first deployment, add the ones the application needs (for example `API_URL`). We explain them in section 3.
  </Step>
  <Step number="5" title="Deploy">
    Press **Deploy**. When it finishes, Vercel gives you a URL like `https://tu-app.vercel.app`.
  </Step>
</StepByStep>

From then on, every `push` to the main branch creates a **production** deployment and every `push` to another branch or pull request creates a **preview** deployment with its own URL. Deployments are not overwritten: they are kept, and going back to a previous one (*rollback*) only moves a pointer, it rebuilds nothing.

---

## 3. Environment variables

Your application needs values that **change depending on where it runs** and that must not be in the code: the backend address (`API_URL`), keys, the application mode. Vercel stores them per project and per **environment**:

| Environment | When it is used |
| :--- | :--- |
| **Production** | Deployments from the production branch (usually `main`). |
| **Preview** | Deployments from any other branch or pull request. |
| **Development** | When you work on your computer. They are downloaded with `vercel env pull`. |

Choose where the change comes from and see which environment Vercel uses and with which values:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/entornos-vercel/index.html"
  title="The three Vercel environments, Development, Preview and Production, and which value of the API_URL variable each one uses depending on where the change comes from"
  height={520}
/>

What you should keep in mind:

- **A change to a variable only affects new deployments.** The deployment that is already published keeps the values it was built with. To see the change, deploy again.
- **`NEXT_PUBLIC_` is written into the code at build time.** Next.js replaces the variables that start with `NEXT_PUBLIC_` with their value inside the code that goes to the browser. If you read it as `process.env[name]` (with a dynamic name), it is not replaced and you get `undefined`.
- **Without the prefix, the variable is server-only.** `API_URL`, as we use it in [week 14](../semana-14/01-sesiones-en-nextjs.md) to talk to the backend from the Server Action, never reaches the browser.
- **`localhost` does not work in production.** `API_URL` must point to a **deployed** backend; on Vercel your `localhost:4000` does not exist.

```bash
vercel env pull .env.local   # downloads the Development variables to your computer
```

:::tip[The session cookie and HTTPS]
In week 14 the session cookie is marked `secure` when `NODE_ENV === 'production'`: it only travels over HTTPS. Vercel serves everything over HTTPS, so it works without changes; on `http://localhost` it is allowed in development.
:::

---

## 4. A GitHub Actions workflow: tests first, deployment after

With the Git integration, Vercel deploys **without waiting** for your tests. For the tests to decide, the deployment is done by GitHub Actions with the **Vercel CLI**, and the integration's automatic deployment is turned off.

### 4.1. Prepare the credentials

The workflow needs three pieces of data to act on your behalf. Go through where each one comes from:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/secretos-vercel/index.html"
  title="The three credentials of the Vercel deployment workflow, where each one comes from, and the four CLI commands that use them"
  height={900}
/>

1. **Token:** create it on your Vercel account's tokens page (or with `vercel tokens add`) and copy it: it is only shown once.
2. **The two ids:** at the root of your project, link it with Vercel. This creates `.vercel/project.json` with `orgId` and `projectId`:

```bash
npm install --global vercel@latest
vercel login
vercel link
```

3. **Store them in GitHub:** in the repository, **Settings > Secrets and variables > Actions > New repository secret**. Create `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.

:::warning[Do not push `.vercel` or the token]
The `.vercel/` folder is local: make sure it is in `.gitignore`. The token gives access to your account; if you write it in a repository file, **revoke it** and create another one.
:::

### 4.2. Turn off the integration's automatic deployment

If you leave both active, every change is deployed **twice**: once by the integration and once by the workflow. At the root of the project create `vercel.json`:

```json title="vercel.json" showLineNumbers
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": {
    "deploymentEnabled": false
  }
}
```

### 4.3. The workflow

A single file with three jobs: the tests, the preview deployment (on pull requests) and the production deployment (on `push` to `main`). The deployment jobs declare `needs: test`, so they **only run if the tests pass**:

```yaml title=".github/workflows/deploy.yml" showLineNumbers
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    env:
      API_URL: ${{ vars.API_URL }}
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: lts/*
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test

  deploy-preview:
    needs: test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: npm install --global vercel@latest
      - run: vercel pull --yes --environment=preview
      - run: vercel build
      - run: vercel deploy --prebuilt

  deploy-production:
    needs: test
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: npm install --global vercel@latest
      - run: vercel pull --yes --environment=production
      - run: vercel build --prod
      - run: vercel deploy --prebuilt --prod
```

| Piece | What it does |
| :--- | :--- |
| `on` | Runs on every `push` to `main` and on every pull request to `main`. |
| `env` (top) | Gives the CLI the token and the ids. The CLI reads `VERCEL_TOKEN` from the environment (the official guide uses the `--token` flag, which takes precedence). |
| `needs: test` | The job waits for the tests job and **does not run if it failed**. |
| `if: github.event_name ...` | Preview only on pull requests; production only on `push`. |
| `vercel pull` | Brings the variables and configuration of the chosen environment. |
| `vercel build` | Builds the application on the GitHub machine. |
| `vercel deploy --prebuilt` | Uploads the already-built result. **Without `--prebuilt`, Vercel would build it again**: two builds per commit. |
| `--prod` | Publishes to the production domain; without it, the deployment is a preview. |

:::note[Two details about `--prebuilt`]
Since the build happens outside Vercel, Vercel's *System Environment Variables* are not available during the build. And deployments made with the CLI are not treated as a full Git provider deployment: the branch and the commit are shown, but Vercel does not comment the URL on the pull request (the URL appears in the log of the `vercel deploy` step).
:::

:::warning[Pull requests from forks do not receive secrets]
For security, GitHub does not hand secrets to workflows that come from a fork. For pull requests between branches of the same repository (the usual case in the course) it works without changes.
:::

---

## 5. Testing the deployed application

The tests in the `test` job use a copy of the app started inside the workflow. But what reaches users is **the deployment**, with its variables, its HTTPS and its network. We can run the same tests against the preview URL.

`vercel deploy` prints the deployment URL as its output, so the workflow can pass it to the next job:

```yaml title=".github/workflows/deploy.yml (changes in the preview)" showLineNumbers
  deploy-preview:
    needs: test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    outputs:
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v6
      - run: npm install --global vercel@latest
      - run: vercel pull --yes --environment=preview
      - run: vercel build
      - id: deploy
        run: echo "url=$(vercel deploy --prebuilt)" >> "$GITHUB_OUTPUT"

  e2e-preview:
    needs: deploy-preview
    runs-on: ubuntu-latest
    env:
      BASE_URL: ${{ needs.deploy-preview.outputs.url }}
      VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: lts/*
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

And `playwright.config.ts` decides where to point: if `BASE_URL` exists, it tests the deployment and does **not** start the local server:

```ts title="playwright.config.ts (changes)" showLineNumbers
const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  // ...
  use: {
    baseURL,
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
      : {},
  },
  // the local app is only started when a deployment is not being tested
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
```

:::note[Why the `VERCEL_AUTOMATION_BYPASS_SECRET` secret?]
Preview deployments usually have **Deployment Protection** turned on: whoever opens the URL must sign in to Vercel, and Playwright cannot. Vercel lets you create an *automation bypass secret* in the project settings; Playwright sends it in the `x-vercel-protection-bypass` header and the page opens normally. Store it also as a GitHub secret.
:::

:::tip[If you use the Git integration instead of the CLI]
The Vercel integration notifies GitHub when a deployment is ready. A workflow with `on: deployment_status` can run Playwright against `github.event.deployment_status.target_url` without waiting or polling for anything. In addition, Vercel's **Deployment Checks** can prevent a deployment from being promoted to production until a GitHub Actions workflow finishes successfully. It is the alternative when you do not need to control the build.
:::

---

## 6. Review and fix problems

When something does not work, look for the symptom:

| Symptom | Probable cause | What to do |
| :--- | :--- | :--- |
| Every change is deployed twice | The Git integration is still active alongside the workflow. | Add `git.deploymentEnabled: false` in `vercel.json`. |
| I changed a variable in the dashboard and everything is the same | Variables only apply to new deployments. | Deploy again. |
| A `NEXT_PUBLIC_` variable reaches the browser as `undefined` | It is read with a dynamic name, or it is not defined for the environment being built. | Write it in full (`process.env.NEXT_PUBLIC_X`), define it in that environment and deploy again. |
| The preview uses production values (or the other way around) | The variable is not assigned to the right environment. | Check which environments each variable applies to. |
| The login works locally and fails on the deployment | `API_URL` points to `localhost`, or the backend is not reachable from Vercel. | Point `API_URL` to a deployed backend. |
| Tests against the preview ask to sign in to Vercel | Deployment Protection is active. | Use the bypass secret (section 5). |
| The workflow has no access to `VERCEL_TOKEN` | The secret does not exist, has another name, or the pull request comes from a fork. | Check the names in **Settings > Secrets**. |

If a production deployment goes wrong, open the project dashboard on Vercel and go back to a previous version (*instant rollback*): the old version is already built, so the change is immediate.

---

## Further Reading

- [Vercel: How can I use GitHub Actions with Vercel?](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
- [Vercel: Environment variables](https://vercel.com/docs/environment-variables)
- [Vercel: Deployment environments](https://vercel.com/docs/deployments/environments)
- [Vercel CLI: deploy](https://vercel.com/docs/cli/deploy)
- [Vercel: Protection Bypass for Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation)
- [Vercel: Git configuration (`vercel.json`)](https://vercel.com/docs/project-configuration/git-configuration)
- [Playwright: Continuous Integration](https://playwright.dev/docs/ci-intro)
