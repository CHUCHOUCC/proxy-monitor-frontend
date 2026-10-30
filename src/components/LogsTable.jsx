import { Fragment, useState } from 'react';
import LogDetails from './LogDetails.jsx';

export default function LogsTable({ logsPage, onPageChange }) {
  const [expandedId, setExpandedId] = useState(null);
  const { content, page, totalPages } = logsPage;

  const toggle = (requestId) => setExpandedId((current) => (current === requestId ? null : requestId));

  return (
    <>
      <div className="table-wrap">
        <table className="logs">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Servicio</th>
              <th>Operación</th>
              <th className="num">Duración</th>
              <th>Estado</th>
              <th>Fecha y hora</th>
            </tr>
          </thead>
          <tbody>
            {content.length === 0 && (
              <tr><td colSpan={6} className="empty">No hay logs para los filtros seleccionados.</td></tr>
            )}
            {content.map((log) => {
              const open = expandedId === log.requestId;
              return (
                <Fragment key={log.requestId}>
                  <tr
                    className={`logs__row ${open ? 'logs__row--open' : ''}`}
                    onClick={() => toggle(log.requestId)}
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(log.requestId)}
                    aria-expanded={open}
                  >
                    <td className="mono">
                      <span className="chevron" aria-hidden="true">{open ? '▾' : '▸'}</span>
                      {log.requestId.slice(0, 8)}…
                    </td>
                    <td>{log.serviceLabel}</td>
                    <td className="mono">{log.operation}</td>
                    <td className="num mono">{log.durationMs} ms</td>
                    <td>
                      <span className={`pill ${log.isError() ? 'pill--error' : 'pill--ok'}`}>{log.status}</span>
                    </td>
                    <td className="muted">{log.formattedTime()}</td>
                  </tr>
                  {open && (
                    <tr className="logs__details">
                      <td colSpan={6}><LogDetails log={log} /></td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn btn--ghost" onClick={() => onPageChange(page - 1)} disabled={page <= 0}>
          ← Anterior
        </button>
        <span className="muted">Página {totalPages === 0 ? 0 : page + 1} de {totalPages}</span>
        <button className="btn btn--ghost" onClick={() => onPageChange(page + 1)} disabled={page + 1 >= totalPages}>
          Siguiente →
        </button>
      </div>
    </>
  );
}
