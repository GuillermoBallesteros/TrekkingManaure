import './Cupos.css';
import Icon from '../../../../shared/components/Icon';
import { cupos } from '../../../../shared/config';
import { useCupos } from '../../hooks';

export default function Cupos() {
  const view = useCupos();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Una aventura con espacio para todos</span>
          <h1>
            Gestión de <em>cupos</em>
          </h1>
          <p>Capacidad, kits por talla, estadías y experiencias de los cupos asegurados.</p>
        </div>
      </div>
      <div className="admin-capacity-grid">
        <article className="admin-panel admin-capacity">
          <div className="admin-panel-head">
            <div>
              <h2>Disponibilidad del evento</h2>
              <p>Cada titular y acompañante con pago aprobado ocupa un cupo</p>
            </div>
            <Icon name="users" />
          </div>
          <div className="admin-capacity-number">
            <strong>{view.availability.available}</strong>
            <span>
              Cupos disponibles<small>de {view.availability.capacity} en el ejemplo</small>
            </span>
          </div>
          <div
            className="bar"
            role="meter"
            aria-label="Cupos ocupados en el ejemplo"
            aria-valuemin={0}
            aria-valuemax={view.availability.capacity}
            aria-valuenow={view.availability.occupied}
          >
            <div className="bar__fill" style={view.barStyle} />
          </div>
          <div className="admin-capacity-legend">
            <span>{view.availability.occupied} ocupados</span>
            <span>{view.availability.available} disponibles</span>
          </div>
          <p className="admin-notice">
            La política del evento contempla {cupos.iniciales} cupos iniciales y una ampliación de{' '}
            {cupos.ampliacion} al llenarse, hasta {cupos.maximo} participantes.
          </p>
        </article>
        <article className="admin-panel admin-settings">
          <h2>Probar capacidad</h2>
          <p>Ajusta el escenario para explorar cómo se presenta la disponibilidad.</p>
          <form onSubmit={view.applyCapacity}>
            <label htmlFor="capacity">Capacidad de ejemplo</label>
            <input
              id="capacity"
              required
              type="number"
              min={cupos.iniciales}
              max={cupos.maximo}
              value={view.value}
              onChange={view.changeValue}
            />
            <small>
              Entre {cupos.iniciales} y {cupos.maximo} cupos.
            </small>
            <button className="btn btn--primary" type="submit">
              Aplicar al ejemplo <Icon name="check" />
            </button>
          </form>
          <p role="status" className="admin-feedback">
            {view.feedback}
          </p>
        </article>
      </div>

      <article className="admin-panel admin-kits">
        <div className="admin-panel-head">
          <div>
            <h2>Kits por talla</h2>
            <p>Solo se pide talla a quien compra kit; así se evita producir camisas de más</p>
          </div>
          <span className="admin-pill">{view.kitsLabel}</span>
        </div>
        <div className="admin-kit-sizes">
          {view.sizes.map((item) => (
            <div key={item.size}>
              <strong>{item.count}</strong>
              <span>{item.size}</span>
            </div>
          ))}
        </div>
        <div className="admin-panel-foot">
          <Icon name="shirt" />
          <span>{view.riskText}</span>
        </div>
      </article>

      <div className="admin-logistics">
        {view.logistics.map((group) => (
          <article className="admin-panel" key={group.title}>
            <div className="admin-panel-head">
              <h2>{group.title}</h2>
              <Icon name={group.icon} />
            </div>
            <dl>
              {group.rows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.total}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
