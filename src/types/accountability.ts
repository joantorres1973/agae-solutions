// =====================================================================
// ESTÁNDAR 2.3.1: RENDICIÓN DE CUENTAS SOBRE EL DESEMPEÑO EN SST
// Base Legal: Decreto 1072 de 2015 Art. 2.2.4.6.8 Numeral 3
//             Resolución 0312 de 2019 Estándar 2.3.1
// AGAE SOLUTIONS - Sistema de Gestión de Seguridad y Salud en el Trabajo
// =====================================================================

export type AccountabilityRoleCategory =
  | 'ALTA_DIRECCION'              // Representante legal, Gerente general
  | 'RESPONSABLE_SST'             // Líder HSEQ, Coordinador SG-SST con licencia
  | 'LIDERES_PROCESO'             // Jefes de área y líderes de procesos misionales
  | 'SUPERVISORES_MANDOS_MEDIOS'  // Supervisores de campo, coordinadores operativos
  | 'COMITES_BRIGADAS'            // Integrantes COPASST, CCL, Brigadistas
  | 'TRABAJADORES_FUNCIONES_SST'; // Trabajadores con funciones específicas delegadas

export type AccountabilityStatus =
  | 'PENDIENTE'             // No iniciada por el responsable
  | 'EN_ELABORACION'        // En diligenciamiento de justificaciones y explicaciones
  | 'PENDIENTE_REVISION'    // Enviada para retroalimentación y revisión jerárquica
  | 'FINALIZADA';           // Aprobada con firmas electrónicas y soporte generado

export type PatActivityExecutionStatus =
  | 'PROGRAMADA'
  | 'EJECUTADA'
  | 'PENDIENTE'
  | 'VENCIDA'
  | 'REPROGRAMADA';

export type PatActivityVerificationStatus =
  | 'VERIFICADA_EFICAZ'
  | 'PENDIENTE_VERIFICACION'
  | 'NO_VERIFICADA'
  | 'NO_APLICA';

// --------------------------------------------------
// 1. Actividad del Plan Anual de Trabajo (PAT)
// --------------------------------------------------
export interface AnnualPlanActivity {
  id: string;
  code: string;                           // e.g. "PAT-SST-2026-001"
  title: string;
  category:
    | 'POLITICA_OBJETIVOS'
    | 'CAPACITACION_ENTRENAMIENTO'
    | 'INSPECCIONES_SEGURIDAD'
    | 'MEDICINA_PREVENTIVA'
    | 'HIGIENE_MEDICIONES'
    | 'COPASST_COMITES'
    | 'EMERGENCIAS_BRIGADA'
    | 'IDENTIFICACION_PELIGROS'
    | 'AUDITORIA_REVISION'
    | 'ACPM_MEJORA'
    | 'PRESUPUESTO_RECURSOS';
  processName: string;
  assignedWorkerId: string;
  assignedWorkerName: string;
  assignedWorkerPosition: string;
  period: string;                         // e.g. "2026", "2025"
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ANUAL';
  dueDate: string;                        // YYYY-MM-DD
  completedDate?: string;                 // YYYY-MM-DD
  executionStatus: PatActivityExecutionStatus;
  verificationStatus: PatActivityVerificationStatus;
  evidenceIds: string[];
  evidenceFileNames: string[];
  resultsObtained?: string;
  difficultiesFaced?: string;
  linkedAcpmId?: string;
  originModule?: string;                  // e.g. "TRAINING", "COPASST", "INSPECTIONS", "BUDGET"
}

// --------------------------------------------------
// 2. Métrica Consolidada del Plan Anual por Responsable
// --------------------------------------------------
export interface WorkerPatMetrics {
  totalAssigned: number;
  scheduledInPeriod: number;
  executedAndVerified: number;
  executedPendingVerification: number;
  pendingCount: number;
  overdueCount: number;
  rescheduledCount: number;
  exigibleCount: number;
  compliancePercentage: number | null;     // null si no hay actividades exigibles
  complianceDisplay: string;               // e.g. "8 / 10 (80.0%)" o "Sin actividades exigibles"
  hasPendingPreviousCommitments: boolean;
  linkedAcpmCount: number;
}

// --------------------------------------------------
// 3. Formulario y Registro Individual de Rendición de Cuentas
// --------------------------------------------------
export interface AccountabilityReport {
  id: string;
  code: string;                            // e.g. "IF-SGSST-GEN-002"
  period: string;                          // e.g. "2026"
  workerId: string;
  workerName: string;
  workerDocNumber: string;
  workerPosition: string;
  workerArea: string;
  roleCategory: AccountabilityRoleCategory;
  sstRoleTitle: string;                    // e.g. "Responsable del SG-SST (Licencia 1020784)"
  assignedResponsibilities: string[];      // Responsabilidades formales SST comunicadas
  status: AccountabilityStatus;
  dueDate: string;
  completedAt?: string;
  
  // Contenido diligenciado por el Responsable
  managementDescription: string;           // Descripción general de la gestión realizada
  achievedResults: string;                 // Resultados e impactos alcanzados
  unexecutedCauses: string;                // Actividades no ejecutadas y análisis de causas
  difficultiesFaced: string;               // Dificultades o barreras operativas presentadas
  resourcesRequired: string;               // Recursos requeridos o limitaciones presupuestales
  incidentHighlights: string;              // Incidentes, situaciones relevantes o necesidades de intervención
  proposedImprovements: string;            // Acciones correctivas o de mejora propuestas (ACPM)
  commitmentsNextPeriod: string;           // Compromisos y metas para el siguiente periodo
  additionalObservations?: string;         // Observaciones adicionales del trabajador

  // Revisión jerárquica / Auditoría
  reviewedAt?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewerPosition?: string;
  reviewerObservations?: string;
  reviewerApproved?: boolean;

  // Firmas electrónicas
  workerSignedAt?: string;
  workerSignatureToken?: string;
  reviewerSignedAt?: string;
  reviewerSignatureToken?: string;

  // Integración Repositorio Documental Centralizado (2.2.1)
  registeredInRepository: boolean;
  documentMasterCode?: string;

  // Trazabilidad inmutable de acciones
  historyLog: {
    id: string;
    timestamp: string;
    action: string;
    author: string;
    note?: string;
  }[];
}

// --------------------------------------------------
// 4. Informe Consolidado Corporativo de Rendición de Cuentas
// --------------------------------------------------
export interface AccountabilityConsolidatedReport {
  id: string;
  code: string;                            // e.g. "IF-SGSST-GEN-003"
  period: string;
  generatedAt: string;
  totalEligibleWorkers: number;
  completedCount: number;
  inReviewCount: number;
  inProgressCount: number;
  pendingCount: number;
  globalComplianceRate: number;            // Porcentaje consolidado
  keyGapsIdentified: string[];             // Brechas detectadas a nivel empresa
  strategicCommitments: string[];          // Compromisos organizacionales para Revisión por Dirección
  approvedByManager: boolean;
  managerName: string;
  managerSignedAt?: string;
  documentMasterCode?: string;
}

// --------------------------------------------------
// 5. Estado Global del Módulo de Rendición de Cuentas
// --------------------------------------------------
export interface AccountabilityState {
  currentPeriod: string;
  availablePeriods: string[];
  patActivities: AnnualPlanActivity[];
  reports: AccountabilityReport[];
  consolidatedReports: AccountabilityConsolidatedReport[];
}
