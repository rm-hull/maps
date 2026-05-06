import { LatLngBounds } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { busStop, trainStation } from "@/icons";
import { BearingIndicator } from "../../BearingIndicator";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useNaPTAN } from "../../../../hooks/useNaPTAN";
import { Badge, Box, Card, Heading, HStack, Table, Text, VStack } from "@chakra-ui/react";
import TimeAgo from "react-time-ago";
import { useNextDepartures } from "@/hooks/useNextDestination";
import { getBadgeStyles } from "@/utils/colors";
import { LivePulse } from "../../LivePulse";

interface NextDeparturesLayerProps {
  bounds: LatLngBounds;
}

export function NextDeparturesLayer({ bounds }: NextDeparturesLayerProps) {
  const { data, error } = useCachedQuery(useNaPTAN(bounds));
  useErrorToast("next-departures-error", "Error loading next-departures", error);
  const results = data?.results ?? [];

  return results
    .filter((naptan) => naptan.status === "active")
    .map((naptan) => (
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
                    <Heading textTransform="capitalize" fontSize="sm" title={naptan.atco_code}>
                      {naptan.common_name} {naptan.indicator && `(${naptan.indicator})`}
                    </Heading>
                    <Text fontSize="xs" color="fg.subtle">
                      {[naptan.street, naptan.town].filter(Boolean).join(", ").toLowerCase()}
                    </Text>
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
  const { data, error, isLoading } = useCachedQuery(useNextDepartures(atcoCode));
  useErrorToast("next-departures-error", "Error loading next-departures", error);
  const results = data?.results ?? [];
  if (isLoading) {
    return <Box>Loading...</Box>;
  }
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
            <Table.ColumnHeader p={0} textAlign="end" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {results.map((departure, i) => (
            <Table.Row key={i}>
              <Table.Cell px={1} py={0.5}>
                <Badge size="xs" fontWeight="bold" {...getBadgeStyles(departure.line_name)}>
                  {departure.line_name}
                </Badge>
              </Table.Cell>
              <Table.Cell px={1} py={0.5} fontSize="xs">
                {departure.destination}
              </Table.Cell>
              <Table.Cell px={1} py={0.5} fontSize="xs" textAlign="center">
                {(departure.expected_arrival_time ?? departure.aimed_arrival_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Table.Cell>
              <Table.Cell py={0.5} textAlign="end" fontSize="xs">
                <TimeAgo date={departure.expected_arrival_time ?? departure.aimed_arrival_time} locale="en-US" />
              </Table.Cell>
              <Table.Cell p={0} textAlign="end">
                {departure.expected_arrival_time && <LivePulse />}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}
