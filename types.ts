
export interface NetflixTitle {
  show_id: string;
  type: 'Movie' | 'TV Show';
  title: string;
  director: string;
  cast: string;
  country: string;
  date_added: string;
  release_year: number;
  rating: string;
  duration: string;
  listed_in: string;
  description: string;
  // Derived fields
  added_date?: Date;
  added_year?: number;
  added_month?: number;
  main_country: string;
  duration_min?: number;
  seasons?: number;
  primary_genre: string;
  rating_group: RatingGroup;
  catalog_lag?: number;
}

export enum RatingGroup {
  KIDS = 'Kids',
  FAMILY = 'Family',
  TEEN = 'Teen/Young Adult',
  MATURE = 'Mature',
  UNRATED = 'Unrated/Not Rated',
  UNKNOWN = 'Unknown'
}

export interface FilterState {
  type: string;
  releaseYearRange: [number, number];
  addedYearRange: [number, number];
  countries: string[];
  genres: string[];
  ratingGroups: string[];
}
