import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardTab from '@/components/DashboardTab';
import PackagesTab from '@/components/PackagesTab';
import AquariumTab from '@/components/AquariumTab';
import CrossSalesTab from '@/components/CrossSalesTab';
import SettingsTab from '@/components/SettingsTab';
import LoginPage, { KasaInfo } from '@/components/LoginPage';

type TabType = 'dashboard' | 'packages' | 'aquarium' | 'crosssales' | 'settings';

interface UserSession {
  kasa: KasaInfo;
  userName: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [session, setSession] = useState<UserSession | null>(null);

  // Oturum bilgisini localStorage'dan yükle
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession));
      } catch {
        localStorage.removeItem('userSession');
      }
    }
  }, []);

  // Login işlemi
  const handleLogin = (kasa: KasaInfo, userName: string) => {
    const newSession: UserSession = { kasa, userName };
    setSession(newSession);
    localStorage.setItem('userSession', JSON.stringify(newSession));
    localStorage.setItem('currentUserName', userName);
    localStorage.setItem('currentKasaId', kasa.id);
    localStorage.setItem('currentKasaName', kasa.name);
    localStorage.setItem('currentKasaTitle', kasa.title);
    localStorage.setItem('currentKasaPaxName', kasa.paxName);
  };

  // Logout işlemi
  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('userSession');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentKasaId');
    localStorage.removeItem('currentKasaName');
    localStorage.removeItem('currentKasaTitle');
    localStorage.removeItem('currentKasaPaxName');
  };

  // Giriş yapılmamışsa login sayfasını göster
  if (!session) {
    return <LoginPage onLogin={handleLogin} />;
  }

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
    <AppLayout 
      activeTab={activeTab} 
      onTabChange={(tab: string) => setActiveTab(tab as TabType)}
      session={session}
      onLogout={handleLogout}
    >
      {renderContent()}
    </AppLayout>
  );
}
