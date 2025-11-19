import { CoreClient } from '../client';
import * as Schema from '../schema';
export declare class ResourcesService {
    private core;
    constructor(core: CoreClient);
    list(resourceType: Schema.ResourceType, query?: Schema.ResourcesListQuery, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.ResourceList>;
    bulkCreate(resourceType: Schema.ResourceType, body: Schema.ResourceBulkCreateBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.ResourceBulkResult>;
    delete(resourceType: Schema.ResourceType, resourceId: string, init?: Omit<RequestInit, 'method' | 'body'>): Promise<unknown>;
    read(resourceType: Schema.ResourceType, resourceId: string, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.Resource>;
    update(resourceType: Schema.ResourceType, resourceId: string, body: Schema.ResourceUpdateBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<unknown>;
}
