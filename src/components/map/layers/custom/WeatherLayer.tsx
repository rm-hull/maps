import { HStack, Text } from "@chakra-ui/react";
import * as L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { ImageOverlay } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { Scale } from "../../Scale";

type WeatherLayerProps = {
  url: string;
  opacity?: number;
  //   animate?: boolean
};

const bounds = new L.LatLngBounds(
  [44.2, -25.0], // Southwest corner (lat, lng)
  [62.2, 15.0] // Northeast corner (lat, lng)

  // N 63.0, E 15.0, S 45.0, W -25.0
);

type DateTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
};

function toDateTime(dt: Date): DateTime {
  return {
    year: dt.getFullYear(),
    month: dt.getMonth() + 1,
    day: dt.getDate(),
    hour: dt.getHours(),
  };
}

// const scale = [
//   { color: "#FFFFFF00", value: "0" },
//   { color: "#00FFFF", value: "0.2" },
//   { color: "#0080FF", value: "1" },
//   { color: "#0000FF", value: "3" },
//   { color: "#008080", value: "5" },
//   { color: "#00FF00", value: "7" },
//   { color: "#80FF00", value: "9" },
//   { color: "#FFFF00", value: "15" },
//   { color: "#FF8000", value: "25" },
//   { color: "#FF4000", value: "35" },
//   { color: "#FF0000", value: "45" },
//   { color: "#800000", value: "55" },
//   { color: "#800080", value: "150" },
// ];

const scale2 = [
  { color: "#FFFFFF00", value: "0" },
  { color: "#80FFFF" },
  { color: "#00FFFF", value: "0.2" },
  { color: "#00C0FF" },
  { color: "#0080FF", value: "1" },
  { color: "#0040FF" },
  { color: "#0000FF", value: "3" },
  { color: "#0040C0" },
  { color: "#008080", value: "5" },
  { color: "#00C040" },
  { color: "#00FF00", value: "7" },
  { color: "#40FF00" },
  { color: "#80FF00", value: "9" },
  { color: "#C0FF00" },
  { color: "#FFFF00", value: "15" },
  { color: "#FFC000" },
  { color: "#FF8000", value: "25" },
  { color: "#FF6000" },
  { color: "#FF4000", value: "35" },
  { color: "#FF2000" },
  { color: "#FF0000", value: "45" },
  { color: "#C00000" },
  { color: "#800000", value: "55" },
  { color: "#800020" },
  { color: "#800040" },
  { color: "#800080", value: "150" },
];

function zeroPad(num: number, length: number): string {
  return num.toString().padStart(length, "0");
}

export function WeatherLayer({ url, opacity = 0.6 }: WeatherLayerProps) {
  const [dateTime, setDateTime] = useState(toDateTime(new Date()));
  useEffect(() => {
    const timerId = setInterval(() => {
      setDateTime((prev) => ({ ...prev, hour: (prev.hour + 1) % 25 }));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const actual = useMemo(() => {
    return url
      .replace("{y}", zeroPad(dateTime.year, 4))
      .replace("{m}", zeroPad(dateTime.month, 2))
      .replace("{d}", zeroPad(dateTime.day, 2))
      .replace("{h}", zeroPad(dateTime.hour, 2));
  }, [url, dateTime]);

  const currentTime = `${zeroPad(dateTime.year, 4)}-${zeroPad(dateTime.month, 2)}-${zeroPad(dateTime.day, 2)} ${zeroPad(dateTime.hour, 2)}:00`;

  console.log({ actual });
  return (
    <>
      <Control position="bottomleft">
        <HStack backgroundColor="whiteAlpha.700" color="gray.600" p={1} borderRadius={5}>
          <Scale label="Rain (mm/h):" values={scale2} />
          <Text fontSize="xs" fontWeight="bold">
            {currentTime}
          </Text>
        </HStack>
      </Control>
      <ImageOverlay url={actual} bounds={bounds} opacity={opacity} />
    </>
  );
}
