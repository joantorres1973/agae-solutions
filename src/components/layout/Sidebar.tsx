'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { isTabOutsidePlan } from '@/lib/plan-rules';
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
  Flame,
  Sliders,
  Cpu,
  Lock,
  Users,
} from 'lucide-react';
import { ModuleType } from '@/types';

interface SidebarProps {
  onOpenCompanyModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCompanyModal }) => {
  const { activeTab, setActiveTab, organization, toggleModule, tasks, acpmActions, workers } = useApp();
  const { isTabLocked } = useAuth();
  const notInPlan = (tab: string) => isTabOutsidePlan(tab, organization.activeModules) && (
    <span className="ml-1.5 text-[8px] font-bold uppercase px-1 py-px rounded bg-slate-100 text-slate-500 border border-slate-300">No incluido</span>
  );
  const lockIcon = (tab: string) => isTabLocked(tab) && <Lock className="inline w-3 h-3 ml-1.5 text-amber-700" />;

  const openAcpmCount = acpmActions.filter(a => a.status !== 'CERRADA').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'PENDIENTE').length;

  const isModuleActive = (mod: ModuleType) => organization.activeModules.includes(mod);

  return (
    <aside className="w-64 shrink-0 glass-panel border-r border-slate-200 min-h-[calc(100vh-61px)] flex flex-col justify-between p-3 select-none">
      <div className="space-y-5">
        {/* Core Overview Section */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1.5">
            Vista General
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                <span>Dashboard Gerencial</span>{lockIcon('dashboard')}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('characterization')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'characterization'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>Caracterización & Motor</span>{lockIcon('characterization')}
              </div>
              <span className="text-[9px] px-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-bold">
                Smart
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>¿Qué tengo pendiente?</span>{lockIcon('tasks')}
              </div>
              {pendingTasksCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  {pendingTasksCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Transversal Engines (Un Dato -> Múltiples Usos) */}
        <div>
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Motores Transversales
            </span>
            <span className="text-[9px] text-emerald-700 font-semibold bg-emerald-50 px-1 rounded border border-emerald-200">
              Cross-Module
            </span>
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => setActiveTab('workers')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'workers'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Base Trabajadores 360°</span>{lockIcon('workers')}
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {workers.filter(w => w.status === 'ACTIVO').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('acpm')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'acpm'
                  ? 'bg-rose-100 text-rose-700 border border-rose-200 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-4 h-4 text-rose-700" />
                <span>Matriz ACPM & Hallazgos</span>{lockIcon('acpm')}
              </div>
              {openAcpmCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  {openAcpmCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audits')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'audits'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>Auditoría Inteligente & IA</span>{lockIcon('audits')}
              </div>
              <span className="text-[9px] px-1 bg-purple-50 text-purple-700 rounded border border-purple-200 font-bold">
                IA
              </span>
            </button>

            <button
              onClick={() => setActiveTab('evidences')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'evidences'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-blue-700" />
                <span>Motor de Evidencias</span>{lockIcon('evidences')}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('assets')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'assets'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-emerald-700" />
                <span>Activos Compartidos</span>{lockIcon('assets')}
              </div>
            </button>
          </nav>
        </div>

        {/* Business Modules (Modular SaaS) */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
            <span>Módulos de Gestión</span>
            <span className="text-[9px] text-slate-500">Suscripción</span>
          </div>
          <nav className="space-y-1">
            {/* SG-SST */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('sst')}
                className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !isModuleActive('SST')
                    ? activeTab === 'sst' ? 'bg-slate-200 text-slate-800 border border-slate-600' : 'opacity-60 text-slate-500 hover:opacity-100 hover:bg-slate-100'
                    : activeTab === 'sst'
                    ? 'bg-orange-100 text-orange-700 border border-orange-200 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HardHat className="w-4 h-4 text-orange-700" />
                  <span>SG-SST (Dec 1072)</span>{lockIcon('sst')}{notInPlan('sst')}
                </div>
                <span className="text-[9px] px-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
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
                onClick={() => setActiveTab('environmental')}
                className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !isModuleActive('ENVIRONMENTAL')
                    ? activeTab === 'environmental' ? 'bg-slate-200 text-slate-800 border border-slate-600' : 'opacity-60 text-slate-500 hover:opacity-100 hover:bg-slate-100'
                    : activeTab === 'environmental'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>Ambiental & Huella CO₂</span>{lockIcon('environmental')}{notInPlan('environmental')}
                </div>
                <Flame className="w-3 h-3 text-emerald-700" />
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
                onClick={() => setActiveTab('pesv')}
                className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !isModuleActive('PESV')
                    ? activeTab === 'pesv' ? 'bg-slate-200 text-slate-800 border border-slate-600' : 'opacity-60 text-slate-500 hover:opacity-100 hover:bg-slate-100'
                    : activeTab === 'pesv'
                    ? 'bg-sky-100 text-sky-700 border border-sky-200 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-sky-700" />
                  <span>PESV (24 Pasos)</span>{lockIcon('pesv')}{notInPlan('pesv')}
                </div>
                <span className="text-[9px] px-1 bg-sky-50 text-sky-700 rounded border border-sky-200">
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
                onClick={() => setActiveTab('iso')}
                className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !isModuleActive('ISO_9001') && !isModuleActive('ISO_14001') && !isModuleActive('ISO_45001')
                    ? activeTab === 'iso' ? 'bg-slate-200 text-slate-800 border border-slate-600' : 'opacity-60 text-slate-500 hover:opacity-100 hover:bg-slate-100'
                    : activeTab === 'iso'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-indigo-700" />
                  <span>Sistemas ISO (HLS)</span>{lockIcon('iso')}{notInPlan('iso')}
                </div>
                <span className="text-[9px] px-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
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
      <div className="pt-3 border-t border-slate-200">
        <button
          onClick={onOpenCompanyModal}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 hover:border-emerald-200 text-left transition-all"
        >
          <Building className="w-4 h-4 text-emerald-700 shrink-0" />
          <div className="overflow-hidden">
            <span className="text-[11px] font-bold text-slate-800 block truncate">
              {organization.name}
            </span>
            <span className="text-[10px] text-emerald-700 block">
              Editar Caracterización & Sedes
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
