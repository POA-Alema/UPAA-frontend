'use client';

import { useRouter } from 'next/navigation';
import { BuildingForm } from '@/components/admin/BuildingForm';
import { updateBuilding } from '@/services/buildings';
import type { ArchitectOption } from '@/services/architects';
import type { Building, BuildingFormData } from '@/types/building';

type BuildingEditClientProps = {
  id: string;
  building: Building;
  architects: ArchitectOption[];
};

export function BuildingEditClient({ id, building, architects }: BuildingEditClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: BuildingFormData) => {
    await updateBuilding(id, data);
    router.push('/admin/buildings?status=updated');
    router.refresh();
  };

  return <BuildingForm onSubmit={handleSubmit} initialData={building} architects={architects} />;
}
