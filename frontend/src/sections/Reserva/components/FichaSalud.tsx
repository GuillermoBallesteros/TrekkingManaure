import { PREGUNTAS_SALUD } from '../../../data/reserva/formulario';
import PreguntaSiNo from './PreguntaSiNo';

/** Ficha de salud: enfermedad, alergias, discapacidad y actividad física. */
export default function FichaSalud({ prefijo = '' }: { prefijo?: string }) {
  return (
    <>
      {PREGUNTAS_SALUD.map((item) => (
        <PreguntaSiNo
          key={item.base}
          prefijo={prefijo}
          base={item.base}
          pregunta={item.pregunta}
          detalle={item.detalle}
        />
      ))}
    </>
  );
}
