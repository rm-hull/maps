import { LatLngBounds } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { greenMarker } from "@/icons";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useFuelPrices } from "../../../../hooks/useFuelPrices";

interface FuelPricesLayerProps {
  bounds: LatLngBounds;
}

export function FuelPricesLayer({ bounds }: FuelPricesLayerProps) {
  const { data, error } = useCachedQuery(useFuelPrices(bounds));
  useErrorToast("fuel-prices-error", "Error loading fuel prices", error);

  return (data?.results ?? []).map((pfs) => (
    <Marker
      key={pfs.node_id}
      position={[parseFloat(pfs.location.latitude), parseFloat(pfs.location.longitude)]}
      icon={greenMarker}
    >
      <Popup maxWidth={1800} closeButton={false}>
        <pre>
          <code>{JSON.stringify(pfs.fuel_prices, null, 2)}</code>
        </pre>
      </Popup>
    </Marker>
  ));
}
