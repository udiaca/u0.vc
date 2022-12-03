import rss from '@astrojs/rss';

const postImportResult = import.meta.glob('./**/*.md', { eager: true });
const posts: any[] = Object.values(postImportResult);

// console.log(postImportResult);
// console.log(posts);

export const get = () => rss({
  title: 'UDIA',
  description: 'Everything App',
  site: 'https://u0.vc/',
  items: posts.map((post) => ({
    link: post.url,
    title: post.frontmatter.title,
    pubDate: post.frontmatter.pubDate || 'no-pubdate',
  })),
});
