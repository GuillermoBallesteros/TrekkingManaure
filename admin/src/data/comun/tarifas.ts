import { evento, precios } from '../../../../shared/config';
import { subtractDays } from '../../utils/comun/fechas';

// Reglas de la organización para el panel. El acompañante cuesta $150.000 sin kit
// y lo mismo que un titular si compra kit.
export const tarifas = {
  titular: precios.total,
  separacion: precios.inscripcion,
  acompananteSinKit: 150000,
  acompananteConKit: precios.total,
  cuatrimoto: precios.cuatrimoto,
  parapente: precios.parapente,
} as const;

// El saldo se puede comprometer hasta dos semanas antes del evento.
export const fechaLimiteSaldo = subtractDays(evento.fechas[0], 14);
