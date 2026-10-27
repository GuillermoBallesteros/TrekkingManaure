# Organización del trabajo visual · Santiago

Fecha: 25 de octubre de 2026. Área: presentación e integración visual del frontend (`docs/TRABAJO-EN-EQUIPO.md`).

Esta nota describe dónde quedó cada cosa, siguiendo la lógica de carpetas que ya existe. No se creó ninguna carpeta de código nueva ni se movió ni se borró nada que ya existiera.

## 1. Mapa de carpetas y su lógica

```text
Tekking Manaure/
├─ frontend/                     Sitio público (Vite + React + TypeScript)
│  ├─ package.json               + dependencia lenis (scroll suave)
│  ├─ public/                    favicon.svg, robots.txt
│  └─ src/
│     ├─ App.tsx                 llama a useSmoothScroll
│     ├─ pages/Home/             composición de la página
│     ├─ sections/<Sección>/     una carpeta por bloque: Inicio, Evento, Cupos, Kit, Costos,
│     │                          Extras, Alojamiento, Seguridad, Galeria, Reserva, Aliados
│     ├─ components/layout/      Navbar, Footer
│     ├─ components/ui/          Calendario, ContadorCupos, CuentaRegresiva, Marquee
│     ├─ hooks/                  useReveal, useReserva, useSmoothScroll (nuevo)
│     └─ styles/global.css       reglas comunes y adaptación a móvil
├─ admin/                        Panel de administración (otra área)
├─ backend/                      API y base de datos (otra área)
├─ shared/                       Recursos compartidos por frontend y admin
│  ├─ assets/fonts/              Bebas Neue y Poppins
│  ├─ assets/images/aliados/     logos de los aliados
│  ├─ assets/images/flyer/       afiches y foto de portada
│  ├─ assets/images/galeria/     fotos de la galería (se incluyen solas, en orden por nombre)
│  ├─ components/                Brand, Icon, Modal
│  ├─ config/ · data/ · utils/   datos del evento, catálogos (aliados.ts, galeria.ts) y utilidades
│  └─ styles/                    colores, fuentes, normalización, marca y diálogos
├─ docs/                         guías del equipo
│  └─ frontend/santiago/         esta nota (ruta asignada a Santiago en responsables.json)
└─ scripts/                      comprobador de áreas del equipo
```

## 2. Qué se añadió o cambió, por carpeta

### `shared/assets/images/` (archivos nuevos, ninguno existente se modificó)

| Carpeta    | Archivo                                                              | Para qué sirve                                                    |
| ---------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `aliados/` | `*-circulo.webp` (10 archivos)                                       | Logos recortados al círculo mínimo que contiene el diseño         |
| `flyer/`   | `portada-fondo.webp` (1776×1552)                                     | Foto de fondo de la portada, ampliada con Real-ESRGAN             |
| `flyer/`   | `flyer-vigente.webp` (1200×2594)                                     | Afiche vigente ampliado; ya no se muestra en el sitio             |
| `galeria/` | `01-paramo-de-frailejones.webp` … `07-jardin-de-villa-adelaida.webp` | Las 7 fotos de la galería, con título en `shared/data/galeria.ts` |

### `shared/` (archivos existentes con cambios mínimos)

| Archivo                         | Cambio                                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| `data/aliados.ts`               | Usa los logos `-circulo` y añade el Hostal Villa Laura (11 aliados)                     |
| `data/galeria.ts`               | Quita el afiche, añade títulos y descripciones de las 7 fotos (`captions`)              |
| `components/Brand.tsx`          | La marca muestra la foto de la serranía en vez del icono (prueba, fácil de revertir)    |
| `components/Icon.tsx`           | Icono de WhatsApp propio (globo con auricular)                                          |
| `components/Modal.tsx`          | Atributo `data-lenis-prevent` para que el scroll suave no mueva la página tras el visor |
| `styles/brand.css`, `reset.css` | Estilo de la foto de la marca; `html.lenis` sin desplazamiento propio del navegador     |

### `frontend/src/`

| Archivo                             | Cambio                                                                                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `hooks/useSmoothScroll.ts` (nuevo)  | Scroll suave con Lenis, igual que Color Fest; respeta «reducir movimiento»                                                                     |
| `hooks/index.ts`, `App.tsx`         | Exporta y activa el hook                                                                                                                       |
| `sections/Inicio/`                  | Fondo con foto, versión móvil como franja superior, sombra de texto                                                                            |
| `components/layout/Navbar/`         | Barra transparente arriba y de cristal al bajar, sin línea; se quitó la etiqueta «Vista previa»                                                |
| `components/layout/Footer/`         | Icono de WhatsApp blanco de 30 px; el contacto ya no nombra a una persona                                                                      |
| `sections/Aliados/`                 | Cinta horizontal de logos circulares que se mueve sola y se arrastra con el cursor o el dedo                                                   |
| `sections/Galeria/`                 | Tarjetas uniformes; visor con marco de tamaño fijo, fondo desenfocado con la propia foto, fundido sin parpadeo, miniaturas, teclado y deslizar |
| `styles/global.css`                 | Menú móvil pegado a la barra y con fondo sólido                                                                                                |
| `package.json`, `package-lock.json` | Dependencia `lenis` 1.3.27 (MIT)                                                                                                               |

## 3. Cómo añadir contenido

- **Foto a la galería:** guarda un `.webp`, `.jpg` o `.png` autorizado en `shared/assets/images/galeria/` con nombre `NN-descripcion.webp`. Para un título y una descripción propios, añade su nombre (sin extensión) al objeto `captions` de `shared/data/galeria.ts`.
- **Aliado nuevo:** guarda su logo en `shared/assets/images/aliados/` y añade una línea en `shared/data/aliados.ts`. Si el logo no es redondo, recórtalo al círculo mínimo que contiene su diseño y nómbralo `nombre-circulo.webp`, como los demás.
- **Foto de portada:** `shared/assets/images/flyer/portada-fondo.webp`. Se sustituye por una versión en alta resolución sin tocar código.

## 4. Archivos sin uso (se conservan hasta la depuración final)

- **Imágenes:** `flyer/flyer-oficial.webp`, `flyer/flyer-vigente.webp`.
- **Estilos:** `.logo-grid` y `.preview-tag` en `styles/global.css`; `.preview-tag` en `Navbar.css`; `.gallery-modal__image`, `.gallery-modal__footer` y `.gallery-item--poster` en `Galeria.css`.
- **Lógica:** el campo `poster` de `GalleryImage` y el texto de las tarjetas «La invitación» en `Galeria.tsx`.

## 5. Fuera del área o pendiente de decisión

- `frontend/src/sections/Costos/Costos.tsx` (área de Damian): se cambió el texto del paso 03 por orden expresa de Santiago.
- `.gitignore` (coordinación) y `admin/package-lock.json` (administración) estaban modificados antes de este trabajo y no se tocaron.
- **Nada está en commit.** Las imágenes nuevas figuran como archivos sin rastrear; hay que incluirlas al hacer el commit o no llegarán a quien despliegue.
- Las fotos de la galería vienen de las carpetas del proyecto Manaure Vive; falta confirmar con sus dueños que autorizan usarlas.
- La foto de portada es una reconstrucción de 450 px; lo ideal es el original en alta resolución.

## 6. Documentación que quedó desactualizada

`docs/ESTRUCTURA.md` es de coordinación y no se modificó. Dice que:

- «Los mismos once archivos de imagen existentes» están en `shared/assets/images/`.
- «El afiche aparece una sola vez en el sitio público, dentro de la galería».
- El diálogo de la galería recorre las imágenes «con botones y flechas del teclado».

Ahora hay 7 fotos nuevas, un afiche fuera de la galería y un visor con miniaturas y sin botones.

## 7. Verificación

- Compilación de `frontend` y `admin` correcta; Prettier correcto.
- Revisión a 360 px y 1280 px: sin desborde, 31 de 31 imágenes cargadas en la versión compilada, menú móvil y enlaces internos exactos, visor y cinta de logos.
- Comprobador de áreas: solo marca los tres archivos ajenos descritos arriba.

## 8. HTML de demostración

`Trekking-Perija-13K-vista-v4.html` en la carpeta Descargas: sitio compilado en un solo archivo, sin internet. Es una foto del estado de este día; hay que generarlo de nuevo si el sitio cambia. El formulario es una vista previa y el enlace «Administración» no abre nada.
