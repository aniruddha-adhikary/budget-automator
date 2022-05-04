import {HandlerEvent} from '@netlify/functions';

export function isAuthenticated(event: HandlerEvent) {
    return event.headers.authorization === process.env.API_KEY;
}
