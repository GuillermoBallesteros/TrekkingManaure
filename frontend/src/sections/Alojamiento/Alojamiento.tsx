import type { Estadia } from '../../types/reserva';
import Icon from '../../../../shared/components/Icon';
import './Alojamiento.css';

export default function Alojamiento({ onSelect }: { onSelect: (value: Estadia) => void }) {
  return (
    <section className="section" id="estadia">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Tú eliges</span>
          <h2 className="section-title">
            ¿Dónde quieres <em>amanecer</em>?
          </h2>
          <p className="section-sub">
            Todos suben al páramo. La diferencia está en dónde pasas la noche al terminar el
            recorrido.
          </p>
        </div>

        <div className="stay-grid">
          <article className="stay stay--paramo reveal" data-delay="1">
            <span className="stay__tag">Experiencia completa</span>
            <span className="stay__icon">
              <Icon name="tent" />
            </span>
            <h3>Quedarse en el páramo</h3>
            <p>
              Termina la carrera y quédate allá. Vive la noche en la montaña y toda la experiencia.
            </p>
            <ul>
              <li>
                <Icon name="check" /> Fogata al finalizar la carrera
              </li>
              <li>
                <Icon name="check" /> Hospedaje en habitación rural o camping
              </li>
              <li>
                <Icon name="check" /> Desayuno, almuerzo y cena
              </li>
              <li>
                <Icon name="check" /> Frío intenso: lleva abrigo y ropa térmica
              </li>
            </ul>
            <a href="#reserva" className="btn btn--ghost" onClick={() => onSelect('Páramo')}>
              Elegir páramo <Icon name="arrow" />
            </a>
          </article>

          <article className="stay stay--hotel reveal" data-delay="2">
            <span className="stay__tag">Vuelve a Manaure</span>
            <span className="stay__icon">
              <Icon name="hotel" />
            </span>
            <h3>Hotel en Manaure</h3>
            <p>
              Sube hasta el páramo, cumple el recorrido y regresa a dormir a las zonas estipuladas
              de Manaure.
            </p>
            <ul>
              <li>
                <Icon name="check" /> Recorrido completo hasta el páramo
              </li>
              <li>
                <Icon name="check" /> Regreso para alojarte en Manaure
              </li>
              <li>
                <Icon name="check" /> Alojamiento en zonas estipuladas
              </li>
              <li>
                <Icon name="check" /> Sin noche en la montaña
              </li>
            </ul>
            <a
              href="#reserva"
              className="btn btn--ghost"
              onClick={() => onSelect('Hotel en Manaure')}
            >
              Elegir hotel <Icon name="arrow" />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
