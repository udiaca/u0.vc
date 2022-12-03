/**
 * Astro Integration
 * Utility file for indexing Astro posts for SQLite search.
 */
import type { AstroConfig, AstroIntegration, RouteData } from "astro";
import { publishDateTime, updatedDateTime } from "./gitDates.mjs";
import { readFile } from 'fs/promises';

// const DEV_PASSTHROUGH = ""
const DEV_PASSTHROUGH = "1ae724bfb63e05586d586a52b507b4c3";

export default function indexEntry(): AstroIntegration {
  const indexRoute = async (route: RouteData, nowISO = new Date().toISOString()) => {
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
    const resp = await fetch('https://u0.vc/api/entry', {
      method: 'POST',
      body: JSON.stringify({
        url: pathname,
        content: file,
        published: publishedAt,
        updated: updatedAt
      }),
      headers: {
        'authorization': `bearer ${DEV_PASSTHROUGH}`,
        'content-type': 'application/json'
      }
    })
    const payload = await resp.text()
    console.log(pathname, resp, payload)
    console.log('====\n')
  }

  return {
    name: '@udia/indexEntry',
    hooks: {
      "astro:build:done": async ({ routes }) => {
        const nowISO = new Date().toISOString();
        await Promise.all(routes.map(route => indexRoute(route, nowISO)));
      },
    }
  }
}