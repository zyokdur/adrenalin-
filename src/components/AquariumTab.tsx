import { useState, KeyboardEvent } from 'react';
import { Mail, Plus, Trash2, FileSpreadsheet } from 'lucide-react';

interface PaxEntry {
  id: string;
  name: string;
  adult: number;
  child: number;
}

interface SavedData {
  acente: string[];
  munferit: string[];
  sinema: string[];
}

// Kasa bilgisi
interface KasaConfig {
  title: string;
  paxName: string;
  section1: string;
  section2: string;
  section3: string;
}

// Kasa konfigürasyonları
const getKasaConfig = (kasaId: string): KasaConfig => {
  switch (kasaId) {
    case 'sinema':
      return {
        title: 'SİNEMA GÜNLÜK MÜNFERİT ve ACENTE',
        paxName: 'Sinema Pax',
        section1: 'SİNEMA ACENTE',
        section2: 'SİNEMA MÜNFERİT',
        section3: '@ ÖZEL GÖSTERİM'
      };
    case 'face2face':
      return {
        title: 'FACE 2 FACE GÜNLÜK MÜNFERİT ve ACENTE',
        paxName: 'Face 2 Face Pax',
        section1: 'FACE 2 FACE ACENTE',
        section2: 'FACE 2 FACE MÜNFERİT',
        section3: '@ ÖZEL ETKİNLİK'
      };
    default: // wildpark
      return {
        title: 'WİLDPARK GÜNLÜK MÜNFERİT ve ACENTE',
        paxName: 'Wildpark Pax',
        section1: 'AKVARYUM ACENTE',
        section2: 'AKVARYUM MÜNFERİT',
        section3: '@ SİNEMA'
      };
  }
};

// Varsayılan acente listesi
const DEFAULT_ACENTE_LIST = [
  'ADLER TURIZM', 'ALANYA AQUA PARK', 'ALBATROS GROUP', 'ALBATROS TURİZM', 'ALESTA TOUR',
  'ALYA TRAVEL', 'AMAZON TUR', 'ANEX TOUR', 'ANTEKS TURİZM', 'ANTİK TURİZM',
  'APOLLONIA', 'AQUAFUN', 'AQUA PARK', 'ARTUR TURİZM', 'ATLAS GLOBAL',
  'ATLAS TOUR', 'BLUE SKY', 'BRAVO TURİZM', 'CARTOUR', 'CITY TOUR',
  'CLUB ASYA', 'CLUB MED', 'CLUB TURİZM', 'COMET TURİZM', 'CORAL TRAVEL',
  'CROWN TURİZM', 'DELTA TOUR', 'DETUR', 'DIAMOND', 'DOLPHIN',
  'ECE TURİZM', 'EGE TUR', 'ELITE TURİZM', 'ENTOUR', 'ERKATUR',
  'EURO TURİZM', 'FLY TOUR', 'FTI', 'GLOBAL TURİZM', 'GOLDEN TOUR',
  'GREEN TURİZM', 'GRUPPOTUR', 'GUNESTR', 'HERO TOUR', 'HIT TURİZM',
  'HOLIDAY', 'HORIZON', 'İDA TUR', 'INTOURIST', 'JOLLY TUR',
  'KAMIL KOC', 'KARTAL TURİZM', 'KEMER TOUR', 'KIVILCIM', 'KOMPAS',
  'LARA TUR', 'LIBERTY', 'LIMAK TURİZM', 'LYRA TURİZM', 'MAESTRO',
  'MARTI TURİZM', 'MEGA TUR', 'MELEK TURİZM', 'MERİT TURİZM', 'METRO',
  'MICKY TOUR', 'MOON TOUR', 'NEPTUN', 'NET TURİZM', 'NOVA TURİZM',
  'ODA TURİZM', 'ODEON', 'ONUR AIR', 'ORANGE TOUR', 'ORİON TUR',
  'ÖGER TOURS', 'ÖZBEK TURİZM', 'ÖZLEM TURİZM', 'PAMFILA', 'PARK TURİZM',
  'PEGAS', 'PHOENIX', 'PREMIUM', 'PRINCESS', 'PRONTO TUR',
  'RENT A CAR', 'RIVIERA', 'ROBINSON', 'ROYAL TURİZM', 'SALAMIS',
  'SAMBA TURİZM', 'SANDRAS', 'SEKO TURİZM', 'SETUR', 'SEYTUR',
  'SIDE TOUR', 'SILVA TURİZM', 'SKY TURİZM', 'SMART TURİZM', 'STA TURİZM',
  'STAR TURİZM', 'SUN EXPRESS', 'SUNMAR', 'SUNSET', 'TAKSIM TURİZM',
  'TANTUR', 'TATIL', 'TED TURİZM', 'TEZ TOUR', 'TUI',
  'TUREKS', 'TURKUAZ', 'TURNA TURİZM', 'ULUSOY', 'ULYSSES',
  'UNICORN', 'VIKING TURİZM', 'VIP TURİZM', 'VOYAGE', 'WHITE',
  'WORLD TURİZM', 'YESIL TOUR', 'ZEHRA TURİZM', 'ZENITH', 'ZEUS TURİZM'
];

// Varsayılan münferit listesi
const DEFAULT_MUNFERIT_LIST = [
  'MÜNFERİT MEGA', 'MÜNFERİT AQUA+XD', 'MÜNFERİT AQUA+SİNEMA', 'MÜNFERİT SİNEMA+XD',
  'MÜNFERİT SİNEMA', 'MÜNFERİT XD', 'MÜNFERİT AQUA', 'ENGELLİ MEGA', 'ENGELLİ AQUA+XD',
  'ENGELLİ AQUA+SİNEMA', 'ENGELLİ SİNEMA+XD', 'ENGELLİ SİNEMA', 'ENGELLİ XD', 'ENGELLİ AQUA',
  'GAZI VE ŞEHİT MEGA', 'GAZI VE ŞEHİT AQUA+XD', 'GAZI VE ŞEHİT SİNEMA', 'GAZI VE ŞEHİT XD',
  'BIM KAMPANYA', 'ALYA MEGA', 'ALYA AQUA+XD', 'ALYA SİNEMA', 'ALYA XD'
];

// Varsayılan sinema listesi
const DEFAULT_SINEMA_LIST = [
  'XD SİNEMA', 'NORMAL SİNEMA', 'VIP SİNEMA', '3D SİNEMA', 'IMAX',
  'ÖZEL GÖSTERİM', 'GALA', 'ÇOCUK FİLMİ', 'KORKU FİLMİ', 'AKSİYON'
];

export default function AquariumTab() {
  // Kasa bilgisi - localStorage'dan
  const kasaId = localStorage.getItem('currentKasaId') || 'wildpark';
  const kasaConfig = getKasaConfig(kasaId);
  
  // Personel adı otomatik - localStorage'dan (login olan kullanıcı)
  const userName = localStorage.getItem('currentUserName') || 'Personel';
  
  // Tarih otomatik bugün - değiştirilemez
  const reportDate = new Date().toISOString().split('T')[0];
  
  // Her bölüm için ayrı state
  const [acenteEntries, setAcenteEntries] = useState<PaxEntry[]>([]);
  const [munferitEntries, setMunferitEntries] = useState<PaxEntry[]>([]);
  const [sinemaEntries, setSinemaEntries] = useState<PaxEntry[]>([]);
  
  // Form verileri
  const [acenteForm, setAcenteForm] = useState({ name: '', adult: '', child: '' });
  const [munferitForm, setMunferitForm] = useState({ name: '', adult: '', child: '' });
  const [sinemaForm, setSinemaForm] = useState({ name: '', adult: '', child: '' });
  
  // Hafızadaki isimler - varsayılan listelerle birleştirilmiş
  const [savedNames, setSavedNames] = useState<SavedData>(() => {
    const saved = localStorage.getItem('aquariumSavedNames');
    const parsed = saved ? JSON.parse(saved) : { acente: [], munferit: [], sinema: [] };
    return {
      acente: [...new Set([...DEFAULT_ACENTE_LIST, ...parsed.acente])].sort(),
      munferit: [...new Set([...DEFAULT_MUNFERIT_LIST, ...parsed.munferit])].sort(),
      sinema: [...new Set([...DEFAULT_SINEMA_LIST, ...parsed.sinema])].sort(),
    };
  });
  
  // Email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState('');

  // İsim kaydet
  const saveNameToMemory = (name: string, type: 'acente' | 'munferit' | 'sinema') => {
    if (!name.trim()) return;
    setSavedNames((prev) => {
      if (prev[type].includes(name)) return prev;
      const updated = { ...prev, [type]: [...prev[type], name].sort() };
      localStorage.setItem('aquariumSavedNames', JSON.stringify(updated));
      return updated;
    });
  };

  // Entry ekle
  const addEntry = (
    type: 'acente' | 'munferit' | 'sinema',
    form: { name: string; adult: string; child: string },
    setEntries: React.Dispatch<React.SetStateAction<PaxEntry[]>>,
    setForm: React.Dispatch<React.SetStateAction<{ name: string; adult: string; child: string }>>
  ) => {
    if (!form.name.trim()) {
      alert('Lütfen isim girin');
      return;
    }
    const adult = parseInt(form.adult) || 0;
    const child = parseInt(form.child) || 0;
    if (adult === 0 && child === 0) {
      alert('En az bir değer girin');
      return;
    }

    const newEntry: PaxEntry = {
      id: Date.now().toString(),
      name: form.name.trim(),
      adult,
      child,
    };

    setEntries((prev) => [...prev, newEntry]);
    saveNameToMemory(form.name.trim(), type);
    setForm({ name: '', adult: '', child: '' });
  };

  // Entry sil
  const deleteEntry = (
    id: string,
    setEntries: React.Dispatch<React.SetStateAction<PaxEntry[]>>
  ) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Toplam hesapla
  const getTotal = (entries: PaxEntry[]) => {
    return entries.reduce(
      (acc, e) => ({ adult: acc.adult + e.adult, child: acc.child + e.child }),
      { adult: 0, child: 0 }
    );
  };

  const acenteTotal = getTotal(acenteEntries);
  const munferitTotal = getTotal(munferitEntries);
  const sinemaTotal = getTotal(sinemaEntries);

  // Excel oluştur ve indir - Yan yana tablolar
  const generateExcel = () => {
    const today = new Date(reportDate).toLocaleDateString('tr-TR');
    const genel = {
      adult: acenteTotal.adult + munferitTotal.adult + sinemaTotal.adult,
      child: acenteTotal.child + munferitTotal.child + sinemaTotal.child
    };
    
    // En uzun listeyi bul (satır sayısı için)
    const maxRows = Math.max(acenteEntries.length, munferitEntries.length, sinemaEntries.length);
    
    // Satırları oluştur
    const dataRows = [];
    for (let i = 0; i < maxRows; i++) {
      const acente = acenteEntries[i];
      const munferit = munferitEntries[i];
      const sinema = sinemaEntries[i];
      
      dataRows.push(`<Row ss:Height="20">
        <Cell ss:StyleID="DataLeft"><Data ss:Type="String">${acente ? acente.name : ''}</Data></Cell>
        <Cell ss:StyleID="DataCenter"><Data ss:Type="${acente ? 'Number' : 'String'}">${acente ? acente.adult : ''}</Data></Cell>
        <Cell ss:StyleID="DataCenter"><Data ss:Type="${acente ? 'Number' : 'String'}">${acente ? acente.child : ''}</Data></Cell>
        <Cell ss:StyleID="Empty"></Cell>
        <Cell ss:StyleID="DataLeft"><Data ss:Type="String">${munferit ? munferit.name : ''}</Data></Cell>
        <Cell ss:StyleID="DataCenter"><Data ss:Type="${munferit ? 'Number' : 'String'}">${munferit ? munferit.adult : ''}</Data></Cell>
        <Cell ss:StyleID="DataCenter"><Data ss:Type="${munferit ? 'Number' : 'String'}">${munferit ? munferit.child : ''}</Data></Cell>
        <Cell ss:StyleID="Empty"></Cell>
        <Cell ss:StyleID="DataLeft"><Data ss:Type="String">${sinema ? sinema.name : ''}</Data></Cell>
        <Cell ss:StyleID="DataCenter"><Data ss:Type="${sinema ? 'Number' : 'String'}">${sinema ? sinema.adult : ''}</Data></Cell>
        <Cell ss:StyleID="DataCenter"><Data ss:Type="${sinema ? 'Number' : 'String'}">${sinema ? sinema.child : ''}</Data></Cell>
      </Row>`);
    }
    
    const html = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
<Styles>
  <Style ss:ID="Default" ss:Name="Normal">
    <Alignment ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10"/>
  </Style>
  <Style ss:ID="Empty">
    <Interior ss:Color="#F2F2F2" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Title">
    <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#1F4E79" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="TitleInfo">
    <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#1F4E79" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="GenelToplam">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="12" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#00B050" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="SectionBlue">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="SectionPurple">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#7030A0" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="SectionGreen">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#00B050" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="TableHeader">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#5B9BD5" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="TableHeaderLeft">
    <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#5B9BD5" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="DataLeft">
    <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
    </Borders>
  </Style>
  <Style ss:ID="DataCenter">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
    </Borders>
  </Style>
  <Style ss:ID="TotalBlue">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Interior ss:Color="#BDD7EE" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="TotalPurple">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Interior ss:Color="#E2D0F0" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="TotalGreen">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Interior ss:Color="#C6EFCE" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
</Styles>
<Worksheet ss:Name="Günlük Rapor">
<Table ss:DefaultColumnWidth="80" ss:DefaultRowHeight="18">
  <Column ss:Index="1" ss:Width="150"/>
  <Column ss:Index="2" ss:Width="70"/>
  <Column ss:Index="3" ss:Width="70"/>
  <Column ss:Index="4" ss:Width="15"/>
  <Column ss:Index="5" ss:Width="150"/>
  <Column ss:Index="6" ss:Width="70"/>
  <Column ss:Index="7" ss:Width="70"/>
  <Column ss:Index="8" ss:Width="15"/>
  <Column ss:Index="9" ss:Width="150"/>
  <Column ss:Index="10" ss:Width="70"/>
  <Column ss:Index="11" ss:Width="70"/>
  
  <!-- BAŞLIK -->
  <Row ss:Height="30">
    <Cell ss:MergeAcross="4" ss:StyleID="Title"><Data ss:Type="String">${kasaConfig.title}</Data></Cell>
    <Cell ss:Index="6" ss:MergeAcross="2" ss:StyleID="TitleInfo"><Data ss:Type="String">👤 ${userName}</Data></Cell>
    <Cell ss:Index="10" ss:MergeAcross="1" ss:StyleID="TitleInfo"><Data ss:Type="String">📅 ${today}</Data></Cell>
  </Row>
  <Row ss:Height="8"></Row>
  
  <!-- GENEL TOPLAM -->
  <Row ss:Height="25">
    <Cell ss:MergeAcross="2" ss:StyleID="GenelToplam"><Data ss:Type="String">GENEL TOPLAM</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:MergeAcross="2" ss:StyleID="GenelToplam"><Data ss:Type="String">Yetişkin: ${genel.adult}</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:MergeAcross="2" ss:StyleID="GenelToplam"><Data ss:Type="String">Çocuk: ${genel.child}</Data></Cell>
  </Row>
  <Row ss:Height="10"></Row>
  
  <!-- BÖLÜM BAŞLIKLARI -->
  <Row ss:Height="25">
    <Cell ss:MergeAcross="2" ss:StyleID="SectionBlue"><Data ss:Type="String">${kasaConfig.section1}</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:MergeAcross="2" ss:StyleID="SectionPurple"><Data ss:Type="String">${kasaConfig.section2}</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:MergeAcross="2" ss:StyleID="SectionGreen"><Data ss:Type="String">${kasaConfig.section3}</Data></Cell>
  </Row>
  
  <!-- TABLO BAŞLIKLARI -->
  <Row ss:Height="20">
    <Cell ss:StyleID="TableHeaderLeft"><Data ss:Type="String">Paket</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Yetişkin</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Çocuk</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="TableHeaderLeft"><Data ss:Type="String">Paket</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Yetişkin</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Çocuk</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="TableHeaderLeft"><Data ss:Type="String">Paket</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Yetişkin</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Çocuk</Data></Cell>
  </Row>
  
  <!-- VERİLER -->
  ${dataRows.join('')}
  
  <!-- TOPLAMLAR -->
  <Row ss:Height="22">
    <Cell ss:StyleID="TotalBlue"><Data ss:Type="String">TOPLAM</Data></Cell>
    <Cell ss:StyleID="TotalBlue"><Data ss:Type="Number">${acenteTotal.adult}</Data></Cell>
    <Cell ss:StyleID="TotalBlue"><Data ss:Type="Number">${acenteTotal.child}</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="TotalPurple"><Data ss:Type="String">TOPLAM</Data></Cell>
    <Cell ss:StyleID="TotalPurple"><Data ss:Type="Number">${munferitTotal.adult}</Data></Cell>
    <Cell ss:StyleID="TotalPurple"><Data ss:Type="Number">${munferitTotal.child}</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="TotalGreen"><Data ss:Type="String">TOPLAM</Data></Cell>
    <Cell ss:StyleID="TotalGreen"><Data ss:Type="Number">${sinemaTotal.adult}</Data></Cell>
    <Cell ss:StyleID="TotalGreen"><Data ss:Type="Number">${sinemaTotal.child}</Data></Cell>
  </Row>
</Table>
</Worksheet>
</Workbook>`;

    // Dosya indir
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${kasaId.charAt(0).toUpperCase() + kasaId.slice(1)}_Rapor_${today.replace(/\\./g, '-')}.xls`;
    link.click();
    URL.revokeObjectURL(url);

    return html;
  };

  // Mail gönder - mailto: ile
  const handleSendEmail = () => {
    if (!emailTo.trim()) {
      alert('Lütfen e-posta adresi girin');
      return;
    }

    const today = new Date(reportDate).toLocaleDateString('tr-TR');
    const genel = {
      adult: acenteTotal.adult + munferitTotal.adult + sinemaTotal.adult,
      child: acenteTotal.child + munferitTotal.child + sinemaTotal.child
    };
    
    // Önce Excel indir
    generateExcel();
    
    // Mail içeriği oluştur
    const subject = `${kasaConfig.title} - ${today}`;
    let body = `${kasaConfig.title}%0D%0A`;
    body += `Personel: ${userName || 'Belirtilmedi'}%0D%0A`;
    body += `Tarih: ${today}%0D%0A%0D%0A`;
    body += `═══════════════════════════════════════%0D%0A`;
    body += `GENEL TOPLAM: Yetişkin: ${genel.adult} | Çocuk: ${genel.child}%0D%0A`;
    body += `═══════════════════════════════════════%0D%0A%0D%0A`;
    body += `${kasaConfig.section1}: Y:${acenteTotal.adult} Ç:${acenteTotal.child}%0D%0A`;
    body += `${kasaConfig.section2}: Y:${munferitTotal.adult} Ç:${munferitTotal.child}%0D%0A`;
    body += `${kasaConfig.section3}: Y:${sinemaTotal.adult} Ç:${sinemaTotal.child}%0D%0A%0D%0A`;
    body += `📎 Excel dosyası ekte gönderilmiştir.%0D%0A`;
    body += `(İndirilen dosyayı mail'e ekleyiniz)`;
    
    // Mail uygulamasını aç
    window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    alert('✅ Excel indirildi ve mail uygulaması açıldı!\n\n📎 İndirilen Excel dosyasını mail\'e eklemeyi unutmayın.');
    setShowEmailModal(false);
  };

  // Enter tuşu ile ekleme
  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement>,
    type: 'acente' | 'munferit' | 'sinema',
    form: { name: string; adult: string; child: string },
    setEntries: React.Dispatch<React.SetStateAction<PaxEntry[]>>,
    setForm: React.Dispatch<React.SetStateAction<{ name: string; adult: string; child: string }>>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEntry(type, form, setEntries, setForm);
    }
  };

  // Bölüm komponenti
  const Section = ({
    title,
    color,
    entries,
    form,
    setForm,
    setEntries,
    type,
    savedList,
  }: {
    title: string;
    color: 'blue' | 'purple' | 'green';
    entries: PaxEntry[];
    form: { name: string; adult: string; child: string };
    setForm: React.Dispatch<React.SetStateAction<{ name: string; adult: string; child: string }>>;
    setEntries: React.Dispatch<React.SetStateAction<PaxEntry[]>>;
    type: 'acente' | 'munferit' | 'sinema';
    savedList: string[];
  }) => {
    const total = getTotal(entries);
    const colorClasses = {
      blue: 'border-blue-700/50 bg-blue-900/20',
      purple: 'border-purple-700/50 bg-purple-900/20',
      green: 'border-green-700/50 bg-green-900/20',
    };
    const textColors = {
      blue: 'text-blue-300',
      purple: 'text-purple-300',
      green: 'text-green-300',
    };

    return (
      <div className={`rounded-lg border ${colorClasses[color]} p-4`}>
        <h3 className={`text-lg font-bold ${textColors[color]} mb-4`}>{title}</h3>
        
        {/* Özet kutusu */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-black/20 rounded p-2 text-center">
            <p className="text-xs text-gray-400">Yetişkin/Adult</p>
            <p className={`text-2xl font-bold ${textColors[color]}`}>{total.adult}</p>
          </div>
          <div className="bg-black/20 rounded p-2 text-center">
            <p className="text-xs text-gray-400">Child/Çocuk</p>
            <p className={`text-2xl font-bold ${textColors[color]}`}>{total.child}</p>
          </div>
        </div>

        {/* Giriş formu */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={(e) => handleKeyPress(e, type, form, setEntries, setForm)}
              placeholder="İsim gir veya seç..."
              className="w-full px-2 py-1.5 bg-gray-800/50 border border-gray-700 rounded text-white text-sm"
              list={`${type}-list`}
            />
            <datalist id={`${type}-list`}>
              {savedList.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <input
            type="number"
            value={form.adult}
            onChange={(e) => setForm({ ...form, adult: e.target.value })}
            onKeyDown={(e) => handleKeyPress(e, type, form, setEntries, setForm)}
            placeholder="Y"
            className="w-14 px-2 py-1.5 bg-gray-800/50 border border-gray-700 rounded text-white text-sm text-center"
            min="0"
          />
          <input
            type="number"
            value={form.child}
            onChange={(e) => setForm({ ...form, child: e.target.value })}
            onKeyDown={(e) => handleKeyPress(e, type, form, setEntries, setForm)}
            placeholder="Ç"
            className="w-14 px-2 py-1.5 bg-gray-800/50 border border-gray-700 rounded text-white text-sm text-center"
            min="0"
          />
          <button
            onClick={() => addEntry(type, form, setEntries, setForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Tablo */}
        <div className="max-h-60 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-900">
              <tr className="border-b border-gray-700">
                <th className="text-left py-1 px-2">SATILAN PAKET</th>
                <th className="text-center py-1 px-2 w-16">Yetişkin</th>
                <th className="text-center py-1 px-2 w-16">Çocuk</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-1 px-2 text-white">{entry.name}</td>
                  <td className="py-1 px-2 text-center text-blue-400">{entry.adult || '-'}</td>
                  <td className="py-1 px-2 text-center text-green-400">{entry.child || '-'}</td>
                  <td className="py-1 px-1">
                    <button
                      onClick={() => deleteEntry(entry.id, setEntries)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Henüz veri yok
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-2 border-gray-600">
              <tr className="font-bold">
                <td className="py-2 px-2 text-gray-300">TOPLAM</td>
                <td className="py-2 px-2 text-center text-blue-300">{total.adult}</td>
                <td className="py-2 px-2 text-center text-green-300">{total.child}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const hasData = acenteEntries.length > 0 || munferitEntries.length > 0 || sinemaEntries.length > 0;
  
  // Genel toplam
  const genelTotal = {
    adult: acenteTotal.adult + munferitTotal.adult + sinemaTotal.adult,
    child: acenteTotal.child + munferitTotal.child + sinemaTotal.child
  };

  // Bugünün tarihi formatı
  const todayFormatted = new Date(reportDate).toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-2 sm:p-4 space-y-4">
      {/* Header */}
      <div className="bg-cyan-900/30 rounded-lg border border-cyan-700/50 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
          <h1 className="text-xl font-bold text-cyan-300">
            {kasaConfig.title}
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">👤 Personel: <span className="text-white font-semibold">{userName}</span></span>
            <span className="text-gray-400">📅 {todayFormatted}</span>
          </div>
        </div>
      </div>

      {/* Genel Toplam */}
      <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-lg border border-cyan-500/50 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-cyan-300">📊 GENEL TOPLAM</h2>
          <div className="flex gap-6">
            <div className="text-center">
              <span className="text-sm text-gray-400 block">Yetişkin</span>
              <span className="text-3xl font-bold text-cyan-300">{genelTotal.adult}</span>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-400 block">Çocuk</span>
              <span className="text-3xl font-bold text-cyan-300">{genelTotal.child}</span>
            </div>
            <div className="text-center border-l border-gray-600 pl-6">
              <span className="text-sm text-gray-400 block">Toplam Pax</span>
              <span className="text-3xl font-bold text-yellow-400">{genelTotal.adult + genelTotal.child}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-900/20 rounded-lg border border-blue-700/50 p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">{kasaConfig.section1} Pax</p>
          <div className="flex justify-center gap-4">
            <div>
              <span className="text-xs text-gray-500">Yetişkin: </span>
              <span className="text-lg font-bold text-blue-300">{acenteTotal.adult}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Çocuk: </span>
              <span className="text-lg font-bold text-blue-300">{acenteTotal.child}</span>
            </div>
          </div>
        </div>
        <div className="bg-purple-900/20 rounded-lg border border-purple-700/50 p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">{kasaConfig.section2} Pax</p>
          <div className="flex justify-center gap-4">
            <div>
              <span className="text-xs text-gray-500">Yetişkin: </span>
              <span className="text-lg font-bold text-purple-300">{munferitTotal.adult}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Çocuk: </span>
              <span className="text-lg font-bold text-purple-300">{munferitTotal.child}</span>
            </div>
          </div>
        </div>
        <div className="bg-green-900/20 rounded-lg border border-green-700/50 p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">{kasaConfig.section3} Pax</p>
          <div className="flex justify-center gap-4">
            <div>
              <span className="text-xs text-gray-500">Yetişkin: </span>
              <span className="text-lg font-bold text-green-300">{sinemaTotal.adult}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Çocuk: </span>
              <span className="text-lg font-bold text-green-300">{sinemaTotal.child}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Bölüm */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section
          title={`🏢 ${kasaConfig.section1}`}
          color="blue"
          entries={acenteEntries}
          form={acenteForm}
          setForm={setAcenteForm}
          setEntries={setAcenteEntries}
          type="acente"
          savedList={savedNames.acente}
        />
        <Section
          title={`📋 ${kasaConfig.section2}`}
          color="purple"
          entries={munferitEntries}
          form={munferitForm}
          setForm={setMunferitForm}
          setEntries={setMunferitEntries}
          type="munferit"
          savedList={savedNames.munferit}
        />
        <Section
          title={`🎬 ${kasaConfig.section3}`}
          color="green"
          entries={sinemaEntries}
          form={sinemaForm}
          setForm={setSinemaForm}
          setEntries={setSinemaEntries}
          type="sinema"
          savedList={savedNames.sinema}
        />
      </div>

      {/* Butonlar - Alta */}
      <div className="flex justify-center gap-4">
        <button
          onClick={generateExcel}
          disabled={!hasData}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors text-lg font-semibold"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Excel İndir
        </button>
        <button
          onClick={() => setShowEmailModal(true)}
          disabled={!hasData}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors text-lg font-semibold"
        >
          <Mail className="w-5 h-5" />
          Mail Gönder
        </button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 max-w-md w-full">
            <h3 className="text-white font-bold mb-4 text-lg">📧 Rapor Gönder</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">E-posta Adresi</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white"
                />
              </div>
              
              <div className="bg-gray-800/30 rounded p-3 text-sm text-gray-400">
                <p className="font-bold mb-2">Rapor Özeti:</p>
                <p>📅 Tarih: {new Date(reportDate).toLocaleDateString('tr-TR')}</p>
                <p>👤 Personel: {userName || 'Belirtilmedi'}</p>
                <hr className="my-2 border-gray-700" />
                <p>🏢 Acente: Y:{acenteTotal.adult} Ç:{acenteTotal.child}</p>
                <p>📋 Münferit: Y:{munferitTotal.adult} Ç:{munferitTotal.child}</p>
                <p>🎬 Sinema: Y:{sinemaTotal.adult} Ç:{sinemaTotal.child}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSendEmail}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Gönder
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

