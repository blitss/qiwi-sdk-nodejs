const assert = require('assert');
const { token, phone } = require('./constants.json');

const Qiwi = require('../dist/index').Qiwi;

const qiwi = new Qiwi(token);

// Please note that tests will not pass until you not specified api token and your phone in ./constants.json
describe('Qiwi', function() {
    describe('#detectPhone', function() {
        it('should correctly detect isp', async function() {
            const result = await Qiwi.detectPhone(79173333333)

            return assert.equal(result, 1);
        });
    });

    describe('#getProfile', function() {
        it('should return profile', async function() {
            const result = await qiwi.getProfile();

            return assert(result.contractInfo.contractId, phone);
        });

        it('should return codes', async function() {
            try {
                await qiwi.getProfile({ contractInfoEnabled: 'not_boolean' });
            } catch (e) {
                return assert.equal(e.statusCode, 400);
            }
        });

        it('should return balance', async function() {
            const result = await qiwi.getBalance();

            return assert(result.accounts[0].balance.amount > -0.01)
        })
    });

    describe('#stats', function() {
        it('should return payment history', async function() {
            const payments = await qiwi.getPayments(phone);

            assert(payments.data);
        });

        it('should return total stats', async function() {
            const startDate = new Date();
            const endDate = new Date();

            startDate.setDate(startDate.getDate() - 7);

            const stats = await qiwi.getPaymentsStats(phone, {
                startDate,
                endDate
            });

            assert(stats.incomingTotal);

        })
    })
});
