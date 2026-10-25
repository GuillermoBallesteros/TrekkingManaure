import { useEffect, useState } from 'react';
import { evento } from '../../../../../shared/config';
import './CuentaRegresiva.css';

function remaining() {
  const seconds = Math.max(0, Math.floor((new Date(evento.largada).getTime() - Date.now()) / 1000));
  return [
    Math.floor(seconds / 86400),
    Math.floor((seconds % 86400) / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ];
}

export default function CuentaRegresiva() {
  const [values, setValues] = useState(remaining);
  const labels = ['Días', 'Horas', 'Min', 'Seg'];

  useEffect(() => {
    const timer = window.setInterval(() => setValues(remaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="countdown" aria-label="Cuenta regresiva al evento">
      {values.map((value, index) => (
        <div key={labels[index]}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}
