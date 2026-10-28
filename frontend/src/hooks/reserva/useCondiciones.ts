import { useCierre } from '../../../../shared/reservas';
import { CONDICIONES, MARCA_PLAZO, VERSION_TERMINOS } from '../../data/reserva/condiciones';

/** Términos con la fecha de cierre vigente en lugar de la marca {plazo}. */
export function useCondiciones() {
  const { plazoTexto } = useCierre();

  return {
    secciones: CONDICIONES.map((seccion) => ({
      titulo: seccion.titulo,
      parrafos: seccion.parrafos.map((parrafo) => parrafo.replace(MARCA_PLAZO, plazoTexto)),
    })),
    version: VERSION_TERMINOS,
  };
}
