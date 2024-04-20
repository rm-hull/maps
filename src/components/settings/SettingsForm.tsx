import { FormControl, FormLabel, Radio, RadioGroup, VStack, HStack } from "@chakra-ui/react";
import { type JSX } from "react";
import useGeneralSettings, { type InitialLocation, type MapStyle } from "../../hooks/useGeneralSettings";
import CustomSearch from "./CustomSearch";
import { type LatLngTuple } from "leaflet";

export default function SettingsForm(): JSX.Element {
  const [settings, updateSettings] = useGeneralSettings();

  const handleUpdateInitialLocation = (initialLocation: InitialLocation): void => {
    updateSettings({ ...settings, initialLocation });
  };

  const handleUpdateMapStyle = (mapStyle: MapStyle): void => {
    updateSettings({ ...settings, mapStyle });
  };

  const handleUpdateCustomSearch = (latLng: LatLngTuple, searchTerm: string): void => {
    updateSettings({ ...settings, customLocation: { latLng, searchTerm } });
  };

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
                disabled={settings?.initialLocation !== "custom"}
                onUpdate={handleUpdateCustomSearch}
              />
            </HStack>
          </VStack>
        </RadioGroup>
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
    </VStack>
  );
}
