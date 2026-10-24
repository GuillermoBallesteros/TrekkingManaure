// Valores COP del texto; precio final por confirmar frente al flyer.
export const precios = {
  moneda: 'COP', total: 350000, inscripcion: 50000, kitCompleto: 300000,
  kitIncluye: ['Desayunos', 'Meriendas'],
  acompanante: { valor: 100000, incluye: ['Comidas', 'Estadía'] },
  cuatrimoto: { valor: 150000, unidad: 'pareja', aproximado: true, incluyeMerienda: true },
  parapente: { valor: 200000, unidad: 'persona', aproximado: true, incluyeMerienda: true },
} as const;
