import './Dashboard.css';
import Icon from '../../../../shared/components/Icon';
import { evento } from '../../../../shared/config';
import { formatMoney } from '../../../../shared/utils/format';
import { getCapacity } from '../../../../shared/utils/capacity';
import { useAdminPreview } from '../../context/AdminPreviewContext';
import ParticipantTable from '../../components/ParticipantTable';

export default function Dashboard() {
  const { participants, capacity } = useAdminPreview();
  const confirmed = participants.filter((person) => person.status === 'Confirmado');
  const pending = participants.filter((person) => person.status === 'Pendiente');
  const rejected = participants.filter((person) => person.status === 'Rechazado');
  const availability = getCapacity(confirmed.length, capacity);
  const paid = confirmed.reduce((sum, person) => sum + person.amount, 0);
  const metrics = [
    {
      title: 'Participantes',
      value: String(participants.length).padStart(2, '0'),
      note: 'Registros de demostración',
      icon: 'users' as const,
    },
    {
      title: 'Pagos por revisar',
      value: String(pending.length).padStart(2, '0'),
      note: 'Comprobantes pendientes',
      icon: 'sheet' as const,
    },
    {
      title: 'Cupos confirmados',
      value: confirmed.length + ' / ' + availability.capacity,
      note: availability.available + ' disponibles en el ejemplo',
      icon: 'tent' as const,
    },
    {
      title: 'Inscripciones',
      value: formatMoney(paid),
      note: 'Monto ficticio confirmado · COP',
      icon: 'check' as const,
    },
  ];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">El evento, bajo control</span>
          <h1>
            Vista <em>general</em>
          </h1>
          <p>Un panorama de las inscripciones, los pagos y el próximo encuentro.</p>
        </div>
        <a className="btn btn--ghost admin-small-btn" href="#/exportar">
          <Icon name="sheet" /> Preparar reporte
        </a>
      </div>
      <div className="admin-metrics">
        {metrics.map((metric, index) => (
          <article
            key={metric.title}
            className={'admin-metric ' + (index === 1 ? 'admin-metric--warm' : '')}
          >
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
              <p>Distribución de los registros de ejemplo</p>
            </div>
            <span className="admin-pill">Vista previa</span>
          </div>
          <div className="admin-chart">
            <div
              className="admin-donut"
              style={{
                background:
                  'conic-gradient(var(--dorado) 0 ' +
                  (confirmed.length / participants.length) * 100 +
                  '%, var(--naranja) 0 ' +
                  ((confirmed.length + pending.length) / participants.length) * 100 +
                  '%, var(--panel-2) 0 100%)',
              }}
              role="img"
              aria-label={
                confirmed.length +
                ' confirmados, ' +
                pending.length +
                ' pendientes y ' +
                rejected.length +
                ' rechazados'
              }
            >
              <div>
                <strong>{String(participants.length).padStart(2, '0')}</strong>
                <span>PARTICIPANTES</span>
              </div>
            </div>
            <div className="admin-legend">
              {[
                ['Confirmados', confirmed.length, 'confirmed'],
                ['Por revisar', pending.length, 'pending'],
                ['Rechazados', rejected.length, 'rejected'],
              ].map(([label, value, color]) => (
                <div key={label}>
                  <i className={'legend-dot legend-dot--' + color} />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="admin-panel-foot">
            <Icon name="shield" />
            <span>Un cupo se confirma después de validar el pago de inscripción.</span>
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
      <article className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h2>Pendientes de revisión</h2>
            <p>Los próximos comprobantes a organizar</p>
          </div>
          <a href="#/pagos" className="admin-text-link">
            Ver todos <Icon name="arrow" />
          </a>
        </div>
        <ParticipantTable rows={pending} review />
        <div className="admin-panel-foot">
          <span>{pending.length} pagos pendientes en la demostración.</span>
        </div>
      </article>
      <div className="admin-bottom-note">
        <Icon name="mountain" />
        <span>Organiza la experiencia. Acompaña cada paso.</span>
        <span>PERIJÁ / 2026</span>
      </div>
    </>
  );
}
