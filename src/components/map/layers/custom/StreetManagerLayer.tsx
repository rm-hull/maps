import { Heading, VStack, Link, Image, Table, Tabs, Text, Badge } from "@chakra-ui/react";
import { LatLngBounds, PathOptions } from "leaflet";
import { Popup } from "react-leaflet";
import { formatDate } from "@/utils/dates";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useStreetManager } from "../../../../hooks/useStreetManager";
import {
  getCoordinates,
  getStartDate,
  getEndDate,
  groupEventsByObjectRef,
  getObjectRef,
} from "../../../../services/streetManager/helpers";
import { Event } from "../../../../services/streetManager/types";
import WktLayer from "../../WktShape";

const dateStatus: Record<string, "green" | "blue" | "gray"> = {
  actual: "green",
  proposed: "blue",
  unknown: "gray",
};

function workCategoryStatus(status?: string) {
  const lowerStatus = status?.toLowerCase();
  if (lowerStatus === "minor") return "green";
  if (lowerStatus === "standard") return "yellow";
  if (lowerStatus?.startsWith("major")) return "orange";
  if (lowerStatus?.startsWith("immediate")) return "red";
  return "gray";
}

type EventDetailProps = {
  event: Event;
};

function EventDetail({ event }: EventDetailProps) {
  const [startDate, startType] = getStartDate(event);
  const [endDate, endType] = getEndDate(event);
  return (
    <VStack p={2} gap={2} alignItems="start" justifyContent="space-between">
      {event.promoter_website_url && (
        <Heading size="md" gap={1} display="flex" alignItems="center" width={300}>
          {event.promoter_logo_url && <Image src={event.promoter_logo_url} height={5} />}
          <Link href={event.promoter_website_url} target="_blank" rel="noreferrer" outlineOffset={0}>
            <Text truncate maxWidth={300}>
              {event.promoter_organisation}
            </Text>
          </Link>
        </Heading>
      )}

      <Table.Root>
        <Table.Body>
          <Table.Row>
            <Table.ColumnHeader>Work Ref</Table.ColumnHeader>
            <Table.Cell>{getObjectRef(event)}</Table.Cell>
          </Table.Row>
          {event.activity_type && (
            <Table.Row>
              <Table.ColumnHeader>Activity Type</Table.ColumnHeader>
              <Table.Cell>{event.activity_type}</Table.Cell>
            </Table.Row>
          )}
          {event.works_location_type && (
            <Table.Row>
              <Table.ColumnHeader>Location</Table.ColumnHeader>
              <Table.Cell>{event.works_location_type}</Table.Cell>
            </Table.Row>
          )}
          {event.work_status && (
            <Table.Row>
              <Table.ColumnHeader>Work Status</Table.ColumnHeader>
              <Table.Cell>
                {event.work_status}{" "}
                <Badge colorPalette={workCategoryStatus(event.work_category)}>
                  {event.work_category?.toLowerCase() ?? "unknown"}
                </Badge>
              </Table.Cell>
            </Table.Row>
          )}
          <Table.Row>
            <Table.ColumnHeader>Start Date</Table.ColumnHeader>
            <Table.Cell>
              {formatDate(startDate)} <Badge colorPalette={dateStatus[startType]}>{startType}</Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.ColumnHeader>End Date</Table.ColumnHeader>
            <Table.Cell>
              {formatDate(endDate)} <Badge colorPalette={dateStatus[endType]}>{endType}</Badge>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}

type EventTabsProps = {
  events: Event[];
};

function EventTabs({ events }: EventTabsProps) {
  return (
    <Tabs.Root defaultValue="0">
      <Tabs.List>
        {events.map((event, index) => (
          <Tabs.Trigger key={index} value={index.toString()}>
            {getObjectRef(event) ?? `Event ${index + 1}`}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {events.map((event, index) => (
        <Tabs.Content value={index.toString()} key={index}>
          <EventDetail event={event} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

interface StreetManagerLayerProps {
  bounds: LatLngBounds;
}

const defaultStyle: PathOptions = {
  color: "#FF000077",
  weight: 4,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
  lineJoin: "round",
  lineCap: "round",
};

export function StreetManagerLayer({ bounds }: StreetManagerLayerProps) {
  const { data, error } = useCachedQuery(useStreetManager(bounds));
  useErrorToast("street-manager-error", "Error loading street-manager events", error);

  return Object.entries(groupEventsByObjectRef(data?.results ?? [])).map(([ref, events]) => (
    <WktLayer key={ref} wkt={getCoordinates(events[0])} pathOptions={defaultStyle}>
      <Popup maxWidth={500} closeButton={false}>
        {events.length === 1 ? <EventDetail event={events[0]} /> : <EventTabs events={events} />}
      </Popup>
    </WktLayer>
  ));
}
