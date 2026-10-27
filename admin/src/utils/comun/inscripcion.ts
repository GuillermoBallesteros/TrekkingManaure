import { tarifas } from '../../data/comun/tarifas';
import type {
  Health,
  Payment,
  Registration,
  RegistrationStatus,
  ShirtSize,
  Stay,
} from '../../types/participante';

export type Charge = { label: string; amount: number };

export type Runner = {
  role: 'Titular' | 'Acompañante';
  name: string;
  document: string;
  stay: Stay;
  health: Health;
  kit: boolean;
  shirtSize: ShirtSize | null;
};

export const statusOrder: RegistrationStatus[] = [
  'Por verificar',
  'Saldo pendiente',
  'Vencido',
  'Pagado',
  'Rechazado',
];

export function fullName(registration: Registration) {
  return registration.firstName + ' ' + registration.lastName;
}

export function getCharges(registration: Registration): Charge[] {
  const charges: Charge[] = [{ label: 'Inscripción y kit del titular', amount: tarifas.titular }];
  const { companion, extras } = registration;

  if (companion) {
    charges.push(
      companion.kit
        ? { label: 'Acompañante con kit', amount: tarifas.acompananteConKit }
        : { label: 'Acompañante sin kit', amount: tarifas.acompananteSinKit },
    );
  }
  if (extras.cuatrimoto) charges.push({ label: 'Paseo en cuatrimoto', amount: tarifas.cuatrimoto });
  if (extras.parapente) charges.push({ label: 'Vuelo en parapente', amount: tarifas.parapente });

  return charges;
}

export function getTotal(registration: Registration) {
  return getCharges(registration).reduce((sum, charge) => sum + charge.amount, 0);
}

export function getPaid(registration: Registration) {
  return registration.payments
    .filter((payment) => payment.review === 'Aprobado')
    .reduce((sum, payment) => sum + payment.amount, 0);
}

export function getBalance(registration: Registration) {
  return Math.max(0, getTotal(registration) - getPaid(registration));
}

export function getPendingPayments(registration: Registration) {
  return registration.payments.filter((payment) => payment.review === 'Por revisar');
}

export function getStatus(registration: Registration, today: string): RegistrationStatus {
  const paid = getPaid(registration);

  if (paid > 0 && paid >= getTotal(registration)) return 'Pagado';
  if (paid > 0) {
    return registration.commitmentDate && registration.commitmentDate < today
      ? 'Vencido'
      : 'Saldo pendiente';
  }
  if (
    !registration.payments.length ||
    registration.payments.some((payment) => payment.review === 'Por revisar')
  ) {
    return 'Por verificar';
  }
  return 'Rechazado';
}

export type Summary = {
  registration: Registration;
  status: RegistrationStatus;
  total: number;
  paid: number;
  balance: number;
  pending: Payment[];
};

export function summarize(registration: Registration, today: string): Summary {
  return {
    registration,
    status: getStatus(registration, today),
    total: getTotal(registration),
    paid: getPaid(registration),
    balance: getBalance(registration),
    pending: getPendingPayments(registration),
  };
}

// Monto que debería traer el comprobante según su concepto y lo ya aprobado.
export function getExpectedAmount(registration: Registration, payment: Payment) {
  if (payment.concept === 'Separación de cupo') return tarifas.separacion;
  if (payment.concept === 'Pago total') return getTotal(registration);

  const paidBefore = registration.payments
    .filter((item) => item.id !== payment.id && item.review === 'Aprobado')
    .reduce((sum, item) => sum + item.amount, 0);
  return Math.max(0, getTotal(registration) - paidBefore);
}

export function withReview(
  registration: Registration,
  paymentId: string,
  review: Payment['review'],
): Registration {
  return {
    ...registration,
    payments: registration.payments.map((payment) =>
      payment.id === paymentId ? { ...payment, review } : payment,
    ),
  };
}

export function getRunners(registration: Registration): Runner[] {
  const runners: Runner[] = [
    {
      role: 'Titular',
      name: fullName(registration),
      document: registration.documentType + ' ' + registration.document,
      stay: registration.stay,
      health: registration.health,
      kit: true,
      shirtSize: registration.shirtSize,
    },
  ];
  const { companion } = registration;

  if (companion) {
    runners.push({
      role: 'Acompañante',
      name: companion.name,
      document: 'CC ' + companion.document,
      stay: companion.stay,
      health: companion.health,
      kit: companion.kit,
      shirtSize: companion.shirtSize,
    });
  }

  return runners;
}

export function getHealthAlerts(health: Health) {
  const alerts: string[] = [];

  if (health.illness) alerts.push('Enfermedad: ' + health.illness);
  if (health.allergies) alerts.push('Alergia: ' + health.allergies);
  if (!health.exercises) alerts.push('No practica deporte con regularidad');

  return alerts;
}

export function hasHealthAlerts(registration: Registration) {
  return getRunners(registration).some((runner) => getHealthAlerts(runner.health).length > 0);
}

export function countRunners(registrations: Registration[]) {
  return registrations.reduce((sum, registration) => sum + (registration.companion ? 2 : 1), 0);
}

export function countPendingReviews(registrations: Registration[]) {
  return registrations.reduce(
    (sum, registration) => sum + getPendingPayments(registration).length,
    0,
  );
}

export function statusClass(status: string) {
  return status.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
}

export function badgeClass(status: string) {
  return 'status-badge status-badge--' + statusClass(status);
}
