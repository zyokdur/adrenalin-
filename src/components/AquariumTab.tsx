export default function AquariumTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Akvaryum Pax Raporlaması</h2>
      <div className="grid grid-cols-3 gap-4">
        {['Acente', 'Müfteridi Panosu', 'Kasa'].map((panel) => (
          <div key={panel} className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-6">
            <h3 className="text-white font-bold mb-4">{panel}</h3>
            <div className="text-center text-gray-400 py-8">
              {panel} verisi burada gösterilecektir...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
