"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreClient = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, status, data, headers) {
        super(message);
        this.status = status;
        this.data = data;
        this.headers = headers;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
class CoreClient {
    constructor(cfg = {}) {
        this.cfg = cfg;
        if (!this.cfg.baseURL) {
            if (this.cfg.env && this.cfg.envBaseURLs) {
                this.cfg.baseURL =
                    this.cfg.env === 'production'
                        ? this.cfg.envBaseURLs.production
                        : this.cfg.envBaseURLs.sandbox;
            }
            else {
                this.cfg.baseURL = 'https://api.blimu.dev';
            }
        }
    }
    setAccessToken(token) {
        this.cfg.accessToken = token;
    }
    async request(init) {
        let normalizedPath = init.path || '';
        if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
            normalizedPath = normalizedPath.slice(0, -1);
        }
        const url = new URL((this.cfg.baseURL || '') + normalizedPath);
        if (init.query) {
            Object.entries(init.query).forEach(([k, v]) => {
                if (v === undefined || v === null)
                    return;
                if (Array.isArray(v))
                    v.forEach((vv) => url.searchParams.append(k, String(vv)));
                else
                    url.searchParams.set(k, String(v));
            });
        }
        const headers = new Headers({
            ...(this.cfg.headers || {}),
            ...init.headers,
        });
        if (this.cfg.accessToken) {
            const token = typeof this.cfg.accessToken === 'function'
                ? await this.cfg.accessToken()
                : this.cfg.accessToken;
            const name = this.cfg.headerName || 'Authorization';
            if (name.toLowerCase() === 'authorization')
                headers.set(name, `Bearer ${String(token)}`);
            else
                headers.set(name, String(token));
        }
        if (this.cfg?.apiKeyAuth)
            headers.set('X-API-KEY', String(this.cfg?.apiKeyAuth));
        if (this.cfg.bearer)
            headers.set('Authorization', `Bearer ${this.cfg.bearer}`);
        const doFetch = async (attempt) => {
            if (this.cfg.onRequest)
                await this.cfg.onRequest({ url: url.toString(), init, attempt });
            let controller;
            let timeoutId;
            const fetchInit = { ...init, headers };
            if (this.cfg.timeoutMs && typeof AbortController !== 'undefined') {
                controller = new AbortController();
                fetchInit.signal = controller.signal;
                timeoutId = setTimeout(() => controller?.abort(), this.cfg.timeoutMs);
            }
            try {
                const res = await (this.cfg.fetch || fetch)(url.toString(), fetchInit);
                if (this.cfg.onResponse)
                    await this.cfg.onResponse({ url: url.toString(), init, attempt, response: res });
                const ct = res.headers.get('content-type') || '';
                let parsed;
                if (ct.includes('application/json')) {
                    parsed = await res.json();
                }
                else if (ct.startsWith('text/')) {
                    parsed = await res.text();
                }
                else {
                    parsed = await res.arrayBuffer();
                }
                if (!res.ok) {
                    throw new ApiError(`HTTP ${res.status}`, res.status, parsed, res.headers);
                }
                return parsed;
            }
            catch (err) {
                if (this.cfg.onError)
                    await this.cfg.onError(err, { url: url.toString(), init, attempt });
                throw err;
            }
            finally {
                if (timeoutId)
                    clearTimeout(timeoutId);
            }
        };
        const retries = this.cfg.retry?.retries ?? 0;
        const baseBackoff = this.cfg.retry?.backoffMs ?? 300;
        const retryOn = this.cfg.retry?.retryOn ?? [429, 500, 502, 503, 504];
        let lastError;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await doFetch(attempt);
            }
            catch (err) {
                const status = err?.status;
                const shouldRetry = status ? retryOn.includes(status) : true;
                if (attempt < retries && shouldRetry) {
                    const delay = baseBackoff * Math.pow(2, attempt);
                    await new Promise((r) => setTimeout(r, delay));
                    lastError = err;
                    continue;
                }
                if (err instanceof ApiError)
                    throw err;
                throw new ApiError(err?.message || 'Network error', status ?? 0);
            }
        }
        throw lastError;
    }
}
exports.CoreClient = CoreClient;
//# sourceMappingURL=client.js.map