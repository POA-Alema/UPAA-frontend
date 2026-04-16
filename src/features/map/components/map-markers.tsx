import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import type { MapMarker } from "@/features/map/utils/map-buildings";

const icon = new L.Icon({
  iconUrl: "/map-marker.svg",
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -34],
});

type Props = {
  markers: MapMarker[];
};

export function MapMarkers({ markers }: Props) {
  return (
    <>
      {markers.map((p) => (
        <Marker key={p.id} position={p.position} icon={icon}>
          <Popup>
            <div>
              <strong>{p.name}</strong>
              {p.district ? <p>{p.district}</p> : null}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
