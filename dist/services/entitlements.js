"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitlementsService = void 0;
class EntitlementsService {
    constructor(core) {
        this.core = core;
    }
    checkEntitlement(body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/entitlements/check`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
}
exports.EntitlementsService = EntitlementsService;
//# sourceMappingURL=entitlements.js.map