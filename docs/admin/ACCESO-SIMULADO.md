# Acceso simulado al panel

El panel vive en `/admin` de la misma dirección del sitio (por ejemplo `http://localhost:5173/admin`). El sitio público no lo enlaza.

## Cómo funciona hoy

- No hay cuentas: entra cualquier correo y contraseña que cumplan el formato.
- Sin sesión vigente, cualquier ruta del panel (`/admin`, `/admin#/pagos`…) muestra solo el acceso. Tras entrar, se abre la página pedida o la vista general.
- El nombre visible sale del correo (`maria.perez@…` → «Maria Perez»).

## Validaciones del formulario

| Campo      | Regla                                                                     |
| ---------- | ------------------------------------------------------------------------- |
| Correo     | Obligatorio, formato `nombre@dominio.ext`, máximo 254 caracteres          |
| Contraseña | Obligatoria, entre 8 y 128 caracteres, sin espacios al inicio ni al final |

Los errores se muestran por campo al enviar y se actualizan mientras se escribe. El foco va al primer campo con error. El botón queda deshabilitado mientras se valida.

## Sesión

- Dura 8 horas en la pestaña (`sessionStorage`). Con «Mantener la sesión iniciada» dura 7 días y se comparte entre pestañas (`localStorage`).
- Al vencer, el panel vuelve al acceso (se comprueba cada 30 s y al volver a la pestaña).
- «Cerrar sesión» la borra; en las demás pestañas con sesión recordada también se cierra.

Reglas en `admin/src/data/auth/sesion.ts` y `admin/src/utils/auth/validaciones.ts`; lógica en `admin/src/services/auth.ts`.

## Al conectar el backend

Solo cambia `autenticacion.iniciarSesion` en `admin/src/services/auth.ts`: debe llamar a `POST /auth/login`, que verifica credenciales, bloquea intentos repetidos y devuelve el token y su vencimiento. El resto del panel (guardia, vencimiento, cierre de sesión) se mantiene. La autorización real de cada petición la hace el servidor; ocultar el panel en el navegador no protege los datos.
