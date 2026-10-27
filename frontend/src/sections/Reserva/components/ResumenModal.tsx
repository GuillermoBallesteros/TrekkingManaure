import Icon from '../../../../../shared/components/Icon';
import { contacto } from '../../../../../shared/config';
import type { DatosPersona, ResumenReservaTexto } from '../../../types/reserva';
import { buildMessage, formatBirth, whatsappLink } from '../../../utils/reserva';
import { METODO_PAGO } from '../datosFormulario';
import './ResumenModal.css';

type Props = {
  resumen: ResumenReservaTexto;
  onBack: () => void;
};

function Fila({ label, value }: { label: string; value: string }) {
  return (
    <div className="resumen-fila">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Persona({ persona }: { persona: DatosPersona }) {
  return (
    <dl className="resumen-lista">
      <Fila label="Nombre" value={persona.nombre} />
      <Fila label="Documento" value={persona.tipoDocumento + ' ' + persona.documento} />
      <Fila label="Nacimiento" value={formatBirth(persona.nacimiento)} />
      <Fila label="Género" value={persona.genero} />
      {persona.talla && <Fila label="Talla de camisa" value={persona.talla} />}
      {persona.telefono && <Fila label="Teléfono" value={persona.telefono} />}
      {persona.correo && <Fila label="Correo" value={persona.correo} />}
      <Fila label="Ciudad" value={persona.ciudad} />
      <Fila label="Enfermedad" value={persona.salud.enfermedad} />
      <Fila label="Alergias" value={persona.salud.alergia} />
      <Fila label="Practica deporte" value={persona.salud.deporte} />
    </dl>
  );
}

export default function ResumenModal({ resumen, onBack }: Props) {
  const link = whatsappLink(contacto.whatsapp, buildMessage(resumen));
  const acompanante = resumen.acompanante;

  return (
    <div className="resumen-modal">
      <p className="resumen-modal__intro">
        Revisa tu información. Al continuar se abre WhatsApp con estos datos.
      </p>

      <section className="resumen-sec">
        <h4>Participante</h4>
        <Persona persona={resumen.participante} />
      </section>

      <section className="resumen-sec">
        <h4>Reserva</h4>
        <dl className="resumen-lista">
          <Fila label="Estadía" value={resumen.estadia} />
          <Fila label="Modalidad" value={resumen.modalidad} />
          {resumen.fechaRestante && (
            <Fila label="Pago del restante" value={resumen.fechaRestante} />
          )}
          <Fila label="Actividades extra" value={resumen.extras} />
        </dl>
      </section>

      <section className="resumen-sec">
        <h4>Acompañante</h4>
        {acompanante ? (
          <>
            <Persona persona={acompanante.persona} />
            <dl className="resumen-lista">
              <Fila label="Estadía" value={acompanante.estadia} />
              <Fila label="Kit" value={acompanante.kit} />
            </dl>
          </>
        ) : (
          <p>No llevas acompañante.</p>
        )}
      </section>

      <section className="resumen-sec resumen-sec--pago">
        <h4>Pagos</h4>
        <dl className="resumen-lista">
          <Fila label="A pagar ahora" value={resumen.ahora} />
          <Fila label="Saldo pendiente" value={resumen.saldo} />
          <Fila label="Total" value={resumen.total} />
        </dl>
      </section>

      <p className="resumen-metodo__elegido" role="status">
        Método de pago: <strong>{METODO_PAGO.label}</strong>
      </p>

      <div className="resumen-acciones">
        {link ? (
          <a className="btn btn--primary" href={link} target="_blank" rel="noreferrer">
            Continuar a WhatsApp <Icon name="whatsapp" />
          </a>
        ) : (
          <button className="btn btn--primary" type="button" disabled>
            WhatsApp aún no configurado
          </button>
        )}
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          Volver al formulario
        </button>
      </div>
    </div>
  );
}
