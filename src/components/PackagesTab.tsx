import { Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface Package {
  id: string;
  name: string;
  category: 'Münferit' | 'Çapraz' | 'Acenta';
  adultPrice: number;
  childPrice: number;
  currency: 'TL' | 'USD' | 'EUR';
}

const INITIAL_PACKAGES: Package[] = [
  // Münferit - TL
  { id: '1', name: 'M.Y', category: 'Münferit', adultPrice: 325, childPrice: 245, currency: 'TL' },
  { id: '2', name: 'M.Y%15', category: 'Münferit', adultPrice: 276, childPrice: 208, currency: 'TL' },
  { id: '3', name: 'M.Y%20', category: 'Münferit', adultPrice: 260, childPrice: 196, currency: 'TL' },
  { id: '4', name: 'M.Y%30', category: 'Münferit', adultPrice: 228, childPrice: 172, currency: 'TL' },
  { id: '5', name: 'M.Y%40', category: 'Münferit', adultPrice: 195, childPrice: 147, currency: 'TL' },
  { id: '6', name: 'M.Y%50', category: 'Münferit', adultPrice: 163, childPrice: 123, currency: 'TL' },
  { id: '7', name: 'M.Kurum', category: 'Münferit', adultPrice: 228, childPrice: 172, currency: 'TL' },
  { id: '8', name: 'Family', category: 'Münferit', adultPrice: 225, childPrice: 160, currency: 'TL' },
  { id: '9', name: 'Öğrenci', category: 'Münferit', adultPrice: 145, childPrice: 125, currency: 'TL' },
  { id: '10', name: 'Öğrenci/Acenta/Kreş', category: 'Münferit', adultPrice: 125, childPrice: 110, currency: 'TL' },
  // Münferit - USD
  { id: '11', name: 'Visitor', category: 'Münferit', adultPrice: 21, childPrice: 16, currency: 'USD' },
  { id: '12', name: 'V%25', category: 'Münferit', adultPrice: 16, childPrice: 12, currency: 'USD' },
  { id: '13', name: 'V%35', category: 'Münferit', adultPrice: 14, childPrice: 11, currency: 'USD' },
  { id: '14', name: 'V%Özel', category: 'Münferit', adultPrice: 10, childPrice: 10, currency: 'USD' },
  { id: '15', name: 'V%50', category: 'Münferit', adultPrice: 11, childPrice: 8, currency: 'USD' },
  // Münferit - EUR
  { id: '16', name: 'Visitor', category: 'Münferit', adultPrice: 20, childPrice: 15, currency: 'EUR' },
  { id: '17', name: 'V%25', category: 'Münferit', adultPrice: 15, childPrice: 11, currency: 'EUR' },
  { id: '18', name: 'V%35', category: 'Münferit', adultPrice: 13, childPrice: 10, currency: 'EUR' },
  { id: '19', name: 'V%Özel', category: 'Münferit', adultPrice: 10, childPrice: 10, currency: 'EUR' },
  { id: '20', name: 'V%50', category: 'Münferit', adultPrice: 10, childPrice: 8, currency: 'EUR' },

  // Çapraz - TL
  { id: '21', name: 'Ç.XD+ WP', category: 'Çapraz', adultPrice: 500, childPrice: 380, currency: 'TL' },
  { id: '22', name: 'Ç.XD + F2F', category: 'Çapraz', adultPrice: 450, childPrice: 350, currency: 'TL' },
  { id: '23', name: 'Ç.XD+F2F+WP', category: 'Çapraz', adultPrice: 690, childPrice: 510, currency: 'TL' },
  { id: '24', name: 'MARKET3', category: 'Çapraz', adultPrice: 536, childPrice: 404, currency: 'TL' },
  // Çapraz - USD
  { id: '25', name: 'Ç.V.XD+ WP', category: 'Çapraz', adultPrice: 35, childPrice: 25, currency: 'USD' },
  { id: '26', name: 'Ç.V.XD+ F2F', category: 'Çapraz', adultPrice: 35, childPrice: 25, currency: 'USD' },
  { id: '27', name: 'Ç.V.XD+F2F+WP', category: 'Çapraz', adultPrice: 50, childPrice: 40, currency: 'USD' },
  { id: '28', name: 'MARKET3 VISITOR', category: 'Çapraz', adultPrice: 30, childPrice: 20, currency: 'USD' },
  // Çapraz - EUR
  { id: '29', name: 'Ç.V.XD+ WP', category: 'Çapraz', adultPrice: 33, childPrice: 23, currency: 'EUR' },
  { id: '30', name: 'Ç.V.XD + F2F', category: 'Çapraz', adultPrice: 33, childPrice: 23, currency: 'EUR' },
  { id: '31', name: 'Ç.V.XD+F2F+WP', category: 'Çapraz', adultPrice: 48, childPrice: 38, currency: 'EUR' },
  { id: '32', name: 'MARKET3 VISITOR', category: 'Çapraz', adultPrice: 29, childPrice: 19, currency: 'EUR' },

  // Acenta - USD
  { id: '33', name: 'Acenta', category: 'Acenta', adultPrice: 12, childPrice: 12, currency: 'USD' },
  { id: '34', name: 'Acenta', category: 'Acenta', adultPrice: 11, childPrice: 11, currency: 'USD' },
  { id: '35', name: 'Acenta', category: 'Acenta', adultPrice: 10, childPrice: 10, currency: 'USD' },
  { id: '36', name: 'Acenta', category: 'Acenta', adultPrice: 9, childPrice: 9, currency: 'USD' },
  { id: '37', name: 'Acenta', category: 'Acenta', adultPrice: 8, childPrice: 8, currency: 'USD' },
  { id: '38', name: 'Acenta', category: 'Acenta', adultPrice: 7, childPrice: 7, currency: 'USD' },
  { id: '39', name: 'Acenta', category: 'Acenta', adultPrice: 6, childPrice: 6, currency: 'USD' },
  // Acenta - EUR
  { id: '40', name: 'Acenta', category: 'Acenta', adultPrice: 12, childPrice: 12, currency: 'EUR' },
  { id: '41', name: 'Acenta', category: 'Acenta', adultPrice: 11, childPrice: 11, currency: 'EUR' },
  { id: '42', name: 'Acenta', category: 'Acenta', adultPrice: 10, childPrice: 10, currency: 'EUR' },
  { id: '43', name: 'Acenta', category: 'Acenta', adultPrice: 9, childPrice: 9, currency: 'EUR' },
  { id: '44', name: 'Acenta', category: 'Acenta', adultPrice: 8, childPrice: 8, currency: 'EUR' },
  { id: '45', name: 'Acenta', category: 'Acenta', adultPrice: 7, childPrice: 7, currency: 'EUR' },
  { id: '46', name: 'Acenta', category: 'Acenta', adultPrice: 6, childPrice: 6, currency: 'EUR' },
];

const CATEGORIES = ['Münferit', 'Çapraz', 'Acenta'] as const;

export default function PackagesTab() {
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Package | null>(null);

  const handleSaveEdit = () => {
    if (!editData) return;
    setPackages(packages.map((p) => (p.id === editData.id ? editData : p)));
    setEditingId(null);
    setEditData(null);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter((p) => p.id !== id));
  };

  const renderCategoryTable = (category: string) => {
    const categoryPackages = packages.filter((p) => p.category === category);
    if (categoryPackages.length === 0) return null;

    // Para birimlerine göre grupla
    const tlPackages = categoryPackages.filter((p) => p.currency === 'TL');
    const usdPackages = categoryPackages.filter((p) => p.currency === 'USD');
    const eurPackages = categoryPackages.filter((p) => p.currency === 'EUR');

    return (
      <div key={category} className="mb-6">
        <h2 className="text-lg font-bold text-white mb-3 pb-2 border-b border-gray-700">
          {category}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* TL Paketleri */}
          {tlPackages.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="px-2 py-2 text-left text-gray-300 border border-gray-700">Sinema</th>
                    <th className="px-2 py-2 text-center text-gray-300 border border-gray-700">Yetişkin</th>
                    <th className="px-2 py-2 text-center text-gray-300 border border-gray-700">Çocuk</th>
                    <th className="px-2 py-2 text-center text-gray-300 border border-gray-700">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {tlPackages.map((pkg) => (
                    <tr key={pkg.id} className="border border-gray-700 hover:bg-gray-800/30">
                      {editingId === pkg.id ? (
                        <>
                          <td className="px-2 py-2 border border-gray-700">
                            <input
                              type="text"
                              value={editData?.name || ''}
                              onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                              className="w-full px-1 py-1 bg-gray-900 border border-gray-600 rounded text-white text-xs"
                            />
                          </td>
                          <td className="px-2 py-2 border border-gray-700">
                            <input
                              type="number"
                              value={editData?.adultPrice || ''}
                              onChange={(e) => setEditData({ ...editData!, adultPrice: parseFloat(e.target.value) })}
                              className="w-full px-1 py-1 bg-gray-900 border border-gray-600 rounded text-white text-xs"
                            />
                          </td>
                          <td className="px-2 py-2 border border-gray-700">
                            <input
                              type="number"
                              value={editData?.childPrice || ''}
                              onChange={(e) => setEditData({ ...editData!, childPrice: parseFloat(e.target.value) })}
                              className="w-full px-1 py-1 bg-gray-900 border border-gray-600 rounded text-white text-xs"
                            />
                          </td>
                          <td className="px-2 py-2 border border-gray-700 text-center">
                            <button
                              onClick={handleSaveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                            >
                              ✓
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-2 border border-gray-700 text-white">{pkg.name}</td>
                          <td className="px-2 py-2 border border-gray-700 text-center text-white">₺{pkg.adultPrice.toFixed(2)}</td>
                          <td className="px-2 py-2 border border-gray-700 text-center text-white">₺{pkg.childPrice.toFixed(2)}</td>
                          <td className="px-2 py-2 border border-gray-700 text-center">
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => {
                                  setEditingId(pkg.id);
                                  setEditData(pkg);
                                }}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeletePackage(pkg.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* USD Paketleri */}
          {usdPackages.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="px-2 py-2 text-left text-gray-300 border border-gray-700">Sinema</th>
                    <th className="px-2 py-2 text-center text-gray-300 border border-gray-700">Adult</th>
                    <th className="px-2 py-2 text-center text-gray-300 border border-gray-700">Child</th>
                    <th className="px-2 py-2 text-center text-gray-300 border border-gray-700">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {usdPackages.map((pkg) => (
                    <tr key={pkg.id} className="border border-gray-700 hover:bg-gray-800/30">
                      {editingId === pkg.id ? (
                        <>
                          <td className="px-2 py-2 border border-gray-700">
                            <input
                              type="text"
                              value={editData?.name || ''}
                              onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                              className="w-full px-1 py-1 bg-gray-900 border border-gray-600 rounded text-white text-xs"
                            />
                          </td>
                          <td className="px-2 py-2 border border-gray-700">
                            <input
                              type="number"
                              value={editData?.adultPrice || ''}
                              onChange={(e) => setEditData({ ...editData!, adultPrice: parseFloat(e.target.value) })}
                              className="w-full px-1 py-1 bg-gray-900 border border-gray-600 rounded text-white text-xs"
                            />
                          </td>
                          <td className="px-2 py-2 border border-gray-700">
                            <input
                              type="number"
                              value={editData?.childPrice || ''}
                              onChange={(e) => setEditData({ ...editData!, childPrice: parseFloat(e.target.value) })}
                              className="w-full px-1 py-1 bg-gray-900 border border-gray-600 rounded text-white text-xs"
                            />
                          </td>
                          <td className="px-2 py-2 border border-gray-700 text-center">
                            <button
                              onClick={handleSaveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                            >
                              ✓
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-2 border border-gray-700 text-white">{pkg.name}</td>
                          <td className="px-2 py-2 border border-gray-700 text-center text-white">${pkg.adultPrice.toFixed(2)}</td>
                          <td className="px-2 py-2 border border-gray-700 text-center text-white">${pkg.childPrice.toFixed(2)}</td>
                          <td className="px-2 py-2 border border-gray-700 text-center">
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => {
                                  setEditingId(pkg.id);
                                  setEditData(pkg);
                                }}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeletePackage(pkg.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* EUR Paketleri */}
          {eurPackages.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="px-2 py-2 text-left text-gray-300 border border-gray-700">Sinema</th>
                    <th className="px-2 py-2 text-center text-gray-300 border border-gray-700">Adult</th>
                    <th className="px-2 py-2 text-center text-gray-300 border border-gray-700">Child</th>
                    <th className="px-2 py-2 text-center text-gray-300 border border-gray-700">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {eurPackages.map((pkg) => (
                    <tr key={pkg.id} className="border border-gray-700 hover:bg-gray-800/30">
                      {editingId === pkg.id ? (
                        <>
                          <td className="px-2 py-2 border border-gray-700">
                            <input
                              type="text"
                              value={editData?.name || ''}
                              onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                              className="w-full px-1 py-1 bg-gray-900 border border-gray-600 rounded text-white text-xs"
                            />
                          </td>
                          <td className="px-2 py-2 border border-gray-700">
                            <input
                              type="number"
                              value={editData?.adultPrice || ''}
                              onChange={(e) => setEditData({ ...editData!, adultPrice: parseFloat(e.target.value) })}
                              className="w-full px-1 py-1 bg-gray-900 border border-gray-600 rounded text-white text-xs"
                            />
                          </td>
                          <td className="px-2 py-2 border border-gray-700">
                            <input
                              type="number"
                              value={editData?.childPrice || ''}
                              onChange={(e) => setEditData({ ...editData!, childPrice: parseFloat(e.target.value) })}
                              className="w-full px-1 py-1 bg-gray-900 border border-gray-600 rounded text-white text-xs"
                            />
                          </td>
                          <td className="px-2 py-2 border border-gray-700 text-center">
                            <button
                              onClick={handleSaveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                            >
                              ✓
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-2 border border-gray-700 text-white">{pkg.name}</td>
                          <td className="px-2 py-2 border border-gray-700 text-center text-white">€{pkg.adultPrice.toFixed(2)}</td>
                          <td className="px-2 py-2 border border-gray-700 text-center text-white">€{pkg.childPrice.toFixed(2)}</td>
                          <td className="px-2 py-2 border border-gray-700 text-center">
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => {
                                  setEditingId(pkg.id);
                                  setEditData(pkg);
                                }}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeletePackage(pkg.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Paket Yönetimi</h1>
        <div className="text-sm text-gray-400">
          Toplam Paket: <span className="font-bold text-white">{packages.length}</span>
        </div>
      </div>

      {CATEGORIES.map((category) => renderCategoryTable(category))}
    </div>
  );
}
