import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Eye, EyeOff, Snowflake, Zap, Layers } from 'lucide-react';

interface DiagramZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  // Overlays (Feature F)
  showAcOverlay?: boolean;
  onToggleAcOverlay?: () => void;
  showHvOverlay?: boolean;
  onToggleHvOverlay?: () => void;
  showControlOverlay?: boolean;
  onToggleControlOverlay?: () => void;
  isEvDiagram?: boolean;
}

export const DiagramZoomControls: React.FC<DiagramZoomControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  isFullscreen,
  onToggleFullscreen,
  showAcOverlay,
  onToggleAcOverlay,
  showHvOverlay,
  onToggleHvOverlay,
  showControlOverlay,
  onToggleControlOverlay,
  isEvDiagram = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/95 border border-slate-800 rounded-xl shadow-lg backdrop-blur text-xs">
      
      {/* Zoom Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onZoomOut}
          disabled={zoom <= 0.6}
          title="Perkecil (-)"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="font-mono text-slate-300 w-12 text-center font-medium">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          disabled={zoom >= 2.5}
          title="Perbesar (+)"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onReset}
          title="Reset Skala"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition ml-0.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition ml-0.5"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Layer / Overlay Toggles (Feature F: Penanda Warna Khusus) */}
      {(onToggleAcOverlay || onToggleHvOverlay || onToggleControlOverlay) && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] text-slate-400 hidden sm:inline mr-1 font-medium">Overlay OEM:</span>
          
          {onToggleAcOverlay && (
            <button
              onClick={onToggleAcOverlay}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-medium text-[11px] ${
                showAcOverlay
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm shadow-blue-500/10'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <Snowflake className="w-3 h-3 text-cyan-400" />
              <span>❄ Jalur AC</span>
            </button>
          )}

          {isEvDiagram && onToggleHvOverlay && (
            <button
              onClick={onToggleHvOverlay}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-medium text-[11px] ${
                showHvOverlay
                  ? 'bg-orange-600/30 text-orange-300 border border-orange-500/50 shadow-sm shadow-orange-500/10'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3 h-3 text-orange-400" />
              <span>HV Jalur Kompresor</span>
            </button>
          )}

          {onToggleControlOverlay && (
            <button
              onClick={onToggleControlOverlay}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-medium text-[11px] ${
                showControlOverlay
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Kontrol LV</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
