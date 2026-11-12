import React, { useState } from 'react';
import { VehicleModel, RelayItem, FuseBoxLocation } from '../../types/automotive';
import { SelectedDetailItem } from '../ComponentDetailModal';
import { Layers, Search, AlertCircle, Info, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

interface RelayDiagramViewProps {
  vehicle: VehicleModel;
  onSelectItem: (item: SelectedDetailItem) => void;
}

export const RelayDiagramView: React.FC<RelayDiagramViewProps> = ({
  vehicle,
  onSelectItem,
}) => {
  const [activeBox, setActiveBox] = useState<FuseBoxLocation>('ENGINE_BAY');
  const [searchRelay, setSearchRelay] = useState('');

  if (vehicle.relays.length === 0 || vehicle.verificationStatus === 'DATA BELUM TERSEDIA') {
    return (
      <div className="p-8 sm:p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
            STATUS: DATA BELUM TERSEDIA
          </span>
          <h2 className="text-xl font-bold text-white mt-2">
            Diagram Relay {vehicle.brand} {vehicle.model} Belum Tersedia
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Dokumen skematik pinout terminal relay untuk varian ini belum diunggah dari manual servis OEM resmi.
          </p>
        </div>
      </div>
    );
  }

  const boxRelays = vehicle.relays.filter(r => r.boxLocation === activeBox);
  const filteredRelays = boxRelays.filter(r => {
    const q = searchRelay.toLowerCase().trim();
    return (
      q === '' ||
      r.code.toLowerCase().includes(q) ||
      r.nameOem.toLowerCase().includes(q) ||
      r.nameId.toLowerCase().includes(q) ||
      r.functionDesc.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 pb-20">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 uppercase">
              Diagram Terminal &amp; Pinout Relay (OEM)
            </span>
            <span className="text-xs text-slate-400">
              {vehicle.brand} {vehicle.model}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Relay Blok: {activeBox === 'ENGINE_BAY' ? 'Ruang Mesin' : 'Kabin'}
          </h1>
        </div>

        {/* Box Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveBox('ENGINE_BAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeBox === 'ENGINE_BAY' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ruang Mesin ({vehicle.relays.filter(r => r.boxLocation === 'ENGINE_BAY').length})
          </button>
          <button
            onClick={() => setActiveBox('CABIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeBox === 'CABIN' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kabin Penumpang ({vehicle.relays.filter(r => r.boxLocation === 'CABIN').length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchRelay}
          onChange={e => setSearchRelay(e.target.value)}
          placeholder="Cari nama relay (MG CLT, BLOWER, FAN), fungsi, atau nomor terminal..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Relay Schematic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRelays.map(relay => {
          return (
            <div
              key={relay.id}
              onClick={() => onSelectItem({ type: 'RELAY', data: relay, vehicle })}
              className="bg-slate-900 border border-slate-800 hover:border-purple-500/60 rounded-2xl p-5 shadow-xl transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-xs shrink-0">
                      {relay.code}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {relay.nameId}
                      </h3>
                      <p className="text-[11px] font-mono text-cyan-300">
                        OEM: {relay.nameOem}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                    {relay.relayType}
                  </span>
                </div>

                {/* Specs Strip */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 mb-3 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tahanan Koil:</span>
                    <span className="text-slate-200 font-bold">{relay.coilResistance}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Rating Beban:</span>
                    <span className="text-slate-200 font-bold">{relay.contactRating}</span>
                  </div>
                </div>

                {/* Interactive Schematic Diagram of Relay (SVG) */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                    Skematik Internal Koil &amp; Armatur Kontak
                  </span>
                  
                  <svg viewBox="0 0 320 130" className="w-full h-auto text-xs font-mono">
                    {/* Outline box of relay socket */}
                    <rect x="10" y="10" width="300" height="110" rx="12" fill="#090d16" stroke="#334155" strokeWidth="1.5" />
                    
                    {/* Coil Circuit (Pins 1 & 2 / 85 & 86) */}
                    <g transform="translate(30, 25)">
                      <circle cx="15" cy="20" r="10" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
                      <text x="15" y="24" fill="#38bdf8" textAnchor="middle" fontSize="10" fontWeight="bold">86</text>
                      
                      {/* Coil inductors symbol */}
                      <path d="M 25 20 Q 40 5 50 20 Q 60 5 70 20 Q 80 5 90 20" fill="none" stroke="#eab308" strokeWidth="2.5" />
                      
                      <circle cx="100" cy="20" r="10" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
                      <text x="100" y="24" fill="#38bdf8" textAnchor="middle" fontSize="10" fontWeight="bold">85</text>
                      
                      <text x="58" y="45" fill="#94a3b8" textAnchor="middle" fontSize="9">Koil Elektromagnet</text>
                    </g>

                    {/* Contact Switch Circuit (Pins 3 & 5 / 30 & 87) */}
                    <g transform="translate(180, 25)">
                      <circle cx="20" cy="20" r="10" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
                      <text x="20" y="24" fill="#c084fc" textAnchor="middle" fontSize="10" fontWeight="bold">30</text>
                      
                      {/* Movable Armature Switch Line */}
                      <line x1="30" y1="20" x2="80" y2="12" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="30" cy="20" r="3" fill="#22c55e" />
                      
                      {/* Fixed Contact 87 */}
                      <circle cx="95" cy="20" r="10" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
                      <text x="95" y="24" fill="#c084fc" textAnchor="middle" fontSize="10" fontWeight="bold">87</text>
                      <circle cx="85" cy="20" r="3" fill="#94a3b8" />
                      
                      <text x="58" y="45" fill="#94a3b8" textAnchor="middle" fontSize="9">Kontak Daya NO</text>
                    </g>

                    {/* Dotted link between coil and switch */}
                    <line x1="88" y1="65" x2="238" y2="35" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
                  </svg>
                </div>

                {/* Terminals Summary List */}
                <div className="space-y-1.5 text-xs">
                  {relay.terminals.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-950/40 rounded-lg text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/40">
                          Pin {t.pinNumber} ({t.standardDin})
                        </span>
                        <span className="text-slate-300">{t.nameId}</span>
                      </div>
                      <span className="font-mono text-amber-300">{t.wireColorOem}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-semibold">
                <span>Klik untuk Detail Komponen</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
