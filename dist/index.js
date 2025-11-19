"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = exports.RolesService = exports.ResourcesService = exports.EntitlementsService = exports.BulkRolesService = exports.Schema = exports.Blimu = void 0;
const client_1 = require("./client");
const bulk_roles_1 = require("./services/bulk_roles");
const entitlements_1 = require("./services/entitlements");
const resources_1 = require("./services/resources");
const roles_1 = require("./services/roles");
const users_1 = require("./services/users");
class Blimu {
    constructor(options) {
        const core = new client_1.CoreClient(options);
        this.bulkRoles = new bulk_roles_1.BulkRolesService(core);
        this.entitlements = new entitlements_1.EntitlementsService(core);
        this.resources = new resources_1.ResourcesService(core);
        this.roles = new roles_1.RolesService(core);
        this.users = new users_1.UsersService(core);
    }
}
exports.Blimu = Blimu;
exports.Schema = __importStar(require("./schema"));
__exportStar(require("./utils"), exports);
var bulk_roles_2 = require("./services/bulk_roles");
Object.defineProperty(exports, "BulkRolesService", { enumerable: true, get: function () { return bulk_roles_2.BulkRolesService; } });
var entitlements_2 = require("./services/entitlements");
Object.defineProperty(exports, "EntitlementsService", { enumerable: true, get: function () { return entitlements_2.EntitlementsService; } });
var resources_2 = require("./services/resources");
Object.defineProperty(exports, "ResourcesService", { enumerable: true, get: function () { return resources_2.ResourcesService; } });
var roles_2 = require("./services/roles");
Object.defineProperty(exports, "RolesService", { enumerable: true, get: function () { return roles_2.RolesService; } });
var users_2 = require("./services/users");
Object.defineProperty(exports, "UsersService", { enumerable: true, get: function () { return users_2.UsersService; } });
//# sourceMappingURL=index.js.map