import { uploadAllPackages } from './firebasePackages';
import { uploadAllPersonnelToFirebase } from './firebasePersonnel';
import { INITIAL_PACKAGES } from '@/data/packages';
import { DEFAULT_PERSONNEL } from '@/types/personnel';

/**
 * Tüm kasaların paketlerini ve personellerini Firebase'e yükler
 * Bu fonksiyon sadece İLK KURULUMDA bir kez çalıştırılmalı
 */
export async function initializeFirebaseData() {
  console.log('🔥 Firebase verileri yükleniyor...');
  
  // Paketleri yükle
  const kasas = ['wildpark', 'sinema', 'face2face'];
  
  for (const kasa of kasas) {
    console.log(`📦 ${kasa} için paketler yükleniyor...`);
    const success = await uploadAllPackages(kasa, INITIAL_PACKAGES);
    
    if (success) {
      console.log(`✅ ${kasa} paketleri başarıyla yüklendi (${INITIAL_PACKAGES.length} adet)`);
    } else {
      console.error(`❌ ${kasa} paketleri yüklenemedi!`);
    }
  }
  
  // Personelleri yükle
  console.log('👥 Personeller yükleniyor...');
  const personnelSuccess = await uploadAllPersonnelToFirebase(DEFAULT_PERSONNEL);
  
  if (personnelSuccess) {
    console.log(`✅ ${DEFAULT_PERSONNEL.length} personel başarıyla yüklendi`);
  } else {
    console.error('❌ Personeller yüklenemedi!');
  }
  
  console.log('🎉 Firebase başlatma tamamlandı!');
  
  // localStorage'a işaretle ki bir daha yüklenmesin
  localStorage.setItem('firebaseInitialized', 'true');
}

/**
 * Firebase'in başlatılıp başlatılmadığını kontrol eder
 */
export function isFirebaseInitialized(): boolean {
  return localStorage.getItem('firebaseInitialized') === 'true';
}

/**
 * Firebase başlatma durumunu sıfırlar (geliştirme için)
 */
export function resetFirebaseInitialization() {
  localStorage.removeItem('firebaseInitialized');
  console.log('🔄 Firebase başlatma durumu sıfırlandı');
}
