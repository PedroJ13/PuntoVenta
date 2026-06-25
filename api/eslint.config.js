export default [
  {
    ignores: [
      "coverage/**",
      "functions/**",
      "logs/**",
      "local-secrets/**",
      "node_modules/**",
      "package-lock.json",
      "tmp/**",
    ],
  },
  {
    files: ["scripts/**/*.js", "src/**/*.js", "test/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        AbortController: "readonly",
        Buffer: "readonly",
        console: "readonly",
        clearTimeout: "readonly",
        fetch: "readonly",
        global: "readonly",
        Headers: "readonly",
        process: "readonly",
        Request: "readonly",
        Response: "readonly",
        setTimeout: "readonly",
        structuredClone: "readonly",
        TextDecoder: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "no-undef": "error",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["httpApi/**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        Promise: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
