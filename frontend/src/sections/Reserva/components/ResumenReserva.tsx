import Icon from '../../../../../shared/components/Icon';
import { evento } from '../../../../../shared/config';
import { formatDate, formatMoney } from '../../../../../shared/utils/format';
import type { Cotizacion, Estadia } from '../../../types/reserva';
import './ResumenReserva.css';

type Props = {
  stay: Estadia;
  planDate: string;
  quote: Cotizacion;
};

export default function ResumenReserva({ stay, planDate, quote }: Props) {
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
        <span>Inscripción + kit</span>
        <strong>{formatMoney(quote.titular)}</strong>
      </div>
      {quote.acompanante > 0 && (
        <div className="sum-row sum-row--dyn">
          <span>Acompañante</span>
          <strong>{formatMoney(quote.acompanante)}</strong>
        </div>
      )}
      {quote.extras > 0 && (
        <div className="sum-row sum-row--dyn">
          <span>Actividades extra</span>
          <strong>{formatMoney(quote.extras)}</strong>
        </div>
      )}
      <div className="sum-row">
        <span>Estadía</span>
        <strong>{stay || 'Por elegir'}</strong>
      </div>
      <div className="sum-row">
        <span>Pagas ahora</span>
        <strong>{formatMoney(quote.ahora)}</strong>
      </div>
      {quote.saldo > 0 && (
        <div className="sum-row">
          <span>Restante · {planDate ? formatDate(planDate) : 'fecha por elegir'}</span>
          <strong>{formatMoney(quote.saldo)}</strong>
        </div>
      )}
      <div className="sum-total">
        <span>Total</span>
        <strong>{formatMoney(quote.total)}</strong>
      </div>
      <p className="summary__note">
        <Icon name="info" />
        <span>
          El pago es por llave Bre-B. Al finalizar te llevamos a WhatsApp con tus datos y la
          organización te indica cómo pagar. El restante se paga a más tardar el {evento.plazoTexto}
          .
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
          <Icon name="calendar" /> Bre-B
        </span>
        <span>
          <Icon name="lock" /> Datos por WhatsApp
        </span>
      </div>
    </aside>
  );
}
