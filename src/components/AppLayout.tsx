import { useState } from 'react';
import { LogOut, Package, Droplets, Share2, Settings, LayoutDashboard, Briefcase, User, Menu, X } from 'lucide-react';
import { KasaInfo } from './LoginPage';

interface UserSession {
  kasa: KasaInfo;
  userName: string;
}

interface LayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
  session: UserSession;
  onLogout: () => void;
}

const TABS = [
  { id: 'dashboard', label: 'Panolar', icon: LayoutDashboard },
  { id: 'packages', label: 'Paketler', icon: Package },
  { id: 'aquarium', label: 'Rapor', icon: Droplets },
  { id: 'crosssales', label: 'Çapraz Satış', icon: Share2 },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
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
      <div className={`fixed md:relative w-56 bg-gray-900/80 backdrop-blur-md border-r border-gray-800 flex flex-col h-screen z-40 transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo/Title */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold text-white mb-4">Günlük Rapor</h1>
          
          {/* Kasa Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Briefcase className={`w-4 h-4 ${getKasaColor()}`} />
              <span className={getKasaColor()}>{session.kasa.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4 text-green-400" />
              <span>{session.userName}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 text-sm ${
                  activeTab === tab.id
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                    : 'text-gray-300 hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className="w-full bg-red-600/20 text-red-400 hover:bg-red-600/30 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Çıkış
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
