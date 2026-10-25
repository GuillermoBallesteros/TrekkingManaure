import Icon from '../../../../../shared/components/Icon';
import { getCapacity } from '../../../../../shared/utils/capacity';
import { cupos } from '../../../../../shared/config';
import CuentaRegresiva from '../CuentaRegresiva';
import './ContadorCupos.css';

export default function ContadorCupos() {
  const { available, capacity, occupied, percentage } = getCapacity(0);

  return (
    <aside className="cupo-card reveal" aria-label="Capacidad inicial del evento">
      <div className="cupo-card__head">
        <span className="cupo-card__label">Cupos iniciales</span>
        <span className="cupo-card__live">
          <i className="dot-live" /> Vista previa
        </span>
      </div>
      <div className="cupo-card__number">
        {available}
        <small>de {capacity} personas</small>
      </div>
      <div
        className="bar"
        role="progressbar"
        aria-label="Ocupación de ejemplo"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={occupied}
      >
        <div className="bar__fill" style={{ width: percentage + '%' }} />
      </div>
      <div className="cupo-card__foot">
        <span>Capacidad inicial</span>
        <span>Máximo {cupos.maximo}</span>
      </div>
      <div className="cupo-card__note">
        <Icon name="info" />
        <span>
          Si se llenan los {cupos.iniciales} cupos, se abren{' '}
          <strong>{cupos.ampliacion} cupos más</strong>. La disponibilidad real se conectará a las
          reservas confirmadas.
        </span>
      </div>
      <CuentaRegresiva />
    </aside>
  );
}
