import { useCamposPersona } from '../../../hooks';
import CampoTelefono from './CampoTelefono';

type Props = {
  /** Prefijo de name/id: vacío para el inscrito, 'acomp' para el acompañante. */
  prefijo?: string;
  /** Texto añadido a cada etiqueta para distinguirlas, p. ej. ' del acompañante'. */
  sufijo?: string;
  conTalla?: boolean;
  /** Avisa la fecha de nacimiento elegida (el titular la usa para saber si es menor). */
  onNacimiento?: (value: string) => void;
};

export default function CamposPersona({
  prefijo = '',
  sufijo = '',
  conTalla = false,
  onNacimiento,
}: Props) {
  const view = useCamposPersona(prefijo, onNacimiento);
  const ids = view.ids;
  const req = <span className="req">*</span>;

  return (
    <>
      <div className="field">
        <label htmlFor={ids.nombres}>
          Nombres{sufijo} {req}
        </label>
        <input
          id={ids.nombres}
          name={ids.nombres}
          required
          placeholder="Nombres"
          autoComplete={view.autoComplete.nombres}
          maxLength={60}
          pattern={view.patterns.nombre}
          title="Solo letras, de 2 a 60 caracteres"
        />
      </div>
      <div className="field">
        <label htmlFor={ids.apellidos}>
          Apellidos{sufijo} {req}
        </label>
        <input
          id={ids.apellidos}
          name={ids.apellidos}
          required
          placeholder="Apellidos"
          autoComplete={view.autoComplete.apellidos}
          maxLength={60}
          pattern={view.patterns.nombre}
          title="Solo letras, de 2 a 60 caracteres"
        />
      </div>
      <div className="field">
        <label htmlFor={ids.tipoDocumento}>
          Tipo de documento{sufijo} {req}
        </label>
        <select
          id={ids.tipoDocumento}
          name={ids.tipoDocumento}
          required
          defaultValue=""
          onChange={view.cambiarTipo}
        >
          <option value="" disabled>
            Selecciona
          </option>
          {view.tiposDocumento.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={ids.documento}>
          Número de documento{sufijo} {req}
        </label>
        <input
          id={ids.documento}
          name={ids.documento}
          required
          autoComplete="off"
          maxLength={20}
          disabled={view.documento.disabled}
          pattern={view.documento.pattern}
          title={view.documento.title}
          placeholder={view.documento.placeholder}
        />
      </div>
      <div className="field">
        <label htmlFor={ids.nacimiento}>
          Fecha de nacimiento{sufijo} {req}
        </label>
        <input
          id={ids.nacimiento}
          name={ids.nacimiento}
          type="date"
          required
          min={view.nacimiento.min}
          max={view.nacimiento.max}
          onChange={view.cambiarNacimiento}
        />
      </div>
      <div className="field">
        <label htmlFor={ids.genero}>
          Género{sufijo} {req}
        </label>
        <select id={ids.genero} name={ids.genero} required defaultValue="">
          <option value="" disabled>
            Selecciona
          </option>
          {view.generos.map((genero) => (
            <option key={genero} value={genero}>
              {genero}
            </option>
          ))}
        </select>
      </div>
      {conTalla && (
        <div className="field">
          <label htmlFor={ids.talla}>
            Talla de camisa{sufijo} {req}
          </label>
          <select id={ids.talla} name={ids.talla} required defaultValue="">
            <option value="" disabled>
              Selecciona
            </option>
            {view.tallas.map((talla) => (
              <option key={talla} value={talla}>
                {talla}
              </option>
            ))}
          </select>
        </div>
      )}
      <CampoTelefono
        prefijo={prefijo}
        base="telefono"
        etiqueta="Celular / WhatsApp"
        sufijo={sufijo}
        tipo="movil"
        quien={view.quien}
        autoComplete={view.autoComplete.telefono}
      />
      <div className="field">
        <label htmlFor={ids.correo}>
          Correo electrónico{sufijo} {req}
        </label>
        <input
          id={ids.correo}
          name={ids.correo}
          type="email"
          required
          placeholder="nombre@correo.com"
          autoComplete={view.autoComplete.correo}
          maxLength={254}
        />
      </div>
      <div className="field">
        <label htmlFor={ids.ciudad}>
          Ciudad de residencia{sufijo} {req}
        </label>
        <input
          id={ids.ciudad}
          name={ids.ciudad}
          required
          placeholder="Ciudad de residencia"
          autoComplete={view.autoComplete.ciudad}
          maxLength={60}
          pattern={view.patterns.ciudad}
          title="Solo letras, de 3 a 60 caracteres"
        />
      </div>
    </>
  );
}
