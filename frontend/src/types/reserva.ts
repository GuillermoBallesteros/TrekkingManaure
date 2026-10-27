export type Estadia = '' | 'Páramo' | 'Hotel en Manaure';
export type Extra = 'cuatrimoto' | 'parapente';

/** Datos de una persona tal como aparecen en el resumen (textos ya normalizados). */
export type DatosPersona = {
  nombre: string;
  tipoDocumento: string;
  documento: string;
  edad: string;
  telefono: string;
  correo: string;
  ciudad: string;
  emergenciaNombre: string;
  emergenciaTelefono: string;
  eps: string;
  /** Solo el inscrito tiene talla. */
  talla?: string;
};
