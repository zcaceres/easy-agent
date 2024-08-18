import { describe, it, expect } from "bun:test";
import { HTMLParser } from "tools/sample/FetchWebsiteText";

const SAMPLE_HTML = `<html>
    <head>
        <style>
            /* Add your CSS styles here */
        </style>
        <script>
            // Add your JavaScript code here
        </script>
    </head>
    <body>
        <header>
            <style>
                /* Add header-specific CSS styles here */
            </style>
            <script>
                // Add header-specific JavaScript code here
            </script>
            Header Content
        </header>
        <h1>Main Title</h1>
        <p>This is the main content.</p>
        <aside>Sidebar Content</aside>
        <footer>
            <style>
                /* Add footer-specific CSS styles here */
            </style>
            <script>
                // Add footer-specific JavaScript code here
            </script>
            Footer Content
        </footer>
    </body>
</html>`;

describe("HTMLParser", () => {
  it("should extract text content from HTML", () => {
    const text = HTMLParser.from(SAMPLE_HTML);
    expect(text).toEqual(
      "Header Content\nMain Title\nThis is the main content.\nSidebar Content\nFooter Content"
    );
  });
});
