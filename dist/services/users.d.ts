import { CoreClient } from '../client';
import * as Schema from '../schema';
export declare class UsersService {
    private core;
    constructor(core: CoreClient);
    list(query?: Schema.UsersListQuery, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.UserList>;
    create(body: Schema.UserCreateBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.User>;
    delete(userId: string, init?: Omit<RequestInit, 'method' | 'body'>): Promise<unknown>;
    read(userId: string, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.User>;
    update(userId: string, body: Schema.UserUpdateBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.User>;
    listEffectiveUserResourcesRoles(userId: string, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.UserResourceList>;
}
