import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";
import { PathOptions, type LatLngBounds } from "leaflet";
import { Popup } from "react-leaflet";
import { useCachedQuery } from "../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { useStreetManager } from "../../../hooks/useStreetManager";
import { getCoordinates, getObjectRef, getStartDate, getEndDate } from "../../../services/streetManager/helpers";
import WktLayer from "../WktShape";

interface StreetManagerLayerProps {
  bounds: LatLngBounds;
}
const defaultStyle: PathOptions = {
  color: "#FF000077",
  weight: 4,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
};

export function StreetManagerLayer({ bounds }: StreetManagerLayerProps) {
  const { data, error } = useCachedQuery(useStreetManager(bounds));
  useErrorToast("street-manager-error", "Error loading street-manager events", error);

  return data?.results.map((result) => (
    <WktLayer
      key={getObjectRef(result)}
      wkt={getCoordinates(result)}
      pathOptions={{ ...defaultStyle, lineJoin: "round", lineCap: "round" }}
    >
      <Popup maxWidth={400} closeButton={false}>
        <Card overflow="hidden" shadow="none" width="xs" border={0} outline={0}>
          <CardHeader p={1} pb={0}>
            <Heading size="sm" noOfLines={1}>
              {getObjectRef(result)}
            </Heading>
          </CardHeader>
          <CardBody p={1} pt={0} color="gray.600" fontSize="sm">
            <Text>{result.promoter_organisation}</Text> <Text>{result.activity_type}</Text>
            <Text>
              {result.works_location_type} ({result.work_category})
            </Text>
            <Text>{result.work_status}</Text>
            <Text>Start: {getStartDate(result)}</Text>
            <Text>End: {getEndDate(result)}</Text>
            {/* <Code fontSize="xs">{JSON.stringify(result, null, 2)}</Code> */}
          </CardBody>
        </Card>
      </Popup>
    </WktLayer>
  ));
}
