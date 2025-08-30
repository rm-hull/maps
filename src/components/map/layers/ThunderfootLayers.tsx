import { LayersControl, TileLayer } from "react-leaflet";

const THUNDERFOREST_API_KEY = import.meta.env.VITE_THUNDERFOREST_API_KEY as string | undefined;

export function ThunderfootLayers() {
  if (!THUNDERFOREST_API_KEY) {
    return null;
  }

  return (
    <>
      <LayersControl.BaseLayer name="Thunderforest: Atlas">
        <TileLayer url={`https://tile.thunderforest.com/atlas/{z}/{x}/{y}@2x.png?apikey=${THUNDERFOREST_API_KEY}`} />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Thunderforest: Landscape">
        <TileLayer
          url={`https://tile.thunderforest.com/landscape/{z}/{x}/{y}@2x.png?apikey=${THUNDERFOREST_API_KEY}`}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Thunderforest: Outdoors">
        <TileLayer url={`https://tile.thunderforest.com/outdoors/{z}/{x}/{y}@2x.png?apikey=${THUNDERFOREST_API_KEY}`} />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Thunderforest: Transport">
        <TileLayer
          url={`https://tile.thunderforest.com/transport/{z}/{x}/{y}@2x.png?apikey=${THUNDERFOREST_API_KEY}`}
        />
      </LayersControl.BaseLayer>
    </>
  );
}
