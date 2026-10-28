import { useRef, useState, type FormEvent } from 'react';
import {
  cotizar,
  etiquetasExtra,
  etiquetasPlan,
  reservasApi,
  useDisponibilidad,
  useReservas,
  validateNewRegistration,
  type NewRegistration,
} from '../../../../shared/reservas';
import { formatDate, formatMoney } from '../../../../shared/utils/format';
import { readPerson } from '../../utils/reserva/formulario';
import { buildNewRegistration } from '../../utils/reserva/nuevaReserva';
import type { Estadia, Extra, PlanPago, ResumenReservaTexto } from '../../types/reserva';
import { useBloquesProgresivos } from './useBloquesProgresivos';

/** Pasos del envío: revisar el resumen, registrar y confirmar. */
type Envio = {
  resumen: ResumenReservaTexto;
  reserva: NewRegistration;
  estado: 'revision' | 'enviando' | 'registrada';
  error: string;
};

export function useReserva(stay: Estadia, onStay: (value: Estadia) => void) {
  // null = todavía no elegido: la persona debe marcarlo, no viene preseleccionado.
  const [plan, setPlan] = useState<PlanPago | null>(null);
  const [planDate, setPlanDate] = useState('');
  const [companion, setCompanion] = useState(false);
  const [companionKit, setCompanionKit] = useState<boolean | null>(null);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [error, setError] = useState('');
  const [envio, setEnvio] = useState<Envio | null>(null);
  const [conditionsOpen, setConditionsOpen] = useState(false);
  // Cambiar la clave vuelve a montar el formulario vacío después de registrar una reserva.
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const { visibles, revisar, reiniciar } = useBloquesProgresivos(formRef);
  const { registrations, capacity, today } = useReservas();
  const availability = useDisponibilidad();

  const quote = cotizar({
    plan,
    companion: companion ? { kit: companionKit === true } : null,
    extras,
  });
  const needsDate = plan === 'apartado';
  const people = companion ? 2 : 1;
  const soldOut = availability.available < people;

  function toggleExtra(extra: Extra) {
    setExtras((current) =>
      current.includes(extra) ? current.filter((item) => item !== extra) : [...current, extra],
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;

    if (!form.reportValidity()) return;
    if (!stay) {
      setError('Elige tu estadía.');
      return;
    }
    if (!plan) {
      setError('Elige la forma de pago.');
      return;
    }
    if (needsDate && !planDate) {
      setError('Elige la fecha en que pagarás el restante.');
      return;
    }

    const data = new FormData(form);
    const reserva = buildNewRegistration(data, {
      stay,
      plan,
      planDate,
      companion,
      companionKit,
      extras,
    });
    // Las mismas reglas que aplica el servicio: se avisan antes de abrir el resumen.
    const invalid = validateNewRegistration(reserva, registrations, capacity, today);
    if (invalid) {
      setError(invalid);
      return;
    }

    setEnvio({
      reserva,
      estado: 'revision',
      error: '',
      resumen: {
        codigo: null,
        participante: readPerson(data, '', true),
        estadia: stay,
        modalidad: etiquetasPlan[plan],
        fechaRestante: needsDate ? formatDate(planDate) : null,
        acompanante: companion
          ? {
              persona: readPerson(data, 'acomp', companionKit === true),
              estadia: String(data.get('acompEstadia')),
              kit: companionKit ? 'Sí' : 'No',
            }
          : null,
        extras: extras.length ? extras.map((extra) => etiquetasExtra[extra]).join(', ') : 'Ninguna',
        ahora: formatMoney(quote.ahora),
        saldo: formatMoney(quote.saldo),
        total: formatMoney(quote.total),
      },
    });
  }

  async function confirm() {
    if (!envio || envio.estado !== 'revision') return;
    setEnvio({ ...envio, estado: 'enviando', error: '' });
    const result = await reservasApi.crearReserva(envio.reserva);
    if (!result.ok) {
      setEnvio({ ...envio, estado: 'revision', error: result.error });
      return;
    }
    setEnvio({
      ...envio,
      estado: 'registrada',
      resumen: { ...envio.resumen, codigo: result.data.id },
    });
  }

  /** Tras registrar, cerrar el resumen deja el formulario listo para otra reserva. */
  function closePreview() {
    if (envio?.estado === 'registrada') {
      setPlan(null);
      setPlanDate('');
      setCompanion(false);
      setCompanionKit(null);
      setExtras([]);
      onStay('');
      reiniciar();
      setFormKey((key) => key + 1);
    }
    if (envio?.estado !== 'enviando') setEnvio(null);
  }

  return {
    formRef,
    formKey,
    revisar,
    /** Los bloques del formulario aparecen uno a uno; el índice empieza en 0. */
    isHidden: (bloque: number) => visibles <= bloque,
    plan,
    setPlan,
    planDate,
    setPlanDate,
    companion,
    setCompanion,
    companionKit,
    setCompanionKit,
    extras,
    toggleExtra,
    error,
    soldOut,
    agotado: availability.soldOut,
    soldOutText: availability.soldOut
      ? 'Los cupos están agotados por ahora. Escríbenos por WhatsApp para quedar en lista de espera.'
      : 'Solo queda ' + availability.available + ' cupo: no alcanza para ti y tu acompañante.',
    preview: envio?.resumen ?? null,
    previewState: envio?.estado ?? null,
    previewError: envio?.error ?? '',
    confirm,
    closePreview,
    conditionsOpen,
    openConditions: () => setConditionsOpen(true),
    closeConditions: () => setConditionsOpen(false),
    quote,
    submit,
  };
}
