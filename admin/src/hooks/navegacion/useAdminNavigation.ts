import { useEffect, useState, type MouseEvent } from 'react';
import { countPendingReviews, useReservas } from '../../../../shared/reservas';
import { adminLinks, rutaInicial, type AdminRoute } from '../../data/navegacion/enlaces';
import type { Sesion } from '../../services';
import { classNames } from '../../utils/comun/classNames';

function readRoute(): AdminRoute {
  const route = location.hash.slice(2);
  return adminLinks.find((link) => link.id === route)?.id ?? rutaInicial;
}

function focusContent() {
  document.getElementById('admin-content')?.focus();
}

export function useAdminNavigation(sesion: Sesion, cerrarSesion: () => void) {
  const { registrations } = useReservas();
  const [route, setRoute] = useState<AdminRoute>(readRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const pending = countPendingReviews(registrations);
  const title = adminLinks.find((link) => link.id === route)?.label || 'Vista general';

  useEffect(() => {
    function onHash() {
      setRoute(readRoute());
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
    document.title = title + ' · Perijá Admin';
    document.getElementById('admin-content')?.focus({ preventScroll: true });
  }, [route, title]);

  function skipToContent(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    focusContent();
  }

  return {
    route,
    title,
    publicUrl: '/',
    user: { name: sesion.nombre, email: sesion.correo, initial: sesion.nombre.charAt(0) },
    logout: () => {
      cerrarSesion();
      history.replaceState(null, '', location.pathname);
    },
    menuOpen,
    sidebarClass: classNames('admin-sidebar', menuOpen && 'is-open'),
    links: adminLinks.map((link) => ({
      ...link,
      href: '#/' + link.id,
      current: route === link.id ? ('page' as const) : undefined,
      badge: link.id === 'pagos' && pending > 0 ? pending : null,
    })),
    toggleMenu: () => setMenuOpen((open) => !open),
    closeMenu: () => setMenuOpen(false),
    skipToContent,
  };
}
