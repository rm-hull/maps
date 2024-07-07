export interface LatLng {
  lat: number;
  lng: number;
}

export interface Response {
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
}
