/** Días, horas, minutos y segundos que faltan hasta `fecha`; todo en 0 si ya pasó. */
export function tiempoRestante(fecha: string, ahora = Date.now()): number[] {
  const seconds = Math.max(0, Math.floor((new Date(fecha).getTime() - ahora) / 1000));
  return [
    Math.floor(seconds / 86400),
    Math.floor((seconds % 86400) / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ];
}
