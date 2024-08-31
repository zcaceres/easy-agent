import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

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
    "yargs",
    "tslib",
  ],
  plugins: [
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
