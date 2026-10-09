'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  CopasstMechanismType,
  CopasstMember,
  CopasstCandidate,
  CopasstMeeting,
  CopasstMeetingCommitment,
  CopasstFindingItem,
  CopasstTrainingCourse,
  VigiaActuation
} from '@/types/copasst';
import {
  Users,
  Shield,
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Vote,
  Sparkles,
  Plus,
  Trash2,
  Download,
  Printer,
  Eye,
  Check,
  X,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  AlertCircle,
  ChevronRight,
  UserCheck,
  Send,
  Building,
  RefreshCw,
  Edit3
} from 'lucide-react';

export const CopasstVigiaModule: React.FC = () => {
  const {
    organization,
    workers,
    copasstState,
    setCopasstMechanism,
    updateVigiaProfile,
    addVigiaActuation,
    registerCopasstCandidate,
    castCopasstVote,
    closeCopasstElection,
    setEmployerRepresentatives,
    saveCopasstConformationAct,
    saveCopasstInstallationAct,
    addCopasstMeeting,
    toggleCopasstCommitmentStatus,
    createCopasstFinding,
    addCopasstTraining,
    showNotification,
    setActiveTab: setGlobalActiveTab
  } = useApp();

  // Subpestañas del módulo
  const [activeTab, setActiveTab] = useState<
    'DASHBOARD' | 'VIGIA' | 'ELECTION' | 'CONFORMATION' | 'MEETINGS' | 'FINDINGS' | 'TRAININGS' | 'DOCUMENTS'
  >('DASHBOARD');

  // Estados de modales y formularios
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isFindingModalOpen, setIsFindingModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [isActuationModalOpen, setIsActuationModalOpen] = useState(false);
  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);

  // Vista de documento a imprimir/previsualizar
  const [selectedDocumentToView, setSelectedDocumentToView] = useState<
    'CONFORMATION' | 'INSTALLATION' | 'ELECTION_RESULTS' | 'VIGIA_DESIGNATION' | 'MEETING_ACT' | null
  >(null);
  const [selectedMeetingForDoc, setSelectedMeetingForDoc] = useState<CopasstMeeting | null>(null);

  // Formulario de votación pública secreta
  const [voterDocInput, setVoterDocInput] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');

  // Formulario de nuevo candidato
  const [newCandidateWorkerId, setNewCandidateWorkerId] = useState('');
  const [newCandidateProposal, setNewCandidateProposal] = useState('');

  // Formulario de representantes del empleador
  const [employerPrincipalId, setEmployerPrincipalId] = useState(copasstState.members.find(m => m.party === 'EMPLEADOR' && m.role === 'PRESIDENTE')?.workerId || '');
  const [employerSuplenteId, setEmployerSuplenteId] = useState(copasstState.members.find(m => m.party === 'EMPLEADOR' && m.role === 'SUPLENTE')?.workerId || '');

  // Formulario de nueva reunión ordinaria
  const [newMeetingDate, setNewMeetingDate] = useState(new Date().toISOString().substring(0, 10));
  const [newMeetingModality, setNewMeetingModality] = useState<'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA'>('PRESENCIAL');
  const [newMeetingLocation, setNewMeetingLocation] = useState('Sala de Juntas Principal Fontibón');
  const [newMeetingDiscussion, setNewMeetingDiscussion] = useState('');
  const [newMeetingAttendees, setNewMeetingAttendees] = useState<string[]>(copasstState.members.map(m => m.workerId));
  const [newCommitmentDesc, setNewCommitmentDesc] = useState('');
  const [newCommitmentRespId, setNewCommitmentRespId] = useState('');
  const [newCommitmentDueDate, setNewCommitmentDueDate] = useState('');
  const [tempCommitments, setTempCommitments] = useState<{ desc: string; respId: string; respName: string; dueDate: string }[]>([]);

  // Formulario de hallazgo
  const [newFindingDesc, setNewFindingDesc] = useState('');
  const [newFindingClass, setNewFindingClass] = useState<CopasstFindingItem['classification']>('CONDICION_INSEGURA');
  const [newFindingArea, setNewFindingArea] = useState('Almacenamiento y Bodega');
  const [newFindingHazard, setNewFindingHazard] = useState('Condiciones de Seguridad / Locativo');
  const [newFindingAction, setNewFindingAction] = useState('');
  const [sendFindingToAcpm, setSendFindingToAcpm] = useState(true);

  // Formulario de capacitación
  const [newTrainingTopic, setNewTrainingTopic] = useState('Investigación de Accidentes de Trabajo según Resolución 1401 de 2007');
  const [newTrainingEntity, setNewTrainingEntity] = useState('ARL Sura Consultoría Especializada');
  const [newTrainingDate, setNewTrainingDate] = useState(new Date().toISOString().substring(0, 10));
  const [newTrainingHours, setNewTrainingHours] = useState(4);
  const [newTrainingAttendees, setNewTrainingAttendees] = useState<string[]>(copasstState.members.map(m => m.workerId));

  // Formulario de actuación del vigía
  const [newActuationType, setNewActuationType] = useState<VigiaActuation['type']>('INSPECCION');
  const [newActuationDesc, setNewActuationDesc] = useState('');
  const [newActuationFinding, setNewActuationFinding] = useState('');
  const [sendActuationToAcpm, setSendActuationToAcpm] = useState(true);

  // Asistente IA
  const [aiPromptLoading, setAiPromptLoading] = useState(false);
  const [aiGeneratedText, setAiGeneratedText] = useState<string | null>(null);

  // Determinación automática del mecanismo normativo
  const effectiveWorkerCount = organization.employeeCount || workers.length;
  const isVigiaRecommended = effectiveWorkerCount < 10;
  const isCurrentVigia = copasstState.mechanismType === 'VIGIA_SST';

  // Cálculos de indicadores para el dashboard
  const stats = useMemo(() => {
    const totalCommitments = copasstState.commitments.length;
    const closedCommitments = copasstState.commitments.filter(c => c.status === 'CUMPLIDO').length;
    const pendingCommitments = copasstState.commitments.filter(c => c.status === 'PENDIENTE' || c.status === 'EN_PROCESO').length;
    const overdueCommitments = copasstState.commitments.filter(c => c.status === 'VENCIDO').length;
    const commitmentCompliance = totalCommitments > 0 ? Math.round((closedCommitments / totalCommitments) * 100) : 100;

    const meetingsCount = copasstState.meetings.length;
    const trainingsCount = copasstState.trainings.length;
    const findingsCount = copasstState.findings.length;
    const acpmLinkedCount = copasstState.findings.filter(f => f.sentToAcpm).length;

    return {
      totalCommitments,
      closedCommitments,
      pendingCommitments,
      overdueCommitments,
      commitmentCompliance,
      meetingsCount,
      trainingsCount,
      findingsCount,
      acpmLinkedCount
    };
  }, [copasstState]);

  // Manejador del voto
  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterDocInput.trim()) {
      showNotification('Ingrese su número de documento de identidad', 'warning');
      return;
    }
    if (!selectedCandidateId) {
      showNotification('Seleccione un candidato por el cual votar', 'warning');
      return;
    }

    const result = castCopasstVote(voterDocInput.trim(), selectedCandidateId);
    if (result.success) {
      showNotification(result.message, 'success');
      setVoterDocInput('');
      setSelectedCandidateId('');
      setIsVoteModalOpen(false);
    } else {
      showNotification(result.message, 'warning');
    }
  };

  // Manejador de agregar candidato
  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateWorkerId) {
      showNotification('Seleccione un trabajador de la Base Maestra', 'warning');
      return;
    }
    registerCopasstCandidate(newCandidateWorkerId, newCandidateProposal);
    setNewCandidateWorkerId('');
    setNewCandidateProposal('');
    setIsCandidateModalOpen(false);
  };

  // Manejador de guardar representantes del empleador
  const handleSaveEmployerReps = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employerPrincipalId) {
      showNotification('Seleccione al representante principal del empleador (Presidente)', 'warning');
      return;
    }
    setEmployerRepresentatives(employerPrincipalId, employerSuplenteId || undefined);
    setIsEmployerModalOpen(false);
  };

  // Asistente IA para sugerir compromisos de reunión
  const handleGenerateAiCommitments = () => {
    setAiPromptLoading(true);
    setTimeout(() => {
      const suggestions = [
        '1. Gestionar con mantenimiento la instalación de señalización fotoluminiscente en salidas de emergencia.',
        '2. Coordinar con la ARL la fecha del taller de prevención de riesgo psicosocial y pausas activas.',
        '3. Revisar el estado de carga de extintores del área de almacenamiento y actualizar la tarjeta de inspección.',
        '4. Socializar con conductores el protocolo seguro de cargue y amarre de mercancías pesadas.'
      ].join('\n');
      setAiGeneratedText(suggestions);
      setAiPromptLoading(false);
      showNotification('Sugerencias de compromisos generadas por el Asistente IA de AGAE', 'info');
    }, 800);
  };

  // Manejador de nueva reunión
  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingDiscussion.trim()) {
      showNotification('Ingrese el resumen del desarrollo de la reunión', 'warning');
      return;
    }

    const meetingCommitments: Omit<CopasstMeetingCommitment, 'id' | 'meetingId'>[] = tempCommitments.map(c => ({
      description: c.desc,
      responsibleWorkerId: c.respId,
      responsibleName: c.respName,
      dueDate: c.dueDate,
      status: 'PENDIENTE'
    }));

    addCopasstMeeting({
      meetingNumber: copasstState.meetings.length + 1,
      date: newMeetingDate,
      modality: newMeetingModality,
      locationOrLink: newMeetingLocation,
      attendeesWorkerIds: newMeetingAttendees,
      absenteesWorkerIds: copasstState.members.filter(m => !newMeetingAttendees.includes(m.workerId)).map(m => m.workerId),
      agendaTopics: [
        '1. Verificación del quórum reglamentario',
        '2. Lectura y seguimiento a compromisos del acta anterior',
        '3. Revisión de accidentalidad, incidentes y ausentismo',
        '4. Inspecciones de seguridad y condiciones reportadas',
        '5. Varios y compromisos para el siguiente periodo'
      ],
      discussionSummary: newMeetingDiscussion,
      recommendations: [
        'Mantener actualizadas las listas de chequeo de inspecciones locativas.',
        'Hacer seguimiento al cierre de las acciones correctivas pendientes en la Matriz ACPM.'
      ],
      decisions: [
        'Aprobar el informe de actividades y programar la siguiente sesión ordinaria para dentro de 30 días.'
      ],
      commitments: meetingCommitments as any,
      signedByPresident: true,
      signedBySecretary: true,
      isClosed: true,
      evidenceIds: []
    });

    setTempCommitments([]);
    setNewMeetingDiscussion('');
    setIsMeetingModalOpen(false);
  };

  // Manejador de nuevo hallazgo
  const handleSaveFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFindingDesc.trim()) {
      showNotification('Ingrese la descripción del hallazgo', 'warning');
      return;
    }

    createCopasstFinding({
      sourceType: isCurrentVigia ? 'VIGIA_ACTUACION' : 'COPASST_REUNION',
      sourceRef: isCurrentVigia ? 'Actuación de Vigilancia SST' : `Sesión Ordinaria COPASST (${new Date().toLocaleDateString('es-CO')})`,
      date: new Date().toISOString().substring(0, 10),
      classification: newFindingClass,
      description: newFindingDesc,
      processName: 'Operaciones y Logística',
      areaName: newFindingArea,
      legalRequirementRef: 'Decreto 1072 de 2015 Art. 2.2.4.6.15',
      hazardRiskRef: newFindingHazard,
      proposedAction: newFindingAction || 'Implementar control correctivo inmediato y verificar eficacia.'
    }, sendFindingToAcpm);

    setNewFindingDesc('');
    setNewFindingAction('');
    setIsFindingModalOpen(false);
  };

  // Manejador de nueva capacitación
  const handleSaveTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainingTopic.trim()) {
      showNotification('Ingrese el tema de la capacitación', 'warning');
      return;
    }

    addCopasstTraining({
      topic: newTrainingTopic,
      entityOrTrainer: newTrainingEntity,
      date: newTrainingDate,
      durationHours: newTrainingHours,
      attendedWorkerIds: newTrainingAttendees,
      status: 'EJECUTADA'
    });

    setIsTrainingModalOpen(false);
  };

  // Manejador de actuación del vigía
  const handleSaveActuation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActuationDesc.trim()) {
      showNotification('Ingrese la descripción de la actuación', 'warning');
      return;
    }

    addVigiaActuation({
      date: new Date().toISOString().substring(0, 10),
      type: newActuationType,
      description: newActuationDesc,
      findingAssociated: newActuationFinding || undefined,
      status: 'EN_PROCESO',
      sentToAcpm: sendActuationToAcpm && !!newActuationFinding
    });

    setNewActuationDesc('');
    setNewActuationFinding('');
    setIsActuationModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      
      {/* ============================================================== */}
      {/* 1. BANNER DE APLICABILIDAD Y DETERMINACIÓN NORMATIVA AUTOMÁTICA */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-300" />
                Base Normativa: Dec. 1072/2015 Libro 2, Parte 2, Tít. 4, Cap. 6 • Res. 0312/2019 • Res. 2013/1986
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-white/10 rounded text-slate-300">
                Población: {effectiveWorkerCount} trabajadores
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-white">
              {isCurrentVigia ? 'Vigía de Seguridad y Salud en el Trabajo' : 'Comité Paritario de SST (COPASST)'}
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                Periodo {copasstState.periodStart.substring(0, 4)} - {copasstState.periodEnd.substring(0, 4)} (2 Años)
              </span>
            </h1>

            <p className="text-xs text-emerald-100/90 leading-relaxed">
              <strong>Mecanismo de participación aplicable:</strong> {copasstState.ruleExplanation}
            </p>
          </div>

          {/* Selector de alternancia rápida para parametrización o prueba */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
            <div className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider">
              Parametrización del Mecanismo:
            </div>
            <div className="bg-black/30 backdrop-blur-md p-1 rounded-xl border border-white/10 flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setCopasstMechanism('VIGIA_SST')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  isCurrentVigia
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Vigía SST (&lt; 10)</span>
              </button>

              <button
                type="button"
                onClick={() => setCopasstMechanism('COPASST')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  !isCurrentVigia
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>COPASST (≥ 10)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. BARRA DE PESTAÑAS DEL MÓDULO */}
      {/* ============================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('DASHBOARD')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === 'DASHBOARD'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Dashboard 360° & Indicadores</span>
        </button>

        {isCurrentVigia ? (
          <button
            type="button"
            onClick={() => setActiveTab('VIGIA')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'VIGIA'
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Designación & Actuaciones del Vigía</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('ELECTION')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'ELECTION'
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Vote className="w-3.5 h-3.5 text-teal-600" />
              <span>Proceso Electoral & Votación</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {copasstState.election.candidates.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CONFORMATION')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === 'CONFORMATION'
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Integrantes & Conformación</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {copasstState.members.length}
              </span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('MEETINGS')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === 'MEETINGS'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-orange-600" />
          <span>Reuniones & Compromisos</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
            {copasstState.meetings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('FINDINGS')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === 'FINDINGS'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>Hallazgos & ACPM</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 font-bold">
            {copasstState.findings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TRAININGS')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === 'TRAININGS'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Capacitaciones (1.1.7)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
            {copasstState.trainings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DOCUMENTS')}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === 'DOCUMENTS'
              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Actas & Documentos Oficiales</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* PESTAÑA 1: DASHBOARD 360° & INDICADORES DE GESTIÓN */}
      {/* ============================================================== */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-4">
          
          {/* Tarjetas de Métricas Clave */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                <span>Sesiones Realizadas</span>
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {stats.meetingsCount} <span className="text-xs font-normal text-slate-500">ordinarias</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">
                Periodicidad: Mensual obligatoria
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                <span>Eficacia Compromisos</span>
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {stats.commitmentCompliance}%
              </div>
              <div className="text-[10px] text-slate-600">
                {stats.closedCommitments} cerrados de {stats.totalCommitments} totales
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                <span>Hallazgos a ACPM</span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {stats.acpmLinkedCount} <span className="text-xs font-normal text-slate-500">acciones</span>
              </div>
              <div className="text-[10px] text-amber-700 font-medium">
                Trazabilidad 100% articulada
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                <span>Capacitación Comité</span>
                <Award className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {stats.trainingsCount} <span className="text-xs font-normal text-slate-500">cursos</span>
              </div>
              <div className="text-[10px] text-purple-700 font-medium">
                Estándar 1.1.7 al día
              </div>
            </div>
          </div>

          {/* Estado de conformación y miembros activos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Columna Izquierda: Integrantes Actuales */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    {isCurrentVigia ? 'Vigía de SST Designado' : 'Integrantes Activos del COPASST'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Consumido directamente de la Base Maestra de Trabajadores sin doble digitación.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab(isCurrentVigia ? 'VIGIA' : 'CONFORMATION')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Gestionar</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {isCurrentVigia ? (
                // Vista de integrante Vigía
                (() => {
                  const vigiaWorker = workers.find(w => w.id === copasstState.vigiaProfile?.workerId);
                  if (!vigiaWorker) return null;
                  return (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={vigiaWorker.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'}
                          alt={vigiaWorker.firstName}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-400"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            {vigiaWorker.firstName} {vigiaWorker.lastName}
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                              Vigía SST Titular
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">
                            {vigiaWorker.docType} {vigiaWorker.docNumber} • {vigiaWorker.position} • {vigiaWorker.area}
                          </div>
                          <div className="text-[10px] text-slate-500 pt-0.5">
                            Designado el {copasstState.vigiaProfile?.appointmentDate} • Firma digital registrada
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDocumentToView('VIGIA_DESIGNATION');
                          setActiveTab('DOCUMENTS');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-emerald-800 text-xs font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ver Carta de Designación</span>
                      </button>
                    </div>
                  );
                })()
              ) : (
                // Grid de integrantes COPASST
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {copasstState.members.map(member => {
                    const worker = workers.find(w => w.id === member.workerId);
                    if (!worker) return null;
                    const isPresident = member.role === 'PRESIDENTE';
                    const isSecretary = member.role === 'SECRETARIO';
                    const isEmployer = member.party === 'EMPLEADOR';

                    return (
                      <div
                        key={member.id}
                        className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 flex items-center gap-3 hover:bg-white transition-colors"
                      >
                        <img
                          src={worker.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                          alt={worker.firstName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-300"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {worker.firstName} {worker.lastName}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              isEmployer 
                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {isEmployer ? 'Empleador' : 'Trabajadores'}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 truncate">
                            {worker.position}
                          </div>

                          <div className="flex items-center gap-2 pt-0.5">
                            <span className={`text-[10px] font-bold ${
                              isPresident ? 'text-amber-700' : isSecretary ? 'text-teal-700' : 'text-slate-600'
                            }`}>
                              {member.role}
                            </span>
                            <span className="text-[10px] text-slate-400">• Activo</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Columna Derecha: Alertas & ¿Qué tengo pendiente? */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Alertas y Compromisos Clave
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  {stats.pendingCommitments} activos
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {copasstState.commitments.filter(c => c.status !== 'CUMPLIDO').slice(0, 4).map(c => (
                  <div key={c.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-800 line-clamp-2">
                        {c.description}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCopasstCommitmentStatus(c.id, 'CUMPLIDO')}
                        className="p-1 rounded hover:bg-emerald-100 text-slate-400 hover:text-emerald-700 shrink-0"
                        title="Marcar como cumplido"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                      <span>Resp: <strong>{c.responsibleName}</strong></span>
                      <span className="font-mono text-amber-700 font-bold">Límite: {c.dueDate}</span>
                    </div>
                  </div>
                ))}

                {stats.pendingCommitments === 0 && (
                  <div className="p-4 text-center text-slate-500 text-xs">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    ¡Todos los compromisos del comité están cumplidos al 100%!
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('MEETINGS')}
                  className="w-full py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Programar Próxima Reunión Ordinaria</span>
                </button>
              </div>
            </div>

          </div>

          {/* Historial Reciente de Reuniones y Acciones */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Historial de Sesiones Ordinarias y Extraordinarias
              </h3>
              <span className="text-xs text-slate-500">
                {copasstState.meetings.length} actas en custodia
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {copasstState.meetings.map(m => (
                <div key={m.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {m.actaCode}
                      </span>
                      <span className="font-semibold text-slate-800">
                        Sesión Ordinaria No. {m.meetingNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-emerald-50 text-emerald-800 px-2 py-0.2 rounded font-semibold border border-emerald-200">
                        {m.modality}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Fecha: <strong>{m.date}</strong> • Asistentes: {m.attendeesWorkerIds.length} miembros • {m.commitments.length} compromisos asignados
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMeetingForDoc(m);
                      setSelectedDocumentToView('MEETING_ACT');
                      setActiveTab('DOCUMENTS');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 self-start sm:self-center border border-slate-300 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ver Acta Oficial</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 2: GESTIÓN DEL VIGÍA SST (< 10 TRABAJADORES) */}
      {/* ============================================================== */}
      {activeTab === 'VIGIA' && isCurrentVigia && (
        <div className="space-y-4">
          
          {/* Tarjeta de Designación Oficial del Vigía */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Designación y Expediente del Vigía de Seguridad y Salud en el Trabajo
                </h3>
                <p className="text-[11px] text-slate-500">
                  Decreto 1072 de 2015 Art. 2.2.4.6.8 Parágrafo 2. El empleador designa directamente al Vigía por un periodo legal de 2 años.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDocumentToView('VIGIA_DESIGNATION');
                  setActiveTab('DOCUMENTS');
                }}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Generar Carta Oficial de Designación</span>
              </button>
            </div>

            {/* Selector de trabajador de la Base Maestra */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Seleccionar Trabajador Designado como Vigía (Base Maestra):
                  </label>
                  <select
                    value={copasstState.vigiaProfile?.workerId || ''}
                    onChange={(e) => updateVigiaProfile({ workerId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                  >
                    {workers.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.firstName} {w.lastName} ({w.docType} {w.docNumber}) - {w.position} ({w.area})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Perfil del trabajador seleccionado */}
                {(() => {
                  const currentWorker = workers.find(w => w.id === copasstState.vigiaProfile?.workerId);
                  if (!currentWorker) return null;
                  return (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
                      <img
                        src={currentWorker.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'}
                        alt={currentWorker.firstName}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-400 shrink-0"
                      />
                      <div className="space-y-1 text-xs">
                        <div className="font-bold text-slate-900 text-sm">
                          {currentWorker.firstName} {currentWorker.lastName}
                        </div>
                        <div className="text-slate-600">
                          {currentWorker.docType} {currentWorker.docNumber} • {currentWorker.position}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Área: {currentWorker.area} • Proceso: {currentWorker.processName} • Fecha de Ingreso: {currentWorker.hireDate}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                            Estado: {currentWorker.status}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-300">
                            Funciones Aceptadas
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Parámetros legales del periodo y firmas */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3 text-xs">
                <div className="font-bold text-emerald-900 border-b border-emerald-200 pb-1">
                  Datos de Vigencia Legal
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Fecha de Designación:</div>
                  <div className="font-bold text-slate-900">{copasstState.vigiaProfile?.appointmentDate}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Periodo Legal:</div>
                  <div className="font-bold text-slate-900">2 Años (Vence {copasstState.vigiaProfile?.termEndDate})</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Representante Empleador que Asigna:</div>
                  <div className="font-bold text-slate-900">{copasstState.vigiaProfile?.employerName} ({copasstState.vigiaProfile?.employerDoc})</div>
                </div>

                <div className="pt-2 border-t border-emerald-200 flex items-center gap-2 text-emerald-800 font-semibold text-[11px]">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Firmas electrónicas del Empleador y del Vigía registradas válidamente.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bitácora de Actuaciones del Vigía */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  Bitácora de Actuaciones y Vigilancia en Campo ({copasstState.vigiaActuations.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Registro de inspecciones, condiciones inseguras reportadas, recomendaciones y seguimiento con conexión directa a ACPM.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsActuationModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Registrar Actuación</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {copasstState.vigiaActuations.map(act => (
                <div key={act.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-teal-100 text-teal-800 border border-teal-200">
                        {act.type}
                      </span>
                      <span className="font-semibold text-slate-900">
                        Fecha: {act.date}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                        act.status === 'CERRADO' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {act.status}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {act.description}
                    </p>
                    {act.findingAssociated && (
                      <div className="text-[11px] text-slate-600 font-medium">
                        Hallazgo asociado: <strong>{act.findingAssociated}</strong>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {act.sentToAcpm && (
                      <span className="text-[10px] px-2 py-1 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Enlazado a ACPM</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 3: PROCESO ELECTORAL COPASST (≥ 10 TRABAJADORES) */}
      {/* ============================================================== */}
      {activeTab === 'ELECTION' && !isCurrentVigia && (
        <div className="space-y-4">
          
          {/* Banner de estado de votación */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  copasstState.election.isClosed 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse'
                }`}>
                  {copasstState.election.isClosed ? 'Elecciones Finalizadas & Escrutadas' : 'Votaciones Abiertas'}
                </span>
                <span className="text-xs text-slate-600 font-mono">
                  {copasstState.election.voterAuditLog.length} de {copasstState.election.totalEligibleVoters} votos emitidos
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Elección Democrática de Representantes de los Trabajadores ante el COPASST
              </h3>
              <p className="text-[11px] text-slate-500">
                Voto secreto y universal. Validación estricta contra censo de trabajadores de la Base Maestra.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!copasstState.election.isClosed ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsVoteModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Vote className="w-3.5 h-3.5" />
                    <span>Urna de Votación (Simular Voto)</span>
                  </button>

                  <button
                    type="button"
                    onClick={closeCopasstElection}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                  >
                    Cerrar Elección
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocumentToView('ELECTION_RESULTS');
                    setActiveTab('DOCUMENTS');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs shadow-2xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ver Acta Oficial de Escrutinio</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsCandidateModalOpen(true)}
                className="px-3 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Postular Candidato</span>
              </button>
            </div>
          </div>

          {/* Candidatos Postulados */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                Candidatos Oficiales Postulados ({copasstState.election.candidates.length})
              </h3>
              <span className="text-[11px] text-slate-500">
                Página pública disponible para votación de empleados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {copasstState.election.candidates.map(candidate => {
                const worker = workers.find(w => w.id === candidate.workerId);
                if (!worker) return null;

                return (
                  <div
                    key={candidate.id}
                    className={`p-4 rounded-xl border transition-all ${
                      candidate.isElected
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                        alt={worker.firstName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-400 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 text-xs truncate">
                          {worker.firstName} {worker.lastName}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate">
                          {worker.position}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {worker.area}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 italic mt-2.5 p-2 rounded bg-slate-50 border border-slate-100">
                      "{candidate.proposalBrief || 'Compromiso con el bienestar y seguridad.'}"
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {candidate.votesCount} votos
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ({copasstState.election.voterAuditLog.length > 0 
                            ? Math.round((candidate.votesCount / copasstState.election.voterAuditLog.length) * 100) 
                            : 0}%)
                        </span>
                      </div>

                      {candidate.isElected && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-200 text-emerald-800 border border-emerald-300">
                          Electo ({candidate.electedRole})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enlace público y auditoría de votación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tarjeta de Enlace Público Electoral */}
            <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ExternalLink className="w-4 h-4" />
                <span>Página Pública Electoral (Sin Login Requerido)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Los trabajadores pueden votar desde sus teléfonos móviles o estaciones compartidas sin requerir usuario ni contraseña de AGAE SOLUTIONS.
              </p>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 font-mono text-xs text-emerald-300 truncate">
                https://agae.app/elecciones-copasst/{copasstState.election.publicVotingUrlToken}
              </div>
              <button
                type="button"
                onClick={() => setIsVoteModalOpen(true)}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                Abrir Urna de Votación Simil-Pública
              </button>
            </div>

            {/* Auditoría Inmutable del Proceso */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900 uppercase">
                  Control de Participación & Secreto del Voto
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {copasstState.election.voterAuditLog.length} registros
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                El sistema valida que cada cédula vote una sola vez, separando técnicamente la identidad del votante del secreto de su elección.
              </p>
              <div className="max-h-28 overflow-y-auto divide-y divide-slate-100 text-[11px]">
                {copasstState.election.voterAuditLog.map((log, idx) => (
                  <div key={idx} className="py-1 flex items-center justify-between text-slate-600">
                    <span className="font-mono">Doc: {log.voterDocNumber.replace(/(\d{3})\d{3}(\d{3})/, '$1***$2')}</span>
                    <span className="text-[10px] text-slate-400">{log.votedAt}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Votó ✓</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 4: INTEGRANTES & CONFORMACIÓN COPASST */}
      {/* ============================================================== */}
      {activeTab === 'CONFORMATION' && !isCurrentVigia && (
        <div className="space-y-4">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600" />
                  Acta de Conformación Oficial del COPASST (Documento Obligatorio)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Resolución 2013 de 1986 y Decreto 1072 de 2015 Art. 2.2.4.6.8 Numeral 9. Paridad estricta entre Empleador y Trabajadores.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmployerModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 transition-colors"
                >
                  + Asignar Representantes Empleador
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocumentToView('CONFORMATION');
                    setActiveTab('DOCUMENTS');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Acta de Conformación</span>
                </button>
              </div>
            </div>

            {/* Cuadro de Integrantes Paritarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Representantes del Empleador */}
              <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                  <h4 className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-700" />
                    Representantes del Empleador (Designados por Gerencia)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {copasstState.members.filter(m => m.party === 'EMPLEADOR').length} miembros
                  </span>
                </div>

                <div className="space-y-2">
                  {copasstState.members.filter(m => m.party === 'EMPLEADOR').map(member => {
                    const worker = workers.find(w => w.id === member.workerId);
                    if (!worker) return null;
                    return (
                      <div key={member.id} className="p-2.5 rounded-lg bg-white border border-blue-200 flex items-center gap-3">
                        <img
                          src={worker.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'}
                          alt={worker.firstName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-blue-300"
                        />
                        <div className="min-w-0 flex-1 text-xs">
                          <div className="font-bold text-slate-900 truncate">
                            {worker.firstName} {worker.lastName}
                          </div>
                          <div className="text-[11px] text-slate-600 truncate">
                            {worker.position} • {worker.docNumber}
                          </div>
                          <div className="text-[10px] font-bold text-blue-700 pt-0.5">
                            Rol: {member.role} {member.role === 'PRESIDENTE' && '(Designado Presidente por Empleador)'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Representantes de los Trabajadores */}
              <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    Representantes de los Trabajadores (Elegidos por Votación)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {copasstState.members.filter(m => m.party === 'TRABAJADORES').length} miembros
                  </span>
                </div>

                <div className="space-y-2">
                  {copasstState.members.filter(m => m.party === 'TRABAJADORES').map(member => {
                    const worker = workers.find(w => w.id === member.workerId);
                    if (!worker) return null;
                    return (
                      <div key={member.id} className="p-2.5 rounded-lg bg-white border border-emerald-200 flex items-center gap-3">
                        <img
                          src={worker.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                          alt={worker.firstName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-emerald-300"
                        />
                        <div className="min-w-0 flex-1 text-xs">
                          <div className="font-bold text-slate-900 truncate">
                            {worker.firstName} {worker.lastName}
                          </div>
                          <div className="text-[11px] text-slate-600 truncate">
                            {worker.position} • {worker.docNumber}
                          </div>
                          <div className="text-[10px] font-bold text-emerald-700 pt-0.5">
                            Rol: {member.role} {member.role === 'SECRETARIO' && '(Elegido Secretario por el Comité)'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Parámetros del Acta */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <strong>Acta de Conformación No:</strong> {copasstState.conformationActNumber || 'ACTA-CONF-COP-2025-01'} • <strong>Fecha:</strong> {copasstState.conformationActDate || '2025-03-01'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocumentToView('INSTALLATION');
                    setActiveTab('DOCUMENTS');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 flex items-center gap-1"
                >
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ver Acta de Instalación</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 5: REUNIONES MENSUALES & COMPROMISOS */}
      {/* ============================================================== */}
      {activeTab === 'MEETINGS' && (
        <div className="space-y-4">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Gestión de Reuniones Mensuales y Seguimiento de Compromisos
              </h3>
              <p className="text-[11px] text-slate-500">
                Decreto 1072 de 2015 Art. 2.2.4.6.8. Los compromisos se sincronizan automáticamente con el centro general "¿Qué tengo pendiente?".
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsMeetingModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Registrar Nueva Reunión Mensual</span>
            </button>
          </div>

          {/* Listado de Actas de Reunión */}
          <div className="space-y-3">
            {copasstState.meetings.map(meeting => (
              <div key={meeting.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white text-slate-900 border border-slate-300">
                      {meeting.actaCode}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      Reunión Ordinaria No. {meeting.meetingNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800">
                      {meeting.date}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Modalidad: {meeting.modality} ({meeting.locationOrLink})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMeetingForDoc(meeting);
                      setSelectedDocumentToView('MEETING_ACT');
                      setActiveTab('DOCUMENTS');
                    }}
                    className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-emerald-800 border border-slate-300 text-xs font-bold flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3 text-emerald-600" />
                    <span>Ver Acta en PDF</span>
                  </button>
                </div>

                <div className="p-4 space-y-3 text-xs">
                  {/* Resumen del desarrollo */}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Desarrollo de la Sesión:</div>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {meeting.discussionSummary}
                    </p>
                  </div>

                  {/* Compromisos de esta reunión */}
                  {meeting.commitments.length > 0 && (
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Compromisos Registrados ({meeting.commitments.length}):</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {meeting.commitments.map(com => (
                          <div key={com.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-slate-800 truncate">
                                {com.description}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Resp: {com.responsibleName} • Límite: <strong>{com.dueDate}</strong>
                              </div>
                            </div>

                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              com.status === 'CUMPLIDO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {com.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 6: HALLAZGOS & CONEXIÓN AUTOMÁTICA CON ACPM */}
      {/* ============================================================== */}
      {activeTab === 'FINDINGS' && (
        <div className="space-y-4">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Hallazgos Identificados por COPASST / Vigía & Enlace Directo ACPM
              </h3>
              <p className="text-[11px] text-slate-500">
                Principio: "NO MÁS DOBLE DIGITACIÓN". Al confirmar que requiere acción, viaja automáticamente a la Matriz ACPM Central.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFindingModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Generar Nuevo Hallazgo</span>
            </button>
          </div>

          <div className="space-y-3">
            {copasstState.findings.map(finding => (
              <div key={finding.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                      {finding.classification}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Fuente: {finding.sourceRef}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Fecha: {finding.date}
                    </span>
                  </div>

                  {finding.sentToAcpm && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Articulado en Matriz Central ACPM</span>
                    </span>
                  )}
                </div>

                <p className="text-slate-800 font-medium leading-relaxed">
                  {finding.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Área: <strong>{finding.areaName}</strong></span>
                  {finding.legalRequirementRef && (
                    <span>Requisito Legal: <strong>{finding.legalRequirementRef}</strong></span>
                  )}
                  {finding.hazardRiskRef && (
                    <span>Peligro GTC 45: <strong>{finding.hazardRiskRef}</strong></span>
                  )}
                </div>

                {finding.proposedAction && (
                  <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                    <strong>Acción Propuesta:</strong> {finding.proposedAction}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 7: CAPACITACIONES DEL COPASST (ESTÁNDAR 1.1.7) */}
      {/* ============================================================== */}
      {activeTab === 'TRAININGS' && (
        <div className="space-y-4">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Programa de Capacitación de Integrantes del COPASST o Vigía (Estándar 1.1.7)
              </h3>
              <p className="text-[11px] text-slate-500">
                Decreto 1072/2015 Art. 2.2.4.6.11. Cursos en investigación de accidentes (Res. 1401), inspecciones planeadas y rol legal.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsTrainingModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Registrar Capacitación</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {copasstState.trainings.map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-xs">
                    {t.topic}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 shrink-0">
                    {t.durationHours} Horas
                  </span>
                </div>

                <div className="text-[11px] text-slate-600">
                  Entidad capacitadora: <strong>{t.entityOrTrainer}</strong>
                </div>

                <div className="text-[10px] text-slate-500">
                  Fecha de ejecución: {t.date} • {t.attendedWorkerIds.length} integrantes certificados
                </div>

                {t.evidenceFileName && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-teal-600" />
                      {t.evidenceFileName}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">En Custodia ✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 8: ACTAS & DOCUMENTOS OFICIALES */}
      {/* ============================================================== */}
      {activeTab === 'DOCUMENTS' && (
        <div className="space-y-4">
          
          {/* Selector de Documentos Oficiales */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
            {isCurrentVigia ? (
              <button
                type="button"
                onClick={() => setSelectedDocumentToView('VIGIA_DESIGNATION')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedDocumentToView === 'VIGIA_DESIGNATION'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Carta de Designación del Vigía SST
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedDocumentToView('CONFORMATION')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedDocumentToView === 'CONFORMATION'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Acta de Conformación del COPASST
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDocumentToView('INSTALLATION')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedDocumentToView === 'INSTALLATION'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Acta de Instalación
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDocumentToView('ELECTION_RESULTS')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedDocumentToView === 'ELECTION_RESULTS'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Acta de Escrutinio y Resultados Electorales
                </button>
              </>
            )}

            {copasstState.meetings.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedMeetingForDoc(m);
                  setSelectedDocumentToView('MEETING_ACT');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedDocumentToView === 'MEETING_ACT' && selectedMeetingForDoc?.id === m.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Acta {m.actaCode}
              </button>
            ))}
          </div>

          {/* Visor Oficial Imprimible en Formato Membretado */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-lg p-6 sm:p-10 max-w-4xl mx-auto space-y-6 text-slate-800">
            
            {/* Membrete Oficial */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-800 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">
                  AG
                </div>
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                    {organization.name}
                  </h2>
                  <div className="text-xs text-slate-600">
                    NIT: {organization.nit} • Actividad Económica: {organization.economicActivity}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST)
                  </div>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="font-mono font-bold text-slate-900">
                  {selectedDocumentToView === 'VIGIA_DESIGNATION' && 'DOC-SST-VIGIA-01'}
                  {selectedDocumentToView === 'CONFORMATION' && (copasstState.conformationActNumber || 'ACTA-CONF-COP-2025-01')}
                  {selectedDocumentToView === 'INSTALLATION' && 'ACTA-INST-COP-2025-01'}
                  {selectedDocumentToView === 'ELECTION_RESULTS' && 'ACTA-ESCRUTINIO-2025'}
                  {selectedDocumentToView === 'MEETING_ACT' && (selectedMeetingForDoc?.actaCode || 'ACTA-ORD-01')}
                </div>
                <div className="text-slate-500 text-[10px]">Versión: 02 • Vigencia: 2025-2027</div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="mt-2 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 inline-flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>

            {/* Contenido según tipo de documento seleccionado */}
            {selectedDocumentToView === 'VIGIA_DESIGNATION' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <h3 className="text-sm font-bold text-center text-slate-900 uppercase">
                  CARTA OFICIAL DE ASIGNACIÓN Y DESIGNACIÓN DEL VIGÍA DE SEGURIDAD Y SALUD EN EL TRABAJO
                </h3>

                <p>
                  En cumplimiento del <strong>Decreto 1072 de 2015</strong> (Libro 2, Parte 2, Título 4, Capítulo 6, Artículo 2.2.4.6.8 Parágrafo 2) y la <strong>Resolución 0312 de 2019</strong>, la Gerencia General de <strong>{organization.name}</strong> procede a efectuar la designación formal del Vigía de Seguridad y Salud en el Trabajo.
                </p>

                {(() => {
                  const vigiaWorker = workers.find(w => w.id === copasstState.vigiaProfile?.workerId);
                  return (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div><strong>Trabajador Designado:</strong> {vigiaWorker?.firstName} {vigiaWorker?.lastName}</div>
                      <div><strong>Documento de Identidad:</strong> {vigiaWorker?.docType} {vigiaWorker?.docNumber}</div>
                      <div><strong>Cargo:</strong> {vigiaWorker?.position} • <strong>Área:</strong> {vigiaWorker?.area}</div>
                      <div><strong>Periodo de Designación:</strong> 2 años ({copasstState.vigiaProfile?.appointmentDate} al {copasstState.vigiaProfile?.termEndDate})</div>
                    </div>
                  );
                })()}

                <div className="space-y-1">
                  <strong>Funciones y Responsabilidades Principales:</strong>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                    <li>Participar en las actividades de promoción, divulgación e información sobre seguridad y salud en el trabajo.</li>
                    <li>Visitar e inspeccionar periódicamente los lugares de trabajo e informar sobre condiciones de peligro.</li>
                    <li>Servir como organismo de coordinación y enlace entre el empleador y los trabajadores.</li>
                    <li>Participar activamente en la investigación de incidentes y accidentes de trabajo (Resolución 1401 de 2007).</li>
                  </ul>
                </div>

                {/* Firmas */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                  <div className="text-center space-y-1">
                    <div className="font-script text-lg text-emerald-800">Fernando Ortiz Salazar</div>
                    <div className="border-t border-slate-400 pt-1 font-bold">{organization.name}</div>
                    <div className="text-[10px] text-slate-500">Representante Legal (Firma Electrónica)</div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="font-script text-lg text-emerald-800">
                      {workers.find(w => w.id === copasstState.vigiaProfile?.workerId)?.firstName} {workers.find(w => w.id === copasstState.vigiaProfile?.workerId)?.lastName}
                    </div>
                    <div className="border-t border-slate-400 pt-1 font-bold">Vigía de SST Designado</div>
                    <div className="text-[10px] text-slate-500">Aceptación y Compromiso (Firma Electrónica)</div>
                  </div>
                </div>
              </div>
            )}

            {(selectedDocumentToView === 'CONFORMATION' || (!selectedDocumentToView && !isCurrentVigia)) && (
              <div className="space-y-4 text-xs leading-relaxed">
                <h3 className="text-sm font-bold text-center text-slate-900 uppercase">
                  ACTA DE CONFORMACIÓN DEL COMITÉ PARITARIO DE SEGURIDAD Y SALUD EN EL TRABAJO (COPASST)
                </h3>

                <p>
                  En las instalaciones de <strong>{organization.name}</strong>, se reunieron los representantes designados por la Gerencia General y los representantes elegidos por votación democrática y libre de los trabajadores, con el propósito de formalizar la conformación del COPASST para el periodo <strong>{copasstState.periodStart} a {copasstState.periodEnd}</strong>, conforme a lo establecido en la <strong>Resolución 2013 de 1986</strong>, el <strong>Decreto 1072 de 2015</strong> y la <strong>Resolución 0312 de 2019</strong>.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 space-y-1">
                    <div className="font-bold text-blue-900">Por parte del Empleador:</div>
                    {copasstState.members.filter(m => m.party === 'EMPLEADOR').map(m => {
                      const w = workers.find(wrk => wrk.id === m.workerId);
                      return <div key={m.id}>• {w?.firstName} {w?.lastName} ({m.role})</div>;
                    })}
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 space-y-1">
                    <div className="font-bold text-emerald-900">Por parte de los Trabajadores:</div>
                    {copasstState.members.filter(m => m.party === 'TRABAJADORES').map(m => {
                      const w = workers.find(wrk => wrk.id === m.workerId);
                      return <div key={m.id}>• {w?.firstName} {w?.lastName} ({m.role})</div>;
                    })}
                  </div>
                </div>

                <p>
                  Los integrantes juran y se comprometen a cumplir fielmente las funciones asignadas por la ley, velando por la salud, seguridad y prevención de riesgos laborales de todos los trabajadores de la empresa.
                </p>

                {/* Firmas Paritarias */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                  <div className="text-center space-y-1">
                    <div className="font-script text-base text-blue-900">Marcela Rincón Ortiz</div>
                    <div className="border-t border-slate-400 pt-1 font-bold">Presidente del COPASST</div>
                    <div className="text-[10px] text-slate-500">Representante Principal Empleador</div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="font-script text-base text-emerald-900">Sandra Milena Gómez</div>
                    <div className="border-t border-slate-400 pt-1 font-bold">Secretaria del COPASST</div>
                    <div className="text-[10px] text-slate-500">Representante Trabajadores</div>
                  </div>
                </div>
              </div>
            )}

            {selectedDocumentToView === 'MEETING_ACT' && selectedMeetingForDoc && (
              <div className="space-y-4 text-xs leading-relaxed">
                <h3 className="text-sm font-bold text-center text-slate-900 uppercase">
                  ACTA DE REUNIÓN MENSUAL DEL COPASST - {selectedMeetingForDoc.actaCode}
                </h3>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <div><strong>Fecha:</strong> {selectedMeetingForDoc.date}</div>
                  <div><strong>Lugar:</strong> {selectedMeetingForDoc.locationOrLink}</div>
                  <div><strong>Modalidad:</strong> {selectedMeetingForDoc.modality}</div>
                </div>

                <div>
                  <strong>Orden del Día:</strong>
                  <ul className="list-disc pl-5 text-slate-700">
                    {selectedMeetingForDoc.agendaTopics.map((top, idx) => (
                      <li key={idx}>{top}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>Desarrollo y Conclusiones:</strong>
                  <p className="p-2.5 rounded bg-slate-50 border border-slate-100 text-slate-700">
                    {selectedMeetingForDoc.discussionSummary}
                  </p>
                </div>

                <div>
                  <strong>Compromisos Acordados:</strong>
                  <div className="space-y-1 pt-1">
                    {selectedMeetingForDoc.commitments.map((com, idx) => (
                      <div key={idx} className="p-2 rounded bg-emerald-50/40 border border-emerald-100 flex justify-between">
                        <span>• {com.description}</span>
                        <span className="font-semibold text-slate-600">Resp: {com.responsibleName} ({com.dueDate})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Firmas */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-center">
                  <div>
                    <div className="font-script text-base text-emerald-800">Firma Presidente</div>
                    <div className="border-t border-slate-400 pt-1 font-bold">Presidente del Comité</div>
                  </div>
                  <div>
                    <div className="font-script text-base text-emerald-800">Firma Secretaria</div>
                    <div className="border-t border-slate-400 pt-1 font-bold">Secretaria del Comité</div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: URNA DE VOTACIÓN ELECTRÓNICA SEGURA */}
      {/* ============================================================== */}
      {isVoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Vote className="w-4 h-4 text-emerald-600" />
                Urna Electrónica de Votación COPASST
              </h3>
              <button onClick={() => setIsVoteModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCastVote} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ingrese su Número de Cédula o Documento de Identidad:
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1020784952 o 79654120"
                  value={voterDocInput}
                  onChange={(e) => setVoterDocInput(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  * Solo para control de voto único. Su elección permanece 100% secreta.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Seleccione al Candidato por quien desea Votar:
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                  {copasstState.election.candidates.map(candidate => {
                    const worker = workers.find(w => w.id === candidate.workerId);
                    if (!worker) return null;
                    const isSelected = selectedCandidateId === candidate.id;

                    return (
                      <div
                        key={candidate.id}
                        onClick={() => setSelectedCandidateId(candidate.id)}
                        className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="candidateRadio"
                          checked={isSelected}
                          onChange={() => setSelectedCandidateId(candidate.id)}
                          className="w-4 h-4 text-emerald-600"
                        />
                        <img
                          src={worker.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                          alt={worker.firstName}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate">
                            {worker.firstName} {worker.lastName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {worker.position} • {worker.area}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVoteModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm"
                >
                  Depositar Voto Secreto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: POSTULAR NUEVO CANDIDATO */}
      {/* ============================================================== */}
      {isCandidateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                Postular Candidato de la Base Maestra
              </h3>
              <button onClick={() => setIsCandidateModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Trabajador de la Base Maestra:
                </label>
                <select
                  value={newCandidateWorkerId}
                  onChange={(e) => setNewCandidateWorkerId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                >
                  <option value="">-- Seleccionar Trabajador --</option>
                  {workers
                    .filter(w => !copasstState.election.candidates.some(c => c.workerId === w.id))
                    .map(w => (
                      <option key={w.id} value={w.id}>
                        {w.firstName} {w.lastName} - {w.position} ({w.area})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Propuesta o Motivo de Postulación:
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Fomentar el uso de EPP y mejorar las condiciones ergonómicas en puestos de trabajo..."
                  value={newCandidateProposal}
                  onChange={(e) => setNewCandidateProposal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCandidateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-bold"
                >
                  Confirmar Postulación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: REPRESENTANTES DEL EMPLEADOR */}
      {/* ============================================================== */}
      {isEmployerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Designar Representantes del Empleador
              </h3>
              <button onClick={() => setIsEmployerModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployerReps} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Representante Principal (Presidente del COPASST):
                </label>
                <select
                  value={employerPrincipalId}
                  onChange={(e) => setEmployerPrincipalId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                >
                  <option value="">-- Seleccionar Trabajador --</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.firstName} {w.lastName} - {w.position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Representante Suplente del Empleador:
                </label>
                <select
                  value={employerSuplenteId}
                  onChange={(e) => setEmployerSuplenteId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                >
                  <option value="">-- Opcional / Seleccionar Suplente --</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.firstName} {w.lastName} - {w.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmployerModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold"
                >
                  Guardar Designación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: REGISTRAR REUNIÓN MENSUAL */}
      {/* ============================================================== */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-2 shrink-0">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Registrar Sesión Ordinaria del COPASST
              </h3>
              <button onClick={() => setIsMeetingModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveMeeting} className="space-y-3 text-xs overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de la Reunión:</label>
                  <input
                    type="date"
                    value={newMeetingDate}
                    onChange={(e) => setNewMeetingDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modalidad:</label>
                  <select
                    value={newMeetingModality}
                    onChange={(e) => setNewMeetingModality(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="VIRTUAL">Virtual</option>
                    <option value="HIBRIDA">Híbrida</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lugar o Enlace:</label>
                  <input
                    type="text"
                    value={newMeetingLocation}
                    onChange={(e) => setNewMeetingLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Desarrollo y Discusión de los Temas:</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiCommitments}
                    disabled={aiPromptLoading}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Asistente IA Sugerir Compromisos</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Detalle el desarrollo de la reunión, temas tratados y conclusiones acordadas..."
                  value={newMeetingDiscussion}
                  onChange={(e) => setNewMeetingDiscussion(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              {aiGeneratedText && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-slate-700 space-y-1">
                  <div className="font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Sugerencia de Compromisos por IA:
                  </div>
                  <pre className="whitespace-pre-line font-sans">{aiGeneratedText}</pre>
                </div>
              )}

              {/* Registro de compromisos */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-[11px]">Agregar Compromiso a la Reunión:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Descripción del compromiso..."
                    value={newCommitmentDesc}
                    onChange={(e) => setNewCommitmentDesc(e.target.value)}
                    className="sm:col-span-3 bg-white border border-slate-200 rounded p-1.5 text-xs"
                  />
                  <select
                    value={newCommitmentRespId}
                    onChange={(e) => setNewCommitmentRespId(e.target.value)}
                    className="bg-white border border-slate-200 rounded p-1.5 text-xs"
                  >
                    <option value="">-- Responsable --</option>
                    {workers.map(w => (
                      <option key={w.id} value={w.id}>{w.firstName} {w.lastName}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newCommitmentDueDate}
                    onChange={(e) => setNewCommitmentDueDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded p-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCommitmentDesc || !newCommitmentRespId || !newCommitmentDueDate) {
                        showNotification('Complete los campos del compromiso', 'warning');
                        return;
                      }
                      const respWorker = workers.find(w => w.id === newCommitmentRespId);
                      setTempCommitments(prev => [
                        ...prev,
                        {
                          desc: newCommitmentDesc,
                          respId: newCommitmentRespId,
                          respName: respWorker ? `${respWorker.firstName} ${respWorker.lastName}` : 'Responsable',
                          dueDate: newCommitmentDueDate
                        }
                      ]);
                      setNewCommitmentDesc('');
                      setNewCommitmentDueDate('');
                    }}
                    className="bg-emerald-600 text-white font-bold rounded p-1.5 text-xs hover:bg-emerald-500"
                  >
                    + Añadir
                  </button>
                </div>

                {tempCommitments.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {tempCommitments.map((c, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-white border border-slate-200 flex justify-between items-center text-[11px]">
                        <span>• {c.desc} (Resp: {c.respName} - {c.dueDate})</span>
                        <button
                          type="button"
                          onClick={() => setTempCommitments(prev => prev.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMeetingModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                >
                  Guardar Acta de Reunión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: REGISTRAR HALLAZGO & ENVIAR A ACPM */}
      {/* ============================================================== */}
      {isFindingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Registrar Hallazgo del COPASST / Vigía
              </h3>
              <button onClick={() => setIsFindingModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveFinding} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clasificación:</label>
                  <select
                    value={newFindingClass}
                    onChange={(e) => setNewFindingClass(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    <option value="CONDICION_INSEGURA">Condición Insegura</option>
                    <option value="NO_CONFORMIDAD">No Conformidad</option>
                    <option value="OPORTUNIDAD_MEJORA">Oportunidad de Mejora</option>
                    <option value="OBSERVACION">Observación</option>
                    <option value="INCUMPLIMIENTO">Incumplimiento Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Área o Lugar:</label>
                  <input
                    type="text"
                    value={newFindingArea}
                    onChange={(e) => setNewFindingArea(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Peligro Asociado (GTC 45):</label>
                <input
                  type="text"
                  value={newFindingHazard}
                  onChange={(e) => setNewFindingHazard(e.target.value)}
                  placeholder="Ej: Físico - Iluminación o Biomecánico - Posturas"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción del Hallazgo:</label>
                <textarea
                  rows={3}
                  value={newFindingDesc}
                  onChange={(e) => setNewFindingDesc(e.target.value)}
                  required
                  placeholder="Describa con precisión la situación observada..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Acción Propuesta Inmediata:</label>
                <input
                  type="text"
                  value={newFindingAction}
                  onChange={(e) => setNewFindingAction(e.target.value)}
                  placeholder="Ej: Reemplazo de equipos o demarcación de área..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkSendAcpm"
                  checked={sendFindingToAcpm}
                  onChange={(e) => setSendFindingToAcpm(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="chkSendAcpm" className="text-rose-900 font-semibold cursor-pointer">
                  Enviar automáticamente a la Matriz ACPM Central (Sin duplicar digitación)
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFindingModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold"
                >
                  Registrar Hallazgo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: REGISTRAR CAPACITACIÓN */}
      {/* ============================================================== */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Registrar Capacitación del COPASST / Vigía
              </h3>
              <button onClick={() => setIsTrainingModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveTraining} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tema del Curso:</label>
                <input
                  type="text"
                  value={newTrainingTopic}
                  onChange={(e) => setNewTrainingTopic(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Entidad Capacitadora o Instructor:</label>
                <input
                  type="text"
                  value={newTrainingEntity}
                  onChange={(e) => setNewTrainingEntity(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de Ejecución:</label>
                  <input
                    type="date"
                    value={newTrainingDate}
                    onChange={(e) => setNewTrainingDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duración (Horas):</label>
                  <input
                    type="number"
                    value={newTrainingHours}
                    onChange={(e) => setNewTrainingHours(parseInt(e.target.value) || 1)}
                    min={1}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTrainingModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-bold"
                >
                  Guardar Capacitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 7: REGISTRAR ACTUACIÓN DEL VIGÍA */}
      {/* ============================================================== */}
      {isActuationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                Registrar Actuación de Vigilancia en Campo
              </h3>
              <button onClick={() => setIsActuationModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveActuation} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Actuación:</label>
                <select
                  value={newActuationType}
                  onChange={(e) => setNewActuationType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  <option value="INSPECCION">Inspección de Puestos o Instalaciones</option>
                  <option value="CONDICION_INSEGURA">Reporte de Condición Insegura</option>
                  <option value="RECOMENDACION">Recomendación de Seguridad</option>
                  <option value="CAPACITACION">Participación en Capacitación</option>
                  <option value="INVESTIGACION_ACCIDENTE">Investigación de Accidente de Trabajo</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción de la Actuación:</label>
                <textarea
                  rows={3}
                  value={newActuationDesc}
                  onChange={(e) => setNewActuationDesc(e.target.value)}
                  required
                  placeholder="Detalle la actividad desarrollada y hallazgos encontrados..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hallazgo Asociado (Opcional):</label>
                <input
                  type="text"
                  value={newActuationFinding}
                  onChange={(e) => setNewActuationFinding(e.target.value)}
                  placeholder="Ej: Cableado defectuoso en estación de corte..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkActuationAcpm"
                  checked={sendActuationToAcpm}
                  onChange={(e) => setSendActuationToAcpm(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="chkActuationAcpm" className="text-teal-900 font-semibold cursor-pointer">
                  Enviar hallazgo a la Matriz ACPM Central
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsActuationModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-bold"
                >
                  Guardar Actuación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
