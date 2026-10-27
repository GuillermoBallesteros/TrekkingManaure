import './Dashboard.css';
import Icon from '../../../../shared/components/Icon';
import { evento } from '../../../../shared/config';
import StatusBadge from '../../components/comun/StatusBadge';
import { useDashboard } from '../../hooks';

export default function Dashboard() {
  const dashboard = useDashboard();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">El evento, bajo control</span>
          <h1>
            Vista <em>general</em>
          </h1>
          <p>Inscripciones, pagos por revisar y saldos por cobrar del próximo encuentro.</p>
        </div>
        <a className="btn btn--ghost admin-small-btn" href="#/exportar">
          <Icon name="sheet" /> Preparar reporte
        </a>
      </div>
      <div className="admin-metrics">
        {dashboard.metrics.map((metric) => (
          <article key={metric.title} className={metric.className}>
            <div>
              <span>{metric.title}</span>
              <Icon name={metric.icon} />
            </div>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </div>
      <div className="admin-overview-grid">
        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>El pulso de las inscripciones</h2>
              <p>Estado de pago de cada inscripción</p>
            </div>
            <span className="admin-pill">Vista previa</span>
          </div>
          <div className="admin-chart">
            <div
              className="admin-donut"
              style={dashboard.donutStyle}
              role="img"
              aria-label={dashboard.donutLabel}
            >
              <div>
                <strong>{dashboard.totalLabel}</strong>
                <span>INSCRIPCIONES</span>
              </div>
            </div>
            <div className="admin-legend">
              {dashboard.legend.map((item) => (
                <div key={item.status}>
                  <i className={item.dotClass} />
                  <span>{item.status}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="admin-panel-foot">
            <Icon name="shield" />
            <span>
              Un cupo se asegura al aprobar el primer pago. El saldo se acepta hasta el{' '}
              {dashboard.deadlineLabel}.
            </span>
          </div>
        </article>
        <article className="admin-event-card">
          <span className="eyebrow">Nuestro próximo encuentro</span>
          <Icon name="mountain" />
          <h2>
            Desafío
            <br />
            <em>Perijá 13K</em>
          </h2>
          <p>Manaure · Cesar · Colombia</p>
          <div>
            <Icon name="calendar" />
            <span>
              {evento.fechasTexto}
              <small>Salida · 6:00 a.m.</small>
            </span>
          </div>
          <a href="#/cupos">
            Organizar los cupos <Icon name="arrow" />
          </a>
        </article>
      </div>
      <div className="admin-lists">
        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Pagos por revisar</h2>
              <p>Los comprobantes más antiguos primero</p>
            </div>
            <a href="#/pagos" className="admin-text-link">
              Revisar <Icon name="arrow" />
            </a>
          </div>
          <ul className="admin-list">
            {dashboard.reviews.map((review) => (
              <li key={review.id}>
                <a
                  href="#/pagos"
                  onClick={() => dashboard.focusPayment(review.id)}
                  aria-label={review.ariaLabel}
                >
                  <span>
                    <strong>{review.name}</strong>
                    <small>{review.detail}</small>
                  </span>
                  <em>{review.amount}</em>
                  <Icon name="arrow" />
                </a>
              </li>
            ))}
          </ul>
          {!dashboard.hasReviews && <p className="admin-list-empty">No hay pagos por revisar.</p>}
        </article>
        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Saldos por cobrar</h2>
              <p>Ordenados por la fecha que cada persona prometió pagar</p>
            </div>
            <a href="#/participantes" className="admin-text-link">
              Participantes <Icon name="arrow" />
            </a>
          </div>
          <ul className="admin-list">
            {dashboard.debts.map((debt) => (
              <li key={debt.id}>
                <div>
                  <span>
                    <strong>{debt.name}</strong>
                    <small>{debt.detail}</small>
                  </span>
                  <em>{debt.amount}</em>
                  <StatusBadge status={debt.status} />
                </div>
              </li>
            ))}
          </ul>
          {!dashboard.hasDebts && <p className="admin-list-empty">No hay saldos pendientes.</p>}
        </article>
      </div>
      <div className="admin-bottom-note">
        <Icon name="mountain" />
        <span>Organiza la experiencia. Acompaña cada paso.</span>
        <span>PERIJÁ / 2026</span>
      </div>
    </>
  );
}
