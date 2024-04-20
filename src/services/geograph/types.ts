export interface Response {
  generator: string;
  title: string;
  description: string;
  icon: string;
  date: Date;
  items: Item[];
  link: string;
  nextURL: string;
  syndicationURL: string;
}

interface Item {
  title: string;
  description: string;
  link: string;
  author: string;
  category: string;
  guid: string;
  source: string;
  date: number;
  imageTaken: string;
  dateUpdated: number;
  tags: string[];
  lat: string;
  long: string;
  thumb: string;
  thumbTag: string;
  licence: string;
}
