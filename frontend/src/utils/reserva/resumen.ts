import type { DatosPersona, FilaResumen } from '../../types/reserva';
import { formatBirth } from './mensaje';

/** Filas de una persona en la ventana de resumen; las opcionales solo si tienen dato. */
export function filasPersona(persona: DatosPersona): FilaResumen[] {
  return [
    { label: 'Nombre', value: persona.nombre },
    { label: 'Documento', value: persona.tipoDocumento + ' ' + persona.documento },
    { label: 'Nacimiento', value: formatBirth(persona.nacimiento) },
    { label: 'Género', value: persona.genero },
    ...(persona.talla ? [{ label: 'Talla de camisa', value: persona.talla }] : []),
    ...(persona.telefono ? [{ label: 'Teléfono', value: persona.telefono }] : []),
    ...(persona.correo ? [{ label: 'Correo', value: persona.correo }] : []),
    { label: 'Ciudad', value: persona.ciudad },
    { label: 'Enfermedad', value: persona.salud.enfermedad },
    { label: 'Alergias', value: persona.salud.alergia },
    { label: 'Practica deporte', value: persona.salud.deporte },
  ];
}
