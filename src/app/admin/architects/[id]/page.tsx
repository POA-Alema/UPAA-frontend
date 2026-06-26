import { ArchitectDetailClient } from '@/components/admin/ArchitectDetailClient';

type ArchitectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArchitectDetailPage({ params }: ArchitectDetailPageProps) {
  const { id } = await params;

  return <ArchitectDetailClient id={id} />;
}
