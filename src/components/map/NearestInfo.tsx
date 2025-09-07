import { Table } from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { type JSX, useEffect } from "react";
import { useNearest } from "../../hooks/useNearest";
import { toBNG } from "../../services/osdatahub/helpers";
import { toaster } from "../ui/toaster";

interface GPSProps {
  latLng: LatLng;
  accuracy?: number;
  timestamp?: number;
  altitude?: number;
  heading?: number;
}

function GPS({ latLng, altitude, heading, accuracy, timestamp }: GPSProps) {
  const [easting, northing] = toBNG(latLng);

  return (
    <>
      <Table.Row>
        <Table.ColumnHeader>Easting</Table.ColumnHeader>
        <Table.Cell>{easting}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.ColumnHeader>Northing</Table.ColumnHeader>
        <Table.Cell>{northing}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.ColumnHeader>Latitude</Table.ColumnHeader>
        <Table.Cell>{latLng.lat.toFixed(7)} N</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.ColumnHeader>Longitude</Table.ColumnHeader>
        <Table.Cell>{latLng.lng.toFixed(7)} E</Table.Cell>
      </Table.Row>
      {altitude !== undefined && (
        <Table.Row>
          <Table.ColumnHeader>Altitude</Table.ColumnHeader>
          <Table.Cell>{altitude.toFixed(1)} m</Table.Cell>
        </Table.Row>
      )}
      {heading !== undefined && (
        <Table.Row>
          <Table.ColumnHeader>Heading</Table.ColumnHeader>
          <Table.Cell>{heading}°</Table.Cell>
        </Table.Row>
      )}
      {accuracy !== undefined && (
        <Table.Row>
          <Table.ColumnHeader>GPS Accuracy</Table.ColumnHeader>
          <Table.Cell>{accuracy.toFixed(0)} m</Table.Cell>
        </Table.Row>
      )}
      {timestamp !== undefined && (
        <Table.Row>
          <Table.ColumnHeader>Last updated</Table.ColumnHeader>
          <Table.Cell>{new Date(timestamp).toISOString().substring(11, 19)}</Table.Cell>
        </Table.Row>
      )}
    </>
  );
}

type NearestInfoProps = GPSProps & {
  render: (children: JSX.Element) => JSX.Element;
};

export function NearestInfo({ latLng, altitude, heading, accuracy, timestamp, render }: NearestInfoProps) {
  const bng = toBNG(latLng);
  const { data, status, error } = useNearest(bng);

  useEffect(() => {
    if (error) {
      toaster.create({
        id: "nearest-error",
        title: "Error fetching nearest location",
        description: error.message,
        type: "error",
        duration: 9000,
        closable: true,
      });
    }
  }, [error]);

  if (data === undefined || status !== "success") {
    return null;
  }

  if ((data.header.totalresults ?? 0) === 0) {
    return render(
      <Table.Root size="sm">
        <Table.Body>
          <GPS latLng={latLng} altitude={altitude} heading={heading} accuracy={accuracy} timestamp={timestamp} />
        </Table.Body>
      </Table.Root>
    );
  }

  const gazetteerEntry = data.results[0]?.gazetteerEntry;
  const { localType, name1, countyUnitary, districtBorough, region } = gazetteerEntry ?? {};

  return render(
    <Table.Root size="sm">
      <Table.Body>
        <Table.Row>
          <Table.ColumnHeader>{localType}</Table.ColumnHeader>
          <Table.Cell>{name1}</Table.Cell>
        </Table.Row>
        {districtBorough !== undefined && (
          <Table.Row>
            <Table.ColumnHeader>District</Table.ColumnHeader>
            <Table.Cell>{districtBorough}</Table.Cell>
          </Table.Row>
        )}
        <Table.Row>
          <Table.ColumnHeader>Region</Table.ColumnHeader>
          <Table.Cell>{countyUnitary ?? region}</Table.Cell>
        </Table.Row>
        <GPS latLng={latLng} altitude={altitude} heading={heading} accuracy={accuracy} timestamp={timestamp} />
      </Table.Body>
    </Table.Root>
  );
}
