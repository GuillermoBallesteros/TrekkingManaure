import { useState, type ChangeEvent, type FormEvent } from 'react';
import { plural } from '../../utils/comun/texto';
import {
  capacityRange,
  etiquetasExtra,
  extras,
  estadias,
  getAvailability,
  getRunners,
  reservasApi,
  summarize,
  tallas,
  useReservas,
  type Extra,
} from '../../../../shared/reservas';

export function useCupos() {
  const { registrations, today, capacity } = useReservas();
  const [value, setValue] = useState<number | ''>(capacity);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const secured = registrations
    .map((registration) => summarize(registration, today))
    .filter((summary) => summary.paid > 0);
  const runners = secured.flatMap((summary) =>
    getRunners(summary.registration).map((runner) => ({ ...runner, status: summary.status })),
  );
  const availability = getAvailability(registrations, capacity);
  const range = capacityRange(availability.occupied);
  const kits = runners.filter((runner) => runner.kit);
  const atRisk = kits.filter((runner) => runner.status === 'Vencido').length;
  const countRunners = (match: (runner: (typeof runners)[number]) => boolean) =>
    runners.filter(match).length;
  const countExtras = (extra: Extra) =>
    secured.filter((summary) => summary.registration.extras.includes(extra)).length;

  async function applyCapacity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value === '' || saving) return;
    setSaving(true);
    setFeedback('');
    setError('');
    const result = await reservasApi.fijarCapacidad(value);
    setSaving(false);
    if (result.ok)
      setFeedback('Capacidad actualizada a ' + plural(result.data, 'cupo', 'cupos') + '.');
    else setError(result.error);
  }

  return {
    availability,
    barStyle: { width: availability.percentage + '%' },
    value,
    range,
    limitText: 'Entre ' + range.min + ' (cupos ya ocupados) y ' + range.max + ' cupos.',
    policyText:
      'La capacidad del evento es de ' +
      capacity +
      ' cupos. Solo cambia desde este panel y el sitio público la muestra al instante.',
    feedback,
    error,
    saving,
    changeValue: (event: ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value === '' ? '' : Number(event.target.value)),
    applyCapacity,
    kitsLabel: kits.length + ' kits',
    sizes: tallas.map((size) => ({
      size,
      count: kits.filter((runner) => runner.shirtSize === size).length,
    })),
    riskText: atRisk
      ? atRisk +
        (atRisk === 1 ? ' kit pertenece' : ' kits pertenecen') +
        ' a inscripciones con saldo vencido y puede liberarse.'
      : 'Ningún kit está en riesgo por saldo vencido.',
    logistics: [
      {
        title: 'Estadía',
        icon: 'hotel' as const,
        rows: estadias.map((stay) => ({
          label: stay,
          total: countRunners((runner) => runner.stay === stay),
        })),
      },
      {
        title: 'Experiencias',
        icon: 'flag' as const,
        rows: [
          ...extras.map((extra) => ({ label: etiquetasExtra[extra], total: countExtras(extra) })),
          {
            label: 'Reservas con hotel antes del evento',
            total: secured.filter((summary) => summary.registration.preEventHotel).length,
          },
        ],
      },
      {
        title: 'Corredores',
        icon: 'users' as const,
        rows: [
          { label: 'Titulares', total: countRunners((runner) => runner.role === 'Titular') },
          {
            label: 'Acompañantes',
            total: countRunners((runner) => runner.role === 'Acompañante'),
          },
        ],
      },
    ],
  };
}
