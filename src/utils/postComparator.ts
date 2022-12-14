import type { MarkdownInstance } from "astro";

export const postComparator = (a: MarkdownInstance<Record<string, any>>, b: MarkdownInstance<Record<string, any>>) => {
  const aDate = new Date(a.frontmatter.publishedAt)
  const bDate = new Date(b.frontmatter.publishedAt)
  const dateDelta = aDate.valueOf() - bDate.valueOf()
  if (!isNaN(dateDelta)) {
    return dateDelta
  }

  // dates are not valid, return path lexicalgraphical
  return a.file.localeCompare(b.file);
}

export default postComparator
