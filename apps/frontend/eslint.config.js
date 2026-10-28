import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

import { tandemEslintPlugin } from "../../eslint/no-em-dash.mjs";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "**/*.test.{ts,tsx}", "**/*.d.ts"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { import: importPlugin, tandem: tandemEslintPlugin },
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.app.json" },
      },
    },
    rules: {
      "tandem/no-em-dash": "error",
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
            "object",
            "type",
          ],
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "type"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
);
