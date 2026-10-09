// ============================================================================
// Tipos del Programa de Capacitación, Formación, Inducción y Reinducción
// Estándar 1.2 (Resolución 0312 de 2019) y Decreto 1072 de 2015 Art. 2.2.4.6.11
// ============================================================================

export type TrainingActivityType =
  | 'INDUCCION'
  | 'REINDUCCION'
  | 'SST_GENERAL'
  | 'RIESGO_ESPECIFICO'
  | 'EMERGENCIAS_BRIGADA'
  | 'COPASST'
  | 'CCL'
  | 'PESV_SEGURIDAD_VIAL'
  | 'AMBIENTAL'
  | 'CALIDAD'
  | 'OTRO';

export type TrainingTargetAudienceType =
  | 'TODOS'
  | 'AREA'
  | 'CARGO'
  | 'PROCESO'
  | 'CENTRO_TRABAJO'
  | 'GRUPO_RIESGO'
  | 'PERSONALIZADO';

export type TrainingModality =
  | 'PRESENCIAL'
  | 'VIRTUAL_SINCRONICA'
  | 'AULA_VIRTUAL_AGAE'
  | 'HIBRIDA';

export type TrainingStatus =
  | 'PROGRAMADA'
  | 'EN_EJECUCION'
  | 'EJECUTADA'
  | 'REPROGRAMADA'
  | 'CANCELADA'
  | 'NO_EJECUTADA'
  | 'PENDIENTE_EVIDENCIA'
  | 'PENDIENTE_EVALUACION'
  | 'CERRADA';

export interface TrainingRescheduleHistoryEntry {
  id: string;
  originalDate: string;
  newDate: string;
  reason: string;
  registeredBy: string;
  registeredAt: string;
  notes?: string;
}

export interface TrainingAttendanceEntry {
  workerId: string;
  workerName: string;
  workerDocNumber: string;
  workerPosition: string;
  attended: boolean;
  evaluationScore?: number; // 0 a 100
  approved: boolean;
  certificateCode?: string;
  signatureToken?: string;
  registeredAt?: string;
}

export interface TrainingPlanActivity {
  id: string;
  code: string; // e.g. "CAP-2026-001"
  topic: string;
  objective: string;
  activityType: TrainingActivityType;
  targetAudienceType: TrainingTargetAudienceType;
  targetAudienceDetail?: string; // e.g. "Personal Operativo de Cargue y Despacho"
  targetWorkerIds: string[]; // Conexión a Base Maestra de Trabajadores
  scheduledWorkerCount: number;
  responsible: string;
  facilitator: string;
  facilitatorEntity: 'INTERNO' | 'ARL' | 'EXTERNO' | 'AGAE_SOLUTIONS';
  modality: TrainingModality;
  scheduledDate: string; // YYYY-MM-DD
  scheduledMonth: number; // 1-12
  estimatedDurationHours: number;
  requiredResources: string;
  locationOrLink: string;
  status: TrainingStatus;
  
  // Ejecución
  actualDate?: string;
  actualDurationHours?: number;
  attendeesCount: number;
  attendanceRate: number; // % (asistentes / programados * 100)
  evaluationRequired: boolean;
  passingScoreMin: number; // e.g. 80%
  averageEvaluationScore?: number;
  evidenceFileNames: string[];
  evidenceIds?: string[];
  observations?: string;
  
  // Trazabilidad de Reprogramación y No Ejecución
  rescheduleHistory: TrainingRescheduleHistoryEntry[];
  notExecutedReason?: string;
  notExecutedDecision?: string;
  
  // Asistencias individuales
  attendees: TrainingAttendanceEntry[];
  
  // Interconexión Transversal
  linkedVirtualCourseId?: string; // Enlace a Aula Virtual AGAE
  linkedHazardClass?: string;     // GTC 45 (Biológico, Físico, Químico, Psicosocial, Biomecánico, Condiciones de Seguridad)
  linkedAcpmId?: string;          // Si proviene o alimenta una acción correctiva
  linkedStandardCode?: string;    // "1.2.1", "1.1.7", "1.1.8", "4.1.1"
  
  // Columnas dinámicas personalizables
  customColumns?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// --------------------------------------------------
// B. AULA VIRTUAL AGAE (Capacitaciones Virtuales)
// --------------------------------------------------
export type VirtualCourseCategory =
  | 'SEGURIDAD_VIAL_PESV'
  | 'RIESGOS_FISICOS_MECANICOS'
  | 'RIESGO_BIOMECANICO'
  | 'RIESGO_PSICOSOCIAL'
  | 'EMERGENCIAS_EXTINTORES'
  | 'EPP_TRABAJO_SEGURO'
  | 'AMBIENTAL_RESIDUOS'
  | 'ORDEN_ASEO_5S';

export type QuizQuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SINGLE_CHOICE';

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuizQuestionType;
  options: string[];
  correctAnswerIndex: number; // 0, 1, 2, 3...
  explanation?: string;
}

export interface VirtualCourse {
  id: string;
  code: string; // e.g. "CUR-BIO-001"
  title: string;
  description: string;
  objective: string;
  category: VirtualCourseCategory;
  durationMinutes: number;
  targetAudience: string;
  videoUrl: string;
  videoThumbnailUrl?: string;
  videoDurationSeconds: number;
  minWatchPercentageRequired: number; // e.g. 80%
  supplementaryMaterialUrls?: { title: string; url: string }[];
  questionsCount: number;
  minPassingPercentage: number; // e.g. 80%
  maxAttempts: number; // e.g. 3
  validityMonths: number; // e.g. 12
  isPublished: boolean;
  version: string;
  questions: QuizQuestion[];
  publicEnrollmentUrlToken: string;
  facilitatorName: string;
  facilitatorTitle: string;
}

// --------------------------------------------------
// C. CERTIFICADOS DIGITALES VERIFICABLES
// --------------------------------------------------
export interface VirtualCertificate {
  id: string;
  code: string; // e.g. "AGA-CAP-2026-000154"
  courseId: string;
  courseTitle: string;
  workerId?: string; // Enlace a Base Maestra
  workerName: string;
  workerDocNumber: string;
  companyName: string;
  issueDate: string;
  hours: number;
  scorePercentage: number;
  status: 'VALIDO' | 'ANULADO';
  verificationUrl: string;
  facilitatorName: string;
  qrCodeData: string;
  registeredInMasterWorker: boolean;
}

// --------------------------------------------------
// D. INDUCCIÓN Y REINDUCCIÓN EN SST (Dec. 1072)
// --------------------------------------------------
export interface InductionPackage {
  id: string;
  workerId: string; // Base Maestra
  workerName: string;
  workerDocNumber: string;
  workerPosition: string;
  workerArea: string;
  hireDate: string;
  type: 'INDUCCION' | 'REINDUCCION';
  status: 'PENDIENTE' | 'EN_CURSO' | 'EVALUADO_APROBADO' | 'REPROBADO';
  assignedDate: string;
  dueDate: string; // Antes del inicio de labores
  completedDate?: string;
  generalTopicsCovered: string[];
  jobSpecificTopicsCovered: string[];
  evaluationScore?: number;
  evaluatorName: string;
  evidenceFileName?: string;
  certificateCode?: string;
  isRegisteredInProfile: boolean;
}

// --------------------------------------------------
// E. SUGERENCIAS DE IA (PROGRAMACIÓN INTELIGENTE)
// --------------------------------------------------
export interface AiTrainingSuggestion {
  id: string;
  proposedTopic: string;
  objective: string;
  rationale: string; // Análisis cruzado del SG-SST
  source:
    | 'MATRIZ_PELIGROS'
    | 'ACPM_HALLAZGOS'
    | 'INVESTIGACION_ACCIDENTES'
    | 'COPASST'
    | 'CCL'
    | 'REQUISITO_LEGAL'
    | 'NUEVO_PERSONAL';
  recommendedTargetAudience: string;
  recommendedHours: number;
  priority: 'CRITICA' | 'ALTA' | 'MEDIA';
  status: 'SUGERIDA' | 'APROBADA' | 'DESCARTADA';
  linkedHazardId?: string;
  linkedAcpmId?: string;
}

// --------------------------------------------------
// F. ESTADO GLOBAL DEL MÓDULO DE CAPACITACIÓN
// --------------------------------------------------
export interface TrainingGlobalState {
  currentYear: number;
  planActivities: TrainingPlanActivity[];
  virtualCourses: VirtualCourse[];
  certificates: VirtualCertificate[];
  inductions: InductionPackage[];
  aiSuggestions: AiTrainingSuggestion[];
  customColumns: { id: string; label: string }[];
  lastEvaluationAudit: string;
  copasstApprovalDate?: string;
  managementApprovalDate?: string;
}
