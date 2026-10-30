import { useCallback, useEffect, useRef, useState } from 'react';
import { monitoringApi } from './api/MonitoringApi.js';
import { LogFilter } from './models/LogFilter.js';
import { ServiceCatalog } from './models/ServiceCatalog.js';
import { usePolling } from './hooks/usePolling.js';
import Header from './components/Header.jsx';
import ServiceCard from './components/ServiceCard.jsx';
import ResponseTimeChart from './components/ResponseTimeChart.jsx';
import LogFilters from './components/LogFilters.jsx';
import LogsTable from './components/LogsTable.jsx';

const POLL_INTERVAL_MS = 3000;
const PAGE_SIZE = 15;
const CHART_CALLS = 20;

export default function App() {
  const [metrics, setMetrics] = useState([]);
  const [recentCalls, setRecentCalls] = useState({});
  const [logsPage, setLogsPage] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [filter, setFilter] = useState(new LogFilter());
  const [page, setPage] = useState(0);
  const [connectionError, setConnectionError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [notice, setNotice] = useState(null);
  const requestSeq = useRef(0);

  const refresh = useCallback(async () => {
    const seq = ++requestSeq.current;
    try {
      const services = ServiceCatalog.all();
      const [summary, logs, ...recent] = await Promise.all([
        monitoringApi.getSummary(),
        monitoringApi.getLogs(filter, page, PAGE_SIZE),
        ...services.map((s) => monitoringApi.getRecentCalls(s.id, CHART_CALLS)),
      ]);
      if (seq !== requestSeq.current) return; // a newer refresh already started
      setMetrics(summary);
      setLogsPage(logs);
      setRecentCalls(Object.fromEntries(services.map((s, i) => [s.id, recent[i]])));
      setConnectionError(null);
      setLastUpdate(new Date());
    } catch (error) {
      if (seq === requestSeq.current) setConnectionError(error.message);
    }
  }, [filter, page]);

  usePolling(refresh, POLL_INTERVAL_MS);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(0);
  };

  const handleSimulateLoad = async () => {
    setSimulating(true);
    setNotice(null);
    try {
      const result = await monitoringApi.simulateLoad();
      setNotice({
        type: 'ok',
        text: `Carga simulada: ${result.requestedCalls} llamadas · ${result.successfulCalls} exitosas · ${result.failedCalls} con error (${result.durationMs} ms)`,
      });
      await refresh();
    } catch (error) {
      setNotice({ type: 'error', text: `No se pudo simular la carga: ${error.message}` });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="app">
      <Header
        lastUpdate={lastUpdate}
        online={!connectionError}
        simulating={simulating}
        onSimulateLoad={handleSimulateLoad}
      />

      <main className="content">
        {connectionError && (
          <div className="banner banner--error">
            {connectionError}. Reintentando cada {POLL_INTERVAL_MS / 1000} segundos…
          </div>
        )}
        {notice && (
          <div className={`banner banner--${notice.type}`} onClick={() => setNotice(null)} role="status">
            {notice.text}
          </div>
        )}

        <section className="cards">
          {ServiceCatalog.all().map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              metrics={metrics.find((m) => m.serviceId === service.id)}
            />
          ))}
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Tiempo de respuesta · últimas {CHART_CALLS} llamadas por servicio</h2>
          </div>
          <ResponseTimeChart recentCalls={recentCalls} />
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Logs en tiempo real</h2>
            <span className="muted">
              {logsPage.totalElements} registros · actualización cada {POLL_INTERVAL_MS / 1000} s
            </span>
          </div>
          <LogFilters filter={filter} onChange={handleFilterChange} />
          <LogsTable logsPage={logsPage} onPageChange={setPage} />
        </section>
      </main>
    </div>
  );
}
