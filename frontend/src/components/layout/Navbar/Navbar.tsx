import Brand from '../../../../../shared/components/Brand';
import { useNavbar } from '../../../hooks';
import './Navbar.css';

export default function Navbar() {
  const nav = useNavbar();

  return (
    <header className={nav.headerClass}>
      <div className="container nav__inner">
        <a href="#inicio" aria-label="Trekking Desafío Perijá, inicio" onClick={nav.close}>
          <Brand />
        </a>
        <nav className={nav.linksClass} id="menu" aria-label="Navegación principal">
          {nav.links.map((link) => (
            <a key={link.id} href={link.href} onClick={nav.close}>
              {link.label}
            </a>
          ))}
          <a className="nav__mobile-reserva" href="#reserva" onClick={nav.close}>
            Reserva
          </a>
        </nav>
        <div className="nav__actions">
          <a href="#reserva" className="btn btn--primary nav__cta">
            Reservar cupo
          </a>
          <button
            type="button"
            className="nav__toggle"
            aria-label={nav.toggleLabel}
            aria-expanded={nav.open}
            aria-controls="menu"
            onClick={nav.toggle}
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
