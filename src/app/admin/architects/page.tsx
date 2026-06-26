import { Suspense } from 'react';
import { ArchitectsAdminClient } from '@/components/admin/ArchitectsAdminClient';

export default function ArchitectsAdminPage() {
  return (
    <Suspense>
      <ArchitectsAdminClient />
    </Suspense>
  );
}
