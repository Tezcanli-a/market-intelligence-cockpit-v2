import React, { useState, useMemo } from 'react';
import { useCsvData } from '../hooks/useCsvData';
import { useFilters } from '../context/FilterContext';
import { NewsCard } from '../components/NewsCard';
import { getUniqueValues } from '../utils/csvHelpers';

export const NewsDashboard: React.FC = () => {
  const { data, loading, error } = useCsvData('data/Dashboard_data_news.csv');
  const { filters, setFilter, setFilters } = useFilters();
  const [search, setSearch] = useState('');
  const [defaultsSet, setDefaultsSet] = useState(false);

  // Set Auto as default on first load
  React.useEffect(() => {
    if (!defaultsSet && data) {
      setFilter('vehicleType', 'Auto');
      setDefaultsSet(true);
    }
  }, [data, defaultsSet, setFilter]);

  const filterOptions = useMemo(() => {
    if (!data) return {};

    return {
      section: getUniqueValues(data.rows, 'Section'),
      vehicleType: getUniqueValues(data.rows, 'Auto / CV'),
    };
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.rows.filter((row) => {
      if (filters.vehicleType && row['Auto / CV'] !== filters.vehicleType) return false;
      if (filters.section && row['Section'] !== filters.section) return false;

      if (search) {
        const searchLower = search.toLowerCase();
        const headline = String(row['Headline'] || '').toLowerCase();
        const summary = String(row['Summary'] || '').toLowerCase();
        const company = String(row['Company'] || '').toLowerCase();
        if (
          !headline.includes(searchLower) &&
          !summary.includes(searchLower) &&
          !company.includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters, search]);

  // Group by section and get top 3 per section
  const newsBySection = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    // Sort by date descending (newest first)
    const sorted = [...filteredData].sort((a, b) => {
      const dateA = new Date(a['Publication Date'] || 0).getTime();
      const dateB = new Date(b['Publication Date'] || 0).getTime();
      return dateB - dateA;
    });

    // Group by section
    for (const item of sorted) {
      const section = item['Section'] || 'Other';
      if (!grouped[section]) {
        grouped[section] = [];
      }
      if (grouped[section].length < 3) {
        grouped[section].push(item);
      }
    }

    return grouped;
  }, [filteredData]);

  // Generate highlights from summary or headline
  const getHighlights = (item: any): string[] => {
    const highlights = [];

    // If there's a summary/highlight column, use it
    if (item['Highlights']) {
      const h = String(item['Highlights'] || '');
      if (h) return h.split('•').map((s) => s.trim()).filter(Boolean).slice(0, 3);
    }

    // Generate from headline and context
    const headline = item['Headline'] || '';
    const summary = item['Summary'] || '';

    if (summary) {
      const sentences = summary.split(/[.!?]+/).filter((s) => s.trim());
      highlights.push(...sentences.slice(0, 2));
    } else {
      // Default highlights from headline
      highlights.push(`News about ${item['Company'] || 'automotive'} market developments`);
      highlights.push('Market intelligence for strategic decision making');
    }

    return highlights.slice(0, 3).map((h) => h.trim());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-brand-muted">Loading news data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-semibold">Error loading news data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const handleResetFilters = () => {
    setFilters({ vehicleType: 'Auto' });
    setSearch('');
  };

  return (
    <div>
      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase mb-1">
                Vehicle Type
              </label>
              <select
                value={filters.vehicleType || 'Auto'}
                onChange={(e) => setFilter('vehicleType', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-brand-body hover:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-20 transition-colors"
              >
                <option value="">All Types</option>
                {filterOptions.vehicleType &&
                  filterOptions.vehicleType.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase mb-1">
                Section
              </label>
              <select
                value={filters.section || ''}
                onChange={(e) => setFilter('section', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-brand-body hover:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-20 transition-colors"
              >
                <option value="">All Sections</option>
                {filterOptions.section &&
                  filterOptions.section.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-brand-body placeholder-gray-400 hover:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-20 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      {(filters.vehicleType || filters.section || search) && (
        <div className="bg-white border-b border-gray-200 px-8 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 items-center">
              {filters.vehicleType && (
                <div className="inline-flex items-center gap-2 bg-brand-secondary bg-opacity-20 text-brand-primary px-3 py-1 rounded-full text-sm font-medium">
                  <span>
                    <strong>Type:</strong> {filters.vehicleType}
                  </span>
                  <button
                    onClick={() => setFilter('vehicleType', null)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}
              {filters.section && (
                <div className="inline-flex items-center gap-2 bg-brand-secondary bg-opacity-20 text-brand-primary px-3 py-1 rounded-full text-sm font-medium">
                  <span>
                    <strong>Section:</strong> {filters.section}
                  </span>
                  <button
                    onClick={() => setFilter('section', null)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}
              {search && (
                <div className="inline-flex items-center gap-2 bg-brand-secondary bg-opacity-20 text-brand-primary px-3 py-1 rounded-full text-sm font-medium">
                  <span>
                    <strong>Search:</strong> {search}
                  </span>
                  <button
                    onClick={() => setSearch('')}
                    className="hover:opacity-70 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}

              <button
                onClick={handleResetFilters}
                className="ml-4 px-3 py-1 bg-brand-primary text-white rounded text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News Cards */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {Object.keys(newsBySection).length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-brand-muted">No news articles found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(newsBySection).map(([section, news]) => (
              <div key={section}>
                <h2 className="text-2xl font-bold text-brand-body mb-4">{section}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {news.map((item, idx) => (
                    <NewsCard
                      key={`${section}-${idx}`}
                      headline={item['Headline'] || ''}
                      highlights={getHighlights(item)}
                      company={item['Company'] || ''}
                      date={item['Publication Date'] || ''}
                      source={item['Source'] || ''}
                      section={section}
                      articleUrl={item['URL'] || item['Link'] || undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
