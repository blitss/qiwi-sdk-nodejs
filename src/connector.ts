import fetch, { Response } from 'node-fetch';
import * as merge from 'lodash/merge';
import * as queryString from 'query-string';
import Qiwi from './qiwi';

export interface QiwiOptions {
  baseUrl?: string;
  headers?: { [key: string]: string };
}

export type Methods = 'GET' | 'POST';

export const defaultOptions = {
  baseUrl: 'https://edge.qiwi.com/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
};

export default class QiwiConnector {
  private apiKey: string;
  private options: QiwiOptions;

  constructor(apiKey: string, options?: QiwiOptions) {
    this.apiKey = apiKey;
    this.options = merge(defaultOptions, { headers: { 'Authorization': `Bearer ${apiKey}` } }, options)
  }

  /**
   * Execute query
   * @param {string} method
   * @param {string} endpoint
   * @param data - is object by default, used as query in case if GET, else as body
   * @param headers
   * @returns {Promise<void>}
   */
  async query(method: string, endpoint: string, data?: Object, headers?: { [key: string]: string }) {

    // Build URL
    let outUrl = this.options.baseUrl + endpoint;
    if (method === 'GET' && data) outUrl += '?' + queryString.stringify(data);

    // Build options
    const urlOptions: RequestInit = {
      method,
      headers: merge(this.options.headers, headers),
    };
    if (method !== 'GET') urlOptions.body = JSON.stringify(data);

    const response = await fetch(outUrl, urlOptions);
    try {
      const json = await response.json();
      if (response.status !== 200) {
        throw new QiwiError(
         response.status,
         json ? json.message : response.statusText,
         { json, response, urlOptions }
        );
      }

      return json;
    } catch (e) {
      if (e instanceof QiwiError) throw e; // If it was already throw

      throw new QiwiError(response.status, response.statusText, { response, urlOptions })
    }
  }
}

export interface Request {
  json?: any // This is a response
  response: Response
  urlOptions: RequestInit
}

export class QiwiError extends Error {
  public statusCode: number;
  public request: Request;
  private _message?: string;

  constructor(statusCode: number, message?: string, jsonRaw?: Request) {
    super();

    this.stack = (new Error()).stack;
    this.statusCode = statusCode;
    this.request = jsonRaw;
    this._message = message;
  }

  get message() {
    return this._message || this.request.json.userMessage || this.request.response.statusText;
  }

  get errorCode() {
    if (this.statusCode === 401) return 'unauthorized';
    if (this.statusCode === 423) return 'unavailable';

    if (this.request.json.errorCode) return this.request.json.errorCode;
  }
}