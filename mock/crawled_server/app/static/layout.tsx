import Link from "next/link";
import { tags } from "./lib/data";

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <h1>StaticLand</h1>
        <p>Your friendly static blog</p>
        <Link href="/static">Home</Link>
        <h2>Tags</h2>
        <ul>
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/static/tags/${tag}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>{children}</main>
      <footer>
        <p>&copy; 2025 StaticLand. All rights reserved.</p>
      </footer>
    </div>
  );
}
