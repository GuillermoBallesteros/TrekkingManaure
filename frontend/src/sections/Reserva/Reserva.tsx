import Modal from '../../../../shared/components/Modal';
import Icon from '../../../../shared/components/Icon';
import { useReserva } from '../../hooks';
import type { Estadia } from '../../types/reserva';
import DatosPersonales from './components/DatosPersonales';
import OpcionesReserva from './components/OpcionesReserva';
import ControlSeguridad from './components/ControlSeguridad';
import Acompanante from './components/Acompanante';
import FormaPago from './components/FormaPago';
import ResumenReserva from './components/ResumenReserva';
import ResumenModal from './components/ResumenModal';
import Terminos from './components/Terminos';
import Condiciones from './components/Condiciones';
import './Reserva.css';

export default function Reserva({
  stay,
  onStay,
}: {
  stay: Estadia;
  onStay: (value: Estadia) => void;
}) {
  const state = useReserva(stay, onStay);

  return (
    <section className="section reserva" id="reserva">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Reserva de cupo</span>
          <h2 className="section-title">
            Aparta tu <em>cupo</em>
          </h2>
          <p className="section-sub">
            Completa tus datos, elige cómo pagar y registra tu reserva. Pagas por llave Bre-B y la
            organización confirma tu cupo cuando verifica el pago.
          </p>
        </div>
        <div className="reserva-grid">
          <form
            key={state.formKey}
            className="form-card reveal"
            ref={state.formRef}
            onSubmit={state.submit}
            onChange={state.revisar}
            onInput={state.revisar}
          >
            {state.agotado && (
              <p className="form-error" role="status">
                {state.soldOutText}
              </p>
            )}
            <div className="bloque-progresivo" data-bloque hidden={state.isHidden(0)}>
              <DatosPersonales onNacimiento={state.setBirthDate} />
            </div>
            <div className="bloque-progresivo" data-bloque hidden={state.isHidden(1)}>
              <ControlSeguridad esMenor={state.esMenor} />
            </div>
            <div className="bloque-progresivo" data-bloque hidden={state.isHidden(2)}>
              <OpcionesReserva
                stay={stay}
                onStay={onStay}
                extras={state.extras}
                onExtras={state.toggleExtra}
                companion={state.companion}
                hotel={state.hotel}
                onHotel={state.updateHotel}
                hotelCotizable={state.preEventHotel}
                today={state.today}
              />
            </div>
            <div className="bloque-progresivo" data-bloque hidden={state.isHidden(3)}>
              <Acompanante
                companion={state.companion}
                onCompanion={state.setCompanion}
                kit={state.companionKit}
                onKit={state.setCompanionKit}
              />
            </div>
            <div className="bloque-progresivo" data-bloque hidden={state.isHidden(4)}>
              <FormaPago
                plan={state.plan}
                onPlan={state.setPlan}
                date={state.planDate}
                onDate={state.setPlanDate}
                quote={state.quote}
              />
            </div>
            <div className="bloque-progresivo" data-bloque hidden={state.isHidden(5)}>
              <div className="form-block form-submit">
                <Terminos companion={state.companion} onOpen={state.openConditions} />
                {state.soldOut && (
                  <p className="form-error" role="status">
                    {state.soldOutText}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn btn--primary btn--block"
                  disabled={state.soldOut}
                >
                  Revisar y registrar <Icon name="arrow" />
                </button>
                <p className="note form-note">
                  Primero revisas el resumen y confirmas. Tu reserva y la aceptación de los términos
                  quedan registradas y pendientes hasta que la organización verifique tu pago. No se
                  paga desde la página.
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
        title={state.previewState === 'registrada' ? 'Reserva registrada' : 'Resumen de tu reserva'}
        className="modal--resumen"
        onClose={state.closePreview}
      >
        {state.preview && state.previewState && (
          <ResumenModal
            resumen={state.preview}
            estado={state.previewState}
            error={state.previewError}
            onConfirm={state.confirm}
            onBack={state.closePreview}
          />
        )}
      </Modal>
      <Modal
        open={state.conditionsOpen}
        title="Términos y condiciones"
        className="modal--condiciones"
        onClose={state.closeConditions}
      >
        <Condiciones />
      </Modal>
    </section>
  );
}
