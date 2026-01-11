import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Personnel } from '@/types/personnel';

const PERSONNEL_COLLECTION = 'personnel';

/**
 * Tüm personelleri Firebase'den çeker
 */
export async function getAllPersonnelFromFirebase(): Promise<Personnel[]> {
  try {
    const personnelRef = collection(db, PERSONNEL_COLLECTION);
    const snapshot = await getDocs(personnelRef);
    
    const personnel: Personnel[] = [];
    snapshot.forEach((doc) => {
      personnel.push({ id: doc.id, ...doc.data() } as Personnel);
    });
    
    return personnel;
  } catch (error) {
    console.error('Personeller çekilirken hata:', error);
    return [];
  }
}

/**
 * Yeni personel ekler
 */
export async function addPersonnelToFirebase(personnel: Personnel): Promise<boolean> {
  try {
    const personnelRef = doc(db, PERSONNEL_COLLECTION, personnel.id);
    await setDoc(personnelRef, {
      username: personnel.username,
      password: personnel.password,
      fullName: personnel.fullName,
      kasaId: personnel.kasaId,
      role: personnel.role,
      weeklyTargetHours: personnel.weeklyTargetHours || 45,
      isActive: personnel.isActive,
      createdAt: personnel.createdAt,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Personel Firebase\'e eklendi:', personnel.fullName);
    return true;
  } catch (error) {
    console.error('❌ Personel eklenirken hata:', error);
    return false;
  }
}

/**
 * Personeli günceller
 */
export async function updatePersonnelInFirebase(personnelId: string, updates: Partial<Personnel>): Promise<boolean> {
  try {
    const personnelRef = doc(db, PERSONNEL_COLLECTION, personnelId);
    await updateDoc(personnelRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Personel güncellendi:', personnelId);
    return true;
  } catch (error) {
    console.error('❌ Personel güncellenirken hata:', error);
    return false;
  }
}

/**
 * Personeli siler
 */
export async function deletePersonnelFromFirebase(personnelId: string): Promise<boolean> {
  try {
    const personnelRef = doc(db, PERSONNEL_COLLECTION, personnelId);
    await deleteDoc(personnelRef);
    
    console.log('✅ Personel silindi:', personnelId);
    return true;
  } catch (error) {
    console.error('❌ Personel silinirken hata:', error);
    return false;
  }
}

/**
 * Tüm personelleri Firebase'e yükler (ilk kurulum için)
 */
export async function uploadAllPersonnelToFirebase(personnel: Personnel[]): Promise<boolean> {
  try {
    for (const p of personnel) {
      const personnelRef = doc(db, PERSONNEL_COLLECTION, p.id);
      await setDoc(personnelRef, {
        username: p.username,
        password: p.password,
        fullName: p.fullName,
        kasaId: p.kasaId,
        role: p.role,
        weeklyTargetHours: p.weeklyTargetHours || 45,
        isActive: p.isActive !== undefined ? p.isActive : true,
        createdAt: p.createdAt,
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log(`✅ ${personnel.length} personel Firebase'e yüklendi`);
    return true;
  } catch (error) {
    console.error('❌ Personeller yüklenirken hata:', error);
    return false;
  }
}
