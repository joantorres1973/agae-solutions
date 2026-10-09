'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  ShieldCheck,
  HardHat,
  Leaf,
  Car,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Activity,
  Plus,
  RefreshCw,
  Zap,
  Building,
  ChevronRight,
  Sliders,
  Users
} from 'lucide-react';

interface ExecutiveDashboardProps {
  onOpenReportModal?: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = () => {
  const {
    organization,
    findings,
    acpmActions,
    tasks,
    ghgRecords,
    audits,
    workers,
    setActiveTab,
    showNotification
  } = useApp();

  // Metrics calculations
  const totalFindings = findings.length;
  const resolvedFindings = findings.filter(f => f.status === 'RESUELTO').length;
  const inAcpmFindings = findings.filter(f => f.status === 'EN_ACPM').length;

  const openAcpm = acpmActions.filter(a => a.status === 'ABIERTA' || a.status === 'EN_ANALISIS').length;
  const inProgressAcpm = acpmActions.filter(a => a.status === 'EN_EJECUCION' || a.status === 'PENDIENTE_EVIDENCIA').length;
  const pendingVerificationAcpm = acpmActions.filter(a => a.status === 'PENDIENTE_VERIFICACION').length;
  const closedAcpm = acpmActions.filter(a => a.status === 'CERRADA').length;

  const criticalTasks = tasks.filter(t => t.status === 'PENDIENTE' && (t.priority === 'CRITICA' || t.priority === 'ALTA'));

  // Huella de carbono total
  const totalGhgKg = ghgRecords.reduce((acc, curr) => acc + curr.totalKgCO2eq, 0);
  const totalGhgTon = (totalGhgKg / 1000).toFixed(2);
  const scope1Ton = (ghgRecords.filter(g => g.scope === 1).reduce((acc, curr) => acc + curr.totalKgCO2eq, 0) / 1000).toFixed(2);
  const scope2Ton = (ghgRecords.filter(g => g.scope === 2).reduce((acc, curr) => acc + curr.totalKgCO2eq, 0) / 1000).toFixed(2);
  const scope3Ton = (ghgRecords.filter(g => g.scope === 3).reduce((acc, curr) => acc + curr.totalKgCO2eq, 0) / 1000).toFixed(2);

  // Overall compliance score (simulated based on active requirements)
  const complianceSST = 88.5;
  const complianceAmb = 92.0;
  const compliancePESV = 84.2;
  const complianceISO = 91.0;
  const globalScore = ((complianceSST + complianceAmb + compliancePESV + complianceISO) / 4).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Corporate Identity & Quick Stats */}
      <div className="glass-card rounded-2xl p-5 border border-emerald-100 bg-gradient-to-r from-white via-white to-emerald-50 relative isolate overflow-hidden">
        <div className="absolute -z-10 top-0 right-0 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-100 text-teal-700 border border-teal-200">
                Tablero Gerencial de Control HSEQ
              </span>
              <span className="text-xs text-slate-600">
                Periodo 2026 • Ciclo PHVA
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {organization.name}
            </h1>
            <p className="text-xs text-slate-700 mt-1 max-w-2xl">
              Plataforma digital integrada de gestión, seguimiento y mejora continua. Principio activo: 
              <strong className="text-teal-700"> «Un dato → Múltiples usos»</strong>. Toda la trazabilidad de inspecciones, auditorías y evidencias se sincroniza en tiempo real.
            </p>
          </div>

          {/* Global Score Gauge Card */}
          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-300 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 border-4 border-teal-500 shadow-lg shadow-teal-500/20">
              <span className="text-lg font-black text-teal-700">{globalScore}%</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-700 block">Índice Global HSEQ</span>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +3.4% vs trimestre anterior
              </span>
              <span className="text-[10px] text-slate-600 block mt-0.5">
                {organization.activeModules.length} Módulos Integrados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('characterization')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-100 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-semibold transition-all"
        >
          <Sliders className="w-3.5 h-3.5 text-teal-700" />
          Caracterización & Motor
        </button>

        <button
          onClick={() => setActiveTab('workers')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-100 hover:bg-emerald-200/70 border border-emerald-300 text-emerald-900 text-xs font-bold transition-all shadow-sm"
        >
          <Users className="w-3.5 h-3.5 text-emerald-700" />
          Base Trabajadores 360° ({workers.filter(w => w.status === 'ACTIVO').length})
        </button>

        <button
          onClick={() => setActiveTab('acpm')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-100 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-rose-700" />
          Registrar Hallazgo / ACPM
        </button>

        <button
          onClick={() => setActiveTab('audits')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-100 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-semibold transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-purple-700" />
          Auditoría Inteligente con IA
        </button>

        <button
          onClick={() => setActiveTab('environmental')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-100 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-all"
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-700" />
          Calculadora Huella de Carbono
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition-all"
        >
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          Ver Tareas Pendientes ({tasks.filter(t => t.status === 'PENDIENTE').length})
        </button>
      </div>

      {/* 4 Pillars of Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SG-SST */}
        <div 
          onClick={() => setActiveTab('sst')}
          className="glass-card glass-card-hover rounded-xl p-4 border border-slate-300 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center border border-orange-200">
              <HardHat className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              {complianceSST}%
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900">SG-SST (Dec 1072)</div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            Resolución 0312 • {organization.sstStandardCount} Estándares Mínimos
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${complianceSST}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-600 mt-2">
            <span>Riesgo ARL: Nivel {organization.riskLevelArl}</span>
            <span className="text-emerald-700 font-semibold">Cumple</span>
          </div>
        </div>

        {/* Ambiental & Huella CO2 */}
        <div 
          onClick={() => setActiveTab('environmental')}
          className="glass-card glass-card-hover rounded-xl p-4 border border-slate-300 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {complianceAmb}%
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900">Gestión Ambiental & PGIRS</div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            Huella: <strong className="text-slate-900">{totalGhgTon} Ton CO₂eq</strong> (Q1)
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${complianceAmb}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-600 mt-2">
            <span>Gestores Certificados: 100%</span>
            <span className="text-emerald-700 font-semibold">Auditable</span>
          </div>
        </div>

        {/* PESV */}
        <div 
          onClick={() => setActiveTab('pesv')}
          className="glass-card glass-card-hover rounded-xl p-4 border border-slate-300 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {compliancePESV}%
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900">Seguridad Vial (PESV)</div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            Res 40595 de 2022 • Nivel {organization.pesvLevel}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${compliancePESV}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-600 mt-2">
            <span>24 Pasos Implementados</span>
            <span className="text-amber-700 font-semibold">1 Alerta Médica</span>
          </div>
        </div>

        {/* Tri-Norma ISO */}
        <div 
          onClick={() => setActiveTab('iso')}
          className="glass-card glass-card-hover rounded-xl p-4 border border-slate-300 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {complianceISO}%
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900">Tri-Norma ISO (HLS)</div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            ISO 9001 • ISO 14001 • ISO 45001
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${complianceISO}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-600 mt-2">
            <span>Estructura Unificada</span>
            <span className="text-emerald-700 font-semibold">Certificado</span>
          </div>
        </div>
      </div>

      {/* Cross-Module ACPM Status & Lifecycle Principle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ACPM Status Funnel */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-slate-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700" />
                Matriz Central ACPM — Estado de Mejora Continua
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Acciones Correctivas, Preventivas y de Mejora generadas automáticamente desde todas las fuentes.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('acpm')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-700 flex items-center gap-1"
            >
              Ver Matriz Completa <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Abiertas / En Análisis
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">{openAcpm}</div>
              <span className="text-[10px] text-slate-600 mt-0.5 block">5 Porqués / Causa</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300">
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                En Ejecución
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">{inProgressAcpm}</div>
              <span className="text-[10px] text-slate-600 mt-0.5 block">Planes en curso</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-purple-200 bg-purple-50">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                Por Verificar Eficacia
              </span>
              <div className="text-2xl font-black text-purple-800 mt-1">{pendingVerificationAcpm}</div>
              <span className="text-[10px] text-purple-700 mt-0.5 block">Evidencias cargadas</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Cerradas Eficaces
              </span>
              <div className="text-2xl font-black text-emerald-800 mt-1">{closedAcpm}</div>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">100% Auditadas</span>
            </div>
          </div>

          {/* Interactive Principle Banner */}
          <div className="mt-4 p-3 rounded-lg bg-white/80 border border-slate-200 text-xs">
            <span className="font-bold text-teal-700 block mb-1">
              Principio Activo: «UN DATO → MÚLTIPLES USOS»
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-700">
              <span className="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-teal-700">Inspección</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-rose-700">Hallazgo H-001</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-amber-700">ACPM-001</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-blue-700">Evidencia Foto</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-purple-700">Verificación</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-mono font-bold">Cierre Eficaz</span>
            </div>
          </div>
        </div>

        {/* Huella de Carbono Snapshot */}
        <div className="glass-card rounded-xl p-5 border border-slate-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-700" />
                Huella de Carbono (GHG)
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold border border-emerald-200">
                Periodo Q1 2026
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Consolidación de emisiones directas e indirectas con factores UPME y XM.
            </p>

            <div className="my-4 text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{totalGhgTon}</span>
              <span className="text-xs text-emerald-700 font-bold block mt-0.5">Toneladas CO₂eq</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Alcance 1 (Combustibles y fugas)
                </span>
                <span className="font-bold text-slate-900">{scope1Ton} Ton</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Alcance 2 (Energía Eléctrica)
                </span>
                <span className="font-bold text-slate-900">{scope2Ton} Ton</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Alcance 3 (Residuos Ordinarios)
                </span>
                <span className="font-bold text-slate-900">{scope3Ton} Ton</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('environmental')}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-teal-700 text-xs font-semibold rounded-lg transition-colors border border-slate-300"
          >
            Abrir Calculadora Detallada
          </button>
        </div>
      </div>

      {/* Critical Tasks & Alarms Center */}
      <div className="glass-card rounded-xl p-5 border border-slate-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <h2 className="text-sm font-bold text-slate-900">Alertas Próximas y Vencimientos Críticos</h2>
          </div>
          <span className="text-xs text-slate-600">
            {criticalTasks.length} Tareas con prioridad alta
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {criticalTasks.map(task => (
            <div
              key={task.id}
              className="p-3 rounded-lg bg-slate-50 border border-slate-300 hover:border-amber-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {task.module} • {task.type}
                  </span>
                  <span className="text-[10px] text-rose-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Vence: {task.dueDate}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 line-clamp-2">{task.title}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span>Resp: {task.responsible}</span>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-teal-700 hover:text-teal-700 font-medium"
                >
                  Gestionar →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
