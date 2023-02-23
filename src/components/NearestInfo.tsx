import { Table, TableContainer, Tbody, Td, Th, Tr } from "@chakra-ui/react";
import { LatLng } from "leaflet";
import useNearest from "../hooks/useNearest";
import { toBNG } from "../services/osdatahub/helpers";

type NearestInfoProps = {
  latLng: LatLng;
  render(children: JSX.Element): JSX.Element;
};

export default function NearestInfo({ latLng, render }: NearestInfoProps) {
  const bng = toBNG(latLng);
  const { data, status } = useNearest(bng);

  if (status === "loading" || !data) {
    return null;
  }

  if (data.header.totalresults === 0) {
    const [easting, northing] = bng;
    return render(
      <TableContainer>
        <Table size="sm">
          <Tbody>
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
              <Td>{latLng.lat}</Td>
            </Tr>
            <Tr>
              <Th>Longitude</Th>
              <Td>{latLng.lng}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    );
  }

  const { localType, name1, countyUnitary, districtBorough, region, geometryX, geometryY } =
    data.results[0].gazetteerEntry;

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
          <Tr>
            <Th>Easting</Th>
            <Td>{geometryX}</Td>
          </Tr>
          <Tr>
            <Th>Northing</Th>
            <Td>{geometryY}</Td>
          </Tr>
          <Tr>
            <Th>Latitude</Th>
            <Td>{latLng.lat}</Td>
          </Tr>
          <Tr>
            <Th>Longitude</Th>
            <Td>{latLng.lng}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
