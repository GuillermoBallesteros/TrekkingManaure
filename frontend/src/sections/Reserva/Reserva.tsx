import { useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import Icon from '../../../../shared/components/Icon';
import { useReserva } from '../../hooks/useReserva';
import type { Estadia } from '../../types/reserva';
import DatosPersonales from './components/DatosPersonales';
import OpcionesReserva from './components/OpcionesReserva';
import ControlSeguridad from './components/ControlSeguridad';
import ModalidadInscripcion from './components/ModalidadInscripcion';
import Acompanante from './components/Acompanante';
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
            Completa tus datos, elige tu modalidad y finaliza. Te llevamos a WhatsApp con tu
            información y el pago se hace por Nequi.
          </p>
        </div>
        <div className="reserva-grid">
          <form className="form-card reveal" onSubmit={state.submit}>
            <DatosPersonales />
            <ControlSeguridad />
            <OpcionesReserva
              stay={stay}
              onStay={onStay}
              extras={state.extras}
              onExtras={state.toggleExtra}
            />
            <ModalidadInscripcion
              plan={state.plan}
              onPlan={state.setPlan}
              date={state.planDate}
              onDate={state.setPlanDate}
            />
            <Acompanante
              companion={state.companion}
              onCompanion={state.setCompanion}
              kit={state.companionKit}
              onKit={state.setCompanionKit}
              pago={state.companionPago}
              onPago={state.setCompanionPago}
              date={state.companionDate}
              onDate={state.setCompanionDate}
            />
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
                      Consultar condiciones
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
                Finalizar registro <Icon name="whatsapp" />
              </button>
              <p className="note form-preview-note">
                Primero revisas el resumen; después se abre WhatsApp con tus datos. No se realiza
                ningún pago desde la página.
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
            plan={state.plan}
            planDate={state.planDate}
            companion={state.companion}
            companionDate={state.companionDate}
            extrasTotal={state.extrasTotal}
            quote={state.quote}
          />
        </div>
      </div>
      <Modal
        open={state.preview !== null}
        title="Resumen de tu reserva"
        onClose={() => state.setPreview(null)}
      >
        <p>
          Revisa la información. Al continuar se abre WhatsApp con este mensaje; la organización te
          indica cómo pagar por Nequi y, una vez confirmado el pago, registra tu estado.
        </p>
        <pre className="wa-preview">{state.preview?.text}</pre>
        <div className="modal__actions">
          {state.preview?.link ? (
            <a
              className="btn btn--primary"
              href={state.preview.link}
              target="_blank"
              rel="noreferrer"
            >
              Continuar a WhatsApp <Icon name="whatsapp" />
            </a>
          ) : (
            <>
              <button className="btn btn--primary" disabled>
                WhatsApp aún no configurado
              </button>
              <p className="note">
                Falta el número de WhatsApp de la organización en la configuración del sitio.
              </p>
            </>
          )}
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
          El pago se hace por Nequi y el cupo queda confirmado cuando la organización verifica el
          pago. Si un saldo no se paga en la fecha elegida, el cupo del kit se libera.
        </p>
      </Modal>
    </section>
  );
}
