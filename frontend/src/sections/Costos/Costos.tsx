import Extras from '../Extras';
import { precios, evento } from '../../../../shared/config';
import { formatMoney } from '../../../../shared/utils/format';
import Icon from '../../../../shared/components/Icon';
import './Costos.css';

export default function Costos() {
  return (
    <section className="section" id="costos">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Costos y pagos</span>
          <h2 className="section-title">
            Claro, sin <em>sorpresas</em>
          </h2>
          <p className="section-sub">
            El valor total es obligatorio. Se paga en dos partes: una para apartar el cupo y otra
            para el kit completo.
          </p>
        </div>

        <div className="costos-grid">
          <div className="price-card reveal">
            <span className="eyebrow" style={{ marginBottom: '.4rem' }}>
              Valor total obligatorio
            </span>
            <div className="price-card__total">
              {formatMoney(precios.total)} <span>COP</span>
            </div>
            <p className="price-card__desc">
              Debe pagarse la totalidad. La inscripción aparta el cupo y el saldo cubre el kit
              completo del evento.
            </p>

            <div className="split">
              <div className="split__item">
                <small>1 · Inscripción</small>
                <strong>{formatMoney(precios.inscripcion)}</strong>
                <span>Aparta tu cupo</span>
              </div>
              <div className="split__item">
                <small>2 · Saldo del kit</small>
                <strong>{formatMoney(precios.kitCompleto)}</strong>
                <span>Kit completo</span>
              </div>
            </div>

            <div className="deadline">
              <Icon name="calendar" />
              <div>
                <strong>Plazo hasta el {evento.plazoTexto}.</strong> Al reservar eliges el día
                exacto en que pagarás los {formatMoney(precios.kitCompleto)} restantes, dentro de
                ese plazo.
              </div>
            </div>
          </div>

          <div className="steps reveal" data-delay="1">
            <div className="step">
              <span className="step__n">01</span>
              <div>
                <h3>Registra tus datos</h3>
                <p>Completa el formulario y sigue a WhatsApp con tu información.</p>
              </div>
            </div>
            <div className="step">
              <span className="step__n">02</span>
              <div>
                <h3>Paga por Nequi y elige tu fecha</h3>
                <p>
                  Paga {formatMoney(precios.inscripcion)} para apartar o{' '}
                  {formatMoney(precios.total)} completo. Si apartas, eliges en el calendario el día
                  en que pagarás los {formatMoney(precios.kitCompleto)}.
                </p>
              </div>
            </div>
            <div className="step">
              <span className="step__n">03</span>
              <div>
                <h3>Paga el saldo</h3>
                <p>
                  Paga el dinero dentro del plazo. La organización valida los pagos y confirma tu
                  cupo.
                </p>
              </div>
            </div>
            <p className="note">
              La reserva no queda confirmada hasta validar el pago de inscripción.
            </p>
          </div>
        </div>

        <Extras />
      </div>
    </section>
  );
}
