
import React from 'react';
import { NetflixTitle, RatingGroup } from '../types';
import KPICard from './KPICard';
import ExecutiveInsights from './ExecutiveInsights';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie, Legend, LabelList
} from 'recharts';
import { 
  BarChart3, TrendingUp, Globe2, Shapes, 
  Users, Activity, Info 
} from 'lucide-react';
import { COLORS, KPI_ICONS } from '../constants';
import { explodeGenres } from '../services/dataProcessor';

interface DashboardProps {
  data: NetflixTitle[];
  totalUnfilteredCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ data, totalUnfilteredCount }) => {
  // --- CALCULATIONS ---
  const movieCount = data.filter(d => d.type === 'Movie').length;
  const tvCount = data.filter(d => d.type === 'TV Show').length;
  const movieShare = ((movieCount / data.length) * 100).toFixed(1);
  const tvShare = ((tvCount / data.length) * 100).toFixed(1);
  
  const recentCount = data.filter(d => d.release_year >= 2013).length;
  const recentShare = ((recentCount / data.length) * 100).toFixed(1);
  
  const usShare = ((data.filter(d => d.main_country === 'United States').length / data.length) * 100).toFixed(1);
  
  const internationalCount = data.filter(d => d.listed_in.includes('International')).length;
  const internationalShare = ((internationalCount / data.length) * 100).toFixed(1);
  
  const matureCount = data.filter(d => d.rating_group === RatingGroup.MATURE).length;
  const matureShare = ((matureCount / data.length) * 100).toFixed(1);

  // Peak years
  const releaseYearCounts = data.reduce((acc, curr) => {
    acc[curr.release_year] = (acc[curr.release_year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  // Fix: Explicitly type entries to avoid arithmetic errors during subtraction
  const peakReleaseYear = (Object.entries(releaseYearCounts) as [string, number][])
    .sort((a, b) => b[1] - a[1])[0] || [0, 0];

  const addedYearCounts = data.reduce((acc, curr) => {
    if (curr.added_year) acc[curr.added_year] = (acc[curr.added_year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  // Fix: Explicitly type entries to avoid arithmetic errors during subtraction
  const peakAddedYear = (Object.entries(addedYearCounts) as [string, number][])
    .sort((a, b) => b[1] - a[1])[0] || [0, 0];

  // --- DATA PREP FOR CHARTS ---

  // 1a. Content Mix Bar
  const mixData = [
    { name: 'Movies', value: movieCount, fill: COLORS.movie },
    { name: 'TV Shows', value: tvCount, fill: COLORS.tv }
  ];

  // 1b. TV Share Trend
  const trendData = Object.keys(releaseYearCounts).sort().map(yearStr => {
    const yr = parseInt(yearStr);
    const yrData = data.filter(d => d.release_year === yr);
    const yrTv = yrData.filter(d => d.type === 'TV Show').length;
    return {
      year: yr,
      tvShare: yrData.length > 0 ? (yrTv / yrData.length) * 100 : 0,
      total: yrData.length
    };
  }).filter(d => d.year > 2000);

  // 3a. Countries
  const countryCounts = data.reduce((acc, curr) => {
    acc[curr.main_country] = (acc[curr.main_country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  // Fix: Explicitly type count properties to avoid arithmetic errors
  const topCountries = (Object.entries(countryCounts) as [string, number][])
    .map(([country, count]) => ({ country, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const explodedGenres = explodeGenres(data).slice(0, 15);

  // 5a. Ratings
  const ratingData = Object.values(RatingGroup).map(rg => ({
    name: rg,
    value: data.filter(d => d.rating_group === rg).length
  })).filter(d => d.value > 0);

  // 6a. Formats
  const tvSeasons = data.filter(d => d.type === 'TV Show' && d.seasons).map(d => d.seasons!);
  const seasonCounts = tvSeasons.reduce((acc, curr) => {
    const key = curr >= 5 ? '5+' : curr.toString();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  const seasonData = Object.entries(seasonCounts).map(([s, count]) => ({ name: s === '1' ? '1 Season' : `${s} Seasons`, count }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* KPI Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9 gap-4 no-print">
        <KPICard label="Total Titles" value={data.length} icon={KPI_ICONS.total} color="bg-slate-900" />
        <KPICard label="Movie Share" value={`${movieShare}%`} subValue={`${movieCount} titles`} icon={KPI_ICONS.movie} color="bg-blue-600" />
        <KPICard label="TV Share" value={`${tvShare}%`} subValue={`${tvCount} titles`} icon={KPI_ICONS.tv} color="bg-emerald-600" />
        <KPICard label="Released 2013+" value={`${recentShare}%`} icon={KPI_ICONS.recent} color="bg-amber-600" />
        <KPICard label="Peak Release" value={peakReleaseYear[0]} subValue={`${peakReleaseYear[1]} titles`} icon={KPI_ICONS.recent} color="bg-indigo-600" />
        <KPICard label="Peak Added" value={peakAddedYear[0]} subValue={`${peakAddedYear[1]} titles`} icon={KPI_ICONS.total} color="bg-purple-600" />
        <KPICard label="US Share" value={`${usShare}%`} icon={KPI_ICONS.globe} color="bg-red-600" />
        <KPICard label="Int'l Tagged" value={`${internationalShare}%`} icon={KPI_ICONS.genre} color="bg-teal-600" />
        <KPICard label="Mature Supply" value={`${matureShare}%`} icon={KPI_ICONS.safety} color="bg-rose-600" />
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Row 1: Content Mix & Trend */}
        <div className="xl:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
            <BarChart3 size={16} className="mr-2 text-indigo-500" /> Content Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mixData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">Breakdown of catalog titles by format type</p>
        </div>

        <div className="xl:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
            <TrendingUp size={16} className="mr-2 text-indigo-500" /> TV Show Share Trend (since 2000)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.tv} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={COLORS.tv} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis unit="%" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="tvShare" name="TV Share" stroke={COLORS.tv} fillOpacity={1} fill="url(#colorTv)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4">
             <p className="text-xs text-slate-500">Historical shift towards TV episodic content</p>
             <div className="flex items-center text-xs font-bold text-emerald-600">
                Current Trend: Increasing {trendData[trendData.length-1]?.tvShare.toFixed(0)}% TV Share in {trendData[trendData.length-1]?.year}
             </div>
          </div>
        </div>

        {/* Row 2: Geography & Executive Insights */}
        <div className="xl:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
            <Globe2 size={16} className="mr-2 text-indigo-500" /> Top 10 Countries by Supply
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topCountries} margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                <YAxis dataKey="country" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={100} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                  <LabelList dataKey="count" position="right" style={{ fontSize: '10px', fill: '#64748b', fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-6 bg-slate-900 text-slate-100 p-6 rounded-xl shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Info size={120} />
           </div>
           <ExecutiveInsights data={data} filteredCount={data.length} totalCount={totalUnfilteredCount} />
        </div>

        {/* Row 3: Genres & Recency */}
        <div className="xl:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
            <Shapes size={16} className="mr-2 text-indigo-500" /> Top 15 Genres (Multi-count Exploded)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={explodedGenres}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="genre" axisLine={false} tickLine={false} tick={{ fontSize: 9, angle: -45, textAnchor: 'end' } as any} height={80} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
            <Users size={16} className="mr-2 text-indigo-500" /> Audience Suitability
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ratingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[
                      '#E50914', '#B81D24', '#221F1F', '#454545', '#7F7F7F', '#B3B3B3'
                    ][index % 6]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 4: Format Details */}
        <div className="xl:col-span-12 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
            <Activity size={16} className="mr-2 text-indigo-500" /> TV Show Lifecycle (Seasons)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill={COLORS.tv} radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 mt-4">Analysis of series duration: High volume of single-season content reflects market strategy for limited runs.</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
