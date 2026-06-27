# 🐱 React Native Testing Guide - Rate My Kitty

> *A friendly, step-by-step guide to mastering unit testing in Expo React Native!*

---

## 📋 Table of Contents

1. [What is Testing & Why Do We Care?](#1-what-is-testing--why-do-we-care)
2. [Setting Up Your Testing Environment](#2-setting-up-your-testing-environment)
3. [Your First Test - Testing a Pure Function](#3-your-first-test---testing-a-pure-function)
4. [Testing a Simple Component](#4-testing-a-simple-component)
5. [Testing Components with Props](#5-testing-components-with-props)
6. [Testing User Interactions](#6-testing-user-interactions)
7. [Testing Components with Context](#7-testing-components-with-context)
8. [Mocking API Calls](#8-mocking-api-calls)
9. [Testing Custom Hooks](#9-testing-custom-hooks)
10. [Testing Context Providers](#10-testing-context-providers)
11. [Testing Async Operations & Error States](#11-testing-async-operations--error-states)
12. [Integration Testing](#12-integration-testing)
13. [Testing Best Practices & Patterns](#13-testing-best-practices--patterns)

---

## 1. What is Testing & Why Do We Care?

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What is Testing?</div>

Testing is like having a robot assistant that checks your code for you! Instead of manually clicking through your app every time you make a change, you write **tests** - little programs that verify your code works correctly.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Do We Test?</div>

- **🛡️ Catch bugs early** - Find problems before your users do!
- **🔄 Refactor with confidence** - Change code knowing your tests will catch mistakes
- **📝 Living documentation** - Tests show exactly how your code is *supposed* to work
- **🧠 Mental safety net** - Sleep better knowing your app won't break randomly

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**Unit Test**</span> - Testing one small piece of code in isolation (like a single function or component)
- <span style="color: #50C878;">**Assertion**</span> - A statement that checks if something is true (e.g., "this button should be red")
- <span style="color: #50C878;">**Test Runner**</span> - The tool that finds and runs your tests (we use **Jest**)
- <span style="color: #50C878;">**Mock**</span> - A fake version of a real thing (like a pretend API that doesn't make real network calls)
- <span style="color: #50C878;">**Coverage</span> - How much of your code is covered by tests

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">When to Use It</div>

✅ Always! Every feature you build should have tests.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">When NOT to Use It</div>

❌ Don't test things that never change (like third-party libraries)
❌ Don't test obvious framework behavior (React already tested their own code)

---

### 📊 Difficulty Levels

| Level | Color | Description |
|-------|-------|-------------|
| 🐣 **Junior** | 🟢 Green | Basic concepts, following patterns |
| 🧑‍💻 **Mid** | 🟡 Yellow | Understanding *why*, handling edge cases |
| 🧙 **Senior** | 🟠 Orange | Architecture decisions, mocking strategies |
| 🏆 **Principal** | 🔴 Red | Testing philosophy, trade-offs, team patterns |

---

## 2. Setting Up Your Testing Environment

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

Before we can write tests, we need to make sure our testing tools are installed and configured. Think of this like setting up your kitchen before you start cooking!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why We Need This</div>

Without the right setup, your tests won't run, or worse - they'll give you false confidence by passing when they shouldn't!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What's Already Set Up</div>

Looking at your `package.json`, I can see you already have:

- ✅ **jest-expo** - The Expo-specific Jest preset
- ✅ **@testing-library/react-native** - Tools for testing React Native components
- ✅ **@types/jest** - TypeScript types for Jest (so your editor gives you autocomplete!)
- ✅ **jest** - The test runner itself
- ✅ **"test": "jest"** script in package.json
- ✅ **jest** config with `"preset": "jest-expo"`

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">How to Check It Works</div>

Run this command in your terminal:

```bash
npx jest --passWithNoTests
```

This will tell Jest to run but not fail if there are no tests yet.
If you see something like "No tests found" - that's actually **good**! It means Jest is installed and working, it just can't find any test files yet.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**Preset**</span> - A pre-configured setup so you don't have to configure everything from scratch
- <span style="color: #50C878;">**Test Environment**</span> - The simulated browser/device where tests run

---

### 🐣 Junior Level

Just know that `npx jest` runs all your tests. Test files are any files ending in `.test.ts` or `.test.tsx` or `.spec.ts`.

### 🧑‍💻 Mid Level

Understand that `jest-expo` preset handles:
- Mocking React Native's native modules (like `AsyncStorage`, `Dimensions`)
- Setting up the right test environment
- Configuring module resolution for Expo projects

### 🧙 Senior Level

Know that you can add a `jest.config.js` file for more control:

```javascript
module.exports = {
  preset: "jest-expo",
  setupFilesAfterSetup: ["./jest-setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  }
};
```

### 🏆 Principal Level

Consider whether you need different Jest configs for different types of tests (unit vs integration vs e2e). For now, one config is perfect!

---

## 3. Your First Test - Testing a Pure Function

> ✅ **Completed!** You created `helpers/score-calculator.ts` and `helpers/score-calculator.test.ts` with 5 passing tests! You also created `helpers/vote-calculator.ts` and `helpers/vote-calculator.test.ts` with 4 passing tests!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

We're going to write our very first test! We'll start with the easiest thing to test: a **pure function**. A pure function is a function that:
1. Given the same input, always returns the same output
2. Has no side effects (doesn't change anything outside itself)

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Start Here?</div>

Pure functions are the **easiest** thing to test because:
- No setup needed
- No mocking needed
- No async waiting needed
- Just "input goes in, output comes out"

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Concepts Explained</div>

### What is a test file?
A test file is just a normal TypeScript file with a special name. Jest automatically finds any file ending with:
- `.test.ts` (for regular functions)
- `.test.tsx` (for React components)
- `.spec.ts` (another common pattern)

Test files should live **next to the file they test** in the same folder. This makes it easy to find tests for a specific file.

### The Three Parts of a Test (AAA Pattern)
Every test follows the same structure:
1. **Arrange** - Set up the data you need
2. **Act** - Do the thing you're testing
3. **Assert** - Check that the result is correct

Example: Testing a vending machine:
- **Arrange**: Put a coke in slot A3, put £1 in the coin slot
- **Act**: Press button A3
- **Assert**: Check that a coke comes out

### What is `describe` and `it`?
Think of `describe` like a folder on your computer, and `it` like a file inside that folder:
```
📁 describe("calculateScore")
  ├── 📄 it("returns 0 when no votes")
  ├── 📄 it("returns 100 when all upvotes")
  └── 📄 it("returns 50 when equal")
```

### What is `expect` and `toBe`?
- `expect(value)` wraps the value you want to check
- `.toBe(expected)` is a **matcher** that checks strict equality (`===`)

```typescript
expect(2 + 2).toBe(4)   // ✅ Passes
expect(2 + 2).toBe(5)   // ❌ Fails
```

### Writing Good Test Names
Your test name should complete the sentence: "It **should** ..."
- ❌ Bad: `it("test the function")` - What does "test" mean?
- ✅ Good: `it("returns 0 when there are no votes")` - Clear and specific!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Function We Tested</div>

```typescript
// helpers/score-calculator.ts
export function calculateScore(upvotes: number, downvotes: number): number {
  const total = upvotes + downvotes;
  if (total === 0) return 0;
  return Math.round((upvotes / total) * 100);
}
```

This is a **pure function** because:
- Same inputs ALWAYS give the same output
- It doesn't change anything outside itself (no side effects)

### Input/Output Table

| upvotes | downvotes | total | calculation | result |
|---------|-----------|-------|-------------|--------|
| 0       | 0         | 0     | (early return) | **0** |
| 10      | 0         | 10    | (10/10) × 100 = 100 | **100** |
| 5       | 5         | 10    | (5/10) × 100 = 50 | **50** |
| 3       | 1         | 4     | (3/4) × 100 = 75 | **75** |
| 1       | 3         | 4     | (1/4) × 100 = 25 | **25** |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Tests We Wrote</div>

```typescript
import { calculateScore } from "./score-calculator";

describe("calculateScore", () => {
  it("should return 0 if upvotes and downvotes are 0", () => {
    expect(calculateScore(0, 0)).toBe(0);
  });

  it("should return 100 if upvotes are 10 and downvotes are 0", () => {
    expect(calculateScore(10, 0)).toBe(100);
  });

  it("should return 50 when upvotes and downvotes are equal (5 and 5)", () => {
    expect(calculateScore(5, 5)).toBe(50);
  });

  it("should return 75 if upvotes are 3 and downvotes are 1", () => {
    expect(calculateScore(3, 1)).toBe(75);
  });

  it("should return 25 if upvotes are 1 and downvotes are 3", () => {
    expect(calculateScore(1, 3)).toBe(25);
  });
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Code Review Learnings</div>

**Gotcha! 🚨** Always make sure your test name matches what the code actually does. A misleading test name is worse than no test name - it will send you in the wrong direction when debugging!

Example of a misleading name:
```typescript
it("should return 5 if upvotes are 5 and downvotes are 50", () => {
    expect(calculateScore(5, 5)).toBe(50); // Name says downvotes=50, code uses downvotes=5!
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**describe**</span> - A way to group related tests together
- <span style="color: #50C878;">**it**</span> or <span style="color: #50C878;">**test**</span> - Defines an individual test case
- <span style="color: #50C878;">**expect**</span> - The assertion - what we expect to be true
- <span style="color: #50C878;">**toBe**</span> - A matcher that checks exact equality (like `===`)
- <span style="color: #50C878;">**Pure Function**</span> - Same inputs always give same outputs, no side effects
- <span style="color: #50C878;">**AAA Pattern**</span> - Arrange, Act, Assert - the three parts of every test

---

### 🐣 Junior Level

Just follow the pattern: `describe → it → expect → toBe`. Think of it like writing a sentence: "I expect that calculateScore(0,0) **to be** 0". Test names should complete the sentence "It should...".

### 🧑‍💻 Mid Level

Know the difference between matchers:
- `toBe()` - for primitives (numbers, strings, booleans) - uses `===`
- `toEqual()` - for objects and arrays (checks value, not reference)
- `toStrictEqual()` - like toEqual but stricter (checks types too)

Always make sure your test names accurately describe what the code does. A misleading test name is a bug in your documentation!

### 🧙 Senior Level

Think about **edge cases**:
- What if someone passes negative numbers?
- What if someone passes decimals?
- What if someone passes `null` or `undefined`?
- Does every test name accurately reflect the test logic?

Consider whether a function is worth testing. Does it contain real business logic, or is it just wrapping a simple operator?

### 🏆 Principal Level

Consider **property-based testing** where you test properties that should always be true:
- Score should always be between 0 and 100
- Score should be 100 when downvotes is 0 and upvotes > 0
- Score should be 0 when upvotes is 0 and downvotes > 0

Think about **testability** when designing functions - pure functions are easier to test than impure ones.


## 3.5 Bonus Challenge: Testing an Impure Function (Cartoon Generator)

> ✅ **Completed!** You refactored `helpers/cartoon-generator.ts` to accept an optional `index` parameter and wrote 4 passing tests!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

We took a function that uses `Math.random()` (making it **impure** - unpredictable) and made it testable by adding an optional parameter.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why This Matters</div>

In real apps, you'll often encounter functions that are hard to test because they:
- Use random values (`Math.random()`)
- Use the current date/time (`new Date()`, `Date.now()`)
- Make network requests (`fetch`)
- Read from storage (`AsyncStorage`)

Learning how to make these testable is a **critical skill**!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Problem</div>

```typescript
export default function CartoonGenerator(): ImageSourcePropType[] {
  // ... data ...
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return [cartoons[randomKey], badges[randomKey]];
}
```

`Math.random()` returns a different value every time, so we can't predict what the function will return.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Solution: Dependency Injection</div>

Instead of generating the random number *inside* the function, we **inject** it as a parameter:

```typescript
export default function CartoonGenerator(index?: number): ImageSourcePropType[] {
  // ... data ...
  const selectedKey = index !== undefined
    ? keys[index]           // Use the provided index (for testing)
    : keys[Math.floor(Math.random() * keys.length)];  // Or pick randomly (in production)
  return [cartoons[selectedKey], badges[selectedKey]];
}
```

This is called **dependency injection** - we "inject" the function's dependency (the random choice) from the outside.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Tests We Wrote</div>

```typescript
import CartoonGenerator from "./cartoon-generator";

describe("CartoonGenerator", () => {
  it("should return an array of 2 items when index is 0", () => {
    const result = CartoonGenerator(0);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[1]).toBeDefined();
  });

  it("should return an array of 2 items when index is 4", () => {
    const result = CartoonGenerator(4);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[1]).toBeDefined();
  });

  it("should return an array of 2 items when index is 9", () => {
    const result = CartoonGenerator(9);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[1]).toBeDefined();
  });

  it("should return an array of 2 items when called without an index", () => {
    const result = CartoonGenerator();
    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[1]).toBeDefined();
  });
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Alternative Approaches</div>

If you don't want to change the function, you can also:

1. **Mock `Math.random`** using `jest.spyOn`:
   ```typescript
   jest.spyOn(Math, "random").mockReturnValue(0);
   // Math.random() will now always return 0
   // Remember to call jest.restoreAllMocks() after!
   ```

2. **Separate data from logic** - Split into a pure data function and a selection function

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**Dependency Injection**</span> - Passing dependencies into a function instead of creating them inside
- <span style="color: #50C878;">**Impure Function**</span> - A function whose output is not solely determined by its inputs
- <span style="color: #50C878;">**toHaveLength**</span> - Checks that an array has a specific number of items
- <span style="color: #50C878;">**toBeDefined**</span> - Checks that a value is not `undefined`
- <span style="color: #50C878;">**jest.spyOn**</span> - Wraps a real function to track calls and change behavior
- <span style="color: #50C878;">**mockReturnValue**</span> - Makes a mocked function return a specific value
- <span style="color: #50C878;">**jest.restoreAllMocks**</span> - Restores all mocked functions to original behavior

---

### 🐣 Junior Level

Adding an optional parameter is the simplest way to make a function testable. The function still works the same way in production (when called without the parameter).

### 🧑‍💻 Mid Level

Understand the trade-off: adding a parameter for testing changes the function's API. Is it worth it? For internal functions, usually yes. For public APIs, maybe not.

### 🧙 Senior Level

Know all three approaches and when to use each:
- **Optional parameter**: When you control the function
- **Mock/spy**: When you can't change the function (third-party library)
- **Separation of concerns**: When the function does two things (data + logic)

### 🏆 Principal Level

Design functions with testability in mind from the start. Pure functions are easier to test, compose, and reason about. The **dependency injection** pattern makes code more flexible and testable.

---

## 4. Testing a Simple Component

> ✅ **Completed!** You created `components/buttons/circular-btn.test.tsx` with 2 passing tests!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

We're testing a real React Native component - `CircularBTN`! Components are the building blocks of your app - they're the buttons, cards, headers, and screens that users see and interact with.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test Components?</div>

Components are where your UI logic lives. Testing them ensures:
- They render correctly with different props
- They show the right text, colors, and icons
- They respond correctly to user interactions
- They handle different states (loading, error, empty)

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Component We Tested</div>

```typescript
export default function CircularBTN({
  icon, onPress, title, titleColor, style,
  backgroundColor = COLORS.PURPLE[3]
}: Props) {
  const isScreenPortrait = useContext(IsScreenPortraitContext);

  return (
    <TouchableOpacity testID="circular-btn" onPress={onPress} style={style}>
      <View style={[styles.circle, { backgroundColor, width: isScreenPortrait ? "70%" : "40%" }]}>
        <Ionicons name={icon?.name} color={icon?.color} size={icon?.size} />
      </View>
      <Text style={[styles.title, { color: titleColor || COLORS.BLACK[2] }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Concepts Explained</div>

### What's Different About Testing Components vs Functions?

When you test a function, you just call it and check the return value:
```typescript
const result = calculateScore(5, 5);
expect(result).toBe(50);
```

But components are different. A component:
1. **Renders UI** - It creates views, text, buttons on the screen
2. **Has dependencies** - It might use context, props, or other components
3. **Responds to users** - It handles presses, typing, swipes

So instead of "calling" a component and checking a return value, we:
1. **Render** it (like putting it on a stage)
2. **Find** elements on the screen (like looking at what's on the stage)
3. **Assert** they exist and look correct

### The Tools We Use

- <span style="color: #50C878;">**render**</span> - Takes a component and renders it into a virtual "screen". In v14, this is **async** and needs `await`.
- <span style="color: #50C878;">**screen**</span> - An object that lets us look at what's on the screen after rendering
- <span style="color: #50C878;">**getByText**</span> - Finds an element by its text content (synchronous - throws if not found)
- <span style="color: #50C878;">**findByText**</span> - Finds an element by text, but **waits** for it to appear (async - returns a Promise)
- <span style="color: #50C878;">**queryByText**</span> - Finds an element by text, returns `null` if not found (for checking absence)
- <span style="color: #50C878;">**getByTestId**</span> - Finds an element by its `testID` prop
- <span style="color: #50C878;">**toBeOnTheScreen**</span> - v14 matcher that checks if an element is in the rendered tree (better than `toBeTruthy()`)

### The Gotcha #1: File Extension! 🚨

Your test file must use **`.tsx`** extension, not `.ts`! Why? Because you're using JSX syntax (`<CircularBTN />`) which requires the `.tsx` extension.

```
❌ components/buttons/circular-btn.test.ts   ← SyntaxError! Can't parse JSX
✅ components/buttons/circular-btn.test.tsx  ← Works perfectly!
```

### The Gotcha #2: v14 API Changes 🚨

`@testing-library/react-native` v14 changed some APIs:
- `render()` is now **async** - use `await render(<Component />)`
- `screen` object works globally (unlike v13 where you had to destructure from render)
- Use `toBeOnTheScreen()` instead of `toBeTruthy()` for checking element existence

### The Gotcha #3: Context Dependencies 🚨

`CircularBTN` uses `useContext(IsScreenPortraitContext)`. The context has a default value of `null`. In JavaScript, `null` is **falsy**, so the component doesn't crash - it just uses the landscape width ("40%") instead of portrait ("70%").

**So do we need the mock?** It depends on what you're testing:

| Scenario | Need mock? | Why |
|----------|-----------|-----|
| Just checking text renders | ❌ No | Component works with `null` (falsy → "40%") |
| Checking the circle width is "70%" | ✅ **Yes** | Without mock, width defaults to "40%" |
| Checking landscape behavior | ✅ **Yes** | Need to set context to `false` explicitly |

**Senior-level insight:** This is actually a design issue! The context has a default of `null`, which means:
1. Every component using this context has to handle `null` (or risk bugs)
2. Tests can accidentally pass even when the context is wrong
3. The component silently uses the wrong value

**Better design:** Give the context a sensible default:
```typescript
// In screen-orientation-context.ts
export const IsScreenPortraitContext = createContext(true);  // Default to true!
```

This way:
- Components always have a valid value
- Tests work correctly without mocking
- The default represents the most common case (portrait)

**Your Tests Are Good! ✅**
- ✅ `await render()` - v14 async render
- ✅ `await screen.findByText("VOTE")` - properly awaited
- ✅ `toBeOnTheScreen()` - proper v14 matcher
- ✅ `getByTestId("circular-btn")` - synchronous query for already-rendered element

### The Tests We Wrote

```typescript
import { render, screen } from "@testing-library/react-native";
import CircularBTN from "./circular-btn";

test("should render the title when provided", async () => {
  await render(<CircularBTN title="VOTE" />);
  expect(await screen.findByText("VOTE")).toBeOnTheScreen();
});

test("should render without crashing when no props are provided", async () => {
  await render(<CircularBTN />);
  expect(screen.getByTestId("circular-btn")).toBeOnTheScreen();
});
```

### Query Methods Reference

| Query | What it does | Needs `await`? | When to use |
|-------|-------------|----------------|-------------|
| `getByText()` | Finds element **now** or throws | ❌ No | Element MUST exist and is already rendered |
| `queryByText()` | Finds element **now** or returns null | ❌ No | Checking an element is ABSENT |
| `findByText()` | **Waits** up to 5s for element | ✅ **Yes** | Element appears after async action |
| `getByTestId()` | Finds by `testID` prop or throws | ❌ No | When text isn't unique enough |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**render**</span> - Renders a React component into a virtual DOM for testing
- <span style="color: #50C878;">**screen**</span> - An object that helps you find rendered elements
- <span style="color: #50C878;">**getByText**</span> - Finds an element by its text content (synchronous)
- <span style="color: #50C878;">**findByText**</span> - Finds an element by text (async, waits for it)
- <span style="color: #50C878;">**getByTestId**</span> - Finds an element by its `testID` prop
- <span style="color: #50C878;">**toBeOnTheScreen**</span> - v14 matcher for checking element exists in the rendered tree
- <span style="color: #50C878;">**jest.mock**</span> - Replaces a module with a fake version for testing
- <span style="color: #50C878;">**.tsx**</span> - File extension needed when using JSX syntax

---

### 🐣 Junior Level

Remember: `await render(<Component />)` is like putting your component on a stage. Then you use `screen` to look at what's on that stage! Always use `.tsx` extension for component tests.

### 🧑‍💻 Mid Level

Know the difference between query methods:
- `getBy` - throws if not found (element MUST exist)
- `queryBy` - returns null if not found (checking absence)
- `findBy` - returns Promise, waits for element (async rendering)

### 🧙 Senior Level

Understand that a test passing without mocking context doesn't mean the context is working correctly. The component might be using a fallback value (`null` is falsy!). Always consider what value your component is actually using in tests vs production.

### 🏆 Principal Level

Design components with testability in mind. Context defaults should be sensible (e.g., `createContext(true)` instead of `createContext(null)`). This prevents silent bugs and makes tests more reliable.

---

## 5. Testing Components with Props

> ✅ **Completed!** You added 5 prop tests to `circular-btn.test.tsx` - all passing!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

Props are like settings you pass to a component. Testing with different props ensures your component behaves correctly in all its different configurations.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test Props?</div>

Components often change their appearance or behavior based on props. For example:
- A button might have different colors for "primary" vs "secondary"
- A card might show different content based on data passed to it
- A header might show a back button only if `showBack` is true

Testing props catches:
- Wrong default values
- Props not being applied correctly
- Missing optional props causing crashes
- Edge cases (empty strings, undefined values)

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #1: Styles Can Be Arrays! 🚨</div>

In React Native, styles can be arrays or objects. The `Text` component has:
```typescript
style={[styles.title, { color: titleColor || COLORS.BLACK[2] }]}
```

This is an **array** of two style objects! So `element.props.style` gives you an array, not a single object.

**Solution:** Use `StyleSheet.flatten()` to merge array styles into one object:
```typescript
import { StyleSheet } from "react-native";

const title = screen.getByText("VOTE");
const flatStyle = StyleSheet.flatten(title.props.style);
expect(flatStyle.color).toBe("pink");
```

Without flattening, you'd need to know the array index:
```typescript
expect(title.props.style[1].color).toBe("pink"); // Works but fragile!
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #2: Adding testIDs for Testing 🚨</div>

To test the icon wrapper and background color, you added a `testID` to the View component:
```typescript
<View testID="circular-btn-icon-wrapper" style={...}>
```

This is a **common and acceptable pattern**! Just be careful:
- Don't use testIDs that might conflict with other components
- Prefer testing by text/role when possible
- testIDs are a "last resort" for hard-to-reach elements

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Tests We Wrote</div>

```typescript
import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import CircularBTN from "./circular-btn";

test("should render with custom title color if titleColor prop provided", async () => {
  await render(<CircularBTN title="VOTE" titleColor={"pink"} />);
  const title = screen.getByText("VOTE");
  const flatStyle = StyleSheet.flatten(title.props.style);
  expect(flatStyle.color).toBe("pink");
});

test("should render with default title color if titleColor prop is not provided", async () => {
  await render(<CircularBTN title="VOTE" />);
  const title = screen.getByText("VOTE");
  const flatStyle = StyleSheet.flatten(title.props.style);
  expect(flatStyle.color).toBe("#4B4B57"); // COLORS.BLACK[2]
});

test("should render with default title color if titleColor prop is undefined", async () => {
  await render(<CircularBTN title="VOTE" titleColor={undefined} />);
  const title = screen.getByText("VOTE");
  const flatStyle = StyleSheet.flatten(title.props.style);
  expect(flatStyle.color).toBe("#4B4B57");
});

test("should render with an icon if icon is provided", async () => {
  await render(<CircularBTN icon={{ name: "heart", size: 24, color: "red" }} />);
  const icon = screen.getByTestId("circular-btn-icon-wrapper");
  expect(icon).toBeOnTheScreen();
});

test("should render with custom background color if backgroundColor prop provided", async () => {
  await render(<CircularBTN title="VOTE" backgroundColor={"blue"} />);
  const iconWrapper = screen.getByTestId("circular-btn-icon-wrapper");
  const flatStyle = StyleSheet.flatten(iconWrapper.props.style);
  expect(flatStyle.backgroundColor).toBe("blue");
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**StyleSheet.flatten**</span> - Merges an array of style objects into one flat object
- <span style="color: #50C878;">**props.style**</span> - Accessing the style prop of a rendered element
- <span style="color: #50C878;">**testID**</span> - A prop used to identify elements in tests (last resort query method)

---

### 🐣 Junior Level

Test the obvious stuff first: does the component render with different props? Does it show the right text? Use `StyleSheet.flatten()` to check styles.

### 🧑‍💻 Mid Level

Test **default values** - what happens when a prop isn't provided? Does the component use the right default? Test `undefined` explicitly to ensure the `||` operator works correctly.

### 🧙 Senior Level

Test **edge cases**:
- What if `title` is an empty string?
- What if `icon` is `undefined`?
- What if `backgroundColor` is an invalid color?
- What if `titleColor` is explicitly `undefined`?

### 🏆 Principal Level

Think about **prop combinations** - test that certain combinations of props work correctly together. Use `describe.each` for data-driven tests! Also consider: should you add testIDs to components during development, or only when tests need them?

---

## 6. Testing User Interactions

> ✅ **Completed!** You added a `userEvent` press test to `circular-btn.test.tsx` - and discovered a false positive bug along the way!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

We're testing what happens when a user interacts with a component - pressing buttons, typing text, swiping, etc.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test Interactions?</div>

The whole point of your app is that users interact with it! Testing interactions ensures:
- Buttons actually call the right functions
- Forms submit the right data
- Toggles actually toggle
- Error states show when something goes wrong

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #1: False Positives! 🚨</div>

**You discovered a critical issue!** Your first attempt at the test passed even though it never actually pressed the button:

```typescript
// ❌ THIS TEST PASSES BUT DOESN'T TEST ANYTHING!
test("should call onPress when the button is pressed", async () => {
  const circleBtn = screen.getByTestId("circular-btn");  // Gets element BEFORE render!
  const mockFn = jest.fn();
  await render(<CircularBTN onPress={mockFn} />);

  // ... no press happens! The press code is commented out!

  expect(mockFn).toHaveBeenCalled();  // mockFn was NEVER called, but test passes?!
});
```

**Why did it pass?** Because `jest.fn()` creates a mock that starts with 0 calls. `toHaveBeenCalled()` checks if it was called **at least once**. Since it was never called, it should fail... unless there's something else going on.

**The real lesson:** Always be suspicious of tests that pass too easily! A test that passes without actually testing the behavior is a **false positive** - it gives you false confidence.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #2: Order Matters! 🚨</div>

```typescript
// ❌ WRONG: Getting element BEFORE render
const circleBtn = screen.getByTestId("circular-btn");  // Nothing rendered yet!
await render(<CircularBTN onPress={mockFn} />);

// ✅ CORRECT: Render first, THEN find elements
await render(<CircularBTN onPress={mockFn} />);
const circleBtn = screen.getByTestId("circular-btn");  // Component is rendered!
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Right Way: Using `userEvent` (v14 Recommended)</div>

In v14 of `@testing-library/react-native`, the recommended way to simulate user interactions is `userEvent`. It's more realistic than `fireEvent` because it simulates the full touch sequence:

```typescript
import { render, screen } from "@testing-library/react-native";
import { userEvent } from "@testing-library/react-native";

test("should call onPress when the button is pressed", async () => {
  const mockFn = jest.fn();
  await render(<CircularBTN onPress={mockFn} />);

  const user = userEvent.setup();
  await user.press(screen.getByTestId("circular-btn"));

  expect(mockFn).toHaveBeenCalledTimes(1);
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">`userEvent` vs `fireEvent`</div>

| Feature | `fireEvent.press()` | `userEvent.press()` |
|---------|-------------------|-------------------|
| Simulates touch sequence | ❌ Just calls onPress | ✅ touchStart → touchEnd → press |
| Async/await | ❌ No | ✅ Yes |
| Realistic timing | ❌ Instant | ✅ Simulates real timing |
| Recommended in v14 | ❌ Legacy | ✅ **Yes** |
| Setup required | ❌ None | ✅ `userEvent.setup()` |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**jest.fn()**</span> - Creates a mock function that records how it was called
- <span style="color: #50C878;">**userEvent**</span> - v14's recommended way to simulate user interactions
- <span style="color: #50C878;">**userEvent.setup()**</span> - Creates a user simulation instance
- <span style="color: #50C878;">**user.press()**</span> - Simulates a realistic press (touchStart → touchEnd → press)
- <span style="color: #50C878;">**toHaveBeenCalledTimes**</span> - Checks exactly how many times a mock was called
- <span style="color: #50C878;">**toHaveBeenCalled**</span> - Checks a mock was called at least once (less specific)
- <span style="color: #50C878;">**False Positive**</span> - A test that passes but doesn't actually verify the behavior

---

### 🐣 Junior Level

Think of `jest.fn()` as a spy that watches your function. After the interaction, you ask the spy "did our function get called?" Always use `toHaveBeenCalledTimes(1)` instead of `toHaveBeenCalled()` - it's more specific!

### 🧑‍💻 Mid Level

Always follow this order:
1. ✅ Create mocks first
2. ✅ Render the component
3. ✅ Find elements on screen
4. ✅ Simulate interactions
5. ✅ Assert the results

Never get elements before rendering!

### 🧙 Senior Level

Use `userEvent` instead of `fireEvent` in v14. `userEvent` is more realistic and catches edge cases that `fireEvent` misses. Always be suspicious of tests that pass too easily - they might be false positives!

### 🏆 Principal Level

Consider testing **interaction sequences** - what happens when a user presses a button, then another button, then types something? Complex user flows can reveal bugs that simple tests miss. Also consider: can you write tests that would fail if the interaction code is removed? That's the mark of a good test!

---

## 7. Testing Components with Context

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

Your `CircularBTN` component uses React Context to know if the screen is portrait or landscape. We need to test how it behaves in both orientations.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test Context?</div>

Context is a form of **dependency injection** - your component depends on something outside itself. Testing with different context values ensures your component works in all situations.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Better Way to Mock Context</div>

Instead of mocking the entire module, we can create a **wrapper component** that provides the context value:

```typescript
import { render, screen } from "@testing-library/react-native";
import CircularBTN from "./circular-btn";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";

// A helper wrapper that provides context
function renderWithContext(component: React.ReactElement, isPortrait: boolean) {
  return render(
    <IsScreenPortraitContext.Provider value={isPortrait}>
      {component}
    </IsScreenPortraitContext.Provider>
  );
}

describe("CircularBTN with Context", () => {
  it("uses portrait width when in portrait mode", () => {
    renderWithContext(<CircularBTN title="TEST" />, true);
    // The circle View should have width "70%"
    const btn = screen.getByTestId("circular-btn");
    // We'd check the child View's style
    expect(screen.getByText("TEST")).toBeTruthy();
  });

  it("uses landscape width when in landscape mode", () => {
    renderWithContext(<CircularBTN title="TEST" />, false);
    expect(screen.getByText("TEST")).toBeTruthy();
  });
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha! 🚨</div>

The `IsScreenPortraitContext` has a default value of `null`! If you forget to provide the context, your component will crash because `isScreenPortrait` will be `null`, and you can't use `null` in a ternary like `isScreenPortrait ? "70%" : "40%"`.

This is actually a **design issue** - the context should probably have a default value of `true` instead of `null`!

---

### 🐣 Junior Level

Always wrap components that use context in a provider when testing. Think of it like giving your component the "context" it needs to work.

### 🧑‍💻 Mid Level

Create reusable `renderWithContext` helpers so you don't repeat the wrapper code in every test.

### 🧙 Senior Level

Consider creating a custom `render` function that wraps all your tests:

```typescript
// test-utils.tsx
import { render, RenderOptions } from "@testing-library/react-native";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";

type CustomRenderOptions = {
  isPortrait?: boolean;
} & RenderOptions;

function customRender(
  ui: React.ReactElement,
  { isPortrait = true, ...options }: CustomRenderOptions = {}
) {
  return render(
    <IsScreenPortraitContext.Provider value={isPortrait}>
      {ui}
    </IsScreenPortraitContext.Provider>,
    options
  );
}

export { customRender as render };
```

### 🏆 Principal Level

Consider whether your context should have sensible defaults. A context value of `null` forces every consumer to handle the null case, which is error-prone. Sometimes it's better to provide a default value that represents the "happy path."

---

## 8. Mocking API Calls

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

Your app makes API calls to a cat image service. When testing, we don't want to actually call the real API (that would be slow, unreliable, and might mess up real data). Instead, we **mock** the API calls.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Mock APIs?</div>

- **Speed** - Mocked calls are instant, real calls take milliseconds to seconds
- **Reliability** - Tests won't fail because the API is down or you have no internet
- **Control** - You can test error states, edge cases, and specific responses
- **Cost** - You won't hit API rate limits or pay for API usage during tests

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">How to Mock the API Module</div>

```typescript
// __mocks__/api.ts (or inline with jest.mock)
import { getFavourites, toggleFavouriteItem } from "@/api/api";

// Mock the entire api module
jest.mock("@/api/api", () => ({
  getFavourites: jest.fn(),
  toggleFavouriteItem: jest.fn(),
  getUploadedImages: jest.fn(),
  getImageVoteScore: jest.fn(),
  voteImage: jest.fn(),
  getVotes: jest.fn(),
  deleteFavourite: jest.fn(),
  favouriteImage: jest.fn(),
  uploadImage: jest.fn()
}));

describe("API Mocking", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks before each test
  });

  it("returns favourites when getFavourites succeeds", async () => {
    const mockFavourites = [
      { id: 1, image_id: "cat1", sub_id: "user1" },
      { id: 2, image_id: "cat2", sub_id: "user1" }
    ];
    
    (getFavourites as jest.Mock).mockResolvedValue(mockFavourites);
    
    const result = await getFavourites();
    expect(result).toEqual(mockFavourites);
    expect(getFavourites).toHaveBeenCalledTimes(1);
  });

  it("throws an error when getFavourites fails", async () => {
    (getFavourites as jest.Mock).mockRejectedValue(new Error("Network error"));
    
    await expect(getFavourites()).rejects.toThrow("Network error");
  });
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**mockResolvedValue**</span> - Makes a mock function return a resolved Promise
- <span style="color: #50C878;">**mockRejectedValue**</span> - Makes a mock function return a rejected Promise
- <span style="color: #50C878;">**jest.clearAllMocks**</span> - Resets all mock call history and implementations
- <span style="color: #50C878;">**rejects**</span> - Used with `expect` to test that a Promise rejects

---

### 🐣 Junior Level

Mocking is like using a stunt double in movies! Instead of the real actor (API) doing dangerous stunts, the stunt double (mock) does them safely.

### 🧑‍💻 Mid Level

Always use `jest.clearAllMocks()` in `beforeEach` to prevent tests from affecting each other. Each test should start with a clean slate!

### 🧙 Senior Level

Use `jest.spyOn` when you want to mock a specific function while keeping the rest of the module real:

```typescript
import * as api from "@/api/api";

jest.spyOn(api, "getFavourites").mockResolvedValue([]);
```

### 🏆 Principal Level

Consider creating a **mock factory** that generates realistic test data:

```typescript
export function createMockFavourite(overrides = {}) {
  return {
    id: 1,
    image_id: "cat_123",
    sub_id: "test_user",
    ...overrides
  };
}
```

---

## 9. Testing Custom Hooks

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

Custom hooks are functions that let you use React features (like state, effects, context) in reusable ways. Your `useVoting` and `useFavourites` hooks are great examples!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test Hooks?</div>

Hooks contain **business logic** - the rules and calculations that make your app work. Testing hooks ensures:
- State updates correctly
- Effects run at the right time
- Error handling works
- Edge cases are handled

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha! 🚨</div>

You can't call a hook directly in a test like a normal function! Hooks must be called inside a React component. That's why we use `renderHook` from testing library.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">How to Test useVoting</div>

```typescript
import { renderHook, act, waitFor } from "@testing-library/react-native";
import useVoting from "./useVoting";
import { VotingContext } from "@/context/voting-context";

// Mock the API module
jest.mock("@/api/api", () => ({
  getImageVoteScore: jest.fn(),
  voteImage: jest.fn()
}));

// Create a wrapper with mock context
function createWrapper(votingValue: any) {
  return ({ children }: { children: React.ReactNode }) => (
    <VotingContext.Provider value={votingValue}>
      {children}
    </VotingContext.Provider>
  );
}

describe("useVoting", () => {
  const mockVotingContext = {
    errorMessagesByImageId: {},
    isLoadingVotesByImageId: {},
    isVotingByImageId: {},
    loadVoteScore: jest.fn(),
    vote: jest.fn(),
    voteCountsByImageId: {}
  };

  it("returns initial count when no votes exist", () => {
    const { result } = renderHook(
      () => useVoting("cat_123", { initialCount: 5 }),
      { wrapper: createWrapper(mockVotingContext) }
    );

    expect(result.current.count).toBe(5);
  });

  it("loads vote score on mount", () => {
    renderHook(
      () => useVoting("cat_123"),
      { wrapper: createWrapper(mockVotingContext) }
    );

    expect(mockVotingContext.loadVoteScore).toHaveBeenCalledWith("cat_123", undefined);
  });

  it("calls vote with the correct value when upvoting", () => {
    const { result } = renderHook(
      () => useVoting("cat_123"),
      { wrapper: createWrapper(mockVotingContext) }
    );

    act(() => {
      result.current.upvote();
    });

    expect(mockVotingContext.vote).toHaveBeenCalledWith("cat_123", 1, undefined);
  });

  it("calls vote with the correct value when downvoting", () => {
    const { result } = renderHook(
      () => useVoting("cat_123"),
      { wrapper: createWrapper(mockVotingContext) }
    );

    act(() => {
      result.current.downvote();
    });

    expect(mockVotingContext.vote).toHaveBeenCalledWith("cat_123", 0, undefined);
  });
});
```

