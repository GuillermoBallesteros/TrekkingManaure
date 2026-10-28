import { useState, type ChangeEvent } from 'react';
import {
  EPS_OTRA,
  eps,
  parentescos,
  parentescosResponsable,
  patrones,
} from '../../../../shared/reservas';
import { COMPROMISOS } from '../../data/reserva/formulario';
import { fieldName } from '../../utils/reserva/formulario';

/**
 * EPS, contacto de emergencia, salud y compromisos de una persona. Si `responsable` es true
 * (titular menor de edad), el contacto es su responsable legal y solo admite madre, padre o
 * tutor.
 */
export function useDatosSeguridad(prefijo: string, responsable: boolean) {
  const [entidad, setEntidad] = useState('');
  const [parentesco, setParentesco] = useState('');
  const id = (base: string) => fieldName(prefijo, base);
  const opcionesParentesco: readonly string[] = responsable ? parentescosResponsable : parentescos;
  const quien = prefijo ? 'del acompañante' : 'del participante';

  return {
    ids: {
      eps: id('eps'),
      epsOtra: id('epsOtra'),
      emergenciaNombre: id('emergenciaNombre'),
      emergenciaParentesco: id('emergenciaParentesco'),
    },
    eps,
    entidad,
    cambiarEntidad: (event: ChangeEvent<HTMLSelectElement>) => setEntidad(event.target.value),
    mostrarOtra: entidad === EPS_OTRA,
    patrones,
    // Mismas letras que un nombre, con espacio para nombre y apellido.
    patronContacto: patrones.nombre.replace('{2,60}', '{5,120}'),
    contacto: {
      titulo: responsable ? 'Responsable legal' : 'Contacto en caso de emergencia',
      ayuda: responsable
        ? 'Madre, padre o tutor legal del participante menor de edad. Debe ser alguien que no viaja al evento.'
        : 'Una persona que no viaja al evento y a quien podamos llamar si algo pasa.',
      quien: 'del contacto de emergencia ' + quien,
    },
    // Si la lista cambia (el titular pasa a ser menor) y el parentesco ya no aplica, se vacía.
    parentesco: opcionesParentesco.includes(parentesco) ? parentesco : '',
    cambiarParentesco: (event: ChangeEvent<HTMLSelectElement>) => setParentesco(event.target.value),
    parentescos: opcionesParentesco,
    compromisos: COMPROMISOS,
  };
}
