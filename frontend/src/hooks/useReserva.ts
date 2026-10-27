import { useState, type FormEvent } from 'react';
import { precios } from '../../../shared/config';
import { formatDate, formatMoney } from '../../../shared/utils/format';
import { getQuote, readPerson } from '../utils/reserva';
import type {
  Estadia,
  Extra,
  PagoKitAcompanante,
  PlanTitular,
  ResumenReservaTexto,
} from '../types/reserva';

export function useReserva(stay: Estadia) {
  // null = todavía no elegido: la persona debe marcarlo, no viene preseleccionado.
  const [plan, setPlan] = useState<PlanTitular | null>(null);
  const [planDate, setPlanDate] = useState('');
  const [companion, setCompanion] = useState(false);
  const [companionKit, setCompanionKit] = useState<boolean | null>(null);
  const [companionPago, setCompanionPago] = useState<PagoKitAcompanante | null>(null);
  const [companionDate, setCompanionDate] = useState('');
  const [extras, setExtras] = useState<Extra[]>([]);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<ResumenReservaTexto | null>(null);

  const quote = getQuote({ plan, companion, companionKit, companionPago, extras });
  const extrasTotal = extras.reduce((sum, item) => sum + precios[item], 0);
  const needsHolderDate = plan === 'apartado';
  const needsCompanionDate = companion && companionKit === true && companionPago === 'diferido';

  function toggleExtra(extra: Extra) {
    setExtras((current) =>
      current.includes(extra) ? current.filter((item) => item !== extra) : [...current, extra],
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;

    if (!form.reportValidity()) return;
    if (!stay) {
      setError('Elige tu estadía.');
      return;
    }
    if (needsHolderDate && !planDate) {
      setError('Elige la fecha en que pagarás el saldo del kit.');
      return;
    }
    if (needsCompanionDate && !companionDate) {
      setError('Elige la fecha en que pagarás el saldo del kit del acompañante.');
      return;
    }

    const data = new FormData(form);
    setPreview({
      participante: readPerson(data, '', true),
      estadia: stay,
      modalidad: plan === 'total' ? 'Inscripción + kit (pago total)' : 'Solo inscripción',
      fechaSaldo: needsHolderDate ? formatDate(planDate) : null,
      acompanante: companion
        ? {
            persona: readPerson(data, 'acomp', companionKit === true),
            estadia: String(data.get('acompEstadia')),
            kit: companionKit
              ? 'Sí, pago ' +
                (companionPago === 'diferido'
                  ? 'diferido, saldo el ' + formatDate(companionDate)
                  : 'inmediato')
              : 'No',
          }
        : null,
      extras: extras.length ? extras.join(', ') : 'Ninguna',
      ahora: formatMoney(quote.ahora),
      saldo: formatMoney(quote.saldoTitular + quote.saldoAcompanante),
      total: formatMoney(quote.total),
    });
  }

  return {
    plan,
    setPlan,
    planDate,
    setPlanDate,
    needsHolderDate,
    companion,
    setCompanion,
    companionKit,
    setCompanionKit,
    companionPago,
    setCompanionPago,
    companionDate,
    setCompanionDate,
    needsCompanionDate,
    extras,
    toggleExtra,
    error,
    preview,
    setPreview,
    quote,
    extrasTotal,
    submit,
  };
}
