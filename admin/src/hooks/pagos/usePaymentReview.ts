import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { formatDate, formatMoney } from '../../../../shared/utils/format';
import { useAdminPreview } from '../../context/AdminPreviewContext';
import { motivosRechazo, otroMotivo } from '../../data/pagos/motivos';
import type { Payment, PaymentReview, Registration } from '../../types/participante';
import { classNames } from '../../utils/comun/classNames';
import {
  fullName,
  getExpectedAmount,
  getStatus,
  summarize,
  withReview,
} from '../../utils/comun/inscripcion';

type Filter = PaymentReview | 'Todos';

type Item = { registration: Registration; payment: Payment };

type LastAction = {
  registrationId: string;
  paymentId: string;
  review: PaymentReview;
  reason: string | null;
  message: string;
};

const filters: Filter[] = ['Por revisar', 'Aprobado', 'Rechazado', 'Todos'];

const filterLabels: Record<Filter, string> = {
  'Por revisar': 'Por revisar',
  Aprobado: 'Aprobados',
  Rechazado: 'Rechazados',
  Todos: 'Todos',
};

function byQueueOrder(a: Item, b: Item) {
  const pendingFirst =
    Number(b.payment.review === 'Por revisar') - Number(a.payment.review === 'Por revisar');
  if (pendingFirst) return pendingFirst;
  return a.payment.review === 'Por revisar'
    ? a.payment.date.localeCompare(b.payment.date)
    : b.payment.date.localeCompare(a.payment.date);
}

function decisionMessage(name: string, review: PaymentReview, nextStatus: string) {
  if (review === 'Aprobado')
    return 'Pago de ' + name + ' aprobado. Inscripción: ' + nextStatus + '.';
  if (review === 'Rechazado') return 'Pago de ' + name + ' rechazado. Avísale por WhatsApp.';
  return 'El pago de ' + name + ' volvió a revisión.';
}

function amountCheck(registration: Registration, payment: Payment) {
  const expected = getExpectedAmount(registration, payment);
  const difference = payment.amount - expected;

  if (difference === 0) {
    return {
      ok: true,
      className: 'review-check is-ok',
      icon: 'check' as const,
      expected: formatMoney(expected),
      message:
        'El monto coincide con lo esperado para este concepto (' + formatMoney(expected) + ').',
    };
  }

  return {
    ok: false,
    className: 'review-check is-warn',
    icon: 'info' as const,
    expected: formatMoney(expected),
    message:
      'El comprobante tiene ' +
      formatMoney(Math.abs(difference)) +
      (difference < 0
        ? ' menos. Si lo apruebas, cuenta como abono y el resto queda pendiente.'
        : ' más.'),
  };
}

function panelView(item: Item, today: string) {
  const { registration, payment } = item;
  const summary = summarize(registration, today);
  const approved = summarize(withReview(registration, payment.id, 'Aprobado'), today);
  const paidBefore = summary.paid - (payment.review === 'Aprobado' ? payment.amount : 0);

  return {
    concept: payment.concept,
    amount: formatMoney(payment.amount),
    person: fullName(registration) + ' · ' + registration.id,
    review: payment.review,
    check: amountCheck(registration, payment),
    facts: [
      { label: 'Referencia Nequi', value: payment.reference },
      { label: 'Fecha del comprobante', value: formatDate(payment.date) },
      {
        label: 'Plan elegido',
        value:
          registration.plan === 'Completo'
            ? 'Pago total'
            : 'Separación · saldo el ' + formatDate(registration.commitmentDate || today),
      },
      { label: 'Total de la inscripción', value: formatMoney(summary.total) },
      { label: 'Aprobado antes de este pago', value: formatMoney(paidBefore) },
      {
        label: 'Grupo',
        value: registration.companion ? 'Titular + acompañante' : 'Solo titular',
      },
    ],
    approvedStatus: approved.status,
    approvedText:
      approved.balance > 0 ? 'Saldo ' + formatMoney(approved.balance) : 'Inscripción pagada',
    rejectedStatus: getStatus(withReview(registration, payment.id, 'Rechazado'), today),
    isPending: payment.review === 'Por revisar',
    decidedText:
      payment.review === 'Aprobado'
        ? 'Este pago ya se aprobó y cuenta en el saldo de la inscripción.'
        : 'Motivo del rechazo: ' + (payment.rejectionReason || 'sin especificar') + '.',
  };
}

export function usePaymentReview() {
  const { registrations, today, reviewPayment, focusPaymentId, setFocusPaymentId } =
    useAdminPreview();
  const [filter, setFilter] = useState<Filter>('Por revisar');
  const [selectedId, setSelectedId] = useState<string | null>(focusPaymentId);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (focusPaymentId) setFocusPaymentId(null);
  }, [focusPaymentId, setFocusPaymentId]);

  const all: Item[] = registrations.flatMap((registration) =>
    registration.payments.map((payment) => ({ registration, payment })),
  );
  const count = (value: Filter) =>
    all.filter((item) => value === 'Todos' || item.payment.review === value).length;
  const items = all
    .filter((item) => filter === 'Todos' || item.payment.review === filter)
    .sort(byQueueOrder);
  const current = items.find((item) => item.payment.id === selectedId) || items[0];
  const pendingTotal = all
    .filter((item) => item.payment.review === 'Por revisar')
    .reduce((sum, item) => sum + item.payment.amount, 0);
  const rejection = reason === otroMotivo ? note.trim() : reason;

  function resetRejection() {
    setRejecting(false);
    setReason('');
    setNote('');
  }

  function selectFilter(value: Filter) {
    setFilter(value);
    setSelectedId(null);
    resetRejection();
  }

  function selectPayment(id: string) {
    setSelectedId(id);
    resetRejection();
    if (window.matchMedia('(max-width: 900px)').matches) {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function decide(review: PaymentReview, rejectionReason: string | null = null) {
    if (!current) return;
    const { registration, payment } = current;
    const next = getStatus(withReview(registration, payment.id, review), today);

    reviewPayment(registration.id, payment.id, review, rejectionReason);
    setLastAction({
      registrationId: registration.id,
      paymentId: payment.id,
      review: payment.review,
      reason: payment.rejectionReason,
      message: decisionMessage(fullName(registration), review, next),
    });
    setSelectedId(review === 'Por revisar' ? payment.id : null);
    if (review === 'Por revisar' && filter !== 'Todos') setFilter('Por revisar');
    resetRejection();
  }

  function undo() {
    if (!lastAction) return;
    reviewPayment(
      lastAction.registrationId,
      lastAction.paymentId,
      lastAction.review,
      lastAction.reason,
    );
    setSelectedId(lastAction.paymentId);
    if (filter !== 'Todos' && filter !== lastAction.review) setFilter(lastAction.review);
    setLastAction(null);
  }

  function confirmReject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rejection) decide('Rechazado', rejection);
  }

  return {
    pendingLabel: count('Por revisar') + ' por revisar · ' + formatMoney(pendingTotal),
    filters: filters.map((value) => ({
      value,
      label: filterLabels[value],
      count: count(value),
      pressed: filter === value,
      className: classNames(filter === value && 'is-active'),
    })),
    selectFilter,
    toast: lastAction?.message ?? null,
    undo,
    dismissToast: () => setLastAction(null),
    isEmpty: !current,
    emptyTitle: filter === 'Por revisar' ? 'Todo al día' : 'Sin pagos en esta vista',
    emptyText:
      filter === 'Por revisar'
        ? 'No quedan comprobantes por revisar.'
        : 'Cambia el filtro para ver otros pagos.',
    queue: items.map(({ registration, payment }) => {
      const selected = payment.id === current?.payment.id;
      return {
        id: payment.id,
        name: fullName(registration),
        amount: formatMoney(payment.amount),
        detail: payment.concept + ' · ' + formatDate(payment.date),
        review: payment.review,
        showStatus: payment.review !== 'Por revisar',
        mismatch:
          payment.review === 'Por revisar' &&
          payment.amount !== getExpectedAmount(registration, payment),
        current: selected ? ('true' as const) : undefined,
        className: classNames('review-item', selected && 'is-selected'),
      };
    }),
    selectPayment,
    panel: current ? panelView(current, today) : null,
    panelKey: current?.payment.id ?? '',
    panelRef,
    rejecting,
    reasons: [...motivosRechazo, otroMotivo].map((option) => ({
      value: option,
      checked: reason === option,
      className: classNames(reason === option && 'is-checked'),
    })),
    isOtherReason: reason === otroMotivo,
    note,
    canReject: rejection.length > 0,
    startReject: () => setRejecting(true),
    cancelReject: resetRejection,
    selectReason: setReason,
    changeNote: (event: ChangeEvent<HTMLTextAreaElement>) => setNote(event.target.value),
    confirmReject,
    approve: () => decide('Aprobado'),
    reopen: () => decide('Por revisar'),
    footLabel: items.length + ' pagos en esta vista · los más antiguos primero',
    detailOpen: detailOpen && !!current,
    detailTitle: current ? fullName(current.registration) : 'Inscripción',
    detailRegistrationId: detailOpen && current ? current.registration.id : null,
    openDetail: () => setDetailOpen(true),
    closeDetail: () => setDetailOpen(false),
  };
}

export type PaymentReviewView = ReturnType<typeof usePaymentReview>;
