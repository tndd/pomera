export const dynamic = 'error'; // Disable SSR caching

export default function StaticPage() {
  return (
    <div>
      <h1>Welcome to StaticLand</h1>
      <p>This page is completely static and easy for crawlers.</p>
    </div>
  );
}
