import { useState } from 'react';
import { Save, Mail, Plus, Trash2 } from 'lucide-react';

interface PaxEntry {
  id: string;
  category: string;
  type: 'ACENTE' | 'MÜNFERİT' | 'SİNEMA';
  adult: number;
  child: number;
  timestamp: string;
}

const AGENCIES = [
  'ADLER TURIZM', 'ATLAS TOUR', 'ANTALYA WAVES TRAVEL', 'ALEXA TRAVEL', 'ANCHWOOD TOUR',
  'ANASON TRAVEL', 'ARGOS KUYUM', 'AYAX GLOBAL', 'ANTALYUM TOUR', 'AYBA TUNGA TURIZM',
  'AIDA TUR', 'ALAPAN TRAVEL', 'AMER TRAVEL', 'AMBROSSIA TRAVEL', 'ANTALYA FULL TOUR',
  'AKIN VIP TRANSFER', 'AKTEON TURIZM', 'ATASAM HOLIDAY TRAVEL', 'BIGBAM TRAVEL', 'BUSTANI TURIZM',
  'BEST SERVICE', 'BENTOUR', 'BİLET.COM', 'BILET ANTALYA - ERS YAZALIM', 'BOOKERS TRAVEL',
  'BUNA TURCIA TURIZM', 'BLUEMANIA', 'BOOKLINE TRAVEL', 'BTS TUR', 'BOOXIMUM TURIZM',
  'BIJONS TOUR', 'CHRISTIAN ITS TRAVEL', 'CIP TRAVEL', 'CANDID TOUR', 'CRAFT TRAVEL',
  'CATT TOUR', 'CASTOR TRAVEL', 'COL TUR', 'COOL TUR', 'CORRECT', 'CORENDON',
  'CONSUL TRAVEL', 'COLMENYA TRAVEL', 'COYAV TRAVEL', 'CELEX TURIZM', 'DISCOVER TURKEY',
  'DIANA', 'DORAK SIGNATURE', 'DESTINATION', 'DS (TUI)', 'DEHA', 'DOPAMIN TOUR',
  'DREAMBIG HIGH CLASS TASIMACILIK', 'DIAMOND VOYAGE TRAVEL', 'FOUR SEASONS TRAVEL', 'FUN & SUN',
  'FABL TOURISM', 'FIT TOUR', 'FIBULA TRAVEL', 'FABIAN TOUR', 'FAIRDAY TURIZM',
  'FIBAR TUR', 'FEZA TURIZM', 'FLUJO TOUR', 'GINZA TRAVEL', 'GOLPON TRAVEL',
  'GLORIA LIFE TOUR', 'GREEN NATURE TRAVEL', 'GEPARD TURIZM', 'GOKCEKOGLU TURIZM', 'GUVENBEY TURIZM',
  'GTS HOLIDAY', 'ERGENEKON TOUR', 'ESKOL PINARIM TUR', 'ELIX TOUR', 'ETS TURIZM',
  'EMA TOURS', 'EIA HOLIDAYS', 'ESIL BLUE TAVEL', 'HIERAPOLIS TURIZM', 'HANA TRAVEL',
  'HEDEF DOĞA TURIZM', 'HABITAT VIP TRAVEL', 'HSC TRAVEL', 'HEAVENTOUR TUR', 'HARRA TRAVEL',
  'HAYTUR', 'HEYSEM TOUR', 'HOLIDAYCE VIBES TURIZM', 'HAPPY ELAY TURIZM', 'HURKAN TOUR',
  'HIGGS TOUR', 'HOLIDAY NB TOUR', 'HOMA TOUR', 'IBR TRAVEL', 'IHS TRAVEL AVRUPA',
  'IHS TRAVEL BDT', 'INTOURIST-MOTUS AVRUPA', 'INTOURIST-MOTUS', 'INTERHOL SERVİCES', 'IKAROS TURIZM',
  'IMPULSE TUR', 'IRELS TRAVEL', 'JOLLY TOUR', 'JAZZ TOUR', 'JKR TURIZM',
  'KALANIT TRAVEL', 'KARTACA TURIZM', 'KARNAK TRAVEL', 'KARMET TRAVEL', 'KHARON TRAVEL',
  'KEDALYA TURIZM', 'KADEN GOLF TRAVEL', 'KING ALP REISEN', 'KING OF ALAIYE TRAVEL', 'KIRKGOZHAN TRAVEL',
  'KAFECAN', 'KORAL TRAVEL', 'KPKZ TRAVEL', 'LOTI TOUR', 'LIGHT TOURS – KAYALAR',
  'LUNA BLU TRAVEL', 'LITORE SUN TRAVEL', 'MİRACLE CONCIERGE', 'MUNA TOSUN TRAVEL', 'MY FRIEND TRAVEL',
  'MERCAN TURIZM', 'MUHIP TURIZM', 'ANTALYA AQUARIUM AKAY TOUR YILBASI MEGA', 'ANTALYA AQUARIUM KOKARTLI REHBER MEGA',
  'ANTALYA AQUARIUM BASIN KART MEGA', 'ATILGAN AKVARYUM MEGA', 'AKAY TURIZM AVRUPA', 'ADONIS ISTANBUL',
  'ANEX', 'ANEX AVRUPA', 'AKDEM TRAVEL', 'AVIUM TOURS', 'ALL TOURS',
  'ANEX IC PAZAR', 'AKUAMARINE TRAVEL', 'ADANUS TURIZM', 'ARAZ ARAN TRAVEL', 'AZRA TOUR',
  'AGATHON TRAVEL', 'AZAD TURIZM', 'ASOS TURIZM', 'ASI TURIZM', 'ANB TOUR',
  'ARENA SPORT', 'AHLAN ANTALYA', 'ODEON', 'TRAVELLER ADVANTAGE PAC MEGA', 'TRAVELLER ADVANTAGE AQUA+FACE',
  'TRAVELLER TRY MEGA', 'TRAVELLER TRY AQUA+FACE', 'ONLİNE VİSİTOR AKV +WİLD', 'ONLİNE MEGA',
  'MUNFERIT ONLINE AQUA+WILD', 'MUNFERIT ONLINE MEGA', 'ONLINE IC AC MEGA', 'ONLINE AC IC AQUA+WILD',
  'TRAVELLER ADVANTAGE AQUA+CİNEMA', 'NEDIM TUGEN OKUL AQUA+SNOW+XD', 'WORLD OF LUXURY FULL PLUS KIŞ'
];

const MUNFERIT_CATEGORIES = [
  'MUNFERIT MEGA',
  'MUNFERİT AQUA+XD',
  'MUNFERIT 4 LU PAKET(A+KD+WP+F2F)',
  'MULTIPASS MUNFERIT 4 LU PAKET(A+XD+WP+F2F)',
  'ENGELLİ 4 LÜ (A+KD+WP+F2F)',
  'ENGELLİ AQUA+FACE İNDİRİMLİ',
  'ENGELLİ PAKET MEGA',
  'GAZI VE ŞEHİT AQUA+FACE2FACE PAKET',
  'GAZI VE ŞEHİT 4LU PAKET (A+KD+WP+F2F)',
  'GAZI VE ŞEHİT MEGA',
  'MUNFERIT KAMPANYA RESIM YARISMASI MEGA IND',
  'MUNFERIT KAMPANYA BIM MEGA IND',
  'MUNFERIT KAMPANYA BIM AQUA+F2F IND',
  'MUNFERIT KAMPANYA BIM PERSONEL MEGA',
  'BIM BIRLESIK MAGAZA COMP MEGA',
  'MUNFERIT KAMPANYA TURK KAMU-SEN 2\'Lİ AQUA+F2F',
  'KURUM INDIRIMI AQUA+FACE',
  'KURUM INDIRIMI PAKET MEGA',
  'KURUM INDIRIMI 4 LU PAKET (A+SW+WP+F2F)',
  'ALYA MEGA İNDİRİMİ',
  'ALYA PERSONEL MEGA',
  'ONLİNE MEGA',
  'NEDIM TUGEN OKUL AQUA+SNOW+XD'
];

export default function AquariumTab() {
  const [paxEntries, setPaxEntries] = useState<PaxEntry[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    type: 'ACENTE' as 'ACENTE' | 'MÜNFERİT' | 'SİNEMA',
    adult: '',
    child: '',
  });
  const [email, setEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getCategories = () => {
    if (formData.type === 'ACENTE') {
      return ['Müşteridi Panosu', 'Kasa', ...AGENCIES].sort();
    } else if (formData.type === 'MÜNFERİT') {
      return MUNFERIT_CATEGORIES.sort();
    } else {
      return ['Satılan Paket'];
    }
  };

  constype: formData.type,
      adult: parseInt(formData.adult),
      child: parseInt(formData.child),
      timestamp: new Date().toLocaleString('tr-TR'),
    };

    setPaxEntries([...paxEntries, newEntry]);
    setFormData({ ...formData,y: PaxEntry = {
      id: Date.now().toString(),
      category: formData.category,
      adult: parseInt(formData.adult),
      child: parseInt(formData.child),
      timestamp: new Date().toLocaleString('tr-TR'),
    };

    setPaxEntries([...paxEntries, newEntry]);
    setFormData({ category: '', adult: '', child: '' });
  };

  const handleDeleteEntry = (id: string) => {
    setPaxEntries(paxEntries.filter((e) => e.id !== id));
  };

  const getTotals = () => {
    return paxEntries.reduce(
      (acc, entry) => ({
        adult: acc.adult + entry.adult,
        child: acc.child + entry.child,
        total: acc.total + entry.adult + entry.child,
      }),
      { adult: 0, child: 0, total: 0 }
    );
  };

  const getCategoryTotals = () => {; type: string }> = {};
    paxEntries.forEach((entry) => {
      if (!categoryMap[entry.category]) {
        categoryMap[entry.category] = { adult: 0, child: 0, type: entry.type };
      }
      categoryMap[entry.category].adult += entry.adult;
      categoryMap[entry.category].child += entry.child;
    });
    return categoryMap;
  };

  const getTypeGroupedTotals = () => {
    const grouped: Record<string, { adult: number; child: number; entries: Array<{ category: string; adult: number; child: number }> }> = {
      ACENTE: { adult: 0, child: 0, entries: [] },
      MÜNFERİT: { adult: 0, child: 0, entries: [] },
      SİNEMA: { adult: 0, child: 0, entries: [] },
    };

    const typeGrouped = getTypeGroupedTotals();

    // Email gönderme simülasyonu
    const emailBody = `
WİLDPARK GÜNLÜK MÜNFERİT ve ACENTE
Tarih: ${new Date().toLocaleDateString('tr-TR')}

═══════════════════════════════════════════════════════════
AKVARYUM ACENTE PAX
═══════════════════════════════════════════════════════════
${typeGrouped.ACENTE.entries.length > 0 
  ? typeGrouped.ACENTE.entries.map(e => 
      `${e.category.padEnd(40)} | Yetişkin: ${e.adult.toString().padStart(3)} | Çocuk: ${e.child.toString().padStart(3)}`
    ).join('\n')
  : 'Veri yok'
}
───────────────────────────────────────────────────────────
TOPLAM: Yetişkin: ${typeGrouped.ACENTE.adult} | Çocuk: ${typeGrouped.ACENTE.child}

═══════════════════════════════════════════════════════════
AKVARYUM MÜNFERİT PAX
═══════════════════════════════════════════════════════════
${typeGrouped.MÜNFERİT.entries.length > 0
  ? typeGrouped.MÜNFERİT.entries.map(e =>
      `${e.category.padEnd(40)} | Yetişkin: ${e.adult.toString().padStart(3)} | Çocuk: ${e.child.toString().padStart(3)}`
    ).join('\n')
  : 'Veri yok'
}
───────────────────────────────────────────────────────────
TOPLAM: Yetişkin: ${typeGrouped.MÜNFERİT.adult} | Çocuk: ${typeGrouped.MÜNFERİT.child}

═══════════════════════════════════════════════════════════
  const typeGrouped = getTypeGroupedTotals();

  return (
    <div className="p-2 sm:p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-white">WİLDPARK Günlük Münferit ve Acente Raporuk: ${e.child.toString().padStart(3)}`
    ).join('\n')
  : 'Veri yok'
}
───────────────────────────────────────────────────────────
TOPLAM: Yetişkin: ${typeGrouped.SİNEMA.adult} | Çocuk: ${typeGrouped.SİNEMA.child}

═══════════════════════════════════════════════════════════
GENEL TOPLAM PAX
Yetişkin: ${totals.adult}
Çocuk: ${totals.child}
Toplam: ${totals.total}
═══════════════════════════════════════════════════════════s();
    const categoryTotals = getCategoryTotals();5 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tip</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any, category: '' })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white text-sm"
            >
              <option value="ACENTE">Acente</option>
              <option value="MÜNFERİT">Münferit</option>
              <option value="SİNEMA">Sinema</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              {formData.type === 'ACENTE' ? 'Acenta Adı' : formData.type === 'MÜNFERİT' ? 'Paket/Kategori' : 'Satılan Paket'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setSearchTerm(e.target.value);
                }}
                onFocus={() => setSearchTerm(formData.category)}
                placeholder="Ara veya manuel gir..."
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white text-sm"
                list={`${formData.type}-list`}
              />
              <datalist id={`${formData.type}-list`}>
                {getCategories()
Toplam PAX: ${totals.total}
    `;

    console.log('Email gönderildi:', email);
    console.log('İçerik:', emailBody);
    
    alert(`Rapor ${email} adresine gönderildi!\n\n${emailBody}`);
    setShowEmailModal(false);
    setEmail('');
  };

  const totals = getTotals();
  const categoryTotals = getCategoryTotals();

  return (
    <div className="p-2 sm:p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-white">Akvaryum Günlük PAX Raporlaması</h2>
        <button
          onClick={() => setShowEmailModal(true)}
          disabled={paxEntries.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Rapor Gönder
        </button>
      </div>

      {/* Veri Giriş Formu */}
      <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
        <h3 className="text-white font-bold mb-4">Yeni PAX Girişi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Acenta / Kategori</label>
            <div className="relative">
              <input
                type="text"
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setSearchTerm(e.target.value);
                }}
                onFocus={() => setSearchTerm(formData.category)}
                placeholder="Acenta ara veya seç..."
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white text-sm"
                list="agencies-list"
              />
          Tip Bazında Özet - 3 Kolon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ACENTE */}
        <div className="bg-blue-900/20 backdrop-blur-md rounded-lg border border-blue-700/50 p-4">
          <h3 className="text-sm font-bold text-blue-300 mb-3 flex items-center justify-between">
            <span>🏢 AKVARYUM ACENTE</span>
            <span className="text-xs bg-blue-600/30 px-2 py-1 rounded">{typeGrouped.ACENTE.entries.length}</span>
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {typeGrouped.ACENTE.entries.map((entry, idx) => (
              <div key={idx} className="text-xs bg-blue-900/20 rounded p-2">
                <p className="font-semibold text-white truncate">{entry.category}</p>
                <div className="flex justify-between text-gray-400 mt-1">
                  <span>Y: {entry.adult}</span>
                  <span>Ç: {entry.child}</span>
                  <span className="text-blue-300">T: {entry.adult + entry.child}</span>
                </div>
              </div>
            ))}
            {typeGrouped.ACENTE.entries.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">Veri yok</p>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-700/30">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Toplam:</span>
              <span className="text-blue-300 font-bold">{typeGrouped.ACENTE.adult + typeGrouped.ACENTE.child} PAX</span>
            </div>
          </div>
        </div>

        {/* MÜNFERİT */}
        <div className="bg-purple-900/20 backdrop-blurTip</th>
                  <th className="px-3 py-2 text-left">Kategori</th>
                  <th className="px-3 py-2 text-center">Yetişkin</th>
                  <th className="px-3 py-2 text-center">Çocuk</th>
                  <th className="px-3 py-2 text-center">Toplam</th>
                  <th className="px-3 py-2 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paxEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="px-3 py-2 text-gray-400">{entry.timestamp}</td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        entry.type === 'ACENTE' ? 'bg-blue-600/30 text-blue-300' :
                        entry.type === 'MÜNFERİT' ? 'bg-purple-600/30 text-purple-300' :
                        'bg-green-600/30 text-green-300'
                      }`}>
                        {entry.type}
                      </span>
                    
                  <span>Ç: {entry.child}</span>
                  <span className="text-purple-300">T: {entry.adult + entry.child}</span>
                </div>
              </div>
            ))}
            {typeGrouped.MÜNFERİT.entries.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">Veri yok</p>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-purple-700/30">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Toplam:</span>
              <span className="text-purple-300 font-bold">{typeGrouped.MÜNFERİT.adult + typeGrouped.MÜNFERİT.child} PAX</span>
            </div>
          </div>
        </div>

        {/* SİNEMA */}
        <div className="bg-green-900/20 backdrop-blur-md rounded-lg border border-green-700/50 p-4">
          <h3 className="text-sm font-bold text-green-300 mb-3 flex items-center justify-between">
            <span>🎬 SİNEMA</span>
            <span className="text-xs bg-green-600/30 px-2 py-1 rounded">{typeGrouped.SİNEMA.entries.length}</span>
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {typeGrouped.SİNEMA.entries.map((entry, idx) => (
              <div key={idx} className="text-xs bg-green-900/20 rounded p-2">
                <p className="font-semibold text-white truncate">{entry.category}</p>
                <div className="flex justify-between text-gray-400 mt-1">
                  <span>Y: {entry.adult}</span>
                  <span>Ç: {entry.child}</span>
                  <span className="text-green-300">T: {entry.adult + entry.child}</span>
                </div>
              </div>
            ))}
            {typeGrouped.SİNEMA.entries.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">Veri yok</p>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-green-700/30">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Toplam:</span>
              <span className="text-green-300 font-bold">{typeGrouped.SİNEMA.adult + typeGrouped.SİNEMA.child} PAX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Eski Kategori Bazında Özet - Kaldırıldı */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Çocuk Sayısı</label>
            <input
              type="number"
              min="0"
              value={formData.child}
              onChange={(e) => setFormData({ ...formData, child: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white text-sm"
              placeholder="0"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddEntry}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Kategori Bazında Özet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(categoryTotals).map(([category, data]) => (
          <div key={category} className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
            <h3 className="text-sm font-bold text-gray-400 mb-2">{category}</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Yetişkin:</span>
                <span className="text-blue-400 font-bold">{data.adult}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Çocuk:</span>
                <span className="text-green-400 font-bold">{data.child}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
                <span className="text-gray-400">Toplam:</span>
                <span className="text-orange-400 font-bold">{data.adult + data.child}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Girişler Listesi */}
      {paxEntries.length > 0 ? (
        <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
          <h3 className="text-white font-bold mb-4">Girilen Veriler</h3>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-3 py-2 text-left">Tarih/Saat</th>
                  <th className="px-3 py-2 text-left">Kategori</th>
                  <th className="px-3 py-2 text-center">Yetişkin</th>
                  <th className="px-3 py-2 text-center">Çocuk</th>
                  <th className="px-3 py-2 text-center">Toplam</th>
                  <th className="px-3 py-2 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paxEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="px-3 py-2 text-gray-400">{entry.timestamp}</td>
                    <td className="px-3 py-2 text-white">{entry.category}</td>
                    <td className="px-3 py-2 text-center text-blue-400">{entry.adult}</td>
                    <td className="px-3 py-2 text-center text-green-400">{entry.child}</td>
                    <td className="px-3 py-2 text-center text-orange-400 font-bold">
                      {entry.adult + entry.child}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-8 text-center text-gray-400">
          Henüz veri girişi yapılmamıştır. Yukarıdaki formu kullanarak PAX verisi ekleyin.
        </div>
      )}

      {/* Genel Toplam */}
      {paxEntries.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-lg border border-blue-700/50 p-6">
          <h3 className="text-white font-bold mb-4 text-lg">GÜNLÜK TOPLAM PAX</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
              <p className="text-xs text-gray-400 mb-1">Toplam Yetişkin</p>
              <p className="text-3xl font-bold text-blue-400">{totals.adult}</p>
            </div>
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
              <p className="text-xs text-gray-400 mb-1">Toplam Çocuk</p>
              <p className="text-3xl font-bold text-green-400">{totals.child}</p>
            </div>
            <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-700/30">
              <p className="text-xs text-gray-400 mb-1">Genel Toplam PAX</p>
              <p className="text-3xl font-bold text-orange-400">{totals.total}</p>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 max-w-md w-full">
            <h3 className="text-white font-bold mb-4 text-lg">Rapor Gönder</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">E-posta Adresi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                />
              </div>
              
              <div className="bg-gray-800/30 rounded p-3 text-sm text-gray-400">
                <p className="mb-2">Rapor Özeti:</p>
                <p>• Toplam Yetişkin: {totals.adult}</p>
                <p>• Toplam Çocuk: {totals.child}</p>
                <p>• Genel Toplam: {totals.total}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSendEmail}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Gönder
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

