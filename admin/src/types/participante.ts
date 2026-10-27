export type DocumentType = 'CC' | 'TI' | 'CE' | 'Pasaporte';

export type Gender = 'Femenino' | 'Masculino' | 'Otro';

export type ShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type Stay = 'Páramo' | 'Hotel en Manaure';

export type Health = {
  illness: string | null;
  allergies: string | null;
  exercises: boolean;
};

export type Companion = {
  name: string;
  document: string;
  stay: Stay;
  health: Health;
  kit: boolean;
  shirtSize: ShirtSize | null;
};

export type PaymentPlan = 'Completo' | 'Separación';

export type PaymentConcept = 'Separación de cupo' | 'Pago total' | 'Pago de saldo';

export type PaymentReview = 'Por revisar' | 'Aprobado' | 'Rechazado';

export type Payment = {
  id: string;
  concept: PaymentConcept;
  amount: number;
  date: string;
  reference: string;
  review: PaymentReview;
  rejectionReason: string | null;
};

export type Registration = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  document: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: Gender;
  shirtSize: ShirtSize;
  stay: Stay;
  health: Health;
  companion: Companion | null;
  extras: { cuatrimoto: boolean; parapente: boolean };
  plan: PaymentPlan;
  commitmentDate: string | null;
  payments: Payment[];
};

export type RegistrationStatus =
  'Por verificar' | 'Saldo pendiente' | 'Vencido' | 'Pagado' | 'Rechazado';
