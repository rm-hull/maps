import { Link, Table, TableContainer, Tbody, Td, Th, Tr } from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { type JSX } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useNearest } from "../../hooks/useNearest";
import { useWhat3Words } from "../../hooks/useWhat3Words";
import { toBNG } from "../../services/osdatahub/helpers";

interface GPSProps {
  latLng: LatLng;
  accuracy?: number;
  timestamp?: number;
  altitude?: number;
  heading?: number;
}

function GPS({ latLng, altitude, heading, accuracy, timestamp }: GPSProps): JSX.Element {
  const [easting, northing] = toBNG(latLng);

  return (
    <>
      <Tr>
        <Th>Easting</Th>
        <Td>{easting}</Td>
      </Tr>
      <Tr>
        <Th>Northing</Th>
        <Td>{northing}</Td>
      </Tr>
      <Tr>
        <Th>Latitude</Th>
        <Td>{latLng.lat.toFixed(7)} N</Td>
      </Tr>
      <Tr>
        <Th>Longitude</Th>
        <Td>{latLng.lng.toFixed(7)} E</Td>
      </Tr>
      {altitude !== undefined && (
        <Tr>
          <Th>Altitude</Th>
          <Td>{altitude.toFixed(1)} m</Td>
        </Tr>
      )}
      {heading !== undefined && (
        <Tr>
          <Th>Heading</Th>
          <Td>{heading}°</Td>
        </Tr>
      )}
      {accuracy !== undefined && (
        <Tr>
          <Th>GPS Accuracy</Th>
          <Td>{accuracy.toFixed(0)} m</Td>
        </Tr>
      )}
      {timestamp !== undefined && (
        <Tr>
          <Th>Last updated</Th>
          <Td>{new Date(timestamp).toISOString().substring(11, 19)}</Td>
        </Tr>
      )}
    </>
  );
}

interface What3WordsProps {
  words: string;
  url: string;
  nearestPlace: string;
}

function What3Words({ words, url, nearestPlace }: What3WordsProps): JSX.Element {
  return (
    <>
      <Tr>
        <Th>What 3 Words</Th>
        <Td>{words}</Td>
      </Tr>
      <Tr>
        <Th>Nearest place</Th>
        <Td>
          <Link isExternal as={ReactRouterLink} to={url}>
            {nearestPlace}
          </Link>
        </Td>
      </Tr>
    </>
  );
}

type NearestInfoProps = GPSProps & {
  render: (children: JSX.Element) => JSX.Element;
};

export function NearestInfo({
  latLng,
  altitude,
  heading,
  accuracy,
  timestamp,
  render,
}: NearestInfoProps): JSX.Element | null {
  const bng = toBNG(latLng);
  const { data: osData, status: osStatus } = useNearest(bng);
  const { data: w3wData, status: w3wStatus } = useWhat3Words(latLng);

  if (osData === undefined || osStatus !== "success" || w3wStatus !== "success") {
    return null;
  }

  if ((osData.header.totalresults ?? 0) === 0) {
    return render(
      <TableContainer>
        <Table size="sm">
          <Tbody>
            <GPS latLng={latLng} altitude={altitude} heading={heading} accuracy={accuracy} timestamp={timestamp} />
            <What3Words words={w3wData?.words} url={w3wData?.map} nearestPlace={w3wData.nearestPlace} />
          </Tbody>
        </Table>
      </TableContainer>
    );
  }

  const { localType, name1, countyUnitary, districtBorough, region } = osData?.results[0].gazetteerEntry;

  return render(
    <TableContainer>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Th>{localType}</Th>
            <Td>{name1}</Td>
          </Tr>
          {districtBorough !== undefined && (
            <Tr>
              <Th>District</Th>
              <Td>{districtBorough}</Td>
            </Tr>
          )}
          <Tr>
            <Th>Region</Th>
            <Td>{countyUnitary ?? region}</Td>
          </Tr>
          <GPS latLng={latLng} altitude={altitude} heading={heading} accuracy={accuracy} timestamp={timestamp} />
          <What3Words words={w3wData?.words} url={w3wData?.map} nearestPlace={w3wData.nearestPlace} />
        </Tbody>
      </Table>
    </TableContainer>
  );
}
