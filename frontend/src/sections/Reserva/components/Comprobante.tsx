import { useRef, useState } from 'react';
import Icon from '../../../../../shared/components/Icon';
import { validateReceipt } from '../../../utils/reserva';

export default function Comprobante({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  function select(next: File | null) {
    const message = next ? validateReceipt(next) : '';
    setError(message);
    if (input.current) input.current.setCustomValidity(message);
    onChange(message ? null : next);
  }

  return (
    <div className="form-block">
      <div className="form-block__head">
        <span className="form-block__n">4</span>
        <div>
          <h3>Comprobante de $50.000</h3>
          <small>Adjunta la imagen o PDF del pago de inscripción.</small>
        </div>
      </div>
      <div className="drop">
        <input
          ref={input}
          type="file"
          name="comprobante"
          accept="image/jpeg,image/png,application/pdf"
          required
          aria-label="Adjuntar comprobante de pago de $50.000"
          aria-describedby="receipt-help receipt-error"
          onChange={(event) => select(event.target.files?.[0] || null)}
        />
        <Icon name="upload" />
        <strong>Arrastra tu comprobante o haz clic aquí</strong>
        <small id="receipt-help">JPG, PNG o PDF · máximo 5 MB</small>
        {file && <span className="drop__file is-visible">Adjunto: {file.name}</span>}
      </div>
      <p id="receipt-error" className="form-error" role="alert">
        {error}
      </p>
    </div>
  );
}
