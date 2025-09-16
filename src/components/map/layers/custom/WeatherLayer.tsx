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

const timesteps = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
  "51",
  "52",
  "53",
  "54",
  "57",
  "57",
  "57",
  "60",
  "60",
  "60",
  "63",
  "63",
  "63",
  "66",
  "66",
  "66",
  "69",
  "69",
  "69",
  "72",
  "72",
  "72",
  "75",
  "75",
  "75",
  "78",
  "78",
  "78",
  "81",
  "81",
  "81",
  "84",
  "84",
  "84",
  "87",
  "87",
  "87",
  "90",
  "90",
  "90",
  "93",
  "93",
  "93",
  "96",
  "96",
  "96",
  "99",
  "99",
  "99",
];

function zeroPad(num: number, length: number): string {
  return num.toString().padStart(length, "0");
}

function getTodayMidnight(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function WeatherLayer({ url, opacity = 0.6 }: WeatherLayerProps) {
  const today = getTodayMidnight();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setIndex((prev) => (prev + 1) % timesteps.length);
    }, 250);

    return () => clearInterval(timerId);
  }, []);

  const actual = useMemo(() => {
    return url
      .replace("{y}", zeroPad(today.getFullYear(), 4))
      .replace("{m}", zeroPad(today.getMonth() + 1, 2))
      .replace("{d}", zeroPad(today.getDate(), 2))
      .replace("{h}", timesteps[index]);
  }, [url, today, index]);

  const currentTime = useMemo(() => {
    today.setHours(parseInt(timesteps[index]));
    return today.toISOString().substring(0, 16).replaceAll("T", " ");
  }, [today, index]);

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
