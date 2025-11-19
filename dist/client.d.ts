export type ClientOption = {
    baseURL?: string;
    headers?: Record<string, string>;
    timeoutMs?: number;
    retry?: {
        retries: number;
        backoffMs: number;
        retryOn?: number[];
    };
    onRequest?: (ctx: {
        url: string;
        init: RequestInit & {
            path: string;
            method: string;
            query?: Record<string, any>;
        };
        attempt: number;
    }) => void | Promise<void>;
    onResponse?: (ctx: {
        url: string;
        init: RequestInit & {
            path: string;
            method: string;
            query?: Record<string, any>;
        };
        attempt: number;
        response: Response;
    }) => void | Promise<void>;
    onError?: (err: unknown, ctx: {
        url: string;
        init: RequestInit & {
            path: string;
            method: string;
            query?: Record<string, any>;
        };
        attempt: number;
    }) => void | Promise<void>;
    env?: 'sandbox' | 'production';
    envBaseURLs?: {
        sandbox: string;
        production: string;
    };
    accessToken?: string | (() => string | Promise<string>);
    headerName?: string;
    apiKeyAuth?: string;
    bearer?: string;
    fetch?: typeof fetch;
};
export declare class ApiError<T = unknown> extends Error {
    readonly status: number;
    readonly data?: T | undefined;
    readonly headers?: Headers | undefined;
    constructor(message: string, status: number, data?: T | undefined, headers?: Headers | undefined);
}
export declare class CoreClient {
    private cfg;
    constructor(cfg?: ClientOption);
    setAccessToken(token: string | (() => string | Promise<string>)): void;
    request(init: RequestInit & {
        path: string;
        method: string;
        query?: Record<string, any>;
    }): Promise<any>;
}
