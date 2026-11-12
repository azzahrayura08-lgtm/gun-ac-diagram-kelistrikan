import React from 'react';
import { VehicleModel } from '../../types/automotive';
import { BookOpen, ShieldCheck, AlertCircle, FileCheck, CheckCircle2, Bookmark } from 'lucide-react';

interface ReferencesViewProps {
  vehicles: VehicleModel[];
}

export const ReferencesView: React.FC<ReferencesViewProps> = ({ vehicles }) => {
  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
            Integritas &amp; Audit Trail OEM
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Sumber Referensi Dokumen Manual Pabrikan
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Setiap diagram sekring, relay, dan kelistrikan AC bersumber dari dokumen manual servis resmi OEM (Electrical Wiring Diagram).
        </p>
      </div>

      {/* Code of Ethics Card (Requirement H) */}
      <div className="p-5 bg-slate-900 border-2 border-cyan-500/40 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Prinsip Integritas Data Otomotif (Anti-Halusinasi AI)
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Aplikasi ini mematuhi standar ketat akurasi data teknis otomotif:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tidak mengarang nomor sekring &amp; kapasitas ampere.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tidak mengarang nomor terminal relay atau pin soket.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Warna kabel mengikuti kode singkatan asli OEM (W-B, L-Y).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Data belum tersedia ditampilkan secara jujur tanpa rekayasa.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Verification Status Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-slate-900 border border-emerald-800/40 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 font-mono">1. TERVERIFIKASI</span>
          </div>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Data telah diperiksa silang langsung terhadap Service Manual &amp; Wiring Diagram resmi pabrikan.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-xs font-bold text-slate-300 font-mono">2. DATA BELUM TERSEDIA</span>
          </div>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Manual resmi OEM belum diunggah. Aplikasi tidak mengarang data sebelum dokumen terverifikasi tersedia.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-amber-800/40 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-bold text-amber-400 font-mono">3. DEMO PENGUJIAN</span>
          </div>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Dataset untuk pengujian fungsi aplikasi, diberi label DEMO secara transparan dan bukan data resmi terverifikasi.
          </p>
        </div>
      </div>

      {/* OEM Documents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            Daftar Dokumen Sumber Manual OEM Terdaftar ({vehicles.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40">
                <th className="py-3 px-4">Kendaraan</th>
                <th className="py-3 px-4">Judul Manual OEM</th>
                <th className="py-3 px-4">Nomor Dokumen</th>
                <th className="py-3 px-4">Penerbit / Divisi</th>
                <th className="py-3 px-4">Referensi Halaman</th>
                <th className="py-3 px-4">Status Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-white">
                    {v.brand} {v.model} ({v.yearStart}-{v.yearEnd})
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {v.sourceDocument.docName}
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                    {v.sourceDocument.docNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {v.sourceDocument.publisher}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {v.sourceDocument.pagesRef}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
