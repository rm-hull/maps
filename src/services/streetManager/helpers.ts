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

export function getStartDate(event: Event): [Date | undefined, string] {
  if (event.actual_start_date_time) return [event.actual_start_date_time, "actual"];
  if (event.start_time) return [event.start_time, "actual"];
  if (event.start_date) return [event.start_date, "actual"];
  if (event.proposed_start_time) return [event.proposed_start_time, "proposed"];
  if (event.proposed_start_date) return [event.proposed_start_date, "proposed"];
  return [undefined, "unknown"];
}

export function getEndDate(event: Event): [Date | undefined, string] {
  if (event.actual_end_date_time) return [event.actual_end_date_time, "actual"];
  if (event.end_time) return [event.end_time, "actual"];
  if (event.end_date) return [event.end_date, "actual"];
  if (event.proposed_end_time) return [event.proposed_end_time, "proposed"];
  if (event.proposed_end_date) return [event.proposed_end_date, "proposed"];
  return [undefined, "unknown"];
}

export function groupEventsByObjectRef(events: Event[]): Record<string, Event[]> {
  return events.reduce(
    (acc, event) => {
      const ref =
        event.work_reference_number ??
        event.permit_reference_number ??
        event.activity_reference_number ??
        event.section_58_reference_number;
      if (ref) {
        if (!(ref in acc)) {
          acc[ref] = [];
        }
        acc[ref].push(event);
      }
      return acc;
    },
    {} as Record<string, Event[]>
  );
}
