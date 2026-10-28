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

export const OPCIONES_EXTRA: readonly { id: Extra; title: string; text: string }[] = [
  { id: 'cuatrimoto', title: 'Cuatrimoto', text: 'Por pareja · merienda incluida' },
  { id: 'parapente', title: 'Parapente', text: 'Por persona · merienda incluida' },
];

export const RESPUESTAS_SI_NO = ['Sí', 'No'] as const;
