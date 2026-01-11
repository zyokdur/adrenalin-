import { useState } from 'react';
import { Monitor, Users, TreePine, LogIn } from 'lucide-react';

export interface KasaInfo {
  id: 'wildpark' | 'sinema' | 'face2face';
  name: string;
  title: string;
  paxName: string;
  color: string;
  icon: React.ReactNode;
}

export const KASA_LIST: KasaInfo[] = [
  {
    id: 'wildpark',
    name: 'WildPark',
    title: 'WİLDPARK GÜNLÜK MÜNFERİT ve ACENTE',
    paxName: 'Wildpark Pax',
    color: 'from-green-600 to-emerald-700',
    icon: <TreePine className="w-12 h-12" />
  },
  {
    id: 'sinema',
    name: 'XD Sinema',
    title: 'SİNEMA GÜNLÜK MÜNFERİT ve ACENTE',
    paxName: 'Sinema Pax',
    color: 'from-purple-600 to-violet-700',
    icon: <Monitor className="w-12 h-12" />
  },
  {
    id: 'face2face',
    name: 'Face 2 Face',
    title: 'FACE 2 FACE GÜNLÜK MÜNFERİT ve ACENTE',
    paxName: 'Face 2 Face Pax',
    color: 'from-blue-600 to-cyan-700',
    icon: <Users className="w-12 h-12" />
  }
];

interface LoginPageProps {
  onLogin: (kasa: KasaInfo, userName: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedKasa, setSelectedKasa] = useState<KasaInfo | null>(null);
  const [userName, setUserName] = useState('');
  const [step, setStep] = useState<'kasa' | 'user'>('kasa');

  const handleKasaSelect = (kasa: KasaInfo) => {
    setSelectedKasa(kasa);
    setStep('user');
  };

  const handleLogin = () => {
    if (!selectedKasa || !userName.trim()) {
      alert('Lütfen isminizi girin');
      return;
    }
    onLogin(selectedKasa, userName.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo / Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎢 Günlük Rapor Sistemi</h1>
          <p className="text-gray-400">Kasa seçimi yapın ve giriş yapın</p>
        </div>

        {step === 'kasa' ? (
          /* Kasa Seçimi */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {KASA_LIST.map((kasa) => (
              <button
                key={kasa.id}
                onClick={() => handleKasaSelect(kasa)}
                className={`bg-gradient-to-br ${kasa.color} p-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 group`}
              >
                <div className="flex flex-col items-center text-white">
                  <div className="mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
                    {kasa.icon}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{kasa.name}</h2>
                  <p className="text-sm opacity-75">Kasaya Giriş Yap</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Kullanıcı Adı Girişi */
          <div className="max-w-md mx-auto">
            <div className={`bg-gradient-to-br ${selectedKasa?.color} p-1 rounded-2xl shadow-2xl`}>
              <div className="bg-gray-900 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 mb-4">
                    {selectedKasa?.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedKasa?.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">Kasasına Giriş</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Personel Adınız</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Adınızı girin..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-cyan-500 transition-colors"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={!userName.trim()}
                    className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all ${
                      userName.trim()
                        ? `bg-gradient-to-r ${selectedKasa?.color} hover:opacity-90`
                        : 'bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    <LogIn className="w-5 h-5" />
                    Giriş Yap
                  </button>

                  <button
                    onClick={() => {
                      setStep('kasa');
                      setSelectedKasa(null);
                      setUserName('');
                    }}
                    className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    ← Farklı Kasa Seç
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          © 2026 Günlük Rapor Sistemi
        </div>
      </div>
    </div>
  );
}
