export declare type Sources = 'QW_RUB' | 'QW_USD' | 'QW_EUR' | 'CARD' | 'MK';
export declare type PaymentInput = 'ALL' | 'IN' | 'OUT' | 'QIWI_CARD';
export interface ProfileOptions {
    authInfoEnabled?: boolean;
    contractInfoEnabled?: boolean;
    userInfoEnabled?: boolean;
}
export interface ProfileResponse {
    authInfo: {
        personId: number;
        registrationDate: string;
        boundEmail: string | null;
        ip: string;
        lastLoginDate: string;
        mobilePinInfo: {
            mobilePinUsed: boolean;
            lastMobilePinChange: string;
            nextMobilePinChange: string;
        };
        passInfo: {
            passwordUsed: boolean;
            lastPassChange: string;
            nextPassChange: string;
        };
        pinInfo: {
            pinUsed: boolean;
        };
    };
    contractInfo: {
        blocked: boolean;
        contractId: number;
        creationDate: string;
        features: Object[];
        identificationInfo: {
            bankAlias: string;
            identificationLevel: string;
        }[];
    };
    userInfo: {
        defaultPayCurrency: number;
        defaultPaySource: number;
        email: string | null;
        firstTxnId: number;
        language: string;
        operator: string;
        phoneHash: string;
        promoEnabled: string | boolean | null;
    };
}
export interface PaymentsResponse {
    data: any[];
    nextTxnId: number;
    nextTxnDate: string;
}
export interface PaymentsRequest {
    rows?: number;
    operation?: PaymentInput;
    sources?: Sources[];
    startDate?: Date;
    endDate?: Date;
    nextTxnDate?: Date;
    nextTxnId?: number;
}
export interface StatsRequest {
    startDate: string;
    endDate: string;
    operation?: PaymentInput;
    sources?: Sources[];
}
export interface StatsResponse {
    incomingTotal: {
        amount: number;
        currency: string;
    };
    outgoingTotal: {
        amount: number;
        currency: string;
    };
}
export interface BalanceResponse {
    accounts: any[];
}
export interface FeeRequest {
    account: string;
    paymentMethod: {
        type: string;
        accountId: string;
    };
    purchaseTotals: {
        total: {
            amount: number;
            currency: string;
        };
    };
}
export interface DoPaymentRequest {
    id?: string;
    sum: {
        amount: string;
        currency: '643';
    };
    source?: 'account_643';
    paymentMethod?: {
        type: 'Account';
        accountId: '643';
    };
    comment?: string;
    fields: {
        account: string;
    };
}
