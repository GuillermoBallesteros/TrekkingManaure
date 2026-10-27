import { useState } from 'react';
import { fieldName } from '../../../utils/reserva';

type Props = {
  prefijo: string;
  /** Base del campo: genera name=base ('Sí'/'No') y name=baseCual (detalle). */
  base: string;
  pregunta: string;
  /** Si se indica, al responder Sí se pide el detalle con esta etiqueta. */
  detalle?: string;
};

export default function PreguntaSiNo({ prefijo, base, pregunta, detalle }: Props) {
  const [answer, setAnswer] = useState('');
  const name = fieldName(prefijo, base);
  const detailName = fieldName(prefijo, base + 'Cual');

  return (
    <div className="field field--full">
      <span className="field__label" id={name + '-label'}>
        {pregunta} <span className="req">*</span>
      </span>
      <div className="choice-grid" role="radiogroup" aria-labelledby={name + '-label'}>
        {['Sí', 'No'].map((option) => (
          <label className="choice" key={option}>
            <input
              type="radio"
              name={name}
              value={option}
              required
              checked={answer === option}
              onChange={() => setAnswer(option)}
            />
            <span className="choice__dot" />
            <span className="choice__text">
              <strong>{option}</strong>
            </span>
          </label>
        ))}
      </div>
      {detalle && answer === 'Sí' && (
        <input
          id={detailName}
          name={detailName}
          required
          aria-label={detalle}
          placeholder={detalle}
          maxLength={200}
        />
      )}
    </div>
  );
}
