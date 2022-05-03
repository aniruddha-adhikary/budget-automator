import * as ynab from "ynab";
import {Transaction} from "../models";
import {SaveTransaction} from "ynab/dist/api";

const accessToken = process.env.YNAB_PERSONAL_ACCESS_TOKEN;
const budgetId = process.env.YNAB_MY_BUDGET_ID;

if (!accessToken) {
    throw new Error('YNAB_PERSONAL_ACCESS_TOKEN not found.')
}

const ynabAPI = new ynab.API(accessToken);
const accounts: Record<string, string> = JSON.parse(process.env.YNAB_ACCOUNTS || '-');

export async function determineAccount(transaction: Transaction) {
    return accounts['DBS_CREDIT'];
}

export async function addTransaction(nativeTrx: Transaction): Promise<void> {
    const accountId = await determineAccount(nativeTrx);
    const outwardMultiplier = nativeTrx.type === 'Outwards' ? -1 : 1;

    const transaction: SaveTransaction = {
        amount: Math.floor(nativeTrx.amount * 10000 * outwardMultiplier),
        date: nativeTrx.date.toISOString(),
        account_id: accountId,
        memo: nativeTrx.merchantDetails,
    };

    if (!budgetId) {
        throw new Error('YNAB_MY_BUDGET_ID not found.')
    }

    const response = await ynabAPI.transactions.createTransaction(budgetId, { transaction });

    console.info('Added Transaction', {transaction, response})
}