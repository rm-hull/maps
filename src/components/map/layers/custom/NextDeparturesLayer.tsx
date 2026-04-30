import { LatLngBounds } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { busStop, trainStation } from "@/icons";
import { BearingIndicator } from "../../BearingIndicator";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useNaPTAN } from "../../../../hooks/useNaPTAN";
import { Badge, Box, Card, HStack, Table, Text, VStack } from "@chakra-ui/react";
import TimeAgo from "react-time-ago";
import { useNextDepartures } from "@/hooks/useNextDestination";

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
      icon={naptan.stop_type === "RLY" ? trainStation : busStop}
    >
      <BearingIndicator direction={naptan.bearing}>
        <Popup maxWidth={500} closeButton={false}>
          <Card.Root overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
            <Card.Header p={1} pb={0} textTransform="uppercase">
              <HStack gap={2} mb={1}>
                <VStack gap={0} alignItems="flex-start">
                  <Text textTransform="capitalize" fontSize="sm" color="gray.500">
                    {[naptan.common_name, naptan.locality_name, naptan.parent_locality_name]
                      .filter(Boolean)
                      .join(", ")
                      .toLowerCase()}
                  </Text>
                  <Text fontSize="xs">{naptan.indicator}</Text>
                </VStack>
              </HStack>
            </Card.Header>
            <Card.Body p={1} pt={0}>
              <VStack gap={2} alignItems="stretch">
                <NextDeparturesList atcoCode={naptan.atco_code} />
              </VStack>
            </Card.Body>
          </Card.Root>
        </Popup>
      </BearingIndicator>
    </Marker>
  ));
}

type NextDeparturesListProps = {
  atcoCode: string;
};

function NextDeparturesList({ atcoCode }: NextDeparturesListProps) {
  const { data, error } = useCachedQuery(useNextDepartures(atcoCode));
  useErrorToast("next-departures-error", "Error loading next-departures", error);
  const results = data?.results ?? [];
  if (results.length === 0) {
    return <Box>No departures found</Box>;
  }
  return (
    <VStack gap={2} alignItems="stretch">
      <Table.Root size="sm" interactive my={1}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted">
              Line
            </Table.ColumnHeader>
            <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted">
              Towards
            </Table.ColumnHeader>
            <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted" textAlign="center">
              Scheduled
            </Table.ColumnHeader>
            <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted" textAlign="end">
              Expected
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {results.map((departure, i) => (
            <Table.Row key={i}>
              <Table.Cell px={1} py={0.5}>
                <Badge size="xs"> {departure.line_name}</Badge>
              </Table.Cell>
              <Table.Cell px={1} py={0.5} fontSize="xs">
                {departure.destination}
              </Table.Cell>
              <Table.Cell px={1} py={0.5} fontSize="xs" textAlign="center">
                {(departure.expected_departure_time ?? departure.aimed_departure_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Table.Cell>
              <Table.Cell px={1} py={0.5} textAlign="end" fontSize="xs">
                <TimeAgo date={(departure.expected_departure_time ?? departure.aimed_departure_time)} locale="en-US" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}
