import { useState } from 'react';
import { Navbar, Footer } from './components/layout';
import { Home } from './pages';
import Modal from '../../shared/components/Modal';
import Icon from '../../shared/components/Icon';
import { contacto, evento } from '../../shared/config';
import { formatDate } from '../../shared/utils/format';
import { useSmoothScroll } from './hooks';

const apertura = formatDate(evento.fechaAperturaInscripciones);

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  useSmoothScroll();

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Navbar />
      <Home />
      <Footer />
      {contacto.whatsappConfigurado ? (
        <a
          className="wa-float"
          href={'https://wa.me/' + contacto.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp"
        >
          <Icon name="whatsapp" />
        </a>
      ) : (
        <button
          type="button"
          className="wa-float"
          onClick={() => setContactOpen(true)}
          aria-label="Información de contacto"
        >
          <Icon name="whatsapp" />
        </button>
      )}
      <Modal open={contactOpen} title="Reservar con Asesor" onClose={() => setContactOpen(false)}>
        <p>
          El canal de WhatsApp de reservas se habilitará con la apertura de inscripciones, el{' '}
          {apertura}.
        </p>
        <p>
          Mientras tanto, explora la información del evento y prepara tu reserva en el formulario.
        </p>
        <a href="#reserva" className="btn btn--primary" onClick={() => setContactOpen(false)}>
          Ver formulario <Icon name="arrow" />
        </a>
      </Modal>
    </>
  );
}
