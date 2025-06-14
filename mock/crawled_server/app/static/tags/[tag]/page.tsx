import { articles, tags } from "../../lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return tags.map((t) => ({ tag: t }));
}

export async function generateMetadata({ params }: any) {
  const { tag } = await params;
  return { title: `Tag: ${tag}` };
}

export default async function TagPage({ params }: any) {
  const { tag } = await params;
  if (!tags.includes(tag)) return notFound();
  const filtered = articles.filter((a) => a.tags.includes(tag));

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Tag: {tag}</h1>
      <ul className="list-disc list-inside ml-4 space-y-1">
        {filtered.map((a) => (
          <li key={a.id}>
            <Link className="text-blue-600 hover:underline" href={`/static/articles/${a.id}`}>{a.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
