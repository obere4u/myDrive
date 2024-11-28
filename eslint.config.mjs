import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import globals from "globals";

// Resolve current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize FlatCompat
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// Export the ESLint configuration
export default [
  ...compat.extends("expo", "prettier"), // Extend Expo and Prettier
  {
    plugins: {
      prettier, // Include the Prettier plugin
    },
    languageOptions: {
      globals: Object.fromEntries(
        Object.entries({
          ...globals.browser,
          ...globals.node,
        }).map(([key, value]) => [key.trim(), value]), // Ensure no leading/trailing whitespace
      ),
    },
    rules: {
      "prettier/prettier": "error", // Enforce Prettier rules
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_", // Ignore unused variables starting with "_"
        },
      ],
    },
  },
];
