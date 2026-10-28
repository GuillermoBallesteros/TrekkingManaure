import { useCamposPersona } from '../../../hooks';

type Props = {
  /** Prefijo de name/id: vacío para el inscrito, 'acomp' para el acompañante. */
  prefijo?: string;
  /** Texto añadido a cada etiqueta para distinguirlas, p. ej. ' del acompañante'. */
  sufijo?: string;
  conTalla?: boolean;
};

export default function CamposPersona({ prefijo = '', sufijo = '', conTalla = false }: Props) {
  const view = useCamposPersona(prefijo);
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
          maxLength={100}
          pattern={view.patterns.nombre}
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
          maxLength={100}
          pattern={view.patterns.nombre}
        />
      </div>
      <div className="field">
        <label htmlFor={ids.tipoDocumento}>
          Tipo de documento{sufijo} {req}
        </label>
        <select id={ids.tipoDocumento} name={ids.tipoDocumento} required defaultValue="">
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
          placeholder="Número de documento"
          autoComplete="off"
          maxLength={20}
          pattern={view.patterns.documento}
          title="Entre 5 y 20 letras o números, sin espacios ni símbolos"
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
          <label htmlFor={ids.talla}>Talla de camisa {req}</label>
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
      {view.titular && (
        <>
          <div className="field">
            <label htmlFor={ids.telefono}>
              Teléfono / WhatsApp{sufijo} {req}
            </label>
            <input
              id={ids.telefono}
              name={ids.telefono}
              type="tel"
              required
              placeholder="300 000 0000"
              autoComplete="tel"
              maxLength={20}
              pattern={view.patterns.telefono}
              title="Entre 7 y 20 caracteres: números, espacios o +"
            />
          </div>
          <div className="field">
            <label htmlFor={ids.correo}>Correo electrónico{sufijo}</label>
            <input
              id={ids.correo}
              name={ids.correo}
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              maxLength={150}
            />
          </div>
        </>
      )}
      <div className="field">
        <label htmlFor={ids.ciudad}>Ciudad{sufijo}</label>
        <input
          id={ids.ciudad}
          name={ids.ciudad}
          placeholder="Ciudad de residencia"
          autoComplete={view.autoComplete.ciudad}
          maxLength={150}
        />
      </div>
    </>
  );
}
