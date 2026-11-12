import React, { useState } from 'react';
import { ActiveView, VehicleModel } from '../types/automotive';
import { Home, Car, Zap, RefreshCw, Snowflake, Menu, Search, List, Database, BookOpen, Settings, X, ShieldAlert } from 'lucide-react';

interface BottomTabBarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  activeVehicle: VehicleModel;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeView,
  onNavigate,
  activeVehicle,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isEv = activeVehicle.fuelType === 'BEV' || activeVehicle.fuelType === 'HEV' || activeVehicle.fuelType === 'PHEV';

  const handleNav = (v: ActiveView) => {
    onNavigate(v);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Mobile Bottom Sheet for More Menu */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full bg-slate-900 border-t border-slate-700/80 rounded-t-3xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto">
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Menu Lengkap GUN AC
              </h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <button
                onClick={() => handleNav('component_list')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/60"
              >
                <List className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Daftar Komponen</div>
                  <div className="text-[10px] text-slate-400">Katalog suku cadang OEM</div>
                </div>
              </button>

              <button
                onClick={() => handleNav('search')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/60"
              >
                <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Pencarian Cepat</div>
                  <div className="text-[10px] text-slate-400">Nomor sekring &amp; kabel</div>
                </div>
              </button>

              <button
                onClick={() => handleNav('database_manage')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/60"
              >
                <Database className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Database Global</div>
                  <div className="text-[10px] text-slate-400">Tambah &amp; kelola model</div>
                </div>
              </button>

              <button
                onClick={() => handleNav('references')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/60"
              >
                <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Sumber Referensi</div>
                  <div className="text-[10px] text-slate-400">Manual servis &amp; verifikasi</div>
                </div>
              </button>

              <button
                onClick={() => handleNav('update_sync')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/60"
              >
                <RefreshCw className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Pembaruan Data</div>
                  <div className="text-[10px] text-slate-400">Mode offline &amp; JSON</div>
                </div>
              </button>

              <button
                onClick={() => handleNav('settings')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/60"
              >
                <Settings className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Pengaturan</div>
                  <div className="text-[10px] text-slate-400">Bahasa &amp; panduan APK</div>
                </div>
              </button>
            </div>

            {/* EV Safety Notice quick bar */}
            {isEv && (
              <div className="mt-4 p-3 bg-orange-950/40 border border-orange-500/40 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-orange-300">
                  <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Sistem AC EV Tegangan Tinggi ({activeVehicle.engineCode})</span>
                </div>
                <button
                  onClick={() => handleNav('ev_ac_diagram')}
                  className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-[10px]"
                >
                  Buka HV AC
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed Bottom Tab Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md px-2 py-1.5">
        <div className="grid grid-cols-5 items-center justify-items-center h-13">
          
          {/* Tab 1: Beranda */}
          <button
            onClick={() => handleNav('home')}
            className={`flex flex-col items-center justify-center w-full py-1 min-h-[44px] transition ${
              activeView === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Beranda</span>
          </button>

          {/* Tab 2: Pilih Kendaraan */}
          <button
            onClick={() => handleNav('vehicle_select')}
            className={`flex flex-col items-center justify-center w-full py-1 min-h-[44px] transition ${
              activeView === 'vehicle_select' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Kendaraan</span>
          </button>

          {/* Tab 3: Sekring */}
          <button
            onClick={() => handleNav('fuse_diagram')}
            className={`flex flex-col items-center justify-center w-full py-1 min-h-[44px] transition ${
              activeView === 'fuse_diagram' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Sekring</span>
          </button>

          {/* Tab 4: AC Jalur */}
          <button
            onClick={() => handleNav(isEv ? 'ev_ac_diagram' : 'ac_diagram')}
            className={`flex flex-col items-center justify-center w-full py-1 min-h-[44px] transition ${
              activeView === 'ac_diagram' || activeView === 'ev_ac_diagram'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Snowflake className="w-5 h-5" />
              {isEv && (
                <span className="absolute -top-1 -right-2 text-[8px] font-black bg-orange-600 text-white px-1 rounded-full">
                  HV
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{isEv ? 'AC Listrik' : 'Jalur AC'}</span>
          </button>

          {/* Tab 5: Menu Lainnya */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center w-full py-1 min-h-[44px] transition ${
              showMoreMenu ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Lainnya</span>
          </button>

        </div>
      </div>
    </>
  );
};
