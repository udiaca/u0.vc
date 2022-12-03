---
layout: ../../../layouts/MarkdownLayout.astro
title: "Enabling Client Side Search"
draft: true
---

This post documents how to perform client side search using SQLite in the browser, built on top of [sql-js-httpsvfs].

[sql-js-httpsvfs]: https://github.com/phiresky/sql.js-httpvfs "github.com/phiresky/sql.js-httpvfs"

*lowering expectations*

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

## Content Indexer

**Two**. Index the markdown content within this repository.

[Jordemort indexer raw](https://github.com/jordemort/jordemort.github.io/blob/main/src/search/indexer.ts)
- not sure if I want to integrate [metascraper](https://metascraper.js.org/) and [microformats-parser](https://github.com/microformats/microformats-parser) yet
- might be enough to just use markdown

[Astro Integration API](https://docs.astro.build/en/reference/integrations-reference/) is used to hook into build. [`astro:build:done`](https://docs.astro.build/en/reference/integrations-reference/#astrobuilddone) makes sense to use here.

