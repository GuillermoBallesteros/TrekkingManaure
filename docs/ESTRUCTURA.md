# Organización del primer esqueleto visual

## Criterio de implementación

`diseno.html` es la referencia de composición, tipografías, colores y contenido. Sus selectores y valores CSS se distribuyeron entre las secciones y los componentes correspondientes, manteniendo su apariencia. Su script monolítico se sustituyó por estado y efectos de React.

La entrega sigue siendo visual. La información del HTML se conserva como base del evento; los avisos de vista previa identifican las acciones sin integración, no cuestionan todos los datos de la referencia.

## Recursos compartidos

| Ruta                      | Responsabilidad                                                           |
| ------------------------- | ------------------------------------------------------------------------- |
| `shared/config/index.ts`  | Nombre, fechas, plazo, precios, cupos y contacto                          |
| `shared/data/imagenes.ts` | Catálogo de imágenes en Cloudinary y tamaños por uso (móvil y PC)         |
| `shared/assets/fonts/`    | Bebas Neue y Poppins con sus licencias OFL                                |
| `shared/data/galeria.ts`  | Catálogo único para la galería pública y su vista administrativa          |
| `shared/styles/`          | Colores, fuentes, normalización, botones, marca y diálogos                |
| `shared/components/`      | Marca, iconos del diseño y diálogo con cierre por Escape y foco contenido |
| `shared/utils/`           | Formato de dinero, fechas de Colombia y cálculo de capacidad              |

`shared` significa recursos compartidos: evita que frontend y administración mantengan copias diferentes de colores, imágenes y datos del mismo evento.

Los imports compartidos usan las dependencias de React de cada aplicación. Vite las deduplica y TypeScript resuelve sus declaraciones desde la aplicación que se está compilando.

## Sitio público

| Bloque                                   | Ubicación                                   |
| ---------------------------------------- | ------------------------------------------- |
| Cabecera y menú móvil                    | `frontend/src/components/layout/Navbar/`    |
| Portada                                  | `frontend/src/sections/Inicio/`             |
| Cupos de portada y cuenta regresiva      | `frontend/src/components/ui/`               |
| Cinta del evento                         | `frontend/src/components/ui/Marquee/`       |
| Experiencia                              | `frontend/src/sections/Evento/`             |
| Política de cupos                        | `frontend/src/sections/Cupos/`              |
| Kit                                      | `frontend/src/sections/Kit/`                |
| Costos y adicionales                     | `frontend/src/sections/Costos/` y `Extras/` |
| Estadía                                  | `frontend/src/sections/Alojamiento/`        |
| Seguridad                                | `frontend/src/sections/Seguridad/`          |
| Galería                                  | `frontend/src/sections/Galeria/`            |
| Formulario                               | `frontend/src/sections/Reserva/`            |
| Estado de reserva y animación de entrada | `frontend/src/hooks/`                       |
| Aliados                                  | `frontend/src/sections/Aliados/`            |
| Pie de página                            | `frontend/src/components/layout/Footer/`    |
| Composición de la página                 | `frontend/src/pages/Home/Home.tsx`          |

El formulario está dividido en datos personales, salud, opciones de reserva, acompañante, forma de pago (con calendario si se aparta) y confirmación. La estadía elegida desde sus tarjetas se refleja en el formulario. Al enviar se abre el resumen; al confirmarlo la reserva se registra y se muestra su código, con el botón para enviar los datos por WhatsApp.

## Una sola aplicación

`frontend/src/main.tsx` es el único punto de entrada. Si la ruta es `/admin`, carga de forma diferida `admin/src/AdminApp.tsx`; en cualquier otra ruta, el sitio público. Cada uno trae su propio CSS. El sitio no enlaza al panel: se entra escribiendo `/admin`. Dentro del panel las páginas usan el hash (`/admin#/pagos`).

## Sistema de reservas compartido (`shared/reservas/`)

| Archivo                    | Responsabilidad                                                                   |
| -------------------------- | --------------------------------------------------------------------------------- |
| `tipos.ts`                 | Modelo único de la reserva, el pago y el estado guardado                          |
| `data/catalogos.ts`        | Documentos, géneros, tallas, estadías, extras, planes, vía de pago y patrones     |
| `utils/cotizacion.ts`      | Único cálculo de precios: cargos, total, pago inicial y saldo                     |
| `utils/estado.ts`          | Pagado, saldo, estado de la inscripción, corredores y alertas de salud            |
| `utils/cupos.ts`           | Disponibilidad y rango permitido de la capacidad                                  |
| `utils/validaciones.ts`    | Reglas de negocio que deciden (el formulario solo ayuda; el backend las repetirá) |
| `servicios/repositorio.ts` | Almacenamiento (hoy `localStorage`) y aviso de cambios entre pestañas             |
| `servicios/reservasApi.ts` | Única puerta para leer y cambiar datos; se sustituye al conectar la API           |
| `hooks/useReservas.ts`     | Reservas, capacidad y disponibilidad siempre al día en React                      |

Reglas principales:

- La reserva nace con su primer pago esperado («Separación de cupo» de $50.000 o «Pago total») en «Por revisar».
- La organización aprueba el pago cuando verifica que llegó a la llave Bre-B. No se suben comprobantes.
- Una inscripción ocupa cupo (titular y acompañante) desde que tiene un pago aprobado. Aprobar no se permite si no caben.
- No se puede reservar sin cupos para todo el grupo, con un documento que ya tenga una reserva activa ni con el mismo documento para titular y acompañante.
- La capacidad empieza en 60 y solo cambia desde el panel, entre los cupos ocupados y 70. No se amplía sola.

## Administración

- **Acceso:** inicio de sesión simulado con validación por campo, sesión con vencimiento y cierre de sesión. Ver `docs/admin/ACCESO-SIMULADO.md`.
- **Vista general:** indicadores calculados con las reservas reales, distribución de estados y pagos pendientes.
- **Participantes:** búsqueda por nombre, documento, teléfono, ciudad o acompañante; filtro por estado y detalle con registro de saldos.
- **Pagos:** cola de pagos esperados; aprobación, rechazo con motivo, devolución a revisión y deshacer.
- **Cupos:** capacidad editable, kits por talla, estadías y experiencias.
- **Exportar:** libro .xlsx con fórmulas, filtrable por estado.

`admin/src/context/AdminUiContext.tsx` solo guarda estado de interfaz (el pago que Pagos debe abrir). Los datos se leen con `useReservas()` y se cambian con `reservasApi`.

Cada página administrativa importa su propio archivo CSS. `admin/src/App.css` contiene la estructura de navegación y cabecera; `admin/src/styles/global.css` conserva únicamente los estilos comunes del panel. La tabla y sus detalles tienen su hoja de estilos en `admin/src/components/participantes/`.

## Galería

El afiche aparece una sola vez en el sitio público, dentro de la galería, en lugar de repetirse después de los aliados. Los espacios de futuras fotografías se distinguen del material ya disponible.

Para añadir fotos, súbelas a la carpeta `trekking-manaure/galeria` de Cloudinary y añade una línea a la lista de `shared/data/galeria.ts`; el orden de esa lista es el de la galería. Paso a paso en `docs/frontend/imagenes-cloudinary.md`. El diálogo permite recorrer varias imágenes con botones y flechas del teclado.

## Coherencia de información

- Se conserva el total de **$350.000**, con inscripción de **$50.000** y saldo de **$300.000**, indicado en el HTML.
- El afiche existente muestra **$250.000** como categoría individual. Esta diferencia debe resolverse con la organización antes de activar pagos; no se alteró la imagen.
- Se unificó el plazo del calendario y la explicación al **12 de noviembre de 2026**, siguiendo el HTML, frente al antiguo archivo que indicaba el 9.
- El contador muestra los cupos confirmados del sistema de reservas. La capacidad inicial es 60 y la organización puede ampliarla hasta 70 desde el panel.
- No se usa el número ficticio de WhatsApp ni se promete un registro automático en Excel.
- No se suben comprobantes: el pago se confirma en el panel tras verificarlo en la llave Bre-B.

## Continuación

Conectar la API siguiendo `docs/INTEGRACION-BACKEND.md`: autenticación real, reservas, pagos y capacidad compartidos entre equipos, y carga de fotos. Publicar condiciones de participación y tratamiento de datos antes de habilitar el formulario real. El backend existente se mantiene como punto de integración para esa etapa.

## Validación realizada

Corresponde al primer esqueleto visual. La unificación del sistema de reservas se comprobó con un recorrido completo: reserva pública, aparición inmediata en el panel, aprobación con límite de capacidad, registro de saldo, documentos repetidos, sesión vencida y cierre de sesión.

- Build de producción y comprobación TypeScript de ambas aplicaciones.
- Comprobación adicional de variables y parámetros sin uso.
- Prettier aplicado y comprobación de formato correcta.
- Comparación visual de la portada con el HTML adjunto a 1440 px.
- Revisión pública a 320, 390 y 768 px; ajuste del desbordamiento decorativo de la cinta.
- Panel y tabla de participantes revisados a 320 y 390 px, además de escritorio.
- Menús móviles, selección de estadía y extras, actualización del total y ampliación del afiche.
- Comprobante sintético PDF: desbloqueo de calendario y resumen local completo.
- Archivo de tipo inválido: mensaje de error, borrado de la fecha y calendario bloqueado.
- Búsqueda administrativa, aprobación simulada e indicadores recalculados correctamente.
- Ajuste de cupos de demostración, galería administrativa y descarga real de la muestra CSV.
- Integridad de los once archivos de imagen verificada contra Git: contenido idéntico.

Las comprobaciones cubren el esqueleto visual y sus interacciones locales. No se han conectado ni validado autenticación, servicios externos, pagos o almacenamiento de datos reales.
