import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { PackageItem } from '@/data/packages';

// Her kasa için paket koleksiyonu isimleri
const KASA_COLLECTIONS = {
  wildpark: 'wildpark_packages',
  sinema: 'sinema_packages',
  face2face: 'face2face_packages'
};

/**
 * Belirli bir kasanın paketlerini Firebase'den çeker
 */
export async function getPackagesByKasa(kasaId: string): Promise<PackageItem[]> {
  try {
    const collectionName = KASA_COLLECTIONS[kasaId as keyof typeof KASA_COLLECTIONS];
    if (!collectionName) {
      console.error('Geçersiz kasa ID:', kasaId);
      return [];
    }

    const packagesRef = collection(db, collectionName);
    const snapshot = await getDocs(packagesRef);
    
    const packages: PackageItem[] = [];
    snapshot.forEach((doc) => {
      packages.push({ id: doc.id, ...doc.data() } as PackageItem);
    });
    
    return packages;
  } catch (error) {
    console.error('Paketler çekilirken hata:', error);
    return [];
  }
}

/**
 * Belirli bir kasaya yeni paket ekler
 */
export async function addPackage(kasaId: string, packageData: PackageItem): Promise<boolean> {
  try {
    const collectionName = KASA_COLLECTIONS[kasaId as keyof typeof KASA_COLLECTIONS];
    if (!collectionName) return false;

    const packageRef = doc(db, collectionName, packageData.id);
    await setDoc(packageRef, {
      name: packageData.name,
      category: packageData.category,
      adultPrice: packageData.adultPrice,
      childPrice: packageData.childPrice,
      currency: packageData.currency
    });
    
    return true;
  } catch (error) {
    console.error('Paket eklenirken hata:', error);
    return false;
  }
}

/**
 * Paketi günceller
 */
export async function updatePackage(kasaId: string, packageId: string, updates: Partial<PackageItem>): Promise<boolean> {
  try {
    const collectionName = KASA_COLLECTIONS[kasaId as keyof typeof KASA_COLLECTIONS];
    if (!collectionName) return false;

    const packageRef = doc(db, collectionName, packageId);
    await updateDoc(packageRef, updates);
    
    return true;
  } catch (error) {
    console.error('Paket güncellenirken hata:', error);
    return false;
  }
}

/**
 * Paketi siler
 */
export async function deletePackage(kasaId: string, packageId: string): Promise<boolean> {
  try {
    const collectionName = KASA_COLLECTIONS[kasaId as keyof typeof KASA_COLLECTIONS];
    if (!collectionName) return false;

    const packageRef = doc(db, collectionName, packageId);
    await deleteDoc(packageRef);
    
    return true;
  } catch (error) {
    console.error('Paket silinirken hata:', error);
    return false;
  }
}

/**
 * Tüm paketleri Firebase'e yükler (ilk kurulum için)
 */
export async function uploadAllPackages(kasaId: string, packages: PackageItem[]): Promise<boolean> {
  try {
    const collectionName = KASA_COLLECTIONS[kasaId as keyof typeof KASA_COLLECTIONS];
    if (!collectionName) return false;

    for (const pkg of packages) {
      const packageRef = doc(db, collectionName, pkg.id);
      await setDoc(packageRef, {
        name: pkg.name,
        category: pkg.category,
        adultPrice: pkg.adultPrice,
        childPrice: pkg.childPrice,
        currency: pkg.currency
      });
    }
    
    console.log(`${kasaId} için ${packages.length} paket yüklendi`);
    return true;
  } catch (error) {
    console.error('Paketler yüklenirken hata:', error);
    return false;
  }
}
