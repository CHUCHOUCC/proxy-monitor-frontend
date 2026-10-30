import { ApiClient } from './ApiClient.js';
import { ServiceMetrics } from '../models/ServiceMetrics.js';
import { CallLog } from '../models/CallLog.js';

/**
 * Facade over the backend endpoints used by the dashboard.
 */
export class MonitoringApi {
  #client;

  constructor(client) {
    this.#client = client;
  }

  async getSummary() {
    const data = await this.#client.get('/api/metrics/summary');
    return data.services.map((json) => ServiceMetrics.fromJson(json));
  }

  async getLogs(filter, page = 0, size = 15) {
    const data = await this.#client.get('/api/metrics/logs', { ...filter.toQuery(), page, size });
    return { ...data, content: data.content.map((json) => CallLog.fromJson(json)) };
  }

  async getRecentCalls(serviceId, limit = 20) {
    const data = await this.#client.get('/api/metrics/logs', { service: serviceId, page: 0, size: limit });
    return data.content.map((json) => CallLog.fromJson(json));
  }

  simulateLoad() {
    return this.#client.post('/api/metrics/simulate-load');
  }
}

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
export const monitoringApi = new MonitoringApi(new ApiClient(baseUrl));
