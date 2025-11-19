import { CoreClient } from '../client';
import * as Schema from '../schema';
export declare class EntitlementsService {
    private core;
    constructor(core: CoreClient);
    checkEntitlement(body: Schema.EntitlementCheckBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.EntitlementCheckResult>;
}
