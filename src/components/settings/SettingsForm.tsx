import {
  Field,
  HStack,
  Listbox,
  ListboxValueChangeDetails,
  NumberInput,
  NumberInputValueChangeDetails,
  RadioGroup,
  RadioGroupValueChangeDetails,
  Slider,
  SliderValueChangeDetails,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { useCallback } from "react";
import { baseLayers } from "../../config/layer";
import {
  DEFAULT_GPS_ACTIVE_DURATION,
  DEFAULT_ZOOM_LEVEL,
  type InitialLocation,
  useGeneralSettings,
} from "../../hooks/useGeneralSettings";
import { CustomSearch } from "./CustomSearch";

export function SettingsForm() {
  const { settings, updateSettings } = useGeneralSettings();

  const handleUpdateInitialLocation = useCallback(
    (details: RadioGroupValueChangeDetails): void => {
      updateSettings({ ...settings, initialLocation: details.value as InitialLocation });
    },
    [settings]
  );

  const handleUpdateMapStyle = useCallback(
    (details: ListboxValueChangeDetails): void => {
      updateSettings({ ...settings, mapStyle: details.value[0] });
    },
    [settings]
  );

  const handleUpdateCustomSearch = useCallback(
    (latLng: LatLng, searchTerm: string): void => {
      updateSettings({
        ...settings,
        customLocation: {
          latLng: [latLng.lat, latLng.lng], // note Leaflet's LatLngTuple format
          searchTerm,
        },
      });
    },
    [settings]
  );

  const handleUpdateZoomLevel = useCallback(
    (details: SliderValueChangeDetails): void => {
      updateSettings({ ...settings, initialZoomLevel: details.value[0] });
    },
    [settings]
  );

  const handleUpdateZoomControl = useCallback((): void => {
    updateSettings({ ...settings, showZoomLevel: !settings?.showZoomLevel });
  }, [settings]);

  const handleUpdateMaxSearchResults = useCallback(
    (details: NumberInputValueChangeDetails): void => {
      updateSettings({ ...settings, maxSearchResults: details.valueAsNumber });
    },
    [settings]
  );

  const handleUpdateGpsActiveSeconds = useCallback(
    (details: NumberInputValueChangeDetails): void => {
      updateSettings({ ...settings, gpsActiveDuration: details.valueAsNumber * 1000 });
    },
    [settings]
  );

  const zoomLevel = settings?.initialZoomLevel ?? DEFAULT_ZOOM_LEVEL;

  return (
    <VStack gap={6}>
      <Field.Root>
        <HStack alignItems="start" width="full">
          <Field.Label width="100px">Initial location:</Field.Label>
          <RadioGroup.Root onValueChange={handleUpdateInitialLocation} value={settings?.initialLocation}>
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
          <Field.Label width="120px" mt={2}>
            Map style:
          </Field.Label>
          <Listbox.Root
            collection={baseLayers}
            value={[settings?.mapStyle ?? "Leisure"]}
            onValueChange={handleUpdateMapStyle}
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
        <Slider.Root defaultValue={[zoomLevel]} min={7} max={18} width="full" onValueChange={handleUpdateZoomLevel}>
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

      <Field.Root>
        <HStack alignItems="start" width="full">
          <Field.Label width="100px" mt={2}>
            Max results:
          </Field.Label>
          <VStack alignItems="start">
            <NumberInput.Root
              size="sm"
              value={settings?.maxSearchResults?.toString() ?? "5"}
              onValueChange={handleUpdateMaxSearchResults}
              min={1}
              max={10}
            >
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              {/* <NumberInput.Scrubber /> */}
              <NumberInput.Input />
            </NumberInput.Root>
            <Field.HelperText>When searching, this will limit maximum number of results to show.</Field.HelperText>
          </VStack>
        </HStack>
      </Field.Root>

      <Field.Root>
        <HStack alignItems="start" width="full">
          <Field.Label width="100px" mt={2}>
            GPS timeout:
          </Field.Label>
          <VStack alignItems="start">
            <NumberInput.Root
              size="sm"
              value={((settings?.gpsActiveDuration ?? DEFAULT_GPS_ACTIVE_DURATION) / 1000).toString()}
              onValueChange={handleUpdateGpsActiveSeconds}
              min={10}
              max={3600}
            >
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input />
            </NumberInput.Root>
            <Field.HelperText>Determines how many seconds the GPS beacon will stay active for.</Field.HelperText>
          </VStack>
        </HStack>
      </Field.Root>
    </VStack>
  );
}
