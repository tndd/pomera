'use client';

export default function DynamicPage() {
  const random = Math.random().toString(36).substring(2, 8);
  return (
    <div>
      <h1>DynamicMaze</h1>
      <p>Random content id: {random}</p>
    </div>
  );
}
