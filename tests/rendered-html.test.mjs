import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Debasis Nath — Product Systems &amp; AI-Enabled Workflows<\/title>/i);
  assert.match(html, /I build product systems that make/);
  assert.match(html, /Senior Software Engineer/);
  assert.match(html, /LegalZoom/);
  assert.match(html, /AI Systems Engineering Journey/);
  assert.match(html, /Nasdaq Learning Lab/);
  assert.match(html, /Indian Institute of Technology Madras/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("ships its own identity assets without starter preview code", async () => {
  const [page, layout, css, favicon, og] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"),
    access(new URL("../public/og.png", import.meta.url)),
  ]);

  assert.match(page, /Product systems/);
  assert.match(layout, /Debasis Nath/);
  assert.match(css, /--signal:\s*#b7f35a/);
  assert.match(favicon, /#090B10/);
  assert.equal(og, undefined);
  await assert.rejects(access(new URL("app/_sites-preview/", root)));
});
