// Günlük veri yönetimi için utility fonksiyonlar

/**
 * Aktif kasa ID'sini döndürür
 */
export function getActiveKasaId(): string {
  return localStorage.getItem('activeKasaId') || 'default';
}

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür
 */
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Günlük satış verilerini localStorage'a kaydeder (KASA BAZLI)
 */
export function saveDailySales(sales: any[]): void {
  const today = getTodayDate();
  const kasaId = getActiveKasaId();
  const data = {
    date: today,
    sales: sales,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(`daily_sales_${kasaId}`, JSON.stringify(data));
}

/**
 * Günlük satış verilerini localStorage'dan yükler (KASA BAZLI)
 * Tarih geçmişse boş array döner
 */
export function loadDailySales(): any[] {
  const kasaId = getActiveKasaId();
  const data = localStorage.getItem(`daily_sales_${kasaId}`);
  if (!data) return [];
  
  try {
    const parsed = JSON.parse(data);
    const today = getTodayDate();
    
    // Tarih değişmişse eski verileri temizle
    if (parsed.date !== today) {
      localStorage.removeItem(`daily_sales_${kasaId}`);
      return [];
    }
    
    return parsed.sales || [];
  } catch {
    return [];
  }
}

/**
 * Kur değerlerini kaydeder
 */
export function saveExchangeRates(usdRate: number, eurRate: number): void {
  const data = {
    usd: usdRate,
    eur: eurRate,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem('exchange_rates', JSON.stringify(data));
}

/**
 * Kur değerlerini yükler
 */
export function loadExchangeRates(): { usd: number; eur: number } {
  const data = localStorage.getItem('exchange_rates');
  if (!data) return { usd: 30, eur: 50.4877 };
  
  try {
    const parsed = JSON.parse(data);
    return { usd: parsed.usd || 30, eur: parsed.eur || 50.4877 };
  } catch {
    return { usd: 30, eur: 50.4877 };
  }
}

/**
 * Çapraz satışları kaydeder (KASA BAZLI)
 */
export function saveCrossSales(crossSales: any[]): void {
  const today = getTodayDate();
  const kasaId = getActiveKasaId();
  const data = {
    date: today,
    crossSales: crossSales,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(`daily_cross_sales_${kasaId}`, JSON.stringify(data));
}

/**
 * Çapraz satışları yükler (KASA BAZLI)
 */
export function loadCrossSales(): any[] {
  const kasaId = getActiveKasaId();
  const data = localStorage.getItem(`daily_cross_sales_${kasaId}`);
  if (!data) return [];
  
  try {
    const parsed = JSON.parse(data);
    const today = getTodayDate();
    
    // Tarih değişmişse eski verileri temizle
    if (parsed.date !== today) {
      localStorage.removeItem(`daily_cross_sales_${kasaId}`);
      return [];
    }
    
    return parsed.crossSales || [];
  } catch {
    return [];
  }
}
