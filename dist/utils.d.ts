export type PaginableQuery = {
    limit?: number;
    offset?: number;
} & Record<string, unknown>;
export declare function paginate<T>(fetchPage: (query?: any, init?: Omit<RequestInit, 'method' | 'body'>) => Promise<{
    data?: T[];
    hasMore?: boolean;
    limit?: number;
    offset?: number;
}>, initialQuery?: PaginableQuery, pageSize?: number): AsyncGenerator<T, void, unknown>;
export declare function listAll<T>(fetchPage: (query?: any, init?: Omit<RequestInit, 'method' | 'body'>) => Promise<{
    data?: T[];
    hasMore?: boolean;
    limit?: number;
    offset?: number;
}>, query?: PaginableQuery, pageSize?: number): Promise<T[]>;
