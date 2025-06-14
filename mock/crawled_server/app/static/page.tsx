import Link from "next/link";
import { articles } from "./lib/data";

export const metadata = {
  title: "StaticLand Home",
  description: "Static articles",
};

export default function StaticHome() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome to StaticLand</h1>
      <p className="text-gray-700">Browse our latest posts below.</p>
      <h2 className="text-2xl font-semibold">Articles</h2>
      <ul className="list-disc list-inside ml-4 space-y-1">
        {articles.map((article) => (
          <li key={article.id}>
            <Link className="text-blue-600 hover:underline" href={`/static/articles/${article.id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
