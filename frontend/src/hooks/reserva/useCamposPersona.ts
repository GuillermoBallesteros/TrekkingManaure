import { generos, patrones, tallas, tiposDocumento } from '../../../../shared/reservas';
import { todayInColombia } from '../../../../shared/utils/format';
import { fechasNacimientoPermitidas, fieldName } from '../../utils/reserva/formulario';

/** Campos de una persona; prefijo '' = titular, 'acomp' = acompañante. */
export function useCamposPersona(prefijo: string) {
  const titular = !prefijo;
  const id = (base: string) => fieldName(prefijo, base);
  // El acompañante no usa el autocompletado del navegador: son datos de otra persona.
  const autoComplete = (valor: string) => (titular ? valor : 'off');

  return {
    titular,
    ids: {
      nombres: id('nombres'),
      apellidos: id('apellidos'),
      tipoDocumento: id('tipoDocumento'),
      documento: id('documento'),
      nacimiento: id('nacimiento'),
      genero: id('genero'),
      talla: id('talla'),
      telefono: id('telefono'),
      correo: id('correo'),
      ciudad: id('ciudad'),
    },
    autoComplete: {
      nombres: autoComplete('given-name'),
      apellidos: autoComplete('family-name'),
      ciudad: autoComplete('address-level2'),
    },
    patterns: patrones,
    nacimiento: fechasNacimientoPermitidas(todayInColombia()),
    tiposDocumento,
    generos,
    tallas,
  };
}
