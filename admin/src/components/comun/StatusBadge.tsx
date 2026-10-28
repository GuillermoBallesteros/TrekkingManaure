import './StatusBadge.css';
import type { PaymentReview, RegistrationStatus } from '../../../../shared/reservas';
import { badgeClass } from '../../utils/comun/estados';

export default function StatusBadge({ status }: { status: RegistrationStatus | PaymentReview }) {
  return (
    <span className={badgeClass(status)}>
      <i />
      {status}
    </span>
  );
}
