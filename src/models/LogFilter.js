/**
 * Immutable set of filters for the logs table.
 * Dates are kept as the value of <input type="datetime-local"> (local time).
 */
export class LogFilter {
  constructor({ service = '', status = '', from = '', to = '' } = {}) {
    this.service = service;
    this.status = status;
    this.from = from;
    this.to = to;
    Object.freeze(this);
  }

  with(changes) {
    return new LogFilter({ ...this, ...changes });
  }

  isEmpty() {
    return !this.service && !this.status && !this.from && !this.to;
  }

  /** Query params expected by GET /api/metrics/logs (dates as ISO-8601 UTC). */
  toQuery() {
    return {
      service: this.service,
      status: this.status,
      from: LogFilter.#toIso(this.from),
      to: LogFilter.#toIso(this.to),
    };
  }

  static #toIso(localValue) {
    if (!localValue) return '';
    const date = new Date(localValue);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString();
  }
}
