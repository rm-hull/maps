import { Accordion, Box, Button, Link, Text, VStack, Checkbox, Collapsible } from "@chakra-ui/react";
import * as L from "leaflet";
import { useCallback, useState, useRef } from "react";
import { IoLayersSharp } from "react-icons/io5";
import { useMap } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { baseLayers, LayerOption, OVERLAYS } from "../../../config/layer";
import { useGeneralSettings } from "../../../hooks/useGeneralSettings";

function OverlaySelector() {
  const map = useMap();
  const [settings, updateSettings] = useGeneralSettings();
  const handleOverlayChange = (name: string, checked: boolean | "indeterminate") => {
    if (checked !== "indeterminate") {
      updateSettings({
        ...settings,
        overlays: {
          ...settings?.overlays,
          [name]: checked,
        },
      });
    }
  };

  const zoom = map.getZoom();

  return (
    <VStack align="start" gap={1}>
      {Object.entries(OVERLAYS).map(([name, cfg]) => (
        <Checkbox.Root
          key={name}
          checked={settings?.overlays?.[name] ?? false}
          onCheckedChange={(e) => handleOverlayChange(name, e.checked)}
          disabled={zoom > (cfg.maxZoom ?? map.getMaxZoom()) || zoom <= cfg.minZoom}
          size="sm"
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label truncate>{name}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </VStack>
  );
}

type BaseLayerAccordionProps = {
  selectedLayer: LayerOption;
  onLayerChanged: (layer: LayerOption) => void;
};

function BaseLayerAccordion({ onLayerChanged, selectedLayer }: BaseLayerAccordionProps) {
  return (
    <Box
      background="white"
      padding={0}
      borderWidth={2}
      borderColor="rgba(0,0,0,0.2)"
      color="rgba(0,0,0,0.5)"
      borderRadius={5}
      width={220}
    >
      <Accordion.Root defaultValue={[selectedLayer.provider]}>
        {baseLayers.group().map(([provider, layers]) => (
          <Accordion.Item key={provider} value={provider}>
            <Accordion.ItemTrigger padding={1}>
              <Box as="span" flex="1" textAlign="left" padding={0}>
                {provider}
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody padding={2} maxHeight={200} overflowY="auto">
                {layers.map((layer) => (
                  <Box key={layer.name} display="inline-block" marginRight={2}>
                    <Link onClick={() => onLayerChanged(layer)}>
                      <Text fontSize={14} fontWeight={layer === selectedLayer ? "bold" : "default"}>
                        {layer.name}
                      </Text>
                    </Link>
                  </Box>
                ))}
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
        <Accordion.Item value="overlays">
          <Accordion.ItemTrigger padding={1}>
            <Box as="span" flex="1" textAlign="left" padding={0}>
              Overlays
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody padding={2} maxHeight={200} overflowY="auto">
              <OverlaySelector />
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Box>
  );
}

type LayersProps = {
  defaultLayer: LayerOption;
};

export function Layers({ defaultLayer }: LayersProps) {
  const [expanded, setExpanded] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const map = useMap();

  const addTileLayers = useCallback(
    (layerOption: LayerOption) => layerOption.tiles.map((tile) => L.tileLayer(tile.url, tile.options).addTo(map)),
    [map]
  );

  const [tileLayers, setTileLayers] = useState<L.TileLayer[]>(() => addTileLayers(defaultLayer));
  const [selected, setSelected] = useState<LayerOption>(defaultLayer);

  const handleBaseLayerChange = useCallback(
    (layerOption: LayerOption) => {
      if (layerOption === selected) {
        return;
      }
      tileLayers.forEach((l) => map.removeLayer(l));
      const newLayers = addTileLayers(layerOption);
      setTileLayers(newLayers);
      setSelected(layerOption);
    },
    [addTileLayers, map, selected, tileLayers]
  );

  const handleMouseLeave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setExpanded(false);
    }, 200);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  return (
    <Control position="topright">
      <Box position="relative">
        <Collapsible.Root open={expanded} unmountOnExit>
          <Collapsible.Content>
            <Box
              position="absolute"
              top={0}
              right={220}
              width="100%"
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
            >
              <BaseLayerAccordion selectedLayer={selected} onLayerChanged={handleBaseLayerChange} />
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>
        <Collapsible.Root open={!expanded} unmountOnExit>
          <Collapsible.Content>
            <Box position="absolute" top={0} right={11} width="100%">
              <Button
                background="white"
                variant="outline"
                padding={0}
                borderWidth={2}
                borderColor="rgba(0,0,0,0.2)"
                fontSize="1.5rem"
                color="rgba(0,0,0,0.5)"
                borderRadius={5}
                size="lg"
                onMouseOver={() => setExpanded(true)}
              >
                <IoLayersSharp />
              </Button>
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>
      </Box>
    </Control>
  );
}
