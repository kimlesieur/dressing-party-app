// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");
const unusedImports = require("eslint-plugin-unused-imports");
const tanstackQuery = require("@tanstack/eslint-plugin-query");
const jestPlugin = require("eslint-plugin-jest");
const prettierPlugin = require("eslint-plugin-prettier");
const typescriptParser = require("@typescript-eslint/parser");
const globals = require("globals");

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    plugins: {
      "unused-imports": unusedImports,
      "@tanstack/query": tanstackQuery,
      jest: jestPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "unused-imports/no-unused-imports": "error",
      "no-return-await": "error",
      "prefer-const": "error",
      "object-shorthand": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
        },
      ],
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
    },
  },
  {
    files: ["*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];
