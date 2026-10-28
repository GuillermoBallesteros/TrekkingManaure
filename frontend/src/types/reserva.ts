import type { Cotizacion, Extra, PaymentPlan, Stay } from '../../../shared/reservas';

// Tipos de presentación del formulario. El modelo de la reserva que se guarda y comparte con
// el panel está en shared/reservas/tipos.ts.

export type { Cotizacion, Extra };

/** Estadía elegida en el formulario; '' mientras no se elige. */
export type Estadia = '' | Stay;

/**
 * Forma de pago de toda la reserva: 'total' paga todo ahora; 'apartado' paga la inscripción
 * ahora y elige una sola fecha para pagar el restante.
 */
export type PlanPago = PaymentPlan;

export type SaludPersona = {
  enfermedad: string;
  alergia: string;
  deporte: string;
};

/** Datos de una persona tal como aparecen en el resumen (textos ya normalizados). */
export type DatosPersona = {
  nombre: string;
  tipoDocumento: string;
  documento: string;
  nacimiento: string;
  genero: string;
  /** Solo el titular tiene teléfono y correo; el acompañante no los da. */
  telefono?: string;
  correo?: string;
  ciudad: string;
  salud: SaludPersona;
  /** Solo quien compra kit tiene talla. */
  talla?: string;
};

/** Datos del formulario ya ordenados para la ventana de resumen y para el mensaje de WhatsApp. */
export type ResumenReservaTexto = {
  /** Código asignado al registrar la reserva; null mientras se revisa antes de confirmar. */
  codigo: string | null;
  participante: DatosPersona;
  estadia: string;
  modalidad: string;
  /** Fecha en que se paga todo el restante; null si paga completo. */
  fechaRestante: string | null;
  acompanante: { persona: DatosPersona; estadia: string; kit: string } | null;
  extras: string;
  ahora: string;
  saldo: string;
  total: string;
};

/** Una fila etiqueta/valor de la ventana de resumen. */
export type FilaResumen = { label: string; value: string };
