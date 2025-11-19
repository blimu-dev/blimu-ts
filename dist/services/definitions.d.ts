import { CoreClient } from '../client';
import * as Schema from '../schema';
export declare class DefinitionsService {
    private core;
    constructor(core: CoreClient);
    get(init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.Definition>;
    update(body: Schema.Definition, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.Definition>;
    getCustomTypes(init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.DefinitionCustomTypesResponse>;
    getOpenApi(body: Schema.DefinitionGenerateSDKBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.DefinitionGenerateSDKResponse>;
    validate(body: Schema.DefinitionValidateBody, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.DefinitionValidateResponse>;
}
