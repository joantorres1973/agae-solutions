'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Box,
  Plus,
  Search,
  Filter,
  Flame,
  HeartPulse,
  Car,
  Wrench,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AssetCategory, SharedAsset } from '@/types';

export const SharedAssetsEngine: React.FC = () => {
  const { assets, addAsset, organization, showNotification } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New asset form
  const [aCode, setACode] = useState('');
  const [aName, setAName] = useState('');
  const [aCategory, setACategory] = useState<AssetCategory>('EXTINGUISHER');
  const [aLocation, setALocation] = useState('');
  const [aSiteName, setASiteName] = useState(organization.sites[0]?.name || 'Sede Principal');
  const [aNextInsp, setANextInsp] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  const filteredAssets = assets.filter(a => {
    if (filterCategory !== 'ALL' && a.category !== filterCategory) return false;
    if (searchTerm && !a.name.toLowerCase().includes(searchTerm.toLowerCase()) && !a.code.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aCode || !aName) return;

    addAsset({
      code: aCode.toUpperCase(),
      name: aName,
      category: aCategory,
      siteId: organization.sites[0]?.id || 'site-1',
      siteName: aSiteName,
      processId: organization.processes[0]?.id || 'proc-1',
      processName: organization.processes[0]?.name || 'Operaciones',
      locationDetails: aLocation || 'Instalación Central',
      status: 'OPERATIVO',
      lastInspectionDate: new Date().toISOString().split('T')[0],
      nextInspectionDate: aNextInsp
    });

    setShowAddModal(false);
    setACode('');
    setAName('');
    setALocation('');
  };

  const getCategoryIcon = (cat: AssetCategory) => {
    switch (cat) {
      case 'EXTINGUISHER': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'FIRST_AID': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'VEHICLE': return <Car className="w-4 h-4 text-sky-400" />;
      default: return <Wrench className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 rounded-xl border border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Box className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">
              Activos Compartidos — Principio de No Duplicidad
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cada equipo registrado se almacena una sola vez y se reutiliza automáticamente en <strong>Inspecciones SST</strong>, <strong>Brigadas de Emergencia</strong>, <strong>PESV</strong>, <strong>Auditorías</strong> y <strong>ACPM</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          + Registrar Activo
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código (EXT-01), nombre o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs"
          >
            <option value="ALL">Todas las Categorías</option>
            <option value="EXTINGUISHER">Extintores contra Incendios</option>
            <option value="FIRST_AID">Botiquines de Emergencia</option>
            <option value="VEHICLE">Vehículos y Flota</option>
            <option value="MACHINERY">Maquinaria y Equipos</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="glass-card rounded-xl p-4 border border-slate-700/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-black text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {asset.code}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  {asset.status}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  {getCategoryIcon(asset.category)}
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white leading-tight">{asset.name}</h2>
                  <p className="text-[11px] text-slate-400 mt-1">{asset.locationDetails}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Sede: <strong className="text-slate-200">{asset.siteName}</strong></span>
                <span>Proceso: <strong className="text-slate-200">{asset.processName}</strong></span>
              </div>
              <div className="flex items-center justify-between text-cyan-400 font-semibold pt-1">
                <span>Próxima Inspección Programada:</span>
                <span>{asset.nextInspectionDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Asset */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white">Registrar Nuevo Activo Compartido</h2>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Código Único *</label>
                  <input
                    type="text"
                    required
                    value={aCode}
                    onChange={(e) => setACode(e.target.value)}
                    placeholder="Ej: EXT-BOG-05 o MAQ-02"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Categoría</label>
                  <select
                    value={aCategory}
                    onChange={(e) => setACategory(e.target.value as AssetCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="EXTINGUISHER">Extintor</option>
                    <option value="FIRST_AID">Botiquín</option>
                    <option value="VEHICLE">Vehículo</option>
                    <option value="MACHINERY">Maquinaria / Equipo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Nombre Descriptivo *</label>
                <input
                  type="text"
                  required
                  value={aName}
                  onChange={(e) => setAName(e.target.value)}
                  placeholder="Ej: Extintor CO2 10 lbs Cuarto de Servidores..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Ubicación Específica</label>
                <input
                  type="text"
                  value={aLocation}
                  onChange={(e) => setALocation(e.target.value)}
                  placeholder="Ej: Pasillo segundo piso acceso a TI"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Sede</label>
                  <select
                    value={aSiteName}
                    onChange={(e) => setASiteName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    {organization.sites.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Próxima Inspección</label>
                  <input
                    type="date"
                    value={aNextInsp}
                    onChange={(e) => setANextInsp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Registrar Activo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
