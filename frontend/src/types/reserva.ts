export type Estadia = '' | 'Páramo' | 'Hotel en Manaure';
export type Extra = 'cuatrimoto' | 'parapente';

/**
 * Forma de pago de toda la reserva: 'total' paga todo ahora; 'apartado' paga la inscripción
 * ahora y elige una sola fecha para pagar el restante.
 */
export type PlanPago = 'total' | 'apartado';
/** Preferencia de pago de quien reserva; el pago se hace por una de estas dos vías. */
export type MetodoPago = 'nequi' | 'llave-bre-b';

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

export type OpcionesCotizacion = {
  plan: PlanPago | null;
  companion: boolean;
  companionKit: boolean | null;
  extras: Extra[];
};

/** Datos del formulario ya ordenados para la ventana de resumen y para el mensaje de WhatsApp. */
export type ResumenReservaTexto = {
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

export type Cotizacion = {
  titular: number;
  acompanante: number;
  extras: number;
  total: number;
  /** Lo que se paga ahora: todo, o solo la inscripción si aparta. */
  ahora: number;
  /** Lo que queda por pagar en la fecha elegida; 0 si paga completo. */
  saldo: number;
};
