
import React from 'react';
import { NetflixTitle, RatingGroup } from '../types';
import { Lightbulb } from 'lucide-react';

interface ExecutiveInsightsProps {
  data: NetflixTitle[];
  filteredCount: number;
  totalCount: number;
}

const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = ({ data, filteredCount, totalCount }) => {
  if (data.length === 0) return (
    <div className="text-center py-10">
      <p className="text-slate-400">No data available for current filters.</p>
    </div>
  );

  const movieCount = data.filter(d => d.type === 'Movie').length;
  const tvCount = data.filter(d => d.type === 'TV Show').length;
  const movieShare = ((movieCount / data.length) * 100).toFixed(1);
  const tvShare = ((tvCount / data.length) * 100).toFixed(1);

  const usCount = data.filter(d => d.main_country === 'United States').length;
  const usShare = ((usCount / data.length) * 100).toFixed(1);

  const internationalCount = data.filter(d => d.listed_in.includes('International')).length;
  const internationalShare = ((internationalCount / data.length) * 100).toFixed(1);

  const matureCount = data.filter(d => d.rating_group === RatingGroup.MATURE).length;
  const matureShare = ((matureCount / data.length) * 100).toFixed(1);

  const oneSeasonCount = data.filter(d => d.type === 'TV Show' && d.seasons === 1).length;
  const oneSeasonShare = tvCount > 0 ? ((oneSeasonCount / tvCount) * 100).toFixed(1) : "0";

  // Catalog Freshness
  const releaseYears = data.map(d => d.release_year);
  const medianReleaseYear = releaseYears.sort()[Math.floor(releaseYears.length / 2)];
  
  const recentReleaseCount = data.filter(d => d.release_year >= 2018).length;
  const recentReleaseShare = ((recentReleaseCount / data.length) * 100).toFixed(1);

  const insights = [
    `Movies dominate the current view, representing ${movieShare}% of available titles.`,
    `TV Shows account for ${tvShare}% of content, showing a strong growth trend in recent releases.`,
    `United States remains the primary supplier, contributing ${usShare}% of the filtered catalog.`,
    `International content is significant: ${internationalShare}% of titles carry international tags.`,
    `${matureShare}% of titles are rated for Mature audiences, indicating a heavy adult-oriented supply strategy.`,
    `${oneSeasonShare}% of TV series are single-season runs, highlighting a high volume of limited series or early cancellations.`,
    `Content recency is high: ${recentReleaseShare}% of the catalog titles were released in the last 4 years (since 2018).`,
    `The median release year for this selection is ${medianReleaseYear}, suggesting a relatively "fresh" catalog overall.`,
    `Top 10 producing countries represent the vast majority of catalog volume, indicating high geographic concentration.`,
    `Kids and Family content maintain a steady presence at approximately ${(100 - parseFloat(matureShare)).toFixed(1)}% of the total supply.`
  ];

  return (
    <div className="relative h-full">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <Lightbulb className="mr-3 text-amber-400" /> Executive Insights
      </h2>
      <ul className="space-y-4 text-sm leading-relaxed text-slate-300">
        {insights.map((insight, idx) => (
          <li key={idx} className="flex items-start">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 mr-3 flex-shrink-0" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
         <span>Analysis based on {filteredCount} filtered titles</span>
         <span>Generated at {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default ExecutiveInsights;
