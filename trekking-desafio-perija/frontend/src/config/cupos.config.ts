// Política de cupos; requiere implementación transaccional en el backend.
export const cupos = {
  iniciales: 60, ampliacionAlLlenarse: 10, maximo: 70, visiblesEnTiempoReal: true,
  descontarAl: 'Admin acepta pago de inscripción de $50.000',
  liberarAl: 'Admin rechaza pago; liberar solo si el cupo estaba descontado',
  gestionAdmin: ['Aceptar/rechazar pagos', 'Actualizar cupos automáticamente', 'Tabla completa de participantes', 'Descargar Excel'],
} as const;
