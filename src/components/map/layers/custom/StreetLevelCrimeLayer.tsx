import { LatLngBounds } from "leaflet";
import { CircleMarker, Popup } from "react-leaflet";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { useStreetLevelCrimes } from "@/hooks/useStreetLevelCrimes";
import { Card, Circle, List, Stack, Table } from "@chakra-ui/react";
import { Control } from "../../Control";
import { useColorModeValue } from "@/components/ui/color-mode";

interface StreetLevelCrimeLayerProps {
  bounds: LatLngBounds;
}

const crimeCategories: Record<string, { name: string; color: string; severity: number }> = {
  "anti-social-behaviour": { name: "Anti-social behaviour", color: "orange", severity: 10 },
  "bicycle-theft": { name: "Bicycle theft", color: "blue", severity: 7 },
  "burglary": { name: "Burglary", color: "purple", severity: 3 },
  "criminal-damage-arson": { name: "Criminal damage and arson", color: "brown", severity: 3 },
  "drugs": { name: "Drugs", color: "green", severity: 4 },
  "other-theft": { name: "Other theft", color: "cyan", severity: 8 },
  "possession-of-weapons": { name: "Possession of weapons", color: "magenta", severity: 2 },
  "public-order": { name: "Public order", color: "yellow", severity: 6 },
  "robbery": { name: "Robbery", color: "black", severity: 2 },
  "shoplifting": { name: "Shoplifting", color: "gray", severity: 9 },
  "theft-from-the-person": { name: "Theft from the person", color: "lightblue", severity: 3 },
  "vehicle-crime": { name: "Vehicle crime", color: "lightgreen", severity: 5 },
  "violent-crime": { name: "Violence and sexual offences", color: "red", severity: 1 },
  "other-crime": { name: "Other crime", color: "lightgray", severity: 8 },
  "all-crime": { name: "All crime", color: "gray", severity: 5 },
}

function Legend() {
  const bg = useColorModeValue("whiteAlpha.900", "blackAlpha.700");
  const fg = useColorModeValue("gray.600", "gray.300");

  return (
    <Control position="bottomleft">
      <Stack backgroundColor={bg} color={fg} p={1} borderRadius={5} direction={{ base: "column", md: "row" }}>

        <List.Root>
          {Object.entries(crimeCategories).map(([key, { name, color }]) => (
            <List.Item key={key} display="flex" alignItems="center" gap={1} fontSize="xs">
              <Circle size="10px" bg={color} flexShrink={0} mr={2} borderColor="gray" borderWidth={0.5} />
              {name}
            </List.Item>
          ))}
        </List.Root>
      </Stack>
    </Control>
  )
}

export function StreetLevelCrimeLayer({ bounds }: StreetLevelCrimeLayerProps) {
  const { data, error } = useCachedQuery(useStreetLevelCrimes(bounds, "all-crime"));
  useErrorToast("street-level-crime-error", "Error loading street-level crime data", error);

  const byStreet = data?.reduce((acc, crime) => {
    const key = crime.location.street.id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(crime);
    return acc;
  }, {} as Record<string, typeof data>) || {};

  return (<>
    <Legend />
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
          key={location.street.id}
          center={[parseFloat(location.latitude), parseFloat(location.longitude)]}
          radius={5}
          color="gray"
          weight={0.5}
          fillColor={color}
          fillOpacity={1.0}
        >
          <Popup maxWidth={600} closeButton={false}>
            <Card.Root overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
              <Card.Header p={1} pb={0}>
                <Card.Title>{incidents[0].location.street.name}</Card.Title>
                <Card.Description>{incidents[0].month}</Card.Description>
              </Card.Header>
              <Card.Body p={1} pt={1}>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted">CATEGORY</Table.ColumnHeader>
                      <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted">OUTCOME</Table.ColumnHeader>
                      <Table.ColumnHeader px={1} py={0.5} fontSize="2xs" fontWeight="medium" color="fg.muted">CONTEXT</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {incidents.map((crime) => (
                      <Table.Row key={crime.id}>
                        <Table.Cell px={1} py={0.5} display="flex" alignItems="center">

                          <Circle size="10px" bg={crimeCategories[crime.category]?.color || color} flexShrink={0} mr={2} borderColor="gray" borderWidth={0.5} />
                          {crimeCategories[crime.category]?.name || crime.category}
                        </Table.Cell>
                        <Table.Cell px={1} py={0.5}>{crime.outcome_status?.category || "No outcome"}</Table.Cell>
                        <Table.Cell px={1} py={0.5}>{crime.context || "N/A"}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Card.Body>
            </Card.Root>
          </Popup>
        </CircleMarker>
      );
    })}
  </>);
}
