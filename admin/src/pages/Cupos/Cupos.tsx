import './Cupos.css';
import { useState } from 'react';
import Icon from '../../../../shared/components/Icon';
import { cupos } from '../../../../shared/config';
import { getCapacity } from '../../../../shared/utils/capacity';
import { useAdminPreview } from '../../context/AdminPreviewContext';

export default function Cupos() {
  const { participants, capacity, setCapacity } = useAdminPreview();
  const [value, setValue] = useState(capacity);
  const [feedback, setFeedback] = useState('');
  const confirmed = participants.filter((person) => person.status === 'Confirmado').length;
  const availability = getCapacity(confirmed, capacity);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Una aventura con espacio para todos</span>
          <h1>
            Gestión de <em>cupos</em>
          </h1>
          <p>Capacidad inicial, ampliación y disponibilidad del recorrido.</p>
        </div>
      </div>
      <div className="admin-capacity-grid">
        <article className="admin-panel admin-capacity">
          <div className="admin-panel-head">
            <div>
              <h2>Disponibilidad del evento</h2>
              <p>Escenario de demostración</p>
            </div>
            <Icon name="users" />
          </div>
          <div className="admin-capacity-number">
            <strong>{availability.available}</strong>
            <span>
              Cupos disponibles<small>de {availability.capacity} en el ejemplo</small>
            </span>
          </div>
          <div
            className="bar"
            role="meter"
            aria-label="Cupos ocupados en el ejemplo"
            aria-valuemin={0}
            aria-valuemax={availability.capacity}
            aria-valuenow={confirmed}
          >
            <div className="bar__fill" style={{ width: availability.percentage + '%' }} />
          </div>
          <div className="admin-capacity-legend">
            <span>{confirmed} confirmados</span>
            <span>{availability.available} disponibles</span>
          </div>
          <p className="admin-notice">
            La política del evento contempla {cupos.iniciales} cupos iniciales y una ampliación de{' '}
            {cupos.ampliacion} al llenarse, hasta {cupos.maximo} participantes.
          </p>
        </article>
        <article className="admin-panel admin-settings">
          <h2>Probar capacidad</h2>
          <p>Ajusta el escenario para explorar cómo se presenta la disponibilidad.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setCapacity(value);
              setFeedback('Capacidad actualizada solo en la vista previa.');
            }}
          >
            <label htmlFor="capacity">Capacidad de ejemplo</label>
            <input
              id="capacity"
              required
              type="number"
              min={cupos.iniciales}
              max={cupos.maximo}
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
            />
            <small>
              Entre {cupos.iniciales} y {cupos.maximo} cupos.
            </small>
            <button className="btn btn--primary" type="submit">
              Aplicar al ejemplo <Icon name="check" />
            </button>
          </form>
          <p role="status" className="admin-feedback">
            {feedback}
          </p>
        </article>
      </div>
    </>
  );
}
