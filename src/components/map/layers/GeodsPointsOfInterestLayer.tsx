import * as L from "leaflet";
import { LayerGroup, Marker, useMap, useMapEvents } from "react-leaflet";
import { type LatLngBounds } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import ResultPopup from "../ResultPopup";
import { useCachedQuery } from "../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { useGeneralSettings } from "../../../hooks/useGeneralSettings";
import { useGeodsPOI } from "../../../hooks/useGeodsPOI";
import { useState } from "react";
import { Result } from "../../../services/geods/types";
import { Link as ReactRouterLink } from "react-router-dom";
import axios from "axios";
import { Fugazi } from "../../FadeInImage";
import { Link, Text } from "@chakra-ui/react";

interface PointsOfInterestProps {
  bounds: LatLngBounds;
}

export interface Photo {
  id: string;
  created_at: string;
  updated_at: string;
  urls: {
    full: string;
    raw: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description?: string;
  blur_hash?: string;
  color?: string;
  description?: string;
  height: number;
  likes: number;
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  promoted_at?: string;
  width: number;
  user: {
    id: string;
    name: string;
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
      portfolio: string;
    };
  };
}

interface Response {
  results: Photo[];
  total: number;
  total_pages: number;
}

async function unsplashImageSearch(result: Result): Promise<Fugazi> {
  const params = new URLSearchParams();
  params.append("query", result.categories?.[0] || "unknown");
  params.append("per_page", "1");
  params.append("orientation", "landscape");
  params.append("order_by", "relevant");
  const resp = await axios.get<Response>(`https://api.unsplash.com/search/photos?${params.toString()}`, {
    headers: {
      Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
    },
  });

  const photo = resp.data.results[0];
  console.log("Unsplash response:", resp.data);
  return {
    src: photo.urls.small,
    alt: photo.alt_description,
    attribution: (
      <Text>
        Photo by{" "}
        <Link as={ReactRouterLink} to={photo.user.links.html} isExternal>
          {photo.user.name}
        </Link>{" "}
        (Unsplash)
      </Text>
    ),
  };
}

function PointsOfInterest({ bounds }: PointsOfInterestProps) {
  const { data, error } = useCachedQuery(useGeodsPOI(bounds));
  useErrorToast("geods-poi-error", "Error loading GeoDS POI", error);

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data?.results?.map((result) => (
        <Marker key={result.id} position={[result.lat, result.long]} icon={categoryIcon(result.categories?.[0])}>
          <ResultPopup
            title={result.primary_name}
            description={[result.address, result.locality, result.postcode]
              .map((field) => field?.trim())
              .filter((field) => !!field)
              .join(", ")}
            chips={result.categories}
            imageUrl={async () => {
              return await unsplashImageSearch(result);
            }}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface GeodsPointsOfInterestLayerProps {
  minZoom: number;
}

export function GeodsPointsOfInterestLayer({ minZoom }: GeodsPointsOfInterestLayerProps) {
  const map = useMap();
  const [settings] = useGeneralSettings();
  const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());
  const [overlayChecked, setOverlayChecked] = useState<Record<string, boolean>>({
    "GeoDS POI": settings?.autoSelect?.geodsPOI ?? false,
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

  return <LayerGroup>{overlayChecked["GeoDS POI"] && <PointsOfInterest bounds={bounds} />}</LayerGroup>;
}

function categoryIcon(category?: string): L.Icon {
  const url = `${import.meta.env.VITE_GEODS_POI_API_URL}v1/geods-poi/marker/${category?.toLowerCase() || "unknown"}`;
  const shadowUrl = `${import.meta.env.VITE_GEODS_POI_API_URL}v1/geods-poi/marker/shadow`;
  return new L.Icon({
    popupAnchor: [1, -34],
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    iconUrl: url,
    iconRetinaUrl: url,
    shadowUrl: shadowUrl,
    shadowSize: [51, 37],
    shadowAnchor: [23, 35],
  });
}
