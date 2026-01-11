import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ShoppingCart, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { INITIAL_PACKAGES, type PackageItem } from '@/data/packages';
import { 
  saveSalesToFirebase, 
  loadSalesFromFirebase, 
  saveCrossSalesToFirebase, 
  loadCrossSalesFromFirebase,
  subscribeSales 
} from '@/utils/firebaseSales';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Sale {
  id: string;
  packageName: string;
  adultQty: number;
  childQty: number;
  currency: 'TL' | 'USD' | 'EUR' | 'KK';
  paymentType: 'Nakit' | 'Kredi Kartı';
  total: number;
  kkTl: number;
  cashTl: number;
  cashUsd: number;
  cashEur: number;
  timestamp: string;
  isCrossSale?: boolean;
}

interface AddSaleForm {
  packageId: string;
  adultQty: string;
  childQty: string;
  paymentType: 'Nakit' | 'Kredi Kartı';
  isCrossSale: boolean;
}

export default function SalesPanel({ usdRate = 30, eurRate = 50.4877, onSalesUpdate }: { usdRate: number; eurRate: number; onSalesUpdate?: (sales: Sale[]) => void }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const onSalesUpdateRef = useRef(onSalesUpdate);
  
  // Keep ref updated
  useEffect(() => {
    onSalesUpdateRef.current = onSalesUpdate;
  }, [onSalesUpdate]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<AddSaleForm>({
    packageId: '',
    adultQty: '0',
    childQty: '0',
    paymentType: 'Nakit',
    isCrossSale: false,
  });
  
  // Firebase'den satışları yükle
  useEffect(() => {
    const loadSales = async () => {
      setIsLoading(true);
      const loadedSales = await loadSalesFromFirebase();
      setSales(loadedSales);
      setIsLoading(false);
    };
    loadSales();
    
    // Real-time güncellemeleri dinle
    const unsubscribe = subscribeSales((updatedSales) => {
      setSales(updatedSales);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Satışlar değiştiğinde Firebase'e kaydet
  useEffect(() => {
    if (!isLoading && sales.length >= 0) {
      saveSalesToFirebase(sales);
      if (onSalesUpdateRef.current) {
        onSalesUpdateRef.current(sales);
      }
    }
  }, [sales, isLoading]);

  const calculateSaleDistribution = (
    amount: number,
    currency: string,
    paymentType: string,
    usdRate: number,
    eurRate: number
  ) => {
    let kkTl = 0;
    let cashTl = 0;
    let cashUsd = 0;
    let cashEur = 0;

    if (paymentType === 'Nakit') {
      if (currency === 'USD') {
        cashUsd = amount;
      } else if (currency === 'EUR') {
        cashEur = amount;
      } else {
        cashTl = amount;
      }
    } else if (paymentType === 'Kredi Kartı') {
      if (currency === 'USD') {
        kkTl = amount * usdRate;
      } else if (currency === 'EUR') {
        kkTl = amount * eurRate;
      } else {
        kkTl = amount;
      }
    }

    return { kkTl, cashTl, cashUsd, cashEur };
  };

  const handleAddSale = () => {
    if (!formData.packageId || (formData.adultQty === '0' && formData.childQty === '0')) {
      alert('Lütfen paket ve miktar seçiniz');
      return;
    }

    const selectedPackage = INITIAL_PACKAGES.find((p) => p.id === formData.packageId);
    if (!selectedPackage) return;

    const adultQty = parseInt(formData.adultQty) || 0;
    const childQty = parseInt(formData.childQty) || 0;
    const total = adultQty * selectedPackage.adultPrice + childQty * selectedPackage.childPrice;

    const distribution = calculateSaleDistribution(
      total,
      selectedPackage.currency,
      formData.paymentType,
      usdRate,
      eurRate
    );

    const newSale: Sale = {
      id: Date.now().toString(),
      packageName: selectedPackage.name,
      adultQty,
      childQty,
      currency: selectedPackage.currency as any,
      paymentType: formData.paymentType as any,
      total,
      ...distribution,
      timestamp: new Date().toISOString(),
      isCrossSale: formData.isCrossSale,
    };

    // Çapraz satışsa, çapraz satış listesine de Firebase'e kaydet
    if (formData.isCrossSale) {
      loadCrossSalesFromFirebase().then(crossSales => {
        saveCrossSalesToFirebase([...crossSales, newSale]);
      });
    }

    setSales([...sales, newSale]);
    setFormData({
      packageId: '',
      adultQty: '0',
      childQty: '0',
      paymentType: 'Nakit',
      isCrossSale: false,
    });
    setShowAddForm(false);
    onSalesUpdate?.([...sales, newSale]);
  };

  const handleDeleteSale = (id: string) => {
    const updatedSales = sales.filter((s) => s.id !== id);
    setSales(updatedSales);
    onSalesUpdate?.(updatedSales);
  };
  
  // Excel Export Function
  const exportToExcel = () => {
    const totals = getTotals();
    const currentDate = new Date().toLocaleDateString('tr-TR');
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userName = session.personnel?.fullName || 'Kullanıcı';
    const kasaName = session.kasa?.name || 'Kasa';
    
    // Kasa avanslarını localStorage'dan al
    const kasaSettings = JSON.parse(localStorage.getItem(`kasaSettings_${session.kasa?.id}`) || '{}');
    const advances = kasaSettings.advances || { tlAdvance: 0, usdAdvance: 0, eurAdvance: 0 };
    
    // Z Rapor hesaplamaları
    const cashTlTotal = totals.cashTl + (totals.cashUsd * usdRate) + (totals.cashEur * eurRate);
    const grandTotal = totals.kkTl + cashTlTotal;
    
    // Satır verilerini oluştur
    const dataRows = sales.map(sale => `<Row ss:Height="20">
      <Cell ss:StyleID="DataLeft"><Data ss:Type="String">${sale.packageName}</Data></Cell>
      <Cell ss:StyleID="DataCenter"><Data ss:Type="Number">${sale.adultQty}</Data></Cell>
      <Cell ss:StyleID="DataCenter"><Data ss:Type="Number">${sale.childQty}</Data></Cell>
      <Cell ss:StyleID="DataCenter"><Data ss:Type="String">${sale.currency}</Data></Cell>
      <Cell ss:StyleID="DataCenter"><Data ss:Type="String">${sale.paymentType}</Data></Cell>
      <Cell ss:StyleID="DataRight"><Data ss:Type="Number">${sale.total.toFixed(2)}</Data></Cell>
      <Cell ss:StyleID="DataRight"><Data ss:Type="${sale.kkTl > 0 ? 'Number' : 'String'}">${sale.kkTl > 0 ? sale.kkTl.toFixed(2) : '-'}</Data></Cell>
      <Cell ss:StyleID="DataRight"><Data ss:Type="${sale.cashTl > 0 ? 'Number' : 'String'}">${sale.cashTl > 0 ? sale.cashTl.toFixed(2) : '-'}</Data></Cell>
      <Cell ss:StyleID="DataRight"><Data ss:Type="${sale.cashUsd > 0 ? 'Number' : 'String'}">${sale.cashUsd > 0 ? sale.cashUsd.toFixed(2) : '-'}</Data></Cell>
      <Cell ss:StyleID="DataRight"><Data ss:Type="${sale.cashEur > 0 ? 'Number' : 'String'}">${sale.cashEur > 0 ? sale.cashEur.toFixed(2) : '-'}</Data></Cell>
    </Row>`).join('');
    
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
  <Style ss:ID="Title">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#1F4E79" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="PanelHeaderBlue">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#2196F3" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="PanelHeaderYellow">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#000000"/>
    <Interior ss:Color="#FFC107" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="PanelHeaderGreen">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#4CAF50" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="PanelHeaderPurple">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#9C27B0" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="PanelLabel">
    <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Interior ss:Color="#F5F5F5" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="PanelValue">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Interior ss:Color="#F5F5F5" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="PanelTotal">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="12" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#FF5722" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="PanelTotalLabel">
    <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="12" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#FF5722" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="Empty">
    <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="ZRaporLabel">
    <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Interior ss:Color="#F5F5F5" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="ZRaporValue">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1"/>
    <Interior ss:Color="#F5F5F5" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="ZRaporLabelBold">
    <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Interior ss:Color="#E0E0E0" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="ZRaporValueBold">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="12" ss:Bold="1"/>
    <Interior ss:Color="#E0E0E0" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="ZRaporGrandLabel">
    <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#4CAF50" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="ZRaporGrandValue">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#4CAF50" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="SectionHeader">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#37474F" ss:Pattern="Solid"/>
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
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="DataCenter">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="DataRight">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="DataRightGreen">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="DataRightBlue">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="DataRightYellow">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="DataRightPurple">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
    </Borders>
  </Style>
  <Style ss:ID="TotalRow">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#00B050" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="TotalLabel">
    <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#00B050" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
</Styles>
<Worksheet ss:Name="Gunluk Rapor">
<Table ss:DefaultColumnWidth="100" ss:DefaultRowHeight="22">
  <Column ss:Width="140"/>
  <Column ss:Width="80"/>
  <Column ss:Width="60"/>
  <Column ss:Width="100"/>
  <Column ss:Width="100"/>
  <Column ss:Width="100"/>
  <Column ss:Width="100"/>
  <Column ss:Width="100"/>
  <Column ss:Width="100"/>
  <Column ss:Width="100"/>
  
  <!-- BASLIK -->
  <Row ss:Height="35">
    <Cell ss:MergeAcross="9" ss:StyleID="Title"><Data ss:Type="String">GUNLUK RAPOR - ${kasaName} - ${userName} - ${currentDate}</Data></Cell>
  </Row>
  <Row ss:Height="10"></Row>
  
  <!-- 3 PANEL YAN YANA: AVANS | KUR | Z RAPOR -->
  <!-- Panel Basliklari -->
  <Row ss:Height="25">
    <Cell ss:MergeAcross="2" ss:StyleID="PanelHeaderBlue"><Data ss:Type="String">KASA AVANSLARI</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="PanelHeaderYellow"><Data ss:Type="String">GUNLUK KURLAR</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:MergeAcross="2" ss:StyleID="PanelHeaderGreen"><Data ss:Type="String">Z RAPOR</Data></Cell>
  </Row>
  
  <!-- Satir 1: Avans TL / Kur USD / Z-KK -->
  <Row ss:Height="24">
    <Cell ss:StyleID="PanelLabel"><Data ss:Type="String">TL Avans</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="PanelValue"><Data ss:Type="String">${advances.tlAdvance.toFixed(2)} TL</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="PanelLabel"><Data ss:Type="String">USD Kuru</Data></Cell>
    <Cell ss:StyleID="PanelValue"><Data ss:Type="String">${usdRate.toFixed(4)} TL</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="ZRaporLabel"><Data ss:Type="String">Kredi Karti (TL)</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="ZRaporValue"><Data ss:Type="String">${totals.kkTl.toFixed(2)} TL</Data></Cell>
  </Row>
  
  <!-- Satir 2: Avans USD / Kur EUR / Z-Nakit TL -->
  <Row ss:Height="24">
    <Cell ss:StyleID="PanelLabel"><Data ss:Type="String">USD Avans</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="PanelValue"><Data ss:Type="String">${advances.usdAdvance.toFixed(2)} $</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="PanelLabel"><Data ss:Type="String">EUR Kuru</Data></Cell>
    <Cell ss:StyleID="PanelValue"><Data ss:Type="String">${eurRate.toFixed(4)} TL</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="ZRaporLabel"><Data ss:Type="String">Nakit TL</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="ZRaporValue"><Data ss:Type="String">${totals.cashTl.toFixed(2)} TL</Data></Cell>
  </Row>
  
  <!-- Satir 3: Avans EUR / bos / Z-Nakit USD -->
  <Row ss:Height="24">
    <Cell ss:StyleID="PanelLabel"><Data ss:Type="String">EUR Avans</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="PanelValue"><Data ss:Type="String">${advances.eurAdvance.toFixed(2)} EUR</Data></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="ZRaporLabel"><Data ss:Type="String">Nakit USD</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="ZRaporValue"><Data ss:Type="String">${totals.cashUsd.toFixed(2)} $</Data></Cell>
  </Row>
  
  <!-- Satir 4: bos / bos / Z-Nakit EUR -->
  <Row ss:Height="24">
    <Cell ss:MergeAcross="2" ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="ZRaporLabel"><Data ss:Type="String">Nakit EUR</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="ZRaporValue"><Data ss:Type="String">${totals.cashEur.toFixed(2)} EUR</Data></Cell>
  </Row>
  
  <!-- Satir 5: bos / bos / Z-Toplam Nakit -->
  <Row ss:Height="24">
    <Cell ss:MergeAcross="2" ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="ZRaporLabelBold"><Data ss:Type="String">TOPLAM NAKIT (TL)</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="ZRaporValueBold"><Data ss:Type="String">${cashTlTotal.toFixed(2)} TL</Data></Cell>
  </Row>
  
  <!-- Satir 6: Z Rapor Genel Toplam -->
  <Row ss:Height="28">
    <Cell ss:MergeAcross="2" ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="Empty"></Cell>
    <Cell ss:StyleID="ZRaporGrandLabel"><Data ss:Type="String">GENEL TOPLAM (TL)</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="ZRaporGrandValue"><Data ss:Type="String">${grandTotal.toFixed(2)} TL</Data></Cell>
  </Row>
  
  <Row ss:Height="15"></Row>
  
  <!-- SATIS PANOSU -->
  <Row ss:Height="25">
    <Cell ss:MergeAcross="9" ss:StyleID="SectionHeader"><Data ss:Type="String">SATIS PANOSU</Data></Cell>
  </Row>
  <Row ss:Height="20">
    <Cell ss:StyleID="TableHeaderLeft"><Data ss:Type="String">Paket</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Yetiskin</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Cocuk</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Para Birimi</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Odeme Tipi</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Toplam</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">KK (TL)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Nakit (TL)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Nakit (USD)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Nakit (EUR)</Data></Cell>
  </Row>
  
  ${dataRows}
  
  <Row ss:Height="5"></Row>
  <Row ss:Height="25">
    <Cell ss:MergeAcross="5" ss:StyleID="TotalLabel"><Data ss:Type="String">TOPLAM OZET</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${totals.kkTl.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${totals.cashTl.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${totals.cashUsd.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${totals.cashEur.toFixed(2)}</Data></Cell>
  </Row>
</Table>
</Worksheet>
</Workbook>`;
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Gunluk_Rapor_${kasaName.replace(/\s/g, '_')}_${currentDate.replace(/\./g, '-')}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  
  // PDF Export Function - Minimal Modern Design
  const exportToPDF = () => {
    const totals = getTotals();
    const currentDate = new Date().toLocaleDateString('tr-TR');
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userName = session.personnel?.fullName || 'Kullanıcı';
    const kasaName = session.kasa?.name || 'Kasa';
    
    // Kasa avanslarını localStorage'dan al
    const kasaSettings = JSON.parse(localStorage.getItem(`kasaSettings_${session.kasa?.id}`) || '{}');
    const advances = kasaSettings.advances || { tlAdvance: 0, usdAdvance: 0, eurAdvance: 0 };
    
    // Z Rapor hesaplamaları
    const cashTlTotal = totals.cashTl + (totals.cashUsd * usdRate) + (totals.cashEur * eurRate);
    const grandTotal = totals.kkTl + cashTlTotal;
    const totalAdult = sales.reduce((sum, s) => sum + s.adultQty, 0);
    const totalChild = sales.reduce((sum, s) => sum + s.childQty, 0);
    
    // Portrait A4 - daha kompakt
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    
    // === HEADER - Minimal ===
    doc.setFillColor(31, 78, 121);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('GUNLUK SATIS RAPORU', margin, 18);
    
    // Info line
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 200, 220);
    doc.text(`${kasaName}  •  ${userName}  •  ${currentDate}`, margin, 28);
    
    // === SUMMARY ROW - Tek satır ===
    const summaryY = 45;
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, summaryY, pageWidth - margin * 2, 20, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.rect(margin, summaryY, pageWidth - margin * 2, 20, 'S');
    
    // Summary items inline
    const itemWidth = (pageWidth - margin * 2) / 6;
    const summaryItems = [
      { label: 'AVANS', value: `${advances.tlAdvance.toFixed(0)} TL` },
      { label: 'USD', value: `${usdRate.toFixed(2)} TL` },
      { label: 'EUR', value: `${eurRate.toFixed(2)} TL` },
      { label: 'PAX', value: `${totalAdult}Y + ${totalChild}C = ${totalAdult + totalChild}` },
      { label: 'K.KARTI', value: `${totals.kkTl.toFixed(0)} TL` },
      { label: 'TOPLAM', value: `${grandTotal.toFixed(0)} TL` },
    ];
    
    summaryItems.forEach((item, i) => {
      const x = margin + (itemWidth * i) + itemWidth / 2;
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(item.label, x, summaryY + 7, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(45, 45, 45);
      doc.setFont('helvetica', 'bold');
      doc.text(item.value, x, summaryY + 15, { align: 'center' });
      doc.setFont('helvetica', 'normal');
    });
    
    // === TABLE - Kompakt ===
    const tableData = sales.map(sale => [
      sale.packageName,
      `${sale.adultQty}`,
      `${sale.childQty}`,
      sale.paymentType === 'Kredi Kartı' ? 'KK' : 'Nakit',
      `${sale.total.toFixed(0)} ${sale.currency}`,
      sale.kkTl > 0 ? `${sale.kkTl.toFixed(0)}` : '-',
      sale.cashTl > 0 ? `${sale.cashTl.toFixed(0)}` : '-',
      sale.cashUsd > 0 ? `${sale.cashUsd.toFixed(0)}` : '-',
      sale.cashEur > 0 ? `${sale.cashEur.toFixed(0)}` : '-',
    ]);
    
    autoTable(doc, {
      head: [['Paket', 'Y', 'C', 'Tip', 'Tutar', 'KK', 'TL', 'USD', 'EUR']],
      body: tableData,
      startY: 72,
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [60, 60, 60],
      },
      headStyles: {
        fillColor: [31, 78, 121],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 7,
      },
      bodyStyles: {
        lineColor: [240, 240, 240],
        lineWidth: 0.5,
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252],
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 50 },
        1: { halign: 'center', cellWidth: 12 },
        2: { halign: 'center', cellWidth: 12 },
        3: { halign: 'center', cellWidth: 18 },
        4: { halign: 'right', cellWidth: 28 },
        5: { halign: 'right', cellWidth: 22 },
        6: { halign: 'right', cellWidth: 22 },
        7: { halign: 'right', cellWidth: 18 },
        8: { halign: 'right', cellWidth: 18 },
      },
      foot: [[
        'TOPLAM',
        `${totalAdult}`,
        `${totalChild}`,
        '',
        '',
        `${totals.kkTl.toFixed(0)}`,
        `${totals.cashTl.toFixed(0)}`,
        `${totals.cashUsd.toFixed(0)}`,
        `${totals.cashEur.toFixed(0)}`,
      ]],
      footStyles: {
        fillColor: [31, 78, 121],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      margin: { left: margin, right: margin },
    });
    
    // === FOOTER ===
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(7);
    doc.text('Adrenalin Satis Sistemi', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Save PDF
    doc.save(`Satis_Raporu_${kasaName.replace(/\s/g, '_')}_${currentDate.replace(/\./g, '-')}.pdf`);
  };

  const getTotals = () => {
    return {
      kkTl: sales.reduce((sum, s) => sum + s.kkTl, 0),
      cashTl: sales.reduce((sum, s) => sum + s.cashTl, 0),
      cashUsd: sales.reduce((sum, s) => sum + s.cashUsd, 0),
      cashEur: sales.reduce((sum, s) => sum + s.cashEur, 0),
    };
  };

  const totals = getTotals();

  return (
    <div className="space-y-4">
      {/* Add Sale Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Satış Panosu</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Satış Ekle
        </button>
      </div>

      {/* Add Sale Form */}
      {showAddForm && (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Paket</label>
              <select
                value={formData.packageId}
                onChange={(e) => {
                  const selectedPkg = INITIAL_PACKAGES.find(p => p.id === e.target.value);
                  const isCross = selectedPkg?.category === 'Çapraz';
                  setFormData({ 
                    ...formData, 
                    packageId: e.target.value,
                    isCrossSale: isCross
                  });
                }}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
              >
                <option value="">Paket Seçiniz...</option>
                <optgroup label="── MÜNFERİT ──" className="text-blue-400 font-bold">
                  {INITIAL_PACKAGES.filter(pkg => pkg.category === 'Münferit').map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.currency})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="── ÇAPRAZ ──" className="text-orange-400 font-bold">
                  {INITIAL_PACKAGES.filter(pkg => pkg.category === 'Çapraz').map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.currency})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="── ACENTA ──" className="text-purple-400 font-bold">
                  {INITIAL_PACKAGES.filter(pkg => pkg.category === 'Acenta').map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.currency})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Yetişkin</label>
              <input
                type="number"
                min="0"
                value={formData.adultQty}
                onChange={(e) => setFormData({ ...formData, adultQty: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Çocuk</label>
              <input
                type="number"
                min="0"
                value={formData.childQty}
                onChange={(e) => setFormData({ ...formData, childQty: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Ödeme Şekli</label>
              <select
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm"
              >
                <option value="Nakit">Nakit</option>
                <option value="Kredi Kartı">Kredi Kartı</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Satış Türü</label>
              <div className={`flex items-center h-[42px] px-3 py-2 border rounded ${formData.isCrossSale ? 'bg-orange-900/30 border-orange-600' : 'bg-gray-900 border-gray-600'}`}>
                <input
                  type="checkbox"
                  id="crossSale"
                  checked={formData.isCrossSale}
                  readOnly
                  className="w-4 h-4 text-orange-600 bg-gray-900 border-gray-600 rounded cursor-not-allowed"
                />
                <label htmlFor="crossSale" className={`ml-2 text-sm cursor-default ${formData.isCrossSale ? 'text-orange-400 font-semibold' : 'text-gray-500'}`}>
                  {formData.isCrossSale ? '✓ Çapraz Satış' : 'Normal Satış'}
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddSale}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
            >
              Satışı Kaydet
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Sales Table */}
      {sales.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
          Henüz satış kaydı bulunmamaktadır
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700">
                <th className="px-2 py-2 text-left">Paket</th>
                <th className="px-2 py-2 text-center">Yetişkin</th>
                <th className="px-2 py-2 text-center">Çocuk</th>
                <th className="px-2 py-2 text-center">Para</th>
                <th className="px-2 py-2 text-center">Ödeme</th>
                <th className="px-2 py-2 text-right">Toplam</th>
                <th className="px-2 py-2 text-right">KK(TL)</th>
                <th className="px-2 py-2 text-right">TL</th>
                <th className="px-2 py-2 text-right">USD</th>
                <th className="px-2 py-2 text-right">EUR</th>
                <th className="px-2 py-2 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="px-2 py-2">{sale.packageName}</td>
                  <td className="px-2 py-2 text-center">{sale.adultQty}</td>
                  <td className="px-2 py-2 text-center">{sale.childQty}</td>
                  <td className="px-2 py-2 text-center">{sale.currency}</td>
                  <td className="px-2 py-2 text-center text-xs">{sale.paymentType}</td>
                  <td className="px-2 py-2 text-right">{sale.total.toFixed(2)}</td>
                  <td className="px-2 py-2 text-right text-green-400">{sale.kkTl > 0 ? sale.kkTl.toFixed(2) : '-'}</td>
                  <td className="px-2 py-2 text-right text-blue-400">{sale.cashTl > 0 ? sale.cashTl.toFixed(2) : '-'}</td>
                  <td className="px-2 py-2 text-right text-yellow-400">{sale.cashUsd > 0 ? sale.cashUsd.toFixed(2) : '-'}</td>
                  <td className="px-2 py-2 text-right text-purple-400">{sale.cashEur > 0 ? sale.cashEur.toFixed(2) : '-'}</td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleDeleteSale(sale.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Row */}
          <div className="mt-4 bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">KREDİ KARTI (TL)</p>
                <p className="text-lg font-bold text-green-400">{totals.kkTl.toFixed(2)} ₺</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">NAKİT (TL)</p>
                <p className="text-lg font-bold text-blue-400">{totals.cashTl.toFixed(2)} ₺</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">NAKİT (USD)</p>
                <p className="text-lg font-bold text-yellow-400">{totals.cashUsd.toFixed(2)} $</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">NAKİT (EUR)</p>
                <p className="text-lg font-bold text-purple-400">{totals.cashEur.toFixed(2)} €</p>
              </div>
            </div>
          </div>
          
          {/* Export Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel İndir
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              <FileText className="w-4 h-4" />
              PDF İndir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
