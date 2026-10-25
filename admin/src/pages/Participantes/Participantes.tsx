import './Participantes.css';
import { useState } from 'react';
import Icon from '../../../../shared/components/Icon';
import { useAdminPreview } from '../../context/AdminPreviewContext';
import ParticipantTable from '../../components/ParticipantTable';

export default function Participantes() {
  const { participants } = useAdminPreview();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Todos');
  const rows = participants.filter(
    (person) =>
      (person.id + ' ' + person.name).toLowerCase().includes(search.toLowerCase()) &&
      (status === 'Todos' || person.status === status),
  );

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Cada caminante, en su lugar</span>
          <h1>
            Los <em>participantes</em>
          </h1>
          <p>Datos, estadía y estado de inscripción organizados en una sola vista.</p>
        </div>
        <span className="admin-pill">{participants.length} registros de ejemplo</span>
      </div>
      <article className="admin-panel">
        <div className="admin-filter-bar">
          <label className="admin-search">
            <Icon name="search" />
            <input
              aria-label="Buscar participante"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o identificador…"
            />
          </label>
          <label className="admin-select-label">
            Estado
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>Todos</option>
              <option>Pendiente</option>
              <option>Confirmado</option>
              <option>Rechazado</option>
            </select>
          </label>
        </div>
        <ParticipantTable rows={rows} />
        <div className="admin-panel-foot">
          <span>
            {rows.length} de {participants.length} registros
          </span>
          <span>Información ficticia</span>
        </div>
      </article>
    </>
  );
}
