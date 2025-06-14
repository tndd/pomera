import { notFound } from "next/navigation";
import { ads, quotes, sections } from "../../lib/data";

export const dynamic = "force-dynamic";

export default async function SectionPage({ params }: any) {
  const { id } = await params;
  const section = sections.find((s) => s.id === id);
  if (!section) return notFound();
  const paragraphOrder = [1, 2, 3].sort(() => Math.random() - 0.5);
  const ad = ads[Math.floor(Math.random() * ads.length)];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">{section.title}</h1>
      {paragraphOrder.map((n) => (
        <p key={n} className="leading-relaxed">
          Paragraph {n} of {section.title}. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Vivamus auctor metus et dolor facilisis, non varius
          ipsum pretium.
        </p>
      ))}
      <blockquote className="border-l-4 border-purple-400 pl-2 italic">
        {quote}
      </blockquote>
      <div className="bg-purple-50 p-2 text-center text-sm">{ad}</div>
    </article>
  );
}
