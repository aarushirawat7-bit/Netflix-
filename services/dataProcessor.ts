
import { NetflixTitle, RatingGroup } from '../types';

export const getRatingGroup = (rating: string | null): RatingGroup => {
  if (!rating) return RatingGroup.UNKNOWN;
  const r = rating.toUpperCase();
  if (['TV-Y', 'TV-Y7', 'TV-Y7-FV', 'G'].includes(r)) return RatingGroup.KIDS;
  if (['TV-G', 'PG', 'TV-PG'].includes(r)) return RatingGroup.FAMILY;
  if (['PG-13', 'TV-14'].includes(r)) return RatingGroup.TEEN;
  if (['R', 'NC-17', 'TV-MA'].includes(r)) return RatingGroup.MATURE;
  if (['NR', 'UR'].includes(r)) return RatingGroup.UNRATED;
  return RatingGroup.UNKNOWN;
};

export const processData = (rawData: any[]): NetflixTitle[] => {
  return rawData.map(row => {
    let { rating, duration, type, country, listed_in, date_added, release_year } = row;
    
    // 2) Fix data issue: rating contains duration
    if (rating && (rating.includes('min') || rating.includes('Season')) && (!duration || duration === "")) {
      duration = rating;
      rating = null;
    }

    // 1) Parse date_added
    let addedDate: Date | undefined;
    let addedYear: number | undefined;
    let addedMonth: number | undefined;
    if (date_added) {
      addedDate = new Date(date_added.trim());
      if (!isNaN(addedDate.getTime())) {
        addedYear = addedDate.getFullYear();
        addedMonth = addedDate.getMonth() + 1;
      }
    }

    // 3) main_country
    const countries = country ? country.split(',').map((c: string) => c.trim()) : [];
    const main_country = countries.length > 0 ? countries[0] : 'Unknown';

    // 4) duration split
    let duration_min: number | undefined;
    let seasons: number | undefined;
    if (type === 'Movie' && duration) {
      duration_min = parseInt(duration.replace(' min', '')) || undefined;
    } else if (type === 'TV Show' && duration) {
      seasons = parseInt(duration.split(' ')[0]) || undefined;
    }

    // 5) primary_genre
    const genres = listed_in ? listed_in.split(',').map((g: string) => g.trim()) : [];
    const primary_genre = genres.length > 0 ? genres[0] : 'Unknown';

    // 7) rating_group
    const rating_group = getRatingGroup(rating);

    // Derived: catalog lag
    const catalog_lag = (addedYear && release_year) ? addedYear - parseInt(release_year) : undefined;

    return {
      ...row,
      release_year: parseInt(release_year),
      added_date: addedDate,
      added_year: addedYear,
      added_month: addedMonth,
      main_country,
      duration_min,
      seasons,
      primary_genre,
      rating_group,
      catalog_lag,
      duration: duration || ""
    };
  });
};

export const explodeGenres = (data: NetflixTitle[]): { genre: string, count: number }[] => {
  const counts: Record<string, number> = {};
  data.forEach(item => {
    const genres = item.listed_in.split(',').map(g => g.trim());
    genres.forEach(g => {
      counts[g] = (counts[g] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
};
