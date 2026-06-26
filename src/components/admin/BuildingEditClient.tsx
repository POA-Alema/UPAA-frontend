'use client';

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
  const handleSubmit = async (data: BuildingFormData) => {
    await updateBuilding(id, data);
  };

  return <BuildingForm onSubmit={handleSubmit} initialData={building} architects={architects} />;
}
