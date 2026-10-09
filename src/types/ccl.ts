// ============================================================================
// Tipos del Comité de Convivencia Laboral (CCL)
// Conforme a la RESOLUCIÓN 3461 DE 2025 DEL MINISTERIO DEL TRABAJO
// (Que deroga expresamente las Resoluciones 652 y 1356 de 2012)
// Decreto 1072 de 2015 y Resolución 0312 de 2019 (Estándar 1.1.8)
// ============================================================================

export type CclParty = 'EMPLEADOR' | 'TRABAJADORES';

export type CclMemberRole = 
  | 'PRESIDENTE'
  | 'SECRETARIO'
  | 'VOCAL_PRINCIPAL'
  | 'VOCAL_SUPLENTE';

export interface CclMember {
  id: string;
  workerId: string; // Enlace a Base Maestra de Trabajadores
  party: CclParty;
  role: CclMemberRole;
  isPrincipal: boolean;
  appointmentDate: string; // YYYY-MM-DD
  termEndDate: string; // YYYY-MM-DD (2 años Res. 3461/2025)
  signedConfidentialityAgreement: boolean;
  confidentialitySignedAt?: string;
  confidentialityToken?: string;
  status: 'ACTIVO' | 'INACTIVO' | 'SUSTITUIDO';
}

// --------------------------------------------------
// Determinación de Conformación (Resolución 3461 de 2025)
// --------------------------------------------------
export type CclCompanyScale = 
  | 'MENOS_DE_5'      // Menos de 5 trabajadores (1 y 1)
  | 'DE_5_A_MENOS_20' // Más de 5 y menos de 20 trabajadores (1 principal y 1 suplente c/u)
  | 'DE_20_O_MAS'     // 20 o más trabajadores (mínimo 2 principales y 2 suplentes c/u)
  | 'MULTI_CENTROS';  // Con centros de trabajo adicionales

export interface CclApplicabilityConfig {
  scale: CclCompanyScale;
  workerCount: number;
  centersCount: number;
  requiredEmployerPrincipals: number;
  requiredEmployerAlternates: number;
  requiredWorkersPrincipals: number;
  requiredWorkersAlternates: number;
  totalCommitteeMembers: number;
  normativeReference: string; // Res. 3461 de 2025 Art. 3
  explanation: string;
}

// --------------------------------------------------
// Convocatoria y Elecciones de los Trabajadores
// --------------------------------------------------
export interface CclElectionCandidate {
  id: string;
  workerId: string; // Base Maestra
  workerName?: string;
  workerDocNumber?: string;
  workerPosition?: string;
  workerArea?: string;
  photoUrl?: string;
  registrationDate: string;
  proposalBrief?: string;
  eligibilityValidated: boolean; // Validación estricta de inhabilidad Res. 3461/2025
  eligibilityNotes?: string; // Confidencial, no público
  status: 'POSTULADO' | 'HABILITADO' | 'INHABILITADO' | 'RETIRADO';
  votesCount: number;
  isElected: boolean;
  electedRole?: 'PRINCIPAL' | 'SUPLENTE';
}

export interface CclVoterAuditEntry {
  voterDocNumber: string; // Solo para garantizar un voto por trabajador
  votedAt: string; // Timestamp
  ipAddress?: string;
}

export interface CclElectionState {
  convocationCode: string; // e.g. "CONV-CCL-2026"
  convocationDate: string;
  candidatesPublicationDate: string;
  votingStartDate: string;
  votingEndDate: string;
  isVotingOpen: boolean;
  isClosed: boolean;
  closedAt?: string;
  closedBy?: string;
  totalEligibleVoters: number;
  votesSubmitted: number;
  blankVotes: number;
  nullVotes: number;
  voterAuditLog: CclVoterAuditEntry[];
  candidates: CclElectionCandidate[];
  resultsPublished: boolean;
  publicVotingUrlToken: string; // Para votación sin login en AGAE
  publicationEvidenceUrl?: string;
  publicationMedia?: string; // Cartelera, Intranet, Correo Institucional
}

// --------------------------------------------------
// Quejas y Expedientes Confidenciales (Res. 3461/2025)
// --------------------------------------------------
export type CclComplaintStatus = 
  | 'RECIBIDA'
  | 'RADICADA'
  | 'PENDIENTE_REVISION'
  | 'EXAMEN_CONFIDENCIAL'
  | 'PENDIENTE_ESCUCHA'
  | 'ESCUCHA_PARTE_A'
  | 'ESCUCHA_PARTE_B'
  | 'DIALOGO_CONCERTACION'
  | 'PLAN_MEJORA'
  | 'EN_SEGUIMIENTO'
  | 'PENDIENTE_RECOMENDACIONES'
  | 'CERRADA'
  | 'REMITIDA'
  | 'ARCHIVADA_RESERVA';

export type CclReceptionChannel = 
  | 'FORMULARIO_INTERNO'
  | 'REGISTRO_SECRETARIA'
  | 'CORREO_ELECTRONICO'
  | 'CANAL_CONFIDENCIAL'
  | 'BUZON_FISICO';

export interface CclEvidenceAttachment {
  id: string;
  fileName: string;
  fileType: string; // PDF, IMAGEN, AUDIO, DOCX
  fileSize: string;
  base64?: string;
  uploadDate: string;
  description?: string;
  uploadedBy: string;
}

export interface CclHearingRecord {
  date: string;
  attendees: string[];
  summaryNotes: string;
  documentEvidenceUrl?: string;
  signedConfidentiality: boolean;
  recordedBy: string;
}

export interface CclCommitmentItem {
  id: string;
  description: string;
  responsibleWorkerId: string;
  responsibleName: string;
  dueDate: string;
  expectedEvidence: string;
  status: 'PENDIENTE' | 'EN_PROCESO' | 'CUMPLIDO' | 'INCUMPLIDO';
  verifiedDate?: string;
  verificationNotes?: string;
}

export interface CclFollowUpRecord {
  id: string;
  date: string;
  conductedBy: string;
  observations: string;
  effectiveCompliance: boolean;
  nextFollowUpDate?: string;
}

export interface CclTimelineEntry {
  date: string; // YYYY-MM-DD HH:mm
  action: string;
  responsible: string;
  documentRef?: string;
  evidenceRef?: string;
  previousStatus?: CclComplaintStatus;
  newStatus: CclComplaintStatus;
  notes?: string;
}

export interface CclComplaintCase {
  id: string; // e.g. "CCL-2026-0001"
  code: string;
  filingDate: string; // Fecha de radicación
  receptionDate: string;
  channel: CclReceptionChannel;
  status: CclComplaintStatus;
  confidentialityLevel: 'RESERVADO_COMITE' | 'ALTA_RESERVA_SECRETARIA';
  
  // Personas involucradas (Seleccionadas de la Base Maestra)
  complainantWorkerId: string; // Quien presenta la presunta queja
  respondentWorkerId: string;  // Persona señalada en la presunta conducta
  witnessesText?: string;
  
  // Hechos y contexto (Objetivo, sin prejuzgamiento jurídico)
  incidentDates: string;
  incidentLocation: string;
  factsDescription: string;
  evidences: CclEvidenceAttachment[];
  
  // Control de Plazos (Resolución 3461 de 2025)
  examDeadline: string;          // Plazo límite para examen confidencial inicial
  hearingsDeadline: string;      // Plazo límite para escucha individual de partes
  dialogueDeadline: string;      // Plazo límite para sesión de diálogo
  resolutionDeadline: string;    // Plazo límite total del caso
  extensions: {
    reason: string;
    approvedBy: string;
    originalDate: string;
    newDate: string;
    registeredAt: string;
  }[];

  // Etapa 1: Examen Confidencial
  confidentialExam?: {
    date: string;
    participants: string[];
    analysisSummary: string;
    preventiveAdministrativeConclusions: string; // Enfoque preventivo, NO declaración judicial de acoso
    proceedsToHearings: boolean;
  };

  // Etapa 2: Escucha de las partes por separado
  hearings?: {
    complainant?: CclHearingRecord; // Parte A
    respondent?: CclHearingRecord;  // Parte B
  };

  // Etapa 3: Reunión de Diálogo y Concertación
  dialogueSession?: {
    date: string;
    attendees: string[];
    summary: string;
    agreementReached: boolean;
    actCode?: string;
  };

  // Etapa 4: Plan de Mejora y Compromisos
  improvementPlan?: {
    commitments: CclCommitmentItem[];
    recommendationsToOrganization: string[];
    approvedAt: string;
  };

  // Etapa 5: Seguimiento Periódico
  followUps: CclFollowUpRecord[];

  // Etapa 6: Cierre del Caso
  closure?: {
    closedDate: string;
    closureReason: 
      | 'ACUERDO_TOTAL_CUMPLIDO'
      | 'CONCILIACION_EXITOSA'
      | 'DESISTIMIENTO_EXPRESO'
      | 'REMITIDO_ALTA_DIRECCION'
      | 'REMITIDO_MINTRABAJO'
      | 'ARCHIVO_BAJO_RESERVA';
    closureSummary: string;
    sentToAcpm: boolean;
    acpmActionId?: string; // En caso de que se derive una acción preventiva institucional
  };

  // Línea de Tiempo de Trazabilidad Completa
  timeline: CclTimelineEntry[];
}

// --------------------------------------------------
// Sesiones y Actas del CCL (Ordinarias y Extraordinarias)
// --------------------------------------------------
export type CclMeetingType = 'ORDINARIA' | 'EXTRAORDINARIA' | 'DIALOGO' | 'SEGUIMIENTO';

export interface CclMeetingAgendaDetail {
  pointNumber: number;
  title: string;
  discussionNotes: string;
}

export interface CclMeetingMemberSignature {
  workerId: string;
  memberName: string;
  role: string;
  party: CclParty;
  signed: boolean;
  signedAt?: string;
  signatureToken?: string;
}

export interface CclMeeting {
  id: string;
  actaCode: string; // e.g. "ACTA-CCL-ORD-2026-01"
  type: CclMeetingType;
  date: string;
  time: string;
  modality: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';
  locationOrLink: string;
  attendeesWorkerIds: string[];
  agendaTopics: string[];
  agendaDetails?: CclMeetingAgendaDetail[];
  discussionSummary: string;
  preventiveRecommendations: string[];
  commitments: {
    id: string;
    description: string;
    responsibleName: string;
    dueDate: string;
    status: 'PENDIENTE' | 'CUMPLIDO';
  }[];
  customObservations?: string;
  membersSignatures: CclMeetingMemberSignature[];
  scannedActUrl?: string;
  scannedActFileName?: string;
  scannedActUploadDate?: string;
  isClosed: boolean;
}

// --------------------------------------------------
// Biblioteca de Protocolos y Procedimientos
// --------------------------------------------------
export interface CclProtocolDocument {
  id: string;
  code: string;
  title: string;
  category: 'PROCEDIMIENTO' | 'PROTOCOLO' | 'FORMATO' | 'REGLAMENTO';
  legalBasis: string; // Resolución 3461 de 2025
  version: string;
  updatedAt: string;
  description: string;
  contentTemplate: string;
}

// --------------------------------------------------
// Estado Global del Módulo CCL
// --------------------------------------------------
export interface CclGlobalState {
  normativeReference: string; // "Resolución 3461 de 2025 del Ministerio del Trabajo"
  derogatedRegulationsNote: string; // "Resoluciones 652 y 1356 de 2012 derogadas expresamente"
  periodYears: number; // 2 años
  periodStart: string; // YYYY-MM-DD
  periodEnd: string;   // YYYY-MM-DD
  applicability: CclApplicabilityConfig;
  
  // Integrantes del Comité
  members: CclMember[];
  presidentWorkerId?: string;
  secretaryWorkerId?: string;
  conformationActNumber: string;
  conformationActDate: string;
  installationActDate: string;
  
  // Proceso Electoral
  election: CclElectionState;
  
  // Reglamento Interno y Acuerdos de Confidencialidad
  reglamentoText: string;
  reglamentoVersion: string;
  reglamentoApprovedDate?: string;
  confidentialityAgreements: Record<string, {
    signed: boolean;
    signedAt?: string;
    token?: string;
  }>;
  
  // Casos de Convivencia (Matriz de Quejas)
  complaints: CclComplaintCase[];
  
  // Reuniones y Actas
  meetings: CclMeeting[];
  
  // Biblioteca de Documentos y Formatos
  protocols: CclProtocolDocument[];
  
  // Notas y cláusulas editables de documentos
  documentNotes: Record<string, string>;
  
  // Control de Acceso y Seguridad de Confidencialidad
  securitySettings: {
    restrictComplaintsViewToCommittee: boolean;
    requireConfidentialityAgreementForAccess: boolean;
    maskNamesInGeneralDashboard: boolean;
  };
}
