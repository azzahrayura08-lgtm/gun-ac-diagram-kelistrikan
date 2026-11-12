/**
 * GUN AC – FUSE, RELAY & WIRING DIAGRAM - Main Application Entry
 * Standar Referensi Teknis Otomotif OEM (Bensin, Diesel, HEV, PHEV, BEV)
 */

import React, { useState, useEffect } from 'react';
import { ActiveView, VehicleModel } from './types/automotive';
import { db } from './services/db';
import { usePWAInstall } from './hooks/usePWAInstall';
import { Navbar } from './components/Navbar';
import { BottomTabBar } from './components/BottomTabBar';
import { ComponentDetailModal, SelectedDetailItem } from './components/ComponentDetailModal';
import { HvSafetyModal } from './components/HvSafetyModal';
import { AddVehicleModal } from './components/AddVehicleModal';

// Views
import { HomeView } from './components/views/HomeView';
import { VehicleSelectView } from './components/views/VehicleSelectView';
import { FuseDiagramView } from './components/views/FuseDiagramView';
import { RelayDiagramView } from './components/views/RelayDiagramView';
import { AcDiagramView } from './components/views/AcDiagramView';
import { EvAcDiagramView } from './components/views/EvAcDiagramView';
import { ComponentListView } from './components/views/ComponentListView';
import { SearchView } from './components/views/SearchView';
import { DatabaseManageView } from './components/views/DatabaseManageView';
import { ReferencesView } from './components/views/ReferencesView';
import { UpdateSyncView } from './components/views/UpdateSyncView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [vehicles, setVehicles] = useState<VehicleModel[]>(db.getAllVehicles());
  const [activeVehicle, setActiveVehicle] = useState<VehicleModel>(db.getActiveVehicle());
  const [selectedDetailItem, setSelectedDetailItem] = useState<SelectedDetailItem | null>(null);
  const [showHvSafetyModal, setShowHvSafetyModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // PWA install hook
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Subscribe to DB changes
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      const all = db.getAllVehicles();
      setVehicles([...all]);
      setActiveVehicle(db.getActiveVehicle());
    });
    return () => unsubscribe();
  }, []);

  const handleSelectVehicle = (id: string) => {
    db.setActiveVehicle(id);
    const v = db.getActiveVehicle();
    setActiveVehicle(v);
  };

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto-prompt HV warning on first opening EV diagram if vehicle is BEV/HEV
    if (view === 'ev_ac_diagram') {
      const isEv = activeVehicle.fuelType === 'BEV' || activeVehicle.fuelType === 'HEV' || activeVehicle.fuelType === 'PHEV';
      if (isEv) {
        // Optional gentle alert or open modal if requested
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        activeVehicle={activeVehicle}
        isInstallable={isInstallable && !isInstalled}
        onInstall={install}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        
        {activeView === 'home' && (
          <HomeView
            activeVehicle={activeVehicle}
            onNavigate={handleNavigate}
            allVehicles={vehicles}
            onSelectVehicle={handleSelectVehicle}
            onOpenHvModal={() => setShowHvSafetyModal(true)}
            isInstallable={isInstallable && !isInstalled}
            onInstall={install}
          />
        )}

        {activeView === 'vehicle_select' && (
          <VehicleSelectView
            vehicles={vehicles}
            activeVehicleId={activeVehicle.id}
            onSelectVehicle={handleSelectVehicle}
            onNavigate={handleNavigate}
            onOpenAddModal={() => setShowAddModal(true)}
          />
        )}

        {activeView === 'fuse_diagram' && (
          <FuseDiagramView
            vehicle={activeVehicle}
            onSelectItem={setSelectedDetailItem}
          />
        )}

        {activeView === 'relay_diagram' && (
          <RelayDiagramView
            vehicle={activeVehicle}
            onSelectItem={setSelectedDetailItem}
          />
        )}

        {activeView === 'ac_diagram' && (
          <AcDiagramView
            vehicle={activeVehicle}
            onSelectItem={setSelectedDetailItem}
          />
        )}

        {activeView === 'ev_ac_diagram' && (
          <EvAcDiagramView
            vehicle={activeVehicle}
            onSelectItem={setSelectedDetailItem}
            onOpenHvModal={() => setShowHvSafetyModal(true)}
          />
        )}

        {activeView === 'component_list' && (
          <ComponentListView
            vehicle={activeVehicle}
            onSelectItem={setSelectedDetailItem}
          />
        )}

        {activeView === 'search' && (
          <SearchView
            onSelectVehicle={handleSelectVehicle}
            onNavigate={handleNavigate}
            onSelectItem={setSelectedDetailItem}
          />
        )}

        {activeView === 'database_manage' && (
          <DatabaseManageView
            vehicles={vehicles}
            onOpenAddModal={() => setShowAddModal(true)}
            onSelectVehicle={handleSelectVehicle}
          />
        )}

        {activeView === 'references' && (
          <ReferencesView vehicles={vehicles} />
        )}

        {activeView === 'update_sync' && (
          <UpdateSyncView
            vehicles={vehicles}
            onRefresh={() => {
              setVehicles([...db.getAllVehicles()]);
              setActiveVehicle(db.getActiveVehicle());
            }}
          />
        )}

        {activeView === 'settings' && (
          <SettingsView
            isInstallable={isInstallable && !isInstalled}
            onInstall={install}
          />
        )}

      </main>

      {/* Component Deep Inspection Modal */}
      <ComponentDetailModal
        item={selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
      />

      {/* High-Voltage Safety SOP Modal */}
      <HvSafetyModal
        isOpen={showHvSafetyModal}
        onClose={() => setShowHvSafetyModal(false)}
        voltageLevel={activeVehicle.fuelType === 'BEV' ? '800V / 320V DC' : '180V - 350V DC'}
      />

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={(newV) => {
          handleSelectVehicle(newV.id);
          handleNavigate('vehicle_select');
        }}
      />

      {/* Bottom Tab Bar for Mobile Touch Navigation */}
      <BottomTabBar
        activeView={activeView}
        onNavigate={handleNavigate}
        activeVehicle={activeVehicle}
      />

    </div>
  );
}
