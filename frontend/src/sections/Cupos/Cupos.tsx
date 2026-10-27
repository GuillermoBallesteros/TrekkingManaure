import { cupos, precios } from '../../../../shared/config';
import { formatMoney } from '../../../../shared/utils/format';
import './Cupos.css';

export default function Cupos() {
  return (
    <section className="section section--tight" id="cupos">
      <div className="container cupos-wrap">
        <div className="cupos-big reveal">
          <span className="cupos-big__cap">Capacidad del evento</span>
          <div className="cupos-big__num">
            <span>{cupos.iniciales}</span> <small>CUPOS</small>
          </div>
          <div className="bar" aria-hidden="true">
            <div className="bar__fill" />
          </div>
          <div className="cupos-big__legend">
            <span>Cupo limitado</span>
            <span>Límite: {cupos.iniciales} personas</span>
          </div>
          <div className="highlight">
            <strong>Importante:</strong> el cupo se confirma cuando la organización valida el
            comprobante de inscripción de {formatMoney(precios.inscripcion)}.
          </div>
        </div>
        <div className="reveal" data-delay="1">
          <span className="eyebrow">Así funciona el cupo</span>
          <h2 className="section-title cupos-title">
            Cupo limitado,
            <br />
            <em>una gran experiencia</em>
          </h2>
          <div className="rules">
            <div className="rule">
              <span className="rule__n">1</span>
              <div>
                <strong>Son {cupos.iniciales} cupos</strong>
                <p>
                  La capacidad del evento es de {cupos.iniciales} personas, para cuidar la ruta y la
                  experiencia de todos.
                </p>
              </div>
            </div>
            <div className="rule">
              <span className="rule__n">2</span>
              <div>
                <strong>Reservas con los {formatMoney(precios.inscripcion)}</strong>
                <p>
                  El cupo se ocupa cuando el pago de inscripción y su comprobante quedan validados.
                </p>
              </div>
            </div>
            <div className="rule">
              <span className="rule__n">3</span>
              <div>
                <strong>Los cupos se descuentan al validar</strong>
                <p>
                  A medida que la organización valida cada inscripción, el cupo queda asegurado y la
                  disponibilidad baja.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
