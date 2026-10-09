// =====================================================================
// ESTÁNDAR 2.4.1: MATRIZ DE REQUISITOS LEGALES
// Base Normativa: Decreto 1072 de 2015 Art. 2.2.4.6.8 Numeral 2 y Art. 2.2.4.6.12 Numeral 15
//                 Resolución 0312 de 2019 Estándar 2.4.1
// AGAE SOLUTIONS - Sistema de Gestión de Seguridad y Salud en el Trabajo
// =====================================================================

export type NormativeLegalType =
  | 'CONSTITUCION'
  | 'LEY'
  | 'DECRETO_LEY'
  | 'DECRETO'
  | 'RESOLUCION'
  | 'CIRCULAR'
  | 'ACUERDO'
  | 'NORMA_TECNICA'
  | 'JURISPRUDENCIA';

export type NormativeJurisdiction =
  | 'NACIONAL'
  | 'DEPARTAMENTAL'
  | 'DISTRITAL_MUNICIPAL';

export type NormativeTopicCategory =
  | 'SST_GENERAL'               // Dec. 1072, Ley 1562, Res. 0312
  | 'MEDICINA_PREVENTIVA'       // Exámenes médicos Res. 2346/07, PVE
  | 'HIGIENE_INDUSTRIAL'        // Ruido Res. 1792/90, Iluminación, Químicos SGA Dec. 1496/18
  | 'SEGURIDAD_INDUSTRIAL'      // Res. 2400/79, Alturas Res. 4272/21, Confinados Res. 0491/20
  | 'COMITES_SST'               // COPASST Res. 2013/86, Convivencia Res. 3461/25
  | 'EMERGENCIAS_BRIGADA'       // Ley 1523/12, Res. 256/14, Planes de Emergencia
  | 'RIESGOS_ESPECIFICOS'       // Biomecánico, Psicosocial Res. 2764/22, Eléctrico RETIE
  | 'SEGURIDAD_VIAL_PESV'       // Ley 1503/11, Res. 40595/22
  | 'GESTION_AMBIENTAL';        // Dec. 1076/15, Residuos Res. 2184/19, Vertimientos

export type LegalNormJuridicalStatus =
  | 'VIGENTE'
  | 'VIGENTE_MODIFICADA'
  | 'DEROGADA_TOTAL'
  | 'DEROGADA_PARCIAL'
  | 'SUSTITUIDA'
  | 'SUSPENDIDA'
  | 'PENDIENTE_VERIFICACION';

export type LegalApplicabilityStatus =
  | 'APLICA'
  | 'APLICA_PARCIAL'
  | 'NO_APLICA'
  | 'PENDIENTE_ANALISIS';

export type LegalComplianceStatus =
  | 'CUMPLE'
  | 'CUMPLE_PARCIAL'
  | 'NO_CUMPLE'
  | 'PENDIENTE_EVALUACION'
  | 'NO_APLICA_JUSTIFICADO';

export type ControlImplementationStatus =
  | 'IMPLEMENTADO'
  | 'EN_PROCESO'
  | 'NO_IMPLEMENTADO';

export type ControlExecutionFrequency =
  | 'CONTINUO'
  | 'DIARIO'
  | 'SEMANAL'
  | 'MENSUAL'
  | 'TRIMESTRAL'
  | 'SEMESTRAL'
  | 'ANUAL'
  | 'EVENTUAL';

// --------------------------------------------------
// 1. Registro Individual de la Matriz Legal
// --------------------------------------------------
export interface LegalRequirementItem {
  id: string;
  internalCode: string;                      // e.g. "LEG-SST-001"
  normType: NormativeLegalType;
  normNumber: string;                        // e.g. "1072"
  normYear: string;                          // e.g. "2015"
  issuingAuthority: string;                  // e.g. "Ministerio del Trabajo"
  title: string;                             // e.g. "Decreto Único Reglamentario del Sector Trabajo"
  issueDate: string;                         // YYYY-MM-DD
  publicationDate?: string;                  // YYYY-MM-DD
  topicCategory: NormativeTopicCategory;
  system: 'SST' | 'PESV' | 'AMBIENTAL' | 'INTEGRADO';
  jurisdiction: NormativeJurisdiction;
  jurisdictionDetail?: string;               // e.g. "Alcaldía Mayor de Bogotá D.C."
  applicableArticles: string;                // e.g. "Art. 2.2.4.6.1 al 2.2.4.6.37"
  specificLegalObligation: string;           // Texto exacto de la obligación exigida
  applicabilityExplanation: string;          // Sustento técnico de aplicabilidad para esta empresa
  
  // Estado Jurídico de la Norma
  juridicalStatus: LegalNormJuridicalStatus;
  derogatedOrModifiedBy?: string;            // Norma modificatoria o derogatoria
  derogationDate?: string;                   // Fecha en que ocurrió la derogatoria/reemplazo
  
  // Aplicabilidad en la Organización
  applicabilityStatus: LegalApplicabilityStatus;
  applicabilityJustification?: string;       // Justificación obligatoria si No Aplica o Aplica Parcial
  
  // Asignación de Responsabilidades
  responsibleProcess: string;                // e.g. "Gestión Integral HSEQ"
  responsibleRole: string;                   // e.g. "Líder HSEQ & Coordinadora SG-SST"
  
  // Controles de Cumplimiento
  requiredControlDescription: string;        // Descripción del control establecido
  controlImplementationStatus: ControlImplementationStatus;
  controlFrequency: ControlExecutionFrequency;
  
  // Evidencias Asociadas
  requiredEvidence: string;                  // Evidencia legal requerida
  existingEvidenceDescription?: string;      // Evidencia real constatada
  linkedModule: string;                      // Módulo origen en AGAE: 'SST', 'TRAINING', 'COPASST', etc.
  evidenceIds: string[];
  evidenceFileNames: string[];
  
  // Evaluación del Cumplimiento Legal
  complianceStatus: LegalComplianceStatus;
  findingsOrObservations?: string;           // Hallazgos técnicos
  improvementActionDescription?: string;     // Acción de mejora propuesta
  evidenceEvaluationNotes?: string;          // Notas de verificación del auditor
  linkedAcpmId?: string;                     // Acción de mejora derivada
  lastEvaluationDate?: string;               // YYYY-MM-DD
  nextReviewDate: string;                    // YYYY-MM-DD
  evaluatorName?: string;
  officialSourceUrl?: string;                // Enlace a fuente oficial (SUIN, MinTrabajo)
  createdAt?: string;
  updatedAt?: string;
  
  // Trazabilidad
  historyLog: {
    id: string;
    date: string;
    action: string;
    author: string;
    note?: string;
  }[];
}

// --------------------------------------------------
// 2. Procedimiento de Identificación y Evaluación Legal (18 Secciones)
// --------------------------------------------------
export interface LegalProcedureSection {
  id: string;
  sectionNumber: number;
  title: string;
  content: string;
  defaultSuggestedContent?: string;
  isCustomized?: boolean;
  lastModifiedAt?: string;
}

export interface LegalRequirementsProcedure {
  code: string;                              // "PR-SGSST-LEG-001"
  version: string;                           // "001"
  title: string;
  reviewFrequency: 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  status?: 'VIGENTE' | 'EN_ELABORACION';
  responsibleRole?: string;
  preparedBy?: string;
  preparedPosition?: string;
  preparedDate?: string;
  reviewedBy?: string;
  reviewedPosition?: string;
  reviewedDate?: string;
  approvedBy?: string;
  approvedPosition?: string;
  approvedDate?: string;
  updatedAt?: string;
  sections: LegalProcedureSection[];
  approvalWorkflow: {
    preparedBy: { name: string; role: string; date: string; signatureToken?: string };
    reviewedBy: { name: string; role: string; date: string; signatureToken?: string };
    approvedBy: { name: string; role: string; date: string; signatureToken?: string };
    isApproved: boolean;
    approvedAt?: string;
  };
}

// --------------------------------------------------
// 3. Alertas de Cambios Normativos
// --------------------------------------------------
export interface LegalChangeAlert {
  id: string;
  normTitle: string;
  normNumber: string;
  changeType: 'NUEVA_NORMA' | 'MODIFICACION' | 'DEROGATORIA' | 'PLAZO_CUMPLIMIENTO';
  impactDescription: string;
  affectedTopics: string[];
  officialSource: string;
  dateDetected: string;
  status: 'PENDIENTE_REVISION' | 'EVALUADO_APLICA' | 'EVALUADO_NO_APLICA';
  reviewedBy?: string;
  reviewedAt?: string;
  actionsTaken?: string;

  // Extended radar tracking fields
  affectedNorm?: string;
  issuingAuthority?: string;
  publishedDate?: string;
  changeSummary?: string;
  reviewStatus?: 'REVISADA' | 'ACCION_ADOPTADA' | 'PENDIENTE_ANALISIS';
  actionsAdopted?: string;
  actionRequired?: boolean;
}

// --------------------------------------------------
// 4. Métricas y Diagnóstico del Cumplimiento Legal
// --------------------------------------------------
export interface LegalMatrixMetrics {
  totalNormsRegistered: number;
  activeNormsCount: number;
  modifiedNormsCount: number;
  derogatedNormsCount: number;
  pendingVerificationCount: number;
  
  totalApplicableObligations: number;
  evaluatedObligationsCount: number;
  compliantCount: number;
  partiallyCompliantCount: number;
  nonCompliantCount: number;
  pendingEvaluationCount: number;
  insufficientEvidenceCount: number;
  
  compliancePercentage: number | null;       // Numerador / Denominador real
  complianceDisplay: string;                 // e.g. "18 / 22 (81.8%)" o "Sin datos suficientes"
  pendingAcpmCount: number;
  upcomingReviewsCount: number;
}

// --------------------------------------------------
// 5. Estado Global del Módulo
// --------------------------------------------------
export interface LegalMatrixState {
  requirements: LegalRequirementItem[];
  procedure: LegalRequirementsProcedure;
  alerts: LegalChangeAlert[];
  lastFullEvaluationDate: string;
  metrics: LegalMatrixMetrics;
}
