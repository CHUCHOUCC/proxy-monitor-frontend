export default function Header({ lastUpdate, online, simulating, onSimulateLoad }) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="28" height="28">
            <path d="M3 18h6l3-8 5 14 3-6h9" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <h1>Monitor de Microservicios</h1>
          <p className="muted">Proxy de auditoría y logging · Inventario, Pedidos y Pagos</p>
        </div>
      </div>
      <div className="header__actions">
        <span className={`status-dot ${online ? 'status-dot--on' : 'status-dot--off'}`}>
          {online ? 'En línea' : 'Sin conexión'}
          {lastUpdate && online && <> · {lastUpdate.toLocaleTimeString('es-CO')}</>}
        </span>
        <button className="btn btn--primary" onClick={onSimulateLoad} disabled={simulating}>
          {simulating ? 'Simulando…' : 'Simular carga'}
        </button>
      </div>
    </header>
  );
}
