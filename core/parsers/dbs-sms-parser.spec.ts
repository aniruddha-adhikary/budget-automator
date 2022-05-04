import {parse} from "./dbs-sms-parser";
import {Transaction} from "../models";

describe('dbs-sms-parser', () => {
    describe('should parse DBS SMS', () => {
        const contentBody =
            'A card txn of SGD18.00 from DBS/POSB card ending 4800 ' +
            'to Grab* A-CCCCCCCC on 01 MAY 10:36 (SGT) was completed. ' +
            'If unauthorised, call +65⁭ 6339⁭6963';
        let parseResult: Partial<Transaction>;

        beforeEach(async () => {
            parseResult = await parse(contentBody);
        });

        it('should have the correct amount', () => {
            expect(parseResult).toHaveProperty('amount', 18.0);
        });

        it('should have the correct merchant details', () => {
            expect(parseResult).toHaveProperty(
                'merchantDetails',
                'Grab* A-CCCCCCCC',
            );
        });

        it('should have the correct currency', () => {
            expect(parseResult).toHaveProperty('currency', 'SGD');
        });

        it('should have the correct date', () => {
            expect(parseResult).toHaveProperty('date', new Date('2022-05-01 10:36:00 +08:00'));
        });

        it('should have the correct account ending', () => {
            expect(parseResult).toHaveProperty('accountEnding', '4800');
        });
    });
    describe('should parse PayNow SMS', () => {
        const contentBody =
            'Successful PayNow: S$1.10 from A/C ending 3885 to ' +
            'JURONG PROVISION SHOP (UEN ending 138X), 03 May 21:15 SGT. ' +
            'Call +65⁭6327⁭2265 if unauthorised';
        let parseResult: Partial<Transaction>;

        beforeEach(async () => {
            parseResult = await parse(contentBody);
        });

        it('should have the correct amount', () => {
            expect(parseResult).toHaveProperty('amount', 1.1);
        });

        it('should have the correct merchant details', () => {
            expect(parseResult).toHaveProperty(
                'merchantDetails',
                'JURONG PROVISION SHOP (UEN ending 138X)',
            );
        });

        it('should have the correct currency', () => {
            expect(parseResult).toHaveProperty('currency', 'SGD');
        });

        it('should have the correct date', () => {
            expect(parseResult).toHaveProperty('date', new Date('2022-05-03 21:15:00 +08:00'));
        });

        it('should have the correct account ending', () => {
            expect(parseResult).toHaveProperty('accountEnding', '3885');
        });
    });
    describe('should parse Scan and Pay SMS', () => {
        const contentBody =
            'A Scan and Pay txn of SGD3.20 from A/C ending 3885 to ' +
            'FUJI BAKERY on 30 Apr 15:41 (SGT) was completed. ' +
            'If unauthorised, call +65 63272265';

        let parseResult: Partial<Transaction>;

        beforeEach(async () => {
            parseResult = await parse(contentBody);
        });

        it('should have the correct amount', () => {
            expect(parseResult).toHaveProperty('amount', 3.2);
        });

        it('should have the correct merchant details', () => {
            expect(parseResult).toHaveProperty(
                'merchantDetails',
                'FUJI BAKERY',
            );
        });

        it('should have the correct currency', () => {
            expect(parseResult).toHaveProperty('currency', 'SGD');
        });

        it('should have the correct date', () => {
            expect(parseResult).toHaveProperty('date', new Date('2022-04-30 15:41:00 +08:00'));
        });

        it('should have the correct account ending', () => {
            expect(parseResult).toHaveProperty('accountEnding', '3885');
        });
    });
});
