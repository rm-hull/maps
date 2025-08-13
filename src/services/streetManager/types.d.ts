import { wktToGeoJSON } from "@terraformer/wkt";
import type { GeoJSON, Geometry, Feature, FeatureCollection, Position } from "geojson";
import { toLatLng } from "../osdatahub/helpers";

export type Event = {
  event_type: string;

  // Core location and authority info
  usrn?: string;
  street_name?: string;
  area_name?: string;
  town?: string;
  highway_authority?: string;
  highway_authority_swa_code?: string;

  // Activity / work / permit references
  activity_reference_number?: string;
  work_reference_number?: string;
  section_58_reference_number?: string;
  permit_reference_number?: string;
  promoter_swa_code?: string;
  promoter_organisation?: string;

  // Coordinates & descriptions
  activity_coordinates?: string;
  activity_location_type?: string;
  activity_location_description?: string;
  works_location_coordinates?: string;
  works_location_type?: string;
  section_58_coordinates?: string;
  section_58_location_type?: string;

  // Categories & types
  work_category?: string;
  work_category_ref?: string;
  work_status?: string;
  work_status_ref?: string;
  traffic_management_type?: string;
  traffic_management_type_ref?: string;
  current_traffic_management_type?: string;
  current_traffic_management_type_ref?: string;
  road_category?: string;
  activity_type?: string;
  activity_type_details?: string;
  section_58_status?: string;
  section_58_duration?: string;
  section_58_extent?: string;

  // Dates/times (ISO8601 strings in JSON)
  proposed_start_date?: string;
  proposed_end_date?: string;
  proposed_start_time?: string;
  proposed_end_time?: string;
  actual_start_date_time?: string;
  actual_end_date_time?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  current_traffic_management_update_date?: string;

  // Flags / booleans stored as text
  is_ttro_required?: string;
  is_covid_19_response?: string;
  is_traffic_sensitive?: string;
  is_deemed?: string;
  collaborative_working?: string;
  cancelled?: string;
  traffic_management_required?: string;

  // Misc attributes
  permit_conditions?: string;
  permit_status?: string;
  collaboration_type?: string;
  collaboration_type_ref?: string;
  close_footway?: string;
  close_footway_ref?: string;
};

export type SearchResponse = {
  results: Event[];
  attribution: string[];
};

export function getObjectRef(event: Event): string {
  return (
    event.permit_reference_number ??
    event.work_reference_number ??
    event.activity_reference_number ??
    event.section_58_reference_number
  );
}

export function getGeoJSON(event: Event): GeoJSON {
  const raw = wktToGeoJSON(
    event.works_location_coordinates ?? event.activity_coordinates ?? event.section_58_coordinates
  );
  const wrapped = {
    type: "Feature",
    geometry: raw,
    properties: {},
  } as const;
  const newShape = transformToWGS84(wrapped);
  console.log({ newShape });
  return newShape;
}

function transformCoords(coords: any): any {
  if (typeof coords[0] === "number") {
    // It's a single [x, y] pair in BNG
    return toLatLng(coords as [number, number]).reverse();
  }
  // It's an array of coordinates or arrays of arrays, recurse
  return coords.map(transformCoords);
}

function transformGeometry(geometry: Geometry): Geometry {
  return {
    ...geometry,
    coordinates: transformCoords(geometry.coordinates),
  };
}

function transformToWGS84<T extends GeoJSON>(geojson: T): T {
  if (geojson.type === "Feature") {
    return {
      ...geojson,
      geometry: transformGeometry(geojson.geometry),
    } as T;
  }

  if (geojson.type === "FeatureCollection") {
    return {
      ...geojson,
      features: geojson.features.map((f) => ({
        ...f,
        geometry: transformGeometry(f.geometry),
      })),
    } as T;
  }

  if ("coordinates" in geojson) {
    // It's a raw Geometry object
    return transformGeometry(geojson as Geometry) as T;
  }

  throw new Error("Unsupported GeoJSON type");
}
