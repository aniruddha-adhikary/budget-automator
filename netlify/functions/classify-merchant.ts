import {Handler} from '@netlify/functions';
import {isAuthenticated} from "../../core/auth";
import {Event} from "@netlify/functions/dist/function/event";
import {Context} from "@netlify/functions/dist/function/context";
import {classify} from "../../core/classifier/transaction-classifier";

type RequestBody = {
    merchantName?: string;
}

const handler: Handler = async (event: Event, context: Context) => {
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

    if (!parsedBody.merchantName) {
        throw new Error('merchantName is empty');
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            merchantName: parsedBody.merchantName,
            category: classify(parsedBody.merchantName),
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    }
}

export { handler };