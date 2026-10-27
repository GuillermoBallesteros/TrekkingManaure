import { precios } from '../../../shared/config';
import type { Cotizacion, DatosPersona, OpcionesCotizacion } from '../types/reserva';

/** Nombre del campo de formulario; prefijo '' = titular, 'acomp' = acompañante. */
export function fieldName(prefix: string, base: string): string {
  return prefix ? prefix + base.charAt(0).toUpperCase() + base.slice(1) : base;
}

/**
 * Calcula cuánto se paga ahora (Nequi) y qué saldos quedan.
 * Titular: kit obligatorio; paga 350.000 o aparta con 50.000 (saldo 300.000).
 * Acompañante: 150.000 sin kit. Con kit, 350.000 de inmediato; si es diferido se paga
 * 150.000 ahora y la diferencia del kit después (regla provisional, no está en la especificación).
 */
export function getQuote(options: OpcionesCotizacion): Cotizacion {
  const extras = options.extras.reduce((sum, extra) => sum + precios[extra], 0);
  const saldoTitular = options.plan === 'apartado' ? precios.kitCompleto : 0;
  const titularAhora = precios.total - saldoTitular;

  let acompananteAhora = 0;
  let saldoAcompanante = 0;
  if (options.companion) {
    if (!options.companionKit) {
      acompananteAhora = precios.acompanante;
    } else if (options.companionPago === 'diferido') {
      acompananteAhora = precios.acompanante;
      saldoAcompanante = precios.acompananteConKit - precios.acompanante;
    } else {
      acompananteAhora = precios.acompananteConKit;
    }
  }

  const ahora = titularAhora + acompananteAhora + extras;
  return { total: ahora + saldoTitular + saldoAcompanante, ahora, saldoTitular, saldoAcompanante };
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
    telefono: text('telefono'),
    correo: text('correo'),
    ciudad: text('ciudad'),
    emergenciaNombre: text('emergenciaNombre'),
    emergenciaTelefono: text('emergenciaTelefono'),
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
    'Teléfono: ' + person.telefono,
    'Correo: ' + person.correo,
    'Ciudad: ' + person.ciudad,
    'Contacto de emergencia: ' + person.emergenciaNombre + ' · ' + person.emergenciaTelefono,
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

/** Enlace de WhatsApp con el mensaje, o null si el número aún no está configurado. */
export function whatsappLink(number: string, message: string): string | null {
  const digits = number.replace(/\D/g, '');
  return digits ? 'https://wa.me/' + digits + '?text=' + encodeURIComponent(message) : null;
}
