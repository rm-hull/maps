import { LatLngBounds } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { gasStation } from "@/icons";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useFuelPrices } from "../../../../hooks/useFuelPrices";
import { Badge, Box, Card, Heading, HStack, Image, Link, Table, Text, VStack } from "@chakra-ui/react";
import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import TimeAgo from "react-time-ago";
import { PetrolFillingStation, PriceInfo } from "@/services/fuelPrices/types";

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

interface PricesTableProps {
  prices?: Record<string, PriceInfo[]>
}

function PricesTable({ prices }: PricesTableProps) {
  if (!prices) return null;
  return (
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
        {Object.entries(prices)?.map(([fuelType, priceHistory]) => (
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
  )
}

interface AmenitiesListProps {
  pfs: PetrolFillingStation;
}

function AmenitiesList({ pfs }: AmenitiesListProps) {
  return (
    <Box gap={1}>
      {pfs.amenities.map((chip) => (
        <Badge m={0.5} size="xs" key={chip} colorPalette="blue" fontWeight="bold">
          {chip.replaceAll("_", " ").toUpperCase()}
        </Badge>
      ))}
      {pfs.is_motorway_service_station && (
        <Badge m={0.5} size="xs" colorPalette="orange" fontWeight="bold">
          MOTORWAY
        </Badge>
      )}
      {pfs.is_supermarket_service_station && (
        <Badge m={0.5} size="xs" colorPalette="green" fontWeight="bold">
          SUPERMARKET
        </Badge>
      )}
      {pfs.temporary_closure && (
        <Badge m={0.5} size="xs" colorPalette="red" fontWeight="bold">
          TEMPORARILY CLOSED
        </Badge>
      )}
      {pfs.permanent_closure && (
        <Badge m={0.5} size="xs" colorPalette="red" fontWeight="bold">
          PERMANENTLY CLOSED
        </Badge>
      )}
    </Box>
  )
}

export function FuelPricesLayer({ bounds }: FuelPricesLayerProps) {
  const { data, error } = useCachedQuery(useFuelPrices(bounds));
  useErrorToast("fuel-prices-error", "Error loading fuel prices", error);

  return (data?.results ?? []).map((pfs) => (
    <Marker key={pfs.node_id} position={[pfs.location.latitude, pfs.location.longitude]} icon={gasStation}>
      <Popup maxWidth={500} closeButton={false}>
        <Card.Root overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
          <Card.Header p={1} pb={0} textTransform="uppercase">
            <HStack gap={2} mb={1}>
              {pfs.retailer?.logo_url && <Image src={pfs.retailer?.logo_url} maxWidth={12} borderRadius={5} />}
              <VStack gap={0} alignItems="flex-start">
                <Heading size="sm" lineClamp={1}>
                  {pfs.retailer?.website_url ? (
                    <Link
                      className="fuelPricesLink"
                      href={pfs.retailer.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pfs.brand_name || pfs.trading_name}
                    </Link>
                  ) : (
                    pfs.brand_name || pfs.trading_name
                  )}
                </Heading>
                <Text fontSize="xs" lineClamp={3} color="gray.600" textTransform="capitalize">
                  {[
                    pfs.location.address_line_1.toLowerCase(),
                    pfs.location.address_line_2?.toLowerCase(),
                    pfs.location.city.toLowerCase(),
                    pfs.location.postcode.replace(" ", "\u00A0"),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </VStack>
            </HStack>
          </Card.Header>
          <Card.Body p={1} pt={0}>
            <AmenitiesList pfs={pfs} />
            <PricesTable prices={pfs.fuel_prices} />
          </Card.Body>
        </Card.Root>
      </Popup>
    </Marker>
  ));
}
