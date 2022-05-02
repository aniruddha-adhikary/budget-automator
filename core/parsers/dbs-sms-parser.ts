import {Transaction} from '../models';

const matcher =
    /A card txn of (?<currency>[A-Z]{3})(?<amount>[\d.]+) from DBS\/POSB card ending 4800 to (?<merchantDetails>.*) on (?<dateString>.*) was completed.*/gi;

export async function parse(contentBody: string): Promise<Transaction> {
    const matches = matcher.exec(contentBody)?.groups;

    if (!matches) {
        throw new Error('Message parsing failed');
    }

    return {
        merchantDetails: matches?.merchantDetails || null,
        amount: parseFloat(matches?.amount || '0') || null,
        type: 'Outwards',
        currency: matches?.currency || null,
        date: new Date(),
    };
}