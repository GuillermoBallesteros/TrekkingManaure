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
          <p>
            Cupos del páramo, fecha de cierre, kits por talla, estadías y experiencias de los cupos
            asegurados.
          </p>
        </div>
      </div>
      <div className="admin-capacity-grid">
        <article className="admin-panel admin-capacity">
          <div className="admin-panel-head">
            <div>
              <h2>Cupos del páramo</h2>
              <p>Ocupa cupo cada corredor con pago aprobado que se queda en el páramo</p>
            </div>
            <Icon name="users" />
          </div>
          <div className="admin-capacity-number">
            <strong>{view.availability.available}</strong>
            <span>
              Cupos libres en el páramo<small>de {view.availability.capacity} en total</small>
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
          <h2>Cupos del páramo</h2>
          <p>Cambia la cantidad de cupos. El sitio público la muestra al instante.</p>
          <form onSubmit={view.applyCapacity}>
            <label htmlFor="capacity">Cupos para dormir en el páramo</label>
            <input
              id="capacity"
              required
              type="number"
              min={view.range.min}
              step={1}
              value={view.value}
              onChange={view.changeValue}
            />
            <small>{view.limitText}</small>
            <button className="btn btn--primary" type="submit" disabled={view.saving}>
              {view.saveLabel} <Icon name="check" />
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

          <h2 className="admin-settings__sub">Fecha de cierre</h2>
          <p>
            Último día para inscribirse y para pagar el restante. Si la amplías, el plazo de pago se
            amplía igual. {view.cierre.estado}
          </p>
          <form onSubmit={view.cierre.apply}>
            <label htmlFor="fechaCierre">Cierre de inscripciones y pagos</label>
            <input
              id="fechaCierre"
              required
              type="date"
              value={view.cierre.value}
              onChange={view.cierre.change}
            />
            <button className="btn btn--primary" type="submit" disabled={view.cierre.saving}>
              Guardar fecha <Icon name="check" />
            </button>
          </form>
          <p role="status" className="admin-feedback">
            {view.cierre.feedback}
          </p>
          {view.cierre.error && (
            <p role="alert" className="admin-error">
              {view.cierre.error}
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
