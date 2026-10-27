import FichaSalud from './FichaSalud';

export default function ControlSeguridad() {
  return (
    <div className="form-block">
      <div className="form-block__head">
        <span className="form-block__n">2</span>
        <div>
          <h3>Control de seguridad</h3>
          <small>Salud del participante. Nos ayuda a conocer tu condición física.</small>
        </div>
      </div>
      <div className="fields">
        <FichaSalud />
      </div>
    </div>
  );
}
