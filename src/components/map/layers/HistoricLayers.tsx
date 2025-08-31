// https://mapseries-tilesets.s3.amazonaws.com/bartholomew_great_britain/13/4062/2632.png

import { LayerGroup, LayersControl, TileLayer } from "react-leaflet";

export function HistoricLayers() {
  return (
    <>
      {/* <LayersControl.BaseLayer name="OS One Inch 1st / Old Series, 1798-1878">
        <LayerGroup>
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/geological/sixinch2025/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/geological/sixincheng/{z}/{x}/{y}.png" />
        </LayerGroup>
      </LayersControl.BaseLayer> */}
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
      <LayersControl.BaseLayer name="OS 25 Inch, 1892-1914">
        <LayerGroup>
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/lincolnshire/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/nottinghamshire/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/25_inch/lancashire/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/yorkshire/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/Shrop_Derby/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/25_inch_holes_england/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/channel-islands/25-inch/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/wiltshire2nd/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/suffolk/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/cambridge/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/devon2nd/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/sussex/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/bedfordshire/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/dorset/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/london/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/kent/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/northumberland/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/hampshire/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/25_inch/great-yarmouth-addition/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/berkshire/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/25_inch_holes_england/104194125/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/25_inch_holes_england/104194119/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/25_inch_holes_england/135198775/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/middlesex/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/surrey/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/newcastle_addition/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/cornwall/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/huntingdon/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/rutland/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/25_inch_holes_england/103683170/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/essex/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/hertfordshire/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/somerset/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/25_inch/132280016/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/25_inch/edinburgh_west/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/hertfordshire/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/25_inch_holes_england/103676684/{z}/{x}/{y}.png" />
          <TileLayer url="https://mapseries-tilesets.s3.amazonaws.com/25_inch/london/{z}/{x}/{y}.png" />
          <TileLayer url="https://geo.nls.uk/mapdata3/os/25_inch_holes_england/104194125/{z}/{x}/{y}.png" />
        </LayerGroup>
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
