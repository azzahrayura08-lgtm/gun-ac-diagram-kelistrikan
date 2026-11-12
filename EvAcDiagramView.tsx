import React, { useState } from 'react';
import { VehicleModel } from '../../types/automotive';
import { DiagramZoomControls } from '../DiagramZoomControls';
import { SelectedDetailItem } from '../ComponentDetailModal';
import { 
  Zap, Snowflake, ShieldAlert, AlertTriangle, Layers, Info, 
  HelpCircle, CheckCircle2, ChevronRight, Activity 
} from 'lucide-react';

interface EvAcDiagramViewProps {
  vehicle: VehicleModel;
  onSelectItem: (item: SelectedDetailItem) => void;
  onOpenHvModal: () => void;
}

export const EvAcDiagramView: React.FC<EvAcDiagramViewProps> = ({
  vehicle,
  onSelectItem,
  onOpenHvModal,
}) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAcOverlay, setShowAcOverlay] = useState(true);
  const [showHvOverlay, setShowHvOverlay] = useState(true);
  const [showControlOverlay, setShowControlOverlay] = useState(true);
  const [activeTab, setActiveTab] = useState<'SCHEMATIC' | 'FLOW' | 'SAFETY'>('SCHEMATIC');

  const acData = vehicle.acDiagram;

  return (
    <div className={`space-y-4 pb-20 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 overflow-y-auto' : ''}`}>
      
      {/* View Header with High Voltage Safety Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800/80 uppercase flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Sistem AC Mobil Listrik / Heat Pump ({vehicle.fuelType})
            </span>
            <span className="text-xs text-slate-400">
              {vehicle.brand} {vehicle.model}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {acData?.title || `Sistem AC Elektrik ${vehicle.brand} ${vehicle.model}`}
          </h1>
        </div>

        {/* High Voltage Safety Trigger Button */}
        <button
          onClick={onOpenHvModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-600/20 border border-orange-500/60 hover:bg-orange-600/30 text-orange-300 transition text-xs font-bold self-start sm:self-auto"
        >
          <ShieldAlert className="w-4 h-4 text-orange-400 animate-pulse" />
          <span>SOP Tegangan Tinggi (HV)</span>
        </button>
      </div>

      {/* Refrigerant & Dielectric Oil Specs Bar */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 block text-[10px]">Tipe Refrigeran:</span>
            <span className="text-cyan-400 font-bold">{acData?.refrigerantType || 'R1234yf'}</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-400 block text-[10px]">Oli Dielektrik Khusus HV:</span>
            <span className="text-amber-300 font-bold">{acData?.oilType || 'POE Non-Conductive'}</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-400 block text-[10px]">Kapasitas Freon:</span>
            <span className="text-white font-bold">{acData?.chargeCapacity || '650g'}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          Ref OEM: <strong className="text-slate-200">{vehicle.sourceDocument.docNumber}</strong>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('SCHEMATIC')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'SCHEMATIC'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Skematik AC Listrik &amp; Heat Pump</span>
        </button>

        <button
          onClick={() => setActiveTab('FLOW')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'FLOW'
              ? 'bg-orange-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Aliran Manajemen Termal &amp; Baterai</span>
        </button>

        <button
          onClick={() => setActiveTab('SAFETY')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'SAFETY'
              ? 'bg-orange-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-orange-400" />
          <span>Protokol Keamanan EV &amp; HVIL</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE ELECTRIC AC SCHEMATIC */}
      {activeTab === 'SCHEMATIC' && (
        <>
          {/* Zoom and Overlay Toolbar with HV overlay support */}
          <DiagramZoomControls
            zoom={zoom}
            onZoomIn={() => setZoom(z => Math.min(2.5, z + 0.15))}
            onZoomOut={() => setZoom(z => Math.max(0.6, z - 0.15))}
            onReset={() => setZoom(1)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            isEvDiagram={true}
            showAcOverlay={showAcOverlay}
            onToggleAcOverlay={() => setShowAcOverlay(!showAcOverlay)}
            showHvOverlay={showHvOverlay}
            onToggleHvOverlay={() => setShowHvOverlay(!showHvOverlay)}
            showControlOverlay={showControlOverlay}
            onToggleControlOverlay={() => setShowControlOverlay(!showControlOverlay)}
          />

          {/* Canvas */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-x-auto schematic-grid min-h-[520px]">
            
            {/* Color Legend for EV (Feature F: Penanda Warna Khusus) */}
            <div className="flex flex-wrap items-center gap-3 text-xs mb-4 p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl">
              <span className="font-semibold text-slate-300 text-[11px]">Overlay Khusus EV:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1.5 rounded bg-orange-500 shadow-sm shadow-orange-500/50" />
                <span className="text-[11px] text-orange-400 font-mono font-bold">[HV] Jalur Tegangan Tinggi Kompresor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1.5 rounded bg-blue-500" />
                <span className="text-[11px] text-blue-300 font-mono">❄ Jalur AC Kabin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1.5 rounded bg-emerald-500" />
                <span className="text-[11px] text-emerald-300 font-mono">Kontrol Tegangan Rendah 12V / LIN</span>
              </div>
            </div>

            {/* Canvas Zoom Container */}
            <div
              className="transition-transform duration-150 origin-top-left"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            >
              <div className="relative min-w-[950px] min-h-[460px] bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
                
                {/* SVG Connections Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {acData?.wires.map(wire => {
                    const fromNode = acData.nodes.find(n => n.id === wire.fromNodeId);
                    const toNode = acData.nodes.find(n => n.id === wire.toNodeId);
                    if (!fromNode || !toNode) return null;

                    // Stroke colors
                    let strokeColor = '#64748b';
                    let strokeWidth = 2.5;

                    if (showHvOverlay && wire.circuitType === 'HV_POWER') {
                      strokeColor = '#f97316'; // Orange High Voltage
                      strokeWidth = 4.5;
                    } else if (showAcOverlay && wire.circuitType === 'AC_CABIN') {
                      strokeColor = '#0ea5e9'; // Blue ❄
                      strokeWidth = 3;
                    } else if (showControlOverlay && wire.circuitType === 'LV_CONTROL') {
                      strokeColor = '#10b981'; // Green LV
                      strokeWidth = 2.5;
                    }

                    const midX = (fromNode.x + 85 + toNode.x + 85) / 2;
                    const midY = (fromNode.y + 40 + toNode.y + 40) / 2;

                    return (
                      <g key={wire.id}>
                        <line
                          x1={fromNode.x + 85}
                          y1={fromNode.y + 40}
                          x2={toNode.x + 85}
                          y2={toNode.y + 40}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                        />
                        {/* Wire label */}
                        <g transform={`translate(${midX - 30}, ${midY - 10})`}>
                          <rect width="60" height="20" rx="4" fill="#020617" stroke={strokeColor} strokeWidth="1" />
                          <text x="30" y="14" fill="#f8fafc" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            {wire.oemWireColor.includes('HV') ? '⚡ ' + wire.oemWireColor : wire.oemWireColor}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes (EV Components) */}
                {acData?.nodes.map(node => {
                  const isHv = node.isHighVoltage;
                  const isAc = node.isAcComponent;

                  return (
                    <div
                      key={node.id}
                      onClick={() => onSelectItem({ type: 'NODE', data: node, vehicle })}
                      style={{ left: `${node.x}px`, top: `${node.y}px` }}
                      className={`absolute w-48 p-3 rounded-xl border text-left transition cursor-pointer select-none shadow-lg active:scale-95 group ${
                        isHv && showHvOverlay
                          ? 'bg-slate-900 border-orange-500 ring-2 ring-orange-500/40 shadow-orange-950/50'
                          : isAc && showAcOverlay
                          ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/40 shadow-blue-950/50'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                          isHv ? 'bg-orange-950 text-orange-400 border border-orange-800' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {isHv ? '⚡ HIGH VOLTAGE' : node.category}
                        </span>
                        {isAc && (
                          <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </div>

                      {/* Node Label */}
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {node.labelId}
                      </div>

                      {/* OEM Label */}
                      <div className="text-[10px] font-mono text-cyan-400 truncate mt-0.5">
                        {node.labelOem}
                      </div>

                      {/* Voltage tag */}
                      {node.voltageRating && (
                        <div className={`text-[9px] font-mono font-bold mt-1 ${isHv ? 'text-orange-400' : 'text-slate-400'}`}>
                          {node.voltageRating}
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            </div>

          </div>

          {/* EV Electrical Harness Connections Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              Daftar Sirkuit Kelistrikan AC &amp; Komunikasi Data EV
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold font-sans">
                    <th className="py-2 px-3">Warna / Kode Kabel</th>
                    <th className="py-2 px-3">Tipe Sirkuit</th>
                    <th className="py-2 px-3">Deskripsi Aliran Daya &amp; Sinyal</th>
                    <th className="py-2 px-3">Spesifikasi Isolasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {acData?.wires.map(wire => (
                    <tr
                      key={wire.id}
                      onClick={() => onSelectItem({ type: 'WIRE', data: wire, vehicle })}
                      className="hover:bg-slate-800/40 cursor-pointer text-xs"
                    >
                      <td className={`py-2 px-3 font-bold ${wire.circuitType === 'HV_POWER' ? 'text-orange-400' : 'text-amber-300'}`}>
                        {wire.oemWireColor}
                      </td>
                      <td className="py-2 px-3 text-cyan-400 font-sans">{wire.circuitType}</td>
                      <td className="py-2 px-3 text-slate-200 font-sans">{wire.description}</td>
                      <td className="py-2 px-3 text-slate-400">{wire.gauge || 'Standard Automotive'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: THERMAL MANAGEMENT & BATTERY CHILLING FLOW */}
      {activeTab === 'FLOW' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Integrasi Manajemen Termal Kabin &amp; Baterai Traksi (Heat Pump)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pada kendaraan listrik modern (seperti platform Hyundai E-GMP, Wuling GSEV, dan Tesla), sistem AC tidak hanya mendinginkan kabin penumpang, tetapi merupakan bagian integral dari sistem pendingin baterai traksi (Battery Chiller) dan pendingin inverter motor listrik.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider font-mono">
                1. Mode Pendinginan Kabin
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kompresor elektrik scroll memompa freon cair bertekanan tinggi menuju Electronic Expansion Valve (Cabin EXV). Udara sejuk dihembuskan oleh blower BLDC ke kabin.
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-bold text-orange-400 block uppercase tracking-wider font-mono">
                2. Mode Pendingin Baterai (Chiller)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Saat mobil melakukan Fast Charging DC 350 kW, katup Battery Chiller Valve membuka saluran freon sekunder untuk mendinginkan cairan pendingin coolant baterai di bawah 32°C.
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <span className="text-xs font-bold text-purple-400 block uppercase tracking-wider font-mono">
                3. Mode Heat Pump Pemanas
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Katup pembalik 3-arah mengalihkan siklus untuk menyerap panas dari motor listrik dan baterai, lalu mentransfer panas tersebut ke kondensor indoor kabin tanpa menghabiskan daya baterai berlebih.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAFETY & HVIL PROTOCOL */}
      {activeTab === 'SAFETY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-3 p-4 bg-orange-950/40 border border-orange-500/50 rounded-xl text-orange-200">
            <ShieldAlert className="w-6 h-6 text-orange-400 shrink-0" />
            <div className="text-xs sm:text-sm">
              <strong>PENTING:</strong> Sistem High Voltage Interlock Loop (HVIL) adalah sirkuit pengaman tingkat pertama. Jika teknisi melepas konektor kompresor AC saat tegangan tinggi masih aktif, tegangan 800V/400V akan memicu busur api (arc flash) yang sangat berbahaya.
            </div>
          </div>

          <h3 className="text-sm font-bold text-white">
            Standar Kerja Bengkel Otomotif untuk AC Mobil Listrik:
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Mesin Pemulihan Freon Khusus EV:</strong> Gunakan unit recovery khusus EV yang bebas dari kontaminasi oli mineral/PAG konvensional.</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Uji Tahanan Isolasi (Megger Test):</strong> Setelah penggantian kompresor AC listrik, ukur isolasi antara terminal HV kompresor dengan ground bodi. Tahanan minimal wajib di atas 100 MegaOhm pada tegangan uji 1000V DC.</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Kepatuhan Oli POE:</strong> Hanya gunakan pelumas kompresor berstandar ND-OIL 11 atau POE dielektrik murni.</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
