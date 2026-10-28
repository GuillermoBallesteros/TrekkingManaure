import { useState, type ChangeEvent, type FormEvent } from 'react';
import { precios } from '../../../../shared/config';
import {
  countHotelNights,
  countHotelPeople,
  epsLabel,
  formatPhone,
  getBalance,
  getCharges,
  getHealthAlerts,
  getRunners,
  isMinor,
  metodoPago,
  reservasApi,
  summarize,
  useReservas,
  type Registration,
  type Runner,
} from '../../../../shared/reservas';
import { formatDate, formatDateTime, formatMoney } from '../../../../shared/utils/format';
import { classNames } from '../../utils/comun/classNames';
import { daysBetween, describeDeadline, getAge } from '../../utils/comun/fechas';

type Fact = { label: string; value: string };

const siNo = (value: boolean) => (value ? 'Sí' : 'No');

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

/** Mismos datos para titular y acompañante; `responsable` renombra el contacto del menor. */
function runnerView(runner: Runner, today: string, responsable = false) {
  const { person } = runner;
  const contact = person.emergencyContact;
  const alerts = getHealthAlerts(runner.health);

  return {
    key: runner.role,
    role: runner.role,
    name: runner.name,
    document: runner.document,
    facts: [
      birthFact(person.birthDate, today),
      { label: 'Género', value: person.gender },
      { label: 'Celular', value: formatPhone(person.phone) },
      { label: 'Correo', value: person.email },
      { label: 'Ciudad', value: runner.city },
      { label: 'EPS', value: epsLabel(person.eps) },
      {
        label: responsable ? 'Responsable legal' : 'Contacto de emergencia',
        value: contact.name + ' · ' + contact.relationship + ' · ' + formatPhone(contact.phone),
      },
      { label: 'Estadía', value: runner.stay },
      { label: 'Kit', value: runner.kit ? 'Sí · talla ' + runner.shirtSize : 'Sin kit' },
      { label: 'Parapente', value: siNo(runner.paragliding) },
      {
        label: 'Compromisos',
        value:
          'Áreas protegidas: ' +
          siNo(person.commitments.protectedAreas) +
          ' · Medio ambiente: ' +
          siNo(person.commitments.environment),
      },
      {
        label: 'Términos',
        value: person.consent.acceptedAt
          ? 'Aceptados el ' +
            formatDateTime(person.consent.acceptedAt) +
            ' · ' +
            person.consent.version
          : 'Sin aceptación registrada',
      },
      {
        label: 'Uso de imagen',
        value: person.consent.imageUse ? 'Autorizado' : 'No autorizado',
      },
    ],
    alerts,
    hasAlerts: alerts.length > 0,
    healthClass: classNames('reg-health', alerts.length > 0 && 'has-alerts'),
    alertsLabel: 'Alertas de salud de ' + runner.name,
  };
}

function hotelText(registration: Registration) {
  const hotel = registration.preEventHotel;
  if (!hotel) return null;
  const nights = countHotelNights(hotel);
  const people = countHotelPeople(hotel, registration.companion !== null);
  return (
    'Hotel antes del evento: llega el ' +
    formatDate(hotel.checkIn) +
    ' y sale el ' +
    formatDate(hotel.checkOut) +
    ' · ' +
    nights +
    (nights === 1 ? ' noche' : ' noches') +
    ' × ' +
    people +
    (people === 1 ? ' persona.' : ' personas.')
  );
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
  const [authorizing, setAuthorizing] = useState(false);

  if (!registration) return null;

  const { status, total, paid, balance, pending } = summarize(registration, today);
  const [titular, companion] = getRunners(registration);
  const daysLeft = registration.commitmentDate
    ? daysBetween(today, registration.commitmentDate)
    : null;

  const minor = isMinor(registration.birthDate, today);

  async function toggleGuardian(event: ChangeEvent<HTMLInputElement>) {
    if (!registration || authorizing) return;
    const received = event.target.checked;
    setAuthorizing(true);
    setFeedback('');
    setError('');
    const result = await reservasApi.fijarAutorizacionMenor(registration.id, received);
    setAuthorizing(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setFeedback(
      received
        ? 'Autorización del responsable marcada como recibida.'
        : 'Autorización del responsable marcada como pendiente.',
    );
  }

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
    titular: runnerView(titular, today, minor),
    companion: companion ? runnerView(companion, today) : null,
    hotel: hotelText(registration),
    guardian: minor
      ? {
          checked: registration.guardianAuthorized,
          toggle: toggleGuardian,
          disabled: authorizing,
          text: registration.guardianAuthorized
            ? 'Autorización del responsable recibida. Ya se pueden aprobar sus pagos.'
            : 'Titular menor de edad: falta la autorización firmada de su responsable. Sin ella no se aprueba ningún pago.',
          className: classNames('reg-guardian', !registration.guardianAuthorized && 'is-pending'),
        }
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
