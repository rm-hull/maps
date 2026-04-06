import { LatLngBounds } from "leaflet";
import { CircleMarker, Popup } from "react-leaflet";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useLastUpdated, useStreetLevelCrimes } from "@/hooks/useStreetLevelCrimes";
import {
  Card,
  Circle,
  createListCollection,
  DataList,
  Heading,
  HStack,
  Link,
  List,
  Portal,
  Select,
  Span,
  Table,
  VStack,
} from "@chakra-ui/react";
import { Control } from "../../Control";
import { useColorModeValue } from "@/components/ui/color-mode";
import { StreetLevelCrime } from "@/services/streetLevelCrimes/types";
import { SetStateAction, useEffect, useMemo, useState } from "react";

interface StreetLevelCrimeLayerProps {
  bounds: LatLngBounds;
}

const crimeCategories: Record<string, { name: string; color: string; severity: number }> = {
  "anti-social-behaviour": { name: "Anti-social behaviour", color: "orange", severity: 10 },
  "bicycle-theft": { name: "Bicycle theft", color: "blue", severity: 7 },
  burglary: { name: "Burglary", color: "purple", severity: 3 },
  "criminal-damage-arson": { name: "Criminal damage and arson", color: "brown", severity: 3 },
  drugs: { name: "Drugs", color: "green", severity: 4 },
  "other-theft": { name: "Other theft", color: "cyan", severity: 8 },
  "possession-of-weapons": { name: "Possession of weapons", color: "magenta", severity: 2 },
  "public-order": { name: "Public order", color: "yellow", severity: 6 },
  robbery: { name: "Robbery", color: "black", severity: 2 },
  shoplifting: { name: "Shoplifting", color: "gray", severity: 9 },
  "theft-from-the-person": { name: "Theft from the person", color: "lightblue", severity: 3 },
  "vehicle-crime": { name: "Vehicle crime", color: "lightgreen", severity: 5 },
  "violent-crime": { name: "Violence and sexual offences", color: "red", severity: 1 },
  "other-crime": { name: "Other crime", color: "lightgray", severity: 8 },
};

function initSelections(value: boolean): Record<string, boolean> {
  return Object.fromEntries(Object.keys(crimeCategories).map((key) => [key, value]));
}

interface LegendProps {
  counts: Record<string, number>;
  initialMonth: string;
  onMonthChange: (month: string) => void;
  selected: Record<string, boolean>;
  onSelectedChange: (selections: SetStateAction<Record<string, boolean>>) => void;
}

function Legend({ initialMonth, onMonthChange, selected, onSelectedChange, counts }: LegendProps) {
  const bg = useColorModeValue("whiteAlpha.900", "blackAlpha.800");
  const fg = useColorModeValue("gray.600", "gray.300");

  const months = useMemo(() => {
    const parts = initialMonth.split("-").map(Number);
    const year = parts[0];
    const monthIndex = parts[1] - 1; // 0-based
    const items: { value: string; label: string }[] = [];
    const d = new Date(year, monthIndex, 1);
    for (let i = 0; i < 12; i++) {
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString(undefined, { month: "long", year: "numeric" });
      items.push({ value, label });
      d.setMonth(d.getMonth() - 1);
    }
    items.reverse(); // ascending order (oldest -> newest)
    return createListCollection({ items });
  }, [initialMonth]);

  const handleSelectionToggled = (category: string) =>
    onSelectedChange((prev) => ({ ...prev, [category]: !prev[category] }));
  const handleSelectAll = () => onSelectedChange(initSelections(true));
  const handleClearAll = () => onSelectedChange(initSelections(false));

  return (
    <Control position="bottomleft">
      <VStack backgroundColor={bg} color={fg} p={1} pt={3} borderRadius={5} direction={{ base: "column", md: "row" }}>
        <Select.Root
          size="xs"
          px={2}
          width="stretch"
          collection={months}
          defaultValue={[initialMonth]}
          onValueChange={(details) => onMonthChange(details.value[0])}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select year & month"></Select.ValueText>
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {months.items.map((month) => (
                  <Select.Item key={month.value} item={month}>
                    {month.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <List.Root px={2} className="streetLevelCrime-legend">
          {Object.entries(crimeCategories).map(([key, { name, color }]) => (
            <List.Item key={key} display="flex" alignItems="center" gap={1} fontSize="xs">
              <Circle size="10px" bg={color} flexShrink={0} mr={2} borderColor="gray" borderWidth={0.5} />
              <HStack justifyContent="space-between" alignItems="baseline" width="stretch">
                <Link
                  variant="plain"
                  onClick={() => handleSelectionToggled(key)}
                  textDecoration={selected[key] ? undefined : "line-through"}
                >
                  {name}
                </Link>
                <List.Indicator mr={0} color="blue.700" width={6} textAlign="right" fontSize="2xs">
                  {counts[key] ?? 0}
                </List.Indicator>
              </HStack>
            </List.Item>
          ))}
        </List.Root>
        <HStack gap={3} fontSize="xs" fontWeight="500" mb={2}>
          <Link variant="underline" onClick={handleClearAll}>
            clear all
          </Link>
          <Link variant="underline" onClick={handleSelectAll}>
            select all
          </Link>
        </HStack>
      </VStack>
    </Control>
  );
}

interface TableViewProps {
  incidents: StreetLevelCrime[];
}

function TableView({ incidents }: TableViewProps) {
  return (
    <Table.ScrollArea maxHeight={300}>
      <Table.Root size="sm" stickyHeader interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted" colSpan={2}>
              CATEGORY
            </Table.ColumnHeader>
            <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted">
              OUTCOME
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {incidents.map((crime) => (
            <Table.Row key={crime.id} verticalAlign="top">
              <Table.Cell pl={1} pr={0} py={1.5}>
                <Circle
                  size="10px"
                  bg={crimeCategories[crime.category]?.color}
                  flexShrink={0}
                  mr={2}
                  borderColor="gray"
                  borderWidth={0.5}
                />
              </Table.Cell>
              <Table.Cell pl={0.5} py={0.5} width={130} textWrap="wrap" fontSize="xs">
                {crimeCategories[crime.category]?.name || crime.category}
              </Table.Cell>
              <Table.Cell px={1} py={0.5} width={270} textWrap="wrap" fontSize="xs">
                {crime.outcome_status?.category || "No outcome"} {crime.context && `(Context: ${crime.context})`}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}

interface ListViewProps {
  incident: StreetLevelCrime;
}

function ListView({ incident }: ListViewProps) {
  return (
    <DataList.Root orientation="horizontal" gap={1}>
      <DataList.Item alignItems="start" gap={0}>
        <DataList.ItemLabel width={75} minWidth="initial" pl={1} fontSize="2xs">
          CATEGORY
        </DataList.ItemLabel>
        <DataList.ItemValue fontSize="xs">
          {crimeCategories[incident.category]?.name || incident.category}
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item alignItems="start" gap={0}>
        <DataList.ItemLabel width={75} minWidth="initial" pl={1} fontSize="2xs">
          OUTCOME
        </DataList.ItemLabel>
        <DataList.ItemValue fontSize="xs">
          {incident.outcome_status?.category || "No outcome"} {incident.context && `(Context: ${incident.context})`}
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}

export function StreetLevelCrimeLayer({ bounds }: StreetLevelCrimeLayerProps) {
  const { data: lastUpdated } = useLastUpdated();
  const [month, setMonth] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState(initSelections(true));
  const { data, error } = useCachedQuery(useStreetLevelCrimes(bounds, "all-crime", month));
  useErrorToast("street-level-crime-error", "Error loading street-level crime data", error);

  useEffect(() => {
    if (lastUpdated) {
      setMonth((currentMonth) => currentMonth ?? lastUpdated);
    }
  }, [lastUpdated]);

  const byStreet = useMemo(
    () =>
      data?.reduce(
        (acc, crime) => {
          if (crime.category && !selected[crime.category]) {
            return acc;
          }

          const key = crime.location.street.id;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(crime);
          return acc;
        },
        {} as Record<string, StreetLevelCrime[]>
      ) || {},
    [data, selected]
  );

  const categoryCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    data?.forEach((crime) => {
      acc[crime.category] = (acc[crime.category] ?? 0) + 1;
    });
    return acc;
  }, [data]);

  if (!lastUpdated) {
    return null;
  }

  return (
    <>
      <Legend
        initialMonth={lastUpdated}
        onMonthChange={setMonth}
        selected={selected}
        onSelectedChange={setSelected}
        counts={categoryCounts}
      />
      {Object.values(byStreet).map((incidents) => {
        // choose the category with the highest severity (1 = most severe)
        const chosenCategory = incidents.reduce((bestCat, crime) => {
          const cat = crime.category;
          const sev = crimeCategories[cat]?.severity ?? 10;
          const bestSev = crimeCategories[bestCat]?.severity ?? 10;
          return sev < bestSev ? cat : bestCat;
        }, incidents[0].category);

        const color = crimeCategories[chosenCategory]?.color || "gray";
        const location = incidents[0].location;
        return (
          <CircleMarker
            key={incidents[0].id + ";" + color}
            center={[parseFloat(location.latitude), parseFloat(location.longitude)]}
            radius={5}
            color="gray"
            weight={0.5}
            fillColor={color}
            fillOpacity={1.0}
          >
            <Popup closeButton={false}>
              <Card.Root overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
                <Card.Header p={1} pb={0}>
                  <Card.Title>
                    <Heading size="sm" lineClamp={1}>
                      {incidents[0].location.street.name}{" "}
                      <Span color="fg.muted" fontSize="xs" fontWeight="medium">
                        ({incidents[0].month})
                      </Span>
                    </Heading>
                  </Card.Title>
                </Card.Header>
                <Card.Body p={1} pt={1}>
                  {incidents.length > 1 ? <TableView incidents={incidents} /> : <ListView incident={incidents[0]} />}
                </Card.Body>
              </Card.Root>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
