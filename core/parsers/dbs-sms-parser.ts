import {Transaction} from '../models';
import {DateTime} from "luxon";

const matcher =
    /A card txn of (?<currency>[A-Z]{3})(?<amount>[\d.]+) from DBS\/POSB card ending 4800 to (?<merchantDetails>.*) on (?<dateString>.*) was completed.*/i;

function parseDate(dateString: string) {
    const dateStringWithoutTz = dateString.replace(' (SGT)', '');
    return DateTime.fromFormat(dateStringWithoutTz, 'dd LLL HH:mm').toJSDate();
}

export function parse(contentBody: string): Transaction {
    const matches = matcher.exec(contentBody)?.groups;

    if (!matches) {
        throw new Error('Message parsing failed');
    }

    const dateString = matches?.dateString;
    const date = dateString ? parseDate(dateString) : null;

    return {
        merchantDetails: matches?.merchantDetails || null,
        amount: parseFloat(matches?.amount || '0') || null,
        type: 'Outwards',
        currency: matches?.currency || null,
        date,
    };
}