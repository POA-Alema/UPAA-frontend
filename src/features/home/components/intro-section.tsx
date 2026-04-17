import { FeatureAction } from "@/components/ui/feature-action";

export function IntroSection() {
  return (
      <div className="home-intro__lead">
        <p className="home-intro__description">
          Explore no mapa as obras que transformaram Porto Alegre e descubra
          como esse legado ainda marca a paisagem da cidade.
        </p>
        <FeatureAction
          href="/mapa"
          icon="map"
          label="Explorar Mapa"
          variant="primary"
        />
      </div>
  );
}
