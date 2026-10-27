import './ParticipantTable.css';
import Icon from '../../../../shared/components/Icon';
import Modal from '../../../../shared/components/Modal';
import { useParticipantTable } from '../../hooks';
import type { Summary } from '../../utils/comun/inscripcion';
import RegistrationDetail from './RegistrationDetail';
import StatusBadge from '../comun/StatusBadge';

export default function ParticipantTable({ rows }: { rows: Summary[] }) {
  const table = useParticipantTable(rows);

  return (
    <>
      <div
        className="table-scroll"
        role="region"
        aria-label="Inscripciones de demostración"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Titular</th>
              <th scope="col">Grupo</th>
              <th scope="col">Total</th>
              <th scope="col">Saldo</th>
              <th scope="col">Estado</th>
              <th scope="col">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {table.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="table-person">
                    <span className="table-avatar">{item.initials}</span>
                    <span>
                      <strong>
                        {item.name}
                        {item.healthAlert && (
                          <span className="table-health" title="Tiene alertas de salud">
                            <Icon name="medical" />
                            <span className="sr-only">Tiene alertas de salud</span>
                          </span>
                        )}
                      </strong>
                      <small>{item.document}</small>
                    </span>
                  </div>
                </td>
                <td>
                  {item.hasCompanion ? (
                    <span className="table-group">
                      <Icon name="users" /> 2 personas
                    </span>
                  ) : (
                    'Individual'
                  )}
                </td>
                <td>{item.total}</td>
                <td>
                  <span className={item.balanceClass}>{item.balance}</span>
                  {item.commitment && <small className="table-sub">{item.commitment}</small>}
                </td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td>
                  <button
                    type="button"
                    className="table-action"
                    aria-label={item.ariaLabel}
                    onClick={() => table.open(item.id)}
                  >
                    Ver detalle <Icon name="arrow" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {table.isEmpty && (
          <div className="empty-state">
            <Icon name="search" />
            <h3>No hay resultados</h3>
            <p>Cambia los filtros o el texto de búsqueda.</p>
          </div>
        )}
      </div>
      <Modal
        open={table.selectedId !== null}
        title={table.modalTitle}
        onClose={table.close}
        className="admin-detail-modal"
      >
        {table.selectedId && (
          <RegistrationDetail
            key={table.selectedId}
            registrationId={table.selectedId}
            onReview={table.reviewPayment}
          />
        )}
      </Modal>
    </>
  );
}
