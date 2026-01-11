import { Personnel, DEFAULT_PERSONNEL } from '@/types/personnel';

const STORAGE_KEY = 'personnel_db';

// Personel veritabanını başlat
export function initializePersonnelDB(): void {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PERSONNEL));
  } else {
    // Var olan veritabanında genel müdür var mı kontrol et
    const personnel: Personnel[] = JSON.parse(existing);
    const hasGeneralManager = personnel.some(p => p.role === 'genel_mudur');
    
    if (!hasGeneralManager) {
      // Genel müdürü ekle
      const generalManager = DEFAULT_PERSONNEL.find(p => p.role === 'genel_mudur');
      if (generalManager) {
        personnel.push(generalManager);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(personnel));
        console.log('✅ Genel Müdür kullanıcısı eklendi');
      }
    }
  }
}

// Tüm personelleri getir
export function getAllPersonnel(): Personnel[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : DEFAULT_PERSONNEL;
}

// Kasaya göre personelleri getir
export function getPersonnelByKasa(kasaId: string): Personnel[] {
  const allPersonnel = getAllPersonnel();
  return allPersonnel.filter(p => p.kasaId === kasaId);
}

// Kullanıcı adı ve şifre ile giriş yap
export function authenticatePersonnel(
  kasaId: string, 
  username: string, 
  password: string
): Personnel | null {
  const allPersonnel = getAllPersonnel();
  
  // Genel müdür için tüm personellerde ara
  if (kasaId === 'genel') {
    const found = allPersonnel.find(
      p => p.username.toLowerCase() === username.toLowerCase() && 
           p.password === password &&
           p.role === 'genel_mudur'
    );
    return found || null;
  }
  
  // Normal kasalar için kasaId'ye göre filtrele
  const personnel = getPersonnelByKasa(kasaId);
  const found = personnel.find(
    p => p.username.toLowerCase() === username.toLowerCase() && p.password === password
  );
  return found || null;
}

// Yeni personel ekle
export function addPersonnel(personnel: Personnel): void {
  const allPersonnel = getAllPersonnel();
  allPersonnel.push(personnel);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allPersonnel));
}

// Personel güncelle
export function updatePersonnel(id: string, updates: Partial<Personnel>): void {
  const allPersonnel = getAllPersonnel();
  const index = allPersonnel.findIndex(p => p.id === id);
  if (index !== -1) {
    allPersonnel[index] = { ...allPersonnel[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPersonnel));
  }
}

// Personel sil
export function deletePersonnel(id: string): void {
  const allPersonnel = getAllPersonnel();
  const filtered = allPersonnel.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// ID'ye göre personel getir
export function getPersonnelById(id: string): Personnel | null {
  const allPersonnel = getAllPersonnel();
  return allPersonnel.find(p => p.id === id) || null;
}
