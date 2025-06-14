import { articles } from "../../lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export function generateMetadata({ params }: any) {
  const article = articles.find((a) => a.id === params.id);
  if (!article) return {};
  return { title: article.title, description: article.content.slice(0, 50) };
}

export default function ArticlePage({ params }: any) {
  const article = articles.find((a) => a.id === params.id);
  if (!article) return notFound();

  const idx = articles.findIndex((a) => a.id === params.id);
  const related = articles
    .slice(idx + 1, idx + 4)
    .concat(articles.slice(0, Math.max(0, idx + 4 - articles.length)));

  return (
    <article>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
      <p>
        Tags:{" "}
        {article.tags.map((t) => (
          <Link key={t} href={`/static/tags/${t}`}>{t} </Link>
        ))}
      </p>
      <h3>Related Articles</h3>
      <ul>
        {related.map((r) => (
          <li key={r.id}>
            <Link href={`/static/articles/${r.id}`}>{r.title}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
