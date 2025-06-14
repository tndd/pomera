import { articles, tags } from "../../lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return tags.map((t) => ({ tag: t }));
}

export function generateMetadata({ params }: any) {
  return { title: `Tag: ${params.tag}` };
}

export default function TagPage({ params }: any) {
  const { tag } = params;
  if (!tags.includes(tag)) return notFound();
  const filtered = articles.filter((a) => a.tags.includes(tag));

  return (
    <div>
      <h1>Tag: {tag}</h1>
      <ul>
        {filtered.map((a) => (
          <li key={a.id}>
            <Link href={`/static/articles/${a.id}`}>{a.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
