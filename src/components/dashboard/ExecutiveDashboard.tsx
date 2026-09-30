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
  ChevronRight
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
      <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Tablero Gerencial de Control HSEQ
              </span>
              <span className="text-xs text-slate-400">
                Periodo 2026 • Ciclo PHVA
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              {organization.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Plataforma digital integrada de gestión, seguimiento y mejora continua. Principio activo: 
              <strong className="text-cyan-400"> «Un dato → Múltiples usos»</strong>. Toda la trazabilidad de inspecciones, auditorías y evidencias se sincroniza en tiempo real.
            </p>
          </div>

          {/* Global Score Gauge Card */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-slate-800 border-4 border-cyan-500 shadow-lg shadow-cyan-500/20">
              <span className="text-lg font-black text-cyan-300">{globalScore}%</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-300 block">Índice Global HSEQ</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +3.4% vs trimestre anterior
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {organization.activeModules.length} Módulos Integrados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('acpm')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-200 text-xs font-semibold transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-rose-400" />
          Registrar Hallazgo / ACPM
        </button>

        <button
          onClick={() => setActiveTab('audits')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          Auditoría Inteligente con IA
        </button>

        <button
          onClick={() => setActiveTab('environmental')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition-all"
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          Calculadora Huella de Carbono
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all"
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Ver Tareas Pendientes ({tasks.filter(t => t.status === 'PENDIENTE').length})
        </button>
      </div>

      {/* 4 Pillars of Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SG-SST */}
        <div 
          onClick={() => setActiveTab('sst')}
          className="glass-card glass-card-hover rounded-xl p-4 border border-slate-700/80 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <HardHat className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-800/60">
              {complianceSST}%
            </span>
          </div>
          <div className="text-sm font-bold text-white">SG-SST (Dec 1072)</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Resolución 0312 • {organization.sstStandardCount} Estándares Mínimos
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${complianceSST}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
            <span>Riesgo ARL: Nivel {organization.riskLevelArl}</span>
            <span className="text-emerald-400 font-semibold">Cumple</span>
          </div>
        </div>

        {/* Ambiental & Huella CO2 */}
        <div 
          onClick={() => setActiveTab('environmental')}
          className="glass-card glass-card-hover rounded-xl p-4 border border-slate-700/80 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
              {complianceAmb}%
            </span>
          </div>
          <div className="text-sm font-bold text-white">Gestión Ambiental & PGIRS</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Huella: <strong className="text-white">{totalGhgTon} Ton CO₂eq</strong> (Q1)
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${complianceAmb}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
            <span>Gestores Certificados: 100%</span>
            <span className="text-emerald-400 font-semibold">Auditable</span>
          </div>
        </div>

        {/* PESV */}
        <div 
          onClick={() => setActiveTab('pesv')}
          className="glass-card glass-card-hover rounded-xl p-4 border border-slate-700/80 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
              {compliancePESV}%
            </span>
          </div>
          <div className="text-sm font-bold text-white">Seguridad Vial (PESV)</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Res 40595 de 2022 • Nivel {organization.pesvLevel}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${compliancePESV}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
            <span>24 Pasos Implementados</span>
            <span className="text-amber-400 font-semibold">1 Alerta Médica</span>
          </div>
        </div>

        {/* Tri-Norma ISO */}
        <div 
          onClick={() => setActiveTab('iso')}
          className="glass-card glass-card-hover rounded-xl p-4 border border-slate-700/80 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
              {complianceISO}%
            </span>
          </div>
          <div className="text-sm font-bold text-white">Tri-Norma ISO (HLS)</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            ISO 9001 • ISO 14001 • ISO 45001
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${complianceISO}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
            <span>Estructura Unificada</span>
            <span className="text-emerald-400 font-semibold">Certificado</span>
          </div>
        </div>
      </div>

      {/* Cross-Module ACPM Status & Lifecycle Principle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ACPM Status Funnel */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-slate-700/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Matriz Central ACPM — Estado de Mejora Continua
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Acciones Correctivas, Preventivas y de Mejora generadas automáticamente desde todas las fuentes.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('acpm')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Ver Matriz Completa <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/70">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Abiertas / En Análisis
              </span>
              <div className="text-2xl font-black text-white mt-1">{openAcpm}</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">5 Porqués / Causa</span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/70">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                En Ejecución
              </span>
              <div className="text-2xl font-black text-white mt-1">{inProgressAcpm}</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Planes en curso</span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/20">
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                Por Verificar Eficacia
              </span>
              <div className="text-2xl font-black text-purple-200 mt-1">{pendingVerificationAcpm}</div>
              <span className="text-[10px] text-purple-400 mt-0.5 block">Evidencias cargadas</span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                Cerradas Eficaces
              </span>
              <div className="text-2xl font-black text-emerald-200 mt-1">{closedAcpm}</div>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">100% Auditadas</span>
            </div>
          </div>

          {/* Interactive Principle Banner */}
          <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <span className="font-bold text-cyan-400 block mb-1">
              Principio Activo: «UN DATO → MÚLTIPLES USOS»
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
              <span className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-cyan-300">Inspección</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-rose-300">Hallazgo H-001</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">ACPM-001</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-blue-300">Evidencia Foto</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-purple-300">Verificación</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-emerald-900/80 text-emerald-300 rounded font-mono font-bold">Cierre Eficaz</span>
            </div>
          </div>
        </div>

        {/* Huella de Carbono Snapshot */}
        <div className="glass-card rounded-xl p-5 border border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                Huella de Carbono (GHG)
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded font-semibold border border-emerald-800">
                Periodo Q1 2026
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Consolidación de emisiones directas e indirectas con factores UPME y XM.
            </p>

            <div className="my-4 text-center p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-3xl font-black text-white tracking-tight">{totalGhgTon}</span>
              <span className="text-xs text-emerald-400 font-bold block mt-0.5">Toneladas CO₂eq</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Alcance 1 (Combustibles y fugas)
                </span>
                <span className="font-bold text-white">{scope1Ton} Ton</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Alcance 2 (Energía Eléctrica)
                </span>
                <span className="font-bold text-white">{scope2Ton} Ton</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Alcance 3 (Residuos Ordinarios)
                </span>
                <span className="font-bold text-white">{scope3Ton} Ton</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('environmental')}
            className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
          >
            Abrir Calculadora Detallada
          </button>
        </div>
      </div>

      {/* Critical Tasks & Alarms Center */}
      <div className="glass-card rounded-xl p-5 border border-slate-700/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Alertas Próximas y Vencimientos Críticos</h2>
          </div>
          <span className="text-xs text-slate-400">
            {criticalTasks.length} Tareas con prioridad alta
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {criticalTasks.map(task => (
            <div
              key={task.id}
              className="p-3 rounded-lg bg-slate-900/90 border border-slate-700/70 hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    {task.module} • {task.type}
                  </span>
                  <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Vence: {task.dueDate}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-100 line-clamp-2">{task.title}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Resp: {task.responsible}</span>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
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
