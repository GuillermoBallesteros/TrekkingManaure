import { todayInColombia } from '../../../../../shared/utils/format';
import { fieldName } from '../../../utils/reserva';
import {
  GENEROS,
  fechasNacimientoPermitidas,
  PATRON_DOCUMENTO,
  PATRON_NOMBRE,
  PATRON_TELEFONO,
  TALLAS,
  TIPOS_DOCUMENTO,
} from '../datosFormulario';

type Props = {
  /** Prefijo de name/id: vacío para el inscrito, 'acomp' para el acompañante. */
  prefijo?: string;
  /** Texto añadido a cada etiqueta para distinguirlas, p. ej. ' del acompañante'. */
  sufijo?: string;
  conTalla?: boolean;
};

export default function CamposPersona({ prefijo = '', sufijo = '', conTalla = false }: Props) {
  const id = (base: string) => fieldName(prefijo, base);
  const req = <span className="req">*</span>;
  const nacimiento = fechasNacimientoPermitidas(todayInColombia());

  return (
    <>
      <div className="field">
        <label htmlFor={id('nombres')}>
          Nombres{sufijo} {req}
        </label>
        <input
          id={id('nombres')}
          name={id('nombres')}
          required
          placeholder="Nombres"
          autoComplete={prefijo ? 'off' : 'given-name'}
          maxLength={100}
          pattern={PATRON_NOMBRE}
        />
      </div>
      <div className="field">
        <label htmlFor={id('apellidos')}>
          Apellidos{sufijo} {req}
        </label>
        <input
          id={id('apellidos')}
          name={id('apellidos')}
          required
          placeholder="Apellidos"
          autoComplete={prefijo ? 'off' : 'family-name'}
          maxLength={100}
          pattern={PATRON_NOMBRE}
        />
      </div>
      <div className="field">
        <label htmlFor={id('tipoDocumento')}>
          Tipo de documento{sufijo} {req}
        </label>
        <select id={id('tipoDocumento')} name={id('tipoDocumento')} required defaultValue="">
          <option value="" disabled>
            Selecciona
          </option>
          {TIPOS_DOCUMENTO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={id('documento')}>
          Número de documento{sufijo} {req}
        </label>
        <input
          id={id('documento')}
          name={id('documento')}
          required
          placeholder="Número de documento"
          autoComplete="off"
          maxLength={20}
          pattern={PATRON_DOCUMENTO}
          title="Entre 5 y 20 letras o números, sin espacios ni símbolos"
        />
      </div>
      <div className="field">
        <label htmlFor={id('nacimiento')}>
          Fecha de nacimiento{sufijo} {req}
        </label>
        <input
          id={id('nacimiento')}
          name={id('nacimiento')}
          type="date"
          required
          min={nacimiento.min}
          max={nacimiento.max}
        />
      </div>
      <div className="field">
        <label htmlFor={id('genero')}>
          Género{sufijo} {req}
        </label>
        <select id={id('genero')} name={id('genero')} required defaultValue="">
          <option value="" disabled>
            Selecciona
          </option>
          {GENEROS.map((genero) => (
            <option key={genero} value={genero}>
              {genero}
            </option>
          ))}
        </select>
      </div>
      {conTalla && (
        <div className="field">
          <label htmlFor={id('talla')}>Talla de camisa {req}</label>
          <select id={id('talla')} name={id('talla')} required defaultValue="">
            <option value="" disabled>
              Selecciona
            </option>
            {TALLAS.map((talla) => (
              <option key={talla} value={talla}>
                {talla}
              </option>
            ))}
          </select>
        </div>
      )}
      {!prefijo && (
        <>
          <div className="field">
            <label htmlFor={id('telefono')}>
              Teléfono / WhatsApp{sufijo} {req}
            </label>
            <input
              id={id('telefono')}
              name={id('telefono')}
              type="tel"
              required
              placeholder="300 000 0000"
              autoComplete="tel"
              maxLength={20}
              pattern={PATRON_TELEFONO}
              title="Entre 7 y 20 caracteres: números, espacios o +"
            />
          </div>
          <div className="field">
            <label htmlFor={id('correo')}>Correo electrónico{sufijo}</label>
            <input
              id={id('correo')}
              name={id('correo')}
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              maxLength={150}
            />
          </div>
        </>
      )}
      <div className="field">
        <label htmlFor={id('ciudad')}>Ciudad{sufijo}</label>
        <input
          id={id('ciudad')}
          name={id('ciudad')}
          placeholder="Ciudad de residencia"
          autoComplete={prefijo ? 'off' : 'address-level2'}
          maxLength={150}
        />
      </div>
    </>
  );
}
