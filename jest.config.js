const jestConfig = require("jest-expo/jest-preset");
// Add transform for .mjs files (needed for rettime which is pure ESM)
jestConfig.transform["^.+\\.mjs$"] = [
  "babel-jest",
  { caller: { name: "metro", bundler: "metro", platform: "ios" } }
];

// Extend transformIgnorePatterns to include msw and rettime
jestConfig.transformIgnorePatterns = [
  "/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|msw|@msw|rettime))/",
  "/node_modules/react-native-reanimated/plugin/"
];

// Mock rettime - pure ESM package that Jest (CJS) cannot load directly
// Mock react-native-reanimated - native module that can't run in Jest
jestConfig.moduleNameMapper = {
  ...jestConfig.moduleNameMapper,
  "^rettime$": "<rootDir>/__mocks__/rettime.js",
  "^react-native-reanimated$": "<rootDir>/__mocks__/react-native-reanimated.js"
};

// ✅ NEW: Tell Jest which files to include in coverage reports
jestConfig.collectCoverageFrom = [
  "**/*.{ts,tsx}",
  // All TypeScript files
  "!**/node_modules/**",
  // Ignore dependencies
  "!**/coverage/**",
  // Ignore coverage output
  "!**/*.config.*",
  // Ignore config files (jest.config, tsconfig, etc.)
  "!**/app/**",
  // Ignore Expo Router files (they need special setup)
  "!**/assets/**",
  // Ignore static assets
  "!**/__mocks__/**", // Ignore mock files
  "!**/.expo/**", // Ignore Expo build files
  "!**/types.ts" // Ignore type definition files (no logic to test)
];
module.exports = jestConfig;
