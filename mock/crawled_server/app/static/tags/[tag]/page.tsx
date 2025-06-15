import { articles, tags } from "../../lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return tags.map((t) => ({ tag: t }));
}

export async function generateMetadata({ params }: any) {
  const { tag } = await params;
  return { 
    title: `${tag.charAt(0).toUpperCase() + tag.slice(1)} Articles - StaticLand`,
    description: `Explore all articles tagged with ${tag} on StaticLand. Find amazing stories and insights.`
  };
}

export default async function TagPage({ params }: any) {
  const { tag } = await params;
  if (!tags.includes(tag)) return notFound();
  const filtered = articles.filter((a) => a.tags.includes(tag));
  const otherTags = tags.filter(t => t !== tag);

  return (
    <div className="space-y-12">
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

      <section className="text-center bg-white rounded-2xl p-12 shadow-sm">
        <div className="inline-flex items-center px-4 py-2 rounded-full text-lg font-medium bg-blue-50 text-blue-700 mb-6">
          #{tag}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {tag.charAt(0).toUpperCase() + tag.slice(1)} Articles
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover {filtered.length} amazing article{filtered.length !== 1 ? 's' : ''} about {tag}. 
          From insights to practical tips, explore everything we have to offer on this topic.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            All {tag} articles ({filtered.length})
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article, index) => (
            <article key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {article.tags.slice(0, 2).map((articleTag) => (
                    <Link
                      key={articleTag}
                      href={`/static/tags/${articleTag}`}
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                        articleTag === tag 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{articleTag}
                    </Link>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  <Link 
                    href={`/static/articles/${article.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {article.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.sections[0]?.text || "No preview available."}
                </p>
                
                <div className="flex items-center justify-between">
                  <Link
                    href={`/static/articles/${article.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    Read more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <span className="text-xs text-gray-400">
                    Article #{articles.findIndex(a => a.id === article.id) + 1}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Tags</h3>
        <div className="flex flex-wrap gap-3">
          {otherTags.map((otherTag) => {
            const tagArticleCount = articles.filter(a => a.tags.includes(otherTag)).length;
            return (
              <Link
                key={otherTag}
                href={`/static/tags/${otherTag}`}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 transition-all duration-200"
              >
                <span className="font-medium">#{otherTag}</span>
                <span className="ml-2 text-sm text-gray-500">({tagArticleCount})</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
