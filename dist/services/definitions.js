"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinitionsService = void 0;
class DefinitionsService {
    constructor(core) {
        this.core = core;
    }
    get(init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/definitions`,
            ...(init || {}),
        });
    }
    update(body, init) {
        return this.core.request({
            method: 'PUT',
            path: `/v1/definitions`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
    getCustomTypes(init) {
        return this.core.request({
            method: 'GET',
            path: `/v1/definitions/custom-types`,
            ...(init || {}),
        });
    }
    getOpenApi(body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/definitions/openapi`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
    validate(body, init) {
        return this.core.request({
            method: 'POST',
            path: `/v1/definitions/validate`,
            headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
            body: JSON.stringify(body),
            ...(init || {}),
        });
    }
}
exports.DefinitionsService = DefinitionsService;
//# sourceMappingURL=definitions.js.map