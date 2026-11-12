import React, { useState } from 'react';
import { db } from '../../services/db';
import { VehicleModel, Region, FuelType, VerificationStatus } from '../../types/automotive';
import { Database, Plus, Trash2, Edit3, CheckCircle2, AlertTriangle, Download, RefreshCw, FileText } from 'lucide-react';

interface DatabaseManageViewProps {
  vehicles: VehicleModel[];
  onOpenAddModal: () => void;
  onSelectVehicle: (id: string) => void;
}

export const DatabaseManageView: React.FC<DatabaseManageViewProps> = ({
  vehicles,
  onOpenAddModal,
  onSelectVehicle,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    const success = db.deleteVehicle(id);
    if (success) {
      setStatusMessage('Data kendaraan berhasil dihapus dari database lokal.');
      setDeleteConfirmId(null);
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setStatusMessage('Gagal menghapus: Minimal harus tersisa satu kendaraan di database.');
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang database ke data asli OEM pabrikan?')) {
      db.resetToFactoryOEM();
      setStatusMessage('Database berhasil diatur ulang ke data standar OEM.');
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Kelola Database Kendaraan Global
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sistem database lokal terstruktur untuk manajemen diagram OEM, sekring, relay, dan kelistrikan AC.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Model Baru</span>
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div className="p-3 bg-cyan-950/60 border border-cyan-800 rounded-xl text-xs text-cyan-200 flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-cyan-400 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Database Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">Total Model Mobil</span>
          <span className="text-2xl font-bold font-mono text-cyan-400">{vehicles.length} Unit</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">Status Terverifikasi</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {vehicles.filter(v => v.verificationStatus === 'TERVERIFIKASI').length} Model
          </span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">Status Demo</span>
          <span className="text-2xl font-bold font-mono text-amber-400">
            {vehicles.filter(v => v.verificationStatus === 'DEMO').length} Model
          </span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">Terakhir Disinkronkan</span>
          <span className="text-xs font-bold font-mono text-slate-200 mt-2 block">{db.getLastSyncDate()}</span>
        </div>
      </div>

      {/* Vehicle Database Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Daftar Model Kendaraan Terdaftar ({vehicles.length})
          </h3>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-cyan-400 font-semibold transition"
          >
            Reset ke Data Pabrikan OEM
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40">
                <th className="py-3 px-4">Merek &amp; Model</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4">Powertrain</th>
                <th className="py-3 px-4">Kode Mesin / Motor</th>
                <th className="py-3 px-4">Dokumen OEM</th>
                <th className="py-3 px-4">Status Data</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-semibold text-white">
                    <div>{v.brand} {v.model}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{v.variant} ({v.yearStart}-{v.yearEnd})</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono">{v.country}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      v.fuelType === 'BEV' ? 'bg-orange-950 text-orange-400' :
                      v.fuelType === 'HEV' || v.fuelType === 'PHEV' ? 'bg-blue-950 text-blue-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {v.fuelType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-cyan-300 font-mono font-medium">{v.engineCode}</td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="truncate max-w-[180px]">{v.sourceDocument.docName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{v.sourceDocument.docNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      v.verificationStatus === 'TERVERIFIKASI' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      v.verificationStatus === 'DEMO' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {v.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectVehicle(v.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition"
                      >
                        Pilih
                      </button>
                      
                      {deleteConfirmId === v.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(v.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold"
                          >
                            Hapus
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 bg-slate-700 text-slate-300 rounded-lg text-[10px]"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(v.id)}
                          title="Hapus Model"
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
