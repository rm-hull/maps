import { Accordion, Box, Link, Text, VStack, Checkbox, Collapsible, HStack } from "@chakra-ui/react";
import * as L from "leaflet";
import { useCallback, useState, useRef } from "react";
import { BsBadgeHd } from "react-icons/bs";
import { IoLayersSharp } from "react-icons/io5";
import { useMap } from "react-leaflet";
import { ControlButton } from "@/components/ControlButton";
import { useColorModeValue } from "@/components/ui/color-mode";
import {
  baseLayers,
  LayerOption,
  type Tile,
  type Overlay,
  OVERLAYS,
  isHighDefinitionTileSet,
} from "../../../config/layer";
import { useGeneralSettings } from "../../../hooks/useGeneralSettings";
import { Control } from "../Control";
import "@maplibre/maplibre-gl-leaflet";

function OverlaySelector() {
  const map = useMap();
  const { settings, updateSettings } = useGeneralSettings();
  const handleOverlayChange = useCallback(
    (name: string, checked: boolean | "indeterminate") => {
      if (checked !== "indeterminate") {
        updateSettings({
          ...settings,
          overlays: {
            ...settings?.overlays,
            [name]: checked,
          },
        });
      }
    },
    [settings, updateSettings]
  );

  const zoom = map.getZoom();

  return (
    <VStack align="start" gap={1}>
      {Object.entries(OVERLAYS).map(([name, cfg]) => (
        <OverlayCheckbox
          key={name}
          name={name}
          cfg={cfg}
          zoom={zoom}
          isChecked={settings?.overlays?.[name] ?? false}
          onCheckedChange={handleOverlayChange}
          maxZoom={map.getMaxZoom()}
        />
      ))}
    </VStack>
  );
}

type OverlayCheckboxProps = {
  name: string;
  cfg: Overlay;
  zoom: number;
  maxZoom: number;
  isChecked: boolean;
  onCheckedChange: (name: string, checked: boolean | "indeterminate") => void;
};

function OverlayCheckbox({ name, cfg, zoom, maxZoom, isChecked, onCheckedChange }: OverlayCheckboxProps) {
  const handleCheckedChange = useCallback(
    (e: { checked: boolean | "indeterminate" }) => {
      onCheckedChange(name, e.checked);
    },
    [name, onCheckedChange]
  );

  return (
    <Checkbox.Root
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      disabled={zoom > (cfg.maxZoom ?? maxZoom) || zoom <= cfg.minZoom}
      size="sm"
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label truncate maxWidth={180}>
        {name}
      </Checkbox.Label>
    </Checkbox.Root>
  );
}

type BaseLayerAccordionProps = {
  selectedLayer: LayerOption;
  onLayerChanged: (layer: LayerOption) => void;
};

function BaseLayerAccordion({ onLayerChanged, selectedLayer }: BaseLayerAccordionProps) {
  const handleLayerChange = useCallback((layer: LayerOption) => () => onLayerChanged(layer), [onLayerChanged]);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("blackAlpha.400", "whiteAlpha.400");
  const defaultColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  return (
    <Box
      background={bgColor}
      padding={0}
      borderWidth={2}
      borderColor={borderColor}
      color={defaultColor}
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
                  <Box key={layer.name} display="inline-block" marginRight={3}>
                    <HStack gap={0}>
                      <Link onClick={handleLayerChange(layer)}>
                        <Text fontSize={14} fontWeight={layer === selectedLayer ? "bold" : "default"}>
                          {layer.name}
                        </Text>
                      </Link>
                      {isHighDefinitionTileSet(layer.tiles[0]) && (
                        <Box as="span" marginLeft={1} color="fg.subtle">
                          <BsBadgeHd />
                        </Box>
                      )}
                    </HStack>
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
            <Accordion.ItemBody padding={2} maxHeight={200} overflowY="auto" overflowX="hidden">
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

function createLayer(tile: Tile): L.Layer {
  return tile.type === "raster"
    ? L.tileLayer(tile.url, tile.options)
    : L.maplibreGL({ style: tile.url, minZoom: tile.options?.minZoom, maxZoom: tile.options?.maxZoom });
}

export function Layers({ defaultLayer }: LayersProps) {
  const [expanded, setExpanded] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const map = useMap();

  const addTileLayers = useCallback(
    (layerOption: LayerOption) => layerOption.tiles.map((tile) => createLayer(tile).addTo(map)),
    [map]
  );

  const [tileLayers, setTileLayers] = useState<L.Layer[]>(() => addTileLayers(defaultLayer));
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

  const expandMenu = useCallback(() => setExpanded(true), []);

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
              <ControlButton onMouseEnter={expandMenu}>
                <IoLayersSharp />
              </ControlButton>
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>
      </Box>
    </Control>
  );
}
