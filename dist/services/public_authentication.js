"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAuthenticationService = void 0;
class PublicAuthenticationService {
    constructor(core) {
        this.core = core;
    }
    login(body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/public/auth/login`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
    logout(init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/public/auth/logout`,
            ...(init || {}),
        });
    }
    register(body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/public/auth/register`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
}
exports.PublicAuthenticationService = PublicAuthenticationService;
//# sourceMappingURL=public_authentication.js.map