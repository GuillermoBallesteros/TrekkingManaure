import { evento } from '../../../../shared/config';
import { metodoPago } from '../../../../shared/reservas';
import { AVISO_HOJA_CONSENTIMIENTO, AVISO_MENOR } from '../../data/reserva/formulario';
import type { FilaResumen, ResumenReservaTexto } from '../../types/reserva';

function lineas(filas: FilaResumen[]): string[] {
  return filas.map((fila) => fila.label + ': ' + fila.value);
}

/**
 * Texto del mensaje de WhatsApp: las mismas filas del resumen, que salen de la reserva
 * registrada, más el método de pago y los avisos.
 */
export function buildMessage(resumen: ResumenReservaTexto): string {
  const lines = [
    'RESERVA · ' + evento.nombre.toUpperCase(),
    evento.fechasTexto + ' · Salida ' + evento.horaSalidaTexto + ' · ' + evento.lugar,
    ...(resumen.codigo ? ['Código de reserva: ' + resumen.codigo] : []),
    '',
    'PARTICIPANTE',
    ...lineas(resumen.participante),
    '',
    'RESERVA',
    ...lineas(resumen.reserva),
    'Método de pago: ' + metodoPago.label,
    ...(resumen.menor ? ['', AVISO_MENOR] : []),
    '',
    ...(resumen.acompanante
      ? ['ACOMPAÑANTE', ...lineas(resumen.acompanante), '']
      : ['Acompañante: No', '']),
    'PAGOS',
    ...lineas(resumen.pagos),
    '',
    'Términos y condiciones aceptados por cada persona (versión ' + resumen.versionTerminos + ').',
    AVISO_HOJA_CONSENTIMIENTO,
  ];
  return lines.join('\n');
}

/** Enlace de WhatsApp con el mensaje, o null si el número aún no está configurado. */
export function whatsappLink(number: string, message: string): string | null {
  const digits = number.replace(/\D/g, '');
  return digits ? 'https://wa.me/' + digits + '?text=' + encodeURIComponent(message) : null;
}
