import { useGeolocated } from "react-geolocated";
import { MapContainer, TileLayer } from "react-leaflet";

export default function Home(): JSX.Element {
  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  return (
    <MapContainer
      center={[coords?.latitude ?? 51.505, coords?.longitude ?? -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
