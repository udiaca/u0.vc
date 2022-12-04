---
layout: ../../../layouts/MarkdownLayout.astro
title: "Enabling Client Side Search"
draft: true
---

This post documents how to perform client side search using SQLite in the browser, built on top of [sql-js-httpsvfs].

[sql-js-httpsvfs]: https://github.com/phiresky/sql.js-httpvfs "github.com/phiresky/sql.js-httpvfs"

[*lowering expectations*](/en/story/2022-12-03#stuff-made-here-original-unpickable-lock-guy)

# Content Search

Using [Cloudflare D1](https://developers.cloudflare.com/d1/get-started/).

**One**. Create Cloudflare database schema.

[Adapted the schema from jordemort](https://jordemort.dev/blog/client-side-search/#the-schema), [h-entry specification](https://microformats.org/wiki/h-entry).

## File

`db/schema.sql`

```sql
CREATE TABLE entries (
  url TEXT NOT NULL UNIQUE,
  published TEXT NULL,
  updated TEXT NULL,
  PRIMARY KEY (url)
);

CREATE INDEX IDX_published ON entries(published);
CREATE INDEX IDX_updated ON entries(updated);

CREATE VIRTUAL TABLE ftsentries
USING fts5(url, content, tokenize=porter);
```

## Run on Cloudflare

```bash
npx wrangler d1 execute d1-u0-vc --file=db/schema.sql
```
```
alexander@Alexanders-MacBook-Air u0.vc % npx wrangler d1 execute d1-u0-vc --file=db/schema.sql

🚧 D1 is currently in open alpha and is not recommended for production data and traffic.
Please report any bugs to https://github.com/cloudflare/wrangler2/issues/new/choose.
To request features, visit https://community.cloudflare.com/c/developers/d1.
To give feedback, visit https://discord.gg/cloudflaredev
Packages @databases/sql, @databases/split-sql-query not available locally. Attempting to use npx to install temporarily.
Installing... (npx --prefer-offline -y -p @databases/sql@3.2.0 -p @databases/split-sql-query@1.0.3)
Installed into /Users/alexander/.npm/_npx/48c3d90e3e285020/node_modules.
To skip this step in future, run: npm install --save-dev @databases/sql@3.2.0 @databases/split-sql-query@1.0.3
🌀 Mapping SQL input into an array of statements
🌀 Parsing 5 statements
🌀 Executing on d1-u0-vc (00000000-0000-0000-0000-000000000000):
🚣 Executed 5 commands in 12.94946900010109ms
```

```bash
npx wrangler d1 execute d1-u0-vc --command "SELECT * FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
```
```
┌───────┬────────────────────┬────────────────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ type  │ name               │ tbl_name           │ rootpage │ sql                                                                                                                  │
├───────┼────────────────────┼────────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ table │ entries            │ entries            │ 4        │ CREATE TABLE entries (    │
                                                                url TEXT NOT NULL UNIQUE,
                                                                published TEXT NULL,
                                                                updated TEXT NULL,
                                                                PRIMARY KEY (url)
                                                              )
├───────┼────────────────────┼────────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ table │ ftsEntries         │ ftsEntries         │ 0        │ CREATE VIRTUAL TABLE ftsEntries                                                     │
                                                              USING fts5(url, content, tokenize=porter)
├───────┼────────────────────┼────────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ table │ ftsEntries_data    │ ftsEntries_data    │ 8        │ CREATE TABLE 'ftsEntries_data'(id INTEGER PRIMARY KEY, block BLOB)                                                   │
├───────┼────────────────────┼────────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ table │ ftsEntries_idx     │ ftsEntries_idx     │ 9        │ CREATE TABLE 'ftsEntries_idx'(segid, term, pgno, PRIMARY KEY(segid, term)) WITHOUT ROWID                             │
├───────┼────────────────────┼────────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ table │ ftsEntries_content │ ftsEntries_content │ 10       │ CREATE TABLE 'ftsEntries_content'(id INTEGER PRIMARY KEY, c0, c1)                                                    │
├───────┼────────────────────┼────────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ table │ ftsEntries_docsize │ ftsEntries_docsize │ 11       │ CREATE TABLE 'ftsEntries_docsize'(id INTEGER PRIMARY KEY, sz BLOB)                                                   │
├───────┼────────────────────┼────────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ table │ ftsEntries_config  │ ftsEntries_config  │ 12       │ CREATE TABLE 'ftsEntries_config'(k PRIMARY KEY, v) WITHOUT ROWID                                                     │
└───────┴────────────────────┴────────────────────┴──────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

```

## Content Indexer

**Two**. Index the markdown content within this repository.

[Jordemort indexer raw](https://github.com/jordemort/jordemort.github.io/blob/main/src/search/indexer.ts)
- not sure if I want to integrate [metascraper](https://metascraper.js.org/) and [microformats-parser](https://github.com/microformats/microformats-parser) yet
- might be enough to just use markdown

[Astro Integration API](https://docs.astro.build/en/reference/integrations-reference/) is used to hook into build. [`astro:build:done`](https://docs.astro.build/en/reference/integrations-reference/#astrobuilddone) makes sense to use here.

Not too happy with how I'm doing the push to `u0.vc` d1 database, [running it on my developer machine during astro build call is gross](https://github.com/udiaca/u0.vc/blob/preview/src/plugins/indexEntry.ts).

[Query also works](https://github.com/udiaca/u0.vc/blob/preview/functions/api/entry.ts).
Call to [u0.vc/api/entry?q=hariscarrom](https://u0.vc/api/entry?q=hariscarrom) serves raw JSON but you can search for strings.
Need to axe the dev passthrough env variable, add search pagination.

## Client Side Search Implementation

**Three**. Create a web UI for the search.

Written [`src/components/SearchEntities.svelte`](https://github.com/udiaca/u0.vc/blob/preview/src/components/SearchEntities.svelte), first pass.

Bare bones search on blur with stylized text to show search states. If you are reading this, the search bar at the top should be working.
