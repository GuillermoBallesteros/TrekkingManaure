import { useDisponibilidad } from '../../../../shared/reservas';
import { textosMarquesina } from '../../data/home/marquesina';

/** Textos de la cinta de la portada, con los cupos del páramo vigentes. */
export function useMarquesina() {
  const { capacity } = useDisponibilidad();
  const textos = [capacity + ' cupos en el páramo', ...textosMarquesina];
  // Se duplican para que la cinta corra sin cortes.
  return [...textos, ...textos].map((texto, index) => ({ key: index, texto }));
}
