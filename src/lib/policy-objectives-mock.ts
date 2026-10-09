// ============================================================================
// Datos Iniciales y Mock Data para Política del SG-SST y Objetivos
// Conforme al Decreto 1072 de 2015 y Resolución 0312 de 2019
// ============================================================================

import {
  SstPolicyDocument,
  SstPolicyCommitment,
  SstObjectiveItem
} from '@/types/policy-objectives';

export const INITIAL_POLICY_COMMITMENTS: SstPolicyCommitment[] = [
  {
    id: 'comp-01',
    code: 'COMP-01',
    title: 'Identificación y Control de Peligros y Riesgos',
    description: 'Identificar los peligros, evaluar y valorar los riesgos y establecer los respectivos controles en todos los centros de trabajo y procesos operativos, priorizando la eliminación y sustitución.',
    isMandatoryLegal: true,
    legalArticle: 'Decreto 1072 de 2015 Art. 2.2.4.6.6 Numeral 1',
    isActive: true
  },
  {
    id: 'comp-02',
    code: 'COMP-02',
    title: 'Protección de los Trabajadores y Mejora Continua',
    description: 'Proteger la seguridad y salud de todos los trabajadores mediante la mejora continua del Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST) y el fomento del bienestar integral.',
    isMandatoryLegal: true,
    legalArticle: 'Decreto 1072 de 2015 Art. 2.2.4.6.6 Numeral 2',
    isActive: true
  },
  {
    id: 'comp-03',
    code: 'COMP-03',
    title: 'Cumplimiento de la Normatividad Legal Vigente',
    description: 'Cumplir con la normatividad nacional vigente aplicable en materia de riesgos laborales, estándares mínimos de la Resolución 0312 de 2019 y demás directrices que la organización suscriba.',
    isMandatoryLegal: true,
    legalArticle: 'Decreto 1072 de 2015 Art. 2.2.4.6.6 Numeral 3',
    isActive: true
  },
  {
    id: 'comp-04',
    code: 'COMP-04',
    title: 'Prevención de Consumo de Alcohol, Tabaco y Sustancias Psicoactivas',
    description: 'Promover estilos de vida y de trabajo saludables prohibiendo el porte, consumo o permanencia bajo los efectos de alcohol, tabaco o sustancias psicoactivas durante la jornada laboral.',
    isMandatoryLegal: false,
    legalArticle: 'Resolución 1075 de 1992 y Circular 038 de 2010',
    isActive: true
  },
  {
    id: 'comp-05',
    code: 'COMP-05',
    title: 'Articulación con Seguridad Vial, Convivencia y Medio Ambiente',
    description: 'Articular la gestión de seguridad y salud con el Plan Estratégico de Seguridad Vial (PESV), la prevención del acoso laboral (Res. 3461 de 2025 / Ley 1010 de 2006) y la sostenibilidad ambiental.',
    isMandatoryLegal: false,
    legalArticle: 'Resolución 40595 de 2022 y Resolución 3461 de 2025',
    isActive: true
  }
];

export const INITIAL_SST_POLICY: SstPolicyDocument = {
  id: 'pol-sst-01',
  version: '03',
  status: 'APROBADA_Y_FIRMADA',
  companyName: 'ANDINA DE LOGÍSTICA & DISTRIBUCIÓN S.A.S.',
  nit: '901.482.391-7',
  economicActivity: 'Transporte de carga por carretera y almacenamiento logístico especializado (Código CIIU 4923)',
  workCentersDescription: 'Sede Principal Bogotá D.C. (Bodega Central & Oficinas), Terminal de Operaciones Funza (Cundinamarca) y Centros de Operación en Ruta Nacional.',
  introduction: 'En ANDINA DE LOGÍSTICA & DISTRIBUCIÓN S.A.S., dedicada a servicios de transporte terrestre automotor de carga y operaciones de almacenamiento logístico, la Gerencia General reconoce que el recurso humano constituye el activo más valioso de la organización. Por ello, asume el liderazgo y el compromiso formal de proporcionar condiciones de trabajo seguras y saludables para prevenir lesiones, accidentes y deterioro de la salud en el trabajo.',
  scope: 'Esta política aplica a todos los centros de trabajo de la compañía, sedes operativas, oficinas administrativas, conductores, personal de bodega, contratistas, proveedores, aprendices y visitantes sin excepción, independientemente de su forma de vinculación o contratación.',
  commitments: INITIAL_POLICY_COMMITMENTS,
  closingStatement: 'Para el cumplimiento de esta Política, la Gerencia General se compromete a destinar los recursos financieros, humanos, técnicos y físicos necesarios. Así mismo, la presente Política será comunicada formalmente al COPASST, divulgada a todos los trabajadores en los procesos de inducción y reinducción, publicada en lugares visibles y estará disponible para las partes interesadas.',
  issuedDate: '2026-01-15',
  lastRevisionDate: '2026-01-15',
  nextRevisionDeadline: '2027-01-15',
  signedByLegalRep: true,
  legalRepName: 'Fernando Ortiz Salazar',
  legalRepDoc: '79.654.120 expedida en Bogotá',
  signedAt: '2026-01-15 10:30',
  leaderSstName: 'Sandra Milena Gómez',
  leaderSstLicense: 'LIC-SST-2023-08941',
  leaderSstEndorsed: true,
  socializedWithCopasst: true,
  socializedWithWorkers: true,
  revisionHistory: [
    {
      id: 'rev-01',
      revisionNumber: '01',
      revisionDate: '2024-01-10',
      reviewedBy: 'Fernando Ortiz Salazar',
      role: 'Representante Legal',
      changesSummary: 'Emisión inicial de la política del SG-SST conforme al Decreto 1072 de 2015.',
      status: 'ACTUALIZADA_CON_CAMBIOS'
    },
    {
      id: 'rev-02',
      revisionNumber: '02',
      revisionDate: '2025-01-12',
      reviewedBy: 'Sandra Milena Gómez & Fernando Ortiz',
      role: 'Líder SST & Gerencia',
      changesSummary: 'Revisión anual obligatoria: inclusión del compromiso articulado con el PESV (Res. 40595 de 2022).',
      status: 'ACTUALIZADA_CON_CAMBIOS'
    },
    {
      id: 'rev-03',
      revisionNumber: '03',
      revisionDate: '2026-01-15',
      reviewedBy: 'Sandra Milena Gómez & Fernando Ortiz',
      role: 'Líder SST & Gerencia General',
      changesSummary: 'Revisión anual 2026: ratificación formal de los 3 compromisos legales obligatorios y articulación con la Resolución 3461 de 2025 sobre convivencia y acoso.',
      status: 'RATIFICADA_SIN_CAMBIOS'
    }
  ]
};

export const INITIAL_SST_OBJECTIVES: SstObjectiveItem[] = [
  {
    id: 'obj-01',
    code: 'OBJ-SST-01',
    name: 'Reducción de la Tasa de Accidentalidad y Cero Fatalidades',
    description: 'Minimizar la ocurrencia de accidentes de trabajo en operaciones de carga, transporte y bodega mediante la intervención prioritaria de condiciones y actos inseguros, garantizando cero accidentes graves o fatales.',
    policyCommitmentId: 'comp-01',
    policyCommitmentTitle: 'Identificación y Control de Peligros y Riesgos (COMP-01)',
    responsible: 'Líder SST / Sandra Milena Gómez',
    period: '2026',
    baseline: 'Tasa IF 3.8 accidentes por 100 trabajadores en 2025',
    targetValue: 2.0,
    targetUnit: 'Tasa',
    targetDeadline: '2026-12-31',
    targetCriteria: 'MANTENER_DEBAJO',
    frequency: 'TRIMESTRAL',
    status: 'EN_CUMPLIMIENTO',
    observations: 'La tasa acumulada al corte de Q1 se sitúa en 1.45 accidentes por 100 colaboradores, cumpliendo con la meta de permanecer por debajo de 2.0.',
    indicators: [
      {
        id: 'ind-01',
        name: 'Índice de Frecuencia de Accidentes de Trabajo (IF)',
        type: 'RESULTADO',
        formula: '(No. Accidentes en el periodo / Horas Hombre Trabajadas) * 240.000',
        target: '<= 2.0',
        currentResult: '1.45'
      },
      {
        id: 'ind-02',
        name: 'Índice de Severidad de Accidentes de Trabajo (IS)',
        type: 'RESULTADO',
        formula: '(No. Días perdidos y cargados / Horas Hombre Trabajadas) * 240.000',
        target: '<= 15 días',
        currentResult: '6.2 días'
      }
    ],
    relatedPrograms: [
      'Matriz GTC 45 de Peligros',
      'Inspecciones Preoperacionales de Vehículos',
      'COPASST - Investigación de Incidentes'
    ],
    followUps: [
      {
        id: 'fu-01-01',
        periodEvaluated: 'Q1 2026 (Ene - Mar)',
        evaluatedAt: '2026-04-02',
        actualValue: 1.45,
        targetExpected: 2.0,
        progressPercentage: 85,
        calculatedStatus: 'EN_CUMPLIMIENTO',
        observations: 'Durante el primer trimestre se registraron 2 incidentes menores sin días de incapacidad. Meta controlada.',
        evidenceTitle: 'Informe Estadístico de Siniestralidad ARL Q1 2026',
        evidenceUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
        responsibleName: 'Sandra Milena Gómez'
      }
    ],
    deviations: [],
    createdAt: '2026-01-16',
    updatedAt: '2026-04-02'
  },
  {
    id: 'obj-02',
    code: 'OBJ-SST-02',
    name: 'Cumplimiento y Cobertura del Plan Anual de Capacitación',
    description: 'Desarrollar el 100% de las competencias preventivas programadas en el Plan de Capacitación en SST, alcanzando una cobertura superior al 85% de la planta de personal y conductores.',
    policyCommitmentId: 'comp-02',
    policyCommitmentTitle: 'Protección de los Trabajadores y Mejora Continua (COMP-02)',
    responsible: 'Coordinador de Capacitación & SST / Diego Cárdenas',
    period: '2026',
    baseline: '74% de cobertura global y 80% de ejecución en 2025',
    targetValue: 88.0,
    targetUnit: '% Cobertura',
    targetDeadline: '2026-12-31',
    targetCriteria: 'SUPERAR_VALOR',
    frequency: 'MENSUAL',
    status: 'CUMPLIDO',
    observations: 'Con la implementación del Aula Virtual AGAE y talleres presenciales de manejo defensivo, la cobertura al corte del primer trimestre alcanzó el 91.2%.',
    indicators: [
      {
        id: 'ind-03',
        name: 'Porcentaje de Cobertura de Capacitaciones',
        type: 'PROCESO',
        formula: '(Trabajadores capacitados / Total trabajadores programados) * 100',
        target: '>= 88%',
        currentResult: '91.2%'
      },
      {
        id: 'ind-04',
        name: 'Eficacia de las Capacitaciones',
        type: 'RESULTADO',
        formula: '(Evaluaciones aprobadas / Total evaluaciones presentadas) * 100',
        target: '>= 85%',
        currentResult: '89.4%'
      }
    ],
    relatedPrograms: [
      'Estándar 1.2 Programa de Capacitación SG-SST',
      'Aula Virtual AGAE',
      'Inducción y Reinducción SST'
    ],
    followUps: [
      {
        id: 'fu-02-01',
        periodEvaluated: 'Mes 1 / Enero 2026',
        evaluatedAt: '2026-01-31',
        actualValue: 89.0,
        targetExpected: 88.0,
        progressPercentage: 101,
        calculatedStatus: 'CUMPLIDO',
        observations: 'Inducciones de inicio de año completadas al 100% para personal nuevo y reinducción general.',
        evidenceTitle: 'Planillas firmadas de Inducción 2026',
        responsibleName: 'Diego Cárdenas'
      },
      {
        id: 'fu-02-02',
        periodEvaluated: 'Mes 2 / Febrero 2026',
        evaluatedAt: '2026-02-28',
        actualValue: 91.2,
        targetExpected: 88.0,
        progressPercentage: 103,
        calculatedStatus: 'CUMPLIDO',
        observations: 'Módulo de Biomecánica y Levantamiento de Cargas en Aula Virtual completado con alta participación.',
        evidenceTitle: 'Reporte de aprobados Aula Virtual Feb 2026',
        responsibleName: 'Diego Cárdenas'
      }
    ],
    deviations: [],
    createdAt: '2026-01-16',
    updatedAt: '2026-02-28'
  },
  {
    id: 'obj-03',
    code: 'OBJ-SST-03',
    name: 'Cumplimiento del 100% de la Matriz de Requisitos Legales',
    description: 'Mantener actualizada y evaluada periódicamente la matriz legal de riesgos laborales, garantizando la conformidad jurídica del 100% de las normas aplicables de la Resolución 0312 y Decreto 1072.',
    policyCommitmentId: 'comp-03',
    policyCommitmentTitle: 'Cumplimiento de la Normatividad Legal Vigente (COMP-03)',
    responsible: 'Asesora Jurídica SST & Sandra Milena Gómez',
    period: '2026',
    baseline: '92.5% de cumplimiento legal en auditoría 2025',
    targetValue: 100.0,
    targetUnit: '% Cumplimiento',
    targetDeadline: '2026-12-31',
    targetCriteria: 'SUPERAR_VALOR',
    frequency: 'SEMESTRAL',
    status: 'EN_CUMPLIMIENTO',
    observations: 'La matriz legal se encuentra evaluada al 97.4% con los ajustes incorporados de la Resolución 3461 de 2025.',
    indicators: [
      {
        id: 'ind-05',
        name: 'Conformidad de Requisitos Legales Aplicables',
        type: 'ESTRUCTURA',
        formula: '(Normas cumplidas / Total normas aplicables) * 100',
        target: '100%',
        currentResult: '97.4%'
      }
    ],
    relatedPrograms: [
      'Matriz de Requisitos Legales SST',
      'Auditoría Anual de Estándares Mínimos',
      'Comité de Convivencia Res. 3461/2025'
    ],
    followUps: [
      {
        id: 'fu-03-01',
        periodEvaluated: 'Corte Semestre I / Q1 Avance',
        evaluatedAt: '2026-03-30',
        actualValue: 97.4,
        targetExpected: 100.0,
        progressPercentage: 97,
        calculatedStatus: 'EN_CUMPLIMIENTO',
        observations: 'Pendiente únicamente la formalización del simulacro nacional de evacuación programado para octubre.',
        evidenceTitle: 'Matriz Legal SST Actualizada V04',
        responsibleName: 'Sandra Milena Gómez'
      }
    ],
    deviations: [],
    createdAt: '2026-01-16',
    updatedAt: '2026-03-30'
  },
  {
    id: 'obj-04',
    code: 'OBJ-SST-04',
    name: 'Cierre Oportuno y Eficaz de Acciones ACPM',
    description: 'Garantizar que al menos el 85% de las acciones correctivas, preventivas y de mejora derivadas de inspecciones, incidentes y auditorías se cierren eficazmente dentro del plazo programado.',
    policyCommitmentId: 'comp-02',
    policyCommitmentTitle: 'Protección de los Trabajadores y Mejora Continua (COMP-02)',
    responsible: 'Líder SST & Comité COPASST',
    period: '2026',
    baseline: '68% de cierre oportuno en 2025',
    targetValue: 85.0,
    targetUnit: '% Cierre',
    targetDeadline: '2026-12-31',
    targetCriteria: 'SUPERAR_VALOR',
    frequency: 'TRIMESTRAL',
    status: 'EN_RIESGO',
    observations: 'Se identificaron 3 acciones correctivas de mantenimiento en taller que excedieron el plazo previsto de 30 días.',
    indicators: [
      {
        id: 'ind-06',
        name: 'Oportunidad en Cierre de Acciones ACPM',
        type: 'PROCESO',
        formula: '(Acciones cerradas en fecha / Total acciones vencidas) * 100',
        target: '>= 85%',
        currentResult: '64.2%'
      }
    ],
    relatedPrograms: [
      'Matriz ACPM del SG-SST',
      'Inspecciones de Seguridad 4.1',
      'COPASST'
    ],
    followUps: [
      {
        id: 'fu-04-01',
        periodEvaluated: 'Q1 2026 (Ene - Mar)',
        evaluatedAt: '2026-04-05',
        actualValue: 64.2,
        targetExpected: 85.0,
        progressPercentage: 75,
        calculatedStatus: 'EN_RIESGO',
        observations: 'El porcentaje de cierre oportuno bajó a 64.2% debido a retrasos de proveedores en repuestos de rampas de carga.',
        evidenceTitle: 'Informe Matriz ACPM Consolidado Q1',
        responsibleName: 'Sandra Milena Gómez'
      }
    ],
    deviations: [
      {
        id: 'dev-04-01',
        registeredAt: '2026-04-05',
        period: 'Q1 2026',
        deviationAnalysis: 'Retraso en el cierre de 3 acciones correctivas sobre guardas de protección y mantenimiento de rampas hidráulicas en Bodega Central.',
        rootCause: 'Demora en la orden de compra de repuestos y falta de escalamiento formal a la Dirección Administrativa.',
        requiredAction: 'Reunión de seguimiento semanal con compras e inclusión de cláusula de entrega prioritaria de insumos de SST.',
        responsible: 'Jefe de Mantenimiento & Sandra Milena Gómez',
        deadline: '2026-04-30',
        sentToAcpm: true,
        acpmFindingId: 'find-acpm-obj-04'
      }
    ],
    createdAt: '2026-01-16',
    updatedAt: '2026-04-05'
  },
  {
    id: 'obj-05',
    code: 'OBJ-SST-05',
    name: 'Gestión Preventiva del Clima Laboral y Factores Psicosociales',
    description: 'Promover la convivencia laboral pacífica y gestionar el 100% de las solicitudes o quejas ante el Comité de Convivencia Laboral dentro de los plazos perentorios de la Resolución 3461 de 2025.',
    policyCommitmentId: 'comp-05',
    policyCommitmentTitle: 'Articulación con Seguridad Vial, Convivencia y Medio Ambiente (COMP-05)',
    responsible: 'Presidenta CCL / Mariana Restrepo',
    period: '2026',
    baseline: '100% de solicitudes atendidas en 2025',
    targetValue: 100.0,
    targetUnit: '% Casos Oportunos',
    targetDeadline: '2026-12-31',
    targetCriteria: 'SUPERAR_VALOR',
    frequency: 'TRIMESTRAL',
    status: 'CUMPLIDO',
    observations: 'Todas las quejas radicadas cuentan con audiencias de versión libre y trámites confidenciales dentro de los términos legales.',
    indicators: [
      {
        id: 'ind-07',
        name: 'Cumplimiento de Términos Legales CCL (Res. 3461/2025)',
        type: 'PROCESO',
        formula: '(Casos gestionados en término / Total casos radicados) * 100',
        target: '100%',
        currentResult: '100%'
      }
    ],
    relatedPrograms: [
      'Estándar 1.1.8 Comité de Convivencia Laboral',
      'Protocolos de Prevención de Acoso Res. 3461/2025',
      'Batería de Riesgo Psicosocial'
    ],
    followUps: [
      {
        id: 'fu-05-01',
        periodEvaluated: 'Q1 2026 (Ene - Mar)',
        evaluatedAt: '2026-03-31',
        actualValue: 100.0,
        targetExpected: 100.0,
        progressPercentage: 100,
        calculatedStatus: 'CUMPLIDO',
        observations: 'Se atendieron 3 solicitudes con acuerdos confidenciales y audiencias separadas conforme al protocolo.',
        evidenceTitle: 'Actas de Audiencia Reservada CCL',
        responsibleName: 'Mariana Restrepo'
      }
    ],
    deviations: [],
    createdAt: '2026-01-16',
    updatedAt: '2026-03-31'
  }
];
