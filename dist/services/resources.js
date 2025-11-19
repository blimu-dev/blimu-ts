"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesService = void 0;
class ResourcesService {
    constructor(core) {
        this.core = core;
    }
    list(resourceType, query, init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/resources/${encodeURIComponent(resourceType)}`,
            query,
            ...(init || {}),
        });
    }
    bulkCreate(resourceType, body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/resources/${encodeURIComponent(resourceType)}`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
    delete(resourceType, resourceId, init) {
        return this.core.request({
            method: 'DELETE',
            path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
            ...(init || {}),
        });
    }
    read(resourceType, resourceId, init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
            ...(init || {}),
        });
    }
    update(resourceType, resourceId, body, init) {
        return this.core.request({
            method: 'PUT',
            path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
}
exports.ResourcesService = ResourcesService;
//# sourceMappingURL=resources.js.map