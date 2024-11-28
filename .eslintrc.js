// eslint.config.js
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "react-hooks"],
  rules: {
    "prettier/prettier": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // "no-console": "warn", // Warn about console logs (optional)
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Ignore unused vars starting with '_'
  },
  env: {
    browser: true,
    node: true,
  },
};
