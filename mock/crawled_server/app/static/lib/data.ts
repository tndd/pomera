export interface Article {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

const tags = ["news", "tech", "lifestyle", "travel", "food"];

const articles: Article[] = Array.from({ length: 30 }, (_, i) => {
  const id = `article-${i + 1}`;
  const title = `Article ${i + 1}`;
  const content = `This is the content of article ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
  // assign 1-3 tags deterministically
  const articleTags = tags.slice(i % tags.length, (i % tags.length) + 3);
  return { id, title, content, tags: articleTags };
});

export { articles, tags };
