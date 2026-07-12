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
9. [Testing Components with Third-Party Icons (FavouriteIconButton)](#9-testing-components-with-third-party-icons-favouriteiconbutton)
10. [Testing CTA_BTN Component](#10-testing-cta_btn-component)
11. [Testing TitleHeader (CustomFont) Component](#11-testing-titleheader-customfont-component)
12. [Using Coverage Reports](#12-using-coverage-reports)
13. [Testing Custom Hooks](#13-testing-custom-hooks)
14. [Testing Context Providers](#14-testing-context-providers)
15. [Testing Async Operations & Error States](#15-testing-async-operations--error-states)
16. [Integration Testing](#16-integration-testing)
17. [Viewing Coverage for Specific Tests](#17-viewing-coverage-for-specific-tests)
18. [Testing Best Practices & Patterns](#18-testing-best-practices--patterns)

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

> ✅ **Completed!** You created a `renderWithContext` helper and tested both portrait and landscape modes!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

Your `CircularBTN` component uses React Context to know if the screen is portrait or landscape. We need to test how it behaves in both orientations.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test Context?</div>

Context is a form of **dependency injection** - your component depends on something outside itself. Testing with different context values ensures your component works in all situations. Without providing context, the component relies on the default value (`null`) being falsy, which means it silently uses the wrong value.

### 📖 Two Approaches: `jest.mock()` vs Wrapper Pattern

| Approach | `jest.mock()` | Wrapper Pattern |
|----------|--------------|-----------------|
| Uses real context? | ❌ Creates a fake | ✅ Uses real Provider |
| Can test different values? | ❌ One mock for all tests | ✅ Yes, pass different values |
| Reusable across tests? | ❌ Must re-mock each file | ✅ Can export as utility |
| Catches context API changes? | ❌ No | ✅ Yes |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Wrapper Pattern</div>

Instead of mocking the entire module, we create a **helper function** that wraps the component in the real context provider:

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
  it("uses portrait width of 70% when in portrait mode", async () => {
    await renderWithContext(<CircularBTN />, true);
    const iconWrapper = screen.getByTestId("circular-btn-icon-wrapper");
    const flatStyle = StyleSheet.flatten(iconWrapper.props.style);
    expect(flatStyle.width).toBe("70%");
  });

  it("uses landscape width of 40% when in landscape mode", async () => {
    await renderWithContext(<CircularBTN />, false);
    const iconWrapper = screen.getByTestId("circular-btn-icon-wrapper");
    const flatStyle = StyleSheet.flatten(iconWrapper.props.style);
    expect(flatStyle.width).toBe("40%");
  });
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Tests We Wrote</div>

```typescript
import { render, screen, userEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";
import CircularBTN from "./circular-btn";

function renderWithContext(ui: React.ReactElement, isPortrait: boolean) {
  return render(
    <IsScreenPortraitContext.Provider value={isPortrait}>
      {ui}
    </IsScreenPortraitContext.Provider>
  );
}

test("should use portrait width of 70% when in portrait mode", async () => {
  await renderWithContext(<CircularBTN />, true);
  const iconWrapper = screen.getByTestId("circular-btn-icon-wrapper");
  const flatStyle = StyleSheet.flatten(iconWrapper.props.style);
  expect(flatStyle.width).toBe("70%");
});

test("should use landscape width of 40% when in landscape mode", async () => {
  await renderWithContext(<CircularBTN />, false);
  const iconWrapper = screen.getByTestId("circular-btn-icon-wrapper");
  const flatStyle = StyleSheet.flatten(iconWrapper.props.style);
  expect(flatStyle.width).toBe("40%");
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha! 🚨</div>

The `IsScreenPortraitContext` has a default value of `null`! In JavaScript, `null` is **falsy**, so `null ? "70%" : "40%"` evaluates to `"40%"`. This means:
- Without the wrapper, the component silently uses landscape width
- The test would pass even without the context (false positive!)
- This is a **design issue** - the context should default to `true` (portrait)

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**Wrapper Pattern**</span> - Wrapping a component in a context Provider to control its dependencies
- <span style="color: #50C878;">**renderWithContext**</span> - A custom helper function that renders with context

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

> ✅ **Completed!** You created `api/api.test.ts` with 4 passing tests using the `jest.mock()` approach!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

Your app makes API calls to a cat image service. When testing, we don't want to actually call the real API (that would be slow, unreliable, and might mess up real data). Instead, we **mock** the API calls.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Mock APIs?</div>

- **Speed** - Mocked calls are instant, real calls take milliseconds to seconds
- **Reliability** - Tests won't fail because the API is down or you have no internet
- **Control** - You can test error states, edge cases, and specific responses
- **Cost** - You won't hit API rate limits or pay for API usage during tests

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Two Approaches to API Mocking</div>

There are two main approaches to mocking API calls in React Native tests:

| Approach | How it works | Best for |
|----------|-------------|----------|
| **`jest.mock()`** | Replaces the entire API module with fake functions | Testing logic that calls API functions |
| **MSW (Mock Service Worker)** | Intercepts actual network requests at the protocol level | Integration tests that need to verify HTTP behavior |

### Approach 1: `jest.mock()` (Module-Level Mocking) ✅ RECOMMENDED

This approach replaces the entire API module with fake versions of your functions. The real API functions never run - instead, your mock functions return whatever data you want.

**Documentation:** [Jest Manual Mocks](https://jestjs.io/docs/manual-mocks)

```typescript
import { getFavourites, voteImage } from "./api";

// Mock the entire api module
jest.mock("./api", () => ({
  getFavourites: jest.fn(),
  voteImage: jest.fn()
}));

describe("API functions (mocked with jest.mock)", () => {
  beforeEach(() => {
    jest.clearAllMocks();  // Reset all mocks before each test
  });

  it("should return favourites data when getFavourites is called", async () => {
    // Arrange: Set up the mock data
    const mockFavourites = [
      { id: 1, image_id: "cat1", sub_id: "user1", created_at: "2024-01-01" },
      { id: 2, image_id: "cat2", sub_id: "user1", created_at: "2024-01-02" }
    ];
    (getFavourites as jest.Mock).mockResolvedValue(mockFavourites);

    // Act: Call the mocked function
    const result = await getFavourites();

    // Assert: Verify the result matches our mock data
    expect(result).toEqual(mockFavourites);
    expect(getFavourites).toHaveBeenCalledTimes(1);
  });

  it("should handle errors when getFavourites fails", async () => {
    // Arrange: Configure the mock to reject with an error
    const errorMessage = "Network error";
    (getFavourites as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act & Assert: Verify the function throws the expected error
    await expect(getFavourites()).rejects.toThrow(errorMessage);
    expect(getFavourites).toHaveBeenCalledTimes(1);
  });

  it("should call voteImage with correct parameters", async () => {
    // Arrange: Set up mock data
    const imageId = "cat123";
    const vote = 1; // 1 = upvote, -1 = downvote, 0 = unvote
    const mockResponse = { message: "success", image_id: imageId, value: vote };
    (voteImage as jest.Mock).mockResolvedValue(mockResponse);

    // Act: Call the mocked function with test parameters
    const result = await voteImage(imageId, vote);

    // Assert: Verify the function was called with the right arguments
    expect(voteImage).toHaveBeenCalledWith(imageId, vote);
    expect(voteImage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it("should handle empty favourites list", async () => {
    // Arrange: Mock returns an empty array
    (getFavourites as jest.Mock).mockResolvedValue([]);

    // Act
    const result = await getFavourites();

    // Assert: Verify we get an empty array back
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Benefits of `jest.mock()`</div>

✅ **Simple and fast** - No setup beyond the mock declaration
✅ **No network layer needed** - Tests don't make any real HTTP requests
✅ **Easy to control** - Just call `.mockResolvedValue()` or `.mockRejectedValue()`
✅ **Great for unit tests** - Perfect for testing components/hooks that call API functions
✅ **No extra dependencies** - Built into Jest, no additional packages needed
✅ **Works with any Jest setup** - No ESM compatibility issues

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Drawbacks of `jest.mock()`</div>

❌ **Doesn't test the real API function** - You're testing the mock, not the actual HTTP request logic
❌ **Can hide bugs** - If the real API function has a bug (wrong URL, wrong headers), your mock won't catch it
❌ **Type casting needed** - You need `as jest.Mock` to use mock methods in TypeScript
❌ **Manual maintenance** - You must keep the mock in sync with the real module's exports

### Approach 2: MSW (Mock Service Worker) ⚠️ COMPLEX SETUP

MSW intercepts actual HTTP requests at the network level. This means your real API functions run, but instead of making a real network call, MSW catches the request and returns your mock data.

**Documentation:** [MSW React Native Integration](https://mswjs.io/docs/integrations/react-native)

```typescript
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/native";

const handlers = [
  http.get(`${BASE_URL}/favourites*`, () => {
    return HttpResponse.json(FAVOURITES_DATA);
  })
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The MSW ESM Gotcha! 🚨</div>

**MSW has a critical compatibility issue with Jest in Expo React Native projects!**

MSW depends on several **pure ESM packages** (like `rettime` and `@open-draft/deferred-promise`) that Jest cannot load because Jest uses CommonJS (CJS). This causes the error:

```
SyntaxError: Cannot use import statement outside a module
```

**Why this happens:**
1. MSW uses `rettime` (a typed event emitter) internally
2. `rettime` is published as pure ESM (`.mjs` files only)
3. Jest's module system is CJS-based and can't `require()` ESM modules
4. Even with `transformIgnorePatterns` and `.mjs` transforms, the deep dependency tree of ESM packages makes this unreliable

**Solutions we tried:**

| Solution | Result |
|----------|--------|
| Adding `.mjs` transform to `jest.config.js` | ❌ Still fails on other ESM deps |
| Mocking `rettime` with `moduleNameMapper` | ❌ Still fails on `@open-draft/deferred-promise` |
| Adding all ESM deps to `transformIgnorePatterns` | ❌ Deep dependency chain is too complex |
| **Using `jest.mock()` instead** | ✅ **Works perfectly!** |

**The verdict:** For unit tests in Expo React Native projects, **`jest.mock()` is the recommended approach**. MSW is better suited for:
- Integration tests in pure Node.js environments
- End-to-end testing with React Native (using `msw/native` in development)
- Projects using Vitest (which has better ESM support)

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**jest.mock()**</span> - A Jest API that replaces a module with a fake version
- <span style="color: #50C878;">**mockResolvedValue**</span> - Makes a mock function return a resolved Promise
- <span style="color: #50C878;">**mockRejectedValue**</span> - Makes a mock function return a rejected Promise
- <span style="color: #50C878;">**jest.clearAllMocks**</span> - Resets all mock call history and implementations
- <span style="color: #50C878;">**rejects**</span> - Used with `expect` to test that a Promise rejects
- <span style="color: #50C878;">**MSW (Mock Service Worker)**</span> - A library that intercepts network requests at the protocol level
- <span style="color: #50C878;">**ESM (ECMAScript Modules)**</span> - The modern JavaScript module system (`import`/`export`)
- <span style="color: #50C878;">**CJS (CommonJS)**</span> - The older JavaScript module system (`require()`)
- <span style="color: #50C878;">**Pure ESM**</span> - A package that only provides ESM files (`.mjs`), no CJS fallback

---

### 🐣 Junior Level

Mocking is like using a stunt double in movies! Instead of the real actor (API) doing dangerous stunts, the stunt double (mock) does them safely. Always use `jest.clearAllMocks()` in `beforeEach` to prevent tests from affecting each other.

### 🧑‍💻 Mid Level

Understand the difference between `jest.mock()` and MSW:
- `jest.mock()` replaces the JavaScript function - the real function never runs
- MSW intercepts the HTTP request - the real function runs, but the network call is caught
- For Expo React Native projects, `jest.mock()` is more reliable due to ESM compatibility issues

### 🧙 Senior Level

Use `jest.spyOn` when you want to mock a specific function while keeping the rest of the module real:

```typescript
import * as api from "@/api/api";

jest.spyOn(api, "getFavourites").mockResolvedValue([]);
```

Also understand the **ESM/CJS compatibility problem**: When a library is "pure ESM" (only provides `.mjs` files), it cannot be loaded by Jest's CJS-based module system. This is a known limitation of Jest that the community is working on.

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

Also consider: should you use MSW for integration tests in a separate test suite? You could configure a different Jest config with `--experimental-vm-modules` for ESM support, but this adds complexity. For most projects, `jest.mock()` is sufficient.


## 9. Testing Components with Third-Party Icons (FavouriteIconButton)

> ✅ **Completed!** You created `components/buttons/favourite-icon-btn.test.tsx` with 4 passing tests!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

We tested `FavouriteIconButton` - a component that uses `@expo/vector-icons/Ionicons` (a third-party icon library). This introduced new challenges because third-party components often consume props internally.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test This?</div>

- **Conditional rendering** - Shows filled heart when favourited, outline when not
- **Size variants** - Large (50px) and small (29px) sizes
- **Accessibility** - Different labels for favourited/unfavourited states
- **Disabled state** - Button should not respond when disabled

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #1: Third-Party Components Consume Props! 🚨</div>

This is the most important lesson! When you look at how `@expo/vector-icons/Ionicons` works internally:

```javascript
// Inside Ionicons' render method:
const { name, size, color, style, children, ...props } = this.props;
```

The `name`, `size`, `color`, `style`, and `children` props are **destructured out** and NOT passed to the underlying `<Text>` component. Only `...props` (everything else) gets passed through.

This means:
```typescript
// ❌ This will be undefined!
const icon = screen.getByTestId("favourite-icon");
expect(icon.props.name).toBe("heart");  // undefined!
expect(icon.props.size).toBe(29);       // undefined!

// ✅ Instead, check the style (size becomes fontSize)
const flatStyle = StyleSheet.flatten(icon.props.style);
expect(flatStyle.fontSize).toBe(29);
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #2: Testing Styles on the Pressable 🚨</div>

For the `FavouriteIconButton`, we tested the **Pressable's style** to verify the correct size variant was applied:

```typescript
test("should have favouriteButtonLarge styles if size is large", async () => {
  const mockFn = jest.fn();
  await render(
    <FavouriteIconButton isFavourite={false} size="large" onPress={mockFn} />
  );

  const favouriteIcon = screen.getByTestId("favourite-icon-button");
  const flatStyle = StyleSheet.flatten(favouriteIcon.props.style);

  expect(flatStyle).toEqual({
    alignItems: "center",
    height: 58,
    left: 14,
    position: "absolute",
    top: 14,
    width: 58,
    zIndex: 5,
    justifyContent: "center"
  });
});
```

This uses `StyleSheet.flatten()` to merge the array of styles into one object, then checks the entire flattened style with `toEqual()`.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #3: Testing Accessibility Labels 🚨</div>

The component has different accessibility labels based on `isFavourite`:
- `isFavourite={true}` → `accessibilityLabel` is `"Unfavourite cat"` (press to unfavourite)
- `isFavourite={false}` → `accessibilityLabel` is `"Favourite cat"` (press to favourite)

```typescript
test("should have 'Unfavourite cat' as accessibility label if isFavourite is true", async () => {
  const mockFn = jest.fn();
  await render(<FavouriteIconButton isFavourite={true} onPress={mockFn} />);

  const button = screen.getByTestId("favourite-icon-button");
  expect(button.props.accessibilityLabel).toBe("Unfavourite cat");
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Tests We Wrote</div>

```typescript
import { render, screen, userEvent } from "@testing-library/react-native";
import * as React from "react";
import { StyleSheet } from "react-native";

import FavouriteIconButton from "./favourite-icon-btn";

test("should call onPress when pressed", async () => {
  const mockFn = jest.fn();
  await render(<FavouriteIconButton isFavourite={true} onPress={mockFn} />);
  const favouriteIconButton = screen.getByTestId("favourite-icon-button");
  const user = userEvent.setup();
  await user.press(favouriteIconButton);
  expect(mockFn).toHaveBeenCalled();
});

test("should have 'Unfavourite cat' as accessibility label if isFavourite is true", async () => {
  const mockFn = jest.fn();
  await render(<FavouriteIconButton isFavourite={true} onPress={mockFn} />);
  const favouriteIcon = screen.getByTestId("favourite-icon-button");
  expect(favouriteIcon.props.accessibilityLabel).toBe("Unfavourite cat");
});

test("should have 'Favourite cat' as accessibility label if isFavourite is false", async () => {
  const mockFn = jest.fn();
  await render(<FavouriteIconButton isFavourite={false} onPress={mockFn} />);
  const favouriteIcon = screen.getByTestId("favourite-icon-button");
  expect(favouriteIcon.props.accessibilityLabel).toBe("Favourite cat");
});

test("should have favouriteButtonLarge styles if size is large", async () => {
  const mockFn = jest.fn();
  await render(
    <FavouriteIconButton isFavourite={false} size="large" onPress={mockFn} />
  );
  const favouriteIcon = screen.getByTestId("favourite-icon-button");
  const flatStyle = StyleSheet.flatten(favouriteIcon.props.style);
  expect(flatStyle).toEqual({
    alignItems: "center",
    height: 58,
    justifyContent: "center",
    left: 14,
    position: "absolute",
    top: 14,
    width: 58,
    zIndex: 5
  });
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**Third-Party Component**</span> - A component from an external library (like `@expo/vector-icons`)
- <span style="color: #50C878;">**Prop Destructuring**</span> - When a component extracts props and doesn't pass them to child elements
- <span style="color: #50C878;">**accessibilityLabel**</span> - A prop that screen readers use to describe an element
- <span style="color: #50C878;">**StyleSheet.flatten**</span> - Merges an array of style objects into one flat object

---

### 🐣 Junior Level

When testing third-party components, you can't always access props directly. The component might "eat" the props internally. Check the style instead!

### 🧑‍💻 Mid Level

Always check what props a third-party component actually passes through to its rendered output. Look at the library's source code or use `console.log(element.props)` to debug.

### 🧙 Senior Level

Consider whether you should add `testID` props to third-party components or wrap them in your own components. Wrapping gives you more control and makes testing easier.

### 🏆 Principal Level

Think about **component design** - should you wrap third-party icon libraries in your own components? This gives you:
- A single place to change icon libraries
- Consistent prop interfaces
- Easier testing (test your wrapper, not the third-party component)

---

## 10. Testing CTA_BTN Component

> ✅ **Completed!** You created `components/buttons/cta-btn.test.tsx` with 7 passing tests!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

We tested `CTA_BTN` - a Call To Action button component that uses context, icons, and has a disabled state.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test This?</div>

- **Conditional icon rendering** - Icon shows/hides based on props
- **Disabled state** - Button should not respond when disabled
- **Context-dependent styles** - Different width in portrait vs landscape
- **User interactions** - Press should trigger onPress handler

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Tests We Wrote</div>

```typescript
import { render, screen, userEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { IsScreenPortraitContext } from "@/context/screen-orientation-context";
import CTA_BTN from "./cta-btn";

function renderWithContext(ui: React.ReactElement, isPortrait: boolean) {
  return render(
    <IsScreenPortraitContext.Provider value={isPortrait}>
      {ui}
    </IsScreenPortraitContext.Provider>
  );
}

test("should render the title when provided", async () => {
  const mockFn = jest.fn();
  await render(<CTA_BTN title="title" onPress={mockFn} />);
  expect(await screen.findByText("title")).toBeOnTheScreen();
});

test("should render the icon when provided", async () => {
  const mockFn = jest.fn();
  await render(
    <CTA_BTN
      title="title"
      icon={{ name: "search", size: 54, color: "pink" }}
      onPress={mockFn}
    />
  );
  const icon = screen.getByTestId("cta-btn-icon");
  expect(icon).toBeOnTheScreen();
});

test("should not render the icon when NOT provided", async () => {
  const mockFn = jest.fn();
  await render(<CTA_BTN title="title" onPress={mockFn} />);
  const icon = screen.queryByTestId("cta-btn-icon");
  expect(icon).not.toBeOnTheScreen();
});

test("should call onPress when pressed", async () => {
  const mockFn = jest.fn();
  await render(<CTA_BTN title="title" onPress={mockFn} />);
  const ctaBtn = screen.getByTestId("cta-btn");
  const user = userEvent.setup();
  await user.press(ctaBtn);
  expect(mockFn).toHaveBeenCalled();
});

test("should not call onPress if isDisabled is true", async () => {
  const mockFn = jest.fn();
  await render(<CTA_BTN title="title" onPress={mockFn} isDisabled />);
  const ctaBtn = screen.getByTestId("cta-btn");
  const user = userEvent.setup();
  await user.press(ctaBtn);
  expect(mockFn).not.toHaveBeenCalled();
});

test("should use 40% width when isPortraitContext is false", async () => {
  const mockFn = jest.fn();
  await renderWithContext(<CTA_BTN title="title" onPress={mockFn} />, false);
  const ctaBtn = screen.getByTestId("cta-btn");
  const flatStyle = StyleSheet.flatten(ctaBtn.props.style);
  expect(flatStyle.maxWidth).toBe("40%");
});

test("should use undefined width when isPortraitContext is true", async () => {
  const mockFn = jest.fn();
  await renderWithContext(<CTA_BTN title="title" onPress={mockFn} />, true);
  const ctaBtn = screen.getByTestId("cta-btn");
  const flatStyle = StyleSheet.flatten(ctaBtn.props.style);
  expect(flatStyle.maxWidth).toBe(undefined);
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha: Test Name Accuracy! 🚨</div>

Always make sure your test name matches what the code actually does. A misleading test name is worse than no test name - it will send you in the wrong direction when debugging!

```typescript
// ❌ Misleading name - says "when provided" but tests when NOT provided
test("should not render the icon when provided", async () => {

// ✅ Clear name - says exactly what's being tested
test("should not render the icon when NOT provided", async () => {
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**queryByTestId**</span> - Returns null if element not found (for checking absence)
- <span style="color: #50C878;">**isDisabled**</span> - A prop that disables the button
- <span style="color: #50C878;">**renderWithContext**</span> - Reusable helper pattern for providing context in tests

---

### 🐣 Junior Level

Always double-check your test names! A test called "should not render when provided" is confusing - does it mean "should not render" or "should render when provided"? Be precise!

### 🧑‍💻 Mid Level

Use `queryByTestId` (not `getByTestId`) when checking that something is NOT on the screen. `getByTestId` throws an error if the element doesn't exist, which would fail your test before the assertion runs!

### 🧙 Senior Level

The `renderWithContext` pattern is reusable across test files. Consider creating a shared `test-utils.tsx` file that exports custom render functions for all your tests.

### 🏆 Principal Level

Think about **component design for testability** - adding `testID` props during development makes testing easier later. Some teams add testIDs to every interactive element as a standard practice.

---

## 11. Testing TitleHeader (CustomFont) Component

> ✅ **Completed!** You created `components/headers/title-header.test.tsx` with 2 passing tests!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

We tested `CustomFont` (from `title-header.tsx`) - a component that renders text with custom fonts, optional header styling with sparcle images, and optional subheadings.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test This?</div>

- **Conditional rendering** - Header mode shows sparcle images and subheading
- **Font loading** - Uses `useFonts` which is async
- **Style merging** - Combines default styles with header styles

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #1: Conditional Rendering with `header` Prop 🚨</div>

The component has **two render paths**:

```typescript
if (!header) {
    return text;  // Just the Text component
}

// header is true - wraps in View with sparcles and optional subheading
return (
    <>
      <View style={styles.container}>
        <Image source={purpleSparcle} />
        {text}
        <Image source={purpleSparcle} />
      </View>
      {subheading && <Text testID="custom-font-subheading">{subheading}</Text>}
    </>
);
```

The subheading only renders when **both** conditions are true:
1. `header` is `true`
2. `subheading` is provided

So your test must pass BOTH props:
```typescript
// ✅ This works - both conditions are met
<CustomFont header subheading="subheading" font={LilitaOne_400Regular}>
  textGoesHere
</CustomFont>

// ❌ This fails - subheading won't render without header
<CustomFont subheading="subheading" font={LilitaOne_400Regular}>
  textGoesHere
</CustomFont>
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #2: `findByTestId` vs `getByTestId` 🚨</div>

```typescript
// ❌ WRONG: findByTestId returns a Promise, not an element!
expect(result.findByTestId("custom-font-subheading")).toBeOnTheScreen();

// ✅ CORRECT: getByTestId returns the element synchronously
const subheading = screen.getByTestId("custom-font-subheading");
expect(subheading).toBeOnTheScreen();
```

| Method | Returns | When to use |
|--------|---------|-------------|
| `getByTestId` | Element or throws | Element MUST exist and is already rendered |
| `queryByTestId` | Element or null | Checking element is ABSENT |
| `findByTestId` | Promise (waits up to 5s) | Element appears after async action |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #3: Async Font Loading 🚨</div>

The component uses `useFonts` from `@expo-google-fonts` which is async. When the test runs:
- Initially `fontLoaded` is `false`
- After fonts load, `fontLoaded` becomes `true`

This means the `fontFamily` style might not be applied when your assertion runs! For now, the test passes because the font mock returns `true` immediately, but this is something to be aware of.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Tests We Wrote</div>

```typescript
import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import CustomFont from "./title-header";

test("should render styles.title if header is true", async () => {
  await render(
    <CustomFont header font={LilitaOne_400Regular}>
      textGoesHere
    </CustomFont>
  );

  const customFontText = screen.getByTestId("custom-font-text");
  const flatStyle = StyleSheet.flatten(customFontText.props.style);

  expect(flatStyle).toEqual({
    fontFamily: "fontFamily",
    fontSize: 40,
    textAlign: "center",
    textTransform: "capitalize"
  });
});

test("should render subheading if subheading is provided and header is true", async () => {
  await render(
    <CustomFont header subheading="subheading" font={LilitaOne_400Regular}>
      textGoesHere
    </CustomFont>
  );

  const subheading = screen.getByTestId("custom-font-subheading");
  expect(subheading).toBeOnTheScreen();
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**useFonts**</span> - An async hook from `@expo-google-fonts` that loads custom fonts
- <span style="color: #50C878;">**Conditional Rendering**</span> - Rendering different JSX based on conditions (if/else, ternary)
- <span style="color: #50C878;">**findByTestId**</span> - Async query that waits for an element to appear (returns Promise)
- <span style="color: #50C878;">**getByTestId**</span> - Sync query that returns element or throws (not a Promise)

---

### 🐣 Junior Level

Remember: `getByTestId` gives you the element right now. `findByTestId` waits for it. If the element is already rendered, use `getByTestId`!

### 🧑‍💻 Mid Level

Understand the component's render paths. `CustomFont` has two completely different outputs based on the `header` prop. Always check the component's source code to understand what conditions need to be met for each part to render.

### 🧙 Senior Level

Be aware of async dependencies like font loading. The `useFonts` hook is async, which means the font might not be loaded when your test runs. Consider mocking font loading for deterministic tests.

### 🏆 Principal Level

Think about **component API design** - should `subheading` require `header` to be true? This coupling might surprise developers. Consider making the component more composable by separating the header wrapper from the text component.

---

## 12. Using Coverage Reports

> ✅ **Completed!** You ran `npx jest --coverage` and identified uncovered lines!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

Coverage reports show you how much of your code is actually being tested. They're like a heat map - green means tested, red means not tested!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Use Coverage?</div>

- **Find blind spots** - See which parts of your code have no tests
- **Track progress** - Watch coverage go up as you add tests
- **Identify branches** - Find untested `if/else` conditions and ternaries
- **Build confidence** - High coverage means fewer bugs escape to production

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">How to Run Coverage</div>

```bash
# Terminal output
npx jest --coverage

# HTML report (opens in browser)
npx jest --coverage --coverageDirectory=coverage
open coverage/lcov-report/index.html
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">How to See Live Updates of Coverage</div>

Want to see coverage update in real-time as you write tests? Follow these steps:

1. **Run Jest in watch mode** - Open a terminal and run:
   ```bash
   npx jest --watch --coverage
   ```
   This will re-run your tests (and regenerate the coverage report) every time you save a file.

2. **Install the Live Server extension** - In VS Code, go to the Extensions panel (Cmd+Shift+X) and search for **"Live Server"** by Ritwick Dey. Click Install.

3. **Open the coverage HTML report** - In VS Code's file explorer, navigate to:
   ```
   coverage/lcov-report/index.html
   ```

4. **Launch with Live Server** - Right-click on `index.html` and select **"Open with Live Server"**. This will open the coverage report in your browser and auto-refresh it whenever the file changes!

Now you can:
- Write a test → Save the file → Jest re-runs in watch mode → Coverage report auto-refreshes in the browser
- See green (tested) and red (untested) lines update in real-time
- Instantly know if your new test improved coverage!

**Pro tip:** Keep the terminal and browser side-by-side for maximum productivity! 🚀

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Understanding the Coverage Report</div>

```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   75.5  |    60.2  |   70.1  |   75.5  |
 components/buttons/  |   85.7  |    75.0  |   80.0  |   85.7  | 22
 helpers/             |  100.0  |   100.0  |  100.0  |  100.0  |
----------------------|---------|----------|---------|---------|-------------------
```

| Column | What it measures | Example |
|--------|-----------------|---------|
| **% Stmts** | Percentage of statements executed | `75.5%` means 3/4 of your code ran |
| **% Branch** | Percentage of if/else branches tested | `60%` means some conditions weren't tested |
| **% Funcs** | Percentage of functions called | `70%` means some functions weren't called |
| **% Lines** | Percentage of lines executed | Same as statements, roughly |
| **Uncovered Line #s** | Which lines are NOT covered | `22` means line 22 needs a test |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #1: Branches Need Two Tests! 🚨</div>

A **ternary operator** like this:
```typescript
const iconSize = size === "large" ? 50 : 29;
```

Has **two branches**:
1. `size === "large"` → `iconSize = 50`
2. `size !== "large"` (default) → `iconSize = 29`

To get 100% branch coverage, you need **two tests**:
```typescript
test("uses size 50 when size is large", () => { /* pass size="large" */ });
test("uses size 29 when size is small (default)", () => { /* don't pass size */ });
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #2: Third-Party Components Eat Props! 🚨</div>

Even if you write tests for both branches, you might not be able to test the result directly! In `FavouriteIconButton`, the `iconSize` variable is passed to `@expo/vector-icons/Ionicons` as the `size` prop:

```typescript
<Ionicons name={iconName} color={COLORS.RED[0]} size={iconSize} />
```

But Ionicons **consumes the `size` prop internally** and doesn't pass it through to the rendered output:

```javascript
// Inside Ionicons' render method:
const { name, size, color, style, children, ...props } = this.props;
// size is destructured out and used for fontSize in style
```

So `icon.props.size` will be `undefined`! You need to check the **style** instead:

```typescript
// ❌ This won't work - size is consumed internally
const icon = screen.getByTestId("favourite-icon");
expect(icon.props.size).toBe(50); // undefined!

// ✅ Check the fontSize in the style instead
const flatStyle = StyleSheet.flatten(icon.props.style);
expect(flatStyle.fontSize).toBe(50);
```

**The lesson:** Coverage tells you a line is "covered" (executed), but it doesn't tell you if your test actually verifies the behavior correctly. A line can be 100% covered but still have bugs if your assertions are wrong!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #3: Coverage Only Shows Tested Files! 🚨</div>

**Jest's default coverage only includes files that are imported by your tests!** If a file is never imported by any test, Jest doesn't know it exists and doesn't include it in the report.

This means you can see **100% coverage** even though half your project has no tests at all! The 100% is accurate for the files you've tested - the untested files just aren't in the report yet.

**Example:** If you've tested `helpers/` and `components/buttons/` but NOT `hooks/` or `context/`, your coverage report will show:

```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   75.5  |    60.2  |   70.1  |   75.5  |
 components/buttons/  |   85.7  |    75.0  |   80.0  |   85.7  | 22
 helpers/             |  100.0  |   100.0  |  100.0  |  100.0  |
----------------------|---------|----------|---------|---------|-------------------
```

Notice `hooks/`, `context/`, `api/` are **completely missing** from the report! They're not at 0% - they're not even listed!

**Solution:** Use `collectCoverageFrom` to tell Jest which files to include:

```bash
# CLI flag (one-time use)
npx jest --coverage --collectCoverageFrom="hooks/**/*.{ts,tsx}" --collectCoverageFrom="context/**/*.{ts,tsx}" --collectCoverageFrom="api/**/*.{ts,tsx}" --collectCoverageFrom="components/**/*.{ts,tsx}" --collectCoverageFrom="helpers/**/*.{ts,tsx}"
```

Or better, add it to your `jest.config.js`:

```javascript
// jest.config.js
const jestConfig = require("jest-expo/jest-preset");

// ... your existing config ...

jestConfig.collectCoverageFrom = [
  "**/*.{ts,tsx}",           // All TypeScript files
  "!**/node_modules/**",     // Ignore dependencies
  "!**/coverage/**",         // Ignore coverage output
  "!**/*.config.*",          // Ignore config files (jest.config, tsconfig, etc.)
  "!**/app/**",              // Ignore Expo Router files (need special setup)
  "!**/assets/**",           // Ignore static assets
  "!**/__mocks__/**",        // Ignore mock files
  "!**/.expo/**",            // Ignore Expo build files
  "!**/types.ts"             // Ignore type definition files (no logic to test)
];

module.exports = jestConfig;
```

| Pattern | Why We Exclude It |
|---------|------------------|
| `**/*.{ts,tsx}` | Include ALL TypeScript files |
| `!**/node_modules/**` | Third-party code - not ours to test |
| `!**/coverage/**` | The coverage report itself - meta! |
| `!**/*.config.*` | Config files have no business logic |
| `!**/app/**` | Expo Router files need native module mocks |
| `!**/assets/**` | Images aren't code |
| `!**/__mocks__/**` | Mock files are test infrastructure |
| `!**/.expo/**` | Expo build artifacts |
| `!**/types.ts` | TypeScript types compile away at runtime |

**Pro tip:** Adding `collectCoverageFrom` will show you the **real** coverage picture - including all those untested files at 0%. Use it as a **roadmap** for what to test next!


<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>


- <span style="color: #50C878;">**Coverage**</span> - A metric showing how much of your code is tested
- <span style="color: #50C878;">**Branch Coverage**</span> - Percentage of if/else/ternary branches tested
- <span style="color: #50C878;">**Statement Coverage**</span> - Percentage of code statements executed
- <span style="color: #50C878;">**Function Coverage**</span> - Percentage of functions called in tests
- <span style="color: #50C878;">**Line Coverage**</span> - Percentage of lines executed
- <span style="color: #50C878;">**lcov-report**</span> - An HTML report format that shows coverage visually

---

### 🐣 Junior Level

Run `npx jest --coverage` to see how much of your code is tested. Green is good, red means you need more tests!

### 🧑‍💻 Mid Level

Use the HTML report (`open coverage/lcov-report/index.html`) to see exactly which lines are covered. Click into files to see green (tested) and red (untested) lines.

### 🧙 Senior Level

Don't obsess over 100% coverage - it's a tool, not a goal. Focus on testing **critical paths** and **business logic**. Some code (like type definitions, constants) doesn't need testing.

### 🏆 Principal Level

Set coverage thresholds in your CI pipeline to prevent coverage from dropping below a certain level:
```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## 13. Testing Custom Hooks

> ✅ **Completed!** You created `hooks/useVoting.test.tsx` with 4 passing tests!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

Custom hooks are functions that let you use React features (like state, effects, context) in reusable ways. Your `useVoting` hook is a great example!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test Hooks?</div>

Hooks contain **business logic** - the rules and calculations that make your app work. Testing hooks ensures:
- State updates correctly
- Effects run at the right time
- Error handling works
- Edge cases are handled

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #1: Hooks Need a Home! 🚨</div>

You can't call a hook directly in a test like a normal function! Hooks must be called inside a React component. That's why we use `renderHook` from testing library.

```typescript
// ❌ This won't work! Hooks can't be called directly
const result = useVoting("cat_123");

// ✅ This works! renderHook creates a "component home" for the hook
const { result } = await renderHook(() => useVoting("cat_123"));
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #2: renderHook is Async in v14! 🚨</div>

In `@testing-library/react-native` v14, `renderHook` is **async** just like `render`. You must `await` it:

```typescript
// ❌ This gives you a Promise, not the result object
const { result } = renderHook(() => useVoting("cat_123"));

// ✅ This gives you the actual result object
const { result } = await renderHook(() => useVoting("cat_123"));
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #3: Call the Function, Don't Just Get It! 🚨</div>

When testing `upvote()` or `downvote()`, you must **call** the function (with `()`), not just store it in a variable:

```typescript
// ❌ You're just GETTING the function, not CALLING it
const upvote = result.current.upvote;
expect(upvote as jest.fn).toHaveBeenCalledWith(1); // Never called!

// ✅ CALL the function, then check the mock
result.current.upvote();
expect(mockContext.vote).toHaveBeenCalledWith("imageId", 1, undefined);
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Happy Path vs Unhappy Path Tests ☕</div>

Think of testing like testing a **coffee machine**:

### Happy Path (The "Everything Works" Scenario) 😊
1. ✅ You put a cup under the spout
2. ✅ You press "Espresso"
3. ✅ Coffee comes out
4. ✅ You get a delicious espresso

These are the **happy path** tests - testing that everything works when things go right.

### Unhappy Path (The "Something Goes Wrong" Scenarios) 😡
1. ❌ What if there's no water? → Error message
2. ❌ What if there are no coffee beans? → Error message
3. ❌ What if you press the button without a cup? → Coffee everywhere!
4. ❌ What if the machine is unplugged? → Nothing happens

These are **edge cases** or **error path** tests - testing what happens when things go wrong.

### For Your `useVoting` Hook

**Happy Path Tests (Test First)** 😊

| Test | What it checks | Why it matters |
|------|---------------|----------------|
| Returns 0 when no votes | Default count | ✅ You have this! |
| `loadVoteScore` called on mount | Effect runs | ✅ You have this! |
| `upvote()` calls `vote(1)` | Upvote works | ✅ You have this! |
| `downvote()` calls `vote(0)` | Downvote works | ✅ You have this! |

**Unhappy Path Tests (Add Later)** 😡

| Test | What it checks | Why it matters |
|------|---------------|----------------|
| Throws error without context | Error handling | ✅ Now adding this! |
| Handles API failure | Error state | Important but needs more setup |
| Handles missing imageId | Edge case | Rare but possible |

### The Rule of Thumb 📝

**Always test the happy path first!** If the basic functionality doesn't work, the error handling doesn't matter. It's like making sure the coffee machine actually makes coffee before testing what happens when it runs out of water.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #4: Testing Errors with renderHook 🚨</div>

When `useVoting` throws an error (because `votingContext` is `null`), it throws **synchronously** during the hook's render. But `renderHook` is **async** (returns a Promise). This creates a conflict.

**The solution:** Use `.rejects.toThrow()` to catch the rejected Promise:

```typescript
test("should throw error when votingContext is null", async () => {
  // Suppress React's noisy console.error
  jest.spyOn(console, "error").mockImplementation(() => {});

  // The error happens during renderHook, so catch it as a rejected promise
  await expect(
    renderHook(() => useVoting("imageId"), {
      wrapper: ({ children }) => (
        <RenderWithContext value={null}>{children}</RenderWithContext>
      )
    })
  ).rejects.toThrow("useVoting must be used inside VotingProvider");
});
```

**Why this works:**
1. `renderHook` returns a Promise (it's async in v14)
2. The hook throws synchronously during render
3. React catches the error and rejects the Promise returned by `renderHook`
4. `expect(...).rejects.toThrow(...)` catches the rejected Promise and checks the error message

**Why we suppress console.error:**
When React catches an error during rendering, it logs it to `console.error`. Without suppressing it, your test output will be noisy with React error messages. We use `jest.spyOn(console, "error").mockImplementation(() => {})` to silence it.

### Deep Dive: What is `jest.spyOn`? 🕵️

Think of `jest.spyOn` like putting a **spy camera** on a function. The spy watches everything the function does - when it's called, what arguments it receives, how many times it's called.

```typescript
const spy = jest.spyOn(console, "error");
// Now console.error has a spy on it!
// After the test, you can check:
console.log(spy).toHaveBeenCalledTimes(1); // Was it called once?
```

### What is `.mockImplementation()`? 🎭

`.mockImplementation()` replaces the **real behavior** of the function with your own fake behavior. It's like a **stunt double** - the function looks the same from the outside, but does something different inside.

```typescript
// Real console.error would print to the terminal:
console.error("Something went wrong!"); // ❌ Prints: "Something went wrong!"

// After mocking, it does nothing:
jest.spyOn(console, "error").mockImplementation(() => {});
console.error("Something went wrong!"); // ✅ Does nothing! Silent!
```

### Why We Need It for the Error Test

When `useVoting` throws an error (because `votingContext` is `null`), React does two things:

1. **Throws the error** - This is what we want to test
2. **Logs to console.error** - React's way of saying "hey, something crashed!"

Without suppressing `console.error`, your test output looks like this:

```
PASS  hooks/useVoting.test.tsx
  ✓ should return 0 when imageId are no votes (17 ms)
  ✓ should call loadVoteScore on mount (1 ms)
  ✓ should call vote with 1 when upvote is called (1 ms)
  ✓ should call vote with 0 when downvote is called (1 ms)
  ✓ should throw an error when votingContext is null (5 ms)

  console.error
    The above error occurred in the <TestHook> component:
    ...
    Error: useVoting must be used inside VotingProvider
```

The test **passes**, but there's a big red `console.error` message that makes it look like something went wrong! It's confusing.

With `jest.spyOn(console, "error").mockImplementation(() => {})`, that `console.error` message is **silenced** - the test passes cleanly with no noise.

### The Two Parts Explained

```typescript
jest.spyOn(console, "error")     // 🕵️ Put a spy on console.error
  .mockImplementation(() => {}); // 🎭 Replace it with a function that does nothing
```

| Part | What it does | Analogy |
|------|-------------|---------|
| `jest.spyOn(console, "error")` | Wraps `console.error` with a spy that records calls | Putting a camera on the function |
| `.mockImplementation(() => {})` | Replaces the real behavior with an empty function | Replacing the actor with a stunt double who does nothing |

### The Cleanup Gotcha! 🚨

**Important:** `jest.spyOn` permanently changes `console.error` until you restore it! If you don't clean up, other tests might be affected.

```typescript
// ❌ BAD: This test silences console.error for ALL other tests too!
test("my test", () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  // ... test ...
}); // console.error is still silenced!

// ✅ GOOD: Restore it after the test
test("my test", () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  // ... test ...
  jest.restoreAllMocks(); // Restore console.error to normal!
});
```

Or use `afterEach` to restore all mocks after every test:
```typescript
afterEach(() => {
  jest.restoreAllMocks();
});
```

### Summary

| Method | What it does | When to use |
|--------|-------------|-------------|
| `jest.spyOn(obj, "method")` | Puts a spy on an existing function | When you want to watch or change a real function |
| `.mockImplementation(fn)` | Replaces the function's behavior | When you want to change what the function does |
| `.mockReturnValue(value)` | Makes the function return a specific value | When you want to control the return value |
| `jest.restoreAllMocks()` | Restores all spied functions to original | Always clean up after spying! |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Tests We Wrote</div>

```typescript
import { renderHook } from "@testing-library/react-native";
import React from "react";

import { VotingContext, VotingContextType } from "@/context/voting-context";

import useVoting from "./useVoting";

// Create the wrapper component that has context
function RenderWithContext({
  children,
  value
}: {
  children: React.ReactNode;
  value: VotingContextType;
}) {
  return (
    <VotingContext.Provider value={value}>{children}</VotingContext.Provider>
  );
}

test("should return 0 when imageId are no votes", async () => {
  const mockContext = {
    errorMessagesByImageId: {},
    isLoadingVotesByImageId: {},
    isVotingByImageId: {},
    loadVoteScore: jest.fn(),
    vote: jest.fn(),
    voteCountsByImageId: {}
  };

  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <RenderWithContext value={mockContext}>{children}</RenderWithContext>
    )
  });

  expect(result.current.count).toBe(0);
});

test("should call loadVoteScore on mount", async () => {
  const mockContext = {
    errorMessagesByImageId: {},
    isLoadingVotesByImageId: {},
    isVotingByImageId: {},
    loadVoteScore: jest.fn(),
    vote: jest.fn(),
    voteCountsByImageId: {}
  };

  await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <RenderWithContext value={mockContext}>{children}</RenderWithContext>
    )
  });

  expect(mockContext.loadVoteScore).toHaveBeenCalled();
});

test("should call vote with 1 when upvote is called", async () => {
  const mockContext = {
    errorMessagesByImageId: {},
    isLoadingVotesByImageId: {},
    isVotingByImageId: {},
    loadVoteScore: jest.fn(),
    vote: jest.fn(),
    voteCountsByImageId: {}
  };

  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <RenderWithContext value={mockContext}>{children}</RenderWithContext>
    )
  });

  result.current.upvote();
  expect(mockContext.vote).toHaveBeenCalledWith("imageId", 1, undefined);
});

test("should call vote with 0 when downvote is called", async () => {
  const mockContext = {
    errorMessagesByImageId: {},
    isLoadingVotesByImageId: {},
    isVotingByImageId: {},
    loadVoteScore: jest.fn(),
    vote: jest.fn(),
    voteCountsByImageId: {}
  };

  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <RenderWithContext value={mockContext}>{children}</RenderWithContext>
    )
  });

  result.current.downvote();
  expect(mockContext.vote).toHaveBeenCalledWith("imageId", 0, undefined);
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**renderHook**</span> - Renders a hook in a test environment (not a component)
- <span style="color: #50C878;">**result.current**</span> - The hook's return value (updated after each render)
- <span style="color: #50C878;">**act**</span> - Wraps state updates so React processes them synchronously
- <span style="color: #50C878;">**Wrapper Pattern**</span> - Wrapping a hook in a context Provider to control its dependencies

---

### 🐣 Junior Level

Think of `renderHook` like putting your hook in a tiny aquarium so it can survive in the test environment. Always `await` it in v14!

### 🧑‍💻 Mid Level

Remember to **call** the function (with `()`) before checking what happened. `result.current.upvote` is the function itself. `result.current.upvote()` actually runs it!

### 🧙 Senior Level

The `wrapper` option in `renderHook` is powerful - you can provide context, Redux stores, or any other providers your hook needs. Consider creating reusable wrapper factories.

### 🏆 Principal Level

Think about **hook design for testability** - hooks that depend on context are harder to test than hooks that accept parameters. Consider whether your hook's dependencies should be injected or read from context.

---

## 14. Testing useFavourites Hook

> ✅ **Completed!** You created `hooks/useFavourites.test.tsx` with 2 passing tests and 100% coverage!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

We tested `useFavourites` - a simpler hook that just reads from `FavouritesContext` and returns it. Unlike `useVoting`, this hook doesn't have any custom logic - it's a straight pass-through from context.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test This?</div>

Even simple hooks need testing because:
- The error handling (throwing when context is null) needs verification
- The return value needs to match what the context provides
- Changes to the context type could break the hook silently

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #1: `result` vs `result.current` 🚨</div>

This is the most common mistake when testing hooks! `renderHook` returns an object with a `current` property:

```typescript
const { result } = await renderHook(() => useFavourites(), {
  wrapper: ({ children }) => (
    <RenderWithContext value={mockContext}>{children}</RenderWithContext>
  )
});

// ❌ WRONG: result is the wrapper object { current: {...} }
expect(result).toEqual(mockContext);

// ✅ CORRECT: result.current is the hook's return value
expect(result.current).toEqual(mockContext);
```

Think of `renderHook` like a gift box 🎁:
- `result` is the **box** (the wrapper object)
- `result.current` is the **gift inside** (the hook's actual return value)

| Expression | What it is | Example value |
|-----------|-----------|---------------|
| `result` | The wrapper object | `{ current: { errorMessage: "", ... } }` |
| `result.current` | The hook's return value | `{ errorMessage: "", ... }` |
| `mockContext` | What we expect the hook to return | `{ errorMessage: "", ... }` |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Tests We Wrote</div>

```typescript
import { renderHook } from "@testing-library/react-native";

import {
  FavouritesContext,
  FavouritesContextType
} from "@/context/favourites-context";

import useFavourites from "./useFavourites";

function RenderWithContext({
  children,
  value
}: {
  children: React.ReactNode;
  value: FavouritesContextType;
}) {
  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

test("should throw a new error when there favourites context is null", async () => {
  const mockContext = null;

  jest.spyOn(console, "error").mockImplementation(() => {});

  await expect(
    renderHook(() => useFavourites(), {
      wrapper: ({ children }) => (
        <RenderWithContext value={mockContext}>{children}</RenderWithContext>
      )
    })
  ).rejects.toThrow("useFavourites must be used inside FavouritesContext");

  jest.restoreAllMocks();
});

test("should return favourite when favourite context is present", async () => {
  const mockContext = {
    errorMessage: "",
    favouriteImageIds: { "": true },
    favouriteImages: [
      {
        id: "",
        url: "",
        width: 4,
        height: 4,
        mime_type: "",
        entities: [""],
        breeds: {
          id: 1,
          name: "",
          wikipedia_url: ""
        },
        animals: [""],
        categories: [""]
      }
    ],
    favouriteImagesById: { "": true },
    favouriteLoadingImageIds: { "": true },
    isLoading: false,
    loadFavouriteImageIds: jest.fn(),
    loadFavouriteImages: jest.fn(),
    toggleFavourite: jest.fn()
  };

  const { result } = await renderHook(() => useFavourites(), {
    wrapper: ({ children }) => (
      <RenderWithContext value={mockContext}>{children}</RenderWithContext>
    )
  });

  expect(result.current).toEqual(mockContext);
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**result.current**</span> - The hook's return value (NOT the wrapper object)
- <span style="color: #50C878;">**toEqual**</span> - Deep equality matcher for comparing objects/arrays

---

### 🐣 Junior Level

Always use `result.current` when checking what a hook returns. `result` is the box, `result.current` is the gift inside!

### 🧑‍💻 Mid Level

When a test fails with a diff like this:
```
- Expected  - 0
+ Received  + 2
  Object {
+   "current": Object {
```

It means you're comparing `result` (the wrapper) instead of `result.current` (the value). The `+ 2` lines show the extra `current` wrapper.

### 🧙 Senior Level

Simple hooks that just return context are the easiest to test. They're also a good indicator of whether your context types are correct - if the test passes, your hook and context types match!

### 🏆 Principal Level

Consider whether you even need a hook that just returns context. Sometimes it's simpler to use `useContext(FavouritesContext)` directly in components. But having a hook gives you:
- A single place to add validation (like the null check)
- Easier refactoring if the context API changes
- Better testability (you test the hook, not the context everywhere)


---

## 15. Testing Context Providers

> ✅ **Completed!** You created `context/voting-context.test.tsx` with 7 passing tests covering empty state, loadVoteScore success/error, vote guard clause, vote success, vote rollback, and error messages!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

We're testing the `VotingContext` provider directly - the actual state management logic that powers voting in the app. Unlike testing hooks (which test how a component *uses* the context), testing the provider tests the context *itself* - its state, its functions, and how they interact.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test Context Providers?</div>

Context providers contain **core business logic**:
- State management (counts, loading states, error messages)
- Async operations (API calls with loading/error states)
- Optimistic updates (update UI before API responds)
- Rollback logic (revert UI when API fails)

Testing the provider directly gives you:
- **Isolation** - Test the logic without needing a component
- **Coverage** - Reach all the branches and edge cases
- **Confidence** - Know the state machine works correctly

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Vending Machine Analogy 🥤</div>

Think of the VotingContext provider like a **vending machine**:

| Vending Machine | VotingContext Provider |
|----------------|----------------------|
| Press a button for a drink | Call `loadVoteScore("cat_123")` |
| "Dispensing..." light turns on | `isLoadingVotesByImageId["cat_123"] = true` |
| Machine checks its stock | Calls `getImageVoteScore("cat_123")` |
| Display shows drinks left | `voteCountsByImageId["cat_123"] = 5` |
| "Dispensing..." light turns off | `isLoadingVotesByImageId["cat_123"] = false` |
| Machine is broken | API throws an error |
| Shows "Out of stock!" error | `errorMessagesByImageId["cat_123"] = "Failed to fetch"` |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #1: Importing Mocked Functions 🚨</div>

When you use `jest.mock()` to mock a module, the mock variables created inside the factory function are **not available** in your test scope:

```typescript
// ❌ This creates a mock, but getImageVoteScore is NOT in scope!
jest.mock("@/api/api", () => ({
  getImageVoteScore: jest.fn(),
  voteImage: jest.fn()
}));

test("my test", () => {
  // ❌ ReferenceError: getImageVoteScore is not defined!
  (getImageVoteScore as jest.Mock).mockResolvedValue(5);
});
```

**The fix:** Import the mocked function! Since `jest.mock()` replaces the module at the top of the file, importing it gives you the **mocked version**:

```typescript
import { getImageVoteScore, voteImage } from "@/api/api";

// ✅ Now getImageVoteScore is in scope!
jest.mock("@/api/api", () => ({
  getImageVoteScore: jest.fn(),
  voteImage: jest.fn()
}));

test("my test", () => {
  // ✅ Works! getImageVoteScore is the mocked version
  (getImageVoteScore as jest.Mock).mockResolvedValue(5);
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #2: The `act()` Wrapper 🚨</div>

When testing async functions that update React state, you must wrap them in `act()`:

```typescript
// ❌ State updates might not be processed yet!
await result.current.loadVoteScore("cat_123");
expect(result.current.voteCountsByImageId["cat_123"]).toBe(5); // Might be undefined!

// ✅ All state updates are processed before we check
await act(async () => {
  await result.current.loadVoteScore("cat_123");
});
expect(result.current.voteCountsByImageId["cat_123"]).toBe(5); // Definitely 5!
```

Think of `act()` like a **traffic controller** 🚦:
- Without `act()`: State updates happen whenever they want
- With `act()`: All state updates are processed immediately

Without `act()`, you'll see this warning:
```
console.error
  An update to HookContainer inside a test was not wrapped in act(...)
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #3: `mockResolvedValue` vs `mockRejectedValue` 🚨</div>

| Method | What it does | When to use |
|--------|-------------|-------------|
| `.mockResolvedValue(5)` | Makes the mock return a successful Promise with value `5` | Testing the **happy path** (API succeeds) |
| `.mockRejectedValue(new Error("fail"))` | Makes the mock return a rejected Promise with an Error | Testing the **error path** (API fails) |
| `.mockRejectedValue("string")` | Makes the mock throw a **non-Error** value | Testing the **fallback path** (`e instanceof Error` is `false`) |

```typescript
// Happy path: API succeeds
(getImageVoteScore as jest.Mock).mockResolvedValue(5);

// Error path: API throws an Error
(getImageVoteScore as jest.Mock).mockRejectedValue(new Error("Failed to fetch"));

// Fallback path: API throws a non-Error (string, number, etc.)
(voteImage as jest.Mock).mockRejectedValue("Something went wrong");
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #4: The `?? 0` Safety Net 🚨</div>

The `??` operator is the **nullish coalescing operator**. It means "if the value is `null` or `undefined`, use this default instead":

```typescript
(currentCounts[imageId] ?? 0)
// If currentCounts[imageId] is undefined, use 0
```

In the vote rollback code:
```typescript
// Optimistic update (line 80-83):
setVoteCountsByImageId((currentCounts) => ({
  ...currentCounts,
  [imageId]: (currentCounts[imageId] ?? 0) + countChange
}));

// Rollback on failure (line 88-91):
setVoteCountsByImageId((currentCounts) => ({
  ...currentCounts,
  [imageId]: (currentCounts[imageId] ?? 0) - countChange
}));
```

**Important insight:** The `?? 0` on the rollback line is **defensive programming** - it's a safety net. In practice, the optimistic update ALWAYS runs before the rollback, so `currentCounts[imageId]` will always have a value. But the `?? 0` protects against edge cases where the optimistic update might not have run.

**Can we test the `?? 0` path?** Technically no - because the optimistic update always runs first in the current code. The `?? 0` is unreachable dead code. But keeping it is fine - it's defensive programming!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #5: Testing `e instanceof Error` Branches 🚨</div>

The catch block has two paths:
```typescript
} catch (e) {
  const message = e instanceof Error ? e.message : "Failed to vote";
  setErrorMessagesByImageId((currentMessages) => ({
    ...currentMessages,
    [imageId]: message
  }));
}
```

| Path | What's thrown | `e instanceof Error` | `message` value |
|------|--------------|---------------------|-----------------|
| ✅ `e.message` | `new Error("Network error")` | `true` | `"Network error"` |
| ✅ Fallback | `"Something went wrong"` (a string) | `false` | `"Failed to vote"` |

To test the fallback path, make the mock throw a **non-Error** value:
```typescript
// Test the e.message path
(voteImage as jest.Mock).mockRejectedValue(new Error("Network error"));

// Test the fallback path
(voteImage as jest.Mock).mockRejectedValue("Something went wrong");
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Tests We Wrote</div>

```typescript
import { act, renderHook } from "@testing-library/react-native";

import { getImageVoteScore, voteImage } from "@/api/api";

import { useVotingProviderValue } from "./voting-context";

// The provider calls API functions, so we need to mock them
jest.mock("@/api/api", () => ({
  getImageVoteScore: jest.fn(),
  voteImage: jest.fn()
}));

test("should start with empty state", async () => {
  const { result } = await renderHook(() => useVotingProviderValue());

  expect(result.current.voteCountsByImageId).toEqual({});
  expect(result.current.isLoadingVotesByImageId).toEqual({});
  expect(result.current.isVotingByImageId).toEqual({});
  expect(result.current.errorMessagesByImageId).toEqual({});
});

test("should update count when loadVoteScore succeeds", async () => {
  (getImageVoteScore as jest.Mock).mockResolvedValue(5);

  const { result } = await renderHook(() => useVotingProviderValue());

  await act(async () => {
    await result.current.loadVoteScore("imageId");
  });

  expect(result.current.voteCountsByImageId["imageId"]).toBe(5);
  expect(result.current.isLoadingVotesByImageId["imageId"]).toBe(false);
});

test("should store error message when loadVoteScore fails", async () => {
  (getImageVoteScore as jest.Mock).mockRejectedValue(
    new Error("Failed to fetch")
  );

  const { result } = await renderHook(() => useVotingProviderValue());

  await act(async () => {
    await result.current.loadVoteScore("imageId");
  });

  expect(result.current.errorMessagesByImageId["imageId"]).toBe(
    "Failed to fetch"
  );
  expect(result.current.isLoadingVotesByImageId["imageId"]).toBe(false);
  expect(result.current.voteCountsByImageId["imageId"]).toBeUndefined();
});

test("should not call voteImage when vote is called and isVotingByImageId[imageId] is true", async () => {
  (voteImage as jest.Mock).mockResolvedValue(2);

  const { result } = await renderHook(() => useVotingProviderValue());
  result.current.isVotingByImageId["imageId"] = true;

  await act(async () => {
    await result.current.vote("imageId", 1);
  });

  expect(voteImage).not.toHaveBeenCalled();
});

test("should call voteImage when vote is called and isVotingByImageId[imageId] is false", async () => {
  (voteImage as jest.Mock).mockResolvedValue(2);

  const { result } = await renderHook(() => useVotingProviderValue());

  await act(async () => {
    await result.current.vote("imageId", 1);
  });

  expect(result.current.isVotingByImageId["imageId"]).toBe(false);
  expect(voteImage).toHaveBeenCalled();
});

test("should reset vote when vote is called and voteImage fails and voteImage value is 1", async () => {
  (voteImage as jest.Mock).mockRejectedValue(0);

  const { result } = await renderHook(() => useVotingProviderValue());

  result.current.voteCountsByImageId["imageId"] = 5;
  await act(async () => {
    await result.current.vote("imageId", 1);
  });

  expect(voteImage).toHaveBeenCalled();
  expect(result.current.voteCountsByImageId["imageId"]).toBe(5);
});

test("should reset vote when vote is called and voteImage fails and voteImage value is 0", async () => {
  (voteImage as jest.Mock).mockRejectedValue(5);

  const { result } = await renderHook(() => useVotingProviderValue());

  result.current.voteCountsByImageId["imageId"] = 5;
  await act(async () => {
    await result.current.vote("imageId", 0);
  });

  expect(voteImage).toHaveBeenCalled();
  expect(result.current.voteCountsByImageId["imageId"]).toBe(5);
});

test("should store error message when vote fails", async () => {
  (getImageVoteScore as jest.Mock).mockRejectedValue(
    new Error("Failed to fetch")
  );

  const { result } = await renderHook(() => useVotingProviderValue());

  await act(async () => {
    await result.current.vote("imageId", 1);
  });

  expect(result.current.errorMessagesByImageId["imageId"]).toBe(
    "Failed to vote"
  );
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**act**</span> - A function from testing library that tells React to process all state updates synchronously
- <span style="color: #50C878;">**mockResolvedValue**</span> - Makes a mock function return a resolved Promise
- <span style="color: #50C878;">**mockRejectedValue**</span> - Makes a mock function return a rejected Promise
- <span style="color: #50C878;">**Nullish Coalescing Operator (??)**</span> - Returns the right side if the left side is `null` or `undefined`
- <span style="color: #50C878;">**Optimistic Update**</span> - Updating the UI before the API responds (assumes success)
- <span style="color: #50C878;">**Rollback**</span> - Reverting an optimistic update when the API fails
- <span style="color: #50C878;">**Defensive Programming**</span> - Writing code that handles unexpected edge cases gracefully

---

### 🐣 Junior Level

Always wrap async operations in `act()` when testing hooks that update state. Think of `act()` like a traffic controller that makes sure all state updates happen before you check the values.

### 🧑‍💻 Mid Level

Understand the difference between `mockResolvedValue` (happy path) and `mockRejectedValue` (error path). Always test both! Also understand that `??` is different from `||` - `??` only checks for `null`/`undefined`, while `||` checks for any falsy value (`0`, `""`, `false`).

### 🧙 Senior Level

Know that `?? 0` in the rollback code is defensive programming - it protects against edge cases but may be unreachable in practice. Consider whether defensive code is worth keeping if it can't be tested. Some teams prefer to remove untestable defensive code, others keep it as a safety net.

### 🏆 Principal Level

Think about **testability when designing state management**:
- Can you test each state transition independently?
- Are error states and loading states tested?
- Is the rollback logic correct for all edge cases?
- Can you prove the `?? 0` is either reachable (and tested) or unreachable (and removable)?

Consider writing a **state machine diagram** for complex providers to identify all possible states and transitions. This helps ensure you have tests for every path.

## 16. Integration Testing

> ✅ **In Progress!** You created `context/voting-context.integration.test.tsx` to test `useVoting` with the real `VotingProvider`.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

Integration testing is testing how **multiple pieces work together**. Instead of mocking everything, we let some real pieces interact and verify they work as a team.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why Test Integration?</div>

Unit tests prove each piece works in isolation. Integration tests prove the pieces work **together**. This catches bugs that unit tests miss:

- Does the hook correctly read from the real provider?
- Does the provider's state update when the hook calls its functions?
- Does the context connection work end-to-end?

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Burger Analogy 🍔</div>

| Test Type | What it tests | Example |
|-----------|---------------|---------|
| **Unit Test** | Each ingredient separately | Is the patty cooked? Is the bun fresh? Is the cheese melted? |
| **Integration Test** | The burger assembled | Does the patty + bun + cheese + lettuce taste good together? |
| **E2E Test** | The whole restaurant experience | Can a customer order, pay, receive, and eat the burger? |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Unit Test vs Integration Test for VotingContext</div>

| Aspect | Unit Test (Section 15) | Integration Test (This Section) |
|--------|----------------------|----------------------------------|
| What we test | `useVotingProviderValue()` directly | `useVoting` with real `VotingProvider` |
| What's real | The provider's state/functions | The provider + the context connection |
| What's mocked | API calls (`jest.mock`) | API calls (`jest.mock`) |
| What we prove | "The provider logic works" | "The hook + provider work together" |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The TV Remote Analogy 📺</div>

Think of the integration test like testing a TV remote control:

| Part | What it is | In our test |
|------|-----------|-------------|
| 📺 **The TV** | The provider with its state | `useVotingProviderValue()` |
| 🎮 **The Remote** | The hook that controls the TV | `useVoting("imageId")` |
| 🔌 **The Signal** | The context connection | `VotingContext.Provider` |

We need **two** `renderHook` calls because:
1. **First** `renderHook` creates the TV (the provider with its state)
2. **Second** `renderHook` creates the remote (the hook) and connects it to the TV via context

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #1: No VotingProvider Component! 🚨</div>

Looking at `voting-context.tsx`, there's no `VotingProvider` component! There's only:
- `useVotingProviderValue()` - a hook that creates the state and functions
- `VotingContext` - the context object

The provider is created **inline** in `app/_layout.tsx`:
```typescript
const voting = useVotingProviderValue();
// ...
<VotingContext.Provider value={voting}>
```

So in our integration test, we replicate this pattern manually:
```typescript
const { result: providerResult } = await renderHook(() => useVotingProviderValue());

const { result } = await renderHook(() => useVoting("imageId"), {
  wrapper: ({ children }) => (
    <VotingContext.Provider value={providerResult.current}>
      {children}
    </VotingContext.Provider>
  )
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #2: Why Check the Provider, Not the Hook? 🚨</div>

In the unit test, we checked `result.current.count` (the hook's return value). But in this integration test, we check `providerResult.current.voteCountsByImageId["imageId"]` (the provider's state).

Why? Because we want to prove that the **whole chain works**:
1. `useVoting.upvote()` calls `voteFromContext(1)`
2. Which calls `provider.vote("imageId", 1)`
3. Which updates `provider.voteCountsByImageId["imageId"]`

If the provider's state updated, we know the hook successfully communicated with it through context!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #3: The `act()` Wrapper 🚨</div>

Both `loadVoteScore` and `upvote` are async and update React state. We wrap them in `act()` to make sure all state updates are processed before we check the result:

```typescript
await act(async () => {
  await providerResult.current.loadVoteScore("imageId");
});

await act(async () => {
  await result.current.upvote();
});
```

Without `act()`, you'll see this warning:
```
console.error
  An update to HookContainer inside a test was not wrapped in act(...)
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Test We're Writing</div>

```typescript
import { act, renderHook } from "@testing-library/react-native";

import { getImageVoteScore, voteImage } from "@/api/api";
import useVoting from "@/hooks/useVoting";

import {
  useVotingProviderValue,
  VotingContext
} from "./voting-context";

// Mock the API - we don't want real network calls
jest.mock("@/api/api", () => ({
  getImageVoteScore: jest.fn(),
  voteImage: jest.fn()
}));

test("should update count when upvote is called (integration test)", async () => {
  // Step 1: Make the API return a score of 0 initially
  (getImageVoteScore as jest.Mock).mockResolvedValue(0);
  // Make voteImage succeed
  (voteImage as jest.Mock).mockResolvedValue({});

  // Step 2: Create the REAL provider (like the TV)
  const { result: providerResult } = await renderHook(() =>
    useVotingProviderValue()
  );

  // Step 3: Create useVoting connected to the REAL provider (like the remote)
  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <VotingContext.Provider value={providerResult.current}>
        {children}
      </VotingContext.Provider>
    )
  });

  // Step 4: Wait for the initial loadVoteScore to complete
  await act(async () => {
    await providerResult.current.loadVoteScore("imageId");
  });

  // Step 5: Call upvote through the hook
  await act(async () => {
    await result.current.upvote();
  });

  // Step 6: Check the count updated in the PROVIDER (not the hook)
  expect(providerResult.current.voteCountsByImageId["imageId"]).toBe(1);
});
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**Integration Test**</span> - Testing how multiple pieces work together (not in isolation)
- <span style="color: #50C878;">**Two renderHook Pattern**</span> - Creating the provider in one renderHook and the consumer in another
- <span style="color: #50C878;">**act**</span> - Wraps async state updates so they're processed before assertions

---

### 🐣 Junior Level

Integration tests are like testing that the TV remote actually controls the TV. Unit tests check the remote's buttons work, integration tests check the signal reaches the TV!

### 🧑‍💻 Mid Level

The key difference from unit tests: in integration tests, you use the **real** provider (not a mock). Only mock external dependencies like API calls. This tests the actual connection between your components.

### 🧙 Senior Level

The "two renderHook" pattern is a common technique for testing context-dependent hooks. You create the provider in one renderHook, then pass its value to the consumer in another. This gives you access to both the provider's internal state and the hook's return value.

### 🏆 Principal Level

Consider what level of integration testing is right for your app:
- **Shallow integration**: Test hook + real provider (what we're doing)
- **Deep integration**: Test component + real provider + real API (with MSW)
- **Full integration**: Test screen + all real providers + mocked API

Each level gives more confidence but is harder to set up. Start shallow and go deeper as needed!


## 17. Viewing Coverage for Specific Tests

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">What We're Doing</div>

When you run `npx jest --coverage`, Jest runs **all** test files and combines their coverage. But sometimes you want to see coverage for **just one test file** - like seeing what your integration test covers vs your unit test.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Why View Coverage for Specific Tests?</div>

- **Compare test types** - See what your integration test covers vs your unit test
- **Identify gaps** - Find code that only one test type covers
- **Debug coverage** - Understand why a line isn't covered
- **Focus development** - See the impact of a single test file

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">How to Run Coverage for a Single Test File</div>

```bash
# Run coverage for just the integration test
npx jest context/voting-context.integration.test.tsx --coverage

# Run coverage for just the unit test
npx jest context/voting-context.test.tsx --coverage

# Run coverage for a specific pattern
npx jest context/ --coverage
```

Each time you run `--coverage`, it **overwrites** the previous report in the `coverage/` folder.

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #1: Coverage Overwrites! 🚨</div>

```bash
# ❌ This overwrites the previous report!
npx jest context/voting-context.test.tsx --coverage
npx jest context/voting-context.integration.test.tsx --coverage
# Now the coverage/ folder only shows integration test coverage!
```

**Solution:** Use `--coverageDirectory` to save reports to different folders:

```bash
# Save unit test coverage to coverage-unit/
npx jest context/voting-context.test.tsx --coverage --coverageDirectory=coverage-unit

# Save integration test coverage to coverage-integration/
npx jest context/voting-context.integration.test.tsx --coverage --coverageDirectory=coverage-integration

# Open both reports side by side!
open coverage-unit/lcov-report/index.html
open coverage-integration/lcov-report/index.html
```

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Gotcha #2: Coverage Only Shows Imported Files! 🚨</div>

Jest's default coverage only includes files that are **imported by your tests**. If a file is never imported, it won't appear in the report at all - not even at 0%!

This is why we added `collectCoverageFrom` to `jest.config.js`:

```javascript
jestConfig.collectCoverageFrom = [
  "**/*.{ts,tsx}",           // All TypeScript files
  "!**/node_modules/**",     // Ignore dependencies
  "!**/coverage/**",         // Ignore coverage output
  "!**/*.config.*",          // Ignore config files
  "!**/app/**",              // Ignore Expo Router files
  "!**/assets/**",           // Ignore static assets
  "!**/__mocks__/**",        // Ignore mock files
  "!**/.expo/**",            // Ignore Expo build files
  "!**/types.ts"             // Ignore type definition files
];
```

This tells Jest: "Include ALL TypeScript files in the coverage report, even if no test imports them." Now you'll see files at 0% coverage, giving you a roadmap of what to test next!

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Comparing Unit vs Integration Coverage</div>

| Command | What it shows | Use case |
|---------|---------------|----------|
| `npx jest --coverage` | **All** tests combined | Overall project health |
| `npx jest voting-context.test.tsx --coverage` | **Unit test only** | Does the unit test cover all branches? |
| `npx jest voting-context.integration.test.tsx --coverage` | **Integration test only** | Does the integration test add coverage? |

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">How to View the HTML Report</div>

```bash
# Open the default coverage report
open coverage/lcov-report/index.html

# Open a specific coverage report
open coverage-unit/lcov-report/index.html
open coverage-integration/lcov-report/index.html
```

The HTML report shows:
- **Green lines** - Code that was executed during tests
- **Red lines** - Code that was NOT executed
- **Yellow indicators** - Branches that weren't fully tested (e.g., only one side of a ternary)

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">Key Words</div>

- <span style="color: #50C878;">**--coverageDirectory**</span> - A Jest flag that saves coverage reports to a specific folder
- <span style="color: #50C878;">**collectCoverageFrom**</span> - Jest config that tells Jest which files to include in coverage
- <span style="color: #50C878;">**lcov-report**</span> - An HTML report format that shows coverage visually

---

### 🐣 Junior Level

Run `npx jest MyTestFile.test.tsx --coverage` to see coverage for just one test file. Use `open coverage/lcov-report/index.html` to see the visual report!

### 🧑‍💻 Mid Level

Use `--coverageDirectory` to save multiple coverage reports without overwriting. This lets you compare what different test files cover.

### 🧙 Senior Level

The `collectCoverageFrom` config is essential for getting an accurate picture of project-wide coverage. Without it, untested files are invisible in the report.

### 🏆 Principal Level

Consider adding coverage thresholds to your CI pipeline:
```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

This prevents coverage from dropping below a certain level. But remember: **coverage is a tool, not a goal**. 100% coverage doesn't mean 0 bugs!


## 🎓 What We've Learned - A Journey Recap

> *A friendly summary of everything we've covered together on our testing journey!*

<div style="color: #FF6B6B; font-size: 1.5em; font-weight: bold;">The Three Types of Testing We Mastered</div>

We started from zero and worked our way up through three levels of testing. Here's what each one taught us:

### 1️⃣ Unit Testing (Sections 1-3, 3.5)

**What we tested:** Individual functions in isolation

| What | Example | Key Skills Learned |
|------|---------|-------------------|
| **Pure functions** | `calculateScore(5, 5)` → `50` | `describe`, `it`, `expect`, `toBe`, AAA pattern |
| **Impure functions** | `CartoonGenerator()` with `Math.random()` | Dependency injection, `jest.spyOn`, `mockReturnValue` |
| **Test naming** | "should return 0 when no votes" | Clear, descriptive test names |

**The big lesson:** Pure functions are the easiest thing to test. Same input → same output → simple assertions!

### 2️⃣ Component Testing (Sections 4-11)

**What we tested:** React Native components with UI, props, interactions, and context

| What | Example | Key Skills Learned |
|------|---------|-------------------|
| **Simple rendering** | `CircularBTN` renders title | `render`, `screen`, `findByText`, `toBeOnTheScreen` |
| **Props & styles** | Custom colors, sizes, icons | `StyleSheet.flatten`, `testID`, default values |
| **User interactions** | Button presses | `userEvent.setup()`, `user.press()`, `jest.fn()` |
| **Context** | Portrait vs landscape | `renderWithContext` wrapper pattern |
| **Third-party components** | `@expo/vector-icons/Ionicons` | Prop destructuring gotcha! |
| **Conditional rendering** | `CTA_BTN` disabled state | `queryByTestId` for checking absence |
| **Async dependencies** | Font loading with `useFonts` | `findByTestId` vs `getByTestId` |

**The big lesson:** Components are more complex than functions because they have UI, dependencies, and user interactions. But the same AAA pattern applies - Arrange (render), Act (interact), Assert (check)!

### 3️⃣ Integration Testing (Section 16)

**What we tested:** Multiple pieces working together

| What | Example | Key Skills Learned |
|------|---------|-------------------|
| **Hook + real provider** | `useVoting` with real `VotingProvider` | Two `renderHook` pattern |
| **Context connection** | Does the signal reach the TV? | Check provider state, not hook return |
| **Real vs mocked** | Only mock APIs, let everything else be real | Integration vs unit test mindset |

**The big lesson:** Unit tests prove each piece works. Integration tests prove the pieces work **together**. Both are important!

---

### 🧰 Bonus Skills We Also Learned

| Section | Topic | What We Can Do Now |
|---------|-------|-------------------|
| 8 | **Mocking API calls** | Use `jest.mock()` to fake API calls, test happy & error paths |
| 12 | **Coverage reports** | Run `npx jest --coverage`, view HTML reports, understand green/red lines |
| 13-14 | **Testing custom hooks** | Use `renderHook` with wrapper pattern, test `useVoting` and `useFavourites` |
| 15 | **Testing context providers** | Test state management, optimistic updates, rollback logic, error states |
| 17 | **Viewing specific coverage** | Use `--coverageDirectory` to compare unit vs integration coverage |

---

### 📊 The Testing Pyramid

```
        ⬆️
       /🔍\       E2E Tests (not covered yet)
      /─────\
     /  🔗   \    Integration Tests ✅ (Section 16)
    /───────────\
   /    🔬      \  Component Tests ✅ (Sections 4-11)
  /─────────────────\
 /     🔬🔬🔬       \  Unit Tests ✅ (Sections 1-3, 13-15)
/─────────────────────────\
```

| Level | What it tests | Speed | Confidence | We covered it? |
|-------|--------------|-------|------------|----------------|
| 🔬 **Unit** | Individual functions, hooks, providers | ⚡ Fastest | Low | ✅ Yes! |
| 🔗 **Integration** | Pieces working together | ⚡ Fast | Medium | ✅ Yes! |
| 🔍 **E2E** | Full app like a real user | 🐢 Slowest | High | ❌ Not yet |

---

### 🚀 What's Next?

You now have a solid foundation in:
- ✅ **Unit Testing** - Pure functions, impure functions, hooks, context providers
- ✅ **Component Testing** - Props, interactions, context, third-party, conditional rendering
- ✅ **Integration Testing** - Hook + real provider working together

**Possible next steps:**
- **End-to-End (E2E) Testing** with Detox or Maestro
- **Snapshot Testing** to catch visual regressions
- **Test-Driven Development (TDD)** - writing tests before code
- **CI/CD Integration** - running tests automatically on GitHub

But most importantly: **start writing tests for your real features!** The best way to learn is by doing. Every test you write will make you more confident and your app more reliable. 🚀


## 📖 Glossary of Keywords

> *A comprehensive reference of all testing keywords used in this guide. Updated as new topics are added.*

| # | Keyword | Description | Example Usage |
|---|---------|-------------|---------------|
| 1 | <span style="color: #50C878;">**AAA Pattern**</span> | Arrange, Act, Assert - the three parts of every test | `// Arrange: set up data → // Act: call function → // Assert: check result` |
| 2 | <span style="color: #50C878;">**accessibilityLabel**</span> | A prop that screen readers use to describe an element | `expect(button.props.accessibilityLabel).toBe("Favourite cat")` |
| 3 | <span style="color: #50C878;">**act**</span> | A function from testing library that wraps state updates in hooks | `act(() => { result.current.upvote(); })` |
| 4 | <span style="color: #50C878;">**Branch Coverage**</span> | Percentage of if/else/ternary branches tested | A ternary `a ? b : c` needs 2 tests (one for each branch) |
| 5 | <span style="color: #50C878;">**CJS (CommonJS)**</span> | The older JavaScript module system using `require()` | `const jest = require("@jest/globals")` |
| 6 | <span style="color: #50C878;">**Conditional Rendering**</span> | Rendering different JSX based on conditions (if/else, ternary) | `{isFavourite ? <HeartFilled /> : <HeartOutline />}` |
| 7 | <span style="color: #50C878;">**Coverage**</span> | A metric showing how much of your code is tested | Run `npx jest --coverage` to see a coverage report |
| 8 | <span style="color: #50C878;">**Dependency Injection**</span> | Passing dependencies into a function instead of creating them inside | `CartoonGenerator(0)` instead of `CartoonGenerator()` with internal `Math.random()` |
| 9 | <span style="color: #50C878;">**describe**</span> | A way to group related tests together | `describe("calculateScore", () => { ... })` |
| 10 | <span style="color: #50C878;">**ESM (ECMAScript Modules)**</span> | The modern JavaScript module system using `import`/`export` | `import { render } from "@testing-library/react-native"` |
| 11 | <span style="color: #50C878;">**expect**</span> | The assertion - what we expect to be true | `expect(calculateScore(5, 5)).toBe(50)` |
| 12 | <span style="color: #50C878;">**False Positive**</span> | A test that passes but doesn't actually verify the behavior | Getting element before render, then asserting it exists |
| 13 | <span style="color: #50C878;">**findByTestId**</span> | Async query that waits for an element to appear (returns Promise) | `const el = await screen.findByTestId("my-element")` |
| 14 | <span style="color: #50C878;">**findByText**</span> | Finds an element by text (async, waits up to 5s) | `const el = await screen.findByText("Submit")` |
| 15 | <span style="color: #50C878;">**Function Coverage**</span> | Percentage of functions called in tests | `% Funcs` column in coverage report |
| 16 | <span style="color: #50C878;">**getByTestId**</span> | Sync query that returns element by testID or throws | `const btn = screen.getByTestId("circular-btn")` |
| 17 | <span style="color: #50C878;">**getByText**</span> | Finds an element by its text content (synchronous) | `const title = screen.getByText("VOTE")` |
| 18 | <span style="color: #50C878;">**Impure Function**</span> | A function whose output is not solely determined by its inputs | `Math.random()`, `new Date()`, API calls |
| 19 | <span style="color: #50C878;">**isDisabled**</span> | A prop that disables a button | `<CTA_BTN isDisabled onPress={fn} />` |
| 20 | <span style="color: #50C878;">**it**</span> or <span style="color: #50C878;">**test**</span> | Defines an individual test case | `it("returns 0 when no votes", () => { ... })` |
| 21 | <span style="color: #50C878;">**jest.clearAllMocks**</span> | Resets all mock call history and implementations | `beforeEach(() => jest.clearAllMocks())` |
| 22 | <span style="color: #50C878;">**jest.fn()**</span> | Creates a mock function that records how it was called | `const mockFn = jest.fn()` |
| 23 | <span style="color: #50C878;">**jest.mock()**</span> | A Jest API that replaces a module with a fake version | `jest.mock("./api", () => ({ getFavourites: jest.fn() }))` |
| 24 | <span style="color: #50C878;">**jest.restoreAllMocks**</span> | Restores all mocked functions to original behavior | `afterEach(() => jest.restoreAllMocks())` |
| 25 | <span style="color: #50C878;">**jest.spyOn**</span> | Wraps a real function to track calls and change behavior | `jest.spyOn(Math, "random").mockReturnValue(0)` |
| 26 | <span style="color: #50C878;">**lcov-report**</span> | An HTML report format that shows coverage visually | `open coverage/lcov-report/index.html` |
| 27 | <span style="color: #50C878;">**Line Coverage**</span> | Percentage of lines executed | `% Lines` column in coverage report |
| 28 | <span style="color: #50C878;">**Mock**</span> | A fake version of a real thing (like a pretend API) | `jest.fn()` creates a mock function |
| 29 | <span style="color: #50C878;">**mockImplementation**</span> | Replaces a function's behavior with a custom implementation | `jest.spyOn(console, "error").mockImplementation(() => {})` |
| 30 | <span style="color: #50C878;">**mockRejectedValue**</span> | Makes a mock function return a rejected Promise | `(getFavourites as jest.Mock).mockRejectedValue(new Error("fail"))` |
| 31 | <span style="color: #50C878;">**mockResolvedValue**</span> | Makes a mock function return a resolved Promise | `(getFavourites as jest.Mock).mockResolvedValue(mockData)` |
| 32 | <span style="color: #50C878;">**mockReturnValue**</span> | Makes a mocked function return a specific value (sync) | `jest.spyOn(Math, "random").mockReturnValue(0)` |
| 33 | <span style="color: #50C878;">**MSW (Mock Service Worker)**</span> | A library that intercepts network requests at the protocol level | `http.get("/api/cats", () => HttpResponse.json([...]))` |
| 34 | <span style="color: #50C878;">**Preset**</span> | A pre-configured setup so you don't have to configure everything from scratch | `preset: "jest-expo"` in jest config |
| 35 | <span style="color: #50C878;">**Prop Destructuring**</span> | When a component extracts props and doesn't pass them to child elements | `const { name, size, ...props } = this.props` |
| 36 | <span style="color: #50C878;">**Pure ESM**</span> | A package that only provides ESM files (`.mjs`), no CJS fallback | MSW depends on pure ESM packages like `rettime` |
| 37 | <span style="color: #50C878;">**Pure Function**</span> | Same inputs always give same outputs, no side effects | `calculateScore(5, 5)` always returns `50` |
| 38 | <span style="color: #50C878;">**queryByTestId**</span> | Returns null if element not found (for checking absence) | `expect(screen.queryByTestId("icon")).not.toBeOnTheScreen()` |
| 39 | <span style="color: #50C878;">**queryByText**</span> | Finds element by text or returns null (for checking absence) | `expect(screen.queryByText("Loading")).toBeNull()` |
| 40 | <span style="color: #50C878;">**rejects**</span> | Used with `expect` to test that a Promise rejects | `await expect(getFavourites()).rejects.toThrow("error")` |
| 41 | <span style="color: #50C878;">**render**</span> | Renders a React component into a virtual DOM for testing | `await render(<CircularBTN title="VOTE" />)` |
| 42 | <span style="color: #50C878;">**renderHook**</span> | Renders a hook in a test environment (not a component) | `const { result } = renderHook(() => useVoting("cat_123"))` |
| 43 | <span style="color: #50C878;">**renderWithContext**</span> | A custom helper function that renders with context | `renderWithContext(<Component />, true)` |
| 44 | <span style="color: #50C878;">**screen**</span> | An object that helps you find rendered elements | `screen.getByText("VOTE")`, `screen.getByTestId("btn")` |
| 45 | <span style="color: #50C878;">**Statement Coverage**</span> | Percentage of code statements executed | `% Stmts` column in coverage report |
| 46 | <span style="color: #50C878;">**StyleSheet.flatten**</span> | Merges an array of style objects into one flat object | `StyleSheet.flatten(element.props.style)` |
| 47 | <span style="color: #50C878;">**testID**</span> | A prop used to identify elements in tests (last resort query method) | `<TouchableOpacity testID="circular-btn">` |
| 48 | <span style="color: #50C878;">**Third-Party Component**</span> | A component from an external library (like `@expo/vector-icons`) | `Ionicons` from `@expo/vector-icons` |
| 49 | <span style="color: #50C878;">**toBe**</span> | A matcher that checks exact equality (like `===`) | `expect(result).toBe(50)` |
| 50 | <span style="color: #50C878;">**toBeDefined**</span> | Checks that a value is not `undefined` | `expect(result[0]).toBeDefined()` |
| 51 | <span style="color: #50C878;">**toHaveLength**</span> | Checks that an array has a specific number of items | `expect(result).toHaveLength(2)` |
| 52 | <span style="color: #50C878;">**toBeOnTheScreen**</span> | v14 matcher for checking element exists in the rendered tree | `expect(title).toBeOnTheScreen()` |
| 53 | <span style="color: #50C878;">**toHaveBeenCalled**</span> | Checks a mock was called at least once | `expect(mockFn).toHaveBeenCalled()` |
| 54 | <span style="color: #50C878;">**toHaveBeenCalledTimes**</span> | Checks exactly how many times a mock was called | `expect(mockFn).toHaveBeenCalledTimes(1)` |
| 55 | <span style="color: #50C878;">**toEqual**</span> | A matcher that checks value equality (for objects/arrays) | `expect(flatStyle).toEqual({ fontSize: 40 })` |
| 56 | <span style="color: #50C878;">**Unit Test**</span> | Testing one small piece of code in isolation | Testing a single function or component |
| 57 | <span style="color: #50C878;">**useFonts**</span> | An async hook from `@expo-google-fonts` that loads custom fonts | `const [fontLoaded] = useFonts({ fontFamily: font })` |
| 58 | <span style="color: #50C878;">**userEvent**</span> | v14's recommended way to simulate user interactions | `const user = userEvent.setup(); await user.press(btn)` |
| 59 | <span style="color: #50C878;">**userEvent.setup()**</span> | Creates a user simulation instance | `const user = userEvent.setup()` |
| 60 | <span style="color: #50C878;">**user.press()**</span> | Simulates a realistic press (touchStart → touchEnd → press) | `await user.press(screen.getByTestId("btn"))` |
| 61 | <span style="color: #50C878;">**Wrapper Pattern**</span> | Wrapping a component in a context Provider to control its dependencies | `<IsScreenPortraitContext.Provider value={true}>{ui}</...>` |
| 62 | <span style="color: #50C878;">**.tsx**</span> | File extension needed when using JSX syntax in TypeScript | `circular-btn.test.tsx` (not `.ts`) |

---

## 🎮 Commands Reference

> *A quick reference of all CLI commands used throughout this guide. Bookmark this page!*

| # | Command | What it does | When to use it |
|---|---------|-------------|----------------|
| 1 | `npx jest --passWithNoTests` | Runs Jest without failing if no tests exist | First time checking your test setup works |
| 2 | `npx jest` | Runs all test files in the project | Running your full test suite |
| 3 | `npx jest MyFile.test.tsx` | Runs a specific test file | Testing just one file while developing |
| 4 | `npx jest --watch` | Runs tests in watch mode (re-runs on file save) | Development - get instant feedback as you write tests |
| 5 | `npx jest --coverage` | Runs all tests and generates a coverage report | Checking how much of your code is tested |
| 6 | `npx jest MyFile.test.tsx --coverage` | Runs coverage for a single test file | Seeing what a specific test file covers |
| 7 | `npx jest --coverage --coverageDirectory=coverage-folder` | Saves coverage report to a custom folder | Saving multiple coverage reports without overwriting |
| 8 | `open coverage/lcov-report/index.html` | Opens the visual coverage report in your browser | Viewing green/red line-by-line coverage |
| 9 | `npx jest --watch --coverage` | Watch mode + coverage (regenerates on every save) | Real-time coverage feedback while developing |
| 10 | `npx jest context/` | Runs all tests inside the `context/` folder | Testing a specific directory of files |
| 11 | `npx jest --verbose` | Shows detailed test names and results | Debugging - see exactly which tests pass/fail |
| 12 | `npx jest --clearCache` | Clears Jest's cache | Fixing weird test failures after config changes |

