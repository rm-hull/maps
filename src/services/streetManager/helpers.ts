import { Event } from "./types";

export function getObjectRef(event: Event): string | undefined {
  return (
    event.permit_reference_number ??
    event.work_reference_number ??
    event.activity_reference_number ??
    event.section_58_reference_number
  );
}

export function getCoordinates(event: Event): string | undefined {
  return event.works_location_coordinates ?? event.activity_coordinates ?? event.section_58_coordinates;
}

export function getStartDate(event: Event) {
  return (
    event.actual_start_date_time ??
    event.start_time ??
    event.start_date ??
    event.proposed_start_time ??
    event.proposed_start_date
  );
}

export function getEndDate(event: Event) {
  return (
    event.actual_end_date_time ?? event.end_time ?? event.end_date ?? event.proposed_end_time ?? event.proposed_end_date
  );
}
