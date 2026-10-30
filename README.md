# Proxy Monitor · Frontend (React + Vite + Chart.js)

Dashboard de observabilidad en tiempo real para el sistema de microservicios con Proxy de logging.

## Funcionalidades

- 3 tarjetas de servicio (Inventario, Pedidos, Pagos): total de llamadas, tasa de éxito y tiempo promedio.
- Indicador visual: si la tasa de error supera el **15%**, la tarjeta se resalta en rojo ("Con problemas").
- Gráfica de líneas (Chart.js) con las últimas 20 llamadas por servicio y su tiempo de respuesta (los puntos rojos son errores).
- Tabla de logs en tiempo real con **polling cada 3 segundos**: requestId, servicio, operación, duración y estado.
- Filtros por servicio, estado (SUCCESS/ERROR) y rango de fechas, con paginación.
- Botón **"Simular carga"** que llama a `POST /api/metrics/simulate-load` y refresca el dashboard.
- Clic en un log para ver los parámetros de entrada y la respuesta completa (o el error con su stack trace).

## Estructura (POO)

```
src/
  api/ApiClient.js         clase HTTP genérica (+ ApiError)
  api/MonitoringApi.js     clase con los endpoints del backend
  models/ServiceMetrics.js métricas de un servicio, hasProblems() > 15%
  models/CallLog.js        un log del proxy
  models/LogFilter.js      filtros inmutables → query params
  models/ServiceCatalog.js nombres en español y colores
  core/Poller.js           ejecuta una tarea cada N ms sin solaparse
  hooks/usePolling.js      conecta Poller con React
  components/              Header, ServiceCard, ResponseTimeChart, LogFilters, LogsTable, LogDetails
```

## Ejecutar en local

```bash
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:8080
npm run dev              # http://localhost:5173
```

## Despliegue en Vercel

1. Sube este proyecto a su propio repositorio de GitHub.
2. En Vercel: **Add New → Project** e importa el repo. Vercel detecta Vite automáticamente
   (Build: `npm run build`, Output: `dist`).
3. En **Environment Variables** agrega `VITE_API_URL` = URL pública del backend en Railway
   (ej. `https://proxy-monitor-backend.up.railway.app`, sin `/` final).
4. Deploy. Si cambias la variable después, haz **Redeploy** (Vite la incrusta en el build).
5. Copia la URL de Vercel y ponla en la variable `CORS_ALLOWED_ORIGINS` del backend en Railway.
