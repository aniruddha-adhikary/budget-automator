import {Transaction, TransactionType} from '../models';
import {DateTime} from "luxon";

const matchers = [
    /An? (?<transactionType>.+) (txn )?of (?<currency>[A-Z]{3})(?<amount>[\d.]+) from (?<accountType>.+) ending (?<accountEnding>\d+) to (?<merchantDetails>.*) on (?<dateString>.*) was completed/i,
    /Successful PayNow: S\$(?<amount>[\d.]+) from A\/C ending (?<accountEnding>\d+) to (?<merchantDetails>.+), (?<dateString>.*)\./i
];

function parseDate(dateString: string) {
    const dateStringWithoutTz = dateString.replace(/ \(?SGT\)?/, '');
    return DateTime.fromFormat(dateStringWithoutTz, 'dd LLL HH:mm').toJSDate();
}

function getBestMatcher(contentBody: string): Record<string, string> | null {
    for (const matcher of matchers) {
        const localMatches = matcher.exec(contentBody)?.groups;

        if (localMatches) {
            return localMatches
        }
    }

    return null;
}

export function parse(contentBody: string): Partial<Transaction> {
    const matches = getBestMatcher(contentBody);

    if (!matches) {
        throw new Error('Message parsing failed');
    }

    const dateString = matches?.dateString;
    const date = dateString ? parseDate(dateString) : undefined;

    const result: Partial<Transaction> = {
        merchantDetails: matches?.merchantDetails,
        amount: parseFloat(matches?.amount || '0'),
        type: 'Outwards' as TransactionType,
        currency: matches?.currency || 'SGD',
        date,
        accountEnding: matches?.accountEnding
    };

    console.info('Parsed SMS', {result});

    return result;
}