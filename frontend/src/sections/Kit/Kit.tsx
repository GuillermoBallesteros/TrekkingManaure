import Icon from '../../../../shared/components/Icon';
import './Kit.css';

export default function Kit() {
  return (
    <section className="section" id="incluye">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Tu kit</span>
          <h2 className="section-title">
            Todo lo que <em>incluye</em>
          </h2>
          <p className="section-sub">
            El valor de la carrera cubre el kit completo, la alimentación y el acompañamiento en
            ruta.
          </p>
        </div>

        <div className="kit-grid">
          <article className="kit reveal" data-delay="1">
            <Icon name="shirt" />
            <div>
              <h3>Camiseta oficial</h3>
              <p>Kit del participante</p>
            </div>
          </article>
          <article className="kit reveal" data-delay="1">
            <Icon name="gift" />
            <div>
              <h3>Recordatorio</h3>
              <p>Detalle del evento</p>
            </div>
          </article>
          <article className="kit reveal" data-delay="2">
            <Icon name="droplet" />
            <div>
              <h3>Hidratación</h3>
              <p>Puntos en ruta</p>
            </div>
          </article>
          <article className="kit reveal" data-delay="2">
            <Icon name="food" />
            <div>
              <h3>3 comidas</h3>
              <p>Desayuno, almuerzo y cena</p>
            </div>
          </article>
          <article className="kit reveal" data-delay="3">
            <Icon name="fire" />
            <div>
              <h3>Fogata</h3>
              <p>Noche en el páramo</p>
            </div>
          </article>
          <article className="kit reveal" data-delay="3">
            <Icon name="hotel" />
            <div>
              <h3>Hospedaje</h3>
              <p>Habitación rural o camping</p>
            </div>
          </article>
          <article className="kit reveal" data-delay="4">
            <Icon name="camera" />
            <div>
              <h3>Recuerdo fotográfico</h3>
              <p>Registro del recorrido</p>
            </div>
          </article>
          <article className="kit reveal" data-delay="4">
            <Icon name="medical" />
            <div>
              <h3>Seguro médico</h3>
              <p>Cobertura durante el evento</p>
            </div>
          </article>
        </div>
        <p className="note" style={{ marginTop: '1rem' }}>
          Los desayunos y las meriendas están incluidos en el kit. El hospedaje depende de la opción
          de estadía que elijas.
        </p>
      </div>
    </section>
  );
}
