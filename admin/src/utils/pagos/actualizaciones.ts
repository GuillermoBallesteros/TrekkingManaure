import type { Payment, PaymentReview, Registration } from '../../types/participante';

export type NewPayment = Pick<Payment, 'concept' | 'amount' | 'reference'>;

function updatePayments(
  registrations: Registration[],
  registrationId: string,
  update: (payments: Payment[]) => Payment[],
) {
  return registrations.map((registration) =>
    registration.id === registrationId
      ? { ...registration, payments: update(registration.payments) }
      : registration,
  );
}

export function applyReview(
  registrations: Registration[],
  registrationId: string,
  paymentId: string,
  review: PaymentReview,
  reason: string | null,
) {
  return updatePayments(registrations, registrationId, (payments) =>
    payments.map((payment) =>
      payment.id === paymentId
        ? { ...payment, review, rejectionReason: review === 'Rechazado' ? reason : null }
        : payment,
    ),
  );
}

function nextPaymentId(registrations: Registration[]) {
  const count = registrations.reduce((sum, registration) => sum + registration.payments.length, 0);
  return 'PAG-' + String(count + 1).padStart(3, '0');
}

// Un pago registrado por el equipo ya fue verificado en Nequi, por eso entra aprobado.
export function appendApprovedPayment(
  registrations: Registration[],
  registrationId: string,
  payment: NewPayment,
  date: string,
) {
  const id = nextPaymentId(registrations);

  return updatePayments(registrations, registrationId, (payments) => [
    ...payments,
    { ...payment, id, date, review: 'Aprobado', rejectionReason: null },
  ]);
}
