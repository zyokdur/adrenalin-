import { KasaSettings, DEFAULT_KASA_SETTINGS } from '@/types/kasaSettings';

const STORAGE_KEY = 'kasa_settings_db';

// Kasa ayarlarını başlat
export function initializeKasaSettings(): void {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_KASA_SETTINGS));
  }
}

// Tüm kasa ayarlarını getir
export function getAllKasaSettings(): Record<string, KasaSettings> {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : DEFAULT_KASA_SETTINGS;
}

// Belirli bir kasa ayarlarını getir
export function getKasaSettings(kasaId: string): KasaSettings {
  const allSettings = getAllKasaSettings();
  return allSettings[kasaId] || DEFAULT_KASA_SETTINGS[kasaId];
}

// Kasa ayarlarını güncelle
export function updateKasaSettings(
  kasaId: string, 
  updates: Partial<KasaSettings>,
  updatedBy?: string
): void {
  const allSettings = getAllKasaSettings();
  allSettings[kasaId] = {
    ...allSettings[kasaId],
    ...updates,
    lastUpdated: new Date().toISOString(),
    updatedBy
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allSettings));
}

// Avansları güncelle
export function updateKasaAdvances(
  kasaId: string,
  advances: { tlAdvance: number; usdAdvance: number; eurAdvance: number },
  updatedBy?: string
): void {
  const settings = getKasaSettings(kasaId);
  updateKasaSettings(kasaId, {
    ...settings,
    advances
  }, updatedBy);
}

// Paketleri güncelle
export function updateKasaPackages(
  kasaId: string,
  packages: any[],
  updatedBy?: string
): void {
  const settings = getKasaSettings(kasaId);
  updateKasaSettings(kasaId, {
    ...settings,
    packages
  }, updatedBy);
}

// Varsayılan ayarlara sıfırla
export function resetKasaSettings(kasaId: string): void {
  const allSettings = getAllKasaSettings();
  allSettings[kasaId] = DEFAULT_KASA_SETTINGS[kasaId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allSettings));
}
