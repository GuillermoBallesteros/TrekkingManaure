import './App.css';
import { Dashboard, Login, Participantes, Pagos, Cupos, Exportar } from './pages';
import { useEffect, useState } from 'react';
import Brand from '../../shared/components/Brand';
import Icon from '../../shared/components/Icon';
import { AdminPreviewProvider, useAdminPreview } from './context/AdminPreviewContext';

const links = [
  { id: 'resumen', label: 'Vista general', icon: 'grid' as const },
  { id: 'participantes', label: 'Participantes', icon: 'users' as const },
  { id: 'pagos', label: 'Revisión de pagos', icon: 'sheet' as const },
  { id: 'cupos', label: 'Gestión de cupos', icon: 'tent' as const },
  { id: 'exportar', label: 'Exportar información', icon: 'upload' as const },
];

function AdminRoutes() {
  const [route, setRoute] = useState(location.hash.slice(2) || 'acceso');
  const [menuOpen, setMenuOpen] = useState(false);
  const { participants } = useAdminPreview();
  const pending = participants.filter((person) => person.status === 'Pendiente').length;
  const title = links.find((link) => link.id === route)?.label || 'Vista general';
  const publicUrl =
    import.meta.env.VITE_PUBLIC_URL || location.protocol + '//' + location.hostname + ':5173';

  useEffect(() => {
    function onHash() {
      setRoute(location.hash.slice(2) || 'acceso');
      setMenuOpen(false);
      window.scrollTo(0, 0);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('hashchange', onHash);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.title = (route === 'acceso' ? 'Acceso' : title) + ' · Perijá Admin';
    document.getElementById('admin-content')?.focus({ preventScroll: true });
  }, [route, title]);

  if (route === 'acceso') return <Login />;

  return (
    <div className="admin-shell">
      <a
        className="skip-link"
        href="#admin-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('admin-content')?.focus();
        }}
      >
        Saltar al contenido
      </a>
      {menuOpen && (
        <button
          className="admin-sidebar-backdrop"
          aria-label="Cerrar navegación"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={'admin-sidebar ' + (menuOpen ? 'is-open' : '')}>
        <a href="#/resumen" aria-label="Perijá, vista general">
          <Brand />
        </a>
        <span className="admin-nav-label">ESPACIO DE ORGANIZACIÓN</span>
        <nav aria-label="Navegación administrativa">
          {links.map((link) => (
            <a
              key={link.id}
              href={'#/' + link.id}
              onClick={() => setMenuOpen(false)}
              aria-current={route === link.id ? 'page' : undefined}
            >
              <Icon name={link.icon} />
              <span>{link.label}</span>
              {link.id === 'pagos' && pending > 0 && <small>{pending}</small>}
            </a>
          ))}
        </nav>
        <div className="admin-sidebar-event">
          <Icon name="mountain" />
          <small>EL PRÓXIMO DESAFÍO</small>
          <strong>Perijá 13K</strong>
          <span>15 y 16 de noviembre</span>
          <a href={publicUrl}>
            Ver página del evento <Icon name="arrow" />
          </a>
        </div>
        <div className="admin-sidebar-bottom">
          <a href="#/acceso">
            <Icon name="lock" /> Volver al acceso
          </a>
          <span>
            <i className="dot-live" /> MODO VISTA PREVIA
          </span>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-header">
          <div>
            <button
              type="button"
              className="admin-menu-toggle"
              aria-label="Abrir navegación"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
              <span />
            </button>
            <span className="admin-breadcrumb">
              Administración <span>/</span> <strong>{title}</strong>
            </span>
          </div>
          <div>
            <a href={publicUrl} className="admin-public-link">
              Ver sitio público <Icon name="arrow" />
            </a>
            <span className="admin-user-avatar">P</span>
            <span className="admin-user">
              <strong>Equipo Perijá</strong>
              <small>Organización</small>
            </span>
          </div>
        </header>
        <div className="admin-preview-banner">
          <span>
            <Icon name="info" />
            <strong>Primer esqueleto visual.</strong> Registros ficticios y acciones de
            demostración.
          </span>
          <span>Sin conexión al servidor</span>
        </div>
        <main id="admin-content" className="admin-content" tabIndex={-1}>
          {route === 'participantes' ? (
            <Participantes />
          ) : route === 'pagos' ? (
            <Pagos />
          ) : route === 'cupos' ? (
            <Cupos />
          ) : route === 'exportar' ? (
            <Exportar />
          ) : (
            <Dashboard />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AdminPreviewProvider>
      <AdminRoutes />
    </AdminPreviewProvider>
  );
}
