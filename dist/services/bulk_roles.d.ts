import { CoreClient } from '../client';
import * as Schema from '../schema';
export declare class BulkRolesService {
    private core;
    constructor(core: CoreClient);
    create(body: Schema.RoleBulkCreateBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.RoleBulkResult>;
}
