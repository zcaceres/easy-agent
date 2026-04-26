import Tool from "src/lib/tool";

type YouSearchResult = {
  title?: string;
  url?: string;
  snippets?: string[];
  description?: string;
};

export function normalizeYouResults(payload: unknown) {
  const webResults =
    (payload as { results?: { web?: YouSearchResult[] } })?.results?.web ?? [];

  return webResults
    .map((item) => ({
      title: item.title ?? item.url ?? "Untitled",
      url: item.url ?? "",
      snippet: item.snippets?.[0] ?? item.description ?? "",
    }))
    .filter((item) => item.url);
}

export default Tool.create({
  name: "fetch_you_search",
  description:
    "Search the web with You.com Search API and return normalized results for agent reasoning.",
  inputs: [
    {
      name: "query",
      type: "string",
      description: "Search query text",
      required: true,
    },
    {
      name: "count",
      type: "number",
      description: "How many results to fetch (default 5)",
    },
    {
      name: "apiKey",
      type: "string",
      description: "Optional You.com API key. Falls back to YDC_API_KEY env var.",
    },
  ],
  fn: async ({ query, count = 5, apiKey }) => {
    const effectiveApiKey = apiKey || process.env.YDC_API_KEY;
    const url = new URL("https://api.you.com/v1/agents/search");
    url.searchParams.set("query", query);
    url.searchParams.set("count", String(count));

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        ...(effectiveApiKey ? { "X-API-Key": effectiveApiKey } : {}),
      },
    });

    if (!response.ok) {
      return {
        error: `you.com search failed with status ${response.status}`,
        results: [],
      };
    }

    const data = await response.json();
    return {
      results: normalizeYouResults(data),
    };
  },
});

