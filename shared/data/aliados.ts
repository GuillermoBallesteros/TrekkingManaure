import casaHostalMiRanchito from '../assets/images/aliados/casa-hostal-mi-ranchito.webp';
import corptur from '../assets/images/aliados/corptur-circulo.webp';
import cuatriTours from '../assets/images/aliados/cuatri-tours-circulo.webp';
import laCasaDeLasArepas from '../assets/images/aliados/la-casa-de-las-arepas-circulo.webp';
import manaureAventura from '../assets/images/aliados/manaure-aventura-circulo.webp';
import manaureVive from '../assets/images/aliados/manaure-vive-circulo.webp';
import manauridad from '../assets/images/aliados/manauridad-circulo.webp';
import metalluraNatureTourism from '../assets/images/aliados/metallura-nature-tourism-circulo.webp';
import photours from '../assets/images/aliados/photours-circulo.webp';
import villaAdelaida from '../assets/images/aliados/villa-adelaida-circulo.webp';
import villaLaura from '../assets/images/aliados/villa-laura-circulo.webp';

// Los logos "-circulo" están recortados al círculo mínimo que contiene el diseño
// (los originales siguen en la carpeta); así rellenan la tarjeta redonda.
// `instagram` es el usuario sin @; si falta, el logo no lleva enlace.
export const aliados: {
  id: string;
  name: string;
  src: string;
  delay: number;
  instagram?: string;
}[] = [
  {
    id: 'manauridad',
    name: 'Manauridad',
    src: manauridad,
    delay: 1,
    instagram: 'alcaldiamanaurecesar',
  },
  { id: 'corptur', name: 'Corptur', src: corptur, delay: 1, instagram: 'corpturmanaure' },
  {
    id: 'cuatri-tours',
    name: 'Cuatri Tours',
    src: cuatriTours,
    delay: 2,
    instagram: 'cuatritours_manaure',
  },
  {
    id: 'manaure-vive',
    name: 'Manaure Vive',
    src: manaureVive,
    delay: 2,
    instagram: 'manaurevive',
  },
  {
    id: 'la-casa-de-las-arepas',
    name: 'La Casa de las Arepas',
    src: laCasaDeLasArepas,
    delay: 3,
    instagram: 'casadelasarepas.manaure',
  },
  {
    id: 'manaure-aventura',
    name: 'Manaure Aventura',
    src: manaureAventura,
    delay: 3,
    instagram: 'manaureaventura',
  },
  { id: 'photours', name: 'Photours', src: photours, delay: 4, instagram: 'photour_' },
  {
    id: 'casa-hostal-mi-ranchito',
    name: 'Casa Hostal Mi Ranchito',
    src: casaHostalMiRanchito,
    delay: 4,
    instagram: 'mi_ranchito_manaurero',
  },
  {
    id: 'villa-adelaida',
    name: 'Villa Adelaida',
    src: villaAdelaida,
    delay: 4,
    instagram: 'restaurantevilladelaida',
  },
  {
    id: 'hostal-villa-laura',
    name: 'Hostal Villa Laura',
    src: villaLaura,
    delay: 4,
    instagram: 'hostalvillalaura.manaure',
  },
  {
    id: 'metallura-nature-tourism',
    name: 'Metallura Nature Tourism',
    src: metalluraNatureTourism,
    delay: 4,
    instagram: 'metalluraturismo',
  },
];
