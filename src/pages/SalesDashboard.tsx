import React, { useState, useMemo } from 'react';
import { useCsvData } from '../hooks/useCsvData';
import { useFilters } from '../context/FilterContext';
import { FilterBar } from '../components/FilterBar';
import { FilterChips } from '../components/FilterChips';
import { KpiCard } from '../components/KpiCard';
import { DashboardCard } from '../components/DashboardCard';
import { DetailTable } from '../components/DetailTable';
import { extractYearColumns, getUniqueValues } from '../utils/csvHelpers';
import { formatNumber } from '../utils/formatting';
import { toNumber } from '../utils/formatting';

export const SalesDashboard: React.FC = () => {
  const { data, loading, error } = useCsvData('data/Dashboard_data_LV sales.csv');
  const { filters, setFilter, setFilters, resetFilters } = useFilters();
  const [search, setSearch] = useState('');
  const [defaultFiltersSet, setDefaultFiltersSet] = useState(false);

  const yearColumns = useMemo(() => {
    if (!data) return [];
    return extractYearColumns(data.headers);
  }, [data]);

  React.useEffect(() => {
    if (!defaultFiltersSet && data) {
      setFilter('focusYear', yearColumns.length > 0 ? yearColumns[0].year.toString() : '2025');
      setDefaultFiltersSet(true);
    }
  }, [data, defaultFiltersSet, setFilter, yearColumns]);

  const filterOptions = useMemo(() => {
    if (!data) return {};

    return {
      region: getUniqueValues(data.rows, 'Region'),
      country: getUniqueValues(data.rows, 'Country'),
      manufacturer: getUniqueValues(data.rows, 'Manufacturer'),
      brand: getUniqueValues(data.rows, 'Maker'),
      model: getUniqueValues(data.rows, 'Model'),
      year: getUniqueValues(data.rows, 'Year'),
      powertrain: getUniqueValues(data.rows, 'Powertrain'),
    };
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.rows.filter((row) => {
      if (filters.region && row['Region'] !== filters.region) return false;
      if (filters.country && row['Country'] !== filters.country) return false;
      if (filters.manufacturer && row['Manufacturer'] !== filters.manufacturer) return false;
      if (filters.brand && row['Maker'] !== filters.brand) return false;
      if (filters.model && row['Model'] !== filters.model) return false;
      if (filters.year && row['Year'] !== filters.year) return false;
      if (filters.powertrain && row['Powertrain'] !== filters.powertrain) return false;

      if (search) {
        const searchLower = search.toLowerCase();
        const model = String(row['Model'] || '').toLowerCase();
        if (!model.includes(searchLower)) return false;
      }

      return true;
    });
  }, [data, filters, search]);

  const kpis = useMemo(() => {
    const totalSales = filteredData.reduce((sum, row) => sum + toNumber(row['Sales'] || 0), 0);
    return { totalSales };
  }, [filteredData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-brand-muted">Loading sales data...</p>
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

  const focusYearOptions = yearColumns.map((y) => y.year.toString());

  return (
    <div>
      <FilterBar
        filters={[
          { key: 'region', label: 'Region', options: filterOptions.region || [] },
          { key: 'country', label: 'Country', options: filterOptions.country || [] },
          { key: 'manufacturer', label: 'Manufacturer', options: filterOptions.manufacturer || [] },
          { key: 'brand', label: 'Brand', options: filterOptions.brand || [] },
          { key: 'model', label: 'Model', options: filterOptions.model || [] },
          { key: 'year', label: 'Year', options: filterOptions.year || [] },
          { key: 'powertrain', label: 'Powertrain', options: filterOptions.powertrain || [] },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            title="Total Sales"
            value={formatNumber(kpis.totalSales)}
            subtitle="vehicles"
          />
          <KpiCard
            title="Records"
            value={filteredData.length}
            subtitle="matching filters"
          />
        </div>

        {/* Detail Table */}
        <DashboardCard title="Sales Details" subtitle="All filtered records">
          <DetailTable
            data={filteredData}
            columns={[
              { key: 'Maker', label: 'Brand' },
              { key: 'Model', label: 'Model' },
              { key: 'Year', label: 'Year' },
              { key: 'Powertrain', label: 'Powertrain' },
              { key: 'Country', label: 'Country' },
              { key: 'Sales', label: 'Sales', numeric: true },
            ]}
          />
        </DashboardCard>
      </div>
    </div>
  );
};
