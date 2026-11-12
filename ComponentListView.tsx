import React, { useState } from 'react';
import { VehicleModel, SchematicNode } from '../../types/automotive';
import { SelectedDetailItem } from '../ComponentDetailModal';
import { Cpu, Search, MapPin, Zap, Snowflake, CheckCircle2, Bookmark, ArrowRight } from 'lucide-react';

interface ComponentListViewProps {
  vehicle: VehicleModel;
  onSelectItem: (item: SelectedDetailItem) => void;
}

export const ComponentListView: React.FC<ComponentListViewProps> = ({
  vehicle,
  onSelectItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const nodes = vehicle.acDiagram?.nodes || [];

  const filteredNodes = nodes.filter(node => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      q === '' ||
      node.labelId.toLowerCase().includes(q) ||
      node.labelOem.toLowerCase().includes(q) ||
      (node.partNumber && node.partNumber.toLowerCase().includes(q)) ||
      node.location.toLowerCase().includes(q);

    const matchCat = categoryFilter === 'ALL' || node.category === categoryFilter;

    return matchSearch && matchCat;
  });

  const categories = ['ALL', 'ACTUATOR', 'SENSOR', 'ECU', 'RELAY', 'FUSE', 'HV_COMPONENT', 'POWER'];

  return (
    <div className="space-y-5 pb-20">
      
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
            Katalog Komponen OEM
          </span>
          <span className="text-xs text-slate-400">
            {vehicle.brand} {vehicle.model}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Daftar Komponen Kelistrikan &amp; AC
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Informasi nomor komponen pabrikan (OEM Part Number), nomor pinout soket, lokasi fisik di bodi mobil, dan fungsi kerja teknis.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama komponen (Kompresor, Blower, Sensor), nomor part, atau lokasi..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-[11px] text-slate-400 mr-1 font-semibold whitespace-nowrap">Kategori:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === cat
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'Semua Komponen' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNodes.map(node => {
          return (
            <div
              key={node.id}
              onClick={() => onSelectItem({ type: 'NODE', data: node, vehicle })}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl shadow-xl transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      node.isHighVoltage ? 'bg-orange-950 text-orange-400 border border-orange-800' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {node.isHighVoltage ? '⚡ HIGH VOLTAGE' : node.category}
                    </span>
                    {node.isAcComponent && (
                      <span className="text-cyan-400 flex items-center gap-1 text-[11px] font-mono">
                        <Snowflake className="w-3 h-3" />
                        <span>Sistem AC</span>
                      </span>
                    )}
                  </div>
                  {node.voltageRating && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {node.voltageRating}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {node.labelId}
                </h3>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">
                  OEM: {node.labelOem}
                </p>

                {/* Part Number */}
                {node.partNumber && (
                  <div className="mt-2.5 p-2 bg-slate-950/70 rounded-lg border border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[10px]">OEM Part Number:</span>
                    <span className="font-mono font-bold text-amber-300">{node.partNumber}</span>
                  </div>
                )}

                {/* Location */}
                <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{node.location}</span>
                </div>

                {/* Connector Pin */}
                {node.connectorPin && (
                  <div className="mt-1.5 text-[11px] text-slate-400 font-mono">
                    Konektor: <strong className="text-slate-200">{node.connectorPin}</strong>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span>Lihat Detail Pinout &amp; Sirkuit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredNodes.length === 0 && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
          Tidak ada komponen yang cocok dengan kriteria pencarian.
        </div>
      )}

    </div>
  );
};
