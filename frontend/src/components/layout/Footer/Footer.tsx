import Brand from '../../../../../shared/components/Brand';
import Icon from '../../../../../shared/components/Icon';
import { evento } from '../../../../../shared/config';
import './Footer.css';

const eventLinks = [
  ['evento', 'La experiencia'],
  ['incluye', 'Qué incluye'],
  ['costos', 'Costos y pagos'],
  ['estadia', 'Estadía'],
  ['galeria', 'Galería del evento'],
] as const;

const joinLinks = [
  ['cupos', 'Cupos'],
  ['reserva', 'Reservar cupo'],
  ['seguridad', 'Seguridad y preparación'],
  ['aliados', 'Aliados'],
] as const;

const adminUrl =
  import.meta.env.VITE_ADMIN_URL || location.protocol + '//' + location.hostname + ':5174';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#inicio" aria-label="Volver al inicio">
              <Brand />
            </a>
            <p>
              {evento.nombre}. Un recorrido de {evento.distanciaKm} km del pueblo al páramo, con
              guías locales, apoyo médico y cupos limitados.
            </p>
          </div>
          <div className="footer-col">
            <h2>Evento</h2>
            <ul>
              {eventLinks.map(([id, label]) => (
                <li key={id}>
                  <a href={'#' + id}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h2>Participa</h2>
            <ul>
              {joinLinks.map(([id, label]) => (
                <li key={id}>
                  <a href={'#' + id}>{label}</a>
                </li>
              ))}
              <li>
                <a href={adminUrl}>Administración</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>El recorrido</h2>
            <ul>
              <li>{evento.fechasTexto}</li>
              <li>{evento.lugar}</li>
              <li>Encuentro: {evento.encuentro}</li>
              <li>Meta: {evento.llegada}</li>
              <li className="footer-aviso">
                <Icon name="info" /> En el páramo no hay conectividad a internet
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 {evento.nombre}. Todos los derechos reservados.</span>
          <span>Reservas gestionadas por el equipo organizador</span>
        </div>
      </div>
    </footer>
  );
}
