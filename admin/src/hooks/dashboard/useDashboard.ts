import { formatDate, formatMoney } from '../../../../shared/utils/format';
import { useAdminPreview } from '../../context/AdminPreviewContext';
import { fechaLimiteSaldo } from '../../data/comun/tarifas';
import type { RegistrationStatus } from '../../types/participante';
import { classNames } from '../../utils/comun/classNames';
import { getAvailability } from '../../utils/cupos/disponibilidad';
import { daysBetween, describeDeadline } from '../../utils/comun/fechas';
import {
  countRunners,
  fullName,
  statusClass,
  statusOrder,
  summarize,
} from '../../utils/comun/inscripcion';
import { padCount, plural } from '../../utils/comun/texto';

export function useDashboard() {
  const { registrations, today, capacity, setFocusPaymentId } = useAdminPreview();
  const summaries = registrations.map((registration) => summarize(registration, today));
  const count = (status: RegistrationStatus) =>
    summaries.filter((summary) => summary.status === status).length;
  const secured = countRunners(
    summaries.filter((summary) => summary.paid > 0).map((summary) => summary.registration),
  );
  const availability = getAvailability(secured, capacity);
  const reviews = summaries
    .flatMap((summary) => summary.pending.map((payment) => ({ summary, payment })))
    .sort((a, b) => a.payment.date.localeCompare(b.payment.date));
  const debts = summaries
    .filter((summary) => summary.status === 'Saldo pendiente' || summary.status === 'Vencido')
    .sort((a, b) =>
      (a.registration.commitmentDate || '').localeCompare(b.registration.commitmentDate || ''),
    );
  const receivable = debts.reduce((sum, summary) => sum + summary.balance, 0);
  const collected = summaries.reduce((sum, summary) => sum + summary.paid, 0);
  const declared = reviews.reduce((sum, item) => sum + item.payment.amount, 0);

  const metrics = [
    {
      title: 'Inscripciones',
      value: padCount(registrations.length),
      note:
        countRunners(registrations) + ' corredores · ' + availability.available + ' cupos libres',
      icon: 'users' as const,
    },
    {
      title: 'Pagos por revisar',
      value: padCount(reviews.length),
      note: formatMoney(declared) + ' declarados',
      icon: 'sheet' as const,
    },
    {
      title: 'Por cobrar',
      value: formatMoney(receivable),
      note:
        plural(count('Saldo pendiente'), 'saldo pendiente', 'saldos pendientes') +
        ' · ' +
        plural(count('Vencido'), 'vencido', 'vencidos'),
      icon: 'clock' as const,
    },
    {
      title: 'Recaudado',
      value: formatMoney(collected),
      note: 'Pagos aprobados por Nequi · COP',
      icon: 'check' as const,
    },
  ].map((metric, index) => ({
    ...metric,
    className: classNames('admin-metric', index === 1 && 'admin-metric--warm'),
  }));

  let accumulated = 0;
  const segments = statusOrder.map((status) => {
    const start = accumulated;
    accumulated += (count(status) / Math.max(1, summaries.length)) * 100;
    return 'var(--estado-' + statusClass(status) + ') ' + start + '% ' + accumulated + '%';
  });

  return {
    metrics,
    donutStyle: { background: 'conic-gradient(' + segments.join(', ') + ')' },
    donutLabel: statusOrder.map((status) => count(status) + ' ' + status.toLowerCase()).join(', '),
    totalLabel: padCount(summaries.length),
    legend: statusOrder.map((status) => ({
      status,
      count: count(status),
      dotClass: 'legend-dot legend-dot--' + statusClass(status),
    })),
    deadlineLabel: formatDate(fechaLimiteSaldo),
    reviews: reviews.slice(0, 5).map(({ summary, payment }) => ({
      id: payment.id,
      name: fullName(summary.registration),
      detail: payment.concept + ' · ' + formatDate(payment.date),
      amount: formatMoney(payment.amount),
      ariaLabel: 'Revisar pago de ' + fullName(summary.registration),
    })),
    hasReviews: reviews.length > 0,
    debts: debts.slice(0, 5).map((summary) => ({
      id: summary.registration.id,
      name: fullName(summary.registration),
      detail:
        formatDate(summary.registration.commitmentDate || today) +
        ' · ' +
        describeDeadline(daysBetween(today, summary.registration.commitmentDate || today)),
      amount: formatMoney(summary.balance),
      status: summary.status,
    })),
    hasDebts: debts.length > 0,
    focusPayment: setFocusPaymentId,
  };
}
