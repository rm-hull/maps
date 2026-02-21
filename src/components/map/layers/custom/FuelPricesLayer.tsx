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

  // find cheapest diesel (B7_STANDARD) and cheapest petrol (E10)
  let cheapestDieselIds: string[] = [];
  let cheapestDieselPrice = Infinity;
  let cheapestPetrolIds: string[] = [];
  let cheapestPetrolPrice = Infinity;

  for (const pfs of results) {
    const dieselPrice = pfs.fuel_prices?.["B7_STANDARD"]?.[0]?.price;
    if (typeof dieselPrice === "number") {
      if (dieselPrice < cheapestDieselPrice) {
        cheapestDieselPrice = dieselPrice;
        cheapestDieselIds = [pfs.node_id];
      } else if (dieselPrice === cheapestDieselPrice) {
        cheapestDieselIds.push(pfs.node_id);
      }
    }

    const petrolPrice = pfs.fuel_prices?.["E10"]?.[0]?.price;
    if (typeof petrolPrice === "number") {
      if (petrolPrice < cheapestPetrolPrice) {
        cheapestPetrolPrice = petrolPrice;
        cheapestPetrolIds = [pfs.node_id];
      } else if (petrolPrice === cheapestPetrolPrice) {
        cheapestPetrolIds.push(pfs.node_id);
      }
    }
  }

  return results.map((pfs) => {
    const colors: string[] = [];
    if (cheapestDieselIds.includes(pfs.node_id)) colors.push("black");
    if (cheapestPetrolIds.includes(pfs.node_id)) colors.push("green");

    const icon = colors.length ? gasStationWithRing(colors) : gasStation;

    return (
      <Marker key={pfs.node_id} position={[pfs.location.latitude, pfs.location.longitude]} icon={icon}>
        <PetrolFillingStationPopup data={pfs} />
      </Marker>
    );
  });
}
