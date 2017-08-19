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
  BalanceResponse, DoPaymentRequest
} from './types';

export default class Qiwi {
    private connector: QiwiConnector;

  /**
   * @param connector - could be QiwiConnector class or api key also
   */
    constructor(connector: QiwiConnector | string) {
      this.connector = typeof connector === 'string' ? new QiwiConnector(connector, {}) : connector;
    }

    getProfile(options?: ProfileOptions): Promise<ProfileResponse> {
      return this.connector.query('GET', 'person-profile/v1/profile/current', options)
    }

    getPayments(wallet: number, options?: PaymentsRequest): Promise<PaymentsResponse> {
      return this.connector.query('GET', `payment-history/v1/persons/${wallet}/payments`, options)
    }

    getPaymentsStats(wallet: number, options: StatsRequest): Promise<StatsResponse> {
      return this.connector.query('GET', `payment-history/v1/persons/${wallet}/payments/total`, options)
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
      const payment = Object.assign({}, {
        id: +new Date(),
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
          amount,
          currency: 643,
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
          amount,
          currency: 643,
        },
        fields: {
          account: phone.toString(),
        }
      })
    }

    static async detectPhone(phone): Promise<number | null> {
      const response = await fetch('https://qiwi.com/mobile/detect.action', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `phone=${phone}`
      });
      const json = await response.json();

      if (json.code.value === 0) return parseInt(json.message);
      else return null;
    }
}