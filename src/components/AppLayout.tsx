import { useState } from 'react';
import { LogOut, Package, Droplets, Share2, Settings, LayoutDashboard, Briefcase, User, Menu, X, Shield } from 'lucide-react';
import { KasaInfo } from './LoginPage';
import type { Personnel } from '@/types/personnel';

interface UserSession {
  kasa: KasaInfo;
  personnel: Personnel;
}

interface LayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
  session: UserSession;
  onLogout: () => void;
}

const TABS = [
  { id: 'dashboard', label: 'Panolar', icon: LayoutDashboard, hideForGeneralManager: false },
  { id: 'packages', label: 'Paketler', icon: Package, hideForGeneralManager: false },
  { id: 'aquarium', label: 'Rapor', icon: Droplets, hideForGeneralManager: true },
  { id: 'crosssales', label: 'Çapraz Satış', icon: Share2, hideForGeneralManager: true },
  { id: 'settings', label: 'Ayarlar', icon: Settings, hideForGeneralManager: true },
  { id: 'admin', label: 'Admin Panel', icon: Shield, requiresGeneralManager: true },
];

export default function AppLayout({ activeTab, onTabChange, children, session, onLogout }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Kasa renklerini belirle
  const getKasaColor = () => {
    switch (session.kasa.id) {
      case 'wildpark': return 'text-green-400';
      case 'sinema': return 'text-purple-400';
      case 'face2face': return 'text-cyan-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg border border-gray-700"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Left Sidebar - Compact */}
      <div className={`fixed md:relative w-64 bg-gray-900/90 backdrop-blur-md border-r border-gray-700/50 flex flex-col h-screen z-40 transition-transform duration-300 shadow-2xl ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo/Title */}
        <div className="p-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
          <h1 className="text-xl font-bold text-white mb-5 tracking-tight">Günlük Rapor Sistemi</h1>
          
          {/* Kasa Info */}
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-3 text-gray-200 bg-gray-800/40 px-3 py-2 rounded-lg border border-gray-700/30">
              <Briefcase className={`w-4 h-4 ${getKasaColor()}`} />
              <span className={`${getKasaColor()} font-semibold`}>{session.kasa.name}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200 bg-gray-800/40 px-3 py-2 rounded-lg border border-gray-700/30">
              <User className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-sm">{session.personnel.fullName}</span>
            </div>
            {session.personnel.role === 'genel_mudur' && (
              <div className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-2 rounded-lg flex items-center gap-2 border border-yellow-500/30 font-medium">
                <Shield className="w-4 h-4" />
                Genel Müdür
              </div>
            )}
            {session.personnel.role === 'yonetici' && (
              <div className="text-xs bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg border border-blue-500/30 font-medium">
                Yönetici
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {TABS.map((tab) => {
            // Genel müdür yetkisi kontrolü
            if (tab.requiresGeneralManager && session.personnel.role !== 'genel_mudur') {
              return null;
            }
            
            // Genel müdür için gizli sekmeler
            if (tab.hideForGeneralManager && session.personnel.role === 'genel_mudur') {
              return null;
            }
            
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600/40 to-blue-600/20 text-white border border-blue-500/50 shadow-lg shadow-blue-500/20'
                    : 'text-gray-300 hover:bg-gray-800/60 hover:text-white border border-transparent hover:border-gray-700/30'
                } ${tab.requiresGeneralManager ? 'bg-yellow-900/10 border-yellow-700/30' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{tab.label}</span>
                {tab.requiresGeneralManager && (
                  <span className="text-xs bg-yellow-500/30 text-yellow-300 px-2 py-1 rounded font-bold">
                    GM
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700/50">
          <button 
            onClick={onLogout}
            className="w-full bg-gradient-to-r from-red-600/30 to-red-600/20 text-red-300 hover:from-red-600/40 hover:to-red-600/30 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium border border-red-600/30 hover:border-red-500/50 shadow-lg hover:shadow-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full md:w-auto">
        <div className="pt-16 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
