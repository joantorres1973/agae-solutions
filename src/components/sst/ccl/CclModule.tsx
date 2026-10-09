'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  HeartHandshake,
  Scale,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Clock,
  Users,
  UserCheck,
  FileText,
  CheckCircle2,
  Lock,
  Unlock,
  Vote,
  Eye,
  EyeOff,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  Download,
  Upload,
  PenTool,
  Sparkles,
  Brain,
  BarChart3,
  Layers,
  Send,
  History,
  BookOpen,
  Award,
  AlertTriangle,
  Building2,
  CheckSquare,
  FileCheck,
  HelpCircle,
  Info,
  X,
  RefreshCw,
  FolderLock,
  MessageSquare,
  ClipboardList,
  Printer,
  Edit3,
  Save,
  ExternalLink
} from 'lucide-react';
import {
  CclComplaintCase,
  CclComplaintStatus,
  CclMember,
  CclMeeting,
  CclCommitmentItem,
  CclHearingRecord,
  CclFollowUpRecord,
  CclProtocolDocument
} from '@/types/ccl';

interface CclModuleProps {
  initialTab?: 'DASHBOARD' | 'CASES' | 'ELECTIONS' | 'CONFORMATION' | 'MEETINGS' | 'REGULATION' | 'REPORTS';
}

export const CclModule: React.FC<CclModuleProps> = ({ initialTab = 'DASHBOARD' }) => {
  const {
    organization,
    workers,
    cclState,
    registerCclComplaint,
    updateCclComplaintStage,
    recordCclHearing,
    recordCclDialogueSession,
    addCclCommitment,
    toggleCclCommitmentStatus,
    addCclFollowUp,
    closeCclComplaint,
    registerCclCandidate,
    castCclVote,
    closeCclElection,
    setEmployerCclRepresentatives,
    signCclConfidentiality,
    signCclMeetingMember,
    signCclMeetingAllMembers,
    uploadScannedCclMeetingAct,
    addCclMeeting,
    updateCclMeeting,
    updateCclRegulation,
    updateCclDocumentNotes,
    updateCclProtocol,
    showNotification,
    setActiveTab
  } = useApp();

  // Navigation subtabs inside CCL
  const [activeTab, setActiveTabLocal] = useState<
    'DASHBOARD' | 'CASES' | 'ELECTIONS' | 'CONFORMATION' | 'MEETINGS' | 'REGULATION' | 'REPORTS'
  >(initialTab);

  // Confidentiality Privacy Mask (toggle to protect sensitive worker names in general view)
  const [maskSensitiveNames, setMaskSensitiveNames] = useState(false);

  // Search and filters for cases
  const [caseFilterStatus, setCaseFilterStatus] = useState<string>('TODOS');
  const [caseSearchQuery, setCaseSearchQuery] = useState('');

  // Selected case for complete 360° confidential dossier view
  const [selectedCaseForDossier, setSelectedCaseForDossier] = useState<CclComplaintCase | null>(null);

  // Modal states
  const [isNewComplaintModalOpen, setIsNewComplaintModalOpen] = useState(false);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [selectedMeetingForEdit, setSelectedMeetingForEdit] = useState<CclMeeting | null>(null);
  const [isEmployerDesignationModalOpen, setIsEmployerDesignationModalOpen] = useState(false);
  const [selectedProtocolForView, setSelectedProtocolForView] = useState<CclProtocolDocument | null>(null);

  // Protocol Editor State
  const [isEditingProtocol, setIsEditingProtocol] = useState(false);
  const [editProtocolTitle, setEditProtocolTitle] = useState('');
  const [editProtocolBasis, setEditProtocolBasis] = useState('');
  const [editProtocolDesc, setEditProtocolDesc] = useState('');
  const [editProtocolContent, setEditProtocolContent] = useState('');

  const openProtocolViewer = (prot: CclProtocolDocument) => {
    setSelectedProtocolForView(prot);
    setEditProtocolTitle(prot.title);
    setEditProtocolBasis(prot.legalBasis);
    setEditProtocolDesc(prot.description);
    setEditProtocolContent(prot.contentTemplate);
    setIsEditingProtocol(false);
  };

  const handleSaveProtocolEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProtocolForView) return;
    const nextVer = (parseInt(selectedProtocolForView.version, 10) + 1).toString().padStart(2, '0');
    updateCclProtocol(selectedProtocolForView.id, {
      title: editProtocolTitle,
      legalBasis: editProtocolBasis,
      description: editProtocolDesc,
      contentTemplate: editProtocolContent,
      version: nextVer
    });
    setSelectedProtocolForView({
      ...selectedProtocolForView,
      title: editProtocolTitle,
      legalBasis: editProtocolBasis,
      description: editProtocolDesc,
      contentTemplate: editProtocolContent,
      version: nextVer,
      updatedAt: new Date().toISOString().split('T')[0]
    });
    setIsEditingProtocol(false);
  };

  // New Complaint Form State
  const [newComplaintData, setNewComplaintData] = useState({
    channel: 'CANAL_CONFIDENCIAL' as CclComplaintCase['channel'],
    complainantWorkerId: '',
    respondentWorkerId: '',
    witnessesText: '',
    incidentDates: '',
    incidentLocation: '',
    factsDescription: '',
    acceptedTerms: false
  });

  // Voting Modal Form State
  const [voterDocInput, setVoterDocInput] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [votingResultFeedback, setVotingResultFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Real-time voter live identification against Master Worker Base (Sin login)
  const cleanVoterDoc = voterDocInput.replace(/\D/g, '');
  const detectedVoter = useMemo(() => {
    if (!cleanVoterDoc) return null;
    return workers.find(w => w.docNumber.replace(/\D/g, '') === cleanVoterDoc && w.status === 'ACTIVO') || null;
  }, [cleanVoterDoc, workers]);

  const hasAlreadyVoted = useMemo(() => {
    if (!cleanVoterDoc) return false;
    return cclState.election.voterAuditLog.some(log => log.voterDocNumber.replace(/\D/g, '') === cleanVoterDoc);
  }, [cleanVoterDoc, cclState.election.voterAuditLog]);

  // New Candidate Postulation Form State
  const [candidateWorkerId, setCandidateWorkerId] = useState('');
  const [candidateProposal, setCandidateProposal] = useState('');
  const [candidateValidationWarning, setCandidateValidationWarning] = useState<string | null>(null);

  // Employer Designation Form State
  const [empPrincipalId, setEmpPrincipalId] = useState('');
  const [empAlternateId, setEmpAlternateId] = useState('');

  // New Meeting Form State
  const [newMeetingData, setNewMeetingData] = useState({
    type: 'ORDINARIA' as CclMeeting['type'],
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    modality: 'HIBRIDA' as CclMeeting['modality'],
    locationOrLink: 'Sala de Juntas Principal / Enlace Seguro Teams',
    agendaTopics: [
      'Verificación del quórum reglamentario y lectura de compromisos anteriores',
      'Informe estadístico agregado de solicitudes y casos de convivencia',
      'Revisión preventiva de factores organizacionales y clima laboral',
      'Proposiciones, compromisos y recomendaciones preventivas'
    ],
    discussionSummary: '',
    preventiveRecommendations: [
      'Mantener talleres mensuales de comunicación asertiva en áreas operativas',
      'Socializar canales de radicación confidencial y alcance preventivo del CCL'
    ]
  });

  // Helpers for Worker details
  const getWorker = (workerId?: string) => {
    if (!workerId) return undefined;
    return workers.find(w => w.id === workerId);
  };

  const formatWorkerName = (workerId: string, mask = maskSensitiveNames) => {
    const wrk = getWorker(workerId);
    if (!wrk) return 'Trabajador no identificado';
    if (mask) {
      return `Colaborador(a) [ID: ***${wrk.docNumber.slice(-4)}]`;
    }
    return `${wrk.firstName} ${wrk.lastName}`;
  };

  // Filtered cases list
  const filteredCases = useMemo(() => {
    return cclState.complaints.filter(c => {
      const matchesStatus = caseFilterStatus === 'TODOS' || c.status === caseFilterStatus;
      const compWorker = getWorker(c.complainantWorkerId);
      const respWorker = getWorker(c.respondentWorkerId);
      const searchTarget = `${c.code} ${c.factsDescription} ${compWorker?.firstName} ${compWorker?.lastName} ${respWorker?.firstName} ${respWorker?.lastName}`.toLowerCase();
      const matchesSearch = caseSearchQuery === '' || searchTarget.includes(caseSearchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [cclState.complaints, caseFilterStatus, caseSearchQuery, workers]);

  // Statistics & KPIs
  const totalComplaints = cclState.complaints.length;
  const activeCases = cclState.complaints.filter(c => c.status !== 'CERRADA' && c.status !== 'ARCHIVADA_RESERVA' && c.status !== 'REMITIDA').length;
  const inImprovementPlanCases = cclState.complaints.filter(c => c.status === 'PLAN_MEJORA' || c.status === 'EN_SEGUIMIENTO').length;
  const closedCases = cclState.complaints.filter(c => c.status === 'CERRADA').length;
  const totalCommitments = cclState.complaints.reduce((acc, c) => acc + (c.improvementPlan?.commitments.length || 0), 0);
  const completedCommitments = cclState.complaints.reduce((acc, c) => {
    return acc + (c.improvementPlan?.commitments.filter(item => item.status === 'CUMPLIDO').length || 0);
  }, 0);
  const commitmentFulfillmentRate = totalCommitments > 0 ? Math.round((completedCommitments / totalCommitments) * 100) : 100;

  // Active committee members
  const employerPrincipals = cclState.members.filter(m => m.party === 'EMPLEADOR' && m.isPrincipal);
  const employerAlternates = cclState.members.filter(m => m.party === 'EMPLEADOR' && !m.isPrincipal);
  const workerPrincipals = cclState.members.filter(m => m.party === 'TRABAJADORES' && m.isPrincipal);
  const workerAlternates = cclState.members.filter(m => m.party === 'TRABAJADORES' && !m.isPrincipal);
  const presidentMember = cclState.members.find(m => m.role === 'PRESIDENTE');
  const secretaryMember = cclState.members.find(m => m.role === 'SECRETARIO');

  // Submit new complaint handler
  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintData.complainantWorkerId || !newComplaintData.respondentWorkerId) {
      showNotification('Seleccione las personas involucradas desde la Base Maestra de Trabajadores.', 'warning');
      return;
    }
    if (newComplaintData.complainantWorkerId === newComplaintData.respondentWorkerId) {
      showNotification('La persona que radica no puede ser la misma persona señalada.', 'warning');
      return;
    }
    if (!newComplaintData.factsDescription.trim()) {
      showNotification('Ingrese la descripción objetiva de los hechos.', 'warning');
      return;
    }
    if (!newComplaintData.acceptedTerms) {
      showNotification('Debe aceptar la declaración de confidencialidad y tratamiento de datos.', 'warning');
      return;
    }

    const createdCase = registerCclComplaint({
      channel: newComplaintData.channel,
      complainantWorkerId: newComplaintData.complainantWorkerId,
      respondentWorkerId: newComplaintData.respondentWorkerId,
      witnessesText: newComplaintData.witnessesText,
      incidentDates: newComplaintData.incidentDates || 'Fechas recientes especificadas en el expediente',
      incidentLocation: newComplaintData.incidentLocation || 'Instalaciones de la empresa',
      factsDescription: newComplaintData.factsDescription
    });

    setIsNewComplaintModalOpen(false);
    setNewComplaintData({
      channel: 'CANAL_CONFIDENCIAL',
      complainantWorkerId: '',
      respondentWorkerId: '',
      witnessesText: '',
      incidentDates: '',
      incidentLocation: '',
      factsDescription: '',
      acceptedTerms: false
    });
    setSelectedCaseForDossier(createdCase);
  };

  // Submit vote handler
  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterDocInput.trim()) {
      setVotingResultFeedback({ success: false, message: 'Ingrese su número de documento de identidad.' });
      return;
    }
    if (!selectedCandidateId) {
      setVotingResultFeedback({ success: false, message: 'Seleccione un candidato o vote en blanco.' });
      return;
    }

    const result = castCclVote(voterDocInput.trim(), selectedCandidateId);
    setVotingResultFeedback(result);
    if (result.success) {
      setTimeout(() => {
        setIsVotingModalOpen(false);
        setVoterDocInput('');
        setSelectedCandidateId('');
        setVotingResultFeedback(null);
      }, 2500);
    }
  };

  // Candidate postulation handler
  const handleRegisterCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateWorkerId) {
      showNotification('Seleccione un trabajador de la Base Maestra', 'warning');
      return;
    }

    const result = registerCclCandidate(candidateWorkerId, candidateProposal);
    if (result.success) {
      setIsCandidateModalOpen(false);
      setCandidateWorkerId('');
      setCandidateProposal('');
      setCandidateValidationWarning(null);
    } else {
      setCandidateValidationWarning(result.message);
    }
  };

  // Employer representatives update handler
  const handleSaveEmployerReps = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empPrincipalId || !empAlternateId) {
      showNotification('Seleccione tanto el representante principal como el suplente del empleador', 'warning');
      return;
    }
    setEmployerCclRepresentatives(empPrincipalId, empAlternateId);
    setIsEmployerDesignationModalOpen(false);
  };

  // Create meeting handler
  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    addCclMeeting({
      type: newMeetingData.type,
      date: newMeetingData.date,
      time: newMeetingData.time,
      modality: newMeetingData.modality,
      locationOrLink: newMeetingData.locationOrLink,
      attendeesWorkerIds: cclState.members.map(m => m.workerId),
      agendaTopics: newMeetingData.agendaTopics,
      discussionSummary: newMeetingData.discussionSummary || 'Sesión formal instalada con verificación de quórum reglamentario.',
      preventiveRecommendations: newMeetingData.preventiveRecommendations,
      commitments: []
    });
    setIsNewMeetingModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* ============================================================== */}
      {/* 1. HEADER & NORMATIVE VALIDATION BANNER (RESOLUCIÓN 3461 DE 2025) */}
      {/* ============================================================== */}
      <div className="glass-card p-5 rounded-2xl flex flex-col gap-4 border border-teal-200/80 bg-gradient-to-br from-white via-teal-50/20 to-slate-50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-3 rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20 shrink-0">
              <HeartHandshake className="w-7 h-7" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Comité de Convivencia Laboral (CCL)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-teal-100 text-teal-800 border border-teal-300 uppercase tracking-wide">
                  Estándar 1.1.8 SG-SST
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Res. 3461 de 2025 Vigente
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Sistema activo de gestión, prevención, seguimiento y administración confidencial de quejas relacionadas con convivencia laboral y presuntas conductas de acoso. Instancia preventiva, orientadora, conciliadora y canalizadora.
              </p>
            </div>
          </div>

          {/* Privacy Toggle & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMaskSensitiveNames(!maskSensitiveNames)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                maskSensitiveNames
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="Protege la visualización de nombres de personas en pantallas compartidas o auditorías"
            >
              {maskSensitiveNames ? <EyeOff className="w-4 h-4 text-amber-700" /> : <Eye className="w-4 h-4 text-slate-500" />}
              <span>{maskSensitiveNames ? 'Modo Alta Reserva Activado' : 'Ocultar Identidades'}</span>
            </button>

            <button
              onClick={() => setIsNewComplaintModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Radicar Solicitud / Queja Confidencial</span>
            </button>
          </div>
        </div>

        {/* ALERTA NORMATIVA OBLIGATORIA: DEROGATORIA EXPRESA DE RESOLUCIONES 652 Y 1356 DE 2012 */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 border border-teal-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-teal-600 text-white shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-teal-950 flex items-center gap-2">
                <span>Marco Normativo Aplicable: Resolución 3461 de 2025 del Ministerio del Trabajo</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-100 text-rose-800 font-bold border border-rose-200">
                  Res. 652 y 1356/2012 DEROGADAS
                </span>
              </div>
              <p className="text-teal-900 text-[11px] mt-0.5">
                Articulado con el <strong>Decreto 1072 de 2015</strong> (SG-SST, prevención y riesgo psicosocial) y la <strong>Resolución 0312 de 2019</strong>. El Comité no es una corte sancionatoria: su rol es 100% preventivo, conciliador y orientador del debido proceso sin emitir conclusiones jurídicas automáticas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-700 bg-white/80 px-2.5 py-1 rounded-lg border border-teal-200">
              Vigencia Comité: {cclState.periodStart} al {cclState.periodEnd} (2 Años)
            </span>
          </div>
        </div>

        {/* NAVIGATION SUBTABS BAR */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTabLocal('DASHBOARD')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'DASHBOARD'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard & Plazos ({activeCases} Activos)</span>
          </button>

          <button
            onClick={() => setActiveTabLocal('CASES')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'CASES'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>Matriz de Quejas & Expedientes ({cclState.complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTabLocal('ELECTIONS')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'ELECTIONS'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            <span>Elecciones & Voto Secreto</span>
          </button>

          <button
            onClick={() => setActiveTabLocal('CONFORMATION')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'CONFORMATION'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Conformación & Actas Paritarias ({cclState.members.length})</span>
          </button>

          <button
            onClick={() => setActiveTabLocal('MEETINGS')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'MEETINGS'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Sesiones & Actas Mensuales ({cclState.meetings.length})</span>
          </button>

          <button
            onClick={() => setActiveTabLocal('REGULATION')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'REGULATION'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reglamento & Protocolos Res. 3461</span>
          </button>

          <button
            onClick={() => setActiveTabLocal('REPORTS')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'REPORTS'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Informes Mensuales / Anual & SG-SST</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUBTAB 1: DASHBOARD & CONTROL DE TÉRMINOS LEGALES */}
      {/* ============================================================== */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-5">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Casos en Trámite Activo</span>
                <Clock className="w-4 h-4 text-teal-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-mono">{activeCases}</span>
                <span className="text-xs text-slate-500">de {totalComplaints} radicados</span>
              </div>
              <div className="mt-2 text-[11px] text-teal-700 font-medium">
                {inImprovementPlanCases} en plan de mejora y concertación
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Tasa de Compromisos Cumplidos</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700 font-mono">{commitmentFulfillmentRate}%</span>
                <span className="text-xs text-slate-500">{completedCommitments} / {totalCommitments}</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-600">
                Seguimiento periódico a planes de acción
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Conformación Paritaria</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-mono">{cclState.members.length}</span>
                <span className="text-xs text-slate-500">integrantes activos</span>
              </div>
              <div className="mt-2 text-[11px] text-blue-700 font-medium">
                Res. 3461: {cclState.applicability.requiredEmployerPrincipals + cclState.applicability.requiredWorkersPrincipals} Principales / {cclState.applicability.requiredEmployerAlternates + cclState.applicability.requiredWorkersAlternates} Suplentes
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Próxima Sesión Ordinaria</span>
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-black text-slate-900 font-mono">
                  {cclState.meetings[0]?.date || 'Programada'}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-amber-800 font-medium">
                Periodicidad mensual obligatoria (Res. 3461/2025)
              </div>
            </div>
          </div>

          {/* Banner: Determinación de la Conformación Res. 3461/2025 */}
          <div className="glass-card p-4 rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50/60 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-700" />
                <span className="font-extrabold text-sm text-teal-950">
                  Configuración de CCL Aplicable: {cclState.applicability.normativeReference}
                </span>
                <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
                  {cclState.applicability.scale === 'DE_5_A_MENOS_20' ? '5 a 19 trabajadores' : '20+ trabajadores'}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">
                {cclState.applicability.explanation}
              </p>
            </div>
            <button
              onClick={() => setActiveTabLocal('CONFORMATION')}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Ver Integrantes & Actas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Casos Próximos a Vencer y Control de Plazos Legales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Columna Izquierda: Semáforo de Casos Activos con Control de Plazos */}
            <div className="lg:col-span-2 glass-card p-5 rounded-xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Control Automático de Términos Legales (Res. 3461 de 2025)</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Monitoreo estricto de plazos para examen confidencial, audiencias y sesión de diálogo.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTabLocal('CASES')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <span>Ver Todos ({cclState.complaints.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {cclState.complaints.slice(0, 3).map(complaint => {
                  const compWorker = getWorker(complaint.complainantWorkerId);
                  const isClosed = complaint.status === 'CERRADA' || complaint.status === 'ARCHIVADA_RESERVA';

                  return (
                    <div
                      key={complaint.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
                            {complaint.code}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            complaint.status === 'PLAN_MEJORA' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            complaint.status === 'EXAMEN_CONFIDENCIAL' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            complaint.status === 'CERRADA' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                            'bg-blue-50 text-blue-800 border-blue-200'
                          }`}>
                            {complaint.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Radicado: {complaint.filingDate}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 line-clamp-1">
                          {complaint.factsDescription}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span>
                            Plazo Resolución: <strong className="text-slate-800 font-mono">{complaint.resolutionDeadline}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Canal: <strong className="text-slate-800">{complaint.channel.replace(/_/g, ' ')}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedCaseForDossier(complaint)}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <FolderLock className="w-3.5 h-3.5" />
                          <span>Expediente 360°</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Columna Derecha: Interconexión con Riesgo Psicosocial & Tareas SG-SST */}
            <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white space-y-4">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>Interconexión con Riesgo Psicosocial</span>
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Los datos del CCL alimentan el análisis de condiciones de convivencia de manera <strong>anonimizada y agregada</strong>, protegiendo estrictamente la reserva de las personas (Res. 3461/2025 Art. 12).
              </p>

              <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-200 space-y-2 text-xs">
                <div className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Tendencias Detectadas (100% Anonimizado)</span>
                </div>
                <ul className="space-y-1 text-purple-900 text-[11px] list-disc list-inside">
                  <li>Mayor tensión reportada en áreas operativas durante horas pico de despacho.</li>
                  <li>Estilos de comunicación reactiva identificados como factor común.</li>
                  <li>100% de quejas canalizadas hacia acuerdos de mejora y mediación asertiva.</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTabLocal('REPORTS')}
                  className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors text-center"
                >
                  Ver Estadísticas Mensuales
                </button>
                <button
                  onClick={() => setActiveTab('acpm')}
                  className="w-full py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors text-center"
                >
                  Consultar Acciones Preventivas ACPM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 2: MATRIZ DE QUEJAS & EXPEDIENTES DIGITALES 360° */}
      {/* ============================================================== */}
      {activeTab === 'CASES' && (
        <div className="space-y-4">
          {/* Filters and Search Bar */}
          <div className="glass-card p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por código, hechos o palabras clave..."
                  value={caseSearchQuery}
                  onChange={(e) => setCaseSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={caseFilterStatus}
                  onChange={(e) => setCaseFilterStatus(e.target.value)}
                  className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-teal-500 bg-white"
                >
                  <option value="TODOS">Todos los Estados ({cclState.complaints.length})</option>
                  <option value="RECIBIDA">Recibida</option>
                  <option value="RADICADA">Radicada</option>
                  <option value="EXAMEN_CONFIDENCIAL">En Examen Confidencial</option>
                  <option value="DIALOGO_CONCERTACION">En Diálogo / Concertación</option>
                  <option value="PLAN_MEJORA">Plan de Mejora</option>
                  <option value="EN_SEGUIMIENTO">En Seguimiento</option>
                  <option value="CERRADA">Cerrada</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsNewComplaintModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Queja Confidencial</span>
            </button>
          </div>

          {/* Cases Table */}
          <div className="glass-card rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Código Único</th>
                    <th className="p-3.5">Radicación</th>
                    <th className="p-3.5">Personas Involucradas</th>
                    <th className="p-3.5">Hechos / Resumen Objetivo</th>
                    <th className="p-3.5">Etapa Actual</th>
                    <th className="p-3.5">Control de Términos</th>
                    <th className="p-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.length > 0 ? (
                    filteredCases.map(c => {
                      const compWorker = getWorker(c.complainantWorkerId);
                      const respWorker = getWorker(c.respondentWorkerId);
                      const hasCommitments = c.improvementPlan && c.improvementPlan.commitments.length > 0;

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              {c.code}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1">
                              {c.channel.replace(/_/g, ' ')}
                            </div>
                          </td>

                          <td className="p-3.5 text-slate-700 font-medium">
                            {c.filingDate}
                            <span className="block text-[10px] text-slate-400">
                              Recepción: {c.receptionDate}
                            </span>
                          </td>

                          <td className="p-3.5 space-y-1">
                            <div className="text-slate-800">
                              <span className="text-[10px] text-slate-400 font-bold block">Quejoso/a:</span>
                              <strong>{formatWorkerName(c.complainantWorkerId)}</strong>
                              <span className="block text-[10px] text-slate-500">
                                {maskSensitiveNames ? 'Área Reservada' : compWorker?.position || 'Colaborador'}
                              </span>
                            </div>
                            <div className="text-slate-800 pt-1 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400 font-bold block">Señalado/a:</span>
                              <strong>{formatWorkerName(c.respondentWorkerId)}</strong>
                              <span className="block text-[10px] text-slate-500">
                                {maskSensitiveNames ? 'Área Reservada' : respWorker?.position || 'Colaborador'}
                              </span>
                            </div>
                          </td>

                          <td className="p-3.5 max-w-xs">
                            <p className="text-slate-700 line-clamp-2 leading-relaxed">
                              {c.factsDescription}
                            </p>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              Lugar: {c.incidentLocation}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                              c.status === 'PLAN_MEJORA' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              c.status === 'EXAMEN_CONFIDENCIAL' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                              c.status === 'CERRADA' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                              c.status === 'REMITIDA' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                              'bg-teal-50 text-teal-800 border-teal-200'
                            }`}>
                              {c.status.replace(/_/g, ' ')}
                            </span>
                            {hasCommitments && (
                              <span className="block text-[10px] text-emerald-700 font-semibold mt-1">
                                ✓ Con acuerdos formalizados
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-[11px]">
                            <div className="text-slate-700 font-medium">
                              Límite: <strong className="font-mono text-slate-900">{c.resolutionDeadline}</strong>
                            </div>
                            <span className="text-[10px] text-teal-700 font-bold">
                              {c.status === 'CERRADA' ? 'Completado' : 'Dentro del término legal'}
                            </span>
                          </td>

                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => setSelectedCaseForDossier(c)}
                              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs mx-auto"
                            >
                              <FolderLock className="w-3.5 h-3.5" />
                              <span>Abrir Expediente</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No se encontraron quejas con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 3: PROCESO ELECTORAL, VOTO SECRETO & ESCRUTINIO */}
      {/* ============================================================== */}
      {activeTab === 'ELECTIONS' && (
        <div className="space-y-5">
          {/* Electoral Banner */}
          <div className="glass-card p-5 rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50/50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-teal-700" />
                <h2 className="text-sm font-black text-slate-900">
                  Proceso de Elección Democrática de Representantes de los Trabajadores
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  cclState.election.isVotingOpen
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}>
                  {cclState.election.isVotingOpen ? 'Urna Electoral Abierta' : 'Escrutinio Cerrado'}
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                Garantiza el <strong>voto secreto, directo y universal</strong> con separación técnica entre la identificación del votante y el contenido del voto. Votación accesible con enlace público independiente sin requerir credenciales en AGAE.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {cclState.election.isVotingOpen && (
                <>
                  <button
                    onClick={() => setIsCandidateModalOpen(true)}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Postular Candidato</span>
                  </button>
                  <button
                    onClick={() => setIsVotingModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Vote className="w-3.5 h-3.5" />
                    <span>Abrir Urna Secreta</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Está seguro de cerrar las votaciones y emitir el escrutinio oficial definitivo?')) {
                        closeCclElection();
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Cerrar Elección
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Candidates and Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cclState.election.candidates.map(candidate => (
              <div
                key={candidate.id}
                className={`glass-card p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  candidate.isElected
                    ? 'border-emerald-300 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      candidate.isElected
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {candidate.isElected ? `Elegido: ${candidate.electedRole}` : 'Candidato'}
                    </span>
                    <span className="font-mono text-sm font-black text-teal-800">
                      {candidate.votesCount} votos
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={candidate.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80'}
                      alt={candidate.workerName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 leading-tight">
                        {candidate.workerName}
                      </h3>
                      <p className="text-[11px] text-slate-500">{candidate.workerPosition}</p>
                      <span className="text-[10px] text-teal-700 font-semibold">{candidate.workerArea}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{candidate.proposalBrief}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] flex items-center justify-between text-slate-500">
                  <span>Habilidad Res. 3461:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verificada</span>
                  </span>
                </div>
              </div>
            ))}

            {/* Voto en Blanco */}
            <div className="glass-card p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                  Opción Democrática
                </span>
                <h3 className="font-bold text-sm text-slate-800 mt-2">Voto en Blanco</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Opción libre de disentimiento conforme a las garantías electorales.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600">Total Votos:</span>
                <span className="text-lg font-black font-mono text-slate-900">{cclState.election.blankVotes}</span>
              </div>
            </div>
          </div>

          {/* Enlace público y auditoría de votación (Simil COPASST) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tarjeta de Enlace Público Electoral */}
            <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 border border-teal-500/30 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <ExternalLink className="w-4 h-4" />
                <span>Página Pública Electoral CCL (Sin Login Requerido)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Los trabajadores pueden votar directamente desde cualquier celular, tablet o estación compartida con solo ingresar su número de cédula. No requieren credenciales ni usuario en AGAE SOLUTIONS.
              </p>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 font-mono text-xs text-teal-300 truncate">
                https://agae.app/elecciones-ccl/{cclState.election.publicVotingUrlToken || 'ccl-2026-voto-directo'}
              </div>
              <button
                type="button"
                onClick={() => {
                  setVotingResultFeedback(null);
                  setVoterDocInput('');
                  setSelectedCandidateId('');
                  setIsVotingModalOpen(true);
                }}
                className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Vote className="w-4 h-4" />
                <span>Abrir Urna de Votación Simil-Pública</span>
              </button>
            </div>

            {/* Auditoría Inmutable del Proceso Electoral */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Control de Participación & Secreto del Voto</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">
                  {cclState.election.voterAuditLog.length} sufragios
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                El sistema valida contra la Base Maestra que cada cédula vote una única vez. La identidad se separa de la papeleta digital para garantizar anonimato total (Res. 3461/2025).
              </p>
              <div className="max-h-32 overflow-y-auto divide-y divide-slate-100 text-[11px] border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                {cclState.election.voterAuditLog.length === 0 ? (
                  <div className="text-center py-3 text-slate-400 italic text-[11px]">
                    No se han registrado sufragios aún.
                  </div>
                ) : (
                  cclState.election.voterAuditLog.map((log, idx) => (
                    <div key={idx} className="py-1 px-1 flex items-center justify-between text-slate-600">
                      <span className="font-mono font-semibold">
                        Doc: {log.voterDocNumber.replace(/(\d{3})\d{3}(\d{3})/, '$1***$2')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.votedAt}</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Votó ✓
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 4: CONFORMACIÓN PARITARIA & DESIGNACIÓN OFICIAL */}
      {/* ============================================================== */}
      {activeTab === 'CONFORMATION' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Conformación Paritaria Oficial del Comité de Convivencia Laboral
              </h2>
              <p className="text-xs text-slate-600">
                Integrantes designados por el empleador y elegidos por los trabajadores (Resolución 3461 de 2025).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEmployerDesignationModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
              >
                Designar Representantes Empleador
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bloque Representantes del Empleador */}
            <div className="glass-card p-4 rounded-xl border border-blue-200 bg-gradient-to-b from-blue-50/20 to-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <span className="font-black text-xs text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>Representantes del Empleador (Designación Directa)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {employerPrincipals.length} Principal / {employerAlternates.length} Suplente
                </span>
              </div>

              {cclState.members.filter(m => m.party === 'EMPLEADOR').map(member => {
                const wrk = getWorker(member.workerId);
                return (
                  <div key={member.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={wrk?.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80'}
                        alt={wrk?.firstName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {formatWorkerName(member.workerId)}
                        </div>
                        <span className="text-[11px] text-slate-500">{wrk?.position}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            member.role === 'PRESIDENTE' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {member.role} ({member.isPrincipal ? 'Principal' : 'Suplente'})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      {member.signedConfidentialityAgreement ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 block">
                          ✓ Confidencialidad Firmada
                        </span>
                      ) : (
                        <button
                          onClick={() => signCclConfidentiality(member.workerId)}
                          className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold"
                        >
                          Firmar Carta Reserva
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bloque Representantes de los Trabajadores */}
            <div className="glass-card p-4 rounded-xl border border-teal-200 bg-gradient-to-b from-teal-50/20 to-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                <span className="font-black text-xs text-teal-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-700" />
                  <span>Representantes de los Trabajadores (Elección Voto Secreto)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                  {workerPrincipals.length} Principal / {workerAlternates.length} Suplente
                </span>
              </div>

              {cclState.members.filter(m => m.party === 'TRABAJADORES').map(member => {
                const wrk = getWorker(member.workerId);
                return (
                  <div key={member.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={wrk?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'}
                        alt={wrk?.firstName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {formatWorkerName(member.workerId)}
                        </div>
                        <span className="text-[11px] text-slate-500">{wrk?.position}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            member.role === 'SECRETARIO' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {member.role} ({member.isPrincipal ? 'Principal' : 'Suplente'})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      {member.signedConfidentialityAgreement ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 block">
                          ✓ Confidencialidad Firmada
                        </span>
                      ) : (
                        <button
                          onClick={() => signCclConfidentiality(member.workerId)}
                          className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold"
                        >
                          Firmar Carta Reserva
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Acta Oficial de Conformación Generada */}
          <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-sm text-slate-900">
                  Acta Oficial de Conformación e Instalación del CCL
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                {cclState.conformationActNumber} • {cclState.conformationActDate}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Generada automáticamente con los datos de {organization.name} (NIT: {organization.nit}), sedes, periodo estatutario de 2 años y designación paritaria bajo los mandatos de la <strong>Resolución 3461 de 2025</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 5: SESIONES ORDINARIAS & EXTRAORDINARIAS */}
      {/* ============================================================== */}
      {activeTab === 'MEETINGS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Sesiones del Comité de Convivencia Laboral
              </h2>
              <p className="text-xs text-slate-600">
                Sesiones ordinarias mensuales (12 actas al año obligatorias) y extraordinarias por situaciones urgentes (Res. 3461/2025).
              </p>
            </div>
            <button
              onClick={() => setIsNewMeetingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Programar Nueva Sesión</span>
            </button>
          </div>

          <div className="space-y-3">
            {cclState.meetings.map(meeting => (
              <div
                key={meeting.id}
                className="glass-card p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                      {meeting.actaCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      meeting.type === 'ORDINARIA' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Sesión {meeting.type}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {meeting.date} a las {meeting.time} ({meeting.modality})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      meeting.isClosed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {meeting.isClosed ? 'Acta Formalizada y Firmada' : 'Pendiente de Firmas'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Resumen de Deliberaciones:</strong> {meeting.discussionSummary}
                </div>

                {/* Signatures status */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-medium">Firmas Paritarias:</span>
                    {meeting.membersSignatures.map(sig => (
                      <span
                        key={sig.workerId}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          sig.signed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                        title={sig.signed ? `Firmado: ${sig.signatureToken}` : 'Pendiente de firma'}
                      >
                        {formatWorkerName(sig.workerId)} {sig.signed ? '✓' : '⏳'}
                      </span>
                    ))}
                  </div>

                  {!meeting.isClosed && (
                    <button
                      onClick={() => signCclMeetingAllMembers(meeting.id)}
                      className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                    >
                      Formalizar Todas las Firmas
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 6: REGLAMENTO & PROTOCOLOS DE LA RES. 3461/2025 */}
      {/* ============================================================== */}
      {activeTab === 'REGULATION' && (
        <div className="space-y-5">
          <div className="glass-card p-4 rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50/50 to-white">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span>Biblioteca de Protocolos Obligatorios & Reglamento Interno</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Instrumentos estandarizados y editables para la organización conforme a los artículos 5, 6, 7 y 8 de la Resolución 3461 de 2025.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cclState.protocols.map(prot => (
              <div
                key={prot.id}
                className="glass-card p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {prot.code}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Versión {prot.version}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 leading-snug">
                    {prot.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-3">
                    {prot.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-teal-700 font-bold">
                    {prot.legalBasis}
                  </span>
                  <button
                    onClick={() => openProtocolViewer(prot)}
                    className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition-colors"
                  >
                    Ver Protocolo
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Reglamento Interno del CCL */}
          <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Reglamento Interno de Funcionamiento del CCL (Editable & Versionado)</span>
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                Versión {cclState.reglamentoVersion}
              </span>
            </div>

            <textarea
              rows={8}
              value={cclState.reglamentoText}
              onChange={(e) => updateCclRegulation(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-teal-500"
            />
            <div className="flex justify-end">
              <button
                onClick={() => showNotification('Reglamento guardado y aprobado para el periodo vigente', 'success')}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Guardar Modificaciones del Reglamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 7: INFORMES MENSUALES, ANUAL & CONEXIÓN SG-SST */}
      {/* ============================================================== */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-5">
          <div className="glass-card p-5 rounded-xl border border-slate-200 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Informes Mensuales & Consolidado Anual del CCL (Res. 3461 de 2025)
                </h2>
                <p className="text-xs text-slate-600">
                  Reportes estadísticos agregados mensuales sin revelación de datos sensibles ni identidades privadas.
                </p>
              </div>
              <button
                onClick={() => showNotification('Informe mensual exportado en PDF institucional con sellos de confidencialidad', 'success')}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Informe Mensual</span>
              </button>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Solicitudes</span>
                <div className="text-2xl font-black text-slate-900 font-mono mt-1">{totalComplaints}</div>
                <span className="text-[11px] text-slate-600">Año 2026 acumulado</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Concertación en Diálogo</span>
                <div className="text-2xl font-black text-emerald-700 font-mono mt-1">100%</div>
                <span className="text-[11px] text-emerald-800">Cero casos remitidos a Mintrabajo</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Compromisos Acordados</span>
                <div className="text-2xl font-black text-teal-800 font-mono mt-1">{totalCommitments}</div>
                <span className="text-[11px] text-teal-900">{completedCommitments} verificados cumplidos</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Sesiones Ordinarias</span>
                <div className="text-2xl font-black text-blue-700 font-mono mt-1">{cclState.meetings.length}</div>
                <span className="text-[11px] text-blue-900">Quórum paritario 100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: RADICACIÓN DE NUEVA QUEJA / SOLICITUD CONFIDENCIAL */}
      {/* ============================================================== */}
      {isNewComplaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-base text-slate-900">
                  Radicación de Queja / Solicitud Confidencial de Convivencia
                </h3>
              </div>
              <button
                onClick={() => setIsNewComplaintModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-4 text-xs">
              {/* Advertencia Legal Obligatoria */}
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-[11px] space-y-1">
                <strong>Garantías del Comité (Resolución 3461 de 2025):</strong>
                <p>
                  Esta solicitud será tramitada bajo <strong>estricta reserva y debida custodia</strong>. El Comité no tiene funciones judiciales ni punitivas; propende por el diálogo, la concertación imparcial y la prevención de afectaciones al clima laboral.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Canal de Recepción</label>
                  <select
                    value={newComplaintData.channel}
                    onChange={(e) => setNewComplaintData({ ...newComplaintData, channel: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold"
                  >
                    <option value="CANAL_CONFIDENCIAL">Canal Digital Seguro AGAE</option>
                    <option value="FORMULARIO_INTERNO">Formulario Interno Institucional</option>
                    <option value="REGISTRO_SECRETARIA">Registro Manual por Secretaría</option>
                    <option value="CORREO_ELECTRONICO">Correo Institucional del Comité</option>
                    <option value="BUZON_FISICO">Buzón Físico de Convivencia</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lugar de los Hechos</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sede Fontibón / Patio de Despacho"
                    value={newComplaintData.incidentLocation}
                    onChange={(e) => setNewComplaintData({ ...newComplaintData, incidentLocation: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Persona que presenta la queja (Base Maestra)
                  </label>
                  <select
                    required
                    value={newComplaintData.complainantWorkerId}
                    onChange={(e) => setNewComplaintData({ ...newComplaintData, complainantWorkerId: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800"
                  >
                    <option value="">-- Seleccionar Trabajador --</option>
                    {workers.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.firstName} {w.lastName} ({w.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Persona señalada en la queja (Base Maestra)
                  </label>
                  <select
                    required
                    value={newComplaintData.respondentWorkerId}
                    onChange={(e) => setNewComplaintData({ ...newComplaintData, respondentWorkerId: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800"
                  >
                    <option value="">-- Seleccionar Trabajador --</option>
                    {workers.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.firstName} {w.lastName} ({w.position})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fechas o Periodo de Ocurrencia</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Enero y febrero de 2026, jornada de la mañana"
                  value={newComplaintData.incidentDates}
                  onChange={(e) => setNewComplaintData({ ...newComplaintData, incidentDates: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción Objetiva de los Hechos</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describa de forma detallada, cronológica y objetiva las presuntas conductas o situaciones que afectan la convivencia laboral..."
                  value={newComplaintData.factsDescription}
                  onChange={(e) => setNewComplaintData({ ...newComplaintData, factsDescription: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Testigos o Personas con Conocimiento (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. Personal operativo de turno en el área de cargue"
                  value={newComplaintData.witnessesText}
                  onChange={(e) => setNewComplaintData({ ...newComplaintData, witnessesText: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newComplaintData.acceptedTerms}
                    onChange={(e) => setNewComplaintData({ ...newComplaintData, acceptedTerms: e.target.checked })}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-[11px] text-slate-700">
                    Declaro bajo gravedad de juramento que la información suministrada es veraz y autorizo su tratamiento exclusivo para los fines de conciliación y prevención laboral del Comité de Convivencia Laboral, garantizándose la reserva legal establecida en la Resolución 3461 de 2025.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewComplaintModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20"
                >
                  Radicar Caso Confidencial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EXPEDIENTE DIGITAL CONFIDENCIAL 360° */}
      {/* ============================================================== */}
      {selectedCaseForDossier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl border border-slate-300 max-h-[92vh] overflow-y-auto">
            
            {/* Header del Expediente */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FolderLock className="w-5 h-5 text-teal-600" />
                  <h3 className="font-black text-lg text-slate-900">
                    Expediente Digital Confidencial: {selectedCaseForDossier.code}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                    {selectedCaseForDossier.confidentialityLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Radicado el {selectedCaseForDossier.filingDate} • Canal: {selectedCaseForDossier.channel.replace(/_/g, ' ')} • Control de Plazo: {selectedCaseForDossier.resolutionDeadline}
                </p>
              </div>

              <button
                onClick={() => setSelectedCaseForDossier(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Partes Involucradas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Persona que Radica (Parte A)</span>
                <div className="font-bold text-xs text-slate-900">
                  {formatWorkerName(selectedCaseForDossier.complainantWorkerId)}
                </div>
                <div className="text-[11px] text-slate-500">
                  {getWorker(selectedCaseForDossier.complainantWorkerId)?.position} • {getWorker(selectedCaseForDossier.complainantWorkerId)?.area}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Persona Señalada (Parte B)</span>
                <div className="font-bold text-xs text-slate-900">
                  {formatWorkerName(selectedCaseForDossier.respondentWorkerId)}
                </div>
                <div className="text-[11px] text-slate-500">
                  {getWorker(selectedCaseForDossier.respondentWorkerId)?.position} • {getWorker(selectedCaseForDossier.respondentWorkerId)?.area}
                </div>
              </div>
            </div>

            {/* Hechos y Ubicación */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Lugar: <strong>{selectedCaseForDossier.incidentLocation}</strong></span>
                <span>Ocurrencia: <strong>{selectedCaseForDossier.incidentDates}</strong></span>
              </div>
              <p className="text-slate-800 leading-relaxed italic">
                "{selectedCaseForDossier.factsDescription}"
              </p>
            </div>

            {/* Etapas del Proceso y Acciones */}
            <div className="space-y-3">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wide">
                Gestión y Actuaciones del Expediente
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Transición de Etapa */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block">Avanzar Etapa Procesal:</span>
                  <select
                    value={selectedCaseForDossier.status}
                    onChange={(e) => {
                      updateCclComplaintStage(selectedCaseForDossier.id, e.target.value as any);
                      setSelectedCaseForDossier({
                        ...selectedCaseForDossier,
                        status: e.target.value as any
                      });
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-800 bg-white"
                  >
                    <option value="RECIBIDA">1. Recibida</option>
                    <option value="RADICADA">2. Radicada</option>
                    <option value="EXAMEN_CONFIDENCIAL">3. En Examen Confidencial</option>
                    <option value="PENDIENTE_ESCUCHA">4. Pendiente de Escucha de Partes</option>
                    <option value="DIALOGO_CONCERTACION">5. En Diálogo / Concertación</option>
                    <option value="PLAN_MEJORA">6. Plan de Mejora / Compromisos</option>
                    <option value="EN_SEGUIMIENTO">7. En Seguimiento Periódico</option>
                    <option value="CERRADA">8. Cerrada</option>
                    <option value="REMITIDA">9. Remitida</option>
                    <option value="ARCHIVADA_RESERVA">10. Archivada bajo Reserva</option>
                  </select>
                </div>

                {/* Registrar Audiencia de Escucha */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block">Registrar Escucha de Partes:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const notes = prompt('Ingrese las declaraciones de la Parte A (Quejoso):');
                        if (notes) {
                          recordCclHearing(selectedCaseForDossier.id, 'complainant', {
                            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                            attendees: ['Secretaria CCL', 'Presidente CCL'],
                            summaryNotes: notes,
                            signedConfidentiality: true,
                            recordedBy: 'Secretaría del CCL'
                          });
                        }
                      }}
                      className="flex-1 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold border border-teal-200"
                    >
                      Parte A
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt('Ingrese las declaraciones de la Parte B (Señalado):');
                        if (notes) {
                          recordCclHearing(selectedCaseForDossier.id, 'respondent', {
                            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                            attendees: ['Secretaria CCL', 'Presidente CCL'],
                            summaryNotes: notes,
                            signedConfidentiality: true,
                            recordedBy: 'Secretaría del CCL'
                          });
                        }
                      }}
                      className="flex-1 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200"
                    >
                      Parte B
                    </button>
                  </div>
                </div>

                {/* Agregar Compromiso */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block">Compromiso de Mejora:</span>
                  <button
                    onClick={() => {
                      const desc = prompt('Descripción del compromiso concertado:');
                      if (desc) {
                        addCclCommitment(selectedCaseForDossier.id, {
                          description: desc,
                          responsibleWorkerId: selectedCaseForDossier.respondentWorkerId,
                          responsibleName: formatWorkerName(selectedCaseForDossier.respondentWorkerId),
                          dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
                          expectedEvidence: 'Verificación por el CCL en sesión de seguimiento'
                        });
                      }
                    }}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                  >
                    + Nuevo Compromiso
                  </button>
                </div>
              </div>
            </div>

            {/* Línea de Tiempo de Trazabilidad */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <History className="w-4 h-4 text-teal-600" />
                <span>Línea de Tiempo del Expediente (Trazabilidad Inmutable)</span>
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedCaseForDossier.timeline.map((entry, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-start gap-2.5">
                    <span className="p-1 rounded-full bg-teal-100 text-teal-800 mt-0.5 shrink-0">
                      <Clock className="w-3 h-3" />
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{entry.action}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">{entry.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{entry.notes}</p>
                      <span className="text-[10px] text-slate-400 block">Responsable: {entry.responsible}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cierre Formal y Conexión con ACPM */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-700">
                <strong>¿El caso ha concluido el plan de mejora o conciliación?</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  El cierre formal archivará el expediente bajo estricta reserva y puede generar una recomendación institucional preventiva en ACPM.
                </p>
              </div>

              <button
                onClick={() => {
                  const summary = prompt('Ingrese el balance final de cierre del expediente:');
                  if (summary) {
                    closeCclComplaint(selectedCaseForDossier.id, {
                      reason: 'CONCILIACION_EXITOSA',
                      summary,
                      generateAcpmAction: true,
                      acpmDescription: 'Talleres preventivos institucionales sobre relaciones interpersonales y comunicación en la operación.'
                    });
                    setSelectedCaseForDossier(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors shrink-0"
              >
                Cerrar Caso & Archivar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* MODAL 3: URNA ELECTORAL SECRETA (SIN LOGIN REQUERIDO) */}
      {/* ============================================================== */}
      {isVotingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-300 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
                  <Vote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 leading-tight">
                    Urna Electrónica de Votación CCL
                  </h3>
                  <p className="text-[11px] text-teal-700 font-semibold">
                    Acceso Democrático Directo • Sin Login Requerido
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVotingModalOpen(false);
                  setVotingResultFeedback(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCastVote} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200 text-teal-900 text-[11px] leading-relaxed">
                <strong>Garantía de Voto Secreto (Res. 3461 de 2025):</strong>
                <p>
                  Ingrese únicamente su cédula. El sistema valida contra el censo activo que usted sea colaborador habilitado y registre un solo sufragio. Su elección es 100% confidencial y secreta.
                </p>
              </div>

              {/* Input Cédula / Documento */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Ingrese su Número de Cédula o Documento de Identidad:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 1020784952 o 79654120"
                  value={voterDocInput}
                  onChange={(e) => {
                    setVoterDocInput(e.target.value);
                    if (votingResultFeedback) setVotingResultFeedback(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-sm text-slate-900 font-bold focus:outline-none focus:border-teal-600 focus:bg-white transition-all shadow-inner"
                />
                <span className="text-[10px] text-slate-500 block">
                  * Solo para control de voto único. Su papeleta digital se desvincula de su identidad.
                </span>
              </div>

              {/* Banner de Verificación en Tiempo Real del Votante */}
              {hasAlreadyVoted ? (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <strong className="block text-rose-950 font-bold">Sufragio Ya Registrado</strong>
                    <span>
                      El titular de la cédula ({detectedVoter ? `${detectedVoter.firstName} ${detectedVoter.lastName}` : cleanVoterDoc}) ya depositó su voto en esta elección. No se permiten sufragios duplicados.
                    </span>
                  </div>
                </div>
              ) : detectedVoter ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-3 animate-in fade-in">
                  <img
                    src={detectedVoter.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                    alt={detectedVoter.firstName}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-emerald-300 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-xs text-emerald-950 flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{detectedVoter.firstName} {detectedVoter.lastName}</span>
                    </div>
                    <div className="text-[11px] text-emerald-800 font-medium truncate mt-0.5">
                      {detectedVoter.position} • {detectedVoter.area}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wide">
                      Censo Activo Habilitado ✓
                    </div>
                  </div>
                </div>
              ) : cleanVoterDoc.length >= 6 ? (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Documento no encontrado en el censo activo de colaboradores de <strong>{organization.name}</strong>. Por favor verifique el número ingresado.
                  </span>
                </div>
              ) : null}

              {/* Lista de Candidatos para Votar */}
              <div className="space-y-2 pt-1">
                <label className="font-bold text-slate-800 block text-xs">
                  Seleccione al Candidato por quien desea Votar:
                </label>

                <div className="space-y-2.5 max-h-64 overflow-y-auto p-1">
                  {cclState.election.candidates.map(candidate => {
                    const isSelected = selectedCandidateId === candidate.id;
                    const candWorker = workers.find(w => w.id === candidate.workerId);

                    return (
                      <div
                        key={candidate.id}
                        onClick={() => setSelectedCandidateId(candidate.id)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="candidateVote"
                          value={candidate.id}
                          checked={isSelected}
                          onChange={() => setSelectedCandidateId(candidate.id)}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500 mt-1 shrink-0"
                        />
                        <img
                          src={candidate.photoUrl || candWorker?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80'}
                          alt={candidate.workerName}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-black text-xs text-slate-900 leading-tight">
                            {candidate.workerName}
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium">
                            {candidate.workerPosition} • <span className="text-teal-700 font-semibold">{candidate.workerArea}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-slate-600 italic bg-slate-100/70 p-1.5 rounded-lg border border-slate-200/50 line-clamp-2">
                            "{candidate.proposalBrief}"
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Tarjeta Voto en Blanco */}
                  <div
                    onClick={() => setSelectedCandidateId('BLANCO')}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedCandidateId === 'BLANCO'
                        ? 'bg-teal-50 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="candidateVote"
                      value="BLANCO"
                      checked={selectedCandidateId === 'BLANCO'}
                      onChange={() => setSelectedCandidateId('BLANCO')}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500 shrink-0"
                    />
                    <div className="w-11 h-11 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      BLANCO
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900">Voto en Blanco</div>
                      <div className="text-[11px] text-slate-500">
                        Opción democrática libre conforme a las garantías electorales (Res. 3461/2025).
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje de Feedback */}
              {votingResultFeedback && (
                <div className={`p-3 rounded-xl border text-xs font-bold ${
                  votingResultFeedback.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}>
                  {votingResultFeedback.message}
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsVotingModalOpen(false);
                    setVotingResultFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={hasAlreadyVoted || !cleanVoterDoc || !selectedCandidateId || (cleanVoterDoc.length >= 6 && !detectedVoter)}
                  className={`px-5 py-2 rounded-xl text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all ${
                    hasAlreadyVoted || !cleanVoterDoc || !selectedCandidateId || (cleanVoterDoc.length >= 6 && !detectedVoter)
                      ? 'bg-slate-400 cursor-not-allowed opacity-60'
                      : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
                  }`}
                >
                  <Vote className="w-4 h-4" />
                  <span>Depositar Voto Secreto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: POSTULACIÓN CON VALIDACIÓN DE INHABILIDAD */}
      {/* ============================================================== */}
      {isCandidateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-base text-slate-900">
                  Postulación de Representante de los Trabajadores
                </h3>
              </div>
              <button
                onClick={() => setIsCandidateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterCandidate} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-[11px]">
                <strong>Regla de Elegibilidad e Inhabilidad (Res. 3461 de 2025):</strong>
                <p>
                  El sistema validará confidencialmente que la persona postulada no tenga quejas de acoso laboral formuladas en su contra ni haya sido víctima de acoso laboral en el último año.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Trabajador a Postular (Base Maestra)
                </label>
                <select
                  required
                  value={candidateWorkerId}
                  onChange={(e) => {
                    setCandidateWorkerId(e.target.value);
                    setCandidateValidationWarning(null);
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold"
                >
                  <option value="">-- Seleccionar Trabajador --</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.firstName} {w.lastName} - {w.position} ({w.area})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Propuesta o Mensaje de Convivencia para Publicación
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej. Compromiso con el diálogo respetuoso, la mediación pacífica y la escucha imparcial..."
                  value={candidateProposal}
                  onChange={(e) => setCandidateProposal(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>

              {candidateValidationWarning && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
                  {candidateValidationWarning}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCandidateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20"
                >
                  Validar & Postular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: DESIGNACIÓN DE REPRESENTANTES DEL EMPLEADOR */}
      {/* ============================================================== */}
      {isEmployerDesignationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-base text-slate-900">
                  Designación de Representantes del Empleador
                </h3>
              </div>
              <button
                onClick={() => setIsEmployerDesignationModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployerReps} className="space-y-4 text-xs">
              <p className="text-slate-600 text-xs">
                Seleccione de la Base Maestra los colaboradores que la Gerencia General designa directamente como voceros principales y suplentes.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Representante Principal del Empleador
                </label>
                <select
                  required
                  value={empPrincipalId}
                  onChange={(e) => setEmpPrincipalId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800"
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
                <label className="font-bold text-slate-700 block mb-1">
                  Representante Suplente del Empleador
                </label>
                <select
                  required
                  value={empAlternateId}
                  onChange={(e) => setEmpAlternateId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                >
                  <option value="">-- Seleccionar Trabajador --</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.firstName} {w.lastName} - {w.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEmployerDesignationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  Guardar Designación Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: PROGRAMAR NUEVA SESIÓN ORDINARIA / EXTRAORDINARIA */}
      {/* ============================================================== */}
      {isNewMeetingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-base text-slate-900">
                  Programar Sesión del CCL (Res. 3461 de 2025)
                </h3>
              </div>
              <button
                onClick={() => setIsNewMeetingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Sesión</label>
                  <select
                    value={newMeetingData.type}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, type: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="ORDINARIA">Ordinaria (Mensual - 12 al año)</option>
                    <option value="EXTRAORDINARIA">Extraordinaria (Urgente)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modalidad</label>
                  <select
                    value={newMeetingData.modality}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, modality: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="HIBRIDA">Híbrida</option>
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="VIRTUAL">Virtual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newMeetingData.date}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, date: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={newMeetingData.time}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, time: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lugar o Enlace Seguro</label>
                <input
                  type="text"
                  required
                  value={newMeetingData.locationOrLink}
                  onChange={(e) => setNewMeetingData({ ...newMeetingData, locationOrLink: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Puntos del Orden del Día</label>
                <textarea
                  rows={3}
                  value={newMeetingData.agendaTopics.join('\n')}
                  onChange={(e) => setNewMeetingData({ ...newMeetingData, agendaTopics: e.target.value.split('\n') })}
                  className="w-full p-2 rounded-lg border border-slate-300 leading-relaxed font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewMeetingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20"
                >
                  Convocar & Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 7: VISOR Y EDITOR ESTRUCTURADO DE PROTOCOLOS (RES. 3461/2025) */}
      {/* ============================================================== */}
      {selectedProtocolForView && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-7 space-y-5 shadow-2xl border border-slate-300 max-h-[92vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-800 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-300">
                      {selectedProtocolForView.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Versión {selectedProtocolForView.version} • {selectedProtocolForView.updatedAt}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 leading-tight mt-0.5">
                    {selectedProtocolForView.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingProtocol(!isEditingProtocol)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors border ${
                    isEditingProtocol
                      ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingProtocol ? 'Cancelar Edición' : 'Editar Protocolo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / PDF</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProtocolForView(null);
                    setIsEditingProtocol(false);
                  }}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MODO EDICIÓN ACTIVO */}
            {isEditingProtocol ? (
              <form onSubmit={handleSaveProtocolEdits} className="space-y-4 text-xs animate-in fade-in">
                <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-center gap-2 text-amber-900">
                  <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Modo de Edición Activo:</strong> Puede ajustar el articulado, plazos, canales o responsabilidades conforme a las particularidades de la organización. Al guardar se generará automáticamente una nueva versión oficial del documento.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Título del Protocolo</label>
                    <input
                      type="text"
                      required
                      value={editProtocolTitle}
                      onChange={(e) => setEditProtocolTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Marco Jurídico / Base Legal</label>
                    <input
                      type="text"
                      required
                      value={editProtocolBasis}
                      onChange={(e) => setEditProtocolBasis(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Descripción / Alcance</label>
                  <textarea
                    rows={2}
                    required
                    value={editProtocolDesc}
                    onChange={(e) => setEditProtocolDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 leading-relaxed focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Cuerpo Normativo Estructurado del Protocolo (Articulado, Procedimiento y Firmas)
                  </label>
                  <textarea
                    rows={15}
                    required
                    value={editProtocolContent}
                    onChange={(e) => setEditProtocolContent(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-800 leading-relaxed focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsEditingProtocol(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Descartar Edición
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios & Nueva Versión</span>
                  </button>
                </div>
              </form>
            ) : (
              /* MODO VISOR ESTRUCTURADO IMPRIMIBLE / PDF */
              <div id="printable-ccl-protocol" className="space-y-6 text-xs text-slate-800 bg-white">
                {/* Estilos para impresión PDF nítida */}
                <style>{`
                  @media print {
                    body * {
                      visibility: hidden;
                    }
                    #printable-ccl-protocol, #printable-ccl-protocol * {
                      visibility: visible;
                    }
                    #printable-ccl-protocol {
                      position: fixed;
                      left: 0;
                      top: 0;
                      width: 100%;
                      height: auto;
                      margin: 0;
                      padding: 15mm 20mm;
                      background: white !important;
                      color: #000 !important;
                      font-size: 10.5pt !important;
                      line-height: 1.5 !important;
                      z-index: 999999;
                    }
                    .no-print {
                      display: none !important;
                    }
                  }
                `}</style>

                {/* Membrete Institucional Oficial */}
                <div className="border-2 border-slate-800 rounded-xl overflow-hidden shadow-xs">
                  <div className="grid grid-cols-12 divide-y md:divide-y-0 md:divide-x-2 divide-slate-800 bg-slate-50/50">
                    <div className="col-span-12 md:col-span-3 p-3 flex flex-col items-center justify-center text-center bg-white">
                      <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-sm mb-1">
                        AGAE
                      </div>
                      <span className="font-black text-xs text-slate-900 uppercase tracking-tight">
                        {organization.name}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">
                        NIT: {organization.nit}
                      </span>
                    </div>

                    <div className="col-span-12 md:col-span-6 p-3 flex flex-col items-center justify-center text-center">
                      <span className="font-bold text-[11px] text-slate-600 uppercase tracking-wider">
                        SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)
                      </span>
                      <h2 className="font-black text-sm text-slate-900 uppercase mt-0.5">
                        COMITÉ DE CONVIVENCIA LABORAL (CCL)
                      </h2>
                      <span className="text-[11px] text-teal-800 font-extrabold uppercase mt-0.5">
                        {selectedProtocolForView.title}
                      </span>
                    </div>

                    <div className="col-span-12 md:col-span-3 p-3 text-[10px] space-y-1 bg-white font-mono flex flex-col justify-center">
                      <div><strong className="text-slate-900">CÓDIGO:</strong> {selectedProtocolForView.code}</div>
                      <div><strong className="text-slate-900">VERSIÓN:</strong> {selectedProtocolForView.version}</div>
                      <div><strong className="text-slate-900">FECHA:</strong> {selectedProtocolForView.updatedAt}</div>
                      <div><strong className="text-slate-900">ESTADO:</strong> VIGENTE ✓</div>
                    </div>
                  </div>
                </div>

                {/* Ficha Técnica y Marco Jurídico */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Marco Normativo Aplicable:</span>
                    <strong className="text-teal-900 font-bold">{selectedProtocolForView.legalBasis}</strong>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Alcance Institucional:</span>
                    <span className="text-slate-700">{selectedProtocolForView.description}</span>
                  </div>
                </div>

                {/* Cuerpo del Protocolo Estructurado */}
                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-inner">
                  <div className="prose prose-slate max-w-none text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-800">
                    {selectedProtocolForView.contentTemplate}
                  </div>
                </div>

                {/* Bloque Oficial de Firmas y Validación Institucional */}
                <div className="pt-6 border-t-2 border-slate-300 space-y-4">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-600">
                    CONSTANCIA DE APROBACIÓN, FIRMAS Y ADOPCIÓN OFICIAL
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3">
                    <div className="border-t border-slate-700 pt-2 text-center space-y-0.5">
                      <div className="font-serif italic text-sm text-teal-900">Mariana Restrepo Morales</div>
                      <div className="font-black text-[11px] text-slate-900">Mariana Restrepo Morales</div>
                      <div className="text-[10px] text-slate-600 font-semibold">Presidente(a) del CCL</div>
                      <div className="text-[9px] text-emerald-700 font-mono">Firma Digital Verificada ✓</div>
                    </div>

                    <div className="border-t border-slate-700 pt-2 text-center space-y-0.5">
                      <div className="font-serif italic text-sm text-teal-900">Sandra Milena Gómez</div>
                      <div className="font-black text-[11px] text-slate-900">Sandra Milena Gómez</div>
                      <div className="text-[10px] text-slate-600 font-semibold">Secretaria del CCL</div>
                      <div className="text-[9px] text-emerald-700 font-mono">Firma Digital Verificada ✓</div>
                    </div>

                    <div className="border-t border-slate-700 pt-2 text-center space-y-0.5">
                      <div className="font-serif italic text-sm text-teal-900">Fernando Ortiz Salazar</div>
                      <div className="font-black text-[11px] text-slate-900">Fernando Ortiz Salazar</div>
                      <div className="text-[10px] text-slate-600 font-semibold">Representante Legal / Gerencia</div>
                      <div className="text-[9px] text-emerald-700 font-mono">Adopción SG-SST Aprobada ✓</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
