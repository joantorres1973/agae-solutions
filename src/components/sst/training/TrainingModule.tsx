'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  GraduationCap,
  Calendar,
  Table,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Video,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  UserCheck,
  FileText,
  ExternalLink,
  QrCode,
  Download,
  Share2,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Building2,
  Eye,
  Edit3,
  X,
  Check,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  Copy,
  Brain,
  Layers,
  Printer,
  Compass
} from 'lucide-react';
import {
  TrainingPlanActivity,
  TrainingStatus,
  TrainingModality,
  TrainingActivityType,
  TrainingTargetAudienceType,
  VirtualCourse,
  QuizQuestion,
  VirtualCertificate,
  InductionPackage,
  AiTrainingSuggestion,
  TrainingAttendanceEntry
} from '@/types/training';

export const TrainingModule: React.FC = () => {
  const {
    organization,
    workers,
    trainingState,
    addTrainingActivity,
    updateTrainingActivity,
    rescheduleTrainingActivity,
    markTrainingNotExecuted,
    recordTrainingExecution,
    completeVirtualCourseForWorker,
    assignWorkerInduction,
    completeWorkerInduction,
    approveAiTrainingSuggestion,
    discardAiTrainingSuggestion,
    addVirtualCourse,
    updateVirtualCourse,
    showNotification
  } = useApp();

  // Subtabs within Training Module
  const [activeTab, setActiveTab] = useState<
    'PROGRAM' | 'AULA_VIRTUAL' | 'INDUCTION' | 'AI_SUGGESTIONS' | 'CERTIFICATES' | 'METRICS'
  >('PROGRAM');

  // View Mode for Program: Excel (Spreadsheet) vs Calendar
  const [programViewMode, setProgramViewMode] = useState<'EXCEL' | 'CALENDAR'>('EXCEL');

  // Program filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TrainingStatus>('ALL');
  const [monthFilter, setMonthFilter] = useState<'ALL' | number>('ALL');
  const [modalityFilter, setModalityFilter] = useState<'ALL' | TrainingModality>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | TrainingActivityType>('ALL');

  // Selected Activity for Modals
  const [selectedActivity, setSelectedActivity] = useState<TrainingPlanActivity | null>(null);

  // Modals state
  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isNotExecutedModalOpen, setIsNotExecutedModalOpen] = useState(false);
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Virtual Classroom Simulator state
  const [simulatedCourse, setSimulatedCourse] = useState<VirtualCourse | null>(null);
  const [simStep, setSimStep] = useState<'REGISTRATION' | 'VIDEO' | 'QUIZ' | 'RESULT'>('REGISTRATION');
  const [simDocNumber, setSimDocNumber] = useState('');
  const [simWorkerName, setSimWorkerName] = useState('');
  const [simVideoWatchedPercent, setSimVideoWatchedPercent] = useState(0);
  const [simQuizAnswers, setSimQuizAnswers] = useState<Record<string, number>>({});
  const [simQuizResult, setSimQuizResult] = useState<{ score: number; passed: boolean; cert?: VirtualCertificate } | null>(null);

  // Certificate Viewer Modal
  const [viewingCertificate, setViewingCertificate] = useState<VirtualCertificate | null>(null);
  const [verifySearchCode, setVerifySearchCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<VirtualCertificate | null | 'NOT_FOUND'>(null);

  // Induction Modal state
  const [isNewInductionModalOpen, setIsNewInductionModalOpen] = useState(false);
  const [selectedInductionToEvaluate, setSelectedInductionToEvaluate] = useState<InductionPackage | null>(null);

  // AI Suggestion Approval Modal
  const [approvingSuggestion, setApprovingSuggestion] = useState<AiTrainingSuggestion | null>(null);
  const [sugMonth, setSugMonth] = useState(new Date().getMonth() + 2);
  const [sugDate, setSugDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );

  // Form states for New Activity Modal
  const [formCode, setFormCode] = useState(`CAP-2026-${String(trainingState.planActivities.length + 1).padStart(3, '0')}`);
  const [formTopic, setFormTopic] = useState('');
  const [formObjective, setFormObjective] = useState('');
  const [formType, setFormType] = useState<TrainingActivityType>('SST_GENERAL');
  const [formAudienceType, setFormAudienceType] = useState<TrainingTargetAudienceType>('TODOS');
  const [formAudienceDetail, setFormAudienceDetail] = useState('Todos los trabajadores de la organización');
  const [formScheduledWorkers, setFormScheduledWorkers] = useState(organization.employeeCount || 25);
  const [formResponsible, setFormResponsible] = useState('Líder SG-SST');
  const [formFacilitator, setFormFacilitator] = useState('ARL / Especialista Técnico');
  const [formModality, setFormModality] = useState<TrainingModality>('PRESENCIAL');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDurationHours, setFormDurationHours] = useState(2);
  const [formResources, setFormResources] = useState('Sala de conferencias, proyector, listas de asistencia');
  const [formLocation, setFormLocation] = useState('Sede Principal - Auditorio');
  const [formEvalRequired, setFormEvalRequired] = useState(true);
  const [formLinkedCourseId, setFormLinkedCourseId] = useState<string>('');

  // Reschedule Form state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduleUser, setRescheduleUser] = useState('Líder SG-SST');

  // Not Executed Form state
  const [notExecReason, setNotExecReason] = useState('');
  const [notExecObservations, setNotExecObservations] = useState('');
  const [notExecDecision, setNotExecDecision] = useState('Reprogramar para siguiente trimestre');

  // Execution Attendance Form state
  const [execActualDate, setExecActualDate] = useState(new Date().toISOString().split('T')[0]);
  const [execActualHours, setExecActualHours] = useState(2);
  const [execObservations, setExecObservations] = useState('');
  const [execEvidenceName, setExecEvidenceName] = useState('');
  const [execAttendeeList, setExecAttendeeList] = useState<TrainingAttendanceEntry[]>([]);

  // Month labels
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Filtered Plan Activities
  const filteredActivities = useMemo(() => {
    return trainingState.planActivities.filter(act => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = act.code.toLowerCase().includes(q);
        const matchTopic = act.topic.toLowerCase().includes(q);
        const matchResp = act.responsible.toLowerCase().includes(q);
        const matchFacil = act.facilitator.toLowerCase().includes(q);
        if (!matchCode && !matchTopic && !matchResp && !matchFacil) return false;
      }
      if (statusFilter !== 'ALL' && act.status !== statusFilter) return false;
      if (monthFilter !== 'ALL' && act.scheduledMonth !== monthFilter) return false;
      if (modalityFilter !== 'ALL' && act.modality !== modalityFilter) return false;
      if (typeFilter !== 'ALL' && act.activityType !== typeFilter) return false;
      return true;
    });
  }, [trainingState.planActivities, searchQuery, statusFilter, monthFilter, modalityFilter, typeFilter]);

  // Key KPI Calculations
  const metrics = useMemo(() => {
    const total = trainingState.planActivities.length;
    const executed = trainingState.planActivities.filter(a => a.status === 'EJECUTADA' || a.status === 'CERRADA').length;
    const rescheduled = trainingState.planActivities.filter(a => a.status === 'REPROGRAMADA').length;
    const notExecuted = trainingState.planActivities.filter(a => a.status === 'NO_EJECUTADA').length;
    const pending = trainingState.planActivities.filter(a => a.status === 'PROGRAMADA' || a.status === 'EN_EJECUCION').length;

    const complianceRate = total > 0 ? Math.round((executed / total) * 100) : 0;
    const rescheduleRate = total > 0 ? Math.round((rescheduled / total) * 100) : 0;
    const notExecutedRate = total > 0 ? Math.round((notExecuted / total) * 100) : 0;

    const totalScheduledAttendees = trainingState.planActivities.reduce((acc, a) => acc + (a.scheduledWorkerCount || 0), 0);
    const totalActualAttendees = trainingState.planActivities.reduce((acc, a) => acc + (a.attendeesCount || 0), 0);
    const coverageRate = totalScheduledAttendees > 0 ? Math.round((totalActualAttendees / totalScheduledAttendees) * 100) : 0;

    // Man-Hours of Training (Horas-Hombre de Capacitación)
    const manHours = trainingState.planActivities.reduce((acc, a) => {
      const hours = a.actualDurationHours || a.estimatedDurationHours || 0;
      const att = a.attendeesCount || 0;
      return acc + (hours * att);
    }, 0);

    // Virtual courses stats
    const certsCount = trainingState.certificates.length;
    const passedCerts = trainingState.certificates.filter(c => c.status === 'VALIDO').length;
    const avgVirtualScore = certsCount > 0
      ? Math.round(trainingState.certificates.reduce((a, c) => a + c.scorePercentage, 0) / certsCount)
      : 0;

    return {
      total,
      executed,
      rescheduled,
      notExecuted,
      pending,
      complianceRate,
      rescheduleRate,
      notExecutedRate,
      totalScheduledAttendees,
      totalActualAttendees,
      coverageRate,
      manHours,
      certsCount,
      passedCerts,
      avgVirtualScore
    };
  }, [trainingState.planActivities, trainingState.certificates]);

  // Helper for Status Badge styling
  const getStatusBadge = (status: TrainingStatus) => {
    switch (status) {
      case 'PROGRAMADA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">PROGRAMADA</span>;
      case 'EN_EJECUCION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">EN EJECUCIÓN</span>;
      case 'EJECUTADA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">EJECUTADA</span>;
      case 'REPROGRAMADA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">REPROGRAMADA</span>;
      case 'NO_EJECUTADA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">NO EJECUTADA</span>;
      case 'CANCELADA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">CANCELADA</span>;
      case 'PENDIENTE_EVIDENCIA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">PEND. EVIDENCIA</span>;
      case 'PENDIENTE_EVALUACION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">PEND. EVALUACIÓN</span>;
      case 'CERRADA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">CERRADA</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  // Helper for Modality Badge
  const getModalityBadge = (modality: TrainingModality) => {
    switch (modality) {
      case 'PRESENCIAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">Presencial</span>;
      case 'VIRTUAL_SINCRONICA':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800">Virtual Sincrónica</span>;
      case 'AULA_VIRTUAL_AGAE':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Aula AGAE</span>;
      case 'HIBRIDA':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800">Híbrida</span>;
      default:
        return <span>{modality}</span>;
    }
  };

  // Open Execution Modal and prepopulate attendee list from target audience or master workers
  const handleOpenExecutionModal = (activity: TrainingPlanActivity) => {
    setSelectedActivity(activity);
    setExecActualDate(activity.actualDate || new Date().toISOString().split('T')[0]);
    setExecActualHours(activity.actualDurationHours || activity.estimatedDurationHours || 2);
    setExecObservations(activity.observations || '');
    setExecEvidenceName(activity.evidenceFileNames[0] || `Lista_Asistencia_${activity.code}.pdf`);

    // Prepopulate attendance from existing or from base workers
    if (activity.attendees && activity.attendees.length > 0) {
      setExecAttendeeList(activity.attendees);
    } else {
      const activeWorkers = workers.filter(w => w.status === 'ACTIVO');
      const initialList: TrainingAttendanceEntry[] = activeWorkers.map(w => ({
        workerId: w.id,
        workerName: `${w.firstName} ${w.lastName}`,
        workerDocNumber: w.docNumber,
        workerPosition: w.position,
        attended: true,
        evaluationScore: 90,
        approved: true,
        certificateCode: `AGA-CAP-2026-${w.id.slice(-4)}`
      }));
      setExecAttendeeList(initialList);
    }
    setIsExecutionModalOpen(true);
  };

  // Save Execution Attendance
  const handleSaveExecution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;

    recordTrainingExecution(selectedActivity.id, {
      actualDate: execActualDate,
      actualDurationHours: Number(execActualHours),
      attendees: execAttendeeList,
      evidenceFileNames: execEvidenceName ? [execEvidenceName] : [],
      observations: execObservations
    });

    setIsExecutionModalOpen(false);
  };

  // Open Reschedule Modal
  const handleOpenRescheduleModal = (activity: TrainingPlanActivity) => {
    setSelectedActivity(activity);
    setRescheduleDate(activity.scheduledDate);
    setRescheduleReason('');
    setRescheduleUser('Líder SG-SST');
    setIsRescheduleModalOpen(true);
  };

  // Save Reschedule
  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !rescheduleDate || !rescheduleReason.trim()) {
      showNotification('Por favor ingrese la nueva fecha y el motivo de la reprogramación', 'warning');
      return;
    }

    rescheduleTrainingActivity(selectedActivity.id, rescheduleDate, rescheduleReason, rescheduleUser);
    setIsRescheduleModalOpen(false);
  };

  // Open Not Executed Modal
  const handleOpenNotExecutedModal = (activity: TrainingPlanActivity) => {
    setSelectedActivity(activity);
    setNotExecReason('');
    setNotExecObservations('');
    setNotExecDecision('Reprogramar para el siguiente trimestre');
    setIsNotExecutedModalOpen(true);
  };

  // Save Not Executed
  const handleSaveNotExecuted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !notExecReason.trim()) {
      showNotification('Debe ingresar el motivo por el cual la capacitación no se ejecutó', 'warning');
      return;
    }

    markTrainingNotExecuted(selectedActivity.id, notExecReason, notExecObservations, notExecDecision);
    setIsNotExecutedModalOpen(false);
  };

  // Handle Create New Activity Submit
  const handleCreateActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim() || !formDate) {
      showNotification('Por favor complete el tema y la fecha programada', 'warning');
      return;
    }

    const scheduledMonth = new Date(formDate).getMonth() + 1;

    addTrainingActivity({
      code: formCode,
      topic: formTopic,
      objective: formObjective,
      activityType: formType,
      targetAudienceType: formAudienceType,
      targetAudienceDetail: formAudienceDetail,
      targetWorkerIds: workers.map(w => w.id),
      scheduledWorkerCount: Number(formScheduledWorkers),
      responsible: formResponsible,
      facilitator: formFacilitator,
      facilitatorEntity: (formModality === 'AULA_VIRTUAL_AGAE' ? 'AGAE_SOLUTIONS' : formFacilitator.toUpperCase().includes('ARL') ? 'ARL' : 'INTERNO') as any,
      modality: formModality,
      scheduledDate: formDate,
      scheduledMonth,
      estimatedDurationHours: Number(formDurationHours),
      requiredResources: formResources,
      locationOrLink: formLocation,
      status: 'PROGRAMADA',
      evaluationRequired: formEvalRequired,
      passingScoreMin: 80,
      evidenceFileNames: [],
      linkedVirtualCourseId: formLinkedCourseId || undefined,
      observations: 'Actividad registrada formalmente en el Programa Anual de Capacitación.'
    });

    setIsNewActivityModalOpen(false);
    // Reset form
    setFormTopic('');
    setFormObjective('');
  };

  // Virtual Classroom Simulator Start
  const handleStartSimulatedCourse = (course: VirtualCourse) => {
    setSimulatedCourse(course);
    setSimStep('REGISTRATION');
    setSimDocNumber('');
    setSimWorkerName('');
    setSimVideoWatchedPercent(0);
    setSimQuizAnswers({});
    setSimQuizResult(null);
  };

  // Worker live identification in simulator
  const handleSimulatorWorkerLookup = (doc: string) => {
    setSimDocNumber(doc);
    const clean = doc.trim();
    const matched = workers.find(w => w.docNumber.trim() === clean);
    if (matched) {
      setSimWorkerName(`${matched.firstName} ${matched.lastName}`);
    }
  };

  // Submit Simulator Quiz
  const handleSubmitSimulatorQuiz = () => {
    if (!simulatedCourse) return;

    let correctCount = 0;
    simulatedCourse.questions.forEach((q: QuizQuestion) => {
      if (simQuizAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / (simulatedCourse.questions.length || 1)) * 100);
    const passed = scorePercentage >= simulatedCourse.minPassingPercentage;

    const result = completeVirtualCourseForWorker({
      courseId: simulatedCourse.id,
      workerDocNumber: simDocNumber,
      workerName: simWorkerName || 'Participante Aula Virtual',
      scorePercentage,
      answers: simQuizAnswers
    });

    setSimQuizResult({
      score: scorePercentage,
      passed,
      cert: result.certificate
    });
    setSimStep('RESULT');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ============================================================== */}
      {/* HEADER PRINCIPAL DEL COMPONENTE */}
      {/* ============================================================== */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-3 rounded-xl bg-orange-100 text-orange-700 shrink-0">
              <GraduationCap className="w-7 h-7" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Programa de Capacitación, Formación, Inducción y Reinducción
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase">
                  Estándar 1.2 • Res. 0312/2019
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  Dec. 1072/2015 Art. 2.2.4.6.11
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-4xl">
                Herramienta activa de <strong>planificación interactiva, ejecución, asistencia, evaluación, aula virtual, trazabilidad y emisión de certificados digitales</strong> sin duplicidad de digitación (Principio: <em>Un dato, múltiples usos</em>).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsNewActivityModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Programar Capacitación</span>
            </button>
          </div>
        </div>

        {/* Global Navigation Subtabs */}
        <div className="flex flex-wrap gap-1 mt-6 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('PROGRAM')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'PROGRAM'
                ? 'bg-white text-orange-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>A. Programa Anual ({trainingState.planActivities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('AULA_VIRTUAL')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'AULA_VIRTUAL'
                ? 'bg-white text-indigo-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>D. Aula Virtual AGAE ({trainingState.virtualCourses.length} cursos)</span>
          </button>

          <button
            onClick={() => setActiveTab('INDUCTION')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'INDUCTION'
                ? 'bg-white text-teal-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>C. Inducción & Reinducción ({trainingState.inductions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('AI_SUGGESTIONS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'AI_SUGGESTIONS'
                ? 'bg-white text-purple-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Programación Inteligente IA ({trainingState.aiSuggestions.filter(s => s.status === 'SUGERIDA').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CERTIFICATES')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'CERTIFICATES'
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>F. Certificados Digitales ({trainingState.certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('METRICS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'METRICS'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>G. Indicadores & Dashboard</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RESUMEN RÁPIDO DE INDICADORES ENCABEZADO */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card p-3 rounded-xl border border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cumplimiento Plan</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-slate-900 font-mono">{metrics.complianceRate}%</span>
            <span className="text-[10px] text-slate-500">({metrics.executed}/{metrics.total})</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
            <div
              className={`h-1.5 rounded-full ${metrics.complianceRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(metrics.complianceRate, 100)}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-3 rounded-xl border border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cobertura Asistencia</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-slate-900 font-mono">{metrics.coverageRate}%</span>
            <span className="text-[10px] text-slate-500">asistentes</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min(metrics.coverageRate, 100)}%` }} />
          </div>
        </div>

        <div className="glass-card p-3 rounded-xl border border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reprogramaciones</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-amber-700 font-mono">{metrics.rescheduled}</span>
            <span className="text-[10px] text-amber-600">({metrics.rescheduleRate}%)</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Trazabilidad inmutable</span>
        </div>

        <div className="glass-card p-3 rounded-xl border border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">No Ejecutadas</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-rose-700 font-mono">{metrics.notExecuted}</span>
            <span className="text-[10px] text-rose-600">({metrics.notExecutedRate}%)</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Afecta indicador oficial</span>
        </div>

        <div className="glass-card p-3 rounded-xl border border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Horas-Hombre (HHC)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-indigo-700 font-mono">{metrics.manHours}</span>
            <span className="text-[10px] text-slate-500">horas tot.</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Capacitación acumulada</span>
        </div>

        <div className="glass-card p-3 rounded-xl border border-slate-200 bg-white">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Certificados Emitidos</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-emerald-700 font-mono">{metrics.certsCount}</span>
            <span className="text-[10px] text-emerald-600">verificables</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Código QR y hash legal</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUBTAB 1: PROGRAMA ANUAL DE CAPACITACIÓN (EXCEL & CALENDARIO) */}
      {/* ============================================================== */}
      {activeTab === 'PROGRAM' && (
        <div className="space-y-4">
          {/* Controls bar: Search, filters and Excel vs Calendar toggle */}
          <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por tema, código, facilitador..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="PROGRAMADA">Programada</option>
                <option value="EJECUTADA">Ejecutada</option>
                <option value="REPROGRAMADA">Reprogramada</option>
                <option value="NO_EJECUTADA">No Ejecutada</option>
              </select>

              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="ALL">Todos los Meses</option>
                {monthNames.map((m, idx) => (
                  <option key={idx} value={idx + 1}>{m}</option>
                ))}
              </select>

              <select
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hidden md:block"
              >
                <option value="ALL">Todas las Modalidades</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="VIRTUAL_SINCRONICA">Virtual Sincrónica</option>
                <option value="AULA_VIRTUAL_AGAE">Aula Virtual AGAE</option>
                <option value="HIBRIDA">Híbrida</option>
              </select>
            </div>

            {/* Toggle View Mode: Excel vs Calendar */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setProgramViewMode('EXCEL')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                  programViewMode === 'EXCEL'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vista Hoja de Cálculo (Excel)</span>
              </button>
              <button
                onClick={() => setProgramViewMode('CALENDAR')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                  programViewMode === 'CALENDAR'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Vista Calendario Anual</span>
              </button>
            </div>
          </div>

          {/* VISTA 1: HOJA DE CÁLCULO / EXCEL */}
          {programViewMode === 'EXCEL' && (
            <div className="glass-card rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                      <th className="p-3 sticky left-0 bg-slate-50 z-10">Código</th>
                      <th className="p-3 min-w-[220px]">Tema de Capacitación</th>
                      <th className="p-3 min-w-[120px]">Población Objetivo</th>
                      <th className="p-3">Prog.</th>
                      <th className="p-3">Modalidad</th>
                      <th className="p-3">Fecha Prog.</th>
                      <th className="p-3">Responsable</th>
                      <th className="p-3">Facilitador</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Asist.</th>
                      <th className="p-3">% Cobertura</th>
                      <th className="p-3">Evaluación</th>
                      <th className="p-3">Evidencia</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredActivities.length === 0 ? (
                      <tr>
                        <td colSpan={14} className="p-8 text-center text-slate-500">
                          No se encontraron actividades con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredActivities.map((act) => (
                        <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-700 sticky left-0 bg-white z-10">
                            {act.code}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">{act.topic}</span>
                            <span className="text-[11px] text-slate-500 line-clamp-1">{act.objective}</span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {act.targetAudienceDetail}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-semibold text-slate-700 text-center">
                            {act.scheduledWorkerCount}
                          </td>
                          <td className="p-3">
                            {getModalityBadge(act.modality)}
                          </td>
                          <td className="p-3 font-mono text-slate-700 whitespace-nowrap">
                            {act.scheduledDate}
                            {act.rescheduleHistory.length > 0 && (
                              <button
                                onClick={() => {
                                  setSelectedActivity(act);
                                  setIsHistoryModalOpen(true);
                                }}
                                className="block text-[10px] text-amber-600 font-bold hover:underline"
                              >
                                Reprogramada ({act.rescheduleHistory.length})
                              </button>
                            )}
                          </td>
                          <td className="p-3 text-slate-700 truncate max-w-[120px]">
                            {act.responsible}
                          </td>
                          <td className="p-3 text-slate-700 truncate max-w-[120px]">
                            {act.facilitator}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {getStatusBadge(act.status)}
                          </td>
                          <td className="p-3 font-mono text-center font-bold text-slate-800">
                            {act.attendeesCount}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    act.attendanceRate >= 80 ? 'bg-emerald-500' : act.attendanceRate > 0 ? 'bg-amber-500' : 'bg-slate-300'
                                  }`}
                                  style={{ width: `${Math.min(act.attendanceRate, 100)}%` }}
                                />
                              </div>
                              <span className="font-mono text-[11px] font-bold text-slate-700">{act.attendanceRate}%</span>
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {act.evaluationRequired ? (
                              act.averageEvaluationScore !== undefined ? (
                                <span className={`font-mono font-bold text-xs ${act.averageEvaluationScore >= (act.passingScoreMin || 80) ? 'text-emerald-700' : 'text-rose-700'}`}>
                                  {act.averageEvaluationScore}% Prom.
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-600 font-semibold">Pendiente</span>
                              )
                            ) : (
                              <span className="text-[10px] text-slate-400">No aplica</span>
                            )}
                          </td>
                          <td className="p-3">
                            {act.evidenceFileNames.length > 0 ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {act.evidenceFileNames.length} soporte(s)
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Sin archivo</span>
                            )}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              {act.status !== 'EJECUTADA' && act.status !== 'CERRADA' && (
                                <button
                                  onClick={() => handleOpenExecutionModal(act)}
                                  title="Registrar Ejecución & Asistencia"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenRescheduleModal(act)}
                                title="Reprogramar fecha"
                                className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                              {act.status !== 'NO_EJECUTADA' && (
                                <button
                                  onClick={() => handleOpenNotExecutedModal(act)}
                                  title="Marcar como No Ejecutada"
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedActivity(act);
                                  setIsDetailModalOpen(true);
                                }}
                                title="Ver Detalle Completo"
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA 2: CALENDARIO ANUAL POR MESES */}
          {programViewMode === 'CALENDAR' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {monthNames.map((monthName, idx) => {
                const monthNum = idx + 1;
                const monthActs = trainingState.planActivities.filter(a => a.scheduledMonth === monthNum);

                return (
                  <div key={idx} className="glass-card p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-black text-sm text-slate-800">{monthName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {monthActs.length} {monthActs.length === 1 ? 'actividad' : 'actividades'}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2">
                        {monthActs.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic py-2 text-center">
                            Sin capacitaciones programadas
                          </p>
                        ) : (
                          monthActs.map(act => (
                            <div
                              key={act.id}
                              onClick={() => {
                                setSelectedActivity(act);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all cursor-pointer text-xs"
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-mono text-[10px] font-bold text-slate-500">{act.code}</span>
                                {getStatusBadge(act.status)}
                              </div>
                              <span className="font-semibold text-slate-900 block line-clamp-1">{act.topic}</span>
                              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                                <span>{act.scheduledDate}</span>
                                <span className="font-semibold text-slate-700">{act.scheduledWorkerCount} part.</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 mt-3 text-right">
                      <button
                        onClick={() => {
                          setFormDate(`2026-${String(monthNum).padStart(2, '0')}-15`);
                          setIsNewActivityModalOpen(true);
                        }}
                        className="text-[11px] font-bold text-orange-600 hover:underline"
                      >
                        + Programar en {monthName}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 2: AULA VIRTUAL AGAE (CATÁLOGO, VIDEOS, QUIZ Y ENLACES) */}
      {/* ============================================================== */}
      {activeTab === 'AULA_VIRTUAL' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2.5 rounded-lg bg-indigo-600 text-white shrink-0">
                <Video className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-black text-slate-900 text-sm">Biblioteca Oficial de Cursos Virtuales AGAE</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Capacitaciones modulares multimedia creadas por especialistas HSEQ. Cada curso cuenta con un <strong>enlace público directo</strong> que permite a los colaboradores realizar la capacitación <strong>sin requerir usuario ni contraseña</strong>, sincronizando automáticamente su asistencia, evaluación y certificado con el expediente laboral.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => showNotification('Función de creador de cursos virtuales para Administrador AGAE habilitada')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
              >
                + Crear Nuevo Curso AGAE
              </button>
            </div>
          </div>

          {/* Grid de Cursos Virtuales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {trainingState.virtualCourses.map(course => (
              <div key={course.id} className="glass-card rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  {/* Thumbnail / Header */}
                  <div className="relative h-32 bg-slate-800 overflow-hidden">
                    <img
                      src={course.videoThumbnailUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                      {course.category.replace('_', ' ')}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.durationMinutes} min
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{course.code}</span>
                      <span>v{course.version}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{course.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Evaluación: {course.questions.length} preg.</span>
                      <span className="font-semibold text-emerald-700">Mínimo: {course.minPassingPercentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {/* Botón Simular / Tomar Curso como Trabajador */}
                    <button
                      onClick={() => handleStartSimulatedCourse(course)}
                      className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Ingresar / Probar Curso</span>
                    </button>

                    {/* Botón Copiar Enlace Público */}
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(`https://agae-solutions.com/aula/${course.code}?t=${course.publicEnrollmentUrlToken}`);
                        showNotification(`✓ Enlace público de "${course.title}" copiado al portapapeles. ¡Listo para compartir a los colaboradores!`, 'success');
                      }}
                      title="Copiar Enlace Público para Trabajadores"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">
                    Enlace público abierto (Sin login ni contraseña)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 3: INDUCCIÓN & REINDUCCIÓN (DECRETO 1072 ART. 2.2.4.6.11) */}
      {/* ============================================================== */}
      {activeTab === 'INDUCTION' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2.5 rounded-lg bg-teal-600 text-white shrink-0">
                <UserCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-black text-slate-900 text-sm">Inducción y Reinducción Obligatoria en SG-SST</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Conforme al <strong>Decreto 1072 de 2015 Art. 2.2.4.6.11</strong>, todo trabajador nuevo debe recibir inducción completa en seguridad y salud en el trabajo <strong>antes de iniciar sus labores</strong>. El sistema detecta nuevos ingresos en la Base Maestra y emite alertas de asignación y evaluación.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNewInductionModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold shrink-0 shadow-sm"
            >
              + Asignar Inducción a Trabajador
            </button>
          </div>

          <div className="glass-card rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                    <th className="p-3">Trabajador</th>
                    <th className="p-3">Identificación</th>
                    <th className="p-3">Cargo & Área</th>
                    <th className="p-3">Fecha Ingreso</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Calificación</th>
                    <th className="p-3">Evaluador</th>
                    <th className="p-3">Expediente Digital</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trainingState.inductions.map(ind => (
                    <tr key={ind.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">
                        {ind.workerName}
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {ind.workerDocNumber}
                      </td>
                      <td className="p-3 text-slate-700">
                        <span className="block font-medium">{ind.workerPosition}</span>
                        <span className="text-[10px] text-slate-500">{ind.workerArea}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {ind.hireDate}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          {ind.type}
                        </span>
                      </td>
                      <td className="p-3">
                        {ind.status === 'EVALUADO_APROBADO' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            APROBADO
                          </span>
                        ) : ind.status === 'REPROBADO' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            REPROBADO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            PENDIENTE
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono">
                        {ind.evaluationScore !== undefined ? (
                          <span className="font-bold text-emerald-700">{ind.evaluationScore}/100</span>
                        ) : (
                          <span className="text-slate-400">Por calificar</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600">
                        {ind.evaluatorName || 'Por asignar'}
                      </td>
                      <td className="p-3">
                        {ind.isRegisteredInProfile ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizado
                          </span>
                        ) : (
                          <span className="text-amber-600 text-[11px]">Pendiente sync</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {ind.status === 'PENDIENTE' && (
                          <button
                            onClick={() => setSelectedInductionToEvaluate(ind)}
                            className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px]"
                          >
                            Calificar
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

      {/* ============================================================== */}
      {/* SUBTAB 4: PROGRAMACIÓN INTELIGENTE CON IA */}
      {/* ============================================================== */}
      {activeTab === 'AI_SUGGESTIONS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2.5 rounded-lg bg-purple-600 text-white shrink-0">
                <Brain className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-black text-slate-900 text-sm">Motor de Sugerencias Inteligentes de Capacitación (IA)</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  La IA analiza transversalmente la <strong>Matriz de Peligros GTC 45, Hallazgos ACPM, Quejas del Comité de Convivencia (Res. 3461/2025), actas del COPASST y reportes de incidentes</strong> para proponer capacitaciones pertinentes con fundamento real. <em>El Responsable del SG-SST siempre mantiene la decisión final de aprobación o descarte.</em>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingState.aiSuggestions.map(sug => (
              <div key={sug.id} className="glass-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Origen: {sug.source.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sug.priority === 'CRITICA' ? 'bg-rose-100 text-rose-800' :
                      sug.priority === 'ALTA' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      Prioridad {sug.priority}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{sug.proposedTopic}</h4>
                  <p className="text-xs text-slate-600 mt-1">{sug.objective}</p>

                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block">Justificación del Sistema Inteligente:</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{sug.rationale}</p>
                    <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Población: {sug.recommendedTargetAudience}</span>
                      <span>Duración: {sug.recommendedHours} hrs</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold ${
                    sug.status === 'APROBADA' ? 'text-emerald-700' :
                    sug.status === 'DESCARTADA' ? 'text-slate-400' : 'text-purple-700'
                  }`}>
                    {sug.status === 'APROBADA' ? '✓ Incorporada al Plan' :
                     sug.status === 'DESCARTADA' ? 'Descartada' : 'Sugerencia Activa'}
                  </span>

                  {sug.status === 'SUGERIDA' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => discardAiTrainingSuggestion(sug.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        Descartar
                      </button>
                      <button
                        onClick={() => {
                          setApprovingSuggestion(sug);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm"
                      >
                        Aprobar e Incorporar al Plan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 5: CERTIFICADOS DIGITALES & VALIDADOR PÚBLICO */}
      {/* ============================================================== */}
      {activeTab === 'CERTIFICATES' && (
        <div className="space-y-6">
          {/* Validador Público */}
          <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Validador Público de Certificados Digitales AGAE
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Cualquier auditor, empleador o entidad de control puede verificar la autenticidad e inalterabilidad de un certificado emitido ingresando su código único.
              </p>
            </div>

            <div className="flex items-center gap-2 max-w-md w-full">
              <input
                type="text"
                placeholder="Ej: AGA-CAP-2026-000142"
                value={verifySearchCode}
                onChange={(e) => setVerifySearchCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono uppercase"
              />
              <button
                onClick={() => {
                  const clean = verifySearchCode.trim().toUpperCase();
                  const found = trainingState.certificates.find(c => c.code.toUpperCase() === clean);
                  setVerifyResult(found || 'NOT_FOUND');
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0"
              >
                Validar
              </button>
            </div>
          </div>

          {/* Resultado de Validación */}
          {verifyResult && verifyResult !== 'NOT_FOUND' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                    ✓ Certificado Oficial Válido y Auténtico
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {verifyResult.workerName} • Cédula: {verifyResult.workerDocNumber}
                  </div>
                  <p className="text-xs text-slate-600">
                    Curso: <strong>{verifyResult.courseTitle}</strong> • Fecha: {verifyResult.issueDate} • Calificación: {verifyResult.scorePercentage}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingCertificate(verifyResult)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0"
              >
                Ver Certificado Oficial
              </button>
            </div>
          )}

          {verifyResult === 'NOT_FOUND' && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>No se encontró ningún certificado registrado bajo ese código. Verifique el formato e intente nuevamente.</span>
            </div>
          )}

          {/* Listado de Certificados Emitidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainingState.certificates.map(cert => (
              <div key={cert.id} className="glass-card p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {cert.code}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{cert.issueDate}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{cert.workerName}</h4>
                  <p className="text-[11px] text-slate-600 font-mono">CC: {cert.workerDocNumber}</p>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Capacitación:</span>
                    <span className="font-semibold text-slate-800">{cert.courseTitle}</span>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-600">
                      <span>Intensidad: {cert.hours} hrs</span>
                      <span className="font-bold text-emerald-700">Nota: {cert.scorePercentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Guardado en Expediente
                  </span>

                  <button
                    onClick={() => setViewingCertificate(cert)}
                    className="px-3 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold"
                  >
                    Ver Diploma
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 6: INDICADORES & DASHBOARD */}
      {/* ============================================================== */}
      {activeTab === 'METRICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Cumplimiento del Programa Anual
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900 font-mono">{metrics.complianceRate}%</span>
                <span className="text-xs text-slate-500 font-medium">Meta legal: &ge; 85%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full ${metrics.complianceRate >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(metrics.complianceRate, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Fórmula: (Capacitaciones Ejecutadas / Programadas) &times; 100.
              </p>
            </div>

            <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Cobertura de Trabajadores
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-blue-700 font-mono">{metrics.coverageRate}%</span>
                <span className="text-xs text-slate-500 font-medium">Meta: &ge; 80%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${Math.min(metrics.coverageRate, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Fórmula: (Trabajadores Capacitados / Programados) &times; 100.
              </p>
            </div>

            <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Tasa de Reprogramación
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-amber-700 font-mono">{metrics.rescheduleRate}%</span>
                <span className="text-xs text-slate-500 font-medium">Límite recomendado: &le; 15%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                <div
                  className="h-2 rounded-full bg-amber-500"
                  style={{ width: `${Math.min(metrics.rescheduleRate, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Fórmula: (Capacitaciones Reprogramadas / Programadas) &times; 100.
              </p>
            </div>
          </div>

          {/* Desglose por Modalidad y Conexiones con el SG-SST */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-3">Distribución por Modalidad</h4>
              <div className="space-y-3">
                {['PRESENCIAL', 'VIRTUAL_SINCRONICA', 'AULA_VIRTUAL_AGAE', 'HIBRIDA'].map(mod => {
                  const count = trainingState.planActivities.filter(a => a.modality === mod).length;
                  const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                  return (
                    <div key={mod} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{mod.replace('_', ' ')}</span>
                        <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-orange-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Conexiones Activas con el Resto del SG-SST</h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Matriz de Peligros GTC 45</span>
                  <span className="text-emerald-700 font-bold">✓ Alimenta temas prioritarios</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">COPASST / Vigía de SST</span>
                  <span className="text-emerald-700 font-bold">✓ Revisión y aprobación anual</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Comité de Convivencia (CCL)</span>
                  <span className="text-emerald-700 font-bold">✓ Prevención de acoso y clima laboral</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Expediente Base Maestra de Trabajadores</span>
                  <span className="text-emerald-700 font-bold">✓ Cero doble digitación de certificados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: NUEVA ACTIVIDAD DE CAPACITACIÓN */}
      {/* ============================================================== */}
      {isNewActivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                <h3 className="font-black text-slate-900 text-base">Programar Nueva Actividad de Capacitación</h3>
              </div>
              <button onClick={() => setIsNewActivityModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivitySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código de Actividad</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-semibold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Actividad</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    <option value="SST_GENERAL">SST General</option>
                    <option value="RIESGO_ESPECIFICO">Riesgo Específico (Ergonomía, Químico, etc.)</option>
                    <option value="EMERGENCIAS_BRIGADA">Emergencias y Brigada</option>
                    <option value="COPASST">COPASST / Vigía</option>
                    <option value="CCL">Comité de Convivencia</option>
                    <option value="PESV_SEGURIDAD_VIAL">Seguridad Vial PESV</option>
                    <option value="AMBIENTAL">Gestión Ambiental</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tema de Capacitación</label>
                <input
                  type="text"
                  placeholder="Ej: Prevención de Lesiones Osteomusculares y Pausas Activas"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Objetivo de la Capacitación</label>
                <textarea
                  rows={2}
                  placeholder="Defina el objetivo formativo medible..."
                  value={formObjective}
                  onChange={(e) => setFormObjective(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Población Objetivo</label>
                  <select
                    value={formAudienceType}
                    onChange={(e) => {
                      const t = e.target.value as TrainingTargetAudienceType;
                      setFormAudienceType(t);
                      if (t === 'TODOS') {
                        setFormAudienceDetail('Todos los trabajadores');
                        setFormScheduledWorkers(workers.length || 25);
                      } else {
                        setFormAudienceDetail('Personal operativo expuesto');
                        setFormScheduledWorkers(15);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    <option value="TODOS">Todos los Trabajadores</option>
                    <option value="AREA">Por Área / Proceso</option>
                    <option value="CARGO">Por Cargo Específico</option>
                    <option value="GRUPO_RIESGO">Por Grupo de Riesgo Prioritario</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Trabajadores Programados</label>
                  <input
                    type="number"
                    min={1}
                    value={formScheduledWorkers}
                    onChange={(e) => setFormScheduledWorkers(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modalidad</label>
                  <select
                    value={formModality}
                    onChange={(e) => setFormModality(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="VIRTUAL_SINCRONICA">Virtual Sincrónica (Teams/Meet)</option>
                    <option value="AULA_VIRTUAL_AGAE">Aula Virtual AGAE</option>
                    <option value="HIBRIDA">Híbrida</option>
                  </select>
                </div>
              </div>

              {formModality === 'AULA_VIRTUAL_AGAE' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vincular a Curso del Aula Virtual AGAE</label>
                  <select
                    value={formLinkedCourseId}
                    onChange={(e) => setFormLinkedCourseId(e.target.value)}
                    className="w-full bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-indigo-900 font-semibold"
                  >
                    <option value="">-- Seleccionar curso multimedia del catálogo --</option>
                    {trainingState.virtualCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.title} ({c.durationMinutes} min)</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha Programada</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duración Estimada (Horas)</label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={formDurationHours}
                    onChange={(e) => setFormDurationHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Responsable del SG-SST</label>
                  <input
                    type="text"
                    value={formResponsible}
                    onChange={(e) => setFormResponsible(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Facilitador / Entidad</label>
                  <input
                    type="text"
                    value={formFacilitator}
                    onChange={(e) => setFormFacilitator(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lugar físico o Enlace virtual</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Exigir Evaluación de Conocimiento</span>
                  <p className="text-[11px] text-slate-500">Mínimo de aprobación legal: 80%</p>
                </div>
                <input
                  type="checkbox"
                  checked={formEvalRequired}
                  onChange={(e) => setFormEvalRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewActivityModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md"
                >
                  Guardar en el Programa Anual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: REPROGRAMACIÓN CON TRAZABILIDAD INMUTABLE */}
      {/* ============================================================== */}
      {isRescheduleModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Reprogramar Capacitación</h3>
              </div>
              <button onClick={() => setIsRescheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
              <p>
                <strong>El programa NO se bloquea por cambiar de fecha.</strong> La fecha original (<strong>{selectedActivity.scheduledDate}</strong>) será conservada en el historial inmutable de auditoría junto con el motivo y usuario responsable.
              </p>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Capacitación a Reprogramar</label>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                  {selectedActivity.code} - {selectedActivity.topic}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fecha Programada Original</label>
                <input
                  type="text"
                  readOnly
                  value={selectedActivity.scheduledDate}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nueva Fecha Programada</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Motivo Obligatorio de Reprogramación</label>
                <textarea
                  rows={3}
                  placeholder="Ej: Cruce con auditoría de certificación o indisponibilidad del facilitador de la ARL..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Usuario que Autoriza</label>
                <input
                  type="text"
                  value={rescheduleUser}
                  onChange={(e) => setRescheduleUser(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md"
                >
                  Confirmar Reprogramación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: MARCAR COMO NO EJECUTADA */}
      {/* ============================================================== */}
      {isNotExecutedModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-rose-600" />
                <h3 className="font-black text-slate-900 text-base">Registrar como NO EJECUTADA</h3>
              </div>
              <button onClick={() => setIsNotExecutedModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 leading-relaxed">
              <p>
                <strong>Atención:</strong> Marcar una actividad como NO EJECUTADA afectará automáticamente el <strong>Indicador de Cumplimiento del Programa Anual</strong>. El Decreto 1072 exige justificación formal y decisión sobre su reanudación.
              </p>
            </div>

            <form onSubmit={handleSaveNotExecuted} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Capacitación Afectada</label>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                  {selectedActivity.code} - {selectedActivity.topic}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Motivo de No Ejecución</label>
                <textarea
                  rows={2}
                  placeholder="Ej: Inasistencia del proveedor o cancelación por fuerza mayor..."
                  value={notExecReason}
                  onChange={(e) => setNotExecReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Decisión sobre Nueva Fecha o Sustitución</label>
                <input
                  type="text"
                  value={notExecDecision}
                  onChange={(e) => setNotExecDecision(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observaciones de Auditoría</label>
                <input
                  type="text"
                  placeholder="Acciones preventivas adoptadas..."
                  value={notExecObservations}
                  onChange={(e) => setNotExecObservations(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNotExecutedModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md"
                >
                  Registrar No Ejecución
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: REGISTRO DE EJECUCIÓN, ASISTENCIA Y NOTAS */}
      {/* ============================================================== */}
      {isExecutionModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Registrar Ejecución & Lista de Asistencia</h3>
              </div>
              <button onClick={() => setIsExecutionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExecution} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha Real de Ejecución</label>
                  <input
                    type="date"
                    value={execActualDate}
                    onChange={(e) => setExecActualDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duración Real (Horas)</label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={execActualHours}
                    onChange={(e) => setExecActualHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Archivo de Soporte / Acta / Lista</label>
                  <input
                    type="text"
                    value={execEvidenceName}
                    onChange={(e) => setExecEvidenceName(e.target.value)}
                    placeholder="Lista_Asistencia_Firmada.pdf"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              {/* Lista Interactiva de Asistencia tomada de Base Maestra */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    Asistencia y Calificación ({execAttendeeList.filter(a => a.attended).length} / {execAttendeeList.length} asistentes)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Alimenta automáticamente los expedientes de cada trabajador
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                      <tr>
                        <th className="p-2 w-12 text-center">Asistió</th>
                        <th className="p-2">Trabajador</th>
                        <th className="p-2">Cédula</th>
                        <th className="p-2">Cargo</th>
                        <th className="p-2 w-28">Nota (0-100)</th>
                        <th className="p-2 w-24">Aprobado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {execAttendeeList.map((att, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={att.attended}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setExecAttendeeList(prev => prev.map((a, i) => i === idx ? { ...a, attended: checked } : a));
                              }}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                          </td>
                          <td className="p-2 font-bold text-slate-800">{att.workerName}</td>
                          <td className="p-2 font-mono text-slate-600">{att.workerDocNumber}</td>
                          <td className="p-2 text-slate-600 truncate max-w-[150px]">{att.workerPosition}</td>
                          <td className="p-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              disabled={!att.attended}
                              value={att.evaluationScore || 0}
                              onChange={(e) => {
                                const score = Number(e.target.value);
                                setExecAttendeeList(prev => prev.map((a, i) => i === idx ? {
                                  ...a,
                                  evaluationScore: score,
                                  approved: score >= 80
                                } : a));
                              }}
                              className="w-20 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono font-bold text-slate-800 disabled:opacity-40"
                            />
                          </td>
                          <td className="p-2">
                            {att.attended ? (
                              att.approved ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">SÍ</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">NO</span>
                              )
                            ) : (
                              <span className="text-slate-400 text-[10px]">No asistió</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observaciones / Conclusiones de la Sesión</label>
                <textarea
                  rows={2}
                  placeholder="Detalles del desarrollo temático..."
                  value={execObservations}
                  onChange={(e) => setExecObservations(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExecutionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  Confirmar Ejecución y Sincronizar Perfiles
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: HISTORIAL INMUTABLE DE REPROGRAMACIONES */}
      {/* ============================================================== */}
      {isHistoryModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Historial Inmutable de Cambios</h3>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800">{selectedActivity.code} - {selectedActivity.topic}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Fecha actual programada: {selectedActivity.scheduledDate}</p>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {selectedActivity.rescheduleHistory.length === 0 ? (
                <p className="text-slate-500 italic text-center py-4">Esta actividad no registra reprogramaciones.</p>
              ) : (
                selectedActivity.rescheduleHistory.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px] text-amber-900 font-bold">
                      <span>Reprogramación #{selectedActivity.rescheduleHistory.length - i}</span>
                      <span>{h.registeredAt}</span>
                    </div>
                    <div className="text-slate-800 font-semibold">
                      De: <span className="line-through text-slate-500">{h.originalDate}</span> &rarr; Nueva Fecha: <span className="text-amber-800 font-bold">{h.newDate}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]"><strong>Motivo:</strong> {h.reason}</p>
                    <span className="text-[10px] text-slate-500 block">Registrado por: {h.registeredBy}</span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: DETALLE COMPLETO DE CAPACITACIÓN */}
      {/* ============================================================== */}
      {isDetailModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <h3 className="font-black text-slate-900 text-base">Ficha Técnica de Capacitación</h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">CÓDIGO</span>
                <span className="font-bold text-slate-900">{selectedActivity.code}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ESTADO</span>
                {getStatusBadge(selectedActivity.status)}
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">FECHA PROGRAMADA</span>
                <span className="font-bold text-slate-900">{selectedActivity.scheduledDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">FECHA EJECUTADA</span>
                <span className="font-bold text-slate-900">{selectedActivity.actualDate || 'Pendiente'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase block">Tema</span>
                <span className="text-sm font-bold text-slate-900">{selectedActivity.topic}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase block">Objetivo</span>
                <p className="text-slate-700">{selectedActivity.objective}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 text-[10px] font-bold uppercase block">Facilitador</span>
                  <span className="font-bold text-slate-800">{selectedActivity.facilitator}</span>
                  <span className="text-slate-500 text-[11px] block">{selectedActivity.facilitatorEntity}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 text-[10px] font-bold uppercase block">Responsable</span>
                  <span className="font-bold text-slate-800">{selectedActivity.responsible}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 text-[10px] font-bold uppercase block">Programados</span>
                  <span className="font-bold font-mono text-slate-800">{selectedActivity.scheduledWorkerCount} trabajadores</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 text-[10px] font-bold uppercase block">Asistentes Reales</span>
                  <span className="font-bold font-mono text-slate-800">{selectedActivity.attendeesCount} trabajadores</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 text-[10px] font-bold uppercase block">Cobertura</span>
                  <span className="font-bold font-mono text-slate-800">{selectedActivity.attendanceRate}%</span>
                </div>
              </div>

              {selectedActivity.observations && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-amber-900 text-[10px] font-bold uppercase block">Observaciones</span>
                  <p className="text-amber-950 text-xs mt-0.5">{selectedActivity.observations}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 7: SIMULADOR INTERACTIVO DEL AULA VIRTUAL AGAE (SIN LOGIN) */}
      {/* ============================================================== */}
      {simulatedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 lg:p-8 shadow-2xl border border-indigo-200 space-y-6 my-8 animate-fadeIn text-xs">
            {/* Header del Aula */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 tracking-wider uppercase block">
                    Aula Virtual AGAE SOLUTIONS • Enlace Abierto
                  </span>
                  <h3 className="font-black text-slate-900 text-base">{simulatedCourse.title}</h3>
                </div>
              </div>
              <button onClick={() => setSimulatedCourse(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* PASO 1: IDENTIFICACIÓN DEL TRABAJADOR */}
            {simStep === 'REGISTRATION' && (
              <div className="space-y-4 max-w-lg mx-auto py-4">
                <div className="text-center space-y-1">
                  <h4 className="font-black text-slate-900 text-lg">Bienvenido a la Capacitación</h4>
                  <p className="text-slate-600 text-xs">
                    No requiere usuario ni contraseña. Ingrese su cédula para validar su asistencia en el sistema de su empresa.
                  </p>
                </div>

                <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Cédula o Documento de Identidad</label>
                    <input
                      type="text"
                      placeholder="Ej: 1018456789"
                      value={simDocNumber}
                      onChange={(e) => handleSimulatorWorkerLookup(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nombre Completo del Colaborador</label>
                    <input
                      type="text"
                      placeholder="Ingrese su nombre y apellidos..."
                      value={simWorkerName}
                      onChange={(e) => setSimWorkerName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Empresa</label>
                    <input
                      type="text"
                      readOnly
                      value={organization.name}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600"
                    />
                  </div>
                </div>

                <button
                  disabled={!simDocNumber.trim() || !simWorkerName.trim()}
                  onClick={() => setSimStep('VIDEO')}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Iniciar Video de Capacitación</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PASO 2: VIDEO INTERACTIVO CON CONTROL DE TIEMPO */}
            {simStep === 'VIDEO' && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden shadow-xl flex items-center justify-center">
                  <img
                    src={simulatedCourse.videoThumbnailUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'}
                    alt={simulatedCourse.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                    <span className="p-4 rounded-full bg-indigo-600/90 text-white hover:scale-110 transition-transform cursor-pointer shadow-xl">
                      <Play className="w-8 h-8 fill-white" />
                    </span>
                    <span className="font-bold text-sm">{simulatedCourse.title}</span>
                    <p className="text-xs text-slate-300 max-w-md">{simulatedCourse.description}</p>
                  </div>

                  {/* Barra de Progreso del Video */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-white font-mono">
                      <span>Progreso: {simVideoWatchedPercent}%</span>
                      <span>Mínimo requerido: {simulatedCourse.minWatchPercentageRequired}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{ width: `${simVideoWatchedPercent}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-slate-900 block">Condición pedagógica obligatoria:</span>
                    Debe visualizar al menos el {simulatedCourse.minWatchPercentageRequired}% del contenido para habilitar la evaluación de conocimientos.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSimVideoWatchedPercent(100)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
                    >
                      Completar Video (Demo)
                    </button>

                    <button
                      disabled={simVideoWatchedPercent < simulatedCourse.minWatchPercentageRequired}
                      onClick={() => setSimStep('QUIZ')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Presentar Evaluación (5 Preguntas)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: EVALUACIÓN DE CONOCIMIENTOS (5 PREGUNTAS) */}
            {simStep === 'QUIZ' && (
              <div className="space-y-6">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-950">
                    Evaluación de {simulatedCourse.questions.length} Preguntas • Mínimo de Aprobación: {simulatedCourse.minPassingPercentage}%
                  </span>
                  <span className="text-indigo-800 font-mono font-bold">
                    Participante: {simWorkerName}
                  </span>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {simulatedCourse.questions.map((q: QuizQuestion, qIndex: number) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <span className="font-bold text-slate-900 text-xs block">
                        {qIndex + 1}. {q.question}
                      </span>

                      <div className="space-y-1.5">
                        {q.options.map((opt: string, optIndex: number) => (
                          <label
                            key={optIndex}
                            className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                              simQuizAnswers[q.id] === optIndex
                                ? 'bg-indigo-50 border-indigo-400 font-semibold text-indigo-950'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={simQuizAnswers[q.id] === optIndex}
                              onChange={() => setSimQuizAnswers(prev => ({ ...prev, [q.id]: optIndex }))}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Preguntas respondidas: {Object.keys(simQuizAnswers).length} de {simulatedCourse.questions.length}
                  </span>

                  <button
                    disabled={Object.keys(simQuizAnswers).length < simulatedCourse.questions.length}
                    onClick={handleSubmitSimulatorQuiz}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-md"
                  >
                    Calificar y Finalizar
                  </button>
                </div>
              </div>
            )}

            {/* PASO 4: RESULTADO Y CERTIFICADO DIGITAL */}
            {simStep === 'RESULT' && simQuizResult && (
              <div className="space-y-6 text-center py-6 animate-fadeIn">
                {simQuizResult.passed ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-lg">
                      <Award className="w-9 h-9" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 text-2xl">¡Felicitaciones! Has Aprobado</h4>
                      <p className="text-slate-600 text-xs">
                        Calificación obtenida: <strong className="text-emerald-700 text-base">{simQuizResult.score}%</strong> (Mínimo requerido: {simulatedCourse.minPassingPercentage}%)
                      </p>
                    </div>

                    {simQuizResult.cert && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 max-w-md mx-auto text-left space-y-2">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          ✓ Certificado Digital Emitido Exitosamente
                        </span>
                        <div className="font-mono text-sm font-bold text-slate-900">
                          Código: {simQuizResult.cert.code}
                        </div>
                        <p className="text-xs text-slate-600">
                          Este certificado ha sido incorporado automáticamente en tu <strong>Expediente Digital 360°</strong> y actualizó el <strong>Programa Anual de Capacitación</strong> de {organization.name}.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-3 pt-4">
                      {simQuizResult.cert && (
                        <button
                          onClick={() => {
                            setViewingCertificate(simQuizResult.cert!);
                            setSimulatedCourse(null);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                        >
                          <Award className="w-4 h-4" />
                          <span>Ver Certificado Oficial</span>
                        </button>
                      )}
                      <button
                        onClick={() => setSimulatedCourse(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                      >
                        Finalizar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center shadow-lg">
                      <AlertTriangle className="w-9 h-9" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 text-xl">No Aprobado ({simQuizResult.score}%)</h4>
                      <p className="text-slate-600 text-xs">
                        Para aprobar se requiere un porcentaje mínimo de <strong>{simulatedCourse.minPassingPercentage}%</strong>.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-4">
                      <button
                        onClick={() => {
                          setSimQuizAnswers({});
                          setSimStep('QUIZ');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                      >
                        Reintentar Evaluación
                      </button>
                      <button
                        onClick={() => setSimulatedCourse(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                      >
                        Salir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 8: VISUALIZADOR OFICIAL DE CERTIFICADO DIGITAL AGAE */}
      {/* ============================================================== */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-emerald-600 space-y-6 my-8 animate-fadeIn text-center relative">
            <button
              onClick={() => setViewingCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Borde ornamental y logos */}
            <div className="flex items-center justify-between border-b-2 border-emerald-600/30 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-600 text-white">
                  <GraduationCap className="w-6 h-6" />
                </span>
                <span className="font-black text-slate-900 text-base tracking-tight">AGAE SOLUTIONS</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Código de Verificación</span>
                <span className="font-mono text-xs font-bold text-emerald-800">{viewingCertificate.code}</span>
              </div>
            </div>

            <div className="space-y-2 py-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
                CERTIFICADO DE FORMACIÓN Y APROBACIÓN
              </span>
              <p className="text-xs text-slate-500">Se certifica formalmente que:</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{viewingCertificate.workerName}</h2>
              <p className="text-xs font-mono font-semibold text-slate-600">
                Documento de Identidad: {viewingCertificate.workerDocNumber}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Ha participado activamente y aprobado satisfactoriamente la capacitación de:
              </p>
              <h3 className="text-lg font-bold text-emerald-950 mt-1">{viewingCertificate.courseTitle}</h3>
              <p className="text-xs text-slate-600">
                Con una intensidad de <strong>{viewingCertificate.hours} horas</strong> y un resultado evaluativo de <strong>{viewingCertificate.scorePercentage}%</strong>.
              </p>
            </div>

            {/* Metadatos y Sellos Legales */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200 text-left text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">EMPRESA BENEFICIARIA</span>
                <span className="font-semibold text-slate-900">{viewingCertificate.companyName}</span>
                <span className="text-[10px] text-slate-500 block mt-2">FECHA DE EMISIÓN</span>
                <span className="font-semibold text-slate-900">{viewingCertificate.issueDate}</span>
              </div>

              <div className="text-right flex flex-col items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block">FACILITADOR HSEQ</span>
                  <span className="font-semibold text-slate-900">{viewingCertificate.facilitatorName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10px] mt-2">
                  <QrCode className="w-4 h-4" />
                  <span>Código de Autenticidad Válido</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  window.print?.();
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Descargar PDF</span>
              </button>
              <button
                onClick={() => setViewingCertificate(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 9: ASIGNACIÓN DE INDUCCIÓN A TRABAJADOR */}
      {/* ============================================================== */}
      {isNewInductionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-slate-900 text-base">Asignar Inducción SG-SST</h3>
              </div>
              <button onClick={() => setIsNewInductionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Seleccionar Trabajador</label>
                <select
                  id="indWorkerSelect"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-semibold"
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.firstName} {w.lastName} • {w.position} ({w.docNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipo de Formación</label>
                <select
                  id="indTypeSelect"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                >
                  <option value="INDUCCION">Inducción (Nuevo Ingreso)</option>
                  <option value="REINDUCCION">Reinducción Periódica Anual</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fecha Límite Obligatoria</label>
                <input
                  type="date"
                  id="indDueDate"
                  defaultValue={new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-bold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInductionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const workerId = (document.getElementById('indWorkerSelect') as HTMLSelectElement).value;
                    const type = (document.getElementById('indTypeSelect') as HTMLSelectElement).value as any;
                    const dueDate = (document.getElementById('indDueDate') as HTMLInputElement).value;
                    assignWorkerInduction(workerId, type, dueDate);
                    setIsNewInductionModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md"
                >
                  Asignar Inducción
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 10: CALIFICAR INDUCCIÓN */}
      {/* ============================================================== */}
      {selectedInductionToEvaluate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-slate-900 text-base">Calificar y Formalizar Inducción</h3>
              </div>
              <button onClick={() => setSelectedInductionToEvaluate(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200">
              <span className="font-bold text-teal-950 block">{selectedInductionToEvaluate.workerName}</span>
              <p className="text-[11px] text-teal-800">Cargo: {selectedInductionToEvaluate.workerPosition} • CC: {selectedInductionToEvaluate.workerDocNumber}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Calificación de la Evaluación (0 a 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  id="evalScoreInput"
                  defaultValue={95}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Evaluador</label>
                <input
                  type="text"
                  id="evaluatorNameInput"
                  defaultValue="Líder SG-SST"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Archivo de Evidencia</label>
                <input
                  type="text"
                  id="evidenceFileInput"
                  defaultValue={`Acta_Induccion_${selectedInductionToEvaluate.workerDocNumber}.pdf`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInductionToEvaluate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const score = Number((document.getElementById('evalScoreInput') as HTMLInputElement).value);
                    const evaluator = (document.getElementById('evaluatorNameInput') as HTMLInputElement).value;
                    const file = (document.getElementById('evidenceFileInput') as HTMLInputElement).value;
                    completeWorkerInduction(selectedInductionToEvaluate.id, score, evaluator, file);
                    setSelectedInductionToEvaluate(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md"
                >
                  Guardar y Certificar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 11: APROBAR SUGERENCIA DE IA */}
      {/* ============================================================== */}
      {approvingSuggestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-black text-slate-900 text-base">Aprobar Sugerencia de IA</h3>
              </div>
              <button onClick={() => setApprovingSuggestion(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
              <span className="font-bold text-purple-950 block">{approvingSuggestion.proposedTopic}</span>
              <p className="text-[11px] text-purple-800 mt-0.5">{approvingSuggestion.objective}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mes Programado</label>
                <select
                  value={sugMonth}
                  onChange={(e) => setSugMonth(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-semibold"
                >
                  {monthNames.map((m, idx) => (
                    <option key={idx} value={idx + 1}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fecha Programada</label>
                <input
                  type="date"
                  value={sugDate}
                  onChange={(e) => setSugDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-bold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApprovingSuggestion(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    approveAiTrainingSuggestion(approvingSuggestion.id, sugMonth, sugDate);
                    setApprovingSuggestion(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md"
                >
                  Aprobar e Incorporar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
