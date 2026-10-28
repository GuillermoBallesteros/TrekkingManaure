import type { Result } from '../../../shared/reservas';
import { CLAVE_SESION, DURACION_RECORDADA_MS, DURACION_SESION_MS } from '../data/auth/sesion';
import {
  nombreDesdeCorreo,
  validarCredenciales,
  type Credenciales,
  type ErroresAcceso,
} from '../utils/auth/validaciones';

/**
 * Acceso simulado al panel. Acepta cualquier correo y contraseña con formato válido y crea una
 * sesión local con vencimiento. Al conectar el backend, iniciarSesion llama a POST /auth/login
 * (que rechaza credenciales incorrectas y bloquea intentos) y guarda el token que devuelva.
 */
export type Sesion = {
  token: string;
  correo: string;
  nombre: string;
  iniciadaEn: number;
  expiraEn: number;
  recordada: boolean;
};

export type ResultadoAcceso = Result<Sesion> & { campos?: ErroresAcceso };

const LATENCIA_MS = 400;
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedSesion: Sesion | null = null;

function token() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);
}

function almacenes(): Storage[] {
  try {
    return [sessionStorage, localStorage];
  } catch {
    return [];
  }
}

function leerRaw() {
  for (const storage of almacenes()) {
    try {
      const raw = storage.getItem(CLAVE_SESION);
      if (raw) return raw;
    } catch {
      // Almacenamiento bloqueado: se prueba el siguiente.
    }
  }
  return null;
}

function esSesion(value: unknown): value is Sesion {
  if (!value || typeof value !== 'object') return false;
  const sesion = value as Partial<Sesion>;
  return (
    typeof sesion.token === 'string' &&
    typeof sesion.correo === 'string' &&
    typeof sesion.nombre === 'string' &&
    typeof sesion.expiraEn === 'number'
  );
}

function borrar() {
  for (const storage of almacenes()) {
    try {
      storage.removeItem(CLAVE_SESION);
    } catch {
      // Nada que borrar en un almacenamiento bloqueado.
    }
  }
}

function notificar() {
  listeners.forEach((listener) => listener());
}

function alCambiarOtraPestana(event: StorageEvent) {
  if (event.key === CLAVE_SESION || event.key === null) notificar();
}

export const autenticacion = {
  /** Sesión vigente, o null si no hay, está dañada o ya venció. */
  leerSesion(): Sesion | null {
    const raw = leerRaw();
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        const value: unknown = raw ? JSON.parse(raw) : null;
        cachedSesion = esSesion(value) ? value : null;
      } catch {
        cachedSesion = null;
      }
    }
    return cachedSesion && cachedSesion.expiraEn > Date.now() ? cachedSesion : null;
  },

  async iniciarSesion(credenciales: Credenciales, recordar: boolean): Promise<ResultadoAcceso> {
    await new Promise((resolve) => setTimeout(resolve, LATENCIA_MS));
    const campos = validarCredenciales(credenciales);
    if (Object.keys(campos).length) {
      return { ok: false, error: 'Revisa los datos marcados.', campos };
    }

    const correo = credenciales.correo.trim().toLowerCase();
    const ahora = Date.now();
    const sesion: Sesion = {
      token: token(),
      correo,
      nombre: nombreDesdeCorreo(correo) || correo,
      iniciadaEn: ahora,
      expiraEn: ahora + (recordar ? DURACION_RECORDADA_MS : DURACION_SESION_MS),
      recordada: recordar,
    };

    borrar();
    try {
      (recordar ? localStorage : sessionStorage).setItem(CLAVE_SESION, JSON.stringify(sesion));
    } catch {
      return { ok: false, error: 'El navegador no permite guardar la sesión.' };
    }
    notificar();
    return { ok: true, data: sesion };
  },

  cerrarSesion() {
    borrar();
    notificar();
  },

  /** Avisa cuando la sesión cambia en esta pestaña o en otra (por ejemplo, al cerrarla). */
  suscribir(listener: () => void) {
    if (!listeners.size) window.addEventListener('storage', alCambiarOtraPestana);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (!listeners.size) window.removeEventListener('storage', alCambiarOtraPestana);
    };
  },

  /** Fuerza a releer la sesión, por ejemplo para detectar que venció. */
  revisar: notificar,
};
