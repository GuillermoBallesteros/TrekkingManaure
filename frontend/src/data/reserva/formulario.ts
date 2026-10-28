// Ajustes propios del formulario de reserva. Los catálogos (documentos, géneros, tallas,
// países, EPS, parentescos, patrones y vía de pago) son compartidos con el panel:
// shared/reservas/data/catalogos.ts.

/** Preguntas de salud: name base, pregunta y, si aplica, el detalle que se pide al decir Sí. */
export const PREGUNTAS_SALUD: readonly { base: string; pregunta: string; detalle?: string }[] = [
  { base: 'enfermedad', pregunta: '¿Sufre alguna enfermedad?', detalle: '¿Cuál enfermedad?' },
  { base: 'alergia', pregunta: '¿Sufre alergias?', detalle: '¿Cuál alergia?' },
  {
    base: 'discapacidad',
    pregunta: '¿Es una persona en condición de discapacidad?',
    detalle: '¿Cuál? Descríbela para preparar el apoyo necesario',
  },
  { base: 'deporte', pregunta: '¿Practica deporte regularmente?' },
];

/** Compromisos obligatorios: si se responde No, la reserva no se puede registrar. */
export const COMPROMISOS = [
  {
    base: 'areasProtegidas',
    pregunta: '¿Se compromete a respetar las indicaciones y normas de las áreas protegidas?',
    exigeSi:
      'Para participar es obligatorio comprometerse a respetar las normas de las áreas protegidas.',
  },
  {
    base: 'medioAmbiente',
    pregunta: '¿Se compromete a contribuir con el cuidado del medio ambiente?',
    exigeSi: 'Para participar es obligatorio comprometerse a cuidar el medio ambiente.',
  },
] as const;

export const AVISO_MENOR =
  'El participante es menor de edad. Debe enviar por WhatsApp la autorización firmada por su madre, padre o tutor legal. Sin ese documento la organización no aprueba el pago.';

export const AVISO_HOJA_CONSENTIMIENTO =
  'Al llegar al punto de encuentro, cada participante firmará una hoja de consentimiento. Sin firmarla no se puede iniciar el recorrido.';

/** Casillas de aceptación. Las obligatorias bloquean el envío; las de imagen son opcionales. */
export const CASILLAS_TERMINOS = {
  titular: [
    {
      name: 'terminos',
      titulo: 'Leí y acepto los términos y condiciones',
      texto: 'Incluidos los riesgos de la actividad y el tratamiento de mis datos personales.',
      obligatoria: true,
    },
    {
      name: 'imagen',
      titulo: 'Autorizo el uso de mi imagen (opcional)',
      texto: 'Fotos y videos del evento para su difusión.',
      obligatoria: false,
    },
  ],
  acompanante: [
    {
      name: 'acompTerminos',
      titulo: 'Mi acompañante leyó y acepta los términos y condiciones',
      texto: 'Conoce los riesgos de la actividad y autoriza el tratamiento de sus datos.',
      obligatoria: true,
    },
    {
      name: 'acompImagen',
      titulo: 'Mi acompañante autoriza el uso de su imagen (opcional)',
      texto: 'Fotos y videos del evento para su difusión.',
      obligatoria: false,
    },
  ],
} as const;
