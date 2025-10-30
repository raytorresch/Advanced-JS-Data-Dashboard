async function fetchWithRetry(url, options = {}, maxRetries = 3, timeoutMs = 5000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();

    } catch (error) {
      clearTimeout(timeout);

      const isLastAttempt = attempt === maxRetries;
      const isAbort = error.name === "AbortError";

      if (isAbort) throw new Error(`Request timed out after ${timeoutMs}ms`);
      if (isLastAttempt) throw error;

      console.warn(`Attempt ${attempt} failed (${error.message}). Retrying...`);
      await new Promise(res => setTimeout(res, 500 * attempt)); // Exponential backoff
    }
  }
}

function createApiClient(baseURL, globalOptions = {}) {
  return {
    get: (endpoint, options = {}) =>
      fetchWithRetry(`${baseURL}${endpoint}`, { ...globalOptions, ...options }),

    post: (endpoint, data, options = {}) =>
      fetchWithRetry(`${baseURL}${endpoint}`, {
        ...globalOptions,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...options.headers },
        body: JSON.stringify(data),
      })
  };
}

class RequestManager {
  constructor() {
    this.requests = new Map();
  }

  async makeRequest(id, url, options = {}) {
    // Cancelar request previo si existe
    this.cancelRequest(id);

    const controller = new AbortController();
    this.requests.set(id, controller);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      this.requests.delete(id);
      return await response.json();
    } catch (error) {
      this.requests.delete(id);
      if (error.name === 'AbortError') return null;
      throw error;
    }
  }

  cancelRequest(id) {
    if (this.requests.has(id)) {
      this.requests.get(id).abort();
      this.requests.delete(id);
    }
  }

  cancelAll() {
    this.requests.forEach(controller => controller.abort());
    this.requests.clear();
  }
}

function createLoadingManager() {
  let loadingStates = {};
  let listeners = [];

  const notify = () => listeners.forEach(l => l({ ...loadingStates }));

  return {
    start: key => {
      loadingStates[key] = true;
      notify();
    },
    stop: key => {
      loadingStates[key] = false;
      notify();
    },
    isLoading: key => !!loadingStates[key],
    getCount: () => Object.values(loadingStates).filter(Boolean).length,
    subscribe: listener => {
      listeners.push(listener);
      return () => { listeners = listeners.filter(l => l !== listener); };
    }
  };
}

export default class ApiClient {
  constructor(baseURL, defaultOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = defaultOptions;
    this.requests = new RequestManager();
    this.loading = createLoadingManager();
  }

  async request(endpoint, options = {}, retry = 3, timeout = 5000) {
    const requestId = `${endpoint}-${Date.now()}`;
    this.loading.start(requestId);

    try {
      const data = await fetchWithRetry(
        `${this.baseURL}${endpoint}`,
        { ...this.defaultOptions, ...options },
        retry,
        timeout
      );
      return data;
    } catch (error) {
      console.error(`❌ API error on ${endpoint}:`, error.message);
      throw error;
    } finally {
      this.loading.stop(requestId);
    }
  }

  // Métodos específicos
  getUserProfile(userId) {
    return this.request(`/users/${userId}`);
  }

  searchUsers(query) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  createUser(data) {
    return this.request('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  cancelAllRequests() {
    this.requests.cancelAll();
  }

  getLoadingStatus() {
    return this.loading.getCount() > 0;
  }
}
