'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '@/lib/store';
import {
  Scale,
  FileText,
  BarChart3,
  Bell,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Building2,
  FolderArchive,
  BookOpen,
  Info,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  Edit3,
  Trash2,
  RefreshCw,
  Check,
  X,
  FileCheck,
  Award,
  ArrowRight,
  BookmarkCheck,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Shield,
  FileSignature
} from 'lucide-react';
import {
  LegalRequirementItem,
  NormativeTopicCategory,
  LegalNormJuridicalStatus,
  LegalApplicabilityStatus,
  LegalComplianceStatus,
  NormativeJurisdiction,
  NormativeLegalType,
  ControlExecutionFrequency,
  ControlImplementationStatus
} from '@/types/legal-matrix';
import { TOPIC_LABELS } from '@/lib/legal-matrix-mock';

interface LegalMatrixModuleProps {
  initialSubTab?: 'MATRIX' | 'PROCEDURE' | 'DASHBOARD' | 'ALERTS';
  onNavigateToTab?: (tab: string) => void;
}

export const LegalMatrixModule: React.FC<LegalMatrixModuleProps> = ({
  initialSubTab = 'MATRIX',
  onNavigateToTab
}) => {
  const {
    organization,
    characterization,
    legalMatrixState,
    updateLegalRequirement,
    addLegalRequirement,
    deleteLegalRequirement,
    evaluateLegalRequirement,
    updateLegalProcedureSection,
    resetLegalProcedureSectionToDefault,
    approveLegalProcedure,
    registerLegalMatrixInRepository,
    showNotification
  } = useApp();

  // Navigation Subtabs
  const [activeSubTab, setActiveSubTab] = useState<'MATRIX' | 'PROCEDURE' | 'DASHBOARD' | 'ALERTS'>(initialSubTab);

  // Filters & Search for Matrix Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [juridicalStatusFilter, setJuridicalStatusFilter] = useState<string>('ALL');
  const [applicabilityFilter, setApplicabilityFilter] = useState<string>('ALL');
  const [complianceFilter, setComplianceFilter] = useState<string>('ALL');
  const [systemFilter, setSystemFilter] = useState<string>('ALL');

  // Selected Requirement for Details / Evaluation
  const [selectedRequirement, setSelectedRequirement] = useState<LegalRequirementItem | null>(null);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isNewNormModalOpen, setIsNewNormModalOpen] = useState(false);
  const [isDiagnosticReportModalOpen, setIsDiagnosticReportModalOpen] = useState(false);

  // Evaluation Form State
  const [evalForm, setEvalForm] = useState<{
    complianceStatus: LegalComplianceStatus;
    evidenceExisting: string;
    evidenceEvaluationNotes: string;
    evaluatorName: string;
    evaluationDate: string;
    findings: string;
    improvementAction: string;
  }>({
    complianceStatus: 'CUMPLE',
    evidenceExisting: '',
    evidenceEvaluationNotes: '',
    evaluatorName: 'Marcela Rincón Ortiz',
    evaluationDate: new Date().toISOString().substring(0, 10),
    findings: '',
    improvementAction: ''
  });

  // Procedure Active Section for Editing
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionContent, setEditingSectionContent] = useState('');

  // Procedure Approval Modal
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalApproverName, setApprovalApproverName] = useState('Lic. Fernando Ortiz Salazar');
  const [approvalApproverPosition, setApprovalApproverPosition] = useState('Representante Legal / Gerente General');

  // Print Ref for Clean Views
  const printContentRef = useRef<HTMLDivElement>(null);

  // Filtered Requirements
  const filteredRequirements = useMemo(() => {
    return legalMatrixState.requirements.filter(req => {
      // Search
      const matchesSearch =
        !searchQuery ||
        req.internalCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.normNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.specificLegalObligation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.applicableArticles.toLowerCase().includes(searchQuery.toLowerCase());

      // Topic Filter
      const matchesTopic = topicFilter === 'ALL' || req.topicCategory === topicFilter;

      // Juridical Status Filter
      const matchesJuridical = juridicalStatusFilter === 'ALL' || req.juridicalStatus === juridicalStatusFilter;

      // Applicability Filter
      const matchesApplicability = applicabilityFilter === 'ALL' || req.applicabilityStatus === applicabilityFilter;

      // Compliance Filter
      const matchesCompliance = complianceFilter === 'ALL' || req.complianceStatus === complianceFilter;

      // System Filter
      const matchesSystem = systemFilter === 'ALL' || req.system === systemFilter;

      return matchesSearch && matchesTopic && matchesJuridical && matchesApplicability && matchesCompliance && matchesSystem;
    });
  }, [
    legalMatrixState.requirements,
    searchQuery,
    topicFilter,
    juridicalStatusFilter,
    applicabilityFilter,
    complianceFilter,
    systemFilter
  ]);

  // Open Evaluation Modal
  const handleOpenEvaluation = (req: LegalRequirementItem) => {
    setSelectedRequirement(req);
    setEvalForm({
      complianceStatus: req.complianceStatus === 'PENDIENTE_EVALUACION' ? 'CUMPLE' : req.complianceStatus,
      evidenceExisting: req.existingEvidenceDescription || '',
      evidenceEvaluationNotes: req.evidenceEvaluationNotes || '',
      evaluatorName: req.evaluatorName || 'Marcela Rincón Ortiz',
      evaluationDate: new Date().toISOString().substring(0, 10),
      findings: req.findingsOrObservations || '',
      improvementAction: req.improvementActionDescription || ''
    });
    setIsEvaluationModalOpen(true);
  };

  // Submit Evaluation
  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequirement) return;

    evaluateLegalRequirement(selectedRequirement.id, {
      complianceStatus: evalForm.complianceStatus,
      evidenceExisting: evalForm.evidenceExisting,
      evidenceEvaluationNotes: evalForm.evidenceEvaluationNotes,
      evaluatorName: evalForm.evaluatorName,
      evaluationDate: evalForm.evaluationDate,
      findings: evalForm.findings,
      improvementAction: evalForm.improvementAction
    });

    setIsEvaluationModalOpen(false);
    setSelectedRequirement(null);
  };

  // Save Procedure Section Edit
  const handleSaveSectionEdit = (sectionId: string) => {
    updateLegalProcedureSection(sectionId, editingSectionContent);
    setEditingSectionId(null);
    showNotification('Sección del procedimiento actualizada correctamente', 'success');
  };

  // Reset Section to Default
  const handleResetSection = (sectionId: string) => {
    resetLegalProcedureSectionToDefault(sectionId);
    setEditingSectionId(null);
  };

  // Handle Procedure Approval
  const handleApproveProcedureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    approveLegalProcedure(approvalApproverName, approvalApproverPosition);
    setIsApprovalModalOpen(false);
  };

  // Print Matrix or Diagnostic
  const handlePrint = () => {
    window.print();
  };

  // Export Matrix to CSV
  const handleExportCsv = () => {
    const headers = [
      'Código',
      'Tipo',
      'Número',
      'Año',
      'Emisor',
      'Tema',
      'Artículos',
      'Obligación Específica',
      'Estado Jurídico',
      'Aplicabilidad',
      'Estado Cumplimiento',
      'Responsable',
      'Control Requerido',
      'Evidencia Requerida',
      'Evidencia Existente',
      'Última Evaluación',
      'Próxima Revisión'
    ];

    const rows = filteredRequirements.map(r => [
      `"${r.internalCode}"`,
      `"${r.normType}"`,
      `"${r.normNumber}"`,
      `"${r.normYear}"`,
      `"${r.issuingAuthority}"`,
      `"${TOPIC_LABELS[r.topicCategory] || r.topicCategory}"`,
      `"${r.applicableArticles.replace(/"/g, '""')}"`,
      `"${r.specificLegalObligation.replace(/"/g, '""')}"`,
      `"${r.juridicalStatus}"`,
      `"${r.applicabilityStatus}"`,
      `"${r.complianceStatus}"`,
      `"${r.responsibleRole}"`,
      `"${r.requiredControlDescription.replace(/"/g, '""')}"`,
      `"${r.requiredEvidence.replace(/"/g, '""')}"`,
      `"${(r.existingEvidenceDescription || '').replace(/"/g, '""')}"`,
      `"${r.lastEvaluationDate || 'Sin evaluar'}"`,
      `"${r.nextReviewDate || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Matriz_Requisitos_Legales_${organization.name.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Matriz exportada exitosamente a formato CSV / Excel', 'success');
  };

  // Quick stats
  const metrics = legalMatrixState.metrics;

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* HEADER CORPORATIVO CON METADATOS Y ACCIONES PRINCIPALES */}
      {/* ------------------------------------------------------------- */}
      <div className="glass-card p-6 rounded-2xl border border-slate-300 shadow-sm bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <Scale className="w-3 h-3 text-indigo-300" />
                Estándar 2.4.1 • Res. 0312/2019
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Decreto 1072/15 Art. 2.2.4.6.8 y 2.2.4.6.12 Num. 15
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-white/10 text-slate-300">
                MT-SGSST-LEG-001 • PR-SGSST-LEG-001
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Matriz Inteligente de Requisitos Legales
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-3xl leading-relaxed">
              Identificación dinámica por perfil de empresa ({organization.economicActivity} • Clase {organization.riskLevelArl} • {characterization.size.totalTrabajadores} trabajadores), procedimiento de 18 secciones editable, distinción estricta de vigencia jurídica vs cumplimiento y cálculo transparente numerador / denominador.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsDiagnosticReportModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <FileCheck className="w-4 h-4" />
              <span>Generar Diagnóstico en PDF</span>
            </button>
            <button
              onClick={() => registerLegalMatrixInRepository('MATRIZ')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all active:scale-95"
              title="Registrar en Repositorio Documental Central 2.2.1"
            >
              <FolderArchive className="w-4 h-4 text-indigo-300" />
              <span>Archivar en Repositorio (2.2.1)</span>
            </button>
          </div>
        </div>

        {/* Subtabs Navigation Bar */}
        <div className="flex flex-wrap items-center gap-1 mt-6 pt-4 border-t border-indigo-900/50">
          <button
            onClick={() => setActiveSubTab('MATRIX')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'MATRIX'
                ? 'bg-white text-indigo-950 shadow-md font-black'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Matriz de Requisitos ({legalMatrixState.requirements.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('PROCEDURE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'PROCEDURE'
                ? 'bg-white text-indigo-950 shadow-md font-black'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Procedimiento Documentado (18 Secciones)</span>
            {legalMatrixState.procedure.status === 'VIGENTE' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('DASHBOARD')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'DASHBOARD'
                ? 'bg-white text-indigo-950 shadow-md font-black'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard & Diagnóstico</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/40 text-indigo-100 font-mono">
              {metrics.compliancePercentage !== null ? metrics.compliancePercentage.toFixed(0) : '0'}%
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('ALERTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'ALERTS'
                ? 'bg-white text-indigo-950 shadow-md font-black'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Seguimiento a Cambios Normativos</span>
            {legalMatrixState.alerts.some(a => Boolean(a.actionRequired)) && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                {legalMatrixState.alerts.filter(a => Boolean(a.actionRequired)).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* KPI METRIC STRIP (VISIBLE ON RELEVANT TABS) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Normas Registradas</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-slate-900">{metrics.totalNormsRegistered}</span>
            <span className="text-[10px] text-indigo-600 font-medium">{metrics.activeNormsCount} vigentes</span>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Obligaciones Aplicables</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-indigo-900">{metrics.totalApplicableObligations}</span>
            <span className="text-[10px] text-slate-500">{metrics.evaluatedObligationsCount} evaluadas</span>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Cumplimiento Real</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-emerald-700">{metrics.compliantCount}</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
              {metrics.compliancePercentage !== null ? metrics.compliancePercentage.toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Cumplen Parcial</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-amber-700">{metrics.partiallyCompliantCount}</span>
            <span className="text-[10px] text-amber-700 font-medium">Controles en curso</span>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">No Cumplen</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-rose-700">{metrics.nonCompliantCount}</span>
            <span className="text-[10px] text-rose-700 font-medium">{metrics.pendingAcpmCount} con ACPM</span>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Pendientes Evaluar</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-slate-700">{metrics.pendingEvaluationCount}</span>
            <span className="text-[10px] text-slate-500">Sin calificar</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 1: MATRIZ DE REQUISITOS LEGALES */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'MATRIX' && (
        <div className="space-y-4">
          {/* Controls Bar: Search & Filters */}
          <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por norma, número, año, entidad emisora, artículos u obligación legal..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  title="Exportar registros filtrados a CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exportar CSV</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  title="Imprimir vista de matriz"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Imprimir</span>
                </button>
              </div>
            </div>

            {/* Filter pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Materia / Tema
                </label>
                <select
                  value={topicFilter}
                  onChange={e => setTopicFilter(e.target.value)}
                  className="w-full text-xs py-1.5 px-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ALL">Todos los temas</option>
                  {Object.entries(TOPIC_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{String(label)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Estado Jurídico
                </label>
                <select
                  value={juridicalStatusFilter}
                  onChange={e => setJuridicalStatusFilter(e.target.value)}
                  className="w-full text-xs py-1.5 px-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ALL">Cualquier vigencia</option>
                  <option value="VIGENTE">Vigente</option>
                  <option value="VIGENTE_MODIFICADA">Vigente con modificaciones</option>
                  <option value="DEROGADA_TOTAL">Derogada totalmente</option>
                  <option value="DEROGADA_PARCIAL">Derogada parcialmente</option>
                  <option value="SUSTITUIDA">Sustituida</option>
                  <option value="SUSPENDIDA">Suspendida</option>
                  <option value="PENDIENTE_VERIFICACION">Pendiente de verificación</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Aplicabilidad Empresa
                </label>
                <select
                  value={applicabilityFilter}
                  onChange={e => setApplicabilityFilter(e.target.value)}
                  className="w-full text-xs py-1.5 px-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ALL">Todas las normas</option>
                  <option value="APLICA">Aplica directamente</option>
                  <option value="APLICA_PARCIAL">Aplica parcialmente</option>
                  <option value="NO_APLICA">No aplica (justificado)</option>
                  <option value="PENDIENTE_ANALISIS">Pendiente de análisis</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Cumplimiento Legal
                </label>
                <select
                  value={complianceFilter}
                  onChange={e => setComplianceFilter(e.target.value)}
                  className="w-full text-xs py-1.5 px-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="CUMPLE">Cumple (100%)</option>
                  <option value="CUMPLE_PARCIAL">Cumple parcialmente</option>
                  <option value="NO_CUMPLE">No cumple</option>
                  <option value="PENDIENTE_EVALUACION">Pendiente de evaluación</option>
                  <option value="NO_APLICA_JUSTIFICADO">No aplica justificado</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Sistema de Gestión
                </label>
                <select
                  value={systemFilter}
                  onChange={e => setSystemFilter(e.target.value)}
                  className="w-full text-xs py-1.5 px-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ALL">SST, Vial & Ambiental</option>
                  <option value="SST">SG-SST (Laboral)</option>
                  <option value="PESV">PESV (Seguridad Vial)</option>
                  <option value="AMBIENTAL">Gestión Ambiental</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table of Legal Requirements */}
          <div className="glass-card rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Mostrando <strong className="text-indigo-900">{filteredRequirements.length}</strong> de {legalMatrixState.requirements.length} requisitos normativos
              </span>
              <span className="text-[11px] text-slate-500">
                Frecuencia oficial de revisión: <strong>Trimestral</strong> (o extraordinaria ante reformas)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5">Código / Norma</th>
                    <th className="py-3 px-3.5">Entidad & Título</th>
                    <th className="py-3 px-3.5">Disposiciones / Artículos</th>
                    <th className="py-3 px-3.5">Obligación Específica</th>
                    <th className="py-3 px-3.5">Vigencia Jurídica</th>
                    <th className="py-3 px-3.5">Aplicabilidad</th>
                    <th className="py-3 px-3.5">Cumplimiento</th>
                    <th className="py-3 px-3.5">Evidencia Vinculada</th>
                    <th className="py-3 px-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequirements.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <Scale className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-medium">No se encontraron requisitos legales con los filtros seleccionados.</p>
                        <p className="text-[11px] text-slate-400 mt-1">Prueba ajustando los términos de búsqueda o los criterios de filtrado.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRequirements.map(req => {
                      const isDerogated = req.juridicalStatus === 'DEROGADA_TOTAL' || req.juridicalStatus === 'DEROGADA_PARCIAL';
                      return (
                        <tr
                          key={req.id}
                          className={`hover:bg-indigo-50/40 transition-colors ${
                            isDerogated ? 'bg-slate-50/70 text-slate-500' : ''
                          }`}
                        >
                          {/* Código & Tipo de Norma */}
                          <td className="py-3 px-3.5 align-top">
                            <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 block w-max">
                              {req.internalCode}
                            </span>
                            <span className="font-black text-slate-900 block mt-1">
                              {req.normType} {req.normNumber} de {req.normYear}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {TOPIC_LABELS[req.topicCategory] || req.topicCategory}
                            </span>
                          </td>

                          {/* Entidad & Título */}
                          <td className="py-3 px-3.5 align-top max-w-[200px]">
                            <span className="text-[11px] font-bold text-slate-700 block line-clamp-1">
                              {req.issuingAuthority}
                            </span>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5" title={req.title}>
                              {req.title}
                            </p>
                            {req.officialSourceUrl && (
                              <a
                                href={req.officialSourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 underline mt-1"
                              >
                                <span>Fuente oficial</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </td>

                          {/* Disposiciones aplicables */}
                          <td className="py-3 px-3.5 align-top font-mono text-[11px] text-slate-700 max-w-[140px]">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 block w-max">
                              {req.applicableArticles}
                            </span>
                          </td>

                          {/* Obligación legal específica */}
                          <td className="py-3 px-3.5 align-top max-w-[280px]">
                            <p className="text-xs text-slate-800 leading-snug line-clamp-3">
                              {req.specificLegalObligation}
                            </p>
                            <span className="text-[10px] text-slate-500 block mt-1">
                              Resp: <strong>{req.responsibleRole}</strong>
                            </span>
                          </td>

                          {/* Vigencia Jurídica */}
                          <td className="py-3 px-3.5 align-top">
                            {req.juridicalStatus === 'VIGENTE' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 block w-max">
                                Vigente
                              </span>
                            )}
                            {req.juridicalStatus === 'VIGENTE_MODIFICADA' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 block w-max" title={req.derogatedOrModifiedBy}>
                                Vigente modif.
                              </span>
                            )}
                            {(req.juridicalStatus === 'DEROGADA_TOTAL' || req.juridicalStatus === 'DEROGADA_PARCIAL') && (
                              <div>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 border border-slate-300 block w-max">
                                  {req.juridicalStatus === 'DEROGADA_TOTAL' ? 'Derogada Total' : 'Derogada Parcial'}
                                </span>
                                {req.derogatedOrModifiedBy && (
                                  <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1" title={req.derogatedOrModifiedBy}>
                                    Por: {req.derogatedOrModifiedBy}
                                  </span>
                                )}
                              </div>
                            )}
                            {req.juridicalStatus === 'SUSTITUIDA' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300 block w-max">
                                Sustituida
                              </span>
                            )}
                            {req.juridicalStatus === 'PENDIENTE_VERIFICACION' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 block w-max">
                                Pendiente juríd.
                              </span>
                            )}
                          </td>

                          {/* Aplicabilidad Empresa */}
                          <td className="py-3 px-3.5 align-top">
                            {req.applicabilityStatus === 'APLICA' && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 block w-max">
                                Aplica (100%)
                              </span>
                            )}
                            {req.applicabilityStatus === 'APLICA_PARCIAL' && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 block w-max" title={req.applicabilityJustification}>
                                Aplica Parcial
                              </span>
                            )}
                            {req.applicabilityStatus === 'NO_APLICA' && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 block w-max" title={req.applicabilityJustification}>
                                No Aplica (Justif.)
                              </span>
                            )}
                            {req.applicabilityStatus === 'PENDIENTE_ANALISIS' && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 block w-max">
                                Pendiente análisis
                              </span>
                            )}
                          </td>

                          {/* Cumplimiento Legal */}
                          <td className="py-3 px-3.5 align-top">
                            {req.complianceStatus === 'CUMPLE' && (
                              <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 w-max">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Cumple
                              </span>
                            )}
                            {req.complianceStatus === 'CUMPLE_PARCIAL' && (
                              <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 w-max">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                Cumple Parcial
                              </span>
                            )}
                            {req.complianceStatus === 'NO_CUMPLE' && (
                              <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 w-max">
                                <ShieldAlert className="w-3 h-3 text-rose-600" />
                                No Cumple
                              </span>
                            )}
                            {req.complianceStatus === 'PENDIENTE_EVALUACION' && (
                              <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300 flex items-center gap-1 w-max">
                                <Clock className="w-3 h-3 text-slate-500" />
                                Sin Evaluar
                              </span>
                            )}
                            {req.complianceStatus === 'NO_APLICA_JUSTIFICADO' && (
                              <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 block w-max">
                                N/A Justificado
                              </span>
                            )}

                            {req.lastEvaluationDate && (
                              <span className="text-[9px] text-slate-500 block mt-1">
                                Eval: {req.lastEvaluationDate}
                              </span>
                            )}
                          </td>

                          {/* Evidencia vinculada */}
                          <td className="py-3 px-3.5 align-top max-w-[180px]">
                            {req.existingEvidenceDescription ? (
                              <div>
                                <span className="text-[11px] text-slate-700 line-clamp-2 block font-medium">
                                  {req.existingEvidenceDescription}
                                </span>
                                {req.linkedModule && (
                                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                                    Módulo: {req.linkedModule}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">
                                Evidencia pendiente
                              </span>
                            )}
                          </td>

                          {/* Botón de Evaluación Rápida */}
                          <td className="py-3 px-3.5 align-top text-center">
                            <button
                              onClick={() => handleOpenEvaluation(req)}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1 mx-auto"
                              title="Evaluar cumplimiento o actualizar evidencia"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Evaluar</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 2: PROCEDIMIENTO EDITABLE DE 18 SECCIONES */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'PROCEDURE' && (
        <div className="space-y-6">
          {/* Procedure Header & Control Block */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {legalMatrixState.procedure.code}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                    Versión {legalMatrixState.procedure.version}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    legalMatrixState.procedure.status === 'VIGENTE'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {legalMatrixState.procedure.status === 'VIGENTE' ? 'VIGENTE' : 'EN ELABORACIÓN'}
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  {legalMatrixState.procedure.title}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Estructura metodológica integral para dar cumplimiento al Decreto 1072 de 2015 Art. 2.2.4.6.12 Numeral 15 y Resolución 0312 de 2019 Estándar 2.4.1.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir PDF</span>
                </button>
                {legalMatrixState.procedure.status !== 'VIGENTE' ? (
                  <button
                    onClick={() => setIsApprovalModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aprobar Procedimiento</span>
                  </button>
                ) : (
                  <button
                    onClick={() => registerLegalMatrixInRepository('PROCEDIMIENTO')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
                  >
                    <FolderArchive className="w-3.5 h-3.5" />
                    <span>Archivar en Repositorio 2.2.1</span>
                  </button>
                )}
              </div>
            </div>

            {/* Approval Workflow Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Elaboró</span>
                <span className="font-bold text-slate-900 block mt-0.5">{legalMatrixState.procedure.preparedBy}</span>
                <span className="text-[11px] text-slate-600 block">{legalMatrixState.procedure.preparedPosition}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Fecha: {legalMatrixState.procedure.preparedDate}</span>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-slate-200 md:pl-3 pt-2 md:pt-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Revisó</span>
                <span className="font-bold text-slate-900 block mt-0.5">{legalMatrixState.procedure.reviewedBy}</span>
                <span className="text-[11px] text-slate-600 block">{legalMatrixState.procedure.reviewedPosition}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Fecha: {legalMatrixState.procedure.reviewedDate}</span>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-slate-200 md:pl-3 pt-2 md:pt-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Aprobó</span>
                <span className="font-bold text-slate-900 block mt-0.5">{legalMatrixState.procedure.approvedBy || 'Pendiente de aprobación'}</span>
                <span className="text-[11px] text-slate-600 block">{legalMatrixState.procedure.approvedPosition || 'Gerencia General'}</span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {legalMatrixState.procedure.approvedDate ? `Fecha: ${legalMatrixState.procedure.approvedDate}` : 'Estado: En revisión'}
                </span>
              </div>
            </div>
          </div>

          {/* 18 Sections Accordion / Editable Cards */}
          <div className="space-y-3">
            {legalMatrixState.procedure.sections.map(section => {
              const isEditing = editingSectionId === section.id;
              return (
                <div
                  key={section.id}
                  className="glass-card p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {section.sectionNumber}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">
                        {section.title}
                      </h3>
                      {section.isCustomized && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 font-medium">
                          Personalizado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingSectionId(section.id);
                              setEditingSectionContent(section.content);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                          {section.isCustomized && (
                            <button
                              onClick={() => handleResetSection(section.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                              title="Restablecer al texto técnico original"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Restablecer</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSaveSectionEdit(section.id)}
                            className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Guardar</span>
                          </button>
                          <button
                            onClick={() => setEditingSectionId(null)}
                            className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Content */}
                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        rows={8}
                        value={editingSectionContent}
                        onChange={e => setEditingSectionContent(e.target.value)}
                        className="w-full text-xs font-mono p-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white leading-relaxed"
                      />
                      <p className="text-[11px] text-slate-500 italic">
                        Tip: Puedes adaptar los nombres de cargos, periodicidad o criterios de acuerdo con el organigrama y los procesos de la organización.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 3: DASHBOARD & DIAGNÓSTICO LEGAL */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Compliance Formula Banner */}
          <div className="glass-card p-5 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-slate-50 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Metodología Transparente de Cálculo de Cumplimiento Legal
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Porcentaje de Cumplimiento: <span className="text-emerald-700 font-mono">{metrics.complianceDisplay}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fórmula estricta: <em>(Obligaciones que Cumplen / Total de Obligaciones Aplicables Evaluadas) * 100</em>. No se asigna 100% de manera artificiosa ni se computan requisitos sin evaluar como cumplidos.
                </p>
              </div>

              <button
                onClick={() => setIsDiagnosticReportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
              >
                <FileCheck className="w-4 h-4" />
                <span>Ver Informe Diagnóstico Completo</span>
              </button>
            </div>
          </div>

          {/* Breakdown Charts & Topic Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Status Breakdown */}
            <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Distribución del Cumplimiento de Obligaciones
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-bold text-emerald-800">Cumplimiento Total (CUMPLE)</span>
                    <span className="font-bold text-slate-700">{metrics.compliantCount} de {metrics.evaluatedObligationsCount} ({metrics.compliancePercentage !== null ? metrics.compliancePercentage.toFixed(1) : '0.0'}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.evaluatedObligationsCount > 0 ? (metrics.compliantCount / metrics.evaluatedObligationsCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-bold text-amber-800">Cumplimiento Parcial (CUMPLE PARCIAL)</span>
                    <span className="font-bold text-slate-700">{metrics.partiallyCompliantCount} de {metrics.evaluatedObligationsCount}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.evaluatedObligationsCount > 0 ? (metrics.partiallyCompliantCount / metrics.evaluatedObligationsCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-bold text-rose-800">Incumplimiento Confirmado (NO CUMPLE)</span>
                    <span className="font-bold text-slate-700">{metrics.nonCompliantCount} de {metrics.evaluatedObligationsCount}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.evaluatedObligationsCount > 0 ? (metrics.nonCompliantCount / metrics.evaluatedObligationsCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-600">Pendientes de Evaluación Técnica</span>
                    <span className="font-bold text-slate-700">{metrics.pendingEvaluationCount}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-400 rounded-full transition-all duration-500"
                      style={{ width: `${(metrics.pendingEvaluationCount / metrics.totalApplicableObligations) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution by Topic */}
            <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Requisitos por Ámbito Normativo
              </h3>

              <div className="space-y-2 text-xs">
                {Object.entries(TOPIC_LABELS).map(([topicKey, topicLabel]) => {
                  const count = legalMatrixState.requirements.filter(r => r.topicCategory === topicKey).length;
                  if (count === 0) return null;
                  const compliant = legalMatrixState.requirements.filter(r => r.topicCategory === topicKey && r.complianceStatus === 'CUMPLE').length;

                  return (
                    <div key={topicKey} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 block text-[11px]">{String(topicLabel)}</span>
                        <span className="text-[10px] text-slate-500">{compliant} cumplidas de {count}</span>
                      </div>
                      <span className="font-mono text-xs font-black text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {count} {count === 1 ? 'norma' : 'normas'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 4: SEGUIMIENTO A CAMBIOS NORMATIVOS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'ALERTS' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Radar Legislativo & Alertas de Modificación Normativa
                </h3>
                <p className="text-xs text-slate-600">
                  Monitoreo de resoluciones, circulares y decretos expedidos por el Ministerio del Trabajo, MinTransporte y MinAmbiente. Los cambios no alteran automáticamente las evaluaciones sin validación del profesional responsable.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {legalMatrixState.alerts.map(alert => (
              <div
                key={alert.id}
                className="glass-card p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 hover:border-indigo-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                      {alert.affectedNorm}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {alert.issuingAuthority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">Expedición: {alert.publishedDate}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alert.reviewStatus === 'REVISADA'
                        ? 'bg-emerald-100 text-emerald-800'
                        : alert.reviewStatus === 'ACCION_ADOPTADA'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {alert.reviewStatus === 'REVISADA' ? 'Revisada' : alert.reviewStatus === 'ACCION_ADOPTADA' ? 'Acción Adoptada' : 'Pendiente de Análisis'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-slate-500">
                    Cambio Identificado
                  </span>
                  <p className="text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                    {alert.changeSummary}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-indigo-600">
                    Impacto en la Empresa & Obligaciones
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {alert.impactDescription}
                  </p>
                </div>

                {alert.actionsAdopted && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                    <strong>Acción implementada:</strong> {alert.actionsAdopted} (Verificado por {alert.reviewedBy} el {alert.reviewedAt || alert.publishedDate})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: EVALUACIÓN DE CUMPLIMIENTO LEGAL */}
      {/* ------------------------------------------------------------- */}
      {isEvaluationModalOpen && selectedRequirement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {selectedRequirement.internalCode}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Evaluación de Cumplimiento: {selectedRequirement.normType} {selectedRequirement.normNumber} de {selectedRequirement.normYear}
                </h3>
              </div>
              <button
                onClick={() => setIsEvaluationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Obligación Legal Exigida ({selectedRequirement.applicableArticles})
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {selectedRequirement.specificLegalObligation}
                </p>
              </div>

              {/* Resultado de Calificación */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Calificación del Cumplimiento *
                </label>
                <select
                  value={evalForm.complianceStatus}
                  onChange={e => setEvalForm({ ...evalForm, complianceStatus: e.target.value as LegalComplianceStatus })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CUMPLE">CUMPLE (Evidencia completa y verificable)</option>
                  <option value="CUMPLE_PARCIAL">CUMPLE PARCIALMENTE (Controles en proceso de consolidación)</option>
                  <option value="NO_CUMPLE">NO CUMPLE (Sin evidencia o control ausente)</option>
                  <option value="PENDIENTE_EVALUACION">PENDIENTE DE EVALUACIÓN TÉCNICA</option>
                  <option value="NO_APLICA_JUSTIFICADO">NO APLICA (Debidamente justificado)</option>
                </select>
              </div>

              {/* Evidencia Consultada */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Descripción de la Evidencia Consultada *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detalla qué documento, acta, registro o módulo de AGAE valida el cumplimiento..."
                  value={evalForm.evidenceExisting}
                  onChange={e => setEvalForm({ ...evalForm, evidenceExisting: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Observaciones del Evaluador */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Notas de Auditoría / Criterio de Verificación
                </label>
                <textarea
                  rows={2}
                  placeholder="Observaciones de fondo sobre la calidad de la evidencia y su alcance..."
                  value={evalForm.evidenceEvaluationNotes}
                  onChange={e => setEvalForm({ ...evalForm, evidenceEvaluationNotes: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Hallazgos y Acciones de Mejora si no cumple o cumple parcial */}
              {(evalForm.complianceStatus === 'NO_CUMPLE' || evalForm.complianceStatus === 'CUMPLE_PARCIAL') && (
                <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 space-y-3">
                  <div>
                    <label className="font-bold text-rose-900 block mb-1">
                      Hallazgo / Brecha Identificada
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: No se cuenta con el informe de mediciones higiénicas del periodo..."
                      value={evalForm.findings}
                      onChange={e => setEvalForm({ ...evalForm, findings: e.target.value })}
                      className="w-full p-2 rounded-lg border border-rose-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-rose-900 block mb-1">
                      Acción de Mejora Requerida (ACPM)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Contratar estudio de higiene ocupacional con especialista..."
                      value={evalForm.improvementAction}
                      onChange={e => setEvalForm({ ...evalForm, improvementAction: e.target.value })}
                      className="w-full p-2 rounded-lg border border-rose-300 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Evaluador y Fecha */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Evaluador Responsable
                  </label>
                  <input
                    type="text"
                    value={evalForm.evaluatorName}
                    onChange={e => setEvalForm({ ...evalForm, evaluatorName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Fecha de Evaluación
                  </label>
                  <input
                    type="date"
                    value={evalForm.evaluationDate}
                    onChange={e => setEvalForm({ ...evalForm, evaluationDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEvaluationModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  Guardar Evaluación de Cumplimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: APROBACIÓN FORMAL DEL PROCEDIMIENTO */}
      {/* ------------------------------------------------------------- */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-300 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-indigo-600" />
                Aprobación del Procedimiento PR-SGSST-LEG-001
              </h3>
              <button onClick={() => setIsApprovalModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApproveProcedureSubmit} className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Al aprobar formalmente el procedimiento, pasará al estado <strong>VIGENTE</strong>, se archivará automáticamente en el Repositorio Documental Central de AGAE SOLUTIONS (Estándar 2.2.1) con retención de 20 años y se certificará el Estándar 2.4.1.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nombre de quien Aprueba (Alta Dirección) *
                </label>
                <input
                  type="text"
                  required
                  value={approvalApproverName}
                  onChange={e => setApprovalApproverName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Cargo *
                </label>
                <input
                  type="text"
                  required
                  value={approvalApproverPosition}
                  onChange={e => setApprovalApproverPosition(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsApprovalModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Aprobar y Archivar en Repositorio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: INFORME DIAGNÓSTICO EN PDF */}
      {/* ------------------------------------------------------------- */}
      {isDiagnosticReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-300 shadow-2xl p-6 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Header / Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  IF-SGSST-LEG-001
                </span>
                <h2 className="text-base font-black text-slate-900">
                  Informe Diagnóstico de Cumplimiento de Requisitos Legales
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir PDF</span>
                </button>
                <button
                  onClick={() => registerLegalMatrixInRepository('DIAGNOSTICO')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Archivar en Repositorio</span>
                </button>
                <button
                  onClick={() => setIsDiagnosticReportModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Report Body */}
            <div className="space-y-6 text-xs text-slate-800 leading-relaxed">
              {/* Metadata de Empresa */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Organización</span>
                  <span className="font-bold text-slate-900 block">{organization.name}</span>
                  <span className="text-[11px] text-slate-600 block">NIT: {organization.nit}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Actividad Económica</span>
                  <span className="font-bold text-slate-900 block">{organization.economicActivity}</span>
                  <span className="text-[11px] text-slate-600 block">Clase de Riesgo: {organization.riskLevelArl}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Fecha de Corte</span>
                  <span className="font-bold text-slate-900 block">{new Date().toISOString().substring(0, 10)}</span>
                  <span className="text-[11px] text-slate-600 block">Revisión: Trimestral</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Evaluador Oficial</span>
                  <span className="font-bold text-slate-900 block">Ing. Marcela Rincón Ortiz</span>
                  <span className="text-[11px] text-slate-600 block">Lic. SST: LIC-SST-2023-08941</span>
                </div>
              </div>

              {/* Resumen Ejecutivo & Porcentaje */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-indigo-950">
                    Resultado General del Desempeño Normativo
                  </h4>
                  <p className="text-xs text-indigo-900 mt-0.5">
                    Se han identificado <strong>{metrics.totalApplicableObligations}</strong> obligaciones aplicables, de las cuales <strong>{metrics.evaluatedObligationsCount}</strong> cuentan con evaluación formal y evidencia cotejada.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-indigo-900 font-mono block">
                    {metrics.compliancePercentage !== null ? metrics.compliancePercentage.toFixed(1) : '0.0'}%
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 block">
                    {metrics.complianceDisplay}
                  </span>
                </div>
              </div>

              {/* Obligaciones Cumplidas */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Obligaciones con Cumplimiento Verificable ({metrics.compliantCount})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  {legalMatrixState.requirements.filter(r => r.complianceStatus === 'CUMPLE').map(r => (
                    <div key={r.id} className="p-3 bg-white flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {r.normType} {r.normNumber}/{r.normYear} • {r.applicableArticles}
                        </span>
                        <p className="text-[11px] text-slate-600 mt-0.5">{r.specificLegalObligation}</p>
                        <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                          Evidencia: {r.existingEvidenceDescription}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                        CUMPLE
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Obligaciones con Cumplimiento Parcial o Incumplimiento */}
              {(metrics.partiallyCompliantCount > 0 || metrics.nonCompliantCount > 0) && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Brechas e Incumplimientos con Plan de Acción ({metrics.partiallyCompliantCount + metrics.nonCompliantCount})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {legalMatrixState.requirements.filter(r => r.complianceStatus === 'CUMPLE_PARCIAL' || r.complianceStatus === 'NO_CUMPLE').map(r => (
                      <div key={r.id} className="p-3 bg-white flex items-start justify-between gap-3">
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {r.normType} {r.normNumber}/{r.normYear} • {r.applicableArticles}
                          </span>
                          <p className="text-[11px] text-slate-600 mt-0.5">{r.specificLegalObligation}</p>
                          {r.findingsOrObservations && (
                            <span className="text-[10px] text-rose-700 font-medium block mt-1">
                              Hallazgo: {r.findingsOrObservations}
                            </span>
                          )}
                          {r.improvementActionDescription && (
                            <span className="text-[10px] text-indigo-700 font-bold block mt-0.5">
                              ACPM: {r.improvementActionDescription}
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          r.complianceStatus === 'NO_CUMPLE' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.complianceStatus === 'NO_CUMPLE' ? 'NO CUMPLE' : 'PARCIAL'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conclusiones y Firmas */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs text-slate-900">Conclusiones & Prioridades de Intervención</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  La organización demuestra estructura activa del SG-SST y alineación con los requerimientos esenciales del Decreto 1072 de 2015. Se prioriza para el próximo trimestre la culminación del estudio higiénico de ruido conforme a la Res. 1792 de 1990 y el cierre de las capacitaciones pendientes del COPASST (Res. 2013 de 1986).
                </p>
                <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-end text-xs">
                  <div>
                    <div className="w-48 border-b border-slate-400 mb-1" />
                    <span className="font-bold text-slate-900 block">Ing. Marcela Rincón Ortiz</span>
                    <span className="text-[10px] text-slate-600 block">Responsable del SG-SST (Lic. 2023-08941)</span>
                  </div>
                  <div>
                    <div className="w-48 border-b border-slate-400 mb-1" />
                    <span className="font-bold text-slate-900 block">Lic. Fernando Ortiz Salazar</span>
                    <span className="text-[10px] text-slate-600 block">Representante Legal / Gerente General</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
