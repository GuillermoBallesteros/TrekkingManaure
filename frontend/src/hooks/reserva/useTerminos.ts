import { CASILLAS_TERMINOS } from '../../data/reserva/formulario';

/** Casillas de aceptación del titular y, si lo lleva, de su acompañante. */
export function useTerminos(companion: boolean) {
  return {
    casillas: [...CASILLAS_TERMINOS.titular, ...(companion ? CASILLAS_TERMINOS.acompanante : [])],
  };
}
