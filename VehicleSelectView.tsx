import React, { useState, useEffect } from 'react';
import { VehicleModel, Region, FuelType, VehicleCategory, AcSystemType, ActiveView } from '../../types/automotive';
import { db } from '../../services/db';
import { 
  Search, Filter, Plus, Check, ShieldCheck, AlertCircle, Car, ArrowRight, 
  Zap, Snowflake, Star, Bus, Truck, RotateCcw, Clock, Sparkles, SlidersHorizontal 
} from 'lucide-react';

interface VehicleSelectViewProps {
  vehicles: VehicleModel[];
  activeVehicleId: string;
  onSelectVehicle: (id: string) => void;
  onNavigate: (view: ActiveView) => void;
  onOpenAddModal: () => void;
}

export const VehicleSelectView: React.FC<VehicleSelectViewProps> = ({
  vehicles,
  activeVehicleId,
  onSelectVehicle,
  onNavigate,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFuel, setSelectedFuel] = useState<FuelType | 'ALL'>('ALL');
  const [selectedAcType, setSelectedAcType] = useState<string>('ALL');
  const [selectedVoltage, setSelectedVoltage] = useState<string>('ALL');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Load favorites & search history on mount and on database updates
  useEffect(() => {
    const updateFavs = () => {
      setFavorites(db.getFavoriteIds());
      setSearchHistory(db.getSearchHistory());
    };
    updateFavs();
    return db.subscribe(updateFavs);
  }, []);

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    db.toggleFavorite(id);
    setFavorites(db.getFavoriteIds());
  };

  const handleExecuteSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      db.addSearchHistory(query);
      setSearchHistory(db.getSearchHistory());
    }
  };

  // Distinct Brands
  const availableBrands = Array.from(new Set(vehicles.map(v => v.brand))).sort();

  // Filter logic
  const filteredVehicles = vehicles.filter(v => {
    // Favorites only
    if (showOnlyFavorites && !favorites.includes(v.id)) {
      return false;
    }

    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (q !== '') {
      const matchSearch =
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.engineCode.toLowerCase().includes(q) ||
        v.variant.toLowerCase().includes(q) ||
        (v.generation && v.generation.toLowerCase().includes(q)) ||
        (v.sourceDocument && v.sourceDocument.docNumber.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    // Brand filter
    if (selectedBrand !== 'ALL' && v.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'BUS') {
        const isBus = v.vehicleCategory === 'BIG_BUS' || v.vehicleCategory === 'MEDIUM_BUS' || v.vehicleCategory === 'MICROBUS' || v.vehicleCategory === 'MINIBUS' || v.vehicleCategory === 'DOUBLE_DECKER';
        if (!isBus) return false;
      } else if (selectedCategory === 'TRUCK') {
        const isTruck = v.vehicleCategory === 'LIGHT_TRUCK' || v.vehicleCategory === 'MEDIUM_TRUCK' || v.vehicleCategory === 'HEAVY_TRUCK';
        if (!isTruck) return false;
      } else if (selectedCategory === 'PASSENGER_CAR') {
        if (v.vehicleCategory && v.vehicleCategory !== 'PASSENGER_CAR') return false;
      } else if (v.vehicleCategory !== selectedCategory) {
        return false;
      }
    }

    // Fuel filter
    if (selectedFuel !== 'ALL' && v.fuelType !== selectedFuel) {
      return false;
    }

    // AC Variant filter
    if (selectedAcType !== 'ALL') {
      if (selectedAcType === 'BUS_ROOF' && v.acSystemVariant !== 'BUS_AC_ROOF' && v.acSystemVariant !== 'BUS_AC_SUB_ENGINE') return false;
      if (selectedAcType === 'ELECTRIC' && v.acSystemVariant !== 'ELECTRIC_HVAC' && v.acSystemVariant !== 'HEAT_PUMP') return false;
      if (selectedAcType === 'DOUBLE' && v.acSystemVariant !== 'DOUBLE_AC' && v.acSystemVariant !== 'TRIPLE_AC') return false;
      if (selectedAcType === 'SINGLE' && v.acSystemVariant !== 'SINGLE_AC') return false;
    }

    // Voltage filter
    if (selectedVoltage !== 'ALL') {
      if (selectedVoltage === '24V' && v.electricalSystem !== '24V') return false;
      if (selectedVoltage === '12V' && v.electricalSystem !== '12V') return false;
      if (selectedVoltage === 'HV' && v.electricalSystem !== 'HV_ELECTRIC') return false;
    }

    return true;
  });

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedBrand('ALL');
    setSelectedCategory('ALL');
    setSelectedFuel('ALL');
    setSelectedAcType('ALL');
    setSelectedVoltage('ALL');
    setShowOnlyFavorites(false);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Katalog Kendaraan Global
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              {vehicles.length} Model OEM
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Database resmi sekring, relay, dan kelistrikan AC mobil penumpang, bus komersial, truk berat, hingga mobil listrik OEM.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              showOnlyFavorites
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-950/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
            <span>Favorit ({favorites.length})</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Main Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3.5">
        
        {/* Search input with history */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleExecuteSearch(searchQuery)}
              placeholder="Cari merek, model, kode mesin (contoh: Avanza, Jazz, Canter, OH 1626, Ioniq 5, Air EV, 2GD, J08E)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Search History tags */}
          {searchHistory.length > 0 && !searchQuery && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold whitespace-nowrap">
                <Clock className="w-3 h-3 text-slate-500" /> Riwayat:
              </span>
              {searchHistory.slice(0, 6).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item)}
                  className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-cyan-300 whitespace-nowrap transition"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => {
                  db.clearSearchHistory();
                  setSearchHistory([]);
                }}
                className="text-[10px] text-slate-500 hover:text-rose-400 underline whitespace-nowrap ml-1"
              >
                Hapus
              </button>
            </div>
          )}
        </div>

        {/* Vehicle Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 mr-1 font-semibold whitespace-nowrap">Kategori:</span>
          {[
            { key: 'ALL', label: 'Semua Kategori', icon: Car },
            { key: 'PASSENGER_CAR', label: 'Mobil Penumpang', icon: Car },
            { key: 'BUS', label: 'Bus (Micro/Medium/Big)', icon: Bus },
            { key: 'TRUCK', label: 'Truk (Light/Medium/Heavy)', icon: Truck },
          ].map(cat => {
            const Icon = cat.icon;
            const isSel = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
                  isSel
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Brand Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-800/80 pt-2.5">
          <span className="text-[11px] text-slate-400 mr-1 font-semibold whitespace-nowrap">Merek:</span>
          <button
            onClick={() => setSelectedBrand('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedBrand === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Semua ({vehicles.length})
          </button>
          {availableBrands.map(b => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedBrand === b
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Powertrain / Fuel Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-800/80 pt-2.5">
          <span className="text-[11px] text-slate-400 mr-1 font-semibold whitespace-nowrap">Bahan Bakar:</span>
          {[
            { key: 'ALL', label: 'Semua Tipe' },
            { key: 'GASOLINE', label: 'Bensin' },
            { key: 'DIESEL', label: 'Diesel (Euro 4/5)' },
            { key: 'HEV', label: 'Hybrid (HEV)' },
            { key: 'BEV', label: 'Listrik Murni (BEV)' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setSelectedFuel(f.key as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedFuel === f.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="ml-auto text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 px-2 py-1 rounded bg-slate-800/60"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{showAdvancedFilters ? 'Tutup Filter Detail' : 'Filter AC & Tegangan'}</span>
          </button>
        </div>

        {/* Advanced Filters: AC System & Voltage */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3 rounded-xl">
            {/* AC Variant */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Tipe Sistem AC:</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'ALL', label: 'Semua AC' },
                  { key: 'SINGLE', label: 'Single Blower' },
                  { key: 'DOUBLE', label: 'Double / Triple Zone' },
                  { key: 'BUS_ROOF', label: 'AC Bus Atap 24V' },
                  { key: 'ELECTRIC', label: 'AC Elektrik / Heat Pump' },
                ].map(ac => (
                  <button
                    key={ac.key}
                    onClick={() => setSelectedAcType(ac.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                      selectedAcType === ac.key
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ac.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Electrical System Voltage */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Tegangan Sistem Kelistrikan:</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'ALL', label: 'Semua Tegangan' },
                  { key: '12V', label: '12V DC (Mobil Penumpang)' },
                  { key: '24V', label: '24V DC (Bus & Truk)' },
                  { key: 'HV', label: 'HV 300V-800V (EV / HEV)' },
                ].map(volt => (
                  <button
                    key={volt.key}
                    onClick={() => setSelectedVoltage(volt.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                      selectedVoltage === volt.key
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {volt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Menampilkan <strong className="text-white">{filteredVehicles.length}</strong> model kendaraan</span>
        {(searchQuery || selectedBrand !== 'ALL' || selectedCategory !== 'ALL' || selectedFuel !== 'ALL' || selectedAcType !== 'ALL' || selectedVoltage !== 'ALL' || showOnlyFavorites) && (
          <button
            onClick={resetAllFilters}
            className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filter
          </button>
        )}
      </div>

      {/* Vehicle Grid Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map(vehicle => {
          const isActive = vehicle.id === activeVehicleId;
          const isEv = vehicle.fuelType === 'BEV' || vehicle.fuelType === 'HEV' || vehicle.fuelType === 'PHEV' || vehicle.electricalSystem === 'HV_ELECTRIC';
          const isCommercial = vehicle.electricalSystem === '24V' || vehicle.vehicleCategory?.includes('BUS') || vehicle.vehicleCategory?.includes('TRUCK');
          const isFav = favorites.includes(vehicle.id);

          return (
            <div
              key={vehicle.id}
              className={`relative rounded-2xl border p-5 flex flex-col justify-between transition shadow-lg ${
                isActive
                  ? 'bg-slate-900/90 border-cyan-500/80 shadow-cyan-950/30 ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                
                {/* Header Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                      {vehicle.country}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      vehicle.fuelType === 'BEV' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      vehicle.fuelType === 'HEV' || vehicle.fuelType === 'PHEV' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      vehicle.fuelType === 'DIESEL' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {vehicle.fuelType}
                    </span>
                    {vehicle.electricalSystem && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        vehicle.electricalSystem === '24V' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                        vehicle.electricalSystem === 'HV_ELECTRIC' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {vehicle.electricalSystem}
                      </span>
                    )}
                  </div>

                  {/* Bookmark Star & Status Badge */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={e => handleToggleFavorite(e, vehicle.id)}
                      title={isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      vehicle.verificationStatus === 'TERVERIFIKASI' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      vehicle.verificationStatus === 'DATA BELUM TERSEDIA' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {vehicle.verificationStatus}
                    </span>
                  </div>
                </div>

                {/* Brand & Model Title */}
                <h3 className="text-lg font-black text-white">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-xs text-cyan-400 font-medium">
                  {vehicle.variant} · {vehicle.generation}
                </p>

                {/* Tech Specs */}
                <div className="mt-3 space-y-1 text-xs text-slate-300 border-t border-slate-800/80 pt-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tahun Produksi:</span>
                    <span className="font-mono text-slate-200">{vehicle.yearStart} - {vehicle.yearEnd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mesin / Motor:</span>
                    <span className="font-mono text-cyan-300 font-semibold truncate max-w-[180px] text-right">{vehicle.engineCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transmisi:</span>
                    <span className="text-slate-300 truncate max-w-[180px] text-right">{vehicle.transmission}</span>
                  </div>
                  {vehicle.acDiagram && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Refrigeran & Oli:</span>
                      <span className="font-mono text-[11px] text-blue-300">{vehicle.acDiagram.refrigerantType} · {vehicle.acDiagram.oilType.split(' ')[0]}</span>
                    </div>
                  )}
                </div>

                {/* Document Reference Info */}
                <div className="mt-3 p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
                  <span className="block truncate font-medium text-slate-300">
                    Doc: {vehicle.sourceDocument.docName}
                  </span>
                  <span className="block truncate text-[10px] text-slate-500 font-mono">
                    Ref: {vehicle.sourceDocument.docNumber} {vehicle.sourceDocument.pagesRef ? `· ${vehicle.sourceDocument.pagesRef.slice(0, 35)}...` : ''}
                  </span>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {isActive ? (
                  <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
                    <Check className="w-4 h-4 text-cyan-400" />
                    Sedang Aktif
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectVehicle(vehicle.id)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition"
                  >
                    Pilih Model Ini
                  </button>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onSelectVehicle(vehicle.id);
                      onNavigate('fuse_diagram');
                    }}
                    title="Buka Diagram Kotak Sekring"
                    className="px-2 py-1 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sekring</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectVehicle(vehicle.id);
                      onNavigate(isEv ? 'ev_ac_diagram' : 'ac_diagram');
                    }}
                    title="Buka Diagram Kelistrikan AC"
                    className="px-2 py-1 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AC</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Empty State when no filters match */}
      {filteredVehicles.length === 0 && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Tidak ada kendaraan yang sesuai filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian, ganti filter merek atau powertrain, atau reset semua filter pencarian.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

    </div>
  );
};
