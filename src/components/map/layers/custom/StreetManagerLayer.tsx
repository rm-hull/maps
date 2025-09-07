import { Heading, Text, List, Box, VStack } from "@chakra-ui/react";
import { PathOptions, type LatLngBounds } from "leaflet";
import { Popup } from "react-leaflet";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useStreetManager } from "../../../../hooks/useStreetManager";
import {
  getCoordinates,
  getObjectRef,
  getStartDate,
  getEndDate,
  groupEventsByObjectRef,
} from "../../../../services/streetManager/helpers";
import { Event } from "../../../../services/streetManager/types";
import WktLayer from "../../WktShape";

type EventsPopupProps = {
  events: Event[];
};

function EventsPopup({ events }: EventsPopupProps) {
  return (
    <Popup maxWidth={400} closeButton={false}>
      <List.Root gap={1} width={400} maxHeight={300} overflowY="auto">
        {events.map((event) => {
          const ref = getObjectRef(event);
          return (
            <List.Item key={ref} p={2} borderBottom="1px solid" borderColor="gray.200">
              <VStack gap={2} alignItems="start" justifyContent="space-between">
                <Heading size="sm" truncate>
                  {ref}
                </Heading>
                <Box p={1} pt={0} color="gray.600" fontSize="sm">
                  <Text>{event.promoter_organisation}</Text> <Text>{event.activity_type}</Text>
                  <Text>
                    {event.works_location_type} ({event.work_category})
                  </Text>
                  <Text>{event.work_status}</Text>
                  <Text>Start: {getStartDate(event)}</Text>
                  <Text>End: {getEndDate(event)}</Text>
                </Box>
              </VStack>
            </List.Item>
          );
        })}
      </List.Root>
    </Popup>
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

  return Object.entries(groupEventsByObjectRef(data?.results ?? [])).map(([ref, results]) => (
    <WktLayer key={ref} wkt={getCoordinates(results[0])} pathOptions={defaultStyle}>
      <EventsPopup events={results} />
    </WktLayer>
  ));
}
