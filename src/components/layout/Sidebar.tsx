'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  LayoutDashboard,
  ClipboardList,
  AlertOctagon,
  Sparkles,
  FileCheck2,
  HardHat,
  Leaf,
  Car,
  Award,
  Box,
  Building,
  CheckCircle,
  Clock,
  Flame
} from 'lucide-react';
import { ModuleType } from '@/types';

interface SidebarProps {
  onOpenCompanyModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCompanyModal }) => {
  const { activeTab, setActiveTab, organization, toggleModule, tasks, acpmActions } = useApp();

  const openAcpmCount = acpmActions.filter(a => a.status !== 'CERRADA').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'PENDIENTE').length;

  const isModuleActive = (mod: ModuleType) => organization.activeModules.includes(mod);

  return (
    <aside className="w-64 shrink-0 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-61px)] flex flex-col justify-between p-3 select-none">
      <div className="space-y-5">
        {/* Core Overview Section */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            Vista General
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Dashboard Gerencial</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>¿Qué tengo pendiente?</span>
              </div>
              {pendingTasksCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {pendingTasksCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Transversal Engines (Un Dato -> Múltiples Usos) */}
        <div>
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Motores Transversales
            </span>
            <span className="text-[9px] text-cyan-400 font-semibold bg-cyan-950/60 px-1 rounded border border-cyan-800/50">
              Cross-Module
            </span>
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => setActiveTab('acpm')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'acpm'
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Matriz ACPM & Hallazgos</span>
              </div>
              {openAcpmCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {openAcpmCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audits')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'audits'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Auditoría Inteligente & IA</span>
              </div>
              <span className="text-[9px] px-1 bg-purple-900/60 text-purple-300 rounded border border-purple-700/50 font-bold">
                IA
              </span>
            </button>

            <button
              onClick={() => setActiveTab('evidences')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'evidences'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-blue-400" />
                <span>Motor de Evidencias</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('assets')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'assets'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-emerald-400" />
                <span>Activos Compartidos</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Business Modules (Modular SaaS) */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
            <span>Módulos de Gestión</span>
            <span className="text-[9px] text-slate-400">Suscripción</span>
          </div>
          <nav className="space-y-1">
            {/* SG-SST */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => isModuleActive('SST') && setActiveTab('sst')}
                disabled={!isModuleActive('SST')}
                className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !isModuleActive('SST')
                    ? 'opacity-40 cursor-not-allowed text-slate-500'
                    : activeTab === 'sst'
                    ? 'bg-orange-600/20 text-orange-300 border border-orange-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HardHat className="w-4 h-4 text-orange-400" />
                  <span>SG-SST (Dec 1072)</span>
                </div>
                <span className="text-[9px] px-1 bg-orange-950 text-orange-400 rounded border border-orange-800">
                  {organization.sstStandardCount} Est.
                </span>
              </button>
              <input
                type="checkbox"
                checked={isModuleActive('SST')}
                onChange={() => toggleModule('SST')}
                className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                title="Habilitar/Deshabilitar Módulo SST"
              />
            </div>

            {/* Gestión Ambiental & Huella Carbono */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => isModuleActive('ENVIRONMENTAL') && setActiveTab('environmental')}
                disabled={!isModuleActive('ENVIRONMENTAL')}
                className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !isModuleActive('ENVIRONMENTAL')
                    ? 'opacity-40 cursor-not-allowed text-slate-500'
                    : activeTab === 'environmental'
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>Ambiental & Huella CO₂</span>
                </div>
                <Flame className="w-3 h-3 text-emerald-400" />
              </button>
              <input
                type="checkbox"
                checked={isModuleActive('ENVIRONMENTAL')}
                onChange={() => toggleModule('ENVIRONMENTAL')}
                className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
                title="Habilitar/Deshabilitar Módulo Ambiental"
              />
            </div>

            {/* Seguridad Vial / PESV */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => isModuleActive('PESV') && setActiveTab('pesv')}
                disabled={!isModuleActive('PESV')}
                className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !isModuleActive('PESV')
                    ? 'opacity-40 cursor-not-allowed text-slate-500'
                    : activeTab === 'pesv'
                    ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-sky-400" />
                  <span>PESV (24 Pasos)</span>
                </div>
                <span className="text-[9px] px-1 bg-sky-950 text-sky-400 rounded border border-sky-800">
                  {organization.pesvLevel}
                </span>
              </button>
              <input
                type="checkbox"
                checked={isModuleActive('PESV')}
                onChange={() => toggleModule('PESV')}
                className="w-3.5 h-3.5 accent-sky-500 cursor-pointer"
                title="Habilitar/Deshabilitar Módulo PESV"
              />
            </div>

            {/* Sistemas ISO Integrados */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => (isModuleActive('ISO_9001') || isModuleActive('ISO_14001') || isModuleActive('ISO_45001')) && setActiveTab('iso')}
                disabled={!isModuleActive('ISO_9001') && !isModuleActive('ISO_14001') && !isModuleActive('ISO_45001')}
                className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !isModuleActive('ISO_9001') && !isModuleActive('ISO_14001') && !isModuleActive('ISO_45001')
                    ? 'opacity-40 cursor-not-allowed text-slate-500'
                    : activeTab === 'iso'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>Sistemas ISO (HLS)</span>
                </div>
                <span className="text-[9px] px-1 bg-indigo-950 text-indigo-300 rounded border border-indigo-800">
                  Tri-Norma
                </span>
              </button>
              <input
                type="checkbox"
                checked={isModuleActive('ISO_9001')}
                onChange={() => toggleModule('ISO_9001')}
                className="w-3.5 h-3.5 accent-indigo-500 cursor-pointer"
                title="Habilitar/Deshabilitar Módulos ISO"
              />
            </div>
          </nav>
        </div>
      </div>

      {/* Footer / Company Setup Card */}
      <div className="pt-3 border-t border-slate-800/80">
        <button
          onClick={onOpenCompanyModal}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/40 text-left transition-all"
        >
          <Building className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="overflow-hidden">
            <span className="text-[11px] font-bold text-slate-200 block truncate">
              {organization.name}
            </span>
            <span className="text-[10px] text-cyan-400 block">
              Editar Caracterización & Sedes
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
