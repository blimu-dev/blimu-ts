"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkRolesService = void 0;
class BulkRolesService {
    constructor(core) {
        this.core = core;
    }
    create(body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/users/roles/bulk`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
}
exports.BulkRolesService = BulkRolesService;
//# sourceMappingURL=bulk_roles.js.map