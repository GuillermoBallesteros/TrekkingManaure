import Icon from '../../../../shared/components/Icon';
import './Evento.css';

export default function Evento() {
  return (
    <section className="section" id="evento">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">La experiencia</span>
          <h2 className="section-title">
            No es solo una caminata,
            <br />
            es <em>el Perijá</em>
          </h2>
          <p className="section-sub">
            Un recorrido de 13 km que arranca en Villa Adelaida y termina en el páramo. Tú eliges
            cómo vivirlo: quedándote en la montaña o volviendo a Manaure.
          </p>
        </div>

        <div className="features">
          <article className="feature reveal" data-delay="1">
            <span className="feature__icon">
              <Icon name="mountain" />
            </span>
            <h3>Senderos naturales</h3>
            <p>13 km de camino de montaña con guías locales que conocen cada tramo.</p>
          </article>
          <article className="feature reveal" data-delay="2">
            <span className="feature__icon">
              <Icon name="sun" />
            </span>
            <h3>Paisajes únicos</h3>
            <p>Del clima cálido del pueblo al frío del páramo en un solo recorrido.</p>
          </article>
          <article className="feature reveal" data-delay="3">
            <span className="feature__icon">
              <Icon name="fire" />
            </span>
            <h3>Fogata y montaña</h3>
            <p>
              Para quienes se quedan en el páramo: noche de fogata y experiencia completa, sin
              conectividad a internet.
            </p>
          </article>
          <article className="feature reveal" data-delay="4">
            <span className="feature__icon">
              <Icon name="users" />
            </span>
            <h3>Comunidad</h3>
            <p>Un grupo pequeño, con cupo máximo, para cuidar la ruta y la naturaleza.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
