'use client';

import { LandingPageForm } from '@/components/admin/LandingPageForm';
import { updateLandingPageData } from '@/services/landingPage';
import type { LandingPageData } from '@/types/landingPage';

type LandingPageEditClientProps = {
  initialData: LandingPageData;
};

export function LandingPageEditClient({ initialData }: LandingPageEditClientProps) {
  const handleSubmit = async (data: LandingPageData) => {
    await updateLandingPageData(data);
  };

  return <LandingPageForm onSubmit={handleSubmit} initialData={initialData} />;
}
