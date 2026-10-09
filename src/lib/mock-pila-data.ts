import { PilaPayrollRecord } from '@/types/social-security';

export const initialPilaRecords: PilaPayrollRecord[] = [
  {
    id: 'pila-001',
    paymentDate: '2026-02-05',
    period: '2026-02 (Febrero 2026)',
    pinNumber: 'PIN-984210492',
    payrollType: 'GENERAL',
    operator: 'SOI',
    totalAmount: 9480000,
    coveredWorkerIds: ['wrk-001', 'wrk-002', 'wrk-003', 'wrk-004', 'wrk-005'],
    fileName: 'Planilla_PILA_General_Febrero_2026_PIN984210492.pdf',
    fileSize: '1.4 MB',
    fileType: 'application/pdf',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-02-05 14:32:00',
    uploadedBy: 'Analista de Gestión Humana',
    notes: 'Pago oportuno de aportes parafiscales, ARL Sura (Clase IV/V), Salud Compensar/Sanitas y Fondos de Pensión Porvenir/Protección.',
    evidenceId: 'evi-pila-feb-2026'
  },
  {
    id: 'pila-002',
    paymentDate: '2026-01-08',
    period: '2026-01 (Enero 2026)',
    pinNumber: 'PIN-931849102',
    payrollType: 'GENERAL',
    operator: 'SOI',
    totalAmount: 9150000,
    coveredWorkerIds: ['wrk-001', 'wrk-002', 'wrk-003', 'wrk-004', 'wrk-005'],
    fileName: 'Planilla_PILA_General_Enero_2026_PIN931849102.pdf',
    fileSize: '1.2 MB',
    fileType: 'application/pdf',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-01-08 10:15:00',
    uploadedBy: 'Analista de Gestión Humana',
    notes: 'Liquidación PILA Tipo E (Empleados) debidamente pagada dentro de las fechas límites según último dígito del NIT.',
    evidenceId: 'evi-pila-ene-2026'
  },
  {
    id: 'pila-003',
    paymentDate: '2026-02-05',
    period: '2026-02 (Febrero 2026)',
    pinNumber: 'PIN-AR-202602-094',
    payrollType: 'ALTO_RIESGO',
    operator: 'SOI',
    totalAmount: 640000,
    coveredWorkerIds: ['wrk-005'],
    fileName: 'Planilla_PILA_AltoRiesgo_Dec2090_Feb2026.pdf',
    fileSize: '890 KB',
    fileType: 'application/pdf',
    fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-02-05 15:00:00',
    uploadedBy: 'Analista de Gestión Humana',
    notes: 'Cotización especial de 10 puntos adicionales a pensión conforme al Decreto 2090 de 2003 para cargo de Técnico Mecánico y Mantenimiento expuesto a altas temperaturas y soldadura.',
    evidenceId: 'evi-pila-ar-feb-2026'
  }
];
