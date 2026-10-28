import { useState, type ChangeEvent, type FormEvent } from 'react';
import { precios } from '../../../../shared/config';
import {
  getBalance,
  getCharges,
  getHealthAlerts,
  getRunners,
  metodoPago,
  reservasApi,
  summarize,
  useReservas,
  type Registration,
  type Runner,
} from '../../../../shared/reservas';
import { formatDate, formatMoney } from '../../../../shared/utils/format';
import { classNames } from '../../utils/comun/classNames';
import { daysBetween, describeDeadline, getAge } from '../../utils/comun/fechas';

type Fact = { label: string; value: string };

function birthFact(birthDate: string, today: string): Fact {
  return {
    label: 'Nacimiento',
    value:
      formatDate(birthDate) +
      ' de ' +
      birthDate.slice(0, 4) +
      ' · ' +
      getAge(birthDate, today) +
      ' años',
  };
}

function contactFacts(registration: Registration, today: string): Fact[] {
  return [
    { label: 'Teléfono', value: registration.phone },
    { label: 'Correo', value: registration.email },
    birthFact(registration.birthDate, today),
    { label: 'Género', value: registration.gender },
  ];
}

function runnerView(runner: Runner, extraFacts: Fact[] = []) {
  const alerts = getHealthAlerts(runner.health);

  return {
    key: runner.role,
    role: runner.role,
    name: runner.name,
    document: runner.document,
    facts: [
      ...extraFacts,
      { label: 'Ciudad', value: runner.city },
      { label: 'Estadía', value: runner.stay },
      { label: 'Kit', value: runner.kit ? 'Sí · talla ' + runner.shirtSize : 'Sin kit' },
    ],
    alerts,
    hasAlerts: alerts.length > 0,
    healthClass: classNames('reg-health', alerts.length > 0 && 'has-alerts'),
    alertsLabel: 'Alertas de salud de ' + runner.name,
  };
}

export type RunnerView = ReturnType<typeof runnerView>;

export function useRegistrationDetail(registrationId: string) {
  const { registrations, today } = useReservas();
  const registration = registrations.find((item) => item.id === registrationId);
  const [amount, setAmount] = useState<number | ''>(() =>
    registration ? getBalance(registration) : '',
  );
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!registration) return null;

  const { status, total, paid, balance, pending } = summarize(registration, today);
  const [titular, companion] = getRunners(registration);
  const daysLeft = registration.commitmentDate
    ? daysBetween(today, registration.commitmentDate)
    : null;

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!registration || saving) return;
    const value = amount === '' ? balance : amount;

    setSaving(true);
    setFeedback('');
    setError('');
    const result = await reservasApi.registrarPago(registration.id, value);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setAmount(balance - value);
    setFeedback('Pago de ' + formatMoney(value) + ' registrado como aprobado.');
  }

  return {
    meta: registration.id + ' · registrado el ' + formatDate(registration.createdAt),
    status,
    money: [
      { label: 'Total', value: formatMoney(total), className: '' },
      { label: 'Aprobado', value: formatMoney(paid), className: '' },
      {
        label: 'Saldo',
        value: formatMoney(balance),
        className: balance > 0 ? 'is-due' : 'is-clear',
      },
    ],
    plan:
      registration.plan === 'total'
        ? { text: 'Eligió pagar el total en un solo pago.', date: null, deadline: null }
        : {
            text:
              'Separó el cupo con ' +
              formatMoney(precios.inscripcion) +
              ' y se comprometió a pagar el resto el ',
            date: registration.commitmentDate && formatDate(registration.commitmentDate),
            deadline: balance > 0 && daysLeft !== null ? ' · ' + describeDeadline(daysLeft) : null,
          },
    deadlineClass: classNames(daysLeft !== null && daysLeft < 0 && 'is-late'),
    overdue: status === 'Vencido',
    titular: runnerView(titular, contactFacts(registration, today)),
    companion:
      companion && registration.companion
        ? runnerView(companion, [
            birthFact(registration.companion.birthDate, today),
            { label: 'Género', value: registration.companion.gender },
          ])
        : null,
    charges: getCharges(registration).map((charge) => ({
      label: charge.label,
      amount: formatMoney(charge.amount),
    })),
    total: formatMoney(total),
    payments: registration.payments.map((payment) => ({
      id: payment.id,
      concept: payment.concept,
      detail: formatDate(payment.date) + ' · ' + metodoPago.label,
      reason: payment.rejectionReason,
      amount: formatMoney(payment.amount),
      review: payment.review,
      canReview: payment.review === 'Por revisar',
    })),
    hasPayments: registration.payments.length > 0,
    form: {
      visible: balance > 0 && pending.length === 0,
      amount,
      max: balance,
      placeholder: String(balance),
      changeAmount: (event: ChangeEvent<HTMLInputElement>) =>
        setAmount(event.target.value === '' ? '' : Number(event.target.value)),
      submit: submitPayment,
      saving,
      title: 'Registrar pago recibido por ' + metodoPago.label,
    },
    paymentsTitle: 'Pagos por ' + metodoPago.label,
    feedback,
    error,
  };
}
