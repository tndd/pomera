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
        <ul>
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/static/tags/${tag}`}>{tag}</Link>
            </li>
          ))}
        </ul>
        <Link href="/static">Home</Link>
      </nav>
      <main>{children}</main>
      <footer>
        <p>StaticLand Example Site</p>
      </footer>
    </div>
  );
}
