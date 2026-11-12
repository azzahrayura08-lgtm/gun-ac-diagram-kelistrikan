import React from 'react';
import { AlertTriangle, ShieldCheck, X, Zap } from 'lucide-react';

interface HvSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  voltageLevel?: string;
}

export const HvSafetyModal: React.FC<HvSafetyModalProps> = ({ isOpen, onClose, voltageLevel = '300V - 800V DC' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-orange-500/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-orange-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/60 flex items-center justify-center text-orange-400 shrink-0">
              <Zap className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-orange-500/30 text-orange-300 px-2.5 py-0.5 rounded border border-orange-500/40">
                  PERINGATAN KESELAMATAN TEKNISI
                </span>
                <span className="text-xs text-orange-400 font-mono font-bold">{voltageLevel}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Sistem AC Kendaraan Listrik (Tegangan Tinggi)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-orange-950/40 border border-orange-500/30 rounded-xl text-orange-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm">
              <strong className="text-orange-300">BAHAYA SENGATAN LISTRIK MEMATIKAN:</strong> Kompresor AC pada mobil listrik (BEV, HEV, PHEV) digerakkan langsung oleh daya baterai traksi bertegangan tinggi ({voltageLevel}). Diagram ini disediakan murni sebagai <strong>referensi teknis</strong>.
            </p>
          </div>

          <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            5 Langkah Wajib SOP Penonaktifan Sistem Tegangan Tinggi (De-Energize):
          </h3>

          <ol className="space-y-2.5 pl-2 text-xs sm:text-sm">
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold text-xs shrink-0 border border-slate-700">1</span>
              <span><strong>Kunci Kontak OFF:</strong> Pastikan instrumen cluster mati sepenuhnya (Bukan status READY). Simpan smart key sejauh minimal 5 meter dari kendaraan.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold text-xs shrink-0 border border-slate-700">2</span>
              <span><strong>Lepas Service Plug / MSD:</strong> Cabut Manual Service Disconnect (MSD) oranye dan pasang gembok keselamatan Lockout/Tagout (LOTO).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold text-xs shrink-0 border border-slate-700">3</span>
              <span><strong>Tunggu Pengosongan Kapasitor (10 Menit):</strong> Berikan jeda waktu minimal 10 menit agar kapasitor berkapasitas besar di dalam inverter kompresor terbuang habis secara internal.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold text-xs shrink-0 border border-slate-700">4</span>
              <span><strong>Gunakan Sarung Tangan Berinsulasi 1000V (Class 0):</strong> Periksa sarung tangan karet sebelum digunakan dengan metode uji kebocoran udara tekan (air leakage check).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold text-xs shrink-0 border border-slate-700">5</span>
              <span><strong>Uji Nol Tegangan (Zero Voltage Verification):</strong> Ukur pin konektor HV kompresor dengan multimeter bersertifikasi CAT III / CAT IV 1000V sebelum menyentuh bagian logam konduktor.</span>
            </li>
          </ol>

          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-300">
            <strong className="text-cyan-300">ATURAN OLI KOMPRESOR:</strong> DILARANG KERAS menggunakan oli kompresor konvensional (PAG 46/PAG 100) karena bersifat konduktif dan menyebabkan kebocoran isolasi ke bodi. Selalu gunakan oli dielektrik sintetis OEM murni (POE ND-OIL 11 / SE-10Y) dengan tahanan isolasi &gt; 1000 MΩ.
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Saya Mengerti & Mengikuti SOP OEM
          </button>
        </div>

      </div>
    </div>
  );
};
