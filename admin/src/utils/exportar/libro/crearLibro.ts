import { tarifas } from '../../../data/comun/tarifas';
import { dxfLibro, estilosLibro, hojas } from '../../../data/exportar/libro';
import { buildXlsx } from '../xlsx/paquete';
import { crearBuscar } from './buscar';
import type { LibroContexto } from './comun';
import { crearCorredores } from './corredores';
import { crearInscripciones } from './inscripciones';
import { crearPagos } from './pagos';
import { crearResumen } from './resumen';
import { crearTarifas } from './tarifas';

// Libro de gestión: datos, fórmulas, tablas, filtros, formatos y gráficos de Excel.
export function crearLibroGestion(contexto: LibroContexto) {
  const tarifasHoja = crearTarifas(contexto);
  const inscripciones = crearInscripciones(contexto);
  const precios = [
    tarifas.titular,
    tarifas.acompananteConKit,
    tarifas.acompananteSinKit,
    tarifas.cuatrimoto,
    tarifas.parapente,
  ];

  return buildXlsx({
    title: 'Trekking Desafío Perijá 13K · Gestión',
    styles: estilosLibro,
    dxfs: dxfLibro,
    sheets: [
      crearResumen(contexto, precios).sheet,
      crearBuscar(contexto).sheet,
      inscripciones.sheet,
      crearPagos(contexto).sheet,
      crearCorredores(contexto).sheet,
      tarifasHoja.sheet,
    ],
    names: [
      ...tarifasHoja.names,
      {
        name: 'ListaCodigos',
        ref:
          "'" +
          hojas.inscripciones +
          "'!" +
          inscripciones.codes.replace(/([A-Z]+)(\d+)/g, '$$$1$$$2'),
      },
    ],
  });
}
