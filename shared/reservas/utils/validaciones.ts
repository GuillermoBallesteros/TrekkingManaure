import { evento } from '../../config';
import {
  estadias,
  extras,
  generos,
  patrones,
  planesPago,
  tallas,
  tiposDocumento,
} from '../data/catalogos';
import type { Companion, NewRegistration, Person, Registration } from '../tipos';
import { getAvailability, capacityRange } from './cupos';
import { countPeople, getBalance, getStatus, holdsSpot } from './estado';

// Reglas de negocio de la reserva. El formulario ayuda con validaciones HTML; estas son las que
// deciden y el backend debe repetirlas. Cada función devuelve el primer error o null.

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function matches(pattern: string, value: string) {
  return new RegExp('^(?:' + pattern + ')$').test(value);
}

function includes<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

function normalizeDocument(value: string) {
  return value.replace(/\s+/g, '').toUpperCase();
}

/** Primer día elegible para pagar el restante: hoy, o la apertura si todavía no llega. */
export function firstPaymentDay(today: string) {
  return today > evento.fechaAperturaInscripciones ? today : evento.fechaAperturaInscripciones;
}

function validatePerson(person: Person, who: string, today: string): string | null {
  if (!matches(patrones.nombre, person.firstName) || !matches(patrones.nombre, person.lastName)) {
    return 'Escribe nombres y apellidos ' + who + '.';
  }
  if (!includes(tiposDocumento, person.documentType)) {
    return 'Elige un tipo de documento válido ' + who + '.';
  }
  if (!matches(patrones.documento, person.document)) {
    return 'El documento ' + who + ' debe tener entre 5 y 20 letras o números.';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(person.birthDate) || person.birthDate > today) {
    return 'Revisa la fecha de nacimiento ' + who + '.';
  }
  if (!includes(generos, person.gender)) return 'Elige el género ' + who + '.';
  if (!person.city.trim()) return 'Escribe la ciudad ' + who + '.';
  if (!includes(estadias, person.stay)) return 'Elige la estadía ' + who + '.';
  return null;
}

function validateCompanion(companion: Companion, today: string) {
  const error = validatePerson(companion, 'del acompañante', today);
  if (error) return error;
  if (companion.kit && !(companion.shirtSize && includes(tallas, companion.shirtSize))) {
    return 'Elige la talla de camisa del acompañante.';
  }
  return null;
}

/** Documentos de las inscripciones activas (no rechazadas), titulares y acompañantes. */
function activeDocuments(registrations: Registration[], today: string) {
  return new Set(
    registrations
      .filter((registration) => getStatus(registration, today) !== 'Rechazado')
      .flatMap((registration) => [registration.document, registration.companion?.document])
      .filter((document): document is string => Boolean(document))
      .map(normalizeDocument),
  );
}

export function validateNewRegistration(
  input: NewRegistration,
  registrations: Registration[],
  capacity: number,
  today: string,
): string | null {
  const personError = validatePerson(input, 'del participante', today);
  if (personError) return personError;
  if (!matches(patrones.telefono, input.phone)) return 'Revisa el número de teléfono.';
  if (!CORREO.test(input.email)) return 'Revisa el correo electrónico.';
  if (!includes(tallas, input.shirtSize)) return 'Elige tu talla de camisa.';
  if (!input.extras.every((extra) => includes(extras, extra))) {
    return 'Hay una actividad extra que no existe.';
  }
  if (new Set(input.extras).size !== input.extras.length) {
    return 'Cada actividad extra se elige una sola vez.';
  }

  if (input.companion) {
    const companionError = validateCompanion(input.companion, today);
    if (companionError) return companionError;
    if (normalizeDocument(input.companion.document) === normalizeDocument(input.document)) {
      return 'El acompañante no puede tener el mismo documento que el participante.';
    }
  }

  if (!includes(planesPago, input.plan)) return 'Elige la forma de pago.';
  if (input.plan === 'apartado') {
    const first = firstPaymentDay(today);
    if (first > evento.fechaLimitePago) {
      return 'Ya pasó la fecha límite para apartar; elige pagar el total.';
    }
    if (
      !input.commitmentDate ||
      input.commitmentDate < first ||
      input.commitmentDate > evento.fechaLimitePago
    ) {
      return 'Elige la fecha en que pagarás el restante.';
    }
  } else if (input.commitmentDate !== null) {
    return 'El pago total no lleva fecha para el restante.';
  }

  const taken = activeDocuments(registrations, today);
  const repeated = [input.document, input.companion?.document].find(
    (document) => document && taken.has(normalizeDocument(document)),
  );
  if (repeated) return 'El documento ' + repeated + ' ya tiene una reserva registrada.';

  const { available } = getAvailability(registrations, capacity);
  const people = countPeople(input);
  if (available < people) {
    return available === 0
      ? 'Los cupos están agotados.'
      : 'Solo queda ' + available + ' cupo y tu reserva necesita ' + people + '.';
  }

  return null;
}

/**
 * Aprobar el primer pago de una inscripción le asigna sus cupos: solo se permite si caben.
 * Rechazar o devolver a revisión siempre se permite.
 */
export function validateApproval(
  registration: Registration,
  registrations: Registration[],
  capacity: number,
): string | null {
  if (holdsSpot(registration)) return null;
  const others = registrations.filter((item) => item.id !== registration.id);
  const { available } = getAvailability(others, capacity);
  const people = countPeople(registration);
  return available < people
    ? 'No hay cupos para confirmar esta inscripción (' +
        people +
        ' personas, ' +
        available +
        ' libres). Amplía la capacidad en Gestión de cupos.'
    : null;
}

export function validateRejection(reason: string | null) {
  return reason && reason.trim() ? null : 'Indica el motivo del rechazo.';
}

/** Pago que registra la organización: entero, positivo y sin superar el saldo. */
export function validateManualPayment(registration: Registration, amount: number) {
  const balance = getBalance(registration);
  if (!Number.isInteger(amount) || amount <= 0) return 'Escribe un monto válido.';
  if (amount > balance) return 'El monto supera el saldo pendiente.';
  return null;
}

export function validateCapacity(value: number, registrations: Registration[]) {
  const { occupied } = getAvailability(registrations, value);
  const { min, max } = capacityRange(occupied);
  if (!Number.isInteger(value)) return 'La capacidad debe ser un número entero.';
  if (value < min) {
    return occupied > 0
      ? 'La capacidad no puede ser menor que los ' + occupied + ' cupos ocupados.'
      : 'La capacidad debe ser de al menos 1 cupo.';
  }
  if (value > max) return 'La capacidad máxima del evento es de ' + max + ' cupos.';
  return null;
}
