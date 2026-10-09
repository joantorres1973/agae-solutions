// =====================================================================
// SEGURIDAD SOCIAL Y PLANILLAS DE APORTES (PILA)
// AGAE SOLUTIONS - Estándares 1.1.4 y 1.1.5 (Res. 0312 de 2019 / Dec. 1072 de 2015)
// =====================================================================

export type PilaPayrollType = 
  | 'GENERAL'     // Estándar 1.1.4: Salud, Pensión, ARL, Parafiscales (CCF, SENA, ICBF)
  | 'ALTO_RIESGO'; // Estándar 1.1.5: Pensión Especial Alto Riesgo Decreto 2090 de 2003

export type PilaOperator = 
  | 'SOI' 
  | 'APORTES_EN_LINEA' 
  | 'COMPENSAR' 
  | 'SIMPLE' 
  | 'MI_PLANILLA' 
  | 'ASOPAGOS' 
  | 'OTRO';

export interface PilaPayrollRecord {
  id: string;
  paymentDate: string; // YYYY-MM-DD: Fecha exacta en que se realizó el pago bancario
  period: string; // e.g. "2026-02" o "Febrero 2026"
  pinNumber: string; // Número de Planilla o PIN de liquidación (e.g. "PIN-9842104")
  payrollType: PilaPayrollType;
  operator: PilaOperator;
  totalAmount?: number; // Monto total liquidado en COP
  coveredWorkerIds: string[]; // IDs de trabajadores de la Base Maestra cubiertos en esta planilla
  
  // Soporte digital
  fileName: string;
  fileSize: string;
  fileType: string;
  fileUrl?: string;
  fileBase64?: string;
  
  // Auditoría y metadatos
  uploadedAt: string;
  uploadedBy: string;
  notes?: string;
  evidenceId?: string; // Id en el repositorio central de evidencias
}

export interface WorkerSocialSecuritySummary {
  workerId: string;
  workerName: string;
  docNumber: string;
  position: string;
  status: 'AL_DIA' | 'EN_MORA' | 'SIN_REGISTROS';
  lastPaymentDate?: string;
  lastPeriodCovered?: string;
  isAltoRiesgo: boolean;
  totalPlanillasCount: number;
}
