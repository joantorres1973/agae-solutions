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
  ShieldCheck,
  FileText,
  Calendar,
  CheckCircle,
  CheckCircle2,
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
  Edit3,
  Upload,
  PenTool,
  Save,
  CheckSquare,
  Square,
  GraduationCap,
  Paperclip,
  FileCheck
} from 'lucide-react';

// Orden del Día Oficial y Estatutario predeterminado según Decreto 1072/2015 y Resolución 2013/1986
export const STATUTORY_AGENDA_ITEMS = [
  {
    pointNumber: 1,
    title: '1. Verificación del quórum reglamentario y llamado a lista',
    defaultNotes: 'Se constata la asistencia paritaria requerida para deliberar y decidir válidamente conforme a la Resolución 2013 de 1986 y el Decreto 1072 de 2015. Quórum verificado y completo con presencia de delegados de ambas partes.'
  },
  {
    pointNumber: 2,
    title: '2. Lectura, revisión y aprobación del acta anterior',
    defaultNotes: 'Se da lectura al acta de la reunión ordinaria anterior, la cual es aprobada formalmente y sin objeciones por la totalidad de los comisionados.'
  },
  {
    pointNumber: 3,
    title: '3. Seguimiento a compromisos pendientes y plan de trabajo anual',
    defaultNotes: 'Revisión y balance de ejecución de las tareas y compromisos asignados en la sesión previa. Se constata cumplimiento de actividades programadas según el cronograma.'
  },
  {
    pointNumber: 4,
    title: '4. Análisis de estadísticas de accidentalidad, incidentes e incapacidades del periodo',
    defaultNotes: 'La coordinación de SST presenta el consolidado mensual de eventos de salud, primeros auxilios, incidentes de trabajo y tasa de ausentismo del mes anterior.'
  },
  {
    pointNumber: 5,
    title: '5. Informes de inspecciones de seguridad, condiciones inseguras y gestión de EPP',
    defaultNotes: 'Socialización de resultados de las inspecciones planeadas de puestos de trabajo, áreas locativas, equipos contra incendios y uso adecuado de EPP.'
  },
  {
    pointNumber: 6,
    title: '6. Solicitudes de los trabajadores, sugerencias de prevención y nuevos riesgos',
    defaultNotes: 'Revisión de inquietudes formuladas por los trabajadores y evaluación de condiciones de trabajo seguras reportadas en los canales de comunicación interna.'
  },
  {
    pointNumber: 7,
    title: '7. Proposiciones y varios',
    defaultNotes: 'Espacio para temas varios propuestos por los delegados del empleador o de los trabajadores para el fortalecimiento del SG-SST.'
  },
  {
    pointNumber: 8,
    title: '8. Conclusiones, asignación de compromisos y fecha de la próxima sesión ordinaria',
    defaultNotes: 'Asignación formal de compromisos específicos con responsable y fecha límite, y fijación concertada de la fecha y hora de la siguiente reunión ordinaria.'
  }
];

interface CopasstVigiaModuleProps {
  initialTab?: 'DASHBOARD' | 'VIGIA' | 'ELECTION' | 'CONFORMATION' | 'MEETINGS' | 'FINDINGS' | 'TRAININGS' | 'DOCUMENTS';
}

export const CopasstVigiaModule: React.FC<CopasstVigiaModuleProps> = ({ initialTab }) => {
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
    updateCopasstMeeting,
    signMeetingMember,
    signMeetingAllMembers,
    uploadScannedMeetingAct,
    updateCopasstDocumentNotes,
    toggleCopasstCommitmentStatus,
    createCopasstFinding,
    addCopasstTraining,
    showNotification,
    setActiveTab: setGlobalActiveTab
  } = useApp();

  // Subpestañas del módulo
  const [activeTab, setActiveTab] = useState<
    'DASHBOARD' | 'VIGIA' | 'ELECTION' | 'CONFORMATION' | 'MEETINGS' | 'FINDINGS' | 'TRAININGS' | 'DOCUMENTS'
  >(initialTab || 'DASHBOARD');

  // Sincronizar subpestaña si viene desde fuera (ej: Estándar 1.1.7 hacia TRAININGS)
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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

  // Modo edición de actas y documentos oficiales (Requisito legal: totalmente editable)
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [editableDocText, setEditableDocText] = useState('');
  const [editableMeetingDiscussion, setEditableMeetingDiscussion] = useState('');
  const [editableMeetingCustomObs, setEditableMeetingCustomObs] = useState('');
  const [editableMeetingRecommendations, setEditableMeetingRecommendations] = useState('');
  const [editableMeetingDecisions, setEditableMeetingDecisions] = useState('');

  // Formulario de votación pública secreta
  const [voterDocInput, setVoterDocInput] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');

  // Formulario de nuevo candidato
  const [newCandidateWorkerId, setNewCandidateWorkerId] = useState('');
  const [newCandidateProposal, setNewCandidateProposal] = useState('');

  // Formulario de representantes del empleador
  const [employerPrincipalId, setEmployerPrincipalId] = useState(copasstState.members.find(m => m.party === 'EMPLEADOR' && m.role === 'PRESIDENTE')?.workerId || '');
  const [employerSuplenteId, setEmployerSuplenteId] = useState(copasstState.members.find(m => m.party === 'EMPLEADOR' && m.role === 'SUPLENTE')?.workerId || '');

  // Formulario de nueva reunión ordinaria con Orden del Día Predeterminado y Estructurado
  const [newMeetingDate, setNewMeetingDate] = useState(new Date().toISOString().substring(0, 10));
  const [newMeetingTime, setNewMeetingTime] = useState('09:00 AM');
  const [newMeetingModality, setNewMeetingModality] = useState<'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA'>('PRESENCIAL');
  const [newMeetingLocation, setNewMeetingLocation] = useState('Sala de Juntas Principal Fontibón');
  const [newMeetingDiscussion, setNewMeetingDiscussion] = useState('');
  const [newMeetingAttendees, setNewMeetingAttendees] = useState<string[]>(copasstState.members.map(m => m.workerId));
  const [newMeetingAbsenteesJustified, setNewMeetingAbsenteesJustified] = useState('');
  const [meetingAgendaItems, setMeetingAgendaItems] = useState(STATUTORY_AGENDA_ITEMS.map(item => ({
    pointNumber: item.pointNumber,
    title: item.title,
    notes: item.defaultNotes
  })));
  const [activeAgendaPoint, setActiveAgendaPoint] = useState(1);
  const [newMeetingCustomObservations, setNewMeetingCustomObservations] = useState('');
  const [newMeetingRecommendations, setNewMeetingRecommendations] = useState('');
  const [newMeetingDecisions, setNewMeetingDecisions] = useState('');

  // Compromisos temporales para la reunión
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

  // Formulario de capacitación con carga real de evidencia (Estándar 1.1.7)
  const [newTrainingTopic, setNewTrainingTopic] = useState('Investigación de Accidentes de Trabajo según Resolución 1401 de 2007');
  const [newTrainingEntity, setNewTrainingEntity] = useState('ARL Sura Consultoría Especializada');
  const [newTrainingDate, setNewTrainingDate] = useState(new Date().toISOString().substring(0, 10));
  const [newTrainingHours, setNewTrainingHours] = useState(4);
  const [newTrainingAttendees, setNewTrainingAttendees] = useState<string[]>(copasstState.members.map(m => m.workerId));
  const [newTrainingNotes, setNewTrainingNotes] = useState('');
  const [newTrainingEvidenceFile, setNewTrainingEvidenceFile] = useState<{
    name: string;
    size: string;
    base64: string;
    type: string;
  } | null>(null);
  const trainingFileInputRef = React.useRef<HTMLInputElement>(null);

  // Custodia de acta física escaneada
  const scannedActFileInputRef = React.useRef<HTMLInputElement>(null);
  const [scannedActTargetMeetingId, setScannedActTargetMeetingId] = useState<string | null>(null);

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

  // Sincronizar estados de edición cuando cambia el documento seleccionado
  React.useEffect(() => {
    if (selectedMeetingForDoc) {
      setEditableMeetingDiscussion(selectedMeetingForDoc.discussionSummary || '');
      setEditableMeetingCustomObs(selectedMeetingForDoc.customObservations || '');
      setEditableMeetingRecommendations((selectedMeetingForDoc.recommendations || []).join('\n'));
      setEditableMeetingDecisions((selectedMeetingForDoc.decisions || []).join('\n'));
    }
  }, [selectedMeetingForDoc]);

  React.useEffect(() => {
    if (selectedDocumentToView === 'CONFORMATION') {
      setEditableDocText(copasstState.conformationActNotes || '');
    } else if (selectedDocumentToView === 'INSTALLATION') {
      setEditableDocText(copasstState.installationActNotes || '');
    } else if (selectedDocumentToView === 'ELECTION_RESULTS') {
      setEditableDocText(copasstState.electionActNotes || '');
    } else if (selectedDocumentToView === 'VIGIA_DESIGNATION') {
      setEditableDocText(copasstState.vigiaDesignationNotes || '');
    }
  }, [selectedDocumentToView, copasstState]);

  // Manejador de nueva reunión ordinaria con Orden del Día Predeterminado y Firmas de Todo el COPASST
  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();

    const meetingCommitments: Omit<CopasstMeetingCommitment, 'id' | 'meetingId'>[] = tempCommitments.map(c => ({
      description: c.desc,
      responsibleWorkerId: c.respId,
      responsibleName: c.respName,
      dueDate: c.dueDate,
      status: 'PENDIENTE'
    }));

    // Inicializar firmas para TODOS los miembros del comité
    const allMembersSignatures = copasstState.members.map(member => {
      const w = workers.find(wrk => wrk.id === member.workerId);
      const isPresident = member.role === 'PRESIDENTE';
      return {
        workerId: member.workerId,
        memberName: w ? `${w.firstName} ${w.lastName}` : 'Miembro COPASST',
        role: member.role,
        party: member.party,
        docNumber: w ? `${w.docType} ${w.docNumber}` : undefined,
        signed: isPresident,
        signedAt: isPresident ? new Date().toISOString().replace('T', ' ').substring(0, 19) : undefined,
        signatureToken: isPresident ? `SIG-COP-${member.workerId.slice(-4)}-${Date.now().toString(36).toUpperCase()}` : undefined
      };
    });

    const parsedRecommendations = newMeetingRecommendations.trim()
      ? newMeetingRecommendations.split('\n').filter(r => r.trim().length > 0)
      : [
          'Mantener actualizadas las listas de chequeo de inspecciones locativas.',
          'Hacer seguimiento al cierre de las acciones correctivas pendientes en la Matriz ACPM.'
        ];

    const parsedDecisions = newMeetingDecisions.trim()
      ? newMeetingDecisions.split('\n').filter(d => d.trim().length > 0)
      : [
          'Aprobar el informe de actividades y programar la siguiente sesión ordinaria para dentro de 30 días.'
        ];

    // Síntesis del desarrollo: si se ingresó texto general, se usa; de lo contrario, se concatenan los 8 puntos
    const finalDiscussion = newMeetingDiscussion.trim()
      ? newMeetingDiscussion
      : meetingAgendaItems.map(item => `[${item.title}]\n${item.notes}`).join('\n\n');

    const createdMeeting = addCopasstMeeting({
      meetingNumber: copasstState.meetings.length + 1,
      date: newMeetingDate,
      modality: newMeetingModality,
      locationOrLink: newMeetingLocation,
      attendeesWorkerIds: newMeetingAttendees,
      absenteesWorkerIds: copasstState.members.filter(m => !newMeetingAttendees.includes(m.workerId)).map(m => m.workerId),
      agendaTopics: meetingAgendaItems.map(item => item.title),
      agendaDetails: meetingAgendaItems.map(item => ({
        pointNumber: item.pointNumber,
        title: item.title,
        discussionNotes: item.notes
      })),
      discussionSummary: finalDiscussion,
      recommendations: parsedRecommendations,
      decisions: parsedDecisions,
      customObservations: newMeetingCustomObservations || undefined,
      commitments: meetingCommitments as any,
      membersSignatures: allMembersSignatures,
      signedByPresident: true,
      signedBySecretary: false,
      isClosed: false,
      evidenceIds: []
    });

    setTempCommitments([]);
    setNewMeetingDiscussion('');
    setNewMeetingCustomObservations('');
    setNewMeetingRecommendations('');
    setNewMeetingDecisions('');
    setIsMeetingModalOpen(false);
  };

  // Manejador de carga de archivo real de evidencia para capacitaciones
  const handleTrainingFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setNewTrainingEvidenceFile({
        name: file.name,
        size: sizeStr,
        base64,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'IMAGEN' : 'DOCUMENTO'
      });
      showNotification(`Evidencia "${file.name}" cargada para la capacitación`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Manejador de carga de acta física escaneada firmada (Custodia Digital)
  const handleScannedActUpload = (meetingId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      uploadScannedMeetingAct(meetingId, {
        fileName: file.name,
        fileBase64: base64,
        fileSize: sizeStr
      });
      if (selectedMeetingForDoc && selectedMeetingForDoc.id === meetingId) {
        setSelectedMeetingForDoc(prev => prev ? {
          ...prev,
          scannedSignedActFileName: file.name,
          scannedSignedActUrl: base64,
          scannedSignedActFileSize: sizeStr,
          scannedSignedActUploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          isClosed: true
        } : null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Guardar cambios editados en las actas (Líder SST / COPASST)
  const handleSaveDocEdits = () => {
    if (selectedDocumentToView === 'MEETING_ACT' && selectedMeetingForDoc) {
      const recs = editableMeetingRecommendations.split('\n').filter(r => r.trim().length > 0);
      const decs = editableMeetingDecisions.split('\n').filter(d => d.trim().length > 0);
      updateCopasstMeeting(selectedMeetingForDoc.id, {
        discussionSummary: editableMeetingDiscussion,
        customObservations: editableMeetingCustomObs,
        recommendations: recs.length > 0 ? recs : selectedMeetingForDoc.recommendations,
        decisions: decs.length > 0 ? decs : selectedMeetingForDoc.decisions
      });
      setSelectedMeetingForDoc(prev => prev ? {
        ...prev,
        discussionSummary: editableMeetingDiscussion,
        customObservations: editableMeetingCustomObs,
        recommendations: recs.length > 0 ? recs : prev.recommendations,
        decisions: decs.length > 0 ? decs : prev.decisions
      } : null);
      setIsEditingDoc(false);
      showNotification('Modificaciones del acta de reunión guardadas exitosamente', 'success');
    } else if (selectedDocumentToView === 'CONFORMATION') {
      updateCopasstDocumentNotes('CONFORMATION', editableDocText);
      setIsEditingDoc(false);
    } else if (selectedDocumentToView === 'INSTALLATION') {
      updateCopasstDocumentNotes('INSTALLATION', editableDocText);
      setIsEditingDoc(false);
    } else if (selectedDocumentToView === 'ELECTION_RESULTS') {
      updateCopasstDocumentNotes('ELECTION', editableDocText);
      setIsEditingDoc(false);
    } else if (selectedDocumentToView === 'VIGIA_DESIGNATION') {
      updateCopasstDocumentNotes('VIGIA', editableDocText);
      setIsEditingDoc(false);
    }
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

  // Manejador de nueva capacitación con soporte digital real
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
      evidenceFileName: newTrainingEvidenceFile?.name,
      evidenceFileBase64: newTrainingEvidenceFile?.base64,
      evidenceFileSize: newTrainingEvidenceFile?.size,
      evidenceFileType: newTrainingEvidenceFile?.type,
      notes: newTrainingNotes || undefined,
      status: 'EJECUTADA'
    });

    setNewTrainingEvidenceFile(null);
    setNewTrainingNotes('');
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
          <div className="space-y-4">
            {copasstState.meetings.map(meeting => {
              const allSigs = meeting.membersSignatures || [];
              const signedCount = allSigs.filter(s => s.signed).length;
              const totalSigs = allSigs.length;
              const isAllSigned = totalSigs > 0 && signedCount === totalSigs;

              return (
                <div key={meeting.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
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

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMeetingForDoc(meeting);
                          setSelectedDocumentToView('MEETING_ACT');
                          setIsEditingDoc(true);
                          setActiveTab('DOCUMENTS');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                        <span>Editar Acta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMeetingForDoc(meeting);
                          setSelectedDocumentToView('MEETING_ACT');
                          setIsEditingDoc(false);
                          setActiveTab('DOCUMENTS');
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                      >
                        <FileText className="w-3 h-3 text-white" />
                        <span>Ver / Imprimir Acta</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3.5 text-xs">
                    {/* Resumen del desarrollo */}
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Desarrollo y Síntesis de la Sesión:</div>
                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-line">
                        {meeting.discussionSummary}
                      </p>
                    </div>

                    {/* Observaciones o Cláusulas adicionales si las hay */}
                    {meeting.customObservations && (
                      <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-200/60 text-slate-700">
                        <div className="text-[10px] font-bold text-teal-800 uppercase flex items-center gap-1 mb-0.5">
                          <Check className="w-3 h-3 text-teal-600" />
                          <span>Adición / Cláusula Especial del Líder SST o COPASST:</span>
                        </div>
                        <p className="text-[11px] italic">{meeting.customObservations}</p>
                      </div>
                    )}

                    {/* Firmas paritarias de TODO el COPASST */}
                    <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                            <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                            Firmas Paritarias de Todos los Integrantes del COPASST:
                          </span>
                          <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                            isAllSigned
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {signedCount}/{totalSigs || copasstState.members.length} Firmados
                          </span>
                        </div>

                        {!isAllSigned && (
                          <button
                            type="button"
                            onClick={() => signMeetingAllMembers(meeting.id)}
                            className="text-[10px] px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 flex items-center gap-1 transition-all"
                          >
                            <CheckSquare className="w-3 h-3" />
                            <span>Firmar por Todos (Comité Reunido)</span>
                          </button>
                        )}
                      </div>

                      {/* Lista de firmas individuales */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                        {allSigs.map(sig => (
                          <div
                            key={sig.workerId}
                            className={`p-2 rounded-lg border text-[11px] flex flex-col justify-between transition-all ${
                              sig.signed
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-white border-amber-200 text-slate-800'
                            }`}
                          >
                            <div>
                              <div className="font-bold truncate text-xs">{sig.memberName}</div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                {sig.role} • <span className="font-semibold text-slate-600">{sig.party}</span>
                              </div>
                            </div>

                            <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
                              {sig.signed ? (
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-0.5">
                                    <Check className="w-3 h-3" /> Firmado (Ley 527)
                                  </span>
                                  <div className="text-[9px] font-mono text-slate-400 truncate max-w-[120px]">
                                    {sig.signatureToken}
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => signMeetingMember(meeting.id, sig.workerId)}
                                  className="w-full text-center px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] shadow-2xs transition-all"
                                >
                                  ✍️ Firmar Ahora
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Soporte Digital de Acta Física Escaneada */}
                    <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-700 shrink-0" />
                        <div>
                          <div className="font-bold text-blue-950 text-[11px]">
                            Custodia Legal de Acta Física Escaneada:
                          </div>
                          <div className="text-[10px] text-slate-600">
                            {meeting.scannedSignedActFileName ? (
                              <span>
                                Archivo cargado: <strong>{meeting.scannedSignedActFileName}</strong> ({meeting.scannedSignedActFileSize || 'PDF'}) • {meeting.scannedSignedActUploadedAt}
                              </span>
                            ) : (
                              <span>Sin archivo físico escaneado cargado aún. Si el comité firmó en papel, digitalice y cargue el acta.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {meeting.scannedSignedActUrl && (
                          <a
                            href={meeting.scannedSignedActUrl}
                            download={meeting.scannedSignedActFileName || 'Acta_COPASST_Firmada.pdf'}
                            className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                          >
                            <Eye className="w-3 h-3" /> Ver / Descargar
                          </a>
                        )}

                        <label className="cursor-pointer px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all">
                          <Upload className="w-3 h-3" />
                          <span>{meeting.scannedSignedActFileName ? 'Reemplazar Archivo' : 'Cargar Acta Firmada (PDF/Foto)'}</span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleScannedActUpload(meeting.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
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
              );
            })}
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
          
          {/* Banner de Interconexión Normativa sin Duplicidad */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 via-amber-100/40 to-slate-50 border border-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 block text-[11px] uppercase tracking-wide">
                  Interconexión Legal sin Duplicidad (Resolución 0312 de 2019 - Estándar 1.1.7)
                </span>
                <span className="text-[11px] text-slate-700 leading-relaxed">
                  Las capacitaciones registradas en este componente acreditan automáticamente el <strong>Estándar 1.1.7</strong> ante el Ministerio del Trabajo y la ARL, alimentan la matriz general de inducción y entrenamiento, y sincronizan el expediente de cada trabajador en la Base Maestra sin necesidad de duplicar registros.
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300 inline-flex items-center gap-1">
                <Check className="w-3 h-3" /> Estándar 1.1.7 Conectado ✓
              </span>
            </div>
          </div>

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
              <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2.5 text-xs">
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
                  Fecha de ejecución: <strong>{t.date}</strong> • {t.attendedWorkerIds.length} integrantes certificados
                </div>

                {/* Integrantes que asistieron */}
                <div className="pt-1.5 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Integrantes Certificados:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {t.attendedWorkerIds.map(wId => {
                      const wrk = workers.find(w => w.id === wId);
                      if (!wrk) return null;
                      return (
                        <span key={wId} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {wrk.firstName} {wrk.lastName}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Notas adicionales si existen */}
                {t.notes && (
                  <p className="p-2 rounded bg-slate-50 text-[11px] text-slate-600 italic border border-slate-100">
                    {t.notes}
                  </p>
                )}

                {/* Soporte Digital o Evidencia */}
                {(t.evidenceFileName || t.certificateUrl || t.evidenceFileBase64) && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-600 flex items-center gap-1 truncate max-w-[200px]">
                      <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{t.evidenceFileName || 'Soporte_Capacitacion.pdf'}</span>
                      {t.evidenceFileSize && <span className="text-slate-400">({t.evidenceFileSize})</span>}
                    </span>

                    <a
                      href={t.evidenceFileBase64 || t.certificateUrl || '#'}
                      target={t.evidenceFileBase64 ? '_self' : '_blank'}
                      download={t.evidenceFileName || 'Certificado_Capacitacion.pdf'}
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[10px] border border-teal-200 flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3 h-3 text-teal-600" />
                      <span>Ver / Descargar Soporte</span>
                    </a>
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
                <div className="flex items-center gap-1.5 mt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEditingDoc) {
                        if (selectedDocumentToView === 'MEETING_ACT' && selectedMeetingForDoc) {
                          setEditableMeetingDiscussion(selectedMeetingForDoc.discussionSummary || '');
                          setEditableMeetingCustomObs(selectedMeetingForDoc.customObservations || '');
                          setEditableMeetingRecommendations(selectedMeetingForDoc.recommendations?.join('\n') || '');
                          setEditableMeetingDecisions(selectedMeetingForDoc.decisions?.join('\n') || '');
                        } else if (selectedDocumentToView === 'CONFORMATION') {
                          setEditableDocText(copasstState.documentNotes?.CONFORMATION || '');
                        } else if (selectedDocumentToView === 'INSTALLATION') {
                          setEditableDocText(copasstState.documentNotes?.INSTALLATION || '');
                        } else if (selectedDocumentToView === 'ELECTION_RESULTS') {
                          setEditableDocText(copasstState.documentNotes?.ELECTION || '');
                        } else if (selectedDocumentToView === 'VIGIA_DESIGNATION') {
                          setEditableDocText(copasstState.documentNotes?.VIGIA || '');
                        }
                      }
                      setIsEditingDoc(!isEditingDoc);
                    }}
                    className={`px-2.5 py-1 rounded font-bold text-xs border flex items-center gap-1 transition-all ${
                      isEditingDoc
                        ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingDoc ? 'Cancelar Edición' : 'Editar / Agregar Notas'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 inline-flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Imprimir / PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Banner de Modo de Edición Activo */}
            {isEditingDoc && (
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-900 gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Modo de Edición Activo:</strong> El Líder SST o integrantes del COPASST pueden agregar observaciones, cláusulas, conclusiones o temas extraordinarios al documento oficial.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsEditingDoc(false)}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Descartar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDocEdits}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            )}

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

                {/* Sección Editable de Cláusulas y Notas Adicionales */}
                {isEditingDoc ? (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <label className="font-bold text-amber-900 block">Observaciones y Cláusulas Adicionales del Empleador / SST:</label>
                    <textarea
                      rows={3}
                      value={editableDocText}
                      onChange={(e) => setEditableDocText(e.target.value)}
                      placeholder="Ingrese acuerdos específicos sobre horas de dedicación, recursos asignados o compromisos de la alta dirección..."
                      className="w-full p-2 bg-white border border-amber-300 rounded text-xs text-slate-800"
                    />
                  </div>
                ) : copasstState.documentNotes?.VIGIA ? (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-800">Cláusulas / Observaciones Especiales Registradas:</div>
                    <p className="text-slate-700 whitespace-pre-line">{copasstState.documentNotes.VIGIA}</p>
                  </div>
                ) : null}

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

            {selectedDocumentToView === 'CONFORMATION' && (
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

                {/* Sección Editable de Cláusulas y Notas Adicionales */}
                {isEditingDoc ? (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <label className="font-bold text-amber-900 block">Cláusulas Especiales o Acuerdos Paritarios Adicionales (Editable):</label>
                    <textarea
                      rows={3}
                      value={editableDocText}
                      onChange={(e) => setEditableDocText(e.target.value)}
                      placeholder="Ingrese compromisos adicionales, acuerdos de horarios o cláusulas aprobadas por la asamblea..."
                      className="w-full p-2 bg-white border border-amber-300 rounded text-xs text-slate-800"
                    />
                  </div>
                ) : copasstState.documentNotes?.CONFORMATION ? (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-800">Cláusulas y Acuerdos Adicionales Registrados:</div>
                    <p className="text-slate-700 whitespace-pre-line">{copasstState.documentNotes.CONFORMATION}</p>
                  </div>
                ) : null}

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

            {selectedDocumentToView === 'INSTALLATION' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <h3 className="text-sm font-bold text-center text-slate-900 uppercase">
                  ACTA DE INSTALACIÓN DEL COMITÉ PARITARIO DE SEGURIDAD Y SALUD EN EL TRABAJO (COPASST)
                </h3>

                <p>
                  En cumplimiento del <strong>Decreto 1072 de 2015</strong> y la <strong>Resolución 2013 de 1986</strong>, se reunieron en la sede de <strong>{organization.name}</strong> los integrantes principales y suplentes con el fin de declarar formalmente <strong>INSTALADO</strong> el COPASST para el periodo <strong>{copasstState.periodStart} a {copasstState.periodEnd}</strong>.
                </p>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800">Acuerdos y Designaciones Reglamentarias:</div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    <li><strong>Designación del Presidente:</strong> La Gerencia General designa a <strong>Marcela Rincón Ortiz</strong> conforme a la facultad legal del empleador.</li>
                    <li><strong>Elección del Secretario:</strong> En consenso pleno paritario del comité, se nombra y elige a <strong>Sandra Milena Gómez</strong> como Secretaria del COPASST.</li>
                    <li><strong>Periodicidad de Sesiones:</strong> El Comité se reunirá ordinariamente por lo menos una vez al mes dentro de la jornada laboral, y de manera extraordinaria en caso de accidente grave o emergencia.</li>
                    <li><strong>Dedicación de Tiempo:</strong> El empleador garantiza un mínimo de cuatro (4) horas semanales a cada miembro para el ejercicio de sus funciones legales (Art. 11 Res. 2013/1986).</li>
                  </ul>
                </div>

                {isEditingDoc ? (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <label className="font-bold text-amber-900 block">Observaciones y Cláusulas Adicionales de la Instalación (Editable):</label>
                    <textarea
                      rows={3}
                      value={editableDocText}
                      onChange={(e) => setEditableDocText(e.target.value)}
                      placeholder="Ingrese detalles sobre el lugar de archivo de actas, canal de comunicación institucional, etc..."
                      className="w-full p-2 bg-white border border-amber-300 rounded text-xs text-slate-800"
                    />
                  </div>
                ) : copasstState.documentNotes?.INSTALLATION ? (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-800">Cláusulas de Instalación Registradas:</div>
                    <p className="text-slate-700 whitespace-pre-line">{copasstState.documentNotes.INSTALLATION}</p>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-center">
                  <div className="space-y-1">
                    <div className="font-script text-base text-blue-900">Marcela Rincón Ortiz</div>
                    <div className="border-t border-slate-400 pt-1 font-bold">Presidente del COPASST</div>
                    <div className="text-[10px] text-slate-500">Designado por la Gerencia</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-script text-base text-emerald-900">Sandra Milena Gómez</div>
                    <div className="border-t border-slate-400 pt-1 font-bold">Secretaria del COPASST</div>
                    <div className="text-[10px] text-slate-500">Elegida por el Comité</div>
                  </div>
                </div>
              </div>
            )}

            {selectedDocumentToView === 'ELECTION_RESULTS' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <h3 className="text-sm font-bold text-center text-slate-900 uppercase">
                  ACTA DE ESCRUTINIO Y RESULTADOS DE VOTACIÓN DE REPRESENTANTES DE LOS TRABAJADORES
                </h3>

                <p>
                  Los jurados de votación designados certifican que el proceso electoral para elegir a los representantes de los trabajadores ante el COPASST de <strong>{organization.name}</strong> se desarrolló de manera libre, democrática y transparente con los siguientes resultados consolidados:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded bg-slate-50 border">
                    <div className="text-[10px] text-slate-500">Censo Electoral</div>
                    <div className="font-bold text-slate-800 text-sm">{copasstState.election.totalVoters}</div>
                  </div>
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                    <div className="text-[10px] text-emerald-700">Votos Emitidos</div>
                    <div className="font-bold text-emerald-800 text-sm">{copasstState.election.votesSubmitted}</div>
                  </div>
                  <div className="p-2 rounded bg-blue-50 border border-blue-200">
                    <div className="text-[10px] text-blue-700">Votos en Blanco</div>
                    <div className="font-bold text-blue-800 text-sm">{copasstState.election.blankVotes}</div>
                  </div>
                  <div className="p-2 rounded bg-rose-50 border border-rose-200">
                    <div className="text-[10px] text-rose-700">Votos Nulos</div>
                    <div className="font-bold text-rose-800 text-sm">{copasstState.election.nullVotes}</div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b">
                      <tr>
                        <th className="p-2">Candidato</th>
                        <th className="p-2">Área</th>
                        <th className="p-2 text-center">Votos</th>
                        <th className="p-2 text-right">Condición Resultante</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {copasstState.election.candidates.map(c => (
                        <tr key={c.id}>
                          <td className="p-2 font-semibold">{c.workerName}</td>
                          <td className="p-2 text-slate-600">{c.area}</td>
                          <td className="p-2 text-center font-bold">{c.votesCount}</td>
                          <td className="p-2 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {c.votesCount > 5 ? 'ELEGIDO PRINCIPAL' : 'ELEGIDO SUPLENTE'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {isEditingDoc ? (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <label className="font-bold text-amber-900 block">Observaciones de los Jurados de Escrutinio (Editable):</label>
                    <textarea
                      rows={3}
                      value={editableDocText}
                      onChange={(e) => setEditableDocText(e.target.value)}
                      placeholder="Ingrese incidencias, novedades en urna o declaraciones de los jurados..."
                      className="w-full p-2 bg-white border border-amber-300 rounded text-xs text-slate-800"
                    />
                  </div>
                ) : copasstState.documentNotes?.ELECTION ? (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-800">Observaciones de Escrutinio Registradas:</div>
                    <p className="text-slate-700 whitespace-pre-line">{copasstState.documentNotes.ELECTION}</p>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-center">
                  <div className="space-y-1">
                    <div className="font-script text-base text-slate-800">Jurado de Mesa Principal</div>
                    <div className="border-t border-slate-400 pt-1 font-bold">Jurado 1 - Testigo Electoral</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-script text-base text-slate-800">Jurado de Mesa Suplente</div>
                    <div className="border-t border-slate-400 pt-1 font-bold">Jurado 2 - Testigo Electoral</div>
                  </div>
                </div>
              </div>
            )}

            {selectedDocumentToView === 'MEETING_ACT' && selectedMeetingForDoc && (
              <div className="space-y-5 text-xs leading-relaxed">
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 uppercase">
                    ACTA OFICIAL DE REUNIÓN ORDINARIA DEL COPASST - {selectedMeetingForDoc.actaCode}
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    Conforme al Artículo 2.2.4.6.12 del Decreto 1072 de 2015 y Resolución 2013 de 1986
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div><strong>Fecha:</strong> {selectedMeetingForDoc.date}</div>
                  <div><strong>Hora:</strong> {selectedMeetingForDoc.time || '09:00 AM'}</div>
                  <div><strong>Modalidad:</strong> {selectedMeetingForDoc.modality}</div>
                  <div><strong>Lugar/Enlace:</strong> {selectedMeetingForDoc.locationOrLink}</div>
                </div>

                {/* Orden del Día Pre-estructurado */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 flex items-center justify-between border-b pb-1">
                    <span>ORDEN DEL DÍA DESARROLLADO:</span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      8 Puntos Reglamentarios
                    </span>
                  </div>

                  {selectedMeetingForDoc.agendaDetails && selectedMeetingForDoc.agendaDetails.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      {selectedMeetingForDoc.agendaDetails.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200 space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 font-mono">
                              {idx + 1}
                            </span>
                            <span>{item.title}</span>
                          </div>
                          {item.discussionNote && (
                            <p className="text-slate-700 pl-5.5 text-[11px] leading-relaxed">
                              {item.discussionNote}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                      {selectedMeetingForDoc.agendaTopics.map((top, idx) => (
                        <li key={idx}><strong>{idx + 1}.</strong> {top}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Desarrollo y Conclusiones */}
                <div className="space-y-1">
                  <strong className="text-slate-900 block">DESARROLLO DE LA REUNIÓN Y CONCLUSIONES:</strong>
                  {isEditingDoc ? (
                    <textarea
                      rows={5}
                      value={editableMeetingDiscussion}
                      onChange={(e) => setEditableMeetingDiscussion(e.target.value)}
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800"
                    />
                  ) : (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 whitespace-pre-line leading-relaxed">
                      {selectedMeetingForDoc.discussionSummary}
                    </div>
                  )}
                </div>

                {/* Observaciones Extraordinarias o Cláusulas del Líder SST / COPASST */}
                <div className="space-y-1">
                  <strong className="text-slate-900 block">OBSERVACIONES O TEMAS EXTRAORDINARIOS AGREGADOS:</strong>
                  {isEditingDoc ? (
                    <textarea
                      rows={3}
                      value={editableMeetingCustomObs}
                      onChange={(e) => setEditableMeetingCustomObs(e.target.value)}
                      placeholder="Ingrese temas o consideraciones adicionales acordadas por el Líder SST o COPASST..."
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800"
                    />
                  ) : selectedMeetingForDoc.customObservations ? (
                    <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-amber-950 whitespace-pre-line">
                      {selectedMeetingForDoc.customObservations}
                    </div>
                  ) : (
                    <div className="p-2 rounded bg-slate-50 text-slate-500 italic text-[11px]">
                      Sin observaciones adicionales registradas.
                    </div>
                  )}
                </div>

                {/* Compromisos Acordados */}
                <div className="space-y-2">
                  <strong className="text-slate-900 block">MATRIZ DE COMPROMISOS ACORDADOS EN LA SESIÓN:</strong>
                  <div className="space-y-1.5">
                    {selectedMeetingForDoc.commitments.map((com, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                        <span className="font-medium text-slate-900">• {com.description}</span>
                        <div className="flex items-center gap-2 text-slate-600 shrink-0">
                          <span className="font-semibold text-emerald-800">Resp: {com.responsibleName}</span>
                          <span>| Fecha Límite: {com.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ============================================================== */}
                {/* SISTEMA HÍBRIDO DE FIRMAS: TODA LA COMISIÓN & CUSTODIA DIGITAL */}
                {/* ============================================================== */}
                <div className="pt-6 border-t-2 border-slate-300 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-100 p-3 rounded-xl border border-slate-200">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        SOPORTE LEGAL DE FIRMAS DE TODO EL COPASST (Ley 527 de 1999)
                      </h4>
                      <p className="text-[10px] text-slate-600">
                        Firme electrónicamente en plataforma con trazabilidad o descargue el acta, firme a mano y suba el archivo escaneado.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => signMeetingAllMembers(selectedMeetingForDoc.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Firmar por Todos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => scannedActFileInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Acta Firmada Escaneada</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Firmas Electrónicas Individuales de Cada Miembro del COPASST */}
                  <div className="space-y-2">
                    <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Firmas Electrónicas de los Integrantes Paritarios:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(selectedMeetingForDoc.membersSignatures && selectedMeetingForDoc.membersSignatures.length > 0
                        ? selectedMeetingForDoc.membersSignatures
                        : copasstState.members.map(m => {
                            const w = workers.find(wrk => wrk.id === m.workerId);
                            return {
                              workerId: m.workerId,
                              memberName: w ? `${w.firstName} ${w.lastName}` : 'Integrante',
                              role: m.role,
                              party: m.party,
                              signed: false,
                              isSigned: false,
                              signedAt: undefined,
                              signatureToken: undefined,
                              auditToken: undefined
                            };
                          })
                      ).map(sig => {
                        const isSigned = Boolean(sig.signed || sig.isSigned);
                        const token = sig.signatureToken || sig.auditToken || `SIG-COP-${sig.workerId.slice(-4)}`;
                        const signedTime = sig.signedAt || 'Firmado electrónicamente';

                        return (
                          <div
                            key={sig.workerId}
                            className={`p-3 rounded-xl border transition-all ${
                              isSigned
                                ? 'bg-emerald-50/50 border-emerald-300'
                                : 'bg-amber-50/40 border-amber-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{sig.memberName}</div>
                                <div className="text-[10px] text-slate-600">
                                  {sig.role} • <span className="font-semibold text-slate-700">{sig.party}</span>
                                </div>
                              </div>
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  isSigned
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {isSigned ? 'Firmado' : 'Pendiente'}
                              </span>
                            </div>

                            {isSigned ? (
                              <div className="space-y-1 pt-1 border-t border-emerald-200">
                                <div className="font-script text-base text-emerald-900 leading-tight">
                                  {sig.memberName}
                                </div>
                                <div className="text-[9px] text-slate-500 font-mono">
                                  Token: {token}
                                </div>
                                <div className="text-[9px] text-slate-500">
                                  {signedTime}
                                </div>
                              </div>
                            ) : (
                              <div className="pt-2 border-t border-amber-200 flex items-center justify-between">
                                <span className="text-[10px] text-amber-800 italic">Esperando firma digital</span>
                                <button
                                  type="button"
                                  onClick={() => signMeetingMember(selectedMeetingForDoc.id, sig.workerId)}
                                  className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs"
                                >
                                  <Edit3 className="w-3 h-3" /> Firmar
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Custodia Digital del Acta Física Escaneada */}
                  {(selectedMeetingForDoc.scannedSignedActUrl || selectedMeetingForDoc.scannedActBase64) && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-300 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileCheck className="w-5 h-5 text-blue-700 shrink-0" />
                        <div>
                          <div className="font-bold text-blue-900">Acta Física Escaneada en Custodia Digital Legal</div>
                          <div className="text-[10px] text-blue-700">
                            Archivo: {selectedMeetingForDoc.scannedSignedActFileName || selectedMeetingForDoc.scannedActFileName || 'Acta_firmada.pdf'} • Subida el {selectedMeetingForDoc.scannedSignedActUploadedAt || selectedMeetingForDoc.scannedActUploadDate || 'Reciente'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={selectedMeetingForDoc.scannedSignedActUrl || selectedMeetingForDoc.scannedActBase64}
                          download={selectedMeetingForDoc.scannedSignedActFileName || selectedMeetingForDoc.scannedActFileName || `Acta_${selectedMeetingForDoc.actaCode}_firmada.pdf`}
                          className="px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" /> Descargar
                        </a>
                        <button
                          type="button"
                          onClick={() => scannedActFileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs"
                        >
                          Reemplazar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3. Recuadros de Firma para Impresión / Descarga Física */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="text-[11px] font-bold text-slate-700 mb-2">
                      Espacio Oficial para Firmas Físicas Manuscritas en Papel (Impresión):
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      {(selectedMeetingForDoc.membersSignatures && selectedMeetingForDoc.membersSignatures.length > 0
                        ? selectedMeetingForDoc.membersSignatures
                        : copasstState.members.map(m => {
                            const w = workers.find(wrk => wrk.id === m.workerId);
                            return {
                              workerId: m.workerId,
                              memberName: w ? `${w.firstName} ${w.lastName}` : 'Integrante',
                              role: m.role,
                              party: m.party
                            };
                          })
                      ).map(sig => (
                        <div key={sig.workerId} className="space-y-1">
                          <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-0.5">
                            <span className="font-script text-xs text-slate-600">{sig.memberName}</span>
                          </div>
                          <div className="font-bold text-[10px] text-slate-900 leading-tight">{sig.memberName}</div>
                          <div className="text-[9px] text-slate-600">{sig.role}</div>
                          <div className="text-[8px] text-slate-500 uppercase">{sig.party}</div>
                        </div>
                      ))}
                    </div>
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
          <div className="bg-white rounded-2xl max-w-3xl w-full p-5 space-y-4 shadow-2xl max-h-[92vh] flex flex-col animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-2 shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Registrar Sesión Ordinaria del COPASST
                </h3>
                <p className="text-[10px] text-slate-500">
                  Orden del día reglamentario (Decreto 1072 de 2015 & Res. 2013 de 1986). Diligencie o ajuste cada punto predeterminado.
                </p>
              </div>
              <button onClick={() => setIsMeetingModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500 hover:text-slate-700" />
              </button>
            </div>

            <form onSubmit={handleSaveMeeting} className="space-y-4 text-xs overflow-y-auto flex-1 pr-1.5">
              {/* Metadatos Generales */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de la Reunión:</label>
                  <input
                    type="date"
                    value={newMeetingDate}
                    onChange={(e) => setNewMeetingDate(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hora de Inicio:</label>
                  <input
                    type="text"
                    value={newMeetingTime}
                    onChange={(e) => setNewMeetingTime(e.target.value)}
                    placeholder="Ej: 09:00 AM"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modalidad:</label>
                  <select
                    value={newMeetingModality}
                    onChange={(e) => setNewMeetingModality(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
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
                    placeholder="Sala de juntas o Enlace Meet/Teams"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              {/* Asistencia de los Integrantes del COPASST */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Verificación de Asistencia de Integrantes del COPASST:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = copasstState.members.map(m => m.workerId);
                      setNewMeetingAttendees(allIds);
                    }}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Marcar Todos Asistentes
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {copasstState.members.map(m => {
                    const w = workers.find(wrk => wrk.id === m.workerId);
                    const isChecked = newMeetingAttendees.includes(m.workerId);
                    return (
                      <label
                        key={m.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-white border-emerald-400 shadow-2xs'
                            : 'bg-white/60 border-slate-200 text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewMeetingAttendees(prev => [...prev, m.workerId]);
                            } else {
                              setNewMeetingAttendees(prev => prev.filter(id => id !== m.workerId));
                            }
                          }}
                          className="w-3.5 h-3.5 text-emerald-600 rounded"
                        />
                        <div className="truncate">
                          <span className="font-bold text-slate-800">{w ? `${w.firstName} ${w.lastName}` : 'Miembro'}</span>
                          <span className="text-[10px] text-slate-500 ml-1">({m.role} - {m.party})</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Orden del Día Pre-configurado y Editable */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Orden del Día Reglamentario (8 Puntos Pre-establecidos):</span>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full font-semibold">
                    Editable punto a punto
                  </span>
                </div>

                <div className="space-y-2.5">
                  {meetingAgendaItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] shrink-0 font-mono">
                          {idx + 1}
                        </span>
                        <span>{item.title}</span>
                      </div>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMeetingAgendaItems(prev =>
                            prev.map((it, i) => i === idx ? { ...it, notes: val } : it)
                          );
                        }}
                        placeholder={`Detalle del desarrollo para: ${item.title}`}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[11px] text-slate-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desarrollo General y Conclusiones */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Desarrollo Integral y Conclusiones Generales del Acta:</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiCommitments}
                    disabled={aiPromptLoading}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Asistente IA Sugerir Conclusiones y Tareas</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Redacte las conclusiones consolidadas de la reunión, temas debatidos y determinaciones paritarias..."
                  value={newMeetingDiscussion}
                  onChange={(e) => setNewMeetingDiscussion(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 text-xs"
                />
              </div>

              {aiGeneratedText && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-slate-700 space-y-1 animate-in fade-in">
                  <div className="font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Sugerencia de Compromisos por Asistente IA:
                  </div>
                  <pre className="whitespace-pre-line font-sans">{aiGeneratedText}</pre>
                </div>
              )}

              {/* Observaciones o Temas Extraordinarios (Editable) */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-1">
                <label className="font-bold text-amber-950 block">
                  Observaciones o Temas Extraordinarios del COPASST / Líder SST (Editable):
                </label>
                <textarea
                  rows={2}
                  value={newMeetingCustomObservations}
                  onChange={(e) => setNewMeetingCustomObservations(e.target.value)}
                  placeholder="Espacio para registrar cualquier solicitud especial de trabajadores, notas del líder SST o consideraciones no contempladas en los 8 puntos..."
                  className="w-full bg-white border border-amber-300 rounded-lg p-2 text-slate-800 text-xs"
                />
              </div>

              {/* Registro de compromisos */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-[11px]">Matriz de Tareas y Compromisos Acordados:</div>
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

              <div className="pt-2 flex items-center justify-end gap-2 shrink-0 border-t">
                <button
                  type="button"
                  onClick={() => setIsMeetingModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm"
                >
                  Guardar Acta de Sesión
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl max-h-[92vh] flex flex-col animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-2 shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  Registrar Capacitación del COPASST / Vigía
                </h3>
                <p className="text-[10px] text-slate-500">
                  Estándar 1.1.7 Resolución 0312 de 2019 • Soporte digital sin duplicidad de datos
                </p>
              </div>
              <button onClick={() => setIsTrainingModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500 hover:text-slate-700" />
              </button>
            </div>

            <form onSubmit={handleSaveTraining} className="space-y-3.5 text-xs overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tema del Curso o Taller:</label>
                <input
                  type="text"
                  placeholder="Ej: Funciones y responsabilidades legales del COPASST e investigación de AT"
                  value={newTrainingTopic}
                  onChange={(e) => setNewTrainingTopic(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Entidad Capacitadora o Instructor:</label>
                <input
                  type="text"
                  placeholder="Ej: ARL Positiva / Asesor SST Especialista"
                  value={newTrainingEntity}
                  onChange={(e) => setNewTrainingEntity(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              {/* Asistencia de Integrantes */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Integrantes Asistentes a la Capacitación:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const ids = isCurrentVigia
                        ? (copasstState.vigiaProfile?.workerId ? [copasstState.vigiaProfile.workerId] : [])
                        : copasstState.members.map(m => m.workerId);
                      setNewTrainingAttendees(ids);
                    }}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Marcar Todos
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {(isCurrentVigia
                    ? (copasstState.vigiaProfile?.workerId ? [workers.find(w => w.id === copasstState.vigiaProfile?.workerId)].filter(Boolean) : workers.slice(0, 4))
                    : copasstState.members.map(m => workers.find(w => w.id === m.workerId)).filter(Boolean)
                  ).map((w: any) => {
                    const isChecked = newTrainingAttendees.includes(w.id);
                    return (
                      <label
                        key={w.id}
                        className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-white border-emerald-400 font-bold text-slate-900 shadow-2xs'
                            : 'bg-white/60 border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewTrainingAttendees(prev => [...prev, w.id]);
                            } else {
                              setNewTrainingAttendees(prev => prev.filter(id => id !== w.id));
                            }
                          }}
                          className="w-3.5 h-3.5 text-emerald-600 rounded"
                        />
                        <span className="truncate">{w.firstName} {w.lastName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Carga Real de Archivo de Evidencia */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <label className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-amber-700" />
                  <span>Soporte Digital de la Capacitación (Foto, PDF o Registro):</span>
                </label>

                <input
                  type="file"
                  ref={trainingFileInputRef}
                  onChange={handleTrainingFileUpload}
                  accept=".pdf,image/*,.docx,.xlsx"
                  className="hidden"
                />

                {newTrainingEvidenceFile ? (
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-300 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-slate-900 truncate">{newTrainingEvidenceFile.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{newTrainingEvidenceFile.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => trainingFileInputRef.current?.click()}
                        className="text-[10px] text-blue-700 hover:text-blue-900 font-bold underline"
                      >
                        Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewTrainingEvidenceFile(null)}
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-bold underline ml-1"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => trainingFileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 border-2 border-dashed border-amber-300 hover:border-amber-400 bg-white rounded-xl text-center flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-slate-900 transition-all"
                  >
                    <Upload className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-xs text-amber-900">
                      Haga clic para subir Foto, Certificado o Lista de Asistencia (PDF / Imagen)
                    </span>
                    <span className="text-[10px] text-slate-500">Formatos permitidos: PDF, JPG, PNG, DOCX</span>
                  </button>
                )}
              </div>

              {/* Observaciones o Notas */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas u Observaciones del Taller:</label>
                <textarea
                  rows={2}
                  value={newTrainingNotes}
                  onChange={(e) => setNewTrainingNotes(e.target.value)}
                  placeholder="Observaciones sobre evaluación de eficacia, retroalimentación o compromisos post-capacitación..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 text-xs"
                />
              </div>

              {/* Banner de Cero Duplicidad */}
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Cero duplicidad (1.1.7):</strong> Este registro alimenta directamente el Estándar 1.1.7 y anexa la constancia al expediente digital de cada trabajador asistente.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 shrink-0 border-t">
                <button
                  type="button"
                  onClick={() => setIsTrainingModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-sm"
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
