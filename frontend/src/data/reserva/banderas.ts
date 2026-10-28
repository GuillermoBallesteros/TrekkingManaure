// Banderas del selector de teléfono: servicio gratuito de Flagpedia (https://flagpedia.net/download/api)
// por su CDN flagcdn.com. Íconos de proporción fija 4:3 con versiones 2x y 3x para pantallas
// de alta densidad. La ruta es /<ancho>x<alto>/<código ISO en minúscula>.png
export const BANDERAS_CDN = 'https://flagcdn.com';

/** Tamaño en pantalla y tamaños para pantallas de alta densidad (deben existir en el CDN). */
export const BANDERA_TAMANO = { ancho: 24, alto: 18, x2: '48x36', x3: '72x54' } as const;
