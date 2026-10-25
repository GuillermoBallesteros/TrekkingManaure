const fields = [
  {
    name: 'nombre',
    label: 'Nombre completo',
    placeholder: 'Nombres y apellidos',
    autoComplete: 'name',
    required: true,
    full: true,
  },
  { name: 'cedula', label: 'Cédula', placeholder: 'Número de documento', required: true },
  {
    name: 'telefono',
    label: 'Teléfono / WhatsApp',
    placeholder: '300 000 0000',
    type: 'tel',
    autoComplete: 'tel',
    required: true,
  },
  {
    name: 'correo',
    label: 'Correo electrónico',
    placeholder: 'correo@ejemplo.com',
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'ciudad',
    label: 'Ciudad',
    placeholder: 'Ciudad de residencia',
    autoComplete: 'address-level2',
  },
  { name: 'emergencia', label: 'Contacto de emergencia', placeholder: 'Nombre y teléfono' },
  { name: 'eps', label: 'EPS / seguro', placeholder: 'Entidad de salud', full: true },
];

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
        {fields.map((field) => (
          <div key={field.name} className={'field ' + (field.full ? 'field--full' : '')}>
            <label htmlFor={field.name}>
              {field.label} {field.required && <span className="req">*</span>}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              inputMode={field.name === 'cedula' ? 'numeric' : undefined}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              required={field.required}
              maxLength={field.name === 'cedula' ? 20 : 150}
              pattern={
                field.name === 'cedula'
                  ? '[0-9]{5,20}'
                  : field.name === 'nombre'
                    ? '.*[^ ].*'
                    : undefined
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
