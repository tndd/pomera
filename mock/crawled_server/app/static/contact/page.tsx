import Link from "next/link";

export const metadata = {
  title: "Contact - StaticLand",
};

export default function ContactPage() {
  return (
    <main>
      <h1>Contact Us</h1>
      <p>You can reach us by sending a message via carrier pigeon.</p>
      <p><Link href="/static">Back to Home</Link></p>
    </main>
  );
}
