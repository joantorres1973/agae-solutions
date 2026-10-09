import {
  CompanyCharacterization,
  ValidationDecision,
  CharacterizationVersion
} from '@/types/characterization';
import { extractStructuredVariables, calculateSstStandardsCount, calculatePesvLevel } from './applicability-engine';

// ==============================================================
// 1. CARACTERIZACIÓN INICIAL POR DEFECTO (Logística & Manufactura Andina)
// ==============================================================
export const defaultCompanyCharacterization: CompanyCharacterization = {
  identification: {
    razonSocial: 'Logística & Manufactura Andina S.A.S.',
    nombreComercial: 'Andina Logistics',
    nit: '901.458.923-4',
    tipoOrganizacion: 'SAS',
    sectorEconomico: 'TRANSPORTE',
    actividadEconomicaPrincipal: 'Transporte terrestre de carga pesada, almacenamiento y distribución logística de mercancías',
    actividadesSecundarias: 'Mantenimiento de vehículos automotores y alquiler de bodegas industriales',
    codigoCiiu: '4923',
    descripcionActividades: 'Operación logística nacional con centro de consolidación de carga en Bogotá y sede operativa en Medellín. Movilización de carga seca y refrigerada.',
    representanteLegal: 'Lic. Fernando Ortiz Salazar',
    ciudad: 'Bogotá D.C.',
    departamento: 'Cundinamarca',
    telefono: '(+57 601) 745-8900',
    emailContacto: 'direccion@andina.com.co'
  },
  size: {
    totalTrabajadores: 142,
    trabajadoresDirectos: 104,
    contratistas: 28,
    temporales: 10,
    aprendicesPracticantes: 4,
    numeroSedes: 2,
    numeroCentrosTrabajo: 2,
    tieneTurnos: true,
    tieneTrabajoNocturno: true,
    tieneTrabajadoresRemotos: true,
    tieneTrabajadoresHibridos: true,
    tieneTrabajadoresEnCampo: true
  },
  sites: [
    {
      id: 'site-bogota',
      nombre: 'Centro de Distribución Fontibón (Sede Principal)',
      ubicacion: 'Calle 17 # 96-45, Fontibón',
      ciudad: 'Bogotá D.C.',
      departamento: 'Bogotá D.C.',
      tipoSede: 'PRINCIPAL',
      actividadRealizada: 'Operaciones de cargue, almacenamiento, taller de mantenimiento preventivo y oficinas centrales.',
      numeroTrabajadores: 95,
      horario: 'Lunes a Sábado - Turnos Rotativos 24/7',
      tipoOperacion: 'Almacenamiento y Mantenimiento de Flota',
      caracteristicasParticulares: 'Bahías de cargue a desnivel, racks de 8 metros, acopio de residuos peligrosos.',
      tieneRiesgoEspecifico: 'Tránsito de montacargas y trabajo en alturas en mantenimiento de techos'
    },
    {
      id: 'site-medellin',
      nombre: 'Hub Regional Guayabal',
      ubicacion: 'Carrera 52 # 14-88, Guayabal',
      ciudad: 'Medellín',
      departamento: 'Antioquia',
      tipoSede: 'HUB_LOGISTICO',
      actividadRealizada: 'Cross-docking regional, distribución última milla y patio de maniobras.',
      numeroTrabajadores: 47,
      horario: 'Lunes a Sábado de 06:00 a 22:00',
      tipoOperacion: 'Distribución y Maniobras Viales',
      caracteristicasParticulares: 'Patio de camiones y motocicletas de mensajería.',
      tieneRiesgoEspecifico: 'Riesgo vial en vía pública y manipulación manual de cargas'
    }
  ],
  operational: {
    actividadesAdministrativas: true,
    actividadesOperativas: true,
    actividadesProductivas: false,
    actividadesComerciales: true,
    actividadesLogisticas: true,
    actividadesMantenimiento: true,
    trabajoEnCampo: true,
    trabajoInstalacionesTerceros: true,
    trabajoViaPublica: true,
    distribucion: true,
    transporte: true,
    desplazamientosLaborales: true
  },
  highRisk: {
    trabajoAlturas: true,
    detallesAlturas: {
      frecuencia: 'SEMANAL',
      alturaMaximaMetros: 8.5,
      personalCertificado: true,
      sistemasProteccionCaidas: true
    },
    espaciosConfinados: false,
    manejoSustanciasQuimicas: true,
    detallesQuimicos: {
      tiposQuimicos: 'Aceites dieléctricos, lubricantes de motor, desengrasantes industriales y refrigerantes R-134a',
      almacenamientoEspecializado: true,
      hojasSeguridadSga: true,
      kitAntiderrame: true
    },
    manejoMaquinaria: true,
    detallesMaquinaria: {
      tipos: ['MONTACARGAS_COMBUSTION', 'ESTIBADORAS_ELECTRICAS', 'COMPRESOR_AIRE_ALTA_PRESION'],
      mantenimientoPreventivo: true
    },
    manejoEquipos: true,
    actividadesMantenimientoCritico: true,
    trabajoNocturno: true,
    viajesLaboralesFrecuentes: true,
    otrasActividadesCriticas: 'Cargue nocturno en plataformas logísticas y rutas intermunicipales de alta montaña.'
  },
  workforceExposure: {
    trabajadoresEnAlturas: 12,
    trabajadoresEnConfinados: 0,
    trabajadoresEnManejoQuimicos: 8,
    trabajadoresOperadoresMaquinaria: 16,
    trabajadoresConductores: 42,
    trabajadoresEnViaPublica: 48,
    trabajadoresEnCampo: 35,
    trabajadoresEnActividadesAltoRiesgo: 12
  },
  sst: {
    claseRiesgoArl: 4,
    tieneCopasstOVigia: 'COPASST',
    tieneComiteConvivencia: true,
    tieneBrigadaEmergencia: true,
    tieneExamenesMedicosOcupacionales: true,
    tieneMatrizPeligrosGtc45: true,
    peligrosIdentificados: [
      'Biomecánico por levantamiento manual de cargas',
      'Condiciones de seguridad locativo y mecánico por tránsito de montacargas',
      'Peligro vial por colisión en rutas nacionales',
      'Físico por ruido en patio de mantenimiento'
    ],
    accidentalidadUltimoAno: 3,
    enfermedadesLaboralesUltimoAno: 0,
    responsableSstAsignado: true
  },
  environmental: {
    generaResiduosOrdinarios: true,
    generaResiduosAprovechables: true,
    generaResiduosPeligrosos: true,
    detallesRespel: {
      tiposResiduos: ['Aceites usados de motor', 'Filtros saturados', 'Baterías plomo-ácido', 'Trapos contaminados con hidrocarburo'],
      volumenKgMes: 480,
      clasificacionGenerador: 'MEDIANO',
      almacenamientoDedicado: true,
      diquesContencion: true,
      transporteAutorizado: true,
      gestorAutorizado: 'EcoProcesos Ambientales S.A.S. E.S.P. (NIT 830.123.456-1)',
      cuentaConCertificadosDisposicion: true
    },
    generaRaee: true,
    detallesRaee: {
      tiposRaee: 'Monitores obsoletos, teclados y tarjetas de rastreo GPS en desuso',
      frecuenciaEntrega: 'Semestral',
      gestorAutorizado: 'Fundación Puntos Verdes'
    },
    generaManejaBaterias: true,
    generaAceitesUsados: true,
    detallesAceitesUsados: {
      volumenGalonesMes: 120,
      puntoAcopioCertificado: true,
      gestorCertificado: 'EcoProcesos Ambientales S.A.S.'
    },
    manejaSustanciasQuimicasAmb: true,
    utilizaCombustibles: true,
    detallesCombustibles: {
      tipos: ['DIESEL_B10', 'GASOLINA_CORRIENTE'],
      consumoPromedioMensual: '4.250 Galones Diesel B10',
      tanquesAlmacenamiento: false
    },
    consumeAgua: true,
    fuenteAgua: 'RED_PUBLICA',
    generaVertimientos: true,
    detallesVertimientos: {
      tipoVertimiento: 'NO_DOMESTICO_INDUSTRIAL',
      trampaGrasasOPlanta: true,
      requierePermisoVertimientos: false, // Conexión a alcantarillado con pretratamiento trampa de grasas
      cuentaConPermisoVertimientos: true
    },
    generaEmisionesAtmosfericas: false,
    generaRuidoAmbiental: true,
    tieneProcesosProductivos: false,
    tieneMaquinariaIndustrial: true,
    tieneAlmacenamientoSustancias: true,
    tieneAlmacenamientoResiduos: true,
    tieneObligacionesPosconsumo: true,
    tienePermisosAmbientales: false,
    tieneLicenciasAmbientales: false,
    tieneRegistrosReportesAmbientales: true,
    impactosAmbientalesSignificativos: 'Consumo de combustibles fósiles (emisiones de CO₂eq) y generación de residuos aceitosos del taller.'
  },
  pesv: {
    utilizaVehiculosParaActividades: true,
    detallesPesv: {
      misionOrganizacional: 'TRANSPORTE_BIENES_PERSONAS',
      numeroVehiculosTotal: 26,
      vehiculosPropios: 18,
      vehiculosArrendados: 4,
      vehiculosContratados: 4,
      vehiculosTerceros: 0,
      numeroConductoresTotal: 34,
      conductoresDirectos: 26,
      conductoresContratistas: 8,
      tiposFlota: {
        motocicletas: 6,
        vehiculosLivianos: 4,
        vehiculosPesados: 16,
        maquinariaAmarilla: 0
      },
      operaciones: {
        transportePasajeros: false,
        transporteMercancias: true,
        distribucionUrbana: true,
        mensajeria: true,
        transporteSustanciasPeligrosas: false,
        desplazamientosLaborales: true
      },
      frecuenciaUtilizacion: 'DIARIA',
      areaGeograficaOperacion: 'NACIONAL'
    }
  },
  iso: {
    tieneIso9001: true,
    tieneIso14001: true,
    tieneIso45001: true,
    tieneSistemaIntegrado: true,
    estaImplementandoAlgunaNorma: false,
    normasEnImplementacion: [],
    estaCertificada: true,
    entesCertificadores: 'ICONTEC Internacional (Certificado SC-CER891452)',
    deseaCertificarse: true,
    normasDeInteres: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 39001:2012'],
    noTieneSistemasIso: false
  },
  structuredVariables: {} as any, // populated below
  calculatedSstStandards: 60,
  calculatedPesvLevel: 'AVANZADO',
  isCompleted: true,
  isPlatformConfigured: true,
  configuredAt: '2026-03-01 09:00',
  lastUpdatedAt: '2026-03-30 16:30',
  version: 2
};

// Initialize structured variables
defaultCompanyCharacterization.structuredVariables = extractStructuredVariables(defaultCompanyCharacterization);
defaultCompanyCharacterization.calculatedSstStandards = calculateSstStandardsCount(
  defaultCompanyCharacterization.size.totalTrabajadores,
  defaultCompanyCharacterization.sst.claseRiesgoArl
);
defaultCompanyCharacterization.calculatedPesvLevel = calculatePesvLevel(
  defaultCompanyCharacterization.pesv.utilizaVehiculosParaActividades,
  defaultCompanyCharacterization.pesv.detallesPesv?.misionOrganizacional === 'TRANSPORTE_BIENES_PERSONAS',
  defaultCompanyCharacterization.pesv.detallesPesv?.numeroVehiculosTotal || 0,
  defaultCompanyCharacterization.pesv.detallesPesv?.numeroConductoresTotal || 0
) as any;

// ==============================================================
// 2. ARQUETIPOS DE EMPRESA PARA PRUEBAS RÁPIDAS
// ==============================================================
export const characterizationArchetypes: Array<{
  id: string;
  name: string;
  description: string;
  badge: string;
  template: Partial<CompanyCharacterization>;
}> = [
  {
    id: 'archetype-logistica',
    name: 'Logística & Transporte Pesado (Andina)',
    description: '142 trabajadores, Riesgo IV, 26 vehículos pesados, taller mecánico con RESPEL y 2 sedes operativas.',
    badge: '60 Estándares • PESV Avanzado • RESPEL',
    template: defaultCompanyCharacterization
  },
  {
    id: 'archetype-servicios',
    name: 'Consultoría & Servicios Administrativos',
    description: '12 colaboradores, Riesgo I, oficina administrativa única. No cuenta con vehículos, no genera RESPEL ni realiza trabajos de alto riesgo.',
    badge: '21 Estándares • Sin PESV • Cero RESPEL',
    template: {
      identification: {
        razonSocial: 'Consultores Estratégicos & Asociados S.A.S.',
        nombreComercial: 'StrategyLab',
        nit: '900.892.311-2',
        tipoOrganizacion: 'SAS',
        sectorEconomico: 'SERVICIOS',
        actividadEconomicaPrincipal: 'Actividades de consultoría de gestión empresarial y financiera',
        actividadesSecundarias: 'Capacitación ejecutiva',
        codigoCiiu: '7020',
        descripcionActividades: 'Servicios de asesoría estratégica para pymes y corporaciones en Bogotá.',
        representanteLegal: 'Dra. Claudia Marcela Hoyos',
        ciudad: 'Bogotá D.C.',
        departamento: 'Bogotá D.C.',
        telefono: '(+57 601) 320-1122',
        emailContacto: 'contacto@strategylab.co'
      },
      size: {
        totalTrabajadores: 12,
        trabajadoresDirectos: 8,
        contratistas: 3,
        temporales: 0,
        aprendicesPracticantes: 1,
        numeroSedes: 1,
        numeroCentrosTrabajo: 1,
        tieneTurnos: false,
        tieneTrabajoNocturno: false,
        tieneTrabajadoresRemotos: true,
        tieneTrabajadoresHibridos: true,
        tieneTrabajadoresEnCampo: false
      },
      sites: [
        {
          id: 'site-admin',
          nombre: 'Sede Administrativa Torre 93',
          ubicacion: 'Calle 93B # 13-45 Of. 502',
          ciudad: 'Bogotá D.C.',
          departamento: 'Bogotá D.C.',
          tipoSede: 'OFICINA_ADMIN',
          actividadRealizada: 'Trabajo de oficina, consultoría y reuniones de comités.',
          numeroTrabajadores: 12,
          horario: 'Lunes a Viernes 08:00 - 17:30',
          tipoOperacion: 'Administrativa',
          caracteristicasParticulares: 'Edificio inteligente con control biométrico y sistema de extinción central.'
        }
      ],
      operational: {
        actividadesAdministrativas: true,
        actividadesOperativas: false,
        actividadesProductivas: false,
        actividadesComerciales: true,
        actividadesLogisticas: false,
        actividadesMantenimiento: false,
        trabajoEnCampo: false,
        trabajoInstalacionesTerceros: false,
        trabajoViaPublica: false,
        distribucion: false,
        transporte: false,
        desplazamientosLaborales: false
      },
      highRisk: {
        trabajoAlturas: false,
        espaciosConfinados: false,
        manejoSustanciasQuimicas: false,
        manejoMaquinaria: false,
        manejoEquipos: false,
        actividadesMantenimientoCritico: false,
        trabajoNocturno: false,
        viajesLaboralesFrecuentes: false,
        otrasActividadesCriticas: 'Ninguna'
      },
      workforceExposure: {
        trabajadoresEnAlturas: 0,
        trabajadoresEnConfinados: 0,
        trabajadoresEnManejoQuimicos: 0,
        trabajadoresOperadoresMaquinaria: 0,
        trabajadoresConductores: 0,
        trabajadoresEnViaPublica: 0,
        trabajadoresEnCampo: 0,
        trabajadoresEnActividadesAltoRiesgo: 0
      },
      sst: {
        claseRiesgoArl: 1,
        tieneCopasstOVigia: 'VIGIA',
        tieneComiteConvivencia: true,
        tieneBrigadaEmergencia: true,
        tieneExamenesMedicosOcupacionales: true,
        tieneMatrizPeligrosGtc45: true,
        peligrosIdentificados: ['Biomecánico por pantallas y postura sedente', 'Psicosocial por carga laboral'],
        accidentalidadUltimoAno: 0,
        enfermedadesLaboralesUltimoAno: 0,
        responsableSstAsignado: true
      },
      environmental: {
        generaResiduosOrdinarios: true,
        generaResiduosAprovechables: true,
        generaResiduosPeligrosos: false, // DEMUESTRA CONDICIONAL RESPEL APAGADO
        generaRaee: true,
        generaManejaBaterias: false,
        generaAceitesUsados: false,
        manejaSustanciasQuimicasAmb: false,
        utilizaCombustibles: false,
        consumeAgua: true,
        fuenteAgua: 'RED_PUBLICA',
        generaVertimientos: false, // DEMUESTRA VERTIMIENTOS APAGADO
        generaEmisionesAtmosfericas: false,
        generaRuidoAmbiental: false,
        tieneProcesosProductivos: false,
        tieneMaquinariaIndustrial: false,
        tieneAlmacenamientoSustancias: false,
        tieneAlmacenamientoResiduos: false,
        tieneObligacionesPosconsumo: false,
        tienePermisosAmbientales: false,
        tieneLicenciasAmbientales: false,
        tieneRegistrosReportesAmbientales: false,
        impactosAmbientalesSignificativos: 'Consumo menor de energía y papel de oficina.'
      },
      pesv: {
        utilizaVehiculosParaActividades: false // DEMUESTRA GATEKEEPER APAGADO
      },
      iso: {
        tieneIso9001: true,
        tieneIso14001: false,
        tieneIso45001: false,
        tieneSistemaIntegrado: false,
        estaImplementandoAlgunaNorma: false,
        normasEnImplementacion: [],
        estaCertificada: true,
        deseaCertificarse: false,
        normasDeInteres: ['ISO 9001:2015'],
        noTieneSistemasIso: false
      }
    }
  },
  {
    id: 'archetype-construccion',
    name: 'Constructora de Obras Civiles & Alturas',
    description: '85 trabajadores, Riesgo V, labores críticas en alturas y excavaciones, 12 vehículos de apoyo en obra, residuos de construcción (RCD).',
    badge: '60 Estándares • Riesgo V • Alturas Críticas • PESV Básico',
    template: {
      identification: {
        razonSocial: 'Ingeniería & Construcciones del Caribe S.A.',
        nombreComercial: 'IngeCaribe',
        nit: '800.234.567-9',
        tipoOrganizacion: 'SA',
        sectorEconomico: 'CONSTRUCCION',
        actividadEconomicaPrincipal: 'Construcción de edificios residenciales y obras de infraestructura vial',
        actividadesSecundarias: 'Movimiento de tierras y pilotaje',
        codigoCiiu: '4111',
        descripcionActividades: 'Construcción de proyectos de vivienda multifamiliar y obras civiles en Barranquilla y Cartagena.',
        representanteLegal: 'Ing. Rodrigo Echeverry',
        ciudad: 'Barranquilla',
        departamento: 'Atlántico',
        telefono: '(+57 605) 368-9000',
        emailContacto: 'hseq@ingecaribe.com.co'
      },
      size: {
        totalTrabajadores: 85,
        trabajadoresDirectos: 45,
        contratistas: 35,
        temporales: 5,
        aprendicesPracticantes: 2,
        numeroSedes: 3,
        numeroCentrosTrabajo: 3,
        tieneTurnos: true,
        tieneTrabajoNocturno: false,
        tieneTrabajadoresRemotos: false,
        tieneTrabajadoresHibridos: false,
        tieneTrabajadoresEnCampo: true
      },
      operational: {
        actividadesAdministrativas: true,
        actividadesOperativas: true,
        actividadesProductivas: true,
        actividadesComerciales: false,
        actividadesLogisticas: true,
        actividadesMantenimiento: true,
        trabajoEnCampo: true,
        trabajoInstalacionesTerceros: true,
        trabajoViaPublica: true,
        distribucion: false,
        transporte: true,
        desplazamientosLaborales: true
      },
      highRisk: {
        trabajoAlturas: true,
        detallesAlturas: {
          frecuencia: 'DIARIA',
          alturaMaximaMetros: 28.0,
          personalCertificado: true,
          sistemasProteccionCaidas: true
        },
        espaciosConfinados: true,
        detallesConfinados: {
          tiposEspacios: 'Zanjas de alcantarillado mayores a 1.5m y pozos de inspección',
          medicionAtmosfera: true,
          procedimientoRescate: true
        },
        manejoSustanciasQuimicas: true,
        detallesQuimicos: {
          tiposQuimicos: 'Aditivos para concreto, desmoldantes, solventes y combustibles',
          almacenamientoEspecializado: true,
          hojasSeguridadSga: true,
          kitAntiderrame: true
        },
        manejoMaquinaria: true,
        detallesMaquinaria: {
          tipos: ['TORRE_GRUA', 'RETROEXCAVADORA', 'MINICARGADOR', 'MEZCLADORA_TROMPO'],
          mantenimientoPreventivo: true
        },
        manejoEquipos: true,
        actividadesMantenimientoCritico: true,
        trabajoNocturno: false,
        viajesLaboralesFrecuentes: false,
        otrasActividadesCriticas: 'Izaje crítico de cargas pesadas y vaciado de losas a gran altura.'
      },
      workforceExposure: {
        trabajadoresEnAlturas: 42,
        trabajadoresEnConfinados: 8,
        trabajadoresEnManejoQuimicos: 14,
        trabajadoresOperadoresMaquinaria: 10,
        trabajadoresConductores: 12,
        trabajadoresEnViaPublica: 25,
        trabajadoresEnCampo: 72,
        trabajadoresEnActividadesAltoRiesgo: 48
      },
      sst: {
        claseRiesgoArl: 5,
        tieneCopasstOVigia: 'COPASST',
        tieneComiteConvivencia: true,
        tieneBrigadaEmergencia: true,
        tieneExamenesMedicosOcupacionales: true,
        tieneMatrizPeligrosGtc45: true,
        peligrosIdentificados: ['Caídas a distinto nivel', 'Atrapamiento en zanjas', 'Aplastamiento por maquinaria', 'Ruido y polvo de sílice'],
        accidentalidadUltimoAno: 4,
        enfermedadesLaboralesUltimoAno: 0,
        responsableSstAsignado: true
      },
      environmental: {
        generaResiduosOrdinarios: true,
        generaResiduosAprovechables: true,
        generaResiduosPeligrosos: true,
        detallesRespel: {
          tiposResiduos: ['Envases con restos de aditivos químicos', 'Solventes sucios', 'Filtros y mangueras hidráulicas'],
          volumenKgMes: 180,
          clasificacionGenerador: 'PEQUENO',
          almacenamientoDedicado: true,
          diquesContencion: true,
          transporteAutorizado: true,
          gestorAutorizado: 'Caribe Ambiental S.A.S.',
          cuentaConCertificadosDisposicion: true
        },
        generaRaee: false,
        generaManejaBaterias: true,
        generaAceitesUsados: true,
        detallesAceitesUsados: {
          volumenGalonesMes: 45,
          puntoAcopioCertificado: true,
          gestorCertificado: 'Caribe Ambiental'
        },
        manejaSustanciasQuimicasAmb: true,
        utilizaCombustibles: true,
        detallesCombustibles: {
          tipos: ['DIESEL', 'GASOLINA'],
          consumoPromedioMensual: '1.800 Galones Diesel para maquinaria',
          tanquesAlmacenamiento: true
        },
        consumeAgua: true,
        fuenteAgua: 'CARROTANQUE',
        generaVertimientos: false,
        generaEmisionesAtmosfericas: false,
        generaRuidoAmbiental: true,
        tieneProcesosProductivos: true,
        tieneMaquinariaIndustrial: true,
        tieneAlmacenamientoSustancias: true,
        tieneAlmacenamientoResiduos: true,
        tieneObligacionesPosconsumo: false,
        tienePermisosAmbientales: true,
        detallesPermisos: {
          listaPermisos: ['Plan de Manejo Ambiental de Obra (PMA)', 'Permiso de Ocupación de Cauce'],
          vigencias: 'Durante ejecución del proyecto (2026-2027)'
        },
        tieneLicenciasAmbientales: false,
        tieneRegistrosReportesAmbientales: true,
        impactosAmbientalesSignificativos: 'Generación de material particulado (polvo), ruido de maquinaria y escombros (RCD).'
      },
      pesv: {
        utilizaVehiculosParaActividades: true,
        detallesPesv: {
          misionOrganizacional: 'APOYO_NO_TRANSPORTE',
          numeroVehiculosTotal: 12,
          vehiculosPropios: 8,
          vehiculosArrendados: 4,
          vehiculosContratados: 0,
          vehiculosTerceros: 0,
          numeroConductoresTotal: 12,
          conductoresDirectos: 8,
          conductoresContratistas: 4,
          tiposFlota: {
            motocicletas: 2,
            vehiculosLivianos: 6,
            vehiculosPesados: 4,
            maquinariaAmarilla: 3
          },
          operaciones: {
            transportePasajeros: false,
            transporteMercancias: true,
            distribucionUrbana: false,
            mensajeria: false,
            transporteSustanciasPeligrosas: false,
            desplazamientosLaborales: true
          },
          frecuenciaUtilizacion: 'DIARIA',
          areaGeograficaOperacion: 'REGIONAL'
        }
      },
      iso: {
        tieneIso9001: true,
        tieneIso14001: false,
        tieneIso45001: true,
        tieneSistemaIntegrado: true,
        estaImplementandoAlgunaNorma: false,
        normasEnImplementacion: [],
        estaCertificada: true,
        deseaCertificarse: true,
        normasDeInteres: ['ISO 9001:2015', 'ISO 45001:2018'],
        noTieneSistemasIso: false
      }
    }
  }
];

// ==============================================================
// 3. BITÁCORA INICIAL DE DECISIONES DE VALIDACIÓN Y NO APLICABILIDAD
// ==============================================================
export const initialValidationDecisions: ValidationDecision[] = [
  {
    id: 'val-001',
    requirementId: 'req-sst-confinados',
    requirementCode: 'RES-0491-2020',
    requirementTitle: 'Gestión y Seguridad en Espacios Confinados',
    initialAgaeResult: 'NO_APLICA',
    finalDecision: 'ACEPTADO',
    justification: 'La organización no cuenta con silos, tanques de almacenamiento subterráneo ni galerías subterráneas que clasifiquen como espacios confinados según la Resolución 0491 de 2020.',
    variablesSnapshot: { espacios_confinados: false, tipos: 'Ninguno' },
    userName: 'Marcela Rincón',
    userRole: 'Directora HSEQ',
    timestamp: '2026-03-02 11:15',
    evidenceNotes: 'Inspección locativa general de las sedes Fontibón y Medellín adjunta en informe de caracterización.',
    legalSustain: 'Resolución 0491 de 2020 Artículo 3 Ámbito de Aplicación'
  },
  {
    id: 'val-002',
    requirementId: 'req-amb-emisiones',
    requirementCode: 'RES-0909-2008',
    requirementTitle: 'Permiso y Control de Emisiones Atmosféricas en Fuentes Fijas',
    initialAgaeResult: 'NO_APLICA',
    finalDecision: 'ACEPTADO',
    justification: 'Las sedes operativas no poseen calderas de vapor, hornos de fundición ni incineradores. Solo se cuenta con planta de emergencia de 45 kVA de uso exclusivo en cortes de energía con menos de 100 horas de operación anual, excluida de permiso.',
    variablesSnapshot: { tiene_emisiones: false, fuentes_fijas: false },
    userName: 'Ing. Julián Torres',
    userRole: 'Especialista Ambiental',
    timestamp: '2026-03-02 11:45',
    evidenceNotes: 'Ficha técnica de planta eléctrica Cummins 45kVA y bitácora de horómetro 2025.',
    legalSustain: 'Decreto 1076 de 2015 Artículo 2.2.5.1.7.2 Fuentes fijas exentas'
  },
  {
    id: 'val-003',
    requirementId: 'req-pesv-quimicos',
    requirementCode: 'DEC-1079-MERCANCIAS-PELIGROSAS',
    requirementTitle: 'Transporte de Mercancías Peligrosas',
    initialAgaeResult: 'NO_APLICA',
    finalDecision: 'MODIFICADO',
    justification: 'Se valida que la empresa transporta carga general seca. El movimiento ocasional de lubricantes se realiza en cantidades limitadas (menores a 1.000 kg en embalajes certificados) para consumo propio del taller, no como servicio comercial de carga peligrosa.',
    variablesSnapshot: { transporte_quimicos: false, carga_general: true },
    userName: 'Carlos Mendoza',
    userRole: 'Supervisor de Operaciones y Flota',
    timestamp: '2026-03-03 14:20',
    evidenceNotes: 'Póliza de transporte y manifiestos de carga del RNDC demostrando tipo de mercancía seca.',
    legalSustain: 'Decreto 1079 de 2015 Artículo 2.2.1.7.8.2 Cantidades limitadas'
  }
];

// ==============================================================
// 4. HISTORIAL DE VERSIONES DE CARACTERIZACIÓN (Re-caracterización)
// ==============================================================
export const initialCharacterizationHistory: CharacterizationVersion[] = [
  {
    version: 1,
    timestamp: '2025-11-15 10:00',
    author: 'Marcela Rincón (Líder HSEQ)',
    reason: 'Caracterización inicial preventiva previa a la adquisición de la plataforma AGAE.',
    variablesSnapshot: {
      ...defaultCompanyCharacterization.structuredVariables,
      numero_trabajadores: 110,
      numero_sedes: 1,
      total_vehiculos: 18,
      respel_kg_mes: 290
    },
    impactedModules: ['SST', 'PESV', 'ENVIRONMENTAL'],
    changesSummary: [
      'Registro inicial de la organización en fase preventa',
      'Configuración para 110 trabajadores y Sede Fontibón',
      'Flota inicial de 18 vehículos de carga'
    ]
  },
  {
    version: 2,
    timestamp: '2026-03-01 09:00',
    author: 'Marcela Rincón (Líder HSEQ)',
    reason: 'Apertura del nuevo Hub Regional Guayabal en Medellín e incremento de flota con 8 nuevas unidades.',
    variablesSnapshot: defaultCompanyCharacterization.structuredVariables,
    impactedModules: ['SST', 'PESV', 'ENVIRONMENTAL'],
    changesSummary: [
      'Aumento de trabajadores de 110 a 142 colaboradores (+32 trabajadores)',
      'Incorporación de la Sede 2: Hub Regional Guayabal (Medellín)',
      'Flota incrementada de 18 a 26 vehículos automotores',
      'PESV ratificado en Nivel AVANZADO (24 Pasos)',
      'Ajuste en volumen de generación de RESPEL a 480 kg/mes por nuevo taller'
    ]
  }
];
