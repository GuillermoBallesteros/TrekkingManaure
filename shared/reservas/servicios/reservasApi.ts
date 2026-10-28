import { todayInColombia } from '../../utils/format';
import type {
  NewRegistration,
  Payment,
  PaymentReview,
  Registration,
  ReservasState,
  Result,
} from '../tipos';
import { getTotal, getUpfront, upfrontConcept } from '../utils/cotizacion';
import { conceptFor, getPaid, withReview } from '../utils/estado';
import {
  validateApproval,
  validateCapacity,
  validateManualPayment,
  validateNewRegistration,
  validateRejection,
} from '../utils/validaciones';
import { initialState, repositorio } from './repositorio';

/**
 * Único punto de contacto entre la interfaz y los datos de reservas. Hoy trabaja sobre el
 * repositorio local; al conectar el backend, cada función pasa a llamar su endpoint (ver
 * docs/INTEGRACION-BACKEND.md) y la interfaz no cambia: siempre devuelve un Result.
 */

// Simula la espera de una petición para que la interfaz muestre sus estados de envío.
const LATENCIA_MS = 250;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, LATENCIA_MS));
}

function fail<T>(error: string): Result<T> {
  return { ok: false, error };
}

function pad(prefix: string, value: number) {
  return prefix + '-' + String(value).padStart(4, '0');
}

function findRegistration(state: ReservasState, registrationId: string) {
  return state.registrations.find((registration) => registration.id === registrationId);
}

function replaceRegistration(state: ReservasState, next: Registration): ReservasState {
  return {
    ...state,
    registrations: state.registrations.map((registration) =>
      registration.id === next.id ? next : registration,
    ),
  };
}

export const reservasApi = {
  /** El sitio público registra la reserva con su primer pago esperado, pendiente de revisión. */
  async crearReserva(input: NewRegistration): Promise<Result<Registration>> {
    await wait();
    const state = repositorio.read();
    const today = todayInColombia();
    const error = validateNewRegistration(input, state.registrations, state.capacity, today);
    if (error) return fail(error);

    const registrationNumber = state.counters.registration + 1;
    const paymentNumber = state.counters.payment + 1;
    // La aceptación de los términos queda con la hora en que el sistema registra la reserva.
    const acceptedAt = new Date().toISOString();
    const registration: Registration = {
      ...input,
      consent: { ...input.consent, acceptedAt },
      companion: input.companion
        ? { ...input.companion, consent: { ...input.companion.consent, acceptedAt } }
        : null,
      guardianAuthorized: false,
      id: pad('PER', registrationNumber),
      createdAt: today,
      payments: [
        {
          id: pad('PAG', paymentNumber),
          concept: upfrontConcept(input.plan),
          amount: getUpfront(input.plan, getTotal(input)),
          date: today,
          review: 'Por revisar',
          rejectionReason: null,
        },
      ],
    };

    repositorio.write({
      ...state,
      registrations: [...state.registrations, registration],
      counters: { registration: registrationNumber, payment: paymentNumber },
    });
    return { ok: true, data: registration };
  },

  /** La organización aprueba, rechaza o devuelve a revisión un pago tras verificar Bre-B. */
  async revisarPago(
    registrationId: string,
    paymentId: string,
    review: PaymentReview,
    reason: string | null = null,
  ): Promise<Result<Registration>> {
    await wait();
    const state = repositorio.read();
    const registration = findRegistration(state, registrationId);
    const payment = registration?.payments.find((item) => item.id === paymentId);
    if (!registration || !payment) return fail('El pago ya no existe.');

    if (review === 'Aprobado') {
      const error = validateApproval(
        registration,
        state.registrations,
        state.capacity,
        todayInColombia(),
      );
      if (error) return fail(error);
    }
    if (review === 'Rechazado') {
      const error = validateRejection(reason);
      if (error) return fail(error);
    }

    const reviewed = withReview(registration, paymentId, review);
    const next: Registration = {
      ...reviewed,
      payments: reviewed.payments.map((item) =>
        item.id === paymentId
          ? { ...item, rejectionReason: review === 'Rechazado' ? (reason || '').trim() : null }
          : item,
      ),
    };
    repositorio.write(replaceRegistration(state, next));
    return { ok: true, data: next };
  },

  /** Pago que la organización ya verificó en la llave Bre-B: entra aprobado. */
  async registrarPago(registrationId: string, amount: number): Promise<Result<Payment>> {
    await wait();
    const state = repositorio.read();
    const registration = findRegistration(state, registrationId);
    if (!registration) return fail('La inscripción ya no existe.');

    const error =
      validateManualPayment(registration, amount) ||
      validateApproval(registration, state.registrations, state.capacity, todayInColombia());
    if (error) return fail(error);

    const paymentNumber = state.counters.payment + 1;
    const payment: Payment = {
      id: pad('PAG', paymentNumber),
      concept: conceptFor(getPaid(registration), amount, getTotal(registration)),
      amount,
      date: todayInColombia(),
      review: 'Aprobado',
      rejectionReason: null,
    };

    repositorio.write({
      ...replaceRegistration(state, {
        ...registration,
        payments: [...registration.payments, payment],
      }),
      counters: { ...state.counters, payment: paymentNumber },
    });
    return { ok: true, data: payment };
  },

  /** La organización marca si recibió la autorización firmada del responsable de un menor. */
  async fijarAutorizacionMenor(
    registrationId: string,
    received: boolean,
  ): Promise<Result<Registration>> {
    await wait();
    const state = repositorio.read();
    const registration = findRegistration(state, registrationId);
    if (!registration) return fail('La inscripción ya no existe.');

    const next: Registration = { ...registration, guardianAuthorized: received };
    repositorio.write(replaceRegistration(state, next));
    return { ok: true, data: next };
  },

  async fijarCapacidad(value: number): Promise<Result<number>> {
    await wait();
    const state = repositorio.read();
    const error = validateCapacity(value, state.registrations);
    if (error) return fail(error);

    repositorio.write({ ...state, capacity: value });
    return { ok: true, data: value };
  },

  /** Borra todas las reservas de este navegador. Solo para pruebas; no tiene botón en el panel. */
  async restablecer(): Promise<Result<null>> {
    await wait();
    repositorio.write(initialState());
    return { ok: true, data: null };
  },
};
