import { evento, precios } from '../../../../shared/config';

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

// Último día para pagar los saldos; viene de la configuración del evento.
export const fechaLimiteSaldo = evento.fechaLimitePago;
