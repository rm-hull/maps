import {
  AutoSelect,
  DEFAULT_ZOOM_LEVEL,
  type InitialLocation,
  type MapStyle,
  useGeneralSettings,
} from "../../hooks/useGeneralSettings";
import {
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { CustomSearch } from "./CustomSearch";
import { type LatLngTuple } from "leaflet";

export function SettingsForm() {
  const [settings, updateSettings] = useGeneralSettings();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpdateInitialLocation = (initialLocation: InitialLocation): void => {
    updateSettings({ ...settings, initialLocation });
  };

  const handleUpdateMapStyle = (mapStyle: MapStyle): void => {
    updateSettings({ ...settings, mapStyle });
  };

  const handleUpdateCustomSearch = (latLng: LatLngTuple, searchTerm: string): void => {
    updateSettings({ ...settings, customLocation: { latLng, searchTerm } });
  };

  const handleUpdateZoomLevel = (zoomLevel: number): void => {
    updateSettings({ ...settings, initialZoomLevel: zoomLevel });
  };

  const handleUpdateAutoSelect = (autoSelectKey: keyof AutoSelect) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      updateSettings({ ...settings, autoSelect: { ...settings?.autoSelect, [autoSelectKey]: event.target.checked } });
    };
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

      <FormControl display="flex" alignItems="flex-start">
        <FormLabel htmlFor="zoom-level" mb={0} minW={110}>
          Zoom level:
        </FormLabel>
        <Slider
          id="zoom-level"
          value={zoomLevel}
          mt={1}
          min={0}
          max={13}
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

      <FormControl display="flex" alignItems="flex-start">
        <FormLabel htmlFor="map-style" mb={0} minW={110}>
          Map style:
        </FormLabel>
        <RadioGroup id="map-style" onChange={handleUpdateMapStyle} value={settings?.mapStyle}>
          <VStack align="left">
            <Radio value="leisure">Leisure</Radio>
            <Radio value="roads">Roads</Radio>
            <Radio value="outdoor">Outdoor</Radio>
            <Radio value="light">Light</Radio>
          </VStack>
        </RadioGroup>
      </FormControl>

      <FormControl display="flex" alignItems="flex-start">
        <FormLabel mb={0} minW={110}>
          Auto-select:
        </FormLabel>
        <VStack align="left" mt={1}>
          <Switch
            size="sm"
            isChecked={settings?.autoSelect?.geograph ?? false}
            onChange={handleUpdateAutoSelect("geograph")}
          >
            Geograph API
          </Switch>

          <Switch
            size="sm"
            isChecked={settings?.autoSelect?.gpsRoutes ?? false}
            onChange={handleUpdateAutoSelect("gpsRoutes")}
          >
            GPS Routes
          </Switch>
        </VStack>
      </FormControl>
    </VStack>
  );
}
