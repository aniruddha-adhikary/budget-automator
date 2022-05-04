import {Handler} from '@netlify/functions';
import {parse} from "../../core/parsers/dbs-sms-parser";
import {addTransaction} from "../../core/budgeting/ynab";
import {Transaction} from "../../core/models";
import {isAuthenticated} from "../../core/auth";

type RequestBody = {
    content?: string;
}

const handler: Handler = async (event, context) => {
    if (!isAuthenticated(event)) {
        throw new Error("Authorization Key not valid");
    }

    if (event.httpMethod !== 'POST') {
        throw new Error('Method not POST');
    }

    if (!event.body) {
        throw new Error('Body is empty');
    }

    const parsedBody = JSON.parse(event.body) as RequestBody;

    if (!parsedBody.content) {
        throw new Error('SMS content is empty');
    }

    const transaction = parse(parsedBody.content);

    if (
        transaction.merchantDetails &&
        typeof transaction.amount !== "undefined" &&
        transaction.date &&
        transaction.accountEnding &&
        transaction.currency
    )
        await addTransaction(transaction as Transaction);

    return {
        statusCode: 200,
        body: JSON.stringify({transaction}),
        headers: {
            'Content-Type': 'application/json',
        }
    }
}

export {handler};