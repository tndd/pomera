import { articles } from "../../lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export function generateMetadata({ params }: any) {
  const article = articles.find((a) => a.id === params.id);
  if (!article) return {};
  const firstSection = article.sections[0]?.text || "";
  return { title: article.title, description: firstSection.slice(0, 50) };
}

export default function ArticlePage({ params }: any) {
  const article = articles.find((a) => a.id === params.id);
  if (!article) return notFound();

  const idx = articles.findIndex((a) => a.id === params.id);
  const related = articles
    .slice(idx + 1, idx + 5)
    .concat(articles.slice(0, Math.max(0, idx + 5 - articles.length)));

  return (
    <article>
      <h1>{article.title}</h1>
      <nav>
        Section links:
        <ul>
          {article.sections.map((sec) => (
            <li key={sec.id}>
              <a href={`#${sec.id}`}>{sec.heading}</a>
            </li>
          ))}
        </ul>
      </nav>
      {article.sections.map((sec) => (
        <section key={sec.id} id={sec.id}>
          <h2>{sec.heading}</h2>
          <p>{sec.text}</p>
        </section>
      ))}
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
