import { ServiceCatalog } from './ServiceCatalog.js';

export class ServiceMetrics {
  static ERROR_THRESHOLD = 15;

  constructor({ serviceId, totalCalls, successCount, errorCount, successRate, errorRate, avgResponseTimeMs }) {
    this.serviceId = serviceId;
    this.totalCalls = totalCalls;
    this.successCount = successCount;
    this.errorCount = errorCount;
    this.successRate = successRate;
    this.errorRate = errorRate;
    this.avgResponseTimeMs = avgResponseTimeMs;
  }

  static fromJson(json) {
    return new ServiceMetrics(json);
  }

  get info() {
    return ServiceCatalog.get(this.serviceId);
  }

  /** True when the error rate is above 15%. */
  hasProblems() {
    return this.errorRate > ServiceMetrics.ERROR_THRESHOLD;
  }
}
