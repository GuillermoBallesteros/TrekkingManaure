import { useState } from 'react';
import { formatDate, formatMoney } from '../../../../shared/utils/format';
import { useAdminPreview } from '../../context/AdminPreviewContext';
import { classNames } from '../../utils/comun/classNames';
import { fullName, hasHealthAlerts, type Summary } from '../../utils/comun/inscripcion';

export function useParticipantTable(rows: Summary[]) {
  const { registrations, setFocusPaymentId } = useAdminPreview();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = registrations.find((registration) => registration.id === selectedId);

  function reviewPayment(paymentId: string) {
    setFocusPaymentId(paymentId);
    setSelectedId(null);
    location.hash = '#/pagos';
  }

  return {
    items: rows.map(({ registration, status, total, balance }) => ({
      id: registration.id,
      initials: registration.firstName[0] + registration.lastName[0],
      name: fullName(registration),
      document: registration.documentType + ' ' + registration.document + ' · ' + registration.id,
      healthAlert: hasHealthAlerts(registration),
      hasCompanion: registration.companion !== null,
      total: formatMoney(total),
      balance: formatMoney(balance),
      balanceClass: classNames(balance > 0 && 'table-due'),
      commitment:
        balance > 0 && registration.commitmentDate
          ? 'Compromiso ' + formatDate(registration.commitmentDate)
          : null,
      status,
      ariaLabel: 'Ver detalle de ' + fullName(registration),
    })),
    isEmpty: rows.length === 0,
    selectedId: selected?.id ?? null,
    modalTitle: selected ? fullName(selected) : 'Detalle de la inscripción',
    open: setSelectedId,
    close: () => setSelectedId(null),
    reviewPayment,
  };
}
