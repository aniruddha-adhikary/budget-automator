import { Handler } from '@netlify/functions';
import {parse} from "../../core/parsers/dbs-sms-parser";

type RequestBody = {
    content?: string;
}

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        throw new Error();
    }

    if (!event.body) {
        throw new Error();
    }

    const parsedBody = JSON.parse(event.body) as RequestBody;

    if (!parsedBody.content) {
        throw new Error();
    }

    const transaction = await parse(parsedBody.content);

    return {
        statusCode: 200,
        body: JSON.stringify({ transaction })
    }
}

export { handler };