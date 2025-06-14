import Link from "next/link";
import { ads, quotes } from "./lib/data";

export const dynamic = "force-dynamic";

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const ad = ads[Math.floor(Math.random() * ads.length)];
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-purple-700 text-white p-4 flex justify-between">
        <Link href="/dynamic" className="font-bold text-xl">
          DynamicMaze
        </Link>
        <span className="italic text-sm">{quote}</span>
      </header>
      <main className="flex-1 p-4">{children}</main>
      <aside className="bg-purple-100 text-center p-2 text-sm">{ad}</aside>
      <footer className="bg-gray-200 text-center p-2 text-xs">© 2025 DynamicMaze</footer>
    </div>
  );
}
