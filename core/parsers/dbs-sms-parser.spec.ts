import {parse} from "./dbs-sms-parser";
import {Transaction} from "../models";

describe('dbs-sms-parser', () => {
  describe('should parse DBS SMS', () => {
    const contentBody =
      'A card txn of SGD18.00 from DBS/POSB card ending 4800 ' +
      'to Grab* A-CCCCCCCC on 01 MAY 10:36 (SGT) was completed. ' +
      'If unauthorised, call +65⁭ 6339⁭6963';
    let parseResult: Transaction;

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
  });
});
