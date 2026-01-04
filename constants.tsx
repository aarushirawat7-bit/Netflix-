
import React from 'react';
import { LayoutDashboard, Film, Tv, Globe, Tag, ShieldCheck, Clock } from 'lucide-react';

export const COLORS = {
  primary: '#E50914', // Netflix Red
  secondary: '#221F1F', // Netflix Black
  accent: '#F5F5F1', // Off-white
  movie: '#3b82f6', // Blue
  tv: '#10b981', // Emerald
  neutral: '#94a3b8'
};

export const KPI_ICONS = {
  total: <LayoutDashboard size={20} />,
  movie: <Film size={20} />,
  tv: <Tv size={20} />,
  recent: <Clock size={20} />,
  globe: <Globe size={20} />,
  genre: <Tag size={20} />,
  safety: <ShieldCheck size={20} />
};

export const SAMPLE_CSV_DATA = `show_id,type,title,director,cast,country,date_added,release_year,rating,duration,listed_in,description
s1,Movie,Dick Johnson Is Dead,Kirsten Johnson,,United States,"September 25, 2021",2020,PG-13,90 min,Documentaries,As her father nears the end of his life...
s2,TV Show,Blood & Water,,,"South Africa, Nigeria","September 24, 2021",2021,TV-MA,2 Seasons,"International TV Shows, TV Dramas, TV Mysteries",After crossing paths at a party...
s3,TV Show,Ganglands,Julien Leclercq,"Sami Bouajila, Tracy Gotoas",France,"September 24, 2021",2021,TV-MA,1 Season,"Crime TV Shows, International TV Shows, TV Action & Adventure",To protect his family...
s4,TV Show,Jailbirds New Orleans,,,"United States","September 24, 2021",2021,TV-MA,1 Season,"Docuseries, Reality TV",Feuds and flirtations...
s5,TV Show,Kota Factory,,,"India","September 24, 2021",2021,TV-MA,2 Seasons,"International TV Shows, Romantic TV Shows, TV Comedies",In a city known for its coaching centers...
s6,TV Show,Midnight Mass,Mike Flanagan,"Kate Siegel, Zach Gilford",United States,"September 24, 2021",2021,TV-MA,1 Season,"TV Dramas, TV Horror, TV Mysteries",The arrival of a charismatic young priest...
s7,Movie,My Little Pony: A New Generation,Robert Cullen,"Vanessa Hudgens, Kimiko Glenn",,"September 24, 2021",2021,PG,91 min,"Children & Family Movies",Equestria has lost its magic...
s8,Movie,Sankofa,Haile Gerima,"Kofi Ghanaba, Oyafunmike Ogunlano","United States, Ghana",,"September 24, 2021",1993,TV-MA,125 min,"Dramas, Independent Movies, International Movies",On a photo shoot in Ghana...
s9,TV Show,The Great British Baking Show,Andy Devonshire,Mel Giedroyc,United Kingdom,"September 24, 2021",2021,TV-14,9 Seasons,"British TV Shows, Reality TV",A talented batch of amateur bakers...
s10,Movie,The Starling,Theodore Melfi,"Melissa McCarthy, Chris O'Dowd",United States,"September 24, 2021",2021,PG-13,104 min,"Comedies, Dramas",A woman adjusting to life after a loss...`;
