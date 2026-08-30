/**
 * profile.js — single source of truth for ALL site content (in Spanish).
 * The real app renders exclusively from this data; edit here, not in components.
 */

export const identity = {
  firstName: 'Alexis',
  lastName: 'Hernández',
  fullName: 'Alexis Hernández Camus',
  handle: 'guest@arch',
  brand: 'AlexDev_OS',
  role: 'futuro analista programador',
  tagline: 'programación & análisis de sistemas',
  location: {
    city: 'San Antonio',
    region: 'Región de Valparaíso',
    country: 'Chile',
    code: 'CL',
  },
  school: 'Instituto Profesional AIEP',
  email: 'adhcamus@gmail.com',
  photo: '/img/whoami.jpg', // placeholder portrait — replace with a real one
  cvHref: '/cv-alexis-hernandez.pdf',
  photoAlt:
    'retrato placeholder de Alexis Hernández — personaje 2-D de Gorillaz',
};

export const social = {
  github: 'https://github.com/AlexisHCD',
  githubUser: 'AlexisHCD',
  linkedin: 'https://www.linkedin.com/in/alexis-hern%C3%A1ndez-2b3017367',
  x: 'https://x.com/Mkeled',
  xUser: '@Mkeled',
};

/** Hero readout chips. */
export const mission = [
  { label: 'MISIÓN', value: 'FULLSTACK DEV' },
  { label: 'ESTADO', value: '4° SEMESTRE · S4/5' },
  { label: 'BASE', value: 'SAN ANTONIO, CL' },
];

export const about = {
  headingParts: ['Hola, soy Alexis — ', 'Estudiante de Análisis de Sistemas y Programación', '.'],
  paragraphs: [
    'Estudio Programación y Análisis de Sistemas en el Instituto Profesional AIEP. Me apasiona entender cómo funcionan las cosas y construir soluciones que simplifiquen la vida de las personas.',
    'Soy una persona curiosa por naturaleza: siempre leyendo artículos de tecnología, siguiendo el acontecer internacional y explorando GitHub en busca de librerías y proyectos interesantes para probar e inspirarme.',
  ],
  signature: '$ whoami → Desarrollador/Ciberseguridad ∎',
};

/** // 02 stack — grouped technologies, rendered as the mono-charts bars section. */
export const stack = [
  {
    group: 'lenguajes',
    items: ['C#', 'Python', 'JavaScript', 'PHP', 'Ruby', 'SQL', 'HTML5', 'CSS3', 'Dart'],
  },
  {
    group: 'frameworks & web',
    items: ['.NET', 'React', 'Next.js', 'Ruby on Rails', 'Flutter', 'Tailwind CSS'],
  },
  {
    group: 'datos',
    items: ['MySQL', 'PostgreSQL', 'Oracle', 'Modelado de datos', 'SQL'],
  },
  {
    group: 'herramientas & os',
    items: ['Git', 'GitHub', 'VS Code', 'Visual Studio', 'Linux · Ubuntu/Mint', 'Office 365'],
  },
];

/** Activity heatmap seed (deterministic pseudo-random walk, no runtime deps). */
export const activitySeed = 20260824;

/** // 04 projects — mockup SSOT: 5 cards; RGIVCodice spans full width (DESTACADO). */
export const projects = [
  {
    id: 'rgivcodice',
    num: '01',
    tag: 'DESTACADO',
    title: 'Gestor de Alumnos · Instituto Codice',
    description:
      'Aplicación monolítica de 4 capas para la gestión académica de alumnos, construida en C# .NET con base de datos MySQL. Mi proyecto más completo de arquitectura.',
    tech: ['C# .NET', 'MySQL', '4-capas'],
    repo: 'https://github.com/AlexisHCD/RGIVCodice',
    meta: 'github/AlexisHCD/RGIVCodice · ★ 1',
    featured: true,
  },
  {
    id: 'erp-reloj',
    num: '02',
    tag: 'GRUPO',
    title: 'ERP Reloj Control',
    description:
      'Sistema de asistencia con reloj control: frontend en Flutter/Dart y backend API en C# .NET + PostgreSQL. Proyecto de equipo.',
    tech: ['Flutter', 'C# API', 'PostgreSQL'],
    repo: 'https://github.com/Ansesies/proyecto-coef-2-frontend',
    meta: 'github/Ansesies · equipo',
    featured: false,
  },
  {
    id: 'rb6-lite-manager',
    num: '03',
    tag: 'PERSONAL',
    title: 'RB6 Lite Manager',
    description:
      'Gestor personal para Linux, desarrollado en Python como herramienta de uso diario.',
    tech: ['Python', 'Linux'],
    repo: 'https://github.com/AlexisHCD/RB6_lite_Manager',
    meta: 'github/AlexisHCD/RB6_lite_Manager · ★ 1',
    featured: false,
  },
  {
    id: 'blackstone',
    num: '04',
    tag: 'ESTUDIO',
    title: 'Blackstone',
    description: 'Proyecto de estudio: página web fullstack construida con PHP y Ruby on Rails.',
    tech: ['PHP', 'Ruby on Rails', 'Fullstack'],
    repo: 'https://github.com/AlexisHCD/Blackstone',
    meta: 'github/AlexisHCD/Blackstone · privado',
    privateRepo: true,
    featured: false,
  },
  {
    id: 'portfolio-v2',
    num: '05',
    tag: 'EN CONSTRUCCIÓN',
    title: 'Portfolio v2.0 · AlexDev_OS',
    description:
      'Este sitio: rework completo de mi portfolio con React, GSAP y Lenis — tipografía cinética, terminal interactiva, charts monocromáticos y scroll narrativo.',
    tech: ['React', 'GSAP', 'Tailwind'],
    repo: '#top',
    meta: 'v2.0 · 2026',
    featured: false,
  },
];

/** // 05 roadmap — five semesters; currentSemester drives the fixed progress bar. */
export const roadmap = {
  career: 'Técnico de Nivel Superior en Programación y Análisis de Sistemas',
  careerShort: 'Técnico en Programación y Análisis de Sistemas',
  totalSemesters: 5,
  currentSemester: 4,
  progressPercent: 70,
  sct: 120,
  semesters: [
    {
      n: 1,
      year: '2025',
      status: 'done',
      title: 'Fundamentos',
      courses: [
        'Fundamentos de Programación Computacional',
        'Matemática para la Ed. Superior',
        'Herramientas para la Empleabilidad',
        'Habilidades para la Comunicación',
      ],
    },
    {
      n: 2,
      year: '2025',
      status: 'done',
      title: 'Datos & Métodos',
      courses: [
        'Bases de Datos Relacionales · Oracle',
        'Taller de Bases de Datos',
        'Metodologías de Desarrollo',
        'Programación Segura',
        'Herramientas de IA',
        'Requerimientos y Modelos de Negocio',
      ],
    },
    {
      n: 3,
      year: '2026',
      status: 'done',
      title: 'Sistemas & Web',
      courses: [
        'Taller de Aplicaciones para Internet',
        'Taller de Análisis de Sistemas',
        'Modelamiento de Procesos de Negocios',
        'Sostenibilidad Organizacional',
        'Inglés Inicial I',
        'Cert. Especialidad I · AWS',
      ],
    },
    {
      n: 4,
      year: '2026',
      status: 'current',
      title: 'Preparación del TPE',
      courses: [
        'Taller de Aplicaciones Móviles',
        'Taller de Testing y Calidad de Software',
        'Taller de Proyecto de Especialidad',
        'Taller de Marca Personal',
        'Inglés Inicial II',
        'Cert. Especialidad II · CISCO',
      ],
    },
    {
      n: 5,
      year: '2027',
      status: 'next',
      title: 'Práctica Profesional',
      courses: [
        'Práctica Laboral',
        'Proceso de Titulación',
        '→ Técnico de Nivel Superior en Programación y Análisis de Sistemas',
      ],
    },
  ],
};

/** // 06 certificates — badge seal text + viewer ledger lines (mockup SSOT). */
export const certificates = [
  {
    id: 'aiep',
    issuer: 'AIEP',
    sealText: '· ASHOKA × AIEP ·',
    label: '// Herramientas para la Innovación',
    course: 'Herramientas para la Innovación',
    date: '16 de marzo de 2026',
    place: 'Santiago, Chile',
    orgLine: 'AIEP · Universidad Andrés Belllo',
    image: '/img/certs/cert-aiep.png',
    glyph: '✦',
    ledger: [
      '$ verify --cert aiep_hpi',
      'institución .... aiep · univ. andrés bello',
      'certificado .... herramientas para la innovación',
      'otorgado a ..... alexis demian hernández camus',
      'fecha .......... santiago, 16 marzo 2026',
      'programa ....... técnico en prog. y análisis de sistemas',
    ],
  },
  {
    id: 'google',
    issuer: 'GOOGLE',
    sealText: '· COURSERA × GOOGLE ·',
    label: '// Introducción a la IA - Google',
    course: 'Introduction to AI',
    platform: 'Coursera',
    date: '2 de julio de 2026',
    verifyId: 'MLVDDQHX5RF1',
    signedBy: 'Amanda Brophy — Global Director, Google Career Certificates',
    image: '/img/certs/cert-coursera.png',
    glyph: '◈',
    ledger: [
      '$ verify --cert coursera_mlvd',
      'plataforma ..... coursera',
      'curso .......... introduction to ai',
      'autorizado por . google',
      'otorgado a ..... alexis demian hernández',
      'fecha .......... 2 julio 2026',
      'verificación ... coursera.org/verify/MLVDDQHX5RF1',
    ],
  },
];

/** Footer + misc strings. */
export const footerNote = 'v2.0 · build-04 · alexdev_os';
export const footerCredit =
  'hecho a mano <span class="p">//</span> gsap + lenis + terminal · DOOM © id software, puerto <a href="https://github.com/raz0red/webprboom" target="_blank" rel="noopener" style="color:inherit">webprboom</a> (GPL)';
export const footerCopyright = '© ALEXIS HERNÁNDEZ CAMUS — SAN ANTONIO, CL';
export const doomCredit =
  'DOOM © id Software · port WASM webprboom (GPL) — ejecutado localmente en tu navegador';

/**
 * Contract test target: keeps the whole site honest.
 * Any content refactor that breaks these invariants is a bug.
 */
export const contract = {
  semesterCount: roadmap.totalSemesters,
  projectIds: projects.map((p) => p.id),
  certificateIds: certificates.map((c) => c.id),
};
