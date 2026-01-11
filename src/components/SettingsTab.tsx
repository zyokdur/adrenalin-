export default function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Ayarlar</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-6">
          <h3 className="text-white font-bold mb-4">Kullanıcı Yönetimi</h3>
          <div className="text-center text-gray-400 py-8">
            Kullanıcı yönetimi burada gösterilecektir...
          </div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-6">
          <h3 className="text-white font-bold mb-4">Kasa Yönetimi</h3>
          <div className="text-center text-gray-400 py-8">
            Kasa yönetimi burada gösterilecektir...
          </div>
        </div>
        <div className="col-span-2 bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 p-6">
          <h3 className="text-white font-bold mb-4">Mail Ayarları</h3>
          <div className="text-center text-gray-400 py-8">
            Mail ayarları burada gösterilecektir...
          </div>
        </div>
      </div>
    </div>
  );
}
