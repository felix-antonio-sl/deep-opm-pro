// [JOYAS §1-3] L2 protege chrome UI: los colores viven en src/ui/tokens.ts.
// Contrato steipete T2.2/T2.4: regla acotada a UI, sin ampliar lint funcional.
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const noOpRule = {
  meta: { type: "problem", schema: [] },
  create: () => ({}),
};

const colorLiteralRule = {
  selector: "Literal[value=/#[0-9A-Fa-f]{3,8}/], TemplateElement[value.raw=/#[0-9A-Fa-f]{3,8}/]",
  message: "No uses colores literales en src/ui. Usa tokens desde src/ui/tokens.ts.",
};

export default [
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    files: ["src/ui/**/*.{ts,tsx}"],
    ignores: [
      "src/ui/tokens.ts",
      "src/ui/tokens.test.ts",
      "src/ui/**/*.test.ts",
      "src/ui/App.tsx",
      "src/ui/Toolbar.tsx",
      "src/ui/toolbar/**",
      "src/ui/BarraHerramientasElemento.tsx",
      "src/ui/PanelMetodologia.tsx",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": { rules: { "exhaustive-deps": noOpRule } },
    },
    rules: {
      "no-restricted-syntax": ["error", colorLiteralRule],
    },
  },
];
