
export interface Result {
  geoNameId?: number,
  title: string,
  summary: string,
  feature?: string,
  lang: string,
  countryCode?: string,
  rank: number,
  thumbnailImg?: string,
  wikipediaUrl: string,
  lat: number,
  lng: number,
  elevation: number
}