import React, { useState } from 'react';
import { VehicleModel } from '../../types/automotive';
import { DiagramZoomControls } from '../DiagramZoomControls';
import { SelectedDetailItem } from '../ComponentDetailModal';
import { Snowflake, AlertCircle, CheckCircle2, Info, Cpu, Layers, HelpCircle, Zap } from 'lucide-react';

interface AcDiagramViewProps {
  vehicle: VehicleModel;
  onSelectItem: (item: SelectedDetailItem) => void;
}

export const AcDiagramView: React.FC<AcDiagramViewProps> = ({
  vehicle,
  onSelectItem,
}) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAcOverlay, setShowAcOverlay] = useState(true);
  const [showControlOverlay, setShowControlOverlay] = useState(true);
  const [activeStepTab, setActiveStepTab] = useState<'SCHEMATIC' | 'SEQUENCE' | 'TROUBLESHOOTING'>('SCHEMATIC');

  const acData = vehicle.acDiagram;

  if (!acData || acData.nodes.length === 0 || vehicle.verificationStatus === 'DATA BELUM TERSEDIA') {
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
            Diagram AC Konvensional {vehicle.brand} {vehicle.model} Belum Tersedia
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Diagram kelistrikan AC untuk varian ini menunggu validasi dari dokumen manual servis pabrikan asli.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 pb-20 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 overflow-y-auto' : ''}`}>
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 uppercase">
              Diagram Kelistrikan AC Konvensional (OEM)
            </span>
            <span className="text-xs text-slate-400">
              {vehicle.brand} {vehicle.model} ({vehicle.generation})
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {acData.title}
          </h1>
        </div>

        {/* Technical Refrigerant Badge */}
        <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono self-start sm:self-auto">
          <div>
            <span className="text-slate-400 block text-[10px]">Refrigeran:</span>
            <span className="text-cyan-400 font-bold">{acData.refrigerantType}</span>
          </div>
          <div className="border-l border-slate-800 pl-2">
            <span className="text-slate-400 block text-[10px]">Kapasitas Freon:</span>
            <span className="text-white font-bold">{acData.chargeCapacity}</span>
          </div>
          <div className="border-l border-slate-800 pl-2">
            <span className="text-slate-400 block text-[10px]">Oli Kompresor:</span>
            <span className="text-amber-300 font-bold">{acData.oilType}</span>
          </div>
        </div>
      </div>

      {/* Nav Tabs for Schematic vs Sequence vs Troubleshooting */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveStepTab('SCHEMATIC')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeStepTab === 'SCHEMATIC'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Skematik Kelistrikan AC</span>
        </button>

        <button
          onClick={() => setActiveStepTab('SEQUENCE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeStepTab === 'SEQUENCE'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Siklus Operasional (Sequence)</span>
        </button>

        <button
          onClick={() => setActiveStepTab('TROUBLESHOOTING')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeStepTab === 'TROUBLESHOOTING'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Gejala &amp; Panduan Diagnosa</span>
        </button>
      </div>

      {/* TAB 1: SCHEMATIC DIAGRAM VIEW */}
      {activeStepTab === 'SCHEMATIC' && (
        <>
          {/* Zoom and Overlay Toolbar */}
          <DiagramZoomControls
            zoom={zoom}
            onZoomIn={() => setZoom(z => Math.min(2.5, z + 0.15))}
            onZoomOut={() => setZoom(z => Math.max(0.6, z - 0.15))}
            onReset={() => setZoom(1)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            showAcOverlay={showAcOverlay}
            onToggleAcOverlay={() => setShowAcOverlay(!showAcOverlay)}
            showControlOverlay={showControlOverlay}
            onToggleControlOverlay={() => setShowControlOverlay(!showControlOverlay)}
          />

          {/* Interactive Graphic Canvas for AC Schematic */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-x-auto schematic-grid min-h-[500px]">
            
            {/* Color Legend (Feature F) */}
            <div className="flex flex-wrap items-center gap-3 text-xs mb-4 p-2 bg-slate-900/90 border border-slate-800 rounded-xl">
              <span className="font-semibold text-slate-300 text-[11px]">Keterangan Jalur:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1.5 rounded bg-blue-500" />
                <span className="text-[11px] text-blue-300 font-mono">❄ Jalur AC Kabin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1.5 rounded bg-emerald-500" />
                <span className="text-[11px] text-emerald-300 font-mono">Jalur Kontrol LV (12V)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1.5 rounded bg-amber-400" />
                <span className="text-[11px] text-amber-300 font-mono">Arus Baterai (+B / IGN)</span>
              </div>
            </div>

            {/* Canvas with SVG Interactive Schematic */}
            <div
              className="transition-transform duration-150 origin-top-left"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            >
              <div className="relative min-w-[850px] min-h-[440px] bg-slate-900/70 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
                
                {/* SVG Connections Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {acData.wires.map(wire => {
                    const fromNode = acData.nodes.find(n => n.id === wire.fromNodeId);
                    const toNode = acData.nodes.find(n => n.id === wire.toNodeId);
                    if (!fromNode || !toNode) return null;

                    // Determine stroke color based on Overlay or OEM Wire Color
                    let strokeColor = '#64748b'; // default slate
                    let strokeWidth = 2.5;

                    if (showAcOverlay && wire.circuitType === 'AC_CABIN') {
                      strokeColor = '#0ea5e9'; // Blue ❄
                      strokeWidth = 3.5;
                    } else if (showControlOverlay && wire.circuitType === 'LV_CONTROL') {
                      strokeColor = '#10b981'; // Green
                      strokeWidth = 2.5;
                    } else if (wire.circuitType === 'BATTERY_FEED') {
                      strokeColor = '#eab308'; // Amber
                      strokeWidth = 3;
                    }

                    // Calculate midpoint for wire label
                    const midX = (fromNode.x + 80 + toNode.x + 80) / 2;
                    const midY = (fromNode.y + 40 + toNode.y + 40) / 2;

                    return (
                      <g key={wire.id}>
                        {/* Wire path line */}
                        <line
                          x1={fromNode.x + 80}
                          y1={fromNode.y + 40}
                          x2={toNode.x + 80}
                          y2={toNode.y + 40}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                        />
                        {/* Wire label tag (OEM Wire Color) */}
                        <g transform={`translate(${midX - 25}, ${midY - 10})`}>
                          <rect width="50" height="18" rx="4" fill="#020617" stroke={strokeColor} strokeWidth="1" />
                          <text x="25" y="12" fill="#f8fafc" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            {wire.oemWireColor}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes (Components) */}
                {acData.nodes.map(node => {
                  const isHighlighted = node.isAcComponent && showAcOverlay;

                  return (
                    <div
                      key={node.id}
                      onClick={() => onSelectItem({ type: 'NODE', data: node, vehicle })}
                      style={{ left: `${node.x}px`, top: `${node.y}px` }}
                      className={`absolute w-44 p-3 rounded-xl border text-left transition cursor-pointer select-none shadow-lg active:scale-95 group ${
                        isHighlighted
                          ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/40 shadow-blue-950/50'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {/* Node Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                          {node.category}
                        </span>
                        {node.isAcComponent && (
                          <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </div>

                      {/* Node Label */}
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {node.labelId}
                      </div>

                      {/* OEM Subtitle */}
                      <div className="text-[10px] font-mono text-cyan-400 truncate mt-0.5">
                        {node.labelOem}
                      </div>

                      {/* Part Number if available */}
                      {node.partNumber && (
                        <div className="text-[9px] font-mono text-amber-300 mt-1">
                          PN: {node.partNumber}
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            </div>

          </div>

          {/* Wire Connections Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3">
              Daftar Koneksi Kabel &amp; Sirkuit OEM
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2 px-3">Warna OEM</th>
                    <th className="py-2 px-3">Dari Komponen</th>
                    <th className="py-2 px-3">Ke Komponen</th>
                    <th className="py-2 px-3">Tipe Sirkuit</th>
                    <th className="py-2 px-3">Fungsi Aliran Arus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {acData.wires.map(wire => (
                    <tr
                      key={wire.id}
                      onClick={() => onSelectItem({ type: 'WIRE', data: wire, vehicle })}
                      className="hover:bg-slate-800/40 cursor-pointer text-xs"
                    >
                      <td className="py-2 px-3 text-amber-300 font-bold">{wire.oemWireColor}</td>
                      <td className="py-2 px-3 text-slate-300 font-sans">{wire.fromNodeId}</td>
                      <td className="py-2 px-3 text-slate-300 font-sans">{wire.toNodeId}</td>
                      <td className="py-2 px-3 text-cyan-400">{wire.circuitType}</td>
                      <td className="py-2 px-3 text-slate-200 font-sans">{wire.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: OPERATIONAL SEQUENCE */}
      {activeStepTab === 'SEQUENCE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Urutan Siklus Operasional Kelistrikan AC (Sequence of Operation)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Logika terintegrasi saat saklar AC diaktifkan hingga kompresor berputar dan freon bersirkulasi:
          </p>

          <ol className="space-y-3 mt-4">
            {acData.operationalSteps.map((step, idx) => (
              <li key={idx} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 font-bold text-xs shrink-0 border border-cyan-800">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* TAB 3: TROUBLESHOOTING CHECKLIST */}
      {activeStepTab === 'TROUBLESHOOTING' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h3 className="text-base font-bold text-white mb-2">
              Panduan Pemecahan Masalah &amp; Troubleshooting Kelistrikan AC
            </h3>
            <p className="text-xs text-slate-400">
              Pemeriksaan terstruktur berdasarkan gejala kerusakan umum di lapangan:
            </p>
          </div>

          <div className="space-y-3">
            {acData.troubleshootingChecklist.map((item, idx) => (
              <div key={idx} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                  <div>
                    <span className="text-[11px] font-mono text-red-400 font-bold uppercase tracking-wider">
                      Gejala Masalah #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {item.symptom}
                    </h4>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                  <span className="text-slate-400 block font-semibold mb-1">Kemungkinan Penyebab:</span>
                  <p className="text-slate-300">{item.probableCause}</p>
                </div>

                <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-800/40 text-xs">
                  <span className="text-cyan-400 block font-semibold mb-1">Titik Pemeriksaan Teknisi:</span>
                  <p className="text-cyan-200">{item.checkPoints}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
