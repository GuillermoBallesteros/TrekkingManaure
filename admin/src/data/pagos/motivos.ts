// Motivos para rechazar un pago esperado tras revisar la llave Bre-B.
export const motivosRechazo = [
  'El pago no aparece en la llave Bre-B',
  'El monto recibido no coincide con lo esperado',
  'La persona canceló la reserva',
] as const;

export const otroMotivo = 'Otro motivo';
