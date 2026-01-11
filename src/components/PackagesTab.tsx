import { Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { INITIAL_PACKAGES, type PackageItem as Package } from '@/data/packages';

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
