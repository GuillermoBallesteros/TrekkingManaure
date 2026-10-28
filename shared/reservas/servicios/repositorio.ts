import { cupos } from '../../config';
import type { ReservasState } from '../tipos';

/**
 * Dónde viven las reservas. Hoy es el localStorage del navegador, compartido por el sitio
 * público y el panel porque ambos se sirven desde el mismo origen. Con backend, este módulo
 * se sustituye por uno que lea de la API; nadie más toca el almacenamiento.
 */
export type RepositorioReservas = {
  /** Instantánea actual; devuelve el mismo objeto mientras nada cambie. */
  read: () => ReservasState;
  write: (state: ReservasState) => void;
  /** Avisa de cambios hechos en esta pestaña o en otra; devuelve la función para dejar de oír. */
  subscribe: (listener: () => void) => () => void;
};

export const STORAGE_KEY = 'perija.reservas.v1';

export function initialState(): ReservasState {
  return {
    version: 1,
    registrations: [],
    capacity: cupos.iniciales,
    counters: { registration: 0, payment: 0 },
  };
}

function isState(value: unknown): value is ReservasState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<ReservasState>;
  return (
    state.version === 1 &&
    Array.isArray(state.registrations) &&
    typeof state.capacity === 'number' &&
    typeof state.counters?.registration === 'number' &&
    typeof state.counters?.payment === 'number'
  );
}

function parse(raw: string | null): ReservasState {
  if (!raw) return initialState();
  try {
    const value: unknown = JSON.parse(raw);
    return isState(value) ? value : initialState();
  } catch {
    return initialState();
  }
}

function createLocalRepository(): RepositorioReservas {
  const listeners = new Set<() => void>();
  // Si el navegador bloquea el almacenamiento, el estado vive solo en memoria.
  let storageUsable = true;
  let memory: string | null = null;
  let cachedRaw: string | null | undefined;
  let cached = initialState();

  function currentRaw() {
    if (!storageUsable) return memory;
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      storageUsable = false;
      return memory;
    }
  }

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) notify();
  }

  return {
    read() {
      const raw = currentRaw();
      if (raw !== cachedRaw) {
        cachedRaw = raw;
        cached = parse(raw);
      }
      return cached;
    },
    write(state) {
      const raw = JSON.stringify(state);
      memory = raw;
      try {
        localStorage.setItem(STORAGE_KEY, raw);
      } catch {
        // Sin almacenamiento persistente: se conserva en memoria hasta recargar.
        storageUsable = false;
      }
      notify();
    },
    subscribe(listener) {
      if (!listeners.size) window.addEventListener('storage', onStorage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (!listeners.size) window.removeEventListener('storage', onStorage);
      };
    },
  };
}

export const repositorio = createLocalRepository();
