import { useState, useEffect } from 'react';
import { Share2, Download, FileSpreadsheet, Trash2 } from 'lucide-react';
import { 
  loadCrossSalesFromFirebase, 
  saveCrossSalesToFirebase, 
  subscribeCrossSales 
} from '@/utils/firebaseSales';

interface CrossSale {
  id: string;
  packageName: string;
  adultQty: number;
  childQty: number;
  currency: string;
  paymentType: string;
  total: number;
  kkTl: number;
  cashTl: number;
  cashUsd: number;
  cashEur: number;
  timestamp: string;
}

export default function CrossSalesTab() {
  const [crossSales, setCrossSales] = useState<CrossSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Firebase'den çapraz satışları yükle
  useEffect(() => {
    const loadCrossSales = async () => {
      setIsLoading(true);
      const loaded = await loadCrossSalesFromFirebase();
      setCrossSales(loaded);
      setIsLoading(false);
    };
    loadCrossSales();
    
    // Real-time güncellemeleri dinle
    const unsubscribe = subscribeCrossSales((updated) => {
      setCrossSales(updated);
    });
    
    return () => unsubscribe();
  }, []);

  // Çapraz satışlar değiştiğinde Firebase'e kaydet
  useEffect(() => {
    if (!isLoading) {
      saveCrossSalesToFirebase(crossSales);
    }
  }, [crossSales, isLoading]);

  const handleDelete = (id: string) => {
    setCrossSales(crossSales.filter(s => s.id !== id));
  };

  const exportToExcel = () => {
    const currentDate = new Date().toLocaleDateString('tr-TR');
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userName = session.personnel?.fullName || 'Kullanıcı';
    const kasaName = session.kasa?.name || 'Kasa';
    const totals = getTotals();
    
    // Satır verilerini oluştur
    const dataRows = crossSales.map(sale => `<Row ss:Height="20">
      <Cell ss:StyleID="DataLeft"><Data ss:Type="String">${sale.packageName}</Data></Cell>
      <Cell ss:StyleID="DataCenter"><Data ss:Type="Number">${sale.adultQty}</Data></Cell>
      <Cell ss:StyleID="DataCenter"><Data ss:Type="Number">${sale.childQty}</Data></Cell>
      <Cell ss:StyleID="DataCenter"><Data ss:Type="String">${sale.currency}</Data></Cell>
      <Cell ss:StyleID="DataCenter"><Data ss:Type="String">${sale.paymentType}</Data></Cell>
      <Cell ss:StyleID="DataRight"><Data ss:Type="Number">${sale.total.toFixed(2)}</Data></Cell>
      <Cell ss:StyleID="DataRightGreen"><Data ss:Type="${sale.kkTl > 0 ? 'Number' : 'String'}">${sale.kkTl > 0 ? sale.kkTl.toFixed(2) : '-'}</Data></Cell>
      <Cell ss:StyleID="DataRightBlue"><Data ss:Type="${sale.cashTl > 0 ? 'Number' : 'String'}">${sale.cashTl > 0 ? sale.cashTl.toFixed(2) : '-'}</Data></Cell>
      <Cell ss:StyleID="DataRightYellow"><Data ss:Type="${sale.cashUsd > 0 ? 'Number' : 'String'}">${sale.cashUsd > 0 ? sale.cashUsd.toFixed(2) : '-'}</Data></Cell>
      <Cell ss:StyleID="DataRightPurple"><Data ss:Type="${sale.cashEur > 0 ? 'Number' : 'String'}">${sale.cashEur > 0 ? sale.cashEur.toFixed(2) : '-'}</Data></Cell>
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
    <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#FF6B6B" ss:Pattern="Solid"/>
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
    <Interior ss:Color="#FF6B6B" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
  <Style ss:ID="TableHeader">
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#FF8C42" ss:Pattern="Solid"/>
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
    <Interior ss:Color="#FF8C42" ss:Pattern="Solid"/>
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
  <Style ss:ID="DataRight">
    <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
    </Borders>
  </Style>
  <Style ss:ID="DataRightGreen">
    <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#00B050"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
    </Borders>
  </Style>
  <Style ss:ID="DataRightBlue">
    <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#4472C4"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
    </Borders>
  </Style>
  <Style ss:ID="DataRightYellow">
    <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#FFC000"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
    </Borders>
  </Style>
  <Style ss:ID="DataRightPurple">
    <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#7030A0"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFBFBF"/>
    </Borders>
  </Style>
  <Style ss:ID="TotalRow">
    <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
    <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#FF6B6B" ss:Pattern="Solid"/>
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
    <Interior ss:Color="#FF6B6B" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
      <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
    </Borders>
  </Style>
</Styles>
<Worksheet ss:Name="Çapraz Satış Raporu">
<Table ss:DefaultColumnWidth="80" ss:DefaultRowHeight="18">
  <Column ss:Index="1" ss:Width="180"/>
  <Column ss:Index="2" ss:Width="70"/>
  <Column ss:Index="3" ss:Width="70"/>
  <Column ss:Index="4" ss:Width="80"/>
  <Column ss:Index="5" ss:Width="90"/>
  <Column ss:Index="6" ss:Width="80"/>
  <Column ss:Index="7" ss:Width="80"/>
  <Column ss:Index="8" ss:Width="80"/>
  <Column ss:Index="9" ss:Width="80"/>
  <Column ss:Index="10" ss:Width="80"/>
  
  <!-- BAŞLIK -->
  <Row ss:Height="30">
    <Cell ss:MergeAcross="5" ss:StyleID="Title"><Data ss:Type="String">ÇAPRAZ SATIŞ RAPORU - ${kasaName}</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="TitleInfo"><Data ss:Type="String">${userName}</Data></Cell>
    <Cell ss:MergeAcross="1" ss:StyleID="TitleInfo"><Data ss:Type="String">${currentDate}</Data></Cell>
  </Row>
  <Row ss:Height="8"></Row>
  
  <!-- TABLO BAŞLIKLARI -->
  <Row ss:Height="20">
    <Cell ss:StyleID="TableHeaderLeft"><Data ss:Type="String">Paket</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Yetişkin</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Çocuk</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Para Birimi</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Ödeme Tipi</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Toplam</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">KK (TL)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Nakit (TL)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Nakit (USD)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Nakit (EUR)</Data></Cell>
  </Row>
  
  <!-- VERİLER -->
  ${dataRows}
  
  <Row ss:Height="5"></Row>
  
  <!-- TOPLAMLAR -->
  <Row ss:Height="25">
    <Cell ss:MergeAcross="5" ss:StyleID="TotalLabel"><Data ss:Type="String">TOPLAM ÖZET</Data></Cell>
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
    link.download = `Capraz_Satis_${currentDate.replace(/\./g, '-')}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToHTML = () => {
    const currentDate = new Date().toLocaleDateString('tr-TR');
    const totals = getTotals();
    
    let html = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Çapraz Satış Raporu - ${currentDate}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 40px; 
            background: #f5f5f5;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { 
            color: #1a1a1a; 
            border-bottom: 3px solid #FF6B6B;
            padding-bottom: 10px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
          }
          th { 
            background: #2c3e50; 
            color: white; 
            padding: 12px; 
            text-align: left;
          }
          td { 
            padding: 10px; 
            border-bottom: 1px solid #ddd;
          }
          tr:hover { 
            background: #f8f9fa;
          }
          .totals {
            margin-top: 30px;
            padding: 20px;
            background: #ecf0f1;
            border-radius: 5px;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>ÇAPRAZ SATIŞ RAPORU</h1>
          <div class="date">Tarih: ${currentDate}</div>
          
          <table>
            <thead>
              <tr>
                <th>Paket</th>
                <th class="text-center">Yetişkin</th>
                <th class="text-center">Çocuk</th>
                <th class="text-center">Para Birimi</th>
                <th class="text-center">Ödeme Tipi</th>
                <th class="text-right">Toplam</th>
                <th class="text-right">KK(TL)</th>
                <th class="text-right">Nakit(TL)</th>
                <th class="text-right">Nakit(USD)</th>
                <th class="text-right">Nakit(EUR)</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    crossSales.forEach(sale => {
      html += `
              <tr>
                <td>${sale.packageName}</td>
                <td class="text-center">${sale.adultQty}</td>
                <td class="text-center">${sale.childQty}</td>
                <td class="text-center">${sale.currency}</td>
                <td class="text-center">${sale.paymentType}</td>
                <td class="text-right">${sale.total.toFixed(2)}</td>
                <td class="text-right">${sale.kkTl > 0 ? sale.kkTl.toFixed(2) : '-'}</td>
                <td class="text-right">${sale.cashTl > 0 ? sale.cashTl.toFixed(2) : '-'}</td>
                <td class="text-right">${sale.cashUsd > 0 ? sale.cashUsd.toFixed(2) : '-'}</td>
                <td class="text-right">${sale.cashEur > 0 ? sale.cashEur.toFixed(2) : '-'}</td>
              </tr>
      `;
    });
    
    html += `
            </tbody>
          </table>
          
          <div class="totals">
            <h2>TOPLAM ÖZET</h2>
            <div class="total-item">
              <span>Kredi Kartı (TL):</span>
              <span>${totals.kkTl.toFixed(2)} ₺</span>
            </div>
            <div class="total-item">
              <span>Nakit (TL):</span>
              <span>${totals.cashTl.toFixed(2)} ₺</span>
            </div>
            <div class="total-item">
              <span>Nakit (USD):</span>
              <span>${totals.cashUsd.toFixed(2)} $</span>
            </div>
            <div class="total-item">
              <span>Nakit (EUR):</span>
              <span>${totals.cashEur.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `capraz_satis_${currentDate.replace(/\./g, '_')}.html`;
    link.click();
  };

  const getTotals = () => {
    return {
      kkTl: crossSales.reduce((sum, s) => sum + s.kkTl, 0),
      cashTl: crossSales.reduce((sum, s) => sum + s.cashTl, 0),
      cashUsd: crossSales.reduce((sum, s) => sum + s.cashUsd, 0),
      cashEur: crossSales.reduce((sum, s) => sum + s.cashEur, 0),
    };
  };

  const totals = getTotals();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Share2 className="w-6 h-6 text-orange-400" />
          <h2 className="text-xl font-bold text-white">Çapraz Satış Raporları</h2>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-6">
        {crossSales.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Share2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Henüz çapraz satış kaydı bulunmamaktadır</p>
          </div>
        ) : (
          <>
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
                  {crossSales.map((sale) => (
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
                          onClick={() => handleDelete(sale.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
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
                onClick={exportToHTML}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                <Download className="w-4 h-4" />
                HTML İndir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

