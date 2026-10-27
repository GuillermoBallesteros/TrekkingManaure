import { precios } from '../../../shared/config';
import { EPS_OTRA } from '../sections/Reserva/datosFormulario';
import type { DatosPersona, Extra } from '../types/reserva';

export function getReservationTotal(withCompanion: boolean, extras: Extra[]) {
  return (
    precios.total +
    (withCompanion ? precios.acompanante : 0) +
    extras.reduce((sum, extra) => sum + precios[extra], 0)
  );
}

/** Lee los campos de una persona del formulario; prefijo '' = inscrito, 'acomp' = acompañante. */
export function readPerson(data: FormData, prefix = '', withSize = false): DatosPersona {
  const read = (base: string) => {
    const key = prefix ? prefix + base.charAt(0).toUpperCase() + base.slice(1) : base;
    return String(data.get(key) || '').trim() || 'No indicado';
  };
  const eps = read('eps');

  return {
    nombre: read('nombre'),
    tipoDocumento: read('tipoDocumento'),
    documento: read('documento'),
    edad: read('edad'),
    telefono: read('telefono'),
    correo: read('correo'),
    ciudad: read('ciudad'),
    emergenciaNombre: read('emergenciaNombre'),
    emergenciaTelefono: read('emergenciaTelefono'),
    eps: eps === EPS_OTRA ? read('epsOtra') : eps,
    ...(withSize ? { talla: read('talla') } : {}),
  };
}

export function describePerson(person: DatosPersona): string[] {
  return [
    'Nombre: ' + person.nombre,
    'Documento: ' + person.tipoDocumento + ' ' + person.documento,
    'Edad: ' + person.edad,
    ...(person.talla ? ['Talla de camisa: ' + person.talla] : []),
    'Teléfono: ' + person.telefono,
    'Correo: ' + person.correo,
    'Ciudad: ' + person.ciudad,
    'Contacto de emergencia: ' + person.emergenciaNombre + ' · ' + person.emergenciaTelefono,
    'EPS: ' + person.eps,
  ];
}

export function validateReceipt(file: Pick<File, 'name' | 'type' | 'size'>): string {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const validExtension = /\.(jpe?g|png|pdf)$/i.test(file.name);

  if (!allowedTypes.includes(file.type) || !validExtension) {
    return 'Selecciona un archivo JPG, PNG o PDF.';
  }

  if (file.size > 5 * 1024 * 1024) {
    return 'El comprobante supera los 5 MB. Elige un archivo más liviano.';
  }

  return '';
}
