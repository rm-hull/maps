import { LayerGroup, Marker, useMap, useMapEvents } from "react-leaflet";
import { type LatLngBounds } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import ResultPopup from "./ResultPopup";
import { toLatLng } from "../../services/osdatahub/helpers";
import { useCachedQuery } from "../../hooks/useCachedQuery";
import { useCompanyData } from "../../hooks/useCompanyData";
import { useErrorToast } from "../../hooks/useErrorToast";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";
import { useState } from "react";

interface CompaniesProps {
  bounds: LatLngBounds;
}

function Companies({ bounds }: CompaniesProps) {
  const { data, error } = useCachedQuery(useCompanyData(bounds));
  useErrorToast("company-data-error", "Error loading Company data", error);

  return (
    <>
      {/* <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds> */}
      {Object.entries(data?.results ?? {}).map(([key, results]) => (
        <Marker key={key} position={toLatLng([results[0].easting, results[0].northing])}>
          <ResultPopup
            title={results[0].company_name}
            description={[
              results[0].reg_address_care_of,
              results[0].reg_address_po_box,
              results[0].reg_address_address_line_1,
              results[0].reg_address_address_line_2,
              results[0].reg_address_post_town,
              results[0].reg_address_county,
              results[0].reg_address_country,
            ]
              .map((field) => field?.trim())
              .filter((field) => !!field)
              .join(", ")}
            chips={[
              results[0].company_category,
              results[0].company_status,
              results[0].accounts_account_category,
            ].filter((value) => !!value)}
          />
        </Marker>
      ))}
      {/* </MarkerClusterGroup> */}
    </>
  );
}

interface CompanyDataLayerProps {
  minZoom: number;
}

export function CompanyDataLayer({ minZoom }: CompanyDataLayerProps) {
  const map = useMap();
  const [settings] = useGeneralSettings();
  const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());
  const [overlayChecked, setOverlayChecked] = useState<Record<string, boolean>>({
    "Company Data": settings?.autoSelect?.companyData ?? false,
  });

  const handleOverlayChange = (layer: string, checked: boolean) => {
    setOverlayChecked((prevState) => ({
      ...prevState,
      [layer]: checked,
    }));
  };

  useMapEvents({
    moveend() {
      setBounds(map.getBounds());
    },
    zoomend() {
      setBounds(map.getBounds());
    },
    overlayadd(event) {
      handleOverlayChange(event.name, true);
    },
    overlayremove(event) {
      handleOverlayChange(event.name, false);
    },
  });

  if (map.getZoom() < minZoom) {
    return null;
  }

  return <LayerGroup>{overlayChecked["Company Data"] && <Companies bounds={bounds} />}</LayerGroup>;
}

// function categoryIcon(category?: string): L.Icon {
//   const url = `${import.meta.env.VITE_GEODS_POI_API_URL}v1/geods-poi/marker/${category?.toLowerCase() || "unknown"}`;
//   const shadowUrl = `${import.meta.env.VITE_GEODS_POI_API_URL}v1/geods-poi/marker/shadow`;
//   return new L.Icon({
//     popupAnchor: [1, -34],
//     iconSize: [32, 37],
//     iconAnchor: [16, 37],
//     iconUrl: url,
//     iconRetinaUrl: url,
//     shadowUrl: shadowUrl,
//     shadowSize: [51, 37],
//     shadowAnchor: [23, 35],
//   });
// }
