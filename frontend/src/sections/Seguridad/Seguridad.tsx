import Icon from '../../../../shared/components/Icon';
import './Seguridad.css';

export default function Seguridad() {
  return (
    <section className="section" id="seguridad">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Antes de ir</span>
          <h2 className="section-title">
            Seguridad y <em>preparación</em>
          </h2>
          <p className="section-sub">
            La montaña se respeta. Estas son las medidas del evento y lo que debes llevar para
            disfrutarlo sin riesgos.
          </p>
        </div>

        <div className="safety-grid">
          <div className="cold reveal">
            <span className="cold__icon">
              <Icon name="snow" />
            </span>
            <h3>Hace frío en el páramo</h3>
            <p>
              Al llegar arriba la temperatura baja y el clima cambia rápido. Lleva abrigo
              suficiente, ropa térmica, impermeable y calzado adecuado. No vayas improvisando.
            </p>
            <div className="cold__list">
              <span className="chip">Abrigo</span>
              <span className="chip">Ropa térmica</span>
              <span className="chip">Impermeable</span>
              <span className="chip">Calzado de montaña</span>
              <span className="chip">Agua</span>
            </div>
          </div>

          <div className="safety-list reveal" data-delay="1">
            <div className="safety-item">
              <Icon name="medical" />
              <div>
                <strong>Paramédicos</strong>
                <small>Acompañamiento durante todo el recorrido</small>
              </div>
            </div>
            <div className="safety-item">
              <Icon name="mountain" />
              <div>
                <strong>Guías locales</strong>
                <small>Conocen la ruta y el terreno</small>
              </div>
            </div>
            <div className="safety-item">
              <Icon name="droplet" />
              <div>
                <strong>Puntos de hidratación</strong>
                <small>Abastecimiento en la ruta</small>
              </div>
            </div>
            <div className="safety-item">
              <Icon name="shield" />
              <div>
                <strong>Apoyo de policía y fuerzas armadas</strong>
                <small>Seguridad en el recorrido</small>
              </div>
            </div>
            <div className="safety-item">
              <Icon name="check" />
              <div>
                <strong>Seguro médico</strong>
                <small>Cobertura del evento</small>
              </div>
            </div>
            <div className="safety-item">
              <Icon name="phone" />
              <div>
                <strong>Sin internet en el páramo</strong>
                <small>
                  No hay conectividad: avisa a tu familia y descarga lo que necesites antes de subir
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
