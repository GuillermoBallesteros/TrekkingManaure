import Icon from '../../../../../shared/components/Icon';
import { precios } from '../../../../../shared/config';
import { formatDate, formatMoney } from '../../../../../shared/utils/format';
import type { Estadia } from '../../../types/reserva';
import './ResumenReserva.css';

type Props = {
  stay: Estadia;
  date: string;
  companion: boolean;
  extrasTotal: number;
  total: number;
};

export default function ResumenReserva({ stay, date, companion, extrasTotal, total }: Props) {
  function focusForm() {
    document.getElementById('nombre')?.focus();
  }

  return (
    <aside className="summary reveal" data-delay="1" aria-label="Resumen de la reserva">
      <div className="summary__head">
        <h3>Tu reserva</h3>
        <span>Resumen</span>
      </div>
      <div className="sum-row">
        <span>Inscripción (hoy)</span>
        <strong>{formatMoney(precios.inscripcion)}</strong>
      </div>
      <div className="sum-row">
        <span>Saldo kit</span>
        <strong>{formatMoney(precios.kitCompleto)}</strong>
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
        <span>Pago del saldo</span>
        <strong>{date ? formatDate(date) : 'Por elegir'}</strong>
      </div>
      <div className="sum-total">
        <span>Total estimado</span>
        <strong>{formatMoney(total)}</strong>
      </div>
      <p className="summary__note">
        <Icon name="info" />
        <span>
          La inscripción es de $50.000. Los $300.000 restantes se pagan en la fecha que elijas,
          dentro del plazo.
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
          <Icon name="whatsapp" /> Reservas
        </span>
        <span>
          <Icon name="calendar" /> Tu fecha
        </span>
        <span>
          <Icon name="users" /> Cupo limitado
        </span>
      </div>
    </aside>
  );
}
