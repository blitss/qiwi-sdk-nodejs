import QiwiConnector from './connector';
import { ProfileOptions, ProfileResponse, PaymentsResponse, PaymentsRequest, StatsRequest, StatsResponse, FeeRequest, BalanceResponse, DoPaymentRequest } from './types';
export default class Qiwi {
    private connector;
    constructor(connector: QiwiConnector | string);
    getProfile(options?: ProfileOptions): Promise<ProfileResponse>;
    getPayments(wallet: number, options?: PaymentsRequest): Promise<PaymentsResponse>;
    getPaymentsStats(wallet: number, options: StatsRequest): Promise<StatsResponse>;
    getBalance(): Promise<BalanceResponse>;
    getFees(provider: number): Promise<any>;
    calculateFee(provider: number, options: FeeRequest): Promise<any>;
    doPayment(provider: number, options: DoPaymentRequest): Promise<any>;
    sendToWallet(wallet: number, amount: number, comment?: string): Promise<any>;
    payToPhone(phone: number, amount: number, provider?: number): Promise<any>;
    static detectPhone(phone: any): Promise<number | null>;
}
