export type PaymentStatus = 'Pendiente' | 'Confirmado' | 'Rechazado';

export type Participant = {
  id: string;
  name: string;
  stay: 'Páramo' | 'Hotel en Manaure';
  status: PaymentStatus;
  amount: number;
  balance: number;
  paymentDate: string;
};
