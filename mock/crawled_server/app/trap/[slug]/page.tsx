import Link from 'next/link';

interface Props {
  params: { slug: string[] };
}

export default function TrapPage({ params }: Props) {
  const nextSlug = [...(params.slug || []), Math.random().toString(36).substring(2, 4)].join('/');
  return (
    <div>
      <h1>LinkSpiral</h1>
      <p>You are in a trap page: {params.slug?.join('/')}</p>
      <Link href={`/trap/${nextSlug}`}>Next trap</Link>
    </div>
  );
}
