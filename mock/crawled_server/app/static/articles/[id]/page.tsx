import { articles } from "../../lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: any) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);
  if (!article) return {};
  const firstSection = article.sections[0]?.text || "";
  return { title: article.title, description: firstSection.slice(0, 50) };
}

export default async function ArticlePage({ params }: any) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);
  if (!article) return notFound();

  const idx = articles.findIndex((a) => a.id === id);
  const related = articles
    .slice(idx + 1, idx + 5)
    .concat(articles.slice(0, Math.max(0, idx + 5 - articles.length)));

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <nav className="border-b pb-2">
        <h2 className="font-semibold">Section links:</h2>
        <ul className="list-disc list-inside ml-4 space-y-1">
          {article.sections.map((sec) => (
            <li key={sec.id}>
              <a className="text-blue-600 hover:underline" href={`#${sec.id}`}>{sec.heading}</a>
            </li>
          ))}
        </ul>
      </nav>
      {article.sections.map((sec) => (
        <section key={sec.id} id={sec.id} className="space-y-2">
          <h2 className="text-2xl font-semibold">{sec.heading}</h2>
          <p>{sec.text}</p>
        </section>
      ))}
      <p>
        Tags:{" "}
        {article.tags.map((t) => (
          <Link key={t} className="text-blue-600 hover:underline" href={`/static/tags/${t}`}>{t} </Link>
        ))}
      </p>
      <div>
        <h3 className="text-xl font-semibold mb-2">Related Articles</h3>
        <ul className="list-disc list-inside ml-4 space-y-1">
          {related.map((r) => (
            <li key={r.id}>
              <Link className="text-blue-600 hover:underline" href={`/static/articles/${r.id}`}>{r.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
