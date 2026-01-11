import { useState, useEffect } from 'react';
import { AlertCircle, Settings, Info } from 'lucide-react';

export default function SettingsTab() {
  const [kasaName, setKasaName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Kullanıcı bilgilerini yükle
    const currentKasaName = localStorage.getItem('currentKasaName') || 'Kasa';
    const session = localStorage.getItem('userSession');
    
    setKasaName(currentKasaName);
    
    if (session) {
      const userData = JSON.parse(session);
      setUserRole(userData.personnel?.role || 'personel');
      setUserName(userData.personnel?.fullName || '');
    }
  }, []);

  const isManager = userRole === 'yonetici';
  const isGeneralManager = userRole === 'genel_mudur';

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Ayarlar
          </h2>
          <p className="text-sm text-gray-400 mt-1">{kasaName}</p>
        </div>
        
        {/* Rol Göstergesi */}
        <div className={`px-4 py-2 rounded-lg ${
          isGeneralManager 
            ? 'bg-yellow-500/20 text-yellow-400' 
            : isManager 
            ? 'bg-blue-500/20 text-blue-400' 
            : 'bg-gray-700 text-gray-400'
        }`}>
          {isGeneralManager ? '👑 Genel Müdür' : isManager ? '📋 Yönetici' : '👤 Personel'}
        </div>
      </div>

      {/* Bilgi Kartları */}
      <div className="space-y-4">
        {/* Kullanıcı Bilgileri */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Kullanıcı Bilgileri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Ad Soyad:</p>
              <p className="text-white font-semibold">{userName}</p>
            </div>
            <div>
              <p className="text-gray-400">Kasa:</p>
              <p className="text-white font-semibold">{kasaName}</p>
            </div>
            <div>
              <p className="text-gray-400">Yetki Seviyesi:</p>
              <p className="text-white font-semibold">
                {isGeneralManager ? 'Genel Müdür' : isManager ? 'Yönetici' : 'Personel'}
              </p>
            </div>
          </div>
        </div>

        {/* Genel Müdür için Bilgilendirme */}
        {isGeneralManager && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <p className="text-sm text-yellow-300">
              <strong>Genel Müdür:</strong> Avans ve diğer ayarları yönetmek için <strong>Admin Panel</strong> sekmesini kullanın.
            </p>
          </div>
        )}

        {/* Yönetici Bilgilendirme */}
        {isManager && !isGeneralManager && (
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-blue-300">
              <strong>Yönetici:</strong> Kasa avanslarını değiştirmek için Genel Müdür ile iletişime geçin.
            </p>
          </div>
        )}

        {/* Sistem Bilgileri */}
        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-bold text-white mb-2">📌 Sistem Bilgileri:</h4>
          <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
            <li>Günlük raporlar ve satış verileri yerel olarak saklanır</li>
            <li>Firebase ile paket bilgileri tüm kasalarda senkronize edilir</li>
            <li>Avans ayarları sadece Genel Müdür tarafından yapılabilir</li>
            <li>Personel performansı Admin Panel'den takip edilebilir</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
