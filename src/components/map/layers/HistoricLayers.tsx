// https://mapseries-tilesets.s3.amazonaws.com/bartholomew_great_britain/13/4062/2632.png

import { LayerGroup, LayersControl, TileLayer } from "react-leaflet";

export function HistoricLayers() {
  return (
    <>
      <LayersControl.BaseLayer name="Bartholomew Half Inch 1897-1907">
        <TileLayer
          url="https://mapseries-tilesets.s3.amazonaws.com/bartholomew_great_britain/{z}/{x}/{y}.png"
          maxZoom={15}
          maxNativeZoom={15}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Bartholomew Half Inch 1940-1947">
        <TileLayer
          url="https://mapseries-tilesets.s3.amazonaws.com/bartholomew/great_britain_1940s/{z}/{x}/{y}.png"
          maxZoom={14}
          maxNativeZoom={14}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OS One Inch, 1885-1900">
        <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/1inch_2nd_ed/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OS 25 Inch, 1892-1914 (Yorkshire)">
        <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/yorkshire/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OS 1:25,000 1937-1961">
        <TileLayer url="https://api.maptiler.com/tiles/uk-osgb25k1937/{z}/{x}/{y}.jpg?key=7Y0Q1ck46BnB8cXXXg8X" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OS 1:1,250 A,B,C ed., 1948-1973">
        <LayerGroup>
          <TileLayer url="https://geo.nls.uk/mapdata3/os/1250_A_1/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/maps/os/1250_B_1eng/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/maps/os/1250_C/{x}/{y}.png" />
        </LayerGroup>
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OS 1:2,500 A ed., 1948-1974">
        <LayerGroup>
          <TileLayer url="https://geo.nls.uk/maps/os/2500_A_3D/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata2/os/2500_A_1D/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata2/os/2500_A_1S/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata2/os/2500_A_2D/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata2/os/2500_A_3S/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata2/os/2500_A_4S/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata2/os/2500_A_6D/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/2500_1974/{z}/{x}/{y}.png" />
        </LayerGroup>
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="2nd Land Utilization Svy., 1:10k 1960s">
        <TileLayer url="https://geo.nls.uk/mapdata2/lus_10k/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      {/* <LayersControl.BaseLayer name="Bartholomew's Half Inch to the Mile (c. 1914)">
        <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/bartholomew_half_inch/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Bartholomew's Quarter Inch to the Mile (c. 1914)">
        <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/bartholomew_quarter_inch/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Bartholomew's One Inch to the Mile (c. 1914)">
        <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/bartholomew_one_inch/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Ordnance Survey One Inch (c. 1950s)">
        <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/os_one_inch/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Ordnance Survey 1:2500 (c. 1930s-1960s)">
        <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/os_2500/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Ordnance Survey 1:10,000 (c. 1930s-1960s)">
        <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/os_10000/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer> */}
    </>
  );
}
