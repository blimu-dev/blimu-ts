import { CoreClient } from '../client';
import * as Schema from '../schema';
export declare class PublicEnvironmentService {
    private core;
    constructor(core: CoreClient);
    getByDomain(domain: string, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.EnvironmentByDomain>;
    getBranding(environmentId: string, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.Branding>;
}
