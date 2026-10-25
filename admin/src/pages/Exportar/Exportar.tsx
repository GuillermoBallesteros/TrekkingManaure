import './Exportar.css';
import { useState } from 'react';
import Icon from '../../../../shared/components/Icon';
import { useAdminPreview } from '../../context/AdminPreviewContext';

export default function Exportar() {
  const { participants } = useAdminPreview();
  const [filter, setFilter] = useState('Todos');
  const [feedback, setFeedback] = useState('');
  const rows = participants.filter((person) => filter === 'Todos' || person.status === filter);

  function download() {
    const data = [
      [
        'Identificador de ejemplo',
        'Participante ficticio',
        'Estadía',
        'Estado',
        'Inscripción COP',
        'Saldo COP',
        'Fecha de pago',
      ],
      ...rows.map((person) => [
        person.id,
        person.name,
        person.stay,
        person.status,
        String(person.amount),
        String(person.balance),
        person.paymentDate,
      ]),
    ];
    const content =
      '\uFEFF' +
      data
        .map((row) => row.map((value) => '"' + value.replaceAll('"', '""') + '"').join(';'))
        .join('\r\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'perija-muestra-DEMO.csv';
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback('Se preparó una muestra con ' + rows.length + ' registros ficticios.');
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Información para organizar mejor</span>
          <h1>
            Exportar <em>información</em>
          </h1>
          <p>Participantes, estadías y seguimiento de pagos en un reporte.</p>
        </div>
      </div>
      <article className="admin-panel admin-export">
        <span className="feature__icon">
          <Icon name="sheet" />
        </span>
        <h2>Tu evento, en una hoja</h2>
        <p>
          Prueba la descarga de una muestra CSV compatible con Excel. El reporte de datos reales se
          integrará con el servidor.
        </p>
        <label htmlFor="export-filter">Registros a incluir</label>
        <select
          id="export-filter"
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value);
            setFeedback('');
          }}
        >
          <option>Todos</option>
          <option>Pendiente</option>
          <option>Confirmado</option>
          <option>Rechazado</option>
        </select>
        <div className="admin-export-summary">
          <span>
            Formato<strong>CSV · Demostración</strong>
          </span>
          <span>
            Registros<strong>{rows.length}</strong>
          </span>
        </div>
        <button className="btn btn--primary btn--block" onClick={download} disabled={!rows.length}>
          <Icon name="sheet" /> Descargar muestra
        </button>
        <p className="admin-notice">
          La muestra contiene exclusivamente datos ficticios. La exportación .xlsx y los registros
          reales quedan pendientes de integración.
        </p>
        <p role="status" className="admin-feedback">
          {feedback}
        </p>
      </article>
    </>
  );
}
