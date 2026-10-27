import { useState, type FormEvent } from 'react';
import { contacto, evento, precios } from '../../../shared/config';
import { formatDate, formatMoney } from '../../../shared/utils/format';
import { describePerson, getQuote, readPerson, whatsappLink } from '../utils/reserva';
import type { Estadia, Extra, PagoKitAcompanante, PlanTitular } from '../types/reserva';

export function useReserva(stay: Estadia) {
  const [plan, setPlan] = useState<PlanTitular>('total');
  const [planDate, setPlanDate] = useState('');
  const [companion, setCompanion] = useState(false);
  const [companionKit, setCompanionKit] = useState(false);
  const [companionPago, setCompanionPago] = useState<PagoKitAcompanante>('inmediato');
  const [companionDate, setCompanionDate] = useState('');
  const [extras, setExtras] = useState<Extra[]>([]);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{ text: string; link: string | null } | null>(null);

  const quote = getQuote({ plan, companion, companionKit, companionPago, extras });
  const extrasTotal = extras.reduce((sum, item) => sum + precios[item], 0);
  const needsHolderDate = plan === 'apartado';
  const needsCompanionDate = companion && companionKit && companionPago === 'diferido';

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
    const lines = [
      'RESERVA · TREKKING DESAFÍO PERIJÁ 13K',
      evento.fechasTexto + ' · Manaure, Cesar',
      '',
      'PARTICIPANTE',
      ...describePerson(readPerson(data, '', true)),
      'Estadía: ' + stay,
      'Modalidad: ' + (plan === 'total' ? 'Inscripción + kit (pago total)' : 'Solo inscripción'),
      ...(needsHolderDate ? ['Fecha de pago del saldo del kit: ' + formatDate(planDate)] : []),
      '',
      ...(companion
        ? [
            'ACOMPAÑANTE',
            ...describePerson(readPerson(data, 'acomp', companionKit)),
            'Estadía del acompañante: ' + String(data.get('acompEstadia')),
            'Kit del acompañante: ' +
              (companionKit
                ? 'Sí, pago ' +
                  (companionPago === 'diferido'
                    ? 'diferido, saldo el ' + formatDate(companionDate)
                    : 'inmediato')
                : 'No'),
            '',
          ]
        : ['Acompañante: No', '']),
      'Actividades extra: ' + (extras.length ? extras.join(', ') : 'Ninguna'),
      'A pagar ahora por Nequi: ' + formatMoney(quote.ahora),
      'Saldo pendiente: ' + formatMoney(quote.saldoTitular + quote.saldoAcompanante),
      'Total: ' + formatMoney(quote.total),
    ];
    const text = lines.join('\n');
    setPreview({ text, link: whatsappLink(contacto.whatsapp, text) });
  }

  return {
    plan,
    setPlan,
    planDate,
    setPlanDate,
    companion,
    setCompanion,
    companionKit,
    setCompanionKit,
    companionPago,
    setCompanionPago,
    companionDate,
    setCompanionDate,
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
