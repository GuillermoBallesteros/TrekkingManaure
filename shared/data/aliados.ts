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
export const aliados = [
  { id: 'manauridad', name: 'Manauridad', src: manauridad, delay: 1 },
  { id: 'corptur', name: 'Corptur', src: corptur, delay: 1 },
  { id: 'cuatri-tours', name: 'Cuatri Tours', src: cuatriTours, delay: 2 },
  { id: 'manaure-vive', name: 'Manaure Vive', src: manaureVive, delay: 2 },
  { id: 'la-casa-de-las-arepas', name: 'La Casa de las Arepas', src: laCasaDeLasArepas, delay: 3 },
  { id: 'manaure-aventura', name: 'Manaure Aventura', src: manaureAventura, delay: 3 },
  { id: 'photours', name: 'Photours', src: photours, delay: 4 },
  {
    id: 'casa-hostal-mi-ranchito',
    name: 'Casa Hostal Mi Ranchito',
    src: casaHostalMiRanchito,
    delay: 4,
  },
  { id: 'villa-adelaida', name: 'Villa Adelaida', src: villaAdelaida, delay: 4 },
  { id: 'hostal-villa-laura', name: 'Hostal Villa Laura', src: villaLaura, delay: 4 },
  {
    id: 'metallura-nature-tourism',
    name: 'Metallura Nature Tourism',
    src: metalluraNatureTourism,
    delay: 4,
  },
];
