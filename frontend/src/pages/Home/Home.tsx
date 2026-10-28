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
import { Marquee } from '../../components';
import { useHome } from '../../hooks';

export default function Home() {
  const home = useHome();

  return (
    <main id="contenido">
      <Inicio />
      <Marquee />
      <Evento />
      <Cupos />
      <Kit />
      <Costos />
      <Alojamiento onSelect={home.setStay} />
      <Seguridad />
      <Galeria />
      <Reserva stay={home.stay} onStay={home.setStay} />
      <Aliados />
    </main>
  );
}
