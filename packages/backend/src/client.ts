export type ClientOption = {
  baseURL?: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
  retry?: { retries: number; backoffMs: number; retryOn?: number[] };
  onRequest?: (ctx: {
    url: string;
    init: RequestInit & {
      path: string;
      method: string;
      query?: Record<string, any>;
      headers: Headers;
    };
    attempt: number;
  }) => void | Promise<void>;
  onResponse?: (ctx: {
    url: string;
    init: RequestInit & {
      path: string;
      method: string;
      query?: Record<string, any>;
      headers: Headers;
    };
    attempt: number;
    response: Response;
  }) => void | Promise<void>;
  onError?: (
    err: unknown,
    ctx: {
      url: string;
      init: RequestInit & { path: string; method: string; query?: Record<string, any> };
      attempt: number;
    },
  ) => void | Promise<void>;
  // Environment & Auth
  env?: 'sandbox' | 'production';
  envBaseURLs?: { sandbox: string; production: string };
  accessToken?: string | undefined | (() => string | undefined | Promise<string | undefined>);
  headerName?: string;
  apiKey?: string;
  fetch?: typeof fetch;
  credentials?: RequestCredentials;
};

export class FetchError<T = unknown> extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly data?: T,
    readonly headers?: Headers,
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

export class CoreClient {
  constructor(private cfg: ClientOption = {}) {
    // Set default base URL if not provided
    if (!this.cfg.baseURL) {
      if (this.cfg.env && this.cfg.envBaseURLs) {
        this.cfg.baseURL =
          this.cfg.env === 'production'
            ? this.cfg.envBaseURLs.production
            : this.cfg.envBaseURLs.sandbox;
      } else {
        this.cfg.baseURL = 'https://api.blimu.dev';
      }
    }
  }
  setAccessToken(
    token: string | undefined | (() => string | undefined | Promise<string | undefined>),
  ) {
    this.cfg.accessToken = token;
  }
  async request(
    init: RequestInit & {
      path: string;
      method: string;
      query?: Record<string, any>;
    },
  ) {
    let normalizedPath = init.path || '';
    if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
      normalizedPath = normalizedPath.slice(0, -1);
    }
    const url = new URL((this.cfg.baseURL || '') + normalizedPath);
    if (init.query) {
      Object.entries(init.query).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (Array.isArray(v)) v.forEach((vv) => url.searchParams.append(k, String(vv)));
        else url.searchParams.set(k, String(v));
      });
    }
    const headers = new Headers({
      ...(this.cfg.headers || {}),
      ...(init.headers as any),
    });
    // Generic access token support (optional)
    if (this.cfg.accessToken) {
      const token =
        typeof this.cfg.accessToken === 'function'
          ? await this.cfg.accessToken()
          : this.cfg.accessToken;
      // Only set header if token is not nullish
      if (token != null) {
        const name = this.cfg.headerName || 'Authorization';
        if (name.toLowerCase() === 'authorization') headers.set(name, `Bearer ${String(token)}`);
        else headers.set(name, String(token));
      }
    }
    if (this.cfg?.apiKey) headers.set('X-API-KEY', String(this.cfg?.apiKey));

    const doFetch = async (attempt: number) => {
      // Clone init to prevent mutations from affecting concurrent requests
      // Create a new Headers object for each request to avoid sharing references
      const requestHeaders = new Headers(headers);
      const fetchInit: RequestInit & {
        path: string;
        method: string;
        query?: Record<string, any>;
        headers: Headers;
      } = {
        ...init,
        headers: requestHeaders,
      };
      // Set credentials from config if provided (can be overridden by onRequest)
      if (this.cfg.credentials !== undefined) {
        fetchInit.credentials = this.cfg.credentials;
      }
      if (this.cfg.onRequest)
        await this.cfg.onRequest({ url: url.toString(), init: fetchInit, attempt });
      let controller: AbortController | undefined;
      let timeoutId: any;
      const existingSignal = fetchInit.signal;

      if (this.cfg.timeoutMs && typeof AbortController !== 'undefined') {
        controller = new AbortController();

        // If there's an existing signal, combine it with the timeout signal
        // The combined controller will abort when either signal aborts
        if (existingSignal) {
          // If existing signal is already aborted, abort the new controller immediately
          if (existingSignal.aborted) {
            controller.abort();
          } else {
            // Listen to the existing signal and abort the combined controller when it aborts
            existingSignal.addEventListener('abort', () => {
              controller?.abort();
            });
          }
        }

        fetchInit.signal = controller.signal;
        timeoutId = setTimeout(() => controller?.abort(), this.cfg.timeoutMs);
      }
      try {
        const res = await (this.cfg.fetch || fetch)(url.toString(), fetchInit);
        if (this.cfg.onResponse)
          await this.cfg.onResponse({
            url: url.toString(),
            init: fetchInit,
            attempt,
            response: res,
          });
        const ct = res.headers.get('content-type') || '';
        let parsed: any;
        if (ct.includes('application/json')) {
          parsed = await res.json();
        } else if (ct.startsWith('text/')) {
          parsed = await res.text();
        } else {
          // binary or unknown -> ArrayBuffer
          parsed = await res.arrayBuffer();
        }
        if (!res.ok) {
          throw new FetchError(
            parsed?.message || `HTTP ${res.status}`,
            res.status,
            parsed,
            res.headers,
          );
        }
        return parsed as any;
      } catch (err) {
        if (this.cfg.onError) await this.cfg.onError(err, { url: url.toString(), init, attempt });
        throw err;
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    const retries = this.cfg.retry?.retries ?? 0;
    const baseBackoff = this.cfg.retry?.backoffMs ?? 300;
    const retryOn = this.cfg.retry?.retryOn ?? [429, 500, 502, 503, 504];

    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await doFetch(attempt);
      } catch (err: any) {
        // Retry on network errors or configured status errors
        const status = err?.status as number | undefined;
        const shouldRetry = status ? retryOn.includes(status) : true;
        if (attempt < retries && shouldRetry) {
          const delay = baseBackoff * Math.pow(2, attempt);
          await new Promise((r) => setTimeout(r, delay));
          lastError = err;
          continue;
        }
        if (err instanceof DOMException) throw err;
        if (err instanceof FetchError) throw err;
        if (typeof err === 'string') throw new FetchError(err, status ?? 0);
        throw new FetchError((err as Error)?.message || 'Network error', status ?? 0);
      }
    }
    throw lastError as any;
  }
}
