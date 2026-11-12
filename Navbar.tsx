import React from 'react';
import { ActiveView, VehicleModel } from '../types/automotive';
import { Download, Search, Car, ShieldAlert, Cpu } from 'lucide-react';

interface NavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  activeVehicle: VehicleModel;
  isInstallable: boolean;
  onInstall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  activeVehicle,
  isInstallable,
  onInstall,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-cyan-900/40 group-hover:scale-105 transition-transform shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white block leading-none">
                GUN AC
              </span>
              <span className="text-[10px] text-cyan-400 font-medium tracking-wider uppercase block mt-0.5">
                Fuse, Relay &amp; Wiring Diagram
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4–5 concise single-line nav links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap transition-colors ${
              activeView === 'home' ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate('vehicle_select')}
            className={`whitespace-nowrap transition-colors ${
              activeView === 'vehicle_select' ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Pilih Kendaraan
          </button>
          <button
            onClick={() => onNavigate('fuse_diagram')}
            className={`whitespace-nowrap transition-colors ${
              activeView === 'fuse_diagram' ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Diagram Sekring
          </button>
          <button
            onClick={() => onNavigate('relay_diagram')}
            className={`whitespace-nowrap transition-colors ${
              activeView === 'relay_diagram' ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Diagram Relay
          </button>
          <button
            onClick={() => onNavigate(activeVehicle.fuelType === 'BEV' || activeVehicle.fuelType === 'HEV' || activeVehicle.fuelType === 'PHEV' ? 'ev_ac_diagram' : 'ac_diagram')}
            className={`whitespace-nowrap transition-colors ${
              activeView === 'ac_diagram' || activeView === 'ev_ac_diagram' ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Diagram Kelistrikan AC
          </button>
          <button
            onClick={() => onNavigate('database_manage')}
            className={`whitespace-nowrap transition-colors ${
              activeView === 'database_manage' ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Database Kendaraan
          </button>
        </nav>

        {/* Zone 3: Active Vehicle selector trigger + Install button */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Quick Active Vehicle Badge & Switcher */}
          <button
            onClick={() => onNavigate('vehicle_select')}
            title="Ganti Kendaraan Aktif"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition text-left group"
          >
            <Car className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="max-w-[130px] sm:max-w-[180px] truncate">
              <div className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-cyan-300">
                {activeVehicle.brand} {activeVehicle.model}
              </div>
              <div className="text-[9px] text-slate-400 font-mono truncate">
                {activeVehicle.fuelType} · {activeVehicle.engineCode}
              </div>
            </div>
          </button>

          {/* Quick Search Button */}
          <button
            onClick={() => onNavigate('search')}
            title="Pencarian Global"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* In-App PWA / APK Install Button */}
          {isInstallable && (
            <button
              onClick={onInstall}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-900/30 transition whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang APK</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
