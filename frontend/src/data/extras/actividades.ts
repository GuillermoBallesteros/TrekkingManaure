import { imagenes } from '../../../../shared/data/imagenes';

// Adicionales que se suman a la inscripción. precio es la clave en la configuración de precios.
export const actividadesExtra = [
  {
    precio: 'acompanante',
    publicId: imagenes.extras.acompanante,
    alt: 'Pareja de senderistas desayunando en una terraza, con mochilas y bastones junto a la mesa',
    icon: 'users',
    title: 'Acompañante',
    aprox: false,
    text: 'Acompañante sin pago de kit. Cubre hospedaje y las 3 comidas.',
    chips: ['Hospedaje', '3 comidas'],
    delay: 1,
  },
  {
    precio: 'cuatrimoto',
    publicId: imagenes.extras.cuatrimoto,
    alt: 'Guía en cuatrimoto por los caminos de montaña de Manaure',
    icon: 'mountain',
    title: 'Cuatrimoto',
    aprox: true,
    text: 'Mismo valor con o sin acompañante. Merienda incluida.',
    chips: [],
    delay: 2,
  },
  {
    precio: 'parapente',
    publicId: imagenes.extras.parapente,
    alt: 'Vuelo en parapente biplaza sobre Manaure',
    icon: 'flag',
    title: 'Parapente',
    aprox: true,
    text: 'Por persona. Merienda incluida.',
    chips: [],
    delay: 3,
  },
] as const;

// Hotel para llegar antes del evento. El precio por noche y persona está en precios.hotelNoche.
export const hotelPrevio = {
  icon: 'hotel',
  title: 'Llega antes: hotel previo al evento',
  text: '¿Quieres venir días antes? Reserva hotel en Manaure las noches que necesites antes del evento. Se cobra por noche y por persona.',
  chips: ['Eliges llegada y salida', 'Cálculo automático', 'Se suma a tu reserva'],
} as const;
