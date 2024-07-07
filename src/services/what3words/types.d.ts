type LatLng = {
  lat: number;
  lng: number;
};

export type Response = {
  country: string;
  square: {
    northeast: LatLng;
    southwest: LatLng;
  };
  nearestPlace: string;
  coordinates: LatLng;
  words: string;
  language: string;
  map: string;
};
