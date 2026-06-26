import { ArchitectEditClient } from '@/components/admin/ArchitectEditClient';

type EditArchitectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArchitectPage({ params }: EditArchitectPageProps) {
  const { id } = await params;

  return <ArchitectEditClient id={id} />;
}
