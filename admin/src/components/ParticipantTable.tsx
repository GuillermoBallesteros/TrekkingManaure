import './ParticipantTable.css';
import { useState } from 'react';
import Icon from '../../../shared/components/Icon';
import Modal from '../../../shared/components/Modal';
import { formatDate, formatMoney } from '../../../shared/utils/format';
import { useAdminPreview } from '../context/AdminPreviewContext';
import type { Participant, PaymentStatus } from '../types/participante';

export function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={'status-badge status-badge--' + status.toLowerCase()}>
      <i />
      {status}
    </span>
  );
}

export default function ParticipantTable({
  rows,
  review = false,
}: {
  rows: Participant[];
  review?: boolean;
}) {
  const { setPaymentStatus } = useAdminPreview();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const selected = rows.find((row) => row.id === selectedId);
  const { participants } = useAdminPreview();
  const detail = participants.find((participant) => participant.id === selectedId);

  function changeStatus(status: PaymentStatus) {
    if (!detail) return;
    setPaymentStatus(detail.id, status);
    setFeedback('Cambio aplicado solo a la vista previa. No se ha modificado un pago real.');
  }

  return (
    <>
      <div
        className="table-scroll"
        role="region"
        aria-label="Participantes de demostración"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Participante</th>
              <th scope="col">{review ? 'Inscripción' : 'Estadía'}</th>
              <th scope="col">Estado del pago</th>
              <th scope="col">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="table-person">
                    <span className="table-avatar">{row.id.slice(-2)}</span>
                    <span>
                      <strong>{row.name}</strong>
                      <small>{row.id}</small>
                    </span>
                  </div>
                </td>
                <td>{review ? formatMoney(row.amount) : row.stay}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>
                  <button
                    type="button"
                    className="table-action"
                    aria-label={'Ver ' + row.name}
                    onClick={() => {
                      setSelectedId(row.id);
                      setFeedback('');
                    }}
                  >
                    Ver detalle <Icon name="arrow" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="empty-state">
            <Icon name="search" />
            <h3>No hay resultados</h3>
            <p>Cambia los filtros o el texto de búsqueda.</p>
          </div>
        )}
      </div>
      <Modal
        open={selectedId !== null}
        title={detail?.name || selected?.name || 'Detalle del participante'}
        onClose={() => setSelectedId(null)}
      >
        {detail && (
          <>
            <p className="admin-demo-label">Registro ficticio · {detail.id}</p>
            <dl className="detail-list">
              <div>
                <dt>Estadía</dt>
                <dd>{detail.stay}</dd>
              </div>
              <div>
                <dt>Inscripción</dt>
                <dd>{formatMoney(detail.amount)}</dd>
              </div>
              <div>
                <dt>Saldo del kit</dt>
                <dd>{formatMoney(detail.balance)}</dd>
              </div>
              <div>
                <dt>Fecha de pago</dt>
                <dd>{formatDate(detail.paymentDate)}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>
                  <StatusBadge status={detail.status} />
                </dd>
              </div>
              <div>
                <dt>Comprobante</dt>
                <dd>Sin archivo real</dd>
              </div>
            </dl>
            <div className="admin-notice">
              Este es un registro de ejemplo. Los cambios se reinician al recargar.
            </div>
            {review && (
              <div className="modal__actions admin-review-actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  disabled={detail.status === 'Rechazado'}
                  onClick={() => changeStatus('Rechazado')}
                >
                  Simular rechazo
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  disabled={detail.status === 'Confirmado'}
                  onClick={() => changeStatus('Confirmado')}
                >
                  Simular aprobación
                </button>
              </div>
            )}
            <p role="status" className="admin-feedback">
              {feedback}
            </p>
          </>
        )}
      </Modal>
    </>
  );
}
