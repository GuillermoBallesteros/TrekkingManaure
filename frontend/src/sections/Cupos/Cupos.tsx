import { useCupos } from '../../hooks';
import './Cupos.css';

export default function Cupos() {
  const view = useCupos();

  return (
    <section className="section section--tight" id="cupos">
      <div className="container cupos-wrap">
        <div className="cupos-big reveal">
          <span className="cupos-big__cap">Capacidad del evento</span>
          <div className="cupos-big__num">
            <span>{view.capacity}</span> <small>CUPOS</small>
          </div>
          <div
            className="bar"
            role="progressbar"
            aria-label="Cupos confirmados"
            aria-valuemin={0}
            aria-valuemax={view.capacity}
            aria-valuenow={view.occupied}
          >
            <div className="bar__fill" style={view.barStyle} />
          </div>
          <div className="cupos-big__legend">
            <span>{view.legend}</span>
            <span>Límite: {view.capacity} personas</span>
          </div>
          <div className="highlight">
            <strong>Importante:</strong> el cupo se confirma cuando la organización verifica el pago
            de inscripción de {view.inscripcion}.
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
            {view.rules.map((rule) => (
              <div className="rule" key={rule.n}>
                <span className="rule__n">{rule.n}</span>
                <div>
                  <strong>{rule.title}</strong>
                  <p>{rule.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
