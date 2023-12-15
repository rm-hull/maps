import { Table, TableContainer, Tbody, Td, Th, Tr } from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { type JSX } from "react";
import useNearest from "../hooks/useNearest";
import { toBNG } from "../services/osdatahub/helpers";

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
      {altitude && (
        <Tr>
          <Th>Altitude</Th>
          <Td>{altitude.toFixed(1)} m</Td>
        </Tr>
      )}
      {heading && (
        <Tr>
          <Th>Heading</Th>
          <Td>{heading}°</Td>
        </Tr>
      )}
      {accuracy && (
        <Tr>
          <Th>GPS Accuracy</Th>
          <Td>{accuracy.toFixed(0)} m</Td>
        </Tr>
      )}
      {timestamp && (
        <Tr>
          <Th>Last updated</Th>
          <Td>{new Date(timestamp).toISOString().substring(11, 19)}</Td>
        </Tr>
      )}
    </>
  );
}

type NearestInfoProps = GPSProps & {
  render: (children: JSX.Element) => JSX.Element;
};

export default function NearestInfo({
  latLng,
  altitude,
  heading,
  accuracy,
  timestamp,
  render,
}: NearestInfoProps): JSX.Element | null {
  const bng = toBNG(latLng);
  const { data, status } = useNearest(bng);

  if (status === "loading" || !data) {
    return null;
  }

  if (data.header.totalresults === 0) {
    return render(
      <TableContainer>
        <Table size="sm">
          <Tbody>
            <GPS latLng={latLng} altitude={altitude} heading={heading} accuracy={accuracy} timestamp={timestamp} />
          </Tbody>
        </Table>
      </TableContainer>
    );
  }

  const { localType, name1, countyUnitary, districtBorough, region } = data.results[0].gazetteerEntry;

  return render(
    <TableContainer>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Th>{localType}</Th>
            <Td>{name1}</Td>
          </Tr>
          {districtBorough && (
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
        </Tbody>
      </Table>
    </TableContainer>
  );
}
