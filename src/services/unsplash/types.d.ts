
interface Photo {
  id: string;
  created_at: string;
  updated_at: string;
  urls: {
    full: string;
    raw: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description?: string;
  blur_hash?: string;
  color?: string;
  description?: string;
  height: number;
  likes: number;
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  promoted_at?: string;
  width: number;
  user: {
    id: string;
    name: string;
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
      portfolio: string;
    };
  };
}

export interface Response {
  results: Photo[];
  total: number;
  total_pages: number;
}
