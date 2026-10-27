import { useState } from 'react';
import {
  EDAD_MAX,
  EDAD_MIN,
  EPS_CESAR,
  EPS_OTRA,
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
  const [eps, setEps] = useState('');
  const id = (base: string) =>
    prefijo ? prefijo + base.charAt(0).toUpperCase() + base.slice(1) : base;
  const req = <span className="req">*</span>;

  return (
    <>
      <div className="field field--full">
        <label htmlFor={id('nombre')}>
          Nombre completo{sufijo} {req}
        </label>
        <input
          id={id('nombre')}
          name={id('nombre')}
          required
          placeholder="Nombres y apellidos"
          autoComplete={prefijo ? 'off' : 'name'}
          maxLength={150}
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
        <label htmlFor={id('edad')}>
          Edad{sufijo} {req}
        </label>
        <input
          id={id('edad')}
          name={id('edad')}
          type="number"
          inputMode="numeric"
          required
          min={EDAD_MIN}
          max={EDAD_MAX}
          step={1}
          placeholder="Años"
        />
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
          autoComplete={prefijo ? 'off' : 'tel'}
          maxLength={15}
          pattern={PATRON_TELEFONO}
          title="Entre 7 y 15 números"
        />
      </div>
      <div className="field">
        <label htmlFor={id('correo')}>Correo electrónico{sufijo}</label>
        <input
          id={id('correo')}
          name={id('correo')}
          type="email"
          placeholder="correo@ejemplo.com"
          autoComplete={prefijo ? 'off' : 'email'}
          maxLength={150}
        />
      </div>
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
      <div className="field">
        <label htmlFor={id('emergenciaNombre')}>
          Contacto de emergencia, nombre{sufijo} {req}
        </label>
        <input
          id={id('emergenciaNombre')}
          name={id('emergenciaNombre')}
          required
          placeholder="Nombre del contacto"
          maxLength={150}
          pattern={PATRON_NOMBRE}
        />
      </div>
      <div className="field">
        <label htmlFor={id('emergenciaTelefono')}>
          Contacto de emergencia, teléfono{sufijo} {req}
        </label>
        <input
          id={id('emergenciaTelefono')}
          name={id('emergenciaTelefono')}
          type="tel"
          required
          placeholder="300 000 0000"
          autoComplete="off"
          maxLength={15}
          pattern={PATRON_TELEFONO}
          title="Entre 7 y 15 números"
        />
      </div>
      <div className="field field--full">
        <label htmlFor={id('eps')}>
          EPS{sufijo} {req}
        </label>
        <select
          id={id('eps')}
          name={id('eps')}
          required
          value={eps}
          onChange={(event) => setEps(event.target.value)}
        >
          <option value="" disabled>
            Selecciona la EPS
          </option>
          {EPS_CESAR.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
          <option value={EPS_OTRA}>{EPS_OTRA}</option>
        </select>
      </div>
      {eps === EPS_OTRA && (
        <div className="field field--full">
          <label htmlFor={id('epsOtra')}>
            ¿Cuál EPS o seguro?{sufijo} {req}
          </label>
          <input
            id={id('epsOtra')}
            name={id('epsOtra')}
            required
            placeholder="Nombre de la entidad"
            maxLength={100}
            pattern={PATRON_NOMBRE}
          />
        </div>
      )}
    </>
  );
}
