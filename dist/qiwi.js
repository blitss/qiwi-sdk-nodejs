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
const connector_1 = require("./connector");
const node_fetch_1 = require("node-fetch");
class Qiwi {
    constructor(connector) {
        this.connector = typeof connector === 'string' ? new connector_1.default(connector) : connector;
    }
    getProfile(options) {
        return this.connector.query('GET', 'person-profile/v1/profile/current', options);
    }
    getPayments(wallet, options) {
        return this.connector.query('GET', `payment-history/v1/persons/${wallet}/payments`, options);
    }
    getPaymentsStats(wallet, options) {
        return this.connector.query('GET', `payment-history/v1/persons/${wallet}/payments/total`, options);
    }
    getBalance() {
        return this.connector.query('GET', `funding-sources/v1/accounts/current`);
    }
    getFees(provider) {
        return this.connector.query('GET', `sinap/providers/${provider}/form`);
    }
    calculateFee(provider, options) {
        return this.connector.query('POST', `sinap/providers/${provider}/onlineCommission`, options);
    }
    doPayment(provider, options) {
        const payment = Object.assign({}, {
            id: +new Date(),
            source: 'account_643',
            paymentMethod: {
                type: 'Account',
                accountId: '643',
            },
        }, options);
        return this.connector.query('POST', `sinap/terms/${provider}/payments`, payment);
    }
    sendToWallet(wallet, amount, comment) {
        return this.doPayment(99, {
            sum: {
                amount,
                currency: 643,
            },
            comment,
            fields: {
                account: wallet.toString(),
            }
        });
    }
    payToPhone(phone, amount, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            let isp = provider;
            if (!provider) {
                isp = yield Qiwi.detectPhone(phone);
                if (!isp)
                    throw new Error('ISP provider not recognized');
            }
            return this.doPayment(isp, {
                sum: {
                    amount,
                    currency: 643,
                },
                fields: {
                    account: phone.toString(),
                }
            });
        });
    }
    static detectPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield node_fetch_1.default('https://qiwi.com/mobile/detect.action', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `phone=${phone}`
            });
            const json = yield response.json();
            if (json.code.value === 0)
                return parseInt(json.message);
            else
                return null;
        });
    }
}
exports.default = Qiwi;
//# sourceMappingURL=qiwi.js.map