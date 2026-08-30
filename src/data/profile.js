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
    'retrato temporal de Alexis Hernández — ilustración del personaje 2-D de Gorillaz',
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
  headingParts: ['Hola, soy Alexis — estudiante y futuro ', 'analista programador', '.'],
  paragraphs: [
    'Estudio Programación y Análisis de Sistemas en el Instituto Profesional AIEP. Me apasiona entender cómo funcionan las cosas y construir soluciones que simplifiquen la vida de las personas.',
    'Soy una persona curiosa por naturaleza: siempre leyendo artículos de tecnología, siguiendo el acontecer internacional y explorando GitHub en busca de librerías y proyectos interesantes para probar e inspirarme.',
  ],
  signature: '$ whoami → dev en construcción ∎',
};

/** // 02 stack — grouped technologies, rendered as the mono-charts bars section. */
export const stack = [
  { group: 'Lenguajes', items: ['C#', 'Python', 'JavaScript', 'PHP', 'Ruby', 'SQL', 'HTML/CSS', 'Dart'] },
  { group: 'Frameworks', items: ['.NET', 'React', 'Next.js', 'Ruby on Rails', 'Flutter', 'Tailwind'] },
  { group: 'Datos', items: ['MySQL', 'PostgreSQL', 'Oracle'] },
  { group: 'Herramientas', items: ['Git', 'Linux', 'Vercel', 'Figma'] },
];

/** Activity heatmap seed (deterministic pseudo-random walk, no runtime deps). */
export const activitySeed = 20260824;

/** // 04 projects — RGIVCodice spans full width; Blackstone is a private study repo. */
export const projects = [
  {
    id: 'rgivcodice',
    num: '01',
    title: 'Gestor de Alumnos · RGIVCodice',
    description: 'Sistema de gestión académica con módulos de notas, asistencia e informes.',
    tech: ['C#', '.NET', 'MySQL'],
    repo: 'https://github.com/AlexisHCD/RGIVCodice',
    featured: true,
  },
  {
    id: 'erp-reloj',
    num: '02',
    title: 'ERP Reloj Control',
    description: 'App móvil de control horario conectada a API C#. Proyecto colaborativo.',
    tech: ['Flutter', 'Dart', 'C#'],
    repo: 'https://github.com/Ansesies',
    featured: false,
  },
  {
    id: 'rb6-lite-manager',
    num: '03',
    title: 'RB6 Lite Manager',
    description: 'Herramienta Python para gestión de dispositivos Bluetooth en escritorio Linux.',
    tech: ['Python', 'PySide6', 'BlueZ'],
    repo: 'https://github.com/AlexisHCD/RB6_lite_Manager',
    featured: false,
  },
  {
    id: 'blackstone',
    num: '04',
    title: 'Blackstone',
    description: 'Proyecto de estudio: página web fullstack construida con PHP y Ruby on Rails.',
    tech: ['PHP', 'Ruby on Rails', 'Fullstack'],
    repo: 'https://github.com/AlexisHCD/Blackstone',
    privateRepo: true,
    featured: false,
  },
];

/** // 05 roadmap — five semesters; currentSemester drives the fixed progress bar. */
export const roadmap = {
  career: 'Técnico de Nivel Superior en Programación y Análisis de Sistemas',
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
      ],
    },
    {
      n: 3,
      year: '2026',
      status: 'done',
      title: 'Sistemas & Web',
      courses: [
        'Programación Orientada a Objetos',
        'Sistemas Operativos · Linux',
        'Desarrollo Web Fullstack',
        'Análisis y Modelado de Sistemas',
      ],
    },
    {
      n: 4,
      year: '2026',
      status: 'current',
      title: 'Móviles & Calidad',
      courses: ['Apps Móviles · Flutter', 'Testing y Calidad de Software', 'Integración de Sistemas'],
    },
    {
      n: 5,
      year: '2027',
      status: 'next',
      title: 'Práctica & Titulación',
      courses: ['Práctica Laboral', 'Seminario de Titulación'],
    },
  ],
};

/** // 06 certificates — badge seal text + viewer ledger lines. */
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
  },
];

/** Footer + misc strings. */
export const footerNote = 'v2.0 · build-04 · alexdev_os';
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
