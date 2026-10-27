import PreguntaSiNo from './PreguntaSiNo';

/** Ficha de salud para detectar condición física y sedentarismo. */
export default function FichaSalud({ prefijo = '' }: { prefijo?: string }) {
  return (
    <>
      <PreguntaSiNo
        prefijo={prefijo}
        base="enfermedad"
        pregunta="¿Sufre alguna enfermedad?"
        detalle="¿Cuál enfermedad?"
      />
      <PreguntaSiNo
        prefijo={prefijo}
        base="alergia"
        pregunta="¿Sufre alergias?"
        detalle="¿Cuál alergia?"
      />
      <PreguntaSiNo prefijo={prefijo} base="deporte" pregunta="¿Practica deporte regularmente?" />
    </>
  );
}
