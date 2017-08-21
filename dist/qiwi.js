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
const moment = require("moment");
const connector_1 = require("./connector");
const node_fetch_1 = require("node-fetch");
exports.QIWI_DATE_FORMAT = 'YYYY-MM-DDThh:mm:ssZ';
function formatDate(date) {
    if (typeof date === 'string')
        return date;
    return moment(date).format(exports.QIWI_DATE_FORMAT);
}
exports.formatDate = formatDate;
class Qiwi {
    constructor(connector) {
        if (!connector)
            throw new Error('You haven\'t specified api_token, go here and get one: https://qiwi.com/api');
        this.connector = typeof connector === 'string' ? new connector_1.default(connector, {}) : connector;
    }
    getProfile(options) {
        return this.connector.query('GET', 'person-profile/v1/profile/current', options);
    }
    getPayments(wallet, options) {
        const defaultOptions = { rows: 25 };
        return this.connector.query('GET', `payment-history/v1/persons/${wallet}/payments`, Object.assign(defaultOptions, options));
    }
    getPaymentsStats(wallet, options) {
        const mergedOptions = Object.assign(options, {
            startDate: options.startDate ? formatDate(options.startDate) : moment().subtract('7', 'days').format(exports.QIWI_DATE_FORMAT),
            endDate: options.endDate ? formatDate(options.endDate) : moment().format(exports.QIWI_DATE_FORMAT),
        });
        return this.connector.query('GET', `payment-history/v1/persons/${wallet}/payments/total`, mergedOptions);
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
        const payment = Object.assign({
            id: (+new Date()).toString(),
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
                amount: amount.toString(),
                currency: '643',
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
                    amount: amount.toString(),
                    currency: '643',
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
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `phone=${phone}`
            });
            const json = yield response.json();
            if (json.code.value === "0")
                return parseInt(json.message);
            else
                return null;
        });
    }
}
exports.default = Qiwi;
//# sourceMappingURL=qiwi.js.map