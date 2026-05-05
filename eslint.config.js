// eslint.config.js
const expo = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = [
  // Expo base flat config
  ...expo,

  // Prettier
  eslintPluginPrettierRecommended,

  // Your overrides
  {
    plugins: {
      // Don't redefine "import" (Expo already adds it)
      "react-native": reactNativePlugin,
    },

    rules: {
      "react-native/sort-styles": ["error", "asc", { ignoreClassNames: false }],

      // Disable Prettier comma rule
      "prettier/prettier": ["error", { trailingComma: "none" }],

      // IMPORT ORDER
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            // 1. React first
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            // 2. React Native right after React
            {
              pattern: "react-native",
              group: "external",
              position: "before",
            },
            // Other externals (expo-router, safe-area, etc) just treated as regular external
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          // Let React / RN be handled by pathGroups and not re-sorted with other externals
          pathGroupsExcludedImportTypes: ["external", "internal"],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always", // blank line between external & internal
        },
      ],
    },

    ignores: ["dist/*"],
  },
];
