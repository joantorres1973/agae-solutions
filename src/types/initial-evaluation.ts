export type InitialEvaluationItemStatus = 
  | 'CUMPLE'
  | 'CUMPLE_PARCIALMENTE'
  | 'NO_CUMPLE'
  | 'NO_APLICA'
  | 'PENDIENTE';

export type InitialEvaluationReviewStatus = 
  | 'VERIFICADO'
  | 'PENDIENTE_VERIFICACION'
  | 'REQUIERE_REVISION';

export type InitialEvaluationOverallStatus = 
  | 'EN_ELABORACION'
  | 'PENDIENTE_VALIDACION'
  | 'FINALIZADA';

export type InitialEvaluationActionStatus = 
  | 'PENDIENTE'
  | 'EN_EJECUCION'
  | 'EJECUTADA_PENDIENTE_VERIFICACION'
  | 'CERRADA'
  | 'VENCIDA';

export type InitialEvaluationComponentId = 
  | 'COMP-01-NORMATIVIDAD'
  | 'COMP-02-PELIGROS-RIESGOS'
  | 'COMP-03-AMENAZAS-EMERGENCIAS'
  | 'COMP-04-EFECTIVIDAD-CONTROLES'
  | 'COMP-05-CAPACITACION-INDUCCION'
  | 'COMP-06-PUESTOS-VIGILANCIA'
  | 'COMP-07-SOCIODEMOGRAFICO-ATEL'
  | 'COMP-08-INDICADORES-ANTERIORES'
  | 'COMP-09-COMUNICACION-PARTICIPACION'
  | 'COMP-10-RECURSOS-PLAN-TRABAJO';

export interface InitialEvaluationComponentDef {
  id: InitialEvaluationComponentId;
  numeral: number;
  title: string;
  shortTitle: string;
  legalBasis: string;
  description: string;
  color: string;
}

export interface InitialEvaluationSourceModuleRef {
  moduleCode: string;
  moduleName: string;
  routeTab: string;
  evidenceName: string;
  lastUpdated?: string;
  statusBadge: 'DISPONIBLE' | 'PARCIAL' | 'NO_REGISTRADO' | 'REQUIERE_ACTUALIZACION';
  details?: string;
}

export interface InitialEvaluationItem {
  id: string;
  componentId: InitialEvaluationComponentId;
  code: string;
  numeralIndex: number;
  aspect: string;
  legalBasis: string;
  verificationMethod: string;
  requiredEvidence: string;
  sourceModule: InitialEvaluationSourceModuleRef;
  status: InitialEvaluationItemStatus;
  justificationNonApplicable?: string;
  evaluatorObservations: string;
  identifiedGap?: string;
  recommendedAction?: string;
  responsibleValidator: string;
  evaluationDate: string;
  reviewStatus: InitialEvaluationReviewStatus;
  evidenceAttachments?: string[];
  actionPlanId?: string;
}

export interface InitialEvaluationAction {
  id: string;
  criterionId: string;
  criterionCode: string;
  componentId: InitialEvaluationComponentId;
  gapDescription: string;
  requiredAction: string;
  responsible: string;
  dueDate: string;
  resourcesNeeded?: string;
  implementationEvidence?: string;
  status: InitialEvaluationActionStatus;
  verificationEfficacy?: string;
  closedAt?: string;
  closedBy?: string;
  sentToAcpm: boolean;
  acpmFindingId?: string;
  createdAt: string;
}

export interface InitialEvaluationMetrics {
  totalCriteria: number;
  evaluatedCriteria: number;
  pendingCriteria: number;
  compliantCriteria: number;
  partialCriteria: number;
  nonCompliantCriteria: number;
  notApplicableCriteria: number;
  totalGaps: number;
  evaluationProgressPercentage: number;
  complianceScorePercentage: number;
  componentScores: {
    componentId: InitialEvaluationComponentId;
    componentTitle: string;
    total: number;
    compliant: number;
    partial: number;
    nonCompliant: number;
    pending: number;
    notApplicable: number;
    scorePercentage: number;
  }[];
}

export interface InitialEvaluationHistoryRecord {
  id: string;
  periodYear: string;
  evaluationDate: string;
  version: number;
  evaluatorName: string;
  evaluatorRole: string;
  approverName: string;
  complianceScorePercentage: number;
  totalGaps: number;
  status: InitialEvaluationOverallStatus;
  technicalConclusions: string;
}

export interface InitialEvaluationState {
  id: string;
  version: number;
  evaluationPeriod: string;
  status: InitialEvaluationOverallStatus;
  evaluatorName: string;
  evaluatorRole: string;
  evaluatorLicense: string;
  approverName: string;
  approverRole: string;
  startedAt: string;
  updatedAt: string;
  finalizedAt?: string;
  items: InitialEvaluationItem[];
  actions: InitialEvaluationAction[];
  technicalConclusions: string;
  technicalRecommendations: string;
  history: InitialEvaluationHistoryRecord[];
}
