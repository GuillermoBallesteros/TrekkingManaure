import './RegistrationDetail.css';
import Icon from '../../../../shared/components/Icon';
import { useRegistrationDetail, type RunnerView } from '../../hooks';
import StatusBadge from '../comun/StatusBadge';

function RunnerCard({ runner }: { runner: RunnerView }) {
  return (
    <article className="reg-runner">
      <header>
        <small>{runner.role}</small>
        <strong>{runner.name}</strong>
        <span>{runner.document}</span>
      </header>
      <dl className="reg-facts">
        {runner.facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className={runner.healthClass}>
        <Icon name="medical" />
        {runner.hasAlerts ? (
          <ul aria-label={runner.alertsLabel}>
            {runner.alerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}
          </ul>
        ) : (
          <span>Sin enfermedades ni alergias · practica deporte</span>
        )}
      </div>
    </article>
  );
}

export default function RegistrationDetail({
  registrationId,
  onReview,
}: {
  registrationId: string;
  onReview?: (paymentId: string) => void;
}) {
  const detail = useRegistrationDetail(registrationId);

  if (!detail) return null;

  return (
    <div className="reg-detail">
      <div className="reg-detail__meta">
        <span>{detail.meta}</span>
        <StatusBadge status={detail.status} />
      </div>

      <div className="reg-money">
        {detail.money.map((item) => (
          <div key={item.label} className={item.className}>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <p className="reg-plan">
        <Icon name="calendar" />
        <span>
          {detail.plan.text}
          {detail.plan.date && <strong>{detail.plan.date}</strong>}
          {detail.plan.deadline && <em className={detail.deadlineClass}>{detail.plan.deadline}</em>}
        </span>
      </p>
      {detail.overdue && (
        <p className="reg-alert">
          No se registró el saldo en la fecha acordada. El kit puede liberarse para otra persona.
        </p>
      )}

      <section className="reg-section">
        <h3>Corredores</h3>
        <div className="reg-runners">
          <RunnerCard runner={detail.titular} />
          {detail.companion ? (
            <RunnerCard runner={detail.companion} />
          ) : (
            <article className="reg-runner reg-runner--empty">
              <Icon name="users" />
              <span>Se inscribió sin acompañante.</span>
            </article>
          )}
        </div>
      </section>

      <section className="reg-section">
        <h3>Liquidación</h3>
        <ul className="reg-lines">
          {detail.charges.map((charge) => (
            <li key={charge.label}>
              <span>{charge.label}</span>
              <strong>{charge.amount}</strong>
            </li>
          ))}
          <li className="reg-lines__total">
            <span>Total a pagar</span>
            <strong>{detail.total}</strong>
          </li>
        </ul>
      </section>

      <section className="reg-section">
        <h3>{detail.paymentsTitle}</h3>
        {detail.hasPayments ? (
          <ul className="reg-payments">
            {detail.payments.map((payment) => (
              <li key={payment.id}>
                <div>
                  <strong>{payment.concept}</strong>
                  <small>{payment.detail}</small>
                  {payment.reason && (
                    <small className="reg-payments__reason">{payment.reason}</small>
                  )}
                </div>
                <span>{payment.amount}</span>
                <StatusBadge status={payment.review} />
                {payment.canReview && onReview && (
                  <button
                    type="button"
                    className="table-action"
                    onClick={() => onReview(payment.id)}
                  >
                    Revisar <Icon name="arrow" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="reg-empty">Aún no hay pagos registrados.</p>
        )}
      </section>

      {detail.form.visible && (
        <form className="reg-register" onSubmit={detail.form.submit}>
          <h3>{detail.form.title}</h3>
          <div>
            <label>
              Monto recibido
              <input
                type="number"
                required
                min={1}
                max={detail.form.max}
                step={1}
                placeholder={detail.form.placeholder}
                value={detail.form.amount}
                onChange={detail.form.changeAmount}
              />
            </label>
          </div>
          <button type="submit" className="btn btn--primary" disabled={detail.form.saving}>
            <Icon name="check" /> {detail.form.saving ? 'Registrando…' : 'Registrar pago'}
          </button>
        </form>
      )}
      <p role="status" className="admin-feedback">
        {detail.feedback}
      </p>
      {detail.error && (
        <p role="alert" className="admin-error">
          {detail.error}
        </p>
      )}
    </div>
  );
}
