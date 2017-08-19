# NodeJS Qiwi API SDK for Wallet
## Requirements

1. node-fetch === ^1.7.2
2. query-string === ^5.0.0

## Links

1. Qiwi API page: [Ru](https://developer.qiwi.com/ru/qiwicom/index.html)

## Getting started

### Installation

Simply run `npm install qiwi-wallet-sdk` or `yarn add qiwi-wallet-sdk`


### Payments from the Qiwi wallet

1. Obtain token here: https://qiwi.com/api
```javascript
import { Qiwi } from 'qiwi-wallet-sdk';

const qiwi = new Qiwi('api_token');
```
2. After that, you can, for example, pay to wallet:
```javascript
//                  wallet    amount   comment
qiwi.sendToWallet(7900000000, 200.43, 'Qiwi SDK is working!')
    .then(response => console.log(response.transaction.id))
    .catch(error => console.log(error.message);
```

## ☑ TODO
- [ ] Add all typings