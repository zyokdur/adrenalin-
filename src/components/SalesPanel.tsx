import { useState } from 'react';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  adultPrice: number;
  childPrice: number;
}

interface Sale {
  id: string;
  hour: string;
  packageName: string;
  adultQty: number;
  childQty: number;
  currency: 'TL' | 'USD' | 'EUR' | 'KK';
  paymentType: 'Nakit' | 'Kredi Kartı';
  total: number;
  kkTl: number;
  cashTl: number;
  cashUsd: number;
  cashEur: number;
  timestamp: string;
}

interface AddSaleForm {
  packageId: string;
  adultQty: string;
  childQty: string;
  currency: 'TL' | 'USD' | 'EUR';
  paymentType: 'Nakit' | 'Kredi Kartı';
}

const MOCK_PACKAGES: Package[] = [
  { id: '1', name: 'Sinema Paketi', adultPrice: 50, childPrice: 30 },
  { id: '2', name: 'Akvaryum Paketi', adultPrice: 75, childPrice: 45 },
  { id: '3', name: 'Çift Paket', adultPrice: 100, childPrice: 60 },
];

export default function SalesPanel({ usdRate = 30, eurRate = 50.4877, onSalesUpdate }: { usdRate: number; eurRate: number; onSalesUpdate?: (sales: Sale[]) => void }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<AddSaleForm>({
    packageId: '',
    adultQty: '0',
    childQty: '0',
    currency: 'TL',
    paymentType: 'Nakit',
  });

  const calculateSaleDistribution = (
    amount: number,
    currency: string,
    paymentType: string,
    usdRate: number,
    eurRate: number
  ) => {
    let kkTl = 0;
    let cashTl = 0;
    let cashUsd = 0;
    let cashEur = 0;

    if (paymentType === 'Nakit') {
      if (currency === 'USD') {
        cashUsd = amount;
      } else if (currency === 'EUR') {
        cashEur = amount;
      } else {
        cashTl = amount;
      }
    } else if (paymentType === 'Kredi Kartı') {
      if (currency === 'USD') {
        kkTl = amount * usdRate;
      } else if (currency === 'EUR') {
        kkTl = amount * eurRate;
      } else {
        kkTl = amount;
      }
    }

    return { kkTl, cashTl, cashUsd, cashEur };
  };

  const handleAddSale = () => {
    if (!formData.packageId || (formData.adultQty === '0' && formData.childQty === '0')) {
      alert('Lütfen paket ve miktar seçiniz');
      return;
    }

    const selectedPackage = MOCK_PACKAGES.find((p) => p.id === formData.packageId);
    if (!selectedPackage) return;

    const adultQty = parseInt(formData.adultQty) || 0;
    const childQty = parseInt(formData.childQty) || 0;
    const total = adultQty * selectedPackage.adultPrice + childQty * selectedPackage.childPrice;

    const distribution = calculateSaleDistribution(
      total,
      formData.currency,
      formData.paymentType,
      usdRate,
      eurRate
    );

    const newSale: Sale = {
      id: Date.now().toString(),
      hour: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      packageName: selectedPackage.name,
      adultQty,
      childQty,
      currency: formData.currency as any,
      paymentType: formData.paymentType as any,
      total,
      ...distribution,
      timestamp: new Date().toISOString(),
    };

    setSales([...sales, newSale]);
    setFormData({
      packageId: '',
      adultQty: '0',
      childQty: '0',
      currency: 'TL',
      paymentType: 'Nakit',
    });
    setShowAddForm(false);
    onSalesUpdate?.([...sales, newSale]);
  };

  const handleDeleteSale = (id: string) => {
    const updatedSales = sales.filter((s) => s.id !== id);
    setSales(updatedSales);
    onSalesUpdate?.(updatedSales);
  };

  const getTotals = () => {
    return {
      kkTl: sales.reduce((sum, s) => sum + s.kkTl, 0),
      cashTl: sales.reduce((sum, s) => sum + s.cashTl, 0),
      cashUsd: sales.reduce((sum, s) => sum + s.cashUsd, 0),
      cashEur: sales.reduce((sum, s) => sum + s.cashEur, 0),
    };
  };

  const totals = getTotals();

  return (
    <div className="space-y-4">
      {/* Add Sale Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Satış Panosu</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Satış Ekle
        </button>
      </div>

      {/* Add Sale Form */}
      {showAddForm && (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Paket</label>
              <select
                value={formData.packageId}
                onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
              >
                <option value="">Seç...</option>
                {MOCK_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Yetişkin</label>
              <input
                type="number"
                min="0"
                value={formData.adultQty}
                onChange={(e) => setFormData({ ...formData, adultQty: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Çocuk</label>
              <input
                type="number"
                min="0"
                value={formData.childQty}
                onChange={(e) => setFormData({ ...formData, childQty: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Para Birimi</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
              >
                <option value="TL">TL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Ödeme Şekli</label>
              <select
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
              >
                <option value="Nakit">Nakit</option>
                <option value="Kredi Kartı">Kredi Kartı</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddSale}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
            >
              Satışı Kaydet
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Sales Table */}
      {sales.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
          Henüz satış kaydı bulunmamaktadır
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700">
                <th className="px-2 py-2 text-left">Saat</th>
                <th className="px-2 py-2 text-left">Paket</th>
                <th className="px-2 py-2 text-center">Yetişkin</th>
                <th className="px-2 py-2 text-center">Çocuk</th>
                <th className="px-2 py-2 text-center">Para</th>
                <th className="px-2 py-2 text-center">Ödeme</th>
                <th className="px-2 py-2 text-right">Toplam</th>
                <th className="px-2 py-2 text-right">KK(TL)</th>
                <th className="px-2 py-2 text-right">TL</th>
                <th className="px-2 py-2 text-right">USD</th>
                <th className="px-2 py-2 text-right">EUR</th>
                <th className="px-2 py-2 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="px-2 py-2">{sale.hour}</td>
                  <td className="px-2 py-2">{sale.packageName}</td>
                  <td className="px-2 py-2 text-center">{sale.adultQty}</td>
                  <td className="px-2 py-2 text-center">{sale.childQty}</td>
                  <td className="px-2 py-2 text-center">{sale.currency}</td>
                  <td className="px-2 py-2 text-center text-xs">{sale.paymentType === 'Nakit' ? 'N' : 'KK'}</td>
                  <td className="px-2 py-2 text-right">{sale.total.toFixed(2)}</td>
                  <td className="px-2 py-2 text-right text-green-400">{sale.kkTl > 0 ? sale.kkTl.toFixed(2) : '-'}</td>
                  <td className="px-2 py-2 text-right text-blue-400">{sale.cashTl > 0 ? sale.cashTl.toFixed(2) : '-'}</td>
                  <td className="px-2 py-2 text-right text-yellow-400">{sale.cashUsd > 0 ? sale.cashUsd.toFixed(2) : '-'}</td>
                  <td className="px-2 py-2 text-right text-purple-400">{sale.cashEur > 0 ? sale.cashEur.toFixed(2) : '-'}</td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleDeleteSale(sale.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Row */}
          <div className="mt-4 bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">KREDİ KARTI (TL)</p>
                <p className="text-lg font-bold text-green-400">{totals.kkTl.toFixed(2)} ₺</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">NAKİT (TL)</p>
                <p className="text-lg font-bold text-blue-400">{totals.cashTl.toFixed(2)} ₺</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">NAKİT (USD)</p>
                <p className="text-lg font-bold text-yellow-400">{totals.cashUsd.toFixed(2)} $</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">NAKİT (EUR)</p>
                <p className="text-lg font-bold text-purple-400">{totals.cashEur.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
