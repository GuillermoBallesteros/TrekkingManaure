import { aliados } from '../../../../shared/data/aliados';
import './Aliados.css';

export default function Aliados() {
  return (
    <section className="section aliados" id="aliados">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Con el apoyo de</span>
          <h2 className="section-title">
            Aliados del <em>Perijá</em>
          </h2>
        </div>
        <div className="logo-grid">
          {aliados.map((aliado) => (
            <div key={aliado.id} className="logo-card reveal" data-delay={aliado.delay}>
              <img src={aliado.src} alt={aliado.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
