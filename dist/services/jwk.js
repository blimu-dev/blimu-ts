"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwkService = void 0;
class JwkService {
    constructor(core) {
        this.core = core;
    }
    getJwks(init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/.well-known/jwks.json`,
            ...(init || {}),
        });
    }
}
exports.JwkService = JwkService;
//# sourceMappingURL=jwk.js.map