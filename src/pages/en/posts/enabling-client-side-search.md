---
layout: ../../../layouts/MarkdownLayout.astro
title: "Enabling Client Side Search"
draft: true
---

This post documents how to perform client side search using SQLite in the browser, built on top of [sql-js-httpsvfs].

[sql-js-httpsvfs]: https://github.com/phiresky/sql.js-httpvfs "github.com/phiresky/sql.js-httpvfs"

*lowering expectations*

Search using [Cloudflare D1](https://developers.cloudflare.com/d1/get-started/).

1. Convert all content into D1 searchable entries.

[Adapted the schema from jordemort](https://jordemort.dev/blog/client-side-search/#the-schema), [h-entry specification](https://microformats.org/wiki/h-entry).

```sql
CREATE TABLE entries (
  entry_id INTEGER PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  published TEXT NULL,
  updated TEXT NULL
);

CREATE INDEX IDX_published
ON entries(published);

CREATE TABLE categories (
  category TEXT NOT NULL,
  entry_id INTEGER NOT NULL,
  FOREIGN KEY(entry_id) REFERENCES entries(entry_id)
);

CREATE INDEX IDX_categories
ON categories(category);

CREATE VIRTUAL TABLE ftsentries
USING fts4(name, categories, summary, content, tokenize=porter);
```
