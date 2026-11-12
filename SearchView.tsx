import React, { useState } from 'react';
import { db } from '../../services/db';
import { ActiveView, VehicleModel } from '../../types/automotive';
import { SelectedDetailItem } from '../ComponentDetailModal';
import { Search, Zap, Layers, Cpu, Car, ArrowRight, CornerDownRight } from 'lucide-react';

interface SearchViewProps {
  onSelectVehicle: (id: string) => void;
  onNavigate: (view: ActiveView) => void;
  onSelectItem: (item: SelectedDetailItem) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  onSelectVehicle,
  onNavigate,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>(db.getSearchHistory());
  const results = db.search(query);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim().length >= 3) {
      db.addSearchHistory(val);
      setHistory(db.getSearchHistory());
    }
  };

  const handleSelectHistory = (item: string) => {
    setQuery(item);
    db.addSearchHistory(item);
    setHistory(db.getSearchHistory());
  };

  const handleClearHistory = () => {
    db.clearSearchHistory();
    setHistory([]);
  };

  const quickQueries = [
    'A/C COMP', 'Blower', 'Magnetic Clutch', '10A', 'High Voltage', 'Denso', '30A', 'Thermistor', 'Dual Pressure Switch', 'Canter', 'OH 1626'
  ];

  return (
    <div className="space-y-5 pb-20">
      
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Pencarian Cepat Diagnosa Otomotif
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Cari nomor sekring, kode OEM, nama komponen AC, kode warna kabel, atau gejala kerusakan di seluruh database mobil, bus, dan truk.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            placeholder="Ketik kata kunci pencarian (misal: A/C COMP, 10A, Kompresor, W-B, Inverter, Canter, OH 1626)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            autoFocus
          />
        </div>

        {/* Search History Chips if available */}
        {history.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 border-b border-slate-800/80 pb-2">
            <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">Riwayat Pencarian:</span>
            {history.slice(0, 8).map(item => (
              <button
                key={item}
                onClick={() => handleSelectHistory(item)}
                className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 hover:text-white hover:bg-slate-800 whitespace-nowrap text-xs transition"
              >
                {item}
              </button>
            ))}
            <button
              onClick={handleClearHistory}
              className="text-[10px] text-slate-500 hover:text-rose-400 underline whitespace-nowrap ml-auto"
            >
              Hapus Riwayat
            </button>
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
          <span className="text-[11px] text-slate-500 whitespace-nowrap">Saran:</span>
          {quickQueries.map(item => (
            <button
              key={item}
              onClick={() => handleSelectHistory(item)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 whitespace-nowrap text-xs transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Summary */}
      {query.trim().length > 0 && (
        <div className="text-xs text-slate-400 font-mono">
          Ditemukan <strong className="text-cyan-400">{results.length}</strong> hasil pencarian untuk "{query}":
        </div>
      )}

      {/* Results List */}
      <div className="space-y-3">
        {results.map((res, idx) => {
          return (
            <div
              key={idx}
              onClick={() => {
                onSelectVehicle(res.vehicle.id);
                if (res.matchType === 'FUSE') {
                  onSelectItem({ type: 'FUSE', data: res.item, vehicle: res.vehicle });
                  onNavigate('fuse_diagram');
                } else if (res.matchType === 'RELAY') {
                  onSelectItem({ type: 'RELAY', data: res.item, vehicle: res.vehicle });
                  onNavigate('relay_diagram');
                } else if (res.matchType === 'COMPONENT') {
                  onSelectItem({ type: 'NODE', data: res.item, vehicle: res.vehicle });
                  const isEv = res.vehicle.fuelType === 'BEV' || res.vehicle.fuelType === 'HEV';
                  onNavigate(isEv ? 'ev_ac_diagram' : 'ac_diagram');
                } else if (res.matchType === 'WIRE') {
                  onSelectItem({ type: 'WIRE', data: res.item, vehicle: res.vehicle });
                  const isEv = res.vehicle.fuelType === 'BEV' || res.vehicle.fuelType === 'HEV';
                  onNavigate(isEv ? 'ev_ac_diagram' : 'ac_diagram');
                } else {
                  onNavigate('home');
                }
              }}
              className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  {res.matchType === 'FUSE' ? <Zap className="w-5 h-5 text-amber-400" /> :
                   res.matchType === 'RELAY' ? <Layers className="w-5 h-5 text-purple-400" /> :
                   res.matchType === 'COMPONENT' ? <Cpu className="w-5 h-5 text-emerald-400" /> :
                   <Car className="w-5 h-5 text-blue-400" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                      {res.matchType}
                    </span>
                    <span className="text-xs text-cyan-300 font-semibold">
                      {res.vehicle.brand} {res.vehicle.model} ({res.vehicle.yearStart}-{res.vehicle.yearEnd})
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                    {res.details}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Doc: {res.vehicle.sourceDocument.docNumber} · Halaman: {res.vehicle.sourceDocument.pagesRef}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold self-end sm:self-auto shrink-0">
                <span>Buka Diagram</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}

        {query.trim().length > 0 && results.length === 0 && (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
            Tidak ada kecocokan untuk kata kunci "{query}". Coba cari kata kunci lain seperti "10A", "Kompresor", "Relay", atau "Denso".
          </div>
        )}

        {query.trim().length === 0 && (
          <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-xs text-slate-500">
            Masukkan kata kunci di atas untuk memulai pencarian cerdas di seluruh database kendaraan.
          </div>
        )}
      </div>

    </div>
  );
};
