import { evento, precios } from '../../../shared/config';
import { METODO_PAGO } from '../sections/Reserva/datosFormulario';
import type {
  Cotizacion,
  DatosPersona,
  OpcionesCotizacion,
  ResumenReservaTexto,
} from '../types/reserva';

/** Nombre del campo de formulario; prefijo '' = titular, 'acomp' = acompañante. */
export function fieldName(prefix: string, base: string): string {
  return prefix ? prefix + base.charAt(0).toUpperCase() + base.slice(1) : base;
}

/**
 * Calcula el total de la reserva y cómo se reparte el pago.
 * Titular: inscripción + kit obligatorio (350.000). Acompañante: 150.000 sin kit o 350.000 con kit.
 * Pago completo: todo se paga ahora. Apartado: se paga solo la inscripción (50.000) ahora y todo
 * el restante, de todos los participantes y extras, en una única fecha elegida.
 */
export function getQuote(options: OpcionesCotizacion): Cotizacion {
  const extras = options.extras.reduce((sum, extra) => sum + precios[extra], 0);
  const acompanante = options.companion
    ? options.companionKit
      ? precios.acompananteConKit
      : precios.acompanante
    : 0;
  const total = precios.total + acompanante + extras;
  const ahora = options.plan === 'apartado' ? precios.inscripcion : total;

  return { titular: precios.total, acompanante, extras, total, ahora, saldo: total - ahora };
}

/** Lee los campos de una persona del formulario; prefijo '' = titular, 'acomp' = acompañante. */
export function readPerson(data: FormData, prefix = '', withSize = false): DatosPersona {
  const read = (base: string) => String(data.get(fieldName(prefix, base)) || '').trim();
  const text = (base: string) => read(base) || 'No indicado';
  const yesNo = (base: string) => {
    const answer = read(base);
    if (answer === 'Sí') return read(base + 'Cual') ? 'Sí: ' + read(base + 'Cual') : 'Sí';
    return answer || 'No indicado';
  };
  return {
    nombre: (text('nombres') + ' ' + text('apellidos')).trim(),
    tipoDocumento: text('tipoDocumento'),
    documento: text('documento'),
    nacimiento: text('nacimiento'),
    genero: text('genero'),
    ...(prefix ? {} : { telefono: text('telefono'), correo: text('correo') }),
    ciudad: text('ciudad'),
    salud: {
      enfermedad: yesNo('enfermedad'),
      alergia: yesNo('alergia'),
      deporte: text('deporte'),
    },
    ...(withSize ? { talla: text('talla') } : {}),
  };
}

export function describePerson(person: DatosPersona): string[] {
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

/** Convierte AAAA-MM-DD a DD/MM/AAAA para el resumen. */
export function formatBirth(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? match[3] + '/' + match[2] + '/' + match[1] : value;
}

/** Texto del mensaje de WhatsApp: los datos del formulario más el método de pago elegido. */
export function buildMessage(resumen: ResumenReservaTexto): string {
  const acompanante = resumen.acompanante;
  const lines = [
    'RESERVA · TREKKING DESAFÍO PERIJÁ 13K',
    evento.fechasTexto + ' · Manaure, Cesar',
    '',
    'PARTICIPANTE',
    ...describePerson(resumen.participante),
    'Estadía: ' + resumen.estadia,
    'Modalidad: ' + resumen.modalidad,
    ...(resumen.fechaRestante ? ['Fecha de pago del restante: ' + resumen.fechaRestante] : []),
    'Método de pago: ' + METODO_PAGO.label,
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
