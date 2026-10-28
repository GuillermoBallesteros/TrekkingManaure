import { useCuentaRegresiva } from '../../../hooks';
import './CuentaRegresiva.css';

export default function CuentaRegresiva() {
  const units = useCuentaRegresiva();

  return (
    <div className="countdown" aria-label="Cuenta regresiva al evento">
      {units.map((unit) => (
        <div key={unit.label}>
          <strong>{unit.value}</strong>
          <span>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
