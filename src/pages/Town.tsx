import { LatLngTuple } from "leaflet";
import { useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import OSMap from "../components/OSMap";
import latLng from "../lat-long.json";

export default function Town() {
  const data: Record<string, number[]> = latLng;
  const { town } = useParams<{ town: string }>();

  const key = town?.toLowerCase() ?? "";
  const coords = data[key] as LatLngTuple | undefined;
  if (!coords) {
    return <NotFound town={key} />;
  }
  return <OSMap center={coords} />;
}
