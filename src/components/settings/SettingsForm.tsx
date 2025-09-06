import {
  Field,
  HStack,
  RadioGroup,
  Select,
  Slider,
  Switch,
  TabsValueChangeDetails,
  VStack,
  createListCollection,
  useDisclosure,
} from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { ChangeEvent } from "react";
import { BASE_LAYERS } from "../../config/layer";
import { DEFAULT_ZOOM_LEVEL, type InitialLocation, useGeneralSettings } from "../../hooks/useGeneralSettings";
import { Tooltip } from "../ui/tooltip";
import { CustomSearch } from "./CustomSearch";

const items = Object.entries(BASE_LAYERS).flatMap(([provider, layers]) => layers.map((layer) => `${provider} / ${layer}`));
const baseLayers = createListCollection({ items });

export function SettingsForm() {
  const [settings, updateSettings] = useGeneralSettings();
  const { open, onOpen, onClose } = useDisclosure();

  const handleUpdateInitialLocation = (initialLocation: InitialLocation): void => {
    updateSettings({ ...settings, initialLocation });
  };

  const handleUpdateMapStyle = (selected: string): void => {
    updateSettings({ ...settings, mapStyle: selected });
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

  const handleUpdateZoomControl = (): void => {
    updateSettings({ ...settings, showZoomLevel: !settings?.showZoomLevel });
  };

  const zoomLevel = settings?.initialZoomLevel ?? DEFAULT_ZOOM_LEVEL;

  return (
    <VStack gap={6}>
      <Field.Root display="flex" alignItems="flex-start">
        <Field.Label htmlFor="initial-location" mb={0} minW={110}>
          Initial location:
        </Field.Label>
        <RadioGroup.Root
          id="initial-location"
          onValueChange={(e) => handleUpdateInitialLocation(e.value)}
          value={settings?.initialLocation}
        >
          <VStack align="left">
            <RadioGroup.Item value="default">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Default (Ambleside)</RadioGroup.ItemText>
            </RadioGroup.Item>
            <RadioGroup.Item value="current">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Current (requires location services enabling)</RadioGroup.ItemText>
            </RadioGroup.Item>
            <HStack>
              <RadioGroup.Item value="custom">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Custom</RadioGroup.ItemText>
              </RadioGroup.Item>
              <CustomSearch
                searchTerm={settings?.customLocation?.searchTerm}
                disabled={settings?.initialLocation !== "custom"}
                onUpdate={handleUpdateCustomSearch}
              />
            </HStack>
          </VStack>
        </RadioGroup.Root>
      </Field.Root>

      <Field.Root display="flex" alignItems="baseline">
        <Field.Label htmlFor="zoom-level" minW={110}>
          Zoom level:
        </Field.Label>

        <Slider.Root
          defaultValue={[zoomLevel]}
          id="zoom-level"
          // value={zoomLevel}
          mt={1}
          min={7}
          max={18}
          step={1}
          onValueChange={(e) => handleUpdateZoomLevel(e.value[0])}
          onMouseOver={onOpen}
          onMouseOut={onClose}
        >
          <Slider.Control>
            <Slider.Track>
              {/* <Tooltip content={zoomLevel} showArrow positioning={{ placement: "bottom" }}>
                <Slider.Thumb index={zoomLevel} />
              </Tooltip> */}
              <Slider.Range />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </Field.Root>

      <Field.Root display="flex">
        <Field.Label htmlFor="zoom-control" minW={110}>
          Show zoom control?
        </Field.Label>
        <Switch.Root id="zoom-control" checked={settings?.showZoomLevel} onChange={handleUpdateZoomControl}>
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </Field.Root>

      <Field.Root display="flex" alignItems="baseline">
        <Field.Label htmlFor="map-style" minW={110}>
          Map style:
        </Field.Label>
        <Select.Root
          collection={baseLayers}
          value={settings?.mapStyle}
          onValueChange={(e) => handleUpdateMapStyle(e.value[0])}
        >
          <Select.HiddenSelect />
          <Select.Label />

          <Select.Control>
            <Select.Trigger>
              <Select.ValueText />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
              {/* <Select.ClearTrigger /> */}
            </Select.IndicatorGroup>
          </Select.Control>

          <Select.Positioner>
            <Select.Content>
              {Object.entries(BASE_LAYERS).map(([provider, layers]) => (
                <Select.ItemGroup key={provider}>
                  <Select.ItemGroupLabel>{provider}</Select.ItemGroupLabel>
                  {layers.map((layer) => (
                    <Select.Item key={layer.name} item={`${provider} / ${layer.name}`} ml={8}>
                      {layer.name}
                    </Select.Item>
                  ))}
                </Select.ItemGroup>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
        {/* <Select id="map-style" onChange={handleUpdateMapStyle} value={settings?.mapStyle}>
          {Object.entries(BASE_LAYERS).map(([provider, layers]) => (
            <optgroup label={provider} key={provider}>
              {layers.map((layer) => (
                <option value={`${provider} / ${layer.name}`} key={layer.name}>
                  {layer.name}
                </option>
              ))}
            </optgroup>
          ))}
        </Select> */}
      </Field.Root>
    </VStack>
  );
}
