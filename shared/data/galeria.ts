import flyerOficial from '../assets/images/flyer/flyer-oficial.webp';

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

export const galleryImages: GalleryImage[] = [
  {
    id: 'afiche',
    src: flyerOficial,
    title: 'Desafío Perijá 13K',
    description: 'Afiche del evento · Manaure, Cesar',
    poster: true,
  },
  ...Object.entries(photos)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src]) => ({
      id: path,
      src,
      title: (path.split('/').pop() || 'El Perijá').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      description: 'Galería general del evento',
    })),
];
