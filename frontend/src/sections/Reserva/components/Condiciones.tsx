import { useCondiciones } from '../../../hooks';

/** Texto completo de los términos y condiciones dentro del modal. */
export default function Condiciones() {
  const view = useCondiciones();

  return (
    <div className="condiciones">
      {view.secciones.map((seccion) => (
        <section key={seccion.titulo}>
          <h4>{seccion.titulo}</h4>
          {seccion.parrafos.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </section>
      ))}
      <p className="condiciones__version">Versión {view.version}</p>
    </div>
  );
}
