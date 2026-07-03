const jestConfig = require("jest-expo/jest-preset");

// Add transform for .mjs files (needed for rettime which is pure ESM)
jestConfig.transform["^.+\\.mjs$"] = [
  "babel-jest",
  { caller: { name: "metro", bundler: "metro", platform: "ios" } }
];

// Extend transformIgnorePatterns to include msw and rettime
// These packages need to be transformed by babel-jest because:
// - msw uses rettime internally (a typed event emitter)
// - rettime is pure ESM (.mjs) and Jest needs to transform it
jestConfig.transformIgnorePatterns = [
  "/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|msw|@msw|rettime))/",
  "/node_modules/react-native-reanimated/plugin/"
];

// Mock rettime - pure ESM package that Jest (CJS) cannot load directly
// rettime uses .mjs extension which Jest struggles with even with transform
// This mock provides a minimal Emitter implementation
jestConfig.moduleNameMapper = {
  ...jestConfig.moduleNameMapper,
  "^rettime$": "<rootDir>/__mocks__/rettime.js"
};

module.exports = jestConfig;
