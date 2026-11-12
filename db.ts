import { VehicleModel, Region, FuelType, VerificationStatus } from '../types/automotive';
import { INITIAL_VEHICLES } from '../data/initialVehicles';

const DB_STORAGE_KEY = 'gun_ac_database_v2';
const DB_VERSION_KEY = 'gun_ac_meta_version';
const ACTIVE_VEHICLE_KEY = 'gun_ac_active_vehicle_id';
const FAVORITES_STORAGE_KEY = 'gun_ac_favorites_v1';
const SEARCH_HISTORY_KEY = 'gun_ac_search_history_v1';

export class VehicleDatabaseService {
  private static instance: VehicleDatabaseService;
  private vehicles: VehicleModel[] = [];
  private activeVehicleId: string = 'toyota-avanza-2nrve';
  private favorites: Set<string> = new Set();
  private searchHistory: string[] = [];
  private listeners: Array<() => void> = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): VehicleDatabaseService {
    if (!VehicleDatabaseService.instance) {
      VehicleDatabaseService.instance = new VehicleDatabaseService();
    }
    return VehicleDatabaseService.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  private loadFromStorage(): void {
    try {
      // Load favorites
      const storedFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavs) {
        try {
          const parsedFavs = JSON.parse(storedFavs);
          if (Array.isArray(parsedFavs)) {
            this.favorites = new Set(parsedFavs);
          }
        } catch {
          this.favorites = new Set();
        }
      }

      // Load search history
      const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (storedHistory) {
        try {
          const parsedHist = JSON.parse(storedHistory);
          if (Array.isArray(parsedHist)) {
            this.searchHistory = parsedHist.slice(0, 15);
          }
        } catch {
          this.searchHistory = [];
        }
      }

      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with INITIAL_VEHICLES so newly released models are never missed
          const existingMap = new Map<string, VehicleModel>();
          parsed.forEach((v: VehicleModel) => existingMap.set(v.id, v));
          
          INITIAL_VEHICLES.forEach(initV => {
            if (!existingMap.has(initV.id)) {
              existingMap.set(initV.id, initV);
            }
          });
          this.vehicles = Array.from(existingMap.values());
        } else {
          this.vehicles = [...INITIAL_VEHICLES];
        }
      } else {
        this.vehicles = [...INITIAL_VEHICLES];
      }
      this.saveToStorage();

      const activeId = localStorage.getItem(ACTIVE_VEHICLE_KEY);
      if (activeId && this.vehicles.some(v => v.id === activeId)) {
        this.activeVehicleId = activeId;
      } else {
        this.activeVehicleId = this.vehicles[0]?.id || 'toyota-avanza-2nrve';
      }
    } catch (e) {
      console.warn('Failed to load from storage, using initial data:', e);
      this.vehicles = [...INITIAL_VEHICLES];
      this.activeVehicleId = this.vehicles[0]?.id || 'toyota-avanza-2nrve';
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.vehicles));
      localStorage.setItem(DB_VERSION_KEY, new Date().toISOString());
      localStorage.setItem(ACTIVE_VEHICLE_KEY, this.activeVehicleId);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(this.favorites)));
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(this.searchHistory));
    } catch (e) {
      console.error('Error saving database to localStorage:', e);
    }
    this.notify();
  }

  public getAllVehicles(): VehicleModel[] {
    return this.vehicles;
  }

  public getVehicleById(id: string): VehicleModel | undefined {
    return this.vehicles.find(v => v.id === id);
  }

  public getActiveVehicle(): VehicleModel {
    const v = this.vehicles.find(item => item.id === this.activeVehicleId);
    if (v) return v;
    return this.vehicles[0] || INITIAL_VEHICLES[0];
  }

  public setActiveVehicle(id: string): void {
    if (this.vehicles.some(v => v.id === id)) {
      this.activeVehicleId = id;
      try {
        localStorage.setItem(ACTIVE_VEHICLE_KEY, id);
      } catch {
        // ignore
      }
      this.notify();
    }
  }

  // --- FAVORITES MANAGEMENT ---
  public isFavorite(id: string): boolean {
    return this.favorites.has(id);
  }

  public toggleFavorite(id: string): boolean {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
    this.saveToStorage();
    return this.favorites.has(id);
  }

  public getFavoriteIds(): string[] {
    return Array.from(this.favorites);
  }

  public getFavoriteVehicles(): VehicleModel[] {
    return this.vehicles.filter(v => this.favorites.has(v.id));
  }

  // --- SEARCH HISTORY MANAGEMENT ---
  public getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  public addSearchHistory(term: string): void {
    const clean = term.trim();
    if (!clean || clean.length < 2) return;
    // Remove if already exists to push to front
    const filtered = this.searchHistory.filter(item => item.toLowerCase() !== clean.toLowerCase());
    this.searchHistory = [clean, ...filtered].slice(0, 15);
    this.saveToStorage();
  }

  public clearSearchHistory(): void {
    this.searchHistory = [];
    this.saveToStorage();
  }

  public addVehicle(vehicle: VehicleModel): void {
    this.vehicles = [vehicle, ...this.vehicles];
    this.saveToStorage();
  }

  public updateVehicle(id: string, updated: Partial<VehicleModel>): void {
    this.vehicles = this.vehicles.map(v => {
      if (v.id === id) {
        return {
          ...v,
          ...updated,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      return v;
    });
    this.saveToStorage();
  }

  public deleteVehicle(id: string): boolean {
    if (this.vehicles.length <= 1) {
      return false; // prevent deleting all vehicles
    }
    this.vehicles = this.vehicles.filter(v => v.id !== id);
    if (this.activeVehicleId === id) {
      this.activeVehicleId = this.vehicles[0].id;
    }
    this.saveToStorage();
    return true;
  }

  public resetToFactoryOEM(): void {
    this.vehicles = [...INITIAL_VEHICLES];
    this.activeVehicleId = this.vehicles[0].id;
    this.saveToStorage();
  }

  public exportDatabaseJson(): string {
    return JSON.stringify(
      {
        appName: 'GUN AC – FUSE, RELAY & WIRING DIAGRAM',
        exportDate: new Date().toISOString(),
        totalVehicles: this.vehicles.length,
        vehicles: this.vehicles,
      },
      null,
      2
    );
  }

  public importDatabaseJson(jsonString: string): { success: boolean; message: string; count?: number } {
    try {
      const data = JSON.parse(jsonString);
      let incomingList: VehicleModel[] = [];

      if (Array.isArray(data)) {
        incomingList = data;
      } else if (data && Array.isArray(data.vehicles)) {
        incomingList = data.vehicles;
      } else {
        return { success: false, message: 'Format file JSON tidak valid. Struktur array kendaraan tidak ditemukan.' };
      }

      // Basic validation
      const valid = incomingList.filter(v => v.id && v.brand && v.model);
      if (valid.length === 0) {
        return { success: false, message: 'Tidak ada data kendaraan yang valid di dalam file JSON.' };
      }

      this.vehicles = valid;
      this.activeVehicleId = valid[0].id;
      this.saveToStorage();
      return { success: true, message: `Berhasil mengimpor ${valid.length} kendaraan ke database.`, count: valid.length };
    } catch (e: any) {
      return { success: false, message: `Gagal membaca file JSON: ${e?.message || 'Error tidak diketahui'}` };
    }
  }

  public getLastSyncDate(): string {
    try {
      const date = localStorage.getItem(DB_VERSION_KEY);
      if (date) {
        const d = new Date(date);
        return d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch {
      // ignore
    }
    return '11 November 2026';
  }

  public search(query: string): Array<{
    vehicle: VehicleModel;
    matchType: 'FUSE' | 'RELAY' | 'COMPONENT' | 'WIRE' | 'VEHICLE';
    item: any;
    details: string;
  }> {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const results: Array<{
      vehicle: VehicleModel;
      matchType: 'FUSE' | 'RELAY' | 'COMPONENT' | 'WIRE' | 'VEHICLE';
      item: any;
      details: string;
    }> = [];

    this.vehicles.forEach(vehicle => {
      // Check vehicle name/brand/model/engine
      if (
        vehicle.brand.toLowerCase().includes(q) ||
        vehicle.model.toLowerCase().includes(q) ||
        vehicle.engineCode.toLowerCase().includes(q) ||
        vehicle.variant.toLowerCase().includes(q)
      ) {
        results.push({
          vehicle,
          matchType: 'VEHICLE',
          item: vehicle,
          details: `${vehicle.brand} ${vehicle.model} - ${vehicle.engineCode}`,
        });
      }

      // Check fuses
      vehicle.fuses.forEach(fuse => {
        if (
          fuse.code.toLowerCase().includes(q) ||
          fuse.nameOem.toLowerCase().includes(q) ||
          fuse.nameId.toLowerCase().includes(q) ||
          fuse.amperage.toString() === q ||
          fuse.functionDesc.toLowerCase().includes(q) ||
          fuse.protectedComponents.some(c => c.toLowerCase().includes(q))
        ) {
          results.push({
            vehicle,
            matchType: 'FUSE',
            item: fuse,
            details: `Sekring ${fuse.code} (${fuse.amperage}A) - ${fuse.nameId}`,
          });
        }
      });

      // Check relays
      vehicle.relays.forEach(relay => {
        if (
          relay.code.toLowerCase().includes(q) ||
          relay.nameOem.toLowerCase().includes(q) ||
          relay.nameId.toLowerCase().includes(q) ||
          relay.functionDesc.toLowerCase().includes(q) ||
          relay.terminals.some(t => t.nameId.toLowerCase().includes(q) || t.connectedTo.toLowerCase().includes(q))
        ) {
          results.push({
            vehicle,
            matchType: 'RELAY',
            item: relay,
            details: `Relay ${relay.code} - ${relay.nameId}`,
          });
        }
      });

      // Check AC diagram nodes
      vehicle.acDiagram?.nodes?.forEach(node => {
        if (
          node.labelId.toLowerCase().includes(q) ||
          node.labelOem.toLowerCase().includes(q) ||
          node.description.toLowerCase().includes(q) ||
          (node.partNumber && node.partNumber.toLowerCase().includes(q))
        ) {
          results.push({
            vehicle,
            matchType: 'COMPONENT',
            item: node,
            details: `Komponen AC: ${node.labelId} (${node.labelOem})`,
          });
        }
      });

      // Check wires
      vehicle.acDiagram?.wires?.forEach(wire => {
        if (
          wire.oemWireColor.toLowerCase().includes(q) ||
          wire.oemWireColorName.toLowerCase().includes(q) ||
          wire.description.toLowerCase().includes(q)
        ) {
          results.push({
            vehicle,
            matchType: 'WIRE',
            item: wire,
            details: `Jalur Kabel OEM ${wire.oemWireColor}: ${wire.oemWireColorName}`,
          });
        }
      });
    });

    return results;
  }
}

export const db = VehicleDatabaseService.getInstance();
