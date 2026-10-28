import type { Extra, Stay } from '../../../../shared/reservas';

// Textos de las opciones del formulario. Los valores salen de los catálogos compartidos.
export const OPCIONES_ESTADIA: readonly { value: Stay; title: string; text: string }[] = [
  {
    value: 'Páramo',
    title: 'Quedarse en el páramo',
    text: 'Fogata, camping o habitación rural y experiencia completa.',
  },
  {
    value: 'Hotel en Manaure',
    title: 'Hotel en Manaure',
    text: 'Subes al páramo, cumples el recorrido y regresas a dormir.',
  },
];

/** `conAcompanante`: la opción solo aparece si la reserva lleva acompañante. */
export const OPCIONES_EXTRA: readonly {
  id: Extra;
  title: string;
  text: string;
  conAcompanante: boolean;
}[] = [
  {
    id: 'cuatrimoto',
    title: 'Cuatrimoto',
    text: 'Mismo valor con o sin acompañante · merienda incluida',
    conAcompanante: false,
  },
  {
    id: 'parapente',
    title: 'Parapente para ti',
    text: 'Por persona · merienda incluida',
    conAcompanante: false,
  },
  {
    id: 'parapenteAcompanante',
    title: 'Parapente para tu acompañante',
    text: 'Por persona · merienda incluida',
    conAcompanante: true,
  },
];

export const RESPUESTAS_SI_NO = ['Sí', 'No'] as const;
