import './Pagos.css';
import { useState } from 'react';
import { useAdminPreview } from '../../context/AdminPreviewContext';
import ParticipantTable from '../../components/ParticipantTable';

export default function Pagos() {
  const { participants } = useAdminPreview();
  const [filter, setFilter] = useState('Pendiente');
  const rows = participants.filter((person) => filter === 'Todos' || person.status === filter);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Claridad en cada inscripción</span>
          <h1>
            Revisión de <em>pagos</em>
          </h1>
          <p>Comprobantes de inscripción y seguimiento del saldo del kit.</p>
        </div>
        <span className="admin-pill admin-pill--warm">Acciones simuladas</span>
      </div>
      <p className="admin-notice">
        Esta vista permite probar el flujo de revisión con registros ficticios. La consulta de
        comprobantes y la confirmación real se conectarán al servidor.
      </p>
      <article className="admin-panel">
        <div className="admin-status-filters">
          {['Todos', 'Pendiente', 'Confirmado', 'Rechazado'].map((status) => (
            <button
              type="button"
              aria-pressed={filter === status}
              className={filter === status ? 'is-active' : ''}
              key={status}
              onClick={() => setFilter(status)}
            >
              {status}
              <span>
                {
                  participants.filter((person) => status === 'Todos' || person.status === status)
                    .length
                }
              </span>
            </button>
          ))}
        </div>
        <ParticipantTable rows={rows} review />
        <div className="admin-panel-foot">
          <span>{rows.length} registros en esta vista</span>
          <span>Sin transacciones reales</span>
        </div>
      </article>
    </>
  );
}
