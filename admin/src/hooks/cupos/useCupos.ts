import { useState, type ChangeEvent, type FormEvent } from 'react';
import { getCapacity } from '../../../../shared/utils/capacity';
import { useAdminPreview } from '../../context/AdminPreviewContext';
import { tallas } from '../../data/cupos/tallas';
import { getRunners, summarize } from '../../utils/comun/inscripcion';

export function useCupos() {
  const { registrations, today, capacity, setCapacity } = useAdminPreview();
  const [value, setValue] = useState(capacity);
  const [feedback, setFeedback] = useState('');
  const secured = registrations
    .map((registration) => summarize(registration, today))
    .filter((summary) => summary.paid > 0);
  const runners = secured.flatMap((summary) =>
    getRunners(summary.registration).map((runner) => ({ ...runner, status: summary.status })),
  );
  const availability = getCapacity(runners.length, capacity);
  const kits = runners.filter((runner) => runner.kit);
  const atRisk = kits.filter((runner) => runner.status === 'Vencido').length;
  const countRunners = (match: (runner: (typeof runners)[number]) => boolean) =>
    runners.filter(match).length;
  const countExtras = (extra: 'cuatrimoto' | 'parapente') =>
    secured.filter((summary) => summary.registration.extras[extra]).length;

  function applyCapacity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCapacity(value);
    setFeedback('Capacidad actualizada solo en la vista previa.');
  }

  return {
    availability,
    barStyle: { width: availability.percentage + '%' },
    value,
    feedback,
    changeValue: (event: ChangeEvent<HTMLInputElement>) => setValue(Number(event.target.value)),
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
        rows: [
          { label: 'Páramo', total: countRunners((runner) => runner.stay === 'Páramo') },
          {
            label: 'Hotel en Manaure',
            total: countRunners((runner) => runner.stay === 'Hotel en Manaure'),
          },
        ],
      },
      {
        title: 'Experiencias',
        icon: 'flag' as const,
        rows: [
          { label: 'Cuatrimoto', total: countExtras('cuatrimoto') },
          { label: 'Parapente', total: countExtras('parapente') },
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
