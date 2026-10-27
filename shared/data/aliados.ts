import { aliadoId } from './imagenes';

// Los logos "-circulo" están recortados al círculo mínimo que contiene el diseño
// y así rellenan la tarjeta redonda. Viven en Cloudinary, en trekking-manaure/aliados.
// `instagram` es el usuario sin @; si falta, el logo no lleva enlace.
export const aliados: {
  id: string;
  name: string;
  publicId: string;
  delay: number;
  instagram?: string;
}[] = [
  {
    id: 'manauridad',
    name: 'Manauridad',
    publicId: aliadoId('manauridad-circulo'),
    delay: 1,
    instagram: 'alcaldiamanaurecesar',
  },
  {
    id: 'corptur',
    name: 'Corptur',
    publicId: aliadoId('corptur-circulo'),
    delay: 1,
    instagram: 'corpturmanaure',
  },
  {
    id: 'cuatri-tours',
    name: 'Cuatri Tours',
    publicId: aliadoId('cuatri-tours-circulo'),
    delay: 2,
    instagram: 'cuatritours_manaure',
  },
  {
    id: 'manaure-vive',
    name: 'Manaure Vive',
    publicId: aliadoId('manaure-vive-circulo'),
    delay: 2,
    instagram: 'manaurevive',
  },
  {
    id: 'la-casa-de-las-arepas',
    name: 'La Casa de las Arepas',
    publicId: aliadoId('la-casa-de-las-arepas-circulo'),
    delay: 3,
    instagram: 'casadelasarepas.manaure',
  },
  {
    id: 'manaure-aventura',
    name: 'Manaure Aventura',
    publicId: aliadoId('manaure-aventura-circulo'),
    delay: 3,
    instagram: 'manaureaventura',
  },
  {
    id: 'photours',
    name: 'Photours',
    publicId: aliadoId('photours-circulo'),
    delay: 4,
    instagram: 'photour_',
  },
  {
    id: 'casa-hostal-mi-ranchito',
    name: 'Casa Hostal Mi Ranchito',
    publicId: aliadoId('casa-hostal-mi-ranchito'),
    delay: 4,
    instagram: 'mi_ranchito_manaurero',
  },
  {
    id: 'villa-adelaida',
    name: 'Villa Adelaida',
    publicId: aliadoId('villa-adelaida-circulo'),
    delay: 4,
    instagram: 'restaurantevilladelaida',
  },
  {
    id: 'hostal-villa-laura',
    name: 'Hostal Villa Laura',
    publicId: aliadoId('villa-laura-circulo'),
    delay: 4,
    instagram: 'hostalvillalaura.manaure',
  },
  {
    id: 'metallura-nature-tourism',
    name: 'Metallura Nature Tourism',
    publicId: aliadoId('metallura-nature-tourism-circulo'),
    delay: 4,
    instagram: 'metalluraturismo',
  },
];
