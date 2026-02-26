import { LatLngBounds } from "leaflet";
import { Marker } from "react-leaflet";
import { gasStation, gasStationWithRing } from "@/icons";
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
  const results = data?.results ?? [];
  const cheapestDieselIds = data?.statistics.cheapest_stations?.["B7_STANDARD"] ?? [];
  const cheapestPetrolIds = data?.statistics.cheapest_stations?.["E10"] ?? [];

  return results.map((pfs) => {
    const colors: string[] = [];
    if (cheapestDieselIds.includes(pfs.node_id)) colors.push("black");
    if (cheapestPetrolIds.includes(pfs.node_id)) colors.push("green");

    const icon = colors.length ? gasStationWithRing(colors) : gasStation;

    return (
      <Marker key={pfs.node_id} position={[pfs.location.latitude, pfs.location.longitude]} icon={icon}>
        <PetrolFillingStationPopup data={pfs} stats={data?.statistics} />
      </Marker>
    );
  });
}
