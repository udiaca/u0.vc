/**
 * Astro Integration
 * Utility file for indexing Astro posts for SQLite search.
 */
import type { AstroConfig, AstroIntegration, RouteData } from "astro";
import { publishDateTime, updatedDateTime } from "./gitDates.mjs";
import { readFile } from 'fs/promises';
import type { IndexEntryPayload } from "../../functions/api/entry.js";

// const DEV_PASSTHROUGH = ""
const DEV_PASSTHROUGH = "1ae724bfb63e05586d586a52b507b4c3";

export default function indexEntry(): AstroIntegration {
  const indexRoute = async (route: RouteData, rowId: number, nowISO = new Date().toISOString()) => {
    const { component, pathname } = route;
    const publishedAt = publishDateTime(component) || nowISO;
    const updatedAt = updatedDateTime(component) || nowISO;

    // Possible: make a CURL request to web server and parse the HTML + store
    console.log(pathname, JSON.stringify({publishedAt, updatedAt}));
    if (!pathname) {
      // no support for variable pathnames like /[...path] or /u/[...id]
      return
    }

    // get the component file contents
    const file = await readFile(component, 'utf-8')
    // maybe need to normalize file, simplify all whitespace or something?
    const content = file
      .split(/(\s+)/).filter(inp => inp.trim().length > 0)
      .map(inp => inp.trim())
      .join(" ")

    const payload: IndexEntryPayload = {
      url: pathname,
      content,
      published: publishedAt,
      updated: updatedAt,
      rowId
    }
    const resp = await fetch('https://u0.vc/api/entry', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'authorization': `bearer ${DEV_PASSTHROUGH}`,
        'content-type': 'application/json'
      }
    })
    const resPayload = await resp.text()
    console.log(pathname, resPayload)
    console.log('====\n')
  }

  return {
    name: '@udia/indexEntry',
    hooks: {
      "astro:build:done": async ({ routes }) => {
        const nowISO = new Date().toISOString();
        await Promise.all(routes.map((route, idx) => indexRoute(route, idx, nowISO)));
      },
    }
  }
}