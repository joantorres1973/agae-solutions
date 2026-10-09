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
    title: 'Protocolo de Prevención Integral del Acoso Laboral, Violencia y Discriminación de Género',
    category: 'PROTOCOLO',
    legalBasis: 'Resolución 3461 de 2025, Ley 1010 de 2006 y Ley 2365 de 2024',
    version: '02',
    updatedAt: '2026-03-01',
    description: 'Directrices preventivas organizacionales, mecanismos de sensibilización, detección temprana de factores de riesgo psicosocial y políticas de cero tolerancia ante conductas de acoso o violencia.',
    contentTemplate: `================================================================================
AGAE SOLUTIONS S.A.S. | SISTEMA DE GESTIÓN SG-SST
CÓDIGO: PROT-CCL-01 | VERSIÓN: 02 | VIGENCIA: 2025 - 2027
PROTOCOLO DE PREVENCIÓN INTEGRAL DEL ACOSO LABORAL, VIOLENCIA Y DISCRIMINACIÓN DE GÉNERO
================================================================================

I. OBJETO Y POLÍTICA INSTITUCIONAL
Establecer medidas proactivas, pedagógicas y organizacionales destinadas a prevenir conductas constitutivas de acoso laboral, violencia en el trabajo y acoso sexual laboral, garantizando un ambiente de trabajo digno, armónico y seguro para la totalidad de los colaboradores, en estricto cumplimiento de la Resolución 3461 de 2025 del Ministerio del Trabajo, la Ley 1010 de 2006 y la Ley 2365 de 2024.

II. ALCANCE Y POBLACIÓN CUBIERTA
Aplica obligatoriamente a todos los centros de trabajo de la organización, personal vinculado directamente mediante contrato de trabajo, aprendices del SENA, practicantes universitarios, personal en misión, contratistas independientes y personal directivo.

III. MARCO NORMATIVO VIGENTE
1. Resolución 3461 de 2025 (Ministerio del Trabajo): Régimen legal de conformación y funcionamiento del Comité de Convivencia Laboral y medidas preventivas obligatorias.
2. Ley 1010 de 2006: Mecanismos de prevención y corrección del acoso laboral.
3. Ley 2365 de 2024: Prevención y atención integral del acoso sexual en el ámbito laboral.
4. Decreto 1072 de 2015 (Libro 2, Parte 2, Título 4, Capítulo 6): SG-SST y gestión del riesgo psicosocial.
5. Resolución 2764 de 2022: Batería de instrumentos para la evaluación de factores de riesgo psicosocial.

IV. DEFINICIONES Y CONDUCTAS REGULADAS
- Acoso Laboral: Toda conducta persistente y demostrable ejercida sobre un empleado, encaminada a infundir miedo, intimidación, terror y angustia, a causar perjuicio laboral, generar desmotivación en el trabajo o inducir la renuncia del mismo.
- Acoso Sexual en el Ámbito Laboral (Ley 2365 de 2024): Todo acto de persecución, hostigamiento, asedio físico o verbal, proposición no consentida con connotación sexual o prevalimiento de autoridad que afecte la dignidad de la persona.
- Conductas Atenuantes y Agravantes: Conforme al Art. 3 y 4 de la Ley 1010 de 2006.
- Conductas que NO constituyen acoso laboral: Actos de formulación de circulares técnicas, exigencias razonables de fidelidad y rendimiento laboral, memorandos de llamado de atención motivados y potestades disciplinarias ejercidas con debido proceso.

V. PRINCIPIOS RECTORES
- Confidencialidad y Reserva Absoluta: Toda actuación, testimonio o información gozará de reserva legal.
- Imparcialidad y Presunción de Inocencia: El Comité actúa como órgano preventivo y mediador, sin prejudicamiento.
- No Revictimización: Prohibición de someter a la víctima a interrogatorios reiterativos, descalificadores o revictimizantes.
- Celeridad Procesal: Cumplimiento riguroso de los términos legales establecidos en la Resolución 3461 de 2025.

VI. PROGRAMAS Y ACCIONES PREVENTIVAS OBLIGATORIAS
1. Capacitación y Sensibilización Periódica: Taller mensual obligatorio sobre comunicación asertiva, resolución pacífica de conflictos, prevención de violencia basada en género y liderazgo positivo.
2. Evaluación Psicosocial: Aplicación y seguimiento anual de la Batería de Riesgo Psicosocial con plan de intervención liderado por Psicólogo con licencia en SST.
3. Canales de Escucha Abierta: Espacios anónimos y consultivos de orientación sobre clima laboral.
4. Socialización del Decálogo de Convivencia: Difusión en inducciones y reinducciones del SG-SST.

VII. FIRMAS DE ADOPCIÓN Y VIGENCIA
Aprobado por el Comité de Convivencia Laboral y la Gerencia General para el periodo 2025 - 2027.
- Presidente del CCL: Mariana Restrepo Morales
- Secretaria del CCL: Sandra Milena Gómez
- Representante Legal / Gerencia: Fernando Ortiz Salazar`
  },
  {
    id: 'prot-02',
    code: 'PROT-CCL-02',
    title: 'Procedimiento de Recepción, Radicación y Trámite Confidencial de Quejas',
    category: 'PROCEDIMIENTO',
    legalBasis: 'Resolución 3461 de 2025 Art. 4, 5 y 6',
    version: '02',
    updatedAt: '2026-03-01',
    description: 'Establece los canales formales de recepción, asignación de código reservado, examen preliminar de pertinencia y términos perentorios en días hábiles.',
    contentTemplate: `================================================================================
AGAE SOLUTIONS S.A.S. | SISTEMA DE GESTIÓN SG-SST
CÓDIGO: PROT-CCL-02 | VERSIÓN: 02 | VIGENCIA: 2025 - 2027
PROCEDIMIENTO DE RECEPCIÓN, RADICACIÓN Y TRÁMITE CONFIDENCIAL DE QUEJAS
================================================================================

I. OBJETO
Normar el flujo integral de radicación, registro cifrado, análisis preliminar y trámite interno de quejas o solicitudes sobre convivencia laboral y presuntas conductas de acoso, garantizando la reserva del expediente y la celeridad requerida por la Resolución 3461 de 2025.

II. CANALES AUTORIZADOS DE RECEPCIÓN
1. Canal Digital Cifrado AGAE SOLUTIONS: Formulario web seguro con token de radicación automático al que únicamente tiene acceso la Secretaría del Comité.
2. Buzón Físico de Convivencia: Ubicado en punto ciego sin cámaras, con apertura quincenal exclusiva por la Secretaría del Comité.
3. Correo Electrónico Institucional Exclusivo: ccl.confidencial@andina-logistica.com.co

III. TÉRMINOS LEGALES PERENTORIOS (RESOLUCIÓN 3461 DE 2025)
- Día 0 a 3 hábiles: Recepción, asignación de consecutivo único (ej: CCL-2026-0001) y acuse de recibo confidencial al quejoso.
- Día 4 a 8 hábiles: Convocatoria extraordinaria o inclusión en la sesión ordinaria mensual para examen preliminar de admisibilidad y pertinencia.
- Día 9 a 12 hábiles: Notificación y citación por separado a las partes para audiencia de escucha individual.
- Día 13 a 20 hábiles: Audiencias individuales de versión libre, recepción de elementos de contexto y firma de actas reservadas.
- Día 21 a 30 hábiles: Sesión de mediación conjunta (si ambas partes consienten) o formulación de recomendaciones preventivas institucionales.

IV. REQUISITOS FORMALES DE LA QUEJA
La solicitud debe contener:
a) Identificación del quejoso (nombre, cargo, área y documento de identidad).
b) Identificación de la persona o personas señaladas.
c) Relato cronológico y sucinto de los hechos, con fechas y lugares específicos.
d) Relación de posibles testigos o elementos de soporte (si los hubiere).
e) Declaración de no haber interpuesto querella administrativa simultánea o manifestación de trámite interno previo.

V. CADENA DE CUSTODIA Y ARCHIVO
Toda la documentación física se conservará en el archivo de seguridad bajo custodia de la Secretaría. Los registros digitales contarán con cifrado AES-256 en la plataforma AGAE.`
  },
  {
    id: 'prot-03',
    code: 'PROT-CCL-03',
    title: 'Protocolo de Audiencias Separadas, Escucha Imparcial y No Revictimización',
    category: 'PROTOCOLO',
    legalBasis: 'Resolución 3461 de 2025 Art. 6',
    version: '02',
    updatedAt: '2026-03-01',
    description: 'Lineamientos obligatorios para realizar entrevistas individuales, garantizar el derecho a la defensa y el debido proceso sin confrontación lesiva entre las partes.',
    contentTemplate: `================================================================================
AGAE SOLUTIONS S.A.S. | SISTEMA DE GESTIÓN SG-SST
CÓDIGO: PROT-CCL-03 | VERSIÓN: 02 | VIGENCIA: 2025 - 2027
PROTOCOLO DE AUDIENCIAS SEPARADAS, ESCUCHA IMPARCIAL Y NO REVICTIMIZACIÓN
================================================================================

I. PRINCIPIO DE SEPARACIÓN ESTRICTA EN ETAPA PRELIMINAR
Queda expresamente prohibido celebrar careos o confrontaciones directas entre la parte quejosa y la parte señalada en la etapa inicial de conocimiento de la queja. El Comité escuchará de forma estrictamente individual y en días o franjas horarias separadas a cada interviniente.

II. GARANTÍAS PARA LA PERSONA QUEJOSA
1. Ambiente Seguro y Privado: La sesión se adelantará en sala cerrada con insonorización, garantizando intimidad y tranquilidad emocional.
2. No Cuestionamiento de Credibilidad a Priori: El Comité escuchará activamente sin emitir juicios de valor, descalificaciones ni preguntas revictimizantes.
3. Posibilidad de Acompañamiento Psicosocial: La persona podrá solicitar la presencia orientadora de un profesional en psicología del SG-SST.

III. GARANTÍAS PARA LA PERSONA SEÑALADA (DEBIDO PROCESO)
1. Notificación Previa y Concreta: Conocimiento oportuno de los hechos motivo de la queja, protegiendo datos sensibles.
2. Derecho a la Contradicción: Oportunidad procesal amplia de exponer su versión de los acontecimientos y aportar elementos de contexto.
3. Presunción de Buena Fe e Inocencia: El trámite ante el CCL es de naturaleza conciliatoria y preventiva; no genera antecedente disciplinario per se.

IV. REGLAS PARA LA RECEPCIÓN DE TESTIMONIOS
- La citación a testigos es potestativa del Comité y se limitará a corroborar el clima de convivencia en el entorno de trabajo.
- Se mantendrá el anonimato de las declaraciones en los informes que se deriven del proceso.`
  },
  {
    id: 'prot-04',
    code: 'PROT-CCL-04',
    title: 'Protocolo de Medidas Cautelares, Protección Preventiva y Garantía de No Represalias',
    category: 'PROTOCOLO',
    legalBasis: 'Ley 1010 de 2006 Art. 11, Resolución 3461 de 2025 y Ley 2365 de 2024',
    version: '02',
    updatedAt: '2026-03-01',
    description: 'Procedimiento de emisión inmediata de medidas provisionales de protección, reubicación temporal preventiva y blindaje contra represalias laborales directas o indirectas.',
    contentTemplate: `================================================================================
AGAE SOLUTIONS S.A.S. | SISTEMA DE GESTIÓN SG-SST
CÓDIGO: PROT-CCL-04 | VERSIÓN: 02 | VIGENCIA: 2025 - 2027
PROTOCOLO DE MEDIDAS CAUTELARES, PROTECCIÓN INMEDIATA Y NO REPRESALIAS
================================================================================

I. OBJETO Y FINALIDAD
Salvaguardar de manera perentoria la integridad física, psicológica y las condiciones de estabilidad laboral de las personas involucradas en una queja durante la tramitación del proceso ante el CCL.

II. MEDIDAS CAUTELARES DISPONIBLES (A SOLICITUD O DE OFICIO)
Cuando el Comité identifique riesgo inminente para la salud mental o física de los involucrados, recomendará formalmente a la Gerencia:
1. Reubicación Temporal de Puesto de Trabajo: Traslado preventivo de puesto físico dentro de la misma sede sin desmejora salarial ni prestacional.
2. Modificación Temporal de Horarios o Turnos: Ajuste en la programación operativa para evitar coincidencias en turnos de servicio.
3. Modalidad de Trabajo Remoto o Híbrido Temporal: Aplicación transitoria de trabajo en casa o teletrabajo durante la vigencia del trámite.
4. Separación de Línea de Reporte o Supervisión: Asignación transitoria de un evaluador o supervisor par para evaluaciones de desempeño y directrices.

III. GARANTÍA DE NO REPRESALIAS (ARTÍCULO 11 LEY 1010 DE 2006)
- Protección Laboral Reforzada: La terminación unilateral del contrato de trabajo del quejoso o de los testigos dentro de los seis (6) meses siguientes a la formulación de la queja carecerá de todo efecto si se demuestra relación de causalidad con la misma.
- Prohibición de Represalias Ocultas: Se prohíbe cualquier cambio injustificado de funciones descalificatorio, sobrecarga selectiva de trabajo, exclusión deliberada de comunicaciones o evaluaciones sesgadas.
- Canal Prioritario de Denuncia por Represalia: Ante cualquier indicio de retaliación, el Comité sesionará de forma extraordinaria en menos de 48 horas.`
  },
  {
    id: 'prot-05',
    code: 'PROT-CCL-05',
    title: 'Protocolo para Espacios de Diálogo, Concertación Amigable y Planes de Mejora',
    category: 'PROTOCOLO',
    legalBasis: 'Resolución 3461 de 2025 Art. 7',
    version: '02',
    updatedAt: '2026-03-01',
    description: 'Metodología estructurada de mediación institucional paritaria para lograr acuerdos voluntarios de conducta, compromisos verificables y restauración del clima laboral.',
    contentTemplate: `================================================================================
AGAE SOLUTIONS S.A.S. | SISTEMA DE GESTIÓN SG-SST
CÓDIGO: PROT-CCL-05 | VERSIÓN: 02 | VIGENCIA: 2025 - 2027
PROTOCOLO PARA ESPACIOS DE DIÁLOGO, CONCERTACIÓN AMIGABLE Y PLANES DE MEJORA
================================================================================

I. VOLUNTARIEDAD DEL ESPACIO DE MEDIACIÓN
La sesión conjunta de diálogo se convocará única y exclusivamente cuando ambas partes hayan manifestado expresamente su consentimiento libre e informado de acudir a la mesa de concertación facilitada por el Comité.

II. METODOLOGÍA DEL ENCUENTRO
1. Apertura: El Presidente del CCL reitera el marco de confidencialidad, las reglas de respeto mutuo y el objetivo restaurativo de la reunión.
2. Exposición Orientada a Soluciones: Cada parte expresa sus percepciones y expectativas de futuro, prohibiéndose descalificaciones personales o revictimizaciones.
3. Identificación de Puntos de Convergencia: El Comité actúa como facilitador neutral para formular fórmulas de arreglo amigable.

III. ACTA DE ACUERDO Y COMPROMISOS (PLAN DE MEJORA)
Los acuerdos alcanzados se consignarán en un acta con fuerza vinculante interna, especificando:
- Conductas concretas y compromisos de comunicación asertiva.
- Cronograma de metas y fechas de cumplimiento.
- Indicador objetivo de verificación.
- Periodicidad de sesiones de seguimiento por parte del Comité (a los 30, 60 y 90 días).

IV. PROCEDIMIENTO ANTE FALTA DE ACUERDO O INCUMPLIMIENTO
Si las partes no logran acuerdo voluntario, o si una de ellas incumple los compromisos pactados, el Comité cerrará la etapa conciliatoria y remitirá informe reservado con recomendaciones a la Alta Dirección para que adopte las medidas legales o disciplinarias pertinentes.`
  },
  {
    id: 'prot-06',
    code: 'PROT-CCL-06',
    title: 'Protocolo de Seguridad, Custodia y Reserva Legal de Expedientes Sensibles',
    category: 'PROTOCOLO',
    legalBasis: 'Resolución 3461 de 2025, Ley 1581 de 2012 y Código Sustantivo del Trabajo',
    version: '02',
    updatedAt: '2026-03-01',
    description: 'Protocolos de seguridad informática, niveles de cifrado, deber de secreto profesional inmutable y reserva de expedientes para proteger la intimidad y el buen nombre.',
    contentTemplate: `================================================================================
AGAE SOLUTIONS S.A.S. | SISTEMA DE GESTIÓN SG-SST
CÓDIGO: PROT-CCL-06 | VERSIÓN: 02 | VIGENCIA: 2025 - 2027
PROTOCOLO DE SEGURIDAD, CUSTODIA Y RESERVA LEGAL DE EXPEDIENTES SENSIBLES
================================================================================

I. CALIFICACIÓN JURÍDICA DE LA INFORMACIÓN
Todos los documentos, actas, audios, declaraciones y expedientes radicados ante el Comité de Convivencia Laboral tienen el carácter legal de DATOS SENSIBLES Y RESERVADOS.

II. COMPROMISO INMUTABLE DE CONFIDENCIALIDAD
Todos los integrantes del Comité (principales y suplentes), así como el personal técnico que asista en las plataformas, deben suscribir al posesionarse el Acuerdo de Confidencialidad y Reserva Procesal. La violación de este secreto constituye falta gravísima laboral y causal de exclusión inmediata del Comité, sin perjuicio de acciones civiles y penales.

III. MEDIDAS DE CONTROL DE ACCESO
1. Separación de Perfiles: Los expedientes nominativos no son visibles en los tableros generales del SG-SST ni por la Gerencia General, salvo entrega formal de informe de remisión.
2. Trazabilidad Criptográfica: Cada acceso, apertura o edición de un expediente deja registro inalterable de auditoría (usuario, cédula, fecha, hora e IP).
3. Anonimización Obligatoria en Informes Periódicos: Todos los informes mensuales, consolidados y estadísticas de gestión omitirán nombres propios, usando exclusivamente códigos de expediente.`
  },
  {
    id: 'prot-07',
    code: 'REGL-CCL-01',
    title: 'Reglamento Interno de Funcionamiento del Comité de Convivencia Laboral (Res. 3461/2025)',
    category: 'REGLAMENTO',
    legalBasis: 'Resolución 3461 de 2025 Art. 9',
    version: '02',
    updatedAt: '2026-03-01',
    description: 'Estatuto regulador de la conformación, régimen de sesiones mensuales ordinarias, quórum decisorio, funciones del presidente y secretario, e impedimentos y recusaciones.',
    contentTemplate: `================================================================================
AGAE SOLUTIONS S.A.S. | SISTEMA DE GESTIÓN SG-SST
CÓDIGO: REGL-CCL-01 | VERSIÓN: 02 | VIGENCIA: 2025 - 2027
REGLAMENTO INTERNO DE FUNCIONAMIENTO DEL COMITÉ DE CONVIVENCIA LABORAL
================================================================================

CAPÍTULO I: NATURALEZA, COMPOSICIÓN Y PERIODO
El Comité de Convivencia Laboral es un organismo paritario, preventivo y autónomo, conformado por igual número de representantes del empleador (designados directamente) y de los trabajadores (elegidos por voto libre y secreto). Su periodo legal es de dos (2) años a partir del acta de instalación.

CAPÍTULO II: PERIODICIDAD DE SESIONES (RESOLUCIÓN 3461 DE 2025)
1. Sesiones Ordinarias Mensuales: El Comité sesionará de manera obligatoria una (1) vez al mes de forma ordinaria (mínimo 12 actas ordinarias al año), para realizar seguimiento a planes preventivos, estadísticas, capacitaciones y clima organizacional.
2. Sesiones Extraordinarias: Se convocará extraordinariamente cuando se presente una situación de urgencia, se radique una queja con solicitud de medidas cautelares o a solicitud motivada de cualquiera de sus miembros.

CAPÍTULO III: QUÓRUM Y DECISIONES
El quórum deliberatorio y decisorio se constituirá con la presencia de la mayoría de los integrantes del Comité (al menos un representante de cada parte). Las decisiones se tomarán preferentemente por consenso y subsidiariamente por mayoría simple.

CAPÍTULO IV: FUNCIONES DEL PRESIDENTE Y SECRETARIO
- Presidente: Convocar a sesiones, presidir y moderar con imparcialidad las reuniones, y canalizar las recomendaciones institucionales ante la Alta Dirección.
- Secretario: Recibir y custodiar las quejas bajo reserva, levantar las actas de cada sesión ordinaria y extraordinaria, enviar citaciones reservadas y proyectar los informes mensuales de gestión.

CAPÍTULO V: IMPEDIMENTOS Y RECUSACIONES
Cualquier integrante del Comité involucrado en una queja como parte quejosa, persona señalada o testigo directo, deberá manifestar de inmediato su impedimento legal y abstenerse de participar en el estudio del caso. En tal circunstancia, será reemplazado de pleno derecho por su suplente paritario correspondiente.`
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
        '5. Varios y compromisos para el siguiente mes'
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
          discussionNotes: 'Cero quejas activas en el mes evaluado. Tendencia positiva en clima organizacional.'
        }
      ],
      discussionSummary: 'Se evaluaron los indicadores de convivencia laboral del mes. Se resaltó la buena disposición de los líderes de área y se acordó apoyar la campaña de pausas activas psicosociales.',
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
        '4. Preparación de informe preventivo mensual',
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
      discussionSummary: 'Sesión ordinaria mensual. Se analizó el cierre del caso CCL-2025-0003 por cumplimiento voluntario. Se estructuró el informe preventivo para entrega a la Alta Dirección.',
      preventiveRecommendations: [
        'Coordinar con Talento Humano la encuesta de clima laboral y batería de riesgo psicosocial.'
      ],
      commitments: [
        {
          id: 'com-ccl-m2-1',
          description: 'Radicar informe de gestión mensual ante la Gerencia General.',
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
    INSTALLATION: 'Acta de instalación del Comité de Convivencia Laboral fijando cronograma ordinario mensual (Res. 3461 de 2025) y funciones de presidencia y secretaría.',
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
