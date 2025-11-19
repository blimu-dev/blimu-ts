"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
class AuthenticationService {
    constructor(core) {
        this.core = core;
    }
    login(body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/server/auth/login`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
    register(body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/server/auth/register`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.js.map