import { LatLngBounds } from "leaflet";
import { Marker } from "react-leaflet";
import { gasStation } from "@/icons";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useFuelPrices } from "../../../../hooks/useFuelPrices";
import { PetrolFillingStationPopup } from "../../PetrolFillingStationPopup";

interface FuelPricesLayerProps {
  bounds: LatLngBounds;
}

export function FuelPricesLayer({ bounds }: FuelPricesLayerProps) {
  const { data, error } = useCachedQuery(useFuelPrices(bounds));
  useErrorToast("fuel-prices-error", "Error loading fuel prices", error);

  return (data?.results ?? []).map((pfs) => (
    <Marker key={pfs.node_id} position={[pfs.location.latitude, pfs.location.longitude]} icon={gasStation}>
      <PetrolFillingStationPopup data={pfs} />
    </Marker>
  ));
}
