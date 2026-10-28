import { useState } from 'react';
import { RESPUESTAS_SI_NO } from '../../data/reserva/opciones';
import { opcionDesmarcable } from '../../utils/comun/opcionDesmarcable';
import { fieldName } from '../../utils/reserva/formulario';

/** Pregunta Sí/No: name=base guarda la respuesta y name=baseCual el detalle si responde Sí. */
export function usePreguntaSiNo(prefijo: string, base: string, detalle?: string) {
  const [answer, setAnswer] = useState('');
  const name = fieldName(prefijo, base);

  return {
    name,
    labelId: name + '-label',
    detailName: fieldName(prefijo, base + 'Cual'),
    options: RESPUESTAS_SI_NO.map((option) => ({
      value: option,
      input: opcionDesmarcable<string>(answer, option, setAnswer, ''),
    })),
    showDetail: Boolean(detalle) && answer === 'Sí',
  };
}
