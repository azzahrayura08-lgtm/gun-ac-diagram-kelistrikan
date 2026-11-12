import React from 'react';
import { VehicleModel, ActiveView } from '../../types/automotive';
import { 
  Zap, Snowflake, Car, ShieldAlert, Cpu, Download, 
  CheckCircle2, Search, Database, ArrowRight, BookOpen, Layers
} from 'lucide-react';

interface HomeViewProps {
  activeVehicle: VehicleModel;
  onNavigate: (view: ActiveView) => void;
  allVehicles: VehicleModel[];
  onSelectVehicle: (id: string) => void;
  onOpenHvModal: () => void;
  isInstallable: boolean;
  onInstall: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  activeVehicle,
  onNavigate,
  allVehicles,
  onSelectVehicle,
  onOpenHvModal,
  isInstallable,
  onInstall,
}) => {
  const verifiedCount = allVehicles.filter(v => v.verificationStatus === 'TERVERIFIKASI').length;
  const isEv = activeVehicle.fuelType === 'BEV' || activeVehicle.fuelType === 'HEV' || activeVehicle.fuelType === 'PHEV';

  return (
    <div className="space-y-6 pb-20">
      
      {/* Hero Technical Header */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-5 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              Referensi Teknis Otomotif OEM
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Satu Sistem · Satu Database · Offline Ready
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            GUN AC
          </h1>
          <div className="text-sm sm:text-base font-bold text-cyan-400 font-mono tracking-wide mt-1">
            FUSE, RELAY &amp; WIRING DIAGRAM
          </div>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Aplikasi referensi kelistrikan otomotif profesional untuk diagram kotak sekring, relay terminal, jalur sistem AC konvensional, dan khusus jalur AC mobil listrik (BEV/HEV/PHEV) berbasis dokumen manual servis pabrikan asli.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-800/80">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Total Model Kendaraan</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                {allVehicles.length} Model
              </span>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Dokumen Terverifikasi</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {verifiedCount} OEM Manual
              </span>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Cakupan Kategori</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
                5 Powertrain
              </span>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">Penyimpanan Data</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-purple-400 tabular-nums">
                100% Offline
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* High-Voltage EV Safety Alert Banner (Feature L) */}
      {isEv && (
        <div className="p-4 bg-orange-950/40 border-2 border-orange-500/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-orange-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  PERHATIAN TEGANGAN TINGGI (HIGH VOLTAGE)
                </span>
                <span className="text-[11px] font-mono font-bold bg-orange-500/20 px-2 py-0.2 rounded text-orange-300">
                  {activeVehicle.fuelType}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Kompresor AC pada <strong>{activeVehicle.brand} {activeVehicle.model}</strong> terhubung dengan baterai traksi bertegangan tinggi. Ikuti SOP keselamatan teknisi sebelum membuka konektor.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenHvModal}
            className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs whitespace-nowrap transition shadow-md shadow-orange-950/50 shrink-0"
          >
            Lihat Prosedur De-Energize
          </button>
        </div>
      )}

      {/* Active Vehicle Spotlight Card */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 uppercase">
                Kendaraan Aktif Saat Ini
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                activeVehicle.verificationStatus === 'TERVERIFIKASI'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : activeVehicle.verificationStatus === 'DEMO'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {activeVehicle.verificationStatus}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {activeVehicle.brand} {activeVehicle.model}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Tahun: {activeVehicle.yearStart} - {activeVehicle.yearEnd} · {activeVehicle.generation} · Mesin: <span className="font-mono text-cyan-300">{activeVehicle.engineCode}</span> · Transmisi: {activeVehicle.transmission}
            </p>
          </div>

          <button
            onClick={() => onNavigate('vehicle_select')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white rounded-xl text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Car className="w-4 h-4" />
            <span>Ganti Kendaraan Lain</span>
          </button>
        </div>

        {/* 4 Primary Diagram Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          
          {/* Card 1: Diagram Sekring */}
          <button
            onClick={() => onNavigate('fuse_diagram')}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 text-left transition group hover:bg-slate-950"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {activeVehicle.fuses.length} Sekring
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Diagram Sekring
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Tata letak kotak sekring ruang mesin &amp; kabin dengan ampere warna standar ISO.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-cyan-400 font-semibold">
              <span>Buka Diagram</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Diagram Relay */}
          <button
            onClick={() => onNavigate('relay_diagram')}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 text-left transition group hover:bg-slate-950"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {activeVehicle.relays.length} Relay
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              Diagram Relay
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Pinout terminal 30, 85, 86, 87, nilai resistansi koil, dan skematik kontak saklar.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-purple-400 font-semibold">
              <span>Buka Relay</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Diagram AC */}
          <button
            onClick={() => onNavigate(isEv ? 'ev_ac_diagram' : 'ac_diagram')}
            className={`p-4 rounded-xl border text-left transition group ${
              isEv 
                ? 'bg-orange-950/20 border-orange-500/30 hover:border-orange-500 hover:bg-orange-950/30'
                : 'bg-slate-950/70 border-slate-800 hover:border-blue-500/60 hover:bg-slate-950'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                isEv ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              }`}>
                <Snowflake className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {activeVehicle.acDiagram?.refrigerantType || 'R134a'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              {isEv ? 'Diagram AC Mobil Listrik' : 'Diagram Kelistrikan AC'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {isEv
                ? 'Inverter kompresor elektrik, heat pump, EXV, dan sirkuit interlock HVIL.'
                : 'Magnetic clutch, pressure switch, thermistor, amplifier, dan hubungan ECM.'}
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-cyan-400 font-semibold">
              <span>Buka Kelistrikan AC</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 4: Daftar Komponen */}
          <button
            onClick={() => onNavigate('component_list')}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 text-left transition group hover:bg-slate-950"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Part Catalog
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Daftar Komponen OEM
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Nomor part OEM, posisi fisik, nomor konektor dan referensi manual servis.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <span>Lihat Katalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

        {/* OEM Source Attribution Bar (Requirement H) */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Sumber OEM: <strong className="text-slate-200">{activeVehicle.sourceDocument.docName}</strong> ({activeVehicle.sourceDocument.docNumber})
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Halaman: {activeVehicle.sourceDocument.pagesRef}
          </span>
        </div>
      </section>

      {/* Powertrain Category Quick Access */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Pilih Kategori Powertrain Kendaraan:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          
          <button
            onClick={() => onNavigate('vehicle_select')}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition"
          >
            <span className="text-xs font-bold text-white block">1. Mobil Bensin</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">ICE Gasoline Engine</span>
          </button>

          <button
            onClick={() => onNavigate('vehicle_select')}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition"
          >
            <span className="text-xs font-bold text-white block">2. Mobil Diesel</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Common Rail D-4D</span>
          </button>

          <button
            onClick={() => onNavigate('vehicle_select')}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition"
          >
            <span className="text-xs font-bold text-white block">3. Mobil Hybrid (HEV)</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Self-Charging e:HEV</span>
          </button>

          <button
            onClick={() => onNavigate('vehicle_select')}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition"
          >
            <span className="text-xs font-bold text-white block">4. Plug-in Hybrid</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">PHEV Dual Power</span>
          </button>

          <button
            onClick={() => onNavigate('vehicle_select')}
            className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-800/60 hover:border-cyan-400 text-left transition"
          >
            <span className="text-xs font-bold text-cyan-300 block">5. Listrik Murni (BEV)</span>
            <span className="text-[10px] text-cyan-200 block mt-0.5">High Voltage Heat Pump</span>
          </button>

        </div>
      </section>

      {/* Offline PWA Installation & APK Information */}
      {isInstallable && (
        <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              Pasang Aplikasi GUN AC di Android (GUN-AC.apk)
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Pasang langsung sebagai aplikasi Android mandiri (PWA Standalone APK). Dapat dibuka tanpa koneksi internet saat bekerja di bengkel atau garasi.
            </p>
          </div>
          <button
            onClick={onInstall}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs whitespace-nowrap transition shadow-lg shadow-cyan-950/50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Pasang Sekarang</span>
          </button>
        </section>
      )}

    </div>
  );
};
