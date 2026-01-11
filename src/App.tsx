import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardTab from '@/components/DashboardTab';
import PackagesTab from '@/components/PackagesTab';
import AquariumTab from '@/components/AquariumTab';
import CrossSalesTab from '@/components/CrossSalesTab';
import SettingsTab from '@/components/SettingsTab';
import AdminPanel from '@/components/AdminPanel';
import LoginPage, { KasaInfo } from '@/components/LoginPage';
import { initializeFirebaseData, isFirebaseInitialized } from '@/utils/initializeFirebase';
import type { Personnel } from '@/types/personnel';

type TabType = 'dashboard' | 'packages' | 'aquarium' | 'crosssales' | 'settings' | 'admin';

interface UserSession {
  kasa: KasaInfo;
  personnel: Personnel;
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
    
    // Firebase'i başlat (geliştirme için her zaman çalışır)
    console.log('🚀 Firebase başlatma başlıyor...');
    initializeFirebaseData().catch((error) => {
      console.error('❌ Firebase başlatma hatası:', error);
    });
  }, []);

  // Login işlemi
  const handleLogin = (kasa: KasaInfo, personnel: Personnel) => {
    const newSession: UserSession = { kasa, personnel };
    setSession(newSession);
    localStorage.setItem('userSession', JSON.stringify(newSession));
    localStorage.setItem('currentUserName', personnel.fullName);
    localStorage.setItem('currentUserId', personnel.id);
    localStorage.setItem('currentKasaId', kasa.id);
    localStorage.setItem('currentKasaName', kasa.name);
    localStorage.setItem('currentKasaTitle', kasa.title);
    localStorage.setItem('currentKasaPaxName', kasa.paxName);
    
    // Genel müdür için admin panel'i aç, diğerleri için dashboard
    if (personnel.role === 'genel_mudur') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Logout işlemi
  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('userSession');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserId');
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
      case 'admin':
        return <AdminPanel />;
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
