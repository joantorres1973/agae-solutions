// ============================================================================
// Datos Iniciales y Estado Global del Programa de Capacitación, Inducción y Aula Virtual
// Conforme a la Resolución 0312 de 2019 (Estándar 1.2) y Decreto 1072 de 2015 Art. 2.2.4.6.11
// ============================================================================

import {
  TrainingPlanActivity,
  VirtualCourse,
  VirtualCertificate,
  InductionPackage,
  AiTrainingSuggestion,
  TrainingGlobalState
} from '@/types/training';

export const INITIAL_TRAINING_ACTIVITIES: TrainingPlanActivity[] = [
  {
    id: 'act-cap-01',
    code: 'CAP-2026-001',
    topic: 'Inducción y Reinducción Integral en SG-SST y Políticas Corporativas',
    objective: 'Dar a conocer las políticas de SST, objetivos, identificación de peligros, plan de emergencias y deberes legales.',
    activityType: 'INDUCCION',
    targetAudienceType: 'TODOS',
    targetAudienceDetail: 'Todo el personal activo, contratistas y nuevos ingresos',
    targetWorkerIds: ['wrk-001', 'wrk-002', 'wrk-003', 'wrk-004', 'wrk-005', 'wrk-006', 'wrk-007', 'wrk-008'],
    scheduledWorkerCount: 18,
    responsible: 'Ing. Laura Moreno (Líder SG-SST)',
    facilitator: 'Ing. Laura Moreno / ARL Seguros Bolívar',
    facilitatorEntity: 'INTERNO',
    modality: 'HIBRIDA',
    scheduledDate: '2026-01-20',
    scheduledMonth: 1,
    estimatedDurationHours: 4,
    requiredResources: 'Sala de juntas, video beam, cartillas digitales de inducción, evaluaciones',
    locationOrLink: 'Sede Principal Fontibón / Transmisión Teams',
    status: 'EJECUTADA',
    actualDate: '2026-01-20',
    actualDurationHours: 4,
    attendeesCount: 18,
    attendanceRate: 100,
    evaluationRequired: true,
    passingScoreMin: 80,
    averageEvaluationScore: 92,
    evidenceFileNames: ['acta_induccion_general_2026.pdf', 'registro_firmas_induccion_enero.pdf'],
    observations: 'Inducción institucional realizada con 100% de asistencia. Se evaluó la comprensión de la política y el COPASST.',
    rescheduleHistory: [],
    attendees: [
      {
        workerId: 'wrk-001',
        workerName: 'Juan Carlos Pérez Restrepo',
        workerDocNumber: '1018452981',
        workerPosition: 'Supervisor de Operaciones y Seguridad',
        attended: true,
        evaluationScore: 95,
        approved: true,
        certificateCode: 'AGA-CAP-2026-000101',
        registeredAt: '2026-01-20 12:00'
      },
      {
        workerId: 'wrk-002',
        workerName: 'Carlos Mario Mendoza Varela',
        workerDocNumber: '79841235',
        workerPosition: 'Conductor Vehículo Carga Pesada C2',
        attended: true,
        evaluationScore: 90,
        approved: true,
        certificateCode: 'AGA-CAP-2026-000102',
        registeredAt: '2026-01-20 12:00'
      }
    ],
    linkedStandardCode: '1.2.2',
    createdAt: '2026-01-05',
    updatedAt: '2026-01-20'
  },
  {
    id: 'act-cap-02',
    code: 'CAP-2026-002',
    topic: 'Prevención del Riesgo Biomecánico, Manipulación Manual de Cargas e Higiene Postural',
    objective: 'Capacitar a conductores y operarios en técnicas biomecánicas seguras de levantamiento y descarga de bultos (Res. 2400/1979).',
    activityType: 'RIESGO_ESPECIFICO',
    targetAudienceType: 'GRUPO_RIESGO',
    targetAudienceDetail: 'Conductores, Auxiliares de Ruta y Personal de Patio y Bodega',
    targetWorkerIds: ['wrk-002', 'wrk-004', 'wrk-006', 'wrk-007'],
    scheduledWorkerCount: 14,
    responsible: 'Ing. Laura Moreno (Líder SST)',
    facilitator: 'Aula Virtual AGAE / Fisioterapeuta Especialista ARL',
    facilitatorEntity: 'AGAE_SOLUTIONS',
    modality: 'AULA_VIRTUAL_AGAE',
    scheduledDate: '2026-02-18',
    scheduledMonth: 2,
    estimatedDurationHours: 2,
    requiredResources: 'Plataforma Aula Virtual AGAE, video interactivo y evaluación de 5 preguntas',
    locationOrLink: 'https://agae-solutions.com/aula-virtual/curso/CUR-BIO-001',
    status: 'EJECUTADA',
    actualDate: '2026-02-19',
    actualDurationHours: 2,
    attendeesCount: 13,
    attendanceRate: 93,
    evaluationRequired: true,
    passingScoreMin: 80,
    averageEvaluationScore: 88,
    evidenceFileNames: ['reporte_aprobacion_aula_virtual_biomecanico.pdf'],
    observations: 'Curso virtual completado por 13 de 14 trabajadores programados. Se emitieron certificados digitales automáticos.',
    rescheduleHistory: [],
    attendees: [
      {
        workerId: 'wrk-002',
        workerName: 'Carlos Mario Mendoza Varela',
        workerDocNumber: '79841235',
        workerPosition: 'Conductor Vehículo Carga Pesada C2',
        attended: true,
        evaluationScore: 100,
        approved: true,
        certificateCode: 'AGA-CAP-2026-000142',
        registeredAt: '2026-02-19 15:30'
      },
      {
        workerId: 'wrk-006',
        workerName: 'Jorge Eliécer Castro Pinto',
        workerDocNumber: '19482015',
        workerPosition: 'Operario de Mantenimiento y Patio',
        attended: true,
        evaluationScore: 85,
        approved: true,
        certificateCode: 'AGA-CAP-2026-000143',
        registeredAt: '2026-02-19 16:10'
      }
    ],
    linkedVirtualCourseId: 'CUR-BIO-001',
    linkedHazardClass: 'BIOMECANICO',
    linkedStandardCode: '1.2.1',
    createdAt: '2026-01-10',
    updatedAt: '2026-02-19'
  },
  {
    id: 'act-cap-03',
    code: 'CAP-2026-003',
    topic: 'Seguridad Vial: Conducción Defensiva, Velocidad y Fatiga (PESV - Paso 10)',
    objective: 'Fortalecer las competencias de los conductores en gestión de la velocidad, prevención del microsueño y normatividad vial vigente.',
    activityType: 'PESV_SEGURIDAD_VIAL',
    targetAudienceType: 'CARGO',
    targetAudienceDetail: 'Conductores de camiones y camionetas de supervisión',
    targetWorkerIds: ['wrk-002', 'wrk-004'],
    scheduledWorkerCount: 8,
    responsible: 'Ing. Laura Moreno / Comité de Seguridad Vial',
    facilitator: 'Aula Virtual AGAE / Formador Vial Certificado',
    facilitatorEntity: 'AGAE_SOLUTIONS',
    modality: 'AULA_VIRTUAL_AGAE',
    scheduledDate: '2026-03-12',
    scheduledMonth: 3,
    estimatedDurationHours: 3,
    requiredResources: 'Módulo PESV interactivo, simulador de distancias de frenado y evaluación',
    locationOrLink: 'https://agae-solutions.com/aula-virtual/curso/CUR-PESV-001',
    status: 'EJECUTADA',
    actualDate: '2026-03-14',
    actualDurationHours: 3,
    attendeesCount: 8,
    attendanceRate: 100,
    evaluationRequired: true,
    passingScoreMin: 80,
    averageEvaluationScore: 91,
    evidenceFileNames: ['certificados_pesv_marzo_2026.pdf'],
    observations: 'Cumplimiento del 100% del personal de conductores en el paso 10 del PESV (Resolución 40595 de 2022).',
    rescheduleHistory: [],
    attendees: [
      {
        workerId: 'wrk-002',
        workerName: 'Carlos Mario Mendoza Varela',
        workerDocNumber: '79841235',
        workerPosition: 'Conductor Vehículo Carga Pesada C2',
        attended: true,
        evaluationScore: 92,
        approved: true,
        certificateCode: 'AGA-CAP-2026-000144',
        registeredAt: '2026-03-14 11:20'
      }
    ],
    linkedVirtualCourseId: 'CUR-PESV-001',
    linkedHazardClass: 'CONDICIONES_SEGURIDAD',
    linkedStandardCode: '1.2.1',
    createdAt: '2026-01-10',
    updatedAt: '2026-03-14'
  },
  {
    id: 'act-cap-04',
    code: 'CAP-2026-004',
    topic: 'Inspección, Uso Adecuado, Limpieza y Mantenimiento de EPP Certificados',
    objective: 'Garantizar el uso estricto y la inspección preoperacional de calzado dieléctrico, protección visual y guantes técnicos.',
    activityType: 'SST_GENERAL',
    targetAudienceType: 'AREA',
    targetAudienceDetail: 'Áreas Operativas, Patio de Despacho y Mantenimiento',
    targetWorkerIds: ['wrk-002', 'wrk-004', 'wrk-006', 'wrk-007'],
    scheduledWorkerCount: 12,
    responsible: 'Ing. Laura Moreno (Líder SST)',
    facilitator: 'Proveedor Técnico 3M / Líder SST',
    facilitatorEntity: 'EXTERNO',
    modality: 'PRESENCIAL',
    scheduledDate: '2026-04-16',
    scheduledMonth: 4,
    estimatedDurationHours: 2,
    requiredResources: 'Muestras físicas de EPP, fichas técnicas de homologación, listas de chequeo',
    locationOrLink: 'Patio Central de Maniobras Fontibón',
    status: 'PROGRAMADA',
    attendeesCount: 0,
    attendanceRate: 0,
    evaluationRequired: true,
    passingScoreMin: 80,
    evidenceFileNames: [],
    rescheduleHistory: [],
    attendees: [],
    linkedHazardClass: 'MECANICO',
    linkedStandardCode: '2.1.1',
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10'
  },
  {
    id: 'act-cap-05',
    code: 'CAP-2026-005',
    topic: 'Prevención y Control Inicial de Incendios: Manejo Seguro de Extintores Portátiles',
    objective: 'Entrenar a brigadistas y personal de planta en química del fuego, clases de fuego y descarga práctica de extintor de 20 lbs ABC.',
    activityType: 'EMERGENCIAS_BRIGADA',
    targetAudienceType: 'TODOS',
    targetAudienceDetail: 'Brigada de Emergencias y Colaboradores de Sede Fontibón',
    targetWorkerIds: ['wrk-001', 'wrk-003', 'wrk-005', 'wrk-006', 'wrk-008'],
    scheduledWorkerCount: 16,
    responsible: 'Comandante de Brigada / Líder SST',
    facilitator: 'Cuerpo de Bomberos / Empresa Recargadora Certificada NFPA',
    facilitatorEntity: 'EXTERNO',
    modality: 'PRESENCIAL',
    scheduledDate: '2026-06-10',
    scheduledMonth: 6,
    estimatedDurationHours: 3,
    requiredResources: '4 extintores de práctica, bandeja de fuego controlada, elementos de protección',
    locationOrLink: 'Zona abierta de patio Fontibón',
    status: 'REPROGRAMADA',
    attendeesCount: 0,
    attendanceRate: 0,
    evaluationRequired: true,
    passingScoreMin: 80,
    evidenceFileNames: [],
    rescheduleHistory: [
      {
        id: 'resc-01',
        originalDate: '2026-05-15',
        newDate: '2026-06-10',
        reason: 'Lluvias torrenciales y reprogramación de la visita técnica del facilitador de bomberos.',
        registeredBy: 'Laura Moreno (Líder SST)',
        registeredAt: '2026-05-12 10:15',
        notes: 'Se acordó con gerencia y el facilitador realizar la práctica a inicios de junio.'
      }
    ],
    attendees: [],
    linkedHazardClass: 'CONDICIONES_SEGURIDAD',
    linkedStandardCode: '4.1.1',
    createdAt: '2026-01-10',
    updatedAt: '2026-05-12'
  },
  {
    id: 'act-cap-06',
    code: 'CAP-2026-006',
    topic: 'Convivencia Laboral, Prevención del Acoso y Comunicación Asertiva (Resolución 3461 de 2025)',
    objective: 'Sensibilizar sobre relaciones interpersonales sanas, rutas de trámite confidencial del CCL y prevención de conductas lesivas.',
    activityType: 'CCL',
    targetAudienceType: 'TODOS',
    targetAudienceDetail: 'Todo el personal operativo y administrativo',
    targetWorkerIds: ['wrk-001', 'wrk-002', 'wrk-003', 'wrk-005', 'wrk-007'],
    scheduledWorkerCount: 18,
    responsible: 'Comité de Convivencia Laboral / Psicóloga ARL',
    facilitator: 'Psicóloga Especialista en SST - ARL',
    facilitatorEntity: 'ARL',
    modality: 'HIBRIDA',
    scheduledDate: '2026-07-16',
    scheduledMonth: 7,
    estimatedDurationHours: 2,
    requiredResources: 'Taller participativo, dinámicas grupales, folletos del protocolo CCL',
    locationOrLink: 'Auditorio Fontibón / Enlace Seguro Teams',
    status: 'PROGRAMADA',
    attendeesCount: 0,
    attendanceRate: 0,
    evaluationRequired: false,
    passingScoreMin: 0,
    evidenceFileNames: [],
    rescheduleHistory: [],
    attendees: [],
    linkedStandardCode: '1.1.8',
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10'
  },
  {
    id: 'act-cap-07',
    code: 'CAP-2026-007',
    topic: 'Capacitación Específica COPASST: Metodología de Investigación de Incidentes y Accidentes de Trabajo',
    objective: 'Formar a los miembros principales y suplentes del COPASST en la metodología de árbol de causas y análisis de causalidad (Res. 1401/2007).',
    activityType: 'COPASST',
    targetAudienceType: 'CARGO',
    targetAudienceDetail: 'Miembros Principales y Suplentes del COPASST',
    targetWorkerIds: ['wrk-001', 'wrk-003', 'wrk-004', 'wrk-006'],
    scheduledWorkerCount: 4,
    responsible: 'Presidente del COPASST / Líder SST',
    facilitator: 'Ing. Especialista ARL Seguros Bolívar',
    facilitatorEntity: 'ARL',
    modality: 'PRESENCIAL',
    scheduledDate: '2026-08-20',
    scheduledMonth: 8,
    estimatedDurationHours: 3,
    requiredResources: 'Guías de investigación de la ARL, casos prácticos, formatos de informe',
    locationOrLink: 'Sala de Juntas SST',
    status: 'PROGRAMADA',
    attendeesCount: 0,
    attendanceRate: 0,
    evaluationRequired: true,
    passingScoreMin: 80,
    evidenceFileNames: [],
    rescheduleHistory: [],
    attendees: [],
    linkedStandardCode: '1.1.7',
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10'
  },
  {
    id: 'act-cap-08',
    code: 'CAP-2026-008',
    topic: 'Primeros Auxilios Básicos, Reanimación Cardiopulmonar (RCP) y Desobstrucción de Vía Aérea',
    objective: 'Entrenar a brigadistas y personal de patio en soporte vital básico y manejo de botiquín tipo B.',
    activityType: 'EMERGENCIAS_BRIGADA',
    targetAudienceType: 'GRUPO_RIESGO',
    targetAudienceDetail: 'Brigada de Emergencia y Supervisores de Patio',
    targetWorkerIds: ['wrk-001', 'wrk-003', 'wrk-005', 'wrk-006'],
    scheduledWorkerCount: 8,
    responsible: 'Comandante de Brigada',
    facilitator: 'Paramédico Cruz Roja Colombiana',
    facilitatorEntity: 'EXTERNO',
    modality: 'PRESENCIAL',
    scheduledDate: '2026-09-18',
    scheduledMonth: 9,
    estimatedDurationHours: 4,
    requiredResources: 'Maniquí de RCP, simulador DEA, botiquín tipo B, gasas y vendajes',
    locationOrLink: 'Sala de Capacitación Fontibón',
    status: 'PROGRAMADA',
    attendeesCount: 0,
    attendanceRate: 0,
    evaluationRequired: true,
    passingScoreMin: 80,
    evidenceFileNames: [],
    rescheduleHistory: [],
    attendees: [],
    linkedStandardCode: '4.1.1',
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10'
  }
];

export const INITIAL_VIRTUAL_COURSES: VirtualCourse[] = [
  {
    id: 'CUR-BIO-001',
    code: 'CUR-BIO-001',
    title: 'Prevención del Riesgo Biomecánico y Ergonomía en Operaciones de Transporte y Logística',
    description: 'Curso interactivo sobre posturas saludables, higiene de columna, pausas activas y límites máximos seguros de levantamiento manual de cargas conforme a la Resolución 2400 de 1979.',
    objective: 'Capacitar al colaborador en la adopción de posturas correctas durante la jornada laboral y la prevención efectiva de trastornos musculoesqueléticos en hombros, espalda y zona lumbar.',
    category: 'RIESGO_BIOMECANICO',
    durationMinutes: 120,
    targetAudience: 'Conductores, Auxiliares de Cargue, Bodegueros y Personal Administrativo',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoDurationSeconds: 420,
    minWatchPercentageRequired: 85,
    supplementaryMaterialUrls: [
      { title: 'Guía Rápida de Levantamiento Seguro de Cargas (PDF)', url: '#' },
      { title: 'Cartilla de Ejercicios y Pausas Activas para Conductores', url: '#' }
    ],
    questionsCount: 5,
    minPassingPercentage: 80,
    maxAttempts: 3,
    validityMonths: 12,
    isPublished: true,
    version: '2.0',
    facilitatorName: 'Dra. Claudia Ortiz (Fisioterapeuta Especialista SST)',
    facilitatorTitle: 'Especialista en Ergonomía Ocupacional y Biomecánica',
    publicEnrollmentUrlToken: 'AGAE-TOKEN-CUR-BIO-001',
    questions: [
      {
        id: 'q-bio-01',
        question: '¿Cuál es el límite máximo de levantamiento de carga manual para un hombre en condiciones ideales según la Resolución 2400 de 1979?',
        type: 'SINGLE_CHOICE',
        options: ['15 kg', '25 kg', '50 kg', '75 kg'],
        correctAnswerIndex: 1,
        explanation: 'En Colombia, el límite normativo de carga para hombres es de 25 kg en condiciones habituales.'
      },
      {
        id: 'q-bio-02',
        question: 'Al levantar un objeto pesado del suelo, la fuerza principal debe realizarse con:',
        type: 'SINGLE_CHOICE',
        options: [
          'La espalda, manteniendo las piernas completamente rectas',
          'Los músculos de las piernas (glúteos y cuádriceps), flexionando las rodillas',
          'Los brazos exclusivamente sin flexionar el cuerpo',
          'El cuello y la cintura mediante torsión brusca'
        ],
        correctAnswerIndex: 1,
        explanation: 'Las piernas poseen los grupos musculares más potentes y protegen la columna lumbar de sobreesfuerzos.'
      },
      {
        id: 'q-bio-03',
        question: '¿Es recomendable girar el tronco mientras se sostiene una carga pesada en los brazos?',
        type: 'TRUE_FALSE',
        options: ['Verdadero', 'Falso'],
        correctAnswerIndex: 1,
        explanation: 'Falso. Nunca se debe rotar el tronco con carga; se deben mover los pies para cambiar de dirección y evitar lesiones discales.'
      },
      {
        id: 'q-bio-04',
        question: '¿Cada cuánto tiempo se recomienda realizar pausas activas durante jornadas de conducción o trabajo continuo?',
        type: 'SINGLE_CHOICE',
        options: [
          'Únicamente al finalizar la jornada de 8 horas',
          'Cada 2 a 3 horas de conducción o trabajo prolongado',
          'Una vez por semana',
          'Solo cuando ya se siente dolor agudo en la espalda'
        ],
        correctAnswerIndex: 1,
        explanation: 'Las pausas activas preventivas deben ejecutarse cada 2 horas para oxigenar los músculos y relajar la musculatura postural.'
      },
      {
        id: 'q-bio-05',
        question: 'Mantener la carga lo más pegada posible al cuerpo reduce la tensión sobre la columna lumbar.',
        type: 'TRUE_FALSE',
        options: ['Verdadero', 'Falso'],
        correctAnswerIndex: 0,
        explanation: 'Verdadero. Al reducir el brazo de palanca hacia el centro de gravedad, el esfuerzo muscular sobre los discos lumbares disminuye significativamente.'
      }
    ]
  },
  {
    id: 'CUR-PESV-001',
    code: 'CUR-PESV-001',
    title: 'Manejo Defensivo, Velocidad Segura y Normatividad Vial (PESV - Paso 10)',
    description: 'Capacitación obligatoria para conductores de vehículos de carga y supervisión conforme a la Resolución 40595 de 2022 y Código Nacional de Tránsito.',
    objective: 'Reconocer los factores de riesgo en las vías, adoptar hábitos de manejo preventivo, gestionar los puntos ciegos y evitar siniestros de tránsito.',
    category: 'SEGURIDAD_VIAL_PESV',
    durationMinutes: 180,
    targetAudience: 'Conductores y Operadores de Vehículos Automotores',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoDurationSeconds: 380,
    minWatchPercentageRequired: 90,
    supplementaryMaterialUrls: [
      { title: 'Decálogo del Conductor Seguro AGAE (PDF)', url: '#' },
      { title: 'Protocolo de Inspección Diaria Preoperacional de Vehículos', url: '#' }
    ],
    questionsCount: 5,
    minPassingPercentage: 80,
    maxAttempts: 3,
    validityMonths: 12,
    isPublished: true,
    version: '1.5',
    facilitatorName: 'Capitán (R) Jorge Hernán Cárdenas',
    facilitatorTitle: 'Perito Judicial en Accidentología Vial y Formador Certificado PESV',
    publicEnrollmentUrlToken: 'AGAE-TOKEN-CUR-PESV-001',
    questions: [
      {
        id: 'q-pesv-01',
        question: 'En condiciones de lluvia o calzada húmeda, la distancia de seguimiento con el vehículo delantero debe:',
        type: 'SINGLE_CHOICE',
        options: ['Disminuirse para no perder de vista al vehículo', 'Mantenerse en 1 segundo', 'Duplicarse (regla de los 4 a 6 segundos)', 'Ser exactamente la misma que en piso seco'],
        correctAnswerIndex: 2,
        explanation: 'En piso mojado la adherencia del neumático se reduce hasta un 50%, requiriendo mayor distancia para frenar de manera segura.'
      },
      {
        id: 'q-pesv-02',
        question: 'El uso del teléfono celular con manos libres elimina por completo la distracción cognitiva al conducir.',
        type: 'TRUE_FALSE',
        options: ['Verdadero', 'Falso'],
        correctAnswerIndex: 1,
        explanation: 'Falso. Aunque las manos estén libres, la conversación distrae el cerebro y ralentiza el tiempo de reacción ante un imprevisto.'
      },
      {
        id: 'q-pesv-03',
        question: '¿Qué se debe hacer de inmediato si se presentan síntomas de fatiga o microsueño al volante?',
        type: 'SINGLE_CHOICE',
        options: [
          'Subir el volumen de la radio y continuar el viaje',
          'Tomar bebidas energizantes y acelerar para llegar pronto',
          'Estacionar el vehículo en un lugar seguro y descansar mínimo 20 minutos',
          'Abrir la ventana para que entre aire frío y seguir manejando'
        ],
        correctAnswerIndex: 2,
        explanation: 'La única medida eficaz y segura contra el microsueño es detener el vehículo en un sitio seguro y dormir o reposar.'
      },
      {
        id: 'q-pesv-04',
        question: 'La inspección preoperacional diaria del vehículo es una obligación legal del conductor antes de iniciar la marcha.',
        type: 'TRUE_FALSE',
        options: ['Verdadero', 'Falso'],
        correctAnswerIndex: 0,
        explanation: 'Verdadero. La Resolución 40595 de 2022 exige verificar frenos, llantas, luces, fluidos y equipo de prevención antes de cada jornada.'
      },
      {
        id: 'q-pesv-05',
        question: 'Los puntos ciegos en un camión de carga pesada son mayores en:',
        type: 'SINGLE_CHOICE',
        options: ['El lado derecho y la parte posterior del vehículo', 'Únicamente el parabrisas frontal', 'No existen puntos ciegos si se tienen espejos', 'Solo en el techo'],
        correctAnswerIndex: 0,
        explanation: 'El costado lateral derecho y la parte trasera inmediata son las zonas con mayor invisibilidad para el conductor de un camión.'
      }
    ]
  },
  {
    id: 'CUR-EXT-001',
    code: 'CUR-EXT-001',
    title: 'Control Inicial del Fuego y Uso Práctico de Extintores Portátiles Multipropósito ABC',
    description: 'Formación teórica y práctica sobre conatos de incendio, clasificación de combustibles y técnica segura PASS / TAPE para uso de extintores.',
    objective: 'Reconocer los principios de la combustión y actuar oportunamente ante un conato de incendio en instalaciones o vehículos.',
    category: 'EMERGENCIAS_EXTINTORES',
    durationMinutes: 120,
    targetAudience: 'Brigadistas, Personal de Mantenimiento y Conductores',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 300,
    minWatchPercentageRequired: 80,
    supplementaryMaterialUrls: [
      { title: 'Infografía Tipos de Fuego y Extintores (PDF)', url: '#' }
    ],
    questionsCount: 5,
    minPassingPercentage: 80,
    maxAttempts: 3,
    validityMonths: 12,
    isPublished: true,
    version: '1.2',
    facilitatorName: 'Sgto. Andrés Felipe Salazar (Bombero Profesional)',
    facilitatorTitle: 'Instructor de Respuesta a Emergencias Industriales NFPA',
    publicEnrollmentUrlToken: 'AGAE-TOKEN-CUR-EXT-001',
    questions: [
      {
        id: 'q-ext-01',
        question: '¿Qué tipo de extintor es el más adecuado para fuegos en equipos eléctricos energizados?',
        type: 'SINGLE_CHOICE',
        options: ['Extintor de Agua a presión', 'Extintor de Solkaflam o Dióxido de Carbono (CO2) / Polvo Químico Seco', 'Extintor de Espuma química', 'Baldes con agua'],
        correctAnswerIndex: 1,
        explanation: 'El agua conduce la electricidad y genera electrocución; se deben usar agentes no conductores como CO2 o polvo químico seco.'
      },
      {
        id: 'q-ext-02',
        question: 'Al operar un extintor portátil, el chorro del agente extintor debe dirigirse hacia:',
        type: 'SINGLE_CHOICE',
        options: ['La parte superior del humo', 'La base de las llamas en movimiento de abanico', 'Las paredes del recinto', 'El techo'],
        correctAnswerIndex: 1,
        explanation: 'El fuego se sofoca atacando la base del material combustible en combustión con movimiento en vaivén.'
      },
      {
        id: 'q-ext-03',
        question: 'La aguja del manómetro de un extintor de polvo químico seco debe encontrarse en la zona verde para estar operativo.',
        type: 'TRUE_FALSE',
        options: ['Verdadero', 'Falso'],
        correctAnswerIndex: 0,
        explanation: 'Verdadero. La zona verde indica que la presión interna del nitrógeno propulsor es la correcta.'
      },
      {
        id: 'q-ext-04',
        question: 'La distancia recomendada para iniciar la descarga de un extintor portátil frente al conato es de aproximadamente:',
        type: 'SINGLE_CHOICE',
        options: ['10 centímetros', '2 a 3 metros', '15 metros', '50 metros'],
        correctAnswerIndex: 1,
        explanation: 'A 2 o 3 metros se mantiene una distancia segura del calor radiante y el chorro tiene el alcance óptimo.'
      },
      {
        id: 'q-ext-05',
        question: 'Un extintor portátil está diseñado para apagar incendios declarados de grandes proporciones.',
        type: 'TRUE_FALSE',
        options: ['Verdadero', 'Falso'],
        correctAnswerIndex: 1,
        explanation: 'Falso. Los extintores son exclusivamente para conatos o fuegos incipientes en su etapa inicial.'
      }
    ]
  },
  {
    id: 'CUR-PSICO-001',
    code: 'CUR-PSICO-001',
    title: 'Sana Convivencia Laboral, Prevención del Acoso y Resolución Pacífica de Conflictos (Res. 3461 de 2025)',
    description: 'Herramientas prácticas para fortalecer el respeto, la escucha asertiva, el trabajo en equipo y el conocimiento de la ruta preventiva del Comité de Convivencia Laboral.',
    objective: 'Promover un entorno organizacional armónico, libre de discriminación y agresiones verbales o psicológicas.',
    category: 'RIESGO_PSICOSOCIAL',
    durationMinutes: 120,
    targetAudience: 'Todos los Colaboradores, Mandos Medios y Líderes de Proceso',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    videoDurationSeconds: 320,
    minWatchPercentageRequired: 80,
    supplementaryMaterialUrls: [
      { title: 'Protocolo de Convivencia y Trámite Confidencial AGAE (PDF)', url: '#' }
    ],
    questionsCount: 5,
    minPassingPercentage: 80,
    maxAttempts: 3,
    validityMonths: 12,
    isPublished: true,
    version: '1.0',
    facilitatorName: 'Dra. Sandra Milena Restrepo',
    facilitatorTitle: 'Psicóloga Especialista en Psicología de la Salud Ocupacional',
    publicEnrollmentUrlToken: 'AGAE-TOKEN-CUR-PSICO-001',
    questions: [
      {
        id: 'q-psi-01',
        question: '¿Cuál es la función principal del Comité de Convivencia Laboral según la Resolución 3461 de 2025?',
        type: 'SINGLE_CHOICE',
        options: [
          'Sancionar económicamente a los trabajadores',
          'Generar espacios preventivos de diálogo, conciliación y concertación amigable',
          'Despedir empleados con justa causa',
          'Interponer demandas penales automáticas'
        ],
        correctAnswerIndex: 1,
        explanation: 'El Comité de Convivencia Laboral es 100% preventivo, orientador y conciliador; no tiene facultades disciplinarias ni judiciales.'
      },
      {
        id: 'q-psi-02',
        question: 'Expresar desacuerdos laborales de manera firme pero respetuosa, sin descalificar a la persona, es un ejemplo de:',
        type: 'SINGLE_CHOICE',
        options: ['Comunicación pasivo-agresiva', 'Comunicación asertiva', 'Hostigamiento laboral', 'Apatía'],
        correctAnswerIndex: 1,
        explanation: 'La asertividad permite defender las ideas con claridad y respeto hacia la dignidad del interlocutor.'
      },
      {
        id: 'q-psi-03',
        question: 'Las exigencias razonables de cumplimiento de metas y entrega de labores estipuladas en el contrato constituyen automáticamente acoso laboral.',
        type: 'TRUE_FALSE',
        options: ['Verdadero', 'Falso'],
        correctAnswerIndex: 1,
        explanation: 'Falso. La ley establece que las órdenes legítimas y el ejercicio de la potestad directiva orientada al cumplimiento laboral no constituyen acoso.'
      },
      {
        id: 'q-psi-04',
        question: 'El trámite de las solicitudes y quejas ante el Comité de Convivencia Laboral se caracteriza por ser:',
        type: 'SINGLE_CHOICE',
        options: [
          'Público y divulgado en carteleras',
          'Estrictamente confidencial y bajo reserva procesal',
          'Transmitido por redes sociales corporativas',
          'Notificado a todos los compañeros de área'
        ],
        correctAnswerIndex: 1,
        explanation: 'La confidencialidad es el principio sagrado del CCL para proteger la privacidad, la honra y el debido proceso de las partes.'
      },
      {
        id: 'q-psi-05',
        question: 'Escuchar a las partes involucradas por separado en una primera instancia previene la revictimización y el escalamiento del conflicto.',
        type: 'TRUE_FALSE',
        options: ['Verdadero', 'Falso'],
        correctAnswerIndex: 0,
        explanation: 'Verdadero. La Resolución 3461 de 2025 ordena escuchar de manera individual y en sesiones separadas a las partes.'
      }
    ]
  }
];

export const INITIAL_CERTIFICATES: VirtualCertificate[] = [
  {
    id: 'cert-001',
    code: 'AGA-CAP-2026-000142',
    courseId: 'CUR-BIO-001',
    courseTitle: 'Prevención del Riesgo Biomecánico y Ergonomía en Operaciones de Transporte y Logística',
    workerId: 'wrk-002',
    workerName: 'Carlos Mario Mendoza Varela',
    workerDocNumber: '79841235',
    companyName: 'Andina de Seguridad & Logística S.A.S.',
    issueDate: '2026-02-19',
    hours: 2,
    scorePercentage: 100,
    status: 'VALIDO',
    verificationUrl: 'https://agae-solutions.com/certificados/verificar/AGA-CAP-2026-000142',
    facilitatorName: 'Dra. Claudia Ortiz (Fisioterapeuta Especialista SST)',
    qrCodeData: 'https://agae-solutions.com/certificados/verificar/AGA-CAP-2026-000142',
    registeredInMasterWorker: true
  },
  {
    id: 'cert-002',
    code: 'AGA-CAP-2026-000143',
    courseId: 'CUR-BIO-001',
    courseTitle: 'Prevención del Riesgo Biomecánico y Ergonomía en Operaciones de Transporte y Logística',
    workerId: 'wrk-006',
    workerName: 'Jorge Eliécer Castro Pinto',
    workerDocNumber: '19482015',
    companyName: 'Andina de Seguridad & Logística S.A.S.',
    issueDate: '2026-02-19',
    hours: 2,
    scorePercentage: 85,
    status: 'VALIDO',
    verificationUrl: 'https://agae-solutions.com/certificados/verificar/AGA-CAP-2026-000143',
    facilitatorName: 'Dra. Claudia Ortiz (Fisioterapeuta Especialista SST)',
    qrCodeData: 'https://agae-solutions.com/certificados/verificar/AGA-CAP-2026-000143',
    registeredInMasterWorker: true
  },
  {
    id: 'cert-003',
    code: 'AGA-CAP-2026-000144',
    courseId: 'CUR-PESV-001',
    courseTitle: 'Manejo Defensivo, Velocidad Segura y Normatividad Vial (PESV - Paso 10)',
    workerId: 'wrk-002',
    workerName: 'Carlos Mario Mendoza Varela',
    workerDocNumber: '79841235',
    companyName: 'Andina de Seguridad & Logística S.A.S.',
    issueDate: '2026-03-14',
    hours: 3,
    scorePercentage: 92,
    status: 'VALIDO',
    verificationUrl: 'https://agae-solutions.com/certificados/verificar/AGA-CAP-2026-000144',
    facilitatorName: 'Capitán (R) Jorge Hernán Cárdenas',
    qrCodeData: 'https://agae-solutions.com/certificados/verificar/AGA-CAP-2026-000144',
    registeredInMasterWorker: true
  }
];

export const INITIAL_INDUCTIONS: InductionPackage[] = [
  {
    id: 'ind-001',
    workerId: 'wrk-006',
    workerName: 'Jorge Eliécer Castro Pinto',
    workerDocNumber: '19482015',
    workerPosition: 'Operario de Mantenimiento y Patio',
    workerArea: 'Operaciones y Mantenimiento',
    hireDate: '2026-01-15',
    type: 'INDUCCION',
    status: 'EVALUADO_APROBADO',
    assignedDate: '2026-01-15',
    dueDate: '2026-01-16',
    completedDate: '2026-01-15',
    generalTopicsCovered: [
      'Política de SST y Objetivos 2026',
      'Peligros Prioritarios y Mecanismos de Reporte de Actos Inseguros',
      'Rol del COPASST y Comité de Convivencia Laboral',
      'Plan de Emergencias y Rutas de Evacuación Sede Fontibón',
      'Reglamento de Higiene y Seguridad Industrial'
    ],
    jobSpecificTopicsCovered: [
      'Uso obligatorio de botas dieléctricas y guantes de carnaza en patio',
      'Procedimiento de Bloqueo y Etiquetado (LOTO) en generador',
      'Regla de oro: No manipular cargas superiores a 25 kg sin ayuda'
    ],
    evaluationScore: 96,
    evaluatorName: 'Ing. Laura Moreno (Líder SST)',
    evidenceFileName: 'acta_induccion_firmada_castro.pdf',
    certificateCode: 'AGA-IND-2026-00012',
    isRegisteredInProfile: true
  },
  {
    id: 'ind-002',
    workerId: 'wrk-007',
    workerName: 'Diego Armando Morales',
    workerDocNumber: '1020478129',
    workerPosition: 'Auxiliar de Logística y Almacén',
    workerArea: 'Logística',
    hireDate: '2026-02-01',
    type: 'INDUCCION',
    status: 'EVALUADO_APROBADO',
    assignedDate: '2026-02-01',
    dueDate: '2026-02-02',
    completedDate: '2026-02-01',
    generalTopicsCovered: [
      'Política de SST y Derechos/Deberes en ARL',
      'Identificación de Peligros en Bodega',
      'Rutas de Evacuación y Punto de Encuentro'
    ],
    jobSpecificTopicsCovered: [
      'Almacenamiento seguro en estanterías y pasillos despejados',
      'Inspección preoperacional de transpaleta manual'
    ],
    evaluationScore: 90,
    evaluatorName: 'Ing. Laura Moreno (Líder SST)',
    evidenceFileName: 'induccion_diego_morales.pdf',
    certificateCode: 'AGA-IND-2026-00015',
    isRegisteredInProfile: true
  }
];

export const INITIAL_AI_SUGGESTIONS: AiTrainingSuggestion[] = [
  {
    id: 'sug-01',
    proposedTopic: 'Entrenamiento en Trastornos Musculoesqueléticos y Prevención de Lumbalgias',
    objective: 'Reducir la incidencia de fatiga lumbar y posturas forzadas identificadas en la matriz de peligros.',
    rationale: 'El análisis de la Matriz GTC 45 clasifica el peligro biomecánico en el patio de Fontibón como RIESGO II (No Aceptable con Control). Además, 3 de los 5 hallazgos de inspección del último mes están asociados a posturas inadecuadas al descargar camiones.',
    source: 'MATRIZ_PELIGROS',
    recommendedTargetAudience: 'Operarios de cargue, conductores y bodegueros',
    recommendedHours: 2,
    priority: 'ALTA',
    status: 'SUGERIDA'
  },
  {
    id: 'sug-02',
    proposedTopic: 'Taller de Gestión de Estrés Operativo y Comunicación Bajo Presión',
    objective: 'Fortalecer habilidades de autorregulación emocional en horas pico de despacho.',
    rationale: 'El Comité de Convivencia Laboral reportó el caso CCL-2026-0001 relacionado con roces interpersonales por sobrecarga en los horarios pico matutinos.',
    source: 'CCL',
    recommendedTargetAudience: 'Supervisores de patio y conductores de despacho',
    recommendedHours: 2,
    priority: 'MEDIA',
    status: 'SUGERIDA'
  },
  {
    id: 'sug-03',
    proposedTopic: 'Inspección Preoperacional de Vehículos de Carga y Amarre de Cargas Pesadas',
    objective: 'Estandarizar el tensado de ratchets y estibas para evitar desprendimientos en ruta.',
    rationale: 'La acción correctiva ACPM-2026-002 derivada de un incidente vial leve identificó falta de pericia en el ajuste de bandas de sujeción.',
    source: 'ACPM_HALLAZGOS',
    recommendedTargetAudience: 'Conductores de camiones y auxiliares de ruta',
    recommendedHours: 3,
    priority: 'CRITICA',
    status: 'SUGERIDA'
  },
  {
    id: 'sug-04',
    proposedTopic: 'Actualización en la Resolución 3461 de 2025 para Mandos Medios y Líderes',
    objective: 'Capacitar a jefes de área en los nuevos lineamientos de convivencia laboral y prevención del acoso.',
    rationale: 'Cambio normativo vigente: la Resolución 3461 de 2025 derogó expresamente las Resoluciones 652 y 1356 de 2012, exigiendo actualización de protocolos de escucha y debido proceso.',
    source: 'REQUISITO_LEGAL',
    recommendedTargetAudience: 'Gerencia, Directores de Proceso y Supervisores',
    recommendedHours: 2,
    priority: 'ALTA',
    status: 'SUGERIDA'
  }
];

export const INITIAL_TRAINING_STATE: TrainingGlobalState = {
  currentYear: 2026,
  planActivities: INITIAL_TRAINING_ACTIVITIES,
  virtualCourses: INITIAL_VIRTUAL_COURSES,
  certificates: INITIAL_CERTIFICATES,
  inductions: INITIAL_INDUCTIONS,
  aiSuggestions: INITIAL_AI_SUGGESTIONS,
  customColumns: [
    { id: 'presupuestoAsignado', label: 'Presupuesto Estimado' },
    { id: 'cumplimientoArl', label: 'Acompañamiento ARL' }
  ],
  lastEvaluationAudit: '2026-02-28',
  copasstApprovalDate: '2026-01-12',
  managementApprovalDate: '2026-01-15'
};
