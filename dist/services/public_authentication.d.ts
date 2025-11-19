import { CoreClient } from '../client';
import * as Schema from '../schema';
export declare class PublicAuthenticationService {
    private core;
    constructor(core: CoreClient);
    login(body: Schema.AuthLoginBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.AuthResponse>;
    logout(init?: Omit<RequestInit, 'method' | 'body'>): Promise<unknown>;
    register(body: Schema.AuthRegisterBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.AuthResponse>;
}
