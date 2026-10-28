import { useEffect, useState, useSyncExternalStore } from 'react';
import { todayInColombia } from '../../utils/format';
import { repositorio } from '../servicios/repositorio';
import { getAvailability } from '../utils/cupos';

/** Fecha de hoy en Colombia; se actualiza al volver a la pestaña y cada minuto. */
export function useHoy() {
  const [today, setToday] = useState(todayInColombia);

  useEffect(() => {
    const refresh = () => setToday(todayInColombia());
    const timer = window.setInterval(refresh, 60000);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return today;
}

/** Reservas y capacidad vigentes; se re-renderiza con cualquier cambio, aquí o en otra pestaña. */
export function useReservas() {
  const state = useSyncExternalStore(repositorio.subscribe, repositorio.read);
  const today = useHoy();

  return { registrations: state.registrations, capacity: state.capacity, today };
}

export function useDisponibilidad() {
  const { registrations, capacity } = useReservas();
  return getAvailability(registrations, capacity);
}
