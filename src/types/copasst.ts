// =====================================================================
// COMPONENTE INTEGRAL COPASST O VIGÍA DE SST
// AGAE SOLUTIONS - Sistema Activo de Gestión y Trazabilidad SG-SST
// Base Normativa: Dec. 1072/2015, Res. 0312/2019, Res. 2013/1986
// =====================================================================

export type CopasstMechanismType = 'VIGIA_SST' | 'COPASST';

export type CopasstApplicabilityStatus = 
  | 'APLICA'
  | 'NO_APLICA'
  | 'PENDIENTE_DEFINIR'
  | 'CUMPLE'
  | 'PENDIENTE'
  | 'VENCIDO';

export type CopasstMemberRole = 
  | 'PRESIDENTE'
  | 'SECRETARIO'
  | 'PRINCIPAL'
  | 'SUPLENTE'
  | 'VIGIA';

export type CopasstParty = 'EMPLEADOR' | 'TRABAJADORES';

export interface CopasstMember {
  id: string;
  workerId: string; // Vínculo con MasterWorker (Base Maestra)
  role: CopasstMemberRole;
  party: CopasstParty;
  appointmentDate: string; // YYYY-MM-DD
  isActive: boolean;
  signatureDate?: string;
  signatureToken?: string;
}

// --------------------------------------------------
// Perfil y Designación del Vigía de SST (< 10 trabajadores)
// --------------------------------------------------
export interface VigiaProfile {
  workerId: string;
  appointmentDate: string; // YYYY-MM-DD
  termYears: number; // 2 años según normativa
  termEndDate: string; // YYYY-MM-DD
  employerName: string;
  employerDoc: string;
  employerSignatureDate?: string;
  vigiaSignatureDate?: string;
  isSigned: boolean;
  functionsAccepted: boolean;
  notes?: string;
  documentActaId?: string;
}

// --------------------------------------------------
// Actuaciones del Vigía de SST
// --------------------------------------------------
export type VigiaActuationType = 
  | 'INSPECCION'
  | 'CONDICION_INSEGURA'
  | 'RECOMENDACION'
  | 'CAPACITACION'
  | 'INVESTIGACION_ACCIDENTE'
  | 'REUNION_SEGUIMIENTO'
  | 'OTRA';

export interface VigiaActuation {
  id: string;
  date: string; // YYYY-MM-DD
  type: VigiaActuationType;
  description: string;
  evidenceFileName?: string;
  evidenceUrl?: string;
  findingAssociated?: string; // Título o descripción del hallazgo
  actionAssociated?: string;
  status: 'ABIERTO' | 'EN_PROCESO' | 'CERRADO';
  closedDate?: string;
  sentToAcpm?: boolean;
  linkedAcpmId?: string;
  registeredBy: string;
}

// --------------------------------------------------
// Proceso Electoral COPASST (>= 10 trabajadores)
// --------------------------------------------------
export interface CopasstCandidate {
  id: string;
  workerId: string;
  registrationDate: string;
  proposalBrief?: string;
  status: 'POSTULADO' | 'ACEPTADO' | 'RETIRADO';
  votesCount: number;
  isElected: boolean;
  electedRole?: 'PRINCIPAL' | 'SUPLENTE';
}

export interface CopasstVoterAuditEntry {
  voterDocNumber: string; // Solo para control de voto único (separado del secreto del voto)
  votedAt: string; // Timestamp
  ipAddress?: string;
}

export interface CopasstElectionState {
  periodStart: string; // e.g. "2025" o "2026-03"
  periodEnd: string; // 2 años
  convocationDate: string;
  candidatesPublicationDate: string;
  votingStartDate: string;
  votingEndDate: string;
  isVotingOpen: boolean;
  isClosed: boolean;
  closedAt?: string;
  closedBy?: string;
  totalEligibleVoters: number;
  voterAuditLog: CopasstVoterAuditEntry[]; // Control de padrón
  candidates: CopasstCandidate[];
  resultsPublished: boolean;
  publicVotingUrlToken: string; // Token para url de votación pública sin credenciales
}

// --------------------------------------------------
// Reuniones Mensuales del COPASST (Decreto 1072 Art. 2.2.4.6.8)
// --------------------------------------------------
export type CopasstMeetingModality = 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';

export interface CopasstMeetingCommitment {
  id: string;
  meetingId: string;
  description: string;
  responsibleWorkerId: string;
  responsibleName: string;
  dueDate: string; // YYYY-MM-DD
  status: 'PENDIENTE' | 'EN_PROCESO' | 'CUMPLIDO' | 'VENCIDO';
  evidenceFileName?: string;
  verifiedAt?: string;
  linkedTaskId?: string; // Vinculado a tasks ("¿Qué tengo pendiente?")
}

export interface CopasstMeeting {
  id: string;
  meetingNumber: number; // e.g. 1, 2, 3...
  actaCode: string; // e.g. "ACTA-COP-2026-01"
  date: string; // YYYY-MM-DD
  modality: CopasstMeetingModality;
  locationOrLink: string;
  attendeesWorkerIds: string[];
  absenteesWorkerIds: string[];
  agendaTopics: string[];
  discussionSummary: string;
  recommendations: string[];
  decisions: string[];
  commitments: CopasstMeetingCommitment[];
  signedByPresident: boolean;
  signedBySecretary: boolean;
  isClosed: boolean;
  documentPdfUrl?: string;
  evidenceIds: string[];
}

// --------------------------------------------------
// Hallazgos generados por el COPASST / Vigía
// --------------------------------------------------
export type CopasstFindingClassification = 
  | 'NO_CONFORMIDAD'
  | 'OPORTUNIDAD_MEJORA'
  | 'OBSERVACION'
  | 'CONDICION_INSEGURA'
  | 'INCUMPLIMIENTO';

export interface CopasstFindingItem {
  id: string;
  sourceType: 'COPASST_REUNION' | 'VIGIA_ACTUACION' | 'INSPECCION_SEGURIDAD';
  sourceRef: string; // e.g. "Acta No. 03" o "Inspección de Puestos"
  date: string;
  classification: CopasstFindingClassification;
  description: string;
  processName: string;
  areaName: string;
  relatedWorkerName?: string;
  legalRequirementRef?: string; // e.g. "Dec 1072 Art. 2.2.4.6.15"
  hazardRiskRef?: string; // e.g. "Biomecánico / Posturas prolongadas"
  controlRef?: string;
  proposedAction: string;
  evidenceFileName?: string;
  sentToAcpm: boolean;
  linkedAcpmId?: string;
  status: 'ABIERTO' | 'EN_ACPM' | 'RESUELTO';
}

// --------------------------------------------------
// Capacitaciones del COPASST / Vigía (Estándar 1.1.7)
// --------------------------------------------------
export interface CopasstTrainingCourse {
  id: string;
  topic: string;
  entityOrTrainer: string;
  date: string;
  durationHours: number;
  attendedWorkerIds: string[];
  certificateUrl?: string;
  evidenceFileName?: string;
  status: 'PROGRAMADA' | 'EJECUTADA';
}

// --------------------------------------------------
// Estado Global del Componente COPASST / Vigía
// --------------------------------------------------
export interface CopasstGlobalState {
  mechanismType: CopasstMechanismType;
  ruleExplanation: string;
  periodYears: number;
  periodStart: string;
  periodEnd: string;
  status: CopasstApplicabilityStatus;
  
  // En caso de Vigía (< 10)
  vigiaProfile: VigiaProfile | null;
  vigiaActuations: VigiaActuation[];

  // En caso de COPASST (>= 10)
  election: CopasstElectionState;
  members: CopasstMember[];
  presidentWorkerId?: string; // Empleador
  secretaryWorkerId?: string; // Comité
  conformationActDate?: string;
  conformationActNumber?: string;
  installationActDate?: string;
  
  // Actividades periódicas
  meetings: CopasstMeeting[];
  commitments: CopasstMeetingCommitment[];
  findings: CopasstFindingItem[];
  trainings: CopasstTrainingCourse[];
}
