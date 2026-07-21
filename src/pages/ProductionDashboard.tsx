import React, { useState, useMemo } from 'react';
import { useCsvData } from '../hooks/useCsvData';
import { useFilters } from '../context/FilterContext';
import { FilterBar } from '../components/FilterBar';
import { FilterChips } from '../components/FilterChips';
import { KpiCard } from '../components/KpiCard';
import { DashboardCard } from '../components/DashboardCard';
import { DetailTable } from '../components/DetailTable';
import {
  extractYearColumns,
  getUniqueValues,
  findColumn,
  validateRequiredColumns,
} from '../utils/csvHelpers';
import { formatNumber, formatPercent, formatCAGR } from '../utils/formatting';
import { toNumber } from '../utils/formatting';
import { calculateCAGR, groupAndSum, calculateShare, countUnique } from '../utils/aggregations';
import { isNEV } from '../utils/colors';

export const ProductionDashboard: React.FC = () => {
  const { data, loading, error } = useCsvData('data/Dashboard_data_LV production.csv');
  const { filters, setFilter, setFilters, resetFilters } = useFilters();
  const [search, setSearch] = useState('');

  // State for default filters
  const [defaultFiltersSet, setDefaultFiltersSet] = useState(false);

  const yearColumns = useMemo(() => {
    if (!data) return [];
    return extractYearColumns(data.headers);
  }, [data]);

  const focusYear = (filters.focusYear || '2025') as string;

  // Set default focus year on first load
  React.useEffect(() => {
    if (!defaultFiltersSet && data) {
      setFilter('focusYear', '2025');
      setDefaultFiltersSet(true);
    }
  }, [data, defaultFiltersSet, setFilter]);

  // Get filter options
  const filterOptions = useMemo(() => {
    if (!data) return {};

    return {
      region: getUniqueValues(data.rows, 'Region'),
      country: getUniqueValues(data.rows, 'Country/Territory'),
      salesGroup: getUniqueValues(data.rows, 'Sales Group'),
      brand: getUniqueValues(data.rows, 'Brand'),
      manufacturer: getUniqueValues(data.rows, 'Manufacturer'),
      productionType: getUniqueValues(data.rows, 'Production Type'),
      bodyType: getUniqueValues(data.rows, 'Body Type'),
      priceClass: getUniqueValues(data.rows, 'Regional Sales Price Class'),
    };
  }, [data]);

  // Filter data
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.rows.filter((row) => {
      if (filters.region && row['Region'] !== filters.region) return false;
      if (filters.country && row['Country/Territory'] !== filters.country) return false;
      if (filters.salesGroup && row['Sales Group'] !== filters.salesGroup) return false;
      if (filters.brand && row['Brand'] !== filters.brand) return false;
      if (filters.manufacturer && row['Manufacturer'] !== filters.manufacturer) return false;
      if (filters.productionType && row['Production Type'] !== filters.productionType)
        return false;
      if (filters.bodyType && row['Body Type'] !== filters.bodyType) return false;
      if (filters.priceClass && row['Regional Sales Price Class'] !== filters.priceClass)
        return false;

      if (search) {
        const searchLower = search.toLowerCase();
        const nameplate = String(row['Production Nameplate'] || '').toLowerCase();
        const plant = String(row['Plant'] || '').toLowerCase();
        if (!nameplate.includes(searchLower) && !plant.includes(searchLower)) return false;
      }

      return true;
    });
  }, [data, filters, search]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (!filteredData.length || !yearColumns.length) {
      return { production: 0, cagr: 0, nevShare: 0, nameplates: 0 };
    }

    // KPI 1: Focus Year Production
    const focusYearCol = yearColumns.find((y) => y.year.toString() === focusYear);
    const production = focusYearCol
      ? filteredData.reduce((sum, row) => sum + toNumber(row[focusYearCol.column]), 0)
      : 0;

    // KPI 2: CAGR 2025-2031
    const col2025 = yearColumns.find((y) => y.year === 2025);
    const col2031 = yearColumns.find((y) => y.year === 2031);
    const sum2025 = col2025
      ? filteredData.reduce((sum, row) => sum + toNumber(row[col2025.column]), 0)
      : 0;
    const sum2031 = col2031
      ? filteredData.reduce((sum, row) => sum + toNumber(row[col2031.column]), 0)
      : 0;
    const cagr = calculateCAGR(sum2025, sum2031, 6);

    // KPI 3: NEV Share in Focus Year
    const nevVolume = focusYearCol
      ? filteredData
          .filter((row) => isNEV(row['Propulsion']))
          .reduce((sum, row) => sum + toNumber(row[focusYearCol.column]), 0)
      : 0;
    const nevShare = production > 0 ? (nevVolume / production) * 100 : 0;

    // KPI 4: Active Nameplates
    const nameplates = new Set(
      filteredData
        .filter((row) => {
          if (!focusYearCol) return false;
          return toNumber(row[focusYearCol.column]) > 0;
        })
        .map((row) => row['Production Nameplate'])
    ).size;

    return { production, cagr, nevShare, nameplates };
  }, [filteredData, yearColumns, focusYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-brand-muted">Loading production data...</p>
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
    setFilters({
      focusYear: '2025',
    });
    setSearch('');
  };

  const focusYearOptions = yearColumns.map((y) => y.year.toString());

  return (
    <div>
      <FilterBar
        filters={[
          { key: 'region', label: 'Region', options: filterOptions.region || [] },
          { key: 'country', label: 'Country/Territory', options: filterOptions.country || [] },
          { key: 'salesGroup', label: 'Sales Group', options: filterOptions.salesGroup || [] },
          { key: 'brand', label: 'Brand', options: filterOptions.brand || [] },
          { key: 'manufacturer', label: 'Manufacturer', options: filterOptions.manufacturer || [] },
          {
            key: 'productionType',
            label: 'Production Type',
            options: filterOptions.productionType || [],
          },
          { key: 'bodyType', label: 'Body Type', options: filterOptions.bodyType || [] },
          {
            key: 'priceClass',
            label: 'Regional Sales Price Class',
            options: filterOptions.priceClass || [],
          },
          { key: 'focusYear', label: 'Focus Year', options: focusYearOptions },
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
            title={`${focusYear} Production`}
            value={formatNumber(kpis.production)}
            subtitle="vehicles"
          />
          <KpiCard
            title="2025–2031 CAGR"
            value={formatCAGR(kpis.cagr)}
            subtitle="compound annual growth"
          />
          <KpiCard
            title={`${focusYear} NEV Share`}
            value={formatPercent(kpis.nevShare, 1)}
            subtitle="of total production"
          />
          <KpiCard
            title="Active Nameplates"
            value={kpis.nameplates}
            subtitle="in selected year"
          />
        </div>

        {/* Detail Table */}
        <DashboardCard title="Production Details" subtitle="All filtered records">
          <DetailTable
            data={filteredData}
            columns={[
              { key: 'Brand', label: 'Brand' },
              { key: 'Production Nameplate', label: 'Nameplate' },
              { key: 'Plant', label: 'Plant' },
              { key: 'Propulsion', label: 'Propulsion' },
              { key: 'Global Sales Sub-Segment', label: 'Segment' },
              { key: 'SOP', label: 'SOP' },
              ...yearColumns.map((y) => ({
                key: y.column,
                label: y.year.toString(),
                numeric: true,
              })),
            ]}
            defaultSortBy={
              yearColumns.find((y) => y.year.toString() === focusYear)?.column
            }
          />
        </DashboardCard>
      </div>
    </div>
  );
};
