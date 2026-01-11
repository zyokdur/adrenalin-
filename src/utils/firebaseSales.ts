// Firebase satış yönetimi
import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür
 */
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Aktif kasa ID'sini döndürür
 */
export function getActiveKasaId(): string {
  return localStorage.getItem('currentKasaId') || 'default';
}

// ==================== SATIŞLAR ====================

/**
 * Günlük satışları Firebase'e kaydeder
 */
export async function saveSalesToFirebase(sales: any[]): Promise<void> {
  const kasaId = getActiveKasaId();
  const today = getTodayDate();
  
  try {
    const docRef = doc(db, 'sales', kasaId, 'daily', today);
    await setDoc(docRef, {
      sales: sales,
      kasaId: kasaId,
      date: today,
      updatedAt: Timestamp.now()
    });
    
    // Aynı zamanda localStorage'a da kaydet (offline backup)
    localStorage.setItem(`daily_sales_${kasaId}`, JSON.stringify({
      date: today,
      sales: sales,
      savedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Firebase kayıt hatası:', error);
    // Offline durumda sadece localStorage'a kaydet
    localStorage.setItem(`daily_sales_${kasaId}`, JSON.stringify({
      date: today,
      sales: sales,
      savedAt: new Date().toISOString()
    }));
  }
}

/**
 * Günlük satışları Firebase'den yükler
 */
export async function loadSalesFromFirebase(): Promise<any[]> {
  const kasaId = getActiveKasaId();
  const today = getTodayDate();
  
  try {
    const docRef = doc(db, 'sales', kasaId, 'daily', today);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // localStorage'ı da güncelle
      localStorage.setItem(`daily_sales_${kasaId}`, JSON.stringify({
        date: today,
        sales: data.sales,
        savedAt: new Date().toISOString()
      }));
      return data.sales || [];
    }
    
    // Firebase'de yoksa localStorage'dan kontrol et
    return loadSalesFromLocalStorage();
  } catch (error) {
    console.error('Firebase okuma hatası:', error);
    // Offline durumda localStorage'dan oku
    return loadSalesFromLocalStorage();
  }
}

/**
 * localStorage'dan satış yükle (offline backup)
 */
function loadSalesFromLocalStorage(): any[] {
  const kasaId = getActiveKasaId();
  const data = localStorage.getItem(`daily_sales_${kasaId}`);
  if (!data) return [];
  
  try {
    const parsed = JSON.parse(data);
    const today = getTodayDate();
    
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
 * Satışları real-time dinle
 */
export function subscribeSales(callback: (sales: any[]) => void): () => void {
  const kasaId = getActiveKasaId();
  const today = getTodayDate();
  
  const docRef = doc(db, 'sales', kasaId, 'daily', today);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().sales || []);
    }
  }, (error) => {
    console.error('Satış dinleme hatası:', error);
  });
}

// ==================== ÇAPRAZ SATIŞLAR ====================

/**
 * Çapraz satışları Firebase'e kaydeder
 */
export async function saveCrossSalesToFirebase(crossSales: any[]): Promise<void> {
  const kasaId = getActiveKasaId();
  const today = getTodayDate();
  
  try {
    const docRef = doc(db, 'crossSales', kasaId, 'daily', today);
    await setDoc(docRef, {
      crossSales: crossSales,
      kasaId: kasaId,
      date: today,
      updatedAt: Timestamp.now()
    });
    
    // localStorage backup
    localStorage.setItem(`daily_cross_sales_${kasaId}`, JSON.stringify({
      date: today,
      crossSales: crossSales,
      savedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Firebase kayıt hatası:', error);
    localStorage.setItem(`daily_cross_sales_${kasaId}`, JSON.stringify({
      date: today,
      crossSales: crossSales,
      savedAt: new Date().toISOString()
    }));
  }
}

/**
 * Çapraz satışları Firebase'den yükler
 */
export async function loadCrossSalesFromFirebase(): Promise<any[]> {
  const kasaId = getActiveKasaId();
  const today = getTodayDate();
  
  try {
    const docRef = doc(db, 'crossSales', kasaId, 'daily', today);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      localStorage.setItem(`daily_cross_sales_${kasaId}`, JSON.stringify({
        date: today,
        crossSales: data.crossSales,
        savedAt: new Date().toISOString()
      }));
      return data.crossSales || [];
    }
    
    return loadCrossSalesFromLocalStorage();
  } catch (error) {
    console.error('Firebase okuma hatası:', error);
    return loadCrossSalesFromLocalStorage();
  }
}

/**
 * localStorage'dan çapraz satış yükle
 */
function loadCrossSalesFromLocalStorage(): any[] {
  const kasaId = getActiveKasaId();
  const data = localStorage.getItem(`daily_cross_sales_${kasaId}`);
  if (!data) return [];
  
  try {
    const parsed = JSON.parse(data);
    const today = getTodayDate();
    
    if (parsed.date !== today) {
      localStorage.removeItem(`daily_cross_sales_${kasaId}`);
      return [];
    }
    
    return parsed.crossSales || [];
  } catch {
    return [];
  }
}

/**
 * Çapraz satışları real-time dinle
 */
export function subscribeCrossSales(callback: (crossSales: any[]) => void): () => void {
  const kasaId = getActiveKasaId();
  const today = getTodayDate();
  
  const docRef = doc(db, 'crossSales', kasaId, 'daily', today);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().crossSales || []);
    }
  }, (error) => {
    console.error('Çapraz satış dinleme hatası:', error);
  });
}

// ==================== TEMİZLİK ====================

/**
 * Eski günlerin satışlarını siler (Excel alındıktan sonra çağrılabilir)
 */
export async function clearOldSales(kasaId: string, date: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'sales', kasaId, 'daily', date));
    await deleteDoc(doc(db, 'crossSales', kasaId, 'daily', date));
    console.log(`${kasaId} kasasının ${date} tarihli satışları silindi`);
  } catch (error) {
    console.error('Silme hatası:', error);
  }
}

/**
 * Bugünün satışlarını siler (Excel alındıktan sonra)
 */
export async function clearTodaySales(): Promise<void> {
  const kasaId = getActiveKasaId();
  const today = getTodayDate();
  
  try {
    await deleteDoc(doc(db, 'sales', kasaId, 'daily', today));
    await deleteDoc(doc(db, 'crossSales', kasaId, 'daily', today));
    
    // localStorage'ı da temizle
    localStorage.removeItem(`daily_sales_${kasaId}`);
    localStorage.removeItem(`daily_cross_sales_${kasaId}`);
    
    console.log('Günlük satışlar temizlendi');
  } catch (error) {
    console.error('Temizleme hatası:', error);
  }
}
