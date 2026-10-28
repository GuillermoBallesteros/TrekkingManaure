import type {
  Companion,
  DocumentType,
  Extra,
  Gender,
  Health,
  NewRegistration,
  PaymentPlan,
  Person,
  ShirtSize,
  Stay,
} from '../../../../shared/reservas';
import { fieldName } from './formulario';

type Seleccion = {
  stay: Stay;
  plan: PaymentPlan;
  planDate: string;
  companion: boolean;
  companionKit: boolean | null;
  extras: Extra[];
};

// Los valores de los desplegables salen de los catálogos compartidos; si llega algo distinto,
// la validación de shared/reservas lo rechaza antes de guardar.
function reader(data: FormData, prefix: string) {
  return (base: string) => String(data.get(fieldName(prefix, base)) || '').trim();
}

/** Respuestas Sí/No de la ficha de salud: el detalle se guarda solo si respondió Sí. */
function readHealth(read: (base: string) => string): Health {
  const detail = (base: string) => (read(base) === 'Sí' ? read(base + 'Cual') || 'Sí' : null);
  return {
    illness: detail('enfermedad'),
    allergies: detail('alergia'),
    exercises: read('deporte') === 'Sí',
  };
}

function readPerson(data: FormData, prefix: string, stay: Stay): Person {
  const read = reader(data, prefix);
  return {
    firstName: read('nombres'),
    lastName: read('apellidos'),
    documentType: read('tipoDocumento') as DocumentType,
    document: read('documento'),
    birthDate: read('nacimiento'),
    gender: read('genero') as Gender,
    city: read('ciudad'),
    health: readHealth(read),
    stay,
  };
}

/** Convierte el formulario en la reserva que recibe reservasApi.crearReserva. */
export function buildNewRegistration(data: FormData, seleccion: Seleccion): NewRegistration {
  const read = reader(data, '');
  const companionRead = reader(data, 'acomp');
  const companion: Companion | null = seleccion.companion
    ? {
        ...readPerson(data, 'acomp', companionRead('estadia') as Stay),
        kit: seleccion.companionKit === true,
        shirtSize: seleccion.companionKit ? (companionRead('talla') as ShirtSize) : null,
      }
    : null;

  return {
    ...readPerson(data, '', seleccion.stay),
    phone: read('telefono'),
    email: read('correo').toLowerCase(),
    shirtSize: read('talla') as ShirtSize,
    companion,
    extras: seleccion.extras,
    plan: seleccion.plan,
    commitmentDate: seleccion.plan === 'apartado' ? seleccion.planDate : null,
  };
}
