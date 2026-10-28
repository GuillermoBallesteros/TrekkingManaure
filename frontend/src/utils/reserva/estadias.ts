import { ESTADIA_CON_CUPO } from '../../../../shared/reservas';
import { OPCIONES_ESTADIA, PARAMO_SIN_CUPO } from '../../data/reserva/opciones';

/** Opciones de estadía; la del páramo queda deshabilitada cuando no hay cupos. */
export function opcionesEstadia(paramoAgotado: boolean) {
  return OPCIONES_ESTADIA.map((option) => {
    const sinCupo = paramoAgotado && option.value === ESTADIA_CON_CUPO;
    return { ...option, disabled: sinCupo, text: sinCupo ? PARAMO_SIN_CUPO : option.text };
  });
}
