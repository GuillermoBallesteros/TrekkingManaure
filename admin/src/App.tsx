import './App.css';
import { Dashboard, Login, Participantes, Pagos, Cupos, Exportar } from './pages';
import Brand from '../../shared/components/Brand';
import Icon from '../../shared/components/Icon';
import { AdminPreviewProvider } from './context/AdminPreviewContext';
import { useAdminNavigation } from './hooks';

const pages = {
  resumen: Dashboard,
  participantes: Participantes,
  pagos: Pagos,
  cupos: Cupos,
  exportar: Exportar,
  acceso: Login,
};

function AdminRoutes() {
  const navigation = useAdminNavigation();
  const Page = pages[navigation.route] || Dashboard;

  if (navigation.route === 'acceso') return <Login />;

  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-content" onClick={navigation.skipToContent}>
        Saltar al contenido
      </a>
      {navigation.menuOpen && (
        <button
          className="admin-sidebar-backdrop"
          aria-label="Cerrar navegación"
          onClick={navigation.closeMenu}
        />
      )}
      <aside className={navigation.sidebarClass}>
        <a href="#/resumen" aria-label="Perijá, vista general">
          <Brand />
        </a>
        <span className="admin-nav-label">ESPACIO DE ORGANIZACIÓN</span>
        <nav aria-label="Navegación administrativa">
          {navigation.links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={navigation.closeMenu}
              aria-current={link.current}
            >
              <Icon name={link.icon} />
              <span>{link.label}</span>
              {link.badge && <small>{link.badge}</small>}
            </a>
          ))}
        </nav>
        <div className="admin-sidebar-event">
          <Icon name="mountain" />
          <small>EL PRÓXIMO DESAFÍO</small>
          <strong>Perijá 13K</strong>
          <span>15 y 16 de noviembre</span>
          <a href={navigation.publicUrl}>
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
              aria-expanded={navigation.menuOpen}
              onClick={navigation.toggleMenu}
            >
              <span />
              <span />
              <span />
            </button>
            <span className="admin-breadcrumb">
              Administración <span>/</span> <strong>{navigation.title}</strong>
            </span>
          </div>
          <div>
            <a href={navigation.publicUrl} className="admin-public-link">
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
          <Page />
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
