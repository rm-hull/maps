import { Field, HStack, Listbox, RadioGroup, Slider, Switch, VStack } from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { baseLayers } from "../../config/layer";
import { DEFAULT_ZOOM_LEVEL, type InitialLocation, useGeneralSettings } from "../../hooks/useGeneralSettings";
import { CustomSearch } from "./CustomSearch";

export function SettingsForm() {
  const { settings, updateSettings } = useGeneralSettings();

  const handleUpdateInitialLocation = (initialLocation: InitialLocation): void => {
    updateSettings({ ...settings, initialLocation });
  };

  const handleUpdateMapStyle = (selected: string[]): void => {
    updateSettings({ ...settings, mapStyle: selected[0] });
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
      <Field.Root>
        <HStack alignItems="start" width="full">
          <Field.Label width="100px">Initial location:</Field.Label>
          <RadioGroup.Root
            onValueChange={(e) => handleUpdateInitialLocation(e.value as InitialLocation)}
            value={settings?.initialLocation}
          >
            <VStack align="left">
              <RadioGroup.Item value="default">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>Default (Ambleside, Cumbria)</RadioGroup.ItemText>
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
        </HStack>
      </Field.Root>

      <Field.Root>
        <HStack alignItems="start" width="full">
          <Field.Label width="120px">Map style:</Field.Label>
          <Listbox.Root
            collection={baseLayers}
            value={[settings?.mapStyle ?? "Leisure"]}
            onValueChange={(e) => handleUpdateMapStyle(e.value)}
          >
            <Listbox.Content maxHeight={140} divideY="1px">
              {baseLayers.group().map(([provider, layers]) => (
                <Listbox.ItemGroup key={provider}>
                  <Listbox.ItemGroupLabel fontWeight="bold">{provider}</Listbox.ItemGroupLabel>
                  {layers.map((item) => (
                    <Listbox.Item key={item.name} item={item}>
                      <Listbox.ItemText>{item.name}</Listbox.ItemText>
                      <Listbox.ItemIndicator />
                    </Listbox.Item>
                  ))}
                </Listbox.ItemGroup>
              ))}
            </Listbox.Content>
          </Listbox.Root>
        </HStack>
      </Field.Root>

      <Field.Root>
        <Slider.Root
          defaultValue={[zoomLevel]}
          min={7}
          max={18}
          width="full"
          onValueChange={(e) => handleUpdateZoomLevel(e.value[0])}
        >
          <HStack display="flex" justifyContent="space-between">
            <HStack gap={2}>
              <Slider.Label width="100px">Zoom level:</Slider.Label>
              <Slider.ValueText />
            </HStack>
            <Field.Root width="auto">
              <Switch.Root checked={settings?.showZoomLevel} onChange={handleUpdateZoomControl}>
                <Switch.Label>Show zoom control?</Switch.Label>
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch.Root>
            </Field.Root>
          </HStack>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
      </Field.Root>
    </VStack>
  );
}
