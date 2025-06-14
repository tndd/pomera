import Link from "next/link";

export const metadata = {
  title: "About - StaticLand",
};

export default function AboutPage() {
  return (
    <main>
      <h1>About StaticLand</h1>
      <p>This page provides some static information about the site.</p>
      <p><Link href="/static">Back to Home</Link></p>
    </main>
  );
}
