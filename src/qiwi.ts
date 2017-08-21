import * as moment from 'moment';
import QiwiConnector from './connector';
import fetch from 'node-fetch';
import {
  ProfileOptions,
  ProfileResponse,
  PaymentsResponse,
  PaymentsRequest,
  StatsRequest,
  StatsResponse,
  FeeRequest,
  BalanceResponse,
  DoPaymentRequest
} from './types';

export const QIWI_DATE_FORMAT = 'YYYY-MM-DDThh:mm:ssZ'; // its really shit

export function formatDate(date: string | Date) {
  if (typeof date === 'string') return date; // it was already specified, no need to convert it
  return moment(date).format(QIWI_DATE_FORMAT);
}

export default class Qiwi {
    private connector: QiwiConnector;

  /**
   * @param connector - could be QiwiConnector class or api key also
   */
    constructor(connector: QiwiConnector | string) {
      if (!connector) throw new Error('You haven\'t specified api_token, go here and get one: https://qiwi.com/api');

      this.connector = typeof connector === 'string' ? new QiwiConnector(connector, {}) : connector;
    }

    getProfile(options?: ProfileOptions): Promise<ProfileResponse> {
      return this.connector.query('GET', 'person-profile/v1/profile/current', options)
    }

    getPayments(wallet: number, options?: PaymentsRequest): Promise<PaymentsResponse> {
      const defaultOptions = { rows: 25 };

      return this.connector.query('GET', `payment-history/v1/persons/${wallet}/payments`, Object.assign(defaultOptions, options))
    }

    getPaymentsStats(wallet: number, options: StatsRequest): Promise<StatsResponse> {
      const mergedOptions = Object.assign(options,{
        startDate: options.startDate ? formatDate(options.startDate) : moment().subtract('7', 'days').format(QIWI_DATE_FORMAT),
        endDate: options.endDate ? formatDate(options.endDate) : moment().format(QIWI_DATE_FORMAT),
      });

      return this.connector.query('GET', `payment-history/v1/persons/${wallet}/payments/total`, mergedOptions)
    }

    getBalance(): Promise<BalanceResponse> {
      return this.connector.query('GET', `funding-sources/v1/accounts/current`)
    }

    getFees(provider: number): Promise<any> {
      return this.connector.query('GET', `sinap/providers/${provider}/form`)
    }

    calculateFee(provider: number, options: FeeRequest): Promise<any> {
      return this.connector.query('POST', `sinap/providers/${provider}/onlineCommission`, options)
    }

    doPayment(provider: number, options: DoPaymentRequest): Promise<any> {
      const payment = Object.assign({
        id: (+new Date()).toString(),
        source: 'account_643',
        paymentMethod: {
          type: 'Account',
          accountId: '643',
        },
      }, options);

      return this.connector.query('POST', `sinap/terms/${provider}/payments`, payment)
    }

    sendToWallet(wallet: number, amount: number, comment?: string): Promise<any> {
      return this.doPayment(99, {
        sum: {
          amount: amount.toString(),
          currency: '643',
        },
        comment,
        fields: {
          account: wallet.toString(),
        }
      })
    }

    async payToPhone(phone: number, amount: number, provider?: number): Promise<any> {
      let isp = provider;
      if (!provider) {
        isp = await Qiwi.detectPhone(phone);

        if (!isp) throw new Error('ISP provider not recognized')
      }

      return this.doPayment(isp, {
        sum: {
          amount: amount.toString(),
          currency: '643',
        },
        fields: {
          account: phone.toString(),
        }
      })
    }

    static async detectPhone(phone): Promise<number | null> {
      const response = await fetch('https://qiwi.com/mobile/detect.action', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `phone=${phone}`
      });
      const json = await response.json();

      if (json.code.value === "0") return parseInt(json.message);
      else return null;
    }
}