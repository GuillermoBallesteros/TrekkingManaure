import { useState, type ChangeEvent, type FormEvent } from 'react';
import { formatDate, formatMoney } from '../../../../shared/utils/format';
import { useAdminPreview } from '../../context/AdminPreviewContext';
import { tarifas } from '../../data/comun/tarifas';
import type { PaymentConcept, Registration } from '../../types/participante';
import { classNames } from '../../utils/comun/classNames';
import { daysBetween, describeDeadline, getAge } from '../../utils/comun/fechas';
import {
  getBalance,
  getCharges,
  getHealthAlerts,
  getRunners,
  summarize,
  type Runner,
} from '../../utils/comun/inscripcion';

type Fact = { label: string; value: string };

function contactFacts(registration: Registration, today: string): Fact[] {
  return [
    { label: 'Teléfono', value: registration.phone },
    { label: 'Correo', value: registration.email },
    {
      label: 'Nacimiento',
      value:
        formatDate(registration.birthDate) +
        ' de ' +
        registration.birthDate.slice(0, 4) +
        ' · ' +
        getAge(registration.birthDate, today) +
        ' años',
    },
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
      { label: 'Estadía', value: runner.stay },
      { label: 'Kit', value: runner.kit ? 'Sí · talla ' + runner.shirtSize : 'Sin kit' },
    ],
    alerts,
    hasAlerts: alerts.length > 0,
    healthClass: classNames('reg-health', alerts.length > 0 && 'has-alerts'),
    alertsLabel: 'Alertas de salud de ' + runner.name,
  };
}

function conceptFor(paid: number, amount: number, total: number): PaymentConcept {
  if (paid > 0) return 'Pago de saldo';
  return amount >= total ? 'Pago total' : 'Separación de cupo';
}

export type RunnerView = ReturnType<typeof runnerView>;

export function useRegistrationDetail(registrationId: string) {
  const { registrations, today, addPayment } = useAdminPreview();
  const registration = registrations.find((item) => item.id === registrationId);
  const [amount, setAmount] = useState<number | ''>(() =>
    registration ? getBalance(registration) : '',
  );
  const [reference, setReference] = useState('');
  const [feedback, setFeedback] = useState('');

  if (!registration) return null;

  const { status, total, paid, balance, pending } = summarize(registration, today);
  const [titular, companion] = getRunners(registration);
  const daysLeft = registration.commitmentDate
    ? daysBetween(today, registration.commitmentDate)
    : null;

  function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!registration) return;
    const value = amount === '' ? balance : amount;

    addPayment(registration.id, {
      concept: conceptFor(paid, value, total),
      amount: value,
      reference: reference.trim(),
    });
    setAmount(balance - value);
    setReference('');
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
      registration.plan === 'Completo'
        ? { text: 'Eligió pagar el total en un solo pago.', date: null, deadline: null }
        : {
            text:
              'Separó el cupo con ' +
              formatMoney(tarifas.separacion) +
              ' y se comprometió a pagar el resto el ',
            date: registration.commitmentDate && formatDate(registration.commitmentDate),
            deadline: balance > 0 && daysLeft !== null ? ' · ' + describeDeadline(daysLeft) : null,
          },
    deadlineClass: classNames(daysLeft !== null && daysLeft < 0 && 'is-late'),
    overdue: status === 'Vencido',
    titular: runnerView(titular, contactFacts(registration, today)),
    companion: companion ? runnerView(companion) : null,
    charges: getCharges(registration).map((charge) => ({
      label: charge.label,
      amount: formatMoney(charge.amount),
    })),
    total: formatMoney(total),
    payments: registration.payments.map((payment) => ({
      id: payment.id,
      concept: payment.concept,
      detail: formatDate(payment.date) + ' · Ref. ' + payment.reference,
      reason: payment.rejectionReason,
      amount: formatMoney(payment.amount),
      review: payment.review,
      canReview: payment.review === 'Por revisar',
    })),
    hasPayments: registration.payments.length > 0,
    form: {
      visible: balance > 0 && pending.length === 0,
      amount,
      reference,
      max: balance,
      placeholder: String(balance),
      changeAmount: (event: ChangeEvent<HTMLInputElement>) =>
        setAmount(event.target.value === '' ? '' : Number(event.target.value)),
      changeReference: (event: ChangeEvent<HTMLInputElement>) => setReference(event.target.value),
      submit: submitPayment,
    },
    feedback,
  };
}
