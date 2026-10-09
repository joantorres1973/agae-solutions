import { ModuleType, PesvLevel, SstStandardCount } from './index';

export type { ModuleType, PesvLevel, SstStandardCount };

// ==============================================================
// 1. IDENTIFICACIÓN DE LA ORGANIZACIÓN
// ==============================================================
export type OrganizationType = 
  | 'SAS' 
  | 'SA' 
  | 'LTDA' 
  | 'ESAL' 
  | 'PERSONA_NATURAL' 
  | 'SUCURSAL_EXTRANJERA' 
  | 'COOPERATIVA' 
  | 'OTRO';

export type EconomicSector = 
  | 'TRANSPORTE' 
  | 'MANUFACTURA' 
  | 'CONSTRUCCION' 
  | 'SERVICIOS' 
  | 'COMERCIO' 
  | 'AGROPECUARIO' 
  | 'SALUD' 
  | 'MINERIA_ENERGIA' 
  | 'TECNOLOGIA' 
  | 'LOGISTICA'
  | 'SERVICIOS_PUBLICOS'
  | 'ALOJAMIENTO_ALIMENTACION'
  | 'FINANCIERO'
  | 'ADMINISTRACION_PUBLICA'
  | 'EDUCACION'
  | 'ARTE_RECREACION'
  | 'OTRO';

export interface CompanyIdentification {
  razonSocial: string;
  nombreComercial: string;
  nit: string;
  tipoOrganizacion: OrganizationType;
  sectorEconomico: EconomicSector;
  /** true cuando el usuario cambió a mano el sector sugerido por el código CIIU. */
  sectorEditadoManualmente?: boolean;
  /** Descripción cuando el sector es 'OTRO'. */
  sectorOtro?: string;
  /** Sectores en los que también opera la organización. */
  sectoresAdicionales?: EconomicSector[];
  actividadEconomicaPrincipal: string;
  actividadesSecundarias: string;
  codigoCiiu: string;
  descripcionActividades: string;
  representanteLegal: string;
  ciudad: string;
  departamento: string;
  telefono: string;
  emailContacto: string;
}

// ==============================================================
// 2. TAMAÑO DE LA ORGANIZACIÓN Y FUERZA LABORAL
// ==============================================================
export interface CompanySize {
  totalTrabajadores: number;
  trabajadoresDirectos: number;
  contratistas: number;
  temporales: number;
  aprendicesPracticantes: number;
  numeroSedes: number;
  numeroCentrosTrabajo: number;
  tieneTurnos: boolean;
  tieneTrabajoNocturno: boolean;
  tieneTrabajadoresRemotos: boolean;
  tieneTrabajadoresHibridos: boolean;
  tieneTrabajadoresEnCampo: boolean;
}

// ==============================================================
// 3. SEDES Y CENTROS DE TRABAJO (Multi-Sede Dinámica)
// ==============================================================
export type SiteType = 
  | 'PRINCIPAL' 
  | 'PLANTA' 
  | 'BODEGA' 
  | 'OFICINA_ADMIN' 
  | 'HUB_LOGISTICO' 
  | 'PUNTO_VENTA' 
  | 'CAMPAMENTO'
  | 'TALLER';

export interface CharacterizationSite {
  id: string;
  nombre: string;
  ubicacion: string;
  ciudad: string;
  departamento: string;
  tipoSede: SiteType;
  actividadRealizada: string;
  numeroTrabajadores: number;
  horario: string;
  tipoOperacion: string;
  caracteristicasParticulares: string;
  tieneRiesgoEspecifico?: string;
}

// ==============================================================
// 4. CARACTERÍSTICAS DE LA OPERACIÓN
// ==============================================================
export interface OperationalProfile {
  actividadesAdministrativas: boolean;
  actividadesOperativas: boolean;
  actividadesProductivas: boolean;
  actividadesComerciales: boolean;
  actividadesLogisticas: boolean;
  actividadesMantenimiento: boolean;
  trabajoEnCampo: boolean;
  trabajoInstalacionesTerceros: boolean;
  trabajoViaPublica: boolean;
  distribucion: boolean;
  transporte: boolean;
  desplazamientosLaborales: boolean;
}

export interface HighRiskActivities {
  trabajoAlturas: boolean;
  detallesAlturas?: {
    frecuencia: 'DIARIA' | 'SEMANAL' | 'MENSUAL' | 'OCASIONAL';
    alturaMaximaMetros: number;
    personalCertificado: boolean;
    sistemasProteccionCaidas: boolean;
  };
  /** Soldadura, corte, esmerilado u otras labores que generan calor, chispas o llama abierta. */
  trabajoCaliente?: boolean;
  detallesCaliente?: {
    tipos: string[];
  };
  espaciosConfinados: boolean;
  detallesConfinados?: {
    tiposEspacios: string;
    medicionAtmosfera: boolean;
    procedimientoRescate: boolean;
  };
  manejoSustanciasQuimicas: boolean;
  detallesQuimicos?: {
    tiposQuimicos: string;
    almacenamientoEspecializado: boolean;
    hojasSeguridadSga: boolean;
    kitAntiderrame: boolean;
  };
  manejoMaquinaria: boolean;
  detallesMaquinaria?: {
    tipos: string[]; // 'MONTACARGAS', 'PUENTE_GRUA', 'TORNO', 'PRENSA', 'CALDERA', etc.
    mantenimientoPreventivo: boolean;
  };
  manejoEquipos: boolean;
  actividadesMantenimientoCritico: boolean;
  trabajoNocturno: boolean;
  viajesLaboralesFrecuentes: boolean;
  otrasActividadesCriticas: string;
}

// ==============================================================
// 5. TRABAJADORES Y CONTRATACIÓN (Población Expuesta)
// ==============================================================
export interface WorkforceHighRiskExposure {
  trabajadoresEnAlturas: number;
  trabajadoresEnConfinados: number;
  trabajadoresEnManejoQuimicos: number;
  trabajadoresOperadoresMaquinaria: number;
  trabajadoresConductores: number;
  trabajadoresEnViaPublica: number;
  trabajadoresEnCampo: number;
  trabajadoresEnActividadesAltoRiesgo: number;
}

// ==============================================================
// 6. CARACTERIZACIÓN PARA SEGURIDAD Y SALUD EN EL TRABAJO
// ==============================================================
export interface SstCharacterizationVariables {
  claseRiesgoArl: 1 | 2 | 3 | 4 | 5;
  tieneCopasstOVigia: 'COPASST' | 'VIGIA' | 'NINGUNO';
  tieneComiteConvivencia: boolean;
  tieneBrigadaEmergencia: boolean;
  tieneExamenesMedicosOcupacionales: boolean;
  tieneMatrizPeligrosGtc45: boolean;
  peligrosIdentificados: string[];
  accidentalidadUltimoAno: number;
  enfermedadesLaboralesUltimoAno: number;
  responsableSstAsignado: boolean;
}

// ==============================================================
// 7. CARACTERIZACIÓN AMBIENTAL (Flujo Condicional Inteligente)
// ==============================================================
export interface EnvironmentalCharacterizationVariables {
  generaResiduosOrdinarios: boolean;
  generaResiduosAprovechables: boolean;
  
  // Condicional RESPEL
  generaResiduosPeligrosos: boolean;
  detallesRespel?: {
    tiposResiduos: string[];
    volumenKgMes: number;
    clasificacionGenerador: 'MICRO' | 'PEQUENO' | 'MEDIANO' | 'GRAN_GENERADOR';
    almacenamientoDedicado: boolean;
    diquesContencion: boolean;
    transporteAutorizado: boolean;
    gestorAutorizado: string;
    cuentaConCertificadosDisposicion: boolean;
  };

  // Condicional RAEE
  generaRaee: boolean;
  detallesRaee?: {
    tiposRaee: string;
    frecuenciaEntrega: string;
    gestorAutorizado: string;
  };

  // Condicional Baterías
  generaManejaBaterias: boolean;

  // Condicional Aceites Usados
  generaAceitesUsados: boolean;
  detallesAceitesUsados?: {
    volumenGalonesMes: number;
    puntoAcopioCertificado: boolean;
    gestorCertificado: string;
  };

  manejaSustanciasQuimicasAmb: boolean;
  
  // Combustibles
  utilizaCombustibles: boolean;
  detallesCombustibles?: {
    tipos: string[]; // 'DIESEL', 'GASOLINA', 'GAS_NATURAL', 'GLP', 'CARBON'
    consumoPromedioMensual: string;
    tanquesAlmacenamiento: boolean;
  };

  consumeAgua: boolean;
  fuenteAgua: 'RED_PUBLICA' | 'SUBTERRANEA' | 'SUPERFICIAL' | 'CARROTANQUE' | 'MIXTA';
  
  // Condicional Vertimientos
  generaVertimientos: boolean;
  detallesVertimientos?: {
    tipoVertimiento: 'DOMESTICO' | 'NO_DOMESTICO_INDUSTRIAL' | 'MIXTO';
    trampaGrasasOPlanta: boolean;
    requierePermisoVertimientos: boolean;
    cuentaConPermisoVertimientos: boolean;
    fechaVencimientoPermiso?: string;
  };

  // Condicional Emisiones
  generaEmisionesAtmosfericas: boolean;
  detallesEmisiones?: {
    fuentesFijas: boolean; // Calderas, hornos, generadores
    cuentaConPermisoEmisiones: boolean;
    ductosYChimeneas: boolean;
    medicionIsocineticaAlDia: boolean;
  };

  generaRuidoAmbiental: boolean;
  tieneProcesosProductivos: boolean;
  tieneMaquinariaIndustrial: boolean;
  tieneAlmacenamientoSustancias: boolean;
  tieneAlmacenamientoResiduos: boolean;
  tieneObligacionesPosconsumo: boolean;
  
  /** ¿Necesita medir su huella de carbono? No es obligación legal general: se valida con el cliente. */
  necesitaHuellaCarbono?: 'EXIGIDA' | 'VOLUNTARIA' | 'NO' | 'NO_SABE';

  // Condicional Permisos Ambientales
  tienePermisosAmbientales: boolean;
  detallesPermisos?: {
    listaPermisos: string[];
    vigencias: string;
  };

  tieneLicenciasAmbientales: boolean;
  tieneRegistrosReportesAmbientales: boolean; // RUA, RESPEL, etc.
  impactosAmbientalesSignificativos: string;
}

// ==============================================================
// 8. CARACTERIZACIÓN DE SEGURIDAD VIAL / PESV (Gatekeeper)
// ==============================================================
export interface PesvCharacterizationVariables {
  // Gatekeeper: Si es false, todo el bloque se oculta y PESV NO APLICA
  utilizaVehiculosParaActividades: boolean;

  detallesPesv?: {
    misionOrganizacional: 'TRANSPORTE_BIENES_PERSONAS' | 'APOYO_NO_TRANSPORTE';
    numeroVehiculosTotal: number;
    vehiculosPropios: number;
    vehiculosArrendados: number;
    vehiculosContratados: number;
    vehiculosTerceros: number;
    numeroConductoresTotal: number;
    conductoresDirectos: number;
    conductoresContratistas: number;
    tiposFlota: {
      motocicletas: number;
      vehiculosLivianos: number;
      vehiculosPesados: number;
      maquinariaAmarilla: number;
    };
    operaciones: {
      transportePasajeros: boolean;
      transporteMercancias: boolean;
      distribucionUrbana: boolean;
      mensajeria: boolean;
      transporteSustanciasPeligrosas: boolean;
      desplazamientosLaborales: boolean;
    };
    frecuenciaUtilizacion: 'DIARIA' | 'SEMANAL' | 'PERIODICA' | 'ESPORADICA';
    areaGeograficaOperacion: 'LOCAL' | 'REGIONAL' | 'NACIONAL' | 'INTERNACIONAL';
  };
}

// ==============================================================
// 9. CARACTERIZACIÓN DE SISTEMAS ISO
// ==============================================================
export interface IsoCharacterizationVariables {
  tieneIso9001: boolean;
  tieneIso14001: boolean;
  tieneIso45001: boolean;
  tieneSistemaIntegrado: boolean;
  estaImplementandoAlgunaNorma: boolean;
  normasEnImplementacion: string[];
  estaCertificada: boolean;
  entesCertificadores?: string;
  deseaCertificarse: boolean;
  normasDeInteres: string[];
  noTieneSistemasIso: boolean;
}

// ==============================================================
// 10. VARIABLES ESTRUCTURADAS (Raw Structured Engine Dictionary)
// ==============================================================
export interface StructuredVariablesRecord {
  numero_trabajadores: number;
  numero_trabajadores_directos: number;
  numero_contratistas: number;
  numero_sedes: number;
  codigo_ciiu: string;
  clase_riesgo_arl: 1 | 2 | 3 | 4 | 5;
  sector_economico: string;
  
  // Boolean operational switches
  tiene_turnos: boolean;
  tiene_trabajo_nocturno: boolean;
  tiene_trabajadores_remotos: boolean;
  tiene_trabajadores_campo: boolean;
  tiene_contratistas: boolean;
  
  // High risk
  trabajo_alturas: boolean;
  altura_maxima_metros: number;
  trabajo_caliente: boolean;
  espacios_confinados: boolean;
  manejo_sustancias_quimicas: boolean;
  manejo_maquinaria_pesada: boolean;
  trabajo_via_publica: boolean;
  
  // Environmental switches
  genera_residuos_ordinarios: boolean;
  genera_residuos_aprovechables: boolean;
  genera_respel: boolean;
  respel_kg_mes: number;
  genera_raee: boolean;
  maneja_baterias: boolean;
  genera_aceites_usados: boolean;
  utiliza_combustibles: boolean;
  consume_agua: boolean;
  tiene_vertimientos: boolean;
  tipo_vertimiento: string;
  tiene_emisiones_atmosfericas: boolean;
  tiene_permisos_ambientales: boolean;
  tiene_licencias_ambientales: boolean;
  tiene_reportes_rua: boolean;
  
  // PESV switches
  tiene_vehiculos: boolean;
  mision_transporte: boolean;
  total_vehiculos: number;
  total_conductores: number;
  vehiculos_pesados: number;
  motocicletas: number;
  transporte_mercancias: boolean;
  transporte_pasajeros: boolean;
  transporte_quimicos_peligrosos: boolean;
  
  // ISO switches
  tiene_iso_9001: boolean;
  tiene_iso_14001: boolean;
  tiene_iso_45001: boolean;
  sistema_integrado: boolean;
  desea_certificarse: boolean;
  
  // Composite calculated label
  tipo_operacion: string;
}

// ==============================================================
// 11. MOTOR DE APLICABILIDAD - ESTADOS Y RESULTADOS
// ==============================================================
export type ApplicabilityStatus = 
  | 'APLICA' 
  | 'NO_APLICA' 
  | 'REQUIERE_VALIDACION' 
  | 'INFORMACION_INSUFICIENTE';

export type ModuleRecommendationTier = 
  | 'NECESARIO'      // Obligatorio por ley o imperativo operacional
  | 'RECOMENDADO'    // Alto valor preventivo o de mejora
  | 'OPCIONAL'       // Deseable o escalable
  | 'NO_APLICA';     // No aplica según variables actuales

export interface RequirementEvaluation {
  id: string;
  code: string;
  standardOrNorm: string; // "Decreto 1072 de 2015", "Resolución 0312 de 2019", "Resolución 40595 de 2022", "Decreto 1076 de 2015", etc.
  name: string;
  category: 'SST' | 'PESV' | 'ENVIRONMENTAL' | 'ISO' | 'TRANSVERSAL';
  status: ApplicabilityStatus;
  reason: string;
  triggeringVariables: Record<string, string | number | boolean>;
  missingInformation?: string[];
  legalCitation: string;
  actionRequired: string;
}

export interface ModuleEvaluation {
  module: ModuleType;
  moduleName: string;
  tier: ModuleRecommendationTier;
  status: ApplicabilityStatus;
  justification: string;
  legalBasis: string;
  estimatedRequirementsCount: number;
  applicableRequirements: RequirementEvaluation[];
  monthlyPriceCop: number;
  implementationDifficulty: 'BAJA' | 'MEDIA' | 'ALTA' | 'MUY_ALTA';
}

// ==============================================================
// 12 - 13. RECOMENDACIÓN DE MÓDULOS & PROPUESTA COMERCIAL
// ==============================================================
export interface CommercialProposal {
  id: string;
  createdAt: string;
  validUntil: string;
  clientName: string;
  clientNit: string;
  complexityScore: number; // 0 - 100
  complexityTier: 'BAJA' | 'MEDIA' | 'ALTA' | 'MUY_ALTA';
  estimatedUsers: number;
  selectedModules: ModuleType[];
  allEvaluations: ModuleEvaluation[];
  pricingBreakdown: {
    subtotalModulesCop: number;
    multiModuleDiscountPercentage: number;
    discountCop: number;
    platformSetupCop: number;
    trainingAndOnboardingCop: number;
    totalMonthlyCop: number;
    totalAnnualCop: number;
  };
  implementationRoadmapWeeks: number;
  keyDeliverables: string[];
}

// ==============================================================
// 16 - 17. VALIDACIÓN FINAL & DECISIONES DE NO APLICABILIDAD
// ==============================================================
export interface ValidationDecision {
  id: string;
  requirementId: string;
  requirementCode: string;
  requirementTitle: string;
  initialAgaeResult: ApplicabilityStatus;
  finalDecision: 'ACEPTADO' | 'MODIFICADO' | 'NO_APLICA' | 'REQUIERE_REVISION';
  justification: string;
  variablesSnapshot: Record<string, any>;
  userName: string;
  userRole: string;
  timestamp: string;
  evidenceNotes?: string;
  legalSustain?: string;
}

// ==============================================================
// 18. ACTUALIZACIÓN & HISTORIAL DE CARACTERIZACIONES
// ==============================================================
export interface CharacterizationVersion {
  version: number;
  timestamp: string;
  author: string;
  reason: string;
  variablesSnapshot: StructuredVariablesRecord;
  impactedModules: ModuleType[];
  changesSummary: string[];
}

// ==============================================================
// 19. PERFIL INTEGRAL DE LA ORGANIZACIÓN
// ==============================================================
export interface CompanyCharacterization {
  identification: CompanyIdentification;
  size: CompanySize;
  sites: CharacterizationSite[];
  operational: OperationalProfile;
  highRisk: HighRiskActivities;
  workforceExposure: WorkforceHighRiskExposure;
  sst: SstCharacterizationVariables;
  environmental: EnvironmentalCharacterizationVariables;
  pesv: PesvCharacterizationVariables;
  iso: IsoCharacterizationVariables;
  
  // Derivados estructurados
  structuredVariables: StructuredVariablesRecord;
  
  // Parámetros calculados para la plataforma
  calculatedSstStandards: SstStandardCount;
  calculatedPesvLevel: PesvLevel | 'NO_APLICA';
  
  // Auditoría y Metadatos
  isCompleted: boolean;
  isPlatformConfigured: boolean;
  configuredAt?: string;
  lastUpdatedAt: string;
  version: number;
}

export type PortalView = 'landing' | 'wizard' | 'demo' | 'app';

export interface ActivationEmailData {
  companyName: string;
  nit: string;
  contactName: string;
  email: string;
  planName: string;
  billingCycle: 'MENSUAL' | 'ANUAL';
  totalCop: number;
  assignedSubdomain: string;
  accessUsername: string;
  temporaryPassword: string;
  activationToken: string;
  activeModules: ModuleType[];
  sentAt: string;
}

