import './Cupos.css';
import Icon from '../../../../shared/components/Icon';
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
              Cupos disponibles<small>de {view.availability.capacity} en total</small>
            </span>
          </div>
          <div
            className="bar"
            role="meter"
            aria-label="Cupos ocupados"
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
          <p className="admin-notice">{view.policyText}</p>
        </article>
        <article className="admin-panel admin-settings">
          <h2>Capacidad del evento</h2>
          <p>Amplía o reduce los cupos. El cambio se refleja de inmediato en el sitio público.</p>
          <form onSubmit={view.applyCapacity}>
            <label htmlFor="capacity">Capacidad total</label>
            <input
              id="capacity"
              required
              type="number"
              min={view.range.min}
              max={view.range.max}
              step={1}
              value={view.value}
              onChange={view.changeValue}
            />
            <small>{view.limitText}</small>
            <button className="btn btn--primary" type="submit" disabled={view.saving}>
              {view.saving ? 'Guardando…' : 'Guardar capacidad'} <Icon name="check" />
            </button>
          </form>
          <p role="status" className="admin-feedback">
            {view.feedback}
          </p>
          {view.error && (
            <p role="alert" className="admin-error">
              {view.error}
            </p>
          )}
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
