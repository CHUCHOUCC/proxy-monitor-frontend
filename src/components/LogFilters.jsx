import { LogFilter } from '../models/LogFilter.js';
import { ServiceCatalog } from '../models/ServiceCatalog.js';

export default function LogFilters({ filter, onChange }) {
  const update = (field) => (event) => onChange(filter.with({ [field]: event.target.value }));

  return (
    <div className="filters">
      <label>
        Servicio
        <select value={filter.service} onChange={update('service')}>
          <option value="">Todos</option>
          {ServiceCatalog.all().map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </label>
      <label>
        Estado
        <select value={filter.status} onChange={update('status')}>
          <option value="">Todos</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="ERROR">ERROR</option>
        </select>
      </label>
      <label>
        Desde
        <input type="datetime-local" step="1" value={filter.from} onChange={update('from')} />
      </label>
      <label>
        Hasta
        <input type="datetime-local" step="1" value={filter.to} onChange={update('to')} />
      </label>
      <button className="btn btn--ghost" onClick={() => onChange(new LogFilter())} disabled={filter.isEmpty()}>
        Limpiar filtros
      </button>
    </div>
  );
}
