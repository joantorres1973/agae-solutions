// ============================================================================
// Tipos para el Módulo de Archivo y Retención Documental (Estándar 2.2.1)
// Conforme al Decreto 1072 de 2015 Art. 2.2.4.6.12, Art. 2.2.4.6.13 e ISO 9001 Numeral 7.5
// ============================================================================

export type ManagementSystemType = 'SGSST' | 'PESV' | 'AMBIENTAL' | 'CALIDAD' | 'INTEGRADO' | 'GENERAL';

export type DocumentStatus =
  | 'EN_ELABORACION'
  | 'PENDIENTE_REVISION'
  | 'PENDIENTE_APROBACION'
  | 'VIGENTE'
  | 'OBSOLETO'
  | 'ARCHIVADO';

export type DocumentConfidentiality =
  | 'PUBLICO'
  | 'INTERNO'
  | 'CONFIDENCIAL'
  | 'RESTRINGIDO'
  | 'MEDICA_RESTRINGIDA'
  | 'CONFIDENCIAL_MEDICO';

export type StorageSupportType = 'DIGITAL_CLOUD' | 'FISICO' | 'HIBRIDO';

export interface DocumentTypeCatalogItem {
  id?: string;
  code: string; // e.g. "AC", "PR", "FT", "RG"
  prefix?: string; // alias for code
  name: string; // e.g. "Acta", "Procedimiento", "Formato"
  description: string;
  isDefault?: boolean;
  isSystemDefault?: boolean;
  isActive?: boolean;
}

export interface DocumentProcessCatalogItem {
  id?: string;
  code: string; // e.g. "GEN", "COP", "CCL", "CAP", "INS"
  name: string; // e.g. "General", "COPASST", "Convivencia"
  description: string;
  isDefault?: boolean;
  isSystemDefault?: boolean;
  isActive?: boolean;
}

export interface DocumentVersionHistoryItem {
  version: string; // e.g. "001", "002"
  approvedDate: string;
  approvedBy: string;
  changeSummary: string;
  status: DocumentStatus;
  fileUrl?: string;
}

export interface ControlledDocument {
  id: string;
  code: string; // e.g. "AC-SGSST-COP-001"
  title: string;
  description?: string;
  system: ManagementSystemType;
  processCode: string; // e.g. "COP"
  processId?: string; // alias for processCode
  processName: string;
  typeCode: string; // e.g. "AC"
  documentTypeId?: string; // alias for typeCode
  typeName: string;
  originModule: string; // e.g. "1.1.6 COPASST", "4.1.2 Matriz Peligros", "1.2 Capacitación"
  responsibleRole: string; // e.g. "Presidente COPASST", "Líder SG-SST"
  responsible?: string; // alias for responsibleRole or authorName
  authorName: string;
  reviewerName?: string;
  approverName?: string;
  approvedBy?: string; // alias
  createdDate: string;
  createdAt?: string; // alias
  approvedDate?: string;
  approvedAt?: string; // alias
  lastUpdatedDate: string;
  updatedAt?: string; // alias
  currentVersion: string; // e.g. "001", "002"
  status: DocumentStatus;
  storageSupport: StorageSupportType;
  physicalLocation?: string;
  digitalPath?: string;
  fileUrl?: string;
  originRouteTab?: string; // Tab inside AGAE for direct 1-click navigation
  retentionYears: number; // e.g. 20 for medical/training, 5, 1
  retentionLegalBasis: string; // e.g. "Dec 1072/15 Art. 2.2.4.6.13 (20 años posteriores al cese)"
  retentionBasis?: string; // alias
  retentionStartEvent: 'FECHA_EMISION' | 'CESE_LABORAL' | 'CIERRE_ANUAL';
  confidentiality: DocumentConfidentiality;
  isControlledDocument: boolean; // true = Procedimiento/Manual/Formato; false = Registro de ejecución
  isMandatory20Years?: boolean;
  isExternalDocument?: boolean;
  isExternal?: boolean; // alias
  externalEntity?: string;
  externalSource?: string; // alias
  externalIssueDate?: string;
  externalCode?: string;
  versionHistory: DocumentVersionHistoryItem[];
  notes?: string;
}

export interface ProcedureSection {
  id: string;
  number: string;
  title: string;
  content: string;
  isCustom?: boolean;
  isCustomized?: boolean; // alias
  notes?: string;
}

export interface DocumentControlProcedure {
  documentCode: string; // e.g. "PR-SGSST-GEN-001"
  code?: string; // alias
  title: string;
  version: string;
  issueDate: string;
  lastReviewDate: string;
  lastUpdatedAt?: string; // alias
  status: DocumentStatus;
  preparedBy: {
    name: string;
    role: string;
    date: string;
    signatureText?: string;
  };
  reviewedBy: {
    name: string;
    role: string;
    date: string;
    signatureText?: string;
  };
  approvedBy: {
    name: string;
    role: string;
    date: string;
    signatureText?: string;
  };
  sections: ProcedureSection[];
}

export interface DocumentRetentionRule {
  id: string;
  categoryName: string;
  category?: string; // alias
  description: string;
  retentionYears: number;
  retentionStartRule: string;
  computationStart?: string; // alias
  legalBasis: string;
  custodianRole: string;
  custodian?: string; // alias
  confidentiality: DocumentConfidentiality;
  mandatoryByDec1072_20Years: boolean;
  associatedTypes: string[];
}

export interface DocumentMasterMetrics {
  totalDocuments: number;
  activeDocuments: number;
  inDraftDocuments?: number;
  draftDocuments?: number; // alias
  pendingApprovalDocuments?: number;
  obsoleteDocuments: number;
  externalDocuments: number;
  twentyYearsRetentionDocuments?: number;
  mandatory20YearsCount?: number; // alias
  compliancePercentage: number;
}

export interface DocumentManagementState {
  procedure: DocumentControlProcedure;
  documents: ControlledDocument[];
  typeCatalog: DocumentTypeCatalogItem[];
  typesCatalog?: DocumentTypeCatalogItem[]; // alias
  processCatalog: DocumentProcessCatalogItem[];
  processesCatalog?: DocumentProcessCatalogItem[]; // alias
  retentionRules: DocumentRetentionRule[];
  lastSequentialMap: Record<string, number>; // Maps "[TYPE]-[SYSTEM]-[PROCESS]" to latest number
  status: 'EN_ELABORACION' | 'PENDIENTE_VALIDACION' | 'APROBADO_VIGENTE';
  updatedAt: string;
  metrics: DocumentMasterMetrics;
}
