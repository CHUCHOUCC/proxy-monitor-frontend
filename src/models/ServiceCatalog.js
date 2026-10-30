/**
 * Spanish labels and colors for each backend service id.
 */
class ServiceInfo {
  constructor(id, label, color) {
    this.id = id;
    this.label = label;
    this.color = color;
  }
}

export class ServiceCatalog {
  static #services = [
    new ServiceInfo('inventory', 'Inventario', '#2dd4bf'),
    new ServiceInfo('orders', 'Pedidos', '#fbbf24'),
    new ServiceInfo('payments', 'Pagos', '#a78bfa'),
  ];

  static all() {
    return [...ServiceCatalog.#services];
  }

  static get(id) {
    return ServiceCatalog.#services.find((s) => s.id === id) ?? new ServiceInfo(id, id, '#94a3b8');
  }
}
