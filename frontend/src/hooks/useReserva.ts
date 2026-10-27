import { useState, type FormEvent } from 'react';
import { formatDate, formatMoney } from '../../../shared/utils/format';
import { getQuote, readPerson } from '../utils/reserva';
import type { Estadia, Extra, PlanPago, ResumenReservaTexto } from '../types/reserva';

export function useReserva(stay: Estadia) {
  // null = todavía no elegido: la persona debe marcarlo, no viene preseleccionado.
  const [plan, setPlan] = useState<PlanPago | null>(null);
  const [planDate, setPlanDate] = useState('');
  const [companion, setCompanion] = useState(false);
  const [companionKit, setCompanionKit] = useState<boolean | null>(null);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<ResumenReservaTexto | null>(null);

  const quote = getQuote({ plan, companion, companionKit, extras });
  const needsDate = plan === 'apartado';

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
    if (needsDate && !planDate) {
      setError('Elige la fecha en que pagarás el restante.');
      return;
    }

    const data = new FormData(form);
    setPreview({
      participante: readPerson(data, '', true),
      estadia: stay,
      modalidad: needsDate ? 'Aparta con la inscripción' : 'Pago total',
      fechaRestante: needsDate ? formatDate(planDate) : null,
      acompanante: companion
        ? {
            persona: readPerson(data, 'acomp', companionKit === true),
            estadia: String(data.get('acompEstadia')),
            kit: companionKit ? 'Sí' : 'No',
          }
        : null,
      extras: extras.length ? extras.join(', ') : 'Ninguna',
      ahora: formatMoney(quote.ahora),
      saldo: formatMoney(quote.saldo),
      total: formatMoney(quote.total),
    });
  }

  return {
    plan,
    setPlan,
    planDate,
    setPlanDate,
    needsDate,
    companion,
    setCompanion,
    companionKit,
    setCompanionKit,
    extras,
    toggleExtra,
    error,
    preview,
    setPreview,
    quote,
    submit,
  };
}
