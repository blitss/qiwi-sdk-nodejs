import { Response } from 'node-fetch';
export interface QiwiOptions {
    baseUrl?: string;
    headers?: {
        [key: string]: string;
    };
}
export declare type Methods = 'GET' | 'POST';
export declare const defaultOptions: {
    baseUrl: string;
    headers: {
        Accept: string;
        'Content-Type': string;
    };
};
export default class QiwiConnector {
    private apiKey;
    private options;
    constructor(apiKey: string, options?: QiwiOptions);
    query(method: string, endpoint: string, data?: Object, headers?: {
        [key: string]: string;
    }): Promise<any>;
}
export interface Request {
    json?: any;
    response: Response;
    urlOptions: RequestInit;
}
export declare class QiwiError extends Error {
    statusCode: number;
    request: Request;
    private _message?;
    constructor(statusCode: number, message?: string, jsonRaw?: Request);
    readonly message: any;
    readonly errorCode: any;
}
