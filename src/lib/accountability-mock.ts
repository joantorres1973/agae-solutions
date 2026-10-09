// =====================================================================
// DATOS MOCK Y REGLAS DE NEGOCIO: RENDICIÓN DE CUENTAS (ESTÁNDAR 2.3.1)
// Decreto 1072 de 2015 Art. 2.2.4.6.8 Numeral 3
// Resolución 0312 de 2019 Estándar 2.3.1
// AGAE SOLUTIONS
// =====================================================================

import {
  AnnualPlanActivity,
  AccountabilityReport,
  AccountabilityConsolidatedReport,
  AccountabilityState,
  WorkerPatMetrics
} from '@/types/accountability';

// ---------------------------------------------------------------------
// 1. ACTIVIDADES DEL PLAN ANUAL DE TRABAJO (PAT) VIGENCIA 2026
// Mapeadas desde los módulos de origen de AGAE SOLUTIONS
// ---------------------------------------------------------------------
export const DEFAULT_PAT_ACTIVITIES: AnnualPlanActivity[] = [
  // -------------------------------------------------------------------
  // ROL: ALTA DIRECCIÓN / EMPLEADOR (wrk-004: Lic. Fernando Ortiz Salazar)
  // -------------------------------------------------------------------
  {
    id: 'pat-001',
    code: 'PAT-SST-2026-001',
    title: 'Aprobación y Asignación de Recursos Financieros para el SG-SST y PESV',
    category: 'PRESUPUESTO_RECURSOS',
    processName: 'Direccionamiento Estratégico & Gerencia',
    assignedWorkerId: 'wrk-004',
    assignedWorkerName: 'Fernando Ortiz Salazar',
    assignedWorkerPosition: 'Gerente General & Representante Legal',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-01-31',
    completedDate: '2026-01-20',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-presupuesto-2026', 'evi-acta-gerencia-01'],
    evidenceFileNames: ['Presupuesto_Integrado_SST_PESV_2026.pdf', 'Acta_Aprobacion_Recursos_Gerencia.pdf'],
    resultsObtained: 'Aprobación del 100% de la partida presupuestal por $86.5M COP para SST y PESV.',
    difficultiesFaced: 'Ajuste en flujo de caja para partidas de ingeniería en Q2.',
    originModule: 'BUDGET'
  },
  {
    id: 'pat-002',
    code: 'PAT-SST-2026-002',
    title: 'Firma y Divulgación de la Política Integral de SST y Objetivos 2026',
    category: 'POLITICA_OBJETIVOS',
    processName: 'Direccionamiento Estratégico & Gerencia',
    assignedWorkerId: 'wrk-004',
    assignedWorkerName: 'Fernando Ortiz Salazar',
    assignedWorkerPosition: 'Gerente General & Representante Legal',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-02-15',
    completedDate: '2026-02-10',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-politica-firmada-2026'],
    evidenceFileNames: ['Politica_Integral_SST_Firmada_2026.pdf'],
    resultsObtained: 'Publicación física en todas las sedes y firma digital en AGAE.',
    originModule: 'POLICY'
  },
  {
    id: 'pat-003',
    code: 'PAT-SST-2026-003',
    title: 'Revisión por la Dirección del SG-SST (Balance de Gestión y Resultados Anuales)',
    category: 'AUDITORIA_REVISION',
    processName: 'Direccionamiento Estratégico & Gerencia',
    assignedWorkerId: 'wrk-004',
    assignedWorkerName: 'Fernando Ortiz Salazar',
    assignedWorkerPosition: 'Gerente General & Representante Legal',
    period: '2026',
    quarter: 'Q4',
    dueDate: '2026-11-30',
    executionStatus: 'PROGRAMADA',
    verificationStatus: 'PENDIENTE_VERIFICACION',
    evidenceIds: [],
    evidenceFileNames: [],
    resultsObtained: 'Programada para cierre de vigencia tras la auditoría interna.',
    originModule: 'EVALUATION'
  },

  // -------------------------------------------------------------------
  // ROL: RESPONSABLE DEL SG-SST (wrk-001: Ing. Marcela Rincón Ortiz)
  // -------------------------------------------------------------------
  {
    id: 'pat-004',
    code: 'PAT-SST-2026-004',
    title: 'Actualización Integral de la Matriz de Peligros y Valoración de Riesgos GTC 45',
    category: 'IDENTIFICACION_PELIGROS',
    processName: 'Gestión Integral HSEQ y PESV',
    assignedWorkerId: 'wrk-001',
    assignedWorkerName: 'Marcela Rincón Ortiz',
    assignedWorkerPosition: 'Líder HSEQ & Coordinadora SG-SST',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-02-28',
    completedDate: '2026-02-25',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-matriz-gtc45-2026'],
    evidenceFileNames: ['Matriz_Identificacion_Peligros_GTC45_2026.xlsx'],
    resultsObtained: '100% de procesos valorados (16 peligros identificados con controles definidos).',
    originModule: 'MATRIX'
  },
  {
    id: 'pat-005',
    code: 'PAT-SST-2026-005',
    title: 'Ejecución y Seguimiento al Plan Anual de Capacitación en SST (Cursos y Aula Virtual)',
    category: 'CAPACITACION_ENTRENAMIENTO',
    processName: 'Gestión Integral HSEQ y PESV',
    assignedWorkerId: 'wrk-001',
    assignedWorkerName: 'Marcela Rincón Ortiz',
    assignedWorkerPosition: 'Líder HSEQ & Coordinadora SG-SST',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-03-31',
    completedDate: '2026-03-28',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-capacitaciones-q1'],
    evidenceFileNames: ['Informe_Capacitacion_Q1_2026.pdf', 'Listas_Asistencia_Firmadas_Q1.pdf'],
    resultsObtained: 'Cobertura del 92% en inducciones y cursos técnicos obligatorios.',
    originModule: 'TRAINING'
  },
  {
    id: 'pat-006',
    code: 'PAT-SST-2026-006',
    title: 'Jornada de Exámenes Médicos Ocupacionales Periódicos y Diagnóstico de Salud',
    category: 'MEDICINA_PREVENTIVA',
    processName: 'Gestión Integral HSEQ y PESV',
    assignedWorkerId: 'wrk-001',
    assignedWorkerName: 'Marcela Rincón Ortiz',
    assignedWorkerPosition: 'Líder HSEQ & Coordinadora SG-SST',
    period: '2026',
    quarter: 'Q2',
    dueDate: '2026-05-30',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'PENDIENTE_VERIFICACION',
    evidenceIds: ['evi-examenes-medicos-2026'],
    evidenceFileNames: ['Conceptos_Aptitud_Medica_Consolidado_2026.pdf'],
    resultsObtained: 'Exámenes realizados al 100% de la planta operativa; pendiente informe de diagnóstico de IPS.',
    difficultiesFaced: 'Demora de la IPS ocupacional en radicar el profesiograma analítico consolidado.',
    originModule: 'DOCUMENTATION'
  },
  {
    id: 'pat-007',
    code: 'PAT-SST-2026-007',
    title: 'Mediciones Ambientales Higiénicas de Ruido e Iluminación en Áreas Críticas',
    category: 'HIGIENE_MEDICIONES',
    processName: 'Gestión Integral HSEQ y PESV',
    assignedWorkerId: 'wrk-001',
    assignedWorkerName: 'Marcela Rincón Ortiz',
    assignedWorkerPosition: 'Líder HSEQ & Coordinadora SG-SST',
    period: '2026',
    quarter: 'Q2',
    dueDate: '2026-06-15',
    executionStatus: 'PROGRAMADA',
    verificationStatus: 'PENDIENTE_VERIFICACION',
    evidenceIds: [],
    evidenceFileNames: [],
    originModule: 'DOCUMENTATION'
  },
  {
    id: 'pat-008',
    code: 'PAT-SST-2026-008',
    title: 'Simulacro Anual de Evacuación y Respuesta ante Emergencias',
    category: 'EMERGENCIAS_BRIGADA',
    processName: 'Gestión Integral HSEQ y PESV',
    assignedWorkerId: 'wrk-001',
    assignedWorkerName: 'Marcela Rincón Ortiz',
    assignedWorkerPosition: 'Líder HSEQ & Coordinadora SG-SST',
    period: '2026',
    quarter: 'Q3',
    dueDate: '2026-10-15',
    executionStatus: 'PROGRAMADA',
    verificationStatus: 'PENDIENTE_VERIFICACION',
    evidenceIds: [],
    evidenceFileNames: [],
    originModule: 'TRAINING'
  },
  {
    id: 'pat-009',
    code: 'PAT-SST-2026-009',
    title: 'Auditoría Interna de Cumplimiento de Estándares Mínimos (Res. 0312 de 2019)',
    category: 'AUDITORIA_REVISION',
    processName: 'Gestión Integral HSEQ y PESV',
    assignedWorkerId: 'wrk-001',
    assignedWorkerName: 'Marcela Rincón Ortiz',
    assignedWorkerPosition: 'Líder HSEQ & Coordinadora SG-SST',
    period: '2026',
    quarter: 'Q4',
    dueDate: '2026-11-15',
    executionStatus: 'PROGRAMADA',
    verificationStatus: 'PENDIENTE_VERIFICACION',
    evidenceIds: [],
    evidenceFileNames: [],
    originModule: 'EVALUATION'
  },

  // -------------------------------------------------------------------
  // ROL: SUPERVISORES Y PRESIDENTE COPASST (wrk-002: Carlos Eduardo Mendoza)
  // -------------------------------------------------------------------
  {
    id: 'pat-010',
    code: 'PAT-SST-2026-010',
    title: 'Sesiones Mensuales Ordinarias del COPASST (Convocatoria, Actas y Seguimiento)',
    category: 'COPASST_COMITES',
    processName: 'Operaciones Logísticas y Transporte',
    assignedWorkerId: 'wrk-002',
    assignedWorkerName: 'Carlos Eduardo Mendoza',
    assignedWorkerPosition: 'Supervisor de Operaciones & Presidente COPASST',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-03-31',
    completedDate: '2026-03-25',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-actas-copasst-q1'],
    evidenceFileNames: ['Actas_COPASST_Enero_Febrero_Marzo_2026.pdf'],
    resultsObtained: '3 actas ordinarias suscritas con seguimiento a 8 compromisos.',
    originModule: 'COPASST'
  },
  {
    id: 'pat-011',
    code: 'PAT-SST-2026-011',
    title: 'Inspecciones Periódicas de Seguridad en Almacén, Muelles y Equipos Móviles',
    category: 'INSPECCIONES_SEGURIDAD',
    processName: 'Operaciones Logísticas y Transporte',
    assignedWorkerId: 'wrk-002',
    assignedWorkerName: 'Carlos Eduardo Mendoza',
    assignedWorkerPosition: 'Supervisor de Operaciones & Presidente COPASST',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-03-15',
    completedDate: '2026-03-12',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-insp-operaciones-q1'],
    evidenceFileNames: ['Formato_Inspeccion_Muelles_Q1.pdf', 'Registro_Checklist_Montacargas.pdf'],
    resultsObtained: '100% de muelles inspeccionados; se detectaron 2 condiciones subestándar subsanadas.',
    originModule: 'INSPECTIONS'
  },
  {
    id: 'pat-012',
    code: 'PAT-SST-2026-012',
    title: 'Investigación Conjunta de Incidentes y Accidentes de Trabajo (Equipo Investigador)',
    category: 'ACPM_MEJORA',
    processName: 'Operaciones Logísticas y Transporte',
    assignedWorkerId: 'wrk-002',
    assignedWorkerName: 'Carlos Eduardo Mendoza',
    assignedWorkerPosition: 'Supervisor de Operaciones & Presidente COPASST',
    period: '2026',
    quarter: 'Q2',
    dueDate: '2026-04-10',
    completedDate: '2026-04-08',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-inv-incidente-01'],
    evidenceFileNames: ['Informe_Investigacion_Incidente_001_2026.pdf'],
    resultsObtained: 'Investigación dentro de los 15 días legales con plan de acción implementado.',
    linkedAcpmId: 'acpm-002',
    originModule: 'ACPM'
  },
  {
    id: 'pat-013',
    code: 'PAT-SST-2026-013',
    title: 'Informe Semestral de Gestión del COPASST ante la Alta Dirección',
    category: 'COPASST_COMITES',
    processName: 'Operaciones Logísticas y Transporte',
    assignedWorkerId: 'wrk-002',
    assignedWorkerName: 'Carlos Eduardo Mendoza',
    assignedWorkerPosition: 'Supervisor de Operaciones & Presidente COPASST',
    period: '2026',
    quarter: 'Q2',
    dueDate: '2026-06-30',
    executionStatus: 'PROGRAMADA',
    verificationStatus: 'PENDIENTE_VERIFICACION',
    evidenceIds: [],
    evidenceFileNames: [],
    originModule: 'COPASST'
  },

  // -------------------------------------------------------------------
  // ROL: SECRETARÍA COPASST & COMITÉ CONVIVENCIA (wrk-003: Laura Patricia Gómez)
  // -------------------------------------------------------------------
  {
    id: 'pat-014',
    code: 'PAT-SST-2026-014',
    title: 'Custodia, Archivo y Publicación de Actas del COPASST en Carteleras y Portal',
    category: 'COPASST_COMITES',
    processName: 'Administración y Finanzas',
    assignedWorkerId: 'wrk-003',
    assignedWorkerName: 'Laura Patricia Gómez',
    assignedWorkerPosition: 'Analista Contable & Secretaria COPASST',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-03-31',
    completedDate: '2026-03-30',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-custodia-actas-q1'],
    evidenceFileNames: ['Certificado_Custodia_Actas_COPASST_Q1.pdf'],
    resultsObtained: 'Archivo físico y digital foliado y cargado en el Repositorio Documental.',
    originModule: 'COPASST'
  },
  {
    id: 'pat-015',
    code: 'PAT-SST-2026-015',
    title: 'Sesiones Ordinarias Trimestrales del Comité de Convivencia Laboral (CCL)',
    category: 'COPASST_COMITES',
    processName: 'Administración y Finanzas',
    assignedWorkerId: 'wrk-003',
    assignedWorkerName: 'Laura Patricia Gómez',
    assignedWorkerPosition: 'Analista Contable & Secretaria COPASST',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-03-31',
    completedDate: '2026-03-26',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-acta-ccl-q1'],
    evidenceFileNames: ['Acta_CCL_Ordinaria_Trimestre_1_2026.pdf'],
    resultsObtained: 'Reunión realizada con quorum reglamentario (cero quejas formales radicadas).',
    originModule: 'CCL'
  },

  // -------------------------------------------------------------------
  // ROL: MANTENIMIENTO Y LÍDER DE BRIGADA (wrk-005: Andrés Felipe Ramos)
  // -------------------------------------------------------------------
  {
    id: 'pat-016',
    code: 'PAT-SST-2026-016',
    title: 'Inspección Mensual y Prueba Operativa de Extintores, Gabinetes y Botiquines',
    category: 'INSPECCIONES_SEGURIDAD',
    processName: 'Mantenimiento e Infraestructura',
    assignedWorkerId: 'wrk-005',
    assignedWorkerName: 'Andrés Felipe Ramos',
    assignedWorkerPosition: 'Técnico de Mantenimiento & Líder Brigada Emergencias',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-03-10',
    completedDate: '2026-03-08',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-insp-extintores-q1'],
    evidenceFileNames: ['Planilla_Inspeccion_Extintores_Marzo_2026.pdf'],
    resultsObtained: '14 extintores y 3 botiquines verificados; 1 extintor CO2 recargado preventivamente.',
    originModule: 'INSPECTIONS'
  },
  {
    id: 'pat-017',
    code: 'PAT-SST-2026-017',
    title: 'Entrenamiento Práctico a la Brigada de Emergencias (Primeros Auxilios y Evacuación)',
    category: 'EMERGENCIAS_BRIGADA',
    processName: 'Mantenimiento e Infraestructura',
    assignedWorkerId: 'wrk-005',
    assignedWorkerName: 'Andrés Felipe Ramos',
    assignedWorkerPosition: 'Técnico de Mantenimiento & Líder Brigada Emergencias',
    period: '2026',
    quarter: 'Q2',
    dueDate: '2026-05-15',
    executionStatus: 'PROGRAMADA',
    verificationStatus: 'PENDIENTE_VERIFICACION',
    evidenceIds: [],
    evidenceFileNames: [],
    originModule: 'TRAINING'
  },
  {
    id: 'pat-018',
    code: 'PAT-SST-2026-018',
    title: 'Mantenimiento Preventivo a Sistemas de Parada de Emergencia y Protecciones de Máquinas',
    category: 'INSPECCIONES_SEGURIDAD',
    processName: 'Mantenimiento e Infraestructura',
    assignedWorkerId: 'wrk-005',
    assignedWorkerName: 'Andrés Felipe Ramos',
    assignedWorkerPosition: 'Técnico de Mantenimiento & Líder Brigada Emergencias',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-02-20',
    completedDate: '2026-02-18',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-mant-paradas-emergencia'],
    evidenceFileNames: ['Orden_Trabajo_Mant_Sistemas_Seguridad_2026.pdf'],
    resultsObtained: 'Pruebas satisfactorias en 6 bandas transportadoras y selladoras.',
    originModule: 'INSPECTIONS'
  },

  // -------------------------------------------------------------------
  // ROL: TALENTO HUMANO & PRESIDENTA CCL (wrk-006: Diana Carolina Rojas)
  // -------------------------------------------------------------------
  {
    id: 'pat-019',
    code: 'PAT-SST-2026-019',
    title: 'Inducción y Reinducción en SST al 100% de Trabajadores Nuevos y Antiguos',
    category: 'CAPACITACION_ENTRENAMIENTO',
    processName: 'Gestión del Talento Humano',
    assignedWorkerId: 'wrk-006',
    assignedWorkerName: 'Diana Carolina Rojas',
    assignedWorkerPosition: 'Coordinadora de Talento Humano & Presidenta CCL',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-03-31',
    completedDate: '2026-03-29',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-inducciones-q1'],
    evidenceFileNames: ['Registro_Induccion_Nuevos_Ingresos_Q1.pdf'],
    resultsObtained: '100% de nuevos ingresos (5 colaboradores) con inducción en SST aprobada en Aula Virtual.',
    originModule: 'TRAINING'
  },
  {
    id: 'pat-020',
    code: 'PAT-SST-2026-020',
    title: 'Verificación de Afiliaciones Oportunas al Sistema de Seguridad Social Integral (PILA)',
    category: 'POLITICA_OBJETIVOS',
    processName: 'Gestión del Talento Humano',
    assignedWorkerId: 'wrk-006',
    assignedWorkerName: 'Diana Carolina Rojas',
    assignedWorkerPosition: 'Coordinadora de Talento Humano & Presidenta CCL',
    period: '2026',
    quarter: 'Q1',
    dueDate: '2026-03-10',
    completedDate: '2026-03-05',
    executionStatus: 'EJECUTADA',
    verificationStatus: 'VERIFICADA_EFICAZ',
    evidenceIds: ['evi-pila-marzo-2026'],
    evidenceFileNames: ['Planilla_PILA_Pagada_Marzo_2026.pdf'],
    resultsObtained: 'Cero moras o inconsistencias en aportes de ARL, Salud y Pensión.',
    originModule: 'GENERAL'
  },
  {
    id: 'pat-021',
    code: 'PAT-SST-2026-021',
    title: 'Campaña de Sensibilización en Prevención del Acoso Laboral y Bienestar Emocional',
    category: 'COPASST_COMITES',
    processName: 'Gestión del Talento Humano',
    assignedWorkerId: 'wrk-006',
    assignedWorkerName: 'Diana Carolina Rojas',
    assignedWorkerPosition: 'Coordinadora de Talento Humano & Presidenta CCL',
    period: '2026',
    quarter: 'Q2',
    dueDate: '2026-05-30',
    executionStatus: 'PROGRAMADA',
    verificationStatus: 'PENDIENTE_VERIFICACION',
    evidenceIds: [],
    evidenceFileNames: [],
    originModule: 'CCL'
  }
];

// ---------------------------------------------------------------------
// 2. REPORTES INDIVIDUALES DE RENDICIÓN DE CUENTAS VIGENCIA 2026
// Con responsabilidades formales y trazabilidad completa
// ---------------------------------------------------------------------
export const DEFAULT_ACCOUNTABILITY_REPORTS: AccountabilityReport[] = [
  // -------------------------------------------------------------------
  // 1. Ing. Marcela Rincón Ortiz (Responsable SG-SST) - FINALIZADA
  // -------------------------------------------------------------------
  {
    id: 'rep-001',
    code: 'IF-SGSST-GEN-002',
    period: '2026',
    workerId: 'wrk-001',
    workerName: 'Marcela Rincón Ortiz',
    workerDocNumber: '1.020.784.952',
    workerPosition: 'Líder HSEQ & Coordinadora SG-SST',
    workerArea: 'Gestión Integral HSEQ',
    roleCategory: 'RESPONSABLE_SST',
    sstRoleTitle: 'Responsable del SG-SST (Licencia en SST 1020784 Res. 98124)',
    assignedResponsibilities: [
      'Planear, organizar, dirigir, desarrollar y aplicar el SG-SST y como mínimo una (1) vez al año realizar su evaluación.',
      'Informar a la alta dirección sobre el funcionamiento y los resultados del SG-SST.',
      'Promover la participación de todos los miembros de la empresa en la implementación del SG-SST.',
      'Articular las intervenciones de peligros de la Matriz GTC 45 con los programas de vigilancia epidemiológica.',
      'Custodiar los documentos y registros con retención legal de 20 años conforme al Decreto 1072 Art. 2.2.4.6.13.',
      'Gestionar los planes de acción derivados de auditorías, inspecciones e investigaciones de ATEL.'
    ],
    status: 'FINALIZADA',
    dueDate: '2026-04-15',
    completedAt: '2026-04-02 16:45',
    managementDescription: 'Durante el periodo evaluado se lideró la estructuración integral de los 60 estándares de la Res. 0312 de 2019 en la plataforma AGAE SOLUTIONS. Se actualizó la Matriz de Peligros GTC 45 cubriendo el 100% de procesos operacionales y administrativos. Se puso en marcha el Aula Virtual AGAE logrando una cobertura del 92% en inducciones obligatorias. Se instalaron formalmente los comités COPASST y CCL con actas debidamente foliadas y custodiadas en el Repositorio Documental Central.',
    achievedResults: '1. Cero accidentes graves o mortales registrados en el periodo.\n2. Cumplimiento del 92% en cobertura del Plan Anual de Capacitación.\n3. Calificación de 94.5% en la autoevaluación de estándares mínimos.\n4. Integración exitosa del protocolo de retención documental a 20 años para exámenes médicos y mediciones higiénicas.',
    unexecutedCauses: 'La jornada de mediciones higiénicas de iluminación y ruido se encuentra programada para Q2 debido al cronograma de disponibilidad del laboratorio acreditado por el IDEAM.',
    difficultiesFaced: 'Demora en la radicación de informes consolidados de aptitud médica por parte de la IPS ocupacional, lo cual impidió cerrar el profesiograma analítico al 100% en Q1.',
    resourcesRequired: 'Se requiere mantener la partida aprobada de $14.2M COP para el laboratorio de higiene industrial y $6.5M COP para dotación técnica de la brigada de emergencias.',
    incidentHighlights: 'Se presentó un conato de incendio menor en el taller de mantenimiento el 14 de marzo, controlado eficazmente en menos de 2 minutos por el brigadista con extintor tipo ABC. Se abrió ACPM correctiva sobre almacenaje de paños con solventes.',
    proposedImprovements: 'Implementar inspecciones preoperacionales digitales mediante código QR en montacargas y vehículos para agilizar el reporte de condiciones subestándar.',
    commitmentsNextPeriod: '1. Culminar las mediciones higiénicas y remitir recomendaciones al área de infraestructura.\n2. Ejecutar el Simulacro de Evacuación en coordinación con el cuerpo de bomberos de Fontibón.\n3. Realizar la pre-auditoría interna de estándares mínimos en el mes de octubre.',
    additionalObservations: 'Se evidencia un alto compromiso de los supervisores de operaciones y el COPASST en el cumplimiento de los protocolos diarios.',
    reviewedAt: '2026-04-05 11:20',
    reviewerId: 'wrk-004',
    reviewerName: 'Fernando Ortiz Salazar',
    reviewerPosition: 'Gerente General & Representante Legal',
    reviewerObservations: 'Gestión sobresaliente. Se destacan los avances en digitalización de evidencias, la ausencia de siniestros graves y la rigurosidad en el archivo documental. Aprobado formalmente.',
    reviewerApproved: true,
    workerSignedAt: '2026-04-02 17:00',
    workerSignatureToken: 'SIG-WRK-001-2026-98124A',
    reviewerSignedAt: '2026-04-05 11:30',
    reviewerSignatureToken: 'SIG-MGR-004-2026-78411B',
    registeredInRepository: true,
    documentMasterCode: 'IF-SGSST-GEN-002',
    historyLog: [
      { id: 'h-1', timestamp: '2026-03-25 09:00', action: 'Borrador generado automáticamente por AGAE', author: 'Sistema AGAE' },
      { id: 'h-2', timestamp: '2026-04-02 16:45', action: 'Formulario completado y firmado por el responsable', author: 'Marcela Rincón Ortiz' },
      { id: 'h-3', timestamp: '2026-04-05 11:30', action: 'Revisión técnica y aprobación formal de Gerencia', author: 'Fernando Ortiz Salazar' },
      { id: 'h-4', timestamp: '2026-04-05 11:31', action: 'Registrado en el Repositorio Documental con código IF-SGSST-GEN-002', author: 'Sistema AGAE' }
    ]
  },

  // -------------------------------------------------------------------
  // 2. Lic. Fernando Ortiz Salazar (Representante Legal) - FINALIZADA
  // -------------------------------------------------------------------
  {
    id: 'rep-002',
    code: 'IF-SGSST-GEN-003',
    period: '2026',
    workerId: 'wrk-004',
    workerName: 'Fernando Ortiz Salazar',
    workerDocNumber: '79.482.115',
    workerPosition: 'Gerente General & Representante Legal',
    workerArea: 'Dirección General',
    roleCategory: 'ALTA_DIRECCION',
    sstRoleTitle: 'Representante Legal & Empleador',
    assignedResponsibilities: [
      'Definir, firmar y divulgar la política de Seguridad y Salud en el Trabajo.',
      'Asignar, documentar y comunicar las responsabilidades en SST a todos los niveles de la organización.',
      'Rendir cuentas internamente sobre su desempeño en SST al menos una vez al año.',
      'Definir y asignar los recursos financieros, técnicos, físicos y de personal necesarios.',
      'Garantizar la consulta y participación de los trabajadores y del COPASST.',
      'Realizar la revisión por la dirección anual para evaluar la conveniencia y eficacia del sistema.'
    ],
    status: 'FINALIZADA',
    dueDate: '2026-04-30',
    completedAt: '2026-04-06 09:30',
    managementDescription: 'Como representante legal, durante la vigencia 2026 garanticé la provisión ininterrumpida de los recursos financieros asignados al SG-SST ($86.5M COP). Suscribí la Política Integral y lideré su comunicación en las asambleas generales de inicio de año. Brindé respaldo absoluto a la coordinación de HSEQ para la detención preventiva de tareas que presentaran peligro inminente y respaldé las recomendaciones del COPASST.',
    achievedResults: '1. Desembolso oportuno del 100% de las partidas presupuestales solicitadas para dotación, exámenes y plataformas.\n2. Cero sanciones o requerimientos del Ministerio del Trabajo o la ARL.\n3. Participación activa en las reuniones extraordinarias de seguridad.\n4. Firma formal de las cartas de asignación de responsabilidades a la totalidad del personal clave.',
    unexecutedCauses: 'La Revisión por la Dirección se encuentra programada contractualmente para el mes de noviembre tras el cierre de indicadores anuales.',
    difficultiesFaced: 'Incremento en los costos de importación de ciertos elementos de protección personal especializados para alturas, mitigado mediante compra consolidada.',
    resourcesRequired: 'Se mantiene el compromiso presupuestal para el segundo semestre.',
    incidentHighlights: 'Ninguno con implicaciones legales ni fatalidades.',
    proposedImprovements: 'Involucrar de manera más directa a los contratistas y proveedores de transporte en los estándares del SG-SST y el PESV.',
    commitmentsNextPeriod: '1. Presidir la jornada central del Simulacro de Evacuación en octubre.\n2. Liderar la sesión formal de Revisión por la Dirección de fin de año.\n3. Evaluar el incremento del 10% en el presupuesto SST para la vigencia 2027.',
    additionalObservations: 'Felicito al equipo de HSEQ y a los líderes de proceso por mantener una cultura preventiva sólida.',
    reviewedAt: '2026-04-06 14:00',
    reviewerId: 'wrk-001',
    reviewerName: 'Marcela Rincón Ortiz',
    reviewerPosition: 'Líder HSEQ & Coordinadora SG-SST',
    reviewerObservations: 'La alta dirección ha respaldado de forma incondicional las medidas técnicas y presupuestales requeridas por el SG-SST. Aprobado.',
    reviewerApproved: true,
    workerSignedAt: '2026-04-06 09:40',
    workerSignatureToken: 'SIG-MGR-004-2026-DIR001',
    reviewerSignedAt: '2026-04-06 14:15',
    reviewerSignatureToken: 'SIG-HSEQ-001-2026-DIR002',
    registeredInRepository: true,
    documentMasterCode: 'IF-SGSST-GEN-003',
    historyLog: [
      { id: 'h-10', timestamp: '2026-03-25 09:00', action: 'Borrador generado automáticamente por AGAE', author: 'Sistema AGAE' },
      { id: 'h-11', timestamp: '2026-04-06 09:30', action: 'Rendición diligenciada y firmada por Gerencia', author: 'Fernando Ortiz Salazar' },
      { id: 'h-12', timestamp: '2026-04-06 14:15', action: 'Revisión y validación por Coordinación SST', author: 'Marcela Rincón Ortiz' }
    ]
  },

  // -------------------------------------------------------------------
  // 3. Carlos Eduardo Mendoza (Supervisor & Presidente COPASST) - PENDIENTE_REVISION
  // -------------------------------------------------------------------
  {
    id: 'rep-003',
    code: 'IF-SGSST-COP-002',
    period: '2026',
    workerId: 'wrk-002',
    workerName: 'Carlos Eduardo Mendoza',
    workerDocNumber: '80.145.290',
    workerPosition: 'Supervisor de Operaciones & Presidente COPASST',
    workerArea: 'Operaciones Logísticas y Transporte',
    roleCategory: 'COMITES_BRIGADAS',
    sstRoleTitle: 'Supervisor de Operaciones & Presidente del COPASST',
    assignedResponsibilities: [
      'Presidir y orientar las reuniones mensuales ordinarias y extraordinarias del COPASST.',
      'Tramitar ante la administración de la empresa las recomendaciones aprobadas en el comité.',
      'Realizar inspecciones periódicas de seguridad en los lugares de trabajo, máquinas y equipos.',
      'Participar en la investigación de todos los accidentes e incidentes de trabajo ocurridos en la operación.',
      'Verificar el uso obligatorio y estado de los elementos de protección personal por parte de los trabajadores.',
      'Notificar inmediatamente a la Líder HSEQ cualquier condición o acto subestándar detectado.'
    ],
    status: 'PENDIENTE_REVISION',
    dueDate: '2026-04-20',
    completedAt: '2026-04-08 17:15',
    managementDescription: 'Como presidente del COPASST y supervisor de operaciones, lideré la realización de las 3 reuniones ordinarias del primer trimestre de 2026, logrando el 100% de asistencia de los miembros principales. Se ejecutaron 6 inspecciones de seguridad en muelles y patio de maniobras. Participé en la investigación del incidente con la transpaleta eléctrica y se coordinó la instalación de defensas amarillas en las columnas del almacén.',
    achievedResults: '1. 100% de actas del COPASST suscritas y radicadas a tiempo en AGAE.\n2. Cero accidentes incapacitantes en el área de bodega durante el trimestre.\n3. Se capacitaron 18 operarios en técnicas seguras de levantamiento de cargas.',
    unexecutedCauses: 'El informe semestral del COPASST ante Gerencia corresponde a cierre de junio, según cronograma.',
    difficultiesFaced: 'Resistencia inicial de 2 conductores temporales para portar botas con puntera dieléctrica en muelle, situación corregida con llamado de atención pedagógico.',
    resourcesRequired: 'Solicitamos al área de compras 2 espejos cóncavos adicionales para los cruces ciegos entre los pasillos 3 y 4 de la bodega.',
    incidentHighlights: 'Falla menor en freno de transpaleta manual el 5 de marzo; el equipo fue bloqueado y etiquetado inmediatamente para mantenimiento.',
    proposedImprovements: 'Implementar tarjetas de reporte "Pare y Reporte" en los bolsillos de los uniformes para que los operarios registren casi-accidentes.',
    commitmentsNextPeriod: '1. Elaborar y presentar el Informe Semestral del COPASST a la Gerencia General en junio.\n2. Programar una jornada de inspección nocturna para verificar iluminación en patios de carga.',
    additionalObservations: 'El comité funciona de forma armónica y con respaldo de los trabajadores.',
    workerSignedAt: '2026-04-08 17:20',
    workerSignatureToken: 'SIG-WRK-002-2026-COP99',
    registeredInRepository: false,
    historyLog: [
      { id: 'h-20', timestamp: '2026-03-25 09:00', action: 'Borrador generado automáticamente por AGAE', author: 'Sistema AGAE' },
      { id: 'h-21', timestamp: '2026-04-08 17:20', action: 'Formulario completado y enviado para revisión', author: 'Carlos Eduardo Mendoza' }
    ]
  },

  // -------------------------------------------------------------------
  // 4. Andrés Felipe Ramos (Técnico Mantenimiento & Líder Brigada) - EN_ELABORACION
  // -------------------------------------------------------------------
  {
    id: 'rep-004',
    code: 'IF-SGSST-EME-001',
    period: '2026',
    workerId: 'wrk-005',
    workerName: 'Andrés Felipe Ramos',
    workerDocNumber: '1.014.285.901',
    workerPosition: 'Técnico de Mantenimiento & Líder Brigada Emergencias',
    workerArea: 'Mantenimiento e Infraestructura',
    roleCategory: 'COMITES_BRIGADAS',
    sstRoleTitle: 'Líder de la Brigada de Emergencias & Técnico de Mantenimiento',
    assignedResponsibilities: [
      'Liderar las acciones de respuesta ante conatos de incendio, primeros auxilios y evacuación.',
      'Inspeccionar mensualmente extintores, gabinetes contra incendio, camillas y botiquines.',
      'Ejecutar los mantenimientos preventivos a dispositivos de seguridad de maquinaria crítica.',
      'Aplicar estrictamente las normas de bloqueo y etiquetado (LOTO) en intervenciones energizadas.',
      'Participar en los entrenamientos periódicos de la brigada de emergencias.'
    ],
    status: 'EN_ELABORACION',
    dueDate: '2026-04-25',
    managementDescription: 'En este trimestre se realizó la inspección al 100% de extintores portátiles de la sede Fontibón. Se reemplazó un extintor de 20 lbs con baja presión. Se atendió de forma inmediata el conato en el taller mecánico utilizando el equipo adecuado.',
    achievedResults: '1. 14 extintores y 3 botiquines al 100% de capacidad operativa.\n2. Cero accidentes durante tareas de mantenimiento preventivo eléctrico o mecánico.',
    unexecutedCauses: '',
    difficultiesFaced: 'Se requiere reposición de gasas y apósitos estériles en el botiquín del área de despacho.',
    resourcesRequired: 'Linternas recargables a prueba de explosión para los brigadistas del turno nocturno.',
    incidentHighlights: '',
    proposedImprovements: '',
    commitmentsNextPeriod: '',
    registeredInRepository: false,
    historyLog: [
      { id: 'h-30', timestamp: '2026-03-25 09:00', action: 'Borrador generado automáticamente por AGAE', author: 'Sistema AGAE' },
      { id: 'h-31', timestamp: '2026-04-07 10:15', action: 'Avance registrado en borrador por el trabajador', author: 'Andrés Felipe Ramos' }
    ]
  },

  // -------------------------------------------------------------------
  // 5. Laura Patricia Gómez (Analista Contable & Secretaria COPASST) - EN_ELABORACION
  // -------------------------------------------------------------------
  {
    id: 'rep-005',
    code: 'IF-SGSST-COP-003',
    period: '2026',
    workerId: 'wrk-003',
    workerName: 'Laura Patricia Gómez',
    workerDocNumber: '52.981.402',
    workerPosition: 'Analista Contable & Secretaria COPASST',
    workerArea: 'Administración y Finanzas',
    roleCategory: 'COMITES_BRIGADAS',
    sstRoleTitle: 'Secretaria del COPASST & Secretaria Comité de Convivencia',
    assignedResponsibilities: [
      'Verificar la asistencia a las reuniones del COPASST y del Comité de Convivencia Laboral.',
      'Tomar nota de los temas tratados y elaborar las actas de cada reunión ordinaria o extraordinaria.',
      'Llevar el archivo y custodia rigurosa de todas las actas y soportes de ambos comités.',
      'Distribuir las actas a cada uno de los miembros y mantener la debida reserva legal en los temas del CCL.'
    ],
    status: 'EN_ELABORACION',
    dueDate: '2026-04-25',
    managementDescription: 'Se elaboraron y radicaron con puntualidad las actas 01, 02 y 03 del COPASST de la vigencia 2026, así como el acta trimestral del Comité de Convivencia Laboral. Se garantiza la custodia bajo reserva en la bóveda digital.',
    achievedResults: '100% de actas firmadas por todos los integrantes y publicadas en extracto informativo.',
    unexecutedCauses: '',
    difficultiesFaced: '',
    resourcesRequired: '',
    incidentHighlights: '',
    proposedImprovements: '',
    commitmentsNextPeriod: '',
    registeredInRepository: false,
    historyLog: [
      { id: 'h-40', timestamp: '2026-03-25 09:00', action: 'Borrador generado automáticamente por AGAE', author: 'Sistema AGAE' }
    ]
  },

  // -------------------------------------------------------------------
  // 6. Diana Carolina Rojas (Talento Humano & Presidenta CCL) - PENDIENTE
  // -------------------------------------------------------------------
  {
    id: 'rep-006',
    code: 'IF-SGSST-CCL-001',
    period: '2026',
    workerId: 'wrk-006',
    workerName: 'Diana Carolina Rojas',
    workerDocNumber: '1.018.432.887',
    workerPosition: 'Coordinadora de Talento Humano & Presidenta CCL',
    workerArea: 'Gestión del Talento Humano',
    roleCategory: 'LIDERES_PROCESO',
    sstRoleTitle: 'Coordinadora de Talento Humano & Presidenta del Comité de Convivencia',
    assignedResponsibilities: [
      'Garantizar que todo trabajador reciba inducción y reinducción en SST previa al inicio de labores.',
      'Gestionar oportunamente la afiliación a ARL, EPS y Fondo de Pensiones sin generar periodos de desprotección.',
      'Presidir las sesiones del Comité de Convivencia Laboral y promover un clima organizacional armónico.',
      'Custodiar de forma estrictamente confidencial los expedientes y quejas radicadas ante el CCL.',
      'Articular los programas de bienestar y pausas activas con las metas del SG-SST.'
    ],
    status: 'PENDIENTE',
    dueDate: '2026-04-20',
    managementDescription: '',
    achievedResults: '',
    unexecutedCauses: '',
    difficultiesFaced: '',
    resourcesRequired: '',
    incidentHighlights: '',
    proposedImprovements: '',
    commitmentsNextPeriod: '',
    registeredInRepository: false,
    historyLog: [
      { id: 'h-50', timestamp: '2026-03-25 09:00', action: 'Borrador generado automáticamente por AGAE', author: 'Sistema AGAE' }
    ]
  }
];

// ---------------------------------------------------------------------
// 3. INFORME CONSOLIDADO CORPORATIVO ANUAL VIGENCIA 2026
// ---------------------------------------------------------------------
export const DEFAULT_CONSOLIDATED_REPORTS: AccountabilityConsolidatedReport[] = [
  {
    id: 'cons-2026',
    code: 'IF-SGSST-GEN-004',
    period: '2026',
    generatedAt: '2026-04-06 15:00',
    totalEligibleWorkers: 6,
    completedCount: 2,
    inReviewCount: 1,
    inProgressCount: 2,
    pendingCount: 1,
    globalComplianceRate: 83.3,
    keyGapsIdentified: [
      'Demoras en la entrega de diagnósticos analíticos de salud ocupacional por parte de IPS externas.',
      'Necesidad de reforzar la señalización y espejos de seguridad en cruces ciegos del almacén central.',
      'Fortalecimiento de la dotación ignífuga y linternas intrínsecas para la brigada en horarios nocturnos.'
    ],
    strategicCommitments: [
      'Garantizar la culminación de mediciones higiénicas y su articulación con el sistema de vigilancia epidemiológica.',
      'Desarrollar el Simulacro de Evacuación en octubre con articulación distrital y reporte al IDIGER.',
      'Efectuar la sesión formal de Revisión por la Dirección en noviembre con presencia del Representante Legal.'
    ],
    approvedByManager: true,
    managerName: 'Lic. Fernando Ortiz Salazar',
    managerSignedAt: '2026-04-06 15:30',
    documentMasterCode: 'IF-SGSST-GEN-004'
  }
];

// ---------------------------------------------------------------------
// 4. FUNCIONES DE CÁLCULO Y LÓGICA DE NEGOCIO
// ---------------------------------------------------------------------

/**
 * Calcula las métricas reales del Plan Anual de Trabajo para un trabajador en un periodo.
 * Cumple estrictamente con:
 * - Numerador: Actividades ejecutadas y verificadas con evidencia
 * - Denominador: Actividades exigibles en el periodo
 * - "Sin actividades exigibles" si el denominador es 0 (no poner 100% artificial).
 */
export function calculateWorkerPatMetrics(
  activities: AnnualPlanActivity[],
  workerId: string,
  period: string
): WorkerPatMetrics {
  const workerActivities = activities.filter(
    a => a.assignedWorkerId === workerId && a.period === period
  );

  const totalAssigned = workerActivities.length;
  const scheduledInPeriod = workerActivities.filter(a => a.executionStatus === 'PROGRAMADA').length;
  const executedAndVerified = workerActivities.filter(
    a => a.executionStatus === 'EJECUTADA' && a.verificationStatus === 'VERIFICADA_EFICAZ'
  ).length;
  const executedPendingVerification = workerActivities.filter(
    a => a.executionStatus === 'EJECUTADA' && a.verificationStatus !== 'VERIFICADA_EFICAZ'
  ).length;
  const pendingCount = workerActivities.filter(a => a.executionStatus === 'PENDIENTE').length;
  const overdueCount = workerActivities.filter(a => a.executionStatus === 'VENCIDA').length;
  const rescheduledCount = workerActivities.filter(a => a.executionStatus === 'REPROGRAMADA').length;

  // Actividades exigibles: Aquellas que ya debieron ejecutarse o fueron ejecutadas
  const exigibleCount = executedAndVerified + executedPendingVerification + pendingCount + overdueCount;

  let compliancePercentage: number | null = null;
  let complianceDisplay = 'Sin actividades exigibles';

  if (exigibleCount > 0) {
    compliancePercentage = Math.round((executedAndVerified / exigibleCount) * 1000) / 10;
    complianceDisplay = `${executedAndVerified} / ${exigibleCount} (${compliancePercentage.toFixed(1)}%)`;
  }

  const linkedAcpmCount = workerActivities.filter(a => Boolean(a.linkedAcpmId)).length;

  return {
    totalAssigned,
    scheduledInPeriod,
    executedAndVerified,
    executedPendingVerification,
    pendingCount,
    overdueCount,
    rescheduledCount,
    exigibleCount,
    compliancePercentage,
    complianceDisplay,
    hasPendingPreviousCommitments: false,
    linkedAcpmCount
  };
}

/**
 * Genera el siguiente código documental consecutivo para los informes de rendición de cuentas.
 */
export function generateAccountabilityDocCode(
  existingReports: AccountabilityReport[],
  category: 'INDIVIDUAL' | 'CONSOLIDADO',
  processCode: string = 'GEN'
): string {
  const prefix = category === 'CONSOLIDADO' ? `IF-SGSST-${processCode}` : `IF-SGSST-${processCode}`;
  const matching = existingReports.filter(r => r.code.startsWith(prefix));
  const nextNum = matching.length + 2;
  return `${prefix}-${String(nextNum).padStart(3, '0')}`;
}

// ---------------------------------------------------------------------
// 5. ESTADO INICIAL
// ---------------------------------------------------------------------
export const INITIAL_ACCOUNTABILITY_STATE: AccountabilityState = {
  currentPeriod: '2026',
  availablePeriods: ['2026', '2025', '2024'],
  patActivities: DEFAULT_PAT_ACTIVITIES,
  reports: DEFAULT_ACCOUNTABILITY_REPORTS,
  consolidatedReports: DEFAULT_CONSOLIDATED_REPORTS
};
