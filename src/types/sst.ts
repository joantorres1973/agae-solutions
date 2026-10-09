export type SstStandardCycle = 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR';

export type SstStandardStatus = 'CUMPLE' | 'NO_CUMPLE' | 'NO_APLICA_JUSTIFICADO' | 'EN_PROCESO';

export interface SstStandardDefinition {
  id: string;
  code: string; // e.g. "1.1.1"
  cycle: SstStandardCycle;
  numeralGroup: string; // e.g. "1.1 Recursos financieros, técnicos, humanos y de otra índole"
  title: string;
  criterion: string; // Criterio Resolución 0312
  decreto1072Article: string; // e.g. "Art. 2.2.4.6.8 Parágrafo 1 y Art. 2.2.4.6.35"
  decreto1072Title: string; // e.g. "Obligaciones de los empleadores - Asignación de Responsable"
  decreto1072Excerpt: string; // Texto legal citado
  weight: number; // Porcentaje oficial de ponderación (e.g. 0.5, 2.0, 4.0, etc.)
  applicableIn7: boolean;
  applicableIn21: boolean;
  applicableIn60: boolean;
  modeOfVerification: string; // Modo de verificación según Res. 0312
  status: SstStandardStatus;
  evidenceIds: string[];
  actionType?: 'RESPONSIBLE' | 'BUDGET' | 'COPASST' | 'CCL' | 'TRAINING' | 'POLICY' | 'HAZARDS' | 'INSPECTION' | 'EMERGENCY' | 'EVIDENCE' | 'ACPM' | 'INITIAL_EVALUATION' | 'DOCUMENTATION' | 'ACCOUNTABILITY' | 'LEGAL_MATRIX' | 'GENERAL';
  notes?: string;
}

export interface SstResponsibleProfile {
  fullName: string;
  docType: 'CC' | 'CE' | 'PASAPORTE';
  docNumber: string;
  professionalRole: 'TECNICO' | 'TECNOLOGO' | 'PROFESIONAL' | 'ESPECIALISTA';
  profession: string;
  licenseNumber: string;
  licenseExpDate: string;
  course50hDate: string;
  course20hDate: string;
  courseEntity: string;
  appointmentDate: string;
  acceptanceDate: string;
  isFormallyAssigned: boolean;
  hvEvidenceId?: string;
  licenseEvidenceId?: string;
  courseEvidenceId?: string;
  letterSignedAt?: string;
  signedByManager: boolean;
  signedByResponsible: boolean;
  managerName: string;
  managerDocNumber: string;
}

export type BudgetSystem = 'SST' | 'PESV' | 'AMBIENTAL' | 'ISO';
export type BudgetResourceCategory = 
  | 'HUMANO' 
  | 'TECNICO' 
  | 'FISICO' 
  | 'FINANCIERO' 
  | 'CAPACITACION' 
  | 'MEDICO' 
  | 'EPP' 
  | 'EMERGENCIAS';

export interface SstBudgetItem {
  id: string;
  system: BudgetSystem;
  isAllSystems?: boolean; // Aplica a todos los sistemas integrados transversalmente
  category: BudgetResourceCategory;
  concept: string;
  description: string;
  decreto1072Rel: string;
  pesvRel?: string;
  plannedAmount: number;
  committedAmount: number;
  executedAmount: number;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ANUAL';
  responsible: string;
  status: 'PROGRAMADO' | 'EN_EJECUCION' | 'EJECUTADO' | 'AJUSTADO';
  hasObservation?: boolean; // Rubro objetado por la gerencia
  observationComment?: string;
  observationResolved?: boolean; // Marcado como subsanado/corregido
  resolvedAt?: string;
}

export interface BudgetApprovalHistory {
  id: string;
  timestamp: string;
  role: 'GERENCIA' | 'DIRECTOR_FINANCIERO' | 'LIDER_SST' | 'COPASST';
  userName: string;
  action: string;
  comment?: string;
}

export interface DigitalSignatureInfo {
  name: string;
  title: string;
  docNumber: string;
  licenseNumber?: string;
  signedAt: string;
  token: string;
}

export interface CopasstBudgetReview {
  id: string;
  meetingDate: string;
  actaNumber: string;
  reviewedBy: string; // Ej: "Marcela Rincón (Secretaria) y Carlos Mendoza (Presidente)"
  observations: string;
  status: 'CONFORME' | 'CON_OBSERVACIONES';
  timestamp: string;
}

export interface SstBudgetState {
  fiscalYear: number;
  status: 'BORRADOR' | 'EN_REVISION' | 'APROBADO_GERENCIA' | 'RECHAZADO';
  approvalDate?: string;
  approvedBy?: string;
  approvalNotes?: string;
  financialRoleTitle: string; // 'Director Financiero' | 'Contador Público' | 'Director Administrativo y Financiero'
  financialOfficerName: string;
  financialOfficerDoc: string;
  signatures: {
    manager?: DigitalSignatureInfo;
    financial?: DigitalSignatureInfo;
    sstLeader?: DigitalSignatureInfo;
  };
  copasstReviews: CopasstBudgetReview[];
  history: BudgetApprovalHistory[];
}

export type SimulatedRole = 'GERENCIA' | 'LIDER_SST' | 'DIRECTOR_FINANCIERO' | 'AUDITOR_COPASST';
