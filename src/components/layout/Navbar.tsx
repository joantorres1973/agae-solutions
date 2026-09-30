'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  ShieldCheck,
  Building2,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronDown,
  User,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  onOpenCompanyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCompanyModal }) => {
  const {
    organization,
    tasks,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    notification
  } = useApp();

  const [showOrgMenu, setShowOrgMenu] = useState(false);

  const pendingTasksCount = tasks.filter(t => t.status === 'PENDIENTE').length;
  const criticalTasksCount = tasks.filter(t => t.status === 'PENDIENTE' && (t.priority === 'CRITICA' || t.priority === 'ALTA')).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-lg shadow-cyan-500/20 text-white font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-sky-300 bg-clip-text text-transparent">
                AGAE SOLUTIONS
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-700/50 rounded-md">
                SaaS Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              HSEQ Integrado • SST Dec 1072 • PESV Res 40595 • Tri-Norma ISO
            </p>
          </div>
        </div>

        {/* Center: Tenant / Organization Context Pill */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowOrgMenu(!showOrgMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/70 hover:border-cyan-500/50 transition-all text-left"
          >
            <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="max-w-[240px] truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">{organization.name}</div>
              <div className="text-[10px] text-slate-400">
                NIT {organization.nit} • Riesgo {organization.riskLevelArl} • PESV {organization.pesvLevel}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showOrgMenu && (
            <div className="absolute left-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Empresa Activa</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                  {organization.sstStandardCount} Estándares SST
                </span>
              </div>
              <p className="text-xs font-medium text-slate-100">{organization.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{organization.economicActivity}</p>
              
              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-300">
                <div className="bg-slate-800/60 p-2 rounded border border-slate-700/50">
                  <span className="text-slate-400 block text-[10px]">Trabajadores</span>
                  <span className="font-bold text-white">{organization.employeeCount} Directos</span>
                </div>
                <div className="bg-slate-800/60 p-2 rounded border border-slate-700/50">
                  <span className="text-slate-400 block text-[10px]">Sedes Activas</span>
                  <span className="font-bold text-white">{organization.sites.length} Operativas</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowOrgMenu(false);
                  onOpenCompanyModal();
                }}
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                Configurar Caracterización
              </button>
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-xs hidden xl:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar activo, hallazgo, ACPM o norma..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/70 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 transition-colors"
          />
        </div>

        {/* Quick Actions & Pending Tasks Badge */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('tasks')}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-all text-xs font-medium"
            title="Centro ¿Qué tengo pendiente?"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">¿Qué tengo pendiente?</span>
            {pendingTasksCount > 0 && (
              <span className={`inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full text-white ${criticalTasksCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-600'}`}>
                {pendingTasksCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              MR
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-200 leading-tight">Marcela Rincón</div>
              <div className="text-[10px] text-cyan-400 font-medium">Directora HSEQ & Auditora</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium animate-in fade-in slide-in-from-bottom-5 duration-300 ${
          notification.type === 'warning'
            ? 'bg-amber-950/90 text-amber-200 border-amber-600/70'
            : notification.type === 'info'
            ? 'bg-sky-950/90 text-sky-200 border-sky-600/70'
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-600/70'
        }`}>
          {notification.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </header>
  );
};
