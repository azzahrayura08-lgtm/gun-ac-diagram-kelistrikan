import React, { useState } from 'react';
import { VehicleModel, Region, FuelType, VerificationStatus } from '../types/automotive';
import { db } from '../services/db';
import { X, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { FUSE_COLORS } from '../data/fuseColors';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newVehicle: VehicleModel) => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [generation, setGeneration] = useState('');
  const [yearStart, setYearStart] = useState('2022');
  const [yearEnd, setYearEnd] = useState('Present');
  const [country, setCountry] = useState<Region>('JEPANG');
  const [fuelType, setFuelType] = useState<FuelType>('GASOLINE');
  const [engineCode, setEngineCode] = useState('');
  const [transmission, setTransmission] = useState('Otomatis / Manual');
  const [variant, setVariant] = useState('Standard');
  const [docName, setDocName] = useState('OEM Service Manual');
  const [docNumber, setDocNumber] = useState('OEM-MANUAL-2024');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('BELUM TERVERIFIKASI');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !engineCode) {
      alert('Harap isi merek, model, dan kode mesin!');
      return;
    }

    const id = `${brand.toLowerCase().replace(/\s+/g, '-')}-${model.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const isEv = fuelType === 'BEV' || fuelType === 'HEV' || fuelType === 'PHEV';

    const newVehicle: VehicleModel = {
      id,
      brand,
      model,
      generation: generation || 'Generasi Baru',
      yearStart: parseInt(yearStart) || 2022,
      yearEnd: yearEnd === 'Present' ? 'Present' : parseInt(yearEnd) || 'Present',
      country,
      fuelType,
      engineCode,
      transmission,
      variant: variant || 'Standard Varian',
      verificationStatus,
      sourceDocument: {
        docName: docName || 'OEM Workshop Manual',
        docNumber: docNumber || 'EWD-REF-01',
        publisher: `${brand} Motor Corporation Technical Documentation`,
        publishYear: '2024',
        pagesRef: 'Wiring Diagram Section A/C & Relay Block',
        documentType: 'OEM_SERVICE_MANUAL',
      },
      lastUpdated: new Date().toISOString().split('T')[0],
      hasEngineBayFuses: true,
      hasCabinFuses: true,
      hasRelays: true,
      hasAcSchematic: !isEv,
      hasEvAcSchematic: isEv,
      fuses: [
        {
          id: `${id}-f01`,
          boxLocation: isEv ? 'PDU_HV' : 'ENGINE_BAY',
          code: 'F01 (10A)',
          nameOem: isEv ? 'HV COMPRESSOR FUSE' : 'A/C COMP 10A',
          nameId: isEv ? 'Sekring Kompresor AC Elektrik HV' : 'Sekring Kopling Kompresor AC',
          amperage: isEv ? 30 : 10,
          ratingColor: isEv ? FUSE_COLORS[30] : FUSE_COLORS[10],
          category: isEv ? 'HV_SYSTEM' : 'AC',
          functionDesc: 'Melindungi sirkuit daya kompresor pendingin udara.',
          protectedComponents: [isEv ? 'Electric Inverter Compressor' : 'Magnetic Clutch Solenoid'],
          gridPos: { x: 1, y: 1 },
          wireColorOem: isEv ? 'ORANGE (HV)' : 'L-W (Biru Putih)',
        },
        {
          id: `${id}-f02`,
          boxLocation: 'CABIN',
          code: 'F02 (30A)',
          nameOem: 'BLOWER 30A',
          nameId: 'Sekring Motor Blower Kabin',
          amperage: 30,
          ratingColor: FUSE_COLORS[30],
          category: 'AC',
          functionDesc: 'Menyuplai daya motor blower sirkulasi kabin.',
          protectedComponents: ['Cabin Blower Motor'],
          gridPos: { x: 1, y: 1 },
          wireColorOem: 'L-B (Biru Hitam)',
        },
      ],
      relays: [
        {
          id: `${id}-r01`,
          boxLocation: 'ENGINE_BAY',
          code: 'MG CLT',
          nameOem: 'A/C RELAY',
          nameId: 'Relay Kompresor AC',
          relayType: '4-PIN SPST',
          terminals: [
            { pinNumber: '1', standardPin: '85', nameId: 'Kontrol ECM (-)', wireColorOem: 'B-W', connectedTo: 'Engine/Thermal Controller' },
            { pinNumber: '2', standardPin: '86', nameId: 'Daya Koil (+)', wireColorOem: 'G-Y', connectedTo: 'A/C Switch 12V' },
            { pinNumber: '3', standardPin: '30', nameId: 'Input Baterai', wireColorOem: 'W-B', connectedTo: 'Sekring 10A' },
            { pinNumber: '5', standardPin: '87', nameId: 'Output Beban', wireColorOem: 'L-W', connectedTo: 'Kompresor AC' },
          ],
          coilResistance: '120 - 150 Ω',
          contactRating: '20A / 14VDC',
          relatedComponents: ['Kompresor AC'],
          gridPos: { x: 1, y: 1, w: 2, h: 2 },
          functionDesc: 'Menghubungkan arus daya ke sistem pendingin.',
        },
      ],
      acDiagram: {
        systemType: isEv ? 'ELECTRIC_BEV_HEV' : 'CONVENTIONAL_ICE',
        title: `Diagram Kelistrikan AC ${brand} ${model}`,
        refrigerantType: isEv ? 'R1234yf' : 'R134a',
        oilType: isEv ? 'ND-OIL 11 (POE Non-Conductive)' : 'ND-OIL 8 (PAG 46)',
        chargeCapacity: '500 ± 25 gram',
        nodes: [
          {
            id: `${id}-n-bat`,
            labelId: isEv ? 'Baterai Traksi Tegangan Tinggi' : 'Baterai Aki 12V',
            labelOem: isEv ? 'HIGH VOLTAGE BATTERY' : '12V AUXILIARY BATTERY',
            category: isEv ? 'HV_COMPONENT' : 'POWER',
            location: isEv ? 'Underfloor Sasis' : 'Ruang Mesin',
            isAcComponent: false,
            isHighVoltage: isEv,
            description: 'Sumber daya utama penggerak.',
            x: 40,
            y: 70,
          },
          {
            id: `${id}-n-comp`,
            labelId: isEv ? 'Kompresor Elektrik Scroll Inverter' : 'Kompresor AC Konvensional',
            labelOem: isEv ? 'ELECTRIC INVERTER COMPRESSOR' : 'RECIPROCATING A/C COMPRESSOR',
            category: isEv ? 'HV_COMPONENT' : 'ACTUATOR',
            location: 'Kompartemen Mesin',
            isAcComponent: true,
            isHighVoltage: isEv,
            description: 'Unit pompa sirkulasi refrigeran.',
            x: 350,
            y: 70,
          },
        ],
        wires: [
          {
            id: `${id}-w01`,
            fromNodeId: `${id}-n-bat`,
            toNodeId: `${id}-n-comp`,
            oemWireColor: isEv ? 'ORANGE (HV)' : 'L-W',
            oemWireColorName: isEv ? 'Oranye Berpelindung HV' : 'Biru Garis Putih',
            circuitType: isEv ? 'HV_POWER' : 'AC_CABIN',
            description: 'Daya penggerak kompresor.',
          },
        ],
        operationalSteps: [
          '1. Tombol AC diaktifkan oleh pengemudi.',
          '2. Modul kontrol memverifikasi sensor tekanan dan temperatur.',
          '3. Arus listrik mengalir untuk memutar kompresor AC.',
        ],
        troubleshootingChecklist: [
          {
            symptom: 'AC tidak bekerja.',
            probableCause: 'Sekring putus atau tekanan refrigeran kosong.',
            checkPoints: 'Periksa sekring F01 dan ukur tekanan freon dengan manifold gauge.',
          },
        ],
      },
    };

    db.addVehicle(newVehicle);
    onSuccess(newVehicle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              Tambah Model Kendaraan Baru
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Masukkan spesifikasi teknis dan dokumen manual sumber OEM.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Merek Pabrikan *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Contoh: Toyota, Honda, Hyundai, BYD"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Model Kendaraan *</label>
              <input
                type="text"
                required
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="Contoh: Yaris Cross, Ioniq 6, Atto 3"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Asal Wilayah</label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value as Region)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="JEPANG">Jepang</option>
                <option value="KOREA">Korea</option>
                <option value="EROPA">Eropa</option>
                <option value="AMERIKA">Amerika</option>
                <option value="CHINA">China</option>
                <option value="INDIA">India</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tipe Powertrain *</label>
              <select
                value={fuelType}
                onChange={e => setFuelType(e.target.value as FuelType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-bold"
              >
                <option value="GASOLINE">1. Mobil Bensin (ICE)</option>
                <option value="DIESEL">2. Mobil Diesel (CRDi)</option>
                <option value="HEV">3. Mobil Hybrid (HEV)</option>
                <option value="PHEV">4. Plug-in Hybrid (PHEV)</option>
                <option value="BEV">5. Mobil Listrik Murni (BEV)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kode Mesin *</label>
              <input
                type="text"
                required
                value={engineCode}
                onChange={e => setEngineCode(e.target.value)}
                placeholder="2NR-FE / TZ200"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tahun Mulai</label>
              <input
                type="number"
                value={yearStart}
                onChange={e => setYearStart(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tahun Selesai</label>
              <input
                type="text"
                value={yearEnd}
                onChange={e => setYearEnd(e.target.value)}
                placeholder="Present / 2024"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Generasi / Platform</label>
              <input
                type="text"
                value={generation}
                onChange={e => setGeneration(e.target.value)}
                placeholder="Gen 3 / Platform DNGA"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Varian Kendaraan</label>
              <input
                type="text"
                value={variant}
                onChange={e => setVariant(e.target.value)}
                placeholder="1.5 GR Sport / Long Range"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-2">
            <span className="text-cyan-400 font-semibold block text-xs">Informasi Dokumen Manual OEM:</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Nama Manual Dokumen</label>
                <input
                  type="text"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="Toyota Repair Manual EWD"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Nomor Dokumen OEM</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={e => setDocNumber(e.target.value)}
                  placeholder="RM-2024-001"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Status Verifikasi Data (Sesuai Aturan Butir H)</label>
              <select
                value={verificationStatus}
                onChange={e => setVerificationStatus(e.target.value as VerificationStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono font-bold"
              >
                <option value="TERVERIFIKASI">1. TERVERIFIKASI (Sesuai Manual OEM Asli)</option>
                <option value="BELUM TERVERIFIKASI">2. BELUM TERVERIFIKASI (Draft)</option>
                <option value="DATA BELUM TERSEDIA">3. DATA BELUM TERSEDIA</option>
                <option value="DEMO">4. DEMO (Data Uji Coba Fungsi)</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-950/40"
            >
              Simpan ke Database
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
