import {
  InitialEvaluationComponentDef,
  InitialEvaluationItem,
  InitialEvaluationAction,
  InitialEvaluationState,
  InitialEvaluationMetrics,
  InitialEvaluationComponentId
} from '@/types/initial-evaluation';

export const INITIAL_EVALUATION_COMPONENTS: InitialEvaluationComponentDef[] = [
  {
    id: 'COMP-01-NORMATIVIDAD',
    numeral: 1,
    title: '1. Identificación de la Normatividad Legal y Estándares Mínimos Aplicables',
    shortTitle: 'Normatividad Legal',
    legalBasis: 'Decreto 1072/2015 Art. 2.2.4.6.16 Numeral 1 y Resolución 0312 de 2019',
    description: 'Verificación del marco normativo nacional vigente en riesgos laborales y determinación de estándares mínimos aplicables a la organización.',
    color: 'border-teal-500 text-teal-700 bg-teal-50'
  },
  {
    id: 'COMP-02-PELIGROS-RIESGOS',
    numeral: 2,
    title: '2. Identificación de Peligros, Evaluación y Valoración de Riesgos',
    shortTitle: 'Peligros y Riesgos GTC 45',
    legalBasis: 'Decreto 1072/2015 Art. 2.2.4.6.16 Numeral 2 y Art. 2.2.4.6.15',
    description: 'Verificación anual de la metodología GTC 45 para todos los procesos, centros de trabajo y priorización de intervención.',
    color: 'border-amber-500 text-amber-700 bg-amber-50'
  },
  {
    id: 'COMP-03-AMENAZAS-EMERGENCIAS',
    numeral: 3,
    title: '3. Identificación de Amenazas y Evaluación de la Vulnerabilidad',
    shortTitle: 'Amenazas y Emergencias',
    legalBasis: 'Decreto 1072/2015 Art. 2.2.4.6.16 Numeral 3 y Art. 2.2.4.6.25',
    description: 'Análisis de vulnerabilidad ante amenazas naturales, tecnológicas y sociales, brigada de emergencia y simulacros.',
    color: 'border-rose-500 text-rose-700 bg-rose-50'
  },
  {
    id: 'COMP-04-EFECTIVIDAD-CONTROLES',
    numeral: 4,
    title: '4. Efectividad de las Medidas de Control y Reportes de los Trabajadores',
    shortTitle: 'Efectividad de Controles',
    legalBasis: 'Decreto 1072/2015 Art. 2.2.4.6.16 Numeral 4 y Art. 2.2.4.6.24',
    description: 'Evaluación anual de la eficacia de controles jerárquicos (fuente, medio, trabajador), inspecciones y reportes de actos y condiciones.',
    color: 'border-emerald-500 text-emerald-700 bg-emerald-50'
  },
  {
    id: 'COMP-05-CAPACITACION-INDUCCION',
    numeral: 5,
    title: '5. Cumplimiento del Programa de Capacitación, Inducción y Reinducción',
    shortTitle: 'Capacitación e Inducción',
    legalBasis: 'Decreto 1072/2015 Art. 2.2.4.6.16 Numeral 5 y Art. 2.2.4.6.11',
    description: 'Ejecución del plan anual de capacitación, cobertura en inducción y reinducción, acreditación del curso de 50h/20h.',
    color: 'border-orange-500 text-orange-700 bg-orange-50'
  },
  {
    id: 'COMP-06-PUESTOS-VIGILANCIA',
    numeral: 6,
    title: '6. Evaluación de Puestos de Trabajo y Vigilancia Epidemiológica',
    shortTitle: 'Puestos y Vigilancia Médica',
    legalBasis: 'Decreto 1072/2015 Art. 2.2.4.6.16 Numeral 6 y Art. 2.2.4.6.18',
    description: 'Evaluaciones ergonómicas, higiénicas, exámenes médicos periódicos ocupacionales y perfiles de salud epidemiológica.',
    color: 'border-indigo-500 text-indigo-700 bg-indigo-50'
  },
  {
    id: 'COMP-07-SOCIODEMOGRAFICO-ATEL',
    numeral: 7,
    title: '7. Descripción Sociodemográfica y Estadísticas de Accidentalidad y Enfermedad',
    shortTitle: 'Sociodemográfico y ATEL',
    legalBasis: 'Decreto 1072/2015 Art. 2.2.4.6.16 Numeral 7 y Art. 2.2.4.6.22',
    description: 'Caracterización sociodemográfica de la población laboral, registro e investigación de accidentes, severidad y frecuencia.',
    color: 'border-purple-500 text-purple-700 bg-purple-50'
  },
  {
    id: 'COMP-08-INDICADORES-ANTERIORES',
    numeral: 8,
    title: '8. Registro y Seguimiento de los Indicadores del SG-SST del Año Anterior',
    shortTitle: 'Indicadores de Gestión',
    legalBasis: 'Decreto 1072/2015 Art. 2.2.4.6.16 Numeral 8 y Arts. 2.2.4.6.20 - 2.2.4.6.22',
    description: 'Seguimiento a indicadores de estructura, proceso y resultado, cumplimiento de metas anuales de los objetivos de SST.',
    color: 'border-cyan-500 text-cyan-700 bg-cyan-50'
  },
  {
    id: 'COMP-09-COMUNICACION-PARTICIPACION',
    numeral: 9,
    title: '9. Mecanismos de Comunicación, Participación y Comités (COPASST y CCL)',
    shortTitle: 'Comunicación y Comités',
    legalBasis: 'Decreto 1072/2015 Art. 2.2.4.6.14, Res. 2013/1986 y Res. 3461/2025',
    description: 'Funcionamiento del COPASST o Vigía, Comité de Convivencia Laboral y canales formales de consulta y participación.',
    color: 'border-blue-500 text-blue-700 bg-blue-50'
  },
  {
    id: 'COMP-10-RECURSOS-PLAN-TRABAJO',
    numeral: 10,
    title: '10. Asignación de Recursos y Articulación con el Plan Anual de Trabajo',
    shortTitle: 'Recursos y Plan Anual',
    legalBasis: 'Decreto 1072/2015 Art. 2.2.4.6.8 Numeral 7 y Art. 2.2.4.6.17',
    description: 'Asignación de recursos financieros, técnicos y humanos, y formulación del Plan Anual de Trabajo derivado del diagnóstico.',
    color: 'border-slate-500 text-slate-700 bg-slate-50'
  }
];

export const INITIAL_EVALUATION_ITEMS_DATA: InitialEvaluationItem[] = [
  // COMP 1: Normatividad Legal (3 items)
  {
    id: 'eval-item-01',
    componentId: 'COMP-01-NORMATIVIDAD',
    code: 'EVAL-01',
    numeralIndex: 1,
    aspect: 'Identificación y actualización periódica de la normatividad nacional vigente aplicable en materia de riesgos laborales en la Matriz Legal.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.16 Numeral 1 y Art. 2.2.4.6.12 Numeral 15',
    verificationMethod: 'Verificar la matriz legal de la empresa, cotejando su última fecha de revisión, normas generales y técnicas específicas de la actividad.',
    requiredEvidence: 'Matriz de requisitos legales en SST actualizada con normas generales, específicas de la actividad económica y evaluación de cumplimiento.',
    sourceModule: {
      moduleCode: 'MATRIZ_LEGAL',
      moduleName: 'Matriz de Requisitos Legales (2.4.1)',
      routeTab: 'sst',
      evidenceName: 'Matriz Legal de Riesgos Laborales',
      lastUpdated: '2026-02-15',
      statusBadge: 'DISPONIBLE',
      details: 'Contiene normas nacionales, resoluciones del Ministerio de Trabajo y decretos reglamentarios vigentes.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Se constató la existencia de la matriz legal con inclusión de la Resolución 0312 de 2019, Decreto 1072 de 2015 y normas recientes de riesgos laborales.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-02',
    componentId: 'COMP-01-NORMATIVIDAD',
    code: 'EVAL-02',
    numeralIndex: 2,
    aspect: 'Verificación del grado de cumplimiento y evidencias de aplicación de los requisitos legales vigentes aplicables.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.8 Numeral 2 y Art. 2.2.4.6.16 Numeral 1',
    verificationMethod: 'Constatar que para cada norma registrada en la matriz existan evidencias verificables de cumplimiento en las operaciones cotidianas.',
    requiredEvidence: 'Registros de evaluación periódica de cumplimiento legal con soportes documentales y planes de acción para normas con brechas.',
    sourceModule: {
      moduleCode: 'MATRIZ_LEGAL',
      moduleName: 'Matriz de Requisitos Legales (2.4.1)',
      routeTab: 'sst',
      evidenceName: 'Auditoría de Cumplimiento Legal',
      lastUpdated: '2026-02-15',
      statusBadge: 'PARCIAL',
      details: 'Evaluación semestral de artículos específicos con porcentaje de cumplimiento global registrado.'
    },
    status: 'CUMPLE_PARCIALMENTE',
    evaluatorObservations: 'Se cuenta con la matriz pero falta documentar el soporte de cumplimiento para resoluciones de trabajo en alturas y ergonomía.',
    identifiedGap: 'Faltan evidencias formales de cumplimiento específico para Resolución 4272/2021 (alturas) en personal técnico.',
    recommendedAction: 'Completar la vinculación de certificados de aptitud y permisos de alturas en la matriz legal.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'REQUIERE_REVISION'
  },
  {
    id: 'eval-item-03',
    componentId: 'COMP-01-NORMATIVIDAD',
    code: 'EVAL-03',
    numeralIndex: 3,
    aspect: 'Determinación y articulación de los Estándares Mínimos aplicables según el tamaño y nivel de riesgo de la empresa (Res. 0312 de 2019).',
    legalBasis: 'Resolución 0312 de 2019 Arts. 3, 9 y 16 y Decreto 1072 de 2015 Art. 2.2.4.6.16 Numeral 1',
    verificationMethod: 'Verificar la clasificación de la empresa en la plataforma (número de trabajadores y clase de riesgo) y el grupo de estándares aplicables.',
    requiredEvidence: 'Resultado de la autoevaluación oficial de estándares mínimos de la Resolución 0312 con porcentaje y nivel de aceptabilidad.',
    sourceModule: {
      moduleCode: 'AUTOEVALUACION_0312',
      moduleName: 'Autoevaluación de Estándares Mínimos Res. 0312',
      routeTab: 'sst',
      evidenceName: 'Diagnóstico de Estándares Aplicables',
      lastUpdated: '2026-02-16',
      statusBadge: 'DISPONIBLE',
      details: 'Autoevaluación de 60 estándares calculada dinámicamente según personal y clase de riesgo IV.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Se verificó la caracterización de la empresa (Riesgo IV, >50 trabajadores) aplicando la tabla de los 60 estándares mínimos.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },

  // COMP 2: Peligros y Riesgos (3 items)
  {
    id: 'eval-item-04',
    componentId: 'COMP-02-PELIGROS-RIESGOS',
    code: 'EVAL-04',
    numeralIndex: 1,
    aspect: 'Identificación anual de peligros, evaluación y valoración de riesgos en todos los procesos, centros de trabajo y actividades rutinarias y no rutinarias.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.15 y Art. 2.2.4.6.16 Numeral 2',
    verificationMethod: 'Revisar la Matriz GTC 45 verificando que incluya todos los centros de trabajo, máquinas, contratistas y actividades no rutinarias.',
    requiredEvidence: 'Matriz de Identificación de Peligros, Evaluación y Valoración de Riesgos bajo metodología GTC 45 actualizada en el último año.',
    sourceModule: {
      moduleCode: 'MATRIZ_GTC45',
      moduleName: 'Matriz GTC 45 (Estándar 4.1.2)',
      routeTab: 'sst',
      evidenceName: 'Matriz de Peligros y Riesgos GTC 45',
      lastUpdated: '2026-02-10',
      statusBadge: 'DISPONIBLE',
      details: 'Matriz con procesos de logística, taller de mantenimiento, transporte y áreas administrativas.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'La matriz GTC 45 se encuentra estructurada y cubre procesos operativos y administrativos con niveles de deficiencia y exposición calculados.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-05',
    componentId: 'COMP-02-PELIGROS-RIESGOS',
    code: 'EVAL-05',
    numeralIndex: 2,
    aspect: 'Participación efectiva de los trabajadores y del COPASST en la identificación de peligros y reporte de condiciones.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.15 Parágrafo 1 y Art. 2.2.4.6.16 Numeral 2',
    verificationMethod: 'Verificar actas de socialización de la matriz de peligros con trabajadores y actas del COPASST donde se avale la matriz.',
    requiredEvidence: 'Listados de asistencia a talleres de identificación de peligros y acta de revisión de la matriz por parte del COPASST.',
    sourceModule: {
      moduleCode: 'COPASST_ACTAS',
      moduleName: 'Gestión Integral del COPASST (1.1.6)',
      routeTab: 'sst',
      evidenceName: 'Acta de Aprobación de Matriz GTC 45',
      lastUpdated: '2026-01-20',
      statusBadge: 'DISPONIBLE',
      details: 'Acta ordinaria del COPASST con revisión de peligros prioritarios de bodega y taller.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'El COPASST participó en el recorrido de identificación y firmó el acta de aprobación de la matriz de riesgos.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-06',
    componentId: 'COMP-02-PELIGROS-RIESGOS',
    code: 'EVAL-06',
    numeralIndex: 3,
    aspect: 'Identificación de prioridades en seguridad y salud en el trabajo para la formulación del plan de trabajo anual.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.16 Numeral 2',
    verificationMethod: 'Constatar que los riesgos no aceptables (Nivel I y II) de la matriz GTC 45 tengan programas específicos en el Plan Anual.',
    requiredEvidence: 'Documento de priorización de riesgos críticos y articulación con metas y programas de intervención del Plan Anual.',
    sourceModule: {
      moduleCode: 'MATRIZ_GTC45',
      moduleName: 'Matriz GTC 45 & Plan Anual (2.1.4)',
      routeTab: 'sst',
      evidenceName: 'Consolidado de Riesgos Críticos Nivel I',
      lastUpdated: '2026-02-10',
      statusBadge: 'DISPONIBLE',
      details: 'Peligros biomecánicos por levantamiento de carga y condiciones de seguridad mecánica priorizados.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Se evidenció la priorización de riesgos no aceptables y su inclusión en los programas de gestión del año.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },

  // COMP 3: Amenazas y Emergencias (3 items)
  {
    id: 'eval-item-07',
    componentId: 'COMP-03-AMENAZAS-EMERGENCIAS',
    code: 'EVAL-07',
    numeralIndex: 1,
    aspect: 'Identificación de amenazas naturales, tecnológicas y sociales con evaluación de vulnerabilidad de personas, recursos y sistemas.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.25 Numerales 1 al 4 y Art. 2.2.4.6.16 Numeral 3',
    verificationMethod: 'Examinar el Plan de Prevención, Preparación y Respuesta ante Emergencias y la matriz de análisis de vulnerabilidad por colores.',
    requiredEvidence: 'Documento del Plan de Emergencias con análisis de vulnerabilidad actualizado anualmente para todas las sedes.',
    sourceModule: {
      moduleCode: 'EMERGENCIAS',
      moduleName: 'Plan de Prevención y Emergencias (5.1.1)',
      routeTab: 'sst',
      evidenceName: 'Plan de Emergencias y Análisis de Vulnerabilidad',
      lastUpdated: '2026-01-15',
      statusBadge: 'DISPONIBLE',
      details: 'Análisis de vulnerabilidad para sede principal con mapas de evacuación y recursos.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Plan de emergencias documentado para la sede principal con identificación de amenazas de sismo, incendio e inundación.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-08',
    componentId: 'COMP-03-AMENAZAS-EMERGENCIAS',
    code: 'EVAL-08',
    numeralIndex: 2,
    aspect: 'Conformación, capacitación periódica y dotación de la brigada de emergencias acorde con el nivel de amenaza.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.25 Numeral 11 y Art. 2.2.4.6.16 Numeral 3',
    verificationMethod: 'Verificar acta de conformación de la brigada, dotación física (chalecos, botiquines, camillas) y cronograma de entrenamientos.',
    requiredEvidence: 'Acta de conformación de brigadistas, registros de capacitación en primeros auxilios y control de incendios, e inventario de dotación.',
    sourceModule: {
      moduleCode: 'BRIGADA',
      moduleName: 'Plan de Emergencias & Brigada',
      routeTab: 'sst',
      evidenceName: 'Registro de Brigadistas y Entrenamientos',
      lastUpdated: '2025-11-20',
      statusBadge: 'PARCIAL',
      details: 'Brigada conformada con 12 integrantes; pendiente entrenamiento del primer trimestre 2026.'
    },
    status: 'CUMPLE_PARCIALMENTE',
    evaluatorObservations: 'La brigada está conformada y dotada, pero está pendiente la actualización de entrenamiento de 4 nuevos brigadistas.',
    identifiedGap: 'Falta certificación de reentrenamiento anual en primeros auxilios avanzados con bomberos o Cruz Roja.',
    recommendedAction: 'Programar sesión de reentrenamiento práctico con la ARL o bomberos locales antes de finalizar marzo.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'REQUIERE_REVISION'
  },
  {
    id: 'eval-item-09',
    componentId: 'COMP-03-AMENAZAS-EMERGENCIAS',
    code: 'EVAL-09',
    numeralIndex: 3,
    aspect: 'Procedimientos Operativos Normalizados (PONs) y ejecución del simulacro anual de evacuación con informe de evaluación.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.25 Numeral 12 y Art. 2.2.4.6.16 Numeral 3',
    verificationMethod: 'Revisar informe técnico y fotografías del último simulacro de evacuación ejecutado en la empresa.',
    requiredEvidence: 'Informe de evaluación del simulacro anual de evacuación con tiempo de respuesta, fortalezas y plan de mejora.',
    sourceModule: {
      moduleCode: 'SIMULACROS',
      moduleName: 'Plan de Emergencias & Simulacros',
      routeTab: 'sst',
      evidenceName: 'Informe Simulacro Nacional de Evacuación',
      lastUpdated: '2025-10-24',
      statusBadge: 'DISPONIBLE',
      details: 'Participación en el Simulacro Nacional con tiempo de evacuación de 3m 45s.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Se ejecutó el simulacro de evacuación en octubre con informe técnico de resultados y tiempos óptimos de respuesta.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },

  // COMP 4: Efectividad de Controles (3 items)
  {
    id: 'eval-item-10',
    componentId: 'COMP-04-EFECTIVIDAD-CONTROLES',
    code: 'EVAL-10',
    numeralIndex: 1,
    aspect: 'Aplicación de la jerarquía de controles (Eliminación, Sustitución, Ingeniería, Administrativos y EPP) en los peligros evaluados.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.24 y Art. 2.2.4.6.16 Numeral 4',
    verificationMethod: 'Constatar que los controles formulados prioricen ingeniería y sustitución sobre la mera entrega de elementos de protección personal.',
    requiredEvidence: 'Registros de diseño e instalación de controles de ingeniería y procedimientos seguros de trabajo implementados.',
    sourceModule: {
      moduleCode: 'MATRIZ_GTC45',
      moduleName: 'Matriz GTC 45 / Controles de Ingeniería',
      routeTab: 'sst',
      evidenceName: 'Planes de Control de Ingeniería Instalados',
      lastUpdated: '2026-02-10',
      statusBadge: 'DISPONIBLE',
      details: 'Instalación de guardas en máquinas rotativas y extractores en zona de soldadura.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Se evidencia implementación de guardas y extractores según las medidas de ingeniería acordadas.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-11',
    componentId: 'COMP-04-EFECTIVIDAD-CONTROLES',
    code: 'EVAL-11',
    numeralIndex: 2,
    aspect: 'Evaluación anual de la efectividad de las medidas implementadas para controlar peligros, riesgos y amenazas.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.16 Numeral 4',
    verificationMethod: 'Verificar la reevaluación del nivel de riesgo residual posterior a la aplicación de los controles y disminución de incidentes.',
    requiredEvidence: 'Informe de verificación de eficacia de controles con comparativo de accidentalidad y condiciones en inspecciones.',
    sourceModule: {
      moduleCode: 'INSPECCIONES',
      moduleName: 'Inspecciones de Seguridad & ACPM',
      routeTab: 'sst',
      evidenceName: 'Informe de Eficacia de Controles Operativos',
      lastUpdated: '2026-01-30',
      statusBadge: 'PARCIAL',
      details: 'Registros de inspecciones mensuales pero falta consolidado de efectividad anual formal.'
    },
    status: 'CUMPLE_PARCIALMENTE',
    evaluatorObservations: 'Se realizan inspecciones periódicas pero no se ha consolidado el informe anual específico de efectividad comparativa.',
    identifiedGap: 'Falta consolidar el informe anual de efectividad de controles frente a la tasa de incidentes.',
    recommendedAction: 'Consolidar el informe anual de eficacia de controles integrando hallazgos de inspección y estadísticas.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'REQUIERE_REVISION'
  },
  {
    id: 'eval-item-12',
    componentId: 'COMP-04-EFECTIVIDAD-CONTROLES',
    code: 'EVAL-12',
    numeralIndex: 3,
    aspect: 'Mecanismos de reporte de actos y condiciones inseguras que incluyan los reportes de los trabajadores y su gestión oportuna.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.16 Numeral 4 y Art. 2.2.4.6.24 Parágrafo',
    verificationMethod: 'Verificar el formato físico o digital de reporte de actos/condiciones, tiempo de respuesta y cierre de hallazgos en ACPM.',
    requiredEvidence: 'Registro de reportes de actos y condiciones inseguras realizados por trabajadores y trazabilidad de su intervención.',
    sourceModule: {
      moduleCode: 'ACPM_REPORTES',
      moduleName: 'Matriz ACPM & Reportes de Condiciones',
      routeTab: 'acpm',
      evidenceName: 'Registro de Reportes de Actos y Condiciones',
      lastUpdated: '2026-02-12',
      statusBadge: 'DISPONIBLE',
      details: 'Reportes gestionados en la matriz ACPM con tiempos de cierre promedio de 12 días.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Canal de reporte activo con articulación directa a la matriz ACPM para cierre de condiciones peligrosas.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },

  // COMP 5: Capacitación e Inducción (3 items)
  {
    id: 'eval-item-13',
    componentId: 'COMP-05-CAPACITACION-INDUCCION',
    code: 'EVAL-13',
    numeralIndex: 1,
    aspect: 'Cumplimiento y cobertura del programa de capacitación anual en SST previamente definido por la empresa.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.11 y Art. 2.2.4.6.16 Numeral 5',
    verificationMethod: 'Contrastar las capacitaciones ejecutadas contra las programadas en el cronograma anual y calcular porcentaje de cumplimiento y cobertura.',
    requiredEvidence: 'Programa anual de capacitación en SST con cronograma, listas de asistencia, evaluaciones de conocimiento y cálculo de cobertura.',
    sourceModule: {
      moduleCode: 'CAPACITACION_ANUAL',
      moduleName: 'Programa Anual de Capacitación (1.2.1)',
      routeTab: 'sst',
      evidenceName: 'Programa Anual de Capacitaciones 2026',
      lastUpdated: '2026-02-14',
      statusBadge: 'DISPONIBLE',
      details: 'Cronograma con 24 temas programados, registro de asistencia y evaluaciones digitales en Aula Virtual.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Programa de capacitación estructurado con temáticas obligatorias (primeros auxilios, ergonomía, riesgo químico) y evaluación.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-14',
    componentId: 'COMP-05-CAPACITACION-INDUCCION',
    code: 'EVAL-14',
    numeralIndex: 2,
    aspect: 'Inducción y reinducción en SST a todos los trabajadores nuevos, contratistas y personal en misión previo al inicio de sus labores.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.11 Parágrafo y Art. 2.2.4.6.16 Numeral 5',
    verificationMethod: 'Verificar registros de inducción firmados por trabajadores nuevos con fechas coincidentes o anteriores a su ingreso laboral.',
    requiredEvidence: 'Formatos de inducción en SST firmados por los trabajadores y evaluación de inducción aprobada.',
    sourceModule: {
      moduleCode: 'INDUCCION_SST',
      moduleName: 'Inducción y Reinducción en SST (1.2.2)',
      routeTab: 'sst',
      evidenceName: 'Registros de Inducción de Personal Nuevo',
      lastUpdated: '2026-02-11',
      statusBadge: 'DISPONIBLE',
      details: 'Registro digital de inducción para 15 nuevos ingresos con firma y evaluación de comprensión.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Se constató que el 100% de los trabajadores nuevos recibieron inducción en política, peligros y emergencias antes de ingresar.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-15',
    componentId: 'COMP-05-CAPACITACION-INDUCCION',
    code: 'EVAL-15',
    numeralIndex: 3,
    aspect: 'Acreditación del curso de capacitación virtual de 50h o actualización de 20h para el responsable del SG-SST y miembros del COPASST.',
    legalBasis: 'Resolución 0312 de 2019 Estándar 1.2.3 y Decreto 1072 de 2015 Art. 2.2.4.6.16 Numeral 5',
    verificationMethod: 'Revisar certificados vigentes emitidos por el Ministerio del Trabajo, SENA o ARL autorizada en el expediente del responsable y del COPASST.',
    requiredEvidence: 'Certificaciones digitales del curso virtual de 50 horas de SST o certificado de actualización de 20 horas.',
    sourceModule: {
      moduleCode: 'RESPONSABLE_50H',
      moduleName: 'Responsable SG-SST (1.1.1 & 1.2.3)',
      routeTab: 'sst',
      evidenceName: 'Certificado Curso 50h y Actualización 20h',
      lastUpdated: '2026-01-10',
      statusBadge: 'DISPONIBLE',
      details: 'Certificado del líder SST cargado en el expediente formal articulado con el estándar 1.1.1.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Certificado del curso de 50 horas y actualización de 20 horas acreditado y validado en el expediente del Responsable.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },

  // COMP 6: Puestos y Vigilancia Médica (3 items)
  {
    id: 'eval-item-16',
    componentId: 'COMP-06-PUESTOS-VIGILANCIA',
    code: 'EVAL-16',
    numeralIndex: 1,
    aspect: 'Evaluación de puestos de trabajo en el marco de los programas de vigilancia epidemiológica de la salud de los trabajadores.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.16 Numeral 6 y Art. 2.2.4.6.18',
    verificationMethod: 'Verificar informes técnicos de análisis de puestos de trabajo (biomecánicos, iluminación, ruido) realizados por especialistas con licencia.',
    requiredEvidence: 'Informes de evaluación de puestos de trabajo con recomendaciones ergonómicas y planes de adecuación.',
    sourceModule: {
      moduleCode: 'PUESTOS_TRABAJO',
      moduleName: 'Vigilancia Epidemiológica & Puestos de Trabajo',
      routeTab: 'sst',
      evidenceName: 'Estudio Ergonómico de Puestos Operativos',
      lastUpdated: '2025-09-18',
      statusBadge: 'PARCIAL',
      details: 'Estudio ergonómico ejecutado para bodega de despacho; pendiente evaluar puestos administrativos y digitación.'
    },
    status: 'CUMPLE_PARCIALMENTE',
    evaluatorObservations: 'Se cuenta con estudio ergonómico de bodega pero está pendiente la evaluación de puestos de trabajo de digitación y oficinas.',
    identifiedGap: 'Falta estudio ergonómico específico de puestos de trabajo administrativos con pantallas de visualización de datos.',
    recommendedAction: 'Contratar con la ARL la inspección y análisis biomecánico de puestos de trabajo administrativos.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'REQUIERE_REVISION'
  },
  {
    id: 'eval-item-17',
    componentId: 'COMP-06-PUESTOS-VIGILANCIA',
    code: 'EVAL-17',
    numeralIndex: 2,
    aspect: 'Realización de evaluaciones médicas ocupacionales (ingreso, periódicas, retiro) con custodia de historias clínicas por IPS o médico especialista.',
    legalBasis: 'Resolución 2346 de 2007 y Decreto 1072 de 2015 Art. 2.2.4.6.16 Numeral 6',
    verificationMethod: 'Verificar los conceptos de aptitud médica ocupacional emitidos por la IPS y acuerdos de custodia documental confidencial.',
    requiredEvidence: 'Certificados de aptitud médica ocupacional (ingreso, periódico, egreso) y carta de custodia de historias clínicas de la IPS.',
    sourceModule: {
      moduleCode: 'EXAMENES_MEDICOS',
      moduleName: 'Salud Ocupacional & Exámenes Médicos',
      routeTab: 'sst',
      evidenceName: 'Custodia IPS y Conceptos de Aptitud Médica',
      lastUpdated: '2026-02-05',
      statusBadge: 'DISPONIBLE',
      details: 'Profesiograma vigente y certificados de aptitud de los trabajadores vinculados.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Se cuenta con profesiograma, exámenes médicos periódicos al 100% del personal de riesgo alto y custodia en la IPS autorizada.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-18',
    componentId: 'COMP-06-PUESTOS-VIGILANCIA',
    code: 'EVAL-18',
    numeralIndex: 3,
    aspect: 'Diagnóstico de condiciones de salud consolidado remitido por la IPS y formulación de Programas de Vigilancia Epidemiológica (PVE).',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.18 Numeral 3 y Art. 2.2.4.6.16 Numeral 6',
    verificationMethod: 'Revisar el informe de diagnóstico general de salud del último año y constatar que existan PVE para las patologías prioritarias.',
    requiredEvidence: 'Informe de Diagnóstico de Salud emitido por médico especialista y documento de los PVE (Osteomuscular, Cardiovascular, Psicosocial).',
    sourceModule: {
      moduleCode: 'DIAGNOSTICO_SALUD',
      moduleName: 'Salud Ocupacional & PVE',
      routeTab: 'sst',
      evidenceName: 'Diagnóstico de Salud Anual IPS',
      lastUpdated: '2025-12-15',
      statusBadge: 'DISPONIBLE',
      details: 'Diagnóstico con prevalencia de desórdenes musculoesqueléticos en miembros superiores.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Diagnóstico de salud emitido por la IPS con formulación del PVE Osteomuscular activo.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },

  // COMP 7: Sociodemográfico y ATEL (3 items)
  {
    id: 'eval-item-19',
    componentId: 'COMP-07-SOCIODEMOGRAFICO-ATEL',
    code: 'EVAL-19',
    numeralIndex: 1,
    aspect: 'Descripción y caracterización sociodemográfica de la totalidad de los trabajadores vinculados a la organización.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.12 Numeral 8 y Art. 2.2.4.6.16 Numeral 7',
    verificationMethod: 'Verificar la base de datos de trabajadores con variables de edad, sexo, escolaridad, estado civil, antigüedad, cargo y estrato.',
    requiredEvidence: 'Perfil sociodemográfico consolidado de la población trabajadora con tabulación estadística y gráficos.',
    sourceModule: {
      moduleCode: 'BASE_MAESTRA',
      moduleName: 'Base Maestra de Trabajadores (Central)',
      routeTab: 'sst',
      evidenceName: 'Perfil Sociodemográfico de Trabajadores',
      lastUpdated: '2026-02-12',
      statusBadge: 'DISPONIBLE',
      details: 'Base maestra con 68 trabajadores activos con datos demográficos, EPS, AFP y ARL.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Perfil sociodemográfico consolidado y disponible en la Base Maestra Central con datos actualizados a 2026.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-20',
    componentId: 'COMP-07-SOCIODEMOGRAFICO-ATEL',
    code: 'EVAL-20',
    numeralIndex: 2,
    aspect: 'Registro e investigación formal de todos los accidentes de trabajo e incidentes ocurridos con participación del COPASST.',
    legalBasis: 'Resolución 1401 de 2007 y Decreto 1072 de 2015 Art. 2.2.4.6.32 y Art. 2.2.4.6.16 Numeral 7',
    verificationMethod: 'Examinar los informes de investigación de accidentes radicados ante la ARL en los 15 días hábiles siguientes al evento.',
    requiredEvidence: 'Informes de investigación de accidentes bajo metodología árbol de causas firmados por equipo investigador y COPASST.',
    sourceModule: {
      moduleCode: 'INVESTIGACION_AT',
      moduleName: 'Investigación de Accidentes & COPASST',
      routeTab: 'sst',
      evidenceName: 'Registro e Investigaciones de Accidentes AT',
      lastUpdated: '2026-01-28',
      statusBadge: 'DISPONIBLE',
      details: '3 accidentes ocurridos en el año anterior debidamente investigados y radicados ante ARL Sura.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Se investigaron los 3 eventos presentados con lecciones aprendidas y planes de acción implementados.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-21',
    componentId: 'COMP-07-SOCIODEMOGRAFICO-ATEL',
    code: 'EVAL-21',
    numeralIndex: 3,
    aspect: 'Evaluación y análisis estadístico mensual y anual de accidentalidad (frecuencia, severidad, mortalidad) y ausentismo laboral.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.22 Numerales 3 al 6 y Art. 2.2.4.6.16 Numeral 7',
    verificationMethod: 'Verificar la ficha técnica y comportamiento de las tasas de frecuencia de AT, severidad de AT, proporción de accidentes mortales y prevalencia.',
    requiredEvidence: 'Tablero mensual y consolidado anual de indicadores de accidentalidad y ausentismo con análisis causal.',
    sourceModule: {
      moduleCode: 'ESTADISTICAS_ATEL',
      moduleName: 'Estadísticas ATEL & Ausentismo',
      routeTab: 'sst',
      evidenceName: 'Consolidado Anual Estadísticas ATEL',
      lastUpdated: '2026-01-31',
      statusBadge: 'PARCIAL',
      details: 'Estadísticas de accidentes al día; falta consolidar la tasa de ausentismo por causas médicas no laborales.'
    },
    status: 'CUMPLE_PARCIALMENTE',
    evaluatorObservations: 'Se tienen las estadísticas de accidentalidad pero falta consolidar el ausentismo global por enfermedad general.',
    identifiedGap: 'Falta consolidar el registro mensual de días perdidos por incapacidades de enfermedad general en conjunto con Gestión Humana.',
    recommendedAction: 'Establecer mecanismo conjunto con Gestión Humana para consolidar el ausentismo médico mensual.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'REQUIERE_REVISION'
  },

  // COMP 8: Indicadores de Gestión (3 items)
  {
    id: 'eval-item-22',
    componentId: 'COMP-08-INDICADORES-ANTERIORES',
    code: 'EVAL-22',
    numeralIndex: 1,
    aspect: 'Registro y seguimiento a los resultados de los indicadores definidos en el SG-SST de la empresa del año inmediatamente anterior.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.16 Numeral 8 y Arts. 2.2.4.6.20 - 2.2.4.6.22',
    verificationMethod: 'Revisar la ficha técnica de cada indicador, método de cálculo, fuente de datos, periodicidad y resultado del periodo anterior.',
    requiredEvidence: 'Matriz o tablero de indicadores de estructura, proceso y resultado con mediciones del año inmediatamente anterior.',
    sourceModule: {
      moduleCode: 'INDICADORES_SST',
      moduleName: 'Módulo de Objetivos & Indicadores (2.1.2)',
      routeTab: 'sst',
      evidenceName: 'Matriz de Indicadores de Estructura, Proceso y Resultado',
      lastUpdated: '2026-02-12',
      statusBadge: 'DISPONIBLE',
      details: 'Indicadores formulados conforme al Decreto 1072 y vinculados a los objetivos estratégicos.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Se cuenta con la matriz de indicadores articulada con los objetivos de SST con mediciones semestrales y anuales.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-23',
    componentId: 'COMP-08-INDICADORES-ANTERIORES',
    code: 'EVAL-23',
    numeralIndex: 2,
    aspect: 'Evaluación del grado de cumplimiento de los objetivos y metas de SST definidos para el periodo anual anterior.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.17 y Art. 2.2.4.6.16 Numeral 8',
    verificationMethod: 'Comparar el resultado alcanzado en cada objetivo del SG-SST frente a la meta fijada en el año anterior.',
    requiredEvidence: 'Informe de evaluación y cierre de objetivos del SG-SST del periodo anterior con análisis de cumplimiento.',
    sourceModule: {
      moduleCode: 'OBJETIVOS_SST',
      moduleName: 'Módulo de Objetivos SG-SST (2.1.2)',
      routeTab: 'sst',
      evidenceName: 'Cierre Anual de Objetivos del SG-SST',
      lastUpdated: '2026-01-25',
      statusBadge: 'DISPONIBLE',
      details: '5 objetivos evaluados: 4 cumplidos y 1 en riesgo con seguimiento trimestral registrado.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Los objetivos del SG-SST fueron evaluados al cierre del periodo anterior con 80% de cumplimiento de metas.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-24',
    componentId: 'COMP-08-INDICADORES-ANTERIORES',
    code: 'EVAL-24',
    numeralIndex: 3,
    aspect: 'Análisis de desviaciones de indicadores e ingreso de acciones correctivas en la matriz ACPM.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.33 y Art. 2.2.4.6.16 Numeral 8',
    verificationMethod: 'Verificar que todo indicador con resultado por debajo de la meta cuente con plan de acción correctiva en la matriz ACPM.',
    requiredEvidence: 'Planes de acción en la matriz ACPM derivados de las desviaciones de indicadores de SST con responsables y fechas.',
    sourceModule: {
      moduleCode: 'MATRIZ_ACPM',
      moduleName: 'Matriz ACPM Central',
      routeTab: 'acpm',
      evidenceName: 'Acciones Correctivas por Desviación de Indicadores',
      lastUpdated: '2026-02-08',
      statusBadge: 'DISPONIBLE',
      details: 'Acción correctiva ACPM-2026-004 generada por desvío en cobertura de capacitación en conductores.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Se evidencia derivación directa a la matriz ACPM para el indicador que presentó desviación en el año previo.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },

  // COMP 9: Comunicación y Comités (3 items)
  {
    id: 'eval-item-25',
    componentId: 'COMP-09-COMUNICACION-PARTICIPACION',
    code: 'EVAL-25',
    numeralIndex: 1,
    aspect: 'Conformación legal, vigencia, elecciones y funcionamiento mensual documentado del COPASST o designación del Vigía de SST.',
    legalBasis: 'Resolución 2013 de 1986 y Decreto 1072 de 2015 Art. 2.2.4.6.12 Numeral 9',
    verificationMethod: 'Verificar acta de conformación del comité con periodo de 2 años vigente y 12 actas mensuales de reunión ordinaria.',
    requiredEvidence: 'Acta de elecciones, acta de conformación paritaria y actas de reuniones mensuales del COPASST.',
    sourceModule: {
      moduleCode: 'COPASST_MODULO',
      moduleName: 'Gestión Integral del COPASST / Vigía (1.1.6)',
      routeTab: 'sst',
      evidenceName: 'Expediente Completo del COPASST',
      lastUpdated: '2026-02-10',
      statusBadge: 'DISPONIBLE',
      details: 'COPASST vigente con presidente, secretario, elecciones democráticas y actas mensuales radicadas.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'COPASST debidamente conformado con actas mensuales, compromisos y asignación de 4 horas semanales de funcionamiento.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-26',
    componentId: 'COMP-09-COMUNICACION-PARTICIPACION',
    code: 'EVAL-26',
    numeralIndex: 2,
    aspect: 'Conformación, actas periódicas y gestión confidencial del Comité de Convivencia Laboral (CCL) conforme a la Res. 3461 de 2025.',
    legalBasis: 'Resolución 3461 de 2025 y Ley 1010 de 2006',
    verificationMethod: 'Verificar acta de conformación del CCL, actas mensuales ordinarias y protocolo confidencial de atención de quejas de acoso laboral.',
    requiredEvidence: 'Actas del CCL, manual confidencial de trámite de quejas y registros de sesiones ordinarias y extraordinarias.',
    sourceModule: {
      moduleCode: 'CCL_MODULO',
      moduleName: 'Comité de Convivencia Laboral - CCL (1.1.8)',
      routeTab: 'sst',
      evidenceName: 'Gestión Integral del CCL según Res. 3461/2025',
      lastUpdated: '2026-02-15',
      statusBadge: 'DISPONIBLE',
      details: 'CCL conformado con reuniones mensuales, protocolo confidencial y buzón seguro.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'El CCL opera con la nueva periodicidad mensual exigida por la Resolución 3461 de 2025 y manual de confidencialidad.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-27',
    componentId: 'COMP-09-COMUNICACION-PARTICIPACION',
    code: 'EVAL-27',
    numeralIndex: 3,
    aspect: 'Procedimiento formal de comunicación interna y externa en SST para recepción, trámite y respuesta a recomendaciones de partes interesadas.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.14',
    verificationMethod: 'Constatar los canales de comunicación de SST (carteleras, correos, buzón virtual) y tiempos de respuesta a los trabajadores.',
    requiredEvidence: 'Procedimiento de comunicaciones internas y externas en SST y registros de respuesta a peticiones y sugerencias.',
    sourceModule: {
      moduleCode: 'COMUNICACIONES_SST',
      moduleName: 'Comunicaciones y Consulta en SST',
      routeTab: 'sst',
      evidenceName: 'Procedimiento de Comunicaciones y PQR SST',
      lastUpdated: '2025-11-30',
      statusBadge: 'DISPONIBLE',
      details: 'Procedimiento documentado con canales de WhatsApp corporativo, cartelera digital y buzón físico.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Mecanismos de comunicación interna documentados y conocidos por el personal de la empresa.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },

  // COMP 10: Recursos y Plan Anual (3 items)
  {
    id: 'eval-item-28',
    componentId: 'COMP-10-RECURSOS-PLAN-TRABAJO',
    code: 'EVAL-28',
    numeralIndex: 1,
    aspect: 'Asignación formal del responsable del SG-SST con perfil idóneo, licencia vigente y delegación expresa de autoridad legal.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.8 Numeral 2 y Resolución 0312 de 2019 Estándar 1.1.1',
    verificationMethod: 'Verificar carta de designación formal firmada por el representante legal con funciones, licencia SST y autoridad de parar labores.',
    requiredEvidence: 'Carta de asignación formal, hoja de vida, fotocopia de licencia SST y certificado de curso de 50h del responsable.',
    sourceModule: {
      moduleCode: 'RESPONSABLE_SST',
      moduleName: 'Asignación de Responsable del SG-SST (1.1.1)',
      routeTab: 'sst',
      evidenceName: 'Carta de Asignación Formal con Firma Gerencial',
      lastUpdated: '2026-02-14',
      statusBadge: 'DISPONIBLE',
      details: 'Carta firmada por el gerente con facultades expresas de paralización de labores ante riesgo inminente.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Responsable formalmente designado por gerencia con licencia profesional vigente y autoridad expresa.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-29',
    componentId: 'COMP-10-RECURSOS-PLAN-TRABAJO',
    code: 'EVAL-29',
    numeralIndex: 2,
    aspect: 'Asignación y ejecución presupuestal anual de recursos financieros, técnicos y humanos para el diseño e implementación del SG-SST.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.8 Numeral 4 y Resolución 0312 de 2019 Estándar 1.1.3',
    verificationMethod: 'Examinar el presupuesto anual detallado aprobado por la gerencia y comparar con la ejecución presupuestal real del periodo.',
    requiredEvidence: 'Matriz de Presupuesto Anual Integrado de SST con partidas asignadas, ejecutadas y firma de aprobación de gerencia.',
    sourceModule: {
      moduleCode: 'PRESUPUESTO_SST',
      moduleName: 'Presupuesto Integrado SST + PESV (1.1.3)',
      routeTab: 'sst',
      evidenceName: 'Presupuesto Integrado Aprobado por Gerencia',
      lastUpdated: '2026-02-16',
      statusBadge: 'DISPONIBLE',
      details: 'Presupuesto asignado de $48.500.000 con desglose por EPP, capacitaciones, exámenes médicos y consultoría.'
    },
    status: 'CUMPLE',
    evaluatorObservations: 'Presupuesto formalmente asignado y aprobado por la alta dirección con rubros específicos para SST y PESV.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'VERIFICADO'
  },
  {
    id: 'eval-item-30',
    componentId: 'COMP-10-RECURSOS-PLAN-TRABAJO',
    code: 'EVAL-30',
    numeralIndex: 3,
    aspect: 'Formulación y articulación del Plan de Trabajo Anual en SST derivado de la presente evaluación inicial y prioridades identificadas.',
    legalBasis: 'Decreto 1072 de 2015, Art. 2.2.4.6.8 Numeral 7 y Art. 2.2.4.6.16',
    verificationMethod: 'Verificar que las brechas y prioridades identificadas en la evaluación inicial se encuentren contempladas en el Plan Anual.',
    requiredEvidence: 'Plan de Trabajo Anual en SST firmado con objetivos, metas, actividades, cronograma, responsables y recursos.',
    sourceModule: {
      moduleCode: 'PLAN_ANUAL',
      moduleName: 'Plan de Trabajo Anual en SST (2.1.4)',
      routeTab: 'sst',
      evidenceName: 'Plan de Trabajo Anual 2026',
      lastUpdated: '2026-02-15',
      statusBadge: 'PARCIAL',
      details: 'Borrador del Plan Anual formulado; en proceso de incorporar las brechas identificadas en este diagnóstico.'
    },
    status: 'CUMPLE_PARCIALMENTE',
    evaluatorObservations: 'El Plan Anual está formulado en su estructura base pero debe incorporar formalmente las 4 brechas detectadas en esta evaluación.',
    identifiedGap: 'Falta incorporar al cronograma las actividades de reentrenamiento de brigadistas y estudios ergonómicos de puestos administrativos.',
    recommendedAction: 'Ajustar el Plan Anual de Trabajo 2026 incorporando las acciones correctivas de las brechas de la Evaluación Inicial.',
    responsibleValidator: 'Ing. Carlos Mendoza (Lic. SST 45892-Bogotá)',
    evaluationDate: '2026-02-18',
    reviewStatus: 'REQUIERE_REVISION'
  }
];

export const INITIAL_EVALUATION_ACTIONS_DATA: InitialEvaluationAction[] = [
  {
    id: 'act-eval-01',
    criterionId: 'eval-item-02',
    criterionCode: 'EVAL-02',
    componentId: 'COMP-01-NORMATIVIDAD',
    gapDescription: 'Faltan evidencias formales de cumplimiento específico para Resolución 4272/2021 (alturas) en personal técnico.',
    requiredAction: 'Vincular certificados de aptitud psicofísica y certificados de formación en trabajo en alturas en la matriz legal.',
    responsible: 'Ing. Carlos Mendoza - Líder SST',
    dueDate: '2026-03-30',
    resourcesNeeded: 'Tiempo administrativo y coordinación con el centro de entrenamiento avalado por MinTrabajo.',
    implementationEvidence: 'Certificados vigentes de 6 técnicos en trabajo seguro en alturas nivel avanzado.',
    status: 'EN_EJECUCION',
    sentToAcpm: true,
    acpmFindingId: 'fnd-eval-001',
    createdAt: '2026-02-18'
  },
  {
    id: 'act-eval-02',
    criterionId: 'eval-item-08',
    criterionCode: 'EVAL-08',
    componentId: 'COMP-03-AMENAZAS-EMERGENCIAS',
    gapDescription: 'Falta certificación de reentrenamiento anual en primeros auxilios avanzados con bomberos o Cruz Roja para 4 brigadistas.',
    requiredAction: 'Programar sesión de reentrenamiento práctico con la ARL o cuerpo de bomberos municipal.',
    responsible: 'Coordinador de Brigada / Líder SST',
    dueDate: '2026-03-25',
    resourcesNeeded: 'Presupuesto de $450.000 para insumos de práctica y coordinación de pista de entrenamiento.',
    status: 'PENDIENTE',
    sentToAcpm: true,
    acpmFindingId: 'fnd-eval-002',
    createdAt: '2026-02-18'
  },
  {
    id: 'act-eval-03',
    criterionId: 'eval-item-11',
    criterionCode: 'EVAL-11',
    componentId: 'COMP-04-EFECTIVIDAD-CONTROLES',
    gapDescription: 'Falta consolidar el informe anual de efectividad de controles frente a la tasa de incidentes.',
    requiredAction: 'Consolidar el informe anual de eficacia de controles integrando hallazgos de inspección y estadísticas.',
    responsible: 'Ing. Carlos Mendoza - Líder SST',
    dueDate: '2026-03-15',
    resourcesNeeded: 'Horas de análisis estadístico y revisión de matrices GTC 45.',
    status: 'EN_EJECUCION',
    sentToAcpm: true,
    acpmFindingId: 'fnd-eval-003',
    createdAt: '2026-02-18'
  },
  {
    id: 'act-eval-04',
    criterionId: 'eval-item-16',
    criterionCode: 'EVAL-16',
    componentId: 'COMP-06-PUESTOS-VIGILANCIA',
    gapDescription: 'Falta estudio ergonómico específico de puestos de trabajo administrativos con pantallas de visualización de datos.',
    requiredAction: 'Solicitar a la ARL Sura asesoría técnica para la ejecución de la evaluación ergonómica con método RULA/ROSA.',
    responsible: 'Líder SST y Médico Laboral IPS',
    dueDate: '2026-04-10',
    resourcesNeeded: 'Acompañamiento técnico ARL sin costo adicional.',
    status: 'PENDIENTE',
    sentToAcpm: true,
    acpmFindingId: 'fnd-eval-004',
    createdAt: '2026-02-18'
  },
  {
    id: 'act-eval-05',
    criterionId: 'eval-item-21',
    criterionCode: 'EVAL-21',
    componentId: 'COMP-07-SOCIODEMOGRAFICO-ATEL',
    gapDescription: 'Falta consolidar el registro mensual de días perdidos por incapacidades de enfermedad general en conjunto con Gestión Humana.',
    requiredAction: 'Establecer mecanismo conjunto con Gestión Humana para consolidar el ausentismo médico mensual y calcular índice IL.',
    responsible: 'Coordinador de Gestión Humana y Líder SST',
    dueDate: '2026-03-20',
    resourcesNeeded: 'Plantilla compartida de ausentismo médico.',
    status: 'PENDIENTE',
    sentToAcpm: false,
    createdAt: '2026-02-18'
  },
  {
    id: 'act-eval-06',
    criterionId: 'eval-item-30',
    criterionCode: 'EVAL-30',
    componentId: 'COMP-10-RECURSOS-PLAN-TRABAJO',
    gapDescription: 'Falta incorporar al cronograma las actividades de reentrenamiento de brigadistas y estudios ergonómicos de puestos administrativos.',
    requiredAction: 'Ajustar el Plan de Trabajo Anual 2026 incorporando las acciones correctivas de las brechas de la Evaluación Inicial.',
    responsible: 'Ing. Carlos Mendoza - Líder SST',
    dueDate: '2026-03-05',
    resourcesNeeded: 'Tiempo de actualización documental y firma con Gerencia.',
    status: 'EN_EJECUCION',
    sentToAcpm: true,
    acpmFindingId: 'fnd-eval-005',
    createdAt: '2026-02-18'
  }
];

export function calculateInitialEvaluationMetrics(
  items: InitialEvaluationItem[],
  components: InitialEvaluationComponentDef[] = INITIAL_EVALUATION_COMPONENTS
): InitialEvaluationMetrics {
  const totalCriteria = items.length;
  let compliantCriteria = 0;
  let partialCriteria = 0;
  let nonCompliantCriteria = 0;
  let pendingCriteria = 0;
  let notApplicableCriteria = 0;
  let totalGaps = 0;

  for (const item of items) {
    if (item.status === 'CUMPLE') {
      compliantCriteria++;
    } else if (item.status === 'CUMPLE_PARCIALMENTE') {
      partialCriteria++;
      totalGaps++;
    } else if (item.status === 'NO_CUMPLE') {
      nonCompliantCriteria++;
      totalGaps++;
    } else if (item.status === 'NO_APLICA') {
      notApplicableCriteria++;
    } else {
      pendingCriteria++;
    }
  }

  const evaluatedCriteria = totalCriteria - pendingCriteria;
  const evaluationProgressPercentage = totalCriteria > 0 
    ? Math.round((evaluatedCriteria / totalCriteria) * 100) 
    : 0;

  // Real compliance methodology: (Compliant + Partial * 0.5) / (Applicable evaluated)
  const applicableEvaluated = evaluatedCriteria - notApplicableCriteria;
  const complianceScorePercentage = applicableEvaluated > 0
    ? Math.round(((compliantCriteria + partialCriteria * 0.5) / applicableEvaluated) * 100)
    : 0;

  const componentScores = components.map(comp => {
    const compItems = items.filter(it => it.componentId === comp.id);
    const compTotal = compItems.length;
    const compCompliant = compItems.filter(it => it.status === 'CUMPLE').length;
    const compPartial = compItems.filter(it => it.status === 'CUMPLE_PARCIALMENTE').length;
    const compNonCompliant = compItems.filter(it => it.status === 'NO_CUMPLE').length;
    const compPending = compItems.filter(it => it.status === 'PENDIENTE').length;
    const compNotApplicable = compItems.filter(it => it.status === 'NO_APLICA').length;

    const compApplicable = (compTotal - compPending) - compNotApplicable;
    const scorePercentage = compApplicable > 0
      ? Math.round(((compCompliant + compPartial * 0.5) / compApplicable) * 100)
      : 0;

    return {
      componentId: comp.id,
      componentTitle: comp.shortTitle,
      total: compTotal,
      compliant: compCompliant,
      partial: compPartial,
      nonCompliant: compNonCompliant,
      pending: compPending,
      notApplicable: compNotApplicable,
      scorePercentage
    };
  });

  return {
    totalCriteria,
    evaluatedCriteria,
    pendingCriteria,
    compliantCriteria,
    partialCriteria,
    nonCompliantCriteria,
    notApplicableCriteria,
    totalGaps,
    evaluationProgressPercentage,
    complianceScorePercentage,
    componentScores
  };
}

export const INITIAL_EVALUATION_STATE: InitialEvaluationState = {
  id: 'eval-state-2026',
  version: 1,
  evaluationPeriod: '2026',
  status: 'EN_ELABORACION',
  evaluatorName: 'Ing. Carlos Mendoza',
  evaluatorRole: 'Especialista en Seguridad y Salud en el Trabajo',
  evaluatorLicense: 'Licencia SST No. 45892 - Secretaría de Salud de Bogotá',
  approverName: 'Dr. Alejandro Morales',
  approverRole: 'Representante Legal / Gerente General',
  startedAt: '2026-02-01',
  updatedAt: '2026-02-18',
  items: INITIAL_EVALUATION_ITEMS_DATA,
  actions: INITIAL_EVALUATION_ACTIONS_DATA,
  technicalConclusions: 
    'La organización cuenta con un nivel de estructuración sólido en sus pilares normativos de SST, destacándose la formalización del Responsable con licencia y curso 50h, la aprobación del presupuesto integrado, el funcionamiento activo del COPASST y del CCL bajo la Res. 3461 de 2025, y la adopción de la política firmada. Se identifican 6 brechas puntuales que requieren intervención prioritaria en reentrenamiento de brigadas, estudios ergonómicos en áreas administrativas y consolidación de ausentismo médico para garantizar el cumplimiento pleno del Art. 2.2.4.6.16 del Decreto 1072 de 2015.',
  technicalRecommendations:
    '1. Formalizar las 6 acciones de mejora en el Plan de Trabajo Anual de 2026 con asignación de recursos y fechas límite.\n2. Coordinar con la ARL la visita técnica para las mediciones ergonómicas en puestos administrativos.\n3. Ejecutar la jornada de reentrenamiento de brigadistas antes del cierre del primer trimestre.\n4. Mantener la articulación continua entre el SG-SST y la matriz central ACPM para evitar desvíos en los estándares.',
  history: [
    {
      id: 'hist-eval-2025',
      periodYear: '2025',
      evaluationDate: '2025-02-10',
      version: 1,
      evaluatorName: 'Ing. Carlos Mendoza',
      evaluatorRole: 'Especialista en SST',
      approverName: 'Dr. Alejandro Morales',
      complianceScorePercentage: 73,
      totalGaps: 9,
      status: 'FINALIZADA',
      technicalConclusions: 'Evaluación inicial 2025 evidenció avances en conformación de comités y diagnóstico inicial de riesgos con 9 brechas atendidas.'
    }
  ]
};
