const categories: Record<string, string> = {
    "convenience-food": "212e8b46-4d5b-4aa6-afe0-9a555b8c1f5f",
    "eating-out-food": "1042e817-2b86-42c8-889e-87ff7000b480",
    "food-delivery": "3a15bb43-b9b8-4863-be3c-c2370657a876",
    transportation: "212e8b46-4d5b-4aa6-afe0-9a555b8c1f5f",
    groceries: "193c6135-1cd2-480c-8ade-611070e6915f",
    givingsg: "d8e931ec-cabb-4dbd-803f-9de0b011a72d",
    gym: "d5427e1a-7572-424c-98bc-0c52c079a2e5",
    "apple-music": "a7a9c0df-2093-45be-b278-376402e9c757",
    icloud: "044349ce-9ef4-4317-b71d-57ba43340d64",
    "xbox-subscription": "f5dc41d7-e14f-4823-93ea-2a56b70b8c1b",
    "youtube-premium": "da056388-e460-4a2a-bef8-8affcf583d1a",
    "domains-hosting-and-cloud": "71bd0b26-1396-47f5-9287-fda4532ba548",
    "ynab-subscription": "71bd0b26-1396-47f5-9287-fda4532ba5487",
    electric: "085dd241-3682-4b7a-a1ca-9b3b0a2b5101",
    internet: "e1801e20-e076-42c8-addc-62f7da020f8c",
    cellphone: "0d1063f0-3329-417f-8006-bab0fbb62d80",
    "medical-bills": "0ca2aa7f-db65-41bd-b328-60fc01e1e62b",
    clothing: "4c0f6ffc-41ef-4a03-b18f-4b19e5f11caf",
};

const mapping: Record<string, RegExp[]> = {
    "convenience-food": [/esso/gi, /cheers/gi, /spc/gi, /7-?eleven/gi],
    "eating-out-food": [
        /burger king/gi, /wang/gi, /texas chicken/gi, /mcdonald/gi, /kfc/gi,
        /old chang kee/gi, /esarn/gi, /food ?court/gi, /stuff'd/gi, /wok hey/gi, /maki san/gi,
        /ramen keisuke/gi, /subway/gi, /pizza hut/gi, /pappa rich/gi, /popeyes/gi,
    ],
    "food-delivery": [/hanbaobao/gi, /foodpanda/gi],
    transportation: [/bus\/mrt/gi, /grab/gi, /gojek/gi, /uber/gi, /taxi/gi],
    groceries: [/ntuc/gi, /minimart/gi, /sheng siong/gi, /cold storage/gi, /fairprice/gi, /giant/gi],
    gym: [/body fit train/gi],
    "xbox-subscription": [/microsoft/g],
    "youtube-premium": [/youtube/gi],
    "domains-hosting-and-cloud": [/name.com/gi, /exonhost/gi],
    "ynab-subscription": [/youneedabudget/gi],
    electric: [/sp digital/gi],
    internet: [/starhub/gi],
    cellphone: [/circles/gi, /singtel/gi, /starhub/gi, /m1/gi, /gomo/gi],
    "medical-bills": [/unity/gi, /guardian/gi, /watson/gi],
    clothing: [/uniqlo/gi],
};


export function classify(merchantName?: string): string | null {
    if (!merchantName) return null;

    for (const categoryKey of Object.keys(mapping)) {
        for (const regexp of mapping[categoryKey]) {
            if (merchantName.search(regexp) !== -1) {
                return categories[categoryKey];
            }
        }
    }

    return null;
}