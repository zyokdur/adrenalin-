import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardTab from '@/components/DashboardTab';
import PackagesTab from '@/components/PackagesTab';
import AquariumTab from '@/components/AquariumTab';
import CrossSalesTab from '@/components/CrossSalesTab';
import SettingsTab from '@/components/SettingsTab';

type TabType = 'dashboard' | 'packages' | 'aquarium' | 'crosssales' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'packages':
        return <PackagesTab />;
      case 'aquarium':
        return <AquariumTab />;
      case 'crosssales':
        return <CrossSalesTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={(tab: string) => setActiveTab(tab as TabType)}>
      {renderContent()}
    </AppLayout>
  );
}
