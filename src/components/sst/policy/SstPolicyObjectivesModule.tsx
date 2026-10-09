'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  FileText,
  Target,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Calendar,
  Clock,
  UserCheck,
  Building,
  Award,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowRight,
  ExternalLink,
  Plus,
  Edit3,
  Save,
  Trash2,
  Printer,
  Download,
  Share2,
  History,
  Activity,
  BarChart3,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  FileCheck,
  HelpCircle,
  Link as LinkIcon,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  SstPolicyDocument,
  SstPolicyCommitment,
  SstPolicyRevisionRecord,
  SstObjectiveItem,
  SstObjectiveFollowUp,
  SstObjectiveDeviationAction,
  SstObjectiveTargetCriteria,
  SstObjectiveFrequency,
  SstObjectiveStatus
} from '@/types/policy-objectives';
import { INITIAL_SST_OBJECTIVES } from '@/lib/policy-objectives-mock';

interface SstPolicyObjectivesModuleProps {
  initialTab?: 'POLICY' | 'OBJECTIVES' | 'TRACEABILITY';
}

export const SstPolicyObjectivesModule: React.FC<SstPolicyObjectivesModuleProps> = ({
  initialTab = 'POLICY'
}) => {
  const {
    organization,
    workers,
    policyObjectivesState,
    updateSstPolicy,
    signSstPolicyLegalRep,
    addSstPolicyRevision,
    addSstObjective,
    updateSstObjective,
    deleteSstObjective,
    addSstObjectiveFollowUp,
    addSstObjectiveDeviation,
    addFinding,
    showNotification,
    setActiveTab
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'POLICY' | 'OBJECTIVES' | 'TRACEABILITY'>(initialTab);

  // Policy View/Edit states
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState<SstPolicyDocument>(policyObjectivesState.policy);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionSummaryInput, setRevisionSummaryInput] = useState('');
  const [revisionConcept, setRevisionConcept] = useState<'RATIFICADA_SIN_CAMBIOS' | 'ACTUALIZADA_CON_CAMBIOS'>('RATIFICADA_SIN_CAMBIOS');

  // Objectives Filters & Search
  const [objSearchQuery, setObjSearchQuery] = useState('');
  const [objCommitmentFilter, setObjCommitmentFilter] = useState('ALL');
  const [objStatusFilter, setObjStatusFilter] = useState('ALL');
  const [objFrequencyFilter, setObjFrequencyFilter] = useState('ALL');

  // Objectives Modals
  const [isNewObjectiveModalOpen, setIsNewObjectiveModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<SstObjectiveItem | null>(null);
  const [selectedObjectiveForFollowUp, setSelectedObjectiveForFollowUp] = useState<SstObjectiveItem | null>(null);
  const [selectedObjectiveForDeviation, setSelectedObjectiveForDeviation] = useState<SstObjectiveItem | null>(null);
  const [selectedObjectiveForHistory, setSelectedObjectiveForHistory] = useState<SstObjectiveItem | null>(null);

  // Form State: New / Edit Objective
  const [objectiveFormData, setObjectiveFormData] = useState<{
    code: string;
    name: string;
    description: string;
    policyCommitmentId: string;
    responsible: string;
    period: string;
    baseline: string;
    targetValue: number;
    targetUnit: string;
    targetDeadline: string;
    targetCriteria: SstObjectiveTargetCriteria;
    rangeMin: number;
    rangeMax: number;
    frequency: SstObjectiveFrequency;
    observations: string;
    relatedPrograms: string[];
    indicatorName: string;
    indicatorType: 'ESTRUCTURA' | 'PROCESO' | 'RESULTADO';
    indicatorFormula: string;
    indicatorTarget: string;
  }>({
    code: `OBJ-SST-0${policyObjectivesState.objectives.length + 1}`,
    name: '',
    description: '',
    policyCommitmentId: policyObjectivesState.policy.commitments[0]?.id || 'comp-01',
    responsible: 'Sandra Milena Gómez (Líder SST)',
    period: '2026',
    baseline: '',
    targetValue: 90,
    targetUnit: '%',
    targetDeadline: '2026-12-31',
    targetCriteria: 'SUPERAR_VALOR',
    rangeMin: 80,
    rangeMax: 100,
    frequency: 'TRIMESTRAL',
    observations: '',
    relatedPrograms: ['Plan Anual de Trabajo', 'Capacitación SST'],
    indicatorName: '',
    indicatorType: 'PROCESO',
    indicatorFormula: '',
    indicatorTarget: ''
  });

  // Form State: Follow-Up
  const [followUpFormData, setFollowUpFormData] = useState({
    periodEvaluated: 'Q1 2026 (Ene - Mar)',
    evaluatedAt: new Date().toISOString().split('T')[0],
    actualValue: 0,
    observations: '',
    evidenceTitle: '',
    responsibleName: 'Sandra Milena Gómez'
  });

  // Form State: Deviation
  const [deviationFormData, setDeviationFormData] = useState({
    period: 'Q1 2026',
    deviationAnalysis: '',
    rootCause: '',
    requiredAction: '',
    responsible: 'Sandra Milena Gómez',
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    sendToAcpm: true
  });

  // Calculate annual review status
  const annualReviewStatus = useMemo(() => {
    const lastRev = new Date(policyObjectivesState.policy.lastRevisionDate);
    const deadline = new Date(policyObjectivesState.policy.nextRevisionDeadline);
    const today = new Date();
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));

    return {
      isExpired: diffDays < 0,
      isNearExpiry: diffDays >= 0 && diffDays <= 45,
      daysRemaining: diffDays,
      deadlineFormatted: policyObjectivesState.policy.nextRevisionDeadline
    };
  }, [policyObjectivesState.policy.lastRevisionDate, policyObjectivesState.policy.nextRevisionDeadline]);

  // Mandatory commitments validation (Dec 1072 Art. 2.2.4.6.6)
  const mandatoryCommitmentsCheck = useMemo(() => {
    const mandatory = policyObjectivesState.policy.commitments.filter(c => c.isMandatoryLegal);
    const hasPeligros = mandatory.some(c => c.id === 'comp-01' && c.isActive);
    const hasProteccion = mandatory.some(c => c.id === 'comp-02' && c.isActive);
    const hasNorma = mandatory.some(c => c.id === 'comp-03' && c.isActive);
    return {
      hasPeligros,
      hasProteccion,
      hasNorma,
      allMet: hasPeligros && hasProteccion && hasNorma
    };
  }, [policyObjectivesState.policy.commitments]);

  // Statistics & KPIs of Objectives
  const stats = useMemo(() => {
    const total = policyObjectivesState.objectives.length;
    const fulfilled = policyObjectivesState.objectives.filter(o => o.status === 'CUMPLIDO' || o.status === 'EN_CUMPLIMIENTO').length;
    const atRisk = policyObjectivesState.objectives.filter(o => o.status === 'EN_RIESGO').length;
    const failed = policyObjectivesState.objectives.filter(o => o.status === 'INCUMPLIDO').length;

    // Average progress
    let sumProgress = 0;
    let countWithFollowUp = 0;
    policyObjectivesState.objectives.forEach(o => {
      if (o.followUps.length > 0) {
        sumProgress += o.followUps[0].progressPercentage;
        countWithFollowUp++;
      }
    });
    const avgProgress = countWithFollowUp > 0 ? Math.round(sumProgress / countWithFollowUp) : 0;

    // Policy commitments coverage
    const coveredCommitments = new Set(policyObjectivesState.objectives.map(o => o.policyCommitmentId)).size;
    const totalActiveCommitments = policyObjectivesState.policy.commitments.filter(c => c.isActive).length;

    return {
      total,
      fulfilled,
      atRisk,
      failed,
      avgProgress,
      coveredCommitments,
      totalActiveCommitments,
      coverageRate: totalActiveCommitments > 0 ? Math.round((coveredCommitments / totalActiveCommitments) * 100) : 100
    };
  }, [policyObjectivesState.objectives, policyObjectivesState.policy.commitments]);

  // Filtered Objectives List
  const filteredObjectives = useMemo(() => {
    return policyObjectivesState.objectives.filter(obj => {
      const matchCommitment = objCommitmentFilter === 'ALL' || obj.policyCommitmentId === objCommitmentFilter;
      const matchStatus = objStatusFilter === 'ALL' || obj.status === objStatusFilter;
      const matchFrequency = objFrequencyFilter === 'ALL' || obj.frequency === objFrequencyFilter;
      const matchSearch = objSearchQuery.trim() === '' ||
        obj.code.toLowerCase().includes(objSearchQuery.toLowerCase()) ||
        obj.name.toLowerCase().includes(objSearchQuery.toLowerCase()) ||
        obj.description.toLowerCase().includes(objSearchQuery.toLowerCase()) ||
        obj.responsible.toLowerCase().includes(objSearchQuery.toLowerCase());
      return matchCommitment && matchStatus && matchFrequency && matchSearch;
    });
  }, [policyObjectivesState.objectives, objCommitmentFilter, objStatusFilter, objFrequencyFilter, objSearchQuery]);

  // Open modal to create objective
  const handleOpenCreateObjective = () => {
    setEditingObjective(null);
    setObjectiveFormData({
      code: `OBJ-SST-0${policyObjectivesState.objectives.length + 1}`,
      name: '',
      description: '',
      policyCommitmentId: policyObjectivesState.policy.commitments[0]?.id || 'comp-01',
      responsible: 'Sandra Milena Gómez (Líder SST)',
      period: '2026',
      baseline: '',
      targetValue: 90,
      targetUnit: '%',
      targetDeadline: '2026-12-31',
      targetCriteria: 'SUPERAR_VALOR',
      rangeMin: 80,
      rangeMax: 100,
      frequency: 'TRIMESTRAL',
      observations: '',
      relatedPrograms: ['Plan Anual de Trabajo', 'Capacitación SST'],
      indicatorName: '',
      indicatorType: 'PROCESO',
      indicatorFormula: '',
      indicatorTarget: ''
    });
    setIsNewObjectiveModalOpen(true);
  };

  // Open modal to edit objective
  const handleOpenEditObjective = (obj: SstObjectiveItem) => {
    setEditingObjective(obj);
    setObjectiveFormData({
      code: obj.code,
      name: obj.name,
      description: obj.description,
      policyCommitmentId: obj.policyCommitmentId,
      responsible: obj.responsible,
      period: obj.period,
      baseline: obj.baseline,
      targetValue: obj.targetValue,
      targetUnit: obj.targetUnit,
      targetDeadline: obj.targetDeadline,
      targetCriteria: obj.targetCriteria,
      rangeMin: obj.rangeMin ?? 80,
      rangeMax: obj.rangeMax ?? 100,
      frequency: obj.frequency,
      observations: obj.observations,
      relatedPrograms: obj.relatedPrograms,
      indicatorName: obj.indicators[0]?.name || '',
      indicatorType: obj.indicators[0]?.type || 'PROCESO',
      indicatorFormula: obj.indicators[0]?.formula || '',
      indicatorTarget: obj.indicators[0]?.target || ''
    });
    setIsNewObjectiveModalOpen(true);
  };

  // Save objective (Create or Update)
  const handleSaveObjective = (e: React.FormEvent) => {
    e.preventDefault();
    const commitment = policyObjectivesState.policy.commitments.find(c => c.id === objectiveFormData.policyCommitmentId);
    const commitmentTitle = commitment ? `${commitment.title} (${commitment.code})` : 'Compromiso de Política';

    const indicators = objectiveFormData.indicatorName.trim() ? [
      {
        id: `ind-${Date.now()}`,
        name: objectiveFormData.indicatorName.trim(),
        type: objectiveFormData.indicatorType,
        formula: objectiveFormData.indicatorFormula.trim() || 'Calculado periódicamente según ficha técnica',
        target: objectiveFormData.indicatorTarget.trim() || `${objectiveFormData.targetValue} ${objectiveFormData.targetUnit}`
      }
    ] : [];

    if (editingObjective) {
      updateSstObjective(editingObjective.id, {
        code: objectiveFormData.code,
        name: objectiveFormData.name,
        description: objectiveFormData.description,
        policyCommitmentId: objectiveFormData.policyCommitmentId,
        policyCommitmentTitle: commitmentTitle,
        responsible: objectiveFormData.responsible,
        period: objectiveFormData.period,
        baseline: objectiveFormData.baseline,
        targetValue: Number(objectiveFormData.targetValue),
        targetUnit: objectiveFormData.targetUnit,
        targetDeadline: objectiveFormData.targetDeadline,
        targetCriteria: objectiveFormData.targetCriteria,
        rangeMin: Number(objectiveFormData.rangeMin),
        rangeMax: Number(objectiveFormData.rangeMax),
        frequency: objectiveFormData.frequency,
        observations: objectiveFormData.observations,
        relatedPrograms: objectiveFormData.relatedPrograms,
        indicators: indicators.length > 0 ? indicators : editingObjective.indicators
      });
    } else {
      addSstObjective({
        code: objectiveFormData.code,
        name: objectiveFormData.name,
        description: objectiveFormData.description,
        policyCommitmentId: objectiveFormData.policyCommitmentId,
        policyCommitmentTitle: commitmentTitle,
        responsible: objectiveFormData.responsible,
        period: objectiveFormData.period,
        baseline: objectiveFormData.baseline,
        targetValue: Number(objectiveFormData.targetValue),
        targetUnit: objectiveFormData.targetUnit,
        targetDeadline: objectiveFormData.targetDeadline,
        targetCriteria: objectiveFormData.targetCriteria,
        rangeMin: Number(objectiveFormData.rangeMin),
        rangeMax: Number(objectiveFormData.rangeMax),
        frequency: objectiveFormData.frequency,
        status: 'ACTIVO',
        observations: objectiveFormData.observations,
        indicators: indicators.length > 0 ? indicators : [
          {
            id: `ind-${Date.now()}`,
            name: `Índice de cumplimiento de ${objectiveFormData.name}`,
            type: 'PROCESO',
            formula: '(Resultado obtenido / Meta esperada) * 100',
            target: `${objectiveFormData.targetValue} ${objectiveFormData.targetUnit}`
          }
        ],
        relatedPrograms: objectiveFormData.relatedPrograms
      });
    }

    setIsNewObjectiveModalOpen(false);
  };

  // Submit Follow-Up
  const handleSubmitFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedObjectiveForFollowUp) return;

    const actual = Number(followUpFormData.actualValue);
    const target = selectedObjectiveForFollowUp.targetValue;
    let progress = 0;

    if (selectedObjectiveForFollowUp.targetCriteria === 'SUPERAR_VALOR') {
      progress = target > 0 ? Math.round((actual / target) * 100) : 100;
    } else if (selectedObjectiveForFollowUp.targetCriteria === 'MANTENER_DEBAJO') {
      progress = actual <= target ? 100 : Math.max(0, Math.round((target / actual) * 100));
    } else {
      progress = 90;
    }

    let calculatedStatus: SstObjectiveStatus = 'EN_CUMPLIMIENTO';
    if (progress >= 100) calculatedStatus = 'CUMPLIDO';
    else if (progress >= 80) calculatedStatus = 'EN_CUMPLIMIENTO';
    else calculatedStatus = 'EN_RIESGO';

    addSstObjectiveFollowUp(selectedObjectiveForFollowUp.id, {
      periodEvaluated: followUpFormData.periodEvaluated,
      evaluatedAt: followUpFormData.evaluatedAt,
      actualValue: actual,
      targetExpected: target,
      progressPercentage: progress,
      calculatedStatus,
      observations: followUpFormData.observations,
      evidenceTitle: followUpFormData.evidenceTitle || 'Reporte de Seguimiento Periódico',
      responsibleName: followUpFormData.responsibleName
    });

    setSelectedObjectiveForFollowUp(null);
  };

  // Submit Deviation & ACPM
  const handleSubmitDeviation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedObjectiveForDeviation) return;

    addSstObjectiveDeviation(
      selectedObjectiveForDeviation.id,
      {
        period: deviationFormData.period,
        deviationAnalysis: deviationFormData.deviationAnalysis,
        rootCause: deviationFormData.rootCause,
        requiredAction: deviationFormData.requiredAction,
        responsible: deviationFormData.responsible,
        deadline: deviationFormData.deadline,
        sentToAcpm: deviationFormData.sendToAcpm
      },
      deviationFormData.sendToAcpm
    );

    setSelectedObjectiveForDeviation(null);
  };

  // Save Policy edits
  const handleSavePolicyEdits = (e: React.FormEvent) => {
    e.preventDefault();
    updateSstPolicy(editedPolicy);
    setIsEditingPolicy(false);
    showNotification('Política de SST actualizada exitosamente', 'success');
  };

  // Submit annual review registration
  const handleSubmitRevision = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const nextVer = (parseInt(policyObjectivesState.policy.version, 10) + 1).toString().padStart(2, '0');

    addSstPolicyRevision({
      revisionNumber: nextVer,
      revisionDate: today,
      reviewedBy: policyObjectivesState.policy.legalRepName,
      role: 'Representante Legal / Gerencia General',
      changesSummary: revisionSummaryInput || 'Revisión anual obligatoria reglamentaria ratificada conforme al Decreto 1072 de 2015.',
      status: revisionConcept
    });

    setIsRevisionModalOpen(false);
    setRevisionSummaryInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* ============================================================== */}
      {/* 1. HEADER DEL MÓDULO & MARCO NORMATIVO 2.1.1 Y 2.1.2 */}
      {/* ============================================================== */}
      <div className="glass-card p-5 rounded-2xl flex flex-col gap-4 border border-teal-200/80 bg-gradient-to-br from-white via-teal-50/20 to-slate-50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-3 rounded-2xl bg-teal-700 text-white shadow-md shadow-teal-700/20 shrink-0">
              <Target className="w-7 h-7" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Política & Objetivos del SG-SST
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-teal-100 text-teal-800 border border-teal-300 uppercase tracking-wide">
                  Estándares 2.1.1 y 2.1.2
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                  Decreto 1072 de 2015 Arts. 2.2.4.6.5 al 2.2.4.6.18
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-4xl leading-relaxed">
                Herramienta integral de direccionamiento estratégico: formulación participativa de la <strong>Política de SST</strong> con sus 3 compromisos mínimos legales, firma electrónica de la Gerencia, control de revisión anual obligatoria, y <strong>Matriz de Objetivos del SG-SST</strong> medibles, cuantificables y articulados con trazabilidad a indicadores y acciones ACPM.
              </p>
            </div>
          </div>

          {/* Selector de Pestañas del Módulo */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl shrink-0 self-start lg:self-center">
            <button
              onClick={() => setActiveTabLocal('POLICY')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'POLICY'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2.1.1 Política de SST</span>
            </button>

            <button
              onClick={() => setActiveTabLocal('OBJECTIVES')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'OBJECTIVES'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>2.1.2 Objetivos SG-SST ({policyObjectivesState.objectives.length})</span>
            </button>

            <button
              onClick={() => setActiveTabLocal('TRACEABILITY')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'TRACEABILITY'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Trazabilidad 360°</span>
            </button>
          </div>
        </div>

        {/* Banner de Validación Normativa y Revisión Anual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-teal-100 text-xs">
          {/* Card 1: Estado de la Política */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Estado Política 2.1.1:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${
                  policyObjectivesState.policy.signedByLegalRep ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <span className="font-black text-slate-900">
                  {policyObjectivesState.policy.signedByLegalRep ? 'Aprobada & Firmada' : 'En Revisión'} (v{policyObjectivesState.policy.version})
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Firmada: {policyObjectivesState.policy.signedAt?.split(' ')[0] || 'Pendiente'}
            </span>
          </div>

          {/* Card 2: Revisión Anual Obligatoria (Dec 1072 Art 2.2.4.6.7) */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            annualReviewStatus.isExpired
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : annualReviewStatus.isNearExpiry
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
          }`}>
            <div>
              <span className="text-[10px] font-bold uppercase block">Revisión Anual Obligatoria:</span>
              <span className="font-black block mt-0.5">
                {annualReviewStatus.isExpired
                  ? 'Vencida (> 1 año)'
                  : `Vigente (${annualReviewStatus.daysRemaining} días restantes)`}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold">
              Plazo: {annualReviewStatus.deadlineFormatted}
            </span>
          </div>

          {/* Card 3: Cobertura de Compromisos por Objetivos */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Compromisos con Objetivos:</span>
              <span className="font-black text-slate-900 block mt-0.5">
                {stats.coveredCommitments} de {stats.totalActiveCommitments} compromisos cubiertos ({stats.coverageRate}%)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-teal-100 text-teal-800 border border-teal-200">
              {stats.coverageRate >= 100 ? '100% Trazable ✓' : 'Parcial'}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PESTAÑA 1: POLÍTICA DEL SG-SST (ESTÁNDAR 2.1.1) */}
      {/* ============================================================== */}
      {activeTab === 'POLICY' && (
        <div className="space-y-6">
          {/* Barra de Acciones de la Política */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-teal-100 text-teal-800">
                <FileCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-black text-xs text-slate-900 uppercase">
                  Gestión y Gobernanza de la Política de SST
                </h3>
                <p className="text-[11px] text-slate-500">
                  Flujo de creación por Líder SST, firma del Representante Legal e historial de revisiones anuales.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setEditedPolicy(policyObjectivesState.policy);
                  setIsEditingPolicy(!isEditingPolicy);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isEditingPolicy
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingPolicy ? 'Cancelar Edición' : 'Editar Parámetros & Compromisos'}</span>
              </button>

              <button
                onClick={() => setIsRevisionModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 transition-all flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5 text-teal-700" />
                <span>Registrar Revisión Anual</span>
              </button>

              {!policyObjectivesState.policy.signedByLegalRep && (
                <button
                  onClick={signSstPolicyLegalRep}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Firmar como Representante Legal</span>
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Guardar PDF</span>
              </button>
            </div>
          </div>

          {/* MODO EDITOR DE PARÁMETROS DE LA POLÍTICA */}
          {isEditingPolicy ? (
            <form onSubmit={handleSavePolicyEdits} className="glass-card p-6 rounded-2xl border border-amber-300 bg-amber-50/20 space-y-5 text-xs animate-in fade-in">
              <div className="flex items-center gap-2 p-3 bg-amber-100/70 border border-amber-300 rounded-xl text-amber-950">
                <Edit3 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Configurador Interactivo de la Política:</strong> Permite personalizar la declaración institucional, centros de trabajo y compromisos organizacionales. El sistema le recuerda los 3 compromisos mínimos obligatorios fijados por el Decreto 1072 de 2015.
                </span>
              </div>

              {/* Razón Social y Centros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Empresa / Razón Social</label>
                  <input
                    type="text"
                    required
                    value={editedPolicy.companyName}
                    onChange={(e) => setEditedPolicy({ ...editedPolicy, companyName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIT</label>
                  <input
                    type="text"
                    required
                    value={editedPolicy.nit}
                    onChange={(e) => setEditedPolicy({ ...editedPolicy, nit: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alcance y Centros de Trabajo Cubiertos</label>
                <textarea
                  rows={2}
                  required
                  value={editedPolicy.scope}
                  onChange={(e) => setEditedPolicy({ ...editedPolicy, scope: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Introducción Institucional</label>
                <textarea
                  rows={3}
                  required
                  value={editedPolicy.introduction}
                  onChange={(e) => setEditedPolicy({ ...editedPolicy, introduction: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white leading-relaxed"
                />
              </div>

              {/* Los 3 Compromisos Mínimos Legales Obligatorios */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-black text-xs text-slate-900 uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Compromisos de la Política (Art. 2.2.4.6.6 Dec. 1072)</span>
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    mandatoryCommitmentsCheck.allMet
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {mandatoryCommitmentsCheck.allMet ? '3 Mínimos Legales Presentes ✓' : 'Faltan Requisitos Legales ⚠️'}
                  </span>
                </div>

                <div className="space-y-3">
                  {editedPolicy.commitments.map((comp, idx) => (
                    <div
                      key={comp.id}
                      className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                        comp.isMandatoryLegal
                          ? 'bg-white border-teal-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-300">
                            {comp.code}
                          </span>
                          <span className="font-black text-xs text-slate-900">
                            {comp.title}
                          </span>
                          {comp.isMandatoryLegal && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                              Exigencia Legal Obligatoria
                            </span>
                          )}
                        </div>

                        {!comp.isMandatoryLegal && (
                          <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={comp.isActive}
                              onChange={(e) => {
                                const next = editedPolicy.commitments.map(c =>
                                  c.id === comp.id ? { ...c, isActive: e.target.checked } : c
                                );
                                setEditedPolicy({ ...editedPolicy, commitments: next });
                              }}
                              className="rounded text-teal-600"
                            />
                            <span>Activo</span>
                          </label>
                        )}
                      </div>

                      <textarea
                        rows={2}
                        value={comp.description}
                        onChange={(e) => {
                          const next = editedPolicy.commitments.map(c =>
                            c.id === comp.id ? { ...c, description: e.target.value } : c
                          );
                          setEditedPolicy({ ...editedPolicy, commitments: next });
                        }}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs leading-relaxed"
                      />
                      <span className="text-[10px] text-slate-500 italic">
                        Norma: {comp.legalArticle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cláusula de Cierre y Destinación de Recursos</label>
                <textarea
                  rows={2}
                  required
                  value={editedPolicy.closingStatement}
                  onChange={(e) => setEditedPolicy({ ...editedPolicy, closingStatement: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingPolicy(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Descartar Cambios
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold flex items-center gap-2 shadow-md shadow-teal-700/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Parámetros de la Política</span>
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================== */
            /* DOCUMENTO OFICIAL INSTITUCIONAL DE LA POLÍTICA (PRINT / PDF) */
            /* ========================================================== */
            <div id="printable-sst-policy" className="space-y-6 text-slate-800 bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-sm">
              {/* Estilos para exportación PDF limpia */}
              <style>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #printable-sst-policy, #printable-sst-policy * {
                    visibility: visible;
                  }
                  #printable-sst-policy {
                    position: fixed;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: auto;
                    margin: 0;
                    padding: 15mm 20mm;
                    background: white !important;
                    color: black !important;
                    font-size: 11pt !important;
                    line-height: 1.5 !important;
                    z-index: 999999;
                  }
                  .no-print {
                    display: none !important;
                  }
                }
              `}</style>

              {/* Membrete Oficial */}
              <div className="border-2 border-slate-900 rounded-xl overflow-hidden shadow-xs">
                <div className="grid grid-cols-12 divide-y md:divide-y-0 md:divide-x-2 divide-slate-900 bg-slate-50/60">
                  <div className="col-span-12 md:col-span-3 p-4 flex flex-col items-center justify-center text-center bg-white">
                    <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-base mb-1 shadow-xs">
                      AGAE
                    </div>
                    <span className="font-black text-xs text-slate-900 uppercase tracking-tight">
                      {policyObjectivesState.policy.companyName}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      NIT: {policyObjectivesState.policy.nit}
                    </span>
                  </div>

                  <div className="col-span-12 md:col-span-6 p-4 flex flex-col items-center justify-center text-center">
                    <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider">
                      SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)
                    </span>
                    <h2 className="font-black text-sm md:text-base text-slate-900 uppercase mt-0.5 tracking-tight">
                      POLÍTICA DE SEGURIDAD Y SALUD EN EL TRABAJO
                    </h2>
                    <span className="text-[10px] text-teal-800 font-extrabold uppercase mt-0.5">
                      DECRETO 1072 DE 2015 ARTS. 2.2.4.6.5 AL 2.2.4.6.7 • RESOLUCIÓN 0312 DE 2019 ESTÁNDAR 2.1.1
                    </span>
                  </div>

                  <div className="col-span-12 md:col-span-3 p-4 text-[10px] space-y-1 bg-white font-mono flex flex-col justify-center">
                    <div><strong className="text-slate-900">CÓDIGO:</strong> POL-SST-01</div>
                    <div><strong className="text-slate-900">VERSIÓN:</strong> {policyObjectivesState.policy.version}</div>
                    <div><strong className="text-slate-900">EMISIÓN:</strong> {policyObjectivesState.policy.issuedDate}</div>
                    <div><strong className="text-slate-900">ESTADO:</strong> {policyObjectivesState.policy.signedByLegalRep ? 'VIGENTE ✓' : 'EN TRÁMITE'}</div>
                  </div>
                </div>
              </div>

              {/* Texto de Introducción y Alcance */}
              <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                <p className="text-justify font-sans">
                  {policyObjectivesState.policy.introduction}
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">Alcance de Aplicación:</strong>
                  <p className="text-slate-700">{policyObjectivesState.policy.scope}</p>
                </div>
              </div>

              {/* Compromisos Numerados de la Política */}
              <div className="space-y-4">
                <div className="text-xs font-black text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1 flex items-center justify-between">
                  <span>COMPROMISOS INSTITUCIONALES DEL SG-SST</span>
                  <span className="text-[10px] font-semibold text-slate-500 font-mono">
                    Art. 2.2.4.6.6 Decreto 1072 de 2015
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  {policyObjectivesState.policy.commitments.filter(c => c.isActive).map((comp, idx) => (
                    <div key={comp.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200">
                      <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-xs">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-950 font-bold block text-[13px]">
                            {comp.title}
                          </strong>
                          <span className="text-[10px] text-teal-800 font-mono font-bold">
                            {comp.code}
                          </span>
                        </div>
                        <p className="text-slate-700 mt-1 text-justify">
                          {comp.description}
                        </p>
                        <span className="text-[10px] text-slate-500 italic block mt-1">
                          Base Jurídica: {comp.legalArticle}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Declaración de Recursos y Cierre */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-justify leading-relaxed text-slate-700">
                <p>{policyObjectivesState.policy.closingStatement}</p>
              </div>

              {/* Bloque Oficial de Firmas y Validación Institucional */}
              <div className="pt-6 border-t-2 border-slate-300 space-y-4">
                <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-600">
                  FORMALIZACIÓN, FIRMAS DIGITALES Y APROBACIÓN DE LA POLÍTICA
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  {/* Firma Representante Legal */}
                  <div className="border-t border-slate-700 pt-2 text-center space-y-1">
                    <div className="font-serif italic text-base text-teal-900">
                      {policyObjectivesState.policy.legalRepName}
                    </div>
                    <div className="font-black text-xs text-slate-900 uppercase">
                      {policyObjectivesState.policy.legalRepName}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Representante Legal / Gerencia General
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      C.C. {policyObjectivesState.policy.legalRepDoc}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold font-mono">
                      {policyObjectivesState.policy.signedByLegalRep
                        ? `Firma Electrónica Verificada (${policyObjectivesState.policy.signedAt}) ✓`
                        : 'Pendiente de Firma'}
                    </div>
                  </div>

                  {/* Aval Técnico Líder SST */}
                  <div className="border-t border-slate-700 pt-2 text-center space-y-1">
                    <div className="font-serif italic text-base text-teal-900">
                      {policyObjectivesState.policy.leaderSstName}
                    </div>
                    <div className="font-black text-xs text-slate-900 uppercase">
                      {policyObjectivesState.policy.leaderSstName}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Responsable del SG-SST (Diseño y Ejecución)
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Licencia SST: {policyObjectivesState.policy.leaderSstLicense}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold font-mono">
                      Aval Técnico Aprobado ✓
                    </div>
                  </div>
                </div>

                {/* Historial de Revisiones Anuales */}
                <div className="pt-4 border-t border-slate-200">
                  <span className="font-bold text-[11px] text-slate-700 uppercase tracking-wide block mb-2">
                    Historial Inmutable de Revisiones Anuales (Decreto 1072 Art. 2.2.4.6.7):
                  </span>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-100 font-bold text-slate-700">
                        <tr>
                          <th className="p-2">Versión</th>
                          <th className="p-2">Fecha Revisión</th>
                          <th className="p-2">Revisado Por</th>
                          <th className="p-2">Concepto</th>
                          <th className="p-2">Justificación / Ajustes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[10px]">
                        {policyObjectivesState.policy.revisionHistory.map((rev) => (
                          <tr key={rev.id}>
                            <td className="p-2 font-bold text-teal-800">v{rev.revisionNumber}</td>
                            <td className="p-2">{rev.revisionDate}</td>
                            <td className="p-2 font-sans font-semibold text-slate-800">{rev.reviewedBy} ({rev.role})</td>
                            <td className="p-2 font-sans">
                              <span className={`px-2 py-0.5 rounded font-bold ${
                                rev.status === 'RATIFICADA_SIN_CAMBIOS'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {rev.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="p-2 font-sans text-slate-600">{rev.changesSummary}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 2: OBJETIVOS DEL SG-SST (ESTÁNDAR 2.1.2) */}
      {/* ============================================================== */}
      {activeTab === 'OBJECTIVES' && (
        <div className="space-y-6">
          {/* Top Dashboard de Objetivos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total Objetivos</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">{stats.total}</div>
              <span className="text-[11px] text-slate-500">Definidos en el SG-SST</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">En Cumplimiento</span>
              <div className="text-2xl font-black text-emerald-800 font-mono mt-1">{stats.fulfilled}</div>
              <span className="text-[11px] text-emerald-700">Metas alcanzadas o en curso</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-amber-200 bg-amber-50/30">
              <span className="text-[10px] font-bold text-amber-700 uppercase">En Riesgo</span>
              <div className="text-2xl font-black text-amber-800 font-mono mt-1">{stats.atRisk}</div>
              <span className="text-[11px] text-amber-700">Desviaciones detectadas</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-rose-200 bg-rose-50/30">
              <span className="text-[10px] font-bold text-rose-700 uppercase">Incumplidos</span>
              <div className="text-2xl font-black text-rose-800 font-mono mt-1">{stats.failed}</div>
              <span className="text-[11px] text-rose-700">Requieren plan ACPM</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-teal-200 bg-teal-50/30 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-teal-700 uppercase">Avance Promedio</span>
              <div className="text-2xl font-black text-teal-800 font-mono mt-1">{stats.avgProgress}%</div>
              <span className="text-[11px] text-teal-700">Seguimiento ponderado</span>
            </div>
          </div>

          {/* Barra de Búsqueda, Filtros y Creación de Objetivos */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-48 flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por código, meta o responsable..."
                  value={objSearchQuery}
                  onChange={(e) => setObjSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              {/* Filtro Compromiso */}
              <select
                value={objCommitmentFilter}
                onChange={(e) => setObjCommitmentFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 font-semibold"
              >
                <option value="ALL">Todos los Compromisos</option>
                {policyObjectivesState.policy.commitments.map(c => (
                  <option key={c.id} value={c.id}>{c.code}: {c.title.substring(0, 30)}...</option>
                ))}
              </select>

              {/* Filtro Estado */}
              <select
                value={objStatusFilter}
                onChange={(e) => setObjStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 font-semibold"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="CUMPLIDO">Cumplido</option>
                <option value="EN_CUMPLIMIENTO">En Cumplimiento</option>
                <option value="EN_RIESGO">En Riesgo</option>
                <option value="INCUMPLIDO">Incumplido</option>
                <option value="ACTIVO">Activo</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  INITIAL_SST_OBJECTIVES.forEach(obj => {
                    if (!policyObjectivesState.objectives.some(o => o.code === obj.code)) {
                      addSstObjective(obj);
                    }
                  });
                  showNotification('Objetivos sugeridos por norma verificados y cargados');
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>Cargar Sugeridos</span>
              </button>

              <button
                onClick={handleOpenCreateObjective}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-teal-700/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Crear Nuevo Objetivo</span>
              </button>
            </div>
          </div>

          {/* Listado / Matriz de Objetivos */}
          <div className="grid grid-cols-1 gap-4">
            {filteredObjectives.map(obj => {
              const latestFollowUp = obj.followUps[0];
              const progressPct = latestFollowUp ? latestFollowUp.progressPercentage : 0;
              const hasActiveDeviation = obj.deviations.length > 0;

              return (
                <div
                  key={obj.id}
                  className={`glass-card p-5 rounded-2xl border transition-all ${
                    obj.status === 'EN_RIESGO'
                      ? 'border-amber-300 bg-amber-50/20'
                      : obj.status === 'INCUMPLIDO'
                      ? 'border-rose-300 bg-rose-50/20'
                      : 'border-slate-200 bg-white hover:border-teal-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Bloque Izquierdo: Información del Objetivo */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-300">
                          {obj.code}
                        </span>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {obj.policyCommitmentTitle}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wide border ${
                          obj.status === 'CUMPLIDO'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : obj.status === 'EN_CUMPLIMIENTO'
                            ? 'bg-teal-100 text-teal-800 border-teal-300'
                            : obj.status === 'EN_RIESGO'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : obj.status === 'INCUMPLIDO'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}>
                          {obj.status.replace(/_/g, ' ')}
                        </span>

                        <span className="text-[11px] text-slate-500 font-mono">
                          Periodo: {obj.period} • Frecuencia: {obj.frequency}
                        </span>
                      </div>

                      <h3 className="font-black text-sm text-slate-900 leading-snug">
                        {obj.name}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {obj.description}
                      </p>

                      {/* Trazabilidad: Meta, Línea Base y Criterio */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-bold block uppercase">Meta Esperada:</span>
                          <span className="font-black text-slate-900 font-mono">
                            {obj.targetCriteria === 'MANTENER_DEBAJO' ? '<= ' : obj.targetCriteria === 'SUPERAR_VALOR' ? '>= ' : ''}
                            {obj.targetValue} {obj.targetUnit}
                          </span>
                          <span className="text-[10px] text-slate-500 block">Límite: {obj.targetDeadline}</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-bold block uppercase">Línea Base:</span>
                          <span className="font-semibold text-slate-800 block truncate">
                            {obj.baseline || 'No definida'}
                          </span>
                          <span className="text-[10px] text-slate-500 block">Responsable: {obj.responsible}</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-bold block uppercase">Último Resultado Medido:</span>
                          <span className="font-black text-teal-800 font-mono">
                            {latestFollowUp ? `${latestFollowUp.actualValue} ${obj.targetUnit}` : 'Sin mediciones'}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {latestFollowUp ? latestFollowUp.periodEvaluated : 'Pendiente registro'}
                          </span>
                        </div>
                      </div>

                      {/* Indicadores Asociados */}
                      {obj.indicators.length > 0 && (
                        <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="font-bold text-slate-500">Indicadores Asociados:</span>
                          {obj.indicators.map(ind => (
                            <span key={ind.id} className="px-2 py-0.5 rounded bg-teal-50 text-teal-900 border border-teal-200 font-medium">
                              <strong>{ind.type}:</strong> {ind.name} (Meta: {ind.target})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bloque Derecho: Barra de Avance y Acciones */}
                    <div className="lg:w-72 shrink-0 flex flex-col justify-between space-y-3 pt-2 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-4">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1 font-bold">
                          <span className="text-slate-700">Nivel de Avance:</span>
                          <span className="font-mono text-teal-800">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              obj.status === 'CUMPLIDO'
                                ? 'bg-emerald-600'
                                : obj.status === 'EN_CUMPLIMIENTO'
                                ? 'bg-teal-600'
                                : obj.status === 'EN_RIESGO'
                                ? 'bg-amber-500'
                                : 'bg-rose-600'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
                          />
                        </div>
                      </div>

                      {/* Botones de Acción Operativa */}
                      <div className="flex flex-col gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            setSelectedObjectiveForFollowUp(obj);
                            setFollowUpFormData({
                              periodEvaluated: 'Q1 2026 (Ene - Mar)',
                              evaluatedAt: new Date().toISOString().split('T')[0],
                              actualValue: obj.targetValue,
                              observations: '',
                              evidenceTitle: '',
                              responsibleName: obj.responsible
                            });
                          }}
                          className="w-full py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Registrar Seguimiento</span>
                        </button>

                        {(obj.status === 'EN_RIESGO' || obj.status === 'INCUMPLIDO' || hasActiveDeviation) && (
                          <button
                            onClick={() => {
                              setSelectedObjectiveForDeviation(obj);
                              setDeviationFormData({
                                period: 'Q1 2026',
                                deviationAnalysis: `Desviación en meta de ${obj.name}.`,
                                rootCause: '',
                                requiredAction: '',
                                responsible: obj.responsible,
                                deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                                sendToAcpm: true
                              });
                            }}
                            className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Gestionar Desviación & ACPM</span>
                          </button>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedObjectiveForHistory(obj)}
                            className="flex-1 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                          >
                            <History className="w-3 h-3 text-slate-500" />
                            <span>Historial ({obj.followUps.length})</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditObjective(obj)}
                            className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-all"
                            title="Editar Objetivo"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`¿Está seguro de eliminar el objetivo ${obj.code}?`)) {
                                deleteSstObjective(obj.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-rose-50 text-rose-600 transition-all"
                            title="Eliminar Objetivo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 3: TRAZABILIDAD 360° (POLÍTICA ➔ COMPROMISO ➔ OBJETIVO ➔ META ➔ INDICADOR ➔ ACPM) */}
      {/* ============================================================== */}
      {activeTab === 'TRACEABILITY' && (
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50/50 to-white">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-700" />
              <span>Matriz de Trazabilidad Integral del SG-SST</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Visualización jerárquica de la cadena de valor: <strong>POLÍTICA → COMPROMISO → OBJETIVO → META → INDICADOR → RESULTADO → ACCIÓN DE MEJORA</strong> conforme al Decreto 1072 de 2015.
            </p>
          </div>

          <div className="space-y-5">
            {policyObjectivesState.policy.commitments.filter(c => c.isActive).map(comp => {
              const relatedObjs = policyObjectivesState.objectives.filter(o => o.policyCommitmentId === comp.id);

              return (
                <div key={comp.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  {/* Encabezado del Compromiso */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-teal-700 text-white">
                        {comp.code}
                      </span>
                      <div>
                        <h3 className="font-black text-xs text-slate-900">{comp.title}</h3>
                        <span className="text-[11px] text-slate-500 italic">{comp.legalArticle}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                      {relatedObjs.length} {relatedObjs.length === 1 ? 'Objetivo vinculado' : 'Objetivos vinculados'}
                    </span>
                  </div>

                  {/* Cuerpo: Objetivos que desarrollan el compromiso */}
                  <div className="p-4 divide-y divide-slate-100">
                    {relatedObjs.length === 0 ? (
                      <div className="py-4 text-center text-xs text-slate-400 italic">
                        No hay objetivos asociados a este compromiso. Cree uno nuevo para garantizar la cobertura del 100%.
                      </div>
                    ) : (
                      relatedObjs.map(obj => {
                        const latest = obj.followUps[0];
                        return (
                          <div key={obj.id} className="py-3 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-teal-800">{obj.code}</span>
                                <span className="font-bold text-slate-900">{obj.name}</span>
                              </div>
                              <p className="text-[11px] text-slate-600">{obj.description}</p>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                                <span>Meta: <strong>{obj.targetValue} {obj.targetUnit}</strong></span>
                                <span>•</span>
                                <span>Línea Base: <strong>{obj.baseline || 'N/A'}</strong></span>
                                <span>•</span>
                                <span>Responsable: <strong>{obj.responsible}</strong></span>
                              </div>
                            </div>

                            {/* Cadena de Indicador y ACPM */}
                            <div className="flex items-center gap-4 shrink-0">
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 font-bold block uppercase">Avance:</span>
                                <span className="font-black font-mono text-teal-800 text-sm">
                                  {latest ? `${latest.progressPercentage}%` : '0%'}
                                </span>
                              </div>

                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                obj.status === 'CUMPLIDO'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : obj.status === 'EN_CUMPLIMIENTO'
                                  ? 'bg-teal-100 text-teal-800'
                                  : obj.status === 'EN_RIESGO'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {obj.status.replace(/_/g, ' ')}
                              </span>

                              {obj.deviations.length > 0 && (
                                <button
                                  onClick={() => setActiveTab('acpm')}
                                  className="px-2 py-1 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Ver ACPM</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: CREAR O EDITAR OBJETIVO DEL SG-SST */}
      {/* ============================================================== */}
      {isNewObjectiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 space-y-4 shadow-2xl border border-slate-300 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-700" />
                <h3 className="font-black text-base text-slate-900">
                  {editingObjective ? `Editar Objetivo ${editingObjective.code}` : 'Crear Nuevo Objetivo del SG-SST'}
                </h3>
              </div>
              <button
                onClick={() => setIsNewObjectiveModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveObjective} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código del Objetivo *</label>
                  <input
                    type="text"
                    required
                    value={objectiveFormData.code}
                    onChange={(e) => setObjectiveFormData({ ...objectiveFormData, code: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Nombre del Objetivo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Reducción de la Tasa de Accidentalidad"
                    value={objectiveFormData.name}
                    onChange={(e) => setObjectiveFormData({ ...objectiveFormData, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción / Qué se quiere alcanzar *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detalle el alcance y propósito preventivo del objetivo..."
                  value={objectiveFormData.description}
                  onChange={(e) => setObjectiveFormData({ ...objectiveFormData, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 leading-relaxed text-slate-800"
                />
              </div>

              {/* Vinculación con Compromiso de la Política */}
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1">
                <label className="font-black text-teal-950 block">
                  Articulación con la Política del SG-SST (Compromiso Asociado) *
                </label>
                <select
                  value={objectiveFormData.policyCommitmentId}
                  onChange={(e) => setObjectiveFormData({ ...objectiveFormData, policyCommitmentId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-teal-300 bg-white font-bold text-teal-900 text-xs"
                >
                  {policyObjectivesState.policy.commitments.filter(c => c.isActive).map(c => (
                    <option key={c.id} value={c.id}>{c.code}: {c.title}</option>
                  ))}
                </select>
                <span className="text-[10px] text-teal-800 block">
                  Garantiza la trazabilidad: Política → Compromiso → Objetivo → Meta → Indicador.
                </span>
              </div>

              {/* Responsable, Periodo y Línea Base */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Responsable *</label>
                  <input
                    type="text"
                    required
                    value={objectiveFormData.responsible}
                    onChange={(e) => setObjectiveFormData({ ...objectiveFormData, responsible: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Periodo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Anual 2026"
                    value={objectiveFormData.period}
                    onChange={(e) => setObjectiveFormData({ ...objectiveFormData, period: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Línea Base (Cuando aplique)</label>
                  <input
                    type="text"
                    placeholder="Ej: Tasa 3.8 en 2025"
                    value={objectiveFormData.baseline}
                    onChange={(e) => setObjectiveFormData({ ...objectiveFormData, baseline: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              {/* Metas y Criterio de Cumplimiento */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="font-black text-slate-900 block">
                  Definición de Metas y Criterio de Cumplimiento
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Valor Meta *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={objectiveFormData.targetValue}
                      onChange={(e) => setObjectiveFormData({ ...objectiveFormData, targetValue: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Unidad *</label>
                    <input
                      type="text"
                      required
                      placeholder="%, Tasa, Casos, Puntos"
                      value={objectiveFormData.targetUnit}
                      onChange={(e) => setObjectiveFormData({ ...objectiveFormData, targetUnit: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Criterio de Éxito *</label>
                    <select
                      value={objectiveFormData.targetCriteria}
                      onChange={(e) => setObjectiveFormData({ ...objectiveFormData, targetCriteria: e.target.value as any })}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900"
                    >
                      <option value="SUPERAR_VALOR">Alcanzar o Superar (&gt;=)</option>
                      <option value="MANTENER_DEBAJO">Mantener por debajo (&lt;=)</option>
                      <option value="RANGO">Encontrarse en Rango</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Frecuencia *</label>
                    <select
                      value={objectiveFormData.frequency}
                      onChange={(e) => setObjectiveFormData({ ...objectiveFormData, frequency: e.target.value as any })}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900"
                    >
                      <option value="MENSUAL">Mensual</option>
                      <option value="TRIMESTRAL">Trimestral</option>
                      <option value="SEMESTRAL">Semestral</option>
                      <option value="ANUAL">Anual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Fecha Límite *</label>
                  <input
                    type="date"
                    required
                    value={objectiveFormData.targetDeadline}
                    onChange={(e) => setObjectiveFormData({ ...objectiveFormData, targetDeadline: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              {/* Indicador de Relación Sugerido */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="font-black text-slate-900 block">
                  Estructura de Relación con Indicadores (Dec. 1072)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Nombre del indicador (ej: Índice de Frecuencia de Accidentes)"
                      value={objectiveFormData.indicatorName}
                      onChange={(e) => setObjectiveFormData({ ...objectiveFormData, indicatorName: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <select
                      value={objectiveFormData.indicatorType}
                      onChange={(e) => setObjectiveFormData({ ...objectiveFormData, indicatorType: e.target.value as any })}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold"
                    >
                      <option value="RESULTADO">Resultado</option>
                      <option value="PROCESO">Proceso</option>
                      <option value="ESTRUCTURA">Estructura</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewObjectiveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold flex items-center gap-1.5 shadow-md shadow-teal-700/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingObjective ? 'Guardar Cambios' : 'Crear Objetivo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: REGISTRO DE SEGUIMIENTO PERIÓDICO */}
      {/* ============================================================== */}
      {selectedObjectiveForFollowUp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-700" />
                <h3 className="font-black text-base text-slate-900">
                  Registrar Seguimiento - {selectedObjectiveForFollowUp.code}
                </h3>
              </div>
              <button
                onClick={() => setSelectedObjectiveForFollowUp(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFollowUp} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{selectedObjectiveForFollowUp.name}</div>
                <div className="text-slate-600">
                  Meta: <strong>{selectedObjectiveForFollowUp.targetValue} {selectedObjectiveForFollowUp.targetUnit}</strong> • Criterio: {selectedObjectiveForFollowUp.targetCriteria}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Periodo Evaluado *</label>
                  <input
                    type="text"
                    required
                    value={followUpFormData.periodEvaluated}
                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, periodEvaluated: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha de Medición *</label>
                  <input
                    type="date"
                    required
                    value={followUpFormData.evaluatedAt}
                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, evaluatedAt: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Resultado / Valor Obtenido en el Periodo ({selectedObjectiveForFollowUp.targetUnit}) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={followUpFormData.actualValue}
                  onChange={(e) => setFollowUpFormData({ ...followUpFormData, actualValue: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-sm font-bold text-teal-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observaciones / Conclusiones del Avance *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalle los factores que influyeron en el resultado y medidas complementarias..."
                  value={followUpFormData.observations}
                  onChange={(e) => setFollowUpFormData({ ...followUpFormData, observations: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 leading-relaxed text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Título de Evidencia Soporte</label>
                  <input
                    type="text"
                    placeholder="Ej: Reporte Siniestralidad ARL Q1"
                    value={followUpFormData.evidenceTitle}
                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, evidenceTitle: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Responsable del Registro</label>
                  <input
                    type="text"
                    required
                    value={followUpFormData.responsibleName}
                    onChange={(e) => setFollowUpFormData({ ...followUpFormData, responsibleName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedObjectiveForFollowUp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold flex items-center gap-1.5 shadow-md shadow-teal-700/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Seguimiento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: GESTIÓN DE DESVIACIONES Y TRANSFERENCIA DIRECTA A ACPM */}
      {/* ============================================================== */}
      {selectedObjectiveForDeviation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-base text-slate-900">
                  Desviación de Objetivo - {selectedObjectiveForDeviation.code}
                </h3>
              </div>
              <button
                onClick={() => setSelectedObjectiveForDeviation(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDeviation} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 space-y-1">
                <strong>Análisis de Causa y Acción Requerida (Art. 2.2.4.6.17):</strong>
                <p>
                  Cuando un objetivo presente desviaciones respecto a la meta, se debe documentar el análisis, causa raíz y acción requerida, pudiendo transferirse directamente a la Matriz ACPM del SG-SST sin volver a digitar.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Análisis de la Desviación Detectada *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describa cuantitativa y cualitativamente el desvío frente a la meta..."
                  value={deviationFormData.deviationAnalysis}
                  onChange={(e) => setDeviationFormData({ ...deviationFormData, deviationAnalysis: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Causa Raíz Identificada *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej: Falla en suministro de repuestos, falta de escalamiento formal a gerencia..."
                  value={deviationFormData.rootCause}
                  onChange={(e) => setDeviationFormData({ ...deviationFormData, rootCause: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Acción Correctiva o Preventiva Requerida *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detalle la medida de intervención que subsanará el desvío..."
                  value={deviationFormData.requiredAction}
                  onChange={(e) => setDeviationFormData({ ...deviationFormData, requiredAction: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Responsable de Ejecución *</label>
                  <input
                    type="text"
                    required
                    value={deviationFormData.responsible}
                    onChange={(e) => setDeviationFormData({ ...deviationFormData, responsible: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha Límite de Cierre *</label>
                  <input
                    type="date"
                    required
                    value={deviationFormData.deadline}
                    onChange={(e) => setDeviationFormData({ ...deviationFormData, deadline: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Enviar Directamente a Matriz ACPM</span>
                  <span className="text-[11px] text-slate-500">Crea la no conformidad y plan de acción sin reescribir.</span>
                </div>
                <input
                  type="checkbox"
                  checked={deviationFormData.sendToAcpm}
                  onChange={(e) => setDeviationFormData({ ...deviationFormData, sendToAcpm: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedObjectiveForDeviation(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Registrar Desviación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: HISTORIAL 360° INMUTABLE DEL OBJETIVO */}
      {/* ============================================================== */}
      {selectedObjectiveForHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 space-y-4 shadow-2xl border border-slate-300 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-teal-700" />
                <h3 className="font-black text-base text-slate-900">
                  Historial 360° - {selectedObjectiveForHistory.code}: {selectedObjectiveForHistory.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedObjectiveForHistory(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Meta:</span>
                  <strong className="text-slate-900 font-mono">
                    {selectedObjectiveForHistory.targetValue} {selectedObjectiveForHistory.targetUnit} ({selectedObjectiveForHistory.targetCriteria})
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Línea Base:</span>
                  <span className="text-slate-800">{selectedObjectiveForHistory.baseline || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Estado Actual:</span>
                  <span className="font-bold text-teal-800">{selectedObjectiveForHistory.status}</span>
                </div>
              </div>

              {/* Lista de Seguimientos Históricos */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-700" />
                  <span>Seguimientos Periódicos Registrados ({selectedObjectiveForHistory.followUps.length}):</span>
                </h4>

                {selectedObjectiveForHistory.followUps.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 italic bg-slate-50 rounded-xl">
                    No se han registrado seguimientos para este objetivo aún.
                  </div>
                ) : (
                  selectedObjectiveForHistory.followUps.map((fu, idx) => (
                    <div key={fu.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 font-mono">{fu.periodEvaluated}</span>
                        <span className="text-[10px] font-mono text-slate-500">Fecha: {fu.evaluatedAt}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-teal-800 font-mono">
                          Resultado: {fu.actualValue} {selectedObjectiveForHistory.targetUnit} ({fu.progressPercentage}% avance)
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {fu.calculatedStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{fu.observations}</p>
                      <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                        <span>Responsable: {fu.responsibleName}</span>
                        {fu.evidenceTitle && <span>Evidencia: {fu.evidenceTitle}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desviaciones y Acciones ACPM */}
              {selectedObjectiveForHistory.deviations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <h4 className="font-black text-slate-900 uppercase text-[11px] flex items-center gap-1.5 text-amber-900">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Desviaciones y Acciones Correctivas ({selectedObjectiveForHistory.deviations.length}):</span>
                  </h4>
                  {selectedObjectiveForHistory.deviations.map(dev => (
                    <div key={dev.id} className="p-3 rounded-xl border border-amber-300 bg-amber-50/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950">Periodo: {dev.period} ({dev.registeredAt})</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          {dev.sentToAcpm ? 'Transferido a Matriz ACPM ✓' : 'Interno'}
                        </span>
                      </div>
                      <div className="text-slate-800 font-semibold">{dev.deviationAnalysis}</div>
                      <div className="text-[11px] text-slate-600"><strong>Causa Raíz:</strong> {dev.rootCause}</div>
                      <div className="text-[11px] text-slate-600"><strong>Acción:</strong> {dev.requiredAction}</div>
                      <div className="text-[10px] text-slate-500 pt-1">Responsable: {dev.responsible} • Plazo: {dev.deadline}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedObjectiveForHistory(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: REGISTRO DE REVISIÓN ANUAL OBLIGATORIA */}
      {/* ============================================================== */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-teal-700" />
                <h3 className="font-black text-sm text-slate-900">
                  Registrar Revisión Anual de la Política
                </h3>
              </div>
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRevision} className="space-y-4 text-xs">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 leading-relaxed">
                <strong>Decreto 1072 de 2015 Artículo 2.2.4.6.7:</strong>
                <p className="mt-0.5">
                  La política de SST debe ser revisada como mínimo una (1) vez al año y, de ser necesario, actualizada conforme a los cambios en el SG-SST o la normatividad.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Concepto de la Revisión *</label>
                <select
                  value={revisionConcept}
                  onChange={(e) => setRevisionConcept(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-900"
                >
                  <option value="RATIFICADA_SIN_CAMBIOS">Ratificada sin Cambios (Sigue Vigente)</option>
                  <option value="ACTUALIZADA_CON_CAMBIOS">Actualizada con Ajustes Normativos/Operativos</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Justificación o Resumen de la Revisión *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ej: Se realizó la revisión anual con participación del COPASST y se ratificaron los compromisos..."
                  value={revisionSummaryInput}
                  onChange={(e) => setRevisionSummaryInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold flex items-center gap-1.5 shadow-md shadow-teal-700/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Registro Oficial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
