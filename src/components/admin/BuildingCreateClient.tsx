'use client';

import { useRouter } from 'next/navigation';
import { BuildingForm } from '@/components/admin/BuildingForm';
import { createBuilding } from '@/services/buildings';
import type { ArchitectOption } from '@/services/architects';
import type { BuildingFormData } from '@/types/building';

type BuildingCreateClientProps = {
  architects: ArchitectOption[];
};

export function BuildingCreateClient({ architects }: BuildingCreateClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: BuildingFormData) => {
    await createBuilding(data);
    router.push('/admin/buildings?status=created');
    router.refresh();
  };

  return <BuildingForm onSubmit={handleSubmit} architects={architects} />;
}
