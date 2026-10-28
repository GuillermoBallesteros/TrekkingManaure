import { contacto } from '../../../../shared/config';
import { metodoPago } from '../../../../shared/reservas';
import type { ResumenReservaTexto } from '../../types/reserva';
import { buildMessage, whatsappLink } from '../../utils/reserva/mensaje';
import { filasPersona } from '../../utils/reserva/resumen';

export function useResumenModal(resumen: ResumenReservaTexto) {
  const acompanante = resumen.acompanante;

  return {
    // El mensaje lleva el código solo cuando la reserva ya quedó registrada.
    whatsapp: resumen.codigo ? whatsappLink(contacto.whatsapp, buildMessage(resumen)) : null,
    codigo: resumen.codigo,
    confirmacion:
      'Paga ' +
      resumen.ahora +
      ' por ' +
      metodoPago.label +
      '. Tu cupo queda pendiente hasta que la organización verifique que el pago llegó.',
    participante: filasPersona(resumen.participante),
    reserva: [
      { label: 'Estadía', value: resumen.estadia },
      { label: 'Modalidad', value: resumen.modalidad },
      ...(resumen.fechaRestante
        ? [{ label: 'Pago del restante', value: resumen.fechaRestante }]
        : []),
      { label: 'Actividades extra', value: resumen.extras },
    ],
    acompanante: acompanante
      ? {
          persona: filasPersona(acompanante.persona),
          detalle: [
            { label: 'Estadía', value: acompanante.estadia },
            { label: 'Kit', value: acompanante.kit },
          ],
        }
      : null,
    pagos: [
      { label: 'A pagar ahora', value: resumen.ahora },
      { label: 'Saldo pendiente', value: resumen.saldo },
      { label: 'Total', value: resumen.total },
    ],
    metodoPago: metodoPago.label,
  };
}
