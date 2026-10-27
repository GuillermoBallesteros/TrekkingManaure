import CamposPersona from './CamposPersona';

export default function DatosPersonales() {
  return (
    <div className="form-block">
      <div className="form-block__head">
        <span className="form-block__n">1</span>
        <div>
          <h3>Datos personales</h3>
          <small>Información del participante.</small>
        </div>
      </div>
      <div className="fields">
        <CamposPersona conTalla />
      </div>
    </div>
  );
}
