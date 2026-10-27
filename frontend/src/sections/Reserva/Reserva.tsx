import { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import Icon from '../../../../shared/components/Icon';
import Calendario from '../../components/ui/Calendario';
import { useReserva } from '../../hooks/useReserva';
import type { Estadia } from '../../types/reserva';
import DatosPersonales from './components/DatosPersonales';
import OpcionesReserva from './components/OpcionesReserva';
import Comprobante from './components/Comprobante';
import ResumenReserva from './components/ResumenReserva';
import './Reserva.css';

export default function Reserva({
  stay,
  onStay,
}: {
  stay: Estadia;
  onStay: (value: Estadia) => void;
}) {
  const state = useReserva(stay);
  const [conditionsOpen, setConditionsOpen] = useState(false);

  return (
    <section className="section reserva" id="reserva">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Reserva de cupo</span>
          <h2 className="section-title">
            Aparta tu <em>cupo</em>
          </h2>
          <p className="section-sub">
            Paso 1: paga los $50.000 y guarda el comprobante. Paso 2: llena tus datos, elige estadía
            y selecciona la fecha en que pagarás los $300.000 restantes.
          </p>
        </div>
        <div className="reserva-grid">
          <form className="form-card reveal" onSubmit={state.submit}>
            <DatosPersonales />
            <OpcionesReserva
              stay={stay}
              onStay={onStay}
              companion={state.companion}
              onCompanion={state.setCompanion}
              extras={state.extras}
              onExtras={state.toggleExtra}
            />
            <Comprobante file={state.file} onChange={state.changeFile} />
            <div className="form-block">
              <div className="form-block__head">
                <span className="form-block__n">5</span>
                <div>
                  <h3>Fecha de pago de los $300.000</h3>
                  <small>
                    Se habilita al adjuntar el comprobante. Elige un día dentro del plazo.
                  </small>
                </div>
              </div>
              <Calendario
                unlocked={Boolean(state.file)}
                selected={state.date}
                onSelect={state.setDate}
              />
              <p className="field-hint calendar-hint">
                La fecha elegida aparecerá en el resumen de tu reserva.
              </p>
            </div>
            <div className="form-block form-submit">
              <div className="toggle-line terms-toggle">
                <div className="toggle-line__text">
                  <strong>He revisado las condiciones de participación</strong>
                  <small>
                    <button
                      type="button"
                      className="conditions-link"
                      onClick={() => setConditionsOpen(true)}
                    >
                      Consultar condiciones de esta vista previa
                    </button>
                  </small>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    required
                    aria-label="He revisado las condiciones de participación"
                  />
                  <span className="switch__track" />
                </label>
              </div>
              <button type="submit" className="btn btn--primary btn--block">
                Revisar mi reserva <Icon name="whatsapp" />
              </button>
              <p className="note form-preview-note">
                Vista previa local: todavía no envía reservas, archivos ni pagos.
              </p>
              {state.error && (
                <p className="form-error" role="alert">
                  {state.error}
                </p>
              )}
            </div>
          </form>
          <ResumenReserva
            stay={stay}
            date={state.date}
            companion={state.companion}
            extrasTotal={state.extrasTotal}
            total={state.total}
          />
        </div>
      </div>
      <Modal
        open={state.preview !== null}
        title="Resumen de tu reserva"
        onClose={() => state.setPreview(null)}
      >
        <p>
          Revisa la información que completaste. Esta es una vista previa: no se ha enviado ni
          guardado una reserva.
        </p>
        <pre className="wa-preview">{state.preview}</pre>
        <div className="modal__channels">
          <div>
            <Icon name="whatsapp" /> Canal de reservas pendiente de conexión.
          </div>
          <div>
            <Icon name="sheet" /> Registro administrativo y comprobantes pendientes de integración.
          </div>
        </div>
        <div className="modal__actions">
          <button className="btn btn--primary" disabled>
            Envío aún no habilitado
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => state.setPreview(null)}>
            Volver al formulario
          </button>
        </div>
      </Modal>
      <Modal
        open={conditionsOpen}
        title="Condiciones de participación"
        onClose={() => setConditionsOpen(false)}
      >
        <p>
          La experiencia contempla un recorrido de montaña, bajas temperaturas y preparación
          personal. Revisa las recomendaciones de seguridad antes de participar.
        </p>
        <p>
          La inscripción está sujeta a validación de pago por la organización. Las condiciones
          definitivas de cancelaciones, tratamiento de datos y uso de imagen deben publicarse antes
          de habilitar las reservas reales.
        </p>
        <p>
          El formulario actual sirve para revisar el diseño y el resumen. No transmite archivos ni
          almacena tus datos.
        </p>
      </Modal>
    </section>
  );
}
