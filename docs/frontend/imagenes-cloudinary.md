# Imágenes en Cloudinary

Todas las imágenes del sitio (portada, galería, aliados, experiencias y logo) viven en Cloudinary, no en el repo. En el repo solo quedan los favicons de `frontend/public/`, porque el navegador los pide al propio dominio antes de cargar la página.

## Dónde están

Nube: `meoo7p5s` (variable `VITE_CLOUDINARY_CLOUD_NAME` en `frontend/.env` y `admin/.env`; si falta, se usa ese mismo valor).

```text
trekking-manaure/
  portada/        portada-fondo                     foto de fondo del inicio
  galeria/        01-paramo-de-frailejones … 08-…   fotos de la galería
  aliados/        <nombre>-circulo                  logos recortados al círculo
  experiencias/   acompanante-mochilas, …           fotos de las tarjetas de Extras
  marca/          logo-trekking-perija              logo de la marca (frontend y admin)
```

Cada imagen tiene el `public_id` igual a su ruta (por ejemplo `trekking-manaure/galeria/04-laguna-del-perija`) y las etiquetas `trekking-manaure` y la de su grupo. Los originales se guardan sin modificar; las versiones optimizadas se generan solas al pedirlas.

## Cómo se entregan (móvil y PC)

El código nunca escribe URLs a mano:

| Archivo                            | Qué hace                                              |
| ---------------------------------- | ----------------------------------------------------- |
| `shared/utils/cloudinary.ts`       | Arma las URLs y el `srcset`                           |
| `shared/data/imagenes.ts`          | Catálogo de `public_id` y tamaños por uso (`presets`) |
| `shared/components/CloudImage.tsx` | `<img>` con `srcSet` y `sizes` listos                 |

Cada URL lleva:

- **`f_auto`**: Cloudinary elige el formato más liviano que el navegador soporte. En el plan Free entrega WebP o JPG (no AVIF); en fotos con mucho detalle suele ganar JPG.
- **`q_auto`**: la compresión se ajusta a cada foto sin pérdida visible. El logo de la marca usa `q_auto:best`.
- **Ancho según pantalla**: cada uso tiene varios anchos (`srcset`), y el navegador elige según el tamaño de la pantalla y su densidad de píxeles. Un celular descarga una versión pequeña y un monitor grande una más nítida.
- **`c_limit`**: nunca se amplía una foto por encima de su tamaño original.

Ejemplo:

```text
https://res.cloudinary.com/meoo7p5s/image/upload/c_limit,w_640/f_auto/q_auto/trekking-manaure/galeria/04-laguna-del-perija
```

Para cambiar los tamaños de un uso, edita su preset en `shared/data/imagenes.ts`.

## Agregar o cambiar una imagen

1. Entra a Cloudinary → **Media Library** → carpeta `trekking-manaure/<grupo>`.
2. Sube la imagen. En **Public ID** usa la ruta completa sin extensión, por ejemplo `trekking-manaure/galeria/09-amanecer-en-el-paramo`. Usa minúsculas y guiones, sin tildes ni espacios.
3. Conéctala en el código:
   - **Galería:** añade `['09-amanecer-en-el-paramo', 'Título', 'Descripción']` a la lista de `shared/data/galeria.ts`. El orden de la lista es el de la galería.
   - **Aliado:** añade su entrada en `shared/data/aliados.ts` con `publicId: aliadoId('nombre-circulo')`.
   - **Portada, experiencias o logo:** sube la nueva versión con el **mismo `public_id`** y marca _Overwrite_. No hace falta tocar código. La CDN puede tardar un rato en mostrar el cambio.
4. Sube originales de buena calidad (hasta 10 MB). No hace falta comprimirlos antes: Cloudinary lo hace.

## Plan gratuito

La cuenta es Free: 25 créditos al mes. Un crédito equivale a 1 GB de almacenamiento, 1 GB de transferencia o 1000 transformaciones. Las imágenes ocupan menos de 4 MB y cada versión se genera una sola vez, así que casi todo el consumo es transferencia. El uso se ve en Cloudinary → **Settings → Usage**.

Nunca pongas la API key ni el API secret en el repo ni en variables `VITE_*`: el sitio solo necesita el nombre de la nube.
