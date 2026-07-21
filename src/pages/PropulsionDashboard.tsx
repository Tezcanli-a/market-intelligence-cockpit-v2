import React, { useState, useMemo } from 'react';
import { useCsvData } from '../hooks/useCsvData';
import { useFilters } from '../context/FilterContext';
import { FilterBar } from '../components/FilterBar';
import { FilterChips } from '../components/FilterChips';
import { KpiCard } from '../components/KpiCard';
import { DashboardCard } from '../components/DashboardCard';
import { DetailTable } from '../components/DetailTable';
import { getUniqueValues } from '../utils/csvHelpers';
import { formatNumber, formatPercent } from '../utils/formatting';
import { toNumber } from '../utils/formatting';
import { isNEV } from '../utils/colors';

export const PropulsionDashboard: React.FC = () => {
  const { data, loading, error } = useCsvData('data/Dashboard_data_Propulsion.csv');
  const { filters, setFilter, setFilters } = useFilters();
  const [search, setSearch] = useState('');

  const filterOptions = useMemo(() => {
    if (!data) return {};

    return {
      region: getUniqueValues(data.rows, 'Region'),
      country: getUniqueValues(data.rows, 'Country'),
      manufacturer: getUniqueValues(data.rows, 'Manufacturer'),
      brand: getUniqueValues(data.rows, 'Brand'),
      propulsion: getUniqueValues(data.rows, 'Propulsion'),
      year: getUniqueValues(data.rows, 'Year'),
    };
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.rows.filter((row) => {
      if (filters.region && row['Region'] !== filters.region) return false;
      if (filters.country && row['Country'] !== filters.country) return false;
      if (filters.manufacturer && row['Manufacturer'] !== filters.manufacturer) return false;
      if (filters.brand && row['Brand'] !== filters.brand) return false;
      if (filters.propulsion && row['Propulsion'] !== filters.propulsion) return false;
      if (filters.year && row['Year'] !== filters.year) return false;

      if (search) {
        const searchLower = search.toLowerCase();
        const nameplate = String(row['Nameplate'] || '').toLowerCase();
        if (!nameplate.includes(searchLower)) return false;
      }

      return true;
    });
  }, [data, filters, search]);

  const kpis = useMemo(() => {
    if (!filteredData.length) {
      return { totalVolume: 0, bevShare: 0, phevShare: 0, iceShare: 0, nevShare: 0 };
    }

    const totalVolume = filteredData.reduce(
      (sum, row) => sum + toNumber(row['Volume'] || 0),
      0
    );

    const bevVolume = filteredData
      .filter((row) => row['Propulsion']?.toUpperCase() === 'BEV')
      .reduce((sum, row) => sum + toNumber(row['Volume'] || 0), 0);

    const phevVolume = filteredData
      .filter((row) => row['Propulsion']?.toUpperCase() === 'PHEV')
      .reduce((sum, row) => sum + toNumber(row['Volume'] || 0), 0);

    const iceVolume = filteredData
      .filter((row) => !isNEV(row['Propulsion']))
      .reduce((sum, row) => sum + toNumber(row['Volume'] || 0), 0);

    const nevVolume = filteredData
      .filter((row) => isNEV(row['Propulsion']))
      .reduce((sum, row) => sum + toNumber(row['Volume'] || 0), 0);

    return {
      totalVolume,
      bevShare: totalVolume > 0 ? (bevVolume / totalVolume) * 100 : 0,
      phevShare: totalVolume > 0 ? (phevVolume / totalVolume) * 100 : 0,
      iceShare: totalVolume > 0 ? (iceVolume / totalVolume) * 100 : 0,
      nevShare: totalVolume > 0 ? (nevVolume / totalVolume) * 100 : 0,
    };
  }, [filteredData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-brand-muted">Loading propulsion data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-semibold">Error loading data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const handleResetFilters = () => {
    setFilters({});
    setSearch('');
  };

  return (
    <div>
      <FilterBar
        filters={[
          { key: 'region', label: 'Region', options: filterOptions.region || [] },
          { key: 'country', label: 'Country', options: filterOptions.country || [] },
          { key: 'manufacturer', label: 'Manufacturer', options: filterOptions.manufacturer || [] },
          { key: 'brand', label: 'Brand', options: filterOptions.brand || [] },
          { key: 'propulsion', label: 'Propulsion', options: filterOptions.propulsion || [] },
          { key: 'year', label: 'Year', options: filterOptions.year || [] },
        ]}
        values={filters}
        onFilterChange={setFilter}
        onSearchChange={setSearch}
        searchValue={search}
      />

      <FilterChips
        filters={filters}
        totalRecords={filteredData.length}
        onClearFilter={(key) => setFilter(key, null)}
        onResetAll={handleResetFilters}
      />

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <KpiCard
            title="Total Volume"
            value={formatNumber(kpis.totalVolume)}
            subtitle="vehicles"
          />
          <KpiCard
            title="BEV Share"
            value={formatPercent(kpis.bevShare, 1)}
            subtitle="battery electric"
          />
          <KpiCard
            title="PHEV Share"
            value={formatPercent(kpis.phevShare, 1)}
            subtitle="plug-in hybrid"
          />
          <KpiCard
            title="ICE Share"
            value={formatPercent(kpis.iceShare, 1)}
            subtitle="internal combustion"
          />
          <KpiCard
            title="NEV Share"
            value={formatPercent(kpis.nevShare, 1)}
            subtitle="new energy vehicles"
          />
        </div>

        {/* Detail Table */}
        <DashboardCard title="Propulsion Details" subtitle="All filtered records">
          <DetailTable
            data={filteredData}
            columns={[
              { key: 'Brand', label: 'Brand' },
              { key: 'Manufacturer', label: 'Manufacturer' },
              { key: 'Propulsion', label: 'Propulsion' },
              { key: 'Year', label: 'Year' },
              { key: 'Country', label: 'Country' },
              { key: 'Volume', label: 'Volume', numeric: true },
            ]}
            defaultSortBy="Volume"
          />
        </DashboardCard>
      </div>
    </div>
  );
};
