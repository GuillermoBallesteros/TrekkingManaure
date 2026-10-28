import { useEffect, useState } from 'react';
import { evento } from '../../../../shared/config';
import { UNIDADES_CUENTA } from '../../data/cupos/cuentaRegresiva';
import { tiempoRestante } from '../../utils/cupos/cuentaRegresiva';

/** Tiempo que falta para la largada, actualizado cada segundo. */
export function useCuentaRegresiva() {
  const [values, setValues] = useState(() => tiempoRestante(evento.largada));

  useEffect(() => {
    const timer = window.setInterval(() => setValues(tiempoRestante(evento.largada)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return values.map((value, index) => ({
    label: UNIDADES_CUENTA[index],
    value: String(value).padStart(2, '0'),
  }));
}
