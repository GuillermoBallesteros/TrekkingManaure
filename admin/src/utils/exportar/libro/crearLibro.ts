import { precios as tarifas } from '../../../../../shared/config';
import { dxfLibro, estilosLibro, hojas } from '../../../data/exportar/libro';
import { evento } from '../../../../../shared/config';
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
    tarifas.total,
    tarifas.acompananteConKit,
    tarifas.acompanante,
    tarifas.cuatrimoto,
    tarifas.parapente,
    tarifas.parapente,
    tarifas.hotelNoche,
  ];

  return buildXlsx({
    title: evento.nombre + ' · Gestión',
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
