import { useState } from 'react';
import { contacto, evento } from '../../../../shared/config';
import { formatDate } from '../../../../shared/utils/format';

/** Botón flotante de WhatsApp; sin número configurado abre un aviso en lugar del chat. */
export function useContacto() {
  const [open, setOpen] = useState(false);

  return {
    whatsappHref: contacto.whatsappConfigurado ? 'https://wa.me/' + contacto.whatsapp : null,
    apertura: formatDate(evento.fechaAperturaInscripciones),
    open,
    openModal: () => setOpen(true),
    close: () => setOpen(false),
  };
}
