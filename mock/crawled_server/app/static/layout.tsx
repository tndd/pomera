import Link from "next/link";
import { tags } from "./lib/data";

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col text-gray-800 bg-gray-50">
      <nav className="bg-gray-800 text-white py-4">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <Link href="/static" className="text-2xl font-bold">
            StaticLand
          </Link>
          <p className="text-sm text-gray-300">Your friendly static blog</p>
          <div>
            <h2 className="font-semibold">Tags</h2>
            <ul className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <li key={tag}>
                  <Link
                    className="text-blue-200 hover:underline"
                    href={`/static/tags/${tag}`}
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto px-4 py-6">{children}</main>
      <footer className="bg-gray-200 py-4 text-center text-sm text-gray-600">
        <p>&copy; 2025 StaticLand. All rights reserved.</p>
      </footer>
    </div>
  );
}
