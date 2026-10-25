# Organización del primer esqueleto visual

## Criterio de implementación

`diseno.html` es la referencia de composición, tipografías, colores y contenido. Sus selectores y valores CSS se distribuyeron entre las secciones y los componentes correspondientes, manteniendo su apariencia. Su script monolítico se sustituyó por estado y efectos de React.

La entrega sigue siendo visual. La información del HTML se conserva como base del evento; los avisos de vista previa identifican las acciones sin integración, no cuestionan todos los datos de la referencia.

## Recursos compartidos

| Ruta                     | Responsabilidad                                                            |
| ------------------------ | -------------------------------------------------------------------------- |
| `shared/config/index.ts` | Nombre, fechas, plazo, precios, cupos y contacto                           |
| `shared/assets/images/`  | Los mismos once archivos de imagen existentes, reubicados sin modificarlos |
| `shared/assets/fonts/`   | Bebas Neue y Poppins con sus licencias OFL                                 |
| `shared/data/galeria.ts` | Catálogo único para la galería pública y su vista administrativa           |
| `shared/styles/`         | Colores, fuentes, normalización, botones, marca y diálogos                 |
| `shared/components/`     | Marca, iconos del diseño y diálogo con cierre por Escape y foco contenido  |
| `shared/utils/`          | Formato de dinero, fechas de Colombia y cálculo de capacidad               |

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

El formulario está dividido en datos personales, opciones de reserva, comprobante, calendario y resumen. La estadía elegida desde sus tarjetas se refleja en el formulario. No hay una segunda página de reserva vacía ni una sección adicional de términos sin contenido: las condiciones de la vista previa se consultan en un diálogo.

## Administración

- **Acceso:** presentación del inicio de sesión; credenciales deshabilitadas y entrada explícita a la vista previa.
- **Vista general:** indicadores calculados desde la muestra, distribución de estados y pagos pendientes.
- **Participantes:** búsqueda por nombre o identificador, filtro por estado y detalle.
- **Pagos:** inscripción, saldo y fecha prevista; aprobación/rechazo exclusivamente simulados.
- **Cupos:** capacidad inicial, ampliación y ajuste de ejemplo.
- **Galería:** catálogo compartido y ampliación del material existente; carga real pendiente.
- **Exportar:** muestra CSV filtrable, identificada como demostración.

El estado temporal se concentra en `admin/src/context/AdminPreviewContext.tsx`. Los registros ficticios están en `admin/src/data/demo.ts` y sus tipos en `admin/src/types/participante.ts`.

Cada página administrativa importa su propio archivo CSS. `admin/src/App.css` contiene la estructura de navegación y cabecera; `admin/src/styles/global.css` conserva únicamente los estilos comunes del panel. La tabla y sus detalles tienen su hoja de estilos en `admin/src/components/ParticipantTable.css`.

## Galería

El afiche aparece una sola vez en el sitio público, dentro de la galería, en lugar de repetirse después de los aliados. Los espacios de futuras fotografías se distinguen del material ya disponible.

Para añadir fotos, guarda archivos WEBP, JPG, JPEG o PNG autorizados en `shared/assets/images/galeria/`. El catálogo los incluye automáticamente en orden por nombre. Usa nombres descriptivos, por ejemplo `01-sendero-de-montana.webp`, para obtener títulos legibles. El diálogo permite recorrer varias imágenes con botones y flechas del teclado.

## Coherencia de información

- Se conserva el total de **$350.000**, con inscripción de **$50.000** y saldo de **$300.000**, indicado en el HTML.
- El afiche existente muestra **$250.000** como categoría individual. Esta diferencia debe resolverse con la organización antes de activar pagos; no se alteró la imagen.
- Se unificó el plazo del calendario y la explicación al **12 de noviembre de 2026**, siguiendo el HTML, frente al antiguo archivo que indicaba el 9.
- El contador deja de afirmar que está conectado en vivo. Conserva la capacidad inicial de 60, ampliable a 70; la disponibilidad real depende de la futura API.
- Se corrigió el umbral de ampliación: se habilitan 70 cupos al llegar a 60 confirmados.
- No se usa el número ficticio de WhatsApp ni se promete un registro automático en Excel.
- Seleccionar un archivo no valida un pago. El comprobante solo se comprueba localmente por tipo y tamaño para explorar el formulario.

## Continuación

Conectar autenticación y autorización administrativa, API de participantes, almacenamiento privado de comprobantes, validación de pagos, disponibilidad real, carga de fotos y exportación .xlsx. Publicar condiciones de participación y tratamiento de datos antes de habilitar el formulario real. El backend existente se mantiene como punto de integración para esa etapa.

## Validación realizada

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
