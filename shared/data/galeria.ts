import { galeriaId } from './imagenes';

export type GalleryImage = {
  id: string;
  publicId: string;
  title: string;
  description: string;
  poster?: boolean;
};

// Para añadir una foto: súbela a trekking-manaure/galeria en Cloudinary y agrega su nombre aquí.
// El orden de esta lista es el orden en la galería.
const photos: [nombre: string, title: string, description: string][] = [
  ['01-paramo-de-frailejones', 'Páramo de frailejones', 'El páramo de la Serranía del Perijá'],
  ['02-panoramica-serrania-del-perija', 'Serranía del Perijá', 'Panorámica de la serranía'],
  ['03-fogata-en-circulo-de-piedra', 'Fogata en la montaña', 'Círculo de piedra para la fogata'],
  ['04-laguna-del-perija', 'Laguna del Perijá', 'Agua y montaña en el Perijá'],
  ['05-cordillera-de-manaure', 'Cordillera de Manaure', 'Las montañas que rodean Manaure'],
  ['06-sol-en-la-montana', 'El sol en la montaña', 'Luz de montaña en Manaure'],
  ['07-jardin-de-villa-adelaida', 'Villa Adelaida', 'Jardines de Villa Adelaida'],
  [
    '08-punto-de-encuentro-villa-adelaida',
    'Punto de encuentro',
    'Entrada de Villa Adelaida · punto de encuentro de la carrera',
  ],
];

export const galleryImages: GalleryImage[] = photos.map(([nombre, title, description]) => ({
  id: nombre,
  publicId: galeriaId(nombre),
  title,
  description,
}));
