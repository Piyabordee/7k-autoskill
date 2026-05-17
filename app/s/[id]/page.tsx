import { redirect } from 'next/navigation';
import { getHash } from '@/lib/shortlinks';

export default async function ShortUrlPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hash = await getHash(id);

  if (hash) {
    redirect(`/planner#${hash}`);
  } else {
    redirect('/planner?error=not_found');
  }
}