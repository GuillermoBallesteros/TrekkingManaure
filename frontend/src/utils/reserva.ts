import { precios } from '../../../shared/config';
import type { Extra } from '../types/reserva';

export function getReservationTotal(withCompanion: boolean, extras: Extra[]) {
  return (
    precios.total +
    (withCompanion ? precios.acompanante : 0) +
    extras.reduce((sum, extra) => sum + precios[extra], 0)
  );
}

export function validateReceipt(file: Pick<File, 'name' | 'type' | 'size'>): string {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const validExtension = /\.(jpe?g|png|pdf)$/i.test(file.name);

  if (!allowedTypes.includes(file.type) || !validExtension) {
    return 'Selecciona un archivo JPG, PNG o PDF.';
  }

  if (file.size > 5 * 1024 * 1024) {
    return 'El comprobante supera los 5 MB. Elige un archivo más liviano.';
  }

  return '';
}
