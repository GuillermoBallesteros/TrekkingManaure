import { useRef, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import Icon from '../../../../shared/components/Icon';
import { useBloquesProgresivos } from '../../hooks/useBloquesProgresivos';
import { useReserva } from '../../hooks/useReserva';
import type { Estadia } from '../../types/reserva';
import DatosPersonales from './components/DatosPersonales';
import OpcionesReserva from './components/OpcionesReserva';
import ControlSeguridad from './components/ControlSeguridad';
import Acompanante from './components/Acompanante';
import FormaPago from './components/FormaPago';
import ResumenReserva from './components/ResumenReserva';
import ResumenModal from './components/ResumenModal';
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
  const formRef = useRef<HTMLFormElement>(null);
  const { visibles, revisar } = useBloquesProgresivos(formRef);

  return (
    <section className="section reserva" id="reserva">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Reserva de cupo</span>
          <h2 className="section-title">
            Aparta tu <em>cupo</em>
          </h2>
          <p className="section-sub">
            Completa tus datos, elige cómo pagar y finaliza. Te llevamos a WhatsApp con tu
            información. Pagas por Nequi o llave Bre-B, la vía que prefieras.
          </p>
        </div>
        <div className="reserva-grid">
          <form
            className="form-card reveal"
            ref={formRef}
            onSubmit={state.submit}
            onChange={revisar}
            onInput={revisar}
          >
            <div className="bloque-progresivo" data-bloque hidden={visibles <= 0}>
              <DatosPersonales />
            </div>
            <div className="bloque-progresivo" data-bloque hidden={visibles <= 1}>
              <ControlSeguridad />
            </div>
            <div className="bloque-progresivo" data-bloque hidden={visibles <= 2}>
              <OpcionesReserva
                stay={stay}
                onStay={onStay}
                extras={state.extras}
                onExtras={state.toggleExtra}
              />
            </div>
            <div className="bloque-progresivo" data-bloque hidden={visibles <= 3}>
              <Acompanante
                companion={state.companion}
                onCompanion={state.setCompanion}
                kit={state.companionKit}
                onKit={state.setCompanionKit}
              />
            </div>
            <div className="bloque-progresivo" data-bloque hidden={visibles <= 4}>
              <FormaPago
                plan={state.plan}
                onPlan={state.setPlan}
                date={state.planDate}
                onDate={state.setPlanDate}
                quote={state.quote}
              />
            </div>
            <div className="bloque-progresivo" data-bloque hidden={visibles <= 5}>
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
                <p className="note form-note">
                  Primero revisas el resumen; después se abre WhatsApp con tus datos. No se realiza
                  ningún pago desde la página.
                </p>
                {state.error && (
                  <p className="form-error" role="alert">
                    {state.error}
                  </p>
                )}
              </div>
            </div>
          </form>
          <ResumenReserva stay={stay} planDate={state.planDate} quote={state.quote} />
        </div>
      </div>
      <Modal
        open={state.preview !== null}
        title="Resumen de tu reserva"
        className="modal--resumen"
        onClose={() => state.setPreview(null)}
      >
        {state.preview && (
          <ResumenModal resumen={state.preview} onBack={() => state.setPreview(null)} />
        )}
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
        <p>La inscripción está sujeta a validación de pago por la organización.</p>
        <p>
          El pago se hace por llave Bre-B y el cupo queda confirmado cuando la organización verifica
          el pago. Si un saldo no se paga en la fecha elegida, el cupo del kit se libera.
        </p>
      </Modal>
    </section>
  );
}
