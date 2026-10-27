export type GalleryImage = {
  id: string;
  src: string;
  title: string;
  description: string;
  poster?: boolean;
};

// Añade fotos autorizadas a assets/images/galeria; Vite las incluye automáticamente.
const photos = import.meta.glob<string>('../assets/images/galeria/*.{webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const captions: Record<string, [string, string]> = {
  '01-paramo-de-frailejones': ['Páramo de frailejones', 'El páramo de la Serranía del Perijá'],
  '02-panoramica-serrania-del-perija': ['Serranía del Perijá', 'Panorámica de la serranía'],
  '03-fogata-en-circulo-de-piedra': ['Fogata en la montaña', 'Círculo de piedra para la fogata'],
  '04-laguna-del-perija': ['Laguna del Perijá', 'Agua y montaña en el Perijá'],
  '05-cordillera-de-manaure': ['Cordillera de Manaure', 'Las montañas que rodean Manaure'],
  '06-sol-en-la-montana': ['El sol en la montaña', 'Luz de montaña en Manaure'],
  '07-jardin-de-villa-adelaida': ['Villa Adelaida', 'Jardines de Villa Adelaida'],
  '08-punto-de-encuentro-villa-adelaida': [
    'Punto de encuentro',
    'Entrada de Villa Adelaida · punto de encuentro de la carrera',
  ],
};

export const galleryImages: GalleryImage[] = [
  ...Object.entries(photos)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src]) => {
      const name = (path.split('/').pop() || 'El Perijá').replace(/\.[^.]+$/, '');
      const caption = captions[name];
      return {
        id: path,
        src,
        title: caption?.[0] ?? name.replace(/^\d+[-_]?/, '').replace(/[-_]/g, ' '),
        description: caption?.[1] ?? 'Galería general del evento',
      };
    }),
];
