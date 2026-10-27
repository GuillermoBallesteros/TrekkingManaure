export type Estadia = '' | 'Páramo' | 'Hotel en Manaure';
export type Extra = 'cuatrimoto' | 'parapente';

/** Titular: 'total' = inscripción + kit con pago completo; 'apartado' = solo inscripción y kit después. */
export type PlanTitular = 'total' | 'apartado';
/** Preferencia de pago de quien reserva; el pago se hace por una de estas dos vías. */
export type MetodoPago = 'nequi' | 'llave-bre-b';
/** Acompañante con kit: pago inmediato o diferido a una fecha. */
export type PagoKitAcompanante = 'inmediato' | 'diferido';

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
  plan: PlanTitular | null;
  companion: boolean;
  companionKit: boolean | null;
  companionPago: PagoKitAcompanante | null;
  extras: Extra[];
};

/** Datos del formulario ya ordenados para la ventana de resumen y para el mensaje de WhatsApp. */
export type ResumenReservaTexto = {
  participante: DatosPersona;
  estadia: string;
  modalidad: string;
  /** Fecha de pago del saldo del kit del titular; null si paga completo. */
  fechaSaldo: string | null;
  acompanante: { persona: DatosPersona; estadia: string; kit: string } | null;
  extras: string;
  ahora: string;
  saldo: string;
  total: string;
};

export type Cotizacion = {
  total: number;
  /** Lo que se paga ahora por Nequi. */
  ahora: number;
  saldoTitular: number;
  saldoAcompanante: number;
};
