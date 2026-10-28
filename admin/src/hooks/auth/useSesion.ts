import { useEffect, useSyncExternalStore } from 'react';
import { REVISION_SESION_MS } from '../../data/auth/sesion';
import { autenticacion } from '../../services';

/** Sesión vigente del panel; pasa a null al cerrarla aquí o en otra pestaña, o al vencer. */
export function useSesion() {
  const sesion = useSyncExternalStore(autenticacion.suscribir, autenticacion.leerSesion);

  useEffect(() => {
    const timer = window.setInterval(autenticacion.revisar, REVISION_SESION_MS);
    window.addEventListener('focus', autenticacion.revisar);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', autenticacion.revisar);
    };
  }, []);

  return { sesion, cerrarSesion: autenticacion.cerrarSesion };
}
