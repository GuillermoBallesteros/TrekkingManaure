import { useState } from 'react';
import {
  Inicio,
  Evento,
  Cupos,
  Kit,
  Costos,
  Alojamiento,
  Seguridad,
  Galeria,
  Reserva,
  Aliados,
} from '../../sections';
import Marquee from '../../components/ui/Marquee/Marquee';
import { useReveal } from '../../hooks/useReveal';
import type { Estadia } from '../../types/reserva';

export default function Home() {
  const [stay, setStay] = useState<Estadia>('');
  useReveal();

  return (
    <main id="contenido">
      <Inicio />
      <Marquee />
      <Evento />
      <Cupos />
      <Kit />
      <Costos />
      <Alojamiento onSelect={setStay} />
      <Seguridad />
      <Galeria />
      <Reserva stay={stay} onStay={setStay} />
      <Aliados />
    </main>
  );
}
