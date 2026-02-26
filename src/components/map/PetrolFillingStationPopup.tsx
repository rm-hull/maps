import { DailyOpeningTimes, OpeningTimes, PriceInfo, SearchResult, Statistics } from "@/services/fuelPrices/types";
import { Badge, Box, Card, Heading, HStack, Image, Link, Table, Text, VStack } from "@chakra-ui/react";
import { Popup } from "react-leaflet";
import TimeAgo from "react-time-ago";
import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { Tooltip } from "../ui/tooltip";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";

JavascriptTimeAgo.addDefaultLocale(en);

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
  prices?: Record<string, PriceInfo[]>;
  stats?: Statistics;
}

function PricesTable({ prices, stats }: PricesTableProps) {
  if (!prices) return null;
  return (
    <Table.Root size="sm" interactive my={1}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted">
            FUEL
          </Table.ColumnHeader>
          <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted">
            LAST UPDATED
          </Table.ColumnHeader>
          <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted" textAlign="end">
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
              <HStack gap={1} justifyContent="flex-end">
                <ZScoreIndicator price={priceHistory[0].price} fuelType={fuelType} stats={stats} />
                {priceHistory[0].price}p
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

interface AmenitiesListProps {
  data: SearchResult;
}

function AmenitiesList({ data }: AmenitiesListProps) {
  return (
    <Box gap={1}>
      {data.amenities &&
        data.amenities.map((chip) => (
          <Badge m={0.5} size="xs" key={chip} colorPalette="blue" fontWeight="bold">
            {chip.replaceAll("_", " ").toUpperCase()}
          </Badge>
        ))}
      {data.is_motorway_service_station && (
        <Badge m={0.5} size="xs" colorPalette="orange" fontWeight="bold">
          MOTORWAY
        </Badge>
      )}
      {data.is_supermarket_service_station && (
        <Badge m={0.5} size="xs" colorPalette="green" fontWeight="bold">
          SUPERMARKET
        </Badge>
      )}
      {data.temporary_closure && (
        <Badge m={0.5} size="xs" colorPalette="red" fontWeight="bold">
          TEMPORARILY CLOSED
        </Badge>
      )}
      {data.permanent_closure && (
        <Badge m={0.5} size="xs" colorPalette="red" fontWeight="bold">
          PERMANENTLY CLOSED
        </Badge>
      )}
    </Box>
  );
}

function formatTime(s?: string) {
  if (!s) return undefined;
  const m = s.match(/^(\d{1,2}:\d{2})/);
  return m ? m[1] : s;
}

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const short = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
} as Record<string, string>;

function keyFor(t?: DailyOpeningTimes) {
  if (!t) return "__CLOSED__";
  if (t.is_24_hours) return "__24__";
  const o = formatTime(t.open) || t.open;
  const c = formatTime(t.close) || t.close;
  return `${o}||${c}`;
}

interface OpeningTimesTableProps {
  openingTimes: OpeningTimes;
}

function OpeningTimesTable({ openingTimes }: OpeningTimesTableProps) {
  const entries = days.map((d) => ({ day: d, times: openingTimes.usual_days[d] }));

  const groups: Array<{
    start: number;
    end: number;
    times?: DailyOpeningTimes;
  }> = [];

  for (let i = 0; i < entries.length; ) {
    const current = entries[i];
    let j = i + 1;
    while (j < entries.length && keyFor(entries[j].times) === keyFor(current.times)) {
      j += 1;
    }

    groups.push({ start: i, end: j - 1, times: current.times });
    i = j;
  }

  return (
    <Table.Root size="sm" my={1} interactive>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted" colSpan={2}>
            OPENING TIMES
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {groups.map((g) => {
          const t = g.times;
          const display = !t
            ? "Closed"
            : t.is_24_hours
              ? "24 hours"
              : `${formatTime(t.open) || t.open} – ${formatTime(t.close) || t.close}`;

          return (
            <Table.Row key={`${g.start}-${g.end}`}>
              <Table.Cell px={1} py={0.5} fontSize="xs" textTransform="capitalize">
                {g.start === g.end ? short[days[g.start]] : `${short[days[g.start]]}–${short[days[g.end]]}`}
              </Table.Cell>
              <Table.Cell px={1} py={0.5} fontSize="xs" textAlign="end">
                {display}
              </Table.Cell>
            </Table.Row>
          );
        })}
        <Table.Row>
          <Table.Cell px={1} py={0.5} fontSize="xs" textTransform="capitalize">
            Bank Holiday
          </Table.Cell>
          <Table.Cell px={1} py={0.5} fontSize="xs" textAlign="end">
            {openingTimes.bank_holiday.is_24_hours
              ? "24 hours"
              : openingTimes.bank_holiday.open_time
                ? `${formatTime(openingTimes.bank_holiday.open_time) || openingTimes.bank_holiday.open_time} – ${
                    formatTime(openingTimes.bank_holiday.close_time) || openingTimes.bank_holiday.close_time
                  }`
                : "Closed"}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

interface ZScoreIndicatorProps {
  price: number;
  fuelType: string;
  stats?: Statistics;
}

function ZScoreIndicator({ price, fuelType, stats }: ZScoreIndicatorProps) {
  const avg = stats?.average_price?.[fuelType];
  const stddev = stats?.standard_deviation?.[fuelType];

  if (avg === undefined || stddev === undefined) return null;
  const z = (price - avg) / stddev;
  if (z >= 1.0) {
    return (
      <Tooltip content={`Overpriced (z-score: ${z.toFixed(3)})`}>
        <FaRegThumbsDown color="red" />
      </Tooltip>
    );
  } else if (z >= 0.5) {
    return (
      <Tooltip content={`Expensive (z-score: ${z.toFixed(3)})`}>
        <FaRegThumbsDown color="orange" />
      </Tooltip>
    );
  } else if (z <= -0.5) {
    return (
      <Tooltip content={`Good price  (z-score: ${z.toFixed(3)})`}>
        <FaRegThumbsUp color="green" />
      </Tooltip>
    );
  }
  return null;
}

interface PetrolFillingStationPopupProps {
  data: SearchResult;
  stats?: Statistics;
}

export function PetrolFillingStationPopup({ data, stats }: PetrolFillingStationPopupProps) {
  return (
    <Popup maxWidth={500} closeButton={false}>
      <Card.Root overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
        <Card.Header p={1} pb={0} textTransform="uppercase">
          <HStack gap={2} mb={1}>
            {data.retailer?.logo_url && <Image src={data.retailer?.logo_url} maxWidth={12} borderRadius={5} />}
            <VStack gap={0} alignItems="flex-start">
              <Heading size="sm" lineClamp={1}>
                {data.retailer?.website_url ? (
                  <Link
                    className="fuelPricesLink"
                    href={data.retailer.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.brand_name || data.trading_name}
                  </Link>
                ) : (
                  data.brand_name || data.trading_name
                )}
              </Heading>
              <Text fontSize="xs" lineClamp={3} color="gray.600" textTransform="capitalize">
                {[
                  data.location.address_line_1.toLowerCase(),
                  data.location.address_line_2?.toLowerCase(),
                  data.location.city.toLowerCase(),
                  data.location.postcode.replace(" ", "\u00A0"),
                ]
                  .filter(Boolean)
                  .join(", ")}
                .{" "}
                {data.public_phone_number &&
                  `Tel:\u00A0${data.public_phone_number.replace("+44", "0").replaceAll(" ", "\u00A0")}`}
              </Text>
            </VStack>
          </HStack>
        </Card.Header>
        <Card.Body p={1} pt={0}>
          <AmenitiesList data={data} />
          <PricesTable prices={data.fuel_prices} stats={stats} />
          <OpeningTimesTable openingTimes={data.opening_times} />
        </Card.Body>
      </Card.Root>
    </Popup>
  );
}
