import { precios } from '../../../../../shared/config';
import { formatMoney } from '../../../../../shared/utils/format';
import type { PlanTitular } from '../../../types/reserva';

type Props = {
  plan: PlanTitular | null;
  onPlan: (value: PlanTitular | null) => void;
};

export default function ModalidadInscripcion({ plan, onPlan }: Props) {
  const options = [
    {
      value: 'total' as const,
      title: 'Inscripción + kit',
      text: 'Pago total inmediato: ' + formatMoney(precios.total) + '.',
    },
    {
      value: 'apartado' as const,
      title: 'Solo inscripción',
      text:
        'Apartas con ' +
        formatMoney(precios.inscripcion) +
        ' y pagas el kit (' +
        formatMoney(precios.kitCompleto) +
        ') en la fecha que elijas.',
    },
  ];

  return (
    <div className="form-block">
      <div className="form-block__head">
        <span className="form-block__n">5</span>
        <div>
          <h3>Modalidad de inscripción</h3>
          <small>El kit es obligatorio para el participante.</small>
        </div>
      </div>
      <div className="choice-grid" role="radiogroup" aria-label="Modalidad de inscripción">
        {options.map((option) => (
          <label className="choice" key={option.value}>
            <input
              type="radio"
              name="modalidad"
              value={option.value}
              required
              checked={plan === option.value}
              onClick={() => {
                // Un clic sobre la opción ya marcada la desmarca.
                if (plan === option.value) onPlan(null);
              }}
              onChange={() => onPlan(option.value)}
            />
            <span className="choice__dot" />
            <span className="choice__text">
              <strong>{option.title}</strong>
              <small>{option.text}</small>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
