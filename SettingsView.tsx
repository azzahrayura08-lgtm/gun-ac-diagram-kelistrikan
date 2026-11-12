import React, { useState } from 'react';
import { Settings, Smartphone, ShieldCheck, Moon, Sun, Globe, Download, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  isInstallable: boolean;
  onInstall: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ isInstallable, onInstall }) => {
  const [autoShowHvWarning, setAutoShowHvWarning] = useState(true);
  const [defaultAcOverlay, setDefaultAcOverlay] = useState(true);
  const [defaultHvOverlay, setDefaultHvOverlay] = useState(true);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Pengaturan Aplikasi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Konfigurasi tampilan, standar bahasa, preferensi diagram kelistrikan, dan panduan instalasi APK Android.
        </p>
      </div>

      {/* Preferences Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl divide-y divide-slate-800">
        
        {/* Language setting */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Bahasa Aplikasi</span>
              <span className="text-xs text-slate-400">Seluruh menu &amp; penjelasan dalam Bahasa Indonesia, dengan nama asli komponen OEM tetap dicantumkan.</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 self-start sm:self-auto">
            Bahasa Indonesia (OEM Dual)
          </span>
        </div>

        {/* High Voltage Safety Setting */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-orange-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Peringatan Tegangan Tinggi Otomatis</span>
              <span className="text-xs text-slate-400">Tampilkan modal SOP keselamatan saat teknisi membuka diagram AC mobil listrik (BEV / HEV).</span>
            </div>
          </div>
          <button
            onClick={() => setAutoShowHvWarning(!autoShowHvWarning)}
            className={`w-12 h-6 rounded-full transition-colors relative self-start sm:self-auto ${
              autoShowHvWarning ? 'bg-orange-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                autoShowHvWarning ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Default Overlay Preferences */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
              <span className="text-base font-bold">❄</span>
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Aktifkan Penanda Warna AC (Overlay Biru)</span>
              <span className="text-xs text-slate-400">Menyorot sirkuit pendingin kabin dengan warna biru cerah tanpa menutupi kode kabel OEM.</span>
            </div>
          </div>
          <button
            onClick={() => setDefaultAcOverlay(!defaultAcOverlay)}
            className={`w-12 h-6 rounded-full transition-colors relative self-start sm:self-auto ${
              defaultAcOverlay ? 'bg-cyan-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                defaultAcOverlay ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

      </div>

      {/* APK & PWA Android Installation Guide Card (Requirement A & K) */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Pemasangan APK Android: GUN-AC.apk
            </h3>
            <p className="text-xs text-slate-400">
              Aplikasi resmi: <strong>GUN AC – FUSE, RELAY &amp; WIRING DIAGRAM</strong> dalam SATU PROYEK, SATU SISTEM, SATU DATABASE, DAN SATU APK ANDROID.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
          <h4 className="font-bold text-white text-xs">Cara Pasang Cepat di HP Android (GUN-AC.apk):</h4>
          <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li>Buka peramban Chrome di HP Android Anda.</li>
            <li>Klik tombol <strong>"Pasang GUN AC / Tambah ke Layar Utama"</strong> di bawah ini atau tekan menu titik tiga (⋮) di Chrome.</li>
            <li>Pilih <strong>"Install app"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
            <li>Ikon <strong>GUN AC</strong> akan muncul di daftar aplikasi Android Anda dan berjalan 100% offline layaknya file <strong>GUN-AC.apk</strong> native.</li>
          </ol>
        </div>

        {isInstallable && (
          <button
            onClick={onInstall}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
          >
            <Download className="w-4 h-4" />
            <span>Pasang GUN AC di Perangkat Ini</span>
          </button>
        )}

        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-[11px] text-slate-400">
          Untuk build APK mandiri menggunakan Android Studio / Capacitor / PWA2APK: Proyek tunggal ini dapat dibungkus langsung dengan perintah <code className="text-cyan-400">npx cap add android</code> &amp; <code className="text-cyan-400">npx cap run android</code> untuk menghasilkan file instalasi <code className="text-amber-300 font-bold font-mono">GUN-AC.apk</code>.
        </div>
      </div>

    </div>
  );
};
