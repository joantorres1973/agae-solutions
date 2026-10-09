'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  ClipboardCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  MinusCircle,
  Filter,
  Search,
  Printer,
  Download,
  Shield,
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUp,
  Award,
  Users,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Calendar,
  Building2,
  AlertCircle,
  Sparkles,
  UserCheck,
  Lock,
  FileCheck2,
  Share2
} from 'lucide-react';
import {
  InitialEvaluationItem,
  InitialEvaluationAction,
  InitialEvaluationComponentId,
  InitialEvaluationItemStatus,
  InitialEvaluationOverallStatus
} from '@/types/initial-evaluation';
import {
  INITIAL_EVALUATION_COMPONENTS,
  calculateInitialEvaluationMetrics
} from '@/lib/initial-evaluation-mock';

interface SstInitialEvaluationModuleProps {
  initialSubTab?: 'CHECKLIST' | 'DASHBOARD' | 'ACTIONS' | 'VALIDATION' | 'REPORT';
  onNavigateToModule?: (tab: string) => void;
}

export const SstInitialEvaluationModule: React.FC<SstInitialEvaluationModuleProps> = ({
  initialSubTab = 'CHECKLIST',
  onNavigateToModule
}) => {
  const {
    organization,
    initialEvaluationState,
    updateInitialEvaluationItem,
    addInitialEvaluationAction,
    updateInitialEvaluationAction,
    setInitialEvaluationOverallStatus,
    updateInitialEvaluationConclusions,
    finalizeEvaluationSnapshot,
    exportEvaluationActionToAcpm,
    setActiveTab,
    showNotification
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'CHECKLIST' | 'DASHBOARD' | 'ACTIONS' | 'VALIDATION' | 'REPORT'>(initialSubTab);

  // Filters state
  const [selectedComponent, setSelectedComponent] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InitialEvaluationItemStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedComponents, setExpandedComponents] = useState<Record<string, boolean>>({
    'COMP-01-NORMATIVIDAD': true,
    'COMP-02-PELIGROS-RIESGOS': true,
    'COMP-03-AMENAZAS-EMERGENCIAS': true
  });

  // Modal for new/edit action
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [targetItemForAction, setTargetItemForAction] = useState<InitialEvaluationItem | null>(null);
  const [actionFormData, setActionFormData] = useState({
    gapDescription: '',
    requiredAction: '',
    responsible: 'Ing. Carlos Mendoza - Líder SST',
    dueDate: '2026-03-31',
    resourcesNeeded: 'Presupuesto SG-SST y tiempo administrativo',
    sendToAcpm: true
  });

  // Conclusions editor
  const [conclusionsText, setConclusionsText] = useState(initialEvaluationState.technicalConclusions);
  const [recommendationsText, setRecommendationsText] = useState(initialEvaluationState.technicalRecommendations);

  // Calculate live metrics
  const metrics = useMemo(() => {
    return calculateInitialEvaluationMetrics(initialEvaluationState.items, INITIAL_EVALUATION_COMPONENTS);
  }, [initialEvaluationState.items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return initialEvaluationState.items.filter(item => {
      const matchComp = selectedComponent === 'ALL' || item.componentId === selectedComponent;
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.aspect.toLowerCase().includes(q) ||
        item.legalBasis.toLowerCase().includes(q) ||
        item.evaluatorObservations.toLowerCase().includes(q) ||
        item.sourceModule.moduleName.toLowerCase().includes(q);
      return matchComp && matchStatus && matchQuery;
    });
  }, [initialEvaluationState.items, selectedComponent, statusFilter, searchQuery]);

  const toggleComponentAccordion = (compId: string) => {
    setExpandedComponents(prev => ({
      ...prev,
      [compId]: !prev[compId]
    }));
  };

  const handleOpenActionModal = (item: InitialEvaluationItem) => {
    setTargetItemForAction(item);
    setActionFormData({
      gapDescription: item.identifiedGap || `Brecha identificada en ${item.code}: ${item.aspect.slice(0, 80)}`,
      requiredAction: item.recommendedAction || 'Formular plan de intervención técnica y verificación de evidencia.',
      responsible: item.responsibleValidator || 'Ing. Carlos Mendoza - Líder SST',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      resourcesNeeded: 'Presupuesto SG-SST y tiempo técnico asignado.',
      sendToAcpm: true
    });
    setShowActionModal(true);
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetItemForAction) return;

    addInitialEvaluationAction({
      criterionId: targetItemForAction.id,
      criterionCode: targetItemForAction.code,
      componentId: targetItemForAction.componentId,
      gapDescription: actionFormData.gapDescription,
      requiredAction: actionFormData.requiredAction,
      responsible: actionFormData.responsible,
      dueDate: actionFormData.dueDate,
      resourcesNeeded: actionFormData.resourcesNeeded,
      status: 'EN_EJECUCION',
      sentToAcpm: actionFormData.sendToAcpm
    });

    setShowActionModal(false);
    setTargetItemForAction(null);
  };

  const handleNavigateToSource = (routeTab: string) => {
    if (onNavigateToModule) {
      onNavigateToModule(routeTab);
    } else {
      setActiveTab(routeTab as any);
    }
  };

  const handleSaveConclusions = () => {
    updateInitialEvaluationConclusions(conclusionsText, recommendationsText);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Estándar 2.1.3 • Decreto 1072/2015 Art. 2.2.4.6.16</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              initialEvaluationState.status === 'FINALIZADA'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                : initialEvaluationState.status === 'PENDIENTE_VALIDACION'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                : 'bg-blue-500/20 text-blue-300 border-blue-400/40'
            }`}>
              {initialEvaluationState.status === 'FINALIZADA' ? '✓ EVALUACIÓN FINALIZADA Y FORMALIZADA' :
               initialEvaluationState.status === 'PENDIENTE_VALIDACION' ? '⏳ PENDIENTE DE VALIDACIÓN GERENCIAL' :
               '⚙ EVALUACIÓN EN ELABORACIÓN'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-slate-300 border border-white/10">
              Periodo: {initialEvaluationState.evaluationPeriod} • Versión {initialEvaluationState.version}.0
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Evaluación Inicial Integral del SG-SST</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Instrumento estructurado de diagnóstico, verificación de evidencias y gestión de brechas según los 10 componentes exigidos por el <strong>Artículo 2.2.4.6.16 del Decreto 1072 de 2015</strong>, integrado con los módulos en tiempo real de AGAE SOLUTIONS.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTabLocal('REPORT')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-900/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Generar Informe Técnico en PDF</span>
          </button>
        </div>
      </div>

      {/* Disclaimers & Regulatory Boundary Alert */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold block text-amber-950">
            Diferenciación Técnica Legal (Decreto 1072/2015 vs. Resolución 0312/2019):
          </strong>
          La Evaluación Inicial es un diagnóstico técnico integral sobre los 10 componentes del Art. 2.2.4.6.16 del Decreto 1072 de 2015 para identificar prioridades y formular el Plan Anual de Trabajo. No sustituye la Autoevaluación porcentual de Estándares Mínimos de la Res. 0312 de 2019, la cual cuenta con su propio cálculo legal. No se marcan requisitos como cumplidos por la simple existencia formal de un documento sin comprobación técnica.
        </div>
      </div>

      {/* Navigation Subtabs Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTabLocal('CHECKLIST')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'CHECKLIST'
              ? 'bg-white text-teal-800 shadow-sm border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 text-teal-600" />
          <span>1. Checklist por Componentes ({metrics.totalCriteria})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('DASHBOARD')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'DASHBOARD'
              ? 'bg-white text-teal-800 shadow-sm border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-teal-600" />
          <span>2. Dashboard Gráfico & Diagnóstico</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('ACTIONS')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'ACTIONS'
              ? 'bg-white text-teal-800 shadow-sm border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-teal-600" />
          <span>3. Gestión de Brechas & Plan de Mejora ({initialEvaluationState.actions.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('VALIDATION')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'VALIDATION'
              ? 'bg-white text-teal-800 shadow-sm border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-teal-600" />
          <span>4. Formalización, Conclusiones e Historial</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('REPORT')}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'REPORT'
              ? 'bg-teal-700 text-white shadow font-bold'
              : 'text-teal-700 hover:text-teal-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>5. Vista Informe Técnico Oficial (PDF)</span>
        </button>
      </div>

      {/* TOP KPI CARDS: Diagnostic Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Criterios */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Criterios Dec. 1072</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{metrics.totalCriteria}</span>
            <span className="text-[11px] text-slate-500">en 10 comp.</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="h-1.5 rounded-full bg-slate-400" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Avance de Evaluación */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Avance de Evaluación</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-blue-700 font-mono">{metrics.evaluationProgressPercentage}%</span>
            <span className="text-[11px] text-slate-500">({metrics.evaluatedCriteria}/{metrics.totalCriteria})</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${metrics.evaluationProgressPercentage}%` }} />
          </div>
        </div>

        {/* Cumplimiento Real */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cumplimiento Técnico</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-black font-mono ${
              metrics.complianceScorePercentage >= 85 ? 'text-emerald-700' :
              metrics.complianceScorePercentage >= 60 ? 'text-amber-700' : 'text-rose-700'
            }`}>
              {metrics.complianceScorePercentage}%
            </span>
            <span className="text-[11px] text-slate-500">ponderado</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                metrics.complianceScorePercentage >= 85 ? 'bg-emerald-500' :
                metrics.complianceScorePercentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${metrics.complianceScorePercentage}%` }}
            />
          </div>
        </div>

        {/* Criterios Cumplidos */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Cumplen
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-900 font-mono">{metrics.compliantCriteria}</span>
            <span className="text-[11px] text-emerald-700">
              ({metrics.totalCriteria > 0 ? Math.round((metrics.compliantCriteria / metrics.totalCriteria) * 100) : 0}%)
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 block mt-1">Con soporte validado</span>
        </div>

        {/* Criterios Parciales o No Cumple */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-700" /> Con Brechas
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-900 font-mono">{metrics.totalGaps}</span>
            <span className="text-[11px] text-amber-700">({metrics.partialCriteria} parc. / {metrics.nonCompliantCriteria} no)</span>
          </div>
          <span className="text-[10px] text-amber-700 block mt-1">Requieren intervención</span>
        </div>

        {/* Acciones de Mejora Activas */}
        <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200">
          <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block flex items-center gap-1">
            <Layers className="w-3 h-3 text-purple-700" /> Plan de Mejora
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-purple-900 font-mono">{initialEvaluationState.actions.length}</span>
            <span className="text-[11px] text-purple-700">acciones</span>
          </div>
          <span className="text-[10px] text-purple-700 block mt-1">
            {initialEvaluationState.actions.filter(a => a.sentToAcpm).length} en Matriz ACPM
          </span>
        </div>
      </div>

      {/* TAB 1: CHECKLIST POR COMPONENTES */}
      {activeTab === 'CHECKLIST' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar criterio, norma (ej: Art. 2.2.4.6.16), módulo de origen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedComponent}
                  onChange={(e) => setSelectedComponent(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 focus:outline-none focus:border-teal-500"
                >
                  <option value="ALL">Todos los Componentes (1 al 10)</option>
                  {INITIAL_EVALUATION_COMPONENTS.map(c => (
                    <option key={c.id} value={c.id}>{c.shortTitle}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="text-xs p-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 focus:outline-none focus:border-teal-500"
                >
                  <option value="ALL">Todos los Estados</option>
                  <option value="CUMPLE">✓ Cumple</option>
                  <option value="CUMPLE_PARCIALMENTE">⏳ Cumple Parcialmente</option>
                  <option value="NO_CUMPLE">✕ No Cumple</option>
                  <option value="NO_APLICA">⊘ No Aplica (Justificado)</option>
                  <option value="PENDIENTE">⋯ Pendiente</option>
                </select>

                {(searchQuery || selectedComponent !== 'ALL' || statusFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedComponent('ALL');
                      setStatusFilter('ALL');
                    }}
                    className="p-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-semibold"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Components and Items Listing */}
          <div className="space-y-4">
            {INITIAL_EVALUATION_COMPONENTS.map(component => {
              const compItems = filteredItems.filter(i => i.componentId === component.id);
              if (compItems.length === 0 && (selectedComponent !== 'ALL' || searchQuery || statusFilter !== 'ALL')) {
                return null;
              }

              const allCompItems = initialEvaluationState.items.filter(i => i.componentId === component.id);
              const compMetric = metrics.componentScores.find(s => s.componentId === component.id);
              const isExpanded = expandedComponents[component.id] ?? true;

              return (
                <div key={component.id} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all">
                  {/* Component Header Accordion */}
                  <div
                    onClick={() => toggleComponentAccordion(component.id)}
                    className="p-4 bg-slate-50 hover:bg-slate-100/80 cursor-pointer border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-8 h-8 rounded-xl font-bold font-mono text-xs flex items-center justify-center shrink-0 border ${component.color}`}>
                        {component.numeral}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{component.title}</h3>
                        <p className="text-[11px] text-slate-600 mt-0.5">{component.legalBasis}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className={`text-xs font-mono font-bold ${
                            (compMetric?.scorePercentage ?? 0) >= 80 ? 'text-emerald-700' :
                            (compMetric?.scorePercentage ?? 0) >= 50 ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {compMetric?.scorePercentage}% Cumplimiento
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({allCompItems.filter(i => i.status === 'CUMPLE').length}/{allCompItems.length})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {allCompItems.filter(i => i.status === 'CUMPLE_PARCIALMENTE' || i.status === 'NO_CUMPLE').length} brechas
                        </span>
                      </div>

                      <button className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Component Items List */}
                  {isExpanded && (
                    <div className="divide-y divide-slate-100 p-2 sm:p-4 space-y-4">
                      {compItems.map(item => {
                        const hasGap = item.status === 'CUMPLE_PARCIALMENTE' || item.status === 'NO_CUMPLE';

                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-xl border transition-all ${
                              item.status === 'CUMPLE' ? 'border-emerald-200 bg-emerald-50/20' :
                              item.status === 'CUMPLE_PARCIALMENTE' ? 'border-amber-200 bg-amber-50/20' :
                              item.status === 'NO_CUMPLE' ? 'border-rose-200 bg-rose-50/20' :
                              item.status === 'NO_APLICA' ? 'border-slate-200 bg-slate-50' :
                              'border-blue-200 bg-blue-50/20'
                            }`}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                              {/* Left Column: Code, Aspect, Normative and Evidence Requirements */}
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 text-white">
                                    {item.code}
                                  </span>
                                  <span className="text-[11px] font-semibold text-slate-500">
                                    {item.legalBasis}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    item.reviewStatus === 'VERIFICADO'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : item.reviewStatus === 'REQUIERE_REVISION'
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : 'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}>
                                    {item.reviewStatus}
                                  </span>
                                </div>

                                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                                  {item.aspect}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                                  <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200">
                                    <strong className="text-slate-700 block mb-0.5">Método de Verificación:</strong>
                                    <span className="text-slate-600">{item.verificationMethod}</span>
                                  </div>
                                  <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200">
                                    <strong className="text-slate-700 block mb-0.5">Evidencia Requerida:</strong>
                                    <span className="text-slate-600">{item.requiredEvidence}</span>
                                  </div>
                                </div>

                                {/* Linked AGAE SOLUTIONS Module Box */}
                                <div className="p-2.5 rounded-lg bg-gradient-to-r from-teal-50 to-slate-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="text-[11px]">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-teal-900">Módulo Conectado:</span>
                                      <span className="font-semibold text-teal-800">{item.sourceModule.moduleName}</span>
                                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${
                                        item.sourceModule.statusBadge === 'DISPONIBLE'
                                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                          : item.sourceModule.statusBadge === 'PARCIAL'
                                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                                          : 'bg-rose-100 text-rose-800 border-rose-300'
                                      }`}>
                                        {item.sourceModule.statusBadge}
                                      </span>
                                    </div>
                                    <span className="text-slate-600 text-[10px] block mt-0.5">
                                      Soporte: {item.sourceModule.evidenceName} • Actualizado: {item.sourceModule.lastUpdated || 'No registrado'}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleNavigateToSource(item.sourceModule.routeTab)}
                                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-teal-700 hover:bg-teal-600 text-white flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-sm"
                                  >
                                    <span>Ir al Módulo de Origen</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Right Column: Status Selector, Observations, Action Trigger */}
                              <div className="w-full lg:w-80 shrink-0 space-y-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                    Resultado Evaluación Inicial *
                                  </label>
                                  <select
                                    value={item.status}
                                    onChange={(e) => {
                                      const newStatus = e.target.value as InitialEvaluationItemStatus;
                                      updateInitialEvaluationItem(item.id, {
                                        status: newStatus,
                                        reviewStatus: newStatus === 'CUMPLE' ? 'VERIFICADO' : 'REQUIERE_REVISION'
                                      });
                                    }}
                                    className={`w-full p-2 rounded-lg font-bold text-xs border transition-all focus:outline-none ${
                                      item.status === 'CUMPLE' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                                      item.status === 'CUMPLE_PARCIALMENTE' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                                      item.status === 'NO_CUMPLE' ? 'bg-rose-50 text-rose-900 border-rose-300' :
                                      item.status === 'NO_APLICA' ? 'bg-slate-100 text-slate-800 border-slate-300' :
                                      'bg-blue-50 text-blue-900 border-blue-300'
                                    }`}
                                  >
                                    <option value="CUMPLE">✓ CUMPLE TOTALMENTE</option>
                                    <option value="CUMPLE_PARCIALMENTE">⏳ CUMPLE PARCIALMENTE</option>
                                    <option value="NO_CUMPLE">✕ NO CUMPLE</option>
                                    <option value="NO_APLICA">⊘ NO APLICA (JUSTIFICADO)</option>
                                    <option value="PENDIENTE">⋯ PENDIENTE DE EVALUACIÓN</option>
                                  </select>
                                </div>

                                {item.status === 'NO_APLICA' && (
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                      Justificación Legal Obligatoria *
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Motivo legal de no aplicabilidad..."
                                      value={item.justificationNonApplicable || ''}
                                      onChange={(e) => updateInitialEvaluationItem(item.id, { justificationNonApplicable: e.target.value })}
                                      className="w-full text-xs p-1.5 rounded-lg border border-slate-300"
                                    />
                                  </div>
                                )}

                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                    Observaciones del Evaluador
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder="Comprobación técnica y hallazgos observados..."
                                    value={item.evaluatorObservations}
                                    onChange={(e) => updateInitialEvaluationItem(item.id, { evaluatorObservations: e.target.value })}
                                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500"
                                  />
                                </div>

                                {hasGap && (
                                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px]">
                                      <span className="font-bold text-amber-800">Brecha Identificada:</span>
                                      <span className="text-slate-500 font-mono">Plan de Acción</span>
                                    </div>
                                    <p className="text-[11px] text-slate-700 bg-amber-50/60 p-1.5 rounded border border-amber-200 italic">
                                      {item.identifiedGap || 'Sin brecha detallada aún.'}
                                    </p>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenActionModal(item)}
                                      className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                    >
                                      <Layers className="w-3.5 h-3.5" />
                                      <span>{item.actionPlanId ? 'Ver / Actualizar Plan de Mejora' : 'Generar Acción de Mejora'}</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DASHBOARD GRÁFICO & DIAGNÓSTICO */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfica 1: Distribución General de Estados (SVG Doughnut Chart) */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-teal-600" />
                  <span>Distribución de Estados de Cumplimiento (30 Criterios)</span>
                </h3>
                <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {metrics.complianceScorePercentage}% Puntuación
                </span>
              </div>

              {/* Visual Bars Breakdown */}
              <div className="space-y-3 pt-2">
                {/* Cumplen */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      Cumplen Totalmente
                    </span>
                    <span className="font-mono text-slate-900 font-bold">
                      {metrics.compliantCriteria} ({metrics.totalCriteria > 0 ? Math.round((metrics.compliantCriteria / metrics.totalCriteria) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${metrics.totalCriteria > 0 ? (metrics.compliantCriteria / metrics.totalCriteria) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Parciales */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      Cumplen Parcialmente
                    </span>
                    <span className="font-mono text-slate-900 font-bold">
                      {metrics.partialCriteria} ({metrics.totalCriteria > 0 ? Math.round((metrics.partialCriteria / metrics.totalCriteria) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-amber-500 transition-all"
                      style={{ width: `${metrics.totalCriteria > 0 ? (metrics.partialCriteria / metrics.totalCriteria) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* No Cumplen */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-rose-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      No Cumplen
                    </span>
                    <span className="font-mono text-slate-900 font-bold">
                      {metrics.nonCompliantCriteria} ({metrics.totalCriteria > 0 ? Math.round((metrics.nonCompliantCriteria / metrics.totalCriteria) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-rose-500 transition-all"
                      style={{ width: `${metrics.totalCriteria > 0 ? (metrics.nonCompliantCriteria / metrics.totalCriteria) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Pendientes */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-blue-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
                      Pendientes de Evaluación
                    </span>
                    <span className="font-mono text-slate-900 font-bold">
                      {metrics.pendingCriteria} ({metrics.totalCriteria > 0 ? Math.round((metrics.pendingCriteria / metrics.totalCriteria) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-blue-400 transition-all"
                      style={{ width: `${metrics.totalCriteria > 0 ? (metrics.pendingCriteria / metrics.totalCriteria) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* No Aplican */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                      No Aplican Justificados
                    </span>
                    <span className="font-mono text-slate-900 font-bold">
                      {metrics.notApplicableCriteria} ({metrics.totalCriteria > 0 ? Math.round((metrics.notApplicableCriteria / metrics.totalCriteria) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-slate-400 transition-all"
                      style={{ width: `${metrics.totalCriteria > 0 ? (metrics.notApplicableCriteria / metrics.totalCriteria) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <strong>Metodología de Puntuación Técnica:</strong>
                <p className="text-[11px] leading-relaxed">
                  Puntaje = <code>((Cumplidos + Parciales * 0.5) / (Evaluados Aplicables)) * 100</code>. Los criterios pendientes no suman puntaje y los no aplicables debidamente justificados se descuentan del denominador técnico.
                </p>
              </div>
            </div>

            {/* Gráfica 2: Cumplimiento por Componente (Bar Chart) */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  <span>Cumplimiento por Componente del Decreto 1072</span>
                </h3>
                <span className="text-[11px] text-slate-500">10 Áreas Técnicas</span>
              </div>

              <div className="space-y-2.5 pt-1 overflow-y-auto max-h-[380px] pr-1">
                {metrics.componentScores.map((c, idx) => (
                  <div key={c.componentId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[220px]">
                        {idx + 1}. {c.componentTitle}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-slate-500">
                          {c.compliant}/{c.total}
                        </span>
                        <span className={`font-bold ${
                          c.scorePercentage >= 80 ? 'text-emerald-700' :
                          c.scorePercentage >= 50 ? 'text-amber-700' : 'text-rose-700'
                        }`}>
                          {c.scorePercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          c.scorePercentage >= 80 ? 'bg-emerald-500' :
                          c.scorePercentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${c.scorePercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tarjetas de Diagnóstico y Prioridades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-rose-700" />
                <span>Atención Prioritaria Inmediata</span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                Se identificaron <strong>{metrics.totalGaps} aspectos</strong> con cumplimiento parcial o no cumplimiento. Priorizar reentrenamiento de brigadistas en primeros auxilios y mediciones ergonómicas en puestos administrativos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Actualización Documental & PVE</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Consolidar la tasa mensual de ausentismo médico laboral y no laboral conjuntamente con Gestión Humana para completar las estadísticas de ATEL del Art. 2.2.4.6.22.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Fortalezas Estructurales</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Asignación del responsable con licencia y curso 50h, presupuesto integrado aprobado, funcionamiento mensual del COPASST y del CCL bajo la Res. 3461/2025.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GESTIÓN DE BRECHAS & PLAN DE MEJORA */}
      {activeTab === 'ACTIONS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Plan de Intervención y Acciones de Mejora Derivadas</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Planes de acción correctiva y preventiva para cerrar las brechas identificadas en el diagnóstico inicial.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                {initialEvaluationState.actions.length} Acciones Registradas
              </span>
            </div>
          </div>

          {/* Actions Table */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Criterio / Componente</th>
                    <th className="p-3">Brecha Identificada</th>
                    <th className="p-3">Acción Requerida</th>
                    <th className="p-3">Responsable & Fecha</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 text-right">ACPM Central</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {initialEvaluationState.actions.map(action => (
                    <tr key={action.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-900 text-white inline-block mb-1">
                          {action.criterionCode}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                          {action.componentId}
                        </span>
                      </td>

                      <td className="p-3 max-w-xs">
                        <span className="font-semibold text-slate-900 block leading-tight">
                          {action.gapDescription}
                        </span>
                        {action.resourcesNeeded && (
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            Recursos: {action.resourcesNeeded}
                          </span>
                        )}
                      </td>

                      <td className="p-3 max-w-xs">
                        <p className="text-slate-700 leading-tight">
                          {action.requiredAction}
                        </p>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="font-semibold block text-slate-900">{action.responsible}</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Plazo: {action.dueDate}
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <select
                          value={action.status}
                          onChange={(e) => updateInitialEvaluationAction(action.id, { status: e.target.value as any })}
                          className={`text-[10px] font-bold p-1 rounded border focus:outline-none ${
                            action.status === 'CERRADA' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            action.status === 'EN_EJECUCION' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            action.status === 'EJECUTADA_PENDIENTE_VERIFICACION' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                            action.status === 'VENCIDA' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                            'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="EN_EJECUCION">EN EJECUCIÓN</option>
                          <option value="EJECUTADA_PENDIENTE_VERIFICACION">EJECUTADA / VERIFICAR</option>
                          <option value="CERRADA">CERRADA Y EFICAZ</option>
                          <option value="VENCIDA">VENCIDA</option>
                        </select>
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        {action.sentToAcpm ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> En Matriz ACPM
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => exportEvaluationActionToAcpm(action.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded border border-teal-200 transition-all cursor-pointer"
                          >
                            <Share2 className="w-3 h-3" /> Enviar a ACPM
                          </button>
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

      {/* TAB 4: FORMALIZACIÓN, CONCLUSIONES E HISTORIAL */}
      {activeTab === 'VALIDATION' && (
        <div className="space-y-6">
          {/* Status Lifecycle Stepper */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Flujo de Formalización y Cierre de la Evaluación Inicial</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Step 1 */}
              <div className={`p-4 rounded-xl border ${
                initialEvaluationState.status === 'EN_ELABORACION'
                  ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">1. En Elaboración</span>
                  {initialEvaluationState.status === 'EN_ELABORACION' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Activo</span>
                  )}
                </div>
                <p className="text-slate-600 text-[11px]">
                  El responsable de SST realiza la verificación de los 10 componentes, cotejo de evidencias y levantamiento de brechas.
                </p>
                {initialEvaluationState.status === 'EN_ELABORACION' && (
                  <button
                    onClick={() => setInitialEvaluationOverallStatus('PENDIENTE_VALIDACION')}
                    className="mt-3 w-full py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-sm"
                  >
                    Enviar a Validación Gerencial →
                  </button>
                )}
              </div>

              {/* Step 2 */}
              <div className={`p-4 rounded-xl border ${
                initialEvaluationState.status === 'PENDIENTE_VALIDACION'
                  ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-500/20'
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">2. Pendiente Validación</span>
                  {initialEvaluationState.status === 'PENDIENTE_VALIDACION' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">En Revisión</span>
                  )}
                </div>
                <p className="text-slate-600 text-[11px]">
                  Revisión por la alta dirección, formulación de recursos y aval del plan de intervención propuesto.
                </p>
                {initialEvaluationState.status === 'PENDIENTE_VALIDACION' && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setInitialEvaluationOverallStatus('EN_ELABORACION')}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-all cursor-pointer"
                    >
                      Ajustar
                    </button>
                    <button
                      onClick={() => finalizeEvaluationSnapshot()}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white transition-all cursor-pointer shadow-sm"
                    >
                      Aprobar & Finalizar ✓
                    </button>
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div className={`p-4 rounded-xl border ${
                initialEvaluationState.status === 'FINALIZADA'
                  ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">3. Finalizada & Formal</span>
                  {initialEvaluationState.status === 'FINALIZADA' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Cerrada</span>
                  )}
                </div>
                <p className="text-slate-600 text-[11px]">
                  Evaluación cerrada formalmente. El Estándar 2.1.3 queda calificado automáticamente como <strong>CUMPLE</strong>.
                </p>
                {initialEvaluationState.status === 'FINALIZADA' && (
                  <div className="mt-3 flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Cerrada el {initialEvaluationState.finalizedAt || initialEvaluationState.updatedAt}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Technical Conclusions and Recommendations Editor */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Conclusiones y Recomendaciones Técnicas del Diagnóstico</span>
              </h3>
              <button
                onClick={handleSaveConclusions}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-700 hover:bg-teal-600 text-white transition-all cursor-pointer"
              >
                Guardar Conclusiones
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Conclusiones Técnicas del Diagnóstico Inicial:
                </label>
                <textarea
                  rows={5}
                  value={conclusionsText}
                  onChange={(e) => setConclusionsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 leading-relaxed text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Recomendaciones Técnicas para el Plan de Trabajo Anual:
                </label>
                <textarea
                  rows={5}
                  value={recommendationsText}
                  onChange={(e) => setRecommendationsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 leading-relaxed text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Historical Evaluations Log */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-teal-600" />
              <span>Historial Inmutable de Evaluaciones Iniciales Anteriores</span>
            </h3>
            <p className="text-xs text-slate-600">
              Registros históricos de evaluaciones cerradas para trazabilidad y comparativo de evolución interanual.
            </p>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {initialEvaluationState.history.map(hist => (
                <div key={hist.id} className="p-3.5 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Periodo {hist.periodYear}</span>
                      <span className="px-2 py-0.2 rounded font-mono text-[10px] bg-slate-200 text-slate-800">
                        Versión {hist.version}.0
                      </span>
                      <span className="px-2 py-0.2 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        {hist.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Evaluador: {hist.evaluatorName} • Fecha de corte: {hist.evaluationDate}
                    </p>
                    <p className="text-slate-500 text-[11px] italic mt-1 max-w-xl">
                      "{hist.technicalConclusions}"
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-black font-mono text-teal-800">{hist.complianceScorePercentage}%</span>
                    <span className="text-[10px] text-slate-500 block">{hist.totalGaps} brechas registradas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: VISTA INFORME TÉCNICO OFICIAL (PDF PRINTABLE) */}
      {activeTab === 'REPORT' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
            <div>
              <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                Vista Preliminar de Impresión & Exportación Oficial
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Utilice el botón para imprimir o guardar como PDF oficial en formato institucional de alta fidelidad.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintReport}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar como PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Report Document (ID: #printable-initial-evaluation) */}
          <div id="printable-initial-evaluation" className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-xl space-y-6 text-slate-900 text-xs">
            {/* 1. Encabezado Membretado Oficial */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-800">
                  AGAE SOLUTIONS • SG-SST CONFORME AL DECRETO 1072 DE 2015
                </span>
                <h1 className="text-xl font-black text-slate-900 uppercase">
                  Informe Técnico de Evaluación Inicial del SG-SST
                </h1>
                <p className="text-xs text-slate-700 font-semibold">
                  {organization.name} • NIT: {organization.nit} • Actividad Económica: {organization.economicActivity}
                </p>
              </div>

              <div className="text-right text-[11px] space-y-0.5 border-l-2 border-slate-200 pl-4 shrink-0 font-mono">
                <div><strong>Código Doc:</strong> INF-EVAL-SST-01</div>
                <div><strong>Versión:</strong> {initialEvaluationState.version}.0</div>
                <div><strong>Periodo Evaluado:</strong> {initialEvaluationState.evaluationPeriod}</div>
                <div><strong>Fecha de Emisión:</strong> {initialEvaluationState.updatedAt}</div>
              </div>
            </div>

            {/* 2. Objetivo, Alcance y Metodología */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-1.5 rounded">
                1. Objetivo, Alcance y Fundamento Normativo
              </h2>
              <p className="text-slate-700 leading-relaxed text-justify">
                <strong>Objetivo:</strong> Realizar el diagnóstico inicial del Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST) conforme a las exigencias del <strong>Artículo 2.2.4.6.16 del Decreto 1072 de 2015</strong>, con el fin de identificar prioridades en salud y seguridad en el trabajo, establecer las brechas existentes y formular el Plan de Trabajo Anual del periodo {initialEvaluationState.evaluationPeriod}.
              </p>
              <p className="text-slate-700 leading-relaxed text-justify">
                <strong>Alcance:</strong> Aplica a la totalidad de los procesos, centros de trabajo y trabajadores directos, temporales y contratistas de <strong>{organization.name}</strong>.
              </p>
              <p className="text-slate-700 leading-relaxed text-justify">
                <strong>Metodología:</strong> Verificación sistemática de 30 aspectos evaluados agrupados en 10 componentes normativos. Cada aspecto fue contrastado contra la evidencia digital disponible en la plataforma AGAE SOLUTIONS y validado técnicamente por el profesional en SST con licencia profesional.
              </p>
            </div>

            {/* 3. Responsables del Instrumento */}
            <div className="grid grid-cols-2 gap-3 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <strong>Evaluador Responsable (Líder SST):</strong>
                <span className="block text-slate-800">{initialEvaluationState.evaluatorName}</span>
                <span className="text-[10px] text-slate-600 block">{initialEvaluationState.evaluatorRole}</span>
                <span className="text-[10px] text-slate-600 block">{initialEvaluationState.evaluatorLicense}</span>
              </div>
              <div>
                <strong>Revisor y Aprobador (Alta Dirección):</strong>
                <span className="block text-slate-800">{initialEvaluationState.approverName}</span>
                <span className="text-[10px] text-slate-600 block">{initialEvaluationState.approverRole}</span>
                <span className="text-[10px] text-emerald-700 font-bold block">Representante Legal Avalado</span>
              </div>
            </div>

            {/* 4. Resumen Consolidado de Resultados */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-1.5 rounded">
                2. Consolidado de Resultados de Cumplimiento Técnico
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-100 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Total Criterios</span>
                  <strong className="text-base text-slate-900 font-mono">{metrics.totalCriteria}</strong>
                </div>
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <span className="text-emerald-700 text-[10px] block">Cumplen Totalmente</span>
                  <strong className="text-base font-mono">{metrics.compliantCriteria} ({metrics.totalCriteria > 0 ? Math.round((metrics.compliantCriteria / metrics.totalCriteria) * 100) : 0}%)</strong>
                </div>
                <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
                  <span className="text-amber-700 text-[10px] block">Cumplen Parcialmente</span>
                  <strong className="text-base font-mono">{metrics.partialCriteria}</strong>
                </div>
                <div className="p-2 rounded bg-teal-50 border border-teal-200 text-teal-900">
                  <span className="text-teal-700 text-[10px] block">Puntaje Técnico Global</span>
                  <strong className="text-base font-mono font-black">{metrics.complianceScorePercentage}%</strong>
                </div>
              </div>
            </div>

            {/* 5. Tabla de Cumplimiento por Componente */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-1.5 rounded">
                3. Desempeño por Componente del Decreto 1072
              </h2>

              <table className="w-full text-[11px] border border-slate-200">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-[10px]">
                  <tr>
                    <th className="p-2 border-r border-slate-200">#</th>
                    <th className="p-2 border-r border-slate-200">Componente Evaluado</th>
                    <th className="p-2 text-center border-r border-slate-200">Total</th>
                    <th className="p-2 text-center border-r border-slate-200">Cumple</th>
                    <th className="p-2 text-center border-r border-slate-200">Parcial</th>
                    <th className="p-2 text-center border-r border-slate-200">No Cumple</th>
                    <th className="p-2 text-right">Puntaje (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metrics.componentScores.map((c, i) => (
                    <tr key={c.componentId}>
                      <td className="p-2 font-mono font-bold border-r border-slate-200">{i + 1}</td>
                      <td className="p-2 font-semibold border-r border-slate-200">{c.componentTitle}</td>
                      <td className="p-2 text-center font-mono border-r border-slate-200">{c.total}</td>
                      <td className="p-2 text-center font-mono text-emerald-700 border-r border-slate-200">{c.compliant}</td>
                      <td className="p-2 text-center font-mono text-amber-700 border-r border-slate-200">{c.partial}</td>
                      <td className="p-2 text-center font-mono text-rose-700 border-r border-slate-200">{c.nonCompliant}</td>
                      <td className="p-2 text-right font-mono font-bold text-teal-800">{c.scorePercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 6. Checklist Detallado de Criterios */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-1.5 rounded">
                4. Matriz Detallada de Criterios y Evidencias Evaluadas
              </h2>

              <table className="w-full text-[10px] border border-slate-200">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-1.5 border-r border-slate-200 w-14">Código</th>
                    <th className="p-1.5 border-r border-slate-200">Aspecto Evaluado & Fundamento Legal</th>
                    <th className="p-1.5 border-r border-slate-200">Evidencia / Módulo AGAE</th>
                    <th className="p-1.5 text-center border-r border-slate-200 w-24">Resultado</th>
                    <th className="p-1.5">Observación Técnica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialEvaluationState.items.map(it => (
                    <tr key={it.id} className="align-top">
                      <td className="p-1.5 font-mono font-bold border-r border-slate-200">{it.code}</td>
                      <td className="p-1.5 border-r border-slate-200">
                        <span className="font-semibold block">{it.aspect}</span>
                        <span className="text-[9px] text-slate-500 italic block">{it.legalBasis}</span>
                      </td>
                      <td className="p-1.5 border-r border-slate-200">
                        <span className="font-semibold block">{it.sourceModule.moduleName}</span>
                        <span className="text-[9px] text-slate-500 block">{it.sourceModule.evidenceName}</span>
                      </td>
                      <td className="p-1.5 text-center font-bold border-r border-slate-200">
                        <span className={`px-1 py-0.5 rounded text-[9px] block ${
                          it.status === 'CUMPLE' ? 'bg-emerald-100 text-emerald-800' :
                          it.status === 'CUMPLE_PARCIALMENTE' ? 'bg-amber-100 text-amber-800' :
                          it.status === 'NO_CUMPLE' ? 'bg-rose-100 text-rose-800' :
                          it.status === 'NO_APLICA' ? 'bg-slate-200 text-slate-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {it.status}
                        </span>
                      </td>
                      <td className="p-1.5 text-slate-700">
                        {it.evaluatorObservations}
                        {it.identifiedGap && (
                          <span className="block text-amber-800 font-semibold mt-0.5">
                            Brecha: {it.identifiedGap}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 7. Plan de Intervención y Acciones de Mejora */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-1.5 rounded">
                5. Plan de Intervención de Brechas Prioritarias
              </h2>

              <table className="w-full text-[10px] border border-slate-200">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-1.5 border-r border-slate-200 w-16">Criterio</th>
                    <th className="p-1.5 border-r border-slate-200">Brecha Identificada</th>
                    <th className="p-1.5 border-r border-slate-200">Acción Requerida</th>
                    <th className="p-1.5 border-r border-slate-200">Responsable</th>
                    <th className="p-1.5 text-center border-r border-slate-200">Plazo</th>
                    <th className="p-1.5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialEvaluationState.actions.map(act => (
                    <tr key={act.id}>
                      <td className="p-1.5 font-mono font-bold border-r border-slate-200">{act.criterionCode}</td>
                      <td className="p-1.5 font-semibold text-slate-800 border-r border-slate-200">{act.gapDescription}</td>
                      <td className="p-1.5 text-slate-700 border-r border-slate-200">{act.requiredAction}</td>
                      <td className="p-1.5 border-r border-slate-200">{act.responsible}</td>
                      <td className="p-1.5 text-center font-mono border-r border-slate-200">{act.dueDate}</td>
                      <td className="p-1.5 text-center font-bold text-amber-800">{act.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 8. Conclusiones y Recomendaciones */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-1.5 rounded">
                6. Conclusiones y Recomendaciones Técnicas
              </h2>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2 text-slate-800 leading-relaxed text-justify">
                <p><strong>Conclusiones:</strong> {initialEvaluationState.technicalConclusions}</p>
                <p><strong>Recomendaciones:</strong> {initialEvaluationState.technicalRecommendations}</p>
              </div>
            </div>

            {/* 9. Firmas Formales */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="border-t border-slate-900 pt-2">
                <strong className="block text-slate-900">{initialEvaluationState.evaluatorName}</strong>
                <span className="block text-slate-600 text-[10px]">{initialEvaluationState.evaluatorRole}</span>
                <span className="block text-slate-600 text-[10px] font-mono">{initialEvaluationState.evaluatorLicense}</span>
                <span className="block text-teal-800 text-[10px] font-bold mt-1">Líder Evaluador SG-SST</span>
              </div>

              <div className="border-t border-slate-900 pt-2">
                <strong className="block text-slate-900">{initialEvaluationState.approverName}</strong>
                <span className="block text-slate-600 text-[10px]">{initialEvaluationState.approverRole}</span>
                <span className="block text-slate-600 text-[10px] font-mono">C.C. Representante Legal</span>
                <span className="block text-emerald-800 text-[10px] font-bold mt-1">Aprobado por Alta Dirección</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Crear / Editar Acción de Mejora */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveAction}
            className="bg-white border border-slate-300 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 text-xs text-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 text-white">
                  {targetItemForAction?.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Formular Acción de Mejora por Brecha
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowActionModal(false)}
                className="text-slate-500 hover:text-slate-800 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Descripción de la Brecha *</label>
                <textarea
                  rows={2}
                  required
                  value={actionFormData.gapDescription}
                  onChange={(e) => setActionFormData({ ...actionFormData, gapDescription: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Actividad o Acción Requerida *</label>
                <textarea
                  rows={2}
                  required
                  value={actionFormData.requiredAction}
                  onChange={(e) => setActionFormData({ ...actionFormData, requiredAction: e.target.value })}
                  placeholder="Detalle la actividad concreta para solventar la no conformidad..."
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Responsable de Ejecución *</label>
                  <input
                    type="text"
                    required
                    value={actionFormData.responsible}
                    onChange={(e) => setActionFormData({ ...actionFormData, responsible: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha Límite Prevista *</label>
                  <input
                    type="date"
                    required
                    value={actionFormData.dueDate}
                    onChange={(e) => setActionFormData({ ...actionFormData, dueDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Recursos Necesarios Asignados</label>
                <input
                  type="text"
                  value={actionFormData.resourcesNeeded}
                  onChange={(e) => setActionFormData({ ...actionFormData, resourcesNeeded: e.target.value })}
                  placeholder="Ej: Presupuesto SG-SST, asesoría ARL, horas de personal..."
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-teal-900 block text-xs">Vincular a Matriz ACPM Central</span>
                  <span className="text-[10px] text-teal-700">Crea el hallazgo y acción correctiva sin doble digitación</span>
                </div>
                <input
                  type="checkbox"
                  checked={actionFormData.sendToAcpm}
                  onChange={(e) => setActionFormData({ ...actionFormData, sendToAcpm: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowActionModal(false)}
                className="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold transition-all shadow-sm cursor-pointer"
              >
                Guardar Acción
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
