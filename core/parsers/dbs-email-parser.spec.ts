import {parse} from "./dbs-email-parser";
import {Transaction} from "../models";

describe('dbs-email-parser', () => {
  describe('should parse PayNow SMS', () => {
    const contentBody =
        '\n' +
        'Transaction Ref: MB10312DDDDDDDD\n' +
        '\n' +
        '\n' +
        'Dear Sir / Madam,\n' +
        '\n' +
        '\n' +
        'We refer to your PayNow dated 01 May. We are pleased to confirm that the transaction was completed.\n' +
        '\n' +
        '\n' +
        'Date & Time:        04 May 16:09 (SGT)\n' +
        'Amount:             SGD4.80\n' +
        'From:               Salary A/C ending 3885\n' +
        'To:                 WOW COFFEE PTE. LTD. (UEN ending 470W)\n' +
        '\n' +
        '\n' +
        'If unauthorised, call +65 63272265. To view transaction details, please login to digibank.\n' +
        '\n' +
        'Thank you for banking with us.\n' +
        '\n' +
        '\n' +
        'Yours faithfully\n' +
        'DBS Bank Ltd\n' +
        '\n' +
        'Please do not reply to this email as it is auto-generated.\n';

    let parseResult: Partial<Transaction>;

    beforeEach(async () => {
      parseResult = await parse(contentBody);
    });

    it('should have the correct amount', () => {
      expect(parseResult).toHaveProperty('amount', 4.8);
    });

    it('should have the correct merchant details', () => {
      expect(parseResult).toHaveProperty(
        'merchantDetails',
        'WOW COFFEE PTE. LTD. (UEN ending 470W)',
      );
    });

    it('should have the correct currency', () => {
      expect(parseResult).toHaveProperty('currency', 'SGD');
    });

    it('should have the correct date', () => {
      expect(parseResult).toHaveProperty('date', new Date('2022-05-04 16:09:00 +08:00'));
    });

    it('should have the correct account ending', () => {
      expect(parseResult).toHaveProperty('accountEnding', '3885');
    });
  });
});
