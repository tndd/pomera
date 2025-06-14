import Link from "next/link";
import { articles } from "./lib/data";

export const metadata = {
  title: "StaticLand Home",
  description: "Static articles",
};

export default function StaticHome() {
  return (
    <div>
      <h2>Articles</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={`/static/articles/${article.id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
