// ============================================================================
// Datos Iniciales y Estado Global del Comité de Convivencia Laboral (CCL)
// Conforme a la RESOLUCIÓN 3461 DE 2025 DEL MINISTERIO DEL TRABAJO
// (Derogatoria expresa de Resoluciones 652 y 1356 de 2012)
// Decreto 1072 de 2015 y Resolución 0312 de 2019 (Estándar 1.1.8)
// ============================================================================

import { CclGlobalState, CclProtocolDocument } from '@/types/ccl';

export const INITIAL_CCL_PROTOCOLS: CclProtocolDocument[] = [
  {
    id: 'prot-01',
    code: 'PROT-CCL-01',
    title: 'Protocolo de Recepción, Registro y Trámite Confidencial de Quejas',
    category: 'PROTOCOLO',
    legalBasis: 'Resolución 3461 de 2025 - Ministerio del Trabajo',
    version: '01',
    updatedAt: '2026-02-15',
    description: 'Establece los canales formales, formularios estandarizados y medidas de custodia para radicar presuntas conductas sin prejuzgamiento jurídico.',
    contentTemplate: `1. OBJETO Y ALCANCE
El presente protocolo define el procedimiento para la recepción, radicación y preservación confidencial de solicitudes y quejas relacionadas con presuntas conductas que puedan afectar la convivencia laboral en la organización, en estricto cumplimiento de la Resolución 3461 de 2025.

2. PRINCIPIO DE IMPARCIALIDAD Y NO PREJUZGAMIENTO
El Comité de Convivencia Laboral (CCL) es un organismo preventivo y conciliador. Ninguna queja recibida constituirá prueba o declaración judicial automática de acoso laboral. El CCL no tiene facultades disciplinarias ni sancionatorias.

3. CANALES AUTORIZADOS DE RECEPCIÓN
- Canal digital confidencial AGAE SOLUTIONS (cifrado con acceso exclusivo al Secretario/a).
- Formulario físico en sobre cerrado dirigido a la Secretaría del CCL.
- Correo electrónico institucional seguro exclusivo del Comité.

4. TIEMPOS DE RESPUESTA Y TÉRMINOS LEGALES (RES. 3461/2025)
- Radicación y asignación de código único: Máximo 3 días hábiles tras recepción.
- Examen confidencial por el Comité: Máximo 8 días hábiles tras radicación.
- Citación a escucha individual: Máximo 5 días hábiles tras examen confidencial.`
  },
  {
    id: 'prot-02',
    code: 'PROT-CCL-02',
    title: 'Protocolo de Escucha Imparcial de las Partes y Garantía de No Revictimización',
    category: 'PROTOCOLO',
    legalBasis: 'Resolución 3461 de 2025 Art. 6',
    version: '01',
    updatedAt: '2026-02-15',
    description: 'Lineamientos obligatorios para realizar audiencias y entrevistas separadas, respetando el debido proceso y la dignidad humana.',
    contentTemplate: `1. SEPARACIÓN ESTRICTA DE AUDIENCIAS
En ningún caso se confrontará a las partes involucradas en una primera instancia. El Comité escuchará de manera individual y en sesiones independientes a la persona que presenta la queja y a la persona señalada.

2. GARANTÍAS PROCESALES
- Derecho a ser escuchado sin interrupciones ni descalificaciones.
- Posibilidad de aportar elementos de contexto o soportes documentales.
- Absoluta reserva de lo manifestado durante la sesión.
- Prohibición expresa de conductas revictimizantes o preguntas revictimizantes.

3. ACTAS DE COMPARECENCIA INDIVIDUAL
Cada entrevista contará con un acta sucinta suscrita por la parte y los integrantes delegados del Comité, conservada bajo custodia reservada.`
  },
  {
    id: 'prot-03',
    code: 'PROT-CCL-03',
    title: 'Protocolo para Espacios de Diálogo, Concertación y Planes de Mejora',
    category: 'PROTOCOLO',
    legalBasis: 'Resolución 3461 de 2025 Art. 7',
    version: '01',
    updatedAt: '2026-02-15',
    description: 'Metodología de mediación institucional para promover acuerdos voluntarios, restauración de relaciones y compromisos mutuos.',
    contentTemplate: `1. PREPARACIÓN DEL ENCUENTRO DE CONCILIACIÓN
Una vez agotada la etapa de escucha individual, y siempre que ambas partes expresen su voluntad de participar, el Comité convocará a una reunión conjunta de diálogo.

2. REGLAS DE CONVIVENCIA EN LA MESA DE DIÁLOGO
- Uso de lenguaje respetuoso, constructivo y desprovisto de agresiones verbales.
- Enfoque hacia soluciones futuras y no hacia la confrontación del pasado.
- Moderación activa por parte del Presidente y Secretario del CCL.

3. PLAN DE MEJORA Y COMPROMISOS
Los acuerdos alcanzados se registrarán en la Matriz de Compromisos con:
a) Conductas o acciones específicas acordadas.
b) Plazo de cumplimiento y responsable directo.
c) Indicador o evidencia de cumplimiento objetivo.
d) Fechas programadas de seguimiento periódico por el Comité.`
  },
  {
    id: 'prot-04',
    code: 'PROT-CCL-04',
    title: 'Protocolo de Seguridad, Custodia y Reserva Legal de Expedientes',
    category: 'PROTOCOLO',
    legalBasis: 'Resolución 3461 de 2025 y Ley 1581 de 2012 (Habeas Data)',
    version: '01',
    updatedAt: '2026-02-15',
    description: 'Mecanismos técnicos y jurídicos de restricción de acceso, salvaguardando la confidencialidad de datos sensibles.',
    contentTemplate: `1. NIVEL MÁXIMO DE RESERVA
La documentación de quejas de convivencia y presunto acoso laboral constituye información sensible sujeta a reserva legal. Ni el Gerente General ni auditores del SG-SST tienen acceso irrestricto al contenido nominativo de los casos.

2. MEDIDAS DE CONTROL DE ACCESO
- Trazabilidad criptográfica de cada consulta, descarga o modificación.
- Prohibición de extracción o difusión no autorizada bajo sanciones legales.
- Custodia física de archivos bajo llave exclusiva de la Secretaría del CCL.
- Exclusión de nombres personales en los informes estadísticos trimestrales y anuales.`
  },
  {
    id: 'prot-05',
    code: 'REGL-CCL-01',
    title: 'Reglamento Interno de Funcionamiento del Comité de Convivencia Laboral',
    category: 'REGLAMENTO',
    legalBasis: 'Resolución 3461 de 2025 Art. 9',
    version: '02',
    updatedAt: '2026-02-15',
    description: 'Estatuto regulador de conformación, quórum, funciones del presidente y secretario, y causales de impedimento y recusación.',
    contentTemplate: `CAPÍTULO I: NATURALEZA Y COMPOSICIÓN
El Comité de Convivencia Laboral es un organismo colegiado, preventivo y paritario, integrado por representantes del empleador y representantes de los trabajadores elegidos por voto secreto, para un periodo de dos (2) años.

CAPÍTULO II: SESIONES Y QUÓRUM DELIBERATORIO
El Comité sesionará ordinariamente de forma trimestral y extraordinariamente ante situaciones de urgencia. Existirá quórum decisorio con la mayoría calificada de sus integrantes.

CAPÍTULO III: IMPEDIMENTOS Y RECUSACIONES
Cualquier integrante del Comité involucrado directamente en una queja (como quejoso o persona señalada) deberá declararse impedido y será reemplazado de inmediato por su suplente paritario respectivo.`
  }
];

export const INITIAL_CCL_STATE: CclGlobalState = {
  normativeReference: 'Resolución 3461 de 2025 del Ministerio del Trabajo',
  derogatedRegulationsNote: 'Las Resoluciones 652 y 1356 de 2012 fueron derogadas expresamente por la Resolución 3461 de 2025. El módulo opera 100% bajo los lineamientos vigentes.',
  periodYears: 2,
  periodStart: '2025-03-01',
  periodEnd: '2027-02-28',
  
  // Caracterización de aplicabilidad Res. 3461/2025 para Andina de Seguridad & Logística (18-25 trabajadores)
  applicability: {
    scale: 'DE_5_A_MENOS_20',
    workerCount: 18,
    centersCount: 2,
    requiredEmployerPrincipals: 1,
    requiredEmployerAlternates: 1,
    requiredWorkersPrincipals: 1,
    requiredWorkersAlternates: 1,
    totalCommitteeMembers: 4,
    normativeReference: 'Resolución 3461 de 2025 Art. 3 Numeral 2',
    explanation: 'Para organizaciones de más de 5 y menos de 20 trabajadores, el Comité de Convivencia Laboral se conforma paritariamente por un (1) representante principal y un (1) suplente del empleador, y un (1) representante principal y un (1) suplente de los trabajadores.'
  },

  // Integrantes Paritarios del CCL (Conectados a Base Maestra de Trabajadores)
  members: [
    {
      id: 'ccl-mem-01',
      workerId: 'wrk-005', // Mariana Restrepo Morales (Analista Ambiental y de Convivencia)
      party: 'EMPLEADOR',
      role: 'PRESIDENTE',
      isPrincipal: true,
      appointmentDate: '2025-03-01',
      termEndDate: '2027-02-28',
      signedConfidentialityAgreement: true,
      confidentialitySignedAt: '2025-03-02 09:30',
      confidentialityToken: 'CONF-CCL-2025-01-MRO',
      status: 'ACTIVO'
    },
    {
      id: 'ccl-mem-02',
      workerId: 'wrk-008', // Paula Andrea Quintero (Analista Contable)
      party: 'EMPLEADOR',
      role: 'VOCAL_SUPLENTE',
      isPrincipal: false,
      appointmentDate: '2025-03-01',
      termEndDate: '2027-02-28',
      signedConfidentialityAgreement: true,
      confidentialitySignedAt: '2025-03-02 10:15',
      confidentialityToken: 'CONF-CCL-2025-02-PAQ',
      status: 'ACTIVO'
    },
    {
      id: 'ccl-mem-03',
      workerId: 'wrk-003', // Sandra Milena Gómez (Auxiliar Logística y Almacén)
      party: 'TRABAJADORES',
      role: 'SECRETARIO',
      isPrincipal: true,
      appointmentDate: '2025-03-01',
      termEndDate: '2027-02-28',
      signedConfidentialityAgreement: true,
      confidentialitySignedAt: '2025-03-02 11:00',
      confidentialityToken: 'CONF-CCL-2025-03-SMG',
      status: 'ACTIVO'
    },
    {
      id: 'ccl-mem-04',
      workerId: 'wrk-007', // Diego Armando Morales (Jefe de Taller)
      party: 'TRABAJADORES',
      role: 'VOCAL_SUPLENTE',
      isPrincipal: false,
      appointmentDate: '2025-03-01',
      termEndDate: '2027-02-28',
      signedConfidentialityAgreement: true,
      confidentialitySignedAt: '2025-03-02 11:45',
      confidentialityToken: 'CONF-CCL-2025-04-DAM',
      status: 'ACTIVO'
    }
  ],

  presidentWorkerId: 'wrk-005',
  secretaryWorkerId: 'wrk-003',
  conformationActNumber: 'ACTA-CONF-CCL-2025-01',
  conformationActDate: '2025-03-01',
  installationActDate: '2025-03-05',

  // Proceso Electoral previo
  election: {
    convocationCode: 'CONV-ELEC-CCL-2025',
    convocationDate: '2025-02-10',
    candidatesPublicationDate: '2025-02-18',
    votingStartDate: '2025-02-22 08:00',
    votingEndDate: '2025-02-22 17:00',
    isVotingOpen: false,
    isClosed: true,
    closedAt: '2025-02-22 17:15',
    closedBy: 'Comisión Escrutadora Paritaria',
    totalEligibleVoters: 18,
    votesSubmitted: 17,
    blankVotes: 1,
    nullVotes: 0,
    voterAuditLog: [
      { voterDocNumber: '1.020.784.952', votedAt: '2025-02-22 08:34:10' },
      { voterDocNumber: '79.845.120', votedAt: '2025-02-22 09:12:45' },
      { voterDocNumber: '52.984.102', votedAt: '2025-02-22 09:40:12' },
      { voterDocNumber: '19.452.887', votedAt: '2025-02-22 10:15:20' },
      { voterDocNumber: '1.032.485.961', votedAt: '2025-02-22 11:05:00' },
      { voterDocNumber: '80.124.568', votedAt: '2025-02-22 11:45:10' },
      { voterDocNumber: '1.018.965.234', votedAt: '2025-02-22 14:10:05' },
      { voterDocNumber: '1.026.852.147', votedAt: '2025-02-22 15:20:40' }
    ],
    candidates: [
      {
        id: 'cand-01',
        workerId: 'wrk-003',
        workerName: 'Sandra Milena Gómez',
        workerDocNumber: '52.984.102',
        workerPosition: 'Auxiliar Logística y Almacén',
        workerArea: 'Operaciones y Almacenamiento',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
        registrationDate: '2025-02-12',
        proposalBrief: 'Fomentar la escucha activa, empatía y trato digno entre los equipos operativos y administrativos.',
        eligibilityValidated: true,
        eligibilityNotes: 'Cumple con el artículo de inhabilidades de la Res. 3461/2025. Sin antecedentes de quejas en el último año.',
        status: 'HABILITADO',
        votesCount: 11,
        isElected: true,
        electedRole: 'PRINCIPAL'
      },
      {
        id: 'cand-02',
        workerId: 'wrk-007',
        workerName: 'Diego Armando Morales',
        workerDocNumber: '1.018.965.234',
        workerPosition: 'Jefe de Taller y Despachos',
        workerArea: 'Mantenimiento y Flota PESV',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        registrationDate: '2025-02-13',
        proposalBrief: 'Mejorar canales de comunicación y resolución asertiva de discrepancias en el área técnica y logística.',
        eligibilityValidated: true,
        eligibilityNotes: 'Cumple con los requisitos de elegibilidad e idoneidad Res. 3461/2025.',
        status: 'HABILITADO',
        votesCount: 5,
        isElected: true,
        electedRole: 'SUPLENTE'
      }
    ],
    resultsPublished: true,
    publicVotingUrlToken: 'VOTE-CCL-ANDINA-2025-SEC',
    publicationEvidenceUrl: 'https://andina-sas.com/evidencias/convocatoria-ccl-2025.pdf',
    publicationMedia: 'Correo Institucional Masivo y Cartelera Sede Fontibón'
  },

  reglamentoText: `REGLAMENTO INTERNO DE FUNCIONAMIENTO DEL COMITÉ DE CONVIVENCIA LABORAL (CCL)
EMPRESA: ANDINA DE SEGURIDAD & LOGÍSTICA S.A.S.
NIT: 900.584.210-4
BASE NORMATIVA: RESOLUCIÓN 3461 DE 2025 DEL MINISTERIO DEL TRABAJO

ARTÍCULO 1. NATURALEZA Y PRINCIPIOS
El Comité de Convivencia Laboral es una instancia paritaria, orientadora, conciliadora y preventiva creada para promover un ambiente laboral positivo, prevenir situaciones de presunto acoso laboral y concertar fórmulas de solución ante dificultades de convivencia. El Comité no tiene funciones jurisdiccionales ni sancionatorias.

ARTÍCULO 2. INTEGRACIÓN Y PERIODO
El Comité está compuesto por un representante principal y un suplente del empleador, y un representante principal y un suplente de los trabajadores. El periodo de vigencia es de dos (2) años contados a partir de la fecha de instalación.

ARTÍCULO 3. REGLAS DE CONFIDENCIALIDAD
Todos los integrantes del Comité y las personas convocadas a sus diligencias firmarán previamente un acuerdo de confidencialidad estricta. Queda terminantemente prohibida la divulgación de hechos, testimonios o datos sensibles a terceros o directivos que no formen parte del Comité.

ARTÍCULO 4. PROCEDIMIENTO PREVENTIVO DE TRÁMITE
1. Recepción y radicación confidencial de la solicitud o queja.
2. Examen reservado de admisibilidad y contexto por el Comité en pleno.
3. Audiencias individuales y separadas con cada una de las partes.
4. Convocatoria voluntaria a mesa de diálogo y concertación.
5. Formulación del Plan de Mejora con compromisos mutuos verificables.
6. Seguimiento periódico al cumplimiento efectivo de los acuerdos.
7. Cierre del caso o remisión formal motivada si no se logra conciliación.`,

  reglamentoVersion: '02',
  reglamentoApprovedDate: '2025-03-05',

  confidentialityAgreements: {
    'wrk-005': { signed: true, signedAt: '2025-03-02 09:30', token: 'CONF-CCL-2025-01-MRO' },
    'wrk-008': { signed: true, signedAt: '2025-03-02 10:15', token: 'CONF-CCL-2025-02-PAQ' },
    'wrk-003': { signed: true, signedAt: '2025-03-02 11:00', token: 'CONF-CCL-2025-03-SMG' },
    'wrk-007': { signed: true, signedAt: '2025-03-02 11:45', token: 'CONF-CCL-2025-04-DAM' }
  },

  // --------------------------------------------------------------------------
  // MATRIZ CENTRAL DE QUEJAS Y CASOS DE CONVIVENCIA (Res. 3461/2025)
  // Casos estructurados con trazabilidad completa
  // --------------------------------------------------------------------------
  complaints: [
    {
      id: 'CCL-2026-0001',
      code: 'CCL-2026-0001',
      filingDate: '2026-02-12',
      receptionDate: '2026-02-11',
      channel: 'CANAL_CONFIDENCIAL',
      status: 'PLAN_MEJORA',
      confidentialityLevel: 'RESERVADO_COMITE',
      complainantWorkerId: 'wrk-006', // Jorge Eliécer Castro (Operario Mantenimiento)
      respondentWorkerId: 'wrk-002',  // Carlos Mario Mendoza (Conductor C2)
      witnessesText: 'Personal del área de patio y cargue en horas de la mañana.',
      incidentDates: 'Semanas del 26 de enero y 5 de febrero de 2026',
      incidentLocation: 'Patio de Maniobras y Zona de Cargue Fontibón',
      factsDescription: 'Se manifiesta inconformidad por presuntas expresiones desobligantes, tonos de voz alterados y comentarios reiterados sobre el tiempo de alistamiento de los vehículos durante el despacho de la mañana, afectando el clima de trabajo en el área operativa.',
      evidences: [
        {
          id: 'ev-ccl-001',
          fileName: 'solicitud_radicada_ccl_001.pdf',
          fileType: 'PDF',
          fileSize: '245 KB',
          uploadDate: '2026-02-12 10:20',
          description: 'Formulario oficial de radicación confidencial firmado por el quejoso.',
          uploadedBy: 'Secretaría CCL'
        }
      ],
      examDeadline: '2026-02-20',
      hearingsDeadline: '2026-03-05',
      dialogueDeadline: '2026-03-15',
      resolutionDeadline: '2026-04-10',
      extensions: [],
      confidentialExam: {
        date: '2026-02-18',
        participants: ['Mariana Restrepo (Presidente)', 'Sandra Milena Gómez (Secretaria)', 'Diego Morales (Vocal)'],
        analysisSummary: 'El Comité analizó los hechos expuestos. Se identifica una situación de tensión interpersonal y estilos de comunicación reactivos en momentos de alta exigencia operativa, sin configurarse elementos constitutivos de agresión física o discriminación estructural. Procede trámite preventivo y de mediación.',
        preventiveAdministrativeConclusions: 'El caso amerita abordaje preventivo mediante escucha individual y generación de acuerdos de comunicación asertiva para restablecer la armonía en la operación de patio.',
        proceedsToHearings: true
      },
      hearings: {
        complainant: {
          date: '2026-02-25 14:00',
          attendees: ['Mariana Restrepo Morales', 'Sandra Milena Gómez', 'Jorge Eliécer Castro'],
          summaryNotes: 'El quejoso expuso que siente presión desmedida en los horarios pico y solicita que la comunicación de novedades técnicas en los camiones se realice formalmente por la orden de trabajo y no de forma verbal alterada.',
          signedConfidentiality: true,
          recordedBy: 'Sandra Milena Gómez (Secretaria)'
        },
        respondent: {
          date: '2026-02-27 10:30',
          attendees: ['Mariana Restrepo Morales', 'Sandra Milena Gómez', 'Carlos Mario Mendoza'],
          summaryNotes: 'La persona involucrada aclaró que su preocupación radicaba en la puntualidad de salida de la ruta fijada por el cliente, pero reconoce que el tono empleado no fue el más adecuado en dos oportunidades. Expresa total disposición para concertar.',
          signedConfidentiality: true,
          recordedBy: 'Sandra Milena Gómez (Secretaria)'
        }
      },
      dialogueSession: {
        date: '2026-03-04 15:00',
        attendees: ['Mariana Restrepo Morales', 'Sandra Milena Gómez', 'Jorge Eliécer Castro', 'Carlos Mario Mendoza'],
        summary: 'En un ambiente de respeto facilitado por el Comité, ambas partes dialogaron sobre las dificultades operativas y establecieron pautas de comunicación respetuosa, acordando canalizar las solicitudes de mantenimiento únicamente a través de la bitácora técnica digital.',
        agreementReached: true,
        actCode: 'ACTA-CCL-DIAL-2026-01'
      },
      improvementPlan: {
        approvedAt: '2026-03-04',
        commitments: [
          {
            id: 'com-ccl-001',
            description: 'Canalizar reportes de mantenimiento preventivo y correctivo mediante la orden de trabajo digital en la plataforma AGAE, evitando discusiones verbales en patio.',
            responsibleWorkerId: 'wrk-002',
            responsibleName: 'Carlos Mario Mendoza',
            dueDate: '2026-03-10',
            expectedEvidence: 'Registro digital de órdenes de trabajo en el módulo PESV.',
            status: 'CUMPLIDO',
            verifiedDate: '2026-03-12',
            verificationNotes: 'Verificado uso del sistema digital sin incidencias.'
          },
          {
            id: 'com-ccl-002',
            description: 'Participar en la sesión de capacitación sobre Comunicación Asertiva y Resolución de Conflictos programada en el Plan Anual de SST.',
            responsibleWorkerId: 'wrk-006',
            responsibleName: 'Jorge Eliécer Castro y Carlos Mario Mendoza',
            dueDate: '2026-03-25',
            expectedEvidence: 'Registro de asistencia a capacitación de convivencia.',
            status: 'EN_PROCESO'
          }
        ],
        recommendationsToOrganization: [
          'Socializar con la cuadrilla de patio los protocolos de entrega y recibo de vehículos en horas pico.',
          'Reforzar la campaña institucional sobre respeto en el trato diario y canales oficiales de comunicación.'
        ]
      },
      followUps: [
        {
          id: 'fol-001',
          date: '2026-03-18',
          conductedBy: 'Mariana Restrepo (Presidente CCL)',
          observations: 'Se entrevistó brevemente a ambas partes por separado. Ambas personas manifiestan que el ambiente en patio ha mejorado sustancialmente y que la comunicación es cordial.',
          effectiveCompliance: true,
          nextFollowUpDate: '2026-04-18'
        }
      ],
      timeline: [
        {
          date: '2026-02-11 16:30',
          action: 'Recepción inicial de la solicitud a través del canal confidencial digital',
          responsible: 'Sandra Milena Gómez (Secretaria)',
          documentRef: 'Formulario Radicado 001',
          newStatus: 'RECIBIDA'
        },
        {
          date: '2026-02-12 09:00',
          action: 'Radicación formal y asignación de código único de caso CCL-2026-0001',
          responsible: 'Sandra Milena Gómez (Secretaria)',
          previousStatus: 'RECIBIDA',
          newStatus: 'RADICADA'
        },
        {
          date: '2026-02-18 11:30',
          action: 'Examen confidencial en sesión extraordinaria del Comité',
          responsible: 'Comité de Convivencia Laboral',
          previousStatus: 'RADICADA',
          newStatus: 'EXAMEN_CONFIDENCIAL'
        },
        {
          date: '2026-02-25 15:00',
          action: 'Diligencia de escucha individual con la parte que presenta la queja',
          responsible: 'Mariana Restrepo y Sandra Gómez',
          previousStatus: 'EXAMEN_CONFIDENCIAL',
          newStatus: 'ESCUCHA_PARTE_A'
        },
        {
          date: '2026-02-27 11:30',
          action: 'Diligencia de escucha individual con la persona involucrada',
          responsible: 'Mariana Restrepo y Sandra Gómez',
          previousStatus: 'ESCUCHA_PARTE_A',
          newStatus: 'ESCUCHA_PARTE_B'
        },
        {
          date: '2026-03-04 16:30',
          action: 'Sesión de diálogo y concertación paritaria con suscripción de acuerdos',
          responsible: 'Comité de Convivencia y Partes',
          documentRef: 'ACTA-CCL-DIAL-2026-01',
          previousStatus: 'ESCUCHA_PARTE_B',
          newStatus: 'PLAN_MEJORA'
        },
        {
          date: '2026-03-18 10:00',
          action: 'Primer seguimiento formal evidenciando cumplimiento satisfactorio de acuerdos',
          responsible: 'Mariana Restrepo Morales',
          previousStatus: 'PLAN_MEJORA',
          newStatus: 'EN_SEGUIMIENTO'
        }
      ]
    },
    {
      id: 'CCL-2026-0002',
      code: 'CCL-2026-0002',
      filingDate: '2026-03-01',
      receptionDate: '2026-02-28',
      channel: 'REGISTRO_SECRETARIA',
      status: 'EXAMEN_CONFIDENCIAL',
      confidentialityLevel: 'ALTA_RESERVA_SECRETARIA',
      complainantWorkerId: 'wrk-008', // Paula Andrea Quintero
      respondentWorkerId: 'wrk-007',  // Diego Armando Morales
      witnessesText: 'Correos de coordinación administrativa y solicitudes de cotización.',
      incidentDates: 'Mes de febrero de 2026',
      incidentLocation: 'Oficinas Administrativas Fontibón',
      factsDescription: 'Se expone presunta falta de colaboración oportuna en la entrega de soportes de compras de repuestos y descalificación de solicitudes contables por canales informales de mensajería.',
      evidences: [
        {
          id: 'ev-ccl-002',
          fileName: 'comprobantes_comunicacion_ccl_002.pdf',
          fileType: 'PDF',
          fileSize: '310 KB',
          uploadDate: '2026-03-01 11:15',
          description: 'Cronología de solicitudes enviadas y respuestas registradas.',
          uploadedBy: 'Paula Andrea Quintero'
        }
      ],
      examDeadline: '2026-03-10',
      hearingsDeadline: '2026-03-24',
      dialogueDeadline: '2026-04-05',
      resolutionDeadline: '2026-04-28',
      extensions: [],
      confidentialExam: {
        date: '2026-03-06',
        participants: ['Mariana Restrepo Morales (Presidente)', 'Sandra Milena Gómez (Secretaria)'],
        analysisSummary: 'En atención a que una de las partes es miembro suplente del Comité (Diego Morales), se activa la regla del Artículo 3 del Reglamento y se nombra el reemplazo correspondiente para asegurar imparcialidad absoluta. El Comité encuentra procedente iniciar etapa de escucha individual.',
        preventiveAdministrativeConclusions: 'El asunto requiere clarificación de flujos de trabajo interdepartamentales entre contabilidad y mantenimiento.',
        proceedsToHearings: true
      },
      followUps: [],
      timeline: [
        {
          date: '2026-02-28 17:00',
          action: 'Recepción de comunicación escrita reservada entregada en sobre a la Secretaría',
          responsible: 'Sandra Milena Gómez (Secretaria)',
          newStatus: 'RECIBIDA'
        },
        {
          date: '2026-03-01 08:30',
          action: 'Radicación oficial de la solicitud bajo radicado CCL-2026-0002',
          responsible: 'Sandra Milena Gómez (Secretaria)',
          previousStatus: 'RECIBIDA',
          newStatus: 'RADICADA'
        },
        {
          date: '2026-03-06 14:00',
          action: 'Examen de confidencialidad e inhabilidades preliminares del Comité',
          responsible: 'Comité de Convivencia Laboral',
          previousStatus: 'RADICADA',
          newStatus: 'EXAMEN_CONFIDENCIAL'
        }
      ]
    },
    {
      id: 'CCL-2025-0003',
      code: 'CCL-2025-0003',
      filingDate: '2025-09-10',
      receptionDate: '2025-09-08',
      channel: 'FORMULARIO_INTERNO',
      status: 'CERRADA',
      confidentialityLevel: 'RESERVADO_COMITE',
      complainantWorkerId: 'wrk-002',
      respondentWorkerId: 'wrk-007',
      incidentDates: 'Agosto de 2025',
      incidentLocation: 'Área de Despachos y Programación PESV',
      factsDescription: 'Diferencias por asignación de turnos extraordinarios en fines de semana y comunicación percibida como impositiva.',
      evidences: [],
      examDeadline: '2025-09-18',
      hearingsDeadline: '2025-09-30',
      dialogueDeadline: '2025-10-10',
      resolutionDeadline: '2025-11-05',
      extensions: [],
      confidentialExam: {
        date: '2025-09-15',
        participants: ['Mariana Restrepo Morales', 'Sandra Milena Gómez'],
        analysisSummary: 'Se determinó que correspondía a una falta de criterios claros y visibles en la rotación de turnos de la flota PESV.',
        preventiveAdministrativeConclusions: 'Procedió concertación y recomendación a Gerencia para publicar rol de turnos con 72 horas de anticipación.',
        proceedsToHearings: true
      },
      dialogueSession: {
        date: '2025-09-28',
        attendees: ['Mariana Restrepo Morales', 'Sandra Milena Gómez', 'Carlos Mario Mendoza', 'Diego Armando Morales'],
        summary: 'Se concertó el rol equitativo de turnos de fines de semana y se estableció el compromiso de notificar cambios de programación con anticipación.',
        agreementReached: true,
        actCode: 'ACTA-CCL-DIAL-2025-02'
      },
      improvementPlan: {
        approvedAt: '2025-09-28',
        commitments: [
          {
            id: 'com-003-1',
            description: 'Publicar el cronograma de turnos de guardia dominical con 72 horas de antelación en el tablero de despacho.',
            responsibleWorkerId: 'wrk-007',
            responsibleName: 'Diego Armando Morales',
            dueDate: '2025-10-05',
            expectedEvidence: 'Fotografía de publicación en cartelera de despachos.',
            status: 'CUMPLIDO',
            verifiedDate: '2025-10-06'
          }
        ],
        recommendationsToOrganization: [
          'Actualizar el instructivo de programación y rotación de conductores en el Plan Estratégico de Seguridad Vial (PESV).'
        ]
      },
      followUps: [
        {
          id: 'fol-003',
          date: '2025-10-25',
          conductedBy: 'Sandra Milena Gómez',
          observations: 'Cumplimiento estricto del cronograma de turnos sin ninguna nueva queja o inconformidad.',
          effectiveCompliance: true
        }
      ],
      closure: {
        closedDate: '2025-11-15',
        closureReason: 'CONCILIACION_EXITOSA',
        closureSummary: 'El caso culminó con acuerdo total concertado, cumplimiento íntegro del plan de mejora y verificación de eficacia sin reincidencias.',
        sentToAcpm: false
      },
      timeline: [
        {
          date: '2025-09-10 09:00',
          action: 'Radicación formal del caso',
          responsible: 'Sandra Milena Gómez',
          newStatus: 'RADICADA'
        },
        {
          date: '2025-09-28 16:00',
          action: 'Suscripción de acta de acuerdo y plan de mejora',
          responsible: 'Comité de Convivencia y Partes',
          documentRef: 'ACTA-CCL-DIAL-2025-02',
          newStatus: 'PLAN_MEJORA'
        },
        {
          date: '2025-11-15 11:00',
          action: 'Cierre definitivo del expediente con archivo bajo reserva',
          responsible: 'Comité de Convivencia Laboral',
          newStatus: 'CERRADA'
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // REUNIONES ORDINARIAS Y EXTRAORDINARIAS (Resolución 3461 de 2025)
  // --------------------------------------------------------------------------
  meetings: [
    {
      id: 'ccl-meet-01',
      actaCode: 'ACTA-CCL-ORD-2025-01',
      type: 'ORDINARIA',
      date: '2025-06-15',
      time: '10:00 AM',
      modality: 'PRESENCIAL',
      locationOrLink: 'Sala de Juntas Principal Sede Fontibón',
      attendeesWorkerIds: ['wrk-005', 'wrk-003', 'wrk-008', 'wrk-007'],
      agendaTopics: [
        '1. Verificación de quórum reglamentario Res. 3461/2025',
        '2. Seguimiento al Plan Anual de Capacitación en Convivencia',
        '3. Análisis estadístico de casos y tendencias preventivas',
        '4. Propuesta de semana de la salud mental y clima laboral',
        '5. Varios y compromisos para el siguiente trimestre'
      ],
      agendaDetails: [
        {
          pointNumber: 1,
          title: 'Verificación del Quórum Reglamentario',
          discussionNotes: 'Se constató la asistencia de 4 integrantes (2 empleador, 2 trabajadores). Quórum paritario del 100% verificado.'
        },
        {
          pointNumber: 2,
          title: 'Seguimiento a Capacitaciones de Convivencia',
          discussionNotes: 'Se revisó la ejecución del taller de Inteligencia Emocional y Trabajo en Equipo realizado con apoyo de la ARL.'
        },
        {
          pointNumber: 3,
          title: 'Análisis Estadístico de Casos',
          discussionNotes: 'Cero quejas activas en el primer trimestre. Tendencia positiva en clima organizacional.'
        }
      ],
      discussionSummary: 'Se evaluaron los indicadores de convivencia laboral del segundo trimestre de 2025. Se resaltó la buena disposición de los líderes de área y se acordó apoyar la campaña de pausas activas psicosociales.',
      preventiveRecommendations: [
        'Realizar carteleras informativas sobre el decálogo de la convivencia laboral.',
        'Incluir cápsulas de comunicación positiva en las charlas de 5 minutos matutinas.'
      ],
      commitments: [
        {
          id: 'com-ccl-m1-1',
          description: 'Diseñar piezas de divulgación sobre el decálogo de respeto y canales de queja del CCL.',
          responsibleName: 'Mariana Restrepo Morales',
          dueDate: '2025-07-15',
          status: 'CUMPLIDO'
        }
      ],
      membersSignatures: [
        {
          workerId: 'wrk-005',
          memberName: 'Mariana Restrepo Morales',
          role: 'Presidente del CCL',
          party: 'EMPLEADOR',
          signed: true,
          signedAt: '2025-06-15 11:35',
          signatureToken: 'SIG-CCL-ORD-01-MRO'
        },
        {
          workerId: 'wrk-003',
          memberName: 'Sandra Milena Gómez',
          role: 'Secretaria del CCL',
          party: 'TRABAJADORES',
          signed: true,
          signedAt: '2025-06-15 11:36',
          signatureToken: 'SIG-CCL-ORD-01-SMG'
        },
        {
          workerId: 'wrk-008',
          memberName: 'Paula Andrea Quintero',
          role: 'Vocal Suplente',
          party: 'EMPLEADOR',
          signed: true,
          signedAt: '2025-06-15 11:40',
          signatureToken: 'SIG-CCL-ORD-01-PAQ'
        },
        {
          workerId: 'wrk-007',
          memberName: 'Diego Armando Morales',
          role: 'Vocal Suplente',
          party: 'TRABAJADORES',
          signed: true,
          signedAt: '2025-06-15 11:42',
          signatureToken: 'SIG-CCL-ORD-01-DAM'
        }
      ],
      isClosed: true
    },
    {
      id: 'ccl-meet-02',
      actaCode: 'ACTA-CCL-ORD-2025-02',
      type: 'ORDINARIA',
      date: '2025-10-20',
      time: '02:30 PM',
      modality: 'HIBRIDA',
      locationOrLink: 'Sala de Juntas y Enlace Virtual Meet',
      attendeesWorkerIds: ['wrk-005', 'wrk-003', 'wrk-008', 'wrk-007'],
      agendaTopics: [
        '1. Verificación de quórum reglamentario',
        '2. Lectura y aprobación del acta ordinaria anterior',
        '3. Seguimiento al caso CCL-2025-0003 y verificación de acuerdos',
        '4. Preparación de informe preventivo del tercer trimestre',
        '5. Conclusiones y fecha de próxima sesión ordinaria'
      ],
      agendaDetails: [
        {
          pointNumber: 1,
          title: 'Verificación del Quórum Reglamentario',
          discussionNotes: 'Quórum completo verificado conforme a la Resolución 3461 de 2025.'
        },
        {
          pointNumber: 2,
          title: 'Verificación de Caso CCL-2025-0003',
          discussionNotes: 'Se constató cumplimiento de publicación de turnos de conductores. Caso listo para cierre formal.'
        }
      ],
      discussionSummary: 'Sesión ordinaria trimestral. Se analizó el cierre del caso CCL-2025-0003 por cumplimiento voluntario. Se estructuró el informe preventivo para entrega a la Alta Dirección.',
      preventiveRecommendations: [
        'Coordinar con Talento Humano la encuesta de clima laboral y batería de riesgo psicosocial.'
      ],
      commitments: [
        {
          id: 'com-ccl-m2-1',
          description: 'Radicar informe de gestión del tercer trimestre ante la Gerencia General.',
          responsibleName: 'Sandra Milena Gómez',
          dueDate: '2025-10-30',
          status: 'CUMPLIDO'
        }
      ],
      membersSignatures: [
        {
          workerId: 'wrk-005',
          memberName: 'Mariana Restrepo Morales',
          role: 'Presidente del CCL',
          party: 'EMPLEADOR',
          signed: true,
          signedAt: '2025-10-20 16:00',
          signatureToken: 'SIG-CCL-ORD-02-MRO'
        },
        {
          workerId: 'wrk-003',
          memberName: 'Sandra Milena Gómez',
          role: 'Secretaria del CCL',
          party: 'TRABAJADORES',
          signed: true,
          signedAt: '2025-10-20 16:02',
          signatureToken: 'SIG-CCL-ORD-02-SMG'
        },
        {
          workerId: 'wrk-008',
          memberName: 'Paula Andrea Quintero',
          role: 'Vocal Suplente',
          party: 'EMPLEADOR',
          signed: true,
          signedAt: '2025-10-20 16:05',
          signatureToken: 'SIG-CCL-ORD-02-PAQ'
        },
        {
          workerId: 'wrk-007',
          memberName: 'Diego Armando Morales',
          role: 'Vocal Suplente',
          party: 'TRABAJADORES',
          signed: true,
          signedAt: '2025-10-20 16:07',
          signatureToken: 'SIG-CCL-ORD-02-DAM'
        }
      ],
      isClosed: true
    },
    {
      id: 'ccl-meet-03',
      actaCode: 'ACTA-CCL-EXT-2026-01',
      type: 'EXTRAORDINARIA',
      date: '2026-02-18',
      time: '11:00 AM',
      modality: 'PRESENCIAL',
      locationOrLink: 'Sala Privada de Conciliación - Sede Fontibón',
      attendeesWorkerIds: ['wrk-005', 'wrk-003', 'wrk-007'],
      agendaTopics: [
        '1. Apertura de sesión extraordinaria motivada por radicación de queja',
        '2. Examen confidencial preliminar del caso CCL-2026-0001',
        '3. Definición de cronograma de audiencias individuales de escucha',
        '4. Designación de comisiones de mediación'
      ],
      agendaDetails: [
        {
          pointNumber: 1,
          title: 'Apertura de Sesión Extraordinaria',
          discussionNotes: 'Sesión convocada por la Secretaría ante la recepción del caso CCL-2026-0001 para cumplir términos perentorios de la Res. 3461/2025.'
        },
        {
          pointNumber: 2,
          title: 'Examen de Confidencialidad y Pertinencia',
          discussionNotes: 'El Comité verificó la documentación aportada. Se programan citaciones por separado para el 25 y 27 de febrero.'
        }
      ],
      discussionSummary: 'Reunión extraordinaria para dar trámite expedito al caso CCL-2026-0001 garantizando imparcialidad y reserva de las partes.',
      preventiveRecommendations: [
        'Asegurar espacio cerrado y privado para las audiencias individuales para preservar intimidad de los trabajadores.'
      ],
      commitments: [
        {
          id: 'com-ccl-m3-1',
          description: 'Enviar citaciones reservadas en sobre cerrado a las partes convocadas.',
          responsibleName: 'Sandra Milena Gómez',
          dueDate: '2026-02-20',
          status: 'CUMPLIDO'
        }
      ],
      membersSignatures: [
        {
          workerId: 'wrk-005',
          memberName: 'Mariana Restrepo Morales',
          role: 'Presidente del CCL',
          party: 'EMPLEADOR',
          signed: true,
          signedAt: '2026-02-18 12:15',
          signatureToken: 'SIG-CCL-EXT-01-MRO'
        },
        {
          workerId: 'wrk-003',
          memberName: 'Sandra Milena Gómez',
          role: 'Secretaria del CCL',
          party: 'TRABAJADORES',
          signed: true,
          signedAt: '2026-02-18 12:16',
          signatureToken: 'SIG-CCL-EXT-01-SMG'
        },
        {
          workerId: 'wrk-007',
          memberName: 'Diego Armando Morales',
          role: 'Vocal Suplente',
          party: 'TRABAJADORES',
          signed: true,
          signedAt: '2026-02-18 12:20',
          signatureToken: 'SIG-CCL-EXT-01-DAM'
        }
      ],
      isClosed: true
    }
  ],

  protocols: INITIAL_CCL_PROTOCOLS,

  documentNotes: {
    CONFORMATION: 'Acta formal de conformación paritaria del CCL conforme a los lineamientos y reglas de la Resolución 3461 de 2025 del Ministerio del Trabajo.',
    INSTALLATION: 'Acta de instalación del Comité de Convivencia Laboral fijando cronograma ordinario trimestral y funciones de presidencia y secretaría.',
    ELECTION: 'Acta de escrutinio electoral con voto secreto e identificación del censo de votantes, garantizando la confidencialidad del sufragio.',
    EMPLOYER_DESIGNATION: 'Carta formal de designación de los representantes del empleador por parte de la Gerencia General de Andina de Seguridad & Logística S.A.S.'
  },

  securitySettings: {
    restrictComplaintsViewToCommittee: true,
    requireConfidentialityAgreementForAccess: true,
    maskNamesInGeneralDashboard: false
  }
};

export const initialCclGlobalState: CclGlobalState = INITIAL_CCL_STATE;
