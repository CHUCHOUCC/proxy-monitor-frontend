/**
 * Runs a task every N milliseconds. Never overlaps two runs.
 */
export class Poller {
  #task;
  #intervalMs;
  #timerId = null;
  #running = false;

  constructor(task, intervalMs) {
    this.#task = task;
    this.#intervalMs = intervalMs;
  }

  start() {
    if (this.#running) return;
    this.#running = true;
    this.#tick();
  }

  stop() {
    this.#running = false;
    clearTimeout(this.#timerId);
  }

  async #tick() {
    try {
      await this.#task();
    } finally {
      if (this.#running) this.#timerId = setTimeout(() => this.#tick(), this.#intervalMs);
    }
  }
}
