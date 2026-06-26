import { AdminUserEditClient } from '@/components/admin/AdminUserEditClient';

type AdminUserEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  const { id } = await params;

  return <AdminUserEditClient id={id} />;
}
