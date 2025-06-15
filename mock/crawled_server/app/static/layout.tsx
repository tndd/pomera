import Link from "next/link";
import { tags } from "./lib/data";

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/static" className="text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                StaticLand
              </Link>
              <p className="text-gray-600 mt-1">Discover amazing stories and insights</p>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/static" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/static/tags/tech" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Tech
              </Link>
              <Link href="/static/tags/lifestyle" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Lifestyle
              </Link>
            </nav>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500 font-medium">Browse by tags:</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    href={`/static/tags/${tag}`}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-12">{children}</main>
      
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">StaticLand</h3>
            <p className="text-gray-400 mb-6">Where stories come to life</p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/static" className="hover:text-blue-400 transition-colors">Home</Link>
              <span className="text-gray-600">|</span>
              <Link href="/static/tags/tech" className="hover:text-blue-400 transition-colors">Tech</Link>
              <span className="text-gray-600">|</span>
              <Link href="/static/tags/lifestyle" className="hover:text-blue-400 transition-colors">Lifestyle</Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-500">&copy; 2025 StaticLand. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
