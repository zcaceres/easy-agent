import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: true,
  },
  external: [
    "@anthropic-ai/sdk",
    "colors",
    "express",
    "jsdom",
    "node-cache",
    "@google-cloud/speech",
    "yargs",
    "tslib",
  ],
  plugins: [
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      moduleResolution: "node",
    }),
    resolve(),
    commonjs(),
  ],
};
