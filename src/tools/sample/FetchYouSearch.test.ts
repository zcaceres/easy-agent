import { describe, it, expect, mock } from "bun:test";

import FetchYouSearch, { normalizeYouResults } from "./FetchYouSearch";

describe("FetchYouSearch", () => {
  it("normalizes results.web payload", () => {
    const normalized = normalizeYouResults({
      results: {
        web: [
          {
            title: "OpenAI",
            url: "https://openai.com",
            snippets: ["AI company"],
          },
        ],
      },
    });

    expect(normalized).toEqual([
      {
        title: "OpenAI",
        url: "https://openai.com",
        snippet: "AI company",
      },
    ]);
  });

  it("returns structured error on non-200 responses", async () => {
    const fetchMock = mock(async () => new Response("{}", { status: 403 }));
    (globalThis as any).fetch = fetchMock;

    const result = await FetchYouSearch.callFn({ query: "openai" });

    expect(result).toEqual({
      error: "you.com search failed with status 403",
      results: [],
    });
  });
});

