import { useState, type ChangeEvent } from 'react';
import {
  countRunners,
  hasHealthAlerts,
  statusOrder,
  summarize,
  useReservas,
  type Registration,
} from '../../../../shared/reservas';

function searchableText(registration: Registration) {
  return [
    registration.id,
    registration.firstName,
    registration.lastName,
    registration.document,
    registration.phone,
    registration.email,
    registration.city,
    registration.companion?.firstName,
    registration.companion?.lastName,
    registration.companion?.document,
  ]
    .join(' ')
    .toLowerCase();
}

export function useParticipantes() {
  const { registrations, today } = useReservas();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Todos');
  const [healthOnly, setHealthOnly] = useState(false);
  const query = search.trim().toLowerCase();
  const rows = registrations
    .map((registration) => summarize(registration, today))
    .filter(
      (summary) =>
        searchableText(summary.registration).includes(query) &&
        (status === 'Todos' || summary.status === status) &&
        (!healthOnly || hasHealthAlerts(summary.registration)),
    );

  return {
    rows,
    search,
    status,
    healthOnly,
    statusOptions: ['Todos', ...statusOrder],
    totalLabel:
      registrations.length + ' inscripciones · ' + countRunners(registrations) + ' corredores',
    resultLabel: rows.length + ' de ' + registrations.length + ' inscripciones',
    empty: registrations.length
      ? { title: 'No hay resultados', text: 'Cambia los filtros o el texto de búsqueda.' }
      : {
          title: 'Aún no hay reservas',
          text: 'Las reservas del sitio público aparecen aquí en cuanto se registran.',
        },
    changeSearch: (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
    changeStatus: (event: ChangeEvent<HTMLSelectElement>) => setStatus(event.target.value),
    changeHealthOnly: (event: ChangeEvent<HTMLInputElement>) => setHealthOnly(event.target.checked),
  };
}
