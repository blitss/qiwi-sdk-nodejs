"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const queryString = require("query-string");
exports.defaultOptions = {
    baseUrl: 'https://edge.qiwi.com/',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
};
class QiwiConnector {
    constructor(apiKey, options) {
        this.apiKey = apiKey;
        this.options = Object.assign(exports.defaultOptions, { 'Authorization': `Bearer ${apiKey}` }, options);
    }
    query(method, endpoint, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            let outUrl = method + endpoint;
            if (method === 'GET' && data)
                outUrl += '?' + queryString.stringify(data);
            const urlOptions = {
                method,
                headers: Object.assign(this.options, headers),
            };
            if (method !== 'GET')
                urlOptions.body = JSON.stringify(data);
            const response = yield node_fetch_1.default(outUrl, urlOptions);
            const json = yield response.json();
            if (response.status !== 200)
                throw new QiwiError(response.status, json ? json.message : '');
            return json;
        });
    }
}
exports.default = QiwiConnector;
class QiwiError extends Error {
    constructor(statusCode, message) {
        super();
        this.stack = (new Error()).stack;
        this.statusCode = statusCode;
        this.message = message || `${this.statusCode} error`;
    }
}
exports.QiwiError = QiwiError;
//# sourceMappingURL=connector.js.map