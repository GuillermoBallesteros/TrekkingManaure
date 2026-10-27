import { useEffect, useState, type MouseEvent } from 'react';
import { useAdminPreview } from '../../context/AdminPreviewContext';
import { adminLinks, type AdminRoute } from '../../data/navegacion/enlaces';
import { classNames } from '../../utils/comun/classNames';
import { countPendingReviews } from '../../utils/comun/inscripcion';

function readRoute() {
  return (location.hash.slice(2) || 'acceso') as AdminRoute;
}

function focusContent() {
  document.getElementById('admin-content')?.focus();
}

export function useAdminNavigation() {
  const { registrations } = useAdminPreview();
  const [route, setRoute] = useState<AdminRoute>(readRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const pending = countPendingReviews(registrations);
  const title = adminLinks.find((link) => link.id === route)?.label || 'Vista general';
  const publicUrl =
    import.meta.env.VITE_PUBLIC_URL || location.protocol + '//' + location.hostname + ':5173';

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
    document.title = (route === 'acceso' ? 'Acceso' : title) + ' · Perijá Admin';
    document.getElementById('admin-content')?.focus({ preventScroll: true });
  }, [route, title]);

  function skipToContent(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    focusContent();
  }

  return {
    route,
    title,
    publicUrl,
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
