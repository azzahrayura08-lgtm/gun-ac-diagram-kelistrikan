import React from 'react';
import { X, FileText, Cpu, MapPin, Zap, CheckCircle2, Bookmark } from 'lucide-react';
import { FuseItem, RelayItem, SchematicNode, SchematicWire, VehicleModel } from '../types/automotive';

export interface SelectedDetailItem {
  type: 'FUSE' | 'RELAY' | 'NODE' | 'WIRE';
  data: FuseItem | RelayItem | SchematicNode | SchematicWire;
  vehicle: VehicleModel;
}

interface ComponentDetailModalProps {
  item: SelectedDetailItem | null;
  onClose: () => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const { type, data, vehicle } = item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-5 text-slate-100">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 font-semibold uppercase">
                {type === 'FUSE' ? 'Detail Sekring' : type === 'RELAY' ? 'Detail Relay' : type === 'NODE' ? 'Komponen Sistem' : 'Jalur Pengkabelan OEM'}
              </span>
              <span className="text-[11px] text-slate-400">
                {vehicle.brand} {vehicle.model} ({vehicle.generation})
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {type === 'FUSE' ? (data as FuseItem).nameId :
               type === 'RELAY' ? (data as RelayItem).nameId :
               type === 'NODE' ? (data as SchematicNode).labelId :
               `Jalur Kabel OEM ${(data as SchematicWire).oemWireColor}`}
            </h3>
            <p className="text-xs font-mono text-cyan-300 mt-0.5">
              OEM: {type === 'FUSE' ? (data as FuseItem).nameOem :
                    type === 'RELAY' ? (data as RelayItem).nameOem :
                    type === 'NODE' ? (data as SchematicNode).labelOem :
                    (data as SchematicWire).oemWireColorName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="mt-4 space-y-3.5 text-xs sm:text-sm">
          
          {/* FUSE DETAIL */}
          {type === 'FUSE' && (() => {
            const fuse = data as FuseItem;
            return (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Kapasitas Ampere</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 inline-block"
                        style={{ backgroundColor: fuse.ratingColor }}
                      />
                      <span className="text-base font-bold font-mono text-white">{fuse.amperage}A</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Kode / Lokasi Kotak</span>
                    <span className="text-sm font-semibold font-mono text-white mt-1 block">
                      {fuse.code} ({fuse.boxLocation === 'ENGINE_BAY' ? 'Ruang Mesin' : fuse.boxLocation === 'CABIN' ? 'Kabin' : fuse.boxLocation === 'PDU_HV' ? 'PDU High Voltage' : 'Bagasi'})
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1 font-semibold">Fungsi Teknis:</span>
                  <p className="text-slate-200 leading-relaxed text-xs">{fuse.functionDesc}</p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">Komponen yang Dilindungi:</span>
                  <ul className="space-y-1">
                    {fuse.protectedComponents.map((c, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {fuse.wireColorOem && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Warna Kabel OEM & Pin:</span>
                    <span className="font-mono text-xs text-amber-300 mt-0.5 block">{fuse.wireColorOem} {fuse.terminalPin ? `· ${fuse.terminalPin}` : ''}</span>
                  </div>
                )}
              </>
            );
          })()}

          {/* RELAY DETAIL */}
          {type === 'RELAY' && (() => {
            const relay = data as RelayItem;
            return (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Tipe Relay</span>
                    <span className="text-xs font-bold font-mono text-cyan-300 mt-1 block">{relay.relayType}</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Tahanan Koil / Rating</span>
                    <span className="text-xs font-mono text-slate-200 mt-1 block">{relay.coilResistance} ({relay.contactRating})</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1 font-semibold">Fungsi Relay:</span>
                  <p className="text-slate-200 text-xs leading-relaxed">{relay.functionDesc}</p>
                </div>

                {/* Terminals Table */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-2 font-semibold">Susunan Terminal & Pinout OEM:</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="pb-1.5 font-medium">Pin</th>
                          <th className="pb-1.5 font-medium">DIN</th>
                          <th className="pb-1.5 font-medium">Fungsi Sirkuit</th>
                          <th className="pb-1.5 font-medium">Warna OEM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {relay.terminals.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="py-1 font-mono font-bold text-cyan-400">{t.pinNumber}</td>
                            <td className="py-1 font-mono text-slate-300">{t.standardDin}</td>
                            <td className="py-1 text-slate-200">{t.nameId}</td>
                            <td className="py-1 font-mono text-amber-300 text-[11px]">{t.wireColorOem}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            );
          })()}

          {/* SCHEMATIC NODE DETAIL */}
          {type === 'NODE' && (() => {
            const node = data as SchematicNode;
            return (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Kategori</span>
                    <span className="text-xs font-bold font-mono text-cyan-300 mt-1 block">{node.category}</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Level Tegangan</span>
                    <span className={`text-xs font-mono font-bold mt-1 block ${node.isHighVoltage ? 'text-orange-400' : 'text-slate-200'}`}>
                      {node.voltageRating || (node.isHighVoltage ? 'High Voltage' : '12V DC')}
                    </span>
                  </div>
                </div>

                {node.partNumber && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Nomor Komponen OEM (Part Number):</span>
                    <span className="font-mono text-sm font-bold text-amber-400 mt-0.5 block">{node.partNumber}</span>
                  </div>
                )}

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    Lokasi Fisik di Kendaraan:
                  </span>
                  <p className="text-slate-200 text-xs">{node.location}</p>
                </div>

                {node.connectorPin && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1 font-semibold">Nomor Konektor & Pin:</span>
                    <span className="font-mono text-xs text-cyan-300">{node.connectorPin}</span>
                  </div>
                )}

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1 font-semibold">Deskripsi Kerja:</span>
                  <p className="text-slate-200 text-xs leading-relaxed">{node.description}</p>
                </div>
              </>
            );
          })()}

          {/* SCHEMATIC WIRE DETAIL */}
          {type === 'WIRE' && (() => {
            const wire = data as SchematicWire;
            return (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Kode Warna Kabel OEM</span>
                    <span className="text-base font-bold font-mono text-amber-300 mt-0.5 block">{wire.oemWireColor}</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Tipe Sirkuit</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 mt-1 block">{wire.circuitType}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1 font-semibold">Keterangan Warna & Ukuran:</span>
                  <p className="text-slate-200 text-xs font-mono">{wire.oemWireColorName} {wire.gauge ? `· Ukuran: ${wire.gauge}` : ''}</p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1 font-semibold">Fungsi Jalur:</span>
                  <p className="text-slate-200 text-xs leading-relaxed">{wire.description}</p>
                </div>
              </>
            );
          })()}

          {/* SOURCE DOCUMENT AUDIT TRAIL (Mandatory Requirement H) */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-900/40">
            <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-semibold mb-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Sumber Dokumen Manual OEM:</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">{vehicle.sourceDocument.docName} ({vehicle.sourceDocument.docNumber})</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Penerbit: {vehicle.sourceDocument.publisher} · Halaman: {vehicle.sourceDocument.pagesRef}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                vehicle.verificationStatus === 'TERVERIFIKASI' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                vehicle.verificationStatus === 'DEMO' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                STATUS: {vehicle.verificationStatus}
              </span>
              <span className="text-[10px] text-slate-500">
                Update: {vehicle.lastUpdated}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
