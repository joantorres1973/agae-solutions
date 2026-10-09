// ============================================================================
// Tipos de Datos para el Módulo de Política y Objetivos del SG-SST
// Conforme al Decreto 1072 de 2015 (Arts. 2.2.4.6.5 al 2.2.4.6.18)
// y Resolución 0312 de 2019 (Estándares 2.1.1 y 2.1.2)
// ============================================================================

export interface SstPolicyCommitment {
  id: string;
  code: string; // ej. COMP-01, COMP-02, COMP-03, COMP-04
  title: string;
  description: string;
  isMandatoryLegal: boolean; // true para los 3 compromisos mínimos legales del Decreto 1072
  legalArticle: string; // ej. 'Decreto 1072/2015 Art. 2.2.4.6.6 Numeral 1'
  isActive: boolean;
}

export type SstPolicyStatus =
  | 'BORRADOR'
  | 'EN_REVISION'
  | 'APROBADA_Y_FIRMADA'
  | 'REQUIERE_REVISION_ANUAL';

export interface SstPolicyRevisionRecord {
  id: string;
  revisionNumber: string; // ej. '01', '02', '03'
  revisionDate: string; // YYYY-MM-DD
  reviewedBy: string;
  role: string;
  changesSummary: string; // Justificación de cambios o ratificación anual
  status: 'RATIFICADA_SIN_CAMBIOS' | 'ACTUALIZADA_CON_CAMBIOS';
}

export interface SstPolicyDocument {
  id: string;
  version: string; // ej. '03'
  status: SstPolicyStatus;
  companyName: string;
  nit: string;
  economicActivity: string;
  workCentersDescription: string;
  introduction: string;
  scope: string; // Centros de trabajo, trabajadores directos, contratistas, proveedores
  commitments: SstPolicyCommitment[];
  closingStatement: string;
  issuedDate: string; // Fecha de emisión inicial / última firma
  lastRevisionDate: string; // Fecha de última revisión obligatoria anual
  nextRevisionDeadline: string; // Máximo 1 año desde la última revisión (Dec. 1072 Art. 2.2.4.6.7)
  signedByLegalRep: boolean;
  legalRepName: string;
  legalRepDoc: string;
  signedAt?: string;
  leaderSstName: string;
  leaderSstLicense: string;
  leaderSstEndorsed: boolean;
  socializedWithCopasst: boolean;
  socializedWithWorkers: boolean;
  revisionHistory: SstPolicyRevisionRecord[];
}

export type SstObjectiveStatus =
  | 'ACTIVO'
  | 'EN_CUMPLIMIENTO'
  | 'CUMPLIDO'
  | 'EN_RIESGO'
  | 'INCUMPLIDO'
  | 'SIN_SEGUIMIENTO'
  | 'CERRADO';

export type SstObjectiveTargetCriteria =
  | 'SUPERAR_VALOR'      // Avance >= Meta (ej. Cobertura de Capacitaciones >= 85%)
  | 'MANTENER_DEBAJO'    // Avance <= Meta (ej. Tasa de Accidentalidad <= 2.0)
  | 'RANGO';             // RangoMin <= Avance <= RangoMax

export type SstObjectiveFrequency =
  | 'MENSUAL'
  | 'TRIMESTRAL'
  | 'SEMESTRAL'
  | 'ANUAL';

export interface SstObjectiveIndicatorRef {
  id: string;
  name: string;
  type: 'ESTRUCTURA' | 'PROCESO' | 'RESULTADO'; // Dec 1072 Arts. 2.2.4.6.19 al 2.2.4.6.22
  formula: string;
  target: string;
  currentResult?: string;
}

export interface SstObjectiveFollowUp {
  id: string;
  periodEvaluated: string; // ej. 'Q1 2026 (Ene - Mar)' o 'Mes 3 / Marzo 2026'
  evaluatedAt: string; // YYYY-MM-DD
  actualValue: number;
  targetExpected: number;
  progressPercentage: number;
  calculatedStatus: SstObjectiveStatus;
  observations: string;
  evidenceTitle?: string;
  evidenceUrl?: string;
  responsibleName: string;
}

export interface SstObjectiveDeviationAction {
  id: string;
  registeredAt: string;
  period: string;
  deviationAnalysis: string; // Análisis
  rootCause: string; // Causa raíz
  requiredAction: string; // Acción requerida
  responsible: string;
  deadline: string;
  sentToAcpm: boolean;
  acpmFindingId?: string;
}

export interface SstObjectiveItem {
  id: string;
  code: string; // ej. OBJ-SST-01
  name: string;
  description: string;
  policyCommitmentId: string; // Vinculación con compromiso de 2.1.1
  policyCommitmentTitle: string;
  responsible: string;
  period: string; // ej. '2026'
  baseline: string; // Línea base (ej. 'Tasa IF 3.8 en 2025' o '70% de cumplimiento')
  targetValue: number;
  targetUnit: string; // '%', 'Tasa', 'Casos', 'Puntos', 'Horas', 'Eventos'
  targetDeadline: string; // YYYY-MM-DD
  targetCriteria: SstObjectiveTargetCriteria;
  rangeMin?: number;
  rangeMax?: number;
  frequency: SstObjectiveFrequency;
  status: SstObjectiveStatus;
  observations: string;
  indicators: SstObjectiveIndicatorRef[]; // Relación con indicadores
  relatedPrograms: string[]; // Módulos del SG-SST (Capacitaciones 1.2, Inspecciones 4.1, etc.)
  followUps: SstObjectiveFollowUp[];
  deviations: SstObjectiveDeviationAction[];
  createdAt: string;
  updatedAt: string;
}

export interface SstPolicyObjectivesState {
  policy: SstPolicyDocument;
  objectives: SstObjectiveItem[];
}
