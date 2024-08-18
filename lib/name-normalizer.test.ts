import { describe, it, expect } from "bun:test";

import NormalizeName from "./name-normalizer";
import type { NormalizedName } from "definitions";

describe("NormalizeName", () => {
  it("should normalize a name", () => {
    expect(NormalizeName("  My Name  ")).toEqual("my-name" as NormalizedName);
  });
});
