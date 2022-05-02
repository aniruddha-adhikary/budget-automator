import { Handler } from '@netlify/functions';
import {parse} from "../../core/parsers/dbs-sms-parser";

type RequestBody = {
    content?: string;
}

const handler: Handler = async (event, context) => {
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

    return {
        statusCode: 200,
        body: JSON.stringify({ transaction }),
        headers: {
            'Content-Type': 'application/json',
        }
    }
}

export { handler };