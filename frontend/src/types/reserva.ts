export type Estadia = '' | 'Páramo' | 'Hotel en Manaure';
export type Extra = 'cuatrimoto' | 'parapente';

/** Titular: 'total' = inscripción + kit con pago completo; 'apartado' = solo inscripción y kit después. */
export type PlanTitular = 'total' | 'apartado';
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
  telefono: string;
  correo: string;
  ciudad: string;
  emergenciaNombre: string;
  emergenciaTelefono: string;
  salud: SaludPersona;
  /** Solo quien compra kit tiene talla. */
  talla?: string;
};

export type OpcionesCotizacion = {
  plan: PlanTitular;
  companion: boolean;
  companionKit: boolean;
  companionPago: PagoKitAcompanante;
  extras: Extra[];
};

export type Cotizacion = {
  total: number;
  /** Lo que se paga ahora por Nequi. */
  ahora: number;
  saldoTitular: number;
  saldoAcompanante: number;
};
