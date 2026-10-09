export * from './sst';
export * from './characterization';
export * from './worker';
export * from './social-security';
export * from './copasst';
export * from './ccl';
export * from './training';

export type ModuleType = 
  | 'SST'
  | 'ENVIRONMENTAL'
  | 'PESV'
  | 'ISO_9001'
  | 'ISO_14001'
  | 'ISO_45001'
  | 'HUELLA_CARBONO'
  | 'TRANSVERSAL';

export type PesvLevel = 'BASICO' | 'ESTANDAR' | 'AVANZADO';
export type SstStandardCount = 7 | 21 | 60;

export interface Site {
  id: string;
  name: string;
  city: string;
  address: string;
  workerCount: number;
}

export interface Process {
  id: string;
  code: string;
  name: string;
  type: 'ESTRATEGICO' | 'MISIONAL' | 'APOYO' | 'EVALUACION';
  leader: string;
}

export interface Organization {
  id: string;
  name: string;
  nit: string;
  ciiu: string;
  economicActivity: string;
  riskLevelArl: 1 | 2 | 3 | 4 | 5;
  employeeCount: number;
  contractorCount: number;
  sites: Site[];
  processes: Process[];
  pesvLevel: PesvLevel;
  sstStandardCount: SstStandardCount;
  activeModules: ModuleType[];
  /** Calculadora de huella de carbono habilitada en el plan (undefined = plan anterior, se asume habilitada). */
  huellaCarbonoHabilitada?: boolean;
  logoUrl?: string;
}

export type AssetCategory = 'EXTINGUISHER' | 'FIRST_AID' | 'VEHICLE' | 'MACHINERY' | 'EQUIPMENT' | 'ALARM';

export interface SharedAsset {
  id: string;
  code: string;
  name: string;
  category: AssetCategory;
  siteId: string;
  siteName: string;
  processId: string;
  processName: string;
  locationDetails: string;
  status: 'OPERATIVO' | 'MANTENIMIENTO' | 'BAJA' | 'REVISION_PENDIENTE';
  lastInspectionDate: string;
  nextInspectionDate: string;
  meta?: Record<string, string | number | boolean>;
}

export type FindingSeverity = 'CRITICA' | 'MAYOR' | 'MENOR' | 'OBSERVACION';
export type FindingOrigin = 'AUDIT' | 'INSPECTION' | 'ACCIDENT' | 'LEGAL_REQUIREMENT' | 'ROUTINE';

export interface Finding {
  id: string;
  code: string;
  title: string;
  originModule: ModuleType;
  originType: FindingOrigin;
  originDetail: string;
  sharedAssetId?: string;
  sharedAssetName?: string;
  siteName: string;
  processName: string;
  description: string;
  legalCriterion?: string;
  severity: FindingSeverity;
  status: 'ABIERTO' | 'EN_ACPM' | 'RESUELTO';
  reportedBy: string;
  createdAt: string;
  linkedAcpmId?: string;
}

export type AcpmStatus = 
  | 'ABIERTA' 
  | 'EN_ANALISIS' 
  | 'EN_EJECUCION' 
  | 'PENDIENTE_EVIDENCIA' 
  | 'PENDIENTE_VERIFICACION' 
  | 'CERRADA' 
  | 'VENCIDA' 
  | 'REABIERTA';

export interface Evidence {
  id: string;
  title: string;
  fileType: 'IMAGE' | 'PDF' | 'DOCUMENT' | 'CERTIFICATE';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  tags: string[];
  linkedEntityCount: number;
}

export interface AcpmHistoryEntry {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  previousState?: string;
  newState?: string;
  comment?: string;
}

export interface AcpmAction {
  id: string;
  code: string;
  findingId: string;
  findingCode: string;
  title: string;
  originModule: ModuleType;
  associatedRequirement: string;
  causeAnalysisMethod: '5_WHY' | 'ISHIKAWA' | 'ARBOL_CAUSAS' | 'OTRO';
  rootCauses: string[];
  immediateAction: string;
  correctiveAction: string;
  responsibleName: string;
  responsibleEmail: string;
  dueDate: string;
  priority: 'ALTA' | 'MEDIA' | 'BAJA';
  status: AcpmStatus;
  evidences: Evidence[];
  verificationResult?: 'EFICAZ' | 'NO_EFICAZ';
  verificationNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  history: AcpmHistoryEntry[];
}

export interface Task {
  id: string;
  title: string;
  module: ModuleType;
  type: 'INSPECCION' | 'AUDITORIA' | 'CAPACITACION' | 'MANTENIMIENTO' | 'ACPM' | 'REPORTE' | 'RESIDUOS';
  dueDate: string;
  responsible: string;
  priority: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';
  status: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'VENCIDA';
  linkedId?: string;
  siteName: string;
}

export type AuditChecklistStatus = 
  | 'CONFORME' 
  | 'NO_CONFORME' 
  | 'OPORTUNIDAD_MEJORA' 
  | 'OBSERVACION' 
  | 'NO_APLICA' 
  | 'SIN_EVALUAR';

export interface AuditChecklistItem {
  id: string;
  requirementCode: string;
  requirementTitle: string;
  standard: string;
  status: AuditChecklistStatus;
  auditorNotes: string;
  evidenceNotes?: string;
  findingGeneratedId?: string;
}

export interface Audit {
  id: string;
  code: string;
  title: string;
  module: ModuleType | 'INTEGRADO';
  scope: string;
  leadAuditor: string;
  auditDate: string;
  status: 'PROGRAMADA' | 'EN_EJECUCION' | 'INFORME_PENDIENTE' | 'FINALIZADA';
  checklist: AuditChecklistItem[];
  findingsGeneratedCount: number;
}

export interface GhgEmissionRecord {
  id: string;
  scope: 1 | 2 | 3;
  period: string; // e.g. "2026-Q1"
  siteId: string;
  siteName: string;
  processName: string;
  sourceCategory: string; // "Combustibles Vehículos", "Energía Eléctrica", "Residuos"
  consumptionValue: number;
  consumptionUnit: string;
  emissionFactor: number;
  factorSource: string; // e.g. "UPME - Factor Red Nacional SIN 2025"
  factorYear: number;
  factorUnit: string;
  totalKgCO2eq: number;
  evidenceFileName?: string;
}

export interface PesvVehicle {
  id: string;
  plate: string;
  type: 'CAMION' | 'AUTOMOVIL' | 'MOTOCICLETA' | 'VAN' | 'MONTACARGAS';
  brand: string;
  modelYear: number;
  soatExpiry: string;
  rtmExpiry: string;
  lastPreoperationalDate: string;
  assignedDriver: string;
  status: 'OPERATIVO' | 'MANTENIMIENTO' | 'ALERTA_DOCUMENTAL';
}

export interface PesvDriver {
  id: string;
  fullName: string;
  idNumber: string;
  licenseNumber: string;
  licenseCategory: 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'C3';
  licenseExpiry: string;
  simitPazYSalvo: boolean;
  medicalExamExpiry: string;
  defensiveDrivingTrainingDate: string;
  status: 'APTO' | 'EN_OBSERVACION' | 'NO_APTO';
}

export interface PgirsRecord {
  id: string;
  date: string;
  wasteClassification: 'APROVECHABLE' | 'NO_APROVECHABLE' | 'ORGANICO' | 'PELIGROSO_RESPEL' | 'RAEE';
  wasteName: string;
  weightKg: number;
  generatorArea: string;
  authorizedGestor: string;
  gestorNit: string;
  certificateNumber: string;
  disposalType: 'RECICLAJE' | 'RELLENO_SANITARIO' | 'COMPOSTAJE' | 'INCINERACION_TERMICA';
}

export interface SstHazardItem {
  id: string;
  process: string;
  activity: string;
  isRoutine: boolean;
  hazardClass: 'FISICO' | 'QUIMICO' | 'BIOLOGICO' | 'BIOMECANICO' | 'PSICOSOCIAL' | 'CONDICIONES_SEGURIDAD' | 'FENOMENOS_NATURALES';
  hazardDescription: string;
  possibleEffects: string;
  deficiencyLevel: number; // 2, 6, 10
  exposureLevel: number; // 1, 2, 3, 4
  severityLevel: number; // 10, 25, 60, 100
  riskLevelInterpretation: 'I' | 'II' | 'III' | 'IV';
  acceptability: 'NO_ACEPTABLE' | 'ACEPTABLE_CON_CONTROL' | 'ACEPTABLE';
  controls: {
    elimination?: string;
    substitution?: string;
    engineering?: string;
    administrative?: string;
    epp?: string;
  };
}
