import Brand from '../../../../../shared/components/Brand';
import { evento } from '../../../../../shared/config';
import './Footer.css';

export default function Footer() {
  const adminUrl =
    import.meta.env.VITE_ADMIN_URL || location.protocol + '//' + location.hostname + ':5174';

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#inicio" aria-label="Volver al inicio">
              <Brand />
            </a>
            <p>
              Desafío Perijá 13K. {evento.fechasTexto}. Del pueblo al páramo, con seguridad y cupos
              limitados.
            </p>
          </div>
          <div className="footer-col">
            <h2>Evento</h2>
            <ul>
              <li>
                <a href="#evento">La experiencia</a>
              </li>
              <li>
                <a href="#incluye">Qué incluye</a>
              </li>
              <li>
                <a href="#costos">Costos y pagos</a>
              </li>
              <li>
                <a href="#estadia">Estadía</a>
              </li>
              <li>
                <a href="#galeria">Galería del evento</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>Contacto</h2>
            <ul>
              <li>
                <a href="#reserva">Reservar cupo</a>
              </li>
              <li>
                <a href="#seguridad">Seguridad</a>
              </li>
              <li>Reservas: equipo organizador</li>
              <li>{evento.lugar}</li>
              <li>
                <a href={adminUrl}>Administración</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Trekking Desafío Perijá 13K. Todos los derechos reservados.</span>
          <span>Primer esqueleto visual · Reservas y pagos aún no conectados</span>
        </div>
      </div>
    </footer>
  );
}
