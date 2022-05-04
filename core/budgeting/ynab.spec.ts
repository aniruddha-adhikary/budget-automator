import {determineAccount} from "./ynab";

describe('determineAccount', () => {
    it('defaults to DBS_DEBIT', async () => {
        expect(await determineAccount({accountEnding: '3885'}, {'3886': 'DBS_DEBIT'})).toEqual('DBS_DEBIT');
    })

    it('returns correct config if configured', async () => {
        expect(await determineAccount({accountEnding: '3885'}, {'3885': 'DBS_DEBIT'})).toEqual('DBS_DEBIT');
    })
});