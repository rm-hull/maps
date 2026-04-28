import { LatLngBounds } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { busStopWithBearing, trainStation } from "@/icons";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useNaPTAN } from "../../../../hooks/useNaPTAN";
import { Box, Card, HStack, Text, VStack } from "@chakra-ui/react";
import TimeAgo from "react-time-ago";

interface NextDeparturesLayerProps {
  bounds: LatLngBounds;
}

export function NextDeparturesLayer({ bounds }: NextDeparturesLayerProps) {
  const { data, error } = useCachedQuery(useNaPTAN(bounds));
  useErrorToast("next-departures-error", "Error loading next-departures", error);
  const results = data?.results ?? [];

  return results.map((naptan) => (
    <Marker
      key={naptan.atco_code}
      position={[naptan.latitude, naptan.longitude]}
      icon={naptan.stop_type === 'RLY' ? trainStation : busStopWithBearing(naptan.bearing)}
    >
      <Popup maxWidth={500} closeButton={false}>
        <Card.Root overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
          <Card.Header p={1} pb={0} textTransform="uppercase">
            <HStack gap={2} mb={1}>
              <VStack gap={0} alignItems="flex-start">
                <Text textTransform="capitalize" fontSize="sm" color="gray.500">{[naptan.common_name, naptan.locality_name, naptan.parent_locality_name].filter(Boolean).join(", ").toLowerCase()}</Text>
                <Text fontSize="xs">{naptan.indicator}</Text>
              </VStack>
            </HStack>
          </Card.Header>
          <Card.Body p={1} pt={0}>
            <VStack gap={2} alignItems="stretch">
              {/* {data.departures.map((departure) => (
                <Box key={departure.id} p={2} borderWidth={1} borderRadius="md">
                  <HStack justifyContent="space-between">
                    <Text fontWeight="bold">{departure.line_name}</Text>
                    <Text fontSize="sm" color="gray.500">{departure.destination_name}</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">{departure.expected_departure_time}</Text>
                </Box>
              ))} */}
              <Box>Last updated: <TimeAgo locale="en-US" timeStyle="round" date={naptan.modification_date_time} /></Box>

              <Box>Stop type: {naptan.stop_type}</Box>

              <Box>Bearing: {naptan.bearing}</Box>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Popup >
    </Marker >
  ))
};
