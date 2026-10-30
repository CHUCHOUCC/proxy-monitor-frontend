import { ServiceCatalog } from './ServiceCatalog.js';

export class CallLog {
  constructor(json) {
    this.requestId = json.requestId;
    this.serviceId = json.serviceId;
    this.operation = json.operation;
    this.durationMs = json.durationMs;
    this.status = json.status;
    this.timestamp = new Date(json.timestamp);
    this.params = json.params ?? [];
    this.response = json.response ?? null;
    this.errorType = json.errorType ?? null;
    this.errorMessage = json.errorMessage ?? null;
    this.stackTrace = json.stackTrace ?? [];
  }

  static fromJson(json) {
    return new CallLog(json);
  }

  get serviceLabel() {
    return ServiceCatalog.get(this.serviceId).label;
  }

  isError() {
    return this.status === 'ERROR';
  }

  /** The REST layer always sends one object with named arguments. */
  get inputParams() {
    return this.params.length === 1 ? this.params[0] : this.params;
  }

  formattedTime() {
    return this.timestamp.toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  }
}
