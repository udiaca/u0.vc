DROP TABLE IF EXISTS entries;
CREATE TABLE entries (
  url TEXT NOT NULL UNIQUE,
  published TEXT NULL,
  updated TEXT NULL,
  PRIMARY KEY (url)
);

CREATE INDEX IDX_published ON entries(published);
CREATE INDEX IDX_updated ON entries(updated);

DROP TABLE IF EXISTS ftsEntries;
CREATE VIRTUAL TABLE ftsEntries USING fts5(
  url,
  content,
  tokenize="porter"
);
