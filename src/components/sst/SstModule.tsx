'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  HardHat,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  Users,
  HeartPulse,
  Plus,
  CheckCircle2,
  FileText,
  Search,
  BookOpen,
  DollarSign,
  UserCheck,
  Car,
  SlidersHorizontal,
  ChevronRight,
  Printer,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  FileCheck,
  Award,
  HeartHandshake,
  GraduationCap,
  Target,
  ClipboardCheck
} from 'lucide-react';
import { SstStandardDefinition, SstStandardCycle, SstStandardStatus } from '@/types/sst';
import { SstHazardItem } from '@/types';
import { isStandardApplicable, calculateScore } from '@/lib/sst-standards-data';
import { SstResponsibleModal } from './SstResponsibleModal';
import { SstBudgetModal } from './SstBudgetModal';
import { SstStandardDetailModal } from './SstStandardDetailModal';
import { PilaSocialSecurityModal } from './PilaSocialSecurityModal';
import { CopasstVigiaModule } from './copasst/CopasstVigiaModule';
import { CclModule } from './ccl/CclModule';
import { TrainingModule } from './training/TrainingModule';
import { SstPolicyObjectivesModule } from './policy/SstPolicyObjectivesModule';
import { SstInitialEvaluationModule } from './evaluation/SstInitialEvaluationModule';

export const SstModule: React.FC = () => {
  const {
    organization,
    sstStandards,
    updateStandardStatus,
    sstResponsible,
    sstBudgetItems,
    sstBudgetState,
    currentSimulatedRole,
    setCurrentSimulatedRole,
    sstHazards,
    addSstHazard,
    addFinding,
    assets,
    showNotification,
    setActiveTab
  } = useApp();

  // Navigation subtabs
  const [activeSubTab, setActiveSubTab] = useState<
    'STANDARDS' | 'RESPONSIBLE' | 'BUDGET' | 'MATRIX' | 'INSPECTIONS' | 'COMMITTEES' | 'CCL' | 'TRAINING' | 'POLICY' | 'EVALUATION'
  >('STANDARDS');
  const [copasstInitialTab, setCopasstInitialTab] = useState<
    'DASHBOARD' | 'CONFORMATION' | 'MEETINGS' | 'FINDINGS' | 'TRAININGS' | 'DOCUMENTS' | 'ELECTION' | 'VIGIA'
  >('DASHBOARD');
  const [cclInitialTab, setCclInitialTab] = useState<
    'DASHBOARD' | 'CASES' | 'ELECTIONS' | 'CONFORMATION' | 'MEETINGS' | 'REGULATION' | 'REPORTS'
  >('DASHBOARD');
  const [policyInitialTab, setPolicyInitialTab] = useState<'POLICY' | 'OBJECTIVES' | 'TRACEABILITY'>('POLICY');
  const [evaluationInitialTab, setEvaluationInitialTab] = useState<'CHECKLIST' | 'DASHBOARD' | 'ACTIONS' | 'VALIDATION' | 'REPORT'>('CHECKLIST');

  // Filter state for the 60 Standards
  const [showOnlyApplicable, setShowOnlyApplicable] = useState(true);
  const [cycleFilter, setCycleFilter] = useState<'ALL' | SstStandardCycle>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SstStandardStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedStandardForModal, setSelectedStandardForModal] = useState<SstStandardDefinition | null>(null);
  const [isPilaModalOpen, setIsPilaModalOpen] = useState(false);
  const [pilaModalType, setPilaModalType] = useState<'GENERAL' | 'ALTO_RIESGO'>('GENERAL');

  // Inspection form state
  const [inspectAssetId, setInspectAssetId] = useState(assets[0]?.id || '');
  const [inspectCondition, setInspectCondition] = useState('');
  const [inspectSeverity, setInspectSeverity] = useState<'CRITICA' | 'MAYOR' | 'MENOR'>('MAYOR');
  const [inspectLegal, setInspectLegal] = useState('Resolución 2400/79 & Dec 1072/15 Art. 2.2.4.6.24');

  // Hazard Modal form state
  const [showHazardModal, setShowHazardModal] = useState(false);
  const [hProcess, setHProcess] = useState('Operaciones Logísticas y Transporte');
  const [hActivity, setHActivity] = useState('');
  const [hClass, setHClass] = useState<SstHazardItem['hazardClass']>('CONDICIONES_SEGURIDAD');
  const [hDesc, setHDesc] = useState('');
  const [hEffects, setHEffects] = useState('');
  const [hDef, setHDef] = useState(6);
  const [hExp, setHExp] = useState(3);
  const [hSev, setHSev] = useState(25);
  const [hEng, setHEng] = useState('');
  const [hAdm, setHAdm] = useState('');
  const [hEpp, setHEpp] = useState('');

  // Dynamic Score Calculation
  const scoreResult = useMemo(() => {
    return calculateScore(sstStandards, organization.sstStandardCount);
  }, [sstStandards, organization.sstStandardCount]);

  // Filtered standards list
  const filteredStandards = useMemo(() => {
    return sstStandards.filter(std => {
      // Applicability filter
      if (showOnlyApplicable && !isStandardApplicable(std, organization.sstStandardCount)) {
        return false;
      }
      // Cycle filter
      if (cycleFilter !== 'ALL' && std.cycle !== cycleFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'ALL' && std.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = std.code.toLowerCase().includes(q);
        const matchesTitle = std.title.toLowerCase().includes(q);
        const matchesArticle = std.decreto1072Article.toLowerCase().includes(q);
        const matchesGroup = std.numeralGroup.toLowerCase().includes(q);
        if (!matchesCode && !matchesTitle && !matchesArticle && !matchesGroup) {
          return false;
        }
      }
      return true;
    });
  }, [sstStandards, showOnlyApplicable, cycleFilter, statusFilter, searchQuery, organization.sstStandardCount]);

  // Cycle breakdown stats
  const cycleStats = useMemo(() => {
    const cycles: SstStandardCycle[] = ['PLANEAR', 'HACER', 'VERIFICAR', 'ACTUAR'];
    return cycles.map(c => {
      const standardsInCycle = sstStandards.filter(
        s => s.cycle === c && (!showOnlyApplicable || isStandardApplicable(s, organization.sstStandardCount))
      );
      const total = standardsInCycle.length;
      const complies = standardsInCycle.filter(s => s.status === 'CUMPLE' || s.status === 'NO_APLICA_JUSTIFICADO').length;
      const inProgress = standardsInCycle.filter(s => s.status === 'EN_PROCESO').length;
      const percentage = total > 0 ? ((complies + inProgress * 0.5) / total) * 100 : 0;
      return {
        cycle: c,
        total,
        complies,
        percentage: Number(percentage.toFixed(0))
      };
    });
  }, [sstStandards, showOnlyApplicable, organization.sstStandardCount]);

  // Handlers
  const handleCreateInspectionFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectCondition) return;

    const targetAsset = assets.find(a => a.id === inspectAssetId);

    addFinding(
      {
        title: `Desviación en Inspección: ${targetAsset?.name || 'Área Operativa'}`,
        originModule: 'SST',
        originType: 'INSPECTION',
        originDetail: `Inspección de Seguridad Estándar 4.2.4 (Dec 1072) - Sede ${organization.sites[0]?.name}`,
        sharedAssetId: targetAsset?.id,
        sharedAssetName: targetAsset?.name,
        siteName: targetAsset?.siteName || organization.sites[0]?.name || 'Sede Principal',
        processName: targetAsset?.processName || 'Operaciones',
        description: inspectCondition,
        legalCriterion: inspectLegal,
        severity: inspectSeverity,
        status: 'EN_ACPM',
        reportedBy: 'Inspector SST en Campo'
      },
      true
    );

    setInspectCondition('');
    showNotification('¡Inspección registrada! Hallazgo transferido automáticamente a la Matriz ACPM');
  };

  const handleAddHazard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hActivity || !hDesc) return;

    const np = hDef * hExp;
    const nr = np * hSev;
    let interp: 'I' | 'II' | 'III' | 'IV' = 'IV';
    let accept: 'NO_ACEPTABLE' | 'ACEPTABLE_CON_CONTROL' | 'ACEPTABLE' = 'ACEPTABLE';

    if (nr >= 600) {
      interp = 'I';
      accept = 'NO_ACEPTABLE';
    } else if (nr >= 150) {
      interp = 'II';
      accept = 'ACEPTABLE_CON_CONTROL';
    } else if (nr >= 40) {
      interp = 'III';
      accept = 'ACEPTABLE_CON_CONTROL';
    } else {
      interp = 'IV';
      accept = 'ACEPTABLE';
    }

    addSstHazard({
      process: hProcess,
      activity: hActivity,
      isRoutine: true,
      hazardClass: hClass,
      hazardDescription: hDesc,
      possibleEffects: hEffects || 'Lesiones osteomusculares o traumatismos',
      deficiencyLevel: hDef,
      exposureLevel: hExp,
      severityLevel: hSev,
      riskLevelInterpretation: interp,
      acceptability: accept,
      controls: {
        engineering: hEng,
        administrative: hAdm,
        epp: hEpp
      }
    });

    setShowHazardModal(false);
    setHActivity('');
    setHDesc('');
    setHEffects('');
  };

  // Helper for budget totals
  const isPesvActive = organization.activeModules.includes('PESV');
  const activeBudgetItems = sstBudgetItems.filter(i => isPesvActive || i.system !== 'PESV');
  const totalPlannedBudget = activeBudgetItems.reduce((acc, curr) => acc + curr.plannedAmount, 0);
  const totalExecutedBudget = activeBudgetItems.reduce((acc, curr) => acc + curr.executedAmount, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Top Banner & Module Header */}
      <div className="glass-card p-5 rounded-2xl flex flex-col gap-4 print:hidden">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-700 border border-orange-200">
              <HardHat className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200 uppercase">
                  Colombia
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                Implementación integral de los <strong>60 Estándares Mínimos (Resolución 0312 de 2019)</strong> cotejados con el articulado del <strong>Decreto 1072 de 2015</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Banner de Conexión con la Base Maestra de Trabajadores */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-950 block">
                Base Maestra de Trabajadores Conectada
              </span>
              <p className="text-emerald-800 text-[11px]">
                Antes de ejecutar los estándares, la información de trabajadores (Responsable 1.1.1, COPASST 1.1.6, Plan Capacitación 1.1.4, EPP 2.1.1) se sincroniza directamente desde la Base Maestra central.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('workers')}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shrink-0 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Ver Base Maestra</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Navigation Subtabs */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveSubTab('STANDARDS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'STANDARDS' ? 'bg-orange-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>60 Estándares ({scoreResult.applicableCount})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('RESPONSIBLE')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'RESPONSIBLE' ? 'bg-orange-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>1.1.1 Responsable & Carta</span>
          </button>

          <button
            onClick={() => setActiveSubTab('BUDGET')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'BUDGET' ? 'bg-orange-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>1.1.3 Presupuesto {isPesvActive ? 'Integrado' : 'SST'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('MATRIX')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'MATRIX' ? 'bg-orange-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Matriz GTC 45 ({sstHazards.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('INSPECTIONS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'INSPECTIONS' ? 'bg-orange-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Inspecciones & ACPM</span>
          </button>

          <button
            onClick={() => setActiveSubTab('COMMITTEES')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'COMMITTEES' ? 'bg-orange-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>COPASST</span>
          </button>

          <button
            onClick={() => setActiveSubTab('CCL')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'CCL' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>1.1.8 Convivencia (CCL)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('TRAINING')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'TRAINING' ? 'bg-orange-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>1.2 Capacitación & Aula Virtual</span>
          </button>

          <button
            onClick={() => {
              setPolicyInitialTab('POLICY');
              setActiveSubTab('POLICY');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'POLICY' ? 'bg-teal-700 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>2.1 Política & Objetivos</span>
          </button>

          <button
            onClick={() => {
              setEvaluationInitialTab('CHECKLIST');
              setActiveSubTab('EVALUATION');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'EVALUATION' ? 'bg-teal-700 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>2.1.3 Evaluación Inicial (Dec. 1072)</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS: Legal Scoring, Applicability & Role Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {/* Card 1: Official Res. 0312 Compliance Score */}
        <div className="glass-card p-4 rounded-xl border border-slate-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Autoevaluación Res. 0312
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                scoreResult.level === 'ACEPTABLE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                scoreResult.level === 'MODERADAMENTE_ACEPTABLE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {scoreResult.level === 'ACEPTABLE' ? 'ACEPTABLE' : scoreResult.level === 'MODERADAMENTE_ACEPTABLE' ? 'MODERADO' : 'CRÍTICO'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 font-mono">{scoreResult.percentage}%</span>
              <span className="text-xs text-slate-600 font-mono">/ 100%</span>
            </div>
          </div>
          <div className="space-y-1.5 mt-2">
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  scoreResult.level === 'ACEPTABLE' ? 'bg-emerald-500' :
                  scoreResult.level === 'MODERADAMENTE_ACEPTABLE' ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(scoreResult.percentage, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-600 leading-tight">
              {scoreResult.legalConsequence}
            </p>
          </div>
        </div>

        {/* Card 2: Company Applicability Standard Count */}
        <div className="glass-card p-4 rounded-xl border border-slate-300 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
              Clasificación Empresarial
            </span>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {organization.sstStandardCount} Estándares Aplicables
            </div>
            <p className="text-xs text-slate-700 mt-0.5">
              Definido por: <strong>{organization.employeeCount} trabajadores</strong> y <strong>Riesgo ARL {organization.riskLevelArl}</strong> (Art. 16 Res. 0312).
            </p>
          </div>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <span>Catálogo Completo: 60</span>
            <button
              onClick={() => setShowOnlyApplicable(!showOnlyApplicable)}
              className="text-teal-700 hover:underline font-semibold"
            >
              {showOnlyApplicable ? 'Ver todos los 60' : 'Ver solo mis estándares'}
            </button>
          </div>
        </div>

        {/* Card 3: Standard 1.1.1 Responsible Status */}
        <div className="glass-card p-4 rounded-xl border border-slate-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                Responsable SG-SST (1.1.1)
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Designado
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1 truncate">
              {sstResponsible.fullName}
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 truncate">
              Licencia: {sstResponsible.licenseNumber}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-medium">Carta Oficial Firmada</span>
            <button
              onClick={() => setIsResponsibleModalOpen(true)}
              className="text-orange-700 hover:text-orange-700 font-semibold"
            >
              Ver Carta →
            </button>
          </div>
        </div>

        {/* Card 4: Standard 1.1.3 Integrated Budget Status */}
        <div className="glass-card p-4 rounded-xl border border-slate-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Presupuesto {isPesvActive ? 'Integrado' : 'SST'} (1.1.3)
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {sstBudgetState.status}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
              ${(totalPlannedBudget / 1000000).toFixed(1)}M COP
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Ejecutado: ${(totalExecutedBudget / 1000000).toFixed(1)}M ({((totalExecutedBudget / (totalPlannedBudget || 1)) * 100).toFixed(0)}%)
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 truncate">
              {isPesvActive ? 'SST + PESV Vial' : 'Solo SG-SST'}
            </span>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-700 font-semibold shrink-0"
            >
              Gestionar →
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUBTAB 1: 60 ESTÁNDARES MÍNIMOS (RES 0312 + DECRETO 1072) */}
      {/* ============================================================== */}
      {activeSubTab === 'STANDARDS' && (
        <div className="space-y-4">
          
          {/* PHVA Cycle Progress Bar Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cycleStats.map(stat => (
              <button
                key={stat.cycle}
                onClick={() => setCycleFilter(cycleFilter === stat.cycle ? 'ALL' : stat.cycle)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  cycleFilter === stat.cycle
                    ? 'bg-slate-100 border-teal-500 shadow-md ring-1 ring-teal-200'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    stat.cycle === 'PLANEAR' ? 'text-teal-700' :
                    stat.cycle === 'HACER' ? 'text-orange-700' :
                    stat.cycle === 'VERIFICAR' ? 'text-purple-700' : 'text-rose-700'
                  }`}>
                    {stat.cycle}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">{stat.percentage}%</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  {stat.complies} de {stat.total} conformes
                </div>
                <div className="w-full bg-white rounded-full h-1 mt-1.5">
                  <div
                    className={`h-1 rounded-full ${
                      stat.cycle === 'PLANEAR' ? 'bg-teal-500' :
                      stat.cycle === 'HACER' ? 'bg-orange-500' :
                      stat.cycle === 'VERIFICAR' ? 'bg-purple-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="glass-card p-4 rounded-xl border border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Buscar por código (ej: 1.1.1), artículo (Dec 1072) o palabra clave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="CUMPLE">Cumple</option>
                <option value="EN_PROCESO">En Proceso</option>
                <option value="NO_CUMPLE">No Cumple</option>
                <option value="NO_APLICA_JUSTIFICADO">No Aplica Justificado</option>
              </select>

              <button
                type="button"
                onClick={() => setShowOnlyApplicable(!showOnlyApplicable)}
                className={`px-3 py-2 rounded-lg font-semibold transition-all border ${
                  showOnlyApplicable
                    ? 'bg-orange-100 text-orange-700 border-orange-200'
                    : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
                }`}
              >
                {showOnlyApplicable ? `Solo Aplicables (${scoreResult.applicableCount})` : 'Catálogo 60 Estándares'}
              </button>
            </div>
          </div>

          {/* Standards Cards Grid (5 per row on wide screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredStandards.map(std => {
              const isApplicableForCompany = isStandardApplicable(std, organization.sstStandardCount);
              const cycleStyle =
                std.cycle === 'PLANEAR' ? { bar: 'bg-teal-500', chip: 'bg-teal-50 text-teal-700 border-teal-200' } :
                std.cycle === 'HACER' ? { bar: 'bg-orange-500', chip: 'bg-orange-50 text-orange-700 border-orange-200' } :
                std.cycle === 'VERIFICAR' ? { bar: 'bg-purple-500', chip: 'bg-purple-50 text-purple-700 border-purple-200' } :
                { bar: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700 border-rose-200' };

              const actionBtn = 'w-full px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1';
              const isPilaStandard = std.code === '1.1.4' || std.code === '1.1.5';
              const isCclStandard = std.code === '1.1.8' || std.actionType === 'CCL';
              const isCopasstStandard = (std.code === '1.1.6' || std.code === '1.1.7' || std.actionType === 'COPASST') && !isCclStandard;
              const isCourse50Standard = std.code === '1.2.3';
              const isTrainingStandard = (std.code.startsWith('1.2.') || std.actionType === 'TRAINING') && std.actionType !== 'RESPONSIBLE' && !isCourse50Standard;
              const isPolicyStandard = std.code === '2.1.1';
              const isObjectivesStandard = std.code === '2.1.2';
              const isEvaluationStandard = std.code === '2.1.3' || std.actionType === 'INITIAL_EVALUATION';

              const action =
                isPilaStandard ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPilaModalType(std.code === '1.1.5' ? 'ALTO_RIESGO' : 'GENERAL');
                      setIsPilaModalOpen(true);
                    }}
                    className={`${actionBtn} bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm`}
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Planilla PILA & Pagos
                  </button>
                ) : isCclStandard ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCclInitialTab('DASHBOARD');
                      setActiveSubTab('CCL');
                    }}
                    className={`${actionBtn} bg-teal-700 hover:bg-teal-600 text-white shadow-sm`}
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>1.1.8 Convivencia (CCL)</span>
                  </button>
                ) : isCopasstStandard ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (std.code === '1.1.7') {
                        setCopasstInitialTab('TRAININGS');
                      } else {
                        setCopasstInitialTab('CONFORMATION');
                      }
                      setActiveSubTab('COMMITTEES');
                    }}
                    className={`${actionBtn} ${
                      std.code === '1.1.7'
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                        : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
                    }`}
                  >
                    {std.code === '1.1.7' ? (
                      <>
                        <Award className="w-3.5 h-3.5" />
                        <span>1.1.7 Capacitación COPASST</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5" />
                        <span>1.1.6 Conformación COPASST</span>
                      </>
                    )}
                  </button>
                ) : isCourse50Standard ? (
                  <button
                    type="button"
                    onClick={() => setIsResponsibleModalOpen(true)}
                    className={`${actionBtn} bg-purple-700 hover:bg-purple-600 text-white shadow-sm`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>1.2.3 Articulado con 1.1.1 (Cargar 50h)</span>
                  </button>
                ) : isTrainingStandard ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('TRAINING');
                    }}
                    className={`${actionBtn} bg-orange-700 hover:bg-orange-600 text-white shadow-sm`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>1.2 Capacitación SG-SST</span>
                  </button>
                ) : isPolicyStandard ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPolicyInitialTab('POLICY');
                      setActiveSubTab('POLICY');
                    }}
                    className={`${actionBtn} bg-teal-700 hover:bg-teal-600 text-white shadow-sm`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>2.1.1 Política SST</span>
                  </button>
                ) : isObjectivesStandard ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPolicyInitialTab('OBJECTIVES');
                      setActiveSubTab('POLICY');
                    }}
                    className={`${actionBtn} bg-teal-700 hover:bg-teal-600 text-white shadow-sm`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>2.1.2 Objetivos SG-SST</span>
                  </button>
                ) : isEvaluationStandard ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEvaluationInitialTab('CHECKLIST');
                      setActiveSubTab('EVALUATION');
                    }}
                    className={`${actionBtn} bg-teal-800 hover:bg-teal-700 text-white shadow-sm`}
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>2.1.3 Evaluación Inicial (Dec. 1072)</span>
                  </button>
                ) : std.actionType === 'RESPONSIBLE' ? (
                  <button type="button" onClick={() => setIsResponsibleModalOpen(true)} className={`${actionBtn} bg-orange-600 hover:bg-orange-500 text-white shadow-sm`}>
                    <UserCheck className="w-3.5 h-3.5" /> Carta & HV
                  </button>
                ) : std.actionType === 'BUDGET' ? (
                  <button type="button" onClick={() => setIsBudgetModalOpen(true)} className={`${actionBtn} bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm`}>
                    <DollarSign className="w-3.5 h-3.5" /> Presupuesto
                  </button>
                ) : std.actionType === 'HAZARDS' ? (
                  <button type="button" onClick={() => setActiveSubTab('MATRIX')} className={`${actionBtn} bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200`}>
                    Matriz GTC 45
                  </button>
                ) : std.actionType === 'INSPECTION' ? (
                  <button type="button" onClick={() => setActiveSubTab('INSPECTIONS')} className={`${actionBtn} bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200`}>
                    Inspección
                  </button>
                ) : std.actionType === 'ACPM' ? (
                  <button type="button" onClick={() => setActiveTab('acpm')} className={`${actionBtn} bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200`}>
                    ACPM
                  </button>
                ) : (
                  <button type="button" onClick={() => setSelectedStandardForModal(std)} className={`${actionBtn} bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200`}>
                    Detalles & Dec 1072
                  </button>
                );

              return (
                <div
                  key={std.id}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border shadow-[0_8px_28px_-18px_rgba(15,90,60,0.35)] hover:shadow-[0_16px_36px_-18px_rgba(15,90,60,0.45)] hover:-translate-y-0.5 transition-all ${
                    isApplicableForCompany ? 'border-emerald-100' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <span className={`h-1 w-full ${cycleStyle.bar}`} />

                  <div className="flex-1 flex flex-col p-3.5 gap-2">
                    {/* Code, weight and applicability */}
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => setSelectedStandardForModal(std)}
                        className={`px-2 py-1 rounded-lg border font-mono font-bold text-xs leading-tight text-left transition-transform hover:scale-105 ${cycleStyle.chip}`}
                        title="Ver detalle legal y Decreto 1072"
                      >
                        {std.code}
                        <span className="block text-[9px] font-sans font-normal opacity-80">Peso {std.weight}%</span>
                      </button>
                      <div className="flex items-center gap-1">
                        {std.applicableIn7 && (
                          <span className="px-1.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200" title="Aplica a empresas de hasta 10 trabajadores">7</span>
                        )}
                        {std.applicableIn21 && (
                          <span className="px-1.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200" title="Aplica a empresas de 11 a 50 trabajadores">21</span>
                        )}
                        <span className="px-1.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200" title="Aplica a empresas de más de 50 trabajadores o riesgo IV y V">60</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 line-clamp-1" title={std.numeralGroup}>
                      {std.cycle} • {std.numeralGroup}
                    </span>

                    <h3
                      onClick={() => setSelectedStandardForModal(std)}
                      className="text-xs font-bold text-slate-900 leading-snug hover:text-orange-700 transition-colors cursor-pointer line-clamp-3"
                      title={std.title}
                    >
                      {std.title}
                    </h3>

                    <p className="text-[10px] text-teal-700 font-mono font-semibold flex items-start gap-1">
                      <BookOpen className="w-3 h-3 shrink-0 mt-px" />
                      <span className="line-clamp-2">{std.decreto1072Article}</span>
                    </p>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2" title={std.criterion}>{std.criterion}</p>

                    {!isApplicableForCompany && (
                      <span className="self-start px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-600">
                        No exigido a su tamaño de empresa
                      </span>
                    )}
                  </div>

                  {/* Status and action */}
                  <div className="p-3 pt-0 mt-auto space-y-1.5">
                    <select
                      value={std.status}
                      onChange={(e) => updateStandardStatus(std.id, e.target.value as SstStandardStatus)}
                      className={`w-full text-[11px] font-bold rounded-lg px-2 py-1.5 border focus:outline-none cursor-pointer ${
                        std.status === 'CUMPLE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        std.status === 'EN_PROCESO' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        std.status === 'NO_APLICA_JUSTIFICADO' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <option value="CUMPLE">✓ CUMPLE</option>
                      <option value="EN_PROCESO">⏳ EN PROCESO</option>
                      <option value="NO_CUMPLE">✕ NO CUMPLE</option>
                      <option value="NO_APLICA_JUSTIFICADO">⊘ NO APLICA</option>
                    </select>
                    {action}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 2: ESTÁNDAR 1.1.1 RESPONSABLE SG-SST & CARTA OFICIAL */}
      {/* ============================================================== */}
      {activeSubTab === 'RESPONSIBLE' && (
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-100 text-orange-700 border border-orange-200">
                  <UserCheck className="w-5 h-5" />
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Estándar 1.1.1: Responsable Asignado del SG-SST
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Decreto 1072 de 2015 Art. 2.2.4.6.8 Parágrafo 1 y Art. 2.2.4.6.35 • Resolución 0312 de 2019.
              </p>
            </div>

            <button
              onClick={() => setIsResponsibleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20"
            >
              <FileText className="w-4 h-4" />
              <span>Abrir Editor Completo y Carta Formal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Responsible Profile Details */}
            <div className="md:col-span-2 glass-card p-5 rounded-xl border border-slate-300 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Identificación y Acreditación del Profesional
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-600 block">Nombre del Responsable</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">{sstResponsible.fullName}</span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">{sstResponsible.profession}</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-600 block">Identificación Oficial</span>
                  <span className="text-sm font-mono font-bold text-teal-700 block mt-0.5">
                    {sstResponsible.docType} {sstResponsible.docNumber}
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Nivel: {sstResponsible.professionalRole}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-600 block">Licencia de SST</span>
                  <span className="text-xs font-mono font-bold text-emerald-700 block mt-0.5">
                    {sstResponsible.licenseNumber}
                  </span>
                  <span className="text-[10px] text-slate-600 block mt-0.5">
                    Vigente hasta: {sstResponsible.licenseExpDate}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-600 block">Capacitación 50h / 20h SST</span>
                  <span className="text-xs font-semibold text-purple-700 block mt-0.5">
                    Certificado Válido (MinTrabajo/SENA)
                  </span>
                  <span className="text-[10px] text-slate-600 block mt-0.5">
                    {sstResponsible.courseEntity}
                  </span>
                </div>
              </div>

              {/* Status and Delegation */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Delegación de Autoridad Expresa:</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded font-bold border border-emerald-200">
                    Facultad de Parar Labores Activa
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  El responsable cuenta con autoridad legal para ordenar la suspensión preventiva de cualquier actividad o tarea de alto riesgo que represente un peligro inminente para la salud de los trabajadores.
                </p>
              </div>
            </div>

            {/* Quick Soportes & Carta status */}
            <div className="glass-card p-5 rounded-xl border border-slate-300 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Soportes Exigidos Res. 0312
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block">Hoja de Vida</span>
                    <span className="text-[10px] text-slate-600">Soportes de idoneidad</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block">Licencia SST</span>
                    <span className="text-[10px] text-slate-600">Resolución seccional</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block">Certificado Curso 50h</span>
                    <span className="text-[10px] text-slate-600">Actualización 20h</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block">Carta de Asignación</span>
                    <span className="text-[10px] text-slate-600">Firmada por empleador</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsResponsibleModalOpen(true)}
                className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold transition-colors mt-2"
              >
                Ver Documento y Firmas →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 3: ESTÁNDAR 1.1.3 PRESUPUESTO INTEGRADO (SST + PESV) */}
      {/* ============================================================== */}
      {activeSubTab === 'BUDGET' && (
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <DollarSign className="w-5 h-5" />
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Estándar 1.1.3: Asignación de Recursos y Presupuesto Integrado
                </h2>
              </div>
              <p className="text-xs text-slate-700 mt-1">
                Decreto 1072 de 2015 Art. 2.2.4.6.8 Numeral 4 {isPesvActive ? '• Integrado con PESV Vial (Res. 40595 de 2022 Paso 3)' : ''}.
              </p>
            </div>

            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              <DollarSign className="w-4 h-4" />
              <span>Abrir Gestor Presupuestal Completo</span>
            </button>
          </div>

          {/* Quick Summary of Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-300">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Total Presupuestado 2026
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                ${totalPlannedBudget.toLocaleString('es-CO')} COP
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                {isPesvActive ? 'Presupuesto Integrado SST + Flota PESV' : 'Presupuesto SG-SST'}
              </span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-300">
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                Total Ejecutado en Recursos
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                ${totalExecutedBudget.toLocaleString('es-CO')} COP
              </div>
              <span className="text-[11px] text-teal-700 font-semibold block mt-1">
                {((totalExecutedBudget / (totalPlannedBudget || 1)) * 100).toFixed(1)}% ejecutado
              </span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-300">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                Aprobación Gerencial
              </span>
              <div className="text-base font-bold text-slate-900 mt-1">
                {sstBudgetState.status === 'APROBADO_GERENCIA' ? '✓ Aprobado por Gerencia' : sstBudgetState.status}
              </div>
              <span className="text-[10px] text-slate-600 block mt-1">
                {sstBudgetState.approvalDate || 'Vigencia Fiscal 2026'}
              </span>
            </div>
          </div>

          {/* Budget Items Preview */}
          <div className="glass-card rounded-xl border border-slate-300 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Líneas Presupuestales Activas ({activeBudgetItems.length})
              </h3>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="text-emerald-700 text-xs hover:underline font-semibold"
              >
                Ver todos y editar →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {activeBudgetItems.slice(0, 4).map(item => (
                <div key={item.id} className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                        item.system === 'SST' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-teal-50 text-teal-700 border-teal-200'
                      }`}>
                        {item.system}
                      </span>
                      <span className="font-semibold text-slate-900">{item.concept}</span>
                    </div>
                    <span className="text-[11px] text-slate-600 mt-0.5 block">{item.responsible}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">
                      ${item.plannedAmount.toLocaleString('es-CO')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono">
                      Ejec: ${item.executedAmount.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 4: MATRIZ GTC 45 (IDENTIFICACIÓN DE PELIGROS) */}
      {/* ============================================================== */}
      {activeSubTab === 'MATRIX' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Estándar 4.1.1 & 4.1.2 (Res. 0312)
                </span>
                <span className="text-[10px] font-semibold text-slate-600">
                  Decreto 1072 de 2015 Art. 2.2.4.6.15
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                Identificación de Peligros, Evaluación y Valoración de Riesgos (GTC 45)
              </h2>
            </div>

            <button
              onClick={() => setShowHazardModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Identificar Nuevo Peligro</span>
            </button>
          </div>

          <div className="space-y-3">
            {sstHazards.map((haz) => (
              <div key={haz.id} className="glass-card rounded-xl p-4 border border-slate-300 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {haz.hazardClass}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{haz.process} — {haz.activity}</span>
                  </div>

                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                    haz.riskLevelInterpretation === 'I' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    haz.riskLevelInterpretation === 'II' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    Nivel de Riesgo {haz.riskLevelInterpretation} ({haz.acceptability})
                  </span>
                </div>

                <div className="text-xs text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-600 block text-[10px] font-semibold">Descripción del Peligro y Efectos:</span>
                    <p className="mt-0.5 font-medium">{haz.hazardDescription}</p>
                    <span className="text-[10px] text-amber-700 block mt-1">Efecto: {haz.possibleEffects}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-600 block text-[10px] font-semibold">Controles Jerarquizados (Dec 1072 Art. 2.2.4.6.24):</span>
                    <div className="space-y-0.5 mt-0.5 text-[11px]">
                      {haz.controls.elimination && <div>• <strong className="text-rose-700">Eliminación:</strong> {haz.controls.elimination}</div>}
                      {haz.controls.engineering && <div>• <strong className="text-teal-700">Ingeniería:</strong> {haz.controls.engineering}</div>}
                      {haz.controls.administrative && <div>• <strong className="text-amber-700">Administrativo:</strong> {haz.controls.administrative}</div>}
                      {haz.controls.epp && <div>• <strong className="text-emerald-700">EPP:</strong> {haz.controls.epp}</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 5: INSPECCIONES & CONEXIÓN CON MOTOR ACPM */}
      {/* ============================================================== */}
      {activeSubTab === 'INSPECTIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 glass-card rounded-xl p-5 border border-slate-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                Estándar 4.2.4 (Res. 0312)
              </span>
              <span className="text-[10px] text-slate-600">
                Dec 1072 Art. 2.2.4.6.24 Num. 5
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <ClipboardList className="w-4 h-4 text-orange-700" />
              Ejecutar Inspección Operacional en Campo
            </h2>
            <p className="text-xs text-slate-600 mb-4">
              Cualquier desviación o condición subestándar identificada en la inspección se transfiere <strong>automáticamente a la Matriz ACPM</strong> sin doble digitación.
            </p>

            <form onSubmit={handleCreateInspectionFinding} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Activo Inspeccionado (Compartido)</label>
                <select
                  value={inspectAssetId}
                  onChange={(e) => setInspectAssetId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.code} — {a.name} ({a.siteName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Condición Subestándar o Desviación Detectada</label>
                <textarea
                  rows={3}
                  required
                  value={inspectCondition}
                  onChange={(e) => setInspectCondition(e.target.value)}
                  placeholder="Ej: Extintor con manómetro en zona de recarga o pasador forzado..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Severidad del Hallazgo</label>
                  <select
                    value={inspectSeverity}
                    onChange={(e) => setInspectSeverity(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value="CRITICA">Crítica (Riesgo Inminente)</option>
                    <option value="MAYOR">Mayor</option>
                    <option value="MENOR">Menor</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Criterio / Norma</label>
                  <input
                    type="text"
                    value={inspectLegal}
                    onChange={(e) => setInspectLegal(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Registrar Inspección & Enviar a ACPM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 glass-card rounded-xl p-5 border border-slate-300">
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              Activos Registrados Disponibles para Inspección
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Un extintor o camión registrado aquí se reutiliza en emergencias, inspecciones preoperacionales y mantenimientos preventivos.
            </p>

            <div className="space-y-2.5">
              {assets.map(asset => (
                <div key={asset.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-700">{asset.code}</span>
                      <span className="font-semibold text-slate-900">{asset.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {asset.locationDetails} • {asset.siteName}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      {asset.status}
                    </span>
                    <span className="block text-[10px] text-slate-600 mt-1">
                      Prox. Insp: {asset.nextInspectionDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 6: GESTIÓN INTEGRAL DEL COPASST O VIGÍA DE SST */}
      {/* ============================================================== */}
      {activeSubTab === 'COMMITTEES' && (
        <CopasstVigiaModule initialTab={copasstInitialTab} />
      )}

      {/* ============================================================== */}
      {/* SUBTAB 7: GESTIÓN INTEGRAL DEL COMITÉ DE CONVIVENCIA LABORAL (CCL) */}
      {/* ============================================================== */}
      {activeSubTab === 'CCL' && (
        <CclModule initialTab={cclInitialTab} />
      )}

      {/* ============================================================== */}
      {/* SUBTAB 8: CAPACITACIÓN, FORMACIÓN, INDUCCIÓN & AULA VIRTUAL (1.2) */}
      {/* ============================================================== */}
      {activeSubTab === 'TRAINING' && (
        <TrainingModule />
      )}

      {/* ============================================================== */}
      {/* SUBTAB 9: POLÍTICA Y OBJETIVOS DEL SG-SST (2.1.1 & 2.1.2) */}
      {/* ============================================================== */}
      {activeSubTab === 'POLICY' && (
        <SstPolicyObjectivesModule initialTab={policyInitialTab} />
      )}

      {/* ============================================================== */}
      {/* SUBTAB 10: EVALUACIÓN INICIAL DEL SG-SST (Dec. 1072 Art. 2.2.4.6.16) */}
      {/* ============================================================== */}
      {activeSubTab === 'EVALUATION' && (
        <SstInitialEvaluationModule
          initialSubTab={evaluationInitialTab}
          onNavigateToModule={(tab) => {
            if (tab === 'acpm') {
              setActiveTab('acpm');
            } else {
              setActiveSubTab('STANDARDS');
            }
          }}
        />
      )}

      {/* ============================================================== */}
      {/* MODALS */}
      {/* ============================================================== */}

      {/* 1. Modal Responsable SG-SST & Carta Oficial */}
      <SstResponsibleModal
        isOpen={isResponsibleModalOpen}
        onClose={() => setIsResponsibleModalOpen(false)}
      />

      {/* 2. Modal Presupuesto Integrado SST + PESV */}
      <SstBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      {/* 3. Modal Detalle Legal y Calificación de Estándar */}
      <SstStandardDetailModal
        standard={selectedStandardForModal}
        isOpen={Boolean(selectedStandardForModal)}
        onClose={() => setSelectedStandardForModal(null)}
        onOpenResponsibleModal={() => setIsResponsibleModalOpen(true)}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
        onOpenCopasst={(tab) => {
          setCopasstInitialTab(tab || 'DASHBOARD');
          setActiveSubTab('COMMITTEES');
        }}
        onOpenCcl={(tab) => {
          setCclInitialTab((tab as any) || 'DASHBOARD');
          setActiveSubTab('CCL');
        }}
        onOpenTraining={() => setActiveSubTab('TRAINING')}
        onOpenPolicy={(tab) => {
          setPolicyInitialTab(tab || 'POLICY');
          setActiveSubTab('POLICY');
        }}
        onOpenEvaluation={(tab) => {
          setEvaluationInitialTab(tab || 'CHECKLIST');
          setActiveSubTab('EVALUATION');
        }}
      />

      {/* 4. Modal Add Hazard GTC 45 */}
      {showHazardModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddHazard} className="bg-slate-50 border border-slate-300 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Identificar Nuevo Peligro (GTC 45)</h2>
              <button type="button" onClick={() => setShowHazardModal(false)} className="text-slate-600 hover:text-slate-900">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Proceso</label>
                  <input
                    type="text"
                    required
                    value={hProcess}
                    onChange={(e) => setHProcess(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Clasificación del Peligro</label>
                  <select
                    value={hClass}
                    onChange={(e) => setHClass(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value="BIOMECANICO">Biomecánico</option>
                    <option value="CONDICIONES_SEGURIDAD">Condiciones de Seguridad</option>
                    <option value="FISICO">Físico (Ruido, Iluminación)</option>
                    <option value="QUIMICO">Químico</option>
                    <option value="PSICOSOCIAL">Psicosocial</option>
                    <option value="BIOLOGICO">Biológico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Actividad Específica</label>
                <input
                  type="text"
                  required
                  value={hActivity}
                  onChange={(e) => setHActivity(e.target.value)}
                  placeholder="Ej: Mantenimiento preventivo de motores..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Descripción del Peligro y Fuente</label>
                <textarea
                  rows={2}
                  required
                  value={hDesc}
                  onChange={(e) => setHDesc(e.target.value)}
                  placeholder="Ej: Inhalación de vapores orgánicos..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Deficiencia (ND)</label>
                  <select
                    value={hDef}
                    onChange={(e) => setHDef(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value={2}>2 (Medio)</option>
                    <option value={6}>6 (Alto)</option>
                    <option value={10}>10 (Muy Alto)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Exposición (NE)</label>
                  <select
                    value={hExp}
                    onChange={(e) => setHExp(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value={1}>1 (Esporádica)</option>
                    <option value={2}>2 (Ocasional)</option>
                    <option value={3}>3 (Frecuente)</option>
                    <option value={4}>4 (Continua)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Consecuencia (NC)</label>
                  <select
                    value={hSev}
                    onChange={(e) => setHSev(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value={10}>10 (Leve)</option>
                    <option value={25}>25 (Grave)</option>
                    <option value={60}>60 (Muy Grave)</option>
                    <option value={100}>100 (Mortal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Control de Ingeniería Propuesto</label>
                <input
                  type="text"
                  value={hEng}
                  onChange={(e) => setHEng(e.target.value)}
                  placeholder="Ej: Extractor focalizado de gases..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowHazardModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold"
              >
                Guardar en Matriz GTC 45
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Modal de Seguridad Social PILA (Estándares 1.1.4 y 1.1.5) */}
      <PilaSocialSecurityModal
        isOpen={isPilaModalOpen}
        onClose={() => setIsPilaModalOpen(false)}
        defaultPayrollType={pilaModalType}
      />
    </div>
  );
};
