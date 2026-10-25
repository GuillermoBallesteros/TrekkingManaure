import { useEffect, useState } from 'react';
import Brand from '../../../../../shared/components/Brand';
import './Navbar.css';

const links = [
  ['evento', 'Evento'],
  ['incluye', 'Incluye'],
  ['costos', 'Costos'],
  ['estadia', 'Estadía'],
  ['seguridad', 'Seguridad'],
  ['galeria', 'Galería'],
  ['aliados', 'Aliados'],
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(window.scrollY > 20);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <header className={'nav ' + (scrolled || open ? 'is-scrolled' : '')}>
      <div className="container nav__inner">
        <a
          href="#inicio"
          aria-label="Trekking Desafío Perijá, inicio"
          onClick={() => setOpen(false)}
        >
          <Brand />
        </a>
        <nav
          className={'nav__links ' + (open ? 'is-open' : '')}
          id="menu"
          aria-label="Navegación principal"
        >
          {links.map(([id, label]) => (
            <a key={id} href={'#' + id} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="nav__mobile-reserva" href="#reserva" onClick={() => setOpen(false)}>
            Reserva
          </a>
        </nav>
        <div className="nav__actions">
          <span className="preview-tag">Vista previa</span>
          <a href="#reserva" className="btn btn--primary nav__cta">
            Reservar cupo
          </a>
          <button
            type="button"
            className="nav__toggle"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen(!open)}
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
