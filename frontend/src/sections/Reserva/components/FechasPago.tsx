import Calendario from '../../../components/ui/Calendario';
import { precios } from '../../../../../shared/config';
import { formatMoney } from '../../../../../shared/utils/format';

type Props = {
  /** El titular eligió solo inscripción y debe fijar la fecha del saldo del kit. */
  holder: boolean;
  holderDate: string;
  onHolderDate: (value: string) => void;
  /** El acompañante compra kit con pago diferido y debe fijar la fecha de su saldo. */
  companion: boolean;
  companionDate: string;
  onCompanionDate: (value: string) => void;
};

const saldoKitAcompanante = precios.acompananteConKit - precios.acompanante;

export default function FechasPago({
  holder,
  holderDate,
  onHolderDate,
  companion,
  companionDate,
  onCompanionDate,
}: Props) {
  if (!holder && !companion) return null;

  return (
    <div className="form-block">
      <div className="form-block__head">
        <span className="form-block__n">7</span>
        <div>
          <h3>Fechas de pago del saldo</h3>
          <small>Solo aparece lo que elegiste en los pasos anteriores.</small>
        </div>
      </div>
      {holder && (
        <>
          <p className="field-hint calendar-hint">
            Elige el día en que pagarás el saldo del kit de {formatMoney(precios.kitCompleto)}. Si
            no se paga en esa fecha, el cupo del kit se libera para reasignación.
          </p>
          <Calendario selected={holderDate} onSelect={onHolderDate} concepto="el saldo del kit" />
        </>
      )}
      {companion && (
        <>
          <p className="field-hint calendar-hint">
            Elige el día en que pagará el acompañante su saldo del kit de{' '}
            {formatMoney(saldoKitAcompanante)}. Si no se paga en esa fecha, el cupo del kit se
            libera para reasignación.
          </p>
          <Calendario
            selected={companionDate}
            onSelect={onCompanionDate}
            concepto="el saldo del kit del acompañante"
          />
        </>
      )}
    </div>
  );
}
