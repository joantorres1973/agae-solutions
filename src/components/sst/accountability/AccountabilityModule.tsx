'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  FileCheck,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  Building2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Send,
  Check,
  X,
  ExternalLink,
  Info,
  BadgeCheck,
  BarChart3,
  Award,
  BookmarkCheck,
  Layers,
  Sparkles,
  History,
  FolderArchive,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  AccountabilityReport,
  AccountabilityStatus,
  AccountabilityRoleCategory,
  AnnualPlanActivity
} from '@/types/accountability';
import { calculateWorkerPatMetrics } from '@/lib/accountability-mock';

interface AccountabilityModuleProps {
  initialReportId?: string;
  onNavigateToModule?: (targetTab?: string, sstSub?: string) => void;
}

export const AccountabilityModule: React.FC<AccountabilityModuleProps> = ({
  initialReportId,
  onNavigateToModule
}) => {
  const {
    organization,
    accountabilityState,
    setCurrentAccountabilityPeriod,
    updateAccountabilityReport,
    submitAccountabilityForReview,
    reviewAndFinalizeAccountability,
    generateConsolidatedAccountabilityReport,
    registerAccountabilityReportInRepository,
    showNotification
  } = useApp();

  // Active view tab:
  // - DASHBOARD: Resumen corporativo y lista de responsables
  // - FORM: Formulario individual de rendición de cuentas
  // - PAT_ACTIVITIES: Visualizador del Plan Anual de Trabajo
  // - CONSOLIDATED: Informe consolidado anual
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'FORM' | 'PAT_ACTIVITIES' | 'CONSOLIDATED'>('DASHBOARD');

  // Selected report for form view
  const [selectedReportId, setSelectedReportId] = useState<string>(
    initialReportId || accountabilityState.reports[0]?.id || ''
  );

  // Filters for Dashboard
  const [roleFilter, setRoleFilter] = useState<'ALL' | AccountabilityRoleCategory>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AccountabilityStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // PAT Activities filter
  const [patWorkerFilter, setPatWorkerFilter] = useState<string>('ALL');
  const [patQuarterFilter, setPatQuarterFilter] = useState<string>('ALL');

  // Review Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewReportTarget, setReviewReportTarget] = useState<AccountabilityReport | null>(null);
  const [reviewObservations, setReviewObservations] = useState('');
  const [reviewApproved, setReviewApproved] = useState(true);

  // Print view state (Individual vs Consolidado)
  const [printMode, setPrintMode] = useState<'NONE' | 'INDIVIDUAL' | 'CONSOLIDATED'>('NONE');

  // Current selected report object
  const currentReport = useMemo(() => {
    return accountabilityState.reports.find(r => r.id === selectedReportId) || accountabilityState.reports[0];
  }, [accountabilityState.reports, selectedReportId]);

  // PAT Metrics for the current selected worker
  const currentWorkerMetrics = useMemo(() => {
    if (!currentReport) return null;
    return calculateWorkerPatMetrics(
      accountabilityState.patActivities,
      currentReport.workerId,
      accountabilityState.currentPeriod
    );
  }, [accountabilityState.patActivities, currentReport, accountabilityState.currentPeriod]);

  // PAT Activities for the current worker
  const currentWorkerActivities = useMemo(() => {
    if (!currentReport) return [];
    return accountabilityState.patActivities.filter(
      a => a.assignedWorkerId === currentReport.workerId && a.period === accountabilityState.currentPeriod
    );
  }, [accountabilityState.patActivities, currentReport, accountabilityState.currentPeriod]);

  // Global KPIs for Dashboard
  const globalKpis = useMemo(() => {
    const periodReports = accountabilityState.reports.filter(
      r => r.period === accountabilityState.currentPeriod
    );
    const total = periodReports.length;
    const completed = periodReports.filter(r => r.status === 'FINALIZADA').length;
    const inReview = periodReports.filter(r => r.status === 'PENDIENTE_REVISION').length;
    const inProgress = periodReports.filter(r => r.status === 'EN_ELABORACION').length;
    const pending = periodReports.filter(r => r.status === 'PENDIENTE').length;

    const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inReview,
      inProgress,
      pending,
      complianceRate
    };
  }, [accountabilityState.reports, accountabilityState.currentPeriod]);

  // Filtered reports for Dashboard list
  const filteredReports = useMemo(() => {
    return accountabilityState.reports.filter(r => {
      if (r.period !== accountabilityState.currentPeriod) return false;
      if (roleFilter !== 'ALL' && r.roleCategory !== roleFilter) return false;
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchName = r.workerName.toLowerCase().includes(query);
        const matchPosition = r.workerPosition.toLowerCase().includes(query);
        const matchRole = r.sstRoleTitle.toLowerCase().includes(query);
        if (!matchName && !matchPosition && !matchRole) return false;
      }
      return true;
    });
  }, [accountabilityState.reports, accountabilityState.currentPeriod, roleFilter, statusFilter, searchTerm]);

  // Latest consolidated report for current period
  const latestConsolidated = useMemo(() => {
    return accountabilityState.consolidatedReports.find(
      c => c.period === accountabilityState.currentPeriod
    ) || accountabilityState.consolidatedReports[0];
  }, [accountabilityState.consolidatedReports, accountabilityState.currentPeriod]);

  // Handlers for Form edits
  const handleFieldChange = (field: keyof AccountabilityReport, value: string) => {
    if (!currentReport) return;
    updateAccountabilityReport(currentReport.id, { [field]: value });
  };

  const handleOpenReviewModal = (report: AccountabilityReport) => {
    setReviewReportTarget(report);
    setReviewObservations(report.reviewerObservations || '');
    setReviewApproved(true);
    setIsReviewModalOpen(true);
  };

  const handleConfirmReview = () => {
    if (!reviewReportTarget) return;
    reviewAndFinalizeAccountability(reviewReportTarget.id, {
      reviewerObservations: reviewObservations,
      approved: reviewApproved,
      reviewerName: 'Lic. Fernando Ortiz Salazar',
      reviewerPosition: 'Gerente General & Representante Legal'
    });
    setIsReviewModalOpen(false);
  };

  const handlePrint = (mode: 'INDIVIDUAL' | 'CONSOLIDATED') => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const getRoleCategoryBadge = (cat: AccountabilityRoleCategory) => {
    switch (cat) {
      case 'ALTA_DIRECCION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Alta Dirección</span>;
      case 'RESPONSABLE_SST':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">Líder HSEQ / SST</span>;
      case 'LIDERES_PROCESO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Líder de Proceso</span>;
      case 'SUPERVISORES_MANDOS_MEDIOS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">Supervisor Operativo</span>;
      case 'COMITES_BRIGADAS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">Comité / Brigada</span>;
      case 'TRABAJADORES_FUNCIONES_SST':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Funciones Específicas</span>;
    }
  };

  const getStatusBadge = (status: AccountabilityStatus) => {
    switch (status) {
      case 'FINALIZADA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Finalizada & Aprobada
          </span>
        );
      case 'PENDIENTE_REVISION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pendiente de Revisión
          </span>
        );
      case 'EN_ELABORACION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            En Elaboración
          </span>
        );
      case 'PENDIENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Pendiente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* ============================================================== */}
      {/* 1. CABECERA PRINCIPAL DEL MÓDULO & SELECTOR DE PERIODO */}
      {/* ============================================================== */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md">
              <FileCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Rendición de Cuentas sobre el Desempeño en SST
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-100 text-orange-800 border border-orange-200">
                  Estándar 2.3.1 (Res. 0312/2019)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  Dec. 1072/2015 Art. 2.2.4.6.8 Num. 3
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl">
                Seguimiento, evaluación y documentación del cumplimiento de responsabilidades en SST a todos los niveles
                de la organización, consolidando automáticamente la ejecución del Plan Anual de Trabajo, comités y evidencias.
              </p>
            </div>
          </div>

          {/* Selector de Periodo y Botones Rápidos */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600 font-bold">Vigencia:</span>
              <select
                value={accountabilityState.currentPeriod}
                onChange={(e) => setCurrentAccountabilityPeriod(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {accountabilityState.availablePeriods.map(p => (
                  <option key={p} value={p}>{p} {p === '2026' ? '(Actual)' : ''}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handlePrint('CONSOLIDATED')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Informe Consolidado PDF</span>
            </button>
          </div>
        </div>

        {/* ALERTA DE SEGUIMIENTO A PERIODICIDAD */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Exigencia Legal de Periodicidad:</strong> La rendición de cuentas debe realizarse como mínimo una vez al año para todos
            los cargos con responsabilidades asignadas (empleador, responsable del SG-SST, líderes de proceso, supervisores y comités).
            La constancia se conserva digitalmente con firma electrónica en el Repositorio Documental Central.
          </div>
        </div>

        {/* BARRA DE NAVEGACIÓN SECUNDARIA (SUBPESTAÑAS) */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-slate-200">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'DASHBOARD'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tablero de Rendición ({globalKpis.total} Responsables)</span>
          </button>

          <button
            onClick={() => setActiveTab('FORM')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'FORM'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Formulario Individual ({currentReport?.workerName || 'Seleccionar'})</span>
          </button>

          <button
            onClick={() => setActiveTab('PAT_ACTIVITIES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'PAT_ACTIVITIES'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Plan Anual de Trabajo ({accountabilityState.patActivities.length} Actividades)</span>
          </button>

          <button
            onClick={() => setActiveTab('CONSOLIDATED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'CONSOLIDATED'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Informe Consolidado Corporativo</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SUBTAB 1: TABLERO DE RENDICIÓN (DASHBOARD CORPORATIVO) */}
      {/* ============================================================== */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6 print:hidden">
          
          {/* TARJETAS DE INDICADORES GLOBALES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="glass-card p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Responsables en Alcance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900">{globalKpis.total}</span>
                <span className="text-xs text-slate-500">cargos asignados</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Niveles con funciones SST</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Finalizadas & Aprobadas</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-800">{globalKpis.completed}</span>
                <span className="text-xs text-emerald-600">con firma y soporte</span>
              </div>
              <p className="text-[11px] text-emerald-600 mt-1">Certificadas ante gerencia</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-amber-200 bg-amber-50/30">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">En Revisión Jerárquica</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-800">{globalKpis.inReview}</span>
                <span className="text-xs text-amber-600">pendientes validación</span>
              </div>
              <p className="text-[11px] text-amber-600 mt-1">Diligenciadas por el titular</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-blue-200 bg-blue-50/30">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">En Elaboración</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-blue-800">{globalKpis.inProgress}</span>
                <span className="text-xs text-blue-600">borradores activos</span>
              </div>
              <p className="text-[11px] text-blue-600 mt-1">Con avances registrados</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-rose-200 bg-rose-50/30">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Pendientes / Alerta</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-rose-800">{globalKpis.pending}</span>
                <span className="text-xs text-rose-600">sin iniciar</span>
              </div>
              <p className="text-[11px] text-rose-600 mt-1">Alerta de vencimiento</p>
            </div>
          </div>

          {/* AVISO METODOLÓGICO Y LEGAL */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Principio de Transparencia y Verificación Técnica:</strong> El porcentaje de cumplimiento se calcula exclusivamente
              sobre las actividades exigibles del Plan Anual de Trabajo que cuentan con evidencia y verificación eficaz. Si una actividad figura
              como ejecutada sin comprobación técnica, no se considera automáticamente cumplida. Este porcentaje no constituye una evaluación
              laboral general ni una calificación oficial punitiva, sino una herramienta de mejora continua del SG-SST.
            </div>
          </div>

          {/* FILTROS Y BÚSQUEDA DE RESPONSABLES */}
          <div className="glass-card p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, cargo o rol SST..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white"
              >
                <option value="ALL">Todos los Niveles Organizacionales</option>
                <option value="ALTA_DIRECCION">Alta Dirección / Empleador</option>
                <option value="RESPONSABLE_SST">Responsable SG-SST</option>
                <option value="LIDERES_PROCESO">Líderes de Proceso</option>
                <option value="SUPERVISORES_MANDOS_MEDIOS">Supervisores Operativos</option>
                <option value="COMITES_BRIGADAS">Integrantes de Comités & Brigada</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="FINALIZADA">Finalizadas</option>
                <option value="PENDIENTE_REVISION">Pendientes de Revisión</option>
                <option value="EN_ELABORACION">En Elaboración</option>
                <option value="PENDIENTE">Pendientes</option>
              </select>
            </div>

            <button
              onClick={() => {
                generateConsolidatedAccountabilityReport(accountabilityState.currentPeriod);
              }}
              className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Consolidar Resultados Anuales</span>
            </button>
          </div>

          {/* LISTA DE RESPONSABLES EN TABLA CORPORATIVA */}
          <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Responsable & Cargo</th>
                    <th className="p-3.5">Nivel / Rol en el SG-SST</th>
                    <th className="p-3.5 text-center">Cumplimiento Plan Anual (Verificadas / Exigibles)</th>
                    <th className="p-3.5 text-center">Estado Rendición</th>
                    <th className="p-3.5">Soporte Documental</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => {
                    const metrics = calculateWorkerPatMetrics(
                      accountabilityState.patActivities,
                      report.workerId,
                      accountabilityState.currentPeriod
                    );

                    return (
                      <tr key={report.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{report.workerName}</div>
                          <div className="text-[11px] text-slate-500">{report.workerPosition} • {report.workerArea}</div>
                          <div className="text-[10px] font-mono text-slate-400">CC: {report.workerDocNumber}</div>
                        </td>

                        <td className="p-3.5 space-y-1">
                          <div>{getRoleCategoryBadge(report.roleCategory)}</div>
                          <div className="text-[11px] text-slate-700 font-medium line-clamp-1">{report.sstRoleTitle}</div>
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="font-mono font-bold text-slate-900 text-xs">
                            {metrics.complianceDisplay}
                          </div>
                          {metrics.compliancePercentage !== null && (
                            <div className="w-28 mx-auto bg-slate-100 rounded-full h-1.5 mt-1">
                              <div
                                className={`h-1.5 rounded-full ${
                                  metrics.compliancePercentage >= 80 ? 'bg-emerald-500' :
                                  metrics.compliancePercentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, metrics.compliancePercentage)}%` }}
                              />
                            </div>
                          )}
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {metrics.executedAndVerified} verificadas de {metrics.totalAssigned} asignadas
                          </div>
                        </td>

                        <td className="p-3.5 text-center">
                          {getStatusBadge(report.status)}
                          {report.dueDate && report.status !== 'FINALIZADA' && (
                            <div className="text-[10px] text-slate-400 mt-1">
                              Vence: {report.dueDate}
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="font-mono text-[11px] font-bold text-slate-800">
                            {report.code}
                          </div>
                          {report.registeredInRepository ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                              <FolderArchive className="w-3 h-3" />
                              En Repositorio (2.2.1)
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Sin archivar aún</span>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedReportId(report.id);
                                setActiveTab('FORM');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 transition"
                            >
                              <span>Diligenciar</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>

                            {report.status === 'PENDIENTE_REVISION' && (
                              <button
                                onClick={() => handleOpenReviewModal(report)}
                                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition"
                              >
                                Revisar
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedReportId(report.id);
                                handlePrint('INDIVIDUAL');
                              }}
                              title="Imprimir / PDF individual"
                              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SUBTAB 2: FORMULARIO INDIVIDUAL DE RENDICIÓN DE CUENTAS */}
      {/* ============================================================== */}
      {activeTab === 'FORM' && currentReport && (
        <div className="space-y-6 print:hidden">
          
          {/* BARRA SUPERIOR: SELECTOR DE PERSONA Y ESTADO DEL FLUJO */}
          <div className="glass-card p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-600 shrink-0">Responsable a evaluar:</label>
              <select
                value={selectedReportId}
                onChange={(e) => setSelectedReportId(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {accountabilityState.reports
                  .filter(r => r.period === accountabilityState.currentPeriod)
                  .map(r => (
                    <option key={r.id} value={r.id}>
                      {r.workerName} — {r.workerPosition} ({r.code})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(currentReport.status)}

              <button
                onClick={() => handlePrint('INDIVIDUAL')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Generar Informe Individual en PDF</span>
              </button>
            </div>
          </div>

          {/* PERFIL DEL RESPONSABLE Y RESPONSABILIDADES FORMALES ASIGNADAS */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{currentReport.workerName}</h2>
                  {getRoleCategoryBadge(currentReport.roleCategory)}
                </div>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p><strong>Cargo formal:</strong> {currentReport.workerPosition} | <strong>Área:</strong> {currentReport.workerArea}</p>
                  <p><strong>Identificación:</strong> Cédula {currentReport.workerDocNumber}</p>
                  <p><strong>Rol en el SG-SST:</strong> <span className="text-orange-700 font-bold">{currentReport.sstRoleTitle}</span></p>
                </div>
              </div>

              {/* KPI CARD: DESEMPEÑO DEL TRABAJADOR */}
              {currentWorkerMetrics && (
                <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 lg:min-w-[280px]">
                  <div className="flex items-center justify-between text-[11px] font-bold text-orange-800 mb-1">
                    <span>Cumplimiento Plan Anual</span>
                    <span className="font-mono text-sm">{currentWorkerMetrics.complianceDisplay}</span>
                  </div>
                  <div className="w-full bg-orange-100 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, currentWorkerMetrics.compliancePercentage || 0)}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-orange-200/60 text-[10px] text-center">
                    <div>
                      <span className="block font-bold text-slate-700">{currentWorkerMetrics.totalAssigned}</span>
                      <span className="text-slate-500">Asignadas</span>
                    </div>
                    <div>
                      <span className="block font-bold text-emerald-700">{currentWorkerMetrics.executedAndVerified}</span>
                      <span className="text-slate-500">Verificadas</span>
                    </div>
                    <div>
                      <span className="block font-bold text-rose-700">{currentWorkerMetrics.overdueCount + currentWorkerMetrics.pendingCount}</span>
                      <span className="text-slate-500">Pendientes</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LISTA DE RESPONSABILIDADES FORMALES ASIGNADAS */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookmarkCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>Responsabilidades Específicas Asignadas en SST (Dec. 1072 Art. 2.2.4.6.8 Num. 2)</span>
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                {currentReport.assignedResponsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ============================================================ */}
          {/* DATOS IMPORTADOS AUTOMÁTICAMENTE DESDE EL PLAN ANUAL DE TRABAJO */}
          {/* ============================================================ */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200 uppercase">
                    Datos Importados Automáticamente
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Actividades del Plan Anual de Trabajo</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Se obtienen de los módulos de origen (capacitaciones, COPASST, inspecciones, presupuesto). No requiere doble digitación.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 font-mono">
                {currentWorkerActivities.length} actividades registradas
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-3">Código & Actividad</th>
                    <th className="p-3">Trimestre / Plazo</th>
                    <th className="p-3 text-center">Estado Ejecución</th>
                    <th className="p-3 text-center">Verificación</th>
                    <th className="p-3">Evidencias Vinculadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentWorkerActivities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400">
                        No hay actividades registradas en el Plan Anual para este responsable en la vigencia {accountabilityState.currentPeriod}.
                      </td>
                    </tr>
                  ) : (
                    currentWorkerActivities.map(act => (
                      <tr key={act.id} className="hover:bg-slate-50/50">
                        <td className="p-3 max-w-xs">
                          <div className="font-mono text-[10px] text-slate-400">{act.code}</div>
                          <div className="font-bold text-slate-900">{act.title}</div>
                          <div className="text-[10px] text-slate-500">{act.category}</div>
                        </td>

                        <td className="p-3">
                          <span className="font-bold text-slate-700">{act.quarter}</span>
                          <div className="text-[10px] text-slate-500">Vence: {act.dueDate}</div>
                        </td>

                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            act.executionStatus === 'EJECUTADA' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            act.executionStatus === 'PROGRAMADA' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            act.executionStatus === 'VENCIDA' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {act.executionStatus}
                          </span>
                        </td>

                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            act.verificationStatus === 'VERIFICADA_EFICAZ' ? 'bg-emerald-100 text-emerald-800' :
                            act.verificationStatus === 'PENDIENTE_VERIFICACION' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {act.verificationStatus === 'VERIFICADA_EFICAZ' ? 'Verificada con Soporte' :
                             act.verificationStatus === 'PENDIENTE_VERIFICACION' ? 'Pendiente Verificación' : 'Sin Verificar'}
                          </span>
                        </td>

                        <td className="p-3">
                          {act.evidenceFileNames.length > 0 ? (
                            <div className="space-y-0.5">
                              {act.evidenceFileNames.map((fn, idx) => (
                                <span key={idx} className="block text-[10px] font-mono text-teal-700 truncate max-w-[200px]" title={fn}>
                                  📎 {fn}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">Sin archivo adjunto</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CAMPOS A DILIGENCIAR POR EL RESPONSABLE (EXPLICACIONES Y GESTIÓN) */}
          {/* ============================================================ */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase">
                Diligenciamiento por el Responsable
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Explicaciones, Resultados, Dificultades y Compromisos
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              {/* 1. Descripción de la gestión realizada */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-bold text-slate-800 flex items-center justify-between">
                  <span>1. Descripción de la Gestión Realizada</span>
                  <span className="text-[10px] text-slate-400 font-normal">Resumen cualitativo de las actividades ejecutadas</span>
                </label>
                <textarea
                  rows={3}
                  value={currentReport.managementDescription}
                  onChange={(e) => handleFieldChange('managementDescription', e.target.value)}
                  placeholder="Detalle las acciones principales adelantadas en cumplimiento de sus responsabilidades..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              {/* 2. Resultados alcanzados */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center justify-between">
                  <span>2. Resultados y Metas Alcanzadas</span>
                  <span className="text-[10px] text-slate-400 font-normal">Impacto de la gestión en SST</span>
                </label>
                <textarea
                  rows={3}
                  value={currentReport.achievedResults}
                  onChange={(e) => handleFieldChange('achievedResults', e.target.value)}
                  placeholder="Ej: Cero accidentes graves, 100% de actas radicadas, 92% de cobertura..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              {/* 3. Actividades no ejecutadas y sus causas */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center justify-between">
                  <span>3. Actividades No Ejecutadas y sus Causas</span>
                  <span className="text-[10px] text-slate-400 font-normal">Justificación técnica obligatoria</span>
                </label>
                <textarea
                  rows={3}
                  value={currentReport.unexecutedCauses}
                  onChange={(e) => handleFieldChange('unexecutedCauses', e.target.value)}
                  placeholder="Si hubo actividades reprogramadas o pendientes, detalle los motivos..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              {/* 4. Dificultades presentadas */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">4. Dificultades u Obstáculos Presentados</label>
                <textarea
                  rows={2}
                  value={currentReport.difficultiesFaced}
                  onChange={(e) => handleFieldChange('difficultiesFaced', e.target.value)}
                  placeholder="Barreras operativas, de proveedores, tiempo o disponibilidad..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              {/* 5. Recursos requeridos o limitaciones */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">5. Recursos Requeridos o Limitaciones Presupuestales</label>
                <textarea
                  rows={2}
                  value={currentReport.resourcesRequired}
                  onChange={(e) => handleFieldChange('resourcesRequired', e.target.value)}
                  placeholder="Necesidades de presupuesto, herramientas, dotación o capacitación adicional..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              {/* 6. Incidentes y situaciones relevantes */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">6. Incidentes o Situaciones Relevantes en el Periodo</label>
                <textarea
                  rows={2}
                  value={currentReport.incidentHighlights}
                  onChange={(e) => handleFieldChange('incidentHighlights', e.target.value)}
                  placeholder="Conatos, condiciones inseguras críticas o intervenciones destacadas..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              {/* 7. Acciones correctivas o de mejora propuestas */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">7. Acciones Correctivas o de Mejora Propuestas (ACPM)</label>
                <textarea
                  rows={2}
                  value={currentReport.proposedImprovements}
                  onChange={(e) => handleFieldChange('proposedImprovements', e.target.value)}
                  placeholder="Planes de mejora para corregir no conformidades o elevar el estándar..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              {/* 8. Compromisos para el siguiente periodo */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-bold text-slate-800 flex items-center justify-between">
                  <span>8. Compromisos Adquiridos para el Siguiente Periodo</span>
                  <span className="text-[10px] text-orange-700 font-bold">Serán objeto de seguimiento en la próxima rendición</span>
                </label>
                <textarea
                  rows={2}
                  value={currentReport.commitmentsNextPeriod}
                  onChange={(e) => handleFieldChange('commitmentsNextPeriod', e.target.value)}
                  placeholder="Metas puntuales que el responsable se compromete a cumplir en la siguiente vigencia..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* SECCIÓN DE REVISIÓN Y OBSERVACIONES DEL EVALUADOR */}
            {currentReport.reviewedAt && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Revisión Jerárquica Realizada:</span>
                  <span className="text-[11px] font-mono text-slate-500">{currentReport.reviewedAt}</span>
                </div>
                <p className="text-slate-700 italic">
                  &quot;{currentReport.reviewerObservations}&quot;
                </p>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Revisado y aprobado por: <strong>{currentReport.reviewerName}</strong> ({currentReport.reviewerPosition})
                </div>
              </div>
            )}

            {/* BOTONES DE ACCIÓN DEL FLUJO */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Última actualización: {currentReport.completedAt || 'Borrador'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showNotification('Borrador de rendición de cuentas guardado exitosamente', 'info')}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Guardar Borrador
                </button>

                {currentReport.status !== 'FINALIZADA' && currentReport.status !== 'PENDIENTE_REVISION' && (
                  <button
                    type="button"
                    onClick={() => submitAccountabilityForReview(currentReport.id)}
                    className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar a Revisión Jerárquica</span>
                  </button>
                )}

                {currentReport.status === 'PENDIENTE_REVISION' && (
                  <button
                    type="button"
                    onClick={() => handleOpenReviewModal(currentReport)}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Revisar y Aprobar</span>
                  </button>
                )}

                {currentReport.status === 'FINALIZADA' && !currentReport.registeredInRepository && (
                  <button
                    type="button"
                    onClick={() => registerAccountabilityReportInRepository(currentReport.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <FolderArchive className="w-3.5 h-3.5" />
                    <span>Radicar en Repositorio (2.2.1)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. SUBTAB 3: PLAN ANUAL DE TRABAJO (ACTIVIDADES & EVIDENCIAS) */}
      {/* ============================================================== */}
      {activeTab === 'PAT_ACTIVITIES' && (
        <div className="space-y-6 print:hidden">
          <div className="glass-card p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Matriz de Actividades del Plan Anual de Trabajo (2026)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Consolidación de metas, cronograma, responsabilidades y estados de verificación conforme al Art. 2.2.4.6.8 Numeral 7.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={patWorkerFilter}
                onChange={(e) => setPatWorkerFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-700"
              >
                <option value="ALL">Todos los Responsables</option>
                {accountabilityState.reports.map(r => (
                  <option key={r.workerId} value={r.workerId}>{r.workerName}</option>
                ))}
              </select>

              <select
                value={patQuarterFilter}
                onChange={(e) => setPatQuarterFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-700"
              >
                <option value="ALL">Todos los Trimestres</option>
                <option value="Q1">Trimestre 1 (Q1)</option>
                <option value="Q2">Trimestre 2 (Q2)</option>
                <option value="Q3">Trimestre 3 (Q3)</option>
                <option value="Q4">Trimestre 4 (Q4)</option>
              </select>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Código & Actividad</th>
                    <th className="p-3.5">Responsable Asignado</th>
                    <th className="p-3.5">Proceso / Módulo</th>
                    <th className="p-3.5 text-center">Trimestre / Plazo</th>
                    <th className="p-3.5 text-center">Ejecución</th>
                    <th className="p-3.5 text-center">Verificación</th>
                    <th className="p-3.5">Soportes & Evidencias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accountabilityState.patActivities
                    .filter(a => {
                      if (patWorkerFilter !== 'ALL' && a.assignedWorkerId !== patWorkerFilter) return false;
                      if (patQuarterFilter !== 'ALL' && a.quarter !== patQuarterFilter) return false;
                      return true;
                    })
                    .map(act => (
                      <tr key={act.id} className="hover:bg-slate-50/60">
                        <td className="p-3.5 max-w-sm">
                          <div className="font-mono text-[10px] text-slate-400">{act.code}</div>
                          <div className="font-bold text-slate-900">{act.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{act.category}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-slate-800">{act.assignedWorkerName}</div>
                          <div className="text-[11px] text-slate-500">{act.assignedWorkerPosition}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="text-slate-700 font-medium">{act.processName}</div>
                          {act.originModule && (
                            <span className="text-[10px] text-slate-400">Origen: {act.originModule}</span>
                          )}
                        </td>

                        <td className="p-3.5 text-center">
                          <span className="font-bold text-slate-800">{act.quarter}</span>
                          <div className="text-[10px] text-slate-500">{act.dueDate}</div>
                        </td>

                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            act.executionStatus === 'EJECUTADA' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            act.executionStatus === 'PROGRAMADA' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            act.executionStatus === 'VENCIDA' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {act.executionStatus}
                          </span>
                        </td>

                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            act.verificationStatus === 'VERIFICADA_EFICAZ' ? 'bg-emerald-100 text-emerald-800' :
                            act.verificationStatus === 'PENDIENTE_VERIFICACION' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {act.verificationStatus === 'VERIFICADA_EFICAZ' ? 'Verificada' :
                             act.verificationStatus === 'PENDIENTE_VERIFICACION' ? 'Por Verificar' : 'Sin Verificar'}
                          </span>
                        </td>

                        <td className="p-3.5">
                          {act.evidenceFileNames.length > 0 ? (
                            <div className="space-y-0.5">
                              {act.evidenceFileNames.map((fn, idx) => (
                                <span key={idx} className="block text-[10px] font-mono text-teal-700 truncate max-w-[200px]" title={fn}>
                                  📎 {fn}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">Sin archivo adjunto</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. SUBTAB 4: INFORME CONSOLIDADO CORPORATIVO ANUAL */}
      {/* ============================================================== */}
      {activeTab === 'CONSOLIDATED' && latestConsolidated && (
        <div className="space-y-6 print:hidden">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-900 text-white font-mono">
                    {latestConsolidated.code}
                  </span>
                  <h2 className="text-lg font-black text-slate-900">
                    Informe Consolidado Anual de Rendición de Cuentas en SST
                  </h2>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Vigencia: {latestConsolidated.period} • Generado el {latestConsolidated.generatedAt}
                </p>
              </div>

              <button
                onClick={() => handlePrint('CONSOLIDATED')}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-500 text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Exportar a PDF</span>
              </button>
            </div>

            {/* RESUMEN CUANTITATIVO */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl font-black text-slate-900">{latestConsolidated.totalEligibleWorkers}</span>
                <span className="block text-xs text-slate-500 mt-1">Cargos en Alcance</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-2xl font-black text-emerald-700">{latestConsolidated.completedCount}</span>
                <span className="block text-xs text-emerald-600 mt-1">Rendiciones Finalizadas</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-2xl font-black text-amber-700">
                  {latestConsolidated.inReviewCount + latestConsolidated.inProgressCount}
                </span>
                <span className="block text-xs text-amber-600 mt-1">En Proceso / Revisión</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-2xl font-black text-rose-700">{latestConsolidated.pendingCount}</span>
                <span className="block text-xs text-rose-600 mt-1">Pendientes de Iniciar</span>
              </div>
            </div>

            {/* BRECHAS IDENTIFICADAS Y COMPROMISOS ESTRATÉGICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
                <h4 className="font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Principales Brechas y Dificultades Detectadas</span>
                </h4>
                <ul className="space-y-1.5 text-rose-950">
                  {latestConsolidated.keyGapsIdentified.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2">
                <h4 className="font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span>Compromisos Estratégicos para Revisión por Dirección</span>
                </h4>
                <ul className="space-y-1.5 text-teal-950">
                  {latestConsolidated.strategicCommitments.map((com, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-500 font-bold">✓</span>
                      <span>{com}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FIRMA DE GERENCIA GENERAL */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-800">Aval y Constancia de Gerencia General:</span>
                <p className="text-slate-600 mt-0.5">
                  Suscrito por <strong>{latestConsolidated.managerName}</strong> • {latestConsolidated.managerSignedAt}
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span>Firmado Electrónicamente</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. MODAL DE REVISIÓN Y APROBACIÓN JERÁRQUICA */}
      {/* ============================================================== */}
      {isReviewModalOpen && reviewReportTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-sm">Revisión Jerárquica de Rendición de Cuentas</h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>Responsable:</strong> {reviewReportTarget.workerName}</p>
              <p><strong>Cargo:</strong> {reviewReportTarget.workerPosition} ({reviewReportTarget.sstRoleTitle})</p>
              <p><strong>Periodo evaluado:</strong> {reviewReportTarget.period}</p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800">Observaciones y Retroalimentación del Evaluador:</label>
              <textarea
                rows={4}
                value={reviewObservations}
                onChange={(e) => setReviewObservations(e.target.value)}
                placeholder="Registre el concepto sobre el desempeño en SST, los logros alcanzados o las correcciones exigidas..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-3 text-xs pt-1">
              <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800">
                <input
                  type="radio"
                  name="reviewDecision"
                  checked={reviewApproved}
                  onChange={() => setReviewApproved(true)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Aprobar y Finalizar Formalmente</span>
              </label>

              <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800">
                <input
                  type="radio"
                  name="reviewDecision"
                  checked={!reviewApproved}
                  onChange={() => setReviewApproved(false)}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>Devolver para Ajustes</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow"
              >
                Guardar Decisión y Firmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. VISTA DE IMPRESIÓN / EXPORTACIÓN LIMPIA A PDF (INDIVIDUAL) */}
      {/* ============================================================== */}
      <div className={`hidden ${printMode === 'INDIVIDUAL' ? 'print:block' : ''} p-8 max-w-4xl mx-auto bg-white text-slate-900 font-sans`}>
        {currentReport && (
          <div className="space-y-6">
            
            {/* ENCABEZADO CORPORATIVO OFICIAL */}
            <div className="border border-slate-300 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-orange-600 text-white font-black text-xl flex items-center justify-center">
                  AG
                </div>
                <div>
                  <h1 className="font-black text-sm uppercase tracking-tight">{organization.name}</h1>
                  <p className="text-[10px] text-slate-600 font-mono">NIT: {organization.nit}</p>
                  <p className="text-[10px] text-slate-600">Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)</p>
                </div>
              </div>

              <div className="text-right text-[10px] font-mono border-l pl-4 border-slate-200">
                <p><strong>CÓDIGO:</strong> {currentReport.code}</p>
                <p><strong>VERSIÓN:</strong> 001</p>
                <p><strong>VIGENCIA:</strong> {currentReport.period}</p>
                <p><strong>ESTÁNDAR:</strong> 2.3.1 (Res. 0312/2019)</p>
              </div>
            </div>

            <div className="text-center py-2 border-b border-slate-300">
              <h2 className="text-base font-black uppercase text-slate-900">
                INFORME INDIVIDUAL DE RENDICIÓN DE CUENTAS SOBRE EL DESEMPEÑO EN SST
              </h2>
              <p className="text-[11px] text-slate-600">
                En cumplimiento del Decreto 1072 de 2015 Art. 2.2.4.6.8 Numeral 3
              </p>
            </div>

            {/* DATOS DEL EVALUADO */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-3 rounded bg-slate-50">
              <div>
                <p><strong>Nombre del Responsable:</strong> {currentReport.workerName}</p>
                <p><strong>Cédula de Ciudadanía:</strong> {currentReport.workerDocNumber}</p>
                <p><strong>Cargo Formal:</strong> {currentReport.workerPosition}</p>
              </div>
              <div>
                <p><strong>Área / Proceso:</strong> {currentReport.workerArea}</p>
                <p><strong>Rol en el SG-SST:</strong> {currentReport.sstRoleTitle}</p>
                <p><strong>Periodo Evaluado:</strong> Vigencia {currentReport.period}</p>
              </div>
            </div>

            {/* RESPONSABILIDADES ASIGNADAS */}
            <div className="space-y-1.5 text-xs">
              <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                1. RESPONSABILIDADES FORMALES ASIGNADAS EN SST
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px]">
                {currentReport.assignedResponsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>

            {/* RESULTADOS DEL PLAN ANUAL DE TRABAJO */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <h3 className="font-bold text-slate-900">
                  2. RESULTADOS DEL PLAN ANUAL DE TRABAJO EN EL PERIODO
                </h3>
                {currentWorkerMetrics && (
                  <span className="font-mono font-bold text-slate-900 text-[11px]">
                    Cumplimiento: {currentWorkerMetrics.complianceDisplay}
                  </span>
                )}
              </div>

              <table className="w-full text-left text-[10px] border border-slate-300">
                <thead className="bg-slate-100 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-1.5">Actividad Programada</th>
                    <th className="p-1.5">Plazo</th>
                    <th className="p-1.5 text-center">Estado</th>
                    <th className="p-1.5 text-center">Verificación</th>
                    <th className="p-1.5">Evidencias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentWorkerActivities.map(act => (
                    <tr key={act.id}>
                      <td className="p-1.5 font-medium">{act.title}</td>
                      <td className="p-1.5">{act.dueDate}</td>
                      <td className="p-1.5 text-center">{act.executionStatus}</td>
                      <td className="p-1.5 text-center">{act.verificationStatus}</td>
                      <td className="p-1.5 font-mono text-[9px]">{act.evidenceFileNames.join(', ') || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-[9px] text-slate-500 italic mt-1">
                * Aviso Legal: El porcentaje refleja la ejecución de actividades asignadas en el Plan Anual. No constituye una calificación laboral general.
              </p>
            </div>

            {/* NARRATIVA Y EXPLICACIONES */}
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-slate-900">3. DESCRIPCIÓN DE LA GESTIÓN REALIZADA:</h4>
                <p className="text-[11px] text-slate-700 mt-0.5 whitespace-pre-line bg-slate-50 p-2 rounded border border-slate-200">
                  {currentReport.managementDescription || 'Sin registrar.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900">4. RESULTADOS ALCANZADOS:</h4>
                <p className="text-[11px] text-slate-700 mt-0.5 whitespace-pre-line bg-slate-50 p-2 rounded border border-slate-200">
                  {currentReport.achievedResults || 'Sin registrar.'}
                </p>
              </div>

              {currentReport.unexecutedCauses && (
                <div>
                  <h4 className="font-bold text-slate-900">5. ACTIVIDADES NO EJECUTADAS Y CAUSAS:</h4>
                  <p className="text-[11px] text-slate-700 mt-0.5 whitespace-pre-line bg-slate-50 p-2 rounded border border-slate-200">
                    {currentReport.unexecutedCauses}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-900">6. COMPROMISOS ADQUIRIDOS PARA EL SIGUIENTE PERIODO:</h4>
                <p className="text-[11px] text-slate-700 mt-0.5 whitespace-pre-line bg-slate-50 p-2 rounded border border-slate-200">
                  {currentReport.commitmentsNextPeriod || 'Sin registrar.'}
                </p>
              </div>

              {currentReport.reviewerObservations && (
                <div>
                  <h4 className="font-bold text-slate-900">7. CONCEPTO Y EVALUACIÓN DE LA DIRECCIÓN:</h4>
                  <p className="text-[11px] text-slate-700 mt-0.5 whitespace-pre-line bg-slate-50 p-2 rounded border border-slate-200">
                    {currentReport.reviewerObservations}
                  </p>
                </div>
              )}
            </div>

            {/* SECCIÓN DE FIRMAS ELECTRÓNICAS */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 text-xs">
              <div className="space-y-1">
                <div className="border-b border-slate-400 pb-8 text-center text-slate-400 italic">
                  {currentReport.workerSignatureToken ? (
                    <div className="text-emerald-700 font-mono text-[10px] font-bold">
                      FIRMADO ELECTRÓNICAMENTE<br />
                      TOKEN: {currentReport.workerSignatureToken}<br />
                      FECHA: {currentReport.workerSignedAt}
                    </div>
                  ) : '[Pendiente de Firma]'}
                </div>
                <p className="font-bold text-slate-900">{currentReport.workerName}</p>
                <p className="text-[11px] text-slate-600">{currentReport.workerPosition}</p>
                <p className="text-[10px] text-slate-500">Responsable Titular Evaluado</p>
              </div>

              <div className="space-y-1">
                <div className="border-b border-slate-400 pb-8 text-center text-slate-400 italic">
                  {currentReport.reviewerSignatureToken ? (
                    <div className="text-emerald-700 font-mono text-[10px] font-bold">
                      FIRMADO ELECTRÓNICAMENTE<br />
                      TOKEN: {currentReport.reviewerSignatureToken}<br />
                      FECHA: {currentReport.reviewerSignedAt}
                    </div>
                  ) : '[Pendiente de Aprobación]'}
                </div>
                <p className="font-bold text-slate-900">{currentReport.reviewerName || 'Lic. Fernando Ortiz Salazar'}</p>
                <p className="text-[11px] text-slate-600">{currentReport.reviewerPosition || 'Gerencia General'}</p>
                <p className="text-[10px] text-slate-500">Revisó y Aprobó en la Organización</p>
              </div>
            </div>

            <div className="text-center pt-4 text-[9px] text-slate-400 font-mono">
              Documento expedido y custodiado por AGAE SOLUTIONS • Registro en Repositorio Central {currentReport.code}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 8. VISTA DE IMPRESIÓN / EXPORTACIÓN LIMPIA A PDF (CONSOLIDADO) */}
      {/* ============================================================== */}
      <div className={`hidden ${printMode === 'CONSOLIDATED' ? 'print:block' : ''} p-8 max-w-4xl mx-auto bg-white text-slate-900 font-sans`}>
        {latestConsolidated && (
          <div className="space-y-6">
            <div className="border border-slate-300 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-orange-600 text-white font-black text-xl flex items-center justify-center">
                  AG
                </div>
                <div>
                  <h1 className="font-black text-sm uppercase tracking-tight">{organization.name}</h1>
                  <p className="text-[10px] text-slate-600 font-mono">NIT: {organization.nit}</p>
                  <p className="text-[10px] text-slate-600">Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)</p>
                </div>
              </div>

              <div className="text-right text-[10px] font-mono border-l pl-4 border-slate-200">
                <p><strong>CÓDIGO:</strong> {latestConsolidated.code}</p>
                <p><strong>VIGENCIA:</strong> {latestConsolidated.period}</p>
                <p><strong>FECHA:</strong> {latestConsolidated.generatedAt}</p>
              </div>
            </div>

            <div className="text-center py-2 border-b border-slate-300">
              <h2 className="text-base font-black uppercase text-slate-900">
                INFORME CONSOLIDADO ANUAL DE RENDICIÓN DE CUENTAS SOBRE EL DESEMPEÑO EN SST
              </h2>
              <p className="text-[11px] text-slate-600">
                Consolidado Corporativo Multiescala - Decreto 1072 de 2015 Art. 2.2.4.6.8 Numeral 3
              </p>
            </div>

            {/* TABLA DE PARTICIPANTES Y ESTADO */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                1. ESTADO DE RENDICIÓN DE CUENTAS POR RESPONSABLE
              </h3>
              <table className="w-full text-left text-[10px] border border-slate-300">
                <thead className="bg-slate-100 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-1.5">Responsable</th>
                    <th className="p-1.5">Cargo / Rol en SST</th>
                    <th className="p-1.5 text-center">Cumplimiento PAT</th>
                    <th className="p-1.5 text-center">Estado</th>
                    <th className="p-1.5">Código Documento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {accountabilityState.reports
                    .filter(r => r.period === latestConsolidated.period)
                    .map(r => {
                      const m = calculateWorkerPatMetrics(
                        accountabilityState.patActivities,
                        r.workerId,
                        r.period
                      );
                      return (
                        <tr key={r.id}>
                          <td className="p-1.5 font-bold">{r.workerName}</td>
                          <td className="p-1.5">{r.workerPosition} ({r.sstRoleTitle})</td>
                          <td className="p-1.5 text-center font-mono">{m.complianceDisplay}</td>
                          <td className="p-1.5 text-center font-semibold">{r.status}</td>
                          <td className="p-1.5 font-mono">{r.code}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* BRECHAS Y COMPROMISOS */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 border border-slate-300 rounded bg-slate-50 space-y-1.5">
                <h4 className="font-bold text-slate-900">2. PRINCIPALES BRECHAS IDENTIFICADAS:</h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                  {latestConsolidated.keyGapsIdentified.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 border border-slate-300 rounded bg-slate-50 space-y-1.5">
                <h4 className="font-bold text-slate-900">3. COMPROMISOS CORPORATIVOS:</h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                  {latestConsolidated.strategicCommitments.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CIERRE Y FIRMA */}
            <div className="pt-8 border-t border-slate-300 text-xs">
              <div className="max-w-xs mx-auto text-center space-y-1">
                <div className="border-b border-slate-400 pb-6 text-emerald-700 font-mono text-[10px] font-bold">
                  FIRMADO DIGITALMENTE POR GERENCIA GENERAL<br />
                  FECHA: {latestConsolidated.managerSignedAt || latestConsolidated.generatedAt}
                </div>
                <p className="font-bold text-slate-900">{latestConsolidated.managerName}</p>
                <p className="text-[11px] text-slate-600">Representante Legal & Empleador</p>
                <p className="text-[10px] text-slate-500">{organization.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
