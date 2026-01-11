export interface PackageItem {
  id: string;
  name: string;
  category: 'Münferit' | 'Çapraz' | 'Acenta';
  adultPrice: number;
  childPrice: number;
  currency: 'TL' | 'USD' | 'EUR';
}

export const INITIAL_PACKAGES: PackageItem[] = [
  // Münferit - TL
  { id: '1', name: 'M.Y', category: 'Münferit', adultPrice: 325, childPrice: 245, currency: 'TL' },
  { id: '2', name: 'M.Y%15', category: 'Münferit', adultPrice: 276, childPrice: 208, currency: 'TL' },
  { id: '3', name: 'M.Y%20', category: 'Münferit', adultPrice: 260, childPrice: 196, currency: 'TL' },
  { id: '4', name: 'M.Y%30', category: 'Münferit', adultPrice: 228, childPrice: 172, currency: 'TL' },
  { id: '5', name: 'M.Y%40', category: 'Münferit', adultPrice: 195, childPrice: 147, currency: 'TL' },
  { id: '6', name: 'M.Y%50', category: 'Münferit', adultPrice: 163, childPrice: 123, currency: 'TL' },
  { id: '7', name: 'M.Kurum', category: 'Münferit', adultPrice: 228, childPrice: 172, currency: 'TL' },
  { id: '8', name: 'Family', category: 'Münferit', adultPrice: 225, childPrice: 160, currency: 'TL' },
  { id: '9', name: 'Öğrenci', category: 'Münferit', adultPrice: 145, childPrice: 125, currency: 'TL' },
  { id: '10', name: 'Öğrenci/Acenta/Kreş', category: 'Münferit', adultPrice: 125, childPrice: 110, currency: 'TL' },
  // Münferit - USD
  { id: '11', name: 'Visitor', category: 'Münferit', adultPrice: 21, childPrice: 16, currency: 'USD' },
  { id: '12', name: 'V%25', category: 'Münferit', adultPrice: 16, childPrice: 12, currency: 'USD' },
  { id: '13', name: 'V%35', category: 'Münferit', adultPrice: 14, childPrice: 11, currency: 'USD' },
  { id: '14', name: 'V%Özel', category: 'Münferit', adultPrice: 10, childPrice: 10, currency: 'USD' },
  { id: '15', name: 'V%50', category: 'Münferit', adultPrice: 11, childPrice: 8, currency: 'USD' },
  // Münferit - EUR
  { id: '16', name: 'Visitor', category: 'Münferit', adultPrice: 20, childPrice: 15, currency: 'EUR' },
  { id: '17', name: 'V%25', category: 'Münferit', adultPrice: 15, childPrice: 11, currency: 'EUR' },
  { id: '18', name: 'V%35', category: 'Münferit', adultPrice: 13, childPrice: 10, currency: 'EUR' },
  { id: '19', name: 'V%Özel', category: 'Münferit', adultPrice: 10, childPrice: 10, currency: 'EUR' },
  { id: '20', name: 'V%50', category: 'Münferit', adultPrice: 10, childPrice: 8, currency: 'EUR' },

  // Çapraz - TL
  { id: '21', name: 'Ç.XD+ WP', category: 'Çapraz', adultPrice: 500, childPrice: 380, currency: 'TL' },
  { id: '22', name: 'Ç.XD + F2F', category: 'Çapraz', adultPrice: 450, childPrice: 350, currency: 'TL' },
  { id: '23', name: 'Ç.XD+F2F+WP', category: 'Çapraz', adultPrice: 690, childPrice: 510, currency: 'TL' },
  { id: '24', name: 'MARKET3', category: 'Çapraz', adultPrice: 536, childPrice: 404, currency: 'TL' },
  // Çapraz - USD
  { id: '25', name: 'Ç.V.XD+ WP', category: 'Çapraz', adultPrice: 35, childPrice: 25, currency: 'USD' },
  { id: '26', name: 'Ç.V.XD+ F2F', category: 'Çapraz', adultPrice: 35, childPrice: 25, currency: 'USD' },
  { id: '27', name: 'Ç.V.XD+F2F+WP', category: 'Çapraz', adultPrice: 50, childPrice: 40, currency: 'USD' },
  { id: '28', name: 'MARKET3 VISITOR', category: 'Çapraz', adultPrice: 30, childPrice: 20, currency: 'USD' },
  // Çapraz - EUR
  { id: '29', name: 'Ç.V.XD+ WP', category: 'Çapraz', adultPrice: 33, childPrice: 23, currency: 'EUR' },
  { id: '30', name: 'Ç.V.XD + F2F', category: 'Çapraz', adultPrice: 33, childPrice: 23, currency: 'EUR' },
  { id: '31', name: 'Ç.V.XD+F2F+WP', category: 'Çapraz', adultPrice: 48, childPrice: 38, currency: 'EUR' },
  { id: '32', name: 'MARKET3 VISITOR', category: 'Çapraz', adultPrice: 29, childPrice: 19, currency: 'EUR' },

  // Acenta - USD
  { id: '33', name: 'Acenta $12', category: 'Acenta', adultPrice: 12, childPrice: 12, currency: 'USD' },
  { id: '34', name: 'Acenta $11', category: 'Acenta', adultPrice: 11, childPrice: 11, currency: 'USD' },
  { id: '35', name: 'Acenta $10', category: 'Acenta', adultPrice: 10, childPrice: 10, currency: 'USD' },
  { id: '36', name: 'Acenta $9', category: 'Acenta', adultPrice: 9, childPrice: 9, currency: 'USD' },
  { id: '37', name: 'Acenta $8', category: 'Acenta', adultPrice: 8, childPrice: 8, currency: 'USD' },
  { id: '38', name: 'Acenta $7', category: 'Acenta', adultPrice: 7, childPrice: 7, currency: 'USD' },
  { id: '39', name: 'Acenta $6', category: 'Acenta', adultPrice: 6, childPrice: 6, currency: 'USD' },
  // Acenta - EUR
  { id: '40', name: 'Acenta €12', category: 'Acenta', adultPrice: 12, childPrice: 12, currency: 'EUR' },
  { id: '41', name: 'Acenta €11', category: 'Acenta', adultPrice: 11, childPrice: 11, currency: 'EUR' },
  { id: '42', name: 'Acenta €10', category: 'Acenta', adultPrice: 10, childPrice: 10, currency: 'EUR' },
  { id: '43', name: 'Acenta €9', category: 'Acenta', adultPrice: 9, childPrice: 9, currency: 'EUR' },
  { id: '44', name: 'Acenta €8', category: 'Acenta', adultPrice: 8, childPrice: 8, currency: 'EUR' },
  { id: '45', name: 'Acenta €7', category: 'Acenta', adultPrice: 7, childPrice: 7, currency: 'EUR' },
  { id: '46', name: 'Acenta €6', category: 'Acenta', adultPrice: 6, childPrice: 6, currency: 'EUR' },
];
