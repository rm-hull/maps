import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Link,
  Text,
} from "@chakra-ui/react";
import * as L from "leaflet";
import { useState } from "react";
import { IoLayersSharp } from "react-icons/io5";
import { useMap } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { BASE_LAYERS, LayerOption } from "../../../config/layer";
import { OverlaysControl } from "./OverlaysControl";

type ComponentProps = {
  selectedLayer: LayerOption;
  onMouseLeave: () => void;
  onLayerChanged: (layer: LayerOption) => void;
};

// TODO: better naming
function Component({ onMouseLeave, onLayerChanged, selectedLayer }: ComponentProps) {
  const selectedIndex = Object.values(BASE_LAYERS).findIndex((layers) => layers.some((l) => l === selectedLayer));
  return (
    <Box
      background="white"
      padding={0}
      borderWidth={2}
      borderColor="rgba(0,0,0,0.2)"
      color="rgba(0,0,0,0.5)"
      borderRadius={5}
      width={220}
      onMouseLeave={onMouseLeave}
    >
      <Accordion defaultIndex={selectedIndex}>
        {Object.entries(BASE_LAYERS).map(([provider, layers]) => (
          <AccordionItem key={provider}>
            <AccordionButton padding={1}>
              <Box as="span" flex="1" textAlign="left" padding={0}>
                {provider}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel padding={2}>
              {layers.map((layer) => (
                <Box display="inline-block" key={layer.name} marginRight={2}>
                  <Link size="md" onClick={() => onLayerChanged(layer)}>
                    <Text fontWeight={layer === selectedLayer ? "bold" : "default"}>{layer.name}</Text>
                  </Link>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
        <AccordionItem>
          <AccordionButton padding={1}>
            <Box as="span" flex="1" textAlign="left" padding={0}>
              Overlays
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel padding={2}>
            <OverlaysControl />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}

type BaseLayerControlProps = {
  initialLayer: LayerOption;
};

export function LayerControl({ initialLayer }: BaseLayerControlProps) {
  const [expanded, setExpanded] = useState(false);
  const map = useMap();
  const addTileLayers = (layerOption: LayerOption) =>
    layerOption.tiles.map((tile) => new L.TileLayer(tile.url, tile.options).addTo(map));

  const [tileLayers, setTileLayers] = useState<L.TileLayer[]>(addTileLayers(initialLayer));
  const [selectedLayer, setSelectedLayer] = useState<LayerOption>(initialLayer);

  const handlerBaseLayerChange = (layerOption: LayerOption) => {
    tileLayers.map((l) => map.removeLayer(l));
    const newLayers = addTileLayers(layerOption);
    setTileLayers(newLayers);
    setSelectedLayer(layerOption);
  };

  return (
    <Control position="topright">
      {expanded ? (
        <Component
          onMouseLeave={() => setExpanded(false)}
          selectedLayer={selectedLayer}
          onLayerChanged={handlerBaseLayerChange}
        />
      ) : (
        <Button
          background="white"
          variant="outline"
          padding={0}
          borderWidth={2}
          borderColor="rgba(0,0,0,0.2)"
          fontSize="1.5rem"
          color={"rgba(0,0,0,0.5)"}
          borderRadius={5}
          size="lg"
          onMouseOver={() => setExpanded(true)}
        >
          <IoLayersSharp />
        </Button>
      )}
    </Control>
  );
}
