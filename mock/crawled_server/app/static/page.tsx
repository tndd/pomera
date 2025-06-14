import Link from "next/link";

export const metadata = {
  title: "StaticLand",
  description: "A fully static sample site with simple HTML pages.",
};

export default function StaticLandHome() {
  return (
    <main>
      <h1>Welcome to StaticLand</h1>
      <p>This is a simple static site used for crawler testing.</p>
      <ul>
        <li><Link href="/static/about">About</Link></li>
        <li><Link href="/static/contact">Contact</Link></li>
      </ul>
    </main>
  );
}
