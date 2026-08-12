---
sidebar_position: 1
---

# Jest in Express with TypeScript

Jest is a popular JavaScript testing framework used for unit, integration, and E2E testing. In this guide, we explore how to configure Jest for an Express application written in TypeScript.

## 1. Installing Dependencies

To get started, install the required development dependencies:

```bash
npm install --save-dev jest @types/jest
```

## 2. Creating the Jest Configuration File

Using `npm init jest@latest`, you can interactively generate a `jest.config.ts` configuration file tailored for Express and TypeScript.

### 2.1 Interactive Jest Setup

When running `npm init jest@latest`, answer the prompts as follows:

```bash
> npm init jest@latest

The following questions will help Jest to create a suitable configuration for your project

√ Would you like to use Jest when running "test" script in "package.json"? ... yes
√ Would you like to use Typescript for the configuration file? ... yes
√ Choose the test environment that will be used for testing » node
√ Do you want Jest to add coverage reports? ... yes
√ Which provider should be used to instrument code for coverage? » v8
√ Automatically clear mock calls, instances, contexts and results before every test? ... yes
```

**Configuration Breakdown:**

- **Use Jest when running "test" script**: Adds `"test": "jest"` to `package.json`, allowing tests to be executed via `npm test`.
- **Use TypeScript for configuration**: Generates `jest.config.ts` for type checking and IDE autocompletion.
- **Choose test environment**: `node` is ideal for backend Express APIs.
- **Add coverage reports**: Automatically generates code coverage reports.
- **Coverage provider**: `v8` leverages Node's native V8 engine for fast coverage tracking.
- **Automatically clear mock calls**: Prevents mock state pollution across tests.

### 2.2 Generated Configuration File

```typescript
import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
};

export default config;
```

This updates `package.json`:

```json
"scripts": {
  "test": "jest"
}
```

Next, install `ts-jest` so Jest can execute TypeScript files directly:

```bash
npm install --save-dev ts-jest
```

Then update `jest.config.ts` to configure `ts-jest`:

```typescript
import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["./src/tests"],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    moduleFileExtensions: ["ts", "js", "json", "node"],
};

export default config;
```

---

## 3. Directory Structure

A clean directory structure separates source code (`src`) from test suites (`src/tests` or `tests`).

<img src="/img/computacion-3/jest-1.png" alt="Directory Structure" width="500" />

---

## 4. Writing Your First Unit Test

Create a utility module in `src/utils/operations.util.ts`:

```typescript
export function add(a: number, b: number): number {
    return a + b;
}
```

Export it in `src/utils/index.ts`:

```typescript
export * from './operations.util';
```

Now create a unit test file in `tests/utils/operations.util.test.ts`:

```typescript
import { add } from "../../utils";

it("should add two numbers", () => {
    expect(add(2, 3)).toBe(5);
});
```

Run tests via terminal:

```bash
npm test
```

Expected output:

```bash
> compunet3-20252@1.0.0 test
> jest

 PASS  src/tests/utils/operation.util.test.ts
  √ should add two numbers (3 ms)

--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------|---------|----------|---------|---------|-------------------
All files           |     100 |      100 |     100 |     100 |                   
 index.ts           |     100 |      100 |     100 |     100 |                   
 operations.util.ts |     100 |      100 |     100 |     100 |                   
--------------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.277 s
Ran all test suites
```

> **Note:** If your editor highlights `it` or `expect` as undefined globals, include `"types": ["jest"]` in `tsconfig.json`:
> ```json
> {
>   "compilerOptions": {
>     "types": ["jest"]
>   }
> }
> ```

---

## 5. Testing and Coverage Reports

To configure explicit code coverage filters, update `collectCoverageFrom` in `jest.config.ts`:

```typescript
const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["./src"],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    moduleFileExtensions: ["ts", "js", "json", "node"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/index.ts",
        "!src/interfaces/**/*.ts",
        "!src/config/**/*.ts",
        "!src/models/**/*.ts",
        "!src/routes/**/*.ts",
        "!src/**/index.ts",
    ],
};
```

---

## 6. Service Testing and Mocking

### 6.1 Understanding Mocks and `jest.spyOn()`

- **`jest.mock()`**: Replaces an entire module or package with mock functions.
- **`jest.spyOn()`**: Intercepts specific methods on existing real objects without replacing the whole module.

```typescript
import { userService } from "../../services";
import { UserModel, UserRole } from "../../models";
import bcrypt from "bcrypt";

// Mock external packages & models
jest.mock("bcrypt", () => ({
    hash: jest.fn(),
}));

jest.mock("../../models", () => ({
    UserRole: { ADMIN: "admin", USER: "user" },
    UserModel: { create: jest.fn() },
}));

describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new user successfully", async () => {
        const mockInput = { name: "John Doe", email: "john@example.com", password: "secretPassword" };
        const mockHashed = "hashedSecret123";

        jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashed);
        (UserModel.create as jest.Mock).mockResolvedValue({ ...mockInput, _id: "123", password: mockHashed });

        const result = await userService.create(mockInput);

        expect(bcrypt.hash).toHaveBeenCalledWith("secretPassword", 10);
        expect(result).toHaveProperty("_id", "123");
    });
});
```
