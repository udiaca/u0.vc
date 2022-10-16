// Automatically populate pubDate and updatedDate from git metadata

import * as child from "node:child_process";

/**
 * Get the first commit ISO 8601 timestamp for the file.
 * @param {string} mdPath Path to file
 * @returns {string} ISO 8601 commit timestamp for first commit or empty string
 */
function publishDateTime(mdPath: string) {
  console.log(mdPath);
  try {
    return child
      .execFileSync(
        "git",
        ["log", "--diff-filter=A", "--follow", "--format=%cI", "--", mdPath],
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
function updatedDateTime(mdPath: string) {
  try {
    return child
      .execFileSync("git", ["log", "-1", "--pretty=format:%cI", "--", mdPath], {
        encoding: "utf8",
      })
      .trim();
  } catch (_) {
    return "";
  }
}

export function gitDatesPlugin() {
  return function (_: never, file: any) {
    const nowISO = new Date().toISOString();
    const publishedAt = publishDateTime(file.path) || nowISO;
    const updatedAt = updatedDateTime(file.path) || nowISO;

    file.data.astro.frontmatter = {
      publishedAt,
      updatedAt,
      ...file.data.astro.frontmatter,
    };
  };
}

export default gitDatesPlugin;
