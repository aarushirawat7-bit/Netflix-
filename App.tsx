
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import { 
  Plus, Download, Filter, FileSpreadsheet, AlertCircle, 
  ChevronDown, BarChart3, TrendingUp, Globe2, Shapes, 
  Users, Activity, Printer, Info
} from 'lucide-react';
import { NetflixTitle, FilterState, RatingGroup } from './types';
import { processData, explodeGenres } from './services/dataProcessor';
import { SAMPLE_CSV_DATA, COLORS, KPI_ICONS } from './constants';

import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [data, setData] = useState<NetflixTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sidebar / Filter State
  const [filters, setFilters] = useState<FilterState>({
    type: 'All',
    releaseYearRange: [1920, 2021],
    addedYearRange: [2008, 2021],
    countries: [],
    genres: [],
    ratingGroups: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load sample data initially
    Papa.parse(SAMPLE_CSV_DATA, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const processed = processData(results.data);
        setData(processed);
        setLoading(false);
      },
      error: (err) => {
        setError(`Failed to parse initial data: ${err.message}`);
        setLoading(false);
      }
    });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const processed = processData(results.data);
        setData(processed);
        
        // Reset filters based on new data range
        const releaseYears = processed.map(d => d.release_year).filter(y => !isNaN(y));
        const addedYears = processed.map(d => d.added_year).filter(y => y !== undefined) as number[];
        
        setFilters(prev => ({
          ...prev,
          releaseYearRange: [Math.min(...releaseYears), Math.max(...releaseYears)],
          addedYearRange: addedYears.length > 0 ? [Math.min(...addedYears), Math.max(...addedYears)] : [2008, 2021],
          countries: [],
          genres: [],
          ratingGroups: []
        }));
        
        setLoading(false);
        setError(null);
      },
      error: (err) => {
        setError(`Error parsing CSV: ${err.message}`);
        setLoading(false);
      }
    });
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchType = filters.type === 'All' || item.type === filters.type;
      const matchRelease = item.release_year >= filters.releaseYearRange[0] && item.release_year <= filters.releaseYearRange[1];
      const matchAdded = !item.added_year || (item.added_year >= filters.addedYearRange[0] && item.added_year <= filters.addedYearRange[1]);
      const matchCountry = filters.countries.length === 0 || filters.countries.includes(item.main_country);
      const matchGenre = filters.genres.length === 0 || item.listed_in.split(',').some(g => filters.genres.includes(g.trim()));
      const matchRating = filters.ratingGroups.length === 0 || filters.ratingGroups.includes(item.rating_group);
      
      return matchType && matchRelease && matchAdded && matchCountry && matchGenre && matchRating;
    });
  }, [data, filters]);

  const exportFilteredData = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'netflix_filtered_supply.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Netflix Catalog Supply Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">
            {data.length.toLocaleString()} titles | Snapshot through 2021 | Interactive Filters
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors border border-slate-200"
          >
            <Plus className="mr-2" size={16} /> Upload CSV
          </button>
          <button 
            onClick={exportFilteredData}
            className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Download className="mr-2" size={16} /> Export CSV
          </button>
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-colors border border-slate-200"
          >
            <Printer className="mr-2" size={16} /> Print View
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 bg-white border-r border-slate-200 p-6 no-print overflow-y-auto max-h-screen lg:sticky lg:top-[81px]">
          <div className="flex items-center text-slate-900 font-bold mb-6">
            <Filter size={18} className="mr-2 text-indigo-600" />
            <span>Global Filters</span>
          </div>

          <div className="space-y-8">
            {/* Content Type */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Content Type</label>
              <div className="flex rounded-lg border border-slate-200 p-1 bg-slate-50">
                {['All', 'Movie', 'TV Show'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilters({ ...filters, type: t })}
                    className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                      filters.type === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t === 'TV Show' ? 'TV' : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Release Year Slider (Simplified) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Release Year Range</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="number" 
                  value={filters.releaseYearRange[0]}
                  onChange={e => setFilters({...filters, releaseYearRange: [parseInt(e.target.value), filters.releaseYearRange[1]]})}
                  className="w-1/2 p-2 border border-slate-200 rounded text-sm bg-slate-50"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="number" 
                  value={filters.releaseYearRange[1]}
                  onChange={e => setFilters({...filters, releaseYearRange: [filters.releaseYearRange[0], parseInt(e.target.value)]})}
                  className="w-1/2 p-2 border border-slate-200 rounded text-sm bg-slate-50"
                />
              </div>
            </div>

            {/* Country Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Countries</label>
              <select 
                multiple
                value={filters.countries}
                // Fix: Properly handle multiple selection and type casting for the selected options collection
                onChange={e => {
                  const options = e.target.selectedOptions;
                  const values: string[] = Array.from(options).map(option => (option as HTMLOptionElement).value);
                  setFilters({...filters, countries: values});
                }}
                className="w-full h-32 p-2 border border-slate-200 rounded text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              >
                {Array.from(new Set(data.map(d => d.main_country))).sort().map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-slate-400 italic">Hold Ctrl/Cmd to select multiple</p>
            </div>

            {/* Rating Group */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Audience Rating</label>
              <div className="space-y-2">
                {Object.values(RatingGroup).map(rg => (
                  <label key={rg} className="flex items-center text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={filters.ratingGroups.includes(rg)}
                      onChange={e => {
                        const next = e.target.checked 
                          ? [...filters.ratingGroups, rg]
                          : filters.ratingGroups.filter(x => x !== rg);
                        setFilters({...filters, ratingGroups: next});
                      }}
                      className="mr-2 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {rg}
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setFilters({
                type: 'All',
                releaseYearRange: [1920, 2021],
                addedYearRange: [2008, 2021],
                countries: [],
                genres: [],
                ratingGroups: []
              })}
              className="w-full py-2 px-4 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Dashboard Content */}
        <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="text-slate-500 font-medium">Crunching catalog data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start">
              <AlertCircle className="text-red-500 mr-3 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-bold">Data Loading Error</h3>
                <p className="text-red-600 text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-2 text-sm text-red-700 underline font-semibold">Retry</button>
              </div>
            </div>
          ) : (
            <Dashboard data={filteredData} totalUnfilteredCount={data.length} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
