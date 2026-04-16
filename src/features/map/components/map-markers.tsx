import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import type { MapMarker } from "@/features/map/utils/map-buildings";

const icon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  markers: MapMarker[];
};

export function MapMarkers({ markers }: Props) {
  return (
    <>
      {markers.map((p) => (
        <Marker key={p.id} position={p.position} icon={icon}>
          <Popup>{p.name}</Popup>
        </Marker>
      ))}
    </>
  );
}
