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
  promoter_website_url?: string;
  promoter_logo_url?: string;

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
  proposed_start_date?: Date;
  proposed_end_date?: Date;
  proposed_start_time?: Date;
  proposed_end_time?: Date;
  actual_start_date_time?: Date;
  actual_end_date_time?: Date;
  start_date?: Date;
  start_time?: Date;
  end_date?: Date;
  end_time?: Date;
  current_traffic_management_update_date?: Date;

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
