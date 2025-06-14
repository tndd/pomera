export interface Section {
  id: string;
  heading: string;
  text: string;
}

export interface Article {
  id: string;
  title: string;
  sections: Section[];
  tags: string[];
}

const tags = ["news", "tech", "lifestyle", "travel", "food"];

const articles: Article[] = Array.from({ length: 30 }, (_, i) => {
  const id = `article-${i + 1}`;
  const title = `Article ${i + 1}`;
  const sections: Section[] = Array.from({ length: 3 }, (_, j) => ({
    id: `sec-${j + 1}`,
    heading: `Section ${j + 1}`,
    text: `Paragraph ${j + 1} for article ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae lorem at ipsum bibendum aliquet.`,
  }));
  // assign 1-3 tags deterministically
  const articleTags = tags.slice(i % tags.length, (i % tags.length) + 3);
  return { id, title, sections, tags: articleTags };
});

export { articles, tags };
