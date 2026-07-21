# Market Intelligence Cockpit v2

> Interactive automotive market intelligence dashboard built with React, TypeScript, Vite, and Recharts. Designed for management and sales review with support for multiple CSV data sources.

## 🎯 Project Overview

Market Intelligence Cockpit v2 is a standalone web dashboard for automotive market analysis. It provides four integrated dashboards:

1. **Production Dashboard** - S&P/IHS Light Vehicle production forecasts (2025-2031)
2. **Sales Dashboard** - Light Vehicle sales analysis by brand, model, and region
3. **Propulsion Dashboard** - Powertrain development and NEV share tracking
4. **News Dashboard** - Automotive market news and intelligence briefings

**Key Features:**
- ✅ No backend required - runs entirely in the browser
- ✅ CSV-based data loading with intelligent parsing
- ✅ Cross-connected filters with real-time KPI updates
- ✅ Sortable and scrollable data tables
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ GitHub Pages deployment ready

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Tezcanli-a/market-intelligence-cockpit-v2.git
cd market-intelligence-cockpit-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
market-intelligence-cockpit-v2/
├── public/                          # Static assets
├── data/                            # CSV data files
│   ├── Dashboard_data_LV production.csv
│   ├── Dashboard_data_LV sales.csv
│   ├── Dashboard_data_Propulsion.csv
│   └── Dashboard_data_news.csv
├── src/
│   ├── components/                  # Reusable React components
│   │   ├── Header.tsx
│   │   ├── NavigationTabs.tsx
│   │   ├── FilterBar.tsx
│   │   ├── FilterChips.tsx
│   │   ├── KpiCard.tsx
│   │   ├── DashboardCard.tsx
│   │   ├── DetailTable.tsx
│   │   ├── NewsCard.tsx
│   │   └── charts/
│   │       └── ProductionTrendChart.tsx
│   ├── context/
│   │   └── FilterContext.tsx        # Global filter state management
│   ├── hooks/
│   │   └── useCsvData.ts            # CSV loading hook
│   ├── pages/                       # Dashboard pages
│   │   ├── ProductionDashboard.tsx
│   │   ├── SalesDashboard.tsx
│   │   ├── PropulsionDashboard.tsx
│   │   └── NewsDashboard.tsx
│   ├── utils/
│   │   ├── colors.ts                # Color system and propulsion categories
│   │   ├── formatting.ts            # Number and date formatting
│   │   ├── csvHelpers.ts            # CSV parsing utilities
│   │   └── aggregations.ts          # Data aggregation functions
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # React entry point
│   └── index.css                    # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md
```

---

## 📊 CSV Data Format

### Expected Column Names

The app automatically handles column name variations and spaces. Ensure your CSV files include these core columns:

#### Dashboard_data_LV production.csv
- **Region**, **Country/Territory**, **Sales Group**, **Brand**, **Manufacturer**
- **Production Type**, **Body Type**, **Production Nameplate**, **Plant**
- **Propulsion**, **Global Sales Sub-Segment**, **Regional Sales Segment**
- **Regional Sales Price Class**, **SOP**
- **Year columns**: 2025, 2026, 2027, 2028, 2029, 2030, 2031

#### Dashboard_data_LV sales.csv
- **Region**, **Country**, **Manufacturer**, **Maker**, **Model**, **Year**
- **Powertrain**, **Sales** (or volume column)

#### Dashboard_data_Propulsion.csv
- **Region**, **Country**, **Manufacturer**, **Brand**, **Propulsion**, **Year**
- **Volume** (or similar volume column)

#### Dashboard_data_news.csv
- **Headline**, **Summary** (or **Highlights**), **Company**
- **Publication Date**, **Source**, **Section**, **Auto / CV**
- **URL** (optional - for "Read Article" links)

### Data Requirements

- ✅ Column headers must be in the first row
- ✅ Spaces in file names are supported (e.g., "Dashboard_data_LV production.csv")
- ✅ Numbers can be stored as text; they'll be converted automatically
- ✅ Empty cells are handled gracefully
- ✅ Commas in numbers are supported
- ✅ Leading/trailing spaces in headers and values are trimmed

---

## 🔄 Monthly Data Refresh

### How to Update CSV Files

1. **Export new CSV files** from your S&P/IHS or source system
2. **Save with exact filenames**:
   - `Dashboard_data_LV production.csv`
   - `Dashboard_data_LV sales.csv`
   - `Dashboard_data_Propulsion.csv`
   - `Dashboard_data_news.csv`
3. **Replace files** in the `/data` folder
4. **Test locally**:
   ```bash
   npm run dev
   ```
5. **Compare KPIs** with your source Excel or pivot table:
   - Total Production / Sales volumes
   - CAGR calculations
   - NEV shares
   - Top brand rankings
6. **Deploy** when validation is complete

### Validation Checklist

After refreshing data, verify:
- [ ] KPI totals match source data
- [ ] CAGR calculations are correct
- [ ] Filters load all unique values
- [ ] Detail tables show expected row counts
- [ ] No console errors in browser DevTools
- [ ] All dashboards render without errors

---

## 🎨 Design System

The cockpit uses a cohesive design system:

**Colors:**
- Primary Blue: `#005195`
- Secondary Blue: `#C4DAEC`
- Background: `#F4F6F8`
- Card Background: `#FFFFFF`
- Header Background: `#0B2540`

**Propulsion Category Colors** (consistent across all dashboards):
- ICEss: Grey
- MHEV: Blue-grey
- FHEV: Teal
- PHEV: Purple
- REEV: Green
- BEV: Dark Blue
- FCEV: Red

**Typography:**
- Headlines: Bold, large
- Labels: Small caps, semibold
- Body: Regular weight, readable

---

## 🔌 Dashboard Features

### Production Dashboard
- **Filters**: Region, Country, Sales Group, Brand, Manufacturer, Production Type, Body Type, Price Class, Focus Year
- **KPIs**: 
  - [Focus Year] Production
  - 2025–2031 CAGR
  - [Focus Year] NEV Share
  - Active Nameplates
- **Table**: Sortable, scrollable detail table with year-by-year volumes

### Sales Dashboard
- **Filters**: Region, Country, Manufacturer, Brand, Model, Year, Powertrain
- **KPIs**: Total Sales, Record Count
- **Table**: Sortable detail table with brand, model, year, and sales data

### Propulsion Dashboard
- **Filters**: Region, Country, Manufacturer, Brand, Propulsion, Year
- **KPIs**: Total Volume, BEV Share, PHEV Share, ICE Share, NEV Share
- **Table**: Sortable detail table with propulsion breakdown

### News Dashboard
- **Filters**: Vehicle Type (Auto/CV), Section, Search
- **Default**: Auto vehicle type selected on load
- **Layout**: Latest 3 news articles per section
- **Features**: 
  - AI-generated highlights
  - Color-coded section badges
  - "Read Article" links (if URL available)
  - Search across headlines, summaries, and companies

---

## 🛠️ Development

### Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Composable charting library
- **PapaParse** - CSV parsing
- **Zustand** - State management (lightweight alternative to Redux)

### Key Utilities

**Formatting:**
- `formatNumber()` - Convert numbers to X.XM, Xk, or whole numbers
- `formatPercent()` - Format percentages with configurable decimals
- `formatCAGR()` - Format CAGR with 2 decimals
- `formatDate()` - Convert dates to "18 Jul 2026" format

**CSV Parsing:**
- `fetchAndParseCSV()` - Load and parse CSV files
- `extractYearColumns()` - Identify year columns automatically
- `getUniqueValues()` - Extract filter options from data
- `normalizeColumnName()` - Handle column name variations

**Aggregations:**
- `calculateCAGR()` - Compound annual growth rate
- `groupAndSum()` - Group by field and sum values
- `calculateShare()` - Calculate percentage share
- `countUnique()` - Count distinct values

### Adding New Charts

Create a new chart component in `src/components/charts/`:

```typescript
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface MyChartProps {
  data: any[];
}

export const MyChart: React.FC<MyChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        {/* Chart config */}
      </BarChart>
    </ResponsiveContainer>
  );
};
```

Then import and use in a dashboard page.

---

## 📱 Responsiveness

The layout adapts to screen size:

| Screen | Layout |
|--------|--------|
| **Desktop** (1200px+) | 4 KPI cards in one row, 2-column chart grid |
| **Tablet** (768px–1199px) | 2 KPI cards per row, 1-2 column chart grid |
| **Mobile** (<768px) | 1 KPI card per row, 1 column chart grid, horizontal table scroll |

---

## 🚀 GitHub Pages Deployment

### Prerequisites

- GitHub repository (already created)
- GitHub Pages enabled in repository settings

### Deployment Steps

1. **Update base path in `vite.config.ts`** (if deploying to a subdirectory):
   ```typescript
   export default defineConfig({
     base: './', // or '/cockpit/' for https://username.github.io/cockpit/
     ...
   })
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages** (using gh-pages package, or manual):
   ```bash
   npm install --save-dev gh-pages
   ```

   Add to `package.json`:
   ```json
   {
     "homepage": "https://username.github.io/market-intelligence-cockpit-v2",
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

   Then run:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `/(root)`
   - Save

5. Your cockpit will be live at: `https://username.github.io/market-intelligence-cockpit-v2`

### Important Notes for GitHub Pages

- CSV files must be in the `public/data/` folder (not `data/`)
- The app uses relative paths (`./data/filename.csv`)
- After deployment, test each dashboard tab
- If data doesn't load, check browser Console for 404 errors

---

## 🐛 Troubleshooting

### Data Not Loading

**Problem**: "Error loading CSV"

**Solutions:**
1. Check CSV file exists in `/data/` folder
2. Verify exact filename spelling (case-sensitive on Linux/Mac)
3. Check browser Console (F12) for 404 errors
4. Ensure CSV is valid (open in Excel to verify)

### Filters Not Working

**Problem**: Filter dropdowns are empty

**Solutions:**
1. Verify CSV column names match expected fields
2. Check that data rows are not empty
3. Inspect browser Console for warnings about missing columns
4. Use `validateRequiredColumns()` utility to debug

### Numbers Not Formatting

**Problem**: Large numbers show as raw values

**Solutions:**
1. Ensure numeric columns contain numbers or numeric strings
2. Check `formatNumber()` utility in `src/utils/formatting.ts`
3. Verify no text is mixed into numeric columns

### Performance Issues

**Problem**: Dashboard is slow with large datasets (>100k rows)

**Solutions:**
1. Reduce number of rows (filter in source before export)
2. Pre-aggregate data before import
3. Consider pagination for detail tables
4. Use browser DevTools Performance tab to profile

---

## 📝 Environment Variables

No environment variables required. The app runs entirely in the browser.

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 👥 Support

For issues or feature requests:
1. Check the Troubleshooting section above
2. Review browser Console (F12) for error messages
3. Verify CSV data format
4. Check column names against expected schema

---

## 🎓 Development Tips

### Useful Shortcuts

**Clear Filters:**
- Click the filter chip ✕ button
- Or click "Reset Filters" button

**Sort Tables:**
- Click any column header
- Click again to reverse sort direction

**Search:**
- Type in search box to filter by nameplate or plant (Production)
- Search works across multiple fields (News)

### Code Organization

- **Components**: Reusable UI elements (buttons, cards, tables, charts)
- **Pages**: Full-screen dashboards (Production, Sales, Propulsion, News)
- **Hooks**: React hooks for data loading and state management
- **Utils**: Pure functions for formatting, parsing, aggregations
- **Context**: Global filter state shared across components

### Best Practices

✅ Keep components small and focused
✅ Use TypeScript for type safety
✅ Memoize expensive calculations with `useMemo`
✅ Handle loading and error states
✅ Format numbers consistently using utils
✅ Provide tooltips on hover (Recharts does this automatically)
✅ Test with various data sizes
✅ Validate CSV column names on load

---

## 📚 Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [PapaParse](https://www.papaparse.com)

---

**Version**: 1.0.0  
**Last Updated**: July 2026
