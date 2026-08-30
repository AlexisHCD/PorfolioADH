/**
 * legal.js — content SSOT for the legal pages (es-CL, Chile).
 * The site is a personal, non-commercial portfolio, so the copy is written
 * for that scope. Law links point to the official BCN texts as required.
 */

const LAW_19628 = {
  label: 'Ley N° 19.628 — Sobre Protección de la Vida Privada',
  href: 'https://www.bcn.cl/leychile/navegar?idNorma=29512',
};

const LAW_21719 = {
  label:
    'Ley N° 21.719 — Regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales',
  href: 'https://www.bcn.cl/leychile/navegar?idNorma=1209272',
};

export const legalDocs = {
  aviso: {
    num: 'L1',
    title: 'Aviso Legal',
    updated: '30 de agosto de 2026',
    sections: [
      {
        h: '// titular del sitio',
        p: [
          'Este sitio personal es titularidad de Alexis Hernández Camus, estudiante de Programación y Análisis de Sistemas, con domicilio en San Antonio, Región de Valparaíso, Chile. Contacto: adhcamus@gmail.com.',
          'El sitio no tiene fines comerciales: es un portafolio de evidencias académicas y proyectos personales.',
        ],
      },
      {
        h: '// objeto',
        p: [
          'El sitio presenta información sobre mi formación, proyectos, certificados y actividad de desarrollo, junto con herramientas interactivas (terminal, visor de certificados, gráficos de actividad) construidas con tecnologías de código abierto.',
        ],
      },
      {
        h: '// propiedad intelectual',
        p: [
          'Los textos, diseño y código del sitio son obra de su titular. El juego DOOM © id Software se ejecuta localmente en tu navegador a través del puerto de código abierto webprboom (licencia GPL), manteniendo el crédito correspondiente visible en el pie de página.',
          'Las marcas de terceros que aparecen (AIEP, Google, Coursera, AWS, Cisco y otras) pertenecen a sus respectivos titulares y se citan únicamente con fines informativos y de acreditación académica.',
        ],
      },
      {
        h: '// enlaces a sitios de terceros',
        p: [
          'El sitio enlaza a plataformas externas (GitHub, LinkedIn, X, Coursera) cuyo contenido y políticas de privacidad son ajenos al titular. No se garantiza ni se responsabiliza por la información publicada en dichos sitios.',
        ],
      },
      {
        h: '// funcionamiento y disponibilidad',
        p: [
          'El sitio es estático y puede modificarse, suspenderse o descontinuarse en cualquier momento y sin aviso previo. Se entrega “tal cual”, sin garantías sobre su disponibilidad continua.',
        ],
      },
      {
        h: '// marco normativo',
        p: [
          'El sitio se rige por la legislación chilena. El tratamiento de datos personales se declara en la Política de Privacidad y se enmarca en las siguientes normas:',
        ],
        links: [LAW_19628, LAW_21719],
      },
      {
        h: '// jurisdicción',
        p: [
          'Para cualquier controversia se aplicará la legislación de la República de Chile y serán competentes sus tribunales ordinarios.',
        ],
      },
    ],
  },

  privacidad: {
    num: 'L2',
    title: 'Política de Privacidad',
    updated: '30 de agosto de 2026',
    sections: [
      {
        h: '// responsable del tratamiento',
        p: [
          'Alexis Hernández Camus (titular del sitio), San Antonio, Región de Valparaíso, Chile. Para ejercer derechos o consultar sobre esta política: adhcamus@gmail.com.',
        ],
      },
      {
        h: '// datos que se tratan',
        p: [
          'Formulario de contacto: si lo utilizas, se tratan tu nombre, correo electrónico y mensaje, con la única finalidad de responder tu consulta. El envío se procesa a través de Web3Forms, servicio tercero que actúa como encargado del tratamiento y entrega el mensaje al correo del titular (ver su política en web3forms.com/privacy-policy).',
          'Datos técnicos: al visitar el sitio, tu navegador se comunica con los servicios de hosting (Vercel) y, para mostrar la actividad y repositorios en vivo, con la API pública de GitHub. En esas comunicaciones dichos proveedores reciben datos técnicos estándar como tu dirección IP, según sus propias políticas.',
        ],
        links: [
          { label: 'Política de privacidad de Web3Forms', href: 'https://web3forms.com/privacy-policy' },
          {
            label: 'Declaración de privacidad de GitHub',
            href: 'https://docs.github.com/es/site-policy/privacy-policies/github-privacy-statement',
          },
        ],
      },
      {
        h: '// cookies y almacenamiento local',
        p: [
          'El sitio no utiliza cookies de seguimiento ni analítica de terceros. Emplea el almacenamiento local (localStorage) de tu navegador únicamente para: guardar tu preferencia de tema día/noche (clave “alexdevos-theme”) y guardar en caché los datos públicos de GitHub por 15 minutos (clave “alexdevos-github-cache”), reduciendo las consultas a la API. Ambos datos permanecen en tu navegador y puedes eliminarlos limpiando el almacenamiento del sitio.',
        ],
      },
      {
        h: '// derechos',
        p: [
          'Conforme a la Ley N° 19.628, puedes ejercer en cualquier momento tus derechos de acceso, rectificación, cancelación y oposición respecto de los datos que te conciernen, escribiendo a adhcamus@gmail.com.',
          'El tratamiento se declara además alineado con los estándares de la Ley N° 21.719, que perfecciona el marco chileno de protección de datos (crea la Agencia de Protección de Datos Personales y contempla sanciones de hasta 20.000 UTM) y entra en vigencia plena el 1 de diciembre de 2026.',
        ],
        links: [LAW_19628, LAW_21719],
      },
      {
        h: '// conservación',
        p: [
          'Los mensajes recibidos vía formulario se conservan en el correo del titular únicamente por el tiempo necesario para responder la consulta y mantener un historial mínimo de contacto.',
        ],
      },
      {
        h: '// menores de edad',
        p: [
          'El sitio está dirigido a público general y no recopila de forma intencionada datos de menores de 14 años.',
        ],
      },
      {
        h: '// cambios en esta política',
        p: [
          'Cualquier cambio se publicará en esta misma página indicando la fecha de la última actualización. La versión indicada arriba corresponde a la vigente.',
        ],
      },
    ],
  },
};
