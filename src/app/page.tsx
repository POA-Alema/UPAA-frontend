import { AccessSection } from '@/features/home/components/access-section';
import { IntroSection } from '@/features/home/components/intro-section';
import { MapPreviewSection } from '@/features/home/components/map-preview-section';
import { ArchitectPreview } from '@/features/architects/components/ArchitectPreview';
import { theodorWiederspahnMock } from '@/features/architects/mocks/architect-mock';



export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-stack">
        <IntroSection />
        <MapPreviewSection />
        <AccessSection />
         <ArchitectPreview architect={theodorWiederspahnMock} />

      </div>
    </main>
  );
}
