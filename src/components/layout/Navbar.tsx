'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import {
  Building2,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronDown,
  User,
  Sliders,
  Globe,
  LogOut
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
    notification,
    setPortalView
  } = useApp();

  const { user, logout } = useAuth();
  const initials = (user?.nombre ?? '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const [showOrgMenu, setShowOrgMenu] = useState(false);

  const pendingTasksCount = tasks.filter(t => t.status === 'PENDIENTE').length;
  const criticalTasksCount = tasks.filter(t => t.status === 'PENDIENTE' && (t.priority === 'CRITICA' || t.priority === 'ALTA')).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-agae-light.png" alt="AGAE SOLUTIONS" className="h-10 w-auto" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                SaaS Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium hidden sm:block">
              HSEQ Integrado • SST Dec 1072 • PESV Res 40595 • Tri-Norma ISO
            </p>
          </div>
        </div>

        {/* Center: Tenant / Organization Context Pill */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowOrgMenu(!showOrgMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 hover:border-emerald-200 transition-all text-left"
          >
            <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="max-w-[240px] truncate">
              <div className="text-xs font-semibold text-slate-800 truncate">{organization.name}</div>
              <div className="text-[10px] text-slate-600">
                NIT {organization.nit} • Riesgo {organization.riskLevelArl} • PESV {organization.pesvLevel}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600 ml-1" />
          </button>

          {showOrgMenu && (
            <div className="absolute left-0 mt-2 w-80 rounded-xl bg-slate-50 border border-slate-300 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Empresa Activa</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  {organization.sstStandardCount} Estándares SST
                </span>
              </div>
              <p className="text-xs font-medium text-slate-800">{organization.name}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{organization.economicActivity}</p>
              
              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-700">
                <div className="bg-slate-100 p-2 rounded border border-slate-300">
                  <span className="text-slate-600 block text-[10px]">Trabajadores</span>
                  <span className="font-bold text-slate-900">{organization.employeeCount} Directos</span>
                </div>
                <div className="bg-slate-100 p-2 rounded border border-slate-300">
                  <span className="text-slate-600 block text-[10px]">Sedes Activas</span>
                  <span className="font-bold text-slate-900">{organization.sites.length} Operativas</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => {
                    setShowOrgMenu(false);
                    setActiveTab('characterization');
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Caracterización
                </button>
                <button
                  onClick={() => {
                    setShowOrgMenu(false);
                    onOpenCompanyModal();
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Edición Rápida
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-xs hidden xl:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Buscar activo, hallazgo, ACPM o norma..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-500 focus:outline-none focus:border-emerald-200 transition-colors"
          />
        </div>

        {/* Quick Actions & Pending Tasks Badge */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setPortalView('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-900 transition-all text-xs font-semibold"
            title="Ir a la Portada Pública & Publicidad Comercial"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden xl:inline">Portada Pública</span>
          </button>

          <button
            onClick={() => setActiveTab('characterization')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-50 border border-emerald-200 text-emerald-700 transition-all text-xs font-bold"
            title="Caracterización Inteligente & Motor de Aplicabilidad"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Caracterización</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-all text-xs font-medium"
            title="Centro ¿Qué tengo pendiente?"
          >
            <Bell className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">¿Qué tengo pendiente?</span>
            {pendingTasksCount > 0 && (
              <span className={`inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full text-white ${criticalTasksCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-600'}`}>
                {pendingTasksCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{user?.nombre}</div>
              <div className="text-[10px] text-emerald-700 font-medium">{user?.empresa}</div>
            </div>
            <button
              onClick={() => {
                logout();
                setPortalView('landing');
              }}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium animate-in fade-in slide-in-from-bottom-5 duration-300 ${
          notification.type === 'warning'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : notification.type === 'info'
            ? 'bg-sky-50 text-sky-800 border-sky-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {notification.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </header>
  );
};
