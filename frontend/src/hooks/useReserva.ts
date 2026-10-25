import { useState, type FormEvent } from 'react';
import { precios, evento } from '../../../shared/config';
import { formatDate, formatMoney } from '../../../shared/utils/format';
import { getReservationTotal } from '../utils/reserva';
import type { Estadia, Extra } from '../types/reserva';

export function useReserva(stay: Estadia) {
  const [companion, setCompanion] = useState(false);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const total = getReservationTotal(companion, extras);
  const extrasTotal = extras.reduce((sum, item) => sum + precios[item], 0);

  function toggleExtra(extra: Extra) {
    setExtras((current) =>
      current.includes(extra) ? current.filter((item) => item !== extra) : [...current, extra],
    );
  }

  function changeFile(next: File | null) {
    setFile(next);
    setDate('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;

    if (!form.reportValidity()) return;
    if (!file || !date || !stay) {
      setError('Adjunta un comprobante válido, elige tu estadía y selecciona una fecha de pago.');
      return;
    }

    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) || '').trim() || 'No indicado';
    const lines = [
      'RESERVA · TREKKING DESAFÍO PERIJÁ 13K',
      evento.fechasTexto + ' · Manaure, Cesar',
      '',
      'Nombre: ' + value('nombre'),
      'Cédula: ' + value('cedula'),
      'Teléfono: ' + value('telefono'),
      'Correo: ' + value('correo'),
      'Ciudad: ' + value('ciudad'),
      'Contacto de emergencia: ' + value('emergencia'),
      'EPS / seguro: ' + value('eps'),
      '',
      'Estadía: ' + stay,
      'Acompañante: ' +
        (companion ? value('acompNombre') + ' · C.C. ' + value('acompCedula') : 'No'),
      'Actividades extra: ' + (extras.length ? extras.join(', ') : 'Ninguna'),
      'Comprobante seleccionado: ' + file.name,
      'Fecha de pago del saldo: ' + formatDate(date),
      'Total estimado: ' + formatMoney(total),
    ];
    setPreview(lines.join('\n'));
  }

  return {
    companion,
    setCompanion,
    extras,
    toggleExtra,
    file,
    changeFile,
    date,
    setDate,
    error,
    preview,
    setPreview,
    total,
    extrasTotal,
    submit,
  };
}
