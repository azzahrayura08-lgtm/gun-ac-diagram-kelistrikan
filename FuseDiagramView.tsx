import React, { useState } from 'react';
import { VehicleModel, FuseItem, FuseBoxLocation, FuseCategory } from '../../types/automotive';
import { DiagramZoomControls } from '../DiagramZoomControls';
import { SelectedDetailItem } from '../ComponentDetailModal';
import { Search, Zap, AlertCircle, Snowflake, Layers, Filter, CheckCircle2, Info } from 'lucide-react';

interface FuseDiagramViewProps {
  vehicle: VehicleModel;
  onSelectItem: (item: SelectedDetailItem) => void;
  onNavigateAddData?: () => void;
}

export const FuseDiagramView: React.FC<FuseDiagramViewProps> = ({
  vehicle,
  onSelectItem,
  onNavigateAddData,
}) => {
  const [activeBox, setActiveBox] = useState<FuseBoxLocation>('ENGINE_BAY');
  const [searchFuse, setSearchFuse] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FuseCategory | 'ALL'>('ALL');
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highlightAcFuses, setHighlightAcFuses] = useState(true);

  // If vehicle has no fuse data
  if (vehicle.fuses.length === 0 || vehicle.verificationStatus === 'DATA BELUM TERSEDIA') {
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
            Diagram Sekring {vehicle.brand} {vehicle.model} Belum Tersedia
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Sesuai prinsip kepatuhan dan integritas data OEM, aplikasi tidak menampilkan diagram perkiraan atau hasil karangan AI jika dokumen asli pabrikan belum tersedia.
          </p>
        </div>
        <div className="pt-2">
          <p className="text-xs text-slate-500">
            Sumber dokumen servis resmi ({vehicle.sourceDocument.docName}) sedang dalam proses pengunggahan.
          </p>
        </div>
      </div>
    );
  }

  // Filter fuses by selected box
  const availableBoxes: Array<{ id: FuseBoxLocation; label: string; count: number }> = [
    { id: 'ENGINE_BAY', label: 'Ruang Mesin (Under-hood)', count: vehicle.fuses.filter(f => f.boxLocation === 'ENGINE_BAY').length },
    { id: 'CABIN', label: 'Kabin Penumpang (Interior)', count: vehicle.fuses.filter(f => f.boxLocation === 'CABIN').length },
  ];

  if (vehicle.fuses.some(f => f.boxLocation === 'PDU_HV')) {
    availableBoxes.push({
      id: 'PDU_HV',
      label: 'PDU Tegangan Tinggi (High Voltage)',
      count: vehicle.fuses.filter(f => f.boxLocation === 'PDU_HV').length,
    });
  }

  const boxFuses = vehicle.fuses.filter(f => f.boxLocation === activeBox);

  // Filtered by search and category
  const filteredFuses = boxFuses.filter(f => {
    const q = searchFuse.toLowerCase().trim();
    const matchSearch =
      q === '' ||
      f.code.toLowerCase().includes(q) ||
      f.nameOem.toLowerCase().includes(q) ||
      f.nameId.toLowerCase().includes(q) ||
      f.amperage.toString() === q ||
      f.functionDesc.toLowerCase().includes(q);

    const matchCat = categoryFilter === 'ALL' || f.category === categoryFilter;

    return matchSearch && matchCat;
  });

  return (
    <div className={`space-y-4 pb-20 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 overflow-y-auto' : ''}`}>
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase">
              Diagram Tata Letak Sekring (OEM)
            </span>
            <span className="text-xs text-slate-400">
              {vehicle.brand} {vehicle.model} ({vehicle.generation})
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Kotak Sekring: {activeBox === 'ENGINE_BAY' ? 'Ruang Mesin' : activeBox === 'CABIN' ? 'Kabin Penumpang' : 'PDU High Voltage'}
          </h1>
        </div>

        {/* Box Location Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto self-start sm:self-auto">
          {availableBoxes.map(b => (
            <button
              key={b.id}
              onClick={() => setActiveBox(b.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeBox === b.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{b.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30">
                {b.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFuse}
            onChange={e => setSearchFuse(e.target.value)}
            placeholder="Cari nomor sekring (F01, 10A), nama OEM (A/C COMP), atau fungsi..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category filter pills & AC Highlight toggle */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setHighlightAcFuses(!highlightAcFuses)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition text-xs ${
              highlightAcFuses
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sorot Sekring AC ❄</span>
          </button>

          <DiagramZoomControls
            zoom={zoom}
            onZoomIn={() => setZoom(z => Math.min(2.5, z + 0.15))}
            onZoomOut={() => setZoom(z => Math.max(0.6, z - 0.15))}
            onReset={() => setZoom(1)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        </div>

      </div>

      {/* Interactive Fuse Box Physical Layout Canvas */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden schematic-grid">
        
        {/* Canvas Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4 border-b border-slate-800 pb-2">
          <span className="font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Tata Letak Soket Sekring (Socket Block Physical Layout)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Klik sekring untuk informasi detail &amp; proteksi sirkuit
          </span>
        </div>

        {/* Zoomed Container */}
        <div
          className="transition-transform duration-150 origin-top-left overflow-x-auto py-2"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          {/* Fuse Box Enclosure */}
          <div className="inline-block min-w-[580px] bg-slate-900/90 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl relative">
            
            {/* Box Label Emblem */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  FUSE &amp; RELAY BLOCK - {activeBox}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                OEM DOC: {vehicle.sourceDocument.docNumber}
              </span>
            </div>

            {/* Grid of Fuses */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {filteredFuses.map(fuse => {
                const isAc = fuse.category === 'AC' || fuse.nameOem.includes('A/C') || fuse.nameOem.includes('COMP');
                const isHighlighted = highlightAcFuses && isAc;

                return (
                  <button
                    key={fuse.id}
                    onClick={() => onSelectItem({ type: 'FUSE', data: fuse, vehicle })}
                    className={`relative p-3 rounded-xl border flex flex-col justify-between items-center text-center transition group active:scale-95 ${
                      isHighlighted
                        ? 'bg-blue-950/60 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-900/40'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Fuse Ampere Color Bar */}
                    <div
                      className="w-full h-2 rounded-full mb-2 shadow-sm"
                      style={{ backgroundColor: fuse.ratingColor }}
                    />

                    {/* Ampere rating text */}
                    <span className="text-base font-black font-mono text-white tracking-tight">
                      {fuse.amperage}A
                    </span>

                    {/* OEM Code */}
                    <span className="text-[10px] font-mono font-bold text-cyan-300 mt-0.5 truncate w-full">
                      {fuse.nameOem}
                    </span>

                    {/* Indonesian Subtitle */}
                    <span className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                      {fuse.nameId}
                    </span>

                    {/* Snowflake icon badge for AC */}
                    {isAc && (
                      <span className="absolute top-1.5 right-1.5 text-cyan-400">
                        <Snowflake className="w-3 h-3" />
                      </span>
                    )}

                    {/* Fuse Blade Terminals visual bottom indicator */}
                    <div className="flex gap-1.5 mt-2">
                      <div className="w-1.5 h-2 bg-slate-500 rounded-sm" />
                      <div className="w-1.5 h-2 bg-slate-500 rounded-sm" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Empty check */}
            {filteredFuses.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                Tidak ada sekring yang cocok dengan pencarian "{searchFuse}".
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Fuse Specification Table (Requirement B) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          Daftar Spesifikasi &amp; Fungsi Sekring ({boxFuses.length} Posisi)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Kode</th>
                <th className="py-2.5 px-3">Ampere</th>
                <th className="py-2.5 px-3">Nama OEM</th>
                <th className="py-2.5 px-3">Nama Indonesia</th>
                <th className="py-2.5 px-3">Fungsi Sirkuit &amp; Komponen yang Dilindungi</th>
                <th className="py-2.5 px-3">Warna Kabel</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {boxFuses.map(fuse => {
                const isAc = fuse.category === 'AC';
                return (
                  <tr
                    key={fuse.id}
                    className={`hover:bg-slate-800/40 transition cursor-pointer ${
                      isAc ? 'bg-blue-950/20' : ''
                    }`}
                    onClick={() => onSelectItem({ type: 'FUSE', data: fuse, vehicle })}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-white">{fuse.code}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: fuse.ratingColor }}
                        />
                        <span className="font-mono font-bold text-slate-200">{fuse.amperage}A</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300 font-semibold">{fuse.nameOem}</td>
                    <td className="py-2.5 px-3 text-slate-200 font-medium">{fuse.nameId}</td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs">
                      <div>{fuse.functionDesc}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Melindungi: {fuse.protectedComponents.join(', ')}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300 text-[11px]">{fuse.wireColorOem || '-'}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem({ type: 'FUSE', data: fuse, vehicle });
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
