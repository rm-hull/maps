import * as L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { ImageOverlay } from "react-leaflet";

// type WeatherLayerProps = {
//   url: string;
//   opacity?: number
//   animate?: boolean
// };

const bounds = new L.LatLngBounds(
  [44.2, -25.0], // Southwest corner (lat, lng)
  [62.2, 15.0] // Northeast corner (lat, lng)

  // N 63.0, E 15.0, S 45.0, W -25.0
);

export function WeatherLayer() {
  const [hour, setHour] = useState(new Date().getHours());
  useEffect(() => {
    const timerId = setInterval(() => {
      setHour((prev) => (prev + 1) % 25);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // const year = new Date().getFullYear();

  console.log({ hour });

  const fixedHour = useMemo(() => (hour < 10 ? `0${hour}` : hour.toString()), [hour]);

  return (
    <ImageOverlay
      url={`http://localhost:8080/v1/metoffice/datahub/total_precipitation_rate/2025/09/15/${fixedHour}.png`}
      bounds={bounds}
      opacity={0.6}
    />
  );
}
