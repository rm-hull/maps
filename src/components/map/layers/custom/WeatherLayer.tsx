import { ButtonGroup, HStack, IconButton, Text } from "@chakra-ui/react";
import * as L from "leaflet";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoPlayOutline, IoPlaySkipForwardOutline, IoPauseOutline } from "react-icons/io5";
import { RxReset } from "react-icons/rx";
import { ImageOverlay } from "react-leaflet";
import { Control } from "../../Control";
import { Scale } from "../../Scale";

type WeatherLayerProps = {
  url: string;
  opacity?: number;
  animate?: boolean;
};

const bounds = new L.LatLngBounds(
  [44.2, -25.0], // Southwest corner (lat, lng)
  [62.2, 15.0] // Northeast corner (lat, lng)

  // N 63.0, E 15.0, S 45.0, W -25.0
);

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

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
  "60",
  "63",
  "66",
  "69",
  "72",
  "75",
  "78",
  "81",
  "84",
  "87",
  "90",
  "93",
];

function zeroPad(num: number, length: number): string {
  return num.toString().padStart(length, "0");
}

function getTodayMidnight(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getIndexForCurrentTime() {
  return timesteps.indexOf(zeroPad(new Date().getHours(), 2));
}

export function WeatherLayer({ url: urlTemplate, opacity = 0.6, animate = false }: WeatherLayerProps) {
  const today = useMemo(() => getTodayMidnight(), []);
  const [index, setIndex] = useState(getIndexForCurrentTime());
  const [isRunning, setIsRunning] = useState(animate);

  const handleReset = useCallback(() => {
    setIndex(getIndexForCurrentTime());
  }, []);

  const handlePlay = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const handleAdvance = useCallback(() => {
    setIndex((prev) => (prev + 1) % timesteps.length);
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (isRunning) {
        setIndex((prev) => (prev + 1) % timesteps.length);
      }
    }, 250);

    return () => clearInterval(timerId);
  }, [isRunning]);

  const url = useMemo(() => {
    return urlTemplate
      .replace("{y}", zeroPad(today.getFullYear(), 4))
      .replace("{m}", zeroPad(today.getMonth() + 1, 2))
      .replace("{d}", zeroPad(today.getDate(), 2))
      .replace("{h}", timesteps[index]);
  }, [urlTemplate, today, index]);

  const currentTime = useMemo(() => {
    const date = new Date(today);
    date.setHours(parseInt(timesteps[index]));
    return dateTimeFormatter.format(date);
  }, [today, index]);

  return (
    <>
      <Control position="bottomleft">
        <HStack backgroundColor="whiteAlpha.700" color="gray.600" p={1} borderRadius={5}>
          <Scale label="Rain (mm/h):" values={scale2} />
          <Text fontSize="xs" fontWeight="bold">
            {currentTime}
          </Text>
          <ButtonGroup gap={1} size="xs" variant="subtle">
            <IconButton color="purple.600" onClick={handleReset} disabled={isRunning}>
              <RxReset />
            </IconButton>

            <IconButton color={isRunning ? "red.600" : "green.600"} onClick={handlePlay}>
              {isRunning ? <IoPauseOutline /> : <IoPlayOutline />}
            </IconButton>

            <IconButton color="blue.600" onClick={handleAdvance} disabled={isRunning}>
              <IoPlaySkipForwardOutline />
            </IconButton>
          </ButtonGroup>
        </HStack>
      </Control>
      <ImageOverlay url={url} bounds={bounds} opacity={opacity} />
    </>
  );
}
