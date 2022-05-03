import {Transaction, TransactionType} from '../models';
import {DateTime} from "luxon";

const matcher =
    /A card txn of (?<currency>[A-Z]{3})(?<amount>[\d.]+) from DBS\/POSB card ending (?<accountEnding>\d+) to (?<merchantDetails>.*) on (?<dateString>.*) was completed.*/i;

function parseDate(dateString: string) {
    const dateStringWithoutTz = dateString.replace(' (SGT)', '');
    return DateTime.fromFormat(dateStringWithoutTz, 'dd LLL HH:mm').toJSDate();
}

export function parse(contentBody: string): Partial<Transaction> {
    const matches = matcher.exec(contentBody)?.groups;

    if (!matches) {
        throw new Error('Message parsing failed');
    }

    const dateString = matches?.dateString;
    const date = dateString ? parseDate(dateString) : undefined;

    const result: Partial<Transaction> = {
        merchantDetails: matches?.merchantDetails,
        amount: parseFloat(matches?.amount || '0'),
        type: 'Outwards' as TransactionType,
        currency: matches?.currency,
        date,
        accountEnding: matches?.accountEnding
    };

    console.info('Parsed SMS', {result});

    return result;
}