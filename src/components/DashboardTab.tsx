import { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, FileText, Wallet } from 'lucide-react';
import SalesPanel from './SalesPanel';
import { getKasaSettings, initializeKasaSettings } from '@/utils/kasaSettingsDB';
import { loadExchangeRates, saveExchangeRates } from '@/utils/dailyData';

export default function DashboardTab() {
  const [salesData, setSalesData] = useState({ kkTl: 0, cashTl: 0, cashUsd: 0, cashEur: 0 });
  const [kasaAdvances, setKasaAdvances] = useState({ tlAdvance: 0, usdAdvance: 0, eurAdvance: 0 });
  const [userRole, setUserRole] = useState('');
  
  // Kur değerlerini localStorage'dan yükle
  const savedRates = loadExchangeRates();
  const [usdRate, setUsdRate] = useState(savedRates.usd);
  const [eurRate, setEurRate] = useState(savedRates.eur);

  // Kasa ayarlarını yükle
  useEffect(() => {
    initializeKasaSettings();
    const kasaId = localStorage.getItem('currentKasaId') || 'sinema';
    
    // Kullanıcı rolünü kontrol et
    const session = localStorage.getItem('userSession');
    if (session) {
      const userData = JSON.parse(session);
      setUserRole(userData.personnel?.role || '');
    }
    
    // Genel müdür değilse kasa ayarlarını yükle
    if (kasaId !== 'genel') {
      const settings = getKasaSettings(kasaId);
      if (settings && settings.advances) {
        setKasaAdvances(settings.advances);
      }
    }
  }, []);
  
  // Genel müdür için farklı görünüm
  if (userRole === 'genel_mudur') {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-700/30 rounded-lg p-8 max-w-2xl text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">Genel Müdür Paneli</h2>
          <p className="text-gray-300 mb-6">
            Tüm kasaların yönetimi için <strong className="text-yellow-400">Admin Panel</strong> sekmesini kullanın.
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4 text-left">
            <h3 className="font-bold text-white mb-2">Yetkileriniz</h3>
            <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
              <li>Kasa performans görüntüleme</li>
              <li>Avans yönetimi</li>
              <li>Personel ekleme ve rol atama</li>
              <li>Vardiya takibi</li>
              <li>Satış raporları</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const handleSalesUpdate = useCallback((sales: any[]) => {
    const totals = {
      kkTl: sales.reduce((sum, s) => sum + s.kkTl, 0),
      cashTl: sales.reduce((sum, s) => sum + s.cashTl, 0),
      cashUsd: sales.reduce((sum, s) => sum + s.cashUsd, 0),
      cashEur: sales.reduce((sum, s) => sum + s.cashEur, 0),
    };
    setSalesData(totals);
  }, []);
  
  // Kur değiştiğinde kaydet
  const handleUsdRateChange = (value: number) => {
    setUsdRate(value);
    saveExchangeRates(value, eurRate);
  };
  
  const handleEurRateChange = (value: number) => {
    setEurRate(value);
    saveExchangeRates(usdRate, value);
  };

  return (
    <div className="p-2 sm:p-4 space-y-4">
      {/* Üst bölüm: Avanslar, Kur, Z Rapor - Kompakt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Avanslar */}
        <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">Kasa Avansları</h2>
          </div>

          {/* Kasa Avansları - Sabit Gösterim */}
          <div className="space-y-2">
            <div className="bg-blue-900/20 rounded p-2 border border-blue-700/30">
              <p className="text-xs text-gray-400">TL Avans</p>
              <p className="text-lg font-bold text-blue-400">{kasaAdvances.tlAdvance.toLocaleString('tr-TR')} ₺</p>
            </div>
            <div className="bg-yellow-900/20 rounded p-2 border border-yellow-700/30">
              <p className="text-xs text-gray-400">USD Avans</p>
              <p className="text-lg font-bold text-yellow-400">{kasaAdvances.usdAdvance.toLocaleString('tr-TR')} $</p>
            </div>
            <div className="bg-purple-900/20 rounded p-2 border border-purple-700/30">
              <p className="text-xs text-gray-400">EUR Avans</p>
              <p className="text-lg font-bold text-purple-400">{kasaAdvances.eurAdvance.toLocaleString('tr-TR')} €</p>
            </div>
          </div>
        </div>

        {/* Kur Girişleri */}
        <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h2 className="text-sm font-bold text-white">Kurlar</h2>
          </div>
          <div className="space-y-2">
            <div className="bg-yellow-900/20 rounded p-2 border border-yellow-700/30">
              <label className="block text-xs text-gray-400 mb-1">USD Kuru</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={usdRate}
                  onChange={(e) => handleUsdRateChange(parseFloat(e.target.value))}
                  className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-white text-sm font-semibold"
                  step="0.01"
                />
                <span className="text-yellow-400 font-bold">₺</span>
              </div>
            </div>
            
            <div className="bg-purple-900/20 rounded p-2 border border-purple-700/30">
              <label className="block text-xs text-gray-400 mb-1">EUR Kuru</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={eurRate}
                  onChange={(e) => handleEurRateChange(parseFloat(e.target.value))}
                  className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-white text-sm font-semibold"
                  step="0.01"
                />
                <span className="text-purple-400 font-bold">₺</span>
              </div>
            </div>
          </div>
        </div>

        {/* Z Rapor - Kompakt */}
        <div className="md:col-span-2 lg:col-span-2 bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-green-400" />
            <h2 className="text-sm font-bold text-white">Z RAPOR</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* KK */}
            <div className="bg-green-900/20 rounded p-2 border border-green-700/30">
              <p className="text-xs text-gray-400 mb-1">KREDİ KARTI</p>
              <p className="text-xl font-bold text-green-400">{salesData.kkTl.toFixed(2)} ₺</p>
            </div>

            {/* Nakit TL */}
            <div className="bg-blue-900/20 rounded p-2 border border-blue-700/30">
              <p className="text-xs text-gray-400 mb-1">NAKİT TL</p>
              <p className="text-xl font-bold text-blue-400">{salesData.cashTl.toFixed(2)} ₺</p>
            </div>

            {/* Nakit USD */}
            <div className="bg-yellow-900/20 rounded p-2 border border-yellow-700/30">
              <p className="text-xs text-gray-400 mb-1">NAKİT USD</p>
              <p className="text-xl font-bold text-yellow-400">
                {salesData.cashUsd.toFixed(2)} $ <span className="text-xs">({(salesData.cashUsd * usdRate).toFixed(2)} ₺)</span>
              </p>
            </div>

            {/* Nakit EUR */}
            <div className="bg-purple-900/20 rounded p-2 border border-purple-700/30">
              <p className="text-xs text-gray-400 mb-1">NAKİT EUR</p>
              <p className="text-xl font-bold text-purple-400">
                {salesData.cashEur.toFixed(2)} € <span className="text-xs">({(salesData.cashEur * eurRate).toFixed(2)} ₺)</span>
              </p>
            </div>
          </div>

          {/* Genel Toplam */}
          <div className="bg-orange-900/20 rounded p-2 border border-orange-700/30 mt-2">
            <p className="text-xs text-orange-300 mb-1">GENEL TOPLAM</p>
            <p className="text-2xl font-bold text-orange-300">
              {(salesData.kkTl + salesData.cashTl + salesData.cashUsd * usdRate + salesData.cashEur * eurRate).toFixed(2)} ₺
            </p>
          </div>
        </div>
      </div>

      {/* Satış Panosu (Tam genişlik) */}
      <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
        <SalesPanel usdRate={usdRate} eurRate={eurRate} onSalesUpdate={handleSalesUpdate} />
      </div>
    </div>
  );
}
