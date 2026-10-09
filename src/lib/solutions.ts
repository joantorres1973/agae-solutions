import {
  HardHat, Leaf, TrafficCone, ChartColumnIncreasing, Cog, ClipboardList, Users, ChartColumn, UsersRound, Heart,
  ShieldCheck, Earth, Recycle, FileCheck2, Settings, FileText, Search, Car, Route, FileChartColumn, Puzzle,
  RefreshCcwDot, Globe, Award,
  type LucideIcon,
} from 'lucide-react';

/**
 * Contenido de las páginas de soluciones (/soluciones/<slug>/).
 * Edita aquí los textos de cada página: el menú, las tarjetas del inicio
 * y las páginas de detalle se generan a partir de esta lista.
 */
export interface Solution {
  slug: string;
  title: string;
  /** Frase corta usada en las tarjetas del inicio. */
  description: string;
  icon: LucideIcon;
  /** Clases Tailwind de color de la solución. */
  gradient: string;
  bar: string;
  text: string;
  soft: string;
  /** Contenido de la página de detalle. */
  headline: string;
  intro: string;
  services: { title: string; description: string }[];
  regulations: string[];
  benefits: string[];
  /** Diseño ampliado de la parte inicial de la página (opcional). */
  showcase?: SolutionShowcase;
}

export interface SolutionShowcase {
  /** Título en dos líneas: la primera va en el color de la solución. */
  titleLines: [string, string];
  /** Línea pequeña bajo el título (opcional), p. ej. la norma principal. */
  subtitle?: string;
  /** Frase en dos partes: la segunda va resaltada. */
  tagline: [string, string];
  intro: string;
  /** Fila de normas destacadas bajo la introducción (opcional). */
  standards?: string[];
  /** Recuadro de aviso bajo la introducción (opcional). */
  notice?: { title: string; text: string; icon: LucideIcon };
  heroImage: string;
  /** Color principal (hex) y su tono oscuro para degradados. */
  color: string;
  colorDark: string;
  offerings: {
    title: string;
    description: string;
    icon: LucideIcon;
    /** Color del ícono y detalles (hex). */
    color: string;
    /** Color de fondo de la tarjeta (hex). */
    tint: string;
    image: string;
  }[];
  closing: {
    /** Frase de cierre: lead + emphasis (resaltado) + trail. */
    lead: string;
    emphasis: string;
    trail?: string;
    icon: LucideIcon;
    highlights: { label: string; sublabel?: string; icon: LucideIcon; color?: string }[];
    /** 'statement-first' (por defecto) o 'highlights-first' (frase al final, más grande). */
    layout?: 'statement-first' | 'highlights-first';
  };
}

export const solutions: Solution[] = [
  {
    slug: 'seguridad-salud-trabajo',
    title: 'Seguridad y Salud en el Trabajo',
    description: 'Entornos laborales más seguros y productivos.',
    icon: HardHat,
    gradient: 'from-[#2bb3c0] to-[#0e6f86]',
    bar: 'bg-[#1592a5]',
    text: 'text-[#0e7c8f]',
    soft: 'bg-[#e6f6f8]',
    headline: 'Diseñamos, implementamos y mantenemos tu SG-SST',
    intro:
      'Acompañamos a tu organización en el cumplimiento del Sistema de Gestión de Seguridad y Salud en el Trabajo, protegiendo a tus trabajadores y fortaleciendo la productividad.',
    services: [
      { title: 'Diseño e implementación del SG-SST', description: 'Estructuramos el sistema de acuerdo con el tamaño y el nivel de riesgo de tu empresa.' },
      { title: 'Evaluación de estándares mínimos', description: 'Autoevaluación de 7, 21 o 60 estándares y plan de mejoramiento.' },
      { title: 'Matriz de peligros y riesgos', description: 'Identificación de peligros y valoración de riesgos bajo la GTC 45.' },
      { title: 'Comités y capacitación', description: 'Acompañamiento al COPASST, Comité de Convivencia y plan anual de capacitación.' },
    ],
    regulations: ['Decreto 1072 de 2015', 'Resolución 0312 de 2019', 'GTC 45', 'ISO 45001:2018'],
    benefits: [
      'Reducción de accidentes y enfermedades laborales',
      'Cumplimiento legal ante el Ministerio del Trabajo y la ARL',
      'Trabajadores más comprometidos y productivos',
    ],
    showcase: {
      titleLines: ['Seguridad y salud', 'en el trabajo'],
      tagline: ['Protegemos a tu equipo, ', 'fortalecemos tu empresa.'],
      intro:
        'En AGAE SOLUTIONS acompañamos a las organizaciones en la gestión de su SG-SST, ofreciendo soluciones prácticas y adaptadas a sus necesidades, para promover entornos de trabajo seguros, saludables y productivos.',
      heroImage: '/soluciones/sst/hero.webp',
      color: '#0f7f86',
      colorDark: '#0e5d73',
      offerings: [
        {
          title: 'Gestión integral',
          description: 'Tercerización y administración completa del SG-SST.',
          icon: Cog, color: '#137f8a', tint: '#eff6f8', image: '/soluciones/sst/gestion.webp',
        },
        {
          title: 'Consultoría & documentación',
          description: 'Asesoría especializada y fortalecimiento documental.',
          icon: ClipboardList, color: '#6cb33f', tint: '#f6f8f6', image: '/soluciones/sst/consultoria.webp',
        },
        {
          title: 'Formación & cultura',
          description: 'Capacitaciones, talleres lúdicos y experiencias de aprendizaje.',
          icon: Users, color: '#e46c45', tint: '#fcf4f0', image: '/soluciones/sst/formacion.webp',
        },
        {
          title: 'Auditoría & mejora',
          description: 'Evaluación, auditoría, identificación de brechas y planes de mejora.',
          icon: ChartColumn, color: '#3f5d74', tint: '#f0f5f7', image: '/soluciones/sst/auditoria.webp',
        },
      ],
      closing: {
        lead: 'Un SG-SST no es solo cumplir.',
        emphasis: 'Es prevenir, proteger y mejorar.',
        icon: ShieldCheck,
        highlights: [
          { label: 'Personas seguras', icon: UsersRound },
          { label: 'Ambientes saludables', icon: Heart },
          { label: 'Empresas más fuertes', icon: ChartColumnIncreasing },
        ],
      },
    },
  },
  {
    slug: 'gestion-ambiental',
    title: 'Gestión Ambiental',
    description: 'Organizaciones responsables con el entorno.',
    icon: Leaf,
    gradient: 'from-[#a5d65a] to-[#4c9a2a]',
    bar: 'bg-[#4c8a2a]',
    text: 'text-[#4c9a2a]',
    soft: 'bg-[#eef7e6]',
    headline: 'Gestión ambiental que cumple y genera valor',
    intro:
      'Te ayudamos a identificar, controlar y reducir los impactos ambientales de tu operación, cumpliendo la normatividad y avanzando hacia la sostenibilidad.',
    services: [
      { title: 'Matriz de aspectos e impactos', description: 'Identificación y valoración de los aspectos ambientales de tu actividad.' },
      { title: 'Gestión de residuos y RESPEL', description: 'Plan de gestión integral de residuos y trazabilidad de residuos peligrosos.' },
      { title: 'Huella de carbono', description: 'Cálculo de emisiones de alcance 1, 2 y 3 y plan de reducción.' },
      { title: 'Permisos y requisitos legales', description: 'Seguimiento a permisos, vertimientos, emisiones y reportes ambientales.' },
    ],
    regulations: ['Decreto 1076 de 2015', 'ISO 14001:2015', 'Decreto 4741 de 2005 (RESPEL)'],
    benefits: [
      'Menor riesgo de sanciones ambientales',
      'Uso eficiente de recursos y reducción de costos',
      'Mejor reputación ante clientes y comunidades',
    ],
    showcase: {
      titleLines: ['Gestión', 'ambiental'],
      tagline: ['Transformamos el cumplimiento ambiental en ', 'gestión sostenible.'],
      intro:
        'En AGAE SOLUTIONS acompañamos a las organizaciones en la gestión de sus aspectos e impactos ambientales, ofreciendo soluciones prácticas y adaptadas a sus necesidades.',
      heroImage: '/soluciones/ambiental/hero.webp',
      color: '#5a9e2f',
      colorDark: '#3d7f22',
      offerings: [
        {
          title: 'Gestión ambiental integral',
          description: 'Diseño, implementación y seguimiento de la gestión ambiental.',
          icon: Leaf, color: '#137f8a', tint: '#eff7f9', image: '/soluciones/ambiental/gestion.webp',
        },
        {
          title: 'Residuos & PGIRASA',
          description: 'PGIRS, PGIRASA y gestión integral de residuos.',
          icon: Recycle, color: '#6cb33f', tint: '#f6f9f2', image: '/soluciones/ambiental/residuos.webp',
        },
        {
          title: 'Cumplimiento & consultoría',
          description: 'Matriz legal, requisitos ambientales, permisos y asesoría especializada.',
          icon: FileCheck2, color: '#e46c45', tint: '#fdf5f0', image: '/soluciones/ambiental/cumplimiento.webp',
        },
        {
          title: 'Formación & cultura ambiental',
          description: 'Capacitaciones, talleres y estrategias de sensibilización para promover buenas prácticas ambientales.',
          icon: Users, color: '#6cb33f', tint: '#f3f8ee', image: '/soluciones/ambiental/formacion.webp',
        },
      ],
      closing: {
        lead: 'Gestionar el ambiente no es solo cumplir.',
        emphasis: 'Es prevenir, optimizar y generar valor.',
        icon: Earth,
        highlights: [
          { label: 'Organizaciones más responsables', icon: Leaf },
          { label: 'Recursos optimizados', icon: Settings },
          { label: 'Cumplimiento fortalecido', icon: ChartColumnIncreasing },
        ],
      },
    },
  },
  {
    slug: 'seguridad-vial',
    title: 'Seguridad Vial',
    description: 'Movilidad segura para un mejor futuro.',
    icon: TrafficCone,
    gradient: 'from-[#f59e5b] to-[#e0612a]',
    bar: 'bg-[#ee7a3a]',
    text: 'text-[#e0612a]',
    soft: 'bg-[#fdf0e8]',
    headline: 'Tu Plan Estratégico de Seguridad Vial (PESV) sin complicaciones',
    intro:
      'Diseñamos e implementamos el PESV de tu organización para prevenir siniestros viales y proteger a tus conductores, vehículos y comunidad.',
    services: [
      { title: 'Diseño e implementación del PESV', description: 'Metodología de pasos de la Resolución 40595 según el nivel de tu organización.' },
      { title: 'Inspecciones preoperacionales', description: 'Listas de chequeo diarias y control de hallazgos de vehículos.' },
      { title: 'Gestión de conductores', description: 'Idoneidad, capacitación y seguimiento de comportamientos en la vía.' },
      { title: 'Mantenimiento de flota', description: 'Programa de mantenimiento preventivo y correctivo de vehículos.' },
    ],
    regulations: ['Ley 1503 de 2011', 'Resolución 40595 de 2022', 'Ley 2050 de 2020'],
    benefits: [
      'Menos siniestros e incidentes viales',
      'Cumplimiento ante la Superintendencia de Transporte',
      'Flota más eficiente y con menos costos imprevistos',
    ],
    showcase: {
      titleLines: ['Seguridad vial', 'PESV'],
      subtitle: 'Resolución 40595 de 2022',
      tagline: ['Movilidad segura, empresas ', 'más responsables.'],
      intro:
        'En AGAE SOLUTIONS acompañamos a las organizaciones en la gestión de la seguridad vial, fortaleciendo la prevención de siniestros y el cumplimiento de los requisitos aplicables.',
      heroImage: '/soluciones/vial/hero.webp',
      color: '#e0662f',
      colorDark: '#c24f22',
      offerings: [
        {
          title: 'Gestión integral del PESV',
          description: 'Diseño, implementación y seguimiento del PESV, de acuerdo con el nivel de aplicación de cada organización.',
          icon: FileText, color: '#137f8a', tint: '#eff7fa', image: '/soluciones/vial/gestion.webp',
        },
        {
          title: 'Diagnóstico & cumplimiento',
          description: 'Evaluación del PESV, identificación de brechas y acompañamiento para el cumplimiento de requisitos.',
          icon: Search, color: '#6cb33f', tint: '#f6faf6', image: '/soluciones/vial/diagnostico.webp',
        },
        {
          title: 'Formación & cultura vial',
          description: 'Capacitaciones, campañas y talleres lúdicos para promover comportamientos seguros en la vía.',
          icon: Users, color: '#e46c45', tint: '#fef6f3', image: '/soluciones/vial/formacion.webp',
        },
        {
          title: 'Seguimiento & mejora',
          description: 'Indicadores, inspecciones, seguimiento a acciones y evaluación del desempeño en seguridad vial.',
          icon: ChartColumn, color: '#3f5d74', tint: '#f2f6f9', image: '/soluciones/vial/seguimiento.webp',
        },
      ],
      closing: {
        lead: 'La seguridad vial no empieza en la carretera.',
        emphasis: 'Empieza con una organización que decide prevenir.',
        icon: Route,
        highlights: [
          { label: 'Conductores seguros', icon: Car },
          { label: 'Movilidad responsable', icon: Route },
          { label: 'Gestión preventiva', icon: ChartColumnIncreasing },
        ],
      },
    },
  },
  {
    slug: 'sistemas-iso',
    title: 'Sistemas ISO',
    description: 'Estandarización para el crecimiento sostenible.',
    icon: ChartColumnIncreasing,
    gradient: 'from-[#a77be6] to-[#6a3fc4]',
    bar: 'bg-[#7c4ad6]',
    text: 'text-[#6a3fc4]',
    soft: 'bg-[#f3edfc]',
    headline: 'Sistemas de gestión ISO integrados y listos para certificar',
    intro:
      'Implementamos sistemas de gestión bajo estándares internacionales, de forma integrada, para que tu empresa trabaje con procesos claros y medibles.',
    services: [
      { title: 'ISO 9001 – Calidad', description: 'Procesos orientados al cliente y a la mejora continua.' },
      { title: 'ISO 14001 – Ambiental', description: 'Sistema de gestión ambiental alineado con tu operación.' },
      { title: 'ISO 45001 – Seguridad y salud', description: 'Gestión de la seguridad y salud en el trabajo bajo estándar internacional.' },
      { title: 'Auditorías internas', description: 'Preparación para la certificación y gestión de no conformidades.' },
    ],
    regulations: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 19011:2018 (auditorías)'],
    benefits: [
      'Acceso a nuevos clientes y licitaciones',
      'Procesos estandarizados y eficientes',
      'Un solo sistema integrado en lugar de tres',
    ],
    showcase: {
      titleLines: ['Sistemas de', 'gestión ISO'],
      tagline: ['Sistemas que se integran, ', 'organizaciones que evolucionan.'],
      intro:
        'En AGAE SOLUTIONS acompañamos a las organizaciones en el diseño, implementación, mantenimiento, auditoría y mejora de sus sistemas de gestión bajo estándares internacionales.',
      standards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
      notice: {
        title: 'En actualización permanente:',
        text: 'Actualmente nos encontramos actualizando nuestras metodologías y servicios frente a las nuevas ediciones y procesos de transición de las normas ISO 2026.',
        icon: RefreshCcwDot,
      },
      heroImage: '/soluciones/iso/hero.webp',
      color: '#6b3fa0',
      colorDark: '#4b2a85',
      offerings: [
        {
          title: 'Implementación & fortalecimiento',
          description: 'Diseño, implementación y mejora de sistemas de gestión ISO.',
          icon: FileChartColumn, color: '#6b3fa0', tint: '#f5f1fa', image: '/soluciones/iso/implementacion.webp',
        },
        {
          title: 'Integración de sistemas',
          description: 'Articulación de Calidad, Ambiental y SST bajo un enfoque integrado.',
          icon: Puzzle, color: '#3f5d74', tint: '#f0f7f9', image: '/soluciones/iso/integracion.webp',
        },
        {
          title: 'Auditoría & evaluación',
          description: 'Auditorías internas, diagnóstico de cumplimiento, identificación de hallazgos y oportunidades de mejora.',
          icon: Search, color: '#e46c45', tint: '#fff6f4', image: '/soluciones/iso/auditoria.webp',
        },
        {
          title: 'Transición & actualización',
          description: 'Acompañamiento en la actualización de los sistemas frente a cambios y nuevas ediciones de las normas ISO.',
          icon: ChartColumnIncreasing, color: '#6cb33f', tint: '#f4f9ee', image: '/soluciones/iso/transicion.webp',
        },
      ],
      closing: {
        lead: 'Acompañamos la ',
        emphasis: 'evolución',
        trail: ' de tu sistema de gestión.',
        icon: Globe,
        layout: 'highlights-first',
        highlights: [
          { label: 'ISO 9001', sublabel: 'Gestión de la Calidad', icon: Award, color: '#0f2453' },
          { label: 'ISO 14001', sublabel: 'Gestión Ambiental', icon: Leaf, color: '#6cb33f' },
          { label: 'ISO 45001', sublabel: 'Seguridad y Salud en el Trabajo', icon: HardHat, color: '#e46c45' },
        ],
      },
    },
  },
];

export const getSolution = (slug: string) => solutions.find(s => s.slug === slug);

export const solutionHref = (slug: string) => `/soluciones/${slug}/`;
