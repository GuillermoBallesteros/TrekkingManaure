import { evento } from '../../../../shared/config';
import { metodoPago } from '../../../../shared/reservas';
import type { DatosPersona, ResumenReservaTexto } from '../../types/reserva';

/** Convierte AAAA-MM-DD a DD/MM/AAAA para el resumen. */
export function formatBirth(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? match[3] + '/' + match[2] + '/' + match[1] : value;
}

function describePerson(person: DatosPersona): string[] {
  return [
    'Nombre: ' + person.nombre,
    'Documento: ' + person.tipoDocumento + ' ' + person.documento,
    'Fecha de nacimiento: ' + formatBirth(person.nacimiento),
    'Género: ' + person.genero,
    ...(person.talla ? ['Talla de camisa: ' + person.talla] : []),
    ...(person.telefono ? ['Teléfono: ' + person.telefono] : []),
    ...(person.correo ? ['Correo: ' + person.correo] : []),
    'Ciudad: ' + person.ciudad,
    'Enfermedad: ' + person.salud.enfermedad,
    'Alergias: ' + person.salud.alergia,
    'Practica deporte: ' + person.salud.deporte,
  ];
}

/** Texto del mensaje de WhatsApp: los datos del formulario más el método de pago elegido. */
export function buildMessage(resumen: ResumenReservaTexto): string {
  const acompanante = resumen.acompanante;
  const lines = [
    'RESERVA · TREKKING DESAFÍO PERIJÁ 13K',
    evento.fechasTexto + ' · Manaure, Cesar',
    ...(resumen.codigo ? ['Código de reserva: ' + resumen.codigo] : []),
    '',
    'PARTICIPANTE',
    ...describePerson(resumen.participante),
    'Estadía: ' + resumen.estadia,
    'Modalidad: ' + resumen.modalidad,
    ...(resumen.fechaRestante ? ['Fecha de pago del restante: ' + resumen.fechaRestante] : []),
    'Método de pago: ' + metodoPago.label,
    '',
    ...(acompanante
      ? [
          'ACOMPAÑANTE',
          ...describePerson(acompanante.persona),
          'Estadía del acompañante: ' + acompanante.estadia,
          'Kit del acompañante: ' + acompanante.kit,
          '',
        ]
      : ['Acompañante: No', '']),
    'Actividades extra: ' + resumen.extras,
    'A pagar ahora: ' + resumen.ahora,
    'Saldo pendiente: ' + resumen.saldo,
    'Total: ' + resumen.total,
  ];
  return lines.join('\n');
}

/** Enlace de WhatsApp con el mensaje, o null si el número aún no está configurado. */
export function whatsappLink(number: string, message: string): string | null {
  const digits = number.replace(/\D/g, '');
  return digits ? 'https://wa.me/' + digits + '?text=' + encodeURIComponent(message) : null;
}
