import { JSDOM } from "jsdom";
import NodeCache from "node-cache";

import Tool from "src/lib/tool";
import { fetchHTML } from "src/tools/sample/FetchHTML";

// We cache big payloads in memory in case the agent requests the same url multiple times.
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

export class HTMLParser {
  private doc: Document;

  private constructor(htmlString: string) {
    const dom = new JSDOM(htmlString);
    this.doc = dom.window.document;
  }

  getText(): string {
    this.doc.querySelectorAll("script").forEach((s) => s.remove());
    this.doc.querySelectorAll("style").forEach((s) => s.remove());
    this.doc.querySelectorAll("nav").forEach((s) => s.remove());
    const textNodes = this.doc.querySelectorAll("body *");
    const textContent = Array.from(textNodes)
      .map((node) => node.textContent?.trim() || "")
      .filter((text) => text.length > 0)
      .join("\n");
    return textContent;
  }

  static from(htmlString: string): string {
    return new HTMLParser(htmlString).getText();
  }
}

export default Tool.create({
  name: "fetch_website_text",
  description:
    "Fetch the text content of a website. Provide a `url` and I will respond with text content.",
  inputs: [
    {
      name: "url",
      type: "string",
      description: "The URL of the webpage to fetch",
      required: true,
    },
  ],
  fn: async ({ url }: { url: string }) => {
    const cachedContent = cache.get<string>(url);
    if (cachedContent) {
      return { text: cachedContent };
    }
    const html = await fetchHTML({ url });
    const text = HTMLParser.from(html);
    cache.set(url, text);
    return {
      text,
    };
  },
});
