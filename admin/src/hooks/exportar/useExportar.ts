import { useState, type ChangeEvent } from 'react';
import { countRunners, statusOrder, summarize, useReservas } from '../../../../shared/reservas';
import { contenidoLibro } from '../../data/exportar/libro';
import { plural } from '../../utils/comun/texto';
import { downloadBlob } from '../../utils/exportar/descarga';
import { crearLibroGestion } from '../../utils/exportar/libro/crearLibro';

export function useExportar() {
  const { registrations, today, capacity } = useReservas();
  const [filter, setFilter] = useState('Todos');
  const [feedback, setFeedback] = useState('');
  const summaries = registrations
    .map((registration) => summarize(registration, today))
    .filter((summary) => filter === 'Todos' || summary.status === filter);
  const runners = countRunners(summaries.map((summary) => summary.registration));
  const payments = summaries.reduce(
    (sum, summary) => sum + summary.registration.payments.length,
    0,
  );

  function changeFilter(event: ChangeEvent<HTMLSelectElement>) {
    setFilter(event.target.value);
    setFeedback('');
  }

  function download() {
    const blob = crearLibroGestion({
      summaries,
      today,
      capacity,
      filterLabel: filter,
    });
    downloadBlob('perija-gestion-' + today + '.xlsx', blob);
    setFeedback(
      'Se descargó el libro con ' +
        plural(summaries.length, 'inscripción', 'inscripciones') +
        '. Ábrelo en Excel para ver fórmulas, filtros y gráficos.',
    );
  }

  return {
    sheets: contenidoLibro,
    filter,
    changeFilter,
    filterOptions: ['Todos', ...statusOrder],
    counts: [
      { label: 'Inscripciones', value: summaries.length },
      { label: 'Corredores', value: runners },
      { label: 'Pagos', value: payments },
    ],
    canDownload: summaries.length > 0,
    download,
    feedback,
  };
}
