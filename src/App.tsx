import React, { useState } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { ProductionDashboard } from './pages/ProductionDashboard';
import { SalesDashboard } from './pages/SalesDashboard';
import { PropulsionDashboard } from './pages/PropulsionDashboard';
import { NewsDashboard } from './pages/NewsDashboard';
import { FilterProvider } from './context/FilterContext';

function App() {
  const [activeTab, setActiveTab] = useState('production');

  const renderContent = () => {
    switch (activeTab) {
      case 'production':
        return <ProductionDashboard />;
      case 'sales':
        return <SalesDashboard />;
      case 'propulsion':
        return <PropulsionDashboard />;
      case 'news':
        return <NewsDashboard />;
      default:
        return <ProductionDashboard />;
    }
  };

  return (
    <FilterProvider>
      <div className="min-h-screen bg-brand-bg">
        <Header />
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1">{renderContent()}</div>
      </div>
    </FilterProvider>
  );
}

export default App;
