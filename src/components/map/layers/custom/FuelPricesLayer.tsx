import { LatLngBounds } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { gasStation } from "@/icons";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useFuelPrices } from "../../../../hooks/useFuelPrices";
import { Badge, Box, Card, Heading, Table, Text } from "@chakra-ui/react";
import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import TimeAgo from "react-time-ago";

JavascriptTimeAgo.addDefaultLocale(en);

interface FuelPricesLayerProps {
  bounds: LatLngBounds;
}

function getFuelColor(fuelType: string): { colorPalette?: string; variant: "solid" | "subtle" } {
  switch (fuelType) {
    case "B10":
    case "B7_STANDARD":
    case "B7_PREMIUM":
      return { colorPalette: "black", variant: "solid" };
    case "E5":
    case "E10":
      return { colorPalette: "green", variant: "solid" };
    case "HVO":
      return { colorPalette: "red", variant: "subtle" };
    default:
      return { variant: "subtle" };
  }
}

export function FuelPricesLayer({ bounds }: FuelPricesLayerProps) {
  const { data, error } = useCachedQuery(useFuelPrices(bounds));
  useErrorToast("fuel-prices-error", "Error loading fuel prices", error);

  return (data?.results ?? []).map((pfs) => (
    <Marker
      key={pfs.node_id}
      position={[parseFloat(pfs.location.latitude), parseFloat(pfs.location.longitude)]}
      icon={gasStation}
    >
      <Popup maxWidth={500} closeButton={false}>
        <Card.Root overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
          <Card.Header p={1} pb={0} textTransform="uppercase">
            <Heading size="sm" lineClamp={1}>
              {pfs.brand_name}
            </Heading>
          </Card.Header>
          <Card.Body p={1} pt={0}>
            <Text fontSize="xs" lineClamp={3} color="gray.600" textTransform="capitalize">
              {[
                pfs.location.address_line_1.toLowerCase(),
                pfs.location.address_line_2?.toLowerCase(),
                pfs.location.city.toLowerCase(),
                pfs.location.postcode,
              ]
                .filter(Boolean)
                .join(", ")}
            </Text>
            {pfs.amenities && (
              <Box gap={1}>
                {pfs.amenities.map((chip) => (
                  <Badge m={0.5} size="xs" key={chip} colorPalette="blue" fontWeight="bold">
                    {chip.replaceAll("_", " ").toUpperCase()}
                  </Badge>
                ))}
              </Box>
            )}

            {pfs.fuel_prices && (
              <Table.Root size="sm" interactive>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted">
                      FUEL
                    </Table.ColumnHeader>
                    <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted">
                      DATE
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      px={1}
                      py={0.5}
                      fontSize="2xs"
                      fontWeight="medium"
                      color="fg.muted"
                      textAlign="end"
                    >
                      PRICE
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {Object.entries(pfs.fuel_prices)?.map(([fuelType, priceHistory]) => (
                    <Table.Row key={fuelType}>
                      <Table.Cell px={1} py={0.5}>
                        <Badge size="xs" {...getFuelColor(fuelType)}>
                          {fuelType.replaceAll("_", " ").toUpperCase()}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell px={1} py={0.5} cursor="pointer" fontSize="xs" whiteSpace="nowrap">
                        <TimeAgo date={priceHistory[0].updated_on} locale="en-US" />
                      </Table.Cell>
                      <Table.Cell px={1} py={0.5} textAlign="end" fontWeight="bold">
                        {priceHistory[0].price}p
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Card.Body>
        </Card.Root>
      </Popup>
    </Marker>
  ));
}
