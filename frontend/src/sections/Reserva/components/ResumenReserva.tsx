import Icon from '../../../../../shared/components/Icon';
import { evento, precios } from '../../../../../shared/config';
import { formatDate, formatMoney } from '../../../../../shared/utils/format';
import type { Cotizacion, Estadia, PlanTitular } from '../../../types/reserva';
import './ResumenReserva.css';

type Props = {
  stay: Estadia;
  plan: PlanTitular;
  planDate: string;
  companion: boolean;
  companionDate: string;
  extrasTotal: number;
  quote: Cotizacion;
};

export default function ResumenReserva({
  stay,
  plan,
  planDate,
  companion,
  companionDate,
  extrasTotal,
  quote,
}: Props) {
  function focusForm() {
    document.getElementById('nombres')?.focus();
  }

  return (
    <aside className="summary reveal" data-delay="1" aria-label="Resumen de la reserva">
      <div className="summary__head">
        <h3>Tu reserva</h3>
        <span>Resumen</span>
      </div>
      <div className="sum-row">
        <span>{plan === 'total' ? 'Inscripción + kit' : 'Inscripción (apartado)'}</span>
        <strong>{formatMoney(plan === 'total' ? precios.total : precios.inscripcion)}</strong>
      </div>
      {companion && (
        <div className="sum-row sum-row--dyn">
          <span>Acompañante</span>
          <strong>{formatMoney(precios.acompanante)}</strong>
        </div>
      )}
      {extrasTotal > 0 && (
        <div className="sum-row sum-row--dyn">
          <span>Actividades extra</span>
          <strong>{formatMoney(extrasTotal)}</strong>
        </div>
      )}
      <div className="sum-row">
        <span>Estadía</span>
        <strong>{stay || 'Por elegir'}</strong>
      </div>
      <div className="sum-row">
        <span>Pagas ahora (Nequi)</span>
        <strong>{formatMoney(quote.ahora)}</strong>
      </div>
      {quote.saldoTitular > 0 && (
        <div className="sum-row">
          <span>Saldo kit · {planDate ? formatDate(planDate) : 'fecha por elegir'}</span>
          <strong>{formatMoney(quote.saldoTitular)}</strong>
        </div>
      )}
      {quote.saldoAcompanante > 0 && (
        <div className="sum-row">
          <span>
            Saldo kit acompañante · {companionDate ? formatDate(companionDate) : 'fecha por elegir'}
          </span>
          <strong>{formatMoney(quote.saldoAcompanante)}</strong>
        </div>
      )}
      <div className="sum-total">
        <span>Total</span>
        <strong>{formatMoney(quote.total)}</strong>
      </div>
      <p className="summary__note">
        <Icon name="info" />
        <span>
          El pago es por Nequi. Al finalizar te llevamos a WhatsApp con tus datos y la organización
          te indica cómo pagar. Los saldos se pagan a más tardar el {evento.plazoTexto}.
        </span>
      </p>
      <button className="btn btn--gold btn--block" type="button" onClick={focusForm}>
        Reservar cupo
      </button>
      <a href="#costos" className="btn btn--ghost btn--block summary__payments">
        Ver esquema de pagos
      </a>
      <div className="summary__channels">
        <span>
          <Icon name="whatsapp" /> WhatsApp
        </span>
        <span>
          <Icon name="calendar" /> Nequi
        </span>
        <span>
          <Icon name="lock" /> Datos por WhatsApp
        </span>
      </div>
    </aside>
  );
}
