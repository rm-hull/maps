import { type LatLng } from "leaflet";
import { OSMap } from "../components/map/OSMap";

interface HomeProps {
  latLng?: LatLng;
}

export function Home({ latLng }: HomeProps) {
  return <OSMap center={latLng} />;
}
