import { CONDICIONES, VERSION_TERMINOS } from '../../../data/reserva/condiciones';

/** Texto completo de los términos y condiciones dentro del modal. */
export default function Condiciones() {
  return (
    <div className="condiciones">
      {CONDICIONES.map((seccion) => (
        <section key={seccion.titulo}>
          <h4>{seccion.titulo}</h4>
          {seccion.parrafos.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </section>
      ))}
      <p className="condiciones__version">Versión {VERSION_TERMINOS}</p>
    </div>
  );
}
