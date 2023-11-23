module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    "@typescript-eslint",
    "react", // react is short for eslint-plugin-react, we can use the full name eslint-plugin-react instead.
  ],

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:storybook/recommended",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-ignore": "allow-with-description",
        minimumDescriptionLength: 3,
      },
    ],
    // add ignore for @react-three/fiber
    "react/no-unknown-property": [
      "error",
      {
        ignore: [
          "attach",
          "args",
          "vertexShader",
          "fragmentShader",
          "uniforms",
          "count",
          "side",
          "position",
          "resolution",
          "renderOrder",
          "transparent",
          "alphaTest",
          "rotation",
          "vertexColors",
          "map",
          "dispose",
          "geometry",
          "material",
          "object",
          "envMap",
          "roughness",
          "metalness",
          "emissive",
          "material-color",
          "intensity",
          "wireframe",
        ],
      },
    ],
  },
  // https://github.com/jsx-eslint/eslint-plugin-react#configuration
  settings: {
    react: {
      version: "detect",
    },
  },
};
