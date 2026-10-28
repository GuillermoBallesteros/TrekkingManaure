import CamposPersona from './CamposPersona';

export default function DatosPersonales({
  onNacimiento,
}: {
  onNacimiento: (value: string) => void;
}) {
  return (
    <div className="form-block">
      <div className="form-block__head">
        <span className="form-block__n">1</span>
        <div>
          <h3>Datos personales</h3>
          <small>Información y contacto del participante.</small>
        </div>
      </div>
      <div className="fields">
        <CamposPersona conTalla onNacimiento={onNacimiento} />
      </div>
    </div>
  );
}
