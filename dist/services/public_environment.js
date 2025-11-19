"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicEnvironmentService = void 0;
class PublicEnvironmentService {
    constructor(core) {
        this.core = core;
    }
    getByDomain(domain, init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/public/environments/by-domain/${encodeURIComponent(domain)}`,
            ...(init || {}),
        });
    }
    getBranding(environmentId, init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/public/environments/${encodeURIComponent(environmentId)}/branding`,
            ...(init || {}),
        });
    }
}
exports.PublicEnvironmentService = PublicEnvironmentService;
//# sourceMappingURL=public_environment.js.map