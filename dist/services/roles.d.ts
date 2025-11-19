import { CoreClient } from '../client';
import * as Schema from '../schema';
export declare class RolesService {
    private core;
    constructor(core: CoreClient);
    list(userId: string, query?: Schema.RolesListQuery, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.RoleList>;
    create(userId: string, body: Schema.RoleCreateBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.Role>;
    delete(userId: string, resourceType: Schema.ResourceType, resourceId: string, init?: Omit<RequestInit, 'method' | 'body'>): Promise<unknown>;
}
