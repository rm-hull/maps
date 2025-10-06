import { useColorModeValue } from "@/components/ui/color-mode";
import { ButtonGroup, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import * as L from "leaflet";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { IoPlayOutline, IoPlaySkipForwardOutline, IoPauseOutline } from "react-icons/io5";
import { RxReset } from "react-icons/rx";
import { ImageOverlay } from "react-leaflet";
import { Control } from "../../Control";

const bounds = new L.LatLngBounds(
  [44.2, -25.0], // Southwest corner (lat, lng)
  [62.2, 15.0] // Northeast corner (lat, lng)

  // N 63.0, E 15.0, S 45.0, W -25.0
);

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

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

function getIndexForCurrentTime(): number {
  return timesteps.indexOf(zeroPad(new Date().getHours(), 2));
}

type WeatherLayerProps = {
  url: string;
  opacity?: number;
  animate?: boolean;
  zIndex?: number;
  scale?: ReactNode;
};

export function WeatherLayer({ url: urlTemplate, opacity = 0.6, animate = false, scale, zIndex }: WeatherLayerProps) {
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

  useEffect(() => {
    if (index === timesteps.length - 1) {
      setIsRunning(false);
    }
  }, [index]);

  const today = useMemo(() => getTodayMidnight(), []);

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

  const bg = useColorModeValue("whiteAlpha.700", "blackAlpha.700");
  const fg = useColorModeValue("gray.600", "gray.300");

  return (
    <>
      <Control position="bottomleft">
        <Stack backgroundColor={bg} color={fg} p={1} borderRadius={5} direction={{ base: "column", md: "row" }}>
          {scale}
          <HStack>
            <Text fontSize="xs" fontWeight="bold" width="150px" textAlign="right">
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
        </Stack>
      </Control>
      <ImageOverlay url={url} bounds={bounds} opacity={opacity} zIndex={zIndex} />
    </>
  );
}
