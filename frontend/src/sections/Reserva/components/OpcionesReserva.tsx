import type { PreEventHotel } from '../../../../../shared/reservas';
import { useOpcionesReserva } from '../../../hooks';
import type { Estadia, Extra, HotelFormulario } from '../../../types/reserva';

type Props = {
  stay: Estadia;
  onStay: (value: Estadia) => void;
  extras: Extra[];
  onExtras: (value: Extra) => void;
  companion: boolean;
  hotel: HotelFormulario;
  onHotel: (cambios: Partial<HotelFormulario>) => void;
  hotelCotizable: PreEventHotel | null;
  today: string;
  paramoAgotado: boolean;
};

export default function OpcionesReserva(props: Props) {
  const view = useOpcionesReserva(props);
  const hotel = view.hotel;

  return (
    <>
      <div className="form-block">
        <div className="form-block__head">
          <span className="form-block__n">3</span>
          <div>
            <h3>Opción de estadía</h3>
            <small>Elige dónde pasas la noche. Solo el páramo tiene cupos limitados.</small>
          </div>
        </div>
        {view.avisoParamo && (
          <p className="form-aviso" role="status">
            {view.avisoParamo}
          </p>
        )}
        <div className="choice-grid" role="radiogroup" aria-label="Opción de estadía">
          {view.stays.map((option) => (
            <label className="choice" key={option.value}>
              <input
                type="radio"
                name="estadia"
                value={option.value}
                required
                disabled={option.disabled}
                {...option.input}
              />
              <span className="choice__dot" />
              <span className="choice__text">
                <strong>{option.title}</strong>
                <small>{option.text}</small>
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="form-block">
        <div className="form-block__head">
          <span className="form-block__n">4</span>
          <div>
            <h3>Extras</h3>
            <small>Opcionales. Las actividades incluyen merienda.</small>
          </div>
        </div>
        <div className="extra-choices">
          {view.extras.map((extra) => (
            <label className="mini-choice" key={extra.id}>
              <input type="checkbox" checked={extra.checked} onChange={extra.toggle} />
              <span className="mini-choice__text">
                <strong>{extra.title}</strong>
                <small>{extra.text}</small>
              </span>
              <span className="mini-choice__price">{extra.price}</span>
            </label>
          ))}
          {hotel.disponible && (
            <label className="mini-choice">
              <input type="checkbox" checked={hotel.activo} onChange={hotel.alternar} />
              <span className="mini-choice__text">
                <strong>Llegar antes: hotel previo al evento</strong>
                <small>{hotel.texto}</small>
              </span>
              <span className="mini-choice__price">{hotel.precio}</span>
            </label>
          )}
        </div>
        {hotel.activo && (
          <div className="fields hotel-fields">
            <div className="field">
              <label htmlFor="hotelLlegada">
                Llegada al hotel <span className="req">*</span>
              </label>
              <input
                id="hotelLlegada"
                name="hotelLlegada"
                type="date"
                required
                {...hotel.llegada}
              />
            </div>
            <div className="field">
              <label htmlFor="hotelSalida">
                Salida del hotel <span className="req">*</span>
              </label>
              <input id="hotelSalida" name="hotelSalida" type="date" required {...hotel.salida} />
            </div>
            {hotel.conAcompanante && (
              <label className="mini-choice field--full">
                <input type="checkbox" {...hotel.conAcompanante} />
                <span className="mini-choice__text">
                  <strong>Mi acompañante también llega antes</strong>
                  <small>Se cobran las mismas noches para él o ella.</small>
                </span>
              </label>
            )}
            <p className="field-hint field--full" role="status">
              {hotel.calculo}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
