export const adminLinks = [
  { id: 'resumen', label: 'Vista general', icon: 'grid' },
  { id: 'participantes', label: 'Participantes', icon: 'users' },
  { id: 'pagos', label: 'Revisión de pagos', icon: 'sheet' },
  { id: 'cupos', label: 'Gestión de cupos', icon: 'tent' },
  { id: 'exportar', label: 'Exportar información', icon: 'upload' },
] as const;

export type AdminRoute = (typeof adminLinks)[number]['id'] | 'acceso';
