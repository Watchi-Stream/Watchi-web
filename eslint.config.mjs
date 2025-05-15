import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Avoid unused variables
      "@typescript-eslint/no-unused-vars": "error",
      
      // Properly escape HTML entities in JSX
      "react/no-unescaped-entities": [
        "error",
        {
          "forbid": [
            {
              "char": "'",
              "alternatives": ["&apos;"]
            },
            {
              "char": "\"",
              "alternatives": ["&quot;"]
            },
            {
              "char": ">",
              "alternatives": ["&gt;"]
            },
            {
              "char": "}",
              "alternatives": ["&#125;"]
            }
          ]
        }
      ],
      
      // Avoid any type except in very specific cases
      "@typescript-eslint/no-explicit-any": "error",
      
      // Ensure dependencies are properly specified in hooks
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];

export default eslintConfig;
