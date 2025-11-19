"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
class UsersService {
    constructor(core) {
        this.core = core;
    }
    list(query, init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/users`,
            query,
            ...(init || {}),
        });
    }
    create(body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/users`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
    delete(userId, init) {
        return this.core.request({
            method: 'DELETE',
            path: `/v1/users/${encodeURIComponent(userId)}`,
            ...(init || {}),
        });
    }
    read(userId, init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/users/${encodeURIComponent(userId)}`,
            ...(init || {}),
        });
    }
    update(userId, body, init) {
        return this.core.request({
            method: 'PUT',
            path: `/v1/users/${encodeURIComponent(userId)}`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
    listEffectiveUserResourcesRoles(userId, init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/users/${encodeURIComponent(userId)}/effective-user-resources-roles`,
            ...(init || {}),
        });
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.js.map