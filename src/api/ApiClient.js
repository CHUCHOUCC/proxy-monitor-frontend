/**
 * Generic HTTP client. Knows the base URL and how to turn
 * failed responses into ApiError objects.
 */
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export class ApiClient {
  #baseUrl;

  constructor(baseUrl) {
    this.#baseUrl = baseUrl.replace(/\/+$/, '');
  }

  get(path, query = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.append(key, value);
    });
    const qs = params.toString();
    return this.#request(qs ? `${path}?${qs}` : path, { method: 'GET' });
  }

  post(path, body) {
    if (body === undefined) return this.#request(path, { method: 'POST' });
    return this.#request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  async #request(path, options) {
    let response;
    try {
      response = await fetch(`${this.#baseUrl}${path}`, options);
    } catch {
      throw new ApiError('No se pudo conectar con el backend', 0, null);
    }
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError(body?.message ?? `Error HTTP ${response.status}`, response.status, body);
    }
    return body;
  }
}
