import { articles } from "../../lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: any) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);
  if (!article) return {};
  const firstSection = article.sections[0]?.text || "";
  return { 
    title: `${article.title} - StaticLand`,
    description: firstSection.slice(0, 150) + "...",
  };
}

export default async function ArticlePage({ params }: any) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);
  if (!article) return notFound();

  const idx = articles.findIndex((a) => a.id === id);
  const related = articles
    .slice(idx + 1, idx + 4)
    .concat(articles.slice(0, Math.max(0, idx + 4 - articles.length)));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/static" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all articles
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 md:p-12">
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/static/tags/${tag}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-8">
              <span>Article #{idx + 1}</span>
              <span className="mx-2">•</span>
              <span>{article.sections.length} sections</span>
            </div>
          </header>

          <nav className="bg-gray-50 rounded-xl p-6 mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2">
              {article.sections.map((sec, index) => (
                <li key={sec.id}>
                  <a 
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group" 
                    href={`#${sec.id}`}
                  >
                    <span className="text-sm text-gray-400 mr-3 font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="group-hover:underline">{sec.heading}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="prose prose-lg max-w-none">
            {article.sections.map((sec, index) => (
              <section key={sec.id} id={sec.id} className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {sec.heading}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {sec.text}
                </p>
              </section>
            ))}
          </div>
        </div>
      </article>

      <div className="mt-12 bg-white rounded-2xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((relatedArticle) => (
            <div key={relatedArticle.id} className="group">
              <Link
                href={`/static/articles/${relatedArticle.id}`}
                className="block p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  {relatedArticle.tags.slice(0, 1).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {relatedArticle.title}
                </h4>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {relatedArticle.sections[0]?.text}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
