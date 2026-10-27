import './StatusBadge.css';
import type { PaymentReview, RegistrationStatus } from '../../types/participante';
import { badgeClass } from '../../utils/comun/inscripcion';

export default function StatusBadge({ status }: { status: RegistrationStatus | PaymentReview }) {
  return (
    <span className={badgeClass(status)}>
      <i />
      {status}
    </span>
  );
}
