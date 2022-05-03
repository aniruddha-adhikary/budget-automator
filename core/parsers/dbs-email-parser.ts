import {Transaction, TransactionType} from '../models';
import {DateTime} from "luxon";


const amountRegexp = /Amount:\s+(?<currency>[A-Z]{3})(?<amount>[\d.]+)/;
function parseAmount(contentBody: string): Pick<Transaction, 'amount'|'currency'> {
    const matches = amountRegexp.exec(contentBody)?.groups;

    if (!matches?.currency || !matches?.amount) {
        throw new Error('Amount parsing failed');
    }

    return {
        amount: parseFloat(matches.amount),
        currency: matches.currency
    };
}

const merchantRegexp = /To:\s+(?<merchantDetails>.+)/;
function parseMerchant(contentBody: string): Pick<Transaction, 'merchantDetails'> {
    const matches = merchantRegexp.exec(contentBody)?.groups;

    if (!matches?.merchantDetails) {
        throw new Error('Merchant parsing failed');
    }

    return {
        merchantDetails: matches.merchantDetails
    };
}

const accountRegexp = /From:\s+.+ ending (?<accountEnding>\d+)/;
function parseAccountEnding(contentBody: string): Pick<Transaction, 'accountEnding'> {
    const matches = accountRegexp.exec(contentBody)?.groups;

    if (!matches?.accountEnding) {
        throw new Error('Merchant parsing failed');
    }

    return {
        accountEnding: matches.accountEnding
    };
}

const dateRegexp = /Date & Time:\s+(?<dateString>.+)/;
function parseDate(contentBody: string): Pick<Transaction, 'date'> {
    const matches = dateRegexp.exec(contentBody)?.groups;

    if (!matches?.dateString) {
        throw new Error('Date parsing failed');
    }
    const dateStringWithoutTz = matches.dateString.replace(' (SGT)', '');

    return {
        date: DateTime.fromFormat(dateStringWithoutTz, 'dd LLL HH:mm').toJSDate(),
    };
}

export function parse(contentBody: string): Partial<Transaction> {
    if (contentBody.indexOf('We refer to your') < 0) {
        throw new Error('Cannot parse with PayNow/Scan and Pay Parser');
    }

    const result: Partial<Transaction> = {
        ...parseAmount(contentBody),
        ...parseMerchant(contentBody),
        ...parseDate(contentBody),
        ...parseAccountEnding(contentBody),
        type: 'Outwards' as TransactionType,
    };

    console.info('Parsed PayNow Email', {result});

    return result;
}