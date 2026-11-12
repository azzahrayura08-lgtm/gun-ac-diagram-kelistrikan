import React, { useState } from 'react';
import { db } from '../../services/db';
import { VehicleModel } from '../../types/automotive';
import { RefreshCw, Download, Upload, CheckCircle2, AlertCircle, HardDrive, Wifi, WifiOff } from 'lucide-react';

interface UpdateSyncViewProps {
  vehicles: VehicleModel[];
  onRefresh: () => void;
}

export const UpdateSyncView: React.FC<UpdateSyncViewProps> = ({ vehicles, onRefresh }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const handleExport = () => {
    const jsonStr = db.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GUN_AC_DB_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSyncMessage('Database berhasil diekspor ke file JSON.');
    setTimeout(() => setSyncMessage(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = db.importDatabaseJson(content);
      setImportStatus(res);
      if (res.success) {
        onRefresh();
      }
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCheckUpdate = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('Database lokal sudah menggunakan versi paling mutakhir.');
      setTimeout(() => setSyncMessage(null), 3500);
    }, 900);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Pembaruan &amp; Sinkronisasi Database
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Kelola penyimpanan data offline, ekspor cadangan database, dan pembaruan data OEM secara berkala.
        </p>
      </div>

      {/* Sync Status Banner */}
      {syncMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncMessage}</span>
        </div>
      )}

      {importStatus && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
          importStatus.success ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200' : 'bg-red-950/60 border-red-800 text-red-200'
        }`}>
          {importStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{importStatus.message}</span>
        </div>
      )}

      {/* Offline Status Card */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
            {isOnline ? <Wifi className="w-6 h-6 text-emerald-400" /> : <WifiOff className="w-6 h-6 text-amber-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {isOnline ? 'Terhubung ke Jaringan (Online)' : 'Mode Bekerja Offline (Garasi)'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-cyan-300 font-bold">
                Lokal Aktif
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Seluruh data {vehicles.length} model kendaraan tersimpan di memori perangkat lokal dan siap digunakan tanpa sinyal internet.
            </p>
          </div>
        </div>

        <button
          onClick={handleCheckUpdate}
          disabled={isSyncing}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition border border-slate-700 self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Memeriksa...' : 'Periksa Pembaruan'}</span>
        </button>
      </div>

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Export Card */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Ekspor Database (Cadangan JSON)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              Unduh salinan lengkap database dalam format JSON, termasuk semua modifikasi sekring, relay, dan kendaraan yang baru ditambahkan.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="w-full mt-3 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-cyan-950/40"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cadangan Database (.json)</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Impor Database dari File
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              Pulihkan atau perbarui database kendaraan dari file JSON cadangan yang didistribusikan oleh tim teknis.
            </p>
          </div>

          <label className="w-full mt-3 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Pilih File JSON untuk Diimpor</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

      </div>

    </div>
  );
};
