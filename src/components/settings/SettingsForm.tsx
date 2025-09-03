import {
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { ChangeEvent } from "react";
import { BASE_LAYERS } from "../../config/layer";
import { DEFAULT_ZOOM_LEVEL, type InitialLocation, useGeneralSettings } from "../../hooks/useGeneralSettings";
import { CustomSearch } from "./CustomSearch";

export function SettingsForm() {
  const [settings, updateSettings] = useGeneralSettings();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpdateInitialLocation = (initialLocation: InitialLocation): void => {
    updateSettings({ ...settings, initialLocation });
  };

  const handleUpdateMapStyle = (event: ChangeEvent<HTMLSelectElement>): void => {
    updateSettings({ ...settings, mapStyle: event.target.value });
  };

  const handleUpdateCustomSearch = (latLng: LatLng, searchTerm: string): void => {
    updateSettings({
      ...settings,
      customLocation: {
        latLng: [latLng.lat, latLng.lng], // note Leaflet's LatLngTuple format
        searchTerm,
      },
    });
  };

  const handleUpdateZoomLevel = (zoomLevel: number): void => {
    updateSettings({ ...settings, initialZoomLevel: zoomLevel });
  };

  const zoomLevel = settings?.initialZoomLevel ?? DEFAULT_ZOOM_LEVEL;

  return (
    <VStack gap={6}>
      <FormControl display="flex" alignItems="flex-start">
        <FormLabel htmlFor="initial-location" mb={0} minW={110}>
          Initial location:
        </FormLabel>
        <RadioGroup id="initial-location" onChange={handleUpdateInitialLocation} value={settings?.initialLocation}>
          <VStack align="left">
            <Radio value="default">Default (Ambleside)</Radio>
            <Radio value="current">Current (requires location services enabling)</Radio>
            <HStack>
              <Radio value="custom">Custom</Radio>
              <CustomSearch
                searchTerm={settings?.customLocation?.searchTerm}
                isDisabled={settings?.initialLocation !== "custom"}
                onUpdate={handleUpdateCustomSearch}
              />
            </HStack>
          </VStack>
        </RadioGroup>
      </FormControl>

      <FormControl display="flex" alignItems="baseline">
        <FormLabel htmlFor="zoom-level" minW={110}>
          Zoom level:
        </FormLabel>
        <Slider
          id="zoom-level"
          value={zoomLevel}
          mt={1}
          min={7}
          max={18}
          step={1}
          onChange={handleUpdateZoomLevel}
          onMouseOver={onOpen}
          onMouseOut={onClose}
        >
          <Tooltip hasArrow bg="blue.500" color="white" placement="bottom" isOpen={isOpen} label={zoomLevel}>
            <SliderThumb />
          </Tooltip>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl display="flex" alignItems="baseline">
        <FormLabel htmlFor="map-style" mb={0} minW={110}>
          Map style:
        </FormLabel>
        <Select id="map-style" onChange={handleUpdateMapStyle} value={settings?.mapStyle}>
          {Object.entries(BASE_LAYERS).map(([provider, layers]) => (
            <optgroup label={provider} key={provider}>
              {layers.map((layer) => (
                <option value={`${provider} / ${layer.name}`} key={layer.name}>
                  {layer.name}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </FormControl>
    </VStack>
  );
}
