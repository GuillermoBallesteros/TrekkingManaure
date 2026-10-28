# Integración con el backend

El sitio público y el panel ya comparten un solo sistema de reservas (`shared/reservas/`). Hoy los datos viven en el `localStorage` del navegador; para compartirlos entre equipos hay que conectar la API. Este documento dice qué reemplazar. No describe la implementación del servidor.

## Qué se reemplaza

| Hoy                                            | Con backend                                                                  |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `shared/reservas/servicios/reservasApi.ts`     | Cada método llama a su endpoint y devuelve el mismo `Result`                 |
| `shared/reservas/servicios/repositorio.ts`     | Caché de lo que devuelve `GET /reservas`, refrescada al cambiar o por sondeo |
| `admin/src/services/auth.ts` (`iniciarSesion`) | `POST /auth/login`; el token se envía en cada petición del panel             |

El resto del código (formulario, panel, contador de cupos) no cambia: lee con `useReservas()` / `useDisponibilidad()` y escribe con `reservasApi`.

## Endpoints propuestos

| Método de `reservasApi` / `autenticacion` | Endpoint                   | Quién   | Respuesta                      |
| ----------------------------------------- | -------------------------- | ------- | ------------------------------ |
| lectura del estado                        | `GET /reservas`            | panel   | `ReservasState` sin contadores |
| lectura pública de cupos                  | `GET /cupos`               | público | `Availability`                 |
| `crearReserva(input)`                     | `POST /reservas`           | público | `Registration`                 |
| `revisarPago(id, pagoId, review, motivo)` | `PATCH /pagos/:pagoId`     | panel   | `Registration`                 |
| `registrarPago(id, monto)`                | `POST /reservas/:id/pagos` | panel   | `Payment`                      |
| `fijarCapacidad(valor)`                   | `PUT /cupos`               | panel   | capacidad                      |
| `iniciarSesion(correo, clave)`            | `POST /auth/login`         | panel   | token y vencimiento            |

Los tipos están en `shared/reservas/tipos.ts` (`Registration`, `NewRegistration`, `Payment`, `ReservasState`, `Result`). Los valores admitidos están en `shared/reservas/data/catalogos.ts`. Fechas en `AAAA-MM-DD` (hora de Colombia), montos enteros en COP.

## Reglas que el servidor debe repetir

Están en `shared/reservas/utils/validaciones.ts` y `utils/estado.ts`; el navegador las aplica para avisar antes, pero solo el servidor decide:

1. Titular y acompañante entregan los mismos datos (nombre, documento según su tipo y edad, nacimiento, género, celular por país, correo, ciudad, EPS, contacto de emergencia, salud, compromisos y aceptación de términos); la talla solo la tiene quien compra kit.
   - Documento, correo y celular distintos entre titular y acompañante. El contacto de emergencia no puede ser ninguno de los dos.
   - Los compromisos de áreas protegidas y medio ambiente deben ser `true`.
   - Cada persona guarda su aceptación (`consent`): la versión debe ser `versionTerminos` y el servidor pone `acceptedAt` con la hora de registro. Sin aceptación no hay reserva.
   - Si el titular es menor de edad, su contacto es la madre, el padre o el tutor legal.
   - El parapente del acompañante exige acompañante. El hotel previo va entre `hotelWindow(hoy)` y se cobra por noche y persona.
2. Plan `apartado`: fecha del restante entre hoy (o la apertura) y `evento.fechaLimitePago`. Plan `total`: sin fecha.
3. Ningún documento (titular o acompañante) puede tener otra reserva activa (no rechazada); titular y acompañante con documentos distintos.
4. Hay cupo para todo el grupo al reservar.
5. Al crear la reserva se genera su primer pago en «Por revisar»: $50.000 si aparta, el total si paga completo. El total sale de `getCharges`.
6. Aprobar el primer pago de una inscripción le asigna sus cupos y solo se permite si caben. Si el titular es menor de edad, ningún pago se aprueba hasta que el panel marque `guardianAuthorized` (`fijarAutorizacionMenor`). Rechazar exige motivo.
7. Un pago registrado por el panel entra aprobado, es entero, positivo y no supera el saldo.
8. La capacidad solo cambia desde el panel, entre los cupos ocupados y `cupos.maximo`.
9. El estado de la inscripción no se guarda: se deriva de sus pagos (`getStatus`).

Las operaciones 4 y 6 deben hacerse en una transacción para no vender el mismo cupo dos veces.

## Datos personales en el sitio público

Hoy el formulario lee todas las reservas del navegador para avisar antes de enviar (documento repetido, cupos). Con backend, el sitio público solo debe recibir la disponibilidad (`GET /cupos`): la comprobación de documentos repetidos la hace `POST /reservas` y su error se muestra igual que ahora. Nunca se envían a la parte pública los datos de otras personas.

## Sin comprobantes

El pago no lleva archivo ni referencia: la organización verifica en la llave Bre-B que el dinero llegó y lo aprueba en el panel. Esa decisión es la fuente de verdad.
