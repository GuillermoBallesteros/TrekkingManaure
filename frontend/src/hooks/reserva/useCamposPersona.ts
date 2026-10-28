import { useState, type ChangeEvent } from 'react';
import {
  documentRule,
  generos,
  patrones,
  tallas,
  tiposDocumento,
  type DocumentType,
} from '../../../../shared/reservas';
import { todayInColombia } from '../../../../shared/utils/format';
import { fechasNacimientoPermitidas, fieldName } from '../../utils/reserva/formulario';

/**
 * Campos de una persona; prefijo '' = titular, 'acomp' = acompañante. Titular y acompañante
 * llenan exactamente los mismos campos; solo cambia el autocompletado del navegador.
 */
export function useCamposPersona(prefijo: string, onNacimiento?: (value: string) => void) {
  const [tipoDocumento, setTipoDocumento] = useState<DocumentType | ''>('');
  const titular = !prefijo;
  const id = (base: string) => fieldName(prefijo, base);
  // El acompañante no usa el autocompletado del navegador: son datos de otra persona.
  const autoComplete = (valor: string) => (titular ? valor : 'off');
  const regla = tipoDocumento ? documentRule(tipoDocumento) : null;

  return {
    quien: titular ? 'del participante' : 'del acompañante',
    ids: {
      nombres: id('nombres'),
      apellidos: id('apellidos'),
      tipoDocumento: id('tipoDocumento'),
      documento: id('documento'),
      nacimiento: id('nacimiento'),
      genero: id('genero'),
      talla: id('talla'),
      correo: id('correo'),
      ciudad: id('ciudad'),
    },
    autoComplete: {
      nombres: autoComplete('given-name'),
      apellidos: autoComplete('family-name'),
      telefono: autoComplete('tel-national'),
      correo: autoComplete('email'),
      ciudad: autoComplete('address-level2'),
    },
    patterns: patrones,
    documento: {
      // Sin tipo elegido, el número queda deshabilitado: su formato depende del tipo.
      disabled: !regla,
      pattern: regla?.patron,
      title: regla?.ayuda ?? 'Elige primero el tipo de documento',
      placeholder: regla?.ayuda ?? 'Elige primero el tipo',
    },
    cambiarTipo: (event: ChangeEvent<HTMLSelectElement>) =>
      setTipoDocumento(event.target.value as DocumentType),
    cambiarNacimiento: (event: ChangeEvent<HTMLInputElement>) => onNacimiento?.(event.target.value),
    nacimiento: fechasNacimientoPermitidas(todayInColombia()),
    tiposDocumento,
    generos,
    tallas,
  };
}
