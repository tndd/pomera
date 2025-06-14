import Link from "next/link";
import { sections } from "./lib/data";

export const dynamic = "force-dynamic";

export default function DynamicHome() {
  const shuffled = sections.slice().sort(() => Math.random() - 0.5);
  const variant = Math.floor(Math.random() * 2);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to DynamicMaze</h1>
      {variant === 0 ? (
        <ul className="list-disc list-inside space-y-1">
          {shuffled.map((s) => (
            <li key={s.id} className="hover:text-purple-700">
              <Link href={`/dynamic/sections/${s.id}`}>{s.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {shuffled.map((s) => (
            <Link
              key={s.id}
              className="block p-2 border border-purple-400 hover:bg-purple-50"
              href={`/dynamic/sections/${s.id}`}
            >
              {s.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
