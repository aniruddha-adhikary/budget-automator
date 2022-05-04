# Budget Automator

Integrates You Need A Budget (YNAB) with DBS Bank via SMS Forwarding.

## Installation
1. Copy `.env.example` to `.env` and populate the values.
    * `YNAB_PERSONAL_ACCESS_TOKEN` - Generate from https://api.youneedabudget.com/#personal-access-tokens
    * `YNAB_MY_BUDGET_ID` - Your Budget ID. Use `GET /budgets` to find your UUID.
    * `YNAB_ACCOUNTS` - Setup Aliases for YNAB Account IDs. Use `GET /budgets/{id}/accounts`.
    * `YNAB_ENDINGS` - Map last 4 digits of A/C number and/or card to the previously setup aliases.
    * `API_KEY` - Randomly generated API key / Password.
2. Deploy to [Netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/).
3. Test.

```http request
POST /.netlify/functions/parse-sms
Content-Type: application/json

{
    "content": "A card txn of SGD5.14 from DBS/POSB card ending 0045 to BUS/MRT on 02 MAY 06:54 (SGT) was completed. If unauthorised, call +65⁭ 6339⁭6963"
}
```
```json
{
    "transaction": {
        "merchantDetails": "BUS/MRT",
        "amount": 5.14,
        "type": "Outwards",
        "currency": "SGD",
        "date": "2022-05-02T06:54:00.000Z",
        "accountEnding": "0045"
    }
}
```

## Setting up SMS Forwarding
![IMG_0115](https://user-images.githubusercontent.com/932949/166720632-3e411990-6c79-4663-a74f-9009d32ff470.jpg)
