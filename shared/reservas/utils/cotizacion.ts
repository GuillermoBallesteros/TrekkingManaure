import { precios } from '../../config';
import { etiquetasExtra } from '../data/catalogos';
import type { Extra, PaymentConcept, PaymentPlan } from '../tipos';

export type Charge = { label: string; amount: number };

/** Lo que define el precio: acompañante (con o sin kit) y actividades extra. */
export type Seleccion = {
  companion: { kit: boolean } | null;
  extras: readonly Extra[];
};

export type Cotizacion = {
  titular: number;
  acompanante: number;
  extras: number;
  total: number;
  /** Lo que se paga al reservar: todo, o solo la inscripción si aparta. */
  ahora: number;
  /** Lo que queda para la fecha elegida; 0 si paga completo. */
  saldo: number;
};

export function companionPrice(kit: boolean) {
  return kit ? precios.acompananteConKit : precios.acompanante;
}

/**
 * Cargos de una reserva. Titular: inscripción + kit obligatorio. Acompañante: precio sin kit o
 * con kit. Extras: precio por actividad. Es el único cálculo de precios del sistema.
 */
export function getCharges(seleccion: Seleccion): Charge[] {
  const charges: Charge[] = [{ label: 'Inscripción y kit del titular', amount: precios.total }];
  const { companion } = seleccion;

  if (companion) {
    charges.push({
      label: companion.kit ? 'Acompañante con kit' : 'Acompañante sin kit',
      amount: companionPrice(companion.kit),
    });
  }
  for (const extra of seleccion.extras) {
    charges.push({ label: etiquetasExtra[extra], amount: precios[extra] });
  }

  return charges;
}

export function getTotal(seleccion: Seleccion) {
  return getCharges(seleccion).reduce((sum, charge) => sum + charge.amount, 0);
}

/** Lo que se paga al reservar según el plan; sin plan elegido se muestra el total. */
export function getUpfront(plan: PaymentPlan | null, total: number) {
  return plan === 'apartado' ? Math.min(precios.inscripcion, total) : total;
}

export function upfrontConcept(plan: PaymentPlan): PaymentConcept {
  return plan === 'apartado' ? 'Separación de cupo' : 'Pago total';
}

/** Cotización del formulario y del resumen: total, lo que se paga ahora y el restante. */
export function cotizar(seleccion: Seleccion & { plan: PaymentPlan | null }): Cotizacion {
  const total = getTotal(seleccion);
  const acompanante = seleccion.companion ? companionPrice(seleccion.companion.kit) : 0;
  const ahora = getUpfront(seleccion.plan, total);

  return {
    titular: precios.total,
    acompanante,
    extras: total - precios.total - acompanante,
    total,
    ahora,
    saldo: total - ahora,
  };
}
