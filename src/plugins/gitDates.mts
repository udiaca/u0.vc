/**
 * Remark Plugin
 * Automatically populate pubDate and updatedDate from git metadata
 */

import * as child from "node:child_process";

export function lastModifiedDateTime(mdPath: string) {
  try {
    return child
      .execFileSync("date", ["-I", "seconds", "-r", mdPath], {
        encoding: "utf8",
      })
      .trim();
  } catch (_) {
    return "";
  }
}

/**
 * Get the first commit ISO 8601 timestamp for the file.
 * @param {string} mdPath Path to file
 * @returns {string} ISO 8601 commit timestamp for first commit or empty string
 */
export function publishDateTime(mdPath: string) {
  try {
    return child
      .execFileSync(
        "git",
        ["log", "-1", "--diff-filter=A", "--follow", "--format=%cI", "--", mdPath],
        { encoding: "utf8" }
      )
      .trim();
  } catch (_) {
    return "";
  }
}

/**
 * Get the most recent commit ISO 8601 timestamp for the file.
 * @param {string} mdPath Path to file
 * @returns {string} ISO 8601 commit timestamp for first commit or empty string
 */
export function updatedDateTime(mdPath: string) {
  try {
    return child
      .execFileSync("git", ["log", "-1", "--format=%cI", "--", mdPath], {
        encoding: "utf8",
      })
      .trim();
  } catch (_) {
    return "";
  }
}

export function gitDatesPlugin() {
  return function (_: never, file: any) {
    const publishedAt = publishDateTime(file.path) || lastModifiedDateTime(file.path);
    const updatedAt = updatedDateTime(file.path) || lastModifiedDateTime(file.path);
    const lastModifiedAt = lastModifiedDateTime(file.path);

    console.log("====", file.path, publishedAt)

    file.data.astro.frontmatter = {
      publishedAt,
      updatedAt,
      lastModifiedAt,
      ...file.data.astro.frontmatter,
    };
  };
}

export default gitDatesPlugin;
