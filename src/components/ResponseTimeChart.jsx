import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ServiceCatalog } from '../models/ServiceCatalog.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const MAX_POINTS = 20;

export default function ResponseTimeChart({ recentCalls }) {
  const labels = Array.from({ length: MAX_POINTS }, (_, i) => `#${i + 1}`);

  const datasets = ServiceCatalog.all().map((service) => {
    // Backend returns newest first; the chart reads left (oldest) to right (newest).
    const calls = [...(recentCalls[service.id] ?? [])].reverse();
    return {
      label: service.label,
      data: calls.map((c) => c.durationMs),
      calls,
      borderColor: service.color,
      backgroundColor: service.color,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: calls.map((c) => (c.isError() ? 5 : 2.5)),
      pointBackgroundColor: calls.map((c) => (c.isError() ? '#f87171' : service.color)),
      pointBorderColor: calls.map((c) => (c.isError() ? '#f87171' : service.color)),
    };
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: 'nearest', intersect: false },
    plugins: {
      legend: { labels: { color: '#cbd5e1', usePointStyle: true, boxHeight: 6 } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const call = ctx.dataset.calls[ctx.dataIndex];
            const estado = call.isError() ? 'ERROR' : 'OK';
            return ` ${ctx.dataset.label} · ${call.operation}: ${ctx.parsed.y} ms (${estado})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Llamada (más antigua → más reciente)', color: '#94a3b8' },
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148,163,184,0.08)' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Tiempo de respuesta (ms)', color: '#94a3b8' },
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148,163,184,0.12)' },
      },
    },
  };

  const hasData = datasets.some((d) => d.data.length > 0);

  return (
    <div className="chart">
      {hasData ? (
        <Line data={{ labels, datasets }} options={options} />
      ) : (
        <p className="empty">Aún no hay llamadas. Pulsa «Simular carga» para generar tráfico.</p>
      )}
    </div>
  );
}
