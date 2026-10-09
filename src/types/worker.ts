// =====================================================================
// BASE MAESTRA DE TRABAJADORES (Expediente Digital 360° Transversal)
// AGAE SOLUTIONS - Principio: UN TRABAJADOR = UN PERFIL ÚNICO
// "UN DATO -> MÚLTIPLES USOS" | "NO MÁS DOBLE DIGITACIÓN"
// =====================================================================

export type WorkerDocType = 'CC' | 'CE' | 'PASAPORTE' | 'PEP' | 'PPT';

export type WorkerStatus = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'EN_VACACIONES' | 'INCAPACITADO';

export type WorkerContractType =
  | 'TERMINO_INDEFINIDO'
  | 'TERMINO_FIJO'
  | 'OBRA_LABOR'
  | 'PRESTACION_SERVICIOS'
  | 'APRENDIZAJE'
  | 'TEMPORAL';

export type WorkerWorkModality = 'PRESENCIAL' | 'TELETRABAJO' | 'HIBRIDO' | 'EN_CASA';

export type WorkerWorkShift = 'COMPLETA' | 'MEDIO_TIEMPO' | 'TURNOS_ROTATIVOS' | 'NOCTURNO';

export type WorkerEducationLevel =
  | 'PRIMARIA'
  | 'BACHILLERATO'
  | 'TECNICO'
  | 'TECNOLOGO'
  | 'PROFESIONAL'
  | 'ESPECIALIZACION'
  | 'MAESTRIA'
  | 'DOCTORADO';

// --------------------------------------------------
// 1. Historial Laboral (Trazabilidad de Cambios de Cargo/Área)
// --------------------------------------------------
export interface WorkerLaborHistoryEntry {
  id: string;
  changeDate: string; // YYYY-MM-DD
  previousPosition?: string;
  newPosition: string;
  previousArea?: string;
  newArea: string;
  previousSalary?: number;
  newSalary?: number;
  reason: 'INGRESO' | 'PROMOCION' | 'TRASLADO' | 'REESTRUCTURACION' | 'CAMBIO_SALARIAL' | 'RETIRO';
  registeredBy: string;
  notes?: string;
}

// --------------------------------------------------
// 2. Perfil Académico y Profesional
// --------------------------------------------------
export interface WorkerAcademicRecord {
  id: string;
  level: WorkerEducationLevel;
  degreeTitle: string;
  institution: string;
  graduationDate: string;
  status: 'GRADUADO' | 'EN_CURSO' | 'INCOMPLETO';
  evidenceFileName?: string;
  evidenceUrl?: string;
}

export interface WorkerCertification {
  id: string;
  title: string; // e.g. "Trabajo Seguro en Alturas - Coordinador", "Espacios Confinados", "Primeros Auxilios"
  entity: string; // e.g. "SENA", "Cruz Roja", "ARL Bolívar"
  issueDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  status: 'VIGENTE' | 'POR_VENCER' | 'VENCIDO';
  evidenceFileName?: string;
  evidenceUrl?: string;
}

export interface WorkerProfessionalLicense {
  id: string;
  type: 'LICENCIA_SST' | 'TARJETA_PROFESIONAL' | 'COPNIA' | 'CONALPE' | 'OTRA';
  name: string; // e.g. "Licencia en Seguridad y Salud en el Trabajo"
  number: string;
  resolutionNumber?: string;
  issuingEntity: string; // e.g. "Secretaría de Salud de Bogotá"
  issueDate: string;
  expiryDate?: string;
  status: 'VIGENTE' | 'POR_VENCER' | 'VENCIDO';
  evidenceFileName?: string;
  evidenceUrl?: string;
}

// --------------------------------------------------
// 3. Hoja de Vida Digital (Gestor Documental y Alertas)
// --------------------------------------------------
export type WorkerDocumentType =
  | 'HOJA_DE_VIDA'
  | 'DOCUMENTO_IDENTIDAD'
  | 'DIPLOMA'
  | 'ACTA_GRADO'
  | 'CERTIFICADO_LABORAL'
  | 'LICENCIA_SST'
  | 'TARJETA_PROFESIONAL'
  | 'CERTIFICADO_CURSO_50H'
  | 'CERTIFICADO_CURSO_20H'
  | 'CERTIFICADO_ALTURAS'
  | 'CERTIFICADO_ESPACIOS_CONFINADOS'
  | 'CONCEPTO_MEDICO'
  | 'ENTREGA_EPP_SOPORTE'
  | 'INDUCCION_SOPORTE'
  | 'CONTRATO_LABORAL'
  | 'AFILIACION_SEGURIDAD_SOCIAL'
  | 'OTRO';

export interface WorkerDigitalDocument {
  id: string;
  type: WorkerDocumentType;
  title: string;
  fileName: string;
  fileSize?: string;
  uploadedAt: string;
  issueDate?: string;
  expiryDate?: string;
  status: 'VIGENTE' | 'POR_VENCER' | 'VENCIDO' | 'NO_EXPIRA';
  url?: string;
  fileBase64?: string;
  uploadedBy: string;
  notes?: string;
}

// --------------------------------------------------
// 4. Expediente SST (Alimentación Automática)
// --------------------------------------------------
export interface WorkerInductionRecord {
  id: string;
  type: 'INDUCCION' | 'REINDUCCION';
  date: string;
  evaluationScore?: number; // e.g. 96 / 100
  approved: boolean;
  trainerName: string;
  evidenceFileName?: string;
  notes?: string;
}

export interface WorkerTrainingRecord {
  id: string;
  trainingTitle: string;
  date: string;
  hours: number;
  trainingType: 'SST' | 'PESV' | 'AMBIENTAL' | 'CALIDAD' | 'EMERGENCIAS';
  trainerName: string;
  attendanceVerified: boolean;
  score?: number;
  approved: boolean;
  certificateFileName?: string;
}

export interface WorkerEppDeliveryRecord {
  id: string;
  date: string;
  elementName: string;
  category:
    | 'PROTECCION_CABEZA'
    | 'PROTECCION_VISUAL'
    | 'PROTECCION_AUDITIVA'
    | 'PROTECCION_RESPIRATORIA'
    | 'PROTECCION_MANOS'
    | 'PROTECCION_PIES'
    | 'TRABAJO_ALTURAS'
    | 'INDUMENTARIA';
  quantity: number;
  deliveryReason: 'DOTACION_INICIAL' | 'PERIODICA' | 'DETERIORO' | 'EXTRAORDINARIA';
  signedReceipt: boolean;
  deliveredBy: string;
  evidenceFileName?: string;
  notes?: string;
}

export interface WorkerCommitteeParticipation {
  id: string;
  committeeType: 'COPASST' | 'VIGIA_SST' | 'CONVIVENCIA_LABORAL' | 'BRIGADA_EMERGENCIAS';
  role: 'PRESIDENTE' | 'SECRETARIO' | 'PRINCIPAL' | 'SUPLENTE' | 'VIGIA' | 'BRIGADISTA' | 'LIDER_EVACUACION';
  representedParty: 'TRABAJADORES' | 'EMPLEADOR';
  periodStart: string;
  periodEnd: string;
  isActive: boolean;
  electionActNumber?: string;
  evidenceFileName?: string;
}

export interface WorkerOccupationalExam {
  id: string;
  type: 'INGRESO' | 'PERIODICO' | 'EGRESO' | 'POST_INCAPACIDAD' | 'CAMBIO_CARGO';
  date: string;
  medicalIps: string;
  doctorName?: string;
  concept: 'APTO' | 'APTO_CON_RECOMENDACIONES' | 'APTO_CON_RESTRICCIONES' | 'NO_APTO';
  recommendations?: string; // Control de confidencialidad médica
  nextExamDate?: string;
  evidenceFileName?: string;
}

export interface WorkerIncidentParticipation {
  id: string;
  date: string;
  eventNumber: string;
  eventType: 'ACCIDENTE_TRABAJO' | 'INCIDENTE_TRABAJO' | 'ENFERMEDAD_LABORAL';
  participationRole: 'AFECTADO' | 'INVESTIGADOR_COPASST' | 'TESTIGO' | 'JEFE_INMEDIATO';
  descriptionBrief: string;
  investigationCompleted: boolean;
}

export interface WorkerInspectionRecord {
  id: string;
  date: string;
  inspectionType: 'PUESTO_TRABAJO' | 'USO_EPP' | 'SEGURIDAD_VIAL_PREOPERACIONAL' | 'HERRAMIENTAS' | 'COMPORTAMIENTO';
  inspectorName: string;
  result: 'SATISFACTORIO' | 'OBSERVACIONES' | 'CRITICO';
  notes?: string;
}

// --------------------------------------------------
// 5. Historial y Trazabilidad (Audit Trail Inmutable)
// --------------------------------------------------
export interface WorkerAuditEntry {
  id: string;
  timestamp: string;
  userName: string;
  action:
    | 'CREACION'
    | 'ACTUALIZACION_DATOS'
    | 'CAMBIO_CARGO'
    | 'DOCUMENTO_CARGADO'
    | 'EPP_ENTREGADO'
    | 'CAPACITACION_REGISTRADA'
    | 'EXAMEN_REGISTRADO'
    | 'COMITE_ASIGNADO'
    | 'CAMBIO_ESTADO';
  fieldChanged?: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
}

// --------------------------------------------------
// PERFIL INTEGRAL DEL TRABAJADOR (EXPEDIENTE DIGITAL 360°)
// --------------------------------------------------
export interface MasterWorker {
  id: string;

  // 1. Identificación del Trabajador
  photoUrl?: string;
  firstName: string;
  lastName: string;
  docType: WorkerDocType;
  docNumber: string; // Único
  birthDate?: string;
  address?: string;
  city: string;
  email: string;
  phone: string;
  status: WorkerStatus;
  hireDate: string;
  terminationDate?: string;

  // 2. Información Laboral
  position: string; // Cargo actual
  area: string;
  processId?: string;
  processName: string;
  siteId?: string;
  siteName: string;
  immediateBoss?: string;
  immediateBossId?: string;
  contractType: WorkerContractType;
  workModality: WorkerWorkModality;
  workShift: WorkerWorkShift;
  laborHistory: WorkerLaborHistoryEntry[];

  // 3. Perfil Académico y Profesional
  educationLevel: WorkerEducationLevel;
  academicRecords: WorkerAcademicRecord[];
  certifications: WorkerCertification[];
  licenses: WorkerProfessionalLicense[];

  // 4. Hoja de Vida Digital
  digitalDocuments: WorkerDigitalDocument[];

  // 5. Expediente SG-SST
  inductions: WorkerInductionRecord[];
  trainings: WorkerTrainingRecord[];
  eppDeliveries: WorkerEppDeliveryRecord[];
  committeeParticipations: WorkerCommitteeParticipation[];
  occupationalExams: WorkerOccupationalExam[];
  incidentParticipations: WorkerIncidentParticipation[];
  inspections: WorkerInspectionRecord[];

  // 6. Historial y Trazabilidad
  auditTrail: WorkerAuditEntry[];

  // Metadatos
  createdAt: string;
  updatedAt: string;
  notes?: string;
}
