import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import SalesPanel from './SalesPanel';

interface Advance {
  id: string;
  description: string;
  amount: number;
  currency: 'TL' | 'USD' | 'EUR';
  paymentType: 'Nakit' | 'Kredi Kartı';
  time: string;
}

export default function DashboardTab() {
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [usdRate, setUsdRate] = useState(30);
  const [eurRate, setEurRate] = useState(50.4877);
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [salesData, setSalesData] = useState({ kkTl: 0, cashTl: 0, cashUsd: 0, cashEur: 0 });
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: 'TL' as const,
    paymentType: 'Nakit' as const,
  });

  const handleAddAdvance = () => {
    if (!formData.description || !formData.amount) return;

    const newAdvance: Advance = {
      id: Date.now().toString(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      paymentType: formData.paymentType,
      time: new Date().toLocaleTimeString('tr-TR'),
    };

    setAdvances([...advances, newAdvance]);
    setFormData({ description: '', amount: '', currency: 'TL', paymentType: 'Nakit' });
    setShowAdvanceForm(false);
  };

  const handleDeleteAdvance = (id: string) => {
    setAdvances(advances.filter((a) => a.id !== id));
  };

  const handleSalesUpdate = (sales: any[]) => {
    const totals = {
      kkTl: sales.reduce((sum, s) => sum + s.kkTl, 0),
      cashTl: sales.reduce((sum, s) => sum + s.cashTl, 0),
      cashUsd: sales.reduce((sum, s) => sum + s.cashUsd, 0),
      cashEur: sales.reduce((sum, s) => sum + s.cashEur, 0),
    };
    setSalesData(totals);
  };

  return (
    <div className="p-2 sm:p-4 space-y-4">
      {/* Üst bölüm: Avanslar, Kur, Z Rapor - Kompakt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Avanslar */}
        <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">💰 Avanslar</h2>
            <button
              onClick={() => setShowAdvanceForm(!showAdvanceForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
            >
              +
            </button>
          </div>

          {showAdvanceForm && (
            <div className="bg-gray-800/50 rounded p-2 mb-2 space-y-1">
              <input
                type="text"
                placeholder="Açıklama"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-xs"
              />
              <input
                type="number"
                placeholder="Miktar"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-xs"
              />
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-xs"
              >
                <option value="TL">TL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <button
                onClick={handleAddAdvance}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded text-xs"
              >
                Ekle
              </button>
            </div>
          )}

          <div className="space-y-1 max-h-32 overflow-y-auto">
            {advances.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">Avans yok</p>
            ) : (
              advances.map((adv) => (
                <div key={adv.id} className="bg-gray-800/30 rounded p-1.5 flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">{adv.description}</p>
                    <p className="text-xs text-gray-400">{adv.amount} {adv.currency}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAdvance(adv.id)}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kur Girişleri */}
        <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
          <h2 className="text-sm font-bold text-white mb-3">💱 Kurlar</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">USD</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={usdRate}
                  onChange={(e) => setUsdRate(parseFloat(e.target.value))}
                  className="flex-1 px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-white text-xs"
                  step="0.01"
                />
                <span className="text-xs pt-1">₺</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">EUR</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={eurRate}
                  onChange={(e) => setEurRate(parseFloat(e.target.value))}
                  className="flex-1 px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-white text-xs"
                  step="0.01"
                />
                <span className="text-xs pt-1">₺</span>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded p-2 space-y-1 mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">1 USD</span>
                <span className="text-yellow-400 font-bold">{usdRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">1 EUR</span>
                <span className="text-purple-400 font-bold">{eurRate.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Z Rapor - Kompakt */}
        <div className="md:col-span-2 lg:col-span-2 bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
          <h2 className="text-sm font-bold text-white mb-3">📋 Z RAPOR</h2>
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
