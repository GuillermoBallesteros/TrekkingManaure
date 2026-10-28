// Las dos opciones de estadía. value es la estadía que se preselecciona en la reserva.
export const estadias = [
  {
    value: 'Páramo',
    className: 'stay stay--paramo reveal',
    tag: 'Experiencia completa',
    icon: 'tent',
    title: 'Quedarse en el páramo',
    text: 'Termina la carrera y quédate allá. Vive la noche en la montaña y toda la experiencia.',
    items: [
      'Fogata al finalizar la carrera',
      'Hospedaje en habitación rural o camping',
      'Desayuno, almuerzo y cena',
      'Frío intenso: lleva abrigo y ropa térmica',
      'Sin conectividad a internet en el páramo',
    ],
    action: 'Elegir páramo',
    delay: 1,
  },
  {
    value: 'Hotel en Manaure',
    className: 'stay stay--hotel reveal',
    tag: 'Vuelve a Manaure',
    icon: 'hotel',
    title: 'Hotel en Manaure',
    text: 'Sube hasta el páramo, cumple el recorrido y regresa a dormir a las zonas estipuladas de Manaure.',
    items: [
      'Recorrido completo hasta el páramo',
      'Regreso para alojarte en Manaure',
      'Alojamiento en zonas estipuladas',
      'Sin noche en la montaña',
    ],
    action: 'Elegir hotel',
    delay: 2,
  },
] as const;
