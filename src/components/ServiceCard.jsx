import { ServiceMetrics } from '../models/ServiceMetrics.js';

export default function ServiceCard({ service, metrics }) {
  const hasProblems = metrics?.hasProblems() ?? false;

  return (
    <article className={`card ${hasProblems ? 'card--danger' : ''}`} style={{ '--accent': service.color }}>
      <div className="card__head">
        <h3>{service.label}</h3>
        {hasProblems ? (
          <span className="badge badge--danger">Con problemas</span>
        ) : (
          <span className="badge badge--ok">Saludable</span>
        )}
      </div>

      <dl className="card__stats">
        <div>
          <dt>Total de llamadas</dt>
          <dd>{metrics ? metrics.totalCalls.toLocaleString('es-CO') : '—'}</dd>
        </div>
        <div>
          <dt>Tasa de éxito</dt>
          <dd>{metrics ? `${metrics.successRate.toFixed(1)}%` : '—'}</dd>
        </div>
        <div>
          <dt>Tiempo promedio</dt>
          <dd>{metrics ? `${metrics.avgResponseTimeMs.toFixed(0)} ms` : '—'}</dd>
        </div>
      </dl>

      <div className="card__foot">
        <span>Tasa de error: <strong>{metrics ? `${metrics.errorRate.toFixed(1)}%` : '—'}</strong></span>
        <span className="muted">Umbral {ServiceMetrics.ERROR_THRESHOLD}%</span>
      </div>
    </article>
  );
}
