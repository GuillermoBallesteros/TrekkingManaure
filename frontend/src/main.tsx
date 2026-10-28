// Un solo punto de entrada: /admin carga el panel y cualquier otra ruta, el sitio público.
// Cada uno trae su propio CSS, así que solo se carga el de la aplicación visitada.
import { createRoot } from 'react-dom/client';

const esPanel = /^\/admin(\/|$)/.test(location.pathname);

async function montar() {
  const root = createRoot(document.getElementById('root')!);

  if (esPanel) {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.append(robots);
    const { default: AdminApp } = await import('../../admin/src/AdminApp');
    root.render(<AdminApp />);
    return;
  }

  // Mismo orden que antes: primero la aplicación (con el CSS de sus secciones), luego el global.
  const { default: App } = await import('./App');
  await import('./styles/global.css');
  root.render(<App />);
}

montar();
