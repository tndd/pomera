import Link from "next/link";
import { articles } from "./lib/data";

export const metadata = {
  title: "StaticLand - Discover Amazing Stories",
  description: "Welcome to StaticLand, where amazing stories and insights come to life. Explore our collection of articles on tech, lifestyle, travel, food, and news.",
};

export default function StaticHome() {
  return (
    <div className="space-y-12">
      <section className="text-center bg-white rounded-2xl p-12 shadow-sm">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">StaticLand</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover amazing stories, insights, and perspectives from our curated collection of articles. 
          From the latest in technology to lifestyle tips, we've got something for everyone.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
          <div className="text-sm text-gray-500">
            {articles.length} articles available
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {article.tags.slice(0, 2).map((tag) => (
                    <Link
                      key={tag}
                      href={`/static/tags/${tag}`}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      #{tag}
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
                    Article #{index + 1}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
