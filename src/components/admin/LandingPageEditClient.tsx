'use client';

import { useRouter } from 'next/navigation';
import { LandingPageForm } from '@/components/admin/LandingPageForm';
import { updateLandingPageData } from '@/services/landingPage';
import type { LandingPageData } from '@/types/landingPage';

type LandingPageEditClientProps = {
  initialData: LandingPageData;
};

export function LandingPageEditClient({ initialData }: LandingPageEditClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: LandingPageData) => {
    await updateLandingPageData(data);
    await fetch('/api/revalidate/landing-page', { method: 'POST' });
    router.refresh();
  };

  return <LandingPageForm onSubmit={handleSubmit} initialData={initialData} />;
}
