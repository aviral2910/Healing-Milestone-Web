import { Metadata } from "next";
import { notFound } from "next/navigation";
import CompareScreen from "./CompareScreen";
import Link from "next/link";
import { safeUtcDate } from '@/utils/dateUtils';

type Props = {
  params: Promise<{ id: string }>;
};

async function getMixView(id: string) {
  try {
    const res = await fetch(`https://healing-milestones-api.onrender.com/api/mix-views/${id}/public`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.status === 410 || res.status === 404) {
      return { expired: true };
    }

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function CompareBiomarkersPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const viewData = await getMixView(id);

  if (!viewData) return notFound();

  if (viewData.expired) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Snapshot Unavailable</h1>
        <p style={{ color: 'var(--text-secondary)' }}>This Health Snapshot has expired.</p>
        <Link href="/"><button className="download-btn" style={{ marginTop: '2rem' }}>Return to Home</button></Link>
      </div>
    );
  }

  return <CompareScreen viewData={viewData} snapshotId={id} />;
}
