import { contacto } from '../../../../shared/config';
import { metodoPago } from '../../../../shared/reservas';
import { AVISO_HOJA_CONSENTIMIENTO, AVISO_MENOR } from '../../data/reserva/formulario';
import type { ResumenReservaTexto } from '../../types/reserva';
import { buildMessage, whatsappLink } from '../../utils/reserva/mensaje';

export function useResumenModal(resumen: ResumenReservaTexto) {
  return {
    // El mensaje solo existe cuando la reserva, con su aceptación de términos, ya quedó
    // registrada: sin registro no hay WhatsApp.
    whatsapp: resumen.codigo ? whatsappLink(contacto.whatsapp, buildMessage(resumen)) : null,
    codigo: resumen.codigo,
    confirmacion:
      'Paga ' +
      resumen.ahora +
      ' por ' +
      metodoPago.label +
      '. Tu cupo queda pendiente hasta que la organización verifique que el pago llegó.',
    participante: resumen.participante,
    reserva: resumen.reserva,
    acompanante: resumen.acompanante,
    pagos: resumen.pagos,
    metodoPago: metodoPago.label,
    avisoMenor: resumen.menor ? AVISO_MENOR : null,
    avisoHoja: AVISO_HOJA_CONSENTIMIENTO,
  };
}
