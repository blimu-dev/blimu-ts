import { CoreClient } from '../client';
export declare class JwkService {
    private core;
    constructor(core: CoreClient);
    getJwks(init?: Omit<RequestInit, 'method' | 'body'>): Promise<unknown>;
}
