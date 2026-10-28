import type {
  estadias,
  extras,
  generos,
  planesPago,
  tallas,
  tiposDocumento,
} from './data/catalogos';

// Modelo único de una reserva. Es el contrato que comparten el sitio público, el panel y
// el futuro backend. Fechas en AAAA-MM-DD (hora de Colombia) y montos en COP.

export type DocumentType = (typeof tiposDocumento)[number];
export type Gender = (typeof generos)[number];
export type ShirtSize = (typeof tallas)[number];
export type Stay = (typeof estadias)[number];
export type Extra = (typeof extras)[number];
export type PaymentPlan = (typeof planesPago)[number];

export type Health = {
  illness: string | null;
  allergies: string | null;
  exercises: boolean;
};

/** Datos que se piden a cada corredor, titular o acompañante. */
export type Person = {
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  document: string;
  birthDate: string;
  gender: Gender;
  city: string;
  health: Health;
  stay: Stay;
};

/** El acompañante puede comprar kit; solo entonces tiene talla. */
export type Companion = Person & { kit: boolean; shirtSize: ShirtSize | null };

export type PaymentConcept = 'Separación de cupo' | 'Pago total' | 'Pago de saldo';

/** La organización aprueba un pago cuando verifica que llegó a la llave Bre-B. */
export type PaymentReview = 'Por revisar' | 'Aprobado' | 'Rechazado';

export type Payment = {
  id: string;
  concept: PaymentConcept;
  amount: number;
  date: string;
  review: PaymentReview;
  rejectionReason: string | null;
};

/** El titular siempre compra kit y es el único con teléfono y correo. */
export type Registration = Person & {
  id: string;
  createdAt: string;
  phone: string;
  email: string;
  shirtSize: ShirtSize;
  companion: Companion | null;
  extras: Extra[];
  plan: PaymentPlan;
  /** Fecha elegida para pagar todo el restante; null si paga el total al reservar. */
  commitmentDate: string | null;
  payments: Payment[];
};

/** Lo que envía el sitio público; el servicio asigna id, fecha y el pago esperado. */
export type NewRegistration = Omit<Registration, 'id' | 'createdAt' | 'payments'>;

/** El estado de una inscripción no se guarda: se deriva de sus pagos. */
export type RegistrationStatus =
  'Por verificar' | 'Saldo pendiente' | 'Vencido' | 'Pagado' | 'Rechazado';

/** Todo lo que persiste el sistema de reservas. */
export type ReservasState = {
  version: 1;
  registrations: Registration[];
  capacity: number;
  /** Contadores de los últimos ids asignados; no dependen de cuántos registros hay. */
  counters: { registration: number; payment: number };
};

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };
