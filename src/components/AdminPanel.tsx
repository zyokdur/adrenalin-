import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Calendar, TrendingUp, BarChart3, 
  Clock, Award, Settings, Shield, RefreshCw, Save, CheckCircle, Trash2 
} from 'lucide-react';
import { addPersonnelToFirebase, deletePersonnelFromFirebase, getAllPersonnelFromFirebase } from '@/utils/firebasePersonnel';

type AdminTab = 'overview' | 'personnel' | 'shifts' | 'performance' | 'settings';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userData = JSON.parse(session);
      setUserRole(userData.personnel?.role || '');
      setUserName(userData.personnel?.fullName || '');
    }
  }, []);

  // Sadece genel müdür erişebilir
  if (userRole !== 'genel_mudur') {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8 max-w-md text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Yetkisiz Erişim</h2>
          <p className="text-gray-400">
            Bu panele sadece Genel Müdür yetkisi ile erişebilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-yellow-400" />
            Genel Müdür Admin Paneli
          </h1>
          <p className="text-gray-400 mt-1">Hoşgeldiniz, {userName}</p>
        </div>
        
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
          Verileri Yenile
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-700 pb-0">
        <TabButton
          icon={<BarChart3 className="w-5 h-5" />}
          label="Genel Bakış"
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        />
        <TabButton
          icon={<Users className="w-5 h-5" />}
          label="Personel Yönetimi"
          active={activeTab === 'personnel'}
          onClick={() => setActiveTab('personnel')}
        />
        <TabButton
          icon={<Calendar className="w-5 h-5" />}
          label="Vardiya Yönetimi"
          active={activeTab === 'shifts'}
          onClick={() => setActiveTab('shifts')}
        />
        <TabButton
          icon={<TrendingUp className="w-5 h-5" />}
          label="Performans Takibi"
          active={activeTab === 'performance'}
          onClick={() => setActiveTab('performance')}
        />
        <TabButton
          icon={<Settings className="w-5 h-5" />}
          label="Ayarlar"
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'personnel' && <PersonnelManagementTab />}
        {activeTab === 'shifts' && <ShiftManagementTab />}
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'settings' && <AdminSettingsTab />}
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Genel Bakış Tab
function OverviewTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Genel Bakış</h2>
      
      {/* Kasa İstatistikleri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KasaCard
          name="WildPark"
          color="green"
          todaySales={12500}
          weekSales={75000}
          monthSales={320000}
          activePersonnel={4}
        />
        <KasaCard
          name="XD Sinema"
          color="blue"
          todaySales={18750}
          weekSales={95000}
          monthSales={410000}
          activePersonnel={4}
        />
        <KasaCard
          name="Face2Face"
          color="purple"
          todaySales={9500}
          weekSales={62000}
          monthSales={285000}
          activePersonnel={4}
        />
      </div>

      {/* Toplam Özet */}
      <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-700/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Toplam Performans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatItem label="Bugünkü Toplam" value="40.750 ₺" />
          <StatItem label="Haftalık Toplam" value="232.000 ₺" />
          <StatItem label="Aylık Toplam" value="1.015.000 ₺" />
          <StatItem label="Aktif Personel" value="12 Kişi" />
        </div>
      </div>
    </div>
  );
}

// Kasa Kartı
function KasaCard({ 
  name, 
  color, 
  todaySales, 
  weekSales, 
  monthSales, 
  activePersonnel 
}: {
  name: string;
  color: 'green' | 'blue' | 'purple';
  todaySales: number;
  weekSales: number;
  monthSales: number;
  activePersonnel: number;
}) {
  const colorClasses = {
    green: 'from-green-900/20 to-green-800/10 border-green-700/30 text-green-400',
    blue: 'from-blue-900/20 to-blue-800/10 border-blue-700/30 text-blue-400',
    purple: 'from-purple-900/20 to-purple-800/10 border-purple-700/30 text-purple-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-5`}>
      <h3 className="text-xl font-bold mb-4">{name}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-white">
          <span>Bugün:</span>
          <span className="font-semibold">{todaySales.toLocaleString('tr-TR')} ₺</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Bu Hafta:</span>
          <span className="font-semibold">{weekSales.toLocaleString('tr-TR')} ₺</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Bu Ay:</span>
          <span className="font-semibold">{monthSales.toLocaleString('tr-TR')} ₺</span>
        </div>
        <div className="flex justify-between text-gray-400 pt-2 border-t border-gray-700">
          <span>Aktif Personel:</span>
          <span className="font-semibold">{activePersonnel} Kişi</span>
        </div>
      </div>
    </div>
  );
}

// İstatistik Item
function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

// Personel Yönetimi Tab
function PersonnelManagementTab() {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedKasa, setSelectedKasa] = useState<'wildpark' | 'sinema' | 'face2face'>('wildpark');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'personel' as 'personel' | 'yonetici',
    weeklyTargetHours: 45
  });

  useEffect(() => {
    loadPersonnel();
  }, []);

  const loadPersonnel = async () => {
    // Önce Firebase'den yükle
    const firebasePersonnel = await getAllPersonnelFromFirebase();
    
    if (firebasePersonnel.length > 0) {
      // Firebase'de veri varsa onu kullan
      const filtered = firebasePersonnel.filter((p: any) => p.role !== 'genel_mudur');
      setPersonnel(filtered);
      // localStorage'a da kaydet
      localStorage.setItem('personnel_db', JSON.stringify(firebasePersonnel));
    } else {
      // Firebase'de veri yoksa localStorage'dan yükle
      const data = localStorage.getItem('personnel_db');
      if (data) {
        const allPersonnel = JSON.parse(data);
        const filtered = allPersonnel.filter((p: any) => p.role !== 'genel_mudur');
        setPersonnel(filtered);
      }
    }
  };

  const handleAddPersonnel = async () => {
    if (!formData.username || !formData.password || !formData.fullName) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    const newPersonnel = {
      id: `${selectedKasa}_${Date.now()}`,
      username: formData.username.toLowerCase(),
      password: formData.password,
      fullName: formData.fullName,
      kasaId: selectedKasa,
      role: formData.role,
      weeklyTargetHours: formData.weeklyTargetHours,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Firebase'e ekle
    const success = await addPersonnelToFirebase(newPersonnel);
    
    if (success) {
      // localStorage'a da ekle
      const data = localStorage.getItem('personnel_db');
      const allPersonnel = data ? JSON.parse(data) : [];
      allPersonnel.push(newPersonnel);
      localStorage.setItem('personnel_db', JSON.stringify(allPersonnel));

      setFormData({
        username: '',
        password: '',
        fullName: '',
        role: 'personel',
        weeklyTargetHours: 45
      });
      setShowAddForm(false);
      loadPersonnel();
    } else {
      alert('Personel eklenirken hata oluştu!');
    }
  };

  const handleDeletePersonnel = async (id: string) => {
    if (!confirm('Bu personeli silmek istediğinizden emin misiniz?')) return;

    // Firebase'den sil
    const success = await deletePersonnelFromFirebase(id);
    
    if (success) {
      // localStorage'dan da sil
      const data = localStorage.getItem('personnel_db');
      const allPersonnel = data ? JSON.parse(data) : [];
      const filtered = allPersonnel.filter((p: any) => p.id !== id);
      localStorage.setItem('personnel_db', JSON.stringify(filtered));
      loadPersonnel();
    } else {
      alert('Personel silinirken hata oluştu!');
    }
  };

  const kasaColors = {
    wildpark: { bg: 'bg-green-500/20', text: 'text-green-400', name: 'WildPark' },
    sinema: { bg: 'bg-blue-500/20', text: 'text-blue-400', name: 'XD Sinema' },
    face2face: { bg: 'bg-purple-500/20', text: 'text-purple-400', name: 'Face2Face' }
  };

  const groupedPersonnel = {
    wildpark: personnel.filter(p => p.kasaId === 'wildpark'),
    sinema: personnel.filter(p => p.kasaId === 'sinema'),
    face2face: personnel.filter(p => p.kasaId === 'face2face')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Personel Yönetimi
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Yeni Personel Ekle
        </button>
      </div>

      {/* Personel Ekleme Formu */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Yeni Personel Ekle</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Kasa Seçin</label>
              <select
                value={selectedKasa}
                onChange={(e) => setSelectedKasa(e.target.value as any)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
              >
                <option value="wildpark">WildPark</option>
                <option value="sinema">XD Sinema</option>
                <option value="face2face">Face2Face</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
              >
                <option value="personel">Personel</option>
                <option value="yonetici">Yönetici</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Kullanıcı Adı</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="ornek.kullanici"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Şifre</label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="1234"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ad Soyad</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ahmet Yılmaz"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Haftalık Hedef Saat</label>
              <input
                type="number"
                value={formData.weeklyTargetHours}
                onChange={(e) => setFormData({ ...formData, weeklyTargetHours: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddPersonnel}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
            >
              Kaydet
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Personel Listeleri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(groupedPersonnel) as Array<keyof typeof groupedPersonnel>).map((kasaId) => (
          <div key={kasaId} className={`${kasaColors[kasaId].bg} border border-gray-700 rounded-lg p-4`}>
            <h3 className={`text-lg font-bold ${kasaColors[kasaId].text} mb-4`}>
              {kasaColors[kasaId].name} ({groupedPersonnel[kasaId].length} kişi)
            </h3>
            
            <div className="space-y-2">
              {groupedPersonnel[kasaId].map((p: any) => (
                <div key={p.id} className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold">{p.fullName}</p>
                      <p className="text-xs text-gray-400">@{p.username}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePersonnel(p.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      p.role === 'yonetici' 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {p.role === 'yonetici' ? 'Yönetici' : 'Personel'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                      {p.weeklyTargetHours || 45}h/hafta
                    </span>
                  </div>
                </div>
              ))}
              
              {groupedPersonnel[kasaId].length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Henüz personel yok</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Vardiya Yönetimi Tab
function ShiftManagementTab() {
  return (
    <div className="bg-gray-800/50 rounded-lg p-8 text-center">
      <Calendar className="w-16 h-16 text-green-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Vardiya Yönetimi</h3>
      <p className="text-gray-400">
        Shift oluşturma, düzenleme, haftalık planlama özellikleri yakında eklenecek...
      </p>
    </div>
  );
}

// Performans Takibi Tab
function PerformanceTab() {
  return (
    <div className="bg-gray-800/50 rounded-lg p-8 text-center">
      <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Performans Takibi</h3>
      <p className="text-gray-400">
        Günlük/haftalık/aylık satış raporları, personel performansı yakında eklenecek...
      </p>
    </div>
  );
}

// Admin Ayarlar Tab
function AdminSettingsTab() {
  const [selectedKasa, setSelectedKasa] = useState<'wildpark' | 'sinema' | 'face2face'>('wildpark');
  const [kasaSettings, setKasaSettings] = useState<{
    wildpark: { tlAdvance: number; usdAdvance: number; eurAdvance: number };
    sinema: { tlAdvance: number; usdAdvance: number; eurAdvance: number };
    face2face: { tlAdvance: number; usdAdvance: number; eurAdvance: number };
  }>({
    wildpark: { tlAdvance: 0, usdAdvance: 0, eurAdvance: 0 },
    sinema: { tlAdvance: 0, usdAdvance: 0, eurAdvance: 0 },
    face2face: { tlAdvance: 0, usdAdvance: 0, eurAdvance: 0 }
  });
  const [saveMessage, setSaveMessage] = useState('');

  // Ayarları yükle
  useEffect(() => {
    const loadSettings = async () => {
      // Her kasa için ayarları yükle
      const kasas: Array<'wildpark' | 'sinema' | 'face2face'> = ['wildpark', 'sinema', 'face2face'];
      const newSettings = { ...kasaSettings };
      
      kasas.forEach((kasaId) => {
        const settingsStr = localStorage.getItem(`kasaSettings_${kasaId}`);
        if (settingsStr) {
          const settings = JSON.parse(settingsStr);
          newSettings[kasaId] = settings.advances || { tlAdvance: 0, usdAdvance: 0, eurAdvance: 0 };
        }
      });
      
      setKasaSettings(newSettings);
    };
    
    loadSettings();
  }, []);

  const handleSaveAdvances = () => {
    // Tüm kasaların ayarlarını kaydet
    Object.keys(kasaSettings).forEach((kasaId) => {
      const settings = {
        kasaId,
        advances: kasaSettings[kasaId as keyof typeof kasaSettings],
        lastUpdated: new Date().toISOString(),
        updatedBy: localStorage.getItem('currentUserName') || 'Genel Müdür'
      };
      localStorage.setItem(`kasaSettings_${kasaId}`, JSON.stringify(settings));
    });

    setSaveMessage('success');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const updateKasaAdvance = (kasaId: 'wildpark' | 'sinema' | 'face2face', field: 'tlAdvance' | 'usdAdvance' | 'eurAdvance', value: number) => {
    setKasaSettings(prev => ({
      ...prev,
      [kasaId]: {
        ...prev[kasaId],
        [field]: value
      }
    }));
  };

  const kasaColors = {
    wildpark: { bg: 'from-green-900/20 to-green-800/10', border: 'border-green-700/30', text: 'text-green-400', name: 'WildPark' },
    sinema: { bg: 'from-blue-900/20 to-blue-800/10', border: 'border-blue-700/30', text: 'text-blue-400', name: 'XD Sinema' },
    face2face: { bg: 'from-purple-900/20 to-purple-800/10', border: 'border-purple-700/30', text: 'text-purple-400', name: 'Face2Face' }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-orange-400" />
          Kasa Avans Ayarları
        </h2>
        
        {saveMessage === 'success' && (
          <div className="bg-green-900/20 border border-green-500/50 rounded-lg px-4 py-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-300">Tüm avanslar kaydedildi!</span>
          </div>
        )}
      </div>

      {/* Kasa Seçimi */}
      <div className="flex gap-2">
        {(Object.keys(kasaColors) as Array<keyof typeof kasaColors>).map((kasaId) => (
          <button
            key={kasaId}
            onClick={() => setSelectedKasa(kasaId)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              selectedKasa === kasaId
                ? `bg-gradient-to-r ${kasaColors[kasaId].bg} border ${kasaColors[kasaId].border} ${kasaColors[kasaId].text}`
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {kasaColors[kasaId].name}
          </button>
        ))}
      </div>

      {/* Avans Formları */}
      <div className={`bg-gradient-to-br ${kasaColors[selectedKasa].bg} border ${kasaColors[selectedKasa].border} rounded-lg p-6`}>
        <h3 className={`text-xl font-bold ${kasaColors[selectedKasa].text} mb-6`}>
          {kasaColors[selectedKasa].name} Avansları
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TL Avans */}
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
            <label className="block text-sm text-blue-300 mb-2 font-medium">TL Avansı</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={kasaSettings[selectedKasa].tlAdvance}
                onChange={(e) => updateKasaAdvance(selectedKasa, 'tlAdvance', Number(e.target.value))}
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white text-lg"
              />
              <span className="text-blue-400 font-bold">₺</span>
            </div>
          </div>

          {/* USD Avans */}
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
            <label className="block text-sm text-yellow-300 mb-2 font-medium">USD Avansı</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={kasaSettings[selectedKasa].usdAdvance}
                onChange={(e) => updateKasaAdvance(selectedKasa, 'usdAdvance', Number(e.target.value))}
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white text-lg"
              />
              <span className="text-yellow-400 font-bold">$</span>
            </div>
          </div>

          {/* EUR Avans */}
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
            <label className="block text-sm text-purple-300 mb-2 font-medium">EUR Avansı</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={kasaSettings[selectedKasa].eurAdvance}
                onChange={(e) => updateKasaAdvance(selectedKasa, 'eurAdvance', Number(e.target.value))}
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white text-lg"
              />
              <span className="text-purple-400 font-bold">€</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tüm Kasaların Özeti */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">📊 Tüm Kasalar Özeti</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(kasaColors) as Array<keyof typeof kasaColors>).map((kasaId) => (
            <div key={kasaId} className={`bg-gradient-to-br ${kasaColors[kasaId].bg} border ${kasaColors[kasaId].border} rounded-lg p-4`}>
              <h4 className={`font-bold ${kasaColors[kasaId].text} mb-3`}>{kasaColors[kasaId].name}</h4>
              <div className="space-y-2 text-sm text-white">
                <div className="flex justify-between">
                  <span>TL:</span>
                  <span className="font-semibold">{kasaSettings[kasaId].tlAdvance.toLocaleString()} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span>USD:</span>
                  <span className="font-semibold">{kasaSettings[kasaId].usdAdvance.toLocaleString()} $</span>
                </div>
                <div className="flex justify-between">
                  <span>EUR:</span>
                  <span className="font-semibold">{kasaSettings[kasaId].eurAdvance.toLocaleString()} €</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kaydet Butonu */}
      <button
        onClick={handleSaveAdvances}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        <Save className="w-6 h-6" />
        Tüm Avansları Kaydet
      </button>

      {/* Bilgilendirme */}
      <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
        <h4 className="text-sm font-bold text-blue-400 mb-2">💡 Bilgi:</h4>
        <ul className="text-xs text-blue-300 space-y-1 list-disc list-inside">
          <li>Avans değişiklikleri tüm kasalar için aynı anda kaydedilir</li>
          <li>Değişiklikler anında Dashboard panellerine yansır</li>
          <li>Her kasanın avansları bağımsız olarak yönetilebilir</li>
          <li>Sadece Genel Müdür avans ayarlarını değiştirebilir</li>
        </ul>
      </div>
    </div>
  );
}
