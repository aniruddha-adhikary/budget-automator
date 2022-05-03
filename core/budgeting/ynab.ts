import * as ynab from "ynab";
import {Transaction} from "../models";
import {SaveTransaction} from "ynab/dist/api";

const accessToken = process.env.YNAB_PERSONAL_ACCESS_TOKEN;
const budgetId = process.env.YNAB_MY_BUDGET_ID;
const accounts: Record<string, string> = JSON.parse(process.env.YNAB_ACCOUNTS || 'null');
const endings: Record<string, string> = JSON.parse(process.env.YNAB_ENDINGS || 'null');

export async function determineAccount(transaction: Pick<Transaction, 'accountEnding'>, numberEndings = endings) {
    if (transaction.accountEnding && numberEndings[transaction.accountEnding]) {
        return numberEndings[transaction.accountEnding];
    }

    return 'DBS_CREDIT';
}

export async function addTransaction(nativeTrx: Transaction): Promise<void> {
    const accountId = accounts[await determineAccount(nativeTrx)];
    const outwardMultiplier = nativeTrx.type === 'Outwards' ? -1 : 1;

    const transaction: SaveTransaction = {
        amount: Math.floor(nativeTrx.amount * 1000 * outwardMultiplier),
        date: nativeTrx.date.toISOString(),
        account_id: accountId,
        memo: nativeTrx.merchantDetails,
    };

    if (!budgetId) {
        throw new Error('YNAB_MY_BUDGET_ID not found.')
    }

    if (!accessToken) {
        throw new Error('YNAB_PERSONAL_ACCESS_TOKEN not found.')
    }

    const ynabAPI = new ynab.API(accessToken);
    const response = await ynabAPI.transactions.createTransaction(budgetId, { transaction });

    console.info('Added Transaction', {transaction, response})
}