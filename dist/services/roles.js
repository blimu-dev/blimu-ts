"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
class RolesService {
    constructor(core) {
        this.core = core;
    }
    list(userId, query, init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/users/${encodeURIComponent(userId)}/roles`,
            query,
            ...(init || {}),
        });
    }
    create(userId, body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/users/${encodeURIComponent(userId)}/roles`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
    delete(userId, resourceType, resourceId, init) {
        return this.core.request({
            method: 'DELETE',
            path: `/v1/users/${encodeURIComponent(userId)}/roles/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
            ...(init || {}),
        });
    }
}
exports.RolesService = RolesService;
//# sourceMappingURL=roles.js.map