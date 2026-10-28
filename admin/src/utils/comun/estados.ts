// Clases de presentación para los estados de inscripción y de pago.
export function statusClass(status: string) {
  return status.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
}

export function badgeClass(status: string) {
  return 'status-badge status-badge--' + statusClass(status);
}
